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
  rules?: any;
  label: string;
  onPaste?: (e: React.ClipboardEvent<HTMLInputElement>) => void;
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
  fieldType?: string;
  focusErrorBorderColor?: string;
  InputFocus?: () => void;
  InputBlur?: () => void;
  readOnly?: boolean;
  onChange?: (value: string) => void;
  type?: string;
  validation?: ValidationProps;
}

const CustomPassField = ({
  control,
  label,
  errors = {},
  rules,
  ValidClassName,
  focusShadowColor,
  focusErrorBgColor,
  focusErrorShadowColor,
  onChange,
  textClassName,
  placeHoldercolor,
  focusBorderColor,
  fieldType = "text",
  placeHolderSize,
  textSecurity = "X",
  validation,
  focusErrorBorderColor,
  names,
  onPaste,
  placeHolder,
  InputFocus,
  InputBlur,
  readOnly,
}: IProp) => {
  const [realValue, setRealValue] = useState("");
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

  const formatAccountNumber = (value: string, show: boolean) => {
    if (!value) return "";
    const cleaned = value.replace(/\D/g, "");
    const match = cleaned.match(/^(\d{0,4})(\d{0,4})(\d{0,4})(\d{0,4})$/);
    if (!match) return "";
    const groups = [match[1], match[2], match[3], match[4]].filter(Boolean);
    let formatted = groups.join(" ");
    if (!show) {
      const last4 = groups[groups.length - 1] || "";
      formatted = formatted.replace(/\d/g, (match, index) =>
        index >= formatted.length - last4.length ? match : "X"
      );
    }
    return formatted;
  };

  const getDisplayValue = () => {
    if (fieldType === "card") return formatAccountNumber(realValue, isHolding);
    return !isHolding ? textSecurity.repeat(realValue.length) : realValue;
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    if (onPaste) return onPaste(e);
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "");
    setRealValue(pasted.slice(0, 16));
    e.preventDefault();
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
            <div className="relative">
              <input
                className={clsx(
                  "w-full p-2 border rounded-lg focus:outline-none",
                  isFocused,
                  textClassName ? textClassName : " bg-slate-50",
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
                value={getDisplayValue()}
                maxLength={fieldType === "card" ? 19 : undefined}
                disabled={field.value ? readOnly : false}
                type={fieldType}
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
                    onChange?.(newValue);
                  }
                }}
                onPaste={handlePaste}
                
                onKeyDown={(e) => {
                  if (fieldType === "card") {
                    const allowedKeys = [
                      "ArrowLeft",
                      "ArrowRight",
                      "Tab",
                    ];

                    const isNumberKey = /^[0-9]$/.test(e.key);

                    if (!isNumberKey && !allowedKeys.includes(e.key)) {
                      e.preventDefault(); // prevent typing non-numeric characters
                    }

                    if (
                      (e.key === "Backspace" || e.key === "Delete") &&
                      realValue.length > 0
                    ) {
                      const newVal = realValue.slice(0, -1);
                      setRealValue(newVal);
                      field.onChange(newVal);
                      onChange?.(newVal);
                    }
                  }
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

export default CustomPassField;
