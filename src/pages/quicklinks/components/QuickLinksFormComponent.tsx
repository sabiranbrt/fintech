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

const QuickLinksFormComponent = () => {
  const { selectedService, isText } = useSelector(
    (state: RootState) => state.service
  );

  const {
    control,
    formState: { errors },
  } = useForm<any>();

  return (
    <div className="flex flex-col ">
      <div>{selectedService || isText ? <BackButton /> : null}</div>
      {!isText ? (
        <div className="flex flex-row gap-4 h-full">
          <div className=" w-64">
            {selectedService?.label !== QuickLinksType.FW && (
              <form
                autoComplete="off"
                className="bg-white p-3 rounded-md w-full"
                onSubmit={() => {}}
              >
                <label className=" text-start text-md">
                  Enter Mobile Number
                </label>
                <div
                  className={`relative 
                  } rounded-lg h-9 w-full`}
                >
                  <Controller
                    control={control}
                    name="UserMobileNumber"
                    rules={{
                      required: "Mobile number is required",
                      pattern: {
                        value: /^[6-9]\d{0,9}$/,
                        message:
                          "Enter a valid 10-digit mobile number starting with 6-9.Mobile number must be exactly 10 digits",
                      },
                    }}
                    render={({ field }) => {
                      return (
                        <div>
                          <input
                            {...field}
                            name="UserMobileNumber"
                            type="numeric"
                            placeholder="Mobile Number"
                            className={`my-1 inner-content px-3 py-1 focus:outline-none text-sm w-full border-2 rounded-md `}
                            // readOnly={field.value.length === 10}
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
                      );
                    }}
                  />
                  {/* Refresh Icon */}
                  <button
                    type="button"
                    onClick={() => window.location.reload()}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
                    // disabled={userMobileNumber.length !== 10} // Disable if mobile number is less than 10 digits
                  >
                    <FaSyncAlt
                      size={16}
                      className="text-secondary-extra-dark"
                    />
                  </button>
                </div>
              </form>
            )}
            {selectedService?.label === QuickLinksType.CC ||
            selectedService?.label === QuickLinksType.FS ||
            selectedService?.label === QuickLinksType.FW ||
            selectedService?.label === QuickLinksType.RP ? (
              <SenderDetails showBankAcc={false} />
            ) : null}
          </div>
          <div className="flex-1">
            {selectedService?.label === QuickLinksType.FW ? (
              <FundWithdrawal />
            ) : selectedService?.label === QuickLinksType.CC ? (
              <CreditCardBill />
            ) : selectedService?.label === QuickLinksType.FS ? (
              <FundSettlement />
            ) : selectedService?.label === QuickLinksType.RP ? (
              <RentPayment />
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
