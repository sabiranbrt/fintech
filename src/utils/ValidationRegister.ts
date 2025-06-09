import { type RegisterOptions } from "react-hook-form";
import type { ValidationProps } from "../types";

export const ValidationRules = (validation?: ValidationProps): RegisterOptions => {
  const rules: RegisterOptions = {};

  if (!validation) return rules;

  // Required validation
  if (validation.required === "Y") {
    rules.required = validation?.errorMessage || "This field is required.";
  }

  // Pattern validations (regex)
  if (validation.validations && Array.isArray(validation.validations)) {
    for (const val of validation.validations) {
      if (val.regex) {
        try {
          // Clean regex string if it is wrapped with slashes e.g. "/pattern/"
          const cleanedRegexString = val.regex.replace(/^\/|\/$/g, "");
          const regex = new RegExp(cleanedRegexString);
          rules.pattern = {
            value: regex,
            message: val.errorMessage || "Invalid format",
          };
          // If you want to support multiple regex rules, consider merging or chaining here
          break; // stop after first pattern validation (if multiple exist)
        } catch (err) {
          console.warn("Invalid regex pattern:", err);
        }
      }
    }
  }

  return rules;
};
