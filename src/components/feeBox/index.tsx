import React from "react";
interface IProp{
    title:string
    value: string
}

const FeeBox = ({title,value}:IProp) => {
  return (
    <div className="lg:w-48 text-blue-800 text-sm bg-blue-50 border-l-4 border-blue-500 p-2 rounded-r-md ">
      <p>
        {title}: ₹ {Number(value ?? 0).toFixed(2)}
      </p>
    </div>
  );
};

export default FeeBox;
