import BeneficiaryDetails from "@/components/BeneficiaryDetails";
import EmptyMessage from "@/components/EmptyMessage";

interface IProps {
  senderData: TODO;
}

const RentPayment = ({ senderData }: IProps) => {
  return senderData ? (
    <BeneficiaryDetails
      tableName={"Select Beneficiary"}
      senderData={senderData}
    />
  ) : (
    <EmptyMessage />
  );
};

export default RentPayment;
