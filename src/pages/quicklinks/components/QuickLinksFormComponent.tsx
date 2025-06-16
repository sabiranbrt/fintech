/* eslint-disable @typescript-eslint/no-explicit-any */
import BackButton from "@/components/buttons/BackButton";
import EmptyMessage from "@/components/EmptyMessage";
import NoticeComponent from "@/components/NoticeComponent";
import AccountLedger from "@/pages/accountLedger";
import CreditCardBill from "@/pages/creditCardBillPayment";
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
import { Controller, useForm } from "react-hook-form";
import { FaSyncAlt } from "react-icons/fa";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import axios from "axios"; // Assuming axios for API calls
import EducationFees from "@/pages/educationFees";

const QuickLinksFormComponent = () => {
  const { selectedService, isText } = useSelector(
    (state: RootState) => state.service
  );

  const {
    control,
    formState: { errors },
    watch,
  } = useForm<any>();

  const [senderData, setSenderData] = useState<any>(null); 
  const mobileNumber = watch("UserMobileNumber"); 

  const fetchSender = async (mobile: string) => {
    try {
      const response = await axios.post(
        "/api/v1/sender/getMobileNumber",
        {},
        { params: { mobileNumber: mobile } }
      );
      setSenderData(response.data); 
      return response.data;
    } catch (error) {
      console.error("Error fetching sender:", error);
      return null;
    }
  };

  // Handle logic after mobile number input
  useEffect(() => {
    if (mobileNumber?.length === 10 && !errors.UserMobileNumber) {
      if (selectedService?.type === "pgPayout") {
        fetchSender(mobileNumber);
      } else {
        setSenderData({ mobileNumber });
      }
    } else {
      setSenderData(null);
    }
  }, [mobileNumber, errors.UserMobileNumber, selectedService]);

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
                onSubmit={(e) => e.preventDefault()} // Prevent form submission
              >
                <label className="text-start text-md">Enter Mobile Number</label>
                <div className="relative rounded-lg h-9 w-full">
                  <Controller
                    control={control}
                    name="UserMobileNumber"
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
                          name="UserMobileNumber"
                          type="tel" // Changed to tel for mobile number
                          placeholder="Mobile Number"
                          className="my-1 inner-content px-3 py-1 focus:outline-none text-sm w-full border-2 rounded-md"
                          onChange={(e) => {
                            const value = e.target.value.replace(/\D/g, "");
                            if (value.length <= 10) {
                              field.onChange(value);
                            }
                          }}
                          value={field.value || ""}
                        />
                        {errors?.UserMobileNumber?.message && (
                          <div className="!mt-0.5 text-[10px] text-[#f94d44]">
                            <p>{String(errors.UserMobileNumber.message)}</p>
                          </div>
                        )}
                      </div>
                    )}
                  />
                  <button
                    type="button"
                    onClick={() => window.location.reload()}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
                  >
                    <FaSyncAlt size={16} className="text-secondary-extra-dark" />
                  </button>
                </div>
              </form>
            )}
            {selectedService?.label === QuickLinksType.CC ||
            selectedService?.label === QuickLinksType.FS ||
            selectedService?.label === QuickLinksType.FW ||
            selectedService?.label === QuickLinksType.RP ? (
              <SenderDetails showBankAcc={false} senderData={senderData} /> 
            ) : null}
          </div>
          <div className="flex-1 h-full min-h-0">
            {selectedService?.label === QuickLinksType.FW ? (
              <FundWithdrawal />
            ) : selectedService?.label === QuickLinksType.CC ? (
              <CreditCardBill senderData={senderData} /> 
            ) : selectedService?.label === QuickLinksType.FS ? (
              <FundSettlement senderData={senderData} />
            ) : selectedService?.label === QuickLinksType.RP ? (
              <RentPayment senderData={senderData} />
            ) : selectedService?.label === QuickLinksType.EF ? (
              // Render Education Fees component (assuming it exists)
              senderData ? (
                <EducationFees senderData={senderData} />
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