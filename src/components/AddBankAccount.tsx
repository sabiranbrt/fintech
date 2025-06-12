/* eslint-disable @typescript-eslint/no-explicit-any */
import bank from "@/jsonDemo/bank.json";
import { useForm } from "react-hook-form";
import { IoClose } from "react-icons/io5";
import SubmitBtn from "./buttons/SubmitBtn";
import InputField from "./inputField";
import PassField from "./passfield";
import SelectCusOpt from "./selectCusOpt.tsx";
import SelectField from "./selectfield";

interface IProps {
  handleCancel: () => void;
}

const AddBankAccount = ({ handleCancel }: IProps) => {
  const methods = useForm<any>({
    mode: "onChange",
    
  });

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

        <form autoComplete="off" className="space-y-4">
          <div className="flex flex-wrap md:flex-nowrap gap-16 items-start">
            <div className="flex flex-col gap-5 w-full justify-center">
              <div className="relative">
                <SelectCusOpt
                  control={methods.control}
                  names="bankName"
                  label={"Bank Number"}
                  disabled={false}
                  currentIndex={0}
                  optionsData={bank}
                  fetchData={bank}
                />
              </div>
              <div className="relative mt-3">
                <PassField
                  control={methods.control}
                  names="accountNumber1"
                  label=" Account Number"
                  placeHolder="Account Number"
                />
              </div>

              <div className="relative mt-3">
                <InputField
                  control={methods.control}
                  names={"accountNameAsPerBank"}
                  label="Name as per Bank"
                  placeHolder="Enter Name as per Bank"
                />
              </div>
            </div>

            <div className="flex flex-col gap-5 w-full justify-center">
              <div className="relative">
                <InputField
                  control={methods.control}
                  names="accountIfsc"
                  label="Bank IFSC"
                  placeHolder="Bank IFSC"
                  disabled={false}
                  message={"Update Your IFSC Code As Per Your Branch"}
                />
              </div>

              <div className="relative -mt-2">
                <InputField
                  control={methods.control}
                  names="accountNumber"
                  label="Confirm Account Number"
                  placeHolder="Confirm Account Number"
                  ActionFetch="true"
                />
              </div>

              <div>
                <SelectField
                  control={methods.control}
                  placeHolder="Select Account Type"
                  names="accountType"
                  label="Account Type"
                  options={[
                    {
                      label: "Current",
                      value: "current"
                    },
                    { label: "Saving", value: "saving" },
                  ]}
                />
              </div>
            </div>
          </div>

          <div className="text-center">
            <SubmitBtn
              onClick={() => {}}
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
