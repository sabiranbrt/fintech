/* eslint-disable @typescript-eslint/no-explicit-any */

import { decryptData, encryptData } from "./3desEncrypt";

const desKey = import.meta.env.VITE_DES_KEY;

const LocalStorageUtil = {
  setItem: (key:any, value:any) => {
    if (key === "authToken") {
      localStorage.setItem(key, value); // Don't encrypt authToken
    } else {
      const encryptedValue = encryptData(value, desKey);
      localStorage.setItem(key, encryptedValue);
    }
  },
  getItem: (key:any) => {
    const storedValue = localStorage.getItem(key);
    if (!storedValue) return null;

    if (key === "authToken") {
      return storedValue; // Don't decrypt authToken
    } else {
      return decryptData(storedValue, desKey);
    }
  },
  removeItem: (key:any) => {
    localStorage.removeItem(key);
  },
  clear: () => {
    localStorage.clear();
  },
};

export default LocalStorageUtil;
