import LocalStorageUtil from "@/utils/LocalStorageUtil";
import * as internalIp from "internal-ip";
import FingerprintJS from "fingerprintjs2";

export const fetchPrivateIP = async () => {

  try {
    const ip = await internalIp.internalIpV4() as string; // Use `v6()` for IPv6
    sessionStorage.setItem("privateip", ip);
    localStorage.setItem("privateip", ip);
    // setPrivateIp(ip);
  } catch (error) {
    console.error("Error fetching private IP:", error);
  }
};

// const options = {
//   enableHighAccuracy: true, // Use GPS if available for higher accuracy
//   timeout: 5000, // Maximum time (ms) to wait for a position
//   maximumAge: 0, // Prevent using cached location
// };
export const fetchUserDetails = async () => {
  try {
    const getLocation = () =>
      new Promise((resolve, reject) => {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              const { latitude, longitude } = position.coords;
              resolve({ latitude, longitude });
            },
            (error) => reject(error),
            {
              enableHighAccuracy: true,
              timeout: 5000,
              maximumAge: 0,
            }
          );
        } else {
          reject(new Error("Geolocation not supported"));
        }
      });

    const location = await getLocation() as TODO;

    const getIP = async () => {
      const response = await fetch("https://api.ipify.org?format=json");
      const data = await response.json();
      return data.ip;
    };

    const ip = await getIP();

    const getFingerprint = () =>
      new Promise((resolve) => {
        FingerprintJS.get((components: TODO) => {
          const values = components.map((component: TODO) => component.value);
          const fingerprint = FingerprintJS.x64hash128(values.join(""), 31);
          resolve(fingerprint);
        });
      });

    const fingerprint = await getFingerprint() as TODO;

    // Store in session and local storage
    sessionStorage.setItem("latitude", location.latitude?.toFixed(6));
    sessionStorage.setItem("longitude", location.longitude?.toFixed(6));
    LocalStorageUtil.setItem("latitude", location.latitude?.toFixed(6));
    LocalStorageUtil.setItem("longitude", location.longitude?.toFixed(6));
    sessionStorage.setItem("ip", ip);
    sessionStorage.setItem("fingerprint", fingerprint);

    return {
      latitude: location.latitude,
      longitude: location.longitude,
      ip,
      fingerprint,
    };
  } catch (error) {
    console.error("Error fetching user details:", error);
  }
};

