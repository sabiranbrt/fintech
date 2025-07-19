export const base64ToFile = (base64String:string) => {
  // Extract MIME type (e.g., image/png)
  const mimeType = base64String.split(";")[0].split(":")[1];

  // Extract file extension from MIME type (e.g., png from image/png)
  const fileExtension = mimeType.split("/")[1];

  // Generate a unique filename using current timestamp
  const fileName = `file_${Date.now()}.${fileExtension}`;

  // Process the base64 string into binary data
  const base64Data = base64String.split(",")[1]; // Strip off the 'data:image/png;base64,' part
  const byteCharacters = atob(base64Data); // Decode base64 to binary string
  const byteArrays = [];

  // Convert binary string to byte array
  for (let offset = 0; offset < byteCharacters.length; offset++) {
    byteArrays.push(byteCharacters.charCodeAt(offset)); // Convert each char to byte
  }

  const byteArray = new Uint8Array(byteArrays); // Convert to Uint8Array

  // Create a Blob from the binary data and MIME type
  const blob = new Blob([byteArray], { type: mimeType });

  // Create a File object
  return new File([blob], fileName, { type: blob.type });
};
