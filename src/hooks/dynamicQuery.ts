
import { createAxiosInstance } from '@/libs/axios';
import { DynamicRequest } from '@/types';
import { useQuery, UseQueryOptions, useMutation } from '@tanstack/react-query';

export const useDynamicQuery = <T = unknown>(
    req: DynamicRequest,
    options?: UseQueryOptions<T>,
    page_type?: string,
) => {
    const { fetchDynamic } = createAxiosInstance(page_type);
    return useQuery<T>({
        queryKey: [
            req.url,
            req.method,
            req.params,
            req.headers,
        ],
        queryFn: () => fetchDynamic<T>(req),
        ...options,
    });
}

export const useDynamicMutation = <T = unknown>(page_type?: string) => {
  const { fetchDynamic } = createAxiosInstance(page_type);

  return useMutation<T, unknown, DynamicRequest>({
    mutationFn: fetchDynamic,
  });
};
