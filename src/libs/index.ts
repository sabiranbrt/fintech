/* eslint-disable @typescript-eslint/no-explicit-any */
import { AgentAccountProps, PennyDropIProps } from "@/types"
import { request } from "./axios"

export const getService = () => {
    return request<any>({
        url: "data",
        method: "GET",
    })
}

export const getPennyDrop = (body: PennyDropIProps) => {
    return request<any>({
        url: "/api/v1/penny-drop",
        method: "POST",
        data: body
    })
}

export const getAgentAccount = (body: AgentAccountProps) => {
    return request<any>({
        url: "/api/v1/agent/account",
        method: "POST",
        data: body
    })
}

export const getAuthToken = () => {
    return request<any>({
        url: "https://edgeuat.finkeda.com/apigateway/fnkdBillPayments/paymentToken",
        method: "GET",
        headers: {
            authorization: "Basic Zmlua0JpbGxQYXk6RiFpbmskI0JpbGxQYXk",
            id: "9241980104198913"
        }
    })
}