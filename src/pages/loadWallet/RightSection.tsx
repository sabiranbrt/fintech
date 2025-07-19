/* eslint-disable react-hooks/exhaustive-deps */
import FeeBox from "@/components/feeBox";
import InputField from "@/components/inputField";
import Loader from "@/components/LoaderComponent";
import RadioButton from "@/components/radioButton";
import SelectField from "@/components/selectfield";
import { useDynamicMutation } from "@/hooks/dynamicQuery";
import { updateLoading } from "@/redux/slices/appSlice";
import { setValues } from "@/redux/slices/singleValueSlice";
import { RootState } from "@/redux/store";
import { decryptData3Des } from "@/utils/3desEncrypt";
import { getDynamicRequest } from "@/utils/dynamicRequest";
import LocalStorageUtil from "@/utils/LocalStorageUtil";
import interceptor from "@/utils/services/interceptor";
import { QueryObserverResult, RefetchOptions } from "@tanstack/react-query";
import clsx from "clsx";
import { toWords } from "number-to-words";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import PGModals from "./PGModals";

declare global {
  interface Window {
    checkout: TODO;
  }
}

interface IProps {
  slablist: TODO;
  refetchSlab: (
    options?: RefetchOptions | undefined
  ) => Promise<QueryObserverResult<TODO, unknown>>;
}

interface ChargeData {
  [key: string]: TODO;
}

interface OrderResponse {
  providerId: number;
  invoiceID: string;
  accessToken: string;
  pgOrderID: number;
  platform: string;
  token: string;
}

const RightSection = ({ slablist, refetchSlab }: IProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const { selectedService } = useSelector((state: RootState) => state.service);
  const { endpoints } = useSelector((state: RootState) => state.endPoints);

  const ChargeInfoNames = selectedService?.sequence?.find(
    (item) => item === "getChargeInfo"
  );

  const createOrderName = selectedService?.sequence?.find(
    (item) => item === "getCreateOrder"
  );

  // order Api hooks call
  const { mutateAsync: ChargeInfo } = useDynamicMutation<TODO>();
  const { mutateAsync: createOrderMutant } = useDynamicMutation<TODO>();

  const [chargeData, setChargeData] = useState<ChargeData | null>(null);
  const [orderResponse, setOrderResponse] = useState<OrderResponse | null>(
    null
  );
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [modalContent, setModalContent] = useState("");

  const handleClose = () => {
    setModalVisible(false);
  };

  const handlePrint = () => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      console.error(
        "Failed to open print window. It might have been blocked by a popup blocker."
      );
      return;
    }
    printWindow.document.write(modalContent);
    printWindow.document.close();
    printWindow.print();
  };

  const dispatch = useDispatch();

  const {
    control,
    watch,
    reset,
    setValue,
    formState: { errors },
  } = useForm<TODO>({
    mode: "onChange",
  });

  const amt = watch("requestAmt");
  const getTypes = watch("radio");
  const getGateway = watch("gateway");

  const requestChargeInfo = getDynamicRequest(
    ChargeInfoNames ?? "",
    endpoints ?? {},
    {
      amount: amt,
      selectedCardType: getTypes,
      selectedGateway: getGateway,
    },
    {},
    {},
    {},
    "lw"
  );
  const requestCreateOrder = getDynamicRequest(
    createOrderName ?? "",
    endpoints ?? {},
    {
      requestInfo: {
        requestIp: localStorage.getItem("privateip") || "192.168.1.9",
        latitude: JSON.parse(
          LocalStorageUtil.getItem("latitude") || '"22.5726"'
        ),
        longitude: JSON.parse(
          LocalStorageUtil.getItem("longitude") || '"88.3639"'
        ),
        commDeviceId: "commDeviceId_6f681b37cfb3",
        requestSource: "WEB",
      },
      txnPayload: {
        amount: Number(chargeData?.request_amount),
        cardType: getTypes,
      },
      dynamicValues: {
        selectedGateway: getGateway,
        cardLastSixDigits: 123456,
        amount: Number(chargeData?.request_amount),
        charge: Number(chargeData?.total_fee),
        igst: Number(chargeData?.gst) || 0,
        cgst: Number(chargeData?.cgst) || 0,
        sgst: Number(chargeData?.sgst) || 0,
        crdrAmount: Number(chargeData?.finalAmount),
      },
    },
    {},
    {},
    {},
    "lw"
  );

  useEffect(() => {
    dispatch(setValues(getTypes));
  }, [getTypes]);

  useEffect(() => {
    refetchSlab();
  }, [getGateway]);

  const slab = slablist;

  const onCreateOrder = async () => {
    if (!chargeData) {
      alert("Please fill in all required fields and fetch charge details.");
      return;
    }
  
    if (!requestCreateOrder) return;

    try {
      dispatch(updateLoading({ isLoading: true }));
      const response = await createOrderMutant(requestCreateOrder);
     
      if (
        response.apiResponseCode === "200" &&
        response.apiResponseData.responseCode === "200"
      ) {
        const responseData = response.apiResponseData.data;
        if (responseData.accessToken) {
          const encToken = responseData.accessToken;
          const decCode = decryptData3Des(
            encToken,
            import.meta.env.VITE_DES_KEY
          );

          const updatedResponseData = {
            ...responseData,
            accessToken: decCode,
          };
          setOrderResponse(updatedResponseData);
        } else {
          setOrderResponse(responseData);
        }
        // if (responseData.redirectUrl) {
        //   setZaakPayUrl(redirectUrl);
        // }
      } else {
        console.error("Failed to create order:", response.apiResponseMessage);
      }
    } catch (err) {
      console.log("error", err);
    } finally {
      dispatch(updateLoading({ isLoading: false }));
    }
  };

  const paymentGatewayInitiate = async () => {
    setIsLoading(true);
    const options = {
      key: orderResponse?.accessToken,
      access_key: orderResponse?.accessToken,
      order_id: orderResponse?.pgOrderID,
      [orderResponse?.providerId === 0 ? "callback_handler" : "handler"]:
        async function (response: TODO) {
          // const key = import.meta.env.VITE_KEY;
          // const iv = import.meta.env.VITE_IV;
          const verifPayload = {
            requestInfo: {
              requestIp: localStorage.getItem("privateip"),
              latitude: JSON.parse(LocalStorageUtil.getItem("latitude")),
              longitude: JSON.parse(LocalStorageUtil.getItem("longitude")),
              commDeviceId: "commDeviceId_f4c6e43c16d1",
              requestSource: "requestSource_bf89dd79647e",
              providerId: orderResponse?.providerId,
            },
            callbackResponse: response,
          };

          try {
            setIsLoading(true);
            const apiResp = (await interceptor().post(
              "/loadViaPg/verifyOrder",
              verifPayload,
              { responseType: "text" }
            )) as TODO;

            const contentType = apiResp.headers.get("content-type");
            if (contentType != "text/html;charset=UTF-8") {
              const response = JSON.parse(apiResp.data)
                ? JSON.parse(apiResp.data)
                : apiResp.data;
              if (response.apiResponseCode === "200") {
                if (response.apiResponseData.responseCode === "200") {
                  setModalContent(apiResp.data);
                  setModalVisible(true);
                } else {
                  toast.error(response.apiResponseData.responseMessage);
                  setModalVisible(false);
                }
              }
            } else {
              setModalContent(apiResp.data);
              setModalVisible(true);
            }
          } catch (error) {
            setModalVisible(false);
            console.error(error);
          } finally {
            setIsLoading(false);
          }
        },
    };

    if (orderResponse?.platform === "RP") {
      window.checkout = new Razorpay(options);
    } else {
      window.checkout = new NimbblCheckout(options);
    }
    window.checkout.open(orderResponse?.pgOrderID);
  };

  useEffect(() => {
    if (orderResponse?.accessToken && orderResponse?.pgOrderID) {
      const script = document.createElement("script");
      setIsLoading(false);
      if (orderResponse?.platform === "RP") {
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
  }, [orderResponse?.accessToken, orderResponse?.pgOrderID]);

  return (
    <>
      <div className="py-2 px-2 bg-gray-50 lg:bg-white lg:border-l border-gray-100">
        <div>
          {/* Card Type Toggle */}
          <div className="flex flex-nowrap items-center justify-center w-full space-x-4 relative group my-2">
            <RadioButton
              control={control}
              names="radio"
              options={[
                { value: "visa", label: "VISA" },
                { value: "master", label: "MASTER CARD" },
                { value: "rupay", label: "RUPAY" },
              ]}
            />
          </div>
          <div className="mt-2">
            <SelectField
              label="Gateway Preferences"
              control={control}
              placeHolder="Select"
              names="gateway"
              options={slab?.gatewayPreferences}
              labelKey={"displayName"}
              valueKey={"serviceName"}
            />
          </div>

          {/* Transfer Amount */}
          <div className="flex gap-2 mt-1 ">
            <div className="flex flex-col gap-y-1 w-full">
              <InputField
                control={control}
                errors={errors}
                rules={{
                  required: "Request Amount is required",
                  min: {
                    value: slab?.limitDetails?.minValue || 0,
                    message: `Request Amount must be at least ₹${
                      slab?.limitDetails?.minValue || 0
                    }`,
                  },
                  max: {
                    value: slab?.limitDetails?.maxValue || Infinity,
                    message: `Request Amount cannot exceed ₹${
                      slab?.limitDetails?.maxValue || "unknown"
                    }`,
                  },
                }}
                names="requestAmt"
                type="number"
                label="Request Amount"
                placeHolder="0.00"
                InputBlur={async () => {
                  if (!requestChargeInfo) return;
                  if (amt) {
                    try {
                      const response = await ChargeInfo(requestChargeInfo);
                      console.log("ChargeInfo", response);
                      setChargeData(response?.apiResponseData?.data);
                      const totalFee =
                        response?.apiResponseData?.data?.total_fee;
                      setValue(
                        "charges",
                        totalFee ? parseFloat(totalFee).toFixed(2) : ""
                      );
                    } catch (error) {
                      console.error("Error during mutation:", error);
                    }
                  }
                }}
              >
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                  ₹
                </span>
              </InputField>
            </div>

            {/* Charges */}
            <div className="flex flex-col gap-y-1 w-full">
              <InputField
                control={control}
                names="charges"
                type="number"
                label="Charges"
                placeHolder="Charge Value"
                disabled
              >
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                  ₹
                </span>
              </InputField>
            </div>
          </div>

          <div className="mt-2 text-sm text-gray-500 ">
            {amt && (
              <span>
                {toWords(amt)} {" Rupees only"}
              </span>
            )}
          </div>
          <div className=" grid grid-cols-2 gap-2 mt-4">
            {chargeData && (
              <>
                <FeeBox
                  title="Load Amount"
                  value={chargeData?.request_amount}
                />
                <FeeBox title="Credit Amount" value={chargeData?.finalAmount} />
              </>
            )}
          </div>
          {/* Action Buttons */}
          <div className="mt-6 mb-12 flex items-center justify-end space-x-4">
            <button
              type="button"
              className="px-6 py-2.5 bg-[#800505] text-white text-sm font-medium rounded-lg hover:bg-opacity-90 transition-all duration-200 shadow-lg shadow-indigo-200"
              onClick={() => {
                reset({
                  radio: "visa",
                  gateway: "",
                  requestAmt: "",
                  charges: "",
                });
                setChargeData(null);
              }}
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={!chargeData}
              className={clsx(
                "!px-6 !py-2.5 text-sm font-medium rounded-lg transition-all duration-200 shadow-lg",
                !chargeData
                  ? "bg-gray-400 text-gray-800 cursor-not-allowed shadow-none"
                  : "bg-[#4b5a9f] text-white hover:bg-opacity-90 shadow-indigo-200"
              )}
              onClick={onCreateOrder}
            >
              Proceed to Transfer
            </button>
          </div>
        </div>
      </div>
      {isLoading && <Loader message="Loading . . ." />}
      <PGModals
        title="Transaction Failed or cancelled."
        modalVisible={modalVisible}
        modalContent={modalContent}
        closeModal={handleClose}
        handlePrint={handlePrint}
      />
    </>
  );
};

export default RightSection;
