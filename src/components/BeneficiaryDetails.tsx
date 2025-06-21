/* eslint-disable @typescript-eslint/no-explicit-any */
import { updateIsText } from "@/redux/slices/serviceSlice";
import { RootState } from "@/redux/store";
import { QuickLinksType } from "@/types";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { GrUserSettings } from "react-icons/gr";
import { MdOutlineVerified } from "react-icons/md";
import { VscUnverified } from "react-icons/vsc";
import { useDispatch, useSelector } from "react-redux";
import AddBankAccount from "./AddBankAccount";
import BtnPrimary from "./buttons/BtnPrimary";
import ModalBtn from "./buttons/ModalBtn";
import PaymentModal from "./paymentModal";
import RegisterModal from "./registerModal";

interface IProps {
  onClick?: () => void;
  tableName: string;
  senderData?: any;
  senderDataFW?: any;
}

const BeneficiaryDetails = ({
  tableName,
  senderData,
  senderDataFW,
}: IProps) => {
  const dispatch = useDispatch();

  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState("");

  const handleCancel = () => {
    setIsModalOpen("");
  };
  const methods = useForm<any>();

  const { selectedService } = useSelector((state: RootState) => state.service);
  const [expandedAccount, setExpandedAccount] = useState(null);

  const toggleAccountAccordion = (accountNumber: any) => {
    setExpandedAccount(
      expandedAccount === accountNumber ? null : accountNumber
    );
  };

  const filteredAccounts = useMemo(() => {
    const search = searchTerm.toLowerCase();

    const accounts = senderData?.beneficiaries || senderDataFW?.accounts || [];

    return accounts.filter((account: any) => {
      const bankName = account.bankName?.toLowerCase() || "";
      const accountNumber = account.accountNumber?.toLowerCase() || "";
      const mobile = account.beneficiaryMobile?.toLowerCase() || "";
      const ifsc = account.ifsc?.toLowerCase() || "";
      return (
        bankName.includes(search) ||
        accountNumber.includes(search) ||
        ifsc.includes(search) ||
        mobile.includes(search)
      );
    });
  }, [senderData?.beneficiaries, senderDataFW?.accounts, searchTerm]);

  return (
    <div className=" w-full p-4 shadow-md bg-white min-h-0 h-full">
      <div className=" flex flex-row gap-2 justify-between items-center mb-3">
        <div className=" w-full">
          {(selectedService?.label === QuickLinksType.FS ||
            selectedService?.label === QuickLinksType.RP ||
            selectedService?.type === "pgPayout") && (
            <input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by bank name"
              className="border-2 rounded-lg w-full p-2 focus:outline-none"
            />
          )}
        </div>
        <div className=" flex gap-4 whitespace-nowrap">
          {selectedService?.label !== QuickLinksType.RP ||
            (selectedService?.type === "pgPayout" && (
              <ModalBtn
                title="Add Account +"
                modalOnClick={() => {
                  setIsModalOpen("addAccount");
                }}
              />
            ))}

          {selectedService?.label === QuickLinksType.FS && (
            <ModalBtn
              title="Add Beneficiary +"
              modalOnClick={() => {
                setIsModalOpen("beneficiaryAcc");
              }}
            />
          )}
          {(selectedService?.label === QuickLinksType.RP ||
            selectedService?.type === "pgPayout") && (
            <ModalBtn
              title="Add Beneficiary +"
              modalOnClick={() => {
                dispatch(updateIsText("Register Beneficiary"));
              }}
            />
          )}
        </div>
      </div>
      <div className="max-h-[48.5vh] min-h-0 h-full">
        <p className="block font-medium my-2">{tableName}</p>
        <div className=" overflow-y-auto min-h-0 h-[90%]">
          {filteredAccounts && filteredAccounts.length > 0 ? (
            filteredAccounts?.map((account: any, index: number) => {
              const isExpanded = expandedAccount === account.accountNumber;
              return (
                <div key={index} className="mb-2 border rounded ">
                  <div
                    className="flex items-center justify-between p-2 bg-gray-100 "
                    onClick={() => {
                      toggleAccountAccordion(account.accountNumber);
                    }}
                  >
                    <div className="flex items-center flex-grow">
                      <div className="flex items-center">
                        <label
                          htmlFor={`account-${index}`}
                          className="flex items-center space-x-3"
                        >
                          <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                            <span className="text-lg font-medium text-gray-600 bg-slate-200 px-4 py-2 rounded-full">
                              {account.bankName.charAt(0)}
                            </span>
                          </div>

                          <div>
                            <h3 className="flex items-center gap-2 text-md font-medium text-grey-900">
                              {selectedService?.label === QuickLinksType?.FW
                                ? account.bankName
                                : `${account?.beneficiaryFirstName} ${account?.beneficiaryMiddleName} ${account?.beneficiaryLastName}`}
                              {account.defaultAccount && (
                                <span className="flex items-center text-xs text-blue-500">
                                  <GrUserSettings className="mr-1" />
                                  (Primary Account)
                                </span>
                              )}
                              {account.selfAccount && (
                                <span className="flex items-center text-xs text-secondary-dark">
                                  <GrUserSettings className="mr-1" />
                                  (Self Account)
                                </span>
                              )}
                              {!account.selfAccount &&
                                !account.defaultAccount && (
                                  <span className="flex items-center text-xs text-primary">
                                    <GrUserSettings className="mr-1" />
                                    (Whitelisted Account)
                                  </span>
                                )}
                            </h3>

                            <div className="flex gap-4 text-gray-700 text-sm">
                              <h3 className="w-80">
                                Account Number: {account.accountNumber}
                              </h3>
                              {selectedService?.label === QuickLinksType.FW && (
                                <h1>
                                  IFSC Code:{" "}
                                  {account.accountIfsc ?? account.ifscCode}
                                </h1>
                              )}

                              {selectedService?.label !== QuickLinksType.FW ? (
                                <h1>Mobile: {account?.beneficiaryMobile}</h1>
                              ) : null}
                            </div>

                            <div className="flex items-center mt-1">
                              {account.defaultAccount ? (
                                <div className="flex items-center text-green-600">
                                  <MdOutlineVerified className="w-4 h-4" />
                                  <span className="text-sm ml-1">Verified</span>
                                </div>
                              ) : account.isAccountVerified ? (
                                <div className="flex items-center text-green-600">
                                  <MdOutlineVerified className="w-4 h-4" />
                                  <span className="text-sm ml-1">Verified</span>
                                </div>
                              ) : (
                                <div className="flex items-center text-red-500">
                                  <VscUnverified className="w-4 h-4" />
                                  <span className="text-sm ml-1">
                                    Unverified
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                        </label>
                      </div>
                    </div>
                    {/* Arrow to expand/collapse the accordion */}
                    {selectedService?.label === QuickLinksType.FW ? null : (
                      <button
                        type="button"
                        className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
                      >
                        <svg
                          stroke="currentColor"
                          fill="none"
                          stroke-width="2"
                          viewBox="0 0 24 24"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          className="w-5 h-5 text-red-500 hover:text-red-600 cursor-pointer"
                          height="1em"
                          width="1em"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <polyline points="3 6 5 6 21 6"></polyline>
                          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                        </svg>
                      </button>
                    )}
                    <div className="flex items-center space-x-4">
                      <div
                        className="flex justify-between items-center bg-gray-100 p-4 transition-colors "
                        onClick={() => {
                          toggleAccountAccordion(account.accountNumber);
                        }}
                      >
                        <svg
                          className={`w-4 h-4 transform transition-transform duration-200 cursor-pointer ${
                            isExpanded ? "rotate-180" : ""
                          }`}
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>
                  {isExpanded && (
                    <div className="bg-gray-50 p-6 border-t  border-gray-200 overflow-hidden">
                      {selectedService?.label === QuickLinksType.FW && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <p className="font-medium">Bank Name:</p>
                            <p>{account.bankName}</p>
                          </div>
                          <div>
                            <p className="font-medium">Account Number:</p>
                            <p>{account.accountNumber}</p>
                          </div>
                          <div>
                            <p className="font-medium">IFSC Code:</p>
                            <p>{account.ifscCode}</p>
                          </div>
                        </div>
                      )}

                      {selectedService?.label !== QuickLinksType.FW && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-1">
                            <p className="text-sm text-gray-500 w-10">Mobile</p>
                            <p className="font-medium">
                              {account.beneficiaryMobile}
                            </p>
                          </div>
                          <div className="space-y-1">
                            <p className="text-sm text-gray-500">Bank Name</p>
                            <p className="font-medium w-52">
                              {account.bankName}
                            </p>
                          </div>
                          <div className="space-y-1">
                            <p className="text-sm text-gray-500">Bank IFSC</p>
                            <p className="font-medium">{account.accountIfsc}</p>
                          </div>
                          <div className="space-y-1">
                            <p className="text-sm text-gray-500">
                              Account Number
                            </p>
                            <p className="font-medium">
                              {account.accountNumber}
                            </p>
                          </div>
                        </div>
                      )}

                      <BtnPrimary
                        onClick={() => setIsModalOpen("paymentModal")}
                        title="Proceed"
                      />
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <p>No accounts available.</p>
          )}
        </div>
      </div>
      {isModalOpen === "addAccount" && (
        <AddBankAccount
          handleCancel={handleCancel}
          senderMobileNumber={senderDataFW?.panCardData?.mobile_no}
        />
      )}
      {isModalOpen === "beneficiaryAcc" && (
        <RegisterModal
          control={methods.control}
          names="beneficiary"
          placeHolder={"Enter Mobile Number"}
          title={"Register Beneficiary"}
          subTitle={"Enter Mobile Number To Initiate KYC"}
          onClose={handleCancel}
        />
      )}
      {isModalOpen === "paymentModal" && (
        <PaymentModal handleCancel={handleCancel} senderData={senderData} />
      )}
    </div>
  );
};

export default BeneficiaryDetails;
