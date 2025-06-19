import { clsx } from "clsx";
import { useState } from "react";

interface SwitchOption {
  label?: string; // Optional label, falls back to value if not provided
  value: string | undefined;
  onClick?: () => void; // Optional onClick, defaults to no-op if not provided
}

interface SwitchGroupProps {
  options: SwitchOption[];
  defaultValue?: string | number;
  onOptionClick?: (value: string | number) => void; // Callback for when an option is clicked
}

const SwitchGroup = ({
  options,
  defaultValue,
  onOptionClick,
}: SwitchGroupProps) => {
  const [selected, setSelected] = useState<string | number>(
    defaultValue ?? options.find((opt) => opt.value !== undefined)?.value ?? ""
  );

  return (
    <div className="flex gap-2">
      {options
        .filter(
          (option): option is SwitchOption & { value: string } =>
            option.value !== undefined
        )
        .map((option) => {
          const active = option.value === selected;
          return (
            <button
              key={option.value}
              type="button"
              className={clsx(
                "px-3 py-2 rounded-md",
                options.length > 1 ? "flex-1" : "w-full",
                active
                  ? "bg-[#4b5a9f] text-white shadow-lg shadow-indigo-200"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              )}
              onClick={() => {
                setSelected(option.value);
                onOptionClick?.(option.value);
                option.onClick?.();
              }}
            >
              {option.label ?? String(option.value)}
            </button>
          );
        })}
    </div>
  );
};
export default SwitchGroup;
