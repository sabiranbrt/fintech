/* eslint-disable @typescript-eslint/no-explicit-any */
import { ValidationProps } from "@/types";
import { ValidationRules } from "@/utils/ValidationRegister";
import clsx from "clsx";
import { useState } from "react";
import { Control, Controller, FieldErrors } from "react-hook-form";
import { IoInformationCircleOutline } from "react-icons/io5";
import TruncatedTextWithTooltip from "../truncatedTextwithToolTip";

interface IProp {
  control: Control<any>;
  errors?: FieldErrors<any>;
  names: string;
  chargeSlab?: string;
  rules?: any;
  registeredName?: string;
  txnId?: string;
  maxLength?: number;
  label: string;
  message?: string;
  placeHolder?: string;
  isPennyDropVerified?: boolean;
  disabled?: boolean;
  loading?: boolean;
  inputHeight?: string;
  inputWidth?: string;
  focusShadowColor?: string;
  focusErrorBgColor?: string;
  focusErrorShadowColor?: string;
  ValidClassName?: string;
  ActionFetch?: string;
  placeHolderSize?: string;
  textClassName?: string;
  disablePaste?: boolean;
  focusBorderColor?: string;
  placeHoldercolor?: string;
  focusErrorBorderColor?: string;
  labelClassName?: string;
  InputFocus?: () => void;
  InputBlur?: () => void;
  handleVerifyClick?: () => void;
  readOnly?: boolean;
  validation?: ValidationProps;
  type?: string;
  onChange?: (value: string) => void;
  children?: React.ReactNode;
  fieldType?: string;
  wrapBorder?: boolean;
}

const InputField = ({
  control,
  rules,
  disabled,
  txnId,
  registeredName,
  disablePaste = true,
  errors = {},
  wrapBorder,
  label,
  message,
  chargeSlab,
  isPennyDropVerified,
  loading,
  InputFocus,
  InputBlur,
  handleVerifyClick,
  names,
  ActionFetch,
  placeHolder,
  ValidClassName,
  fieldType,
  type,
  readOnly,
  children,
  focusShadowColor,
  focusBorderColor,
  focusErrorBorderColor,
  maxLength,
  validation,
  focusErrorShadowColor,
  focusErrorBgColor,
  placeHolderSize,
  onChange,
  placeHoldercolor,
  textClassName,
}: IProp) => {
  const [isFocused, setIsFocused] = useState(false);

  const handleFocus = () => {
    setIsFocused(true);
    InputFocus?.();
  };

  const handleBlur = () => {
    setIsFocused(false);
    InputBlur?.();
  };

  return (
    <Controller
      control={control}
      name={names}
      rules={rules ?? ValidationRules(validation)}
      render={({ field }) => {
        return (
          <div className="relative">
            <label className="block text-sm mb-1">
              {label}
              {validation?.required && (
                <span className="text-red-500 ml-0.5">*</span>
              )}
            </label>

            <div className=" relative">
              {children}
              <input
                {...field}
                className={clsx(
                  "w-full p-2 border rounded-lg focus:outline-none",
                  textClassName ? textClassName : "bg-slate-50",
                  `placeholder:text-[${placeHoldercolor}] placeholder:text-[${placeHolderSize}]`,
                  children || wrapBorder
                    ? " pl-8 rounded-lg focus:border-[#14192E] focus:ring-2 focus:ring-[#14192E]/20 transition-all duration-200"
                    : ""
                )}
                data-tooltip-id={`tooltip-${placeHolder}`}
                data-tooltip-content={`${placeHolder}`}
                placeholder={placeHolder}
                onFocus={handleFocus}
                style={{
                  borderColor: errors[names]
                    ? focusErrorBorderColor
                    : isFocused
                    ? focusBorderColor ?? "#5081B9"
                    : "#F2F2F2",
                  backgroundColor: errors[names]
                    ? focusErrorBgColor ?? "#FFF2F2"
                    : !isFocused
                    ? "#F7F7F7"
                    : undefined,
                  boxShadow: errors[names]
                    ? `0 1px 2px 0 ${focusErrorShadowColor}`
                    : isFocused
                    ? `0 1px 2px 0 ${focusShadowColor}`
                    : undefined,
                }}
                maxLength={maxLength}
                onBlur={handleBlur}
                disabled={disabled}
                readOnly={readOnly}
                type={type}
                onChange={(e) => {
                  const value = e.target.value;
                  field.onChange(value);
                  onChange?.(value);
                }}
                onPaste={(e) => {
                  if (disablePaste) {
                    e.preventDefault();
                  }
                }}
                
                onInput={
                  fieldType === "number"
                    ? (e) => {
                        let value = e.currentTarget.value;

                        // Allow only digits
                        value = value.replace(/[^0-9]/g, "");

                        // Ensure the first digit is not 0–5
                        if (value.length > 0 && /^[0-5]/.test(value)) {
                          value = value.slice(1);
                        }

                        // Clear the input if any digit repeats consecutively 6 times
                        if (/(.)\1{5}/.test(value)) {
                          value = "";
                        }

                        e.currentTarget.value = value; // Update visible input
                      }
                    : undefined
                }
              />
            </div>

            {ActionFetch && (
              <>
                {isPennyDropVerified ? (
                  <>
                    <div className="absolute right-12 top-6 mt-1 -mr-8 rounded-md text-xs">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="green"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        className="lucide lucide-check"
                      >
                        <path d="M20 6 9 17l-5-5" />
                      </svg>
                    </div>
                    {txnId && registeredName && (
                      <span className="flex gap-3 text-sm text-secondary mt-1">
                        <TruncatedTextWithTooltip
                          label="Transaction ID:"
                          value={txnId}
                        />
                        <TruncatedTextWithTooltip
                          label="Reg. Name:"
                          value={registeredName}
                        />
                      </span>
                    )}
                  </>
                ) : (
                  <div className="">
                    <button
                      type="button"
                      onClick={handleVerifyClick}
                      className="absolute right-6 top-8 bg-[#5081B9] hover:bg-[#000769] transition-[2000] text-white !py-[2px] !px-2 rounded text-sm cursor-pointer"
                    >
                      {loading ? "Verifying..." : "Click to Verify"}
                    </button>

                    <div className="relative group">
                      <IoInformationCircleOutline className="absolute right-1 -top-7 text-primary text-lg cursor-pointer" />

                      <div className="absolute right-0 bg-gray-100 border border-gray-200 shadow-md rounded-md opacity-0 group-hover:opacity-100 p-2 text-sm transition-opacity duration-300 pointer-events-none group-hover:pointer-events-auto z-20">
                        <h3 className="text-center text-sm font-medium text-gray-700">
                          Charge : ₹ {chargeSlab}
                        </h3>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}

            {message && (
              <span className="text-sm text-primary-light">{`(${message})`}</span>
            )}

            {errors[names] && (
              <div
                className={clsx(
                  "!mt-0.5",
                  ValidClassName ? ValidClassName : "text-[10px] text-[#f94d44]"
                )}
              >
                <p>{errors[names]?.message as string}</p>
              </div>
            )}
          </div>
        );
      }}
    />
  );
};

export default InputField;
