import { formatDateTime } from "@/utils/formatDateDDMMYYYY";
import recentTranscation from "@/jsonDemo/transcationRecent.json"
// import Loader from "./LoaderComponent";
const RecentTransactionComponent = () => {
  const transactions = recentTranscation
  // const [transactions, setTransactions] = useState([]);
  // const [isLoading, setIsLoading] = useState(false);
  // const transactionTypes = {
  //   EP: "Express Payment",
  //   RP: "Rent Payment",
  //   LG: "Load Gateway",
  //   FT: "Fund Transfer",
  //   IC: "Ik Credit Pay",
  //   IP: "Ik Pay",
  //   CC: "Credit Card Bill Pay",
  //   FW: "Fund Withdrawal",
  // };
  // useEffect(() => {
  //   const fetchRecentTransactions = async () => {
  //     try {
  //       setIsLoading(true);
  //       const authToken = localStorage.getItem("authToken");
  //       const response = await axiosInstance.get("/transaction/recent", {
  //         headers: {
  //           includeUrn: true,
  //           authToken: authToken,
  //           "Content-Type": "application/json",
  //         },
  //       });
  //       const data = response.data.apiResponseData.data;

  //       if (Array.isArray(data)) {
  //         setTransactions(data);
  //       } else {
  //         console.error("Data is not an array:", data);
  //         setTransactions([]);
  //         // toast.error(message);
  //       }
  //     } catch (error) {
  //       console.error("Error fetching recent transactions:", error);
  //       setTransactions([]);
  //       toast.error("Error fetching recent transactions");
  //     } finally {
  //       setIsLoading(false);
  //     }
  //   };

  //   fetchRecentTransactions();
  // }, []);
  // const formatDate = (dateString) => {
  //   const date = new Date(dateString);
  //   const day = String(date.getDate()).padStart(2, "0");
  //   const month = String(date.getMonth() + 1).padStart(2, "0");
  //   const year = date.getFullYear();
  //   return `${day}-${month}-${year}`;
  // };
  return (
    <>
      {/* {isLoading && (
        <Loader
          message={"Please wait while the tranasaction are being displayed"}
        />
      )} */}
      <div className="overflow-x-auto min-w-full customTable h-96">
        {/* <p className='text-center mb-6 font-semibold text-primary-dark '>RECENT TRANSACTIONS</p> */}
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Transaction ID
              </th>
             {/*  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Payout Transaction ID
              </th> */}
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Transaction Type
              </th>
             {/*  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Order ID
              </th> */}
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Sender Number
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Beneficiary Account
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Load Amount
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Transfer Amount
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Charges
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Markup
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                RRN
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Bank Remarks
              </th>
            

              {/*  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Merchant Mobile</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sender Full Name</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Request Remarks</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Beneficiary Account Type</th>
            */}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {transactions.length > 0 ? (
              transactions.map((transaction, index) => (
                <tr key={index}>
                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {transaction.status === "SUCCESS" ? (
                      <span className="text-green-500 font-semibold">
                        Success
                      </span>
                    ) : transaction.status === "FAILED" ? (
                      <span className="text-red-500 font-semibold">Failed</span>
                    ) : (
                      <span className="text-orange-500 font-semibold">
                        Initiated
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDateTime(transaction.transDate)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {transaction.transactionID}
                  </td>
                 {/*  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {transaction?.payoutTranscationId || "-"}
                  </td> */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {/* {transactionTypes[transaction.transType] ||
                      transaction.transType} */}
                      {transaction.transType}
                  </td>
                  {/* <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {transaction.orderId}
                  </td> */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {transaction.senderNumber}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {transaction.beneficiaryAccount}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {transaction?.transType == "CC" ||
                    transaction?.transType == "EP" ||
                    transaction?.transType == "FW" ?
                  <>
                  -
                  </>:
                  <> 
                  {transaction.amount}
                  </>
                 
                  }
                 
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                   {/*  {transaction?.transType == "CC" ||
                    transaction?.transType == "RP" ||
                    transaction?.transType == "FW" ||
                    transaction?.transType == "EP"
                      ? transaction.amountToBene
                      : transaction.netAmount} */}
                        {transaction.payoutAmount}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {transaction.charge != null ? Number(transaction.charge).toFixed(2) : "0.00"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {transaction.markup != null ? Number(transaction.markup).toFixed(2) : "0.00"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {transaction.utrRRN}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {transaction.bankRemarks || "-"}
                  </td>
                 
                </tr>
              ))
            ) : (
              <tr>
                <td
                  // colSpan="12"
                  className="px-6 py-4 text-center text-sm text-gray-500"
                >
                  No transactions available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default RecentTransactionComponent;
