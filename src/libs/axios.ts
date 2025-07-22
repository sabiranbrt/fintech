/* eslint-disable @typescript-eslint/no-explicit-any */
import { DynamicRequest } from "@/types";
import { encryptBody, encryptKey, generateAESKey, generateIV } from "@/utils/encrypt";
import Axios, { AxiosError, AxiosRequestConfig, type AxiosResponse } from "axios";
import { ShowSwalMsg } from "../utils/services/swal";
import { generateBearerData } from "@/utils/services/bearerData";
import { encryptWithKey } from "@/utils/encryption/aes";
import { encryptSha } from "@/utils/encryption/sha";

const headers = {} as any

export const generateRandom13DigitNumber = () => {
    return Math.floor(Math.random() * 9000000000000) + 1000000000000;
};

// const url = import.meta.env.VITE_API_BASE_URL

const getBaseURL = (page_type?: string) => {
    if (page_type === "file_upload") return import.meta.env.VITE_FILE_API_URL;
    if (page_type === "lw") return import.meta.env.VITE_API_BASE_URL_LW;
    if (page_type === "digi_auth_url") return import.meta.env.VITE_DIGI_AUTH_URL;
    return import.meta.env.VITE_API_BASE_URL;
};

// Configure base URL
export const createAxiosInstance = (page_type?: string) => {
    const axiosInstance = Axios.create({
        baseURL: getBaseURL(page_type),
        headers: {
            ...headers,
            "Content-Type": "application/json",
        },
    });

    axiosInstance.interceptors.request.use(
        async (config: TODO) => {
            config.headers = config.headers || {};

            // Add a flag to indicate we want an urn header
            config.headers.includeUrn = true;
            // Basic headers and flags
            const authToken = localStorage.getItem("authToken");
            const agentId = localStorage.getItem("agentId");
            const sessionAuthToken = localStorage.getItem("sessionAuthToken");

            config.headers["agentId"] = agentId ?? "";
            config.headers["clientId"] = import.meta.env.VITE_CLIENT_ID;
            config.headers["counterid"] = 0;

            // if (authToken) {
            //     config.headers.authtoken = authToken;
            // }

            // Add authToken unless explicitly skipped
            if (!config.skipAuthToken && authToken) {
                config.headers["authToken"] = authToken;
            }

            // Add session bearer token if requested
            if (config.sendSessionToken && sessionAuthToken) {
                config.headers["Authorization"] = `Bearer ${sessionAuthToken}`;
            }

            // Add URN header if includeUrn flag is set
            if (config.headers.includeUrn) {
                const urn = generateRandom13DigitNumber().toString();
                config.headers.urn = urn;
            }
            delete config.headers.includeUrn; // Clean up flag so it won't be sent

            // Add bearerData asynchronously
            try {
                const bearerData = await generateBearerData();
                config.headers["bearerData"] = bearerData.bearerData;
            } catch (error) {
                console.error("Error fetching bearerData:", error);
                // optionally continue without bearerData
            }

            // Encrypt data if POST or PUT and not skipped
            if (
                (config.method === "post" || config.method === "put") &&
                config.data &&
                !config.skipEncryption
            ) {
                try {
                    let reqBody;
                    if (config.sendSessionToken) {
                        // Session token encryption (async)
                        const encrypted = await encryptWithKey(JSON.stringify(config.data));
                        const encryptedKeyBase64 = encryptSha(encrypted.key);

                        reqBody = {
                            data: encrypted.data,
                            key: encryptedKeyBase64,
                        };
                    } else {
                        // Default RSA-AES encryption
                        const originalPayload = config.data;
                        const aesKey = generateAESKey();
                        const iv = generateIV(aesKey);

                        reqBody = {
                            encryptedKey: encryptKey(aesKey, import.meta.env.VITE_RSA_PUBLIC_KEY),
                            encryptedBody: encryptBody(JSON.stringify(originalPayload), aesKey, iv),
                        };
                    }

                    config.data = reqBody;
                } catch (error) {
                    console.error("Error encrypting request data:", error);
                    return Promise.reject(error);
                }
            }
            return config;
        },
        (error) => {
            return Promise.reject(error);
        }
    );

    const fetchDynamic = async <T = unknown>(
        req: DynamicRequest,
    ): Promise<T> => {
        const { url, method, params, headers, data, responseType, page_type } = req;
        const { axiosInstance } = createAxiosInstance(page_type);
        const res = await axiosInstance.request<T>({
            url,
            method,
            params: method === 'GET' ? params : undefined, // GET → query‑string
            data: method !== 'GET' ? data ?? params : undefined, // others → body
            headers: { ...headers, ...(req.headers ?? {}) }, responseType: responseType ?? "json",
        });

        return res.data;
    }

    const request = async <T>(request: AxiosRequestConfig): Promise<T> => {
        try {
            const res: AxiosResponse<any> = await axiosInstance.request(request);
            return res.data;
        } catch (err) {
            throw new ApiError(err as AxiosError);
        }
    };

    // Response Interceptor
    axiosInstance.interceptors.response.use(
        (response: AxiosResponse) => {
            const res = response.data?.apiResponseData;
            if (
                res?.responseCode === "403" &&
                res?.responseMessage?.toLowerCase().includes("expire")
            ) {
                setTimeout(() => {
                    window.location.href = import.meta.env.VITE_V1_URL;
                }, 4000);
            }
            return response;
        },
        (error: AxiosError) => {
            ShowSwalMsg("error", error.message);
            return Promise.reject(error);
        }
    );

    class ApiError extends AxiosError {
        errorMessage: string | null;
        error: string | null;
        override response: AxiosResponse | undefined;

        constructor(err: AxiosError | { message: string; code?: string; config?: any; request?: any; response?: AxiosResponse }) {
            super(err.message, err.code, err.config, err.request, err.response);
            this.response = err.response;
            this.status = err.response?.status;
            this.message = err.message;
            this.errorMessage = this.getErrorMessage(err.response);
            this.error = err.response?.data?.error ?? null;
        }

        getErrorMessage = (response: any): string => {
            if (!response || !response.data) return "Unknown error";
            const topLevelMsg = response.data.apiResponseMessage;
            const nestedMsg = response.data.apiResponseData?.responseMessage;
            const fallbackMsg = response.data.message;
            return topLevelMsg || nestedMsg || fallbackMsg || "Unknown error";
        };
    }
    return { axiosInstance, fetchDynamic, request }
}

export const { axiosInstance, request, fetchDynamic } = createAxiosInstance();