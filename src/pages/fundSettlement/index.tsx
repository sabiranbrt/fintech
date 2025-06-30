import BeneficiaryDetails from "@/components/BeneficiaryDetails";
import EmptyMessage from "@/components/EmptyMessage";
import React from "react";

interface IProps {
  senderData: TODO;
}

const FundSettlement = ({ senderData }: IProps) => {
  return senderData ? (
    <BeneficiaryDetails
      tableName={"Select Beneficiary"}
      senderData={senderData}
    />
  ) : (
    <EmptyMessage />
  );
};

export default FundSettlement;
