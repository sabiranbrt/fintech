
const TransferNotice = () => {
  return (
    <div className="bg-blue-50 rounded-lg p-4 mt-4">
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0">
          <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <div>
          <p className="text-sm font-medium text-red-800">Transfer Notice</p>
          <p className="text-xs text-red-600 mt-1">
            This is a non-verified beneficiary. IKEDA will not be responsible for any wrong transfers.
          </p>
        </div>
      </div>
      <div className='text-end'>
         <button
        type="button"
        className="mt-3 bg-secondary text-white rounded-md px-2 py-1 shadow-lg hover:bg-secondary-light transition-all duration-200"
        onClick={() =>{}}
      >
        Verify Now
      </button>
      </div>
     
    </div>
  );
};

export default TransferNotice;
