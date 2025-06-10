/* eslint-disable @typescript-eslint/no-explicit-any */
import { FieldTypes, ValidationProps } from "@/types";
import clsx from "clsx";
import { useState } from "react";
import Label from "./label";
import InputField from "./inputfield";
import SelectField from "./selectfield";

interface Options {
  label: string;
  value: string;
  default: boolean;
}

interface IProps {
  names: string;
  value?: string;
  ValidClassName?: string;
  isSearchable?: boolean;
  readOnly?: boolean;
  type?: string;
  maxFile?: number;
  uploadType?: string;
  OptionSelectColor?: string;
  OptionFocusColor?: string;
  OptionTextColor?: string;
  UploadIcon?: string;
  FileIcon?: string;
  CrossIcon?: string;
  placeHolder?: string;
  placeHolderSize?: string;
  focusBorderColor?: string;
  placeHoldercolor?: string;
  focusShadowColor?: string;
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
  onChange?: (text: React.ChangeEvent<HTMLInputElement>) => void;
  onChangeImage?: (value: string) => void;
  onChangeArea?: (text: React.ChangeEvent<HTMLTextAreaElement>) => void;
  labelClassName?: string;
  nonlabelClassName?: string;
  textClassName?: string;
  fieldType: string;
  options?: Options[];
  validation?: ValidationProps;
  textSecurity?: string;
  ActionFetch?: string;
  onClick?: () => void;
}

const CustomField = ({
  names,
  inputHeight = "10",
  inputWidth = "10",
  placeHolder,
  ValidClassName,
  uploadType,
  OptionSelectColor = "#5081B9",
  OptionSelectFocusColor = "#5081B9",
  isSearchable,
  UploadIcon,
  onChangeImage,
  onClick,
  OptionFocusColor = "#fff",
  readOnly,
  maxFile = 1,
  CrossIcon,
  FileIcon,
  ActionFetch,
  imageLink,
  label,
  focusErrorBorderColor = "#f94d44",
  validation,
  labelClassName,
  nonlabelClassName,
  placeHolderSize,
  placeHoldercolor,
  OptionTextColor = "#000",
  focusBorderColor,
  focusShadowColor = "#F2F2F2",
  focusErrorBgColor,
  focusErrorShadowColor = "#F2F2F2",
  textClassName,
  type,
  fieldType,
  textSecurity = "&",
  options = [],
}: IProps) => {
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

  return (
    <div>
      <div className=" text-start">
        <div className={clsx("relative")}>
          {showFloatingLabel && isFocused && (
            <label
              htmlFor={label}
              className={clsx("absolute -top-2.5 left-2 z-[9] ")}
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
              ActionFetch={ActionFetch}
              placeHolderSize={placeHolderSize}
              textClassName={textClassName}
              focusBorderColor={focusBorderColor}
              placeHoldercolor={placeHoldercolor}
              focusErrorBorderColor={focusErrorBorderColor}
              labelClassName={labelClassName}
              validation={validation}
              onClick={onClick}
              readOnly={readOnly}
              type={type}
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
          ) : null}
        </div>
      </div>
      <Tooltip id={`tooltip-${label}`} place="top" />
      {!isFocused ? (
        <Tooltip id={`tooltip-${placeHolder}`} place="top" />
      ) : null}
    </div>
  );
};

export default CustomField;
