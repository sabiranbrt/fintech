import { useState } from "react";
import RecentTransactionComponent from "./components/RecentTransactionComponent";
import DetailedTransactionComponent from "./components/DetailedTransactionComponent";

const TransactionsTabs = () => {
  const [activeTab, setActiveTab] = useState("recent"); // 'recent' is set by default

  // useEffect(() => {
  //   if (activeForm === "sender") {
  //     setSelectedOption("Register Sender");
  //   } else if (activeForm === "transactions") {
  //     setSelectedOption("Transactions");
  //   }
  // }, [activeForm]);
  // useEffect(() => {
  //   console.log("activeTab:", activeTab); // Log activeTab state changes
  // }, [activeTab]);

  return (
    <>
      <div className="flex justify-start gap-1">
        <button
          className={`px-4 py-2 text-sm font-medium ${activeTab === "recent"
              ? "bg-secondary text-white"
              : "bg-primary text-white"
            }`}
          onClick={() => setActiveTab("recent")}
          style={{
            pointerEvents: "auto",
            border: "3px solid transparent",
            borderRadius: "8px", // Ensure border-radius is maintained
            borderImage: "linear-gradient(45deg, #4b5a9f, #4fb5b7) 3",
            backgroundClip: "border-box", // Keep the background clipped to the border
            WebkitMaskImage: "linear-gradient(white, white)", // Fix for some browsers
            boxShadow:
              "rgba(0, 0, 0, 0.17) 0px -23px 25px 0px inset, rgba(0, 0, 0, 0.15) 0px -36px 30px 0px inset, rgba(0, 0, 0, 0.1) 0px -79px 40px 0px inset, rgba(0, 0, 0, 0.06) 0px 2px 1px, rgba(0, 0, 0, 0.09) 0px 4px 2px, rgba(0, 0, 0, 0.09) 0px 8px 4px, rgba(0, 0, 0, 0.09) 0px 16px 8px, rgba(0, 0, 0, 0.09) 0px 32px 16px",
          }}
        >
          Recent Transactions
        </button>
        <button
          className={`px-4 py-2 text-sm font-medium ${activeTab === "detailed"
              ? "bg-secondary text-white"
              : "bg-primary text-white"
            }`}
          onClick={() => setActiveTab("detailed")}
          style={{
            pointerEvents: "auto",
            border: "3px solid transparent",
            borderRadius: "8px", // Ensure border-radius is maintained
            borderImage: "linear-gradient(45deg, #4b5a9f, #4fb5b7) 3",
            backgroundClip: "border-box", // Keep the background clipped to the border
            WebkitMaskImage: "linear-gradient(white, white)", // Fix for some browsers
            boxShadow:
              "rgba(0, 0, 0, 0.17) 0px -23px 25px 0px inset, rgba(0, 0, 0, 0.15) 0px -36px 30px 0px inset, rgba(0, 0, 0, 0.1) 0px -79px 40px 0px inset, rgba(0, 0, 0, 0.06) 0px 2px 1px, rgba(0, 0, 0, 0.09) 0px 4px 2px, rgba(0, 0, 0, 0.09) 0px 8px 4px, rgba(0, 0, 0, 0.09) 0px 16px 8px, rgba(0, 0, 0, 0.09) 0px 32px 16px",
          }}
        >
          Detailed Transactions
        </button>
      </div>

      <div className="mt-4 ">
        {activeTab === "recent" && <RecentTransactionComponent />}
        {activeTab === "detailed" && <DetailedTransactionComponent />}
      </div>
    </>
  );
};

export default TransactionsTabs;
