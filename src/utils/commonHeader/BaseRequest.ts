
import { getGeolocationData } from "./geolocation";
import { getBrowserFingerprintData } from "./browserFingerprint";
import { formatDate } from "../datehelper";

export const getRequestBaseData = async (type=null) => {
    const baseData = { requestSource: "Web" } as TODO;

    try {
        const geoData = await getGeolocationData() as TODO;
        if (geoData?.coords) {
            baseData.reqLong = geoData.coords.longitude.toFixed(6).toString();
            baseData.reqLat = geoData.coords.latitude.toFixed(6).toString();
        }
        
    } catch (e) {
        console.warn("Unable to fetch geolocation data:", e);
    }

    baseData.localTimeStamp = formatDate(new Date());

    const fingerprint = await getBrowserFingerprintData();
    if (fingerprint) baseData.commDeviceId = fingerprint.toString();

    try {
        const ipData = await fetch("https://api.ipify.org?format=json")
            .then(res => res.json());
        if (ipData?.ip) {
            baseData.requestIp = ipData.ip;
        }
    } catch (e) {
        console.warn("Unable to fetch IP address:", e);
    }
    
    baseData.version = "1.0";
    baseData.appName = "EDGE";
    baseData.scope = String(type);

    return baseData;
};
