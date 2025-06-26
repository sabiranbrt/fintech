import services from "../jsonDemo/services.json";

export type EndpointKey = keyof typeof services["endPoints"];

export type EndpointConfig = {
  method: "GET" | "POST";
  url: string;
  enc?: boolean;
  headers?: Record<string, string>;
  queryParams?: string[];
};

export type ApiConfig = {
  services: {
    label: string;
    key: string;
    alias: string;
    type: string;
    uploadSlip: boolean;
    subserviceStatus: string;
    sequence: EndpointKey[];
    paymentMethods?: { value: string; label: string }[];
  }[];
  endPoints: Record<EndpointKey, EndpointConfig>;
};