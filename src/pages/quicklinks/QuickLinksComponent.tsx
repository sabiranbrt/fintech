/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-expressions */
import RegisterModal from "@/components/registerModal";
import { useDynamicMutation } from "@/hooks/dynamicQuery";
import {
  useAadhaarRegistrationBeneLazy,
  useDigiData,
  useDigiTokenLazy,
} from "@/hooks/service";
import {
  default as service,
  default as services,
} from "@/jsonDemo/services.json";
import { setEndpoints } from "@/redux/slices/endpointsSlice";
import { setSelectedService, updateIsText } from "@/redux/slices/serviceSlice";
import { RootState } from "@/redux/store";
import { getDynamicRequest } from "@/utils/dynamicRequest";
import clsx from "clsx";
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
import { useDispatch, useSelector } from "react-redux";
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
  "Register Sender": (
    <IoPersonOutline className="text-orange-500 text-xl md:text-2xl" />
  ),
  Transactions: (
    <GrTransaction className="text-green-500 text-xl md:text-2xl" />
  ),
  "Total Payout": (
    <MdOutlinePayments className="text-primary text-xl md:text-2xl" />
  ),
  "Load Wallet": (
    <BiSolidWallet className="text-lime-600 text-xl md:text-2xl" />
  ),
  "Account Ledger": (
    <MdOutlineSwitchAccount className="text-secondary-light text-xl md:text-2xl" />
  ),
  "Relationship Manager": (
    <FaHeadset className="text-secondary-dark text-xl md:text-2xl" />
  ),
};

// const ExtraServiceLabel = [
//   {
//     title: "Register Sender",
//     icon: <IoPersonOutline className="text-orange-500 text-xl md:text-2xl" />,
//   },
//   {
//     title: "Transactions",
//     icon: <GrTransaction className="text-green-500 text-xl md:text-2xl" />,
//   },
//   {
//     title: "Total Payout",
//     icon: <MdOutlinePayments className="text-primary text-xl md:text-2xl" />,
//   },
//   {
//     title: "Load Wallet",
//     icon: <BiSolidWallet className="text-lime-600 text-xl md:text-2xl" />,
//   },
//   {
//     title: "Account Ledger",
//     icon: (
//       <MdOutlineSwitchAccount className="text-secondary-light text-xl md:text-2xl" />
//     ),
//   },
//   {
//     title: "Relationship Manager",
//     icon: <FaHeadset className="text-secondary-dark text-xl md:text-2xl" />,
//   },
// ];

type ServiceLabel = keyof typeof serviceIcons;

const QuickLinksComponent = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userRegisterNumber, setUserRegisterNumber] = useState(false);

  const {
    control,
    formState: { errors },
    setError,
    setValue,
    watch,
  } = useForm<TODO>({
    mode: "onChange",
  });

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const dispatch = useDispatch();
  const mobileNumber = watch("mobileNumber");
  const { endpoints } = useSelector((state: RootState) => state.endPoints);

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
      if (opts.service.label === "Register Sender") {
        setIsModalOpen(true);
        return;
      }
      dispatch(setSelectedService(opts.service as TODO));
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

  const stepName = "getSender";

  const request = getDynamicRequest(stepName ?? "", endpoints ?? {}, {
    mobileNumber: mobileNumber,
  });

  const { mutate } = useDynamicMutation<TODO>();

  const fetchSender = () => {
    if (!request?.url) return;

    mutate(request, {
      onSuccess: (data) => {
        if (data?.apiResponseData?.data[0]?.mobileNumber === mobileNumber) {
          setUserRegisterNumber(true);
        } else {
          setUserRegisterNumber(false);
        }
      },
      onError: () => {
        console.log("error");
      },
    });
  };

  useEffect(() => {
    if (mobileNumber?.length === 10 && !errors.mobileNumber) {
      fetchSender();
    }
  }, [mobileNumber, errors.mobileNumber]);

  useEffect(() => {
    if (userRegisterNumber === true) {
      setError("mobileNumber", {
        type: "manual",
        message: "Already registered",
      });
    }
  }, [userRegisterNumber]);

  const [aadhaarParams, setAadhaarParams] = useState<{
    digiToken: string;
    mobile: string;
  } | null>(null);

  const { refetch: fetchDigiToken } = useDigiTokenLazy();

  const { refetch: fetchAadhaar } = useAadhaarRegistrationBeneLazy(
    aadhaarParams?.digiToken,
    aadhaarParams?.mobile
  );

  const { mutateAsync: fetchDigiData } = useDigiData();

  const handleSubmit = async () => {
    const digiTokenRes = await fetchDigiToken();
    const aadharRegister = await fetchAadhaar();

    const accessToken =
      digiTokenRes.data?.apiResponseData?.responseData?.accessToken;

    if (!accessToken) return;
    setAadhaarParams({ digiToken: accessToken, mobile: mobileNumber });

    const { url } = JSON.parse(
      aadharRegister.data.apiResponseData.responseData
    );

    const { requestId } = JSON.parse(
      aadharRegister.data.apiResponseData.responseData
    );

    const newChildWindow = window.open(url, "_blank", "width=800,height=600");

    // Monitor the child window
    const monitorWindow = setInterval(() => {
      if (!newChildWindow || newChildWindow.closed) {
        clearInterval(monitorWindow);
        console.error("Child window closed before success.");
      } else {
        try {
          const currentUrl = newChildWindow.location.href;
          if (currentUrl.includes(import.meta.env.VITE_REDIRECTION_URL)) {
            const params = new URLSearchParams(new URL(currentUrl).search);
            const state = params.get("state");

            if (state || requestId) {
              (async () => {
                const digiDataResponse = await fetchDigiData({
                  digiToken: accessToken,
                  requestId: requestId!,
                  beneMobileKyc: mobileNumber,
                });

                console.log("Fetched Digi Data:", digiDataResponse);
              })();
            }

            newChildWindow.close();
            clearInterval(monitorWindow);
          }
        } catch (error) {
          // Ignore errors due to cross-origin restrictions
          console.log("error", error);
        }
      }
    }, 500); // Poll every 500ms for better responsiveness
  };

  return (
    <>
      <div className=" whitespace-nowrap">
        <p className="text-base text-center font-bold md:text-xl mb-5">
          Quick Links
        </p>

        {service && service.services.length > 0 ? (
          service.services
            .filter((s: TODO) => !(s.label === "Education Fees"))
            .map((service: TODO) => {
              const label = service.label as ServiceLabel;
              return (
                <div
                  key={service.label}
                  className={clsx(
                    "relative",
                    service?.subserviceStatus === "Y"
                      ? "cursor-pointer text-black"
                      : "!cursor-not-allowed text-gray-600"
                  )}
                >
                  <QuickLinksTitle
                    title={service.label}
                    icon={serviceIcons[label]}
                    onClick={() => {
                      service?.subserviceStatus === "N"
                        ? undefined
                        : handleQuickLinkClick({ service });
                    }}
                  >
                    {service?.subserviceStatus === "N" && (
                      <div className="absolute left-16 top-9 transform -translate-y-1/2 ml-2 hidden group-hover:block bg-gray-200 text-gray-600 text-xs px-4 py-1 rounded shadow-sm whitespace-nowrap">
                        Service not available !
                      </div>
                    )}
                  </QuickLinksTitle>
                </div>
              );
            })
        ) : (
          <p className="text-sm text-gray-500 italic">No services available.</p>
        )}

        {/* {ExtraServiceLabel.map(({ title, icon }) => (
          <div className=" cursor-pointer">
            <QuickLinksTitle
              key={title}
              title={title}
              icon={icon}
              onClick={() => handleQuickLinkClick({ label: title })}
            />
          </div>
        ))} */}
      </div>

      {isModalOpen && (
        <RegisterModal
          control={control}
          errors={errors}
          names="mobileNumber"
          placeHolder={"Mobile Number"}
          title={"Register Sender"}
          subTitle={"Enter Mobile Number To Initiate KYC"}
          onClose={handleCancel}
          rules={{
            required: "Mobile number is required",
            validate: {
              validFormat: (value: TODO) =>
                /^[6-9]\d{0,9}$/.test(value) ||
                "Enter a valid 10-digit mobile number starting with 6-9.",
              noSixIdenticalDigits: (value: TODO) =>
                !/(.)\1{5}/.test(value ?? "") ||
                "Mobile number cannot have a sequence of the same 6 digits.",
              notSixDigits: (value: TODO) =>
                value.length !== 6 ||
                "6-digit mobile numbers are not acceptable.",
              exactTenDigits: (value: TODO) =>
                value.length === 10 ||
                "Mobile number must be exactly 10 digits.",
            },
          }}
          onChange={(value) => {
            const cleanedValue = value.replace(/\D/g, "");

            if (cleanedValue.length === 1 && !/^[6-9]$/.test(cleanedValue)) {
              setError("mobileNumber", {
                type: "manual",
                message: "Mobile number must start with 6-9.",
              });
              return;
            }
            if (cleanedValue.length <= 10) {
              setValue("mobileNumber", cleanedValue);
            }
          }}
          onSubmit={handleSubmit}
        />
      )}
    </>
  );
};

export default QuickLinksComponent;
