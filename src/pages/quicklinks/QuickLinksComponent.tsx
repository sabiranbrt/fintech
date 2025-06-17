/* eslint-disable @typescript-eslint/no-explicit-any */
import RegisterModal from "@/components/registerModal";
import {
  default as service,
  default as services,
} from "@/jsonDemo/services.json";
import { setEndpoints } from "@/redux/slices/endpointsSlice";
import { setSelectedService, updateIsText } from "@/redux/slices/serviceSlice";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { BiSolidWallet } from "react-icons/bi";
import { FaHeadset } from "react-icons/fa";
import { FaMoneyBillTransfer, FaRegCreditCard } from "react-icons/fa6";
import { GrTransaction } from "react-icons/gr";
import { HiBanknotes } from "react-icons/hi2";
import { IoPersonOutline } from "react-icons/io5";
import { MdOutlinePayments, MdOutlineSwitchAccount } from "react-icons/md";
import { PiHandWithdrawFill } from "react-icons/pi";
import { useDispatch } from "react-redux";
import QuickLinksTitle from "./components/QuickLinksTitle";

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
  const [isModalOpen, setIsModalOpen] = useState(false);

  const methods = useForm<any>();

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const dispatch = useDispatch();

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
      if (opts.label === "Register Sender") {
        setIsModalOpen(true);
        return;
      }
      dispatch(updateIsText(opts.label));
      dispatch(setSelectedService(null));
    }
  };

  return (
    <>
      <div className=" whitespace-nowrap">
        <p className="text-base text-center font-bold md:text-xl mb-5 ">
          Quick Links
        </p>
        {service && service.services.length > 0 ? (
          service.services.map((service: any) => {
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

      {isModalOpen && (
        <RegisterModal
          control={methods.control}
          names="registerSender"
          placeHolder={"Mobile Number"}
          title={"Register Sender"}
          subTitle={"Enter Mobile Number To Initiate KYC"}
          onClose={handleCancel}
        />
      )}
    </>
  );
};

export default QuickLinksComponent;
