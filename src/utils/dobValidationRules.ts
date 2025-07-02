import { type RegisterOptions } from "react-hook-form";

export const dobValidationRules = (): RegisterOptions => {
  const today = new Date();
  const hundredYearsAgo = new Date();
  hundredYearsAgo.setFullYear(today.getFullYear() - 100);

  return {
    required: "Date of Birth is required",
    validate: {
      maxDate: (value: Date) =>
        !value || value <= new Date() || "Date of Birth cannot be in the future",
      minDate: (value: Date) =>
        !value || value >= hundredYearsAgo || "Date of Birth cannot be more than 100 years ago",
      isAdult: (value: Date) => {
        if (!value) return false;
        const adultDate = new Date();
        adultDate.setFullYear(adultDate.getFullYear() - 18);
        return value <= adultDate || "User must be at least 18 years old";
      },
      notToday: (value: Date) => {
        if (!value) return false;
        return value.toDateString() !== new Date().toDateString() || "Date of Birth cannot be today";
      }
    }
  };
};
