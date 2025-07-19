import { encryptRequestBody } from "@/libs/encryptBody";

export interface DynamicRequest {
  url: string;
  method: "GET" | "POST";
  params?: Record<string, TODO>;
  headers?: TODO;
  body?: Record<string, unknown> | { encryptedKey: string | false; encryptedBody: string } | null;
  responseType?: "json" | "text" | "blob";
  page_type?: string;
}

type EndpointConfig = {
  url: string;
  method: string;
  enc?: boolean;
  headers?: TODO;
  queryParams?: string[];
  body?: TODO;
  responseType?: "json" | "text" | "blob";
  page_type?: string;
};

type EndPointsMap = Record<string, EndpointConfig>;

export function getDynamicRequest(
  step: string,
  endPoints: EndPointsMap,
  params: Record<string, TODO> = {},
  customHeaders: Record<string, TODO> = {},
  manualBody?: Record<string, unknown> | null,
  responseType?: TODO,
  page_type?: string,
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
      Object.entries(config.headers).map(([k, v]: TODO) => [
        k,
        typeof v === "string" ? v.replace("{{urn}}", params.urn || "") : v,
      ])
    )
    : {};

  // 4. Merge with custom headers
  const mergedHeaders = { ...resolvedHeaders, ...customHeaders };

  // 5. Build request body for POST requests
  let requestBody: TODO = null;

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
    responseType: config.responseType ?? "json",
    page_type: page_type ?? config.page_type,
  };
}
