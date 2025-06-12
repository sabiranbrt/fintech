/* eslint-disable @typescript-eslint/no-explicit-any */
import { getRequestBaseData } from "./BaseRequest";

export default async function CommonHeader(type = null) {
    const headerParams = {} as any;
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
