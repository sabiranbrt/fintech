/* eslint-disable @typescript-eslint/no-explicit-any */
import { DynamicRequest } from "@/types";
import { encryptBody, encryptKey, generateAESKey, generateIV } from "@/utils/encrypt";
import Axios, { AxiosError, AxiosRequestConfig, type AxiosResponse } from "axios";

const headers = {} as any

export const generateRandom13DigitNumber = () => {
    return Math.floor(Math.random() * 9000000000000) + 1000000000000;
};

const url = import.meta.env.VITE_API_BASE_URL

// Configure base URL
export const axiosInstance = Axios.create({
    baseURL: url,
    headers: {
        ...headers,
        "Content-Type": "application/json",
    }
})

axiosInstance.interceptors.request.use(
    function (config) {
        config.headers = config.headers || {};
        config.headers.includeUrn = true;

        const authToken = localStorage.getItem("authToken");
        if (authToken) {
            config.headers.authtoken = authToken;
        }

        if (config.headers.includeUrn) {
            const urn = generateRandom13DigitNumber().toString();
            config.headers.urn = urn;
        }
        delete config.headers.includeUrn;

        if ((config.method === "post" || config.method === "put") && config.data) {
            try {
                const originalPayload = config.data;
                const aesKey = generateAESKey();
                const iv = generateIV(aesKey);
                const reqBody = {
                    encryptedKey: encryptKey(aesKey, import.meta.env.VITE_RSA_PUBLIC_KEY),
                    encryptedBody: encryptBody(
                        JSON.stringify(originalPayload),
                        aesKey,
                        iv
                    ),
                };
                config.data = reqBody;
            } catch (error) {
                console.error("Error encrypting request data:", error);
                return Promise.reject(error);
            }
        }

        return config;
    },
    function (error) {
        return Promise.reject(error);
    }
);

export const fetchDynamic = async <T = unknown>(
    req: DynamicRequest,
): Promise<T> => {
    const { url, method, params, headers, data, responseType } = req;

    const res = await axiosInstance.request<T>({
        url,
        method,
        params: method === 'GET' ? params : undefined, // GET → query‑string
        data: method !== 'GET' ? data ?? params : undefined, // others → body
        headers: { ...headers, ...(req.headers ?? {}) }, responseType: responseType ?? "json",
    });

    return res.data;
}

export const request = async <T>(request: AxiosRequestConfig): Promise<T> => {
    try {
        const res: AxiosResponse<any> = await axiosInstance.request(request);
        return res.data;
    } catch (err) {
        throw new ApiError(err as AxiosError);
    }
};

export class ApiError extends AxiosError {
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

