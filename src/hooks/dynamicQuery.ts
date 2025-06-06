import { fetchDynamic } from '@/libs/axios';
import { DynamicRequest } from '@/types';
import { useQuery, UseQueryOptions, useMutation } from '@tanstack/react-query';


export const useDynamicQuery = <T = unknown>(
    req: DynamicRequest,
    options?: UseQueryOptions<T>,
) => {
    return useQuery<T>({
        queryKey: [
            req.url,
            req.method,
            req.params,
            req.headers,
        ],
        queryFn: () => fetchDynamic<T>(req),
        enabled: !!req.url,
        ...options,
    });
}


export const useDynamicMutation = <T = unknown>() => {
    return useMutation<T, unknown, DynamicRequest>({
        mutationFn: fetchDynamic,
    });
}
