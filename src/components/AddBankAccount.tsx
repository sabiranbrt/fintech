/* eslint-disable @typescript-eslint/no-explicit-any */
import { useForm } from "react-hook-form";
import { IoClose, IoInformationCircleOutline } from "react-icons/io5";
import SubmitBtn from "./buttons/SubmitBtn";
import PassField from "./passfield";
import SelectCusOpt from "./selectCusOpt.tsx";
import SelectField from "./selectfield";

interface IProps {
  handleCancel: () => void;
}

const AddBankAccount = ({ handleCancel }: IProps) => {
  const { handleSubmit, control } = useForm<any>();

  const onSubmit = () => {
    console.log("onSubmit");
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-4xl relative">
        <button
          onClick={handleCancel}
          className="absolute top-3 right-3 text-gray-600 hover:text-black"
        >
          <IoClose size={24} />
        </button>
        <h2 className="text-xl font-semibold mb-4">Add Bank Account</h2>

        <form onSubmit={() => {}} autoComplete="off" className="space-y-4">
          <div className="flex flex-wrap md:flex-nowrap gap-16  items-start">
            <div className="flex flex-col gap-5 w-full justify-center">
              <div className="relative">
                <SelectCusOpt
                  names="bankName"
                  handleBlur={() => {}}
                  handleFocus={() => {}}
                  label={""}
                  optionsData={() => {}}
                  currentIndex={0}
                  disabled={false}
                  fetchData={undefined}
                  search={""}
                  handleSearch={() => {}}
                  handleKeyDown={() => {}}
                  onChange={() => {}}
                  handleSelect={() => {}}
                />
              </div>

              <PassField
                names="accountNumber1"
                label=" Account Number"
                isFocused={false}
                handleFocus={() => {}}
                handleBlur={() => {}}
              />

              <div className="relative mt-3">
                <label className="block text-sm ">
                  Name as per Bank <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  readOnly
                  {...register("accountNameAsPerBank")}
                  placeholder="Enter Name as per Bank"
                  className={`text-sm border rounded-md p-2 w-full focus:outline-none bg-white ${
                    errors.accountNameAsPerBank
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                />
                {errors.accountNameAsPerBank && (
                  <p className="absolute top-[60px] text-red-500 text-xs mt-2">
                    {errors.accountNameAsPerBank.message}
                  </p>
                )}
              </div>
            </div>

            <div className="flex flex-col gap-5 w-full justify-center">
              <div className="relative">
                <label className="block text-sm">
                  Bank IFSC <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  {...register("accountIfsc")}
                  placeholder="Bank IFSC"
                  maxLength={11}
                  disabled={isAccountVerified}
                  onChange={(e) => {
                    const formattedValue = e.target.value
                      .toUpperCase()
                      .replace(/[^A-Z0-9]/g, "");
                    setValue("accountIfsc", formattedValue, {
                      shouldValidate: true,
                    }); // ✅ Trigger validation
                  }}
                  className={`text-sm border rounded-md p-2 w-full focus:outline-none bg-white ${
                    errors.accountIfsc ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.accountIfsc && (
                  <p className="absolute top-[72px] text-red-500 text-xs mt-2">
                    {errors.accountIfsc.message}
                  </p>
                )}
                <span className="text-sm text-primary-light">
                  (Update Your IFSC Code As Per Your Branch)
                </span>
              </div>

              <div className="relative -mt-2">
                <label className="block text-sm">
                  Confirm Account Number
                  <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  {...register("accountNumber")}
                  placeholder="Confirm Account Number"
                  onPaste={(e) => e.preventDefault()}
                  onInput={(e) => {
                    e.target.value = e.target.value
                      .replace(/[^0-9]/g, "")
                      .slice(0, 18);
                  }}
                  readOnly={isAccountVerified}
                  className={`text-sm border rounded-md p-2 w-full focus:outline-none bg-white ${
                    errors.accountNumber ? "border-red-500" : "border-gray-300"
                  }`}
                />
                <div>
                  {isPennyDropVerified ? (
                    <>
                      <div className="absolute right-12 top-6 mt-1 -mr-8 rounded-md text-xs">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="green"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          class="lucide lucide-check"
                        >
                          <path d="M20 6 9 17l-5-5" />
                        </svg>
                      </div>
                      {txnId && registeredName && (
                        <span className="flex gap-3 text-sm text-secondary mt-1">
                          <TruncatedTextWithTooltip
                            label="Transaction ID:"
                            value={txnId}
                          />
                          <TruncatedTextWithTooltip
                            label="Reg. Name:"
                            value={registeredName}
                          />
                        </span>
                      )}
                    </>
                  ) : (
                    <div>
                      <button
                        type="button"
                        onClick={handleVerifyClick}
                        className={`absolute right-14 top-[22.5px] mt-1 -mr-8 py-1 px-3 rounded-md text-xs ${
                          loading ||
                          !watch("accountNumber") ||
                          !watch("accountNumber1") ||
                          errors.accountNumber ||
                          errors.accountNumber1
                            ? "bg-gray-300 "
                            : "bg-primary-light text-white"
                        }`}
                        disabled={
                          loading ||
                          !watch("accountNumber") ||
                          !watch("accountNumber1") ||
                          errors.accountNumber ||
                          errors.accountNumber1
                        }
                      >
                        {loading ? "Verifying..." : "Click to Verify"}
                      </button>
                      {/*   // <IoInformationCircleOutline className="absolute right-1 top-[30px] text-primary text-lg" /> */}

                      <div className="relative group">
                        <IoInformationCircleOutline className="absolute right-1 -top-7 text-primary text-lg cursor-pointer" />

                        <div
                          className="absolute right-0 mt-1 
                                                                  bg-gray-100 border border-gray-200 shadow-md rounded-md 
                                                                  opacity-0 group-hover:opacity-100 
                                                              
                                                                  p-2 text-sm
                                                                  transition-opacity duration-300 
                                                                  pointer-events-none group-hover:pointer-events-auto
                                                                  z-20"
                        >
                          <h3 className="text-center text-sm font-medium text-gray-700">
                            Charge : ₹ {chargeSlab}
                          </h3>
                        </div>
                      </div>
                    </div>
                  )}
                  {errors.accountNumber && (
                    <p className="absolute top-[60px] text-red-500 text-xs mt-2">
                      {errors.accountNumber.message}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <SelectField
                  names="accountType"
                  handleFocus={() => {}}
                  handleBlur={() => {}}
                  label="Account Type"
                  isFocused={false}
                  options={[
                    {
                      label: "Current",
                      value: "current",
                    },
                    { label: "Saving", value: "saving" },
                  ]}
                />
              </div>
            </div>
          </div>
          <div className="text-center">
            <SubmitBtn
              onClick={() => {
                handleSubmit(onSubmit);
              }}
              isLoading={false}
              isPennyDropVerified={false}
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddBankAccount;
