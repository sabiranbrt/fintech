/* eslint-disable @typescript-eslint/no-explicit-any */
import { useDynamicMutation, useDynamicQuery } from "@/hooks/dynamicQuery";
import agent from "@/jsonDemo/agent.json";
import getMobileNumber from "@/jsonDemo/getMobileNumberData.json";
import { RootState } from "@/redux/store";
import { QuickLinksType } from "@/types";
import { getDynamicRequest } from "@/utils/dynamicRequest";
import { wordCapitalize } from "@/utils/wordCapitalize";
import clsx from "clsx";
import { toWords } from "number-to-words";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { MdOutlineVerified } from "react-icons/md";
import { VscUnverified } from "react-icons/vsc";
import { useSelector } from "react-redux";
import SwitchGroup from "../buttons/switchBtn";
import FeeBox from "../feeBox";
import InputField from "../inputField";
import RadioButton from "../radioButton";
import SlipButtons from "../slipbuttons/SlipButtons";
import TransferNotice from "../transferNotice";

interface IProp {
  handleCancel: () => void;
  bankDetails?: string;
  senderData?: any;
}

const PaymentModal = ({ handleCancel, bankDetails, senderData }: IProp) => {
  const checkedBeneficiary = getMobileNumber[0];

  const { selectedService } = useSelector((state: RootState) => state.service);
  const { endpoints } = useSelector((state: RootState) => state.endPoints);
  const { cusVal } = useSelector((state: RootState) => state.form);
  const [requestAmount, setRequestAmount] = useState<string>("");

  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(
    Array.isArray(selectedService?.paymentMethods) &&
      selectedService.paymentMethods.length > 0
      ? selectedService.paymentMethods[0].value
      : "IMPS"
  );
  const switchOptions = (selectedService?.paymentMethods || []).map(
    (method) => ({
      value: method.value,
      label: method.label,
    })
  );
  const handlePaymentOption = (value: string) => {
    setSelectedPaymentMethod(value);
  };

  const isVerified = true;
  const {
    control,
    formState: { errors },
  } = useForm<any>({
    mode: "onChange",
  });

  const stepName = selectedService?.sequence?.[2];
  const chargeDetails = selectedService?.sequence?.[3];
  const initPayout = selectedService?.sequence?.[4];

  const { mutate } = useDynamicMutation<any>();

  const request = useMemo(() => {
    return getDynamicRequest(stepName ?? "", endpoints ?? {}, {
      type: selectedService?.alias,
      cardType: "credit",
      transferType:
        selectedService?.label === QuickLinksType?.CC
          ? bankDetails
          : selectedService?.label === QuickLinksType?.FW ? selectedPaymentMethod : "IMPS",
    });
  }, [
    stepName,
    endpoints,
    selectedService?.alias,
    selectedService?.label,
    selectedPaymentMethod,
    bankDetails,
  ]);

  const requestCharge = useMemo(() => {
    return getDynamicRequest(chargeDetails ?? "", endpoints ?? {}, {
      charge: "0",
      amount: requestAmount,
      type: selectedService?.alias,
      ccType: "credit",
      selectedChargeType: "amount",
      transferType:
        selectedService?.label === QuickLinksType?.CC
          ? bankDetails
          : selectedPaymentMethod,
    });
  }, [
    chargeDetails,
    endpoints,
    selectedService?.alias,
    selectedService?.label,
    selectedPaymentMethod,
    requestAmount,
    bankDetails,
  ]);

  const { data: slabs } = useDynamicQuery<any>(request!, {
    enabled: !!request && (!!selectedPaymentMethod || !!bankDetails),
    queryKey: [stepName, selectedPaymentMethod, bankDetails],
  });

  const { data: Charge } = useDynamicQuery<any>(requestCharge!, {
    enabled:
      !!requestCharge &&
      !!requestAmount &&
      (!!selectedPaymentMethod || !!bankDetails),
    queryKey: [
      chargeDetails,
      requestAmount,
      selectedPaymentMethod,
      bankDetails,
    ],
  });

  const slab = slabs?.apiResponseData?.data;
  const chargeDetail = Charge?.apiResponseData?.data;

  const params = {
    acquirerInfo: {
      ip: "180.151.31.10",
      reqLat: "27.67561482423071",
      reqLong: "85.31395684387198",
      commDeviceId: "commDeviceId_f4c6e43c16d1",
      requestSource: "requestSource_bf89dd79647e",
      id: "9241980104198913",
    },
    paymentInfo: {
      amount: parseFloat(requestAmount) || 12,
      transType: selectedService?.alias || "CC",
      cardType: "credit",
    },
    dynamicValues: {
      cardLastSixDigits: cusVal?.cardAccount?.slice(-6) || "",
      amount: requestAmount || "12",
      senderMobile: senderData?.mobileNumber || "9878978978",
      beneMobile:
        checkedBeneficiary?.beneficiaries[0]?.beneficiaryMobile || "9484944844",
      charge: chargeDetail?.totalCharge || "29.50",
      markup: "",
      transType: selectedService?.alias || "CC",
      transferType: bankDetails || "IMPS",
      finalAmount: chargeDetail?.finalAmount || 12,
      loadAmount: chargeDetail?.requestAmount || 41.5,
      selectedChargeType: "amount",
      accountInfo: {
        bankName:
          checkedBeneficiary?.bankName ||
          cusVal?.bankName?.bankName ||
          "ABN AMRO BANK CREDIT CARD",
        bankIfsc: checkedBeneficiary?.accountIfsc || "ABNA0200001",
        accountNumber:
          checkedBeneficiary?.accountNumber ||
          cusVal?.cardAccount ||
          "3893893892389348",
      },
    },
  };

  const requestPayout = getDynamicRequest(
    initPayout ?? "",
    endpoints ?? {},
    params
  );

  const onSubmit = () => {
    mutate(requestPayout ?? { url: "", method: "POST" }, {
      onSuccess: (data: any) => {
        console.log("Mutation success:", data);
      },
      onError: (err: any) => {
        console.error("Mutation error:", err);
      },
    });
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 p-4 z-[2]">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl animate-fadeIn max-h-[76vh] overflow-y-auto">
        <div className="p-1 border-b border-gray-100">
          <h1 className="text-xl font-semibold text-gray-800 items-center gap-3 ml-4 mr-4">
            {selectedService?.label}

            <div className="text-base text-primary flex justify-center text-left flex-nowrap">
              {slab?.note ?? ""}
            </div>
            {selectedService?.label !== QuickLinksType?.CC &&
              selectedService?.label !== QuickLinksType?.FW && (
                <div className="flex flex-nowrap items-center justify-end mt-2 w-full space-x-4 relative group">
                  <div className="text-base text-primary w-full">
                    {slab?.note ?? ""}
                  </div>
                  <div className="flex flex-nowrap items-center justify-end mt-2 w-full space-x-4 relative group">
                    <RadioButton
                      names="cardType"
                      control={control}
                      labelClassName=" text-[14px]"
                      options={[
                        {
                          value: "creditCard",
                          label: "Credit Card",
                          default: true,
                        },
                        { value: "masterCard", label: "Master Card" },
                        {
                          value: "corporateCard",
                          label: "Corporate Card",
                          disable: true,
                        },
                      ]}
                    />
                  </div>
                </div>
              )}
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2">
          {/* Left Section - Details */}
          <div className="p-2 space-y-2">
            {/* Sender Details Card */}
            {selectedService?.label === "Fund Withdrawal" ? (
              <>
                <div className="flex justify-between gap-2">
                  <div className="space-y-3 bg-gray-50 rounded-xl p-2 w-full border-2">
                    <h2 className="text-sm font-medium text-gray-600">
                      Merchant Details
                    </h2>
                    <div>
                      <p className="text-sm text-gray-500">First Name</p>
                      <p className="text-sm font-medium text-gray-800 capitalize">
                        {agent?.panCardData?.firstName || "N/A"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Middle Name</p>
                      <p className="text-sm font-medium text-gray-800 capitalize">
                        {agent?.panCardData?.middleName || "N/A"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Last Name</p>
                      <p className="text-sm font-medium text-gray-800 capitalize">
                        {agent?.panCardData?.lastName || "N/A"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Mobile</p>
                      <p className="text-sm font-medium text-gray-800">
                        {agent?.panCardData?.mobile_no || "N/A"}
                      </p>
                    </div>
                    {/*  <div>
                             <p className="text-sm text-gray-500">Pan</p>
                             <p className="text-sm font-medium text-gray-800">
                               {senderData?.panCardData?.pan || "N/A"}
                             </p>
                           </div> */}
                  </div>
                  <div className="space-y-3 bg-gray-50 rounded-xl p-2 w-full border-2">
                    <h2 className="text-sm font-medium text-gray-600">
                      Account Details
                    </h2>
                    <div>
                      <p className="text-sm text-gray-500">Account Number</p>
                      <p className="text-sm font-medium text-gray-800">
                        {agent.accounts[0].accountNumber || "N/A"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Bank Name</p>
                      <p className="text-sm font-medium text-gray-800">
                        {agent.accounts[0].bankName || "N/A"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Bank IFSC</p>
                      <p className="text-sm font-medium text-gray-800">
                        {agent.accounts[0].ifscCode || "N/A"}
                      </p>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="flex justify-between gap-2">
                  <div className="bg-gray-50 rounded-xl p-2 w-full border-2">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-sm font-medium text-gray-600">
                        Sender Details
                      </h2>
                    </div>
                    <div></div>
                    <div
                      className={`${
                        selectedService?.label === QuickLinksType?.CC
                          ? "flex flex-col gap-2 "
                          : "flex items-center gap-8"
                      }`}
                    >
                      <div>
                        <p className="text-sm text-gray-500 ">Full Name</p>
                        <p className="text-sm font-medium text-gray-800 capitalize">
                          {[
                            senderData?.firstName,
                            senderData?.middleName,
                            senderData?.lastName,
                          ]
                            ?.filter(Boolean)
                            ?.join(" ") || "N/A"}
                        </p>
                      </div>

                      <div>
                        <p className="text-sm text-gray-500">Mobile Number</p>
                        <p className="text-sm font-medium text-gray-800">
                          {senderData?.mobileNumber || "N/A"}
                        </p>
                      </div>
                    </div>
                  </div>
                  {selectedService?.label === QuickLinksType.CC && (
                    <div className="space-y-3 bg-gray-50 rounded-xl p-2 w-full border-2">
                      <h2 className="text-sm font-medium text-gray-600">
                        Card Details
                      </h2>
                      <div>
                        <p className="text-sm text-gray-500">Card Number</p>
                        <p className="text-sm font-medium text-gray-800">
                          {cusVal?.cardAccount
                            ? `XXXXXXXXXXXX${cusVal?.cardAccount.slice(-4)}`
                            : "N/A"}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Bank Name</p>
                        <p className="text-sm font-medium text-gray-800">
                          {cusVal?.bankName?.bankName || "N/A"}
                        </p>
                      </div>
                      {selectedService.label !== QuickLinksType?.CC && (
                        <div>
                          <p className="text-sm text-gray-500">Bank IFSC</p>
                          <p className="text-sm font-medium text-gray-800">
                            {checkedBeneficiary.accountIfsc || "N/A"}
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </>
            )}

            {/* Beneficiary Details Card */}
            {selectedService?.label !== QuickLinksType?.CC &&
              selectedService?.label !== QuickLinksType?.FW && (
                <div>
                  <div className="bg-gray-50 rounded-xl p-2 border-2">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-sm font-medium text-gray-600">
                        Beneficiary Details
                      </h2>
                      {/* <span className="px-3 py-1 bg-blue-50 text-blue-600 text-xs font-medium rounded-full">
                         Verified
                       </span> */}{" "}
                      {!isVerified ? (
                        <>
                          {checkedBeneficiary.isAccountVerified ? (
                            <div className="flex items-center text-green-600">
                              <MdOutlineVerified className="w-4 h-4" />
                              <span className="text-sm ml-1">Verified</span>
                            </div>
                          ) : (
                            <div className="flex items-center text-red-500">
                              <VscUnverified className="w-4 h-4" />
                              <span className="text-sm ml-1">Unverified</span>
                            </div>
                          )}
                        </>
                      ) : (
                        <>
                          <div className="flex items-center text-green-600">
                            <MdOutlineVerified className="w-4 h-4" />
                            <span className="text-sm ml-1">Verified</span>
                          </div>
                        </>
                      )}
                      {/*  {checkedBeneficiary.isAccountVerified ? (
                                   <div className="flex items-center text-green-600">
                                     <MdOutlineVerified className="w-4 h-4" />
                                     <span className="text-sm ml-1">Verified</span>
                                   </div>
                                 ) : (
                                   <div className="flex items-center text-red-500">
                                     <VscUnverified className="w-4 h-4" />
                                     <span className="text-sm ml-1">Unverified</span>
                                   </div>
                                 )} */}
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center gap-8">
                        <div>
                          <p className="text-sm text-gray-500">
                            Beneficiary Name
                          </p>
                          <p className="text-sm font-medium text-gray-800">
                            {wordCapitalize(
                              [
                                checkedBeneficiary?.beneficiaries[0]
                                  .beneficiaryFirstName,
                                checkedBeneficiary?.beneficiaries[0]
                                  .beneficiaryMiddleName,
                                checkedBeneficiary?.beneficiaries[0]
                                  .beneficiaryLastName,
                              ]
                                ?.filter(Boolean)
                                ?.join(" ")
                            ) ?? ""}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Mobile Number</p>
                          <p className="text-sm font-medium text-gray-800">
                            {checkedBeneficiary?.beneficiaries[0]
                              .beneficiaryMobile || "N/A"}
                          </p>
                        </div>
                      </div>
                      {/* <div>
                                   <p className="text-sm text-gray-500">
                                     Account Number
                                   </p>
                                   <p className="text-sm font-medium text-gray-800">
                                     {checkedBeneficiary?.accountNumber
                                       ? `XXXXXXXXXXXX${checkedBeneficiary?.accountNumber.slice(
                                           -4
                                         )}`
                                       : "N/A"}
                                   </p>
                                 </div> */}
                      <div>
                        <p className="text-sm text-gray-500">
                          Bank Name & Account Number
                        </p>
                        <p className="text-sm font-medium text-gray-800">
                          {checkedBeneficiary?.bankName} •{" "}
                          {checkedBeneficiary?.accountNumber || "N/A"}
                        </p>
                      </div>
                    </div>
                  </div>
                  {/* {transType !== "FW" &&
                  !(transType === "CC" && senderData.isAccountVerified) &&
                  !checkedBeneficiary.isAccountVerified && (
                    <> */}
                  {!isVerified && <TransferNotice />}
                  {/* </>
                  )} */}
                </div>
              )}

            <div className="space-y-2 mt-3 border-2 rounded-xl">
              <div className="max-h-[200px] overflow-y-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="p-1 text-left">Slab</th>
                      <th className="p-1 text-left">Range</th>
                      <th className="p-1 text-left">Charges</th>
                      <th className="p-1 text-left">GST</th>
                    </tr>
                  </thead>
                  <tbody>
                    {slab?.slabDetails?.map((item: any, index: number) => (
                      <tr key={index} className="border-b last:border-b-0">
                        <td className="p-1">{item.slabSequence ?? "-"}</td>
                        <td className="p-1">
                          ₹{item.minTxnValue ?? "-"} - ₹
                          {item.maxTxnValue ?? "-"}
                        </td>
                        <td className="p-1">
                          {/* {item.calculationType === "PERCENTAGE"
                                           ? item.percentage != null && item.percentage !== ''
                                             ? `${item.percentage}%`
                                             : '-'
                                           : item.fixed != null && item.fixed !== ''
                                             ? `₹${item.fixed}`
                                             : '-'} */}
                          {item?.charges ?? "-"}
                        </td>
                        <td className="p-1">{item.gst ?? "-"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Right Section - Transfer Form */}
          <div className=" mt-2 px-6 pb-6 bg-gray-50 lg:bg-white lg:border-l border-gray-100">
            <div className="space-y-4 ">
              {selectedService?.label !== QuickLinksType?.CC && (
                <SwitchGroup
                  options={switchOptions}
                  defaultValue={selectedPaymentMethod}
                  onOptionClick={(value: any) => handlePaymentOption(value)}
                />
              )}
              {selectedService?.label === QuickLinksType?.CC && (
                <SwitchGroup
                  options={[
                    {
                      value: bankDetails,
                    },
                  ]}
                />
              )}

              {/* Amount Input */}

              <p className="text-sm text-blue-500">
                Request Amount must be between ₹
                {slab?.limitDetails?.minValue || ""} and ₹
                {slab?.limitDetails?.maxValue || ""}
              </p>

              <div className="w-full flex justify-center gap-2">
                <div className="flex-1">
                  <div className="w-full flex justify-center flex-col gap-y-0">
                    <InputField
                      control={control}
                      errors={errors}
                      rules={{
                        required: "Request Amount is required",
                        min: {
                          value: slab?.limitDetails?.minValue || 0,
                          message: `Request Amount must be at least ₹${
                            slab?.limitDetails?.minValue || 0
                          }`,
                        },
                        max: {
                          value: slab?.limitDetails?.maxValue || Infinity,
                          message: `Request Amount cannot exceed ₹${
                            slab?.limitDetails?.maxValue || "unknown"
                          }`,
                        },
                      }}
                      names="requestAmt"
                      type="number"
                      label="Request Amount"
                      placeHolder="0.00"
                      onChange={(value) => {
                        setRequestAmount(value || "");
                      }}
                    >
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                        ₹
                      </span>
                    </InputField>
                  </div>
                </div>

                <div className="flex-1">
                  <div className="w-full flex flex-col gap-y-0">
                    <InputField
                      control={control}
                      names="charges"
                      type="number"
                      label="Charges"
                      placeHolder="Charge Value"
                      value={
                        chargeDetail?.totalCharge
                          ? parseFloat(chargeDetail.totalCharge).toFixed(2)
                          : ""
                      }
                      disabled
                      InputBlur={() => {}}
                    >
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                        ₹
                      </span>
                    </InputField>
                  </div>
                </div>
              </div>

              <div className="mt-2 text-sm text-gray-500 ">
                {requestAmount && (
                  <span>
                    {toWords(requestAmount)} {" Rupees only"}
                  </span>
                )}
              </div>

              {selectedService?.label !== QuickLinksType?.CC &&
                selectedService?.label !== QuickLinksType?.FW && (
                  <InputField
                    wrapBorder
                    type="number"
                    control={control}
                    names="cardDigit"
                    label="First 6 Digits of Your Card"
                    maxLength={6}
                    placeHolder="XXXX XX"
                  />
                )}
            </div>

            <div className=" grid grid-cols-2 gap-2 mt-4">
              {/* <FeeBox title="Service" value="" />
              <FeeBox title="Markup" value="" /> */}
              {requestAmount && (
                <>
                  <FeeBox
                    title="Transfer Amount"
                    value={chargeDetail?.finalAmount}
                  />
                  <FeeBox
                    title="Load Amount"
                    value={chargeDetail?.requestAmount}
                  />
                </>
              )}
            </div>

            {selectedService?.label !== QuickLinksType?.CC &&
            selectedService?.label !== QuickLinksType?.FW ? (
              <SlipButtons />
            ) : null}

            <div className="mt-8 flex items-center justify-end space-x-4">
              <button
                type="button"
                className="px-6 py-2.5 bg-[#800505] text-white text-sm font-medium rounded-lg hover:bg-opacity-90 transition-all duration-200 shadow-lg shadow-indigo-200"
                onClick={handleCancel}
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={
                  Number(requestAmount) <= 0 ||
                  Number(requestAmount) <
                    Number(slab?.limitDetails?.minValue) ||
                  Number(requestAmount) > Number(slab?.limitDetails?.maxValue)
                }
                className={clsx(
                  "!px-6 !py-2.5 text-sm font-medium rounded-lg transition-all duration-200 shadow-lg",
                  Number(requestAmount) <= 0 ||
                    Number(requestAmount) <
                      Number(slab?.limitDetails?.minValue) ||
                    Number(requestAmount) > Number(slab?.limitDetails?.maxValue)
                    ? "bg-gray-400 text-gray-800 cursor-not-allowed shadow-none"
                    : "bg-[#4b5a9f] text-white hover:bg-opacity-90 shadow-indigo-200"
                )}
                onClick={onSubmit}
              >
                Proceed to Transfer
              </button>
            </div>
          </div>
          {/* Action Buttons */}
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;
