import { format } from "date-fns";

export const formatDateTime = (dateString: string) => {
  if (!dateString) return "";

  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString; // Return original string if parsing fails

  const hasTime = dateString.includes("T");

  return hasTime
    ? format(date, "dd/MMM/yyyy hh:mm:ss a") // With time
    : format(date, "dd/MMM/yyyy"); // Date only
};
