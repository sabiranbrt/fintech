import clsx from "clsx";

interface IProps {
  label: string;
  labelClassName: string;
}

const Label = ({ label, labelClassName }: IProps) => {
  return (
    <div>
      <p
        className={clsx(
          " text-[15px] text-gray-400",
          labelClassName ? labelClassName : "bg-white !p-0.5 rounded-sm"
        )}
      >
        {label}
      </p>
    </div>
  );
};

export default Label;
