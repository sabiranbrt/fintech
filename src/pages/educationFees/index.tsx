/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";

interface EducationFeesProps {
  senderData: any; 
}

const EducationFees: React.FC<EducationFeesProps> = ({ senderData }) => {
  return (
    <div>
      <h2>Education Fees Payment</h2>
      {senderData ? (
        <div>
          <p>Sender: {senderData.name || "Unknown"}</p>
        </div>
      ) : (
        <p>Loading sender details...</p>
      )}
    </div>
  );
};

export default EducationFees;
