
const CreditCardBillPayment = () => {

  return (
    <div className=" !p-4 bg-white w-full">
      <div className="mb-1 mt-2 relative">
        <label className="block text-sm font-semibold mb-1 text-gray-800">
          Bank Name
        </label>
        <input
          type="text"
          // onFocus={() => setDropdownVisible(true)}
          className="w-full  p-2 border rounded-lg focus:outline-none bg-slate-50 "
          placeholder="Enter Bank Name"
        />
   
        {/* {dropdownVisible && (
          <ul className="absolute top-full left-0 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-48 overflow-y-auto z-50">
            {inputBankNameBasedFilter.map((bank) => (
              <li
                key={bank.ifsc}
                className="px-2 py-1 hover:bg-indigo-100 cursor-pointer"
                onClick={() => {
                  setBankName(bank.name);
                  setBankIfsc(bank.ifsc); // Set IFSC code based on selection
                  setTransferType(bank.mode);
                  setDropdownVisible(false);
                }}
              >
                {bank.name} ({bank.ifsc}) {bank.mode}
              </li>
            ))}
            {filteredCCBanks.length === 0 && (
              <li className="px-2 py-1">No banks found</li>
            )}
          </ul>
        )} */}
      </div>

      <div className="mb-1">
        <label className="block text-sm font-semibold mb-1 text-gray-800">
          IFSC Code
        </label>
        <input
          type="text"
          maxLength={11}
          className="w-full p-2 border rounded-lg focus:outline-none bg-slate-50"
          placeholder="Enter IFSC Code"
        />
      </div>

      <div className="mb-1 relative">
        <label className="block text-sm font-semibold mb-1 text-gray-800">
          Card Account Number
        </label>
        <div className="relative">
          <input
            type="text"
            placeholder="XXXX XXXX XXXX XXXX"
            inputMode="numeric"
            className="w-full  p-2 border rounded-lg focus:outline-none bg-slate-50"
          />

          <button
            type="button"
            className="absolute inset-y-0 right-3 flex items-center text-gray-500"
          >
            {/* {isHolding ? <Eye size={20} /> : <IoEyeOff size={20} />} */}
          </button>
        </div>
      
      </div>

      <div className="mb-1">
        <label className="block text-sm font-semibold mb-1 text-gray-800">
          Mobile Number
        </label>
        <input
          type="text"
          maxLength={10}
          className="w-full  p-2 border rounded-lg focus:outline-none bg-slate-50"
          placeholder="Enter Mobile Number"
        />
   
      </div>
      <button
        type="button"
        // onClick={handleOpenModal}
        className="px-3 py-2 mt-3 text-white rounded-md transition-all duration-200 bg-secondary hover:bg-secondary-light"
        style={{
          border: "3px solid transparent",
          borderRadius: "8px", // Ensure border-radius is maintained
          borderImage: "linear-gradient(45deg, #4b5a9f, #4fb5b7) 3",
          backgroundClip: "border-box", // Keep the background clipped to the border
          WebkitMaskImage: "linear-gradient(white, white)", // Fix for some browsers
          boxShadow:
            "rgba(0, 0, 0, 0.17) 0px -23px 25px 0px inset, rgba(0, 0, 0, 0.15) 0px -36px 30px 0px inset, rgba(0, 0, 0, 0.1) 0px -79px 40px 0px inset, rgba(0, 0, 0, 0.06) 0px 2px 1px, rgba(0, 0, 0, 0.09) 0px 4px 2px, rgba(0, 0, 0, 0.09) 0px 8px 4px, rgba(0, 0, 0, 0.09) 0px 16px 8px, rgba(0, 0, 0, 0.09) 0px 32px 16px",
        }}
      >
        Proceed
      </button>
    </div>
  );
};

export default CreditCardBillPayment;
