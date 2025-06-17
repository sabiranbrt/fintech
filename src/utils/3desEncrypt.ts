/* eslint-disable @typescript-eslint/no-explicit-any */
import CryptoJS from 'crypto-js';

export const encryptData = (data:any, key:any) => {
  if (typeof data !== 'string') {
    data = JSON.stringify(data);  // Ensure data is a string
  }
  const formattedKey = CryptoJS.enc.Hex.parse(key);  // Convert hex key to WordArray
  const encrypted = CryptoJS.TripleDES.encrypt(data, formattedKey, {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7,
  });

  return encrypted.toString();
};

export const decryptData = (data:any, key:any) => {
    try {
      // Parse the key as Hex to ensure proper format for TripleDES
      const formattedKey = CryptoJS.enc.Hex.parse(key);
  
      const decrypted = CryptoJS.TripleDES.decrypt(data, formattedKey, {
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7,
      });
  
      // Convert decrypted data to UTF-8 string
      const decryptedText = decrypted.toString(CryptoJS.enc.Utf8);
  
      // Safely parse the string into JSON
      return JSON.parse(decryptedText);
    } catch (error) {
      console.error("Decryption failed:", error);
      return null;
    }
  };
export const decryptData3Des = (ciphertext:any, key:any) => {
  const decodedCiphertext = CryptoJS.enc.Base64.parse(ciphertext);
  const keyBytes = CryptoJS.enc.Utf8.parse(key);
  const keyWords = CryptoJS.lib.WordArray.create(keyBytes.words.slice(0, 6), 24);
  const decrypted = CryptoJS.TripleDES.decrypt({ ciphertext: decodedCiphertext } as any, keyWords, {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7,
  });
  return decrypted.toString(CryptoJS.enc.Utf8);
};