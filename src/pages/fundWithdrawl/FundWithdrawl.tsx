/* eslint-disable @typescript-eslint/no-explicit-any */
import BeneficiaryDetails from "@/components/BeneficiaryDetails";

interface IProps{
  senderData?: any
   senderDataFW: any
}

const FundWithdrawal = ({senderData, senderDataFW}:IProps) => {
  return <BeneficiaryDetails tableName="Select Account" senderData={senderData} senderDataFW={senderDataFW} />;
};
export default FundWithdrawal;
