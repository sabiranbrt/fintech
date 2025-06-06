import { getService } from "@/libs"
import { useQuery } from "@tanstack/react-query"

export const useServicesList = () => {
    const serviceList = useQuery({
        queryKey: ['SERVICE_LIST'],
        queryFn: getService,
    })
    return serviceList
}