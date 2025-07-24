/* eslint-disable react-hooks/exhaustive-deps */
import BackButton from "@/components/buttons/BackButton";
import EmptyMessage from "@/components/EmptyMessage";
import Loader from "@/components/LoaderComponent";
import { useDynamicMutation, useDynamicQuery } from "@/hooks/dynamicQuery";
import { useAadhaarRegistrationBeneLazy, useDigiData } from "@/hooks/service";
import service from "@/jsonDemo/services.json";
import AccountLedger from "@/pages/accountLedger";
import CreditCardBill from "@/pages/creditCardBillPayment";
import EducationFees from "@/pages/educationFees";
import FundSettlement from "@/pages/fundSettlement";
import SenderDetails from "@/pages/fundWithdrawl/components/SenderDetails";
import FundWithdrawal from "@/pages/fundWithdrawl/FundWithdrawl";
import LoadWallet from "@/pages/loadWallet";
import RegisterBeneficiary from "@/pages/registerBeneficiary";
import ContactCard from "@/pages/relationshipManager";
import RentPayment from "@/pages/rentPayment";
import TotalPayoutList from "@/pages/totalPayout";
import TransactionsTabs from "@/pages/transaction";
import { setKycData } from "@/redux/slices/aadharSlice";
import { updateLoading } from "@/redux/slices/appSlice";
import { setAccount } from "@/redux/slices/senderDataSlice";
import { setSelectedService, updateIsText } from "@/redux/slices/serviceSlice";
import { RootState } from "@/redux/store";
import { QuickLinksType } from "@/types";
import { getDynamicRequest } from "@/utils/dynamicRequest";
import clsx from "clsx";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { FaSyncAlt } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

interface FormData {
  mobileNumber: string;
}

const QuickLinksFormComponent = () => {
  const [senderData, setSenderData] = useState<TODO | null>(null);
  const SenderResponseData = senderData?.apiResponseData?.data[0];

  const { selectedService, isText } = useSelector(
    (state: RootState) => state.service
  );

  const { endpoints } = useSelector((state: RootState) => state.endPoints);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!selectedService) {
      const educationService = service.services.find(
        (service) =>
          service.type === "pgPayout" && service.label === "Education Fees"
      ) as TODO;
      if (educationService) {
        dispatch(setSelectedService(educationService));
      }
    }
  }, [selectedService]);

  const {
    control,
    formState: { errors },
    watch,
    handleSubmit,
    setError,
    reset,
  } = useForm<FormData>({
    mode: "onChange",
  });

  const mobileNumber = watch("mobileNumber");

  const { mutate } = useDynamicMutation<TODO>();
  const registerSenderName = "getDigiTokenLazy";

  const requestRegisterSender = getDynamicRequest(
    registerSenderName ?? "",
    endpoints ?? {},
    {},
    {
      Authorization: import.meta.env.VITE_AUTHORIZATION,
      id: import.meta.env.VITE_TOKEN_ID,
    },
    {},
    {},
    "digi_auth_url"
  );

  const { data: digitoken } = useDynamicQuery<TODO>(requestRegisterSender!, {
    enabled: !!requestRegisterSender,
    queryKey: [registerSenderName],
  });

  const accessToken = digitoken?.apiResponseData?.responseData?.accessToken;
  const { refetch: fetchAadhaar } = useAadhaarRegistrationBeneLazy(
    accessToken ?? "",
    mobileNumber,
    "FETCH"
  );

  const { mutateAsync: fetchDigiData } = useDigiData();
  const stepName = selectedService?.sequence[0];

  const request = getDynamicRequest(stepName ?? "", endpoints ?? {}, {
    mobileNumber: mobileNumber,
  });

  const fetchSender = () => {
    if (!request?.url) return;
    dispatch(updateLoading({ isLoading: true }));

    mutate(request, {
      onSuccess: (data) => {
        setSenderData(data);
        dispatch(setAccount(data));
        dispatch(updateLoading({ isLoading: false }));
      },
      onError: () => {
        setSenderData(null);
        dispatch(updateLoading({ isLoading: false }));
      },
    });
  };

  // Handle form submission
  const onSubmit = (data: FormData) => {
    if (data.mobileNumber.length === 10 && !errors.mobileNumber) {
      fetchSender();
    }
  };

  useEffect(() => {
    dispatch(setAccount(SenderResponseData));
  }, [SenderResponseData]);

  useEffect(() => {
    if (mobileNumber?.length === 10 && !errors.mobileNumber) {
      fetchSender();
    } else {
      setSenderData(null);
    }
  }, [mobileNumber, errors.mobileNumber]);

  const { data, isLoading } = useDynamicQuery<TODO>(
    request ?? { url: "", method: "GET" },
    {
      queryKey: [stepName],
      enabled: !!request,
    }
  );

  useEffect(() => {
    reset({ mobileNumber: "" });
    setSenderData(null);
  }, [selectedService]);

  const agentsDataForBeneficiary = data?.apiResponseData?.data;
  const agentsData = data?.apiResponseData?.data?.panCardData;
  const sendData = senderData?.apiResponseData?.data[0];

  if (isLoading) return <Loader />;

  const hiddenLabels: QuickLinksType[] = [
    QuickLinksType.T,
    QuickLinksType.TP,
    QuickLinksType.AL,
    QuickLinksType.RM,
    QuickLinksType.LW,
    QuickLinksType.RB,
    QuickLinksType.FW,
  ];

  const shouldShowMobileInput =
    selectedService?.label !== undefined &&
    !hiddenLabels.includes(selectedService.label as QuickLinksType);

  const handleKYC = async () => {
    if (!accessToken) {
      toast.error("Access token not available.");
      return;
    }
    dispatch(updateLoading({ isLoading: true }));
    try {
      const aadharRegister = await fetchAadhaar();

      if (aadharRegister?.data?.apiResponseData?.responseCode === "200") {
        const { url } = JSON.parse(
          aadharRegister?.data?.apiResponseData?.responseData
        );

        const { requestId } = JSON.parse(
          aadharRegister?.data?.apiResponseData?.responseData
        );

        const aadharRegisterJSON = JSON.parse(
          aadharRegister?.data?.apiResponseData?.responseData
        );

        if (aadharRegisterJSON?.panAvaliable) {
          // When PAN is available, directly set KYC data and update state
          dispatch(setKycData(aadharRegisterJSON));

          dispatch(updateIsText(QuickLinksType.RB));
        } else {
          const newChildWindow = window.open(
            url,
            "_blank",
            "width=800,height=600"
          );
          // Only monitor the window when PAN is NOT available
          const monitorWindow = setInterval(() => {
            if (!newChildWindow || newChildWindow.closed) {
              clearInterval(monitorWindow);
              console.error("Child window closed before success.");
            } else {
              try {
                const currentUrl = newChildWindow.location.href;

                if (currentUrl.includes(import.meta.env.VITE_REDIRECTION_URL)) {
                  const params = new URLSearchParams(
                    new URL(currentUrl).search
                  );
                  const state = params.get("state");

                  if (state || requestId) {
                    (async () => {
                      const digiDataResponse = await fetchDigiData({
                        digiToken: accessToken,
                        requestId: requestId!,
                        beneMobileKyc: mobileNumber,
                      });

                      const digiResponse = JSON.parse(
                        digiDataResponse?.apiResponseData?.responseData
                      );

                      dispatch(setKycData(digiResponse));

                      if (
                        digiDataResponse?.apiResponseData?.responseCode ===
                        "200"
                      ) {
                        dispatch(updateIsText(QuickLinksType.RB));
                      }

                      console.log("Fetched Digi Data:", digiResponse);
                    })();
                  }

                  newChildWindow.close();
                  clearInterval(monitorWindow);
                }
              } catch (error) {
                // Ignore errors due to cross-origin restrictions
                console.debug("New Window Error", error);
              }
            }
          }, 500);
        }
      } else {
        toast.error(aadharRegister?.data?.apiResponseData?.responseMessage);
        console.error(
          "Error creating Digilocker URL:",
          aadharRegister?.data?.apiResponseData?.responseMessage
        );
      }
    } catch (error) {
      toast.error("Error submitting");
      console.log(error);
    } finally {
      dispatch(updateLoading({ isLoading: false }));
    }
  };

  return (
    <div className="flex flex-col lg:h-full min-h-0">
      <div>
        {selectedService?.type !== "pgPayout" || isText ? <BackButton /> : null}
      </div>
      {!isText ? (
        <div className="flex flex-col lg:flex-row lg:gap-4 gap-2 lg:h-full min-h-0 md:flex-col overflow-y-auto lg:overflow-hidden ">
          <div className={clsx("lg:bg-white bg-transparent")}>
            {shouldShowMobileInput && (
              <form
                autoComplete="off"
                className="pb-2 lg:p-3 rounded-md w-full"
                onSubmit={handleSubmit(onSubmit)}
              >
                <label className="text-start text-sm lg:text-md lg:mb-0 mb-2">
                  Enter Mobile Number
                </label>
                <div className="relative rounded-lg h-9 w-full">
                  <Controller
                    control={control}
                    name="mobileNumber"
                    rules={{
                      required: "Mobile number is required",
                      validate: {
                        validFormat: (value) =>
                          /^[6-9]\d{0,9}$/.test(value) ||
                          "Enter a valid 10-digit mobile number starting with 6-9.",
                        noSixIdenticalDigits: (value) =>
                          !/(.)\1{5}/.test(value) ||
                          "Mobile number cannot have a sequence of the same 6 digits.",
                        notSixDigits: (value) =>
                          value.length !== 6 ||
                          "6-digit mobile numbers are not acceptable.",
                        exactTenDigits: (value) =>
                          value.length === 10 ||
                          "Mobile number must be exactly 10 digits.",
                      },
                    }}
                    render={({ field }) => (
                      <>
                        <div
                          className={clsx(
                            "relative rounded-lg h-9 lg:w-[230px] w-full",
                            field.value?.length === 10
                              ? "border border-gray-400 bg-gray-200"
                              : "border-gradient"
                          )}
                        >
                          <input
                            {...field}
                            type="tel"
                            value={field.value ?? ""}
                            readOnly={(field.value?.length ?? 0) === 10}
                            placeholder="Mobile Number"
                            className={clsx(
                              "my-1 inner-content px-3 py-1 focus:outline-none text-sm w-full",
                              (field.value?.length ?? 0) === 10
                                ? " cursor-not-allowed bg-gray-200"
                                : ""
                            )}
                            onChange={(e) => {
                              const rawValue = e.target.value;
                              const cleanedValue = rawValue.replace(/\D/g, "");

                              if (
                                cleanedValue.length === 1 &&
                                !/^[6-9]$/.test(cleanedValue)
                              ) {
                                setError("mobileNumber", {
                                  type: "manual",
                                  message: "Mobile number must start with 6-9.",
                                });
                                return;
                              }

                              if (/(\d)\1{5}/.test(cleanedValue))
                                return field.onChange("");

                              if (cleanedValue.length <= 10) {
                                field.onChange(cleanedValue);
                              }
                            }}
                          />

                          <button
                            type="button"
                            onClick={() => window.location.reload()}
                            className="absolute right-3 top-5 transform -translate-y-1/2"
                            disabled={(field.value?.length ?? 0) !== 10}
                          >
                            <FaSyncAlt
                              size={16}
                              className="text-secondary-extra-dark"
                            />
                          </button>
                        </div>
                        {errors?.mobileNumber?.message && (
                          <div className="!mt-0.5 text-[10px] text-[#f94d44]">
                            <p>{String(errors.mobileNumber.message)}</p>
                          </div>
                        )}
                      </>
                    )}
                  />
                </div>
              </form>
            )}
            <>
              {selectedService?.label === QuickLinksType.CC ||
              selectedService?.label === QuickLinksType.FS ||
              selectedService?.label === QuickLinksType.RP ||
              selectedService?.type === "pgPayout" ? (
                <SenderDetails senderData={sendData} />
              ) : null}
              {selectedService?.label === QuickLinksType.FW && (
                <SenderDetails showBankAcc={false} senderData={agentsData} />
              )}
            </>
          </div>
          {senderData?.apiResponseData?.data === "" ? (
            <div className="flex-1 h-full min-h-0">
              <div className="text-red-500 text-md font-semibold my-10 text-center bg-background ">
                <div>Mobile number not found, kindly register yourself !</div>
              </div>
              <div className={`flex gap-12 justify-center`}>
                <button
                  onClick={handleKYC}
                  className="bg-primary text-white py-2 px-4 rounded-md"
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
                  Initiate KYC
                </button>
              </div>
            </div>
          ) : (
            <div className="flex-1 lg:h-full min-h-0 overflow-hidden">
              {selectedService ? (
                selectedService.type === "pgPayout" ? (
                  <EducationFees senderData={sendData} />
                ) : selectedService.label === QuickLinksType.FW ? (
                  <FundWithdrawal senderDataFW={agentsDataForBeneficiary} />
                ) : selectedService.label === QuickLinksType.CC ? (
                  <CreditCardBill senderData={SenderResponseData} />
                ) : selectedService.label === QuickLinksType.FS ? (
                  <FundSettlement senderData={sendData} />
                ) : selectedService.label === QuickLinksType.RP ? (
                  <RentPayment senderData={sendData} />
                ) : selectedService?.label === QuickLinksType.T ? (
                  <TransactionsTabs />
                ) : selectedService?.label === QuickLinksType.TP ? (
                  <TotalPayoutList />
                ) : selectedService?.label === QuickLinksType.AL ? (
                  <AccountLedger />
                ) : selectedService?.label === QuickLinksType.RM ? (
                  <ContactCard />
                ) : selectedService?.label === QuickLinksType.LW ? (
                  <LoadWallet />
                ) : (
                  <EmptyMessage />
                )
              ) : null}
            </div>
          )}
        </div>
      ) : (
        <>{isText === QuickLinksType.RB && <RegisterBeneficiary />}</>
      )}
    </div>
  );
};

export default QuickLinksFormComponent;
