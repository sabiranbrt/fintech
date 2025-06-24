/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import InputField from "@/components/inputField";
import RadioButton from "@/components/radioButton";
import SelectField from "@/components/selectfield";
import { useChargeInfo } from "@/hooks/service";
import getSlab from "@/jsonDemo/getSlab.json";
import { setValue } from "@/redux/slices/singleValueSlice";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";

interface IProps {
  slablist: any;
}

const RightSection = ({ slablist }: IProps) => {
  const [requestAmount, setRequestAmount] = useState<string>("");

  const dispatch = useDispatch();

  const {
    control,
    watch,
    formState: { errors },
  } = useForm<any>({
    mode: "onChange",
  });

  const getTypes = watch("radio") || "visa";
  const getGateway = watch("gateway");

  const slab = slablist?.apiReponseData?.data;
  const { mutateAsync } = useChargeInfo();

  useEffect(() => {
    dispatch(setValue(getTypes));
    const fetchData = async () => {
      try {
        const response = await mutateAsync({
          amount: requestAmount,
          selectedCardType: getTypes,
          selectedGateway: getGateway,
        });
        console.log("response", response);
      } catch (error) {
        console.error("Error during mutation:", error);
      }
    };

    if (requestAmount) {
      fetchData();
    }
  }, [requestAmount]);

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
                onChange={(value) => {
                  setRequestAmount(value || "");
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
                // value={
                //   chargeDetail?.totalCharge
                //     ? parseFloat(chargeDetail.totalCharge).toFixed(2)
                //     : ""
                // }
                disabled
                InputBlur={() => {}}
              >
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                  ₹
                </span>
              </InputField>
            </div>
          </div>

          {/* Last 6 Digits of Your Card */}
          <div className="w-full flex flex-col mt-1 gap-y-1">
            <InputField
              wrapBorder
              type="number"
              control={control}
              names="cardDigit"
              label="First 6 Digits of Your Card"
              maxLength={6}
              placeHolder="XXXX XX"
            />
          </div>

          {/* Action Buttons */}
          <div className="mt-6 mb-12 flex items-center justify-end space-x-4">
            <button
              type="button"
              className="px-6 py-2.5 bg-[#800505] text-white text-sm font-medium rounded-lg hover:bg-opacity-90 transition-all duration-200 shadow-lg shadow-indigo-200"
              onClick={() => {}}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>

      {/* <PGModals
        modalVisible={modalVisible}
        modalContent={modalContent}
        closeModal={closeModal}
        handlePrint={handlePrint}
      /> */}
    </>
  );
};

export default RightSection;
