import React, { useEffect, useState } from "react";
import TransferModal from "./TransferModal";
import axiosInstance from "@/lib/axios-instance";
import Loader from "../LoaderComponent";

const PGComponent = () => {
  const [senderData, setSenderData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    getSenderData();
  }, []);
  const getSenderData = async () => {
    setIsLoading(true);
    try {
      const authToken = localStorage.getItem("authToken");
      const response = await axiosInstance.get("/agent", {
        headers: {
          includeUrn: true,
          authToken: authToken,
          "Content-Type": "application/json",
        },
      });
      if (response?.data.apiResponseData.responseCode === "200") {
        setSenderData(response?.data.apiResponseData?.data?.userPersonalDetails);
      } else {
        toast.error(response?.data.apiResponseData.responseMessage);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
        {isLoading && <Loader/>}
      <TransferModal merchantData={senderData} />
    </div>
  );
};

export default PGComponent;
