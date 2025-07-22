/* eslint-disable @typescript-eslint/no-explicit-any */
import clsx from "clsx";
import { TiTick } from "react-icons/ti";

interface IProp {
  currentIndex: number;
  formList: any;
}

const MultiFormHeader = ({ currentIndex, formList }: IProp) => {
  const displatDatalength = Object.keys(formList?.dataFields);

  return (
    <div
      className={clsx(
        "flex items-end w-full !py-5",
        formList?.layout === "horizontallayout"
          ? " items-center gap-5 md:gap-4 sm:gap-2 justify-center"
          : "gap-20 flex-col"
      )}
    >
      {Object.keys(formList?.dataFields).map((key, index) => {
        const stepKey = key as keyof typeof formList.dataFields;
        const currentStep = formList.dataFields[stepKey];

        if (!Array.isArray(currentStep)) {
          const activeIndex = index === currentIndex;
          const isComplete = index < currentIndex;
          return (
            <div
              key={key}
              className={clsx(
                "inline-flex gap-5 items-center",
                formList?.layout === "horizontallayout"
                  ? "flex-row-reverse"
                  : "", // Hide non-active steps on small screens
                index !== currentIndex ? "hidden md:flex" : ""
              )}
            >
              {index < displatDatalength.length - 1 &&
                formList?.layout === "horizontallayout" && (
                  <div
                    className={clsx(
                      "h-[0.5px] w-20 2xl:w-20 xl:w-20 mx-2 md:w-10 sm:w-5",
                      isComplete ? "bg-[#5081B9]" : "bg-gray-500"
                    )}
                  />
                )}
              <p
                className={clsx(
                  "font-semibold 2xl:text-[18px] xl:text-[18px] md:text-[14px] sm:text-[12px] whitespace-nowrap",
                  activeIndex || isComplete ? "text-[#5081B9]" : "text-gray-500"
                )}
              >
                {currentStep?.status}
              </p>

              <div
                className={clsx(
                  "w-8 h-8 shadow-md shadow-gray-300 rounded-full flex items-center justify-center",
                  activeIndex || isComplete ? "bg-[#5081B9]" : "bg-[#FFF2F2]"
                )}
              >
                {isComplete ? (
                  <TiTick color="white" />
                ) : (
                  <p
                    className={clsx(
                      "font-bold text-[15px]",
                      activeIndex ? "text-white" : "text-black"
                    )}
                  >
                    {index + 1}
                  </p>
                )}
              </div>
            </div>
          );
        }
        return null;
      })}
    </div>
  );
};

export default MultiFormHeader;
