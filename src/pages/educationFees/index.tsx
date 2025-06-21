/* eslint-disable @typescript-eslint/no-explicit-any */

import BeneficiaryDetails from "@/components/BeneficiaryDetails";
import NoticeComponent from "@/components/NoticeComponent";

interface EducationFeesProps {
  senderData: any;
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
