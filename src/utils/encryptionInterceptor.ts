/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import { encryptWithKey } from "@/utils/encryption/aes";
import { encryptSha } from "@/utils/encryption/sha";
import { toast } from "react-toastify";
import { generateRandom13DigitNumber } from "@/libs/axios";
import CommonHeader from "./commonHeader";


const getBaseURL = (page_type: any) => {
  // console.log("pagetype",page_type);
  if (page_type === "report") {
    return import.meta.env.VITE_REPORT_API_URL;
  }
  return import.meta.env.VITE_SUPPORT_NEW_API_URL;
};

// Function to create an interceptor with dynamic baseURL
const EncrptionInterceptor = (page_type: any) => {

  const instance = axios.create({
    baseURL: getBaseURL(page_type),
    timeout: 30000,
    // withCredentials: true,
  });

  instance.interceptors.request.use(async (config) => {

    config.headers["counterid"] = 0;
    config.headers["clientid"] = import.meta.env.VITE_CLIENT_ID;
    config.headers["urn"] = generateRandom13DigitNumber();
    config.headers["sessionId"] = localStorage.getItem('authToken');
    config.headers["agentId"] = localStorage.getItem('agentId');
    config.headers["userId"] = localStorage.getItem('userId');
    config.headers["userid"] = localStorage.getItem('userId');
    try {
      const bearerData = await CommonHeader(page_type);
      config.headers["bearerData"] = bearerData.bearerData;
    } catch (error) {
      console.error("Error fetching bearerData:", error);
    }

    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }

    // Encrypt POST data
    if (config.method === "post" && config.data) {
      try {
        const encrypted = await encryptWithKey(JSON.stringify(config.data));
        const encryptedKeyBase64 = encryptSha(encrypted.key);

        config.data = {
          data: encrypted.data,
          key: encryptedKeyBase64,
        };
      } catch (error) {
        console.error("Encryption failed:", error);
        return Promise.reject(error);
      }
    }

    return config;
  });

  instance.interceptors.response.use(undefined, (error) => {
    toast.error(error.message);
    return Promise.reject(error);
  });

  return instance;
};

export default EncrptionInterceptor;