import BeneficiaryDetails from "@/components/BeneficiaryDetails";

interface IProps{
  senderData?: TODO
   senderDataFW: TODO
}

const FundWithdrawal = ({senderData, senderDataFW}:IProps) => {
  return <BeneficiaryDetails tableName="Select Account" senderData={senderData} senderDataFW={senderDataFW} />;
};
export default FundWithdrawal;
