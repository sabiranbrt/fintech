import { ValidationProps } from "@/types";
import { ValidationRules } from "@/utils/ValidationRegister";
import clsx from "clsx";
import { Controller, useFormContext } from "react-hook-form";

interface Options {
  label: string;
  value: string;
  default?: boolean;
}

interface IProp {
  names: string;
  options: Options[];
  ValidClassName?: string;
  labelClassName?: string;
  readOnly?: boolean;
  validation?: ValidationProps;
}

const RadioButton = ({
  names,
  options,
  ValidClassName,
  labelClassName,
  validation,
}: IProp) => {
  const {
    control,
    formState: { errors },
  } = useFormContext();
  
  return (
    <Controller
      control={control}
      name={names}
      defaultValue={options[0].value}
      rules={ValidationRules(validation)}
      render={({ field }) => {
        return (
          <div className=" flex flex-row flex-wrap gap-1.5">
            {options?.map((opt) => {
              return (
                <div
                  key={opt.value}
                  className=" flex flex-row items-center gap-2 flex-nowrap"
                >
                  <input
                    id={`${field.name}-${opt.value}`}
                    name={field.name}
                    // disabled={field.value ? readOnly : false}
                    type="radio"
                    defaultValue={opt.value}
                    checked={field.value === opt.value}
                    onChange={() => field.onChange(opt.value)}
                  />
                  <label
                    className={clsx(
                      "whitespace-nowrap",
                      labelClassName ? labelClassName : " text-gray-500"
                    )}
                    htmlFor={`${field.name}-${opt.value}`}
                  >
                    {opt.label}
                  </label>
                </div>
              );
            })}
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

export default RadioButton;
