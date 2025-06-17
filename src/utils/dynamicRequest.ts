/* eslint-disable @typescript-eslint/no-explicit-any */
export interface DynamicRequest {
  url: string;
  method: "GET" | "POST";
  params?: Record<string, any>;
  headers?: any;
}

type EndpointConfig = {
  url: string;
  method: string;
  enc?: boolean;
  headers?: any;
  queryParams?: string[];
};

type EndPointsMap = Record<string, EndpointConfig>;

export function getDynamicRequest(
  step: string,
  endPoints: EndPointsMap,
  params: Record<string, any> = {},
  customHeaders: Record<string, any> = {}
): DynamicRequest | null {
  const config = endPoints[step];
  if (!config) return null;

  // 1. Start with base URL
  let finalUrl = config.url || "";

  // 2. If queryParams are defined, build query string
  if (config.queryParams?.length) {
    const query: Record<string, string> = {};

    config.queryParams.forEach((key: string) => {
      if (params[key] !== undefined && params[key] !== null) {
        query[key] = String(params[key]);
      }
    });

    const queryString = new URLSearchParams(query).toString();

    if (queryString) {
      finalUrl += finalUrl.includes("?") ? `&${queryString}` : `?${queryString}`;
    }
  }

  // 3. Resolve headers
  const resolvedHeaders = config.headers
    ? Object.fromEntries(
        Object.entries(config.headers).map(([k, v]: any) => [
          k,
          typeof v === "string" ? v.replace("{{urn}}", params.urn || "") : v,
        ])
      )
    : {};

  // 4. Merge with custom headers
  const mergedHeaders = { ...resolvedHeaders, ...customHeaders };

  return {
    url: finalUrl,
    method: config.method.toUpperCase() as "GET" | "POST",
    params,
    headers: mergedHeaders,
  };
}
