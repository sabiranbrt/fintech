import clsx from "clsx";
import React, { useState } from "react";

interface SwitchOption {
  label: string;
  value: string | number;
  onClick: () => void;
}

interface SwitchGroupProps {
  options: SwitchOption[];
  defaultValue?: string | number;
}

const SwitchGroup = ({ options, defaultValue }: SwitchGroupProps) => {
  const [selected, setSelected] = useState<string | number>(
    defaultValue ?? options[0]?.value
  );

  return (
    <div className="flex gap-2">
      {options.map((option) => {
        const active = option.value === selected;
        return (
          <button
            key={option.value}
            type="button"
            className={clsx(
              "px-3 py-2 rounded-md",
              active
                ? "bg-[#4b5a9f] text-white shadow-lg shadow-indigo-200"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200 flex-1 "
            )}
            onClick={() => {
              setSelected(option.value);
              option.onClick();
            }}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
};

export default SwitchGroup;
