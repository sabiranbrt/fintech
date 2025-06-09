import React, { useEffect, useState } from "react";
import interceptor from "@/services/interceptor";
import LeftSection from "./LeftSection";
import RightSection from "./RightSection";
import Loader from "../LoaderComponent";

const TransferModal = ({ merchantData }) => {
  const [slabDetails, setSlabDetails] = useState([]);
  const [loadingSlab, setLoadingSlab] = useState(false);
  const [limitDetails, setLimitDetails] = useState({});
  const [gatewayOptions, setGatewayOptions] = useState([]);
  const fetchSlabDetails = async () => {
    setLoadingSlab(true);
    try {
      const response = await interceptor().get("loadViaPg/getSlab");

      if (
        response.data.apiResponseCode === "200" &&
        response.data.apiResponseData.responseCode === "200"
      ) {
        setSlabDetails(response.data.apiResponseData.data.slabDetails);
        setLimitDetails(response.data.apiResponseData.data.limitDetails);
        setGatewayOptions(
          response.data.apiResponseData.data.gatewayPreferences
        );
      } else {
        console.error(
          "Failed to fetch slab details:",
          response.data.apiResponseMessage
        );
      }
    } catch (error) {
      toast.error("Error fetching slab details");
      console.error("Error fetching slab details:", error);
    } finally {
      setLoadingSlab(false);
    }
  };
  useEffect(() => {
    fetchSlabDetails();
  }, []);
  return (
    <>
      {loadingSlab && <Loader message="Loading . . ." />}
      <div className="flex items-center justify-center z-[2]">
        <div className="bg-white rounded-xl w-full animate-fadeIn max-h-full overflow-y-auto shadow-md">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            {/* Left Section - Merchant Details and Slab Section */}
            <LeftSection
              merchantData={merchantData}
              slabDetails={slabDetails}
            />
            <RightSection
              limitDetails={limitDetails}
              gatewayOptions={gatewayOptions}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default TransferModal;
