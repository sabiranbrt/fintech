/* eslint-disable react-hooks/exhaustive-deps */
import CustomField from "@/components/multiForm/CustomField";
import MultiFormHeader from "@/components/multiForm/multiFormHeader";
import { useDynamicMutation, useDynamicQuery } from "@/hooks/dynamicQuery";
import { usePan, usePinCode, useSessionInit } from "@/hooks/service";
import formList from "@/jsonDemo/structure.json";
import { RootState } from "@/redux/store";
import { getDynamicRequest } from "@/utils/dynamicRequest";
import ArrowLeft from "@assets/icons/arrowLeft.svg";
import ArrowRight from "@assets/icons/arrowRight.svg";
import clsx from "clsx";
import { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

interface PennyDropResult {
  registeredName?: string;
  transID?: string;
  accountNo?: string;
  ifsc?: string;
  status?: string;
  isVerified?: boolean;
}

const RegisterBeneficiary = () => {
  const [token, setToken] = useState("");
  const [district, setDistrict] = useState<TODO>([]);
  const [state, setState] = useState<TODO>([]);
  const { mutateAsync: pennyDropMutant } = useDynamicMutation<TODO>();

  const [pennyDropResult, setPennyDropResult] =
    useState<PennyDropResult | null>(null);

  const [index, setIndex] = useState(0);

  const methods = useForm<TODO>({
    mode: "onChange",
  });

  const { trigger, watch, getValues, setValue } = methods;
  const pan = watch("panNumber");
  const mobileNumber = watch("senderMobileNumber");
  const bankDetails = watch("bankName");
  const ifscValue = watch("ifsc");
  const [pinCodeValue, tempPinCodeValue] = watch(["pinCode", "tempPinCode"]);

  const { endpoints } = useSelector((state: RootState) => state.endPoints);
  const { selectedService } = useSelector((state: RootState) => state.service);

  const stepName = selectedService?.sequence?.[1];
  const pennyDropName = selectedService?.sequence?.find(
    (item) => item === "getPennyDrop"
  );

  const request = getDynamicRequest(stepName ?? "", endpoints ?? {});

  const { data, refetch } = useDynamicQuery<TODO>(request!, {
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

  const bank = data?.apiResponseData?.data;

  const { sender } = useSelector((state: RootState) => state.senderData);
  const [hasInputError, setHasInputError] = useState(false);

  useEffect(() => {
    if (bankDetails?.ifsc) {
      setValue("ifsc", bankDetails?.ifsc);
    }
  }, [bankDetails?.ifsc, ifscValue]);

  const { mutateAsync } = usePan();

  useEffect(() => {
    setValue("senderMobileNumber", sender?.mobileNumber);
  }, [sender?.mobileNumber, setValue]);

  const onSubmitForData = async () => {
    try {
      const response = await mutateAsync({ pan: pan, mobile: mobileNumber });
      const data = response?.apiResponseData?.data;
      setValue("firstName", data?.firstName);
      setValue("lastName", data?.lastName);
      setValue("middleName", data?.middleName);
      setValue("dob", data?.dob);
      setValue("gender", data?.gender);
    } catch (err) {
      console.log("Error", err);
    }
  };

  const handlePanInput = (e: React.FormEvent<HTMLInputElement>) => {
    const value = e.currentTarget.value.toUpperCase();
    if (sender?.pan && value.toUpperCase() === sender.pan.toUpperCase()) {
      toast.error("Sender And Beneficiary Pan Number Cannot Be Same");
      setHasInputError(true);
    } else {
      setHasInputError(false);
    }
  };

  const handlePennyVerified = async () => {
    if (!requestPennyDrop) return;
    try {
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

  const { data: pinCode } = usePinCode(
    pinCodeValue ? { token, values: pinCodeValue } : { token: "", values: "" }
  );

  const handlePinCodeChangeWrapper = async () => {
    const sessionResult = await refetchSession();

    const fetchedToken =
      sessionResult.data?.apiResponseData?.responseData?.token;

    if (!fetchedToken) {
      toast.error("Token not received from session API");
      return;
    }

    localStorage.setItem("access_token", fetchedToken);
    setToken(fetchedToken);
    const codeToUse =
      tempPinCodeValue?.length === 6 ? tempPinCodeValue : pinCodeValue;
    if (codeToUse) {
      try {
        const response = pinCode;
        if (
          response?.apiResponseCode == "200" &&
          response?.apiResponseData?.responseCode == "200"
        ) {
          const parsedData = response?.apiResponseData?.responseData;

          const postOffices = parsedData?.PostOffice;
          if (postOffices && postOffices.length > 0) {
            const districtNames = [
              ...new Set(postOffices.map((p: TODO) => p.District)),
            ];
            const stateNames = [
              ...new Set(postOffices.map((p: TODO) => p.State)),
            ];
            const cityNames = [
              ...new Set(postOffices.map((p: TODO) => p.Region)),
            ];

            setDistrict(districtNames);
            setState(stateNames);
            setValue("permanentCity", cityNames);
            setValue("permanentState", stateNames);
            setValue("permanentDistrict", districtNames);
          } else {
            const errorMessage =
              parsedData?.Message || "Could not load location data";
            console.log("error", errorMessage);
            toast.error(errorMessage);
          }
        } else {
          console.log("error");
          toast.error("Could not load data");
        }
      } catch (error) {
        console.error("Error fetching districts:", error);
      }
    }
  };

  const handleCheckbox = () => {
    const selected = getValues("sameAsPermanent");
    if (selected && selected.length > 0) {
      const perCity = getValues("permanentCity");
      const perDistrict = getValues("permanentDistrict");
      const perState = getValues("permanentState");

      setValue("tempPinCode", pinCodeValue);
      setValue("tempCity", perCity ?? "");
      setValue("tempDistrict", perDistrict ?? "");
      setValue("tempState", perState ?? "");
    } else {
      setValue("tempPinCode", "");
      setValue("tempCity", "");
      setValue("tempDistrict", "");
      setValue("tempState", "");
    }
  };

  const render = () => {
    const stepKeys = Object.keys(formList?.dataFields) as Array<
      keyof typeof formList.dataFields
    >;
    const currentKey = stepKeys[index];
    const currentStep = formList.dataFields[currentKey];

    if (!Array.isArray(currentStep)) {
      // const fields =
      //   currentStep?.displayField
      //     ?.filter((f: TODO) => f?.key && f?.label)
      //     .map((f: TODO) => ({
      //       key: f.key,
      //       label: f.label,
      //     })) ?? [];
      return currentStep?.displayField?.map((displaylist: TODO) => {
        // Dynamically assign options for district, state, city
        let dynamicOptions: Array<{ label: string; value: string }> = [];

        // Dynamically set select options
        if (displaylist.fieldType === "dropdown") {
          switch (displaylist.key) {
            case "permanentDistrict":
              dynamicOptions = district.map((item: string) => ({
                label: item,
                value: item,
              }));
              break;
            case "permanentState":
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
            watch={watch}
            displaylist={displaylist}
            key={displaylist?.key ?? ""}
            names={displaylist?.key ?? ""}
            label={displaylist.label}
            type={displaylist.subType}
            isSearchable={displaylist?.isSearchable}
            OptionFocusColor={displaylist?.OptionFocusColor}
            OptionTextColor={displaylist?.OptionTextColor}
            OptionSelectFocusColor={displaylist?.OptionSelectFocusColor}
            OptionSelectColor={displaylist?.OptionSelectColor}
            imageLink={displaylist?.imageLink}
            placeHoldercolor={displaylist?.placeHoldercolor}
            placeHolderSize={displaylist?.placeHolderSize}
            focusErrorBgColor={displaylist?.focusErrorBgColor}
            focusErrorBorderColor={displaylist?.focusErrorBorderColor}
            placeHolder={displaylist?.placeholder}
            fieldType={displaylist?.fieldType}
            options={dynamicOptions}
            onOptionChange={handleCheckbox}
            validation={displaylist?.validation}
            onInput={
              displaylist?.key === "panNumber"
                ? handlePanInput
                : handlePinCodeChangeWrapper
            }
            disableButton={hasInputError}
            onChangeImage={() => {}} // for image formData change
            onClick={() =>
              displaylist?.key === "panNumber"
                ? onSubmitForData()
                : handlePennyVerified()
            } // for action fetch button auto fill option if available show or not
            ActionFetch={displaylist?.ActionFetch} // autofetch button show or hide according to api request data
            isFocused={false}
            optionsData={bank}
            fetchData={refetch}
            onlyFetchBtn={displaylist?.onlyFetchBtn}
            message={displaylist?.message}
            isPennyDropVerified={pennyDropResult?.isVerified}
            disabled={pennyDropResult?.isVerified}
            txnId={pennyDropResult?.transID}
            registeredName={pennyDropResult?.registeredName}
            reviewTitle={""}
            fields={formList}
          />
        );
      });
    }

    return null;
  };

  return (
    <div className=" min-h-0 h-full">
      <FormProvider {...methods}>
        <div
          className={clsx(
            " h-full flex-row gap-8 min-h-0",
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
              " relative flex flex-col gap-5 !px-8 !py-10 h-[491px] min-h-0 overflow-y-auto",
              formList?.layout === "horizontallayout"
                ? "!mx-10 shadow-xl rounded-md bg-white"
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
                      onClick={async () => {
                        const fieldsToValidate = getCurrentStepFieldNames();
                        const isStepValid = await trigger(fieldsToValidate);
                        if (isStepValid) {
                          setIndex((prev) => prev + 1);
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
                    onClick={() => {}}
                  >
                    Submit
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </FormProvider>
    </div>
  );
};

export default RegisterBeneficiary;
