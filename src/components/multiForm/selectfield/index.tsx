/* eslint-disable @typescript-eslint/no-explicit-any */
import { ValidationProps } from "@/types";
import { ValidationRules } from "@/utils/ValidationRegister";
import clsx from "clsx";
import { Controller, useFormContext } from "react-hook-form";
import Select from "react-select";

interface Options {
  label: string;
  value: string;
  default?: boolean;
}

interface IProps {
  handleFocus: () => void;
  handleBlur: () => void;
  isFocused: boolean;
  names: string;
  value?: string;
  ValidClassName?: string;
  isSearchable?: boolean;
  isMulti?: boolean;
  readOnly?: boolean;
  type?: string;
  OptionSelectColor?: string;
  OptionFocusColor?: string;
  OptionTextColor?: string;
  placeHolder?: string;
  placeHolderSize?: string;
  focusBorderColor?: string;
  placeHoldercolor?: string;
  focusShadowColor?: string;
  OptionSelectFocusColor?: string;
  focusErrorBorderColor?: string;
  focusErrorBgColor?: string;
  focusErrorShadowColor?: string;
  inputHeight?: string;
  inputWidth?: string;
  disabled?: boolean;
  options: Options[];
  validation?: ValidationProps;
}

const SelectField = ({
  ValidClassName,
  inputHeight,
  inputWidth,
  focusShadowColor,
  OptionSelectColor,
  focusErrorBgColor,
  focusErrorShadowColor,
  isSearchable,
  isMulti,
  OptionSelectFocusColor,
  OptionFocusColor,
  OptionTextColor,
  placeHoldercolor,
  focusBorderColor,
  placeHolderSize,
  focusErrorBorderColor,
  names,
  options,
  isFocused,
  placeHolder,
  handleFocus,
  handleBlur,
  validation,
  readOnly,
}: IProps) => {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  const customStyles = {
    control: (provided: any, state: any) => {
      const hasError = errors && errors[names];

      return {
        ...provided,
        borderColor: hasError
          ? focusErrorBorderColor
          : state.isFocused
          ? focusBorderColor ?? "#5081B9"
          : "#F2F2F2",
        backgroundColor: hasError
          ? focusErrorBgColor ?? "#FFF2F2"
          : !state.isFocused
          ? "#F7F7F7"
          : provided.backgroundColor,
        boxShadow: hasError
          ? `0 1px 2px 0 ${focusErrorShadowColor}`
          : state.isFocused
          ? `0 1px 2px 0 ${focusShadowColor}`
          : undefined,
        paddingBlock: `${inputHeight}px`,
        paddingInline: `${inputWidth}px`,
        borderRadius: 4,
        whiteSpace: "nowrap",
        margin: "0 !important",
      };
    },

    placeholder: (provided: any, state: any) => {
      const hasError = errors && errors[names];
      const isFocused = state.isFocused;

      return {
        ...provided,
        color: hasError
          ? "#D32F2F"
          : isFocused
          ? "#5081B9"
          : placeHoldercolor ?? "#A0A0A0",
        fontSize: `${placeHolderSize}px`,
      };
    },

    option: (provided: any, state: any) => {
      return {
        ...provided,
        backgroundColor: state.isSelected
          ? OptionSelectColor
          : state.isFocused && `${OptionSelectFocusColor}`,
        color: state.isSelected
          ? OptionTextColor
          : state.isFocused
          ? OptionFocusColor
          : "#000",
        // fontSize: `${optionFontSize ?? 14}px,
        zIndex: 99,
        cursor: "pointer",
      };
    },
  };

  return (
    <Controller
      control={control}
      name={names}
      rules={ValidationRules(validation)}
      render={({ field }) => {
        return (
          <div
            data-tooltip-id={`tooltip-${placeHolder}`}
            data-tooltip-content={`${placeHolder}`}
          >
            <Select
              isDisabled={field.value ? readOnly : false}
              isSearchable={isSearchable}
              placeholder={!isFocused ? placeHolder : ""}
              styles={customStyles}
              value={
                isMulti
                  ? [
                      ...options.filter((option) => option.default),
                      ...options.filter(
                        (option) =>
                          field.value?.includes(option.value) && !option.default
                      ),
                    ]
                  : options.find((option) => option.value === field.value) ??
                    null
              }
              theme={(theme) => ({
                ...theme,
                borderRadius: 0,
                colors: {
                  ...theme.colors,
                  // primary25: `${
                  //   OptionSelectColor ? OptionSelectColor : "#5081B9"
                  // }`,
                  primary: "#F2F2F2",
                },
              })}
              isMulti={isMulti}
              isClearable={options?.some((val) => !val.default === true)}
              onChange={(selectedOptions, actionMeta) => {
                let selectedValues: string[] = [];

                if (isMulti) {
                  const selectedArray = selectedOptions as Options[];

                  switch (actionMeta.action) {
                    case "remove-value":
                    case "pop-value":
                      if ((actionMeta.removedValue as Options)?.default) {
                        return;
                      }
                      break;
                    case "clear":
                      selectedValues = options
                        .filter((option) => option.default)
                        .map((o) => o.value);
                      field.onChange(selectedValues);
                      return;
                  }

                  const fixedValues = options
                    .filter((option) => option.default)
                    .map((o) => o.value);
                  const dynamicValues = selectedArray
                    .filter((option) => !option.default)
                    .map((option) => option.value);

                  field.onChange([...fixedValues, ...dynamicValues]);
                } else {
                  const selected = selectedOptions as Options | null;
                  if (selected?.default) {
                    return;
                  }
                  field.onChange(selected?.value ?? null);
                }
              }}
              onFocus={handleFocus}
              onBlur={handleBlur}
              options={options}
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

export default SelectField;
