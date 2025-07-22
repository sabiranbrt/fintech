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
  disableButton?: boolean;
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
  const parseDate = (dateStr: string): Date | null => {
    if (!dateStr) return null;
    const [day, month, year] = dateStr.split("-");
    const isoString = `${year}-${month}-${day}`;
    const date = new Date(isoString);
    return isNaN(date.getTime()) ? null : date;
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
              disabled={disableButton}
              placeholderText="dd/mm/yyyy"
              onChange={(date: Date | null) => {
                field.onChange(date);
                onChange?.(formatDateToISO(date));
              }}
              readOnly={readOnly}
              dateFormat="dd-MM-yyyy"
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
