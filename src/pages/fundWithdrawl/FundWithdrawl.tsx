import BeneficiaryDetails from "@/components/BeneficiaryDetails";
import SenderDetails from "./components/SenderDetails";

const FundWithdrawal = () => {
  return (
    <>
      {/* {isLoading && <Loader message={"Please wait.."} />} */}
      <div className="w-full flex gap-5 ">
        <div className="min-w-[247px] ">
          <div>
            <SenderDetails showBankAcc={false} />
          </div>
        </div>

        <div className="w-full">
          <BeneficiaryDetails />
        </div>
      </div>
    </>
  );
};
export default FundWithdrawal;
