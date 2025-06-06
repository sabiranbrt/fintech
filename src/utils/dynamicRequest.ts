/* eslint-disable @typescript-eslint/no-explicit-any */
export interface DynamicRequest {
    url: string;
    method: "GET" | "POST";
    params?: Record<string, any>;
    headers?: Record<string, string>;
}

type EndpointConfig = {
    url: string;
    method: string;
    enc?: boolean;
    headers?: Record<string, string>;
    queryParams?: string[];
};

type EndPointsMap = Record<string, EndpointConfig>;

export function getDynamicRequest(
    step: string,
    endPoints: EndPointsMap,
    params: Record<string, any> = {}
): DynamicRequest | null {
    const config = endPoints[step];
    if (!config) return null;

    const resolvedHeaders = config.headers
        ? Object.fromEntries(
            Object.entries(config.headers).map(([k, v]) => [
                k,
                v.replace("{{urn}}", params.urn || ""),
            ])
        )
        : undefined;

    return {
        url: config.url,
        method: config.method.toUpperCase() as "GET" | "POST",
        params,
        headers: resolvedHeaders,
    };
}
