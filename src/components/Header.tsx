import { PiCurrencyInr } from "react-icons/pi";
import HeaderList from "@/jsonDemo/header.json";
import Icon from "@assets/icons/payment-svgrepo-com.svg";

const Header = () => {
  return (
    <div className="text-white">
      <div className="mb-3 flex flex-row flex-wrap items-center gap-2">
        {HeaderList.headerTitle.map((item) => {
          return (
            <div
              key={item.label}
              className="group flex-grow basis-[24%] bg-gradient-to-r from-[#4b5a9f] to-[#4fb5b7] flex items-center gap-3 p-4 rounded-md hover:shadow-lg hover:shadow-gray-500 cursor-pointer transition-all duration-500 h-24 sm:h-28 md:h-32"
              style={{
                border: "2px solid transparent",
                borderRadius: "8px",
                borderImage: "linear-gradient(45deg, #4b5a9f, #4fb5b7) 3",
                backgroundClip: "border-box",
                WebkitMaskImage: "linear-gradient(white, white)",
                boxShadow:
                  "rgba(0, 0, 0, 0.17) 0px -23px 25px 0px inset, rgba(0, 0, 0, 0.15) 0px -36px 30px 0px inset, rgba(0, 0, 0, 0.1) 0px -79px 40px 0px inset, rgba(0, 0, 0, 0.06) 0px 2px 1px, rgba(0, 0, 0, 0.09) 0px 4px 2px, rgba(0, 0, 0, 0.09) 0px 8px 4px, rgba(0, 0, 0, 0.09) 0px 16px 8px, rgba(0, 0, 0, 0.09) 0px 32px 16px",
              }}
            >
              <div className=" bg-primary-dark p-3 rounded-full flex-shrink-0">
                <img src={item.icon ?? Icon} className="h-7" />
              </div>
              <div className="flex flex-col justify-center w-full">
                <p className="text-[1.09vw] uppercase font-medium tracking-wide mt-8 ml-4">
                  {item.label}
                </p>
                <div className="group relative flex items-center justify-end">
                  <p className="inline-flex opacity-0 group-hover:opacity-100 transition-all duration-500 text-sm sm:text-base gap-1 bg-primary-light rounded-md justify-center px-2 py-1 mt-1">
                    <span className="text-green-400">
                      {item.transactionSummary.success}
                    </span>{" "}
                    /
                    <span className="text-red-600">
                      {item.transactionSummary.failure}
                    </span>
                    <span className="text-white flex items-center">
                      / <PiCurrencyInr />{" "}
                      {Number(item.transactionSummary.totalAmount).toFixed(2)}
                    </span>
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Header;
