/* eslint-disable @typescript-eslint/no-explicit-any */
import { request } from "@/libs/axios"

export const getCustomApi = () => {
    return request<any>({
        url: "data",
        method: "GET",
        headers: {
            includeUrn: true,
        }
    })
}