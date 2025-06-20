/* eslint-disable @typescript-eslint/no-explicit-any */

interface EducationFeesProps {
  senderData: any; 
}

const EducationFees = ({ senderData }:EducationFeesProps) => {
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
