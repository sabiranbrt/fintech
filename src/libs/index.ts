/* eslint-disable @typescript-eslint/no-explicit-any */
import { request } from "./axios"

export const getService = () => {
    return request<any>({
        url: "data",
        method: "GET",
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