/* eslint-disable @typescript-eslint/no-explicit-any */
import BtnPrimary from "@/components/buttons/BtnPrimary";
import CustomPassField from "@/components/customPassField";
import InputField from "@/components/inputField";
import SelectCusOpt from "@/components/selectCusOpt.tsx";
import bank from "@/jsonDemo/bank.json";
import { useForm } from "react-hook-form";

const CreditCardBillPayment = () => {
  const methods = useForm();

  return (
    <div className=" !p-4 bg-white w-full">
      <form>
        <div className="mb-1 mt-2 relative">
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

        <div className="mb-1">
          <InputField
            control={methods.control}
            names="IFSC"
            label="IFSC Code"
            maxLength={11}
            placeHolder="Enter IFSC Code"
          />
        </div>

        <div className="mb-1 relative">
          <CustomPassField
            control={methods.control}
            label="Card Account Number"
            names="cardAccount"
            placeHolder="XXXX XXXX XXXX XXXX"
          />
        </div>

        <div className="mb-1">
          <InputField
            type="number"
            control={methods.control}
            names="mobileNumber"
            label="Mobile Number"
            placeHolder="Enter Mobile Number"
          />
        </div>
        <BtnPrimary title="Proceed" onClick={() => {}} />
      </form>
    </div>
  );
};

export default CreditCardBillPayment;
