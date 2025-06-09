/* eslint-disable @typescript-eslint/no-explicit-any */
import { ValidationProps } from "@/types";
import { ValidationRules } from "@/utils/ValidationRegister";
import { Controller, useFormContext } from "react-hook-form";
import { ImSpinner8 } from "react-icons/im";

interface IProps {
  currentIndex: number;
  label:string;
  optionsData:any
  names: string;
  isLoading?: boolean;
  isDropdownOpen?: boolean;
  validation?: ValidationProps;
  disabled: boolean;
  fetchData: any;
  search: string;
  handleSearch: () => void;
  handleFocus: () => void;
  handleBlur: () => void;
  handleKeyDown: () => void;
  onChange: (value: string) => void;
  handleSelect: (value: string) => void;
}

const SelectCusOpt = ({
  names,
  label,
  isLoading,
  validation,
  isDropdownOpen,
  disabled,
  search,
  optionsData,
  currentIndex,
  handleSearch,
  handleFocus,
  handleBlur,
  handleSelect,
  handleKeyDown,
  onChange,
  fetchData,
}: IProps) => {
  const {
    control,
    formState: { errors },
  } = useFormContext();
  return (
    <Controller
      control={control}
      name={names}
      rules={ValidationRules(validation)}
      render={({ field }) => {
        return (
          <div className="relative">
            <label className="block text-sm">
              {label}<span className="text-red-500">*</span>
            </label>
            <div className="relative w-full">
              <input
                {...field}
                type="text"
                name={names}
                disabled={disabled}
                value={search}
                onChange={(e) => {
                  const value = e.target.value;
                  field.onChange(value);
                  handleSearch();
                  if (onChange) {
                    onChange(value);
                  }
                }}
                placeholder="Search and select bank"
                onFocus={handleFocus}
                onClick={fetchData}
                onBlur={handleBlur}
                onKeyDown={handleKeyDown}
                className={`text-sm border rounded-md p-2 w-full focus:outline-none bg-white ${
                  errors.bankName ? "border-red-500" : "border-gray-300"
                }`}
              />
              {isLoading && (
                <ImSpinner8  className="absolute right-4 top-2 animate-spin text-gray-500 w-5 h-5" />
              )}
            </div>

            {isDropdownOpen && optionsData.length > 0 && (
              <ul
                role="listbox"
                className="absolute z-10 w-full bg-white border border-gray-300 rounded-md mt-1 max-h-40 overflow-y-auto shadow-lg"
              >
                {optionsData.map((bank:string, index:number) => (
                  <li
                    key={index}
                    role="option"
                    onMouseDown={() => handleSelect(bank)}
                    className={`p-2 cursor-pointer ${
                      currentIndex === index
                        ? "bg-gray-100"
                        : "hover:bg-gray-100"
                    }`}
                  >
                    {bank}
                  </li>
                ))}
              </ul>
            )}

            {errors[names] && (
              <p className="absolute top-[60px] text-red-500 text-xs mt-2">
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
