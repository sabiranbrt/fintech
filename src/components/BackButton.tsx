import { RootState } from "@/redux/store";
import { useSelector } from "react-redux";

const BackButton = () => {
  const { selectedService, isText } = useSelector(
    (state: RootState) => state.service
  );

  return (
    <div className=" mr-5 rounded-md w-full">
      <div className="flex items-center justify-center">
        <div>
          <button
            //  onClick={onBackClick}
            type="button"
            onClick={() => {
              window.location.reload();
            }}
            className={`m-4 px-8 py-1 h-10 bg-secondary text-white rounded-md hover:bg-secondary-light transition-all duration-200 text-sm ml-0`}
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
            Back
          </button>
        </div>
        <div className="ml-2 w-full flex flex-row justify-center">
          <p className="text-secondary-dark text-xl font-semibold">
            {selectedService?.label ? selectedService.label : isText}
          </p>
        </div>
      </div>
    </div>
  );
};

export default BackButton;
