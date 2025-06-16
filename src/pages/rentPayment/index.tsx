/* eslint-disable @typescript-eslint/no-explicit-any */
import BeneficiaryDetails from "@/components/BeneficiaryDetails";

interface IProps {
  senderData: any;
}

const RentPayment = ({ senderData }: IProps) => {
  return senderData ? (
    <BeneficiaryDetails tableName={"Select Beneficiary"} />
  ) : (
    <p>Loading sender details...</p>
  );
};

export default RentPayment;
