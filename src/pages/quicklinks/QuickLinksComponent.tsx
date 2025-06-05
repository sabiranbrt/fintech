import services from "@/jsonDemo/services.json";
import { setSelectedService, updateIsText } from "@/redux/slices/serviceSlice";
import { BiSolidWallet } from "react-icons/bi";
import { FaHeadset } from "react-icons/fa";
import { FaMoneyBillTransfer, FaRegCreditCard } from "react-icons/fa6";
import { GrTransaction } from "react-icons/gr";
import { HiBanknotes } from "react-icons/hi2";
import { IoPersonOutline } from "react-icons/io5";
import { MdOutlinePayments, MdOutlineSwitchAccount } from "react-icons/md";
import { PiHandWithdrawFill } from "react-icons/pi";
import { useDispatch, useSelector } from "react-redux";
import QuickLinksTitle from "./components/QuickLinksTitle";
import { setEndpoints } from "@/redux/slices/endpointsSlice";
import { useEffect } from "react";
import { RootState } from "@/redux/store";
import { useServiceRunner } from "@/hooks/dynamicQuery";

const serviceIcons = {
  "Credit Card Bill Payment": (
    <FaRegCreditCard className="text-sky-600 text-xl md:text-2xl" />
  ),
  "Fund Settlement": (
    <FaMoneyBillTransfer className="text-blue-500 text-xl md:text-2xl" />
  ),
  "Rent Payment": (
    <HiBanknotes className="text-yellow-500 text-xl md:text-2xl" />
  ),
  "Education Fees": (
    <FaRegCreditCard className="text-sky-600 text-xl md:text-2xl" />
  ),
  "Fund Withdrawal": (
    <PiHandWithdrawFill className="text-secondary text-xl md:text-2xl" />
  ),
};

const ExtraServiceLabel = [
  {
    title: "Register Sender",
    icon: <IoPersonOutline className="text-orange-500 text-xl md:text-2xl" />,
  },
  {
    title: "Transactions",
    icon: <GrTransaction className="text-green-500 text-xl md:text-2xl" />,
  },
  {
    title: "Total Payout",
    icon: <MdOutlinePayments className="text-primary text-xl md:text-2xl" />,
  },
  {
    title: "Load Wallet",
    icon: <BiSolidWallet className="text-lime-600 text-xl md:text-2xl" />,
  },
  {
    title: "Account Ledger",
    icon: (
      <MdOutlineSwitchAccount className="text-secondary-light text-xl md:text-2xl" />
    ),
  },
  {
    title: "Relationship Manager",
    icon: <FaHeadset className="text-secondary-dark text-xl md:text-2xl" />,
  },
];

type ServiceLabel = keyof typeof serviceIcons;

const QuickLinksComponent = () => {
  const dispatch = useDispatch();
  const { endpoints } = useSelector((state: RootState) => state.endPoints);
  const { selectedService } = useSelector((state: RootState) => state.service);
  console.log("endpoints", endpoints);

  const { run } = useServiceRunner({
    serviceKey: "creditCardBill",
    services: selectedService,
    endPoints: endpoints,
  });

  useEffect(() => {
    if (services?.endPoints) {
      dispatch(setEndpoints(services.endPoints));
    }
  }, [dispatch]);

  const handleQuickLinkClick = (opts: {
    service?: (typeof services.services)[number];
    label?: string;
  }) => {
    if (opts.service) {
      dispatch(setSelectedService(opts.service));
      dispatch(updateIsText(""));
    } else if (opts.label) {
      dispatch(updateIsText(opts.label));
      dispatch(setSelectedService(null));
    }
  };

  return (
    <>
      <div className=" bg-white px-8 py-5 shadow-md ml-4 rounded-md max-h-[calc(80dvh)]">
        <p className="text-base text-center font-bold md:text-xl mb-5 ">
          Quick Links
        </p>
        {services && services.services.length > 0 ? (
          services.services.map((service) => {
            const label = service.label as ServiceLabel;
            return (
              <div key={service.label}>
                <QuickLinksTitle
                  title={service.label}
                  icon={serviceIcons[label]}
                  onClick={() => handleQuickLinkClick({ service })}
                />
              </div>
            );
          })
        ) : (
          <p className="text-sm text-gray-500 italic">No services available.</p>
        )}

        {ExtraServiceLabel.map(({ title, icon }) => (
          <QuickLinksTitle
            key={title}
            title={title}
            icon={icon}
            onClick={() => handleQuickLinkClick({ label: title })}
          />
        ))}
      </div>

      {/* 
      {/* {isLoading && <Loader />}
      {showAnimatedSpinner && (
        <Loader message="We are fetching data. Please wait . . ." />
      )}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center overflow-hidden justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-2xl p-6 w-96 shadow-lg relative overflow-hidden">
            <button
              onClick={closeModal}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
            >
              <IoClose className="text-2xl" />
            </button>
            <h2 className="text-xl font-semibold mb-1">Register Sender</h2>
            <h2 className="text-base font-medium text-gray-600 mb-4">
              Enter Mobile Number To Initiate KYC
            </h2>
            <form onSubmit={handleSubmit}>
              <input
                type="search"
                onChange={handleInputChange}
                placeholder="Mobile Number"
                maxLength={10}
                required
                autoComplete="off"
                autoFocus
                onInput={(e) => {
                  let value = e.target.value.replace(/\D/g, ""); // Remove non-numeric characters
                  if (value.length > 0 && /^[0-5]/.test(value)) {
                    value = ""; // Clear input if it starts with 0-5
                  }
                  e.target.value = value;
                }}
                className="w-full border border-gray-300 rounded-lg p-3 mb-3 focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
              <button
                type="submit"
                disabled={error || loadingNumber}
                className={`w-full  text-white py-3 rounded-lg ${
                  error
                    ? "bg-gray-400"
                    : " bg-gradient-to-r from-[#4b5a9f] to-[#4fb5b7]"
                } `}
              >
                {loadingNumber ? "Checking Number . . ." : "Submit"}
              </button>
            </form>
          </div>
        </div>
      )} */}
    </>
  );
};

export default QuickLinksComponent;
