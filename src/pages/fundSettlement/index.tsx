/* eslint-disable @typescript-eslint/no-explicit-any */
import BeneficiaryDetails from "@/components/BeneficiaryDetails";
import EmptyMessage from "@/components/EmptyMessage";
import React from "react";

interface IProps {
  senderData: any;
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
