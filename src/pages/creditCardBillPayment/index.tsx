/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import BtnPrimary from "@/components/buttons/BtnPrimary";
import CustomPassField from "@/components/customPassField";
import EmptyMessage from "@/components/EmptyMessage";
import InputField from "@/components/inputField";
import PaymentModal from "@/components/paymentModal";
import SelectCusOpt from "@/components/selectCusOpt.tsx";
import { useDynamicQuery } from "@/hooks/dynamicQuery";
import { setFormSubmission } from "@/redux/slices/customFormSlice";
import { RootState } from "@/redux/store";
import { getDynamicRequest } from "@/utils/dynamicRequest";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";

interface IProps {
  senderData: any;
}

const CreditCardBillPayment = ({ senderData }: IProps) => {
  const [isModalOpen, setIsModalOpen] = useState("");

  const handleCancel = () => {
    setIsModalOpen("");
  };

  const dispatch = useDispatch();
  // Handle paste events

  const { endpoints } = useSelector((state: RootState) => state.endPoints);
  const { selectedService } = useSelector((state: RootState) => state.service);

  const stepName = selectedService?.sequence?.[1];

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<any>({
    mode: "onChange",
  });

  const onSubmit = (data: any) => {
    setIsModalOpen("creditCard");
    dispatch(
      setFormSubmission({
        value: data,
      })
    );
  };

  const bankDetails = watch("bankName");

  useEffect(() => {
    if (bankDetails?.ifsc) {
      setValue("IFSC", bankDetails.ifsc);
    }
  }, [bankDetails?.ifsc]);

  const request = getDynamicRequest(stepName ?? "", endpoints ?? {}, {
    type: selectedService?.alias,
    cardType: "credit",
    transferType: bankDetails?.mode,
  });

  const { data, refetch } = useDynamicQuery<any>(request!, {
    enabled: !!request,
    queryKey: [stepName],
  });

  const bank = data?.apiResponseData?.data;

  return (
    <>
      {senderData ? (
        <div className=" !p-4 bg-white w-full h-full">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-1 mt-2 relative">
              <SelectCusOpt
                names="bankName"
                control={control}
                errors={errors}
                label={"Bank Number"}
                rules={{ required: "Bank name is required" }}
                disabled={false}
                currentIndex={0}
                optionsData={bank}
                fetchData={refetch}
              />
            </div>

            <div className="mb-1">
              <InputField
                names="IFSC"
                control={control}
                errors={errors}
                rules={{ required: "IFSC Code is required" }}
                label="IFSC Code"
                maxLength={11}
                placeHolder="Enter IFSC Code"
              />
            </div>

            <div className="mb-1 relative">
              <CustomPassField
                names="cardAccount"
                control={control}
                errors={errors}
                fieldType="card"
                rules={{
                  required: "Card number is required",
                  pattern: {
                    value: /^\d{16}$/,
                    message: "Card number must be 16 digits",
                  },
                }}
                label="Card Account Number"
                placeHolder="XXXX XXXX XXXX XXXX"
              />
            </div>

            <div className="mb-1">
              <InputField
                control={control}
                errors={errors}
                rules={{
                  required: "Mobile number is required",
                  pattern: {
                    value: /^[6-9]\d{9}$/,
                    message: "Enter a valid 10-digit mobile number",
                  },
                }}
                names="mobileNumber"
                fieldType="number"
                maxLength={10}
                label="Mobile Number"
                placeHolder="Enter Mobile Number"
              />
            </div>
            <BtnPrimary title="Proceed" />
          </form>
          {isModalOpen === "creditCard" && (
            <PaymentModal
              handleCancel={handleCancel}
              bankDetails={bankDetails?.mode}
              senderData={senderData}
            />
          )}
        </div>
      ) : (
        <EmptyMessage />
      )}
    </>
  );
};

export default CreditCardBillPayment;
