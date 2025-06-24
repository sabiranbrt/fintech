/* eslint-disable @typescript-eslint/no-explicit-any */
import CustomField from "@/components/multiForm/CustomField";
import MultiFormHeader from "@/components/multiForm/multiFormHeader";
import formList from "@/jsonDemo/structure.json";
import clsx from "clsx";
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import ArrowLeft from "@assets/icons/arrowLeft.svg";
import ArrowRight from "@assets/icons/arrowRight.svg";

const RegisterBeneficiary = () => {
  const [index, setIndex] = useState(0);
  //   const dispatch = useDispatch();
  //   const { data: formList, isLoading } = useFormList();
  //   const { mutateAsync } = useSaveForm();

  const methods = useForm<any>({
    mode: "onChange",
  });

  const {trigger, setValue } = methods;

  const mobileNumber = "9842143869";

  const onSubmitForData = () => {
    setValue("mobileNumber", mobileNumber);
  };

  //   const onSubmit = async (formValues: any) => {
  //     localStorage.setItem("dynamicMethod", formList?.dynamicMethod);
  //     dispatch(updateLoading({ isLoading: true }));
  //     try {
  //       const response = await mutateAsync({ ...formValues });
  //       console.log("response", response);
  //     } catch (err) {
  //       console.log("error", err);
  //     }
  //   };

  const render = () => {
    const stepKeys = Object.keys(formList?.dataFields) as Array<
      keyof typeof formList.dataFields
    >;
    const currentKey = stepKeys[index];
    const currentStep = formList.dataFields[currentKey];

    if (!Array.isArray(currentStep)) {
      return currentStep?.displayField?.map((displaylist: any) => (
        <CustomField
          key={displaylist?.key ?? ""}
          names={displaylist?.key ?? ""}
          label={displaylist.label}
          type={displaylist.subType}
          isSearchable={displaylist?.isSearchable}
          OptionFocusColor={displaylist?.OptionFocusColor}
          OptionTextColor={displaylist?.OptionTextColor}
          OptionSelectFocusColor={displaylist?.OptionSelectFocusColor}
          OptionSelectColor={displaylist?.OptionSelectColor}
          imageLink={displaylist?.imageLink}
          placeHoldercolor={displaylist?.placeHoldercolor}
          placeHolderSize={displaylist?.placeHolderSize}
          focusErrorBgColor={displaylist?.focusErrorBgColor}
          focusErrorBorderColor={displaylist?.focusErrorBorderColor}
          placeHolder={displaylist?.placeholder}
          fieldType={displaylist?.fieldType}
          options={displaylist?.dropdownOptions}
          validation={displaylist?.validation}
          onChangeImage={() => {}} // for image formData change
          onClick={onSubmitForData} // for action fetch button auto fill option if available show or not
          ActionFetch={displaylist?.ActionFetch} // autofetch button show or hide according to api request data
        />
      ));
    }

    return null;
  };

  // const statusName = () => {
  //   const stepKeys = Object.keys(formList.dataFields) as Array<
  //     keyof typeof formList.dataFields
  //   >;
  //   const currentKey = stepKeys[index];
  //   const currentStep = formList.dataFields[currentKey];

  //   if (!Array.isArray(currentStep)) {
  //     return (
  //       <h1
  //         className={clsx(
  //           " font-semibold text-[20px] !mb-5 text-[#5081B9] uppercase border-b border-gray-300 !pb-5",
  //           formList.formTitle === "center"
  //             ? "text-center"
  //             : formList.formTitle === "end" && "text-end"
  //         )}
  //       >
  //         {currentStep?.status}
  //       </h1>
  //     );
  //   }

  //   return null;
  // };

  const getCurrentStepFieldNames = (): any[] => {
    const stepKeys = Object.keys(formList?.dataFields ?? {}) as Array<
      keyof typeof formList.dataFields
    >;
    const currentKey = stepKeys[index];
    const currentStep = formList?.dataFields?.[currentKey];

    if (!Array.isArray(currentStep)) {
      return currentStep?.displayField?.map((item: any) => item.key) ?? [];
    }

    return [];
  };

  //   if (isLoading) return <Spinner />;

  return (
      <div className=" min-h-0 h-full">
        <FormProvider {...methods}>
          <div
            className={clsx(
              " h-full flex-row gap-8 min-h-0",
              formList?.layout === "horizontallayout" ? "bg-[#F2F2F2]" : "flex"
            )}
          >
            <div
              className={clsx(
                " relative rounded-md",
                formList?.layout === "horizontallayout"
                  ? "text-center !mb-5"
                  : "w-[20%] !p-10 bg-[#F7F7F7]"
              )}
            >
              {formList?.formType === "multiple" && (
                <div>
                  <MultiFormHeader currentIndex={index} formList={formList} />
                </div>
              )}
            </div>

            <div
              className={clsx(
                " relative flex flex-col gap-5 !px-8 !py-10 h-[400px] overflow-y-auto",
                formList?.layout === "horizontallayout"
                  ? "!mx-10 shadow-xl rounded-md bg-white"
                  : "w-[80%]"
              )}
            >
              <div className=" text-start">
                {/* {statusName()} */}
                <div
                  className="custom-grid overflow-y-auto min-h-0 h-full"
                  style={{
                    gridTemplateColumns: `repeat(${
                      formList?.colGrid ?? 3
                    }, 1fr)`,
                    columnGap: `${formList?.gapCol ?? 20}px`,
                    rowGap: `${formList?.gapRow ?? 40}px`,
                  }}
                >
                  {render()}
                </div>
                <div className="flex items-center justify-end gap-5 !mt-10">
                  {index > 0 && formList?.formType === "multiple" && (
                    <div
                      onClick={() => {
                        setIndex((prev) => prev - 1);
                      }}
                      className=" flex flex-row items-center gap-2 bg-[#5081B9] hover:bg-[#000769] transition-[2000] text-white !px-4 !py-2 rounded cursor-pointer"
                    >
                      <img src={ArrowLeft} className="w-4 h-4" />
                      <p className="">Previous</p>
                    </div>
                  )}
                  {index < Object.keys(formList?.dataFields).length - 1 ? (
                    formList?.formType === "multiple" && (
                      <div
                        onClick={async () => {
                          const fieldsToValidate = getCurrentStepFieldNames();
                          const isStepValid = await trigger(fieldsToValidate);
                          if (isStepValid) {
                            setIndex((prev) => prev + 1);
                          }
                        }}
                        className=" flex flex-row items-center gap-2 bg-[#5081B9] hover:bg-[#000769] transition-[2000] text-white !px-4 !py-2 rounded cursor-pointer"
                      >
                        <p className="">Next</p>
                        <img src={ArrowRight} className="w-4 h-4" />
                      </div>
                    )
                  ) : (
                    <button
                      type="submit"
                      className="bg-[#5081B9] hover:bg-[#000769] transition-[2000] text-white !px-4 !py-2 rounded cursor-pointer"
                      title="Submit Now"
                      onClick={() => {}}
                    >
                      Submit
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </FormProvider>
      </div>
  );
};

export default RegisterBeneficiary;
