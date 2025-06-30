import CryptoJS from 'crypto-js';

type JsonData = Record<string, unknown> | string;

export const encryptData = (data: JsonData, key: string) => {
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

export const decryptData = (data: string, key: string) => {
  try {
    // Parse the key as Hex to ensure proper format for TripleDES
    const formattedKey = CryptoJS.enc.Hex.parse(key);

    const decrypted = CryptoJS.TripleDES.decrypt(data, formattedKey, {
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7,
    });

    // Convert decrypted data to UTF-8 string
    const decryptedText = decrypted.toString(CryptoJS.enc.Utf8);
    // Guard clause for empty decrypted string
    if (!decryptedText) {
      console.warn("Decryption succeeded but result is empty — possibly wrong key or corrupted input.");
      return null;
    }

    // Safely parse the string into JSON
    return JSON.parse(decryptedText);
  } catch (error) {
    console.error("Decryption failed:", error);
    return null;
  }
};
export const decryptData3Des = (ciphertext: string, key: string) => {
  const decodedCiphertext = CryptoJS.enc.Base64.parse(ciphertext);
  const keyBytes = CryptoJS.enc.Utf8.parse(key);
  const keyWords = CryptoJS.lib.WordArray.create(keyBytes.words.slice(0, 6), 24);
  const decrypted = CryptoJS.TripleDES.decrypt({ ciphertext: decodedCiphertext } as TODO, keyWords, {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7,
  });
  return decrypted.toString(CryptoJS.enc.Utf8);
};