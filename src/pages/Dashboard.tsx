/* eslint-disable @typescript-eslint/no-explicit-any */
import Footer from "@/components/footer";
import Header from "@/components/Header";
import { useAuthToken } from "@/hooks/service";
import QuickLinksComponent from "@/pages/quicklinks/QuickLinksComponent";
import { TopNavbar } from "../components/TopNavbar";
import QuickLinksFormComponent from "./quicklinks/components/QuickLinksFormComponent";
import { useEffect } from "react";

const Dashboard = () => {
  const { data: token } = useAuthToken();
  localStorage.setItem(
    "digiToken",
    token?.apiResponseData?.responseData?.accessToken
  );
  
  useEffect(() => {
    // Function to capture and store location data
    const storeLocationData = (position:any) => {
      const { latitude, longitude } = position.coords;
      localStorage.setItem("latitude", latitude);
      localStorage.setItem("longitude", longitude);
    };

    // Function to handle location errors
    const handleError = (error:any) => {
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
    <div className=" bg-secondary-background overflow-hidden h-screen">
      <TopNavbar />
      <div className=" flex gap-4 p-3 h-[80vh]">
        <div className=" flex-1 h-full overflow-hidden flex flex-col">
          <Header />
          <div className="flex-1 min-h-0">
            <QuickLinksFormComponent />
          </div>
        </div>
        <div className="overflow-y-auto bg-white px-8 py-5 shadow-md rounded-md h-full min-h-0">
          <QuickLinksComponent />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Dashboard;
