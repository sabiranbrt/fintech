import { ValidationProps } from "@/types";
import { ValidationRules } from "@/utils/ValidationRegister";
import clsx from "clsx";
import DatePicker from "react-datepicker";
import { Controller, useFormContext } from "react-hook-form";
import "react-datepicker/dist/react-datepicker.css";

interface IProp {
  names: string;
  onlyFetchBtn?: boolean;
  isPennyDropVerified?: boolean;
  chargeSlab?: string;
  registeredName?: string;
  txnId?: string;
  isFocused: boolean;
  placeHolder?: string;
  focusShadowColor?: string;
  focusErrorBgColor?: string;
  focusErrorShadowColor?: string;
  ValidClassName?: string;
  ActionFetch?: string;
  placeHolderSize?: string;
  textClassName?: string;
  loading?: boolean;
  focusBorderColor?: string;
  placeHoldercolor?: string;
  inputHeight?: string;
  inputWidth?: string;
  focusErrorBorderColor?: string;
  message?: string;
  labelClassName?: string;
  handleFocus: () => void;
  handleBlur: () => void;
  onInput?: (e: React.FormEvent<HTMLInputElement>) => void;
  readOnly?: boolean;
  validation?: ValidationProps;
  disableButton?: string[];
  type?: string;
  onChange?: (value: string) => void;
  onClick?: () => void;
}

const DatePickers = ({
  names,
  placeHolder,
  ValidClassName,
  readOnly,
  handleBlur,
  handleFocus,
  isFocused,
  disableButton,
  //   focusShadowColor,
  focusBorderColor,
  focusErrorBorderColor,
  inputHeight,
  inputWidth,
  validation,
  //   focusErrorShadowColor,
  focusErrorBgColor,
  placeHolderSize,
  onChange,
  placeHoldercolor,
  textClassName,
}: IProp) => {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  const formatDateToISO = (date: Date | null): string => {
    if (!date) return "";
    const y = date.getFullYear();
    const m = (date.getMonth() + 1).toString().padStart(2, "0");
    const d = date.getDate().toString().padStart(2, "0");
    return `${d}-${m}-${y}`;
  };

  const parseDate = (value: TODO): Date | null => {
    if (!value) return null;

    // If it's already a Date object, return it
    if (value instanceof Date) {
      return isNaN(value.getTime()) ? null : value;
    }

    // If it's a string, try to parse it
    if (typeof value === "string") {
      const trimmedValue = value.trim();

      // Handle dd-mm-yyyy format
      if (trimmedValue.includes("-")) {
        const parts = trimmedValue.split("-");
        if (parts.length === 3) {
          const [day, month, year] = parts.map((p) => p.trim());
          const dayNum = parseInt(day, 10);
          const monthNum = parseInt(month, 10);
          const yearNum = parseInt(year, 10);

          // Validate ranges
          if (
            dayNum >= 1 &&
            dayNum <= 31 &&
            monthNum >= 1 &&
            monthNum <= 12 &&
            yearNum > 0
          ) {
            const date = new Date(yearNum, monthNum - 1, dayNum);
            return date;
          }
        }
      }

      // Handle dd/mm/yyyy format (day first) or mm/dd/yyyy format (month first)
      if (trimmedValue.includes("/")) {
        const parts = trimmedValue.split("/");
        if (parts.length === 3) {
          const [first, second, year] = parts.map((p) => p.trim());
          const firstNum = parseInt(first, 10);
          const secondNum = parseInt(second, 10);
          const yearNum = parseInt(year, 10);

          let day, month;

          if (firstNum > 12) {
            // dd/mm/yyyy format
            day = firstNum;
            month = secondNum;
          } else if (secondNum > 12) {
            // mm/dd/yyyy format
            month = firstNum;
            day = secondNum;
          } else {
            // Ambiguous case, assume dd/mm/yyyy based on your example
            day = firstNum;
            month = secondNum;
          }

          // Validate ranges
          if (
            day >= 1 &&
            day <= 31 &&
            month >= 1 &&
            month <= 12 &&
            yearNum > 0
          ) {
            const date = new Date(yearNum, month - 1, day);
            return date;
          }
        }
      }

      // Try to parse other string formats
      const date = new Date(trimmedValue);
      return isNaN(date.getTime()) ? null : date;
    }

    return null;
  };

  return (
    <Controller
      control={control}
      name={names}
      rules={ValidationRules(validation)}
      render={({ field }) => {
      
        return (
          <div
            className="relative"
            data-tooltip-id={`tooltip-${placeHolder}`}
            data-tooltip-content={`${placeHolder}`}
          >
            <DatePicker
              selected={parseDate(field.value)}
              className={clsx(
                "outline-0 p-3",
                textClassName
                  ? textClassName
                  : "bg-[#F7F7F7] rounded-sm border",
                errors[names]
                  ? `border-[${focusErrorBorderColor}]`
                  : isFocused
                  ? `border-[${focusBorderColor ?? "#5081B9"}]`
                  : "#F2F2F2",
                errors[names]
                  ? `border-[${focusErrorBgColor ?? "#FFF2F2"}]`
                  : !isFocused
                  ? "bg-[#F7F7F7]"
                  : undefined,
                `py-[${inputHeight}px]`,
                `px-[${inputWidth}px]`,
                `placeholder:text-[${placeHoldercolor}] placeholder:text-[${placeHolderSize}]`
              )}
              onFocus={handleFocus}
              onBlur={handleBlur}
              disabled={disableButton?.includes(names)}
              placeholderText="dd/mm/yyyy"
              onChange={(date: Date | null) => {
                field.onChange(date);
                onChange?.(formatDateToISO(date));
              }}
              readOnly={readOnly}
            />

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

export default DatePickers;
