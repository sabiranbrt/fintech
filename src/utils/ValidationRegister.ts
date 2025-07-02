import { type RegisterOptions } from "react-hook-form";
import type { ValidationProps } from "@/types";

export const ValidationRules = (validation?: ValidationProps): RegisterOptions => {
  const rules: RegisterOptions = {};

  if (!validation) return rules;

  const isRequired = validation.required === "Y";
  const requiredMessage = validation.errorMessage || "This field is required.";

  const validators: ((value: string) => true | string)[] = [];

  // If required and empty
  if (isRequired) {
    validators.push((value: string) => {
      return value?.trim() ? true : requiredMessage;
    });
  }

  if (validation.validations && Array.isArray(validation.validations)) {
    for (const val of validation.validations) {
      const rawRegex = val.regex || val.regex;

      // Regex validation
      if (rawRegex) {
        try {
          const cleanedRegex = rawRegex.replace(/^\/|\/$/g, "");
          const regex = new RegExp(cleanedRegex);

          validators.push((value: string) => {
            if (!value?.trim()) return true; 
            return regex.test(value) ? true : val.errorMessage || "Invalid format";
          });
        } catch (err) {
          console.warn("Invalid regex pattern:", err);
        }
      }

    }
  }

  if (validators.length === 1) {
    rules.validate = validators[0];
  } else if (validators.length > 1) {
    rules.validate = (value: string) => {
      for (const check of validators) {
        const result = check(value);
        if (result !== true) return result;
      }
      return true;
    };
  }

  return rules;
};
