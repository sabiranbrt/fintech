/* eslint-disable @typescript-eslint/no-explicit-any */
import FeeBox from "@/components/feeBox";
import InputField from "@/components/inputField";
import RadioButton from "@/components/radioButton";
import SelectField from "@/components/selectfield";
import { useChargeInfo, useCreateOrder } from "@/hooks/service";
import getSlab from "@/jsonDemo/getSlab.json";
import { setValues } from "@/redux/slices/singleValueSlice";
import clsx from "clsx";
import { toWords } from "number-to-words";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import PGModals from "./PGModals";
import LocalStorageUtil from "@/utils/LocalStorageUtil";
import { decryptData3Des } from "@/utils/3desEncrypt";

interface IProps {
  slablist: any;
}

interface ChargeData {
  [key: string]: any;
}
interface OrderResponse {
  providerId: number;
  invoiceID: string;
  accessToken: string;
  pgOrderID: number;
  platform: string;
  token: string;
}

const RightSection = ({ slablist }: IProps) => {
  // order Api hooks call
  const { mutateAsync: createOrder } = useCreateOrder();

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
  } = useForm<any>({
    mode: "onChange",
  });

  const amt = watch("requestAmt");
  const getTypes = watch("radio") || "visa";
  const getGateway = watch("gateway");

  const slab = slablist;

  const { mutateAsync } = useChargeInfo();

  const onCreateOrder = async () => {
    const body = {
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
    };
    if (!chargeData) {
      alert("Please fill in all required fields and fetch charge details.");
      return;
    }
    try {
      const response = await createOrder(body);
      if (
        response.data.apiResponseCode === "200" &&
        response.data.apiResponseData.responseCode === "200"
      ) {
        const responseData = response.data.apiResponseData.data;
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
        console.error(
          "Failed to create order:",
          response.data.apiResponseMessage
        );
      }
    } catch (err) {
      console.log("error", err);
    }
  };

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
                { value: "visa", label: "VISA", default: true },
                { value: "masterCard", label: "MASTER CARD" },
                { value: "Rupay", label: "RUPAY", disable: true },
              ]}
            />
          </div>
          <div className="mt-2">
            <SelectField
              label="Gateway Preferences"
              control={control}
              placeHolder="Select"
              names="gateway"
              options={getSlab?.gatewayPreferences}
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
                  dispatch(setValues(getTypes));
                  if (amt) {
                    try {
                      const response = await mutateAsync({
                        amount: amt,
                        selectedCardType: getTypes,
                        selectedGateway: getGateway,
                      });
                      setChargeData(response?.data?.apiResponseData?.data);
                      const totalFee =
                        response?.data?.apiResponseData?.data?.total_fee;
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
            {amt && (
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

      <PGModals
        modalVisible={modalVisible}
        modalContent={modalContent}
        closeModal={handleClose}
        handlePrint={handlePrint}
      />
    </>
  );
};

export default RightSection;
