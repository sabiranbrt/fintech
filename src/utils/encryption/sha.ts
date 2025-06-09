/* eslint-disable @typescript-eslint/no-explicit-any */
import forge from "node-forge";

// const publicKey = process.env.REACT_APP_PUBLIC_KEY;
const publicKey = `-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAgt3lC50LvdP6nBQ2LAWt
sKM2G4qhUnw9CEQSfgOaouDEBq0tEagR7Pp5LJwE+JCNgDuZJf99rpH/V9Qk7voW
bcQU4XB7IpdC9T0ZKt8Cvg7SxN9W92pz95pIBJdHtl4G7xeIGenSMtxojbzi7Q3A
00i1xhFXOemo1lyiUAz7rs9nLLseM+J/XrI8I57BSW6LaVm8ZiKnNc7RhIgXoJXA
ssKQh9A8Bz6gK0C9m3MkZB78nuO0ieCONbF87/VU+Dm7B7kvlu6X+RVZDoNo6oOm
8b72apkTROwK7S+LGARvflvpMXwTShcLRugGdDNAeEVdJJuNq2C3iYS244CywnUM
fwIDAQAB
-----END PUBLIC KEY-----`;

export function encryptSha(data:any) {
  const publicKeyForged = forge.pki.publicKeyFromPem(publicKey);
  const encryptedDataBytes = publicKeyForged.encrypt(data, "RSA-OAEP", {
    md: forge.md.sha256.create(),
  });
  // Convert the encrypted bytes to a Base64-encoded string
  const encryptedDataBase64 = forge.util.encode64(encryptedDataBytes);
  return encryptedDataBase64;
}
