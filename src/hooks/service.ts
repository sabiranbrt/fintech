import { getBalance, getPan, getService } from "@/libs"
import { axiosInstance, generateRandom13DigitNumber } from "@/libs/axios"
import { ChargeInfoProps, RequestBody } from "@/types"
import EncrptionInterceptor from "@/utils/encryptionInterceptor"
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

export const useBalance = () => {
    const balanceList = useQuery({
        queryKey: ['BALANCE_LIST'],
        queryFn: getBalance,
    })
    return balanceList
}

export const useAuthToken = () => {
    const agentId = localStorage.getItem('userId')
    const token = useQuery({
        queryKey: ['AUTH_TOKEN'],
        queryFn: async () => {
            const response = await axiosInstance.get(
                "https://edgeuat.finkeda.com/apigateway/fnkdBillPayments/paymentToken",
                {
                    headers: {
                        Authorization: "Basic Zmlua0JpbGxQYXk6RiFpbmskI0JpbGxQYXk=",
                        scope: 'dmt',
                        agentId: agentId,
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
        mutationFn: async ({ digiToken, requestId, beneMobileKyc }: { digiToken: string, requestId: TODO, beneMobileKyc: string }) => {
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
            const response = await interceptor().get(
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

export const useCreateOrder = () => {
    const query = useMutation({
        mutationFn: (body: RequestBody) => {
            return interceptor().post("loadViaPg/createOrder",
                body,)
        },
        onError: (error) => {
            console.log("error", error)
        },

        onSuccess: (response) => {
            console.log("data", response)
        },
    })
    return query
}

export const usePan = () => {
    const query = useMutation({
        mutationFn: getPan,
        onError: (error) => {
            console.log("error", error)
        },
        onSuccess: (response) => {
            console.log("data", response)
        },
    })
    return query
}
export const useSessionInit = ({ enabled = true }: { enabled: boolean }) => {
    const sessionInit = useQuery({
        queryKey: ['SESSION_INIT'],
        queryFn: async () => {
            const response = await EncrptionInterceptor("SESSION_INIT").get("session/init", {
                withCredentials: false,
            })
            return response.data;
        },
        enabled
    })
    return sessionInit
}

export const usePinCode = ({ token, values }: { token: string; values: string }) => {
    const pinCode = useQuery({
        queryKey: ['PINCODE'],
        queryFn: async () => {
            const response = await EncrptionInterceptor("report").get(
                `pincode/${values}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            return response.data;
        },
        enabled: !!token && values.length === 6,
    })
    return pinCode
}

