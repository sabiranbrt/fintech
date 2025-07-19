import clsx from "clsx";
import { useState } from "react";
import Label from "./label";
import { Tooltip } from "react-tooltip";
import InputField from "./inputfield";
import SelectField from "./selectfield";
import TextArea from "./textArea";
import Preview from "./preview";
import PassField from "./passfield";
import CheckBox from "./checkbox";
import RadioButton from "./radioButton";
import FileField from "./fileField";
import CustomPassField from "./customPassField";
import { FieldTypes, ValidationProps } from "@/types";
import { useFormContext, UseFormWatch } from "react-hook-form";
import SelectCusOpt from "./selectCusOpt";
import DatePickers from "../datePicker";
import ReviewSection from "./review";
import { RootState } from "@/redux/store";
import { useSelector } from "react-redux";
import { PDFViewer } from "../pdfViewer";

interface Options {
  label: string;
  value: string;
  default?: boolean;
}

interface IProps {
  watch: UseFormWatch<TODO>;
  displaylist: TODO;
  rules?: TODO;
  names: string;
  isPennyDropVerified?: boolean;
  chargeSlab?: string;
  registeredName?: string;
  txnId?: string;
  value?: string;
  accountVerify?: boolean;
  ValidClassName?: string;
  senderId?: number;
  isSearchable?: boolean;
  readOnly?: boolean;
  onlyFetchBtn?: boolean;
  message?: string;
  type?: string;
  maxFile?: number;
  uploadType?: string;
  OptionSelectColor?: string;
  OptionFocusColor?: string;
  OptionTextColor?: string;
  disableButton?: boolean;
  UploadIcon?: string;
  FileIcon?: string;
  CrossIcon?: string;
  isFocused: boolean;
  staticFetchBtn?: boolean;
  showToggle?: boolean;
  isLoading?: boolean;
  isOn?: boolean;
  toggleDisable?: boolean;
  handleToggle: () => void;
  validTick?: boolean;
  loading?: boolean;
  aadharCard?: boolean;
  placeHolder?: string;
  placeHolderSize?: string;
  focusBorderColor?: string;
  placeHoldercolor?: string;
  focusShadowColor?: string;
  optionsData: TODO[];
  OptionSelectFocusColor?: string;
  focusErrorBorderColor?: string;
  focusErrorBgColor?: string;
  focusErrorShadowColor?: string;
  label: string;
  inputHeight?: string;
  inputWidth?: string;
  placeHolderStyle?: string;
  imageLink: string;
  disabled?: boolean;
  maxLength?: number;
  onOptionChange?: () => void;
  onChange?: (text: React.ChangeEvent<HTMLInputElement>) => void;
  onChangeImage?: (value: string) => void;
  onChangeArea?: (text: React.ChangeEvent<HTMLTextAreaElement>) => void;
  labelClassName?: string;
  nonlabelClassName?: string;
  textClassName?: string;
  fieldType: string;
  options?: Options[];
  onEdit: (index: string) => void;
  validation?: ValidationProps;
  textSecurity?: string;
  fetchData?: TODO;
  ActionFetch?: string;
  onClick?: () => void;
  onInput?: (e: React.FormEvent<HTMLInputElement>) => void;
  reviewTitle: string;
  fields: TODO;
}

const CustomField = ({
  names,
  isPennyDropVerified,
  txnId,
  registeredName,
  message,
  inputHeight = "10",
  inputWidth = "10",
  placeHolder,
  validTick,
  loading,
  staticFetchBtn,
  onEdit,
  showToggle,
  isOn,
  accountVerify,
  toggleDisable,
  handleToggle,
  onlyFetchBtn,
  ValidClassName,
  uploadType,
  OptionSelectColor = "#5081B9",
  OptionSelectFocusColor = "#5081B9",
  isSearchable,
  fetchData,
  rules,
  UploadIcon,
  isLoading,
  optionsData,
  maxLength,
  fields,
  onChangeImage,
  onClick,
  OptionFocusColor = "#fff",
  readOnly,
  maxFile = 1,
  CrossIcon,
  FileIcon,
  ActionFetch,
  imageLink,
  senderId,
  label,
  focusErrorBorderColor = "#f94d44",
  validation,
  labelClassName,
  nonlabelClassName,
  placeHolderSize,
  aadharCard,
  placeHoldercolor,
  OptionTextColor = "#000",
  focusBorderColor,
  focusShadowColor = "#F2F2F2",
  focusErrorBgColor,
  focusErrorShadowColor = "#F2F2F2",
  textClassName,
  disableButton,
  type,
  watch,
  onOptionChange,
  fieldType,
  textSecurity = "&",
  onInput,
  options = [],
}: IProps) => {
  const aadharData = useSelector((state: RootState) => state.kyc.kyc);

  const [isFocused, setIsFocused] = useState(false);
  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  const showFloatingLabel =
    fieldType !== FieldTypes.RADIOBUTTON &&
    fieldType !== FieldTypes.CHECKBOX &&
    fieldType !== FieldTypes.FILE &&
    fieldType !== FieldTypes.PREVIEW;

  const { getValues } = useFormContext();
  const currentValue = getValues(names);

  const generateReviewSections = () => {
    const stepKeys = Object.keys(fields?.dataFields).slice(0, -1);
    return stepKeys.map((key) => {
      const stepKey = key as keyof typeof fields.dataFields;
      const currentStep = fields.dataFields[stepKey];

      if (!Array.isArray(currentStep) && currentStep?.displayField) {
        const reviewFields =
          currentStep.displayField
            .filter((field: TODO) => field?.key && field?.label)
            .map((field: TODO) => {
              const key = field.key;
              const rawValue = key ? watch(key) : undefined;

              return {
                label: field.label,
                value:
                  rawValue === undefined || rawValue === ""
                    ? "-"
                    : Array.isArray(rawValue)
                    ? rawValue.join(", ")
                    : typeof rawValue === "object" && rawValue !== null
                    ? rawValue.bankName || rawValue.path || "-"
                    : String(rawValue),
              };
            }) ?? [];

        return (
          <ReviewSection
            title={currentStep.status}
            fields={reviewFields}
            onEdit={() => onEdit(stepKey as TODO)}
          >
            {aadharData?.panExtractedDetails?.maskedAadhaar && (
              <div>
                <p className="text-sm text-gray-600">Aadhaar Number</p>
                <p className="font-medium">{watch("maskedAadhaarNo")}</p>
              </div>
            )}

            {aadharData?.panExtractedDetails?.mobileNumber && (
              <div>
                <p className="text-sm text-gray-600">
                  Mobile Number From Aadhaar
                </p>
                <p className="font-medium">{watch("maskedMobile")}</p>
              </div>
            )}
            {aadharData && (
              <>
                {/* AAdhar Information Review */}
                <div className="mb-8">
                  <div className="flex items-center gap-2 mb-4 border-b pb-2">
                    <h3 className="text-lg font-medium text-primary-dark">
                      Aadhaar and PAN Documents
                    </h3>
                  </div>
                  <div className="flex gap-72">
                    <div className="">
                      {/* Aadhaar Image (only if registerByAadhar is true) */}
                      {aadharData && aadharData?.digilockerFiles?.aadharPdf && (
                        <div>
                          <p className="text-sm text-gray-600">
                            Aadhaar Document
                          </p>
                          <div className="mt-2">
                            <PDFViewer
                              pdfUrl={aadharData?.digilockerFiles?.aadharPdf}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="">
                      {/* Aadhaar Image (only if registerByAadhar is true) */}
                      {aadharData && aadharData?.digilockerFiles?.panPdf && (
                        <div>
                          <p className="text-sm text-gray-600">PAN Document</p>
                          <div className="mt-2">
                            <PDFViewer
                              pdfUrl={aadharData?.digilockerFiles?.panPdf}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                {/*    <div className="mb-8">
                              <div className="flex items-center gap-2 mb-4 border-b pb-2">
                                <h3 className="text-lg font-medium text-primary-dark">
                                  PAN Information
                                </h3>
                              </div>
                            
                            </div> */}
                {aadharData && (
                  <div className="mb-8">
                    <h3 className="text-lg font-medium mb-2 border-b pb-2 text-primary-dark">
                      Image Information
                    </h3>
                    <div className="flex gap-16 justify-center items-center">
                      <div>
                        <p className="text-sm text-gray-600">Profile Image</p>
                        {aadharData?.digilockerAdhar?.photo ? (
                          <div className="mt-2">
                            <img
                              // src={URL.createObjectURL(aadharData?.digilockerAdhar?.photo)}
                              alt="Profile Preview"
                              className="h-80 w-80 rounded-md object-cover cursor-pointer"
                              // onClick={() =>
                              //   setSelectedImage(
                              //     URL.createObjectURL(aadharData)
                              //   ) || openModal()
                              // }
                            />
                          </div>
                        ) : (
                          <p className="font-medium">-</p>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </ReviewSection>
        );
      }

      return null;
    });
  };

  return (
    <div className=" text-start">
      <div className={clsx("relative mt-3")}>
        {showFloatingLabel && (isFocused || !!currentValue) && (
          <label
            htmlFor={label}
            className={clsx("absolute -top-4 left-2 z-30")}
            data-tooltip-id={`tooltip-${label}`}
            data-tooltip-content={`${label}`}
          >
            <Label label={label} labelClassName={labelClassName ?? ""} />
          </label>
        )}
        {fieldType === FieldTypes?.CHECKBOX ||
        fieldType === FieldTypes?.RADIOBUTTON ||
        fieldType === FieldTypes?.FILE ||
        fieldType === FieldTypes?.PREVIEW ? (
          <div className={clsx(" !mb-3")}>
            <Label
              label={label ?? ""}
              labelClassName={nonlabelClassName ?? "text-gray-500 font-bold"}
            />
          </div>
        ) : null}
        {fieldType === FieldTypes?.TEXTFIELD ? (
          <InputField
            names={names}
            rules={rules}
            accountVerify={accountVerify}
            isFocused={isFocused}
            handleBlur={handleBlur}
            handleFocus={handleFocus}
            placeHolder={placeHolder}
            maxLength={maxLength}
            inputHeight={inputHeight}
            aadharCard={aadharCard}
            inputWidth={inputWidth}
            focusShadowColor={focusShadowColor}
            focusErrorBgColor={focusErrorBgColor}
            focusErrorShadowColor={focusErrorShadowColor}
            ValidClassName={ValidClassName}
            ActionFetch={ActionFetch}
            placeHolderSize={placeHolderSize}
            textClassName={textClassName}
            focusBorderColor={focusBorderColor}
            placeHoldercolor={placeHoldercolor}
            focusErrorBorderColor={focusErrorBorderColor}
            labelClassName={labelClassName}
            staticFetchBtn={staticFetchBtn}
            validTick={validTick}
            senderId={senderId}
            validation={validation}
            onClick={onClick}
            readOnly={readOnly}
            type={type}
            onInput={onInput}
            disableButton={disableButton}
            txnId={txnId}
            isPennyDropVerified={isPennyDropVerified}
            registeredName={registeredName}
            message={message}
            loading={loading}
            onlyFetchBtn={onlyFetchBtn}
          />
        ) : fieldType === FieldTypes?.SELECTFIELD ? (
          <SelectField
            names={names}
            options={options}
            isFocused={isFocused}
            handleBlur={handleBlur}
            handleFocus={handleFocus}
            placeHolder={placeHolder}
            isSearchable={isSearchable}
            inputHeight={inputHeight}
            disableButton={disableButton}
            inputWidth={inputWidth}
            focusShadowColor={focusShadowColor}
            focusErrorBgColor={focusErrorBgColor}
            focusErrorShadowColor={focusErrorShadowColor}
            ValidClassName={ValidClassName}
            placeHolderSize={placeHolderSize}
            focusBorderColor={focusBorderColor}
            placeHoldercolor={placeHoldercolor}
            focusErrorBorderColor={focusErrorBorderColor}
            validation={validation}
            readOnly={readOnly}
            OptionSelectFocusColor={OptionSelectFocusColor}
            OptionTextColor={OptionTextColor}
            OptionFocusColor={OptionFocusColor}
            OptionSelectColor={OptionSelectColor}
            type={type}
          />
        ) : fieldType === FieldTypes?.TEXTAREA ? (
          <TextArea
            names={names}
            isFocused={isFocused}
            handleBlur={handleBlur}
            handleFocus={handleFocus}
            placeHolder={placeHolder}
            inputHeight={inputHeight}
            inputWidth={inputWidth}
            focusShadowColor={focusShadowColor}
            focusErrorBgColor={focusErrorBgColor}
            focusErrorShadowColor={focusErrorShadowColor}
            ValidClassName={ValidClassName}
            placeHolderSize={placeHolderSize}
            textClassName={textClassName}
            focusBorderColor={focusBorderColor}
            placeHoldercolor={placeHoldercolor}
            focusErrorBorderColor={focusErrorBorderColor}
            labelClassName={labelClassName}
            validation={validation}
            readOnly={readOnly}
            type={type}
          />
        ) : fieldType === FieldTypes?.CHECKBOX ? (
          <CheckBox
            names={names}
            options={options}
            ValidClassName={ValidClassName}
            labelClassName={labelClassName}
            validation={validation}
            onOptionChange={onOptionChange}
          />
        ) : fieldType === FieldTypes?.RADIOBUTTON ? (
          <RadioButton
            names={names}
            options={options}
            validation={validation}
            labelClassName={labelClassName}
            ValidClassName={ValidClassName}
          />
        ) : fieldType === FieldTypes?.PASSFIELD ? (
          <PassField
            names={names}
            isFocused={isFocused}
            handleBlur={handleBlur}
            handleFocus={handleFocus}
            placeHolder={placeHolder}
            inputHeight={inputHeight}
            inputWidth={inputWidth}
            focusShadowColor={focusShadowColor}
            focusErrorBgColor={focusErrorBgColor}
            focusErrorShadowColor={focusErrorShadowColor}
            ValidClassName={ValidClassName}
            placeHolderSize={placeHolderSize}
            textClassName={textClassName}
            focusBorderColor={focusBorderColor}
            placeHoldercolor={placeHoldercolor}
            focusErrorBorderColor={focusErrorBorderColor}
            validation={validation}
            readOnly={readOnly}
            type={type}
            fieldType={fieldType}
          />
        ) : fieldType === FieldTypes?.FILE ? (
          <FileField
            names={names}
            maxFile={maxFile}
            uploadType={uploadType}
            FileIcon={FileIcon}
            CrossIcon={CrossIcon}
            UploadIcon={UploadIcon}
            onChangeImage={onChangeImage}
          />
        ) : fieldType === FieldTypes?.CUSTOMPASS ? (
          <CustomPassField
            names={names}
            isFocused={isFocused}
            handleBlur={handleBlur}
            handleFocus={handleFocus}
            placeHolder={placeHolder}
            inputHeight={inputHeight}
            inputWidth={inputWidth}
            focusShadowColor={focusShadowColor}
            focusErrorBgColor={focusErrorBgColor}
            focusErrorShadowColor={focusErrorShadowColor}
            ValidClassName={ValidClassName}
            placeHolderSize={placeHolderSize}
            textClassName={textClassName}
            focusBorderColor={focusBorderColor}
            placeHoldercolor={placeHoldercolor}
            focusErrorBorderColor={focusErrorBorderColor}
            validation={validation}
            readOnly={readOnly}
            textSecurity={textSecurity}
            type={type}
            fieldType={fieldType}
          />
        ) : fieldType === FieldTypes?.MULTISELECT ? (
          <SelectField
            names={names}
            options={options}
            isFocused={isFocused}
            handleBlur={handleBlur}
            handleFocus={handleFocus}
            placeHolder={placeHolder}
            isSearchable={isSearchable}
            inputHeight={inputHeight}
            inputWidth={inputWidth}
            focusShadowColor={focusShadowColor}
            focusErrorBgColor={focusErrorBgColor}
            focusErrorShadowColor={focusErrorShadowColor}
            ValidClassName={ValidClassName}
            placeHolderSize={placeHolderSize}
            focusBorderColor={focusBorderColor}
            placeHoldercolor={placeHoldercolor}
            focusErrorBorderColor={focusErrorBorderColor}
            validation={validation}
            readOnly={readOnly}
            OptionSelectFocusColor={OptionSelectFocusColor}
            OptionTextColor={OptionTextColor}
            OptionFocusColor={OptionFocusColor}
            OptionSelectColor={OptionSelectColor}
            type={type}
            isMulti={true}
          />
        ) : fieldType === FieldTypes?.PREVIEW ? (
          <Preview names={names} imageLink={imageLink} />
        ) : fieldType === FieldTypes?.SELECTCUSFIELD ? (
          <SelectCusOpt
            names={names}
            optionsData={optionsData}
            isFocused={isFocused}
            handleBlur={handleBlur}
            handleFocus={handleFocus}
            isLoading={isLoading}
            placeHolder={placeHolder}
            showToggle={showToggle}
            isOn={isOn}
            toggleDisable={toggleDisable}
            handleToggle={handleToggle}
            inputHeight={inputHeight}
            inputWidth={inputWidth}
            focusShadowColor={focusShadowColor}
            focusErrorBgColor={focusErrorBgColor}
            focusErrorShadowColor={focusErrorShadowColor}
            ValidClassName={ValidClassName}
            placeHolderSize={placeHolderSize}
            focusBorderColor={focusBorderColor}
            placeHoldercolor={placeHoldercolor}
            focusErrorBorderColor={focusErrorBorderColor}
            validation={validation}
            readOnly={readOnly}
            OptionSelectFocusColor={OptionSelectFocusColor}
            OptionTextColor={OptionTextColor}
            OptionFocusColor={OptionFocusColor}
            OptionSelectColor={OptionSelectColor}
            type={type}
            label={label}
            fetchData={fetchData}
          />
        ) : fieldType === FieldTypes?.DATEPICKER ? (
          <DatePickers
            names={names}
            isFocused={isFocused}
            handleBlur={handleBlur}
            disableButton={disableButton}
            handleFocus={handleFocus}
            placeHolder={placeHolder}
            inputHeight={inputHeight}
            inputWidth={inputWidth}
            focusShadowColor={focusShadowColor}
            focusErrorBgColor={focusErrorBgColor}
            focusErrorShadowColor={focusErrorShadowColor}
            ValidClassName={ValidClassName}
            ActionFetch={ActionFetch}
            placeHolderSize={placeHolderSize}
            textClassName={textClassName}
            focusBorderColor={focusBorderColor}
            placeHoldercolor={placeHoldercolor}
            focusErrorBorderColor={focusErrorBorderColor}
            labelClassName={labelClassName}
            validation={validation}
          />
        ) : fieldType === FieldTypes?.REVIEW ? (
          <>{generateReviewSections()}</>
        ) : null}
      </div>
      <Tooltip id={`tooltip-${label}`} place="top" />
      {!isFocused ? (
        <Tooltip id={`tooltip-${placeHolder}`} place="top" />
      ) : null}
    </div>
  );
};

export default CustomField;
