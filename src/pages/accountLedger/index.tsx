import { useAccountLedger } from "@/hooks/service";
import { downloadCsv } from "@/utils/DownloadCsv";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const AccountLedger = () => {
  // States for storing the selected dates and report data
  const { mutateAsync } = useAccountLedger();
  const today = new Date().toISOString().split("T")[0];
  const [fromDate, setFromDate] = useState(today);
  const [toDate, setToDate] = useState(today);
  const [reportData, setReportData] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  // const [isLoading, setIsLoading] = useState(false);
  // const [currentPage, setCurrentPage] = useState(1); // Track the current page
  const [pageIndex, setPageIndex] = useState(0);
  const pageSize = 10; // Fixed page size of 10

  useEffect(() => {
    fetchData();
  }, []);

  // Function to fetch data from the backend API
  const fetchData = async () => {
    if (!fromDate || !toDate) {
      alert("Please select both Start Date and End Date.");
      return;
    }
    // setIsLoading(true);

    try {
      const response = await mutateAsync({
        fromDate: fromDate,
        toDate: toDate,
        reportType: "merchantDailySummary",
        serviceName: "",
      });
      if (response?.data?.apiResponseData?.responseCode === "200") {
        setReportData(response?.data?.apiResponseData?.data);
      } else {
        console.error(response?.data.apiResponseData.responseMessage);
        toast.error(response?.data?.apiResponseData?.responseMessage);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      // setIsLoading(false);
    }
  };

  const fetchExportData = async () => {
    if (!fromDate || !toDate) {
      alert("Please select date range");
      return;
    }

    // setIsLoading(true);
    try {
      const requestData = {
        fromDate: fromDate,
        toDate: toDate,
        reportType: "merchantDailySummary",
        serviceName: "",
      };

      await downloadCsv(requestData);
    } catch (error: TODO) {
      alert(`Download failed: ${error.message}`);
    } finally {
      // setIsLoading(false);
    }
  };

  const parseReportData = (data: TODO) => {
    const { size, tableData: flatData } = data;
    const headers = flatData?.slice(0, size);
    const rows = [];
    for (let i = size; i < flatData?.length; i += size) {
      rows.push(flatData?.slice(i, i + size));
    }

    return { headers, rows };
  };

  // Default values when data is not available yet
  const { headers, rows } = reportData
    ? parseReportData(reportData)
    : { headers: [], rows: [] };

  // Apply search filter to the entire dataset
  const filteredRows = rows.filter((row) => {
    return row.some(
      (cell: TODO) =>
        cell.toString().toLowerCase().includes(searchQuery.toLowerCase()) // Search across all cells
    );
  });

  // Calculate pagination based on filtered rows
  const totalPages = Math.ceil(filteredRows.length / pageSize);

  // Ensure we are always showing the correct rows for the current page
  const startIndex = pageIndex * pageSize; // Adjusted for zero-based index
  const currentPageRows = filteredRows.slice(startIndex, startIndex + pageSize);

  // Handle page change
  const handlePageChange = (pageNumber: TODO) => {
    setPageIndex(pageNumber - 1); // Adjusting for zero-based index
  };

  // Reset to the first page when the search query changes
  useEffect(() => {
    setPageIndex(0); // Reset to the first page whenever the search query changes
  }, [searchQuery]);

  const renderPageNumbers = () => {
    const pageButtons = [];
    const maxVisiblePages = 3;

    if (totalPages <= maxVisiblePages + 2) {
      // Case when all pages can fit within the visible range
      for (let i = 0; i < totalPages; i++) {
        pageButtons.push(
          <button
            key={i}
            onClick={() => handlePageChange(i + 1)} // Adjusting for 1-based user input
            className={`mx-1 px-3 py-1 rounded ${
              pageIndex === i ? "bg-primary text-white" : "bg-gray-200"
            }`}
          >
            {i + 1}
          </button>
        );
      }
    } else {
      // Always show the first page
      pageButtons.push(
        <button
          key={0}
          onClick={() => handlePageChange(1)} // Always set to page 1
          className={`mx-1 px-3 py-1 rounded ${
            pageIndex === 0 ? "bg-primary text-white" : "bg-gray-200"
          }`}
        >
          1
        </button>
      );

      // Show ellipses if the current page is far from the first page
      if (pageIndex > 1) {
        pageButtons.push(
          <span key="dots-left" className="mx-1">
            ...
          </span>
        );
      }

      // Determine the range of pages to display around the current page
      const start = Math.max(1, pageIndex - 1);
      const end = Math.min(totalPages - 2, pageIndex + 1);

      // Show the range of pages
      for (let i = start; i <= end; i++) {
        pageButtons.push(
          <button
            key={i}
            onClick={() => handlePageChange(i + 1)} // Adjusting for 1-based user input
            className={`mx-1 px-3 py-1 rounded ${
              pageIndex === i ? "bg-primary text-white" : "bg-gray-200"
            }`}
          >
            {i + 1}
          </button>
        );
      }

      // Show ellipses if the current page is far from the last page
      if (pageIndex < totalPages - 3) {
        pageButtons.push(
          <span key="dots-right" className="mx-1">
            ...
          </span>
        );
      }

      // Always show the last page
      pageButtons.push(
        <button
          key={totalPages - 1}
          onClick={() => handlePageChange(totalPages)} // Always set to the last page
          className={`mx-1 px-3 py-1 rounded ${
            pageIndex === totalPages - 1
              ? "bg-primary text-white"
              : "bg-gray-200"
          }`}
        >
          {totalPages}
        </button>
      );
    }

    return pageButtons;
  };
  const handlePrevious = () => {
    if (pageIndex > 0) {
      setPageIndex(pageIndex - 1);
    }
  };

  const handleNext = () => {
    if (pageIndex < totalPages - 1) {
      setPageIndex(pageIndex + 1);
    }
  };
  return (
    <>
      {/* {isLoading && <Loader />} */}
      <div className="mt-2 flex flex-col customTable min-w-full h-full">
        <div className="flex space-x-4 mb-4 justify-end items-center">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search transactions . . . ."
            className="px-4 py-2 border border-gray-200 rounded-md w-full focus:outline-none mt-3"
          />

          <div className="flex flex-col">
            <label
              htmlFor=""
              className="block text-sm font-medium text-gray-700"
            >
              {" "}
              Start Date
            </label>
            <input
              type="date"
              id="start-date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              onKeyDown={(e) => e.preventDefault()}
              className="mt-1 block w-full border-gray-300 rounded-md focus:outline-none sm:text-sm"
              required
            />
          </div>
          <div className="flex flex-col">
            <label
              htmlFor=""
              className="block text-sm font-medium text-gray-700"
            >
              {" "}
              End Date
            </label>
            <input
              type="date"
              id="end-date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              onKeyDown={(e) => e.preventDefault()}
              className="mt-1 block w-full border-gray-300 rounded-md focus:outline-none sm:text-sm"
              required
            />{" "}
          </div>
          <button
            type="button"
            onClick={fetchData}
            //disabled={!fromDate || !toDate}
            className="px-3 mr-2 bg-secondary h-9 text-white rounded-md shadow-sm hover:bg-secondary-light transition-all duration-300"
          >
            Filter
          </button>
          <button
            type="button"
            onClick={fetchExportData}
            //disabled={!fromDate || !toDate}
            className="px-3 mr-2 bg-primary h-9 text-white rounded-md shadow-sm hover:bg-primary-light transition-all duration-300"
          >
            Export
          </button>
        </div>

        {/* Add search input */}

        <div className="overflow-x-auto overflow-y-auto w-full">
          <table className="bg-white  w-full">
            <thead>
              <tr className="bg-gray-200">
                {headers?.map((header: TODO, index: number) => (
                  <th
                    key={index}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider sticky top-0 bg-gray-200 z-10"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {currentPageRows?.length === 0 ? (
                <tr>
                  <td
                    colSpan={headers?.length}
                    className="px-6 py-4 text-center text-gray-600"
                  >
                    No results . . .
                  </td>
                </tr>
              ) : (
                currentPageRows?.map((row, rowIndex) => (
                  <tr
                    key={rowIndex}
                    className={rowIndex % 2 === 0 ? "bg-gray-50" : "bg-white"}
                  >
                    {row.map((cell: TODO, cellIndex: number) => (
                      <td
                        key={cellIndex}
                        className="px-6 py-4 whitespace-nowrap text-sm text-gray-600"
                      >
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="flex justify-center items-center mt-2">
          <button
            onClick={handlePrevious}
            disabled={pageIndex === 0}
            className="mx-2 px-4 py-2 rounded bg-gray-300 disabled:opacity-50"
          >
            Previous
          </button>

          {renderPageNumbers()}

          <button
            onClick={handleNext}
            disabled={pageIndex === totalPages - 1}
            className="mx-2 px-4 py-2 rounded bg-gray-300 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </>
  );
};
export default AccountLedger;
