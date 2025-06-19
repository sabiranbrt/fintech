import { getAgentAccount, getPennyDrop, getService } from "@/libs"
import { axiosInstance } from "@/libs/axios"
import { useMutation, useQuery } from "@tanstack/react-query"

export const useServicesList = () => {
    const serviceList = useQuery({
        queryKey: ['SERVICE_LIST'],
        queryFn: getService,
    })
    return serviceList
}

export const usePennyDrop = () => {
    const query = useMutation({
        mutationFn: getPennyDrop,
        onError: (error) => {
            console.log("error", error)
        },

        onSuccess: (response) => {
            const data = response
            console.log("data", data)
        },
    })
    return query
}

export const useAgentAccount = () => {
    const query = useMutation({
        mutationFn: getAgentAccount,
        onError: (error) => {
            console.log("error", error)
        },

        onSuccess: (response) => {
            const data = response
            console.log("data", data)
        },
    })
    return query
}

export const useAuthToken = () => {
    const token = useQuery({
        queryKey: ['AUTH_TOKEN'],
        queryFn: async () => {
            const response = await axiosInstance.get(
                "https://edgeuat.finkeda.com/apigateway/fnkdBillPayments/paymentToken",
                {
                    headers: {
                        Authorization: "Basic Zmlua0JpbGxQYXk6RiFpbmskI0JpbGxQYXk=",
                        scope: 'dmt',
                        agentId: "9241980104198913",
                    },
                }
            );
            return response.data;
        },
    });

    return token;
};