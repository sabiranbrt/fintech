export async function encryptWithKey(message:TODO) {
  const key = await crypto.subtle.generateKey(
    { name: "AES-GCM", length: 256 },
    true,
    ["encrypt", "decrypt"]
  );
  const encoder = new TextEncoder();
  const data = encoder.encode(message);

  const iv = crypto.getRandomValues(new Uint8Array(12));
  const encryptedContent = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv: iv },
    key,
    data
  );

  // Combine IV and encrypted content
  const encryptedData = new Uint8Array(iv.length + encryptedContent.byteLength);
  encryptedData.set(iv);
  encryptedData.set(new Uint8Array(encryptedContent), iv.length);

  const exportedKey = await crypto.subtle.exportKey("raw", key);

  const base64Encrypted = btoa(String.fromCharCode.apply(null, encryptedData as TODO));
  const base64Key = btoa(
    String.fromCharCode.apply(null, new Uint8Array(exportedKey) as TODO)
  );

  return { data: base64Encrypted, key: base64Key };
}
