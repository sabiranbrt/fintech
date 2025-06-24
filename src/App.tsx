import { useEffect } from "react";
import "./index.css";
import Dashboard from "./pages/Dashboard";
import { fetchPrivateIP, fetchUserDetails } from "./utils/services/userAndLocationDetails";

function App() {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const authToken = params.get("authToken");
    const userID = params.get("userID");
    const serviceType = params.get("serviceType");

    console.log("authToken",authToken)
    console.log("userID",userID)
    console.log("serviceType",serviceType)

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
    } catch (error) {
      console.log("error", error);
    }
  }, []);

  return (
    <>
      <Dashboard />
    </>
  );
}

export default App;
