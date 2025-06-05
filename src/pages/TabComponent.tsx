import { useState } from "react";
import BeneficiaryForm from "../components/BeneficiaryForm";
import LoadWalletTab from "../components/loadWallet/loadWalletTab";
import SenderForm from "../components/SenderForm";
import AccountLedger from "./AccountLedger";
import ContactCard from "./ContactSupport";
import CreditCardBillPay from "./CreditCardBillPay";
import FormComponent from "./FormComponent";
import FundSettlementTab from "./fundSettlement/FundSettlementTab";
import FundWithdrawal from "./FundWithdrawl";
import TotalPayoutList from "./TotalPayoutList";
import TransactionComponent from "./TransactionTabs";

const TabComponent = () => {
  // const [registerByAadhar, setRegisterByAadhar] = useState(false);
  const [senderId, setSenderId] = useState(null);
  const [number, setNumber] = useState("");
  const [beneMobile, setBeneMobile] = useState("");
  return (
    <div className="w-full ">
      {activeForm ? (
        <>
          <div className=" mr-5 rounded-md w-full ">
            <div className="justify-center relative">
              <div
              // className={`relative min-h-16 flex items-center  ${
              //   selectedOption === "Register Sender" && "gap-[435px]"
              // } ${
              //   selectedOption === "Register Beneficiary" && "gap-[435px]"
              // } ${selectedOption === "Transactions" && "gap-[435px]"} `}
              >
                <button
                  //  onClick={onBackClick}
                  type="button"
                  onClick={() => {
                    window.location.reload();
                  }}
                  className={`absolute top-0 left-0 m-4 px-8 py-1 h-10 bg-secondary text-white rounded-md hover:bg-secondary-light transition-all duration-200 text-sm ml-0`}
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
                  Back
                </button>
                <div
                  className={`${activeForm === "expressPayment" && "ml-56"} 
                  ${activeForm === "creditCardBillPay" && "ml-56"} 
                  ${activeForm === "fundWithdrawal" && "ml-56"}
                  ml-2 w-full flex flex-row justify-center text-secondary-dark text-xl font-semibold`}
                >
                  {isRP ? (
                    "Rent Payment"
                  ) : (
                    <div>
                      {selectedOption === "Fund Withdrawal" ? (
                        "Fund Withdrawal"
                      ) : (
                        <>
                          {selectedOption === "Credit Card Bill Pay"
                            ? "Credit Card Bill Payment"
                            : selectedOption === "Express Payment"
                            ? "Fund Settlement"
                            : selectedOption}
                        </>
                      )}
                    </div>
                  )}
                </div>
              </div>
              <div></div>
            </div>
          </div>
        </>
      ) : (
        <div className="min-h-[100%]">
          <FormComponent
            senderData={senderData}
            setSenderData={setSenderData}
            setIsRP={setIsRP}
            isRP={isRP}
            chargeSlab={chargeSlab}
            verified={verified}
            setVerified={setVerified}
            handleRegisterBeneficiaryClick={handleRegisterBeneficiaryClick}
            searched={searched}
            setSearched={setSearched}
            setIsSenderRegistered={setIsSenderRegistered}
            setActiveForm={setActiveForm}
            setRegisterByAadhar={setRegisterByAadhar}
            registerByAadhar={registerByAadhar}
            formData={formData}
            setFormData={setFormData}
            userMobileNumber={userMobileNumber}
            setUserMobileNumber={setUserMobileNumber}
            onRegisterSenderClick={onRegisterSenderClick}
            selectedOption={selectedOption}
            setSelectedOption={setSelectedOption}
            handleOptionClick={handleOptionClick}
            activeForm={activeForm}
            setUserRegistered={setUserRegistered}
            userRegistered={userRegistered}
            senderId={senderId}
            setSenderId={setSenderId}
            beneMobile={beneMobile}
            setBeneMobile={setBeneMobile}
          />
        </div>
      )}
    </div>
  );
};
export default TabComponent;
