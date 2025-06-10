/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import agents from "@/jsonDemo/agent.json";
import { RootState } from "@/redux/store";
import { QuickLinksType } from "@/types";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { GrUserSettings } from "react-icons/gr";
import { MdOutlineVerified } from "react-icons/md";
import { VscUnverified } from "react-icons/vsc";
import { useSelector } from "react-redux";
import AddBankAccount from "./AddBankAccount";
import ModalBtn from "./buttons/ModalBtn";
import RegisterModal from "./registerModal";

interface IProps {
  onClick?: () => void;
  tableName: string;
}

const BeneficiaryDetails = ({ onClick, tableName }: IProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState("");

  const methods = useForm<any>();

  const handleCancel = () => {
    setIsModalOpen("");
  };

  const { selectedService } = useSelector((state: RootState) => state.service);
  const [expandedAccount, setExpandedAccount] = useState(null);

  const toggleAccountAccordion = (accountNumber: any) => {
    setExpandedAccount(
      expandedAccount === accountNumber ? null : accountNumber
    );
  };

  const filteredAccounts = useMemo(() => {
    if (!agents?.accounts) return [];
    return agents.accounts.filter((account) =>
      account.bankName.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [agents?.accounts, searchTerm]);

  return (
    <>
      <div className=" w-full p-4 shadow-md bg-white">
        <div className=" flex flex-row gap-2 justify-between items-center mb-3">
          <div className=" w-full">
            {selectedService?.label === QuickLinksType.FS || selectedService?.label === QuickLinksType.RP && (
              <input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by bank name"
                className="border-2 rounded-lg w-full p-2 focus:outline-none"
              />
            )}
          </div>
          <div className=" flex gap-4 whitespace-nowrap">
            {selectedService?.label !== QuickLinksType.RP && <ModalBtn
              title="Add Account +"
              modalOnClick={() => {
                setIsModalOpen("addAccount");
              }}
            />}
          
            {selectedService?.label === QuickLinksType.FS && (
              <ModalBtn
                title="Add Beneficiary +"
                modalOnClick={() => {
                  setIsModalOpen("beneficiaryAcc");
                }}
              />
            )}
            {selectedService?.label === QuickLinksType.RP && (
              <ModalBtn
                title="Add Beneficiary +"
                modalOnClick={() => {
                  setIsModalOpen("");
                }}
              />
            )}
          </div>
        </div>
        <div className="max-h-[48.5vh] overflow-y-auto">
          <p className="block font-medium my-2">{tableName}</p>
          {filteredAccounts && filteredAccounts.length > 0 ? (
            filteredAccounts.map((account, index) => {
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
                              {account.bankName}
                              {account.defaultAccount && (
                                <span className="flex items-center text-xs text-blue-500">
                                  <GrUserSettings className="mr-1" />
                                  (Primary Account)
                                </span>
                              )}
                            </h3>

                            <div className="flex gap-4 text-gray-700 text-sm">
                              <h3 className="w-80">
                                {" "}
                                Account Number: {account.accountNumber}
                              </h3>
                              <h1>IFSC Code: {account.ifscCode}</h1>
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

                      <button
                        type="button"
                        onClick={onClick}
                        // ref={proceedButtonRefFw}
                        // onClick={handleOpenModal}
                        className="px-3 py-2 mt-3 bg-secondary text-white rounded-md hover:bg-secondary-light transition-all duration-200"
                        style={{
                          border: "3px solid transparent",
                          borderRadius: "8px", // Ensure border-radius is maintained
                          borderImage:
                            "linear-gradient(45deg, #4b5a9f, #4fb5b7) 3",
                          backgroundClip: "border-box", // Keep the background clipped to the border
                          WebkitMaskImage: "linear-gradient(white, white)", // Fix for some browsers
                          boxShadow:
                            "rgba(0, 0, 0, 0.17) 0px -23px 25px 0px inset, rgba(0, 0, 0, 0.15) 0px -36px 30px 0px inset, rgba(0, 0, 0, 0.1) 0px -79px 40px 0px inset, rgba(0, 0, 0, 0.06) 0px 2px 1px, rgba(0, 0, 0, 0.09) 0px 4px 2px, rgba(0, 0, 0, 0.09) 0px 8px 4px, rgba(0, 0, 0, 0.09) 0px 16px 8px, rgba(0, 0, 0, 0.09) 0px 32px 16px",
                        }}
                      >
                        Proceed
                      </button>
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <p>No accounts available.</p>
          )}
        </div>
        {isModalOpen === "addAccount" && (
          <AddBankAccount handleCancel={handleCancel} />
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
      </div>
    </>
  );
};
export default BeneficiaryDetails;
