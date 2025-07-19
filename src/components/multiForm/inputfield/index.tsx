import TruncatedTextWithTooltip from "@/components/truncatedTextwithToolTip";
import { ValidationProps } from "@/types";
import { ValidationRules } from "@/utils/ValidationRegister";
import clsx from "clsx";
import { Controller, useFormContext } from "react-hook-form";
import { BiCheckCircle, BiXCircle } from "react-icons/bi";
// import { IoInformationCircleOutline } from "react-icons/io5";

interface IProp {
  names: string;
  onlyFetchBtn?: boolean;
  validTick?: boolean;
  senderId?: number;
  rules?: TODO;
  isPennyDropVerified?: boolean;
  chargeSlab?: string;
  registeredName?: string;
  txnId?: string;
  isFocused: boolean;
  staticFetchBtn?: boolean;
  accountVerify?: boolean;
  aadharCard?: boolean;
  placeHolder?: string;
  inputHeight?: string;
  inputWidth?: string;
  focusShadowColor?: string;
  focusErrorBgColor?: string;
  focusErrorShadowColor?: string;
  maxLength?: number;
  ValidClassName?: string;
  ActionFetch?: string;
  placeHolderSize?: string;
  textClassName?: string;
  loading?: boolean;
  focusBorderColor?: string;
  placeHoldercolor?: string;
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

const InputField = ({
  isFocused,
  // chargeSlab,
  isPennyDropVerified,
  handleBlur,
  handleFocus,
  rules,
  names,
  txnId,
  registeredName,
  loading,
  message,
  senderId,
  validTick = false,
  ActionFetch,
  inputHeight,
  onlyFetchBtn,
  inputWidth,
  placeHolder,
  ValidClassName,
  focusErrorBorderColor,
  validation,
  staticFetchBtn,
  accountVerify,
  placeHolderSize,
  maxLength,
  onChange,
  onClick,
  onInput,
  placeHoldercolor,
  focusBorderColor,
  focusShadowColor,
  disableButton,
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
      rules={rules ?? ValidationRules(validation)}
      render={({ field }) => {
        return (
          <div className="relative">
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
                  : validTick
                  ? "#22c55e"
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
              disabled={validTick || disableButton}
              readOnly={validTick}
              maxLength={maxLength}
              type={type}
              onChange={(e) => {
                const value = e.target.value;
                field.onChange(value);
                onChange?.(value);
              }}
              onInput={(e) => {
                if (onInput) onInput(e);
              }}
            />

            {staticFetchBtn || ActionFetch ? (
              <div className=" absolute top-1.5 right-2.5">
                <button
                  type="submit"
                  disabled={
                    !field.value?.trim() || !!errors[names] || disableButton
                  }
                  className={clsx(
                    " transition-[2000] text-white !px-2 !py-1 rounded cursor-pointer",
                    !field.value?.trim() || !!errors[names] || disableButton
                      ? "bg-gray-300"
                      : "bg-[#5081B9]"
                  )}
                  onClick={onClick}
                >
                  {staticFetchBtn || ActionFetch}
                </button>
              </div>
            ) : null}

            {accountVerify && (
              <>
                {isPennyDropVerified ? (
                  <>
                    <div className="absolute right-12 top-3 mt-1 -mr-8 rounded-md text-xs">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="green"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        className="lucide lucide-check"
                      >
                        <path d="M20 6 9 17l-5-5" />
                      </svg>
                    </div>
                    {txnId && registeredName && (
                      <span className="flex gap-3 text-sm text-secondary mt-1">
                        <TruncatedTextWithTooltip
                          label="Transaction ID:"
                          value={txnId}
                        />
                        <TruncatedTextWithTooltip
                          label="Reg. Name:"
                          value={registeredName}
                        />
                      </span>
                    )}
                  </>
                ) : (
                  <>
                    {onlyFetchBtn ? (
                      <div className="">
                        <button
                          type="button"
                          onClick={onClick}
                          className="absolute right-6 top-3 bg-[#5081B9] hover:bg-[#000769] transition-[2000] text-white !py-[2px] !px-2 rounded text-sm cursor-pointer"
                        >
                          {loading ? "Verifying..." : "Click to Verify"}
                        </button>

                        {/* <div className="relative group">
                          <IoInformationCircleOutline className="absolute right-1 -top-7 text-primary text-lg cursor-pointer" />

                          <div className="absolute right-0 bg-gray-100 border border-gray-200 shadow-md rounded-md opacity-0 group-hover:opacity-100 p-2 text-sm transition-opacity duration-300 pointer-events-none group-hover:pointer-events-auto z-20">
                            <h3 className="text-center text-sm font-medium text-gray-700">
                              Charge : ₹ {chargeSlab}
                            </h3>
                          </div>
                        </div> */}
                      </div>
                    ) : null}
                  </>
                )}
              </>
            )}

            {message && (
              <span className="text-sm text-primary-light">{`(${message})`}</span>
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

            {validTick ? (
              <>
                {errors.senderMobile ? (
                  <BiXCircle
                    className="absolute right-3 top-[25px] transform -translate-y-1/2 text-red-500 pointer-events-none "
                    size={20}
                  />
                ) : senderId !== 0 ? (
                  <BiCheckCircle
                    className="absolute right-3 top-[25px] transform -translate-y-1/2 text-green-500 pointer-events-none"
                    size={20}
                  />
                ) : null}
              </>
            ) : null}
          </div>
        );
      }}
    />
  );
};

export default InputField;
