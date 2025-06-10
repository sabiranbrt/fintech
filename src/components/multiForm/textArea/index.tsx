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
  placeHolderSize?: string;
  textClassName?: string;
  focusBorderColor?: string;
  placeHoldercolor?: string;
  focusErrorBorderColor?: string;
  labelClassName?: string;
  handleFocus: () => void;
  handleBlur: () => void;
  readOnly?: boolean;
  type?: string;
  validation?: ValidationProps;
}

const TextArea = ({
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
  validation,
  focusErrorBorderColor,
  names,
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
  return (
    <Controller
      control={control}
      name={names}
      rules={ValidationRules(validation)}
      render={({ field }) => {
        return (
          <div className="relative">
            <textarea
              data-tooltip-id={`tooltip-${placeHolder}`}
              data-tooltip-content={`${placeHolder}`}
              disabled={field.value ? readOnly : false}
              defaultValue={field.value}
              className={clsx(
                `outline-0 !py-${inputHeight} !px-${inputWidth} md:!p-2 sm:!p-2`,
                textClassName
                  ? textClassName
                  : "bg-[#F7F7F7] !px-2 !py-3 rounded-sm border border-[#F2F2F2]",
                `placeholder:text-[${placeHoldercolor}] placeholder:text-[${placeHolderSize}]`
              )}
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
              onChange={(e) => {
                const value = e.target.value;
                field.onChange(value);
              }}
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

export default TextArea;
