/* eslint-disable @typescript-eslint/no-explicit-any */
import BeneficiaryDetails from "@/components/BeneficiaryDetails";
import React from "react";

interface IProps {
  senderData: any;
}

const FundSettlement = ({senderData}:IProps) => {
  return senderData? <BeneficiaryDetails tableName={"Select Beneficiary"} senderData={senderData} />:<p>Loading sender details...</p>
};

export default FundSettlement;
