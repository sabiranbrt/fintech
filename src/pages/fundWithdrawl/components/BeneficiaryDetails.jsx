/* eslint-disable react/prop-types */
import { ServiceContext } from "@/App";
import { decryptData3Des } from "@/utils/3desEncrypt";
import { getIpAddress } from "@/utils/getIpAddress";
import LocalStorageUtil from "@/utils/LocalStorageUtil";
import { wordCapitalize } from "@/utils/wordCapitalize";
import { Eye, EyeOff, LucideCheckCheck } from "lucide-react"; // Using Lucide React icons
import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { FiTrash } from "react-icons/fi";
import { ImCross } from "react-icons/im";
import { MdOutlinePending, MdOutlineVerified } from "react-icons/md";
import { VscUnverified } from "react-icons/vsc";
import { TailSpin } from "react-loader-spinner";
import { convertToWords } from "react-number-to-words";
import { toast } from "react-toastify";
import axiosInstance from "../lib/axios-instance";
import LoaderComponent from "./LoaderComponent";
import TotalPayoutList from "./TotalPayoutList";
import { FaEye } from "react-icons/fa";
import { IoInformationCircleOutline } from "react-icons/io5";
import TransferNotice from "./VerifyBeneficiaryComponent";
import { GrUserSettings } from "react-icons/gr";
import { FaStarOfLife } from "react-icons/fa6";
import Loader from "./LoaderComponent";
import AddBeneficiaryButton from "./AddBeneficiaryButton";
import AddAccountButton from "./AddAccountButton";
import AddAccountBtnFw from "./AddAccountBtnFw";
import axios from "axios";
import { encryptRequestBody } from "@/lib/encryptBody";
import { formatIkTitle } from "@/utils/formatIKtitlle";
import SlipButtons from "./slipbuttons/SlipButtons";

//THIS WAS DONE HERE AS THE ENTIRE SYSTEM DEPENDED ON THE API INITIALLY THAT WAS TRASHED LATER ON, HENCE MOCK DATA IS NECESSARY
const IMPORTANT_DATA = [
  {
    jsonKey: "charge",
    fieldName: "Charge",
    fieldType: "Number",
    isRequired: true,
    defaultValue: "0",
  },
  {
    jsonKey: "remarks",
    fieldName: "Remarks",
    fieldType: "text",
    isRequired: true,
    defaultValue: null,
  },
  {
    jsonKey: "amount",
    fieldName: "Amount",
    fieldType: "number",
    isRequired: true,
    defaultValue: null,
  },
];
export default function BeneficiaryDetails({
  setVerified,
  totalBalance,
  setTotalBalance,
  senderData,
  handleSearch,
  userMobileNumber,
  selectedOption,
  activeForm,
  setActiveForm,
  fundWithdrawal,
  senderId,
  handleOptionClick,
  handleRegisterBeneficiaryClick,
  beneMobileKyc,
  setBeneMobileKyc,
  registerByAadhar,
  setRegisterByAadhar,
  formDataKyc,
  setFormDataKyc,
  getSenderDataFw,
  chargeSlab,
  isRP,
}) {
  const [loadingCharge, setLoadingCharge] = useState(false);
  const [selectedBeneficiary, setSelectedBeneficiary] = useState("");
  const [note, setNote] = useState("");
  const [checkedBeneficiary, setCheckedBeneficiary] = useState("");
  const [chargeValue, setChargeValue] = useState("0");
  const [markupError, setMarkupError] = useState("");
  const [markupCharge, setMarkupCharge] = useState("");
  const [finalAmount, setFinalAmount] = useState("");
  const [requestAmount, setRequestAmount] = useState("");
  const [serviceFee, setServiceFee] = useState("");
  const [markupPercentError, setMarkupPercentError] = useState("");
  const [markupValue, setMarkupValue] = useState("");
  const [amountLimits, setAmountLimits] = useState({});
  const [chargePercentageLimit, setChargePercentageLimit] = useState("");
  const [maxMarkUp, setMaxMarkUp] = useState("");
  const [maxPercent, setMaxPercent] = useState("");
  const [markupPercentage, setMarkupPercentage] = useState("");
  const [showableMarkupPercentage, setShowableMarkupPercentage] = useState("");
  const [showableMarkupValue, setShowableMarkupValue] = useState("");
  const [showMarkupPercent, setShowMarkupPercent] = useState(true);
  const [isVerified, setIsVerified] = useState(false);
  //console.log({ showableMarkupValue, markupPercentage, showMarkupPercent });
  const [showModifiedMarkup, setShowModifiedMarkup] = useState(true);
  const [loadingSlab, setLoadingSlab] = useState(false);
  const [slab, setSlab] = useState([]);
  const [word, setWord] = useState();
  const [transferAmount, setTransferAmount] = useState();
  const [totAm, setTotAm] = useState();
  const [cardLastSixDigits, setCardLastSixDigits] = useState(null);
  const [timeoutId, setTimeoutId] = useState(null);
  const [accessToken, setAccessToken] = useState("");
  const [pgOrderID, setPgOrderID] = useState("");
  const [platform, setPlatform] = useState("");
  const [zaakPayUrl, setZaakPayUrl] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [slipModalVisible, setSlipModalVisible] = useState(false);
  const [transPayload, setTransPayload] = useState({});
  const [slipContent, setSlipContent] = useState("");
  const [modalContent, setModalContent] = useState("");
  const [errors, setErrors] = useState({});
  const [transType, setTransType] = useState("");
  // const [formFields, setFormFields] = useState([]);
  const [formFields, setFormFields] = useState(IMPORTANT_DATA);
  const [formData, setFormData] = useState({});
  const [isBeneficiarySelected, setIsBeneficiarySelected] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [beneficiary, setBeneficiary] = useState(""); // Track selected beneficiary
  const [expandedBeneficiary, setExpandedBeneficiary] = useState(null);
  const [beneMobile, setBeneMobile] = useState("");
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [bankName, setBankName] = useState("");
  const [bankIfsc, setBankIfsc] = useState("");
  const [expandedAccount, setExpandedAccount] = useState(null);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [beneficiaryToDelete, setBeneficiaryToDelete] = useState(null);
  // const [transferType, setTransferType] = useState("IMPS");
  const [transferType, setTransferType] = useState("IMPS");
  const [charge, setCharge] = useState(false);
  const [isHolding, setIsHolding] = useState(false);
  const [accountNumber, setAccountNumber] = useState("");
  const [providerId, setProviderId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const prevSelectedOption = useRef(selectedOption);
  const [paymentStatus, setPaymentStatus] = useState({
    title: "Awaiting Payment",
    details: null,
  });
  const [allowProceed, setAllowProceed] = useState(false);
  const services = useContext(ServiceContext);
  const [beneficaryAccountNumber, setBeneficaryAccountNumber] = useState(null);
  const [transactionTypes, setTransactionTypes] = useState([
    "Ik Credit Pay",
    "Rent Payment",
    "Ik Pay",
  ]);
  const [paymentWindow, setPaymentWindow] = useState(null);
  const [manualClose, setManualClose] = useState(false); // New flag to track manual closure
  const minAmount = 1; //
  const maxAmount = 100000; //
  const maxLength = 10; //
  // Extract beneficiaries from senderData
  const [beneficiaries, setBeneficiaries] = useState(
    senderData?.beneficiaries || []
  );

  const [beneSearch, setBeneSearch] = useState("");
  const [filteredBene, setFilteredBene] = useState(beneficiaries ?? []);
  // const filteredServices = services.filter((service) =>
  //   ["Ik Credit Pay", "Rent Payment", "Ik Pay"].includes(service)
  // );
  const filteredServices = services.filter((service) =>
    ["Ik Credit Pay"].includes(service)
  );
  const [slipUrl, setSlipUrl] = useState("");
  const [amountError, setAmountError] = useState("");
  const [selType, setSelType] = useState(filteredServices[0]);
  const [bankData, setBankData] = useState([]);
  const [ccBankData, setCCBankData] = useState([]);
  const [selectedBank, setSelectedBank] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredBanks, setFilteredBanks] = useState([]);
  const [filteredCCBanks, setCCFilteredBanks] = useState([]);
  const [inputBankNameBasedFilter, setInputBankNameBasedFilter] = useState([]);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [creditErrors, setCreditErrors] = useState({});
  const [isButtonClicked, setIsButtonClicked] = useState(false);
  const [isMarkupSwitchActive, setIsMarkupSwitchActive] = useState(false);
  const [creditCardType, setCreditCardType] = useState("credit");
  const [selectedPayment, setSelectedPayment] = useState("credit"); // default selected

  const dropdownRef = useRef(null);
  const handleSlipUpload = (url) => {
    setSlipUrl(url);
  };
  // Validation function
  const validateFields = () => {
    let newErrors = {};

    // Bank Name Validation
    if (!bankName) {
      newErrors.bankName = "Bank Name is required";
    }

    // Credit Card Number Validation
    if (!accountNumber) {
      newErrors.accountNumber = "Credit card Number is required";
    } else if (!/^\d{16}$/.test(accountNumber)) {
      newErrors.accountNumber = "Credit card Number must be between 16 digits";
    } else if (/\s/.test(accountNumber)) {
      newErrors.accountNumber = "Credit card Number cannot contain spaces";
    }

    // Mobile Number Validation
    if (!beneMobile) {
      newErrors.beneMobile = "Mobile number is required";
    } else if (!/^[6-9]\d{9}$/.test(beneMobile)) {
      newErrors.beneMobile = "Enter a valid 10-digit mobile number";
    } else if (/(.)\1{5}/.test(beneMobile)) {
      newErrors.beneMobile =
        "Mobile number cannot have a sequence of the same 6 digits";
    }

    // IFSC Code Validation
    if (!bankIfsc) {
      newErrors.bankIfsc = "IFSC Code is required";
    } else if (!/^[A-Za-z0-9]{11}$/.test(bankIfsc)) {
      newErrors.bankIfsc = "IFSC Code must be 11 alphanumeric characters";
    } else if (bankIfsc.length !== 11) {
      newErrors.bankIfsc = "IFSC Code must be exactly 11 characters";
    }

    setErrors(newErrors);
    return newErrors;
  };

  const resetFormData = () => {
    setFormData((prev) => ({ ...prev, amount: "" }));
  };

  useEffect(() => {
    if (bankName && filteredCCBanks?.length) {
      const filteredInputBank = filteredCCBanks?.filter((filItm) =>
        filItm?.name?.toLowerCase().startsWith(bankName?.toLowerCase())
      );
      setInputBankNameBasedFilter(filteredInputBank);
    } else {
      setInputBankNameBasedFilter(filteredCCBanks);
    }
  }, [bankName, filteredCCBanks]);

  // Run validation when fields change

  useEffect(() => {
    // Fetching data from the mock API
    const fetchBankData = async () => {
      try {
        const authToken = localStorage.getItem("authToken");
        const response = await axiosInstance.get("/bank", {
          headers: { includeUrn: true, authToken: authToken },
        });
        if (response.data?.apiResponseData?.data) {
          const banks = response.data.apiResponseData.data.map((bank) => ({
            name: bank.bankName,
            ifsc: bank.ifsc,
          }));
          setBankData(banks);
          setFilteredBanks(banks);
        } else {
          console.error("Invalid API response structure.");
        }
      } catch (error) {
        console.error("Error fetching bank data:", error);
      }
    };

    fetchBankData();
  }, []);

  useEffect(() => {
    // Fetching data from the mock API
    const fetchCCBankData = async () => {
      try {
        const authToken = localStorage.getItem("authToken");
        const response = await axiosInstance.get("/bank?type=CC", {
          headers: { includeUrn: true, authToken: authToken },
        });
        if (response.data?.apiResponseData?.data) {
          const banks = response.data.apiResponseData.data.map((bank) => ({
            name: bank.bankName,
            ifsc: bank.ifsc,
            mode: bank.mode,
          }));
          setCCBankData(banks);
          setCCFilteredBanks(banks);
        } else {
          console.error("Invalid API response structure.");
        }
      } catch (error) {
        console.error("Error fetching bank data:", error);
      }
    };

    fetchCCBankData();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownVisible(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  useEffect(() => {
    const filtered = bankData.filter(
      (bank) =>
        bank.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        bank.ifsc.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredBanks(filtered);
  }, [searchTerm, bankData]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setDropdownVisible(true);
  };

  const handleSelectBank = (bank) => {
    setSelectedBank(bank);
    setSearchTerm(bank.name);
    setValue("bankName", bank.name);
    setValue("accountIfsc", bank.ifsc);
    setDropdownVisible(false);
  };

  useEffect(() => {
    setBeneficiaries(senderData?.beneficiaries || []);
  }, [senderData]);

  useEffect(() => {
    setFilteredBene(senderData?.beneficiaries || []);
  }, [beneficiaries]);
  //const beneficiaries = senderData?.beneficiaries || [];
  const desKey = "fc695f05c828e5331f406e9ee9fc2c6f3790bc93893470dc";
  const userID = "9241980104198913";

  function generateRandom13DigitNumber() {
    return Math.floor(Math.random() * 9e12) + 1e12; // Generates a 13-digit number
  }

  const getTransactionType = (option) => {
    switch (option) {
      case "Express Payment":
        return "EP";
      case "Rent Payment":
        return "RP";
      case "Load Gateway":
        return "LG";
      case "Fund Transfer":
        return "FT";
      case "Ik Credit Pay":
        return "IC";
      case "Ik Pay":
        return "IP";
      case "Credit Card Bill Pay":
        return "CC";
      case "Fund Withdrawal":
        return "FW";
      default:
        return "";
    }
  };

  // Effect to set transType when selectedOption changes
  useEffect(() => {
    if (prevSelectedOption.current !== selectedOption) {
      prevSelectedOption.current = selectedOption;
      const type = getTransactionType(selectedOption);
      setTransType(type);
    }
  }, [selectedOption]);

  // Initial transType setup on mount
  useEffect(() => {
    if (!transType && selectedOption) {
      const initialType = getTransactionType(selectedOption);
      setTransType(initialType);
    }
  }, [selectedOption, transType]);

  // Effect to fetch data when transType changes
  // useEffect(() => {
  //   if (!transType) return; // Avoid fetching if transType is empty

  //   let cancelApiCall = false; // Cancel flag for cleanup

  //   const fetchInputData = async () => {
  //     try {
  //       setLoading(true);
  //       const response = await axiosInstance.get(`/transaction/${transType}`, {
  //         headers: {
  //           includeUrn: true,
  //           authToken: localStorage.getItem("authToken"),
  //         },
  //       });

  //       if (cancelApiCall) return; // Skip processing if canceled

  //       const data = response.data.apiResponseData.data;

  //       if (
  //         response.data.apiResponseCode === "200" &&
  //         response.data.apiResponseData.responseCode === "200"
  //       ) {
  //         setFormFields(data);
  //         // Set new form fields
  //       } else {
  //         console.error(
  //           "Error in API response:",
  //           response.data.apiResponseMessage
  //         );
  //         toast.error(response.data.apiResponseMessage);
  //       }
  //     } catch (error) {
  //       toast.error("Error Fetching transaction");
  //       console.error("Error fetching transaction types:", error);
  //     } finally {
  //       if (!cancelApiCall) {
  //         setLoading(false);
  //       }
  //     }
  //   };

  //   fetchInputData();

  //   // Cleanup function
  //   return () => {
  //     cancelApiCall = true;
  //   };
  // }, [transType]);

  const initializeFormData = () => {
    const initialFormData = {};
    formFields.forEach((field) => {
      initialFormData[field.jsonKey] = field.defaultValue || "";
    });
    setFormData(initialFormData);
  };

  useEffect(() => {
    initializeFormData(); // Reinitialize form data when formFields change
  }, [formFields]);

  const handleChange = (fieldName, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [fieldName]: value,
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    let isValid = true;

    // Validate form fields as before
    formFields.forEach((field) => {
      const value = formData[field.jsonKey] || field.defaultValue;

      if (field.isRequired && !value) {
        newErrors[field.jsonKey] = `${field.fieldName} is required`;
        isValid = false;
      }
    });

    // Custom validation for 'charge' field
    const chargeField = formFields.find((field) => field.jsonKey === "charge");
    const amountField = formFields.find((field) => field.jsonKey === "amount");

    if (chargeField && amountField) {
      const chargeValue = parseFloat(formData["charge"]) || 0;
      const amountValue = parseFloat(formData["amount"]) || 0;
      const chargeDefaultValue = parseFloat(chargeField.defaultValue) || 0;

      if (chargeValue < chargeDefaultValue) {
        newErrors[
          "charge"
        ] = `Charge must be equal to or greater than its default value (${chargeDefaultValue})`;
        isValid = false;
      }

      if (chargeValue >= amountValue) {
        newErrors["charge"] = `Charge must be less than Amount`;
        isValid = false;
      }
    }

    // Validate account selection when s 'fundWithdrawal'
    if (fundWithdrawal && !selectedAccount) {
      newErrors["account"] = "Please select an account number";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };
  const proceedButtonRef = useRef(null);

  useEffect(() => {
    if (expandedBeneficiary && proceedButtonRef.current) {
      setTimeout(() => {
        proceedButtonRef.current.scrollIntoView({
          behavior: "smooth",
          block: "end",
          inline: "nearest",
        });
      }, 200); // Delay to ensure DOM updates before scrolling
    }
  }, [expandedBeneficiary]);
  const proceedButtonRefFw = useRef(null);

  useEffect(() => {
    if (expandedAccount && proceedButtonRefFw.current) {
      setTimeout(() => {
        proceedButtonRefFw.current.scrollIntoView({
          behavior: "smooth",
          block: "end",
          inline: "nearest",
        });
      }, 200); // Delay to ensure DOM updates before scrolling
    }
  }, [expandedAccount]);

  const handlePrint = () => {
    const printWindow = window.open("", "_blank");
    printWindow.document.write(modalContent);
    printWindow.document.close();
    printWindow.print();
  };

  const closeModal = () => {
    setModalVisible(false);
    handleRefreshPage();
  };

  const handleRefreshPage = () => {
    window.location.reload();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    // Build the payload
    const ipAddress = await getIpAddress();
    const payload = {
      acquirerInfo: {
        ip: ipAddress,
        reqLat: LocalStorageUtil.getItem("latitude"),
        reqLong: LocalStorageUtil.getItem("longitude"),
        commDeviceId: "commDeviceId_f4c6e43c16d1",
        requestSource: "requestSource_bf89dd79647e",
        id: userID,
      },
      paymentInfo: {
        amount: formData.amount,
        transType: isRP
          ? "RP"
          : transType === "EP" && !isRP
          ? "FS"
          : transType !== "EP" && transType !== "CC" && transType !== "FW"
          ? "EF"
          : transType,
        // providerId: selectProviderId,
        cardType: selectedPayment,
        customerMobile: userMobileNumber,
        beneficiaryMobile: checkedBeneficiary?.beneficiaryMobile,
        senderMobile: userMobileNumber,
      },
      dynamicValues: {
        slipUrl: slipUrl,
        cardLastSixDigits: cardLastSixDigits,
        amount: formData.amount,
        senderMobile: userMobileNumber,
        beneMobile: beneMobile,
        charge: serviceFee,
        markup: markupCharge,
        transType: isRP
          ? "RP"
          : transType === "EP" && !isRP
          ? "FS"
          : transType !== "EP" && transType !== "CC" && transType !== "FW"
          ? "EF"
          : transType,
        transferType: transferType,
        beneficaryAccountNumber: beneficaryAccountNumber,
        finalAmount: finalAmount,
        loadAmount: requestAmount,
        selectedChargeType: isMarkupSwitchActive ? "percentage" : "amount",
        accountInfo: {
          bankName: bankName,
          bankIfsc: bankIfsc,
          accountNumber: accountNumber,
        },
      },
      userId: userID,
      remarks: formData.remarks,
    };
    console.log("payliadddddd", payload);

    setTransPayload(payload);

    setIsModalOpen(false);
    try {
      setIsLoading(true);
      handleModalSubmit(e, payload);
    } catch (error) {
    } finally {
      setIsLoading(false);
    }

    localStorage.removeItem(
      "beneficiaryAccountNumber",
      beneficiary.accountNumber
    );
  };

  const handleModalSubmit = async (e, payload) => {
    e.preventDefault();
    setSlipModalVisible(false);
    setIsLoading(true);
    await Promise.resolve();
    let initialPayload = payload ?? transPayload;
    // Encrypted request data
    const modifiedPayload = {
      ...initialPayload,
      dynamicValues: {
        ...initialPayload?.dynamicValues,
        charge: serviceFee,
        markup: markupCharge,
      },
    };
    console.log("transpayload", modifiedPayload);
    console.log("transtyoe", transType);

    try {
      if (transType !== "EP" && transType !== "CC" && transType !== "FW") {
        setIsLoading(true);
        await Promise.resolve();
        try {
          const response = await axiosInstance.post(
            "/transaction",
            modifiedPayload,
            {
              headers: {
                // includeUrn: true,
                urn: generateRandom13DigitNumber(),
                authToken: localStorage.getItem("authToken"),
              },
            }
          );

          if (
            response?.data?.apiResponseData?.responseCode === "401" ||
            response?.data?.apiResponseData?.data?.length === 0 ||
            !response?.data?.apiResponseData?.data
          ) {
            toast.error(response?.data?.apiResponseData?.responseMessage);
            setExpandedBeneficiary(null);
            setSelectedBeneficiary("");
            return;
          }
          if (response.data.apiResponseData.responseCode === "200") {
            const message = response.data.apiResponseData.responseMessage;

            const result = response.data;

            if (result.apiResponseData.data.accessToken) {
              const encToken = result.apiResponseData.data.accessToken;
              const decCode = decryptData3Des(
                encToken,
                import.meta.env.VITE_DES_KEY
              );
              // setAccessToken(decCode);

              // setAccessToken(result.apiResponseData.data.accessToken);
              setAccessToken(decCode);
              //  toast.success(message);
            }

            setSlipModalVisible(false);

            setPgOrderID(result.apiResponseData.data.pgOrderID);
            setPlatform(result.apiResponseData.data.platform);
            setZaakPayUrl(result.apiResponseData.data.redirectLink);
            setProviderId(result.apiResponseData.data.providerId);
            // Reset form fields after successful submission
            // toast.error(message);
            setSelectedBeneficiary("");
            setFormData({});
            setErrors({});
            // setTimeout(() => {
            //   setIsLoading(false);
            // }, 4000);
          } else {
            console.error("Error submitting data:", response.statusText);
            toast.error(message);
          }
        } catch (error) {
          console.error("Payout error:", error);
        } finally {
          setIsLoading(false);
        }
      } else {
        setIsLoading(true);
        await Promise.resolve();
        try {
          const encryptedData = encryptRequestBody(modifiedPayload);
          const apiResp = await axios.post(
            `${import.meta.env.VITE_API_BASE_URL}/transaction/payout`,
            encryptedData,
            {
              headers: {
                urn: generateRandom13DigitNumber(),
                authToken: localStorage.getItem("authToken"),
              },
              responseType: "text",
            }
          );

          setModalContent(apiResp.data);
          setModalVisible(true);
          setIsModalOpen(false);

          setTimeout(() => {
            setIsLoading(false);
          }, 4000);
        } catch (error) {
          console.error("Payout error:", error);
        } finally {
          setIsLoading(false);
        }
      }
    } catch (error) {
      console.error("Error submitting data:", error);
    } finally {
      setExpandedBeneficiary(null);
      setFormData({});
      setChargeValue(0);
      setMarkupValue("");
      setFinalAmount("");
      setRequestAmount("");
      setServiceFee("");
      setCardLastSixDigits("");
      setMarkupCharge("");
      setWord("");
      setIsLoading(false);
    }
  };

  const handlePaymentResponse = useCallback(
    async (event) => {
      try {
        setIsLoading(true);
        await Promise.resolve();
        const data = event.data.data;
        if (data && typeof data === "object") {
          const isSuccess = data.responseCode === "100";
          const statusText = isSuccess ? "Success" : "Failed";

          setPaymentStatus({
            title: `Payment ${statusText}`,
            details: {
              status: statusText,
              orderId: data.orderId || "N/A",
              amount: data.amount || "N/A",
              transactionId: data.pgTransId || "N/A",
              paymentMode: data.paymentMode || "N/A",
              description: data.responseDescription || "N/A",
            },
            completed: isSuccess,
          });

          // Close the payment window if payment is successful
          if (isSuccess && paymentWindow && !paymentWindow.closed) {
            paymentWindow.close();
            setPaymentWindow(null);
            setManualClose(false); // Reset manual close on success
          }

          const ipAddress = await getIpAddress();
          const verifPayload = {
            acquirerInfo: {
              ip: ipAddress,
              reqLat: LocalStorageUtil.getItem("latitude"),
              reqLong: LocalStorageUtil.getItem("longitude"),
              commDeviceId: "commDeviceId_f4c6e43c16d1",
              requestSource: "requestSource_bf89dd79647e",
              id: userID,
              providerId: providerId,
            },
            response: {
              title: `Payment ${statusText}`,
              details: {
                status: statusText,
                orderId: data.orderId || "N/A",
                amount: data.amount || "N/A",
                transactionId: data.pgTransId || "N/A",
                paymentMode: data.paymentMode || "N/A",
                description: data.responseDescription || "N/A",
              },
              completed: isSuccess,
            },
          };
          setIsLoading(true);
          await Promise.resolve();
          try {
            const encryptedData = encryptRequestBody(verifPayload);
            const apiResp = await axios.post(
              `${import.meta.env.VITE_API_BASE_URL}/transaction/verify`,
              encryptedData,
              {
                headers: {
                  urn: generateRandom13DigitNumber(),
                  authToken: localStorage.getItem("authToken"),
                },
              },
              { responseType: "text" }
            );
            setModalContent(apiResp.data);
            setModalVisible(true);
            setIsModalOpen(false);
          } catch (error) {
            console.error(error);
          } finally {
            setIsLoading(false);
          }
        }
      } catch (error) {
        toast.error(error);
        handleError(error);
      } finally {
        setIsLoading(false);
      }
    },
    [paymentWindow]
  );

  const handleError = useCallback((error) => {
    console.error("Payment error:", error);
    setPaymentStatus({
      title: error.message || "Payment processing error",
      details: null,
    });
  }, []);

  useEffect(() => {
    window.addEventListener("message", handlePaymentResponse);
    return () => {
      window.removeEventListener("message", handlePaymentResponse);
    };
  }, [handlePaymentResponse]);

  useEffect(() => {
    if (paymentWindow) {
      const checkWindow = setInterval(() => {
        if (paymentWindow.closed) {
          clearInterval(checkWindow);
          setManualClose(true);
          setPaymentWindow(null);
          if (!paymentStatus.details) {
            setPaymentStatus({
              title: "Payment window closed",
              details: null,
            });
          }
        }
      }, 500);
      return () => clearInterval(checkWindow);
    }
  }, [paymentWindow, paymentStatus.details]);

  useEffect(() => {
    if (
      zaakPayUrl &&
      pgOrderID &&
      !paymentWindow &&
      !paymentStatus.completed &&
      !manualClose
    ) {
      try {
        const windowFeatures = {
          width: 800,
          height: 600,
          left: (window.screen.width - 800) / 2,
          top: (window.screen.height - 600) / 2,
        };
        const features = Object.entries(windowFeatures)
          .map(([key, value]) => `${key}=${value}`)
          .join(",");

        const newWindow = window.open(zaakPayUrl, "ZaakpayPayment", features);
        if (!newWindow) {
          throw new Error("Popup blocked. Please enable popups for this site.");
        }
        setPaymentWindow(newWindow);
        setManualClose(false); // Reset manualClose on new window open
      } catch (error) {
        handleError(error);
      }
    }
  }, [
    zaakPayUrl,
    pgOrderID,
    paymentWindow,
    handleError,
    paymentStatus.completed,
    manualClose,
  ]);

  useEffect(() => {
    if (selectedOption === "Fund Withdrawal" && transferType === "IMPS") {
      // if (selectedOption === "Ik Credit Pay") {

      const enteredAmount = parseFloat(formData.amount);

      // Only calculate charge if amount is entered
      if (!isNaN(enteredAmount) && enteredAmount > 0) {
        if (enteredAmount < 25000) {
          // Calculate charge for amount < 25000
          const calculatedCharge = 2 + 2 * 0.18; // 2 rupees + 18% of 2 rupees
          setFormData((prevData) => ({
            ...prevData,
            charge: calculatedCharge.toFixed(2), // Set the calculated charge
          }));
        } else {
          // Calculate charge for amount >= 25000
          const calculatedCharge = 5 + 5 * 0.18; // 5 rupees + 18% of 5 rupees
          setFormData((prevData) => ({
            ...prevData,
            charge: calculatedCharge.toFixed(2), // Set the calculated charge
          }));
        }
      }
    }
  }, [formData.amount, selectedOption, transferType]); // Re-run when amount, selectedOption, or transferType changes

  const handleFrontendSearch = (e) => {
    const lowerCaseValue = e.target.value?.trim()?.toLowerCase();
    {
      /**Test code for the changes in the search code  */
    }

    if (!lowerCaseValue) {
      setFilteredBene(beneficiaries);
    } else {
      const filteredValues = beneficiaries?.filter(
        (beneficiary) =>
          (beneficiary.accountNumber &&
            beneficiary.accountNumber.toLowerCase().includes(lowerCaseValue)) ||
          (beneficiary.beneficiaryMobile &&
            beneficiary.beneficiaryMobile
              .toLowerCase()
              .includes(lowerCaseValue)) ||
          (beneficiary.bankName &&
            beneficiary.bankName.toLowerCase().includes(lowerCaseValue)) ||
          (beneficiary.accountIfsc &&
            beneficiary.accountIfsc.toLowerCase().includes(lowerCaseValue)) ||
          (beneficiary.beneficiaryFirstName &&
            beneficiary.beneficiaryFirstName
              .toLowerCase()
              .includes(lowerCaseValue)) ||
          (beneficiary.beneficiaryLastName &&
            beneficiary.beneficiaryLastName
              .toLowerCase()
              .includes(lowerCaseValue))
      );
      setFilteredBene(filteredValues);
    }
    {
      /**End of the test code */
    }
    // if (lowerCaseValue) {
    //   const filteredValues = beneficiaries?.filter(
    //     (beneficiary) =>
    //       (beneficiary.accountNumber &&
    //         beneficiary.accountNumber.toLowerCase().includes(lowerCaseValue)) ||
    //       (beneficiary.beneficiaryMobile &&
    //         beneficiary.beneficiaryMobile
    //           .toLowerCase()
    //           .includes(lowerCaseValue)) ||
    //       (beneficiary.bankName &&
    //         beneficiary.bankName.toLowerCase().includes(lowerCaseValue)) ||
    //       (beneficiary.accountIfsc &&
    //         beneficiary.accountIfsc.toLowerCase().includes(lowerCaseValue)) ||
    //       (beneficiary.beneficiaryFirstName &&
    //         beneficiary.beneficiaryFirstName
    //           .toLowerCase()
    //           .includes(lowerCaseValue)) ||
    //       (beneficiary.beneficiaryLastName &&
    //         beneficiary.beneficiaryLastName
    //           .toLowerCase()
    //           .includes(lowerCaseValue))
    //   );
    //   setFilteredBene(filteredValues);
    // }
  };
  useEffect(() => {
    if (accessToken && pgOrderID) {
      const script = document.createElement("script");
      setIsLoading(false);
      if (platform === "RP") {
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
      } else {
        script.src = "https://api.nimbbl.tech/static/assets/js/checkout.js";
      }
      script.async = true;

      script.onload = () => {
        paymentGatewayInitiate();
      };

      document.body.appendChild(script);

      const paymentGatewayInitiate = async () => {
        setIsLoading(true);

        const options = {
          access_key: accessToken,
          key: accessToken,
          order_id: pgOrderID,
          [platform === "NB" ? "callback_handler" : "handler"]: async function (
            response
          ) {
            const ipAddress = await getIpAddress();
            const verifPayload = {
              acquirerInfo: {
                ip: ipAddress,
                reqLat: LocalStorageUtil.getItem("latitude"),
                reqLong: LocalStorageUtil.getItem("longitude"),
                commDeviceId: "commDeviceId_f4c6e43c16d1",
                requestSource: "requestSource_bf89dd79647e",
                id: userID,
                providerId: providerId,
              },
              response: response,
            };
            /*  const verificationPayload = {
              signature: response.nimbbl_signature,
              orderId: response.nimbbl_order_id,
              transactionId: response.nimbbl_transaction_id,
            }; */

            try {
              const encryptedData = encryptRequestBody(verifPayload);
              setIsLoading(true);
              const apiResp = await axios.post(
                `${import.meta.env.VITE_API_BASE_URL}/transaction/verify`,
                encryptedData,
                {
                  headers: {
                    urn: generateRandom13DigitNumber(),
                    authToken: localStorage.getItem("authToken"),
                  },
                },
                { responseType: "text" }
              );
              setModalContent(apiResp.data);
              setModalVisible(true);
              setIsModalOpen(false);
            } catch (error) {
              console.error(error);
            } finally {
              setIsLoading(false);
            }
          },
        };

        if (platform === "RP") {
          var rzp1 = new Razorpay(options);

          // Handle failure for Razorpay
          rzp1.on("payment.failed", async function (response) {
            // Close the Razorpay window on failure

            if (window.checkout) {
              window.checkout.close(); // This is the correct way to close the Razorpay window
            }

            // Prepare failure payload and send it to the verification API

            const ipAddress = await getIpAddress();
            const failurePayload = {
              acquirerInfo: {
                ip: ipAddress,
                reqLat: LocalStorageUtil.getItem("latitude"),
                reqLong: LocalStorageUtil.getItem("longitude"),
                commDeviceId: "commDeviceId_f4c6e43c16d1",
                requestSource: "requestSource_bf89dd79647e",
                id: userID,
                providerId: providerId,
              },
              response: response, // This includes failure details
            };
            // console.log("fail", failurePayload);

            const encryptedData = encryptRequestBody(failurePayload);
            try {
              setIsLoading(true);
              const apiResp = await axios.post(
                `${import.meta.env.VITE_API_BASE_URL}/transaction/verify`,
                encryptedData,
                {
                  headers: {
                    urn: generateRandom13DigitNumber(),
                    authToken: localStorage.getItem("authToken"),
                  },
                },
                { responseType: "text" }
              );
              // Handle the API response after failure
              setModalContent(apiResp.data);
              setModalVisible(true);
              setIsModalOpen(false);
            } catch (error) {
              console.error(
                "Error hitting the verification API on failure:",
                error
              );
            } finally {
              setIsLoading(false);
            }
          });

          // Assign the Razorpay instance to window.checkout
          window.checkout = rzp1;
        } else {
          window.checkout = new NimbblCheckout(options);
        }
        window.checkout.open(pgOrderID);
      };
    }
  }, [accessToken, pgOrderID]);
  useEffect(() => {
    if (isModalOpen || modalVisible) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }

    // Clean up when component unmounts
    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, [isModalOpen, modalVisible]);
  useEffect(() => {
    setCharge(false);
    setChargeValue(0);
    setMarkupValue("");
    setFinalAmount("");
    setRequestAmount("");
    setServiceFee("");
    setCardLastSixDigits("");
    setMarkupCharge("");
    setWord("");
    setFormData({});
  }, [deleteModalVisible, transferType, transType, selectedPayment]);

  useEffect(() => {
    setAllowProceed(false);
  }, [transferType, transType, selectedPayment]);

  const fetchSlab = async () => {
    setLoadingSlab(true);
    try {
      const response = await axiosInstance.get("/slab", {
        params: {
          type: isRP
            ? "RP"
            : transType === "EP" && !isRP
            ? "FS"
            : transType !== "EP" && transType !== "CC" && transType !== "FW"
            ? "EF"
            : transType,
          cardType: selectedPayment,
          transferType: transferType,
        },
        headers: {
          includeUrn: true,
          authToken: localStorage.getItem("authToken"),
        },
      });

      const resData = response?.data?.apiResponseData;

      if (resData?.responseCode === "200") {
        const slabDetails = resData?.data?.slabDetails;
        const note = resData?.data?.note;
        const limits = resData?.data?.limitDetails;
        const chargeLimit = resData?.data?.maxChargePercent;
        setChargePercentageLimit(chargeLimit);
        // Set slabs and any additional data as needed
        setSlab(slabDetails);
        // Optionally handle note or limits if needed
        setNote(note);
        setAmountLimits(limits);
      }
    } catch (error) {
      console.error("Error fetching slab:", error);
    } finally {
      setLoadingSlab(false);
    }
  };
  const handleChangeRadio = (e) => {
    const value = e.target.value;
    setSelectedPayment(value);

    // Reset dependent states when payment type changes
    setFormData((prev) => ({
      ...prev,
      amount: "",
    }));
    setMarkupValue("");
    setMarkupPercentage("");
    setAmountError("");
    setMarkupError("");
    setMarkupPercentError("");
    setTransferAmount("");
    setTotAm("");
    setFinalAmount("");
    setRequestAmount("");
    setServiceFee("");
    setCardLastSixDigits("");
    setMarkupCharge("");
    setWord("");
  };

  /*  useEffect(() => {
     const fetchAmountLimits = async () => {
       try {
         const response = await axiosInstance.get("/limits", {
           headers: {
             includeUrn: true,
             authToken: localStorage.getItem("authToken"),
           },
         });
 
         // Log the full response to ensure the structure is correct
         console.log("API Response:", response);
 
         if (response?.data?.apiResponseData?.responseCode === "200") {
           const limits = response?.data?.apiResponseData?.data?.limits;
           setAmountLimits(limits); 
         } else {
           console.error("API Error: Limits not found");
         }
       } catch (error) {
         console.error("Error fetching amount limits:", error);
       }
     };
 
     fetchAmountLimits();
   }, []); */
  useEffect(() => {
    fetchSlab();
  }, [transType, selectedPayment, transferType]);

  const handleOpenModal = (beneficiary) => {
    // console.log("beneficiary", beneficiary);
    // console.log("sender data", senderData);
    fetchSlab();
    if (selectedOption === "Fund Withdrawal") {
      // Check if an account is selected
      if (selectedAccount) {
        setIsModalOpen(true); // Open modal if account is selected
      } else {
        alert("Please select an account number first.");
      }
    } else if (selectedOption === "Credit Card Bill Pay") {
      if (!senderData?.isAccountVerified) {
        toast.error(
          "KYC pending. Transactions will be available once verified."
        );
        return;
      } else {
        if (
          senderData?.accountVerificationStage?.toLowerCase() === "completed"
        ) {
          setIsButtonClicked(true);
          const validationErrors = validateFields();
          if (Object.keys(validationErrors).length > 0) {
            return;
          }
          setIsModalOpen(true);
        } else {
          toast.error(
            `KYC pending. Transactions will be available once verified.`
          );
          return;
        }
      }
    } else {
      if (!senderData?.isAccountVerified) {
        toast.error(
          "KYC pending. Transactions will be available once verified."
        );
        return;
      }

      const skipBeneficiaryCheck =
        isRP || !["CC", "FW", "EP"].includes(transType?.toUpperCase());

      if (skipBeneficiaryCheck) {
        if (
          senderData?.accountVerificationStage?.toLowerCase() === "completed"
        ) {
          if (selectedBeneficiary) {
            setIsModalOpen(true);
          } else {
            alert("Please select a beneficiary first.");
          }
        } else {
          toast.error(
            "KYC pending. Transactions will be available once verified."
          );
          return;
        }
      } else {
        if (!beneficiary?.isAccountVerified) {
          toast.error(
            "KYC pending. Transactions will be available once verified."
          );
          return;
        }

        if (
          senderData?.accountVerificationStage?.toLowerCase() === "completed" &&
          beneficiary?.accountVerificationStage?.toLowerCase() === "completed"
        ) {
          if (selectedBeneficiary) {
            setIsModalOpen(true);
          } else {
            alert("Please select a beneficiary first.");
          }
        } else {
          toast.error(
            "KYC pending. Transactions will be available once verified."
          );
          return;
        }
      }
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setFormData({});
    setErrors({});
  };

  // Example handler for beneficiary selection
  const handleBeneficiarySelect = (beneficiary) => {
    setSelectedBeneficiary(beneficiary);
    setIsBeneficiarySelected(true);
  };

  const getGridColumnsClass = (numberOfColumns) => {
    switch (numberOfColumns) {
      case 1:
        return "grid-cols-1";
      case 2:
        return "grid-cols-2";
      case 3:
        return "grid-cols-3";
      case 4:
        return "grid-cols-4";
      default:
        return "grid-cols-1"; // Fallback if numberOfColumns is unexpected
    }
  };

  const numberOfColumns = Math.min(Math.ceil(formFields.length / 5), 4); // max 4 columns
  const chunkSize = Math.ceil(formFields.length / numberOfColumns);

  // Split form fields into chunks based on the number of columns
  const chunkedFormFields = [];
  for (let i = 0; i < formFields.length; i += chunkSize) {
    chunkedFormFields.push(formFields.slice(i, i + chunkSize));
  }

  const toggleAccordion = (mobile) => {
    setExpandedBeneficiary(expandedBeneficiary === mobile ? null : mobile);
  };

  const handleCheckboxChange = (mobile) => {
    // Unselect if the same checkbox is clicked
    handleBeneficiarySelect(selectedBeneficiary === mobile ? null : mobile);
  };

  // Handle account checkbox selection
  const handleAccountSelect = (account) => {
    setSelectedAccount(selectedAccount === account ? null : account);
    setAccountNumber(account.accountNumber);
    setBankName(account.bankName);
    setBankIfsc(account.ifscCode);
    // setBeneMobile(account.accountNumber)
  };
  const toggleAccountAccordion = (accountNumber) => {
    setExpandedAccount(
      expandedAccount === accountNumber ? null : accountNumber
    );
  };
  const deleteBeneficiary = async (beneficiaryId, senderId) => {
    try {
      setIsLoading(true);
      const response = await axiosInstance.post(
        "/beneficiary/delete",
        {},
        {
          params: { senderId, beneficiaryId },
          headers: {
            includeUrn: true,
            authToken: localStorage.getItem("authToken"),
          },
        }
      );
      if (response?.data?.apiResponseData?.responseCode === "200") {
        // Manually filter out the deleted beneficiary
        toast.success("Beneficiary deleted successfully");

        // Call handleSearch without an event (null as the first argument)
        setBeneficiaries((prevBeneficiaries) =>
          prevBeneficiaries.filter((b) => b.beneficiaryId !== beneficiaryId)
        );
        await handleSearch(null, userMobileNumber);
      } else {
        console.error(
          "Failed to delete beneficiary",
          response?.data?.apiResponseData?.responseMessage
        );
        toast.error(
          "Failed to delete beneficiary: " +
            (response?.data?.apiResponseData?.responseMessage ||
              "Unknown error")
        );
      }
    } catch (error) {
      console.error("Error while deleting beneficiary:", error);

      if (!error.response || error.response.status >= 500) {
        toast.error("Error while deleting beneficiary");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleTransferClick = (type) => {
    setTransferType(type);
  };

  useEffect(() => {
    setFormData({ amount: 0 });
    setFormData({ markup: 0 });
    setAllowProceed(false);
  }, [transferType, selectedPayment]);

  useEffect(() => {
    // Calculate totalAmount based on the transaction type
    let totalAmount =
      formData?.amount && transType === "RP"
        ? Number(formData?.amount ?? 0) +
          (Number(formData?.charge || 0) +
            Number(markupValue || formData?.markup || 0))
        : Number(formData?.amount ?? 0) -
            (Number(formData?.charge || 0) +
              Number(markupValue || formData?.markup || 0)) ?? 0;

    if (transType === "RP") {
      if (totalAmount == 0.0) {
        setShowableMarkupValue("0.00");
        return;
      } else {
        // Extract the decimal part from totalAmount
        const decimalPart = totalAmount % 1; // Get the decimal part (0.xxxx)

        // Calculate the difference from 1 (1 - decimalPart)
        const adjustedDecimalPart = 1 - decimalPart;

        // Add the adjusted decimal part to the markup
        const formattedMarkupValue = (
          Number(markupValue ?? 0) + adjustedDecimalPart
        ).toFixed(2);

        // Set the showable markup value (rounded to 2 decimal places)
        setShowableMarkupValue(formattedMarkupValue);
        const markupPercentage = formData.amount
          ? Number((formattedMarkupValue / formData.amount) * 100)
          : 0;
        // console.log({ showableMarkup: markupPercentage });
        setShowableMarkupPercentage(markupPercentage.toFixed(2));
        return; // Early return to avoid unnecessary further steps for "RP"
      }
    }

    // Extract the decimal part from the totalAmount
    const decimalPart = (totalAmount % 1).toFixed(2).split(".")[1] || "0"; // Get decimal part as string

    // Calculate the formatted markup value
    const formattedMarkupValue =
      Number(markupValue ?? 0) + Number(decimalPart ? `0.${decimalPart}` : 0);

    // Set the showable markup value (rounded to 2 decimal places)
    setShowableMarkupValue(
      (Number(formattedMarkupValue) ?? markupValue).toFixed(2)
    );

    const markupPercentage = formData.amount
      ? Number((formattedMarkupValue / formData.amount) * 100)
      : 0;
    setShowableMarkupPercentage(markupPercentage.toFixed(2));
  }, [
    markupValue,
    markupPercentage,
    JSON.stringify(formData),
    transferAmount,
    transType,
  ]);
  const fetchChargePayment = async (amount, cardType) => {
    if (!amount || isNaN(amount) || Number(amount) <= 0) {
      setChargeValue(0);
      setShowableMarkupValue("");
      setAllowProceed(false);
      return;
    }
    if (amount !== "") {
      try {
        setLoadingCharge(true);
        const chargeType = isMarkupSwitchActive ? "percentage" : "amount";

        const type =
          selectedOption === "Fund Withdrawal"
            ? [transType, transferType].filter(Boolean).join("_")
            : transType;

        const params = {
          selectedChargeType: chargeType,
          amount: amount,
          type: isRP
            ? "RP"
            : transType === "EP" && !isRP
            ? "FS"
            : transType !== "EP" && transType !== "CC" && transType !== "FW"
            ? "EF"
            : transType,
          ccType: selectedPayment,
          transferType: transferType,
        };

        const response = await axiosInstance.get("/transaction/charge-detail", {
          headers: {
            includeUrn: true,
            authToken: localStorage.getItem("authToken"),
          },
          params: params,
        });

        if (
          response?.data?.apiResponseData?.responseCode?.length &&
          Number(response?.data?.apiResponseData?.responseCode) >= 400
        ) {
          toast.error(response?.data?.apiResponseData?.responseMessage);
        }

        if (
          response?.status === 200 &&
          response?.data?.apiResponseData.responseCode === "200"
        ) {
          let chargeValue = response?.data?.apiResponseData?.data.totalCharge;
          const maxMarkup = response?.data?.apiResponseData?.data.maxMarkUp;
          const maxPercent =
            response?.data?.apiResponseData?.data.maxMarkUpPercentage;
          const finalAmount = response?.data?.apiResponseData?.data.finalAmount;
          const requestAmount =
            response?.data?.apiResponseData?.data.requestAmount;
          setFinalAmount(finalAmount);
          setRequestAmount(requestAmount);
          setMaxMarkUp(maxMarkup);
          setMaxPercent(maxPercent);
          setFinalAmount(finalAmount);
          // Ensure chargeValue is formatted to 2 decimal places if it's a number
          if (!isNaN(chargeValue)) {
            chargeValue = parseFloat(chargeValue).toFixed(2); // Convert to 2 decimal places
          }
          setChargeValue(chargeValue);
          setServiceFee(chargeValue);
          setCharge(true);

          if (!!chargeValue || chargeValue === "0.00") {
            setAllowProceed(true);
          }
          if (response?.data?.apiResponseData?.responseCode == 401) {
            setAllowProceed(false);
          }

          setFormData((prevData) => ({
            ...prevData,
            charge: chargeValue,
          }));
        } else {
          toast.error(response?.data?.apiResponseData?.responseMessage);
        }
      } catch (error) {
        console.error("Error fetching charge:", error);
      } finally {
        setLoadingCharge(false);
      }
    } else {
      setChargeValue(0);
      setShowableMarkupValue("");
    }
  };
  const handleInputChange = (key, value, cardType) => {
    setFormData({ ...formData, [key]: value });
    // Clear previous timeout
    if (timeoutId) clearTimeout(timeoutId);
    // Set a new timeout after 1 second of inactivity
    const newTimeoutId = setTimeout(() => {
      if (key === "amount") {
        fetchChargePayment(value, cardType);
      } else if (key === "markup") {
        calculateTotalPayout();
      }
    }, 1000);

    setTimeoutId(newTimeoutId);
  };

  const fetchCharge = async (amount, cardType) => {
    if (amount === "0" || amount === 0) {
      return;
    }
    if (amount !== "") {
      try {
        setLoadingCharge(true);
        const chargeType = isMarkupSwitchActive ? "percentage" : "amount";

        const type =
          selectedOption === "Fund Withdrawal"
            ? [transType, transferType].filter(Boolean).join("_")
            : transType;

        const params = {
          selectedChargeType: chargeType,
          amount: formData.amount,
          type: isRP
            ? "RP"
            : transType === "EP" && !isRP
            ? "FS"
            : transType !== "EP" && transType !== "CC" && transType !== "FW"
            ? "EF"
            : transType,
          charge: amount,
          ccType: selectedPayment,
          transferType: transferType,
        };

        const response = await axiosInstance.get("/transaction/charge-detail", {
          headers: {
            includeUrn: true,
            authToken: localStorage.getItem("authToken"),
          },
          params: params,
        });

        if (
          response?.data?.apiResponseData?.responseCode?.length &&
          Number(response?.data?.apiResponseData?.responseCode) >= 400
        ) {
          toast.error(response?.data?.apiResponseData?.responseMessage);
        }

        if (
          response?.status === 200 &&
          response?.data?.apiResponseData.responseCode === "200"
        ) {
          const chargeValue = response?.data?.apiResponseData?.data.totalCharge;
          const markup = response?.data?.apiResponseData?.data.markUp;
          const finalAmount = response?.data?.apiResponseData?.data.finalAmount;
          const requestAmount =
            response?.data?.apiResponseData?.data.requestAmount;
          if (
            Number(markup) <= 0 ||
            Number(chargeValue) <= 0 ||
            Number(finalAmount) <= 0 ||
            Number(requestAmount) <= 0
          ) {
            toast.error(
              "Either of the amounts cannot be negative or zero. Please adjust the charges."
            );
          }
          setServiceFee(chargeValue);
          setFinalAmount(finalAmount);
          setRequestAmount(requestAmount);
          setMarkupCharge(markup);
          // Ensure chargeValue is formatted to 2 decimal places if it's a number
          if (!isNaN(chargeValue)) {
            setChargeValue(parseFloat(chargeValue).toFixed(2));
            setServiceFee(parseFloat(chargeValue).toFixed(2));
          }
          setCharge(true);

          if (response?.data?.apiResponseData?.responseCode == 401) {
            setAllowProceed(false);
          }

          setFormData((prevData) => ({
            ...prevData,
            charge: chargeValue,
          }));
        } else {
          toast.error(response?.data?.apiResponseData?.responseMessage);
        }
      } catch (error) {
        console.error("Error fetching charge:", error);
      } finally {
        setLoadingCharge(false);
      }
    } else {
      setChargeValue(0);
      setShowableMarkupValue("");
    }
  };

  const calculateTotalPayout = () => {
    // call the fee api here
    const { amount, charge, markup } = formData;
    const totalPayout = amount - charge - markup;
    setFormData((prevData) => ({
      ...prevData,
      totalPayout: totalPayout.toFixed(2),
    }));
  };

  const computedTotalAmount = () => {
    // First, calculate the totalAmount based on the transaction type
    let totalAmount =
      formData?.amount &&
      (transType === "RP" ||
        transType === "CC" ||
        transType === "FW" ||
        transType === "EP")
        ? Number(formData?.amount ?? 0) +
          (Number(formData?.charge || 0) +
            Number(markupValue || formData?.markup || 0))
        : Number(formData?.amount ?? 0) -
            (Number(formData?.charge || 0) +
              Number(markupValue || formData?.markup || 0)) ?? 0;

    /* console.log('the mar', markupValue);
console.log('test', formData?.markup); */

    // Check if transaction type is "RP"
    if (transType === "RP") {
      // If the totalAmount has a decimal, remove the decimal and add 1
      if (totalAmount % 1 !== 0) {
        totalAmount = Math.floor(totalAmount) + 1; // Add 1 to the floored value
      }
      return totalAmount.toString(); // Return the totalAmount as string
    }

    // Check if transaction type is "FW" or "CC"
    if (transType === "FW" || transType === "CC" || transType === "EP") {
      return totalAmount.toFixed(2); // Return totalAmount with 2 decimal places for "FW" or "CC"
    }

    // Otherwise, round the totalAmount to the nearest whole number
    return Math.floor(totalAmount).toString();
  };

  const calculateAmount = () => {
    // return showModifiedMarkup ? showableMarkupValue : markupValue;
    return markupValue;
  };

  // Format account number with spaces and Xs
  const formatAccountNumber = (value, show) => {
    if (!value) return ""; // Ensure value is not null or undefined

    const cleaned = value.replace(/\D/g, ""); // Remove non-digits
    const match = cleaned.match(/^(\d{0,4})(\d{0,4})(\d{0,4})(\d{0,4})$/); // Group into 4-digit blocks
    if (!match) return "";

    const groups = [match[1], match[2], match[3], match[4]].filter(Boolean);
    let formatted = groups.join(" ");

    if (!show) {
      formatted = formatted.replace(/\d/g, "X"); // Mask the digits with X
    }

    return formatted;
  };

  // Handle keyboard input
  // Handle keyboard input
  // Handle keyboard input
  const handleKeyDown = (e) => {
    // Ensure accountNumber is always a string, even if empty
    if (!accountNumber) {
      setAccountNumber("");
    }

    // Handle backspace
    if (e.key === "Backspace") {
      setAccountNumber((prev) => prev.slice(0, -1));
      e.preventDefault();
    }
    // Handle typing numbers only and ensure the length doesn't exceed 16 digits
    else if (
      e.key >= "0" &&
      e.key <= "9" &&
      accountNumber.replace(/\D/g, "").length < 16
    ) {
      setAccountNumber((prev) => prev + e.key);
      e.preventDefault();
    }
  };

  // Handle paste events
  const handlePaste = (e) => {
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "");
    setAccountNumber(pasted.slice(0, 16)); // Only allow 16 digits
    e.preventDefault();
  };

  useEffect(() => {
    setFormData({});
  }, [selectedOption]);

  const handlePennyDropVerification = async (checkedBeneficiary) => {
    setIsLoading(true);
    try {
      const ipAddress = await getIpAddress();
      const payload = {
        senderDetails: {
          mobileNumber: userMobileNumber,
        },
        beneId: checkedBeneficiary.beneficiaryId,
        requestInfo: {
          latitude: LocalStorageUtil.getItem("latitude"),
          longitude: LocalStorageUtil.getItem("longitude"),
          deviceCommId: "deviceCommId_f5eeb4e6f63e",
          ipAddress: ipAddress,
          requestFrom: "WEB",
        },
      };
      // console.log("checkedBeneficiary", checkedBeneficiary);
      // console.log("payload", payload);

      const verificationResponse = await axiosInstance.put(
        "beneficiary/verification/update",
        payload,
        {
          headers: {
            authToken: localStorage.getItem("authToken"),
            includeUrn: true,
          },
        }
      );
      /*   {
          data:{
            "apiResponseCode": "200",
            "apiResponseMessage": "Success",
            "apiResponseTime": "2024-11-19T13:34:24.749697959",
            "apiResponseFrom": "JAVA",
            "apiResponseData": {
              "responseCode": "200",
              "responseMessage": "Completed",
              "data": "Success"
              }
              }
              }  */
      // Step 4: Update Verification Status Based on Response
      if (verificationResponse.data.apiResponseData.responseCode === "200") {
        setVerified(true);
        setIsVerified(true);
        toast.success(
          verificationResponse.data.apiResponseData.responseMessage
        );
      } else {
        toast.error(verificationResponse.data.apiResponseData.responseMessage);
      }
    } catch (error) {
      console.error("Error during Penny Drop Verification:", error);
      //  toast.error("Error during Penny Drop Verification");
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <>
      {loadingCharge && !["EP", "FW", "CC"].includes(transType) && (
        <Loader message="Please Wait While Service Fee And Markup Is Being Fetched. . ." />
      )}
      {isLoading && <Loader message="Please Wait . . ." />}
      <div className="min-h-[100%] pb-0 w-[100%] shadow-md bg-white">
        <form className="bg-white p-4 rounded-md " onSubmit={handleSubmit}>
          {selectedOption != "Total Payout" && (
            <div className="flex justify-between">
              <h3 className="text-lg font-semibold mb-4"></h3>
              {selectedOption != "Fund Withdrawal" && (
                <>
                  <div
                    className={` ${
                      selectedOption === "Credit Card Bill Pay" && "hidden"
                    } ${selectedOption === "Express Payment" && ""}`}
                  >
                    {((transType === "EP" && !isRP) ||
                      !(
                        isRP ||
                        (transType !== "CC" && transType !== "FW")
                      )) && (
                      <AddAccountButton
                        //isVisible={selectedOption !== "Express Payment" ? true : false}
                        senderId={senderId}
                        userMobileNumber={userMobileNumber}
                        handleSearch={handleSearch}
                        chargeSlab={chargeSlab}
                        senderData={senderData}
                      />
                    )}
                    {isRP ||
                    (transType !== "EP" &&
                      transType !== "CC" &&
                      transType !== "FW") ? (
                      <button
                        type="button"
                        className="bg-gradient-to-r from-[#4b5a9f] to-[#4fb5b7] px-3 py-1 mt-1 rounded-lg text-white hover:bg-gradient-to-r hover:from-[#6a77b0] hover:to-[#70c6c7] transition-all duration-300"
                        onClick={handleRegisterBeneficiaryClick}
                      >
                        Add Beneficiary +
                      </button>
                    ) : (
                      <AddBeneficiaryButton
                        // isVisible={selectedOption !== "Express Payment" ? true : false}
                        handleRegisterBeneficiaryClick={
                          handleRegisterBeneficiaryClick
                        }
                        beneMobileKyc={beneMobileKyc}
                        setBeneMobileKyc={setBeneMobileKyc}
                        registerByAadhar={registerByAadhar}
                        setRegisterByAadhar={setRegisterByAadhar}
                        formDataKyc={formDataKyc}
                        setFormDataKyc={setFormDataKyc}
                        senderId={senderId}
                        senderData={senderData}
                      />
                    )}
                  </div>
                </>
              )}
            </div>
          )}

          <div className="mb-4">
            {selectedOption === "Fund Withdrawal" ? (
              <>
                <div className=" -mt-6 ">
                  <div className="flex justify-end">
                    <AddAccountBtnFw
                      isVisible={
                        selectedOption !== "Express Payment" ? true : false
                      }
                      senderId={senderId}
                      userMobileNumber={userMobileNumber}
                      handleSearch={handleSearch}
                      getSenderDataFw={getSenderDataFw}
                      chargeSlab={chargeSlab}
                      senderData={senderData}
                    />
                  </div>
                  <label className="block font-medium mb-3 -mt-6">
                    Select Account
                  </label>
                  <div className="max-h-[48.5vh] overflow-y-auto">
                    {Array.isArray(senderData?.accounts) &&
                    senderData.accounts.length > 0 ? (
                      senderData.accounts.map((account, index) => {
                        const isExpanded =
                          expandedAccount === account.accountNumber;
                        return (
                          <div key={index} className="mb-2 border rounded ">
                            <div
                              className="flex items-center justify-between p-2 bg-gray-100 "
                              onClick={() => {
                                toggleAccountAccordion(account.accountNumber);
                                handleAccountSelect(account);
                              }}
                            >
                              <div className="flex items-center flex-grow">
                                {/*  <label
                                htmlFor={`account-${index}`}
                                className="cursor-pointer"
                              >
                                {account.bankName} ({account.accountNumber})
                              </label> */}
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
                                          {" "}
                                          Account Number:{" "}
                                          {account.accountNumber}
                                        </h3>
                                        <h1>IFSC Code: {account.ifscCode}</h1>
                                      </div>
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
                                    </div>
                                  </label>
                                </div>
                              </div>
                              {/* Arrow to expand/collapse the accordion */}
                              <div
                                className="flex justify-between items-center bg-gray-100 p-4 transition-colors "
                                onClick={() => {
                                  toggleAccountAccordion(account.accountNumber);
                                  handleAccountSelect(account);
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
                            {isExpanded && (
                              <div className="bg-gray-50 p-6 border-t  border-gray-200 overflow-hidden">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                  <div>
                                    <p className="font-medium">Bank Name:</p>
                                    <p>{account.bankName}</p>
                                  </div>
                                  <div>
                                    <p className="font-medium">
                                      Account Number:
                                    </p>
                                    <p>{account.accountNumber}</p>
                                  </div>
                                  <div>
                                    <p className="font-medium">IFSC Code:</p>
                                    <p>{account.ifscCode}</p>
                                  </div>
                                </div>

                                <button
                                  type="button"
                                  ref={proceedButtonRefFw}
                                  onClick={handleOpenModal}
                                  className="px-3 py-2 mt-3 bg-secondary text-white rounded-md hover:bg-secondary-light transition-all duration-200"
                                  style={{
                                    border: "3px solid transparent",
                                    borderRadius: "8px", // Ensure border-radius is maintained
                                    borderImage:
                                      "linear-gradient(45deg, #4b5a9f, #4fb5b7) 3",
                                    backgroundClip: "border-box", // Keep the background clipped to the border
                                    WebkitMaskImage:
                                      "linear-gradient(white, white)", // Fix for some browsers
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
                </div>
              </>
            ) : (
              <>
                {selectedOption === "Total Payout" ? (
                  <div className="-ml-12">
                    <TotalPayoutList />
                  </div>
                ) : (
                  <>
                    {selectedOption === "Credit Card Bill Pay" ? (
                      <>
                        <div className=" -mt-10 pt-4">
                          <div className="mb-1 mt-2 relative" ref={dropdownRef}>
                            <label className="block text-sm font-semibold mb-1 text-gray-800">
                              Bank Name
                            </label>
                            <input
                              type="text"
                              value={bankName}
                              onChange={(e) => {
                                const value = e.target.value;

                                // Sanitize the input to allow only alphabetic characters and spaces
                                setBankName(e.target.value);
                                setSearchTerm(e.target.value); // Sync with searchTerm for filtering
                                setDropdownVisible(true);

                                if (value.length >= 3) {
                                  // Clear error if valid (e.g., at least 3 characters)
                                  setErrors((prevErrors) => ({
                                    ...prevErrors,
                                    bankName: "",
                                  }));
                                } else {
                                  // Set error message if invalid
                                  setErrors((prevErrors) => ({
                                    ...prevErrors,
                                    bankName:
                                      "Bank Name must be at least 3 characters long",
                                  }));
                                }
                              }}
                              onFocus={() => setDropdownVisible(true)}
                              className={`w-full  p-2 border rounded-lg focus:outline-none bg-slate-50 ${
                                errors.bankName && "border-red-500"
                              }`}
                              placeholder="Enter Bank Name"
                              disabled={!userMobileNumber}
                            />
                            {isButtonClicked && errors.bankName && (
                              <p className="text-red-500 text-xs mt-1">
                                {errors.bankName}
                              </p>
                            )}
                            {dropdownVisible && (
                              <ul className="absolute top-full left-0 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-48 overflow-y-auto z-50">
                                {inputBankNameBasedFilter.map((bank) => (
                                  <li
                                    key={bank.ifsc}
                                    className="px-2 py-1 hover:bg-indigo-100 cursor-pointer"
                                    onClick={() => {
                                      setBankName(bank.name);
                                      setBankIfsc(bank.ifsc); // Set IFSC code based on selection
                                      setTransferType(bank.mode);
                                      setDropdownVisible(false);
                                    }}
                                  >
                                    {bank.name} ({bank.ifsc}) {bank.mode}
                                  </li>
                                ))}
                                {filteredCCBanks.length === 0 && (
                                  <li className="px-2 py-1">No banks found</li>
                                )}
                              </ul>
                            )}
                          </div>

                          <div className="mb-1">
                            <label className="block text-sm font-semibold mb-1 text-gray-800">
                              IFSC Code
                            </label>
                            <input
                              type="text"
                              value={bankIfsc}
                              maxLength={11}
                              onChange={(e) => {
                                const value = e.target.value;

                                // Sanitize the input to allow only alphanumeric characters
                                const sanitizedValue = value.replace(
                                  /[^A-Za-z0-9]/g,
                                  ""
                                );

                                setBankIfsc(sanitizedValue);

                                // Validate the sanitized value
                                if (
                                  sanitizedValue.length === 11 &&
                                  /^[A-Za-z0-9]{11}$/.test(sanitizedValue)
                                ) {
                                  // Clear error if valid
                                  setErrors((prevErrors) => ({
                                    ...prevErrors,
                                    bankIfsc: "",
                                  }));
                                } else {
                                  // Set error message if invalid
                                  setErrors((prevErrors) => ({
                                    ...prevErrors,
                                    bankIfsc:
                                      "IFSC Code must be exactly 11 alphanumeric characters",
                                  }));
                                }
                              }}
                              className={`w-full  p-2 border rounded-lg focus:outline-none bg-slate-50 ${
                                errors.bankIfsc && "border-red-500"
                              }`}
                              placeholder="Enter IFSC Code"
                              disabled={!userMobileNumber}
                            />
                            {isButtonClicked && errors.bankIfsc && (
                              <p className="text-red-500 text-xs mt-1">
                                {errors.bankIfsc}
                              </p>
                            )}
                          </div>

                          <div className="mb-1 relative">
                            <label className="block text-sm font-semibold mb-1 text-gray-800">
                              Card Account Number
                            </label>
                            <div className="relative">
                              <input
                                type="text" // Always use text, no password field
                                value={formatAccountNumber(
                                  accountNumber,
                                  isHolding
                                )} // Display formatted or masked account number
                                onKeyDown={handleKeyDown}
                                onPaste={handlePaste}
                                placeholder="XXXX XXXX XXXX XXXX"
                                inputMode="numeric"
                                className={`w-full  p-2 border rounded-lg focus:outline-none bg-slate-50 ${
                                  errors.accountNumber && "border-red-500"
                                }`}
                                disabled={!userMobileNumber}
                              />

                              <button
                                type="button"
                                className="absolute inset-y-0 right-3 flex items-center text-gray-500"
                                onMouseDown={() => setIsHolding(true)} // Show while holding
                                onMouseUp={() => setIsHolding(false)} // Hide when released
                                onMouseLeave={() => setIsHolding(false)} // Hide if cursor leaves
                              >
                                {isHolding ? (
                                  <Eye size={20} />
                                ) : (
                                  <EyeOff size={20} />
                                )}
                              </button>
                            </div>
                            {isButtonClicked && errors.accountNumber && (
                              <p className="text-red-500 text-xs mt-1">
                                {errors.accountNumber}
                              </p>
                            )}
                          </div>

                          <div className="mb-1">
                            <label className="block text-sm font-semibold mb-1 text-gray-800">
                              Mobile Number
                            </label>
                            <input
                              type="text"
                              maxLength={10}
                              value={beneMobile}
                              onInput={(e) => {
                                let value = e.target.value.replace(
                                  /[^0-9]/g,
                                  ""
                                ); // Allow only numbers

                                // Ensure the first digit is not 0,1,2,3,4,5
                                if (value.length > 0 && /^[0-5]/.test(value)) {
                                  value = value.slice(1); // Remove invalid first digit
                                }

                                // Clear the input if any digit repeats consecutively 6 times
                                if (/(.)\1{5}/.test(value)) {
                                  value = ""; // Clear input field
                                }

                                e.target.value = value; // Update the input field
                              }}
                              onChange={(e) => {
                                const value = e.target.value;
                                setBeneMobile(value);

                                // Validate the value and set errors accordingly
                                if (value && /^[6-9]\d{9}$/.test(value)) {
                                  // Clear error if valid
                                  setErrors((prevErrors) => ({
                                    ...prevErrors,
                                    beneMobile: "",
                                  }));
                                } else {
                                  // Set error message if invalid
                                  setErrors((prevErrors) => ({
                                    ...prevErrors,
                                    beneMobile:
                                      "Enter a valid 10-digit mobile number starting with 6-9",
                                  }));
                                }
                              }}
                              className={`w-full  p-2 border rounded-lg focus:outline-none bg-slate-50 ${
                                errors.beneMobile && "border-red-500"
                              }`}
                              placeholder="Enter Mobile Number"
                              disabled={!userMobileNumber}
                            />
                            {isButtonClicked && errors.beneMobile && (
                              <p className="text-red-500 text-xs mt-1">
                                {errors.beneMobile}
                              </p>
                            )}
                          </div>
                          <button
                            type="button"
                            onClick={handleOpenModal}
                            className="px-3 py-2 mt-3 text-white rounded-md transition-all duration-200 bg-secondary hover:bg-secondary-light"
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
                      </>
                    ) : (
                      <>
                        <div
                          className={`space-y-3 w-[100%] ${
                            transType === "EP" && !isRP
                              ? "max-w-[calc(100%-320px)]"
                              : "max-w-[calc(100%-160px)]"
                          }   pt-3 pb-3 pr-3 `}
                        >
                          {/* Search Field */}
                          <div className="mb-4 -mt-12">
                            <input
                              type="text"
                              value={beneSearch}
                              onChange={(e) => {
                                setBeneSearch(e?.target?.value?.trim());
                                handleFrontendSearch(e);
                              }}
                              placeholder="Search by bank account, mobile, bank name, or IFSC..."
                              className="w-full p-2 border focus:outline-none border-gray-300 rounded-lg text-gray-700 "
                            />
                          </div>
                        </div>
                        <label className="block font-medium text-lg mb-3 text-gray-800 ml-2 ">
                          Select Beneficiary
                        </label>
                        <div
                          className={`max-h-80 overflow-y-auto ${
                            filteredBene?.length === 2 && "pb-20"
                          }  ${filteredBene?.length === 1 && "pb-44"}`}
                        >
                          {filteredBene.length > 0 ? (
                            filteredBene.map((beneficiary) => {
                              const fullName = `${
                                beneficiary.beneficiaryFirstName
                              } ${
                                beneficiary.beneficiaryMiddleName
                                  ? beneficiary.beneficiaryMiddleName + " "
                                  : ""
                              }${beneficiary.beneficiaryLastName}`;
                              const isExpanded =
                                expandedBeneficiary ===
                                beneficiary.beneficiaryId;

                              const handleExpandClick = (e) => {
                                e.stopPropagation(); // Prevent expanding when clicking on checkbox or full name
                                setBeneMobile(beneficiary.beneficiaryMobile);
                                setBeneficaryAccountNumber(
                                  beneficiary.accountNumber
                                );
                                setCheckedBeneficiary(beneficiary);
                                handleCheckboxChange(beneficiary.beneficiaryId);
                              };

                              const handleDeleteClick = (e) => {
                                e.stopPropagation(); // Prevent accordion toggle
                                setDeleteModalVisible(true);
                                setBeneficiaryToDelete(beneficiary); // Set the current beneficiary to delete
                              };

                              return (
                                <div
                                  key={beneficiary.beneficiaryId}
                                  className={`mb-2 border border-gray-200 rounded-lg shadow-sm overflow-hidden`}
                                >
                                  {/* Beneficiary Header */}
                                  <div
                                    className={`flex justify-between items-center bg-gray-100 p-4 hover:bg-gray-50 transition-colors `}
                                    onClick={() => {
                                      toggleAccordion(
                                        beneficiary.beneficiaryId
                                      );
                                      setBeneMobile(
                                        beneficiary.beneficiaryMobile
                                      );
                                      setBeneficaryAccountNumber(
                                        beneficiary.accountNumber
                                      );
                                      setCheckedBeneficiary(beneficiary);
                                      handleCheckboxChange(
                                        beneficiary.beneficiaryId
                                      );
                                    }}
                                  >
                                    <div className="flex items-center">
                                      <label
                                        htmlFor={beneficiary.beneficiaryId}
                                        className="flex items-center space-x-3"
                                      >
                                        <div className="w-12 h-12 rounded-full bg-slate-200 flex items-center justify-center">
                                          <span className="text-lg font-medium text-gray-600">
                                            {(beneficiary?.beneficiaryFirstName?.charAt(
                                              0
                                            ) || "N") +
                                              (beneficiary?.beneficiaryLastName?.charAt(
                                                0
                                              ) || "A")}
                                          </span>
                                        </div>

                                        <div>
                                          <h3 className="flex items-center gap-2 text-md font-medium text-grey-900">
                                            {fullName}
                                            {beneficiary.defaultAccount && (
                                              <span className="flex items-center text-xs text-blue-500">
                                                <GrUserSettings className="mr-1" />
                                                (Default Account)
                                              </span>
                                            )}
                                            {beneficiary.selfAccount && (
                                              <span className="flex items-center text-xs text-secondary-dark">
                                                <GrUserSettings className="mr-1" />
                                                (Self Account)
                                              </span>
                                            )}
                                            {!beneficiary.selfAccount &&
                                              !beneficiary.defaultAccount && (
                                                <span className="flex items-center text-xs text-primary">
                                                  <GrUserSettings className="mr-1" />
                                                  (Beneficiary Account)
                                                </span>
                                              )}
                                          </h3>

                                          <div className="flex gap-4 text-gray-700 text-sm">
                                            <h3 className="w-80">
                                              {" "}
                                              Account Number:{" "}
                                              {beneficiary.accountNumber}
                                            </h3>
                                            <h1>
                                              Mobile:{" "}
                                              {beneficiary.beneficiaryMobile}
                                            </h1>
                                          </div>
                                          <div className="flex items-center mt-1">
                                            {beneficiary.isAccountVerified ? (
                                              <>
                                                {beneficiary.isAccountVerified ? (
                                                  <>
                                                    {beneficiary?.accountVerificationStage?.toLowerCase() ===
                                                    "completed" ? (
                                                      <>
                                                        <div className="flex items-center text-green-600">
                                                          <MdOutlineVerified className="w-4 h-4" />
                                                          <span className="text-sm ml-1">
                                                            Verified
                                                          </span>
                                                        </div>
                                                      </>
                                                    ) : beneficiary?.accountVerificationStage ===
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
                                              </>
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
                                    {/* Action Buttons */}
                                    <div className="flex items-center space-x-4">
                                      <FiTrash
                                        className="w-5 h-5 text-red-500 hover:text-red-600 cursor-pointer"
                                        onClick={handleDeleteClick}
                                      />
                                      <button
                                        type="button"
                                        onClick={(e) => {
                                          e.stopPropagation(); // Prevent expanding when clicking on checkbox or full name
                                          toggleAccordion(
                                            beneficiary.beneficiaryId
                                          );
                                          setBeneMobile(
                                            beneficiary.beneficiaryMobile
                                          );
                                          setBeneficaryAccountNumber(
                                            beneficiary.accountNumber
                                          );
                                          setCheckedBeneficiary(beneficiary);
                                          handleCheckboxChange(
                                            beneficiary.beneficiaryId
                                          );
                                        }}
                                        className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
                                      >
                                        <svg
                                          className={`w-4 h-4 transform transition-transform duration-200 ${
                                            isExpanded ? "rotate-180" : ""
                                          }`}
                                          onClick={() => {
                                            setBeneMobile(
                                              beneficiary.beneficiaryMobile
                                            );
                                            setBeneficaryAccountNumber(
                                              beneficiary.accountNumber
                                            );
                                            setCheckedBeneficiary(beneficiary);
                                            handleCheckboxChange(
                                              beneficiary.beneficiaryId
                                            );
                                          }}
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
                                      </button>
                                    </div>
                                  </div>

                                  {/* Accordion Content */}
                                  {isExpanded && (
                                    <div className="bg-gray-50 p-6 border-t  border-gray-200 overflow-hidden">
                                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-1">
                                          <p className="text-sm text-gray-500 w-10">
                                            Mobile
                                          </p>
                                          <p className="font-medium">
                                            {beneficiary.beneficiaryMobile}
                                          </p>
                                        </div>
                                        <div className="space-y-1">
                                          <p className="text-sm text-gray-500">
                                            Bank Name
                                          </p>
                                          <p className="font-medium w-52">
                                            {beneficiary.bankName}
                                          </p>
                                        </div>
                                        <div className="space-y-1">
                                          <p className="text-sm text-gray-500">
                                            Bank IFSC
                                          </p>
                                          <p className="font-medium">
                                            {beneficiary.accountIfsc}
                                          </p>
                                        </div>
                                        <div className="space-y-1">
                                          <p className="text-sm text-gray-500">
                                            Account Number
                                          </p>
                                          <p className="font-medium">
                                            {beneficiary.accountNumber}
                                          </p>
                                        </div>
                                      </div>

                                      {((transType === "EP" && !isRP) || // Always show in this case
                                        !(
                                          (isRP ||
                                            (transType !== "CC" &&
                                              transType !== "FW")) &&
                                          (beneficiary?.selfAccount ||
                                            beneficiary?.defaultAccount)
                                        )) && (
                                        <button
                                          type="button"
                                          ref={proceedButtonRef}
                                          onClick={() => {
                                            handleOpenModal(beneficiary);
                                          }}
                                          className="px-3 py-2 mt-3 bg-secondary text-white rounded-md hover:bg-secondary-light transition-all duration-200"
                                          style={{
                                            border: "3px solid transparent",
                                            borderRadius: "8px", // Ensure border-radius is maintained
                                            borderImage:
                                              "linear-gradient(45deg, #4b5a9f, #4fb5b7) 3",
                                            backgroundClip: "border-box", // Keep the background clipped to the border
                                            WebkitMaskImage:
                                              "linear-gradient(white, white)", // Fix for some browsers
                                            boxShadow:
                                              "rgba(0, 0, 0, 0.17) 0px -23px 25px 0px inset, rgba(0, 0, 0, 0.15) 0px -36px 30px 0px inset, rgba(0, 0, 0, 0.1) 0px -79px 40px 0px inset, rgba(0, 0, 0, 0.06) 0px 2px 1px, rgba(0, 0, 0, 0.09) 0px 4px 2px, rgba(0, 0, 0, 0.09) 0px 8px 4px, rgba(0, 0, 0, 0.09) 0px 16px 8px, rgba(0, 0, 0, 0.09) 0px 32px 16px",
                                          }}
                                        >
                                          Proceed
                                        </button>
                                      )}
                                    </div>
                                  )}
                                </div>
                              );
                            })
                          ) : (
                            <p>No beneficiaries available.</p>
                          )}
                        </div>
                        {deleteModalVisible && (
                          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                            <div className="bg-white p-6 rounded shadow-md">
                              <h2 className="text-lg font-bold mb-4">
                                Confirm Deletion
                              </h2>
                              <p>
                                Are you sure you want to delete{" "}
                                {beneficiaryToDelete.beneficiaryFirstName}?
                              </p>
                              <div className="mt-4 flex justify-end space-x-4">
                                <button
                                  className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-500 transition-all duration-300"
                                  onClick={() => {
                                    deleteBeneficiary(
                                      beneficiaryToDelete.beneficiaryId,
                                      senderId
                                    ); // Call the delete function
                                    setDeleteModalVisible(false); // Close the modal after deletion
                                  }}
                                >
                                  Confirm
                                </button>
                                <button
                                  className="bg-gray-300 px-4 py-2 rounded"
                                  onClick={() => {
                                    setDeleteModalVisible(false);
                                  }}
                                >
                                  Cancel
                                </button>
                              </div>
                            </div>
                          </div>
                        )}
                      </>
                    )}
                  </>
                )}
              </>
            )}
          </div>

          {errors.selectedBeneficiary && (
            <p className="text-red-500 text-sm mx-3 my-3">
              {errors.selectedBeneficiary}
            </p>
          )}

          {isModalOpen && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 p-4 z-[2]">
              <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl animate-fadeIn max-h-[76vh] overflow-y-auto">
                <div className="p-1 border-b border-gray-100">
                  <h1 className="text-xl font-semibold text-gray-800 items-center gap-3 ml-4 mr-4">
                    {transType === "CC" || transType === "FW"
                      ? selectedOption
                      : transType === "EP"
                      ? isRP
                        ? "Rent Payment"
                        : "Fund Settlement"
                      : "Education Fees"}
                    {transType === "EP" ||
                    transType === "CC" ||
                    transType === "FW" ? (
                      <div className="text-base text-primary flex justify-center text-left flex-nowrap">
                        {note}
                      </div>
                    ) : (
                      <div className="flex flex-nowrap items-center justify-end mt-2 w-full space-x-4 relative group">
                        <div className="text-base text-primary w-full">
                          {note}
                        </div>
                        <div className="flex flex-nowrap items-center justify-end mt-2 w-full space-x-4 relative group">
                          <label className="flex items-center space-x-2">
                            <input
                              type="radio"
                              name="payment"
                              value="credit"
                              checked={selectedPayment === "credit"}
                              onChange={handleChangeRadio}
                            />

                            <span className="text-gray-600 text-sm">
                              Credit Card
                            </span>
                          </label>
                          <label className="flex items-center space-x-2">
                            <input
                              type="radio"
                              name="payment"
                              value="master"
                              checked={selectedPayment === "master"}
                              onChange={handleChangeRadio}
                            />
                            <span className="text-gray-600 text-sm">
                              Master Card
                            </span>
                          </label>
                          <label className="flex items-center space-x-2 relative group/others">
                            <input
                              type="radio"
                              name="payment"
                              value="other"
                              checked={selectedPayment === "other"}
                              onChange={handleChangeRadio}
                              disabled
                            />
                            <span className="text-gray-600 text-sm">
                              Corporate Card
                            </span>
                            <span className="absolute hidden group-hover/others:block p-1 rounded-md top-5 -right-3 text-xs w-36 text-center bg-gray-600 text-white">
                              Service Not Available
                            </span>
                          </label>
                        </div>
                      </div>
                    )}
                  </h1>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2">
                  {/* Left Section - Details */}
                  <div className="p-2 space-y-2">
                    {/* Sender Details Card */}
                    {selectedOption === "Fund Withdrawal" ? (
                      <>
                        {" "}
                        <div className="flex justify-between gap-2">
                          <div className="space-y-3 bg-gray-50 rounded-xl p-2 w-full border-2">
                            <h2 className="text-sm font-medium text-gray-600">
                              Merchant Details
                            </h2>
                            <div>
                              <p className="text-sm text-gray-500">
                                First Name
                              </p>
                              <p className="text-sm font-medium text-gray-800 capitalize">
                                {senderData?.panCardData?.firstName ||
                                  senderData?.name ||
                                  "N/A"}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">
                                Middle Name
                              </p>
                              <p className="text-sm font-medium text-gray-800 capitalize">
                                {senderData?.panCardData?.middleName || "N/A"}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">Last Name</p>
                              <p className="text-sm font-medium text-gray-800 capitalize">
                                {senderData?.panCardData?.lastName || "N/A"}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">Mobile</p>
                              <p className="text-sm font-medium text-gray-800">
                                {senderData?.panCardData?.mobile_no || "N/A"}
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
                              <p className="text-sm text-gray-500">
                                Account Number
                              </p>
                              <p className="text-sm font-medium text-gray-800">
                                {accountNumber || "N/A"}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">Bank Name</p>
                              <p className="text-sm font-medium text-gray-800">
                                {bankName || "N/A"}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">Bank IFSC</p>
                              <p className="text-sm font-medium text-gray-800">
                                {bankIfsc || "N/A"}
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
                                selectedOption === "Credit Card Bill Pay"
                                  ? "flex flex-col gap-2 "
                                  : "flex items-center gap-8"
                              }`}
                            >
                              <div>
                                <p className="text-sm text-gray-500 ">
                                  Full Name
                                </p>
                                <p className="text-sm font-medium text-gray-800 capitalize">
                                  {[
                                    senderData.firstName,
                                    senderData.middleName,
                                    senderData.lastName,
                                  ]
                                    ?.filter(Boolean)
                                    ?.join(" ") || "N/A"}
                                </p>
                              </div>

                              <div>
                                <p className="text-sm text-gray-500">
                                  Mobile Number
                                </p>
                                <p className="text-sm font-medium text-gray-800">
                                  {senderData?.mobileNumber ||
                                    userMobileNumber ||
                                    "N/A"}
                                </p>
                              </div>
                            </div>
                          </div>
                          {selectedOption === "Credit Card Bill Pay" && (
                            <div className="space-y-3 bg-gray-50 rounded-xl p-2 w-full border-2">
                              <h2 className="text-sm font-medium text-gray-600">
                                Card Details
                              </h2>
                              <div>
                                <p className="text-sm text-gray-500">
                                  Card Number
                                </p>
                                <p className="text-sm font-medium text-gray-800">
                                  {accountNumber
                                    ? `XXXXXXXXXXXX${accountNumber.slice(-4)}`
                                    : "N/A"}
                                </p>
                              </div>
                              <div>
                                <p className="text-sm text-gray-500">
                                  Bank Name
                                </p>
                                <p className="text-sm font-medium text-gray-800">
                                  {bankName || "N/A"}
                                </p>
                              </div>
                              {selectedOption !== "Credit Card Bill Pay" && (
                                <div>
                                  <p className="text-sm text-gray-500">
                                    Bank IFSC
                                  </p>
                                  <p className="text-sm font-medium text-gray-800">
                                    {bankIfsc || "N/A"}
                                  </p>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </>
                    )}

                    {/* Beneficiary Details Card */}

                    {selectedOption === "Fund Withdrawal" ? (
                      <>
                        {loadingSlab ? (
                          <Loader message="Loading Slab . . ." />
                        ) : (
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
                                  {slab?.map((item, index) => (
                                    <tr
                                      key={index}
                                      className="border-b last:border-b-0"
                                    >
                                      <td className="p-1">
                                        {item.slabSequence ?? "-"}
                                      </td>
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
                        )}
                      </>
                    ) : (
                      <>
                        {selectedOption === "Credit Card Bill Pay" ? (
                          <>
                            {/*  <div className="space-y-3 bg-gray-50 rounded-xl p-5">
                              <h2 className="text-sm font-medium text-gray-600">
                                Card Details
                              </h2>
                              <div>
                                <p className="text-sm text-gray-500">
                                  Card Number
                                </p>
                                <p className="text-sm font-medium text-gray-800">
                                  {accountNumber
                                    ? `XXXXXXXXXXXX${accountNumber.slice(-4)}`
                                    : "N/A"}
                                </p>
                              </div>
                              <div>
                                <p className="text-sm text-gray-500">
                                  Bank Name
                                </p>
                                <p className="text-sm font-medium text-gray-800">
                                  {bankName || "N/A"}
                                </p>
                              </div>
                              {selectedOption !== "Credit Card Bill Pay" && (
                                <div>
                                  <p className="text-sm text-gray-500">
                                    Bank IFSC
                                  </p>
                                  <p className="text-sm font-medium text-gray-800">
                                    {bankIfsc || "N/A"}
                                  </p>
                                </div>
                              )}
                            </div> */}
                            <>
                              {loadingSlab ? (
                                <Loader message="Loading Slab . . ." />
                              ) : (
                                <div className="space-y-2 mt-3 border-2 rounded-xl">
                                  <div className="max-h-[200px] overflow-y-auto">
                                    <table className="w-full text-xs">
                                      <thead>
                                        <tr className="bg-gray-50">
                                          <th className="p-1 text-left">
                                            Slab
                                          </th>
                                          <th className="p-1 text-left">
                                            Range
                                          </th>
                                          <th className="p-1 text-left">
                                            Charges
                                          </th>
                                          <th className="p-1 text-left">GST</th>
                                        </tr>
                                      </thead>
                                      <tbody>
                                        {slab?.map((item, index) => (
                                          <tr
                                            key={index}
                                            className="border-b last:border-b-0"
                                          >
                                            <td className="p-1">
                                              {item.slabSequence ?? "-"}
                                            </td>
                                            <td className="p-1">
                                              ₹{item.minTxnValue ?? "-"} - ₹
                                              {item.maxTxnValue ?? "-"}
                                            </td>
                                            <td className="p-1">
                                              {item?.charges ?? "-"}
                                              {/* {item.calculationType === "PERCENTAGE"
                                                ? item.percentage != null && item.percentage !== ''
                                                  ? `${item.percentage}%`
                                                  : '-'
                                                : item.fixed != null && item.fixed !== ''
                                                  ? `₹${item.fixed}`
                                                  : '-'} */}
                                            </td>
                                            <td className="p-1">
                                              {item.gst ?? "-"}
                                            </td>
                                          </tr>
                                        ))}
                                      </tbody>
                                    </table>
                                  </div>
                                </div>
                              )}
                            </>
                          </>
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
                                  </>
                                ) : (
                                  <>
                                    <div className="flex items-center text-green-600">
                                      <MdOutlineVerified className="w-4 h-4" />
                                      <span className="text-sm ml-1">
                                        Verified
                                      </span>
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
                                          checkedBeneficiary?.beneficiaryFirstName,
                                          checkedBeneficiary?.beneficiaryMiddleName,
                                          checkedBeneficiary?.beneficiaryLastName,
                                        ]
                                          ?.filter(Boolean)
                                          ?.join(" ")
                                      ) ?? ""}
                                    </p>
                                  </div>
                                  <div>
                                    <p className="text-sm text-gray-500">
                                      Mobile Number
                                    </p>
                                    <p className="text-sm font-medium text-gray-800">
                                      {checkedBeneficiary?.beneficiaryMobile ||
                                        "N/A"}
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
                            {transType !== "FW" &&
                              !(
                                transType === "CC" &&
                                senderData.isAccountVerified
                              ) &&
                              !checkedBeneficiary.isAccountVerified && (
                                <>
                                  {!isVerified && (
                                    <TransferNotice
                                      handlePennyDropVerification={
                                        handlePennyDropVerification
                                      }
                                      selectedBeneficiary={checkedBeneficiary}
                                    />
                                  )}
                                </>
                              )}

                            <>
                              {loadingSlab ? (
                                <Loader message="Loading Slab . . ." />
                              ) : (
                                <div className="space-y-2 mt-3 border-2 rounded-xl">
                                  <div className="max-h-[200px] overflow-y-auto">
                                    <table className="w-full text-xs">
                                      <thead>
                                        <tr className="bg-gray-50">
                                          <th className="p-1 text-left">
                                            Slab
                                          </th>
                                          <th className="p-1 text-left">
                                            Range
                                          </th>
                                          <th className="p-1 text-left">
                                            Charges
                                          </th>
                                          <th className="p-1 text-left">GST</th>
                                        </tr>
                                      </thead>
                                      <tbody>
                                        {slab?.map((item, index) => (
                                          <tr
                                            key={index}
                                            className="border-b last:border-b-0"
                                          >
                                            <td className="p-1">
                                              {item.slabSequence ?? "-"}
                                            </td>
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
                                            <td className="p-1">
                                              {item.gst ?? "-"}
                                            </td>
                                          </tr>
                                        ))}
                                      </tbody>
                                    </table>
                                  </div>
                                </div>
                              )}
                            </>
                          </div>
                        )}
                      </>
                    )}
                  </div>

                  {/* Right Section - Transfer Form */}
                  <div className="px-6 pb-6 bg-gray-50 lg:bg-white lg:border-l border-gray-100">
                    {selectedOption === "Fund Withdrawal" && null}

                    <div className="space-y-4 ">
                      {/* Transfer Type */}
                      <div
                        className={`space-x-2 ${
                          selectedOption === "Credit Card Bill Pay"
                            ? "flex"
                            : "hidden"
                        }`}
                      >
                        <button
                          type="button"
                          className="flex-1 py-3  text-sm font-medium rounded-lg transition-all duration-200 bg-[#4b5a9f] text-white shadow-lg shadow-indigo-200"
                        >
                          {transferType}
                        </button>
                      </div>
                      {selectedOption === "Fund Withdrawal" && (
                        <div className="w-full flex flex-col gap-y-1 ">
                          {/* <label className="text-sm font-medium text-gray-700 mb-3 block">
                            Select Transfer Type
                          </label> */}
                          <div className="w-full flex gap-1">
                            <button
                              type="button"
                              className={`px-3 py-2 ${
                                transferType === "IMPS"
                                  ? "bg-[#4b5a9f] text-white shadow-lg shadow-indigo-200"
                                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                              } transition-all duration-200 flex-1 rounded-md`}
                              onClick={() => {
                                handleTransferClick("IMPS");
                                resetFormData();
                              }}
                            >
                              IMPS
                            </button>
                            <button
                              type="button"
                              className={`px-3 py-2  ${
                                transferType === "NEFT"
                                  ? "bg-[#4b5a9f] text-white shadow-lg shadow-indigo-200"
                                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                              } transition-all duration-200 flex-1  rounded-md`}
                              onClick={() => {
                                handleTransferClick("NEFT");
                                resetFormData();
                              }}
                            >
                              NEFT
                            </button>
                          </div>
                        </div>
                      )}
                      <div
                        className="space-x-2"
                        style={{
                          display:
                            activeForm === "expressPayment" ? "flex" : "none",
                        }}
                      >
                        <button
                          type="button"
                          className="flex-1 py-3 text-sm font-medium rounded-lg transition-all duration-200 bg-[#4b5a9f] text-white shadow-lg shadow-indigo-200"
                          onClick={() => {
                            handleOptionClick("Ik Credit Pay");
                            setTransferType("Ik Credit Pay");
                          }}
                        >
                          {isRP
                            ? "Rent Payment"
                            : transType === "EP"
                            ? "Fund Settlement"
                            : "Education Fees"}
                        </button>
                      </div>
                      <div
                        style={{
                          display:
                            activeForm === "expressPayment" ||
                            activeForm === "creditCardBillPay" ||
                            activeForm === "fundWithdrawal"
                              ? "none"
                              : "block",
                        }}
                      >
                        {/* <label className="text-sm font-medium text-gray-700 mb-3 block">
                          Select Transfer Type
                        </label> */}

                        <div className="flex space-x-2">
                          {filteredServices.map((service) => (
                            <button
                              key={service}
                              type="button"
                              className={`flex-1 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
                                selType === service
                                  ? "bg-[#4b5a9f] text-white shadow-lg shadow-indigo-200"
                                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                              }`}
                              onClick={() => {
                                handleOptionClick(service);
                                setSelType(service);
                                setMarkupValue("");
                                setMarkupPercentage("");
                                setCharge("");
                                setChargeValue("");
                                formData.amount = "";
                                formData.charge = "";
                                formData.markup = "";
                              }}
                            >
                              {/*  {formatIkTitle(service)} */}
                              Education Fees
                            </button>
                          ))}
                        </div>
                      </div>
                      {/* Amount Input */}

                      <p className="text-sm text-blue-500">
                        Request Amount must be between ₹
                        {amountLimits?.minValue || 1} and ₹
                        {amountLimits?.maxValue || 50000}
                      </p>
                      <div className="w-full flex justify-center gap-2">
                        <div className="flex-2">
                          <div className="w-full flex justify-center flex-col gap-y-0">
                            <label className="text-sm font-medium text-gray-700 mb-3 text-center block">
                              {/* {transType == "EP" ||
                                transType == "CC" ||
                                transType == "FW" ||
                                transType == "RP" ? (
                                <> Transaction Amount</>
                              ) : (
                                <> Request Amount</>
                              )} */}
                              Request Amount{" "}
                              <span className="text-red-500">*</span>
                            </label>

                            <div className="relative w-full">
                              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                                ₹
                              </span>
                              <input
                                tabIndex={1}
                                type="text"
                                className={`w-40 focus:outline-none pl-8 pr-4 py-3 bg-gray-100 border-2 ${
                                  amountError
                                    ? "border-red-500"
                                    : "border-gray-100"
                                } rounded-lg focus:border-[#14192E] focus:ring-2 focus:ring-[#14192E]/20 transition-all duration-200`}
                                placeholder="0"
                                value={formData.amount}
                                onKeyDown={(e) => {
                                  const allowedKeys = [
                                    "Backspace",
                                    "Delete",
                                    "ArrowLeft",
                                    "ArrowRight",
                                    "Tab",
                                    "Home",
                                    "End",
                                  ];

                                  if (
                                    !/[0-9]/.test(e.key) &&
                                    !allowedKeys.includes(e.key) &&
                                    !e.ctrlKey &&
                                    !e.metaKey
                                  ) {
                                    e.preventDefault();
                                  }
                                }}
                                onChange={(e) => {
                                  setMarkupError("");
                                  let inputValue = e.target.value;
                                  if (inputValue === "") {
                                    setServiceFee("");
                                    setCardLastSixDigits("");
                                    setMarkupCharge("");
                                    setFinalAmount("");
                                    setRequestAmount("");
                                  }

                                  const parsedValue = parseFloat(inputValue);

                                  // Dynamically get the min and max values for the current transType from the amountLimits
                                  const limits = amountLimits || {
                                    minValue: 1,
                                    maxValue: 50000,
                                  };
                                  if (parsedValue > limits.maxValue) {
                                    inputValue = `${limits.maxValue}`;
                                    setAmountError(
                                      `Request Amount must be between ₹${limits.minValue} and ₹${limits.maxValue}`
                                    );
                                    setTimeout(() => {
                                      setAmountError("");
                                    }, 2000);
                                  } else if (parsedValue < limits.minValue) {
                                    setAmountError(
                                      `Request Amount must be between ₹${limits.minValue} and ₹${limits.maxValue}`
                                    );
                                  } else {
                                    setAmountError("");
                                  }
                                  // Update the amount only if it is less than 7 characters
                                  if (`${inputValue}`.length < 7) {
                                    const value = parseFloat(inputValue);

                                    handleInputChange(
                                      "amount",
                                      value,
                                      selectedOption === "Ik Pay" ||
                                        selectedOption === "Ik Credit Pay" ||
                                        selectedOption === "Rent Payment"
                                        ? creditCardType
                                        : undefined
                                    );

                                    const vv = convertToWords(value);
                                    setWord(vv);

                                    setTransferAmount(inputValue);
                                    setTotAm(inputValue);
                                    setMarkupPercentage("");
                                    setMarkupValue("");
                                    setServiceFee("");
                                    setCardLastSixDigits("");
                                    setMarkupCharge("");
                                    setFinalAmount("");
                                    setRequestAmount("");
                                  }

                                  // Update the form data with the new value (whether capped or not)
                                  setFormData((prev) => ({
                                    ...prev,
                                    amount: inputValue,
                                  }));
                                }}
                              />
                            </div>
                          </div>
                        </div>

                        <div className="flex-1">
                          <div className="w-full flex flex-col gap-y-0">
                            <div className="flex gap-1 items-start justify-center">
                              <label className="text-sm font-medium text-gray-700 mb-3 block ">
                                Charge
                              </label>
                              <span className="text-red-600">*</span>
                            </div>

                            <div className="relative">
                              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                                ₹
                              </span>
                              {loadingCharge && (
                                <span className="absolute  right-4 top-1/2 -translate-y-1/2 text-gray-500">
                                  <TailSpin
                                    height="25"
                                    width="25"
                                    color="#4fa94d"
                                  />
                                </span>
                              )}

                              <input
                                type="number"
                                className=" w-full pl-8 pr-4 py-3 bg-gray-100 border-2 border-gray-100 rounded-lg focus:border-[#14192E] focus:ring-2 focus:ring-[#14192E]/20 transition-all duration-200 cursor-not-allowed"
                                placeholder="0.00"
                                value={
                                  isModalOpen &&
                                  // transType !== "NEFT" &&
                                  chargeValue
                                    ? chargeValue
                                    : "0"
                                }
                                onChange={(e) => {
                                  setChargeValue(e?.target?.value);
                                }}
                                readOnly
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="mt-2 text-sm text-gray-500 ">
                        {word && (
                          <span>
                            {word} {" Rupees only"}
                          </span>
                        )}
                      </div>
                      {amountError && (
                        <p className="text-red-500 text-xs mt-1">
                          {amountError}
                        </p>
                      )}
                      {!(
                        transType === "EP" ||
                        transType === "CC" ||
                        transType === "FW"
                      ) && (
                        <>
                          <label className="text-sm font-medium text-gray-700  block">
                            Enter First Six Digits of Card
                            <span className="text-red-500"> *</span>
                          </label>

                          {/*  <span
                              className={`absolute left-4 top-1/2 -translate-y-1/2 text-gray-500`}
                            >
                              #
                            </span> */}
                          <input
                            tabIndex={4}
                            type="text"
                            inputMode="numeric" // Shows numeric keyboard on mobile
                            maxLength={6}
                            pattern="\d*"
                            placeholder="XXXXXX"
                            className="w-40 px-4 py-3 bg-gray-100 border-2 border-gray-100 rounded-lg focus:border-[#14192E] focus:ring-2 focus:ring-[#14192E]/20 transition-all duration-200"
                            value={cardLastSixDigits}
                            onChange={(e) => {
                              const value = e.target.value
                                .replace(/\D/g, "")
                                .slice(0, 6);
                              setCardLastSixDigits(value);
                            }}
                          />
                        </>
                      )}

                      <div
                        className={`${
                          (activeForm === "expressPayment" ||
                            activeForm === "fundWithdrawal" ||
                            activeForm === "creditCardBillPay") &&
                          "hidden"
                        }`}
                      >
                        {(serviceFee || markupCharge) && (
                          <div className="w-full flex flex-col gap-y-0">
                            <div className="w-full flex justify-between">
                              <div className="w-48 text-blue-800 text-sm bg-blue-50 border-l-4 border-blue-500 p-2 rounded-r-md">
                                <p>
                                  Service Fee:{" "}
                                  <p>₹ {Number(serviceFee ?? 0).toFixed(2)}</p>
                                </p>
                              </div>
                              <div className="w-48 text-blue-800 text-sm bg-blue-50 border-l-4 border-blue-500 p-2 rounded-r-md ">
                                <p>
                                  Markup:{" "}
                                  <p>
                                    ₹ {Number(markupCharge ?? 0).toFixed(2)}
                                  </p>
                                </p>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      {(requestAmount || finalAmount) && (
                        <div className="w-full flex flex-col gap-y-0">
                          <div className="w-full flex justify-between">
                            <div className="w-48 text-blue-800 text-sm bg-blue-50 border-l-4 border-blue-500 p-2 rounded-r-md">
                              {transType === "EP" ||
                              transType === "FW" ||
                              transType === "CC" ? (
                                <p>
                                  Transfer Amount:{" "}
                                  <p>₹ {Number(finalAmount ?? 0).toFixed(2)}</p>
                                </p>
                              ) : (
                                <p>
                                  Load Amount:
                                  <p>
                                    {" "}
                                    ₹ {Number(requestAmount ?? 0).toFixed(2)}
                                  </p>
                                </p>
                              )}
                            </div>

                            <div className="w-48 text-blue-800 text-sm bg-blue-50 border-l-4 border-blue-500 p-2 rounded-r-md">
                              {transType === "EP" ||
                              transType === "FW" ||
                              transType === "CC" ? (
                                <p>
                                  Debit Amount:{" "}
                                  <p>
                                    ₹ {Number(requestAmount ?? 0).toFixed(2)}
                                  </p>
                                </p>
                              ) : (
                                <p>
                                  Transfer Amount:
                                  <p>
                                    {" "}
                                    ₹ {Number(finalAmount ?? 0).toFixed(2)}
                                  </p>
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Action Buttons */}

                    {(transType === "EP" && !isRP) ||
                    !(
                      isRP ||
                      (transType !== "CC" && transType !== "FW")
                    ) ? null : (
                      <SlipButtons
                        onSlipUpload={handleSlipUpload}
                        isRP={isRP}
                        senderData={senderData}
                        beneficiary={checkedBeneficiary}
                        amount={formData.amount}
                      />
                    )}
                    <div className="mt-8 flex items-center justify-end space-x-4">
                      <button
                        type="button"
                        className="px-6 py-2.5 bg-[#800505] text-white text-sm font-medium rounded-lg hover:bg-opacity-90 transition-all duration-200 shadow-lg shadow-indigo-200"
                        onClick={() => {
                          setIsModalOpen(false);
                          setServiceFee("");
                          setCardLastSixDigits("");
                          setMarkupCharge("");
                          setMarkupValue("");
                          setMarkupPercentage("");
                          setCharge(false);
                          setChargeValue(0);
                          setFinalAmount("");
                          setFormData({});
                          setRequestAmount("");
                          setWord("");
                          setMarkupError("");
                        }}
                      >
                        Cancel
                      </button>
                      <button
                        className={`px-6 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 shadow-lg ${
                          !formData.amount ||
                          amountError ||
                          loadingCharge ||
                          // cardLastSixDigits checks only for non-EP/CC/FW types
                          (transType !== "EP" &&
                            transType !== "CC" &&
                            transType !== "FW" &&
                            (cardLastSixDigits === null ||
                              cardLastSixDigits === undefined ||
                              cardLastSixDigits === "" ||
                              cardLastSixDigits?.length !== 6 ||
                              Number(cardLastSixDigits) <= 0)) ||
                          // slipUrl only required if Button B is visible
                          (!(
                            (transType === "EP" && !isRP) ||
                            !(
                              isRP ||
                              (transType !== "CC" && transType !== "FW")
                            )
                          ) &&
                            !slipUrl)
                            ? "bg-gray-400 text-gray-800 cursor-not-allowed shadow-none"
                            : "bg-[#4b5a9f] text-white hover:bg-opacity-90 shadow-indigo-200"
                        }`}
                        type="submit"
                        disabled={
                          Number(requestAmount) <= 0 ||
                          Number(finalAmount) <= 0 ||
                          !formData.amount ||
                          amountError ||
                          loadingCharge ||
                          (transType !== "EP" &&
                            transType !== "CC" &&
                            transType !== "FW" &&
                            (cardLastSixDigits === null ||
                              cardLastSixDigits === undefined ||
                              cardLastSixDigits === "" ||
                              cardLastSixDigits?.length !== 6 ||
                              Number(cardLastSixDigits) <= 0)) ||
                          (!(
                            (transType === "EP" && !isRP) ||
                            !(
                              isRP ||
                              (transType !== "CC" && transType !== "FW")
                            )
                          ) &&
                            !slipUrl)
                        }
                      >
                        Proceed to Transfer
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </form>

        {modalVisible && (
          <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-gray-100 p-8 rounded-xl shadow-lg max-w-4xl max-h-[80vh] overflow-y-auto relative flex flex-col transform transition-transform duration-300 ease-in-out scale-95 hover:scale-100">
              <button
                onClick={closeModal}
                className="absolute top-2 right-2 p-2 text-gray-600 focus:outline-none"
              >
                <ImCross />
              </button>

              <div className="flex-1 overflow-y-auto">
                {(() => {
                  try {
                    const parsed =
                      typeof modalContent === "string"
                        ? JSON.parse(modalContent)
                        : modalContent;

                    const isFailure =
                      parsed?.apiResponseData?.responseCode === "401" ||
                      parsed?.apiResponseMessage?.toUpperCase() === "FAILURE";

                    if (isFailure) {
                      return (
                        <div className="text-center text-md font-medium text-gray-600 mt-3">
                          <p>Slip Data Preparation Failed.</p>
                        </div>
                      );
                    }
                  } catch (err) {
                    // Not JSON, assume it's HTML
                    return (
                      <>
                        <div
                          dangerouslySetInnerHTML={{ __html: modalContent }}
                        />
                        <div className="text-center">
                          <button
                            onClick={handlePrint}
                            className="mt-4 px-4 py-2 bg-[#4b5a9f] text-white rounded hover:bg-[#4fb5b7] transition-colors self-center mb-4"
                          >
                            Print
                          </button>
                        </div>
                      </>
                    );
                  }
                })()}
              </div>
            </div>
          </div>
        )}

        {slipModalVisible && (
          <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-[25vw] max-h-[80vh] overflow-y-auto relative flex flex-col">
              <button
                onClick={closeModal}
                className="absolute top-0 right-0 p-2  rounded-full  transition-colors"
              >
                <ImCross />
              </button>
              <div className="flex-1 overflow-y-auto">
                <div dangerouslySetInnerHTML={{ __html: slipContent }} />
              </div>
              <div className="flex justify-center space-x-4">
                <button
                  onClick={handleModalSubmit}
                  className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors self-center mb-4"
                >
                  Confirm
                </button>

                <button
                  onClick={closeModal}
                  className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-blue-600 transition-colors self-center mb-4"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
