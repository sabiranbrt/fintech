import Loader from "@/components/LoaderComponent";
import CustomField from "@/components/multiForm/CustomField";
import MultiFormHeader from "@/components/multiForm/multiFormHeader";
import { useDynamicMutation, useDynamicQuery } from "@/hooks/dynamicQuery";
import {
  useAadhaarRegistrationBeneLazy,
  useDigiData,
  useFileUpload,
  usePanFileUpload,
  usePinCode,
  useSessionInit,
} from "@/hooks/service";
import formList from "@/jsonDemo/structure.json";
import { setKycData } from "@/redux/slices/aadharSlice";
import { updateLoading } from "@/redux/slices/appSlice";
import { updateIsText } from "@/redux/slices/serviceSlice";
import { RootState } from "@/redux/store";
import { QuickLinksType } from "@/types";
import { base64ToFile } from "@/utils/base64ToFile";
import { getDynamicRequest } from "@/utils/dynamicRequest";
import { getIpAddress } from "@/utils/getIpAddress";
import LocalStorageUtil from "@/utils/LocalStorageUtil";
import ArrowLeft from "@assets/icons/arrowLeft.svg";
import ArrowRight from "@assets/icons/arrowRight.svg";
import clsx from "clsx";
import { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import PrefetchDecisionModal from "./components/PrefetchDecisionModal";

interface PennyDropResult {
  registeredName?: string;
  transID?: string;
  accountNo?: string;
  ifsc?: string;
  status?: string;
  isVerified?: boolean;
}

const RegisterBeneficiary = () => {
  const senderAccount = useSelector(
    (state: RootState) => state.senderData.sender
  );
  const [prefetchModalShown, setPrefetchModalShown] = useState(false);
  const aadharData = useSelector((state: RootState) => state.kyc.kyc);
  const dispatch = useDispatch();

  const [token, setToken] = useState("");
  const [isOld, setIsOld] = useState(false);
  const [district, setDistrict] = useState<TODO>([]);
  const [state, setState] = useState<TODO>([]);
  const [panUploaded, setPanUploaded] = useState(false);
  const [showPrefetchModal, setShowPrefetchModal] = useState(false);
  const [aadhaarPinCode, setAadharPinCode] = useState("");

  const { mutateAsync: pennyDropMutant } = useDynamicMutation<TODO>();
  const { mutateAsync: beneMutant } = useDynamicMutation<TODO>();
  const { mutateAsync: beneOldMutant } = useDynamicMutation<TODO>();
  const { mutateAsync: panMutant } = useDynamicMutation<TODO>();
  const { mutateAsync: fileUpload } = useFileUpload();
  const { mutateAsync: panFileUpload } = usePanFileUpload();

  const [pennyDropResult, setPennyDropResult] =
    useState<PennyDropResult | null>(null);

  const [index, setIndex] = useState(0);

  const methods = useForm<TODO>({
    mode: "onChange",
    defaultValues: {
      accountType: "SAVINGS",
    },
  });

  const { trigger, watch, getValues, setValue } = methods;
  const pan = watch("panNumber");
  const mobileNumber = watch("senderMobileNumber");
  const bankDetails = watch("bankName");
  const ifscValue = watch("ifsc");
  const [pinCodeValue] = watch(["pinCode"]);

  const { endpoints } = useSelector((state: RootState) => state.endPoints);
  const { selectedService } = useSelector((state: RootState) => state.service);

  const stepName = selectedService?.sequence?.[1];
  const pennyDropName = selectedService?.sequence?.find(
    (item) => item === "getPennyDrop"
  );

  const bene = selectedService?.sequence?.find(
    (item) => item === "getBeneficiary"
  );

  const beneOld = selectedService?.sequence?.find(
    (item) => item === "getBeneficiaryOld"
  );

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
  const panNo = selectedService?.sequence?.find((item) => item === "getPAN");
  const request = getDynamicRequest(stepName ?? "", endpoints ?? {});

  const { data, refetch, isLoading } = useDynamicQuery<TODO>(request!, {
    enabled: !!request,
    queryKey: [stepName],
  });

  const requestPennyDrop = getDynamicRequest(
    pennyDropName ?? "",
    endpoints ?? {},
    {
      bankIfsc: bankDetails?.ifsc,
      bankAccountNumber: getValues("accountNumber1"),
      mobileNumber: mobileNumber,
      senderMobileNumber: mobileNumber,
      type: "SENDER",
    }
  );

  const latitude = LocalStorageUtil.getItem("latitude");
  const longitude = LocalStorageUtil.getItem("longitude");
  const [ipAddress, setIpAddress] = useState("");

  useEffect(() => {
    const fetchIp = async () => {
      const ip = await getIpAddress();
      setIpAddress(ip); // store in state
    };

    fetchIp();
  }, []);

  const formattedData = {
    userId: 0,
    requestId: 0,
    senderId: senderAccount?.id,
    registrationMode: aadharData ? "aadhaar" : "manual",
    senderMobileNumber: mobileNumber,
    kycFileId: aadharData?.kycFileId ?? "",
    personalInfo: {
      firstName: getValues("firstName") ?? "",
      middleName: getValues("middleName") ?? "",
      lastName: getValues("lastName") ?? "",
      mobile: getValues("mobile") ?? "",
      gender: getValues("gender") ?? "",
      dob: getValues("dob") ?? "",
      panNumber: pan ?? "",
      profileImageId: getValues("attachment") ?? "",
      panUrl: getValues("panPDF"),
      panVerificationType: panUploaded ? "manual" : "digiLocker",
    },
    bankAccountInfo: {
      accountName: "",
      accountNumber: getValues("accountNumber1") ?? "",
      accountIfsc: getValues("ifsc") ?? "",
      bankName: getValues("bankName")?.bankName ?? "",
      accountType: getValues("accountType") ?? "",
      accountRegisterFor: "",
      accountLimit: NaN,
      accountNameAsPerBank: getValues("accountNameAsPerBank") ?? "",
      accountVerificationTxnId: pennyDropResult?.transID ?? "", // pennydropID
      accountSupportingImageId: 0,
      isAccountVerified: pennyDropResult?.isVerified ?? "",
    },
    kycAddressInfo: {
      completeAddress: getValues("permanentAddressLine1") ?? "",
      completeAddress2: getValues("permanentAddressLine2") ?? "",
      addressCity: getValues("permanentCity") ?? "",
      addressDistrict: getValues("permanentDistrict") ?? "",
      addressState: getValues("permanentState") ?? "",
      postalPinCode: getValues("pinCode") ?? "",
    },
    addressInfo: {
      completeAddress: getValues("tempAddressLine1") ?? "",
      completeAddress2: getValues("tempAddressLine2") ?? "",
      addressCity: getValues("tempCity") ?? "",
      addressDistrict: getValues("tempDistrict") ?? "",
      addressState: getValues("tempState") ?? "",
      postalPinCode: getValues("tempPinCode") ?? "",
    },
    documents: [
      {
        documentFor: "documentFor_cda6df4abf49",
        docType: "",
        fileId: "" /* doc.file[0],  */, // Include file field (if needed)
        docId: "", // Send the docId returned from file upload
        docStatus: "c",
        qcRemarks: "qcRemarks_656a8ffb1ab7",
        recordStatus: "c",
      },
    ],
    // Add new fields here
    /*  profileImageId: data.profileImage, // Profile image ID sent in personalInfo
      bankSupportingImageId: data.bankSupportingImage, */ // Bank supporting image ID sent in bankAccountInfo
  };

  const requestBene = getDynamicRequest(
    bene ?? "",
    endpoints ?? {},
    { ...formattedData },
    {
      lat: latitude,
      lng: longitude,
      ip: ipAddress,
    }
  );

  const requestBeneOld = getDynamicRequest(beneOld ?? "", endpoints ?? {}, {
    senderMobile: mobileNumber,
    bankName: bankDetails?.bankName,
    beneName: "",
  });

  const requestPan = getDynamicRequest(panNo ?? "", endpoints ?? {}, {
    pan: pan,
    mobile: mobileNumber,
  });

  const bank = data?.apiResponseData?.data;

  const { sender } = useSelector((state: RootState) => state.senderData);
  const [disabledFields, setDisabledFields] = useState<string[]>([]);

  const onSubmitForData = async () => {
    if (!requestPan) return;
    try {
      dispatch(updateLoading({ isLoading: true }));
      const response = await panMutant(requestPan);
      const data = response?.apiResponseData?.data;
      setValue("firstName", data?.firstName);
      setValue("lastName", data?.lastName);
      setValue("middleName", data?.middleName);
      setValue("dob", data?.dob);
      setValue("gender", data?.gender);
      setValue("permanentAddressLine1", data?.address);
      setValue("pinCode", data?.pincode);
      setValue("permanentCity", data?.city);
      setValue("permanentState", data?.state);
      setAadharPinCode(data.pincode);
      handlePinCodeChangeWrapper(data.pincode);
      console.log("data.pincode", data.pincode);

      if (response?.apiResponseData?.responseCode === "200") {
        const fieldsToCheck = [
          "firstName",
          "lastName",
          "middleName",
          "dob",
          "gender",
        ];
        const disabled: string[] = [];

        fieldsToCheck.forEach((fieldName) => {
          const value = data?.[fieldName];
          if (value) {
            setValue(fieldName, value);
            disabled.push(fieldName);
          }
        });

        setDisabledFields(disabled); // Disable only those fields with values
      }
      if (response?.apiResponseData?.responseCode === "411") {
        toast.error(response?.apiResponseData?.responseMessage);
      }
    } catch (err) {
      console.log("Error", err);
    } finally {
      dispatch(updateLoading({ isLoading: false }));
    }
  };

  useEffect(() => {
    if (bankDetails?.ifsc) {
      setValue("ifsc", bankDetails?.ifsc);
    }
  }, [bankDetails?.ifsc, ifscValue, setValue]);

  useEffect(() => {
    if (aadharData) {
      const tempDisabled: TODO[] = [];
      if (aadharData?.digilockerAdhar?.photo) {
        // Convert base64 to File object
        const photoFile = base64ToFile(aadharData?.digilockerAdhar?.photo);
        setValue("attachment", photoFile);
      }
      // Set First Name
      const firstName = aadharData?.digilockerAdhar?.name?.split(" ")[0];
      setValue("firstName", firstName);
      tempDisabled.push("firstName");
      // setFieldsEditable((prev: TODO) => ({ ...prev, firstName: true }));

      // Set Middle Name
      const middleName =
        aadharData?.digilockerAdhar?.name
          ?.split(" ")
          ?.slice(1, aadharData?.digilockerAdhar?.name?.split(" ")?.length - 1)
          ?.join(" ") ?? "";
      setValue("middleName", middleName);
      tempDisabled.push("middleName");
      // setFieldsEditable((prev) => ({ ...prev, middleName: !!middleName }));

      // Set Last Name
      const lastName =
        aadharData?.digilockerAdhar?.name?.split(" ")?.[
          aadharData?.digilockerAdhar?.name?.split(" ")?.length - 1
        ] || "";
      setValue("lastName", lastName);
      tempDisabled.push("lastName");

      // Set Address 1
      const address1 =
        aadharData?.digilockerAdhar?.splitAddress?.addressLine.replace(
          /\s{2,}/g,
          " "
        ) ?? "";
      setValue("permanentAddressLine1", address1);
      tempDisabled.push("permanentAddressLine1");

      // Set Pin Code
      const pinCode = aadharData?.digilockerAdhar?.splitAddress?.pincode ?? "";
      setValue("pinCode", pinCode);
      tempDisabled.push("pinCode");

      // Set District
      const district = aadharData?.digilockerAdhar?.splitAddress?.state ?? "";
      setDistrict([district]);
      setValue("permanentDistrict", district);
      tempDisabled.push("permanentDistricts");

      // Set State
      const state = aadharData?.digilockerAdhar?.splitAddress?.state ?? "";
      setState([state]);
      setValue("permanentState", state);
      tempDisabled.push("permanentState");

      // Set City
      const city =
        aadharData?.digilockerAdhar?.splitAddress?.city.replace(
          /\s{2,}/g,
          " "
        ) ?? "";
      setValue("permanentCity", city);
      tempDisabled.push("permanentCity");

      // Set Date of Birth
      const dobString = aadharData?.digilockerAdhar?.dob;
      setValue("dob", dobString);
      tempDisabled.push("dob");
      // setFieldsEditable((prev) => ({ ...prev, dob: true }));

      // Set Gender
      const genderValue = aadharData?.digilockerAdhar?.gender;
      setValue("gender", genderValue);
      tempDisabled.push("gender");

      // Set PAN Number
      const panNumber = aadharData?.panExtractedDetails?.panNumber || "";
      setValue("panNumber", panNumber);
      tempDisabled.push(["panNumber"]);
      // Set masked Number and maskedmobile
      const maskedAadhaarNo =
        aadharData?.panExtractedDetails?.maskedAadhaar || "";
      setValue("maskedAadhaarNo", maskedAadhaarNo);
      const maskedMobile = aadharData?.panExtractedDetails?.mobileNumber || "";
      setValue("maskedMobile", maskedMobile);

      setDisabledFields(tempDisabled);
    }
  }, [aadharData, setValue]);

  useEffect(() => {
    setValue("senderMobileNumber", sender?.mobileNumber);
  }, [sender?.mobileNumber, setValue]);

  const handleBeneOld = async () => {
    if (!requestBeneOld) return;
    try {
      dispatch(updateLoading({ isLoading: true }));
      const response = await beneOldMutant(requestBeneOld);
      if (response?.apiResponseData?.responseCode === "401") {
        toast.error(response?.apiResponseData?.responseMessage);
        setIsOld(!isOld);
      }
    } catch (error: TODO) {
      toast.error("Error Loading Old Beneficiary", error);
    } finally {
      dispatch(updateLoading({ isLoading: false }));
    }
  };

  const handlePanInput = (e: React.FormEvent<HTMLInputElement>) => {
    const value = e.currentTarget.value.toUpperCase();
    if (sender?.pan && value.toUpperCase() === sender.pan.toUpperCase()) {
      toast.error("Sender And Beneficiary Pan Number Cannot Be Same");
      // setHasInputError(true);
    } else {
      // setHasInputError(false);
    }
  };

  const handlePennyVerified = async () => {
    if (!requestPennyDrop) return;
    try {
      dispatch(updateLoading({ isLoading: true }));
      const response = await pennyDropMutant(requestPennyDrop);
      const result = response?.apiResponseData?.data;
      setPennyDropResult({
        registeredName: result.registeredName,
        transID: result.transID,
        accountNo: result.accountNo,
        ifsc: result.ifsc,
        status: result.status,
        isVerified: result.status === "COMPLETED",
      });
      // Set the registeredName in accountNameAsPerBank field
      if (result.status === "COMPLETED" && result.registeredName) {
        setValue("accountNameAsPerBank", result.registeredName);
      }

      if (response?.apiResponseData?.responseCode === "401") {
        toast.error(response?.apiResponseData?.responseMessage);
      }
    } catch (err) {
      console.log("error", err);
    } finally {
      dispatch(updateLoading({ isLoading: false }));
    }
  };

  const getCurrentStepFieldNames = (): TODO[] => {
    const stepKeys = Object.keys(formList?.dataFields ?? {}) as Array<
      keyof typeof formList.dataFields
    >;
    const currentKey = stepKeys[index];
    const currentStep = formList?.dataFields?.[currentKey];

    if (!Array.isArray(currentStep)) {
      return currentStep?.displayField?.map((item: TODO) => item.key) ?? [];
    }

    return [];
  };

  const { refetch: refetchSession } = useSessionInit({
    enabled: false,
  });

  const { refetch: refetchPinCode } = usePinCode({
    token: token,
    values: pinCodeValue ?? aadhaarPinCode,
    enabled: false, // prevent auto-fetch
  });

  const handlePinCodeChangeWrapper = async (
    e: React.FormEvent<HTMLInputElement>
  ) => {
    const pin = typeof e === "string" ? e : e.currentTarget.value;
    console.log("pin", pin);
    // Set the new pincode value in form
    setValue("pinCode", pin);

    if (pin.length !== 6) return; // Do nothing if length is not 6

    try {
      // 1. Refetch session token if missing
      const sessionResult = await refetchSession();
      const fetchedToken =
        sessionResult.data?.apiResponseData?.responseData?.token;

      if (!fetchedToken) {
        toast.error("Token not received from session API");
        return;
      }
      setToken(fetchedToken);
      localStorage.setItem("access_token", fetchedToken);

      // 2. Call refetchPinCode manually
      const result = (await refetchPinCode()) as TODO;
      const response = result?.data;

      if (response?.apiResponseData?.responseCode === 200) {
        const postOffices =
          response.apiResponseData.responseData?.PostOffice ?? [];

        const districtList = [
          ...new Set(postOffices.map((p: TODO) => p.District)),
        ];
        const stateList = [...new Set(postOffices.map((p: TODO) => p.State))];
        const cityList = [...new Set(postOffices.map((p: TODO) => p.Region))];

        // 3. Set values in form
        setDistrict(districtList);
        setState(stateList);
        setValue("permanentCity", cityList[0] ?? "");
        setValue("permanentState", stateList[0] ?? "");
        setValue("permanentDistrict", districtList[0] ?? "");
      } else {
        toast.error(
          response?.apiResponseData?.responseMessage || "Invalid PIN code"
        );
      }
    } catch (error) {
      console.error("PIN code fetch error:", error);
      toast.error("Failed to fetch PIN code info");
    }
  };

  const handleCheckbox = () => {
    const selected = getValues("sameAsPermanent");
    if (selected && selected.length > 0) {
      const perCity = getValues("permanentCity");

      setValue("tempAddressLine1", getValues("permanentAddressLine1"));
      setValue("tempAddressLine2", getValues("permanentAddressLine2"));
      setValue("tempPinCode", pinCodeValue);
      setValue("tempCity", perCity ?? "");
      setValue("tempDistrict", getValues("permanentDistrict"));
      setValue("tempState", getValues("permanentState"));
    } else {
      setValue("tempAddressLine1", "");
      setValue("tempAddressLine2", "");
      setValue("tempPinCode", "");
      setValue("tempCity", "");
      setValue("tempDistrict", "");
      setValue("tempState", "");
    }
  };

  const onSubmitBene = async () => {
    if (!requestBene) return;

    dispatch(updateLoading({ isLoading: true }));

    try {
      const response = await beneMutant(requestBene);
      if (response?.apiResponseData?.responseCode === "401") {
        if (response?.apiResponseData.data === "") {
          toast.error(response.apiResponseData.responseMessage);
        } else {
          toast.success(response.apiResponseData.responseMessage);
        }
      } else {
        toast.error(response?.apiResponseData.responseMessage);
      }
    } catch (err) {
      console.log("err", err);
    } finally {
      dispatch(updateLoading({ isLoading: false }));
    }
  };

  const handleFileUpload = async () => {
    const file = getValues("attachment");

    if (!file) {
      console.error("No file selected");
      return;
    }

    const formData = new FormData();
    formData.append("attachment", file);

    try {
      await fileUpload(formData);
    } catch (err) {
      console.error("Upload error:", err);
    }
  };

  const handlePanFileUpload = async () => {
    const file = getValues("panPDF");

    // 1. Refetch session token if missing
    const sessionResult = await refetchSession();
    const fetchedToken =
      sessionResult.data?.apiResponseData?.responseData?.token;

    if (!fetchedToken) {
      toast.error("Token not received from session API");
      return;
    }

    setToken(fetchedToken);
    localStorage.setItem("access_token", fetchedToken);

    // Step 2: Get Upload URL & Fields
    try {
      const response = await panFileUpload({
        fileType: "application/pdf",
        serviceType: "PG_SERVICE",
        subServiceType: "EDC_RECEIPT/RNT_RECEIPT",
        documentType: "subServiceType",
      });
      const responseData = response?.data?.apiResponseData?.responseData;

      const { url, fields, cdnUrl } = responseData;

      // Step 3: Upload to S3
      const formData = new FormData();
      Object.entries(fields).forEach(([key, value]: TODO) => {
        formData.append(key, value);
      });

      formData.append("panPDF", file);

      const s3Response = await fetch(url, {
        method: "POST",
        body: formData,
        mode: "no-cors", // required for direct S3 upload
      });

      // Step 4: Check success
      if (s3Response.status === 0) {
        setValue("panPdf", cdnUrl, { shouldValidate: true });
        setPanUploaded(true);
        Swal.fire("Success", "PAN uploaded successfully.", "success");
      } else {
        Swal.fire("Error", "Failed to upload file to S3.", "error");
      }
      console.log("uploadPanResponse", response);
    } catch (error) {
      console.log("Error", error);
    }
  };

  const onEdit = (stepKey: string) => {
    const stepKeys = Object.keys(formList?.dataFields) as Array<
      keyof typeof formList.dataFields
    >;
    const stepIndex = stepKeys.findIndex((key) => key === stepKey);
    if (stepIndex !== -1) {
      setIndex(stepIndex);
    } else {
      console.warn("Step key not found:", stepKey);
    }
  };

  const { data: digitoken } = useDynamicQuery<TODO>(requestRegisterSender!, {
    enabled: !!requestRegisterSender,
    queryKey: [registerSenderName],
  });

  const accessToken = digitoken?.apiResponseData?.responseData?.accessToken;

  const { refetch: fetchAadhaar } = useAadhaarRegistrationBeneLazy(
    accessToken ?? "",
    mobileNumber ?? "",
    "FETCH"
  );

  const { mutateAsync: fetchDigiData } = useDigiData();

  const handleReKYC = async () => {
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
      toast.error("Error Submitting Re-KYC");
      console.log(error);
    } finally {
      dispatch(updateLoading({ isLoading: false }));
    }
  };

  const handleNextStepAfterPrefetch = async () => {
    const fieldsToValidate = getCurrentStepFieldNames();
    const isStepValid = await trigger(fieldsToValidate);
    if (isStepValid) {
      setIndex((prev) => prev + 1);
    }
  };

  const render = () => {
    const stepKeys = Object.keys(formList?.dataFields) as Array<
      keyof typeof formList.dataFields
    >;
    const currentKey = stepKeys[index];
    const currentStep = formList.dataFields[currentKey];

    if (!Array.isArray(currentStep)) {
      const fields = [...(currentStep?.displayField ?? [])];

      // Inject PAN PDF upload field only in Step 1 and if Aadhar data is present
      if (index === 0 && aadharData) {
        fields.push({
          key: "panPDF",
          label: "Upload PAN PDF",
          placeholder: "Upload PAN PDF",
          fieldType: "file",
          uploadType: "pdf",
          validation: {
            required: "N",
            validations: [
              {
                errorMessage: "Please Upload Pdf",
              },
            ],
          },
        });
      }

      // Now render fields with your existing logic preserved
      return fields.map((displaylist: TODO) => {
        // Dynamically assign options for district, state, city
        let dynamicOptions: Array<{ label: string; value: string }> = [];

        if (displaylist.fieldType === "dropdown") {
          switch (displaylist.key) {
            case "permanentDistrict":
            case "tempDistrict":
              dynamicOptions = district.map((item: string) => ({
                label: item,
                value: item,
              }));
              break;
            case "permanentState":
            case "tempState":
              dynamicOptions = state.map((item: string) => ({
                label: item,
                value: item,
              }));
              break;
            default:
              dynamicOptions = displaylist.dropdownOptions ?? [];
          }
        } else {
          dynamicOptions = displaylist.dropdownOptions ?? [];
        }

        return (
          <CustomField
            rules={
              displaylist?.key === "confirmAccountNumber"
                ? {
                    validate: () =>
                      getValues("confirmAccountNumber") ===
                        getValues("accountNumber1") ||
                      "Account numbers do not match",
                  }
                : {}
            }
            watch={watch}
            displaylist={displaylist}
            aadharCard={!aadharData}
            key={displaylist?.key ?? ""}
            names={displaylist?.key ?? ""}
            label={displaylist.label}
            accountVerify={displaylist?.accountVerify}
            uploadType={displaylist?.uploadType}
            maxLength={Number(displaylist?.maxLength)}
            type={displaylist.subType}
            isSearchable={displaylist?.isSearchable}
            OptionFocusColor={displaylist?.OptionFocusColor}
            OptionTextColor={displaylist?.OptionTextColor}
            isLoading={isLoading}
            OptionSelectFocusColor={displaylist?.OptionSelectFocusColor}
            OptionSelectColor={displaylist?.OptionSelectColor}
            imageLink={displaylist?.imageLink}
            placeHoldercolor={displaylist?.placeHoldercolor}
            placeHolderSize={displaylist?.placeHolderSize}
            focusErrorBgColor={displaylist?.focusErrorBgColor}
            focusErrorBorderColor={displaylist?.focusErrorBorderColor}
            placeHolder={displaylist?.placeholder}
            validTick={displaylist?.validTick}
            fieldType={displaylist?.fieldType}
            options={dynamicOptions}
            onOptionChange={handleCheckbox}
            staticFetchBtn={displaylist?.staticFetchBtn}
            showToggle={displaylist?.showToggle}
            isOn={isOld}
            toggleDisable={false}
            handleToggle={handleBeneOld}
            onChange={() => {}}
            validation={displaylist?.validation}
            onInput={
              displaylist?.key === "panNumber"
                ? handlePanInput
                : displaylist?.key === "pinCode"
                ? handlePinCodeChangeWrapper
                : undefined
            }
            disableButton={disabledFields}
            onChangeImage={() =>
              displaylist?.key === "attachment"
                ? handleFileUpload()
                : handlePanFileUpload()
            } // for image formData change
            onClick={() =>
              displaylist?.key === "panNumber"
                ? onSubmitForData()
                : handlePennyVerified()
            } // for action fetch button auto fill option if available show or not
            ActionFetch={displaylist?.ActionFetch} // autofetch button show or hide according to api request data
            isFocused={false}
            optionsData={bank}
            fetchData={refetch}
            senderId={senderAccount?.id ?? 0}
            onlyFetchBtn={displaylist?.onlyFetchBtn}
            message={displaylist?.message}
            isPennyDropVerified={pennyDropResult?.isVerified}
            disabled={pennyDropResult?.isVerified}
            txnId={pennyDropResult?.transID}
            registeredName={pennyDropResult?.registeredName}
            reviewTitle={""}
            fields={formList}
            onEdit={(index) => onEdit(index)}
          />
        );
      });
    }

    return null;
  };

  if (isLoading) return <Loader />;

  return (
    <div className=" min-h-0 lg:h-full">
      <FormProvider {...methods}>
        <div
          className={clsx(
            " lg:h-full flex-row gap-8 min-h-0",
            formList?.layout === "horizontallayout" ? "bg-[#F2F2F2]" : "flex"
          )}
        >
          <div
            className={clsx(
              " relative rounded-md",
              formList?.layout === "horizontallayout"
                ? "text-center !mb-5"
                : "w-[20%] !p-10 bg-[#F7F7F7]"
            )}
          >
            {formList?.formType === "multiple" && (
              <div>
                <MultiFormHeader currentIndex={index} formList={formList} />
              </div>
            )}
          </div>

          <div
            className={clsx(
              " relative flex flex-col gap-5 !px-8 !py-10 lg:h-[400px] min-h-0 overflow-y-auto",
              formList?.layout === "horizontallayout"
                ? "lg:mx-10 shadow-xl rounded-md bg-white"
                : "w-[80%]"
            )}
          >
            <div className=" text-start min-h-0 h-full overflow-y-auto">
              {/* {statusName()} */}
              <div
                className="custom-grid"
                style={{
                  gridTemplateColumns: `repeat(${formList?.colGrid ?? 3}, 1fr)`,
                  columnGap: `${formList?.gapCol ?? 20}px`,
                  rowGap: `${formList?.gapRow ?? 40}px`,
                }}
              >
                {render()}
              </div>
              <div className="flex items-center justify-end gap-5 !mt-10">
                {index > 0 && formList?.formType === "multiple" && (
                  <div
                    onClick={() => {
                      setIndex((prev) => prev - 1);
                    }}
                    className=" flex flex-row items-center gap-2 bg-[#5081B9] hover:bg-[#000769] transition-[2000] text-white !px-4 !py-2 rounded cursor-pointer"
                  >
                    <img src={ArrowLeft} className="w-4 h-4" />
                    <p className="">Previous</p>
                  </div>
                )}
                {index < Object.keys(formList?.dataFields).length - 1 ? (
                  formList?.formType === "multiple" && (
                    <div
                      onClick={() => {
                        if (aadharData && !prefetchModalShown) {
                          setShowPrefetchModal(true);
                          setPrefetchModalShown(true);
                        } else {
                          handleNextStepAfterPrefetch();
                        }
                      }}
                      className=" flex flex-row items-center gap-2 bg-[#5081B9] hover:bg-[#000769] transition-[2000] text-white !px-4 !py-2 rounded cursor-pointer"
                    >
                      <p className="">Next</p>
                      <img src={ArrowRight} className="w-4 h-4" />
                    </div>
                  )
                ) : (
                  <button
                    type="submit"
                    className="bg-[#5081B9] hover:bg-[#000769] transition-[2000] text-white !px-4 !py-2 rounded cursor-pointer"
                    title="Submit Now"
                    onClick={() => onSubmitBene()}
                  >
                    Submit
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        <PrefetchDecisionModal
          onReKYC={handleReKYC}
          isOpen={showPrefetchModal}
          onProceed={handleNextStepAfterPrefetch}
          onClose={() => setShowPrefetchModal(false)}
          form="beneficiary"
        />
      </FormProvider>
    </div>
  );
};

export default RegisterBeneficiary;
