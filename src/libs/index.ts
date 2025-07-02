/* eslint-disable @typescript-eslint/no-explicit-any */
import { ChargeInfoProps, PanProps } from "@/types"
import { request } from "./axios"

export const getService = () => {
    return request<any>({
        url: "data",
        method: "GET",
    })
}
export const getBalance = () => {
    return request<any>({
        url: "/api/v1/balance",
        method: "GET",
    })
}

export const getChargeInfo = (body: ChargeInfoProps) => {
    return request<any>({
        url: "/api/v1/loadViaPg/getChargeInfo",
        method: "POST",
        data: body
    })
}

export const getPan = (body: PanProps) => {
    return request<any>({
        url: "/api/v1/pan",
        method: "POST",
        data: body
    })
}
