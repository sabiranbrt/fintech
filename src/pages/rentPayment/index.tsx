/* eslint-disable @typescript-eslint/no-explicit-any */
import BeneficiaryDetails from "@/components/BeneficiaryDetails";

interface IProps {
  senderData: any;
}

const RentPayment = ({ senderData }: IProps) => {

  console.log("senderData",senderData)
  return senderData ? (
    <BeneficiaryDetails tableName={"Select Beneficiary"} senderData={senderData} />
  ) : (
    <p>Loading sender details...</p>
  );
};

export default RentPayment;
