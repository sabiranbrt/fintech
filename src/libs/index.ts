/* eslint-disable @typescript-eslint/no-explicit-any */
import { AgentAccountProps, PennyDropIProps, TransactionsProps } from "@/types"
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
export const getRecentTransaction = () => {
    return request<any>({
        url: "/api/v1/transaction/recent",
        method: "GET"
    })
}
export const getTransaction = (body:TransactionsProps) => {
    return request<any>({
        url: "/api/v1/transaction",
        method: "GET",
        params: body
    })
}
export const getCount = () => {
    return request<any>({
        url: "/api/v1/transaction/count",
        method: "GET"
    })
}

export const getContact = () => {
    return request<any>({
        url: "/api/v1/agent/relationship-manager/get",
        method: "GET"
    })
}
