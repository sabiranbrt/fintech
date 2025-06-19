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
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { FaSyncAlt } from "react-icons/fa";
import { useSelector } from "react-redux";

interface FormData {
  mobileNumber: string;
}

const QuickLinksFormComponent = () => {
  const [senderData, setSenderData] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const sendData = senderData?.apiResponseData?.data[0];

  const { selectedService, isText } = useSelector(
    (state: RootState) => state.service
  );

  const { endpoints } = useSelector((state: RootState) => state.endPoints);

  const {
    control,
    formState: { errors },
    watch,
    handleSubmit,
    setValue,
  } = useForm<FormData>();

  const mobileNumber = watch("mobileNumber");
  const { mutate } = useDynamicMutation<any>();
  
  const stepName = selectedService?.sequence[0];
  const request = getDynamicRequest(
    stepName ?? "",
    endpoints ?? {},{mobileNumber: mobileNumber }
  );

  const fetchSender = () => {
    setIsLoading(true);
    mutate(request ?? { url: "", method: "GET" }, {
      onSuccess: (data: any) => {
        console.log("Mutation success:", data);
        setSenderData(data);
        setIsLoading(false);
      },
      onError: (err: any) => {
        console.error("Mutation error:", err);
        setSenderData(null);
        setIsLoading(false);
      },
    });
  };

  // Handle form submission
  const onSubmit = (data: FormData) => {
    if (data.mobileNumber?.length === 10 && !errors.mobileNumber) {
      if (selectedService?.type === "pgPayout") {
        setSenderData({ mobileNumber: data.mobileNumber });
        fetchSender();
      } else {
        setSenderData({ mobileNumber: data.mobileNumber });
        fetchSender();
      }
    }
  };

  useEffect(() => {
    if (mobileNumber?.length === 10 && !errors.mobileNumber) {
      if (selectedService?.type === "pgPayout") {
        setSenderData({ mobileNumber });
        fetchSender();
      } else {
        setSenderData({ mobileNumber });
        fetchSender();
      }
    } else {
      setSenderData(null);
    }
  }, [mobileNumber, errors.mobileNumber, selectedService]);

  const { data } = useDynamicQuery<any>(request ?? { url: "", method: "GET" }, {
    queryKey: [stepName],
    enabled: !!request,
  });

  const agentsDataForBeneficiary = data?.apiResponseData?.data;
  const agentsData = data?.apiResponseData?.data?.panCardData;
  
  return (
    <div className="flex flex-col h-full min-h-0">
      <div>{selectedService || isText ? <BackButton /> : null}</div>
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
                      pattern: {
                        value: /^[6-9]\d{9}$/,
                        message:
                          "Enter a valid 10-digit mobile number starting with 6-9.",
                      },
                    }}
                    render={({ field }) => (
                      <div>
                        <input
                          {...field}
                          type="tel"
                          placeholder="Mobile Number"
                          className="my-1 inner-content px-3 py-1 focus:outline-none text-sm w-full border-2 rounded-md"
                          onChange={(e) => {
                            const value = e.target.value.replace(/\D/g, "");
                            console.log("Input value:", value);
                            if (value.length <= 10) {
                              field.onChange(value);
                            }
                          }}
                          value={field.value || ""}
                        />
                        {errors?.mobileNumber?.message && (
                          <div className="!mt-0.5 text-[10px] text-[#f94d44]">
                            <p>{String(errors.mobileNumber.message)}</p>
                          </div>
                        )}
                      </div>
                    )}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setValue("mobileNumber", "");
                      setSenderData(null);
                    }}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
                  >
                    <FaSyncAlt
                      size={16}
                      className="text-secondary-extra-dark"
                    />
                  </button>
                </div>
              </form>
            )}
            {isLoading && <p>Loading sender data...</p>}
            {senderData === null &&
              mobileNumber?.length === 10 &&
              !errors.mobileNumber &&
              !isLoading && (
                <p className="text-red-500">
                  Failed to fetch sender data. Please try again.
                </p>
              )}

            {selectedService?.label === QuickLinksType.CC ||
            selectedService?.label === QuickLinksType.FS ||
            selectedService?.label === QuickLinksType.RP ? (
              <SenderDetails senderData={sendData} />
            ) : null}
            {selectedService?.label === QuickLinksType.FW && (
              <SenderDetails showBankAcc={false} senderData={agentsData} />
            )}
            
          </div>
          <div className="flex-1 h-full min-h-0">
            {selectedService?.label === QuickLinksType.FW ? (
              <FundWithdrawal  senderDataFW={agentsDataForBeneficiary}/>
            ) : selectedService?.label === QuickLinksType.CC ? (
              <CreditCardBill senderData={sendData} />
            ) : selectedService?.label === QuickLinksType.FS ? (
              <FundSettlement senderData={sendData} />
            ) : selectedService?.label === QuickLinksType.RP ? (
              <RentPayment senderData={sendData} />
            ) : selectedService?.label === QuickLinksType.EF ? (
              senderData ? (
                <EducationFees senderData={sendData} />
              ) : (
                <EmptyMessage />
              )
            ) : selectedService?.label ? (
              <EmptyMessage />
            ) : (
              <NoticeComponent />
            )}
          </div>
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
