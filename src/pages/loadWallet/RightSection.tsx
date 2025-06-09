import React, { useCallback, useEffect, useState } from "react";
import axiosInstance from "../../lib/axios-instance";
import interceptor from "@/services/interceptor";
import Loader from "../LoaderComponent";
import CryptoJS from "crypto-js";
import JSEncrypt from "jsencrypt";
import PGModals from "./PGModals";
import { convertToWords } from "react-number-to-words";
import { ShowSwalMsg } from "@/services/swal";
import { toast } from "react-toastify";
import { decryptData3Des } from "@/utils/3desEncrypt";

const RightSection = ({ limitDetails, gatewayOptions }) => {
  const [markupValue, setMarkupValue] = useState("");
  const amountLimits = { min: 100, max: 50000 };
  const [formData, setFormData] = useState({ amount: "", otherField: "" });
  const [lastSixDigits, setLastSixDigits] = useState("");
  const [loadingCharge, setLoadingCharge] = useState(false);
  const [chargeDetails, setChargeDetails] = useState(null);
  const [selectedCardType, setSelectedCardType] = useState("credit"); // Default to Credit Card
  const [loadingOrder, setLoadingOrder] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [amountErrorMessage, setAmountErrorMessage] = useState("");
  const [markupErrorMessage, setMarkupErrorMessage] = useState("");

  const userID = "9241980104198913";
  const [paymentStatus, setPaymentStatus] = useState({
    title: "Awaiting Payment",
    details: null,
  });
  const [zaakPayUrl, setZaakPayUrl] = useState("");
  const [paymentWindow, setPaymentWindow] = useState(null);
  const [modalContent, setModalContent] = useState("");
  const [pgOrderID, setPgOrderID] = useState("");
  const [platform, setPlatform] = useState("NB");
  const [invoiceID, setInvoiceId] = useState("");
  const [accessToken, setAccessToken] = useState("");
  const [providerId, setProviderId] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [manualClose, setManualClose] = useState(false);

  const resetFormData = () => {
    setFormData({ amount: "", otherField: "" });
    setLastSixDigits("");
    setChargeDetails(null);
    setSelectedCardType("credit");
    setMarkupValue("");
    setAmountErrorMessage("");
    setMarkupValue("");
  };

  const closeModal = () => {
    setModalVisible(false);
    handleRefreshPage();
  };

  const handlePrint = () => {
    const printWindow = window.open("", "_blank");
    printWindow.document.write(modalContent);
    printWindow.document.close();
    printWindow.print();
  };

  const handleRefreshPage = () => {
    window.location.reload();
  };

  const validateAmount = (amount) => {
    if (amount < limitDetails.minValue || amount > limitDetails.maxValue) {
      setAmountErrorMessage(
        `Request Amount must be between ₹${limitDetails.minValue} and ₹${limitDetails.maxValue}`
      );
      return false;
    }
    setAmountErrorMessage("");
    return true;
  };

  const handleError = useCallback((error) => {
    console.error("Payment error:", error);
    setPaymentStatus({
      title: error.message || "Payment processing error",
      details: null,
    });
  }, []);

  const createOrder = async () => {
    if (!chargeDetails || !lastSixDigits) {
      alert("Please fill in all required fields and fetch charge details.");
      return;
    }

    setLoadingOrder(true);
    try {
      const response = await interceptor().post("loadViaPg/createOrder", {
        requestInfo: {
          requestIp: JSON.parse(
            localStorage.getItem("privateip") || '"192.168.1.9"'
          ),
          latitude: JSON.parse(localStorage.getItem("lat") || '"22.5726"'),
          longitude: JSON.parse(localStorage.getItem("long") || '"88.3639"'),
          commDeviceId: "commDeviceId_6f681b37cfb3",
          requestSource: "WEB",
        },
        txnPayload: {
          amount: Number(chargeDetails.request_amount),
        },
        dynamicValues: {
          cardLastSixDigits: lastSixDigits,
          amount: Number(chargeDetails.request_amount),
          charge: Number(chargeDetails.total_fee),
          igst: Number(chargeDetails.gst) || 0,
          cgst: Number(chargeDetails.cgst) || 0,
          sgst: Number(chargeDetails.sgst) || 0,
          crdrAmount: Number(chargeDetails.finalAmount),
        },
      });

      if (
        response.data.apiResponseCode === "200" &&
        response.data.apiResponseData.responseCode === "200"
      ) {
        const responseData = response.data.apiResponseData.data;
        setProviderId(responseData.providerId);
        setInvoiceId(responseData.invoiceID);
        setPgOrderID(responseData.pgOrderID);
        setPlatform(responseData.platform);
        if (responseData.accessToken) {
          const encToken = responseData.accessToken;
          const decCode = decryptData3Des(
            encToken,
            import.meta.env.VITE_DES_KEY
          );
          setAccessToken(decCode);
        }
        if (responseData.redirectUrl) {
          setZaakPayUrl(redirectUrl);
        }
      } else {
        console.error(
          "Failed to create order:",
          response.data.apiResponseMessage
        );
      }
    } catch (error) {
      toast.error("Failed to Create Order");
      console.error("Error creating order:", error);
    } finally {
      setLoadingOrder(false);
    }
  };

  const fetchChargeDetails = async () => {
    if (!formData.amount) return;
    setLoadingCharge(true);
    try {
      const payload = {
        amount: parseFloat(formData.amount),
        selectedCardType,
      };
      const response = await interceptor().post(
        "loadViaPg/getChargeInfo",
        payload
      );

      if (
        response.data.apiResponseCode === "200" &&
        response.data.apiResponseData.responseCode === "200"
      ) {
        setChargeDetails(response.data.apiResponseData.data);
        setMarkupValue(response.data.apiResponseData.data.total_fee);
      } else {
        ShowSwalMsg(
          "error",
          response.data.apiResponseData.responseMessage
            ? response.data.apiResponseData.responseMessage
            : "Failed to fetch charge details"
        );
        console.error(
          "Failed to fetch charge details:",
          response.data.apiResponseMessage
        );
      }
    } catch (error) {
      toast.error("Failed to fetch charges");
      console.error("Error fetching charge details:", error);
    } finally {
      setLoadingCharge(false);
    }
  };

  const handlePaymentResponse = useCallback(
    async (event) => {
      try {
        setIsLoading(true);
        const data = event.data;
        if (data && typeof data === "object") {
          const isSuccess = data.responseCode === "100";
          const statusText = isSuccess ? "Success" : "Failed";

          setPaymentStatus({
            title: `Payment ${statusText}`,
            details: {
              status: statusText,
              orderId: data.orderId || "N/A",
              amount: data.amount || "N/A",
              transactionId: data.pgTransId || "N/A",
              paymentMode: data.paymentMode || "N/A",
              description: data.responseDescription || "N/A",
            },
            completed: isSuccess,
          });

          // Close the payment window if payment is successful
          if (isSuccess && paymentWindow && !paymentWindow.closed) {
            paymentWindow.close();
            setPaymentWindow(null);
            setManualClose(false); // Reset manual close on success
          }

          const verifPayload = {
            requestInfo: {
              requestIp: JSON.parse(localStorage.getItem("privateip")),
              latitude: JSON.parse(localStorage.getItem("lat")),
              longitude: JSON.parse(localStorage.getItem("long")),
              commDeviceId: "commDeviceId_f4c6e43c16d1",
              requestSource: "requestSource_bf89dd79647e",
              providerId: providerId,
            },
            callbackResponse: response,
          };
          try {
            setIsLoading(true);
            const apiResp = await interceptor().post(
              "/transaction/verify",
              verifPayload,
              { responseType: "text" }
            );
            setModalContent(apiResp.data);
            setModalVisible(true);
          } catch (error) {
            console.error(error);
          } finally {
            setIsLoading(false);
          }
        }
      } catch (error) {
        handleError(error);
      } finally {
        setIsLoading(false);
      }
    },
    [paymentWindow]
  );

  const paymentGatewayInitiate = async () => {
    setIsLoading(true);
    const options = {
      key: accessToken,
      access_key: accessToken,
      order_id: pgOrderID,
      [providerId === 0 ? "callback_handler" : "handler"]: async function (
        response
      ) {
        // const key = import.meta.env.VITE_KEY;
        // const iv = import.meta.env.VITE_IV;
        const verifPayload = {
          requestInfo: {
            requestIp: JSON.parse(localStorage.getItem("privateip")),
            latitude: JSON.parse(localStorage.getItem("lat")),
            longitude: JSON.parse(localStorage.getItem("long")),
            commDeviceId: "commDeviceId_f4c6e43c16d1",
            requestSource: "requestSource_bf89dd79647e",
            providerId: providerId,
          },
          callbackResponse: response,
        };

        try {
          setIsLoading(true);
          const apiResp = await interceptor().post(
            "/loadViaPg/verifyOrder",
            verifPayload,
            { responseType: "text" }
          );
          setModalContent(apiResp.data);
          setModalVisible(true);
          // setIsModalOpen(false);
        } catch (error) {
          console.error(error);
        } finally {
          setIsLoading(false);
        }
      },
    };

    if (platform === "RP") {
      window.checkout = new Razorpay(options);
    } else {
      window.checkout = new NimbblCheckout(options);
    }
    window.checkout.open(pgOrderID);
  };

  useEffect(() => {
    if (
      zaakPayUrl &&
      pgOrderID &&
      !paymentWindow &&
      !paymentStatus.completed &&
      !manualClose
    ) {
      // Check the manualClose flag
      try {
        const windowFeatures = {
          width: 800,
          height: 600,
          left: (window.screen.width - 800) / 2,
          top: (window.screen.height - 600) / 2,
        };
        const features = Object.entries(windowFeatures)
          .map(([key, value]) => `${key}=${value}`)
          .join(",");

        const newWindow = window.open(zaakPayUrl, "ZaakpayPayment", features);
        if (!newWindow) {
          throw new Error("Popup blocked. Please enable popups for this site.");
        }
        setPaymentWindow(newWindow);
        setManualClose(false); // Reset manualClose on new window open
      } catch (error) {
        handleError(error);
      }
    }
  }, [
    zaakPayUrl,
    pgOrderID,
    paymentWindow,
    handleError,
    paymentStatus.completed,
    manualClose,
  ]);

  useEffect(() => {
    if (paymentWindow) {
      const checkWindow = setInterval(() => {
        if (paymentWindow.closed) {
          clearInterval(checkWindow);
          setManualClose(true); // Set manualClose if closed without success
          setPaymentWindow(null);
          if (!paymentStatus.details) {
            setPaymentStatus({
              title: "Payment window closed",
              details: null,
            });
          }
        }
      }, 500);
      return () => clearInterval(checkWindow);
    }
  }, [paymentWindow, paymentStatus.details]);

  useEffect(() => {
    if (accessToken && pgOrderID) {
      const script = document.createElement("script");
      setIsLoading(false);
      if (platform === "RP") {
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
      } else {
        script.src = "https://api.nimbbl.tech/static/assets/js/checkout.js";
      }
      script.async = true;

      script.onload = () => {
        paymentGatewayInitiate();
      };

      document.body.appendChild(script);
    }
  }, [accessToken, pgOrderID]);

  useEffect(() => {
    if (formData.amount) {
      fetchChargeDetails();
    }
  }, [selectedCardType]);

  useEffect(() => {
    window.addEventListener("message", handlePaymentResponse);
    return () => {
      window.removeEventListener("message", handlePaymentResponse);
    };
  }, [handlePaymentResponse]);

  return (
    <>
      <div className="py-2 px-2 bg-gray-50 lg:bg-white lg:border-l border-gray-100">
        <div>
          {/* Card Type Toggle */}
          <div className="flex flex-nowrap items-center justify-center w-full space-x-4 relative group my-2">
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                name="payment"
                value="credit"
                checked={selectedCardType === "credit"}
                onChange={() => setSelectedCardType("credit")}
              />
              <span className="text-gray-600" style={{ fontWeight: "600" }}>
                VISA
              </span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                name="payment"
                value="master"
                checked={selectedCardType === "master"}
                onChange={() => setSelectedCardType("master")}
              />
              <span className="text-gray-600" style={{ fontWeight: "600" }}>
                Master Card
              </span>
            </label>
            <label className="flex items-center space-x-2 relative group/others">
              <input type="radio" name="payment" value="corporate" disabled />
              <span className="text-gray-600" style={{ fontWeight: "600" }}>
                RUPAY
              </span>
              <span className="absolute hidden group-hover/others:block p-1 rounded-md top-5 -right-3 text-xs w-36 text-center bg-gray-600 text-white">
                Service Not Available
              </span>
            </label>
          </div>
          <div className="mt-2">
            <label className="text-sm font-medium text-gray-700">
              Gateway Preferences<span className="text-red-600">*</span>
            </label>
            <select
              id="gateway"
              className="w-full p-2 border border-gray-300 focus:outline-none field text-sm"
            >
              <option key="" value="">
                Select
              </option>
              {gatewayOptions?.map((type) => {
                return (
                  <option key={type.serviceName} value={type.serviceName}>
                    {type.displayName}
                  </option>
                );
              })}
            </select>
          </div>

          {/* Transfer Amount */}
          <div className="flex gap-2 mt-1 ">
            <div className="flex flex-col gap-y-1">
              <label className="text-sm font-medium text-gray-700">
                Request Amount<span className="text-red-600">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                  ₹
                </span>
                <input
                  type="number"
                  className={`w-full focus:outline-none pl-8 pr-3 py-2 bg-gray-100 border-2 ${
                    amountErrorMessage ? "border-red-500" : "border-gray-100"
                  } rounded-lg focus:border-[#14192E] focus:ring-2 focus:ring-[#14192E]/20 transition-all duration-200`}
                  placeholder="0.00"
                  value={formData.amount}
                  onChange={(e) => {
                    const inputValue = e.target.value;
                    validateAmount(inputValue);
                    setFormData((prev) => ({
                      ...prev,
                      amount: inputValue,
                    }));
                  }}
                  on
                  onBlur={fetchChargeDetails}
                />
              </div>
              {amountErrorMessage && (
                <p className="text-sm text-red-500">{amountErrorMessage}</p>
              )}
            </div>

            {/* Charges */}
            <div className="flex flex-col gap-y-1">
              <label className="text-sm font-medium text-gray-700">
                Charges
              </label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <span
                    className={`absolute left-4 ${
                      markupErrorMessage == "" ? "-translate-y-1/2" : ""
                    } text-gray-500`}
                    style={{ top: markupErrorMessage ? "15%" : "50%" }}
                  >
                    ₹
                  </span>
                  <input
                    type="number"
                    className="w-full pl-8 pr-3 py-2 bg-gray-100 border-2 border-gray-100 rounded-lg focus:border-[#14192E] focus:ring-2 focus:ring-[#14192E]/20 transition-all duration-200"
                    placeholder="Charge Value"
                    value={parseFloat(markupValue).toFixed(2)}
                    disabled
                  />
                  {markupErrorMessage && (
                    <p className="text-sm text-red-500">{markupErrorMessage}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="mt-2 text-sm text-gray-500">
            {formData.amount && (
              <span>
                {convertToWords(formData.amount)} {" Rupees only"}
              </span>
            )}
          </div>

          {/* Last 6 Digits of Your Card */}
          <div className="w-full flex flex-col mt-1 gap-y-1">
            <label className="text-sm font-medium text-gray-700">
              First 6 Digits of Your Card<span className="text-red-600">*</span>
            </label>
            <input
              type="number"
              maxLength={6}
              className="w-full px-3 py-2 bg-gray-100 border-2 border-gray-100 rounded-lg focus:border-[#14192E] focus:ring-2 focus:ring-[#14192E]/20 transition-all duration-200"
              placeholder="XXXX XX"
              value={lastSixDigits}
              onChange={(e) => {
                if (e.target.value.length <= 6) {
                  setLastSixDigits(e.target.value);
                } else {
                  return;
                }
              }}
            />
          </div>

          {/* Charge Details */}
          {loadingCharge ? (
            <p className="text-sm text-gray-500">Fetching charge details...</p>
          ) : chargeDetails ? (
            <div className="flex justify-between mt-1">
              <div className="w-48 text-blue-800 text-sm bg-blue-50 border-l-4 border-blue-500 p-2 rounded-r-md">
                <p>
                  Load Amount:{" "}
                  <span className="block">{chargeDetails.request_amount}</span>
                </p>
              </div>
              <div className="w-48 text-blue-800 text-sm bg-blue-50 border-l-4 border-blue-500 p-2 rounded-r-md">
                <p>
                  Credit Amount:{" "}
                  <span className="block">{chargeDetails.finalAmount}</span>
                </p>
              </div>
            </div>
          ) : null}

          {/* Action Buttons */}
          <div className="mt-6 mb-12 flex items-center justify-end space-x-4">
            <button
              type="button"
              className="px-6 py-2.5 bg-[#800505] text-white text-sm font-medium rounded-lg hover:bg-opacity-90 transition-all duration-200 shadow-lg shadow-indigo-200"
              onClick={() => {
                resetFormData();
              }}
            >
              Cancel
            </button>
            <button
              className={`px-6 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 shadow-lg ${
                !chargeDetails ||
                lastSixDigits.length !== 6 ||
                amountErrorMessage
                  ? "bg-gray-400 text-gray-800 cursor-not-allowed shadow-none"
                  : "bg-[#4b5a9f] text-white hover:bg-opacity-90 shadow-indigo-200"
              }`}
              type="button"
              onClick={createOrder}
              disabled={
                !chargeDetails ||
                lastSixDigits.length !== 6 ||
                amountErrorMessage
              }
            >
              {loadingOrder ? "Processing..." : "Proceed to Transfer"}
            </button>
          </div>
        </div>
      </div>
      {(isLoading || loadingOrder || loadingCharge) && (
        <Loader isLoading={loadingCharge || loadingOrder} />
      )}

      <PGModals
        modalVisible={modalVisible}
        modalContent={modalContent}
        closeModal={closeModal}
        handlePrint={handlePrint}
      />
    </>
  );
};

export default RightSection;
