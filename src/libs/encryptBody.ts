/* eslint-disable @typescript-eslint/no-explicit-any */

import { encryptBody, encryptKey, generateAESKey, generateIV } from "@/utils/encrypt";

export const encryptRequestBody = (originalPayload:any) => {
    const aesKey = generateAESKey();
    const iv = generateIV(aesKey);
  
    return {
      encryptedKey: encryptKey(aesKey, import.meta.env.VITE_RSA_PUBLIC_KEY),
      encryptedBody: encryptBody(JSON.stringify(originalPayload), aesKey, iv),
    };
  };