/* eslint-disable @typescript-eslint/no-explicit-any */
import JSEncrypt from 'jsencrypt';
import CryptoJS from 'crypto-js';

export const encryptKey = (data:any, publicKeyPEM:any) => {
  const encrypt = new JSEncrypt();
  encrypt.setPublicKey(publicKeyPEM);
  return encrypt.encrypt(data);
};

export const encryptBody = (input:any, key:any, iv:any) => {
  const cipherText = CryptoJS.AES.encrypt(input, CryptoJS.enc.Utf8.parse(key), {
    iv: CryptoJS.enc.Utf8.parse(iv),
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  });
  return cipherText.toString();
};

export const generateAESKey = () => {
  const array = new Uint8Array(16);
  crypto.getRandomValues(array);
  return Array.from(array)
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
};

export const generateIV = (str: string) => {
  return str
    .split('')
    .filter((_, index) => index % 2 === 0)
 // eslint-disable-next-line no-irregular-whitespace
    .join('');
};