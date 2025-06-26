import { useEffect } from "react";
import "./index.css";
import Dashboard from "./pages/Dashboard";
import {
  fetchPrivateIP,
  fetchUserDetails,
} from "./utils/services/userAndLocationDetails";
import { toast } from "react-toastify";

function App() {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const authToken = params.get("authToken");
    const userID = params.get("userID");
    const serviceType = params.get("serviceType");

    if (authToken) {
      localStorage.setItem("authToken", authToken);
    }

    if (userID) {
      localStorage.setItem("agentId", userID);
      localStorage.setItem("userId", userID);
    }

    if (serviceType) {
      localStorage.setItem("serviceType", serviceType);
    }

    // Clean up URL (remove query params)
    if (authToken || serviceType) {
      window.history.replaceState({}, document.title, window.location.pathname);
    }
    try {
      const getValues = () => {
        fetchPrivateIP();
        fetchUserDetails();
      };
      getValues();
    } catch (error: TODO) {
      toast.error(error);
    }
  }, []);

  useEffect(() => {
    // Function to capture and store location data
    const storeLocationData = (position: GeolocationPosition) => {
      const { latitude, longitude } = position.coords;
      localStorage.setItem("latitude", String(latitude));
      localStorage.setItem("longitude", String(longitude));
    };

    // Function to handle location errors
    const handleError = (error: GeolocationPositionError) => {
      console.error("Error getting location:", error);
    };

    // Get the current position and store it
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(storeLocationData, handleError);
    } else {
      console.error("Geolocation is not supported by this browser.");
    }

    // Cleanup function to remove location data on component unmount
    return () => {
      localStorage.removeItem("latitude");
      localStorage.removeItem("longitude");
    };
  }, []);

  return (
      <Dashboard />
  );
}

export default App;
