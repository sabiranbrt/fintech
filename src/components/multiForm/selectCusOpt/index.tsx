/* eslint-disable @typescript-eslint/no-explicit-any */
import { ValidationProps } from "@/types";
import { ValidationRules } from "@/utils/ValidationRegister";
import clsx from "clsx";
import { useEffect, useState } from "react";
import { Controller, useFormContext, useWatch } from "react-hook-form";
import { FaToggleOff, FaToggleOn } from "react-icons/fa";
import { ImSpinner8 } from "react-icons/im";

interface IProps {
  inputClassName?: string;
  placeHolder?: string;
  rules?: any;
  currentIndex?: number;
  ValidClassName?: string;
  label: string;
  Nolabel?: boolean;
  isFocused?: boolean;
  optionsData: any[];
  names: string;
  inputHeight?: string;
  inputWidth?: string;
  OptionSelectFocusColor?: string;
  focusShadowColor?: string;
  focusErrorBgColor?: string;
  focusErrorShadowColor?: string;
  showToggle?: boolean;
  isOn?: boolean;
  toggleDisable?: boolean;
  handleToggle: () => void;
  isLoading?: boolean;
  placeHoldercolor?: string;
  readOnly?: boolean;
  validation?: ValidationProps;
  OptionTextColor?: string;
  OptionFocusColor?: string;
  OptionSelectColor?: string;
  placeHolderSize?: string;
  textClassName?: string;
  type?: string;
  handleFocus: () => void;
  handleBlur: () => void;
  onChange?: (value: string) => void;
  fetchData?: any;
  focusErrorBorderColor?: string;
  focusBorderColor?: string;
}

const SelectCusOpt = ({
  names,
  isLoading,
  validation,
  isFocused,
  placeHolder,
  rules,
  readOnly,
  inputHeight,
  inputWidth,
  optionsData,
  focusErrorBorderColor,
  showToggle = false,
  isOn,
  toggleDisable,
  handleToggle,
  focusBorderColor,
  focusErrorBgColor,
  placeHolderSize,
  placeHoldercolor,
  focusErrorShadowColor,
  focusShadowColor,
  currentIndex,
  fetchData,
  handleFocus,
  handleBlur,
  textClassName,
  onChange,
}: IProps) => {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  const [search, setSearch] = useState("");
  const [filteredOptions, setFilteredOptions] = useState<any[]>([]);

  const watchedValue = useWatch({ control, name: names });

  useEffect(() => {
    if (search?.trim()) {
      const filtered = optionsData.filter((opt) =>
        JSON.stringify(opt).toLowerCase().includes(search.toLowerCase())
      );
      setFilteredOptions(filtered);
    } else {
      setFilteredOptions(optionsData);
    }
  }, [search, optionsData]);

  const onInputFocus = () => {
    setFilteredOptions(optionsData);
    handleFocus?.();
    fetchData?.();
  };

  const onInputBlur = () => {
    // setTimeout(() => setIsFocused(false), 100);
    handleBlur?.();
  };

  useEffect(() => {
    if (
      watchedValue &&
      typeof watchedValue === "object" &&
      watchedValue.bankName
    ) {
      setSearch(watchedValue.bankName);
    } else if (typeof watchedValue === "string") {
      setSearch(watchedValue);
    } else {
      setSearch("");
    }
  }, [watchedValue]);

  return (
    <Controller
      control={control}
      name={names}
      rules={rules ?? ValidationRules(validation)}
      render={({ field }) => {
        return (
          <div>
            <div className="relative">
              <input
                {...field}
                type="text"
                name={names}
                disabled={field.value ? readOnly : false}
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
                  paddingBlock: `${inputHeight}px`,
                  paddingInline: `${inputWidth}px`,
                }}
                value={search}
                onChange={(e) => {
                  const value = e.target.value;
                  setSearch(value);
                  field.onChange(value);
                  onChange?.(value);
                }}
                placeholder={!isFocused ? placeHolder : ""}
                readOnly={readOnly}
                onFocus={onInputFocus}
                onBlur={onInputBlur}
                className={clsx(
                  "outline-0",
                  textClassName
                    ? textClassName
                    : "bg-[#F7F7F7] rounded-sm border border-[#F2F2F2]",
                  `placeholder:text-[${placeHoldercolor}] placeholder:text-[${placeHolderSize}]`
                )}
              />
              {isLoading && (
                <ImSpinner8 className="absolute right-4 top-2 animate-spin text-gray-500 w-5 h-5" />
              )}
            </div>

            {isFocused && filteredOptions.length > 0 && (
              <ul
                role="listbox"
                className="absolute z-10 w-full bg-white border border-gray-300 rounded-md mt-1 max-h-40 overflow-y-auto shadow-lg"
              >
                {filteredOptions.map((bank, index) => {
                  return (
                    <li
                      key={index}
                      role="option"
                      onMouseDown={() => {
                        const label = bank?.bankName;
                        setSearch(label);
                        field.onChange({
                          bankName: bank.bankName,
                          ifsc: bank.ifsc,
                          mode: bank.mode,
                        });
                        onChange?.(bank?.bankName);
                      }}
                      className={`p-2 cursor-pointer ${
                        currentIndex === index
                          ? "bg-gray-100"
                          : "hover:bg-gray-100"
                      }`}
                    >
                      {`${bank?.bankName} (${bank?.ifsc}) ${bank.mode ?? ""}`}
                    </li>
                  );
                })}
              </ul>
            )}

            {errors[names] && (
              <p className=" text-red-500 text-xs mt-2">
                {errors[names]?.message as string}
              </p>
            )}

            {showToggle && search.trim() !== "" && (
              <div className="flex items-center gap-3">
                <p className=" text-sm font-medium text-gray-600">
                  Scan Existing Customers ?
                </p>
                <button
                  type="button"
                  onClick={handleToggle}
                  className="text-3xl text-blue-500"
                  disabled={toggleDisable}
                >
                  {isOn ? <FaToggleOn /> : <FaToggleOff />}
                </button>
              </div>
            )}
          </div>
        );
      }}
    />
  );
};

export default SelectCusOpt;
