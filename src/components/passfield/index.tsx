import clsx from "clsx";
import { useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { ValidationRules } from "../../utils/ValidationRegister";
import { ValidationProps } from "@/types";

interface IProp {
  names: string;
  label: string;
  isFocused: boolean;
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
  handleFocus: () => void;
  handleBlur: () => void;
  readOnly?: boolean;
  type?: string;
  validation?: ValidationProps;
}

const PassField = ({
  ValidClassName,
  label,
  inputHeight,
  inputWidth,
  focusShadowColor,
  focusErrorBgColor,
  focusErrorShadowColor,
  textClassName,
  placeHoldercolor,
  focusBorderColor,
  validation,
  placeHolderSize,
  focusErrorBorderColor,
  names,
  fieldType,
  isFocused,
  placeHolder,
  handleFocus,
  handleBlur,
  readOnly,
}: IProp) => {
  const {
    control,
    formState: { errors },
  } = useFormContext();
  const [isHolding, setIsHolding] = useState(false);

  const inputType =
    fieldType === "password" ? (isHolding ? "password" : "text") : fieldType;

  return (
    <Controller
      control={control}
      name={names}
      rules={ValidationRules(validation)}
      render={({ field }) => {
        return (
          <div className="relative">
            <label className="block text-sm">
              {label}
              <span className="text-red-500">*</span>
            </label>
            <input
              className={clsx(
                `outline-0 !py-${inputHeight} !px-${inputWidth} md:!p-2 sm:!p-2`,
                textClassName
                  ? textClassName
                  : "bg-[#F7F7F7] !px-2 !py-3 rounded-sm border border-[#F2F2F2]",
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
              placeholder={!isFocused ? placeHolder : ""}
              readOnly={readOnly}
              onFocus={handleFocus}
              onBlur={handleBlur}
              disabled={field.value ? readOnly : false}
              type={inputType}
              onChange={(e) => {
                const value = e.target.value;
                field.onChange(value);
              }}
            />
            <div
              className="absolute top-3 right-3"
              onMouseDown={() => setIsHolding(true)}
              onMouseUp={() => setIsHolding(false)}
              onMouseLeave={() => setIsHolding(false)}
            >
              {isHolding ? <FaEyeSlash /> : <FaEye />}
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
