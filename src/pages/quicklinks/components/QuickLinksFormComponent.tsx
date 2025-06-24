/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import BackButton from "@/components/buttons/BackButton";
import EmptyMessage from "@/components/EmptyMessage";
import NoticeComponent from "@/components/NoticeComponent";
import { useDynamicMutation, useDynamicQuery } from "@/hooks/dynamicQuery";
import AccountLedger from "@/pages/accountLedger";
import CreditCardBill from "@/pages/creditCardBillPayment";
import EducationFees from "@/pages/educationFees";
import FundSettlement from "@/pages/fundSettlement";
import SenderDetails from "@/pages/fundWithdrawl/components/SenderDetails";
import FundWithdrawal from "@/pages/fundWithdrawl/FundWithdrawl";
import LoadWallet from "@/pages/loadWallet";
import RegisterBeneficiary from "@/pages/registerBeneficiary";
import ContactCard from "@/pages/relationshipManager";
import RentPayment from "@/pages/rentPayment";
import TotalPayoutList from "@/pages/totalPayout";
import TransactionsTabs from "@/pages/transaction";
import { RootState } from "@/redux/store";
import { QuickLinksType } from "@/types";
import { getDynamicRequest } from "@/utils/dynamicRequest";
import clsx from "clsx";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { FaSyncAlt } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import service from "@/jsonDemo/services.json";
import { setSelectedService } from "@/redux/slices/serviceSlice";
import Loader from "@/components/LoaderComponent";

interface FormData {
  mobileNumber: string;
}

const QuickLinksFormComponent = () => {
  const [senderData, setSenderData] = useState<any | null>(null);

  const { selectedService, isText } = useSelector(
    (state: RootState) => state.service
  );

  const { endpoints } = useSelector((state: RootState) => state.endPoints);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!selectedService) {
      const educationService = service.services.find(
        (service) =>
          service.type === "pgPayout" && service.label === "Education Fees"
      ) as any;
      if (educationService) {
        dispatch(setSelectedService(educationService));
      }
    }
  }, [selectedService]);

  const {
    control,
    formState: { errors },
    watch,
    handleSubmit,
    setError,
    setValue,
  } = useForm<FormData>({
    mode: "onChange",
  });

  const mobileNumber = watch("mobileNumber");
  const { mutate } = useDynamicMutation<any>();

  const stepName = selectedService?.sequence[0];

  const request = getDynamicRequest(stepName ?? "", endpoints ?? {}, {
    mobileNumber: mobileNumber,
  });

  const fetchSender = () => {
    if (!request?.url) return;

    mutate(request, {
      onSuccess: (data) => {
        setSenderData(data);
      },
      onError: () => {
        setSenderData(null);
      },
    });
  };

  // Handle form submission
  const onSubmit = (data: FormData) => {
    if (data.mobileNumber.length === 10 && !errors.mobileNumber) {
      fetchSender();
    }
  };

  useEffect(() => {
    if (mobileNumber?.length === 10 && !errors.mobileNumber) {
      fetchSender();
    } else {
      setSenderData(null);
    }
  }, [mobileNumber, errors.mobileNumber]);

  const { data, isLoading } = useDynamicQuery<any>(
    request ?? { url: "", method: "GET" },
    {
      queryKey: [stepName],
      enabled: !!request,
    }
  );

  const agentsDataForBeneficiary = data?.apiResponseData?.data;
  const agentsData = data?.apiResponseData?.data?.panCardData;
  const sendData = senderData?.apiResponseData?.data[0];

  if (isLoading) return <Loader />;

  return (
    <div className="flex flex-col h-full min-h-0">
      <div>
        {selectedService?.type !== "pgPayout" && (selectedService || isText) ? (
          <BackButton />
        ) : null}
      </div>
      {!isText ? (
        <div className="flex flex-row gap-4 h-full min-h-0">
          <div className="w-64 bg-white">
            {selectedService?.label !== QuickLinksType.FW && (
              <form
                autoComplete="off"
                className="p-3 rounded-md w-full"
                onSubmit={handleSubmit(onSubmit)}
              >
                <label className="text-start text-md">
                  Enter Mobile Number
                </label>
                <div className="relative rounded-lg h-9 w-full">
                  <Controller
                    control={control}
                    name="mobileNumber"
                    rules={{
                      required: "Mobile number is required",
                      validate: {
                        validFormat: (value) =>
                          /^[6-9]\d{0,9}$/.test(value) ||
                          "Enter a valid 10-digit mobile number starting with 6-9.",
                        noSixIdenticalDigits: (value) =>
                          !/(.)\1{5}/.test(value) ||
                          "Mobile number cannot have a sequence of the same 6 digits.",
                        notSixDigits: (value) =>
                          value.length !== 6 ||
                          "6-digit mobile numbers are not acceptable.",
                        exactTenDigits: (value) =>
                          value.length === 10 ||
                          "Mobile number must be exactly 10 digits.",
                      },
                    }}
                    render={({ field }) => (
                      <div>
                        <input
                          {...field}
                          type="tel"
                          value={field.value ?? ""}
                          readOnly={(field.value?.length ?? 0) === 10}
                          placeholder="Mobile Number"
                          className={clsx(
                            "my-1 inner-content px-3 py-1 focus:outline-none text-sm w-full border-2 rounded-md",
                            (field.value?.length ?? 0) === 10
                              ? "border border-gray-400 bg-gray-200"
                              : "border-gradient"
                          )}
                          onChange={(e) => {
                            const rawValue = e.target.value;
                            const cleanedValue = rawValue.replace(/\D/g, "");

                            if (
                              cleanedValue.length === 1 &&
                              !/^[6-9]$/.test(cleanedValue)
                            ) {
                              setError("mobileNumber", {
                                type: "manual",
                                message: "Mobile number must start with 6-9.",
                              });
                              return;
                            }

                            if (/(\d)\1{5}/.test(cleanedValue))
                              return field.onChange("");

                            if (cleanedValue.length <= 10) {
                              field.onChange(cleanedValue);
                            }
                          }}
                        />
                        {errors?.mobileNumber?.message && (
                          <div className="!mt-0.5 text-[10px] text-[#f94d44]">
                            <p>{String(errors.mobileNumber.message)}</p>
                          </div>
                        )}
                        <button
                          type="button"
                          onClick={() => {
                            setValue("mobileNumber", "");
                            setSenderData(null);
                          }}
                          className="absolute right-3 top-5 transform -translate-y-1/2"
                          disabled={(field.value?.length ?? 0) !== 10}
                        >
                          <FaSyncAlt
                            size={16}
                            className="text-secondary-extra-dark"
                          />
                        </button>
                      </div>
                    )}
                  />
                </div>
              </form>
            )}
            {selectedService?.label === QuickLinksType.CC ||
            selectedService?.label === QuickLinksType.FS ||
            selectedService?.label === QuickLinksType.RP ||
            selectedService?.type === "pgPayout" ? (
              <SenderDetails senderData={sendData} />
            ) : null}
            {selectedService?.label === QuickLinksType.FW && (
              <SenderDetails showBankAcc={false} senderData={agentsData} />
            )}
          </div>
          {senderData?.apiResponseData?.data === "" ? (
            <div className="flex-1 h-full min-h-0">
              <div className="text-red-500 text-md font-semibold my-10 text-center bg-background ">
                <div>Mobile number not found, kindly register yourself !</div>
              </div>
              <div className={`flex gap-12 justify-center`}>
                <button
                  onClick={() => {}}
                  className="bg-primary text-white py-2 px-4 rounded-md"
                  style={{
                    border: "3px solid transparent",
                    borderRadius: "8px", // Ensure border-radius is maintained
                    borderImage: "linear-gradient(45deg, #4b5a9f, #4fb5b7) 3",
                    backgroundClip: "border-box", // Keep the background clipped to the border
                    WebkitMaskImage: "linear-gradient(white, white)", // Fix for some browsers
                    boxShadow:
                      "rgba(0, 0, 0, 0.17) 0px -23px 25px 0px inset, rgba(0, 0, 0, 0.15) 0px -36px 30px 0px inset, rgba(0, 0, 0, 0.1) 0px -79px 40px 0px inset, rgba(0, 0, 0, 0.06) 0px 2px 1px, rgba(0, 0, 0, 0.09) 0px 4px 2px, rgba(0, 0, 0, 0.09) 0px 8px 4px, rgba(0, 0, 0, 0.09) 0px 16px 8px, rgba(0, 0, 0, 0.09) 0px 32px 16px",
                  }}
                >
                  Initiate KYC
                </button>
              </div>
            </div>
          ) : (
            <div className="flex-1 h-full min-h-0">
              {selectedService ? (
                selectedService.type === "pgPayout" ? (
                  <EducationFees senderData={sendData} />
                ) : selectedService.label === QuickLinksType.FW ? (
                  <FundWithdrawal senderDataFW={agentsDataForBeneficiary} />
                ) : selectedService.label === QuickLinksType.CC ? (
                  <CreditCardBill senderData={sendData} />
                ) : selectedService.label === QuickLinksType.FS ? (
                  <FundSettlement senderData={sendData} />
                ) : selectedService.label === QuickLinksType.RP ? (
                  <RentPayment senderData={sendData} />
                ) : selectedService.label ? (
                  <NoticeComponent />
                ) : (
                  <EmptyMessage />
                )
              ) : null}
            </div>
          )}
        </div>
      ) : (
        <>
          {isText === QuickLinksType.T ? (
            <TransactionsTabs />
          ) : isText === QuickLinksType.TP ? (
            <TotalPayoutList />
          ) : isText === QuickLinksType.AL ? (
            <AccountLedger />
          ) : isText === QuickLinksType.RM ? (
            <ContactCard />
          ) : isText === QuickLinksType.LW ? (
            <LoadWallet />
          ) : isText === QuickLinksType.RB ? (
            <RegisterBeneficiary />
          ) : null}
        </>
      )}
    </div>
  );
};

export default QuickLinksFormComponent;
