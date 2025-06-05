/* eslint-disable @typescript-eslint/no-explicit-any */
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// Define the base API service
export const api = createApi({
    reducerPath: 'api', // unique key in store
    baseQuery: fetchBaseQuery({ baseUrl: '/api' }), // base URL of your API
    endpoints: (build) => ({

        // Generic GET endpoint accepting a path and params
        getData: build.query<any, { url: string; params?: Record<string, any> }>({
            query: ({ url, params }) => ({
                url,
                params,
            }),
        }),

        // Generic POST endpoint accepting a path and body
        postData: build.mutation<any, { url: string; body: any }>({
            query: ({ url, body }) => ({
                url,
                method: 'POST',
                body,
            }),
        }),
    }),
});

// Export hooks for usage in components
export const { useGetDataQuery, usePostDataMutation } = api;
