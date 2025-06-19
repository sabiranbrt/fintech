/* eslint-disable @typescript-eslint/no-explicit-any */
import { ValidationProps } from "@/types";
import clsx from "clsx";
import { useState } from "react";
import { Control, Controller, FieldErrors } from "react-hook-form";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { ValidationRules } from "../../utils/ValidationRegister";

interface IProp {
  control: Control<any>;
  errors?: FieldErrors<any>;
  names: string;
  label: string;
  rules: any;
  placeHolder?: string;
  inputHeight?: string;
  inputWidth?: string;
  focusShadowColor?: string;
  focusErrorBgColor?: string;
  focusErrorShadowColor?: string;
  ValidClassName?: string;
  placeHolderSize?: string;
  textClassName?: string;
  focusBorderColor?: string;
  placeHoldercolor?: string;
  fieldType?: string;
  focusErrorBorderColor?: string;
  InputFocus?: () => void;
  InputBlur?: () => void;
  readOnly?: boolean;
  disablePaste?: boolean;
  type?: string;
  validation?: ValidationProps;
}

const PassField = ({
  control,
  errors = {},
  ValidClassName,
  label,
  rules,
  focusShadowColor,
  focusErrorBgColor,
  focusErrorShadowColor,
  textClassName,
  placeHoldercolor,
  focusBorderColor,
  validation,
  disablePaste = true,
  placeHolderSize,
  focusErrorBorderColor,
  names,
  placeHolder,
  fieldType,
  InputFocus,
  InputBlur,
  readOnly,
}: IProp) => {
  const [isFocused, setIsFocused] = useState(false);
  const [isHolding, setIsHolding] = useState(false);

  const handleFocus = () => {
    setIsFocused(true);
    InputFocus?.();
  };

  const handleBlur = () => {
    setIsFocused(false);
    InputBlur?.();
  };

  // const inputType =
  //   fieldType === "password" ? (isHolding ? "password" : "text") : fieldType;
  const inputType = isHolding ? "password" : "text";

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
              <input
                className={clsx(
                  "w-full p-2 border rounded-lg focus:outline-none",
                  isFocused,
                  textClassName ? textClassName : " bg-slate-50",
                  `placeholder:text-[${placeHoldercolor}] placeholder:text-[${placeHolderSize}]`
                )}
                data-tooltip-id={`tooltip-${placeHolder}`}
                data-tooltip-content={`${placeHolder}`}
                defaultValue={field.value}
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
                placeholder={placeHolder}
                readOnly={readOnly}
                onFocus={handleFocus}
                onBlur={handleBlur}
                onPaste={(e) => {
                  if (disablePaste) {
                    e.preventDefault();
                  }
                }}
                disabled={field.value ? readOnly : false}
                type={inputType}
                onChange={(e) => {
                  const value = e.target.value;
                  field.onChange(value);
                }}
                onInput={
                  fieldType === "number"
                    ? (e) => {
                        let value = e.currentTarget.value;
                        // Allow only digits
                        value = value.replace(/[^0-9]/g, "");
                        e.currentTarget.value = value; // Update visible input
                      }
                    : undefined
                }
              />
              <div
                className="absolute top-3 right-3"
                onMouseDown={() => setIsHolding(true)}
                onMouseUp={() => setIsHolding(false)}
                onMouseLeave={() => setIsHolding(false)}
              >
                {isHolding ? <FaEyeSlash /> : <FaEye />}
              </div>
            </div>
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

export default PassField;
