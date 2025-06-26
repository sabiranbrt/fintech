import { useMutation } from "@tanstack/react-query";
import apiConfig from "@/jsonDemo/services.json";
import { axiosInstance } from "@/libs/axios";

type Endpoints = typeof apiConfig.endPoints;
export type EndpointKey = keyof Endpoints;

type ServiceKey = string;
type SequencePayloads = Record<EndpointKey, TODO>;
type SequenceResults = Record<EndpointKey, TODO>;

const callApi = async (
  step: EndpointKey,
  payload: Record<string, TODO> = {}
) => {
  const endpoint = apiConfig.endPoints[step];
  if (!endpoint) throw new Error(`Endpoint for step "${step}" not found`);

  const method = endpoint.method?.toUpperCase() || "GET";
  const url = endpoint.url;

  if (method === "GET") {
    const params =
      "queryParams" in endpoint && endpoint.queryParams
        ? Object.fromEntries(
            endpoint.queryParams.map((key) => [key, payload[key]])
          )
        : undefined;

    const headers =
      "headers" in endpoint && endpoint.headers ? endpoint.headers : undefined;

    return axiosInstance.get(url, {
      params,
      headers: headers,
    });
  }

  if (method === "POST") {
    const headers =
      "headers" in endpoint && endpoint.headers ? endpoint.headers : undefined;
    return axiosInstance.post(url, payload, {
      headers,
    });
  }

  throw new Error(`Unsupported method: ${method}`);
};

export const useServiceSequence = () => {
  return useMutation({
    mutationFn: async ({
      serviceKey,
      payloads,
    }: {
      serviceKey: ServiceKey;
      payloads: SequencePayloads;
    }) => {
      const service = apiConfig.services.find((s) => s.key === serviceKey);
      if (!service) throw new Error(`Service "${serviceKey}" not found`);

      const results: Partial<SequenceResults> = {};

      for (const step of service.sequence) {
        const stepKey = step as EndpointKey; // cast to EndpointKey
        const payload = payloads?.[stepKey] || {};
        const response = await callApi(stepKey, payload);
        results[stepKey] = response.data;
      }

      return results;
    },
  });
};
