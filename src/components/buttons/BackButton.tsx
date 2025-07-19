import { RootState } from "@/redux/store";
import { useSelector } from "react-redux";
import BtnPrimary from "./BtnPrimary";

const BackButton = () => {
  const { selectedService, isText } = useSelector(
    (state: RootState) => state.service
  );

  return (
    <div className=" mr-5 rounded-md w-full">
      <div className="flex items-center justify-center">
        <div>
          <BtnPrimary title="Back" />
        </div>
        <div className="ml-2 w-full flex flex-row justify-center">
          <p className="text-secondary-dark text-xl font-semibold">
            {isText ? isText  : selectedService?.label}
          </p>
        </div>
      </div>
    </div>
  );
};

export default BackButton;
