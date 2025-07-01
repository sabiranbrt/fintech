/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import Loader from "../LoaderComponent";
import EncrptionInterceptor from "@/utils/encryptionInterceptor";
import Swal from "sweetalert2";

interface IProps {
  onSlipUpload: (url: string) => void;
  beneData: any;
  senderData: any;
}

const SlipButtons = ({ onSlipUpload, beneData, senderData }: IProps) => {
  const isRP = true;
  const [isUploading, setIsUploading] = useState(false);

  const handleDownload = () => {
    const today = new Date();

    const options = { day: "2-digit", month: "short", year: "numeric" } as any;
    const formattedDate = today.toLocaleDateString("en-GB", options);
    const optionsMonth = { month: "long", year: "numeric" } as any;
    const formattedMonthYear = today.toLocaleDateString("en-GB", optionsMonth);

    const senderName = [
      senderData?.panCardData?.firstName,
      senderData?.panCardData?.middleName,
      senderData?.panCardData?.lastName,
    ]
      .filter(Boolean)
      .join(" ");

    const beneName = [
      beneData?.beneficiaryFirstName,
      beneData?.beneficiaryMiddleName,
      beneData?.beneficiaryLastName,
    ]
      .filter(Boolean)
      .join(" ");

    let url;
    let replacements;
    if (isRP) {
      url = "https://clf.finkeda.com/resources/pg-html/rp.html";
      replacements = {
        senderName: senderName,
        senderphoneNumber: senderData?.panCardData?.mobile_no,
        beneName: beneName,
        beneaddress: beneData?.beneAddress,
        benephoneNumber: beneData?.beneficiaryMobile,
        benepanNumber: beneData?.beneficiaryPan,
        rentMonth: formattedMonthYear,
        rentAmount: 2000,
        lateFee: 0,
        otherCharges: 0,
        totalAmount: 2000,
        paymentMethod: "CARD",
        paymentDate: formattedDate,
      };
    } else {
      url = "https://clf.finkeda.com/resources/pg-html/edu.html";
      replacements = {
        senderName: senderName,
        senderphoneNumber: senderData?.panCardData?.mobile_no,
        beneName: beneName,
        beneaddress: beneData?.beneAddress,
        benephoneNumber: beneData?.beneficiaryMobile,
        benepanNumber: beneData?.beneficiaryPan,
        tutionFee: 2000,
        materialFee: 0,
        discount: 0,
        totalFee: 2000,
        paymentMethod: "CARD",
        paymentDate: formattedDate,
      };
    }
    console.log("replacement", replacements);

    replaceAndOpen(url, replacements);
  };

  const replaceAndOpen = async (url: any, replacements: any) => {
    try {
      const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(
        url
      )}`;
      const response = await fetch(proxyUrl);
      const data = await response.json();
      let html = data.contents;
      Object.entries(replacements).forEach(([key, value]) => {
        html = html.replaceAll(`{${key}}`, value);
      });
      const blob = new Blob([html], { type: "text/html" });
      const blobUrl = URL.createObjectURL(blob);
      window.open(blobUrl, "_blank");
      setTimeout(() => URL.revokeObjectURL(blobUrl), 5000);
    } catch (error) {
      console.error("Error fetching or processing HTML:", error);
      alert("Failed to load and process the HTML. Check console for details.");
    }
  };

  const handleFileUpload = async (file: any) => {
    if (!file) {
      Swal.fire("Error", "No file selected!", "error");
      return;
    }

    setIsUploading(true);
    try {
      const initTokenResponse = await EncrptionInterceptor("SESSION_INIT").get(
        "session/init"
      );
      const token =
        initTokenResponse?.data?.apiResponseData?.responseData?.token;
      localStorage.setItem("access_token", token);
      if (!token) {
        Swal.fire("Error", "Session expired. Please login again.", "error");
        return;
      }

      localStorage.setItem("access_token", token);

      const metadata = {
        fileType: file.type,
        documentType: "supportTicket",
        serviceType: "support_ticket",
        ticketNumber: "12", // Make dynamic if needed
      };

      const apiResponse = await EncrptionInterceptor("support_ticket").post(
        "upload/file",
        metadata
      );
      const { responseData } = apiResponse.data.apiResponseData || {};

      if (!responseData?.url || !responseData?.fields) {
        Swal.fire(
          "Error",
          "Invalid API Response. Upload URL or fields missing.",
          "error"
        );
        return;
      }

      const { url, fields, cdnUrl } = responseData;

      const formData = new FormData();
      Object.entries(fields).forEach(([key, value]) => {
        formData.append(key, value as any);
      });
      formData.append("file", file);

      const s3Response = await fetch(url, {
        method: "POST",
        body: formData,
        mode: "no-cors",
      });

      if (s3Response.status === 0) {
        onSlipUpload(cdnUrl);
        Swal.fire("Success", "Slip uploaded successfully.", "success");
      } else {
        Swal.fire("Error", "Failed to upload file to S3.", "error");
      }
    } catch (error) {
      console.error("Upload error:", error);
      Swal.fire("Error", "Something went wrong while uploading.", "error");
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileChange = (e: any) => {
    const file = e.target.files[0];
    if (file) {
      // setAttachment(file);
      handleFileUpload(file);
    }
  };

  return (
    <div className="flex justify-center items-center gap-4 mt-4">
      <div className="flex flex-col">
        <label
          htmlFor="slip-upload"
          className="mb-1 font-medium text-sm text-gray-700"
        >
          Upload Slip
        </label>
        <input
          id="slip-upload"
          type="file"
          accept=".pdf,.jpg,.png"
          onChange={handleFileChange}
          disabled={isUploading}
          className="text-sm border w-60 border-gray-300 rounded-md p-2 focus:outline-none"
        />
      </div>

      <button
        type="button"
        onClick={handleDownload}
        className="whitespace-nowrap mt-5 bg-gradient-to-r from-[#4b5a9f] to-[#4fb5b7] px-3 py-2 rounded-lg text-white hover:from-[#6a77b0] hover:to-[#70c6c7] transition-all duration-300"
      >
        Download Slip
      </button>
      {isUploading && <Loader />}
    </div>
  );
};

export default SlipButtons;
