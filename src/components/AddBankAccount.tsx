/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useDynamicMutation, useDynamicQuery } from "@/hooks/dynamicQuery";
import { RootState } from "@/redux/store";
import { getDynamicRequest } from "@/utils/dynamicRequest";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { IoClose } from "react-icons/io5";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import SubmitBtn from "./buttons/SubmitBtn";
import InputField from "./inputField";
import PassField from "./passfield";
import SelectCusOpt from "./selectCusOpt.tsx";
import SelectField from "./selectfield";

interface IProps {
  handleCancel: () => void;
  senderMobileNumber: string;
}

interface PennyDropResult {
  registeredName?: string;
  transID?: string;
  accountNo?: string;
  ifsc?: string;
  status?: string;
  isVerified?: boolean;
}

const AddBankAccount = ({ handleCancel, senderMobileNumber }: IProps) => {
  const { mutateAsync: pennyDropMutant } = useDynamicMutation<TODO>();
  const { mutateAsync: agentAccountMutant } = useDynamicMutation<TODO>();

  const [pennyDropResult, setPennyDropResult] =
    useState<PennyDropResult | null>(null);

  const {
    control,
    setValue,
    getValues,
    watch,
    formState: { errors },
  } = useForm<any>({
    mode: "onChange",
  });

  const bankDetails = watch("bankName");
  const accountNumber = watch("accountNumber1");

  useEffect(() => {
    if (bankDetails?.ifsc) {
      setValue("ifsc", bankDetails?.ifsc);
    }
  }, [bankDetails?.ifsc]);

  const { endpoints } = useSelector((state: RootState) => state.endPoints);
  const { selectedService } = useSelector((state: RootState) => state.service);

  const stepName = selectedService?.sequence?.[1];
  const pennyDropName = selectedService?.sequence?.find(
    (item) => item === "getPennyDrop"
  );
  const agentAccountName = selectedService?.sequence?.find(
    (item) => item === "getAgentAccount"
  );

  const request = getDynamicRequest(stepName ?? "", endpoints ?? {});
  const requestPennyDrop = getDynamicRequest(
    pennyDropName ?? "",
    endpoints ?? {},
    {
      bankIfsc: bankDetails?.ifsc,
      bankAccountNumber: getValues("accountNumber1"),
      mobileNumber: senderMobileNumber,
      senderMobileNumber: senderMobileNumber,
      type: "SENDER",
    }
  );
  
  const requestAgentAccount = getDynamicRequest(
    agentAccountName ?? "",
    endpoints ?? {},
    {
      accountName: pennyDropResult?.registeredName ?? "",
      accountNumber: getValues("accountNumber1"),
      accountIfsc: bankDetails?.ifsc,
      bankName: getValues("bankName")?.bankName,
      accountType: getValues("accountType"),
      accountRegisterFor: "",
      accountSupportingImage: "string",
    }
  );

  const { data, refetch } = useDynamicQuery<any>(request!, {
    enabled: !!request,
    queryKey: [stepName],
  });

  const bank = data?.apiResponseData?.data;
  // const { mutateAsync: agentAccountMutant } = useAgentAccount();

  const handlePennyVerified = async () => {
    if (!requestPennyDrop) return;
    try {
      const response = await pennyDropMutant(requestPennyDrop);
      const result = response?.apiResponseData?.data;
      setPennyDropResult({
        registeredName: result.registeredName,
        transID: result.transID,
        accountNo: result.accountNo,
        ifsc: result.ifsc,
        status: result.status,
        isVerified: result.status === "COMPLETED",
      });

      // Set the registeredName in accountNameAsPerBank field
      if (result.status === "COMPLETED" && result.registeredName) {
        setValue("accountNameAsPerBank", result.registeredName);
      }

      if (response?.apiResponseData?.responseCode === "401") {
        toast.error(response?.apiResponseData?.responseMessage);
      }
    } catch (err) {
      console.log("error", err);
    }
  };

  const handleAddBank = async () => {
    if (!requestAgentAccount) return;
    try {
      const response = await agentAccountMutant(requestAgentAccount);
      if (response?.apiResponseData?.responseCode === "401") {
        toast.error(response?.apiResponseData?.responseMessage);
      }
    } catch (err) {
      console.log("error", err);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-4xl relative">
        <button
          onClick={() => {
            handleCancel();
          }}
          className="absolute top-3 right-3 text-gray-600 hover:text-black"
        >
          <IoClose size={24} />
        </button>
        <h2 className="text-xl font-semibold mb-4">Add Bank Account</h2>

        <form className="space-y-4" autoComplete="off">
          <div className="flex flex-wrap md:flex-nowrap gap-16 items-start">
            <div className="flex flex-col gap-5 w-full justify-center">
              <div className="relative">
                <SelectCusOpt
                  control={control}
                  errors={errors}
                  names="bankName"
                  label={"Bank Name"}
                  disabled={false}
                  currentIndex={0}
                  optionsData={bank}
                  fetchData={refetch}
                />
              </div>
              <div className="relative mt-3">
                <PassField
                  control={control}
                  errors={errors}
                  names="accountNumber1"
                  label=" Account Number"
                  disablePaste
                  fieldType="number"
                  placeHolder="Account Number"
                  rules={{
                    required: "Account Number is required",
                    pattern: {
                      value: /^\d{8,18}$/,
                      message: "Account Number must be between 8 and 18 digits",
                    },
                  }}
                />
              </div>

              <div className="relative mt-3">
                <InputField
                  control={control}
                  errors={errors}
                  names="accountNameAsPerBank"
                  label="Name as per Bank"
                  placeHolder="Enter Name as per Bank"
                />
              </div>
            </div>

            <div className="flex flex-col gap-5 w-full justify-center">
              <div className="relative">
                <InputField
                  control={control}
                  errors={errors}
                  names="ifsc"
                  label="Bank IFSC"
                  placeHolder="Bank IFSC"
                  disabled={false}
                  message={"Update Your IFSC Code As Per Your Branch"}
                />
              </div>

              <div className="relative -mt-2">
                <InputField
                  control={control}
                  errors={errors}
                  names="accountNumber"
                  disablePaste
                  label="Confirm Account Number"
                  placeHolder="Confirm Account Number"
                  ActionFetch="true"
                  rules={{
                    validate: (value: string) =>
                      value === accountNumber || "Account numbers do not match",
                  }}
                  handleVerifyClick={handlePennyVerified}
                  isPennyDropVerified={pennyDropResult?.isVerified}
                  disabled={pennyDropResult?.isVerified}
                  txnId={pennyDropResult?.transID}
                  registeredName={pennyDropResult?.registeredName}
                />
              </div>

              <div>
                <SelectField
                  control={control}
                  errors={errors}
                  placeHolder="Select Account Type"
                  names="accountType"
                  label="Account Type"
                  options={[
                    {
                      label: "Current",
                      value: "current",
                      default: true,
                    },
                    { label: "Saving", value: "saving" },
                  ]}
                />
              </div>
            </div>
          </div>

          <div className="text-center">
            <SubmitBtn
              onClick={handleAddBank}
              isLoading={false}
              isPennyDropVerified={pennyDropResult?.isVerified ?? false}
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddBankAccount;
