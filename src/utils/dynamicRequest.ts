import { encryptRequestBody } from "@/libs/encryptBody";

/* eslint-disable @typescript-eslint/no-explicit-any */
export interface DynamicRequest {
  url: string;
  method: "GET" | "POST";
  params?: Record<string, any>;
  headers?: any;
  body?: Record<string, unknown> | { encryptedKey: string | false; encryptedBody: string } | null;
  responseType?: "json" | "text" | "blob";
}

type EndpointConfig = {
  url: string;
  method: string;
  enc?: boolean;
  headers?: any;
  queryParams?: string[];
  body?: any;
  responseType?: "json" | "text" | "blob"
};

type EndPointsMap = Record<string, EndpointConfig>;

export function getDynamicRequest(
  step: string,
  endPoints: EndPointsMap,
  params: Record<string, any> = {},
  customHeaders: Record<string, any> = {},
  manualBody?: Record<string, unknown> | null,
  responseType?: any
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

  // 5. Build request body for POST requests
  let requestBody: any = null;

  if (config.method === "POST") {
    // If manualBody is provided, use it directly
    if (manualBody) {
      requestBody = manualBody;
    } else {
      const { body: bodyConfig } = config;

      if (Array.isArray(bodyConfig)) {
        requestBody = {};
        bodyConfig.forEach((key) => {
          if (params[key] !== undefined && params[key] !== null) {
            requestBody[key] = params[key];
          }
        });
      } else if (bodyConfig === true || bodyConfig === undefined || bodyConfig === null) {
        requestBody = { ...params };
      } else if (typeof bodyConfig === "object") {
        requestBody = bodyConfig;
      } else {
        requestBody = bodyConfig;
      }
    }

    // Apply encryption if enabled
    if (config.enc && requestBody) {
      const encrypted = encryptRequestBody(requestBody);
      requestBody = {
        encryptedKey: encrypted.encryptedKey,
        encryptedBody: encrypted.encryptedBody,
      };
    }
  }


  return {
    url: finalUrl,
    method: config.method.toUpperCase() as "GET" | "POST",
    params,
    headers: mergedHeaders,
    body: requestBody,
    responseType: responseType
  };
}
