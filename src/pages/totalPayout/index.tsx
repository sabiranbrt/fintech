import { useState } from "react";
import { BsCashStack } from "react-icons/bs";
import { FaMoneyBillTransfer, FaRegCreditCard } from "react-icons/fa6";
import { HiBanknotes } from "react-icons/hi2";
import { PiHandWithdrawFill } from "react-icons/pi";
import TransactionCard from "./components/TranscationCard";

const TotalPayoutList = () => {
  const [data, setData] = useState({
     education_fees: {
      icon: BsCashStack,
      success: 0,
      failure: 0,
      totalAmount: 0,
    },
    credit_card_bill_payment: {
      icon: FaRegCreditCard,
      success: 0,
      failure: 0,
      totalAmount: 0,
    },
    fund_withdrawal: {
      icon: PiHandWithdrawFill,
      success: 0,
      failure: 0,
      totalAmount: 0,
    },
    rent_payment: { icon: HiBanknotes, success: 0, failure: 0, totalAmount: 0 },
    fund_settlement: { icon: FaMoneyBillTransfer, success: 0, failure: 0, totalAmount: 0 },
  });

  console.log("setData",setData)

  // const [isLoading, setIsLoading] = useState(false);

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const authToken = localStorage.getItem("authToken");
  //       if (!authToken) {
  //         console.error("Auth token is missing");
  //         toast.error("Auth token is missing");
  //         return;
  //       }
  
  //       setIsLoading(true);
  //       const response = await axiosInstance.get("/transaction/count", {
  //         headers: {
  //           includeUrn: true,
  //           authToken: authToken,
  //         },
  //       });
  
  //       const responseData = response?.data?.apiResponseData?.data;
  
  //       // Start by copying existing data
  //       const updatedData = { ...data };
  
  //       if (responseData) {
  //         Object.entries(updatedData).forEach(([key, value]) => {
  //           if (responseData[key]) {
  //             updatedData[key] = {
  //               ...value, // keep icon
  //               success: responseData[key]?.success || 0,
  //               failure: responseData[key]?.failure || 0,
  //               totalAmount: responseData[key]?.totalAmount || 0,
  //               initiated: responseData[key]?.initiated || 0,
  //               initiatedAmount: responseData[key]?.initiatedAmount || 0,
  //               amountPresent: responseData[key]?.amountPresent ?? false,
  //             };
  //           } else {
  //             // responseData has no entry for this key → keep default 0
  //             updatedData[key] = {
  //               ...value,
  //               success: 0,
  //               failure: 0,
  //               totalAmount: 0,
  //               initiated: 0,
  //               initiatedAmount: 0,
  //               amountPresent: false,
  //             };
  //           }
  //         });
  //       } else {
  //         // no data at all → reset everything to 0 manually
  //         Object.entries(updatedData).forEach(([key, value]) => {
  //           updatedData[key] = {
  //             ...value,
  //             success: 0,
  //             failure: 0,
  //             totalAmount: 0,
  //             initiated: 0,
  //             initiatedAmount: 0,
  //             amountPresent: false,
  //           };
  //         });
  //         toast.error("No data available");
  //       }
  
  //       setData(updatedData);
  //     } catch (error) {
  //       console.error("Error fetching data:", error);
  //     } finally {
  //       setIsLoading(false);
  //     }
  //   };
  
  //   fetchData();
  // }, []);
  
  

  // if (isLoading) {
  //   return <Loader message="please wait" />;
  // }

  return (
    <div className="p-6 bg-white shadow-md rounded-md">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pl-10">
        {Object.entries(data)
          .filter(([key]) => key !== "total_payout")
          .map(([key, value]) => (
            <TransactionCard
              key={key}
              title={key}
              data={value}
            />
          ))}
      </div>
    </div>
  );
};

export default TotalPayoutList;
