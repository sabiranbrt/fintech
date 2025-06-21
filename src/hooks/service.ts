import { getAgentAccount, getContact, getCount, getPennyDrop, getRecentTransaction, getService, getTransaction } from "@/libs"
import { axiosInstance } from "@/libs/axios"
import { TransactionsProps } from "@/types"
import { useMutation, useQuery } from "@tanstack/react-query"

export const useServicesList = () => {
    const serviceList = useQuery({
        queryKey: ['SERVICE_LIST'],
        queryFn: getService,
    })
    return serviceList
}

export const useCount = () => {
    const count = useQuery({
        queryKey: ['COUNT_LIST'],
        queryFn: getCount,
    })
    return count
}

export const useContact = () => {
    const contact = useQuery({
        queryKey: ['CONTACT_LIST'],
        queryFn: getContact,
    })
    return contact
}

export const useRecentTransaction = () => {
    const recentTransaction = useQuery({
        queryKey: ['RECENT_TRANSACTION'],
        queryFn: getRecentTransaction,
    })
    return recentTransaction
}

export const useTransaction = (data: TransactionsProps) => {
    const detailTransaction = useQuery({
        queryKey: ['DETAIL_TRANSACTION', data.fromDate, data.toDate, data.pageIndex],
        queryFn: () => getTransaction({ fromDate: data.fromDate, toDate: data.toDate, pageIndex: data.pageIndex, pageSize: data.pageSize }),

    })

    return detailTransaction
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

export const useDigiToken = ({ enabled = true } = {}) => {
    const digiToken = useQuery({
        queryKey: ['DIGI_TOKEN'],
        queryFn: async () => {
            const response = await axiosInstance.get(
                "https://edge.finkeda.com/apigateway/authToken",
                {
                    headers: {
                        Authorization: "Basic ZmtLeWNVc2VyOkt5Y0Bmbmsh",
                        agentId: "66d22350c0761adeb1334193",
                    },
                }
            );
            return response.data;
        },
        enabled
    });

    return digiToken;
};