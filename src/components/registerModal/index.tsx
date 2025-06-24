/* eslint-disable @typescript-eslint/no-explicit-any */
import { ValidationProps } from "@/types";
import { ValidationRules } from "@/utils/ValidationRegister";
import clsx from "clsx";
import React, { useState } from "react";
import { Control, Controller, FieldErrors } from "react-hook-form";
import { IoClose } from "react-icons/io5";

export interface RegisterModalProps {
  names: string;
  textClassName?: string;
  placeHolder: string;
  control: Control<any>;
  rules?: any;
  focusErrorBorderColor?: string;
  focusErrorShadowColor?: string;
  ValidClassName?: string;
  placeHolderSize?: string;
  placeHoldercolor?: string;
  focusErrorBgColor?: string;
  focusBorderColor?: string;
  focusShadowColor?: string;
  errors?: FieldErrors<any>;
  title: string;
  subTitle: string;
  readOnly?: boolean;
  disabled?: boolean;
  type?: string;
  maxLength?: number;
  onClose: () => void;
  onChange?: (value: string) => void;
  validation?: ValidationProps;
  onSubmit: () => void;
}

const RegisterModal: React.FC<RegisterModalProps> = ({
  names,
  title,
  onChange,
  focusErrorShadowColor,
  focusErrorBgColor,
  control,
  maxLength,
  rules,
  placeHolder,
  focusShadowColor,
  focusBorderColor,
  focusErrorBorderColor,
  type = "number",
  placeHoldercolor,
  disabled,
  placeHolderSize,
  ValidClassName,
  readOnly,
  textClassName,
  errors = {},
  subTitle,
  onClose,
  validation,
  onSubmit,
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="relative w-96 overflow-hidden rounded-2xl bg-white p-6 shadow-lg">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
          type="button"
        >
          <IoClose className="text-2xl" />
        </button>

        <h2 className="mb-1 text-xl font-semibold">{title}</h2>
        {subTitle && (
          <h3 className="mb-4 text-base font-medium text-gray-600">
            {subTitle}
          </h3>
        )}

        <Controller
          control={control}
          name={names}
          rules={rules ?? ValidationRules(validation)}
          render={({ field }) => {
            return (
              <div className="relative">
                <input
                  className={clsx(
                    "w-full p-2 border rounded-lg focus:outline-none",
                    textClassName ? textClassName : " bg-slate-50",
                    `placeholder:text-[${placeHoldercolor}] placeholder:text-[${placeHolderSize}]`
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
                  defaultValue={field.value}
                  disabled={disabled}
                  readOnly={readOnly}
                  type={type}
                  onChange={(e) => {
                    const value = e.target.value;
                    field.onChange(value);
                    onChange?.(value);
                  }}
                />
                {errors[names] && (
                  <div
                    className={clsx(
                      "!mt-0.5",
                      ValidClassName
                        ? ValidClassName
                        : "text-[10px] text-[#f94d44]"
                    )}
                  >
                    <p>{errors[names]?.message as string}</p>
                  </div>
                )}
                <button
                  type="submit"
                  onClick={onSubmit}
                  disabled={!!errors[names] || !field.value}
                  className={`w-full rounded-lg py-3 text-white mt-3 cursor-pointer ${
                    errors[names] || !field.value
                      ? "bg-gray-400"
                      : "bg-gradient-to-r from-[#4b5a9f] to-[#4fb5b7]"
                  }`}
                >
                  Submit
                </button>
              </div>
            );
          }}
        />
      </div>
    </div>
  );
};

export default RegisterModal;
