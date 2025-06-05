/* eslint-disable @typescript-eslint/no-explicit-any */
import { request } from "./axios"

export const getFormList = () => {
    return request<any>({
        url: "data",
        method: "GET",
        headers: {
            includeUrn: true,
        }
    })
}
