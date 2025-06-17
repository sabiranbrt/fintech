/* eslint-disable @typescript-eslint/no-explicit-any */
import BtnPrimary from "@/components/buttons/BtnPrimary";
import CustomPassField from "@/components/customPassField";
import InputField from "@/components/inputField";
import SelectCusOpt from "@/components/selectCusOpt.tsx";
import { useDynamicQuery } from "@/hooks/dynamicQuery";
import { setFormSubmission } from "@/redux/slices/customFormSlice";
import { RootState } from "@/redux/store";
import { getDynamicRequest } from "@/utils/dynamicRequest";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";

interface IProps {
  senderData: any;
}

const CreditCardBillPayment = ({ senderData }: IProps) => {
  const dispatch = useDispatch();
  // Handle paste events

  const { endpoints } = useSelector((state: RootState) => state.endPoints);
  const { selectedService } = useSelector((state: RootState) => state.service);
  const { value } = useSelector((state: RootState) => state.form);

  const stepName = selectedService?.sequence?.[1];
  const request = getDynamicRequest(stepName ?? "", endpoints ?? {});

  const { data, refetch } = useDynamicQuery<any>(request!, {
    enabled: !!request,
    queryKey: [stepName],
  });

  const bank = data?.apiResponseData?.data;

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<any>({
    mode: "onChange",
  });

  const onSubmit = (data: any) => {
    dispatch(
      setFormSubmission({
        value: data,
      })
    );
  };

  const formatAccountNumber = (value: string) => {
    if (!value) return "";

    // Remove all non-digit characters
    const cleaned = value.replace(/\D/g, "");

    // Split into chunks of max 4 digits
    const groups = cleaned.match(/.{1,4}/g);

    // Join with space
    return groups ? groups.join(" ") : "";
  };

  
  const iFSCvalue = watch("bankName")
  console.log("iFSCvalue", iFSCvalue); 

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
                rules={{
                  required: "Card number is required",
                }}
                label="Card Account Number"
                placeHolder="XXXX XXXX XXXX XXXX"
                onChange={(rawValue: string) => {
                  const formattedValue = formatAccountNumber(rawValue);
                  setValue("cardAccount", formattedValue);
                }}
              />
            </div>

            <div className="mb-1">
              <InputField
                control={control}
                errors={errors}
                rules={{ required: "Mobile number is required" }}
                type="number"
                names="mobileNumber"
                label="Mobile Number"
                placeHolder="Enter Mobile Number"
              />
            </div>
            <BtnPrimary title="Proceed" />
          </form>
        </div>
      ) : (
        <p>Loading sender details...</p>
      )}
    </>
  );
};

export default CreditCardBillPayment;
