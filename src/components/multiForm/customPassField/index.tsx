import { FieldTypes, ValidationProps } from "@/types";
import { ValidationRules } from "@/utils/ValidationRegister";
import clsx from "clsx";
import { useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { FaEye, FaEyeSlash } from "react-icons/fa";

interface IProp {
  names: string;
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
  textSecurity?: string;
  focusBorderColor?: string;
  placeHoldercolor?: string;
  fieldType: string;
  focusErrorBorderColor?: string;
  handleFocus: () => void;
  handleBlur: () => void;
  readOnly?: boolean;
  type?: string;
  validation?: ValidationProps;
}

const CustomPassField = ({
  ValidClassName,
  inputHeight,
  inputWidth,
  focusShadowColor,
  focusErrorBgColor,
  focusErrorShadowColor,
  textClassName,
  placeHoldercolor,
  focusBorderColor,
  placeHolderSize,
  textSecurity = "$",
  validation,
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
  const [realValue, setRealValue] = useState("");
  const [tooglePassword, setTogglePassword] = useState(false);

  const inputType =
    fieldType === "password"
      ? tooglePassword
        ? "password"
        : "text"
      : fieldType;
  return (
    <Controller
      control={control}
      name={names}
      rules={ValidationRules(validation)}
      render={({ field }) => {
        return (
          <div className="relative">
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
              onFocus={handleFocus}
              onBlur={handleBlur}
              value={
                !tooglePassword
                  ? textSecurity.repeat(realValue.length)
                  : realValue
              }
              disabled={field.value ? readOnly : false}
              type={inputType}
              onChange={(e) => {
                const input = e.target.value;
                const prevLength = realValue.length;
                const inputLength = input.length;

                if (inputLength < prevLength) {
                  setRealValue(realValue.slice(0, inputLength));
                  field.onChange(realValue.slice(0, inputLength));
                } else {
                  const addedChar = input[input.length - 1];
                  const newValue = realValue + addedChar;
                  setRealValue(newValue);
                  field.onChange(newValue);
                }
              }}
            />
            {fieldType === FieldTypes?.CUSTOMPASS && (
              <div
                className="absolute top-3 right-3"
                onClick={() => setTogglePassword(!tooglePassword)}
              >
                {tooglePassword ? <FaEyeSlash /> : <FaEye />}
              </div>
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

export default CustomPassField;
