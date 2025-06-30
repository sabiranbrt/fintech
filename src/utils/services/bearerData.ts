import { getRequestBaseData } from "@/utils/commonHeader/BaseRequest";

export async function generateBearerData(type = null) {
  const headerParams = {} as TODO;
  let bearerData = await getRequestBaseData(type);

  try {
    bearerData = JSON.stringify(bearerData);
    const encodedBearerData = btoa(unescape(encodeURIComponent(bearerData)));
    headerParams.bearerData = encodedBearerData;
  } catch (error) {
    console.error("Error encoding bearerData:", error);
  }

  return headerParams;
}
