/* eslint-disable @typescript-eslint/no-explicit-any */
import { request } from "./axios"

export const getService = () => {
    return request<any>({
        url: "data",
        method: "GET",
    })
}
