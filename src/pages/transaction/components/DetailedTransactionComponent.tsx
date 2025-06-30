/* eslint-disable @typescript-eslint/no-unused-vars */
import Loader from "@/components/LoaderComponent";
import { useTransaction } from "@/hooks/service";
import { generateRandom13DigitNumber } from "@/libs/axios";
import { formatDateTime } from "@/utils/formatDateDDMMYYYY";
import axios from "axios";
import { useEffect, useState } from "react";
import { ImCross } from "react-icons/im";
import { toast } from "react-toastify";

const DetailedTransactionComponent = () => {
  const today = new Date().toISOString().split("T")[0];
  const [startDate, setStartDate] = useState(today);
  const [endDate, setEndDate] = useState(today);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [modalContent, setModalContent] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  const handleDateChange = () => {
    if (startDate && endDate) {
      // fetchTransactions(0); // Reset to the first page on date change
    } else {
      setError("  Please select both start and end dates.");
    }
  };

  // const formatDate = (dateString) => {
  //   const date = new Date(dateString);
  //   const day = String(date.getDate()).padStart(2, "0");
  //   const month = String(date.getMonth() + 1).padStart(2, "0");
  //   const year = date.getFullYear();
  //   return `${day}-${month}-${year}`;
  // };

  // const renderPagination = () => {
  //   const pages = [];

  //   // First page button
  //   pages.push(
  //     <button
  //       key={0}
  //       onClick={() => handlePageChange(0)}
  //       className={`px-3 py-1 mx-1 rounded ${
  //         currentPage === 0
  //           ? "bg-blue-500 text-white"
  //           : "bg-gray-300 text-gray-700"
  //       }`}
  //     >
  //       1
  //     </button>
  //   );

  //   // Add ellipses before currentPage if currentPage is beyond page 2
  //   if (currentPage > 2) {
  //     pages.push(
  //       <span key="ellipsis-prev" className="px-3 py-1 mx-1">
  //         ...
  //       </span>
  //     );
  //   }

  //   // Display previous page if currentPage > 1 and not near the beginning
  //   if (currentPage > 1) {
  //     pages.push(
  //       <button
  //         key={currentPage - 1}
  //         onClick={() => handlePageChange(currentPage - 1)}
  //         className="px-3 py-1 mx-1 bg-gray-300 text-gray-700 rounded"
  //       >
  //         {currentPage}
  //       </button>
  //     );
  //   }

  //   // Display current page button
  //   if (currentPage > 0 && currentPage < totalPages - 1) {
  //     pages.push(
  //       <button
  //         key={currentPage}
  //         onClick={() => handlePageChange(currentPage)}
  //         className="px-3 py-1 mx-1 bg-blue-500 text-white rounded"
  //       >
  //         {currentPage + 1}
  //       </button>
  //     );
  //   }

  //   // Display next page if currentPage is before the last two pages
  //   if (currentPage < totalPages - 2) {
  //     pages.push(
  //       <button
  //         key={currentPage + 1}
  //         onClick={() => handlePageChange(currentPage + 1)}
  //         className="px-3 py-1 mx-1 bg-gray-300 text-gray-700 rounded"
  //       >
  //         {currentPage + 2}
  //       </button>
  //     );
  //   }

  //   // Add ellipses after currentPage if not near the end
  //   if (currentPage < totalPages - 3) {
  //     pages.push(
  //       <span key="ellipsis-next" className="px-3 py-1 mx-1">
  //         ...
  //       </span>
  //     );
  //   }

  //   // Last page button
  //   if (totalPages > 1) {
  //     pages.push(
  //       <button
  //         key={totalPages - 1}
  //         onClick={() => handlePageChange(totalPages - 1)}
  //         className={`px-3 py-1 mx-1 rounded ${
  //           currentPage === totalPages - 1
  //             ? "bg-blue-500 text-white"
  //             : "bg-gray-300 text-gray-700"
  //         }`}
  //       >
  //         {totalPages}
  //       </button>
  //     );
  //   }

  //   return (
  //     <div className="flex items-center justify-center mt-4 mb-4">
  //       <button
  //         onClick={() => handlePageChange(currentPage - 1)}
  //         disabled={currentPage === 0}
  //         className="px-8 py-1 mx-1 bg-gray-300 text-gray-700 rounded disabled:opacity-50 text-sm"
  //         style={{
  //           borderRadius: "8px", // Ensure border-radius is maintained
  //           borderImage: "linear-gradient(45deg, #4b5a9f, #4fb5b7) 3",
  //           backgroundClip: "border-box", // Keep the background clipped to the border
  //           WebkitMaskImage: "linear-gradient(white, white)", // Fix for some browsers
  //           boxShadow:
  //             "rgba(0, 0, 0, 0.17) 0px -23px 25px 0px inset, rgba(0, 0, 0, 0.15) 0px -36px 30px 0px inset, rgba(0, 0, 0, 0.1) 0px -79px 40px 0px inset, rgba(0, 0, 0, 0.06) 0px 2px 1px, rgba(0, 0, 0, 0.09) 0px 4px 2px, rgba(0, 0, 0, 0.09) 0px 8px 4px, rgba(0, 0, 0, 0.09) 0px 16px 8px, rgba(0, 0, 0, 0.09) 0px 32px 16px",
  //         }}
  //       >
  //         Previous
  //       </button>
  //       {pages}
  //       <button
  //         onClick={() => handlePageChange(currentPage + 1)}
  //         disabled={currentPage === totalPages - 1}
  //         className="px-10 py-1 mx-1 bg-gray-300 text-gray-700 rounded disabled:opacity-50 text-sm"
  //         style={{
  //           borderRadius: "8px", // Ensure border-radius is maintained
  //           borderImage: "linear-gradient(45deg, #4b5a9f, #4fb5b7) 3",
  //           backgroundClip: "border-box", // Keep the background clipped to the border
  //           WebkitMaskImage: "linear-gradient(white, white)", // Fix for some browsers
  //           boxShadow:
  //             "rgba(0, 0, 0, 0.17) 0px -23px 25px 0px inset, rgba(0, 0, 0, 0.15) 0px -36px 30px 0px inset, rgba(0, 0, 0, 0.1) 0px -79px 40px 0px inset, rgba(0, 0, 0, 0.06) 0px 2px 1px, rgba(0, 0, 0, 0.09) 0px 4px 2px, rgba(0, 0, 0, 0.09) 0px 8px 4px, rgba(0, 0, 0, 0.09) 0px 16px 8px, rgba(0, 0, 0, 0.09) 0px 32px 16px",
  //         }}
  //       >
  //         Next
  //       </button>
  //     </div>
  //   );
  // };

  const fetchHtmlReceipt = async (id: number) => {
    try {
      const authToken = localStorage.getItem("authToken");
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/transaction/html-receipt/${id}`,
        {
          headers: {
            urn: generateRandom13DigitNumber(),
            "Content-Type": "application/json",
            authToken: authToken,
          },
        }
      );
      const htmlContent = response.data;
      // console.log("html content", response.data);

      setModalContent(htmlContent);
      setIsModalOpen(true);
    } catch (error: TODO) {
      toast.error(error);
      console.error("Error fetching HTML receipt:", error);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalContent("");
  };

  const printContent = () => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      console.error(
        "Failed to open print window. It might have been blocked by a popup blocker."
      );
      return;
    }
    printWindow.document.write(modalContent);
    printWindow.document.close();
    printWindow.print();
  };

  useEffect(() => {
    if (isModalOpen) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }

    // Clean up when component unmounts
    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, [isModalOpen]);

  const { data: detailTransaction, isLoading } = useTransaction({
    fromDate: startDate,
    toDate: endDate,
    pageIndex: currentPage,
    pageSize: 10,
  });

  const transactions = detailTransaction?.apiResponseData?.data?.data;

  if (isLoading)
    return (
      <Loader
        message={"Please wait while the tranasaction are being displayed"}
      />
    );

  return (
    <>
      <div className="customTable min-w-full -mt-16 ">
        {/* Date Filter Section (Fixed at top of container) */}
        <div className=" flex justify-end gap-4 mb-3 items-center">
          <div className="shadow-sm p-1">
            <label
              htmlFor="start-date"
              className="block text-sm font-medium text-gray-700"
            >
              Start Date
            </label>
            <input
              type="date"
              id="start-date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              onKeyDown={(e) => e.preventDefault()}
              className="mt-1 block w-full border-gray-300 rounded-md focus:outline-none sm:text-sm"
            />
          </div>
          <div className="shadow-sm p-1">
            <label
              htmlFor="end-date"
              className="block text-sm font-medium text-gray-700"
            >
              End Date
            </label>
            <input
              type="date"
              id="end-date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              onKeyDown={(e) => e.preventDefault()}
              className="mt-1 block w-full border-gray-300 rounded-md focus:outline-none  sm:text-sm"
            />
          </div>
          <button
            onClick={handleDateChange}
            className="px-3 mr-2 bg-secondary h-9 text-white rounded-md shadow-sm hover:bg-secondary-light transition-all duration-300"
          >
            Filter
          </button>
        </div>

        {error && <p className="text-red-500 ml-3">{error}</p>}
        <div className="overflow-x-auto max-h-[400px]">
          {" "}
          {/* Limit the height of table to enable vertical scrolling */}
          <table className="min-w-full border-separate border-spacing-0">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Transaction ID
                </th>
                {/* <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
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
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {transactions?.length > 0 ? (
                transactions?.map((transaction: TODO, index: number) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                      <button
                        onClick={() => fetchHtmlReceipt(transaction.id)}
                        className="bg-secondary py-1 px-2 text-white rounded-lg hover:bg-secondary-light transition-all duration-200"
                      >
                        Download
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {transaction.details.status === "SUCCESS" ? (
                        <span className="text-green-500 font-semibold">
                          Success
                        </span>
                      ) : transaction.details.status === "FAILED" ? (
                        <span className="text-red-500 font-semibold">
                          Failed
                        </span>
                      ) : (
                        <span className="text-orange-500 font-semibold">
                          Initiated
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDateTime(transaction.details.transDate)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {transaction.details.transactionID}
                    </td>
                    {/*   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {transaction.details?.payoutTranscationId || "-"}
                  </td> */}
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {/* {transactionTypes[transaction.details.transType] || */}
                      {transaction.details.transType}
                    </td>
                    {/*  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {transaction.details.orderId}
                    </td> */}
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {transaction.details.senderNumber}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {transaction.details.beneficiaryAccount}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {transaction?.details.transType == "CC" ||
                      transaction?.details.transType == "EP" ||
                      transaction?.details.transType == "FW" ? (
                        <>-</>
                      ) : (
                        <>{transaction.details.amount}</>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {/*  {transaction?.details?.transType == "CC" ||
                        transaction?.details?.transType == "FW" ||
                        transaction?.details?.transType == "RP" ||
                        transaction?.details?.transType == "EP"
                        ? transaction?.details?.amountToBene
                        : transaction?.details?.netAmount} */}
                      {transaction?.details?.payoutAmount}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {transaction?.details.charge != null
                        ? Number(transaction?.details.charge).toFixed(2)
                        : "0.00"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {transaction?.details.markup != null
                        ? Number(transaction?.details.markup).toFixed(2)
                        : "0.00"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {transaction.details.utrRRN}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {transaction.details.bankRemarks || "-"}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td className="text-center px-6 py-4 text-gray-500">
                    No transactions found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      <div className="flex items-center justify-center mt-4 mb-4">
        <button
          onClick={() => setCurrentPage((p) => Math.max(p - 1, 0))}
          disabled={currentPage === 0}
          className="px-8 py-1 mx-1 bg-gray-300 text-gray-700 rounded disabled:opacity-50 text-sm"
          style={{
            borderRadius: "8px", // Ensure border-radius is maintained
            borderImage: "linear-gradient(45deg, #4b5a9f, #4fb5b7) 3",
            backgroundClip: "border-box", // Keep the background clipped to the border
            WebkitMaskImage: "linear-gradient(white, white)", // Fix for some browsers
            boxShadow:
              "rgba(0, 0, 0, 0.17) 0px -23px 25px 0px inset, rgba(0, 0, 0, 0.15) 0px -36px 30px 0px inset, rgba(0, 0, 0, 0.1) 0px -79px 40px 0px inset, rgba(0, 0, 0, 0.06) 0px 2px 1px, rgba(0, 0, 0, 0.09) 0px 4px 2px, rgba(0, 0, 0, 0.09) 0px 8px 4px, rgba(0, 0, 0, 0.09) 0px 16px 8px, rgba(0, 0, 0, 0.09) 0px 32px 16px",
          }}
        >
          Previous
        </button>
        {currentPage}
        <button
          onClick={() => {
            setCurrentPage((p) => p + 1);
          }}
          disabled={
            currentPage ===
            detailTransaction?.apiResponseData?.data?.totalPages - 1
          }
          className="px-10 py-1 mx-1 bg-gray-300 text-gray-700 rounded disabled:opacity-50 text-sm"
          style={{
            borderRadius: "8px", // Ensure border-radius is maintained
            borderImage: "linear-gradient(45deg, #4b5a9f, #4fb5b7) 3",
            backgroundClip: "border-box", // Keep the background clipped to the border
            WebkitMaskImage: "linear-gradient(white, white)", // Fix for some browsers
            boxShadow:
              "rgba(0, 0, 0, 0.17) 0px -23px 25px 0px inset, rgba(0, 0, 0, 0.15) 0px -36px 30px 0px inset, rgba(0, 0, 0, 0.1) 0px -79px 40px 0px inset, rgba(0, 0, 0, 0.06) 0px 2px 1px, rgba(0, 0, 0, 0.09) 0px 4px 2px, rgba(0, 0, 0, 0.09) 0px 8px 4px, rgba(0, 0, 0, 0.09) 0px 16px 8px, rgba(0, 0, 0, 0.09) 0px 32px 16px",
          }}
        >
          Next
        </button>
      </div>

      {/* {renderPagination()} */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-[800px] max-h-[80vh] overflow-y-auto relative flex flex-col">
            <button
              onClick={closeModal}
              className="absolute top-0 right-0 rounded-full transition-colors"
            >
              <ImCross className="text-sm mt-2 mr-2" />
            </button>

            <div className="flex-1 overflow-y-auto">
              {(() => {
                try {
                  const parsed =
                    typeof modalContent === "string"
                      ? JSON.parse(modalContent)
                      : modalContent;

                  const isFailure =
                    parsed?.apiResponseData?.responseCode === "401" ||
                    parsed?.apiResponseMessage?.toUpperCase() === "FAILURE";

                  if (isFailure) {
                    return (
                      <div className="text-center text-md font-medium text-gray-600 mt-3">
                        <p>Slip Data Preparation Failed.</p>
                      </div>
                    );
                  }
                } catch (err: TODO) {
                  // Not JSON, assume it's HTML
                  return (
                    <>
                      <div dangerouslySetInnerHTML={{ __html: modalContent }} />
                      <div className="text-center">
                        <button
                          onClick={printContent}
                          className="mt-4 px-4 py-2 bg-[#4b5a9f] text-white rounded hover:bg-[#4fb5b7] transition-colors self-center mb-4"
                        >
                          Print
                        </button>
                      </div>
                    </>
                  );
                }
              })()}
            </div>
          </div>
        </div>
      )}

      {/* {isLoading && <LoaderComponent message={"Please Wait . . ."} />} */}
    </>
  );
};

export default DetailedTransactionComponent;
