import clsx from "clsx";
import { Controller, useFormContext } from "react-hook-form";
import Eye from "@assets/icons/eye-svgrepo-com.svg";
import { ValidationProps } from "@/types";
import { ValidationRules } from "@/utils/ValidationRegister";

interface IProp {
  names: string;
  placeHolder?: string;
  imageLink: string
  ValidClassName?: string;
  validation?: ValidationProps;
}

const Preview = ({ ValidClassName, names, imageLink,validation }: IProp) => {
  const {
    control,
    formState: { errors },
  } = useFormContext();
  return (
    <Controller
      control={control}
      name={names}
      rules={ValidationRules(validation)}
      render={({ field }) => {
        return (
          <div {...field} className="relative">
            <div
              className=" inline-block"
              onClick={() => window.open(`https://${imageLink}`, "_blank")}
            >
              <div className=" bg-[#5081B9] !p-2 flex flex-row items-center gap-1 rounded-md ">
                <p className=" text-white">Preview</p>
                <img src={Eye} className="h-4 w-4" />
              </div>
            </div>
            {errors[names] && (
              <div
                className={clsx(
                  "!mt-0.5",
                  ValidClassName ? ValidClassName : "text-[10px] text-[#f94d44]"
                )}
              >
                <p>{errors[names]?.message as string}</p>
              </div>
            )}
          </div>
        );
      }}
    />
  );
};

export default Preview;
