/* eslint-disable @typescript-eslint/no-explicit-any */
import { getAgent, getAgentAccount, getContact, getCount, getPennyDrop, getRecentTransaction, getService, getTransaction } from "@/libs"
import { axiosInstance, generateRandom13DigitNumber } from "@/libs/axios"
import { ChargeInfoProps, TransactionsProps } from "@/types"
import interceptor from "@/utils/services/interceptor"
import { useMutation, useQuery } from "@tanstack/react-query"
import axios from "axios"

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

export const useDigiTokenLazy = () => {
    return useQuery({
        queryKey: ["DIGI_TOKEN"],
        queryFn: async () => {
            const response = await axios.get(
                "https://edge.finkeda.com/apigateway/authToken",
                {
                    headers: {
                        Authorization: import.meta.env.VITE_AUTHORIZATION,
                        id: import.meta.env.VITE_TOKEN_ID,
                    },
                }
            );
            return response.data;
        },
        enabled: false,
        refetchOnWindowFocus: false,
    });
};

export const useAadhaarRegistrationBeneLazy = (
    digiToken?: string,
    beneMobileKyc?: string
) => {
    return useQuery({
        queryKey: ["AADHAAR_REGISTRATION_TOKEN", digiToken, beneMobileKyc],
        queryFn: async () => {
            const response = await axios.get(
                "https://edge.finkeda.com/apigateway/fkKyc/kyc/digilocker/createDigiUrl",
                {
                    headers: {
                        urn: generateRandom13DigitNumber(),
                        authToken: digiToken!,
                        mobile: beneMobileKyc!,
                        redirectionUrl: import.meta.env.VITE_REDIRECTION_URL,
                    },
                }
            );
            return response.data;
        },
        enabled: false,
        refetchOnWindowFocus: false,
    });
};

export const useDigiData = () => {
    return useMutation({
        mutationFn: async ({ digiToken, requestId, beneMobileKyc }: any) => {
            const headers = {
                urn: generateRandom13DigitNumber(),
                authToken: digiToken,
                requestId: requestId,
                mobile: beneMobileKyc,
            };

            const response = await axios.post(
                "https://edge.finkeda.com/apigateway/fkKyc/kyc/digilocker/getDigiData",
                {},
                { headers }
            );
            return response.data;
        },
        onError: (error) => {
            console.error("DigiData error:", error);
        },
        onSuccess: (data) => {
            console.log("DigiData success:", data);
        },
    });
};

export const useChargeInfo = () => {
    const query = useMutation({
        mutationFn: (data: ChargeInfoProps) => {
            return interceptor().post("loadViaPg/getChargeInfo", {
                amount: data.amount,
                selectedCardType: data.selectedCardType,
                selectedGateway: data.selectedGateway
            })
        },
        onError: (error) => {
            console.log("error", error)
        },

        onSuccess: (response) => {
            const data = response
            console.log("data", data)
            console.log("query", query)
        },
    })
    return query
}

export const useSlabViaPG = (cardType: string) => {
    const authToken = localStorage.getItem("digiToken");
    const slab = useQuery({
        queryKey: ['SLAB_LIST', cardType],
        queryFn: async () => {
            const response = await axios.get(
                "https://edgeuat.finkeda.com/apigateway/lwdmw/lwmw/api/v1/loadViaPg/getSlab",
                {
                    headers: {
                        urn: generateRandom13DigitNumber(),
                        authtoken: authToken
                    },
                    params: {
                        cardType: cardType
                    }
                },
            );
            return response.data;
        },
        enabled: !!cardType,
    })
    return slab
}

export const useAgent = () => {
    const agent = useQuery({
        queryKey: ['AGENT_LIST'],
        queryFn: getAgent
    })
    return agent
}