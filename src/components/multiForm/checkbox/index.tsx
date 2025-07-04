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
  validation?: ValidationProps;
  onOptionChange?: () => void;
}

const CheckBox = ({
  names,
  options,
  ValidClassName,
  labelClassName,
  onOptionChange,
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
      rules={ValidationRules(validation)}
      render={({ field }) => {
        return (
          <div className="flex flex-row flex-wrap gap-1.5">
            {options?.map((opt) => {
              const currentValues = Array.isArray(field.value)
                ? field.value
                : [];
              return (
                <div
                  key={`${field.name}-${opt.value}`}
                  className=" flex flex-row items-center gap-2 flex-nowrap"
                >
                  <input
                    type="checkbox"
                    id={`${field.name}-${opt.value}`}
                    checked={currentValues.includes(opt.value)}
                    onChange={(e) => {
                      const isChecked = e.target.checked;
                      const newValues = isChecked
                        ? [...currentValues, opt.value]
                        : currentValues.filter((v) => v !== opt.value);

                      field.onChange(newValues);

                      // Trigger dependent field check on change
                      if (onOptionChange) {
                        onOptionChange();
                      }
                    }}
                  />
                  <label
                    htmlFor={`${field.name}-${opt.value}`}
                    className={clsx(
                      "whitespace-nowrap",
                      labelClassName ? labelClassName : " text-gray-500"
                    )}
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

export default CheckBox;
