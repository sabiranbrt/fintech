/* eslint-disable @typescript-eslint/no-explicit-any */
import Axios, { AxiosError, type AxiosRequestConfig, type AxiosResponse } from "axios";


const headers = {} as any

export const generateRandom13DigitNumber = () => {
    return Math.floor(Math.random() * 9000000000000) + 1000000000000;
};

const url = import.meta.env.VITE_API_BASE_URL

// Configure base URL
const axios = Axios.create({
    baseURL: url,
    headers: {
        ...headers,
        "Content-Type": "application/json",
    }
})


axios.interceptors.request.use(
    async (config: any) => {
        // ✅ Add token to headers
        const token = localStorage.getItem("token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        if (config.headers.includeUrn) {
            const urn = generateRandom13DigitNumber().toString();
            config.headers.urn = urn;
        }
        delete config.headers.includeUrn;
        return config;
    },
    error => Promise.reject(error)
);


export const request = async <T>(request: AxiosRequestConfig): Promise<T> => {
    try {
        const res: AxiosResponse<any> = await axios.request(request);


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

