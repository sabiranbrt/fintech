import { RootState } from "@/redux/store";
import { useSelector } from "react-redux";
import slab from "@/jsonDemo/getSlab.json";
import RadioButton from "../radioButton";
import { useForm } from "react-hook-form";
import agent from "@/jsonDemo/agent.json";
import { MdOutlineVerified } from "react-icons/md";
import { VscUnverified } from "react-icons/vsc";
import getMobileNumber from "@/jsonDemo/getMobileNumberData.json";
import { wordCapitalize } from "@/utils/wordCapitalize";
import TransferNotice from "../transferNotice";
import SwitchGroup from "../buttons/switchBtn";
import InputField from "../inputField";
import SlipButtons from "../slipbuttons/SlipButtons";
import FeeBox from "../feeBox";

interface IProp {
  handleCancel: () => void;
}

const PaymentModal = ({ handleCancel }: IProp) => {
  const checkedBeneficiary = getMobileNumber[0];
  const { selectedService } = useSelector((state: RootState) => state.service);
  const isVerified = true;
  const method = useForm();

  const feeBox = [
    {
      title: "Service",
      value: "2000",
    },
    {
      title: "Markup",
      value: "2000",
    },
    {
      title: "Transfer Amount",
      value: "2000",
    },
    {
      title: "Load Amount",
      value: "2000",
    },
  ];

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 p-4 z-[2]">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl animate-fadeIn max-h-[76vh] overflow-y-auto">
        <div className="p-1 border-b border-gray-100">
          <h1 className="text-xl font-semibold text-gray-800 items-center gap-3 ml-4 mr-4">
            {selectedService?.label}

            <div className="text-base text-primary flex justify-center text-left flex-nowrap">
              {slab.note}
            </div>

            <div className="flex flex-nowrap items-center justify-end mt-2 w-full space-x-4 relative group">
              <div className="text-base text-primary w-full">{slab.note}</div>
              <div className="flex flex-nowrap items-center justify-end mt-2 w-full space-x-4 relative group">
                <RadioButton
                  names="cardType"
                  control={method.control}
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
                        selectedService?.label === "Credit Card Bill Pay"
                          ? "flex flex-col gap-2 "
                          : "flex items-center gap-8"
                      }`}
                    >
                      <div>
                        <p className="text-sm text-gray-500 ">Full Name</p>
                        <p className="text-sm font-medium text-gray-800 capitalize">
                          {[
                            checkedBeneficiary.firstName,
                            checkedBeneficiary.middleName,
                            checkedBeneficiary.lastName,
                          ]
                            ?.filter(Boolean)
                            ?.join(" ") || "N/A"}
                        </p>
                      </div>

                      <div>
                        <p className="text-sm text-gray-500">Mobile Number</p>
                        <p className="text-sm font-medium text-gray-800">
                          {checkedBeneficiary?.mobileNumber || "N/A"}
                        </p>
                      </div>
                    </div>
                  </div>
                  {selectedService?.label === "Credit Card Bill Pay" && (
                    <div className="space-y-3 bg-gray-50 rounded-xl p-2 w-full border-2">
                      <h2 className="text-sm font-medium text-gray-600">
                        Card Details
                      </h2>
                      <div>
                        <p className="text-sm text-gray-500">Card Number</p>
                        <p className="text-sm font-medium text-gray-800">
                          {checkedBeneficiary.accountNumber
                            ? `XXXXXXXXXXXX${checkedBeneficiary.accountNumber.slice(
                                -4
                              )}`
                            : "N/A"}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Bank Name</p>
                        <p className="text-sm font-medium text-gray-800">
                          {checkedBeneficiary.bankName || "N/A"}
                        </p>
                      </div>
                      {selectedService.label !== "Credit Card Bill Pay" && (
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

            {selectedService?.label === "Fund Withdrawal" ? (
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
                      {slab?.slabDetails.map((item, index) => (
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
            ) : (
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
          </div>

          {/* Right Section - Transfer Form */}
          <div className=" mt-2 px-6 pb-6 bg-gray-50 lg:bg-white lg:border-l border-gray-100">
            {selectedService?.label === "Fund Withdrawal" && null}

            <div className="space-y-4 ">
              {/* Transfer Type */}

              <SwitchGroup
                options={[
                  {
                    label: "Tab 1",
                    value: "tab1",
                    onClick: () => {},
                  },
                  {
                    label: "Tab 2",
                    value: "tab2",
                    onClick: () => {},
                  },
                  {
                    label: "Tab 3",
                    value: "tab3",
                    onClick: () => {},
                  },
                ]}
              />

              {/* Amount Input */}

              <p className="text-sm text-blue-500">
                Request Amount must be between ₹
                {slab?.limitDetails?.minValue || 1} and ₹
                {slab?.limitDetails?.maxValue || 50000}
              </p>

              <div className="w-full flex justify-center gap-2">
                <div className="flex-2">
                  <div className="w-full flex justify-center flex-col gap-y-0">
                    <InputField
                      control={method.control}
                      names="requestAmt"
                      type="number"
                      label="Request Amount"
                      placeHolder="0.00"
                      // onChange={(value) => {
                      //   validateAmount(value);
                      //   setFormData((prev) => ({
                      //     ...prev,
                      //     amount: inputValue,
                      //   }));
                      // }}
                      InputBlur={() => {}}
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
                      control={method.control}
                      names="charges"
                      type="number"
                      label="Charges"
                      placeHolder="Charge Value"
                      value={parseFloat("2000").toFixed(2)}
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
                {/* {word && (
                  <span>
                    {word} {" Rupees only"}
                  </span>
                )} */}
              </div>

              <InputField
                wrapBorder
                type="number"
                control={method.control}
                names="cardDigit"
                label="First 6 Digits of Your Card"
                maxLength={6}
                placeHolder="XXXX XX"
              />
            </div>

            <div className=" grid grid-cols-2 gap-2 mt-4">
              {feeBox.map((fee, index) => {
                return (
                  <div key={index}>
                    <FeeBox title={fee.title} value={fee.value} />
                  </div>
                );
              })}
            </div>

            <SlipButtons />

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
                className="px-6 py-2.5 bg-[#4b5a9f] text-white text-sm font-medium rounded-lg hover:bg-opacity-90 transition-all duration-200 shadow-lg shadow-indigo-200"
                onClick={() => {}}
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
