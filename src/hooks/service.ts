import { getService } from "@/libs"
import { axiosInstance } from "@/libs/axios"
import { useQuery } from "@tanstack/react-query"

export const useServicesList = () => {
    const serviceList = useQuery({
        queryKey: ['SERVICE_LIST'],
        queryFn: getService,
    })
    return serviceList
}


export const useAuthToken = () => {
    const token = useQuery({
        queryKey: ['AUTH_TOKEN'],
        queryFn: async () => {
            const response = await axiosInstance.get(
                "https://edgeuat.finkeda.com/apigateway/fnkdBillPayments/paymentToken",
                {
                    headers: {
                        Authorization:"Basic Zmlua0JpbGxQYXk6RiFpbmskI0JpbGxQYXk=",
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