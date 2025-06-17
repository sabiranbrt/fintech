import { useState, useEffect } from "react";

const useDOBRange = () => {
  const [dobRange, setDobRange] = useState({ min: "", max: "" });

  useEffect(() => {
    const today = new Date();
    const minDate = new Date(today.getFullYear() - 100, today.getMonth(), today.getDate()); // Minimum age limit (100 years ago)
    const defaultDOB = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate()); // 18 years ago

    setDobRange({
      min: minDate.toISOString().split("T")[0],
      max: defaultDOB.toISOString().split("T")[0], // Maximum selectable date
    });
  }, []);

  return dobRange;
};

export default useDOBRange;
