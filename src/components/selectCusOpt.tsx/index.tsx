/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { ValidationProps } from "@/types";
import { ValidationRules } from "@/utils/ValidationRegister";
import { Control, Controller, FieldErrors } from "react-hook-form";
import { ImSpinner8 } from "react-icons/im";
import clsx from "clsx";

interface IProps {
  inputClassName?: string;
  control: Control<any>;
  errors?: FieldErrors<any>;
  rules?: any;
  currentIndex?: number;
  label: string;
  Nolabel?: boolean;
  optionsData: any[];
  names: string;
  focusShadowColor?: string;
  focusErrorBgColor?: string;
  focusErrorShadowColor?: string;
  isLoading?: boolean;
  validation?: ValidationProps;
  disabled: boolean;
  handleFocus?: () => void;
  handleBlur?: () => void;
  onChange?: (value: string) => void;
  fetchData?: any;
  focusErrorBorderColor?: string;
  focusBorderColor?: string;
}

const SelectCusOpt = ({
  control,
  errors = {},
  names,
  label,
  Nolabel,
  isLoading,
  validation,
  disabled,
  rules,
  optionsData,
  focusErrorBorderColor,
  focusBorderColor,
  focusErrorBgColor,
  focusErrorShadowColor,
  focusShadowColor,
  currentIndex,
  fetchData,
  handleFocus,
  handleBlur,
  inputClassName,
  onChange,
}: IProps) => {
  const [search, setSearch] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [filteredOptions, setFilteredOptions] = useState<any[]>([]);

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
    setIsFocused(true);
    setFilteredOptions(optionsData);
    handleFocus?.();
    fetchData?.();
  };

  const onInputBlur = () => {
    setTimeout(() => setIsFocused(false), 100);
    handleBlur?.();
  };

  return (
    <Controller
      control={control}
      name={names}
      rules={rules ?? ValidationRules(validation)}
      render={({ field }) => {
        return (
          <div>
            {!Nolabel ? (
              <label className="block text-sm mb-1">
                {label}
                {validation?.required && (
                  <span className="text-red-500 ml-0.5">*</span>
                )}
              </label>
            ) : null}

            <div className="relative">
              <input
                {...field}
                type="text"
                name={names}
                disabled={disabled}
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
                value={search}
                onChange={(e) => {
                  const value = e.target.value;
                  setSearch(value);
                  field.onChange(value);
                  onChange?.(value);
                }}
                placeholder="Search and select bank"
                onFocus={onInputFocus}
                onBlur={onInputBlur}
                className={clsx(
                  "text-sm border rounded-lg p-2 w-full focus:outline-none",
                  inputClassName ? inputClassName : "bg-slate-50",
                  errors[names] ? "border-red-500" : "border-gray-300"
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
                          mode: bank.mode
                        });
                        onChange?.(bank?.bankName);
                      }}
                      className={`p-2 cursor-pointer ${
                        currentIndex === index
                          ? "bg-gray-100"
                          : "hover:bg-gray-100"
                      }`}
                    >
                      {`${bank?.bankName} (${bank?.ifsc}) ${bank.mode}`}
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
          </div>
        );
      }}
    />
  );
};

export default SelectCusOpt;
