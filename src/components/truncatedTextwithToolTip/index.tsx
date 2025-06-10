/* eslint-disable @typescript-eslint/no-explicit-any */
import { useRef, useState, useEffect } from "react";

interface IProps {
  label: string;
  value: string;
}

const TruncatedTextWithTooltip = ({ label, value }:IProps) => {
  const textRef = useRef<any>(null);
  const [isOverflowing, setIsOverflowing] = useState(false);

  useEffect(() => {
    if (textRef.current) {
      setIsOverflowing(
        textRef.current.scrollWidth > textRef.current.clientWidth
      );
    }
  }, [value]);

  return (
    <div className="relative group max-w-[180px] cursor-default">
      <span
        ref={textRef}
        className="block overflow-hidden text-ellipsis whitespace-nowrap transition-all duration-300"
      >
        {label} {value}
      </span>

      {isOverflowing && (
        <div className="absolute left-2 top-5 z-20 hidden group-hover:block bg-gray-500 border border-gray-200 shadow-md rounded-md px-2 py-1 text-xs text-white whitespace-normal max-w-xs">
          {value}
        </div>
      )}
    </div>
  );
};

export default TruncatedTextWithTooltip;
