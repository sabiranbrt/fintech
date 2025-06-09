import { ValidationProps } from "@/types";
import { ValidationRules } from "@/utils/ValidationRegister";
import clsx from "clsx";
import { Controller, useFormContext } from "react-hook-form";

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
  ActionFetch?: string;
  placeHolderSize?: string;
  textClassName?: string;
  focusBorderColor?: string;
  placeHoldercolor?: string;
  focusErrorBorderColor?: string;
  labelClassName?: string;
  handleFocus: () => void;
  handleBlur: () => void;
  readOnly?: boolean;
  validation?: ValidationProps;
  type?: string;
  onChange?: (value: string) => void;
  onClick?: () => void;
}

const InputField = ({
  isFocused,
  handleBlur,
  handleFocus,
  names,
  inputHeight,
  ActionFetch,
  inputWidth,
  placeHolder,
  ValidClassName,
  readOnly,
  focusErrorBorderColor,
  validation,
  placeHolderSize,
  onChange,
  onClick,
  placeHoldercolor,
  focusBorderColor,
  focusShadowColor,
  focusErrorBgColor,
  focusErrorShadowColor,
  textClassName,
  type,
}: IProp) => {
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
              Account Number <span className="text-red-500">*</span>
            </label>
            <input
              className={clsx(
                "outline-0",
                textClassName
                  ? textClassName
                  : "bg-[#F7F7F7] rounded-sm border border-[#F2F2F2]",
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
                paddingBlock: `${inputHeight}px`,
                paddingInline: `${inputWidth}px`,
              }}
              placeholder={!isFocused ? placeHolder : ""}
              onFocus={handleFocus}
              onBlur={handleBlur}
              defaultValue={field.value}
              disabled={field.value ? readOnly : false}
              readOnly={readOnly}
              type={type}
              onChange={(e) => {
                const value = e.target.value;
                field.onChange(value);
                onChange?.(value);
              }}
            />

            {ActionFetch ? (
              <div className=" absolute top-1.5 right-2.5">
                <button
                  type="submit"
                  className="bg-[#5081B9] hover:bg-[#000769] transition-[2000] text-white !px-2 !py-1 rounded cursor-pointer"
                  title="Submit Now"
                  onClick={onClick}
                >
                  {ActionFetch}
                </button>
              </div>
            ) : null}

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

export default InputField;
