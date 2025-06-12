/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import { ShowSwalMsg } from "./swal";
import { encryptWithKey } from "@/utils/encryption/aes";
import { encryptSha } from "@/utils/encryption/sha";
import { generateRandom13DigitNumber } from "@/libs/axios";
import { generateBearerData } from "./bearerData";
import { encryptBody, encryptKey, generateAESKey, generateIV } from "../encrypt";

const getBaseURL = (page_type: any) => {
  // console.log("pagetype",page_type);
  if (page_type === "file_upload") {
    return import.meta.env.VITE_FILE_API_URL; // Define this in .env
  }
  return import.meta.env.VITE_API_BASE_URL_LW;
};

const interceptor = (page_type = null) => {
  const instance = axios.create({
    baseURL: getBaseURL(page_type),
    timeout: 30000,
    // withCredentials: true,
  });

  instance.interceptors.request.use(async (config) => {
    const authToken = localStorage.getItem("authToken");
    const agentId = localStorage.getItem("agentId");
    config.headers["agentId"] = agentId;
    config.headers["clientId"] = import.meta.env.VITE_CLIENT_ID;
    config.headers["counterid"] = 0;
    config.headers["urn"] = generateRandom13DigitNumber();
    if (!config.skipAuthToken) {
      config.headers["authToken"] = authToken;
    }
    if (config.sendSessionToken) {
      const sessionAuthToken = localStorage.getItem("sessionAuthToken");
      config.headers["Authorization"] = `Bearer ${sessionAuthToken}`;
    }
    delete config.headers["Accept"];
    try {
      const bearerData = await generateBearerData(); // Await the Promise
      config.headers["bearerData"] = bearerData.bearerData;
    } catch (error) {
      console.error("Error fetching bearerData:", error);
    }

    if (
      (config.method === "post" || config.method === "put") &&
      config.data &&
      !config.skipEncryption
    ) {
      let reqBody;
      try {
        if (config.sendSessionToken) {
          const encrypted = await encryptWithKey(JSON.stringify(config.data)); // ✅ Await encryption
          const encryptedKeyBase64 = encryptSha(encrypted.key);

          reqBody = {
            data: encrypted.data,
            key: encryptedKeyBase64,
          };
        } else {
          const originalPayload = config.data;
          const aesKey = generateAESKey();
          const iv = generateIV(aesKey);
          reqBody = {
            encryptedKey: encryptKey(
              aesKey,
              import.meta.env.VITE_RSA_PUBLIC_KEY
            ),
            encryptedBody: encryptBody(
              JSON.stringify(originalPayload),
              aesKey,
              iv
            ),
          };
        }

        config.data = reqBody;
      } catch (error) {
        console.error("Error encrypting request data:", error);
        return Promise.reject(error);
      }
    }
    return config;
  });

  instance.interceptors.response.use(
    function (response) {
      const res = response.data?.apiResponseData;
      if (
        res?.responseCode === "403" &&
        res?.responseMessage?.includes("expire")
      ) {
        setTimeout(() => {
          const v1URL = import.meta.env.VITE_V1_URL;
          window.location.href = v1URL;
        }, 4000);
      }
      return response;
    },
    function (error) {
      ShowSwalMsg("error", error.message);
      return Promise.reject(error);
    }
  );
  return instance;
};

export default interceptor;
