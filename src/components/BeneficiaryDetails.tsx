import { useDynamicMutation } from "@/hooks/dynamicQuery";
import {
  useAadhaarRegistrationBeneLazy,
  useDigiData,
  useDigiTokenLazy,
} from "@/hooks/service";
import { updateLoading } from "@/redux/slices/appSlice";
import { updateIsText } from "@/redux/slices/serviceSlice";
import { RootState } from "@/redux/store";
import { QuickLinksType } from "@/types";
import { getDynamicRequest } from "@/utils/dynamicRequest";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { GrUserSettings } from "react-icons/gr";
import { MdOutlinePending, MdOutlineVerified } from "react-icons/md";
import { VscUnverified } from "react-icons/vsc";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import ActionModal from "./actionModal";
import AddBankAccount from "./AddBankAccount";
import BtnPrimary from "./buttons/BtnPrimary";
import ModalBtn from "./buttons/ModalBtn";
import PaymentModal from "./paymentModal";
import RegisterModal from "./registerModal";
import { setKycData } from "@/redux/slices/aadharSlice";

interface IProps {
  onClick?: () => void;
  tableName: string;
  senderData?: TODO;
  senderDataFW?: TODO;
}

const BeneficiaryDetails = ({
  tableName,
  senderData,
  senderDataFW,
}: IProps) => {
  const dispatch = useDispatch();
  const { mutateAsync: deleleBeneMutant } = useDynamicMutation<TODO>();

  const [deleteModal, setDeleteModal] = useState(false);
  const [accountToDelete, setAccountToDelete] = useState<TODO | null>(null);
  const [beneData, setBeneData] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState("");
  const { selectedService } = useSelector((state: RootState) => state.service);
  const { endpoints } = useSelector((state: RootState) => state.endPoints);

  const handleCancel = () => {
    setIsModalOpen("");
  };

  const {
    control,
    formState: { errors },
    setError,
    setValue,
    watch,
  } = useForm<TODO>({
    mode: "onChange",
  });

  const deleteName = selectedService?.sequence?.find(
    (item) => item === "getBeneficiaryDelete"
  );

  const requestDeleteBene = getDynamicRequest(
    deleteName ?? "",
    endpoints ?? {},
    {
      senderId: senderData?.id,
      beneficiaryId: accountToDelete?.beneficiaryId,
    }
  );

  const mobileNumber = watch("beneficiary");
  const [expandedAccount, setExpandedAccount] = useState(null);

  const toggleAccountAccordion = (account: TODO) => {
    const id = senderData ? account.beneficiaryId : account.accountNumber;
    setExpandedAccount(expandedAccount === id ? null : id);
  };

  const filteredAccounts = useMemo(() => {
    const search = searchTerm.toLowerCase();
    const accounts = senderData?.beneficiaries || senderDataFW?.accounts || [];

    return accounts.filter((account: TODO) => {
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

  const { data: digitoken } = useDigiTokenLazy();
  const accessToken = digitoken?.apiResponseData?.responseData?.accessToken;

  const { refetch: fetchAadhaar } = useAadhaarRegistrationBeneLazy(
    accessToken ?? "",
    mobileNumber ?? "",
    "FETCH"
  );

  const { mutateAsync: fetchDigiData } = useDigiData();

  const handleSubmit = async () => {
    if (!accessToken) {
      toast.error("Access token not available.");
      return;
    }

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

      console.log("aadharRegisterJSON",aadharRegisterJSON)

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
                const params = new URLSearchParams(new URL(currentUrl).search);
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
                      digiDataResponse?.apiResponseData?.responseCode === "200"
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
  };

  const handleDeleteBene = async () => {
    if (!requestDeleteBene?.url) return;
    try {
      dispatch(updateLoading({ isLoading: true }));
      const response = await deleleBeneMutant(requestDeleteBene);
      if (response?.apiResponseData?.responseCode === "200") {
        setDeleteModal(false);
      }
    } catch (error: TODO) {
      toast.error("Error:", error);
    } finally {
      dispatch(updateLoading({ isLoading: false }));
    }
  };

  return (
    <div className=" w-full p-4 shadow-md bg-white min-h-0 lg:h-full">
      <div className=" flex lg:flex-row flex-col gap-2 justify-between lg:items-center mb-3">
        <div className=" w-full">
          {(selectedService?.label === QuickLinksType.FS ||
            selectedService?.label === QuickLinksType.RP ||
            selectedService?.type === "pgPayout") && (
            <input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by bank account,mobile,bank name,or IFSC..."
              className="border-2 rounded-lg w-full p-2 focus:outline-none"
            />
          )}
        </div>
        <div className=" flex gap-4 whitespace-nowrap">
          {(selectedService?.label === QuickLinksType.FW ||
            selectedService?.label === QuickLinksType.FS) && (
            <ModalBtn
              title="Add Account +"
              modalOnClick={() => {
                setIsModalOpen("addAccount");
              }}
            />
          )}

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
                dispatch(updateIsText(QuickLinksType.RB));
              }}
            />
          )}
        </div>
      </div>
      <div className="lg:max-h-[48.5vh] min-h-0 h-full">
        <p className="block font-medium my-2">{tableName}</p>
        <div className=" overflow-y-auto min-h-0 h-[80%]">
          {filteredAccounts && filteredAccounts.length > 0 ? (
            filteredAccounts?.map((account: TODO, index: number) => {
              const isExpanded =
                expandedAccount ===
                (senderData ? account.beneficiaryId : account.accountNumber);

              return (
                <div key={index} className="mb-2 border rounded">
                  <div
                    className="flex items-center justify-between p-2 bg-gray-100"
                    onClick={() => {
                      toggleAccountAccordion(account);
                    }}
                  >
                    <div className="flex items-center flex-grow lg:w-full w-3/4">
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
                            <>
                            <h3 className="flex items-center gap-2 lg:text-base text-sm font-medium text-grey-900">
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
                            </>

                            <div className="flex lg:gap-4 gap-0 text-gray-700 text-sm lg:flex-nowrap flex-wrap">
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

                            {selectedService?.type !== "pgPayout" ? (
                              <div className="flex items-center mt-1">
                                {account.defaultAccount ? (
                                  <div className="flex items-center text-green-600">
                                    <MdOutlineVerified className="w-4 h-4" />
                                    <span className="text-sm ml-1">
                                      Verified
                                    </span>
                                  </div>
                                ) : account.isAccountVerified ? (
                                  <div className="flex items-center text-green-600">
                                    <MdOutlineVerified className="w-4 h-4" />
                                    <span className="text-sm ml-1">
                                      Verified
                                    </span>
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
                            ) : (
                              <div className="flex items-center mt-1">
                                {account.isAccountVerified ? (
                                  <>
                                    {account?.accountVerificationStage?.toLowerCase() ===
                                    "completed" ? (
                                      <>
                                        <div className="flex items-center text-green-600">
                                          <MdOutlineVerified className="w-4 h-4" />
                                          <span className="text-sm ml-1">
                                            Verified
                                          </span>
                                        </div>
                                      </>
                                    ) : account?.accountVerificationStage ===
                                      "MIN_KYC" ? (
                                      <>
                                        <div className="flex items-center text-green-600">
                                          <MdOutlineVerified className="w-4 h-4" />
                                          <span className="text-sm ml-1">
                                            MIN KYC
                                          </span>
                                        </div>
                                      </>
                                    ) : (
                                      <>
                                        <div className="flex items-center text-orange-600">
                                          <MdOutlinePending className="w-4 h-4" />
                                          <span className="text-sm ml-1">
                                            KYC Pending
                                          </span>
                                        </div>
                                      </>
                                    )}
                                  </>
                                ) : (
                                  <>
                                    <div className="flex items-center text-red-500">
                                      <VscUnverified className="w-4 h-4" />
                                      <span className="text-sm ml-1">
                                        Unverified
                                      </span>
                                    </div>
                                  </>
                                )}
                              </div>
                            )}
                          </div>
                        </label>
                      </div>
                    </div>
                    {/* Arrow to expand/collapse the accordion */}
                    {selectedService?.label === QuickLinksType.FW ? null : (
                      <button
                        type="button"
                        className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
                        onClick={() => {
                          setAccountToDelete(account);
                          setDeleteModal(true);
                        }}
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
                    <div className="bg-gray-50 lg:p-6 p-3 border-t  border-gray-200 overflow-hidden">
                      {selectedService?.label === QuickLinksType.FW && (
                        <div className="grid grid-cols-2 lg:gap-6 gap-1">
                          <div>
                            <p className="font-medium lg:text-lg text-sm">Bank Name:</p>
                            <p className="text-sm">{account.bankName}</p>
                          </div>
                          <div>
                            <p className="font-medium lg:text-lg text-sm">Account Number:</p>
                            <p className="text-sm">{account.accountNumber}</p>
                          </div>
                          <div>
                            <p className="font-medium lg:text-lg text-sm">IFSC Code:</p>
                            <p className="text-sm">{account.ifscCode}</p>
                          </div>
                        </div>
                      )}

                      {selectedService?.label !== QuickLinksType.FW && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:gap-6">
                          <div className="space-y-1">
                            <p className="text-sm text-gray-500 w-10">Mobile</p>
                            <p className="font-medium text-sm">
                              {account.beneficiaryMobile}
                            </p>
                          </div>
                          <div className="space-y-1">
                            <p className="text-sm text-gray-500">Bank Name</p>
                            <p className="font-medium text-sm">
                              {account.bankName}
                            </p>
                          </div>
                          <div className="space-y-1">
                            <p className="text-sm text-gray-500">Bank IFSC</p>
                            <p className="font-medium text-sm">{account.accountIfsc}</p>
                          </div>
                          <div className="space-y-1">
                            <p className="text-sm text-gray-500">
                              Account Number
                            </p>
                            <p className="font-medium text-sm">
                              {account.accountNumber}
                            </p>
                          </div>
                        </div>
                      )}

                      <BtnPrimary
                        onClick={() => {
                          setBeneData(account);
                          setIsModalOpen("paymentModal");
                        }}
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
          control={control}
          errors={errors}
          names="beneficiary"
          placeHolder={"Enter Mobile Number"}
          title={"Register Beneficiary"}
          subTitle={"Enter Mobile Number To Initiate KYC"}
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
          onClose={handleCancel}
          onChange={(value) => {
            const cleanedValue = value.replace(/\D/g, "");

            if (cleanedValue.length === 1 && !/^[6-9]$/.test(cleanedValue)) {
              setError("beneficiary", {
                type: "manual",
                message: "Mobile number must start with 6-9.",
              });
              return;
            }
            if (cleanedValue.length <= 10) {
              setValue("beneficiary", cleanedValue);
            }
          }}
          onSubmit={handleSubmit}
        />
      )}
      {isModalOpen === "paymentModal" && (
        <PaymentModal
          handleCancel={handleCancel}
          senderData={senderData}
          beneData={beneData}
          senderDataFW={senderDataFW}
        />
      )}
      {deleteModal && accountToDelete && (
        <ActionModal
          title="Confirm Deletion"
          subtitle={`Are you sure you want to delete ${accountToDelete?.beneficiaryFirstName}`}
          confirmBtn={"Confirm"}
          cancelBtn={"Cancel"}
          confirm={() => handleDeleteBene()}
          cancel={() => setDeleteModal(false)}
        />
      )}
    </div>
  );
};

export default BeneficiaryDetails;
