/* eslint-disable @typescript-eslint/no-explicit-any */
import EmptyMessage from "@/components/EmptyMessage";
import NoticeComponent from "@/components/NoticeComponent";
import AccountLedger from "@/pages/accountLedger";
import CreditCardBill from "@/pages/creditCardBillPayment";
import FundSettlement from "@/pages/fundSettlement";
import SenderDetails from "@/pages/fundWithdrawl/components/SenderDetails";
import FundWithdrawal from "@/pages/fundWithdrawl/FundWithdrawl";
import ContactCard from "@/pages/relationshipManager";
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

  const isFundWithdrawal = selectedService?.label === QuickLinksType.FW;

  return (
    <>
      {!isText ? (
        <div className="flex flex-row gap-4">
          {!isFundWithdrawal ? (
            <div>
              <form
                autoComplete="off"
                className={`bg-white w-60 p-3 rounded-md`}
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
              {selectedService?.label === QuickLinksType.CC || selectedService?.label === QuickLinksType.FS ? (
                <div className="mt-4">
                  <SenderDetails showBankAcc={false} />
                </div>
              ) : null}
            </div>
          ) : null}

          {isFundWithdrawal ? (
            <FundWithdrawal />
          ) : selectedService?.label === QuickLinksType.CC ? (
            <CreditCardBill />
          ) : selectedService?.label  === QuickLinksType?.FS? (
            <FundSettlement />
          ) : selectedService?.label ? <EmptyMessage/> : <NoticeComponent/>}
        </div>
      ) : (
        <>
          {isText === QuickLinksType.T ? (
            <TransactionsTabs />
          ) : isText === QuickLinksType.TP ? (
            <TotalPayoutList />
          ) : isText === QuickLinksType?.AL ? (
            <AccountLedger />
          ) : isText === QuickLinksType?.RM ? (
            <ContactCard />
          ) : null}
        </>
      )}
    </>
  );
};

export default QuickLinksFormComponent;
