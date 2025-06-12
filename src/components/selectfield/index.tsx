/* eslint-disable @typescript-eslint/no-explicit-any */
import clsx from "clsx";
import { useMemo, useState } from "react";
import { Control, Controller, FieldErrors } from "react-hook-form";
import Select, { StylesConfig } from "react-select";
import type { ValidationProps } from "../../types";
import { ValidationRules } from "../../utils/ValidationRegister";

export interface OptionBase {
  default?: boolean;
  [key: string]: any;
}

interface IProps {
  /* react‑hook‑form */
  control: Control<any>;
  errors?: FieldErrors<any>;
  names: string;

  label: string;
  placeHolder?: string;

  /* option keys */
  labelKey?: string;
  valueKey?: string;

  /* switches */
  isSearchable?: boolean;
  isMulti?: boolean;
  readOnly?: boolean;
  disabled?: boolean;

  /* callbacks */
  InputFocus?: () => void;
  InputBlur?: () => void;

  /* colours / sizes (all optional) */
  ValidClassName?: string;
  OptionSelectColor?: string;
  OptionFocusColor?: string;
  OptionTextColor?: string;
  placeHoldercolor?: string;
  placeHolderSize?: string | number;
  focusBorderColor?: string;
  focusShadowColor?: string;
  OptionSelectFocusColor?: string;
  focusErrorBorderColor?: string;
  focusErrorBgColor?: string;
  focusErrorShadowColor?: string;
  inputHeight?: string | number;
  inputWidth?: string | number;

  /* data + validation */
  options: OptionBase[];
  validation?: ValidationProps;
}

const SelectField = ({
  /* form */
  control,
  errors = {},
  names,

  /* label / placeholders */
  label,
  placeHolder,
  placeHoldercolor,
  placeHolderSize = 14,

  /* option key mapping */
  labelKey = "label",
  valueKey = "value",

  /* switches */
  isSearchable = false,
  isMulti = false,
  readOnly = false,
  disabled = false,

  /* callbacks */
  InputFocus,
  InputBlur,

  /* colours & sizes */
  ValidClassName,
  OptionSelectColor = "#E7F1FF",
  OptionFocusColor = "#000",
  OptionTextColor = "#000",
  focusBorderColor,
  focusShadowColor,
  OptionSelectFocusColor = "#F2F8FF",
  focusErrorBorderColor = "#D32F2F",
  focusErrorBgColor,
  focusErrorShadowColor,
  inputHeight = 1,
  inputWidth = 0,

  /* data + validation */
  options,
  validation,
}: IProps) => {
  const [isFocused, setIsFocused] = useState(false);

  const customStyles = useMemo<StylesConfig<OptionBase, boolean>>(
    () => ({
      control: (provided, state) => {
        const hasError = !!errors?.[names];
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

      placeholder: (provided, state) => {
        const hasError = !!errors?.[names];
        return {
          ...provided,
          color: hasError
            ? "#D32F2F"
            : state.isFocused
            ? "#5081B9"
            : placeHoldercolor ?? "#A0A0A0",
          fontSize: `${placeHolderSize}px`,
        };
      },

      option: (provided, state) => ({
        ...provided,
        backgroundColor: state.isSelected
          ? OptionSelectColor
          : state.isFocused
          ? OptionSelectFocusColor
          : "000",
        color: state.isSelected
          ? OptionTextColor
          : state.isFocused
          ? OptionFocusColor
          : "#000",
        zIndex: 99,
        cursor: "pointer",
      }),
    }),
    [
      errors,
      names,
      focusErrorBorderColor,
      focusBorderColor,
      focusErrorBgColor,
      focusErrorShadowColor,
      focusShadowColor,
      inputHeight,
      inputWidth,
      placeHoldercolor,
      placeHolderSize,
      OptionSelectColor,
      OptionSelectFocusColor,
      OptionFocusColor,
      OptionTextColor,
    ]
  );

  const handleFocus = () => {
    setIsFocused(true);
    InputFocus?.();
  };

  const handleBlur = () => {
    setTimeout(() => setIsFocused(false), 100);
    InputBlur?.();
  };

  return (
    <Controller
      control={control}
      name={names}
      rules={ValidationRules(validation)}
      render={({ field }) => {
        const selectedValue = isMulti
          ? options.filter(
              (o) => o.default || field.value?.includes?.(o[valueKey])
            )
          : options.find((o) => o[valueKey] === field.value) ?? null;

        console.log("selectedValue", selectedValue);
        console.log("field.value", field.value);

        return (
          <div
            data-tooltip-id={`tooltip-${placeHolder}`}
            data-tooltip-content={placeHolder}
          >
            <label className="block text-sm mb-1">
              {label}
              {validation?.required && (
                <span className="text-red-500 ml-0.5">*</span>
              )}
            </label>

            <Select
              isDisabled={disabled || (!!field.value && readOnly)}
              isSearchable={isSearchable}
              isMulti={isMulti}
              isClearable={options?.some((o) => !o.default)}
              placeholder={!isFocused ? placeHolder : ""}
              options={options}
              defaultValue={selectedValue}
              getOptionLabel={(o) => o[labelKey]}
              getOptionValue={(o) => o?.[valueKey]?.toString?.() ?? ""}
              styles={customStyles}
              theme={(theme) => ({
                ...theme,
                borderRadius: 0,
                colors: {
                  ...theme.colors,
                  primary: "#F2F2F2",
                },
              })}
              onFocus={handleFocus}
              onBlur={handleBlur}
              onChange={(selected, actionMeta) => {
                if (isMulti) {
                  const selectedArr: OptionBase[] = Array.isArray(selected)
                    ? (selected as OptionBase[])
                    : [];

                  switch (actionMeta.action) {
                    case "remove-value":
                    case "pop-value":
                      if ((actionMeta.removedValue as OptionBase)?.default)
                        return;
                      break;

                    case "clear":
                      field.onChange(
                        options.filter((o) => o.default).map((o) => o[valueKey])
                      );
                      return;
                  }

                  const fixedValues = options
                    .filter((o) => o.default)
                    .map((o) => o[valueKey]);

                  const dynamicValues = selectedArr
                    .filter((o) => !o.default)
                    .map((o) => o[valueKey]);

                  field.onChange([...fixedValues, ...dynamicValues]);
                } else {
                  const sel = selected as OptionBase | null;

                  if (sel) {
                    field.onChange(sel[valueKey]);
                  } else {
                    const defaultOption = options.find((opt) => opt.default);
                    field.onChange(defaultOption?.[valueKey] ?? null);
                  }
                }
              }}
            />

            {errors?.[names] && (
              <div
                className={clsx(
                  "!mt-0.5",
                  ValidClassName ?? "text-[10px] text-[#f94d44]"
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
