
import BeneficiaryDetails from "@/components/BeneficiaryDetails";
import NoticeComponent from "@/components/NoticeComponent";

interface EducationFeesProps {
  senderData: TODO;
}

const EducationFees = ({ senderData }: EducationFeesProps) => {
  return (
    <>
      {senderData ? (
        <BeneficiaryDetails
          tableName={"Select Beneficiary"}
          senderData={senderData}
        />
      ) : (
        <NoticeComponent />
      )}
    </>
  );
};

export default EducationFees;
