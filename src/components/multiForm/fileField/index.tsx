/* eslint-disable @typescript-eslint/no-explicit-any */
import clsx from "clsx";
import { useState, useEffect } from "react";
import Dropzone from "react-dropzone";
import { Controller, useFormContext } from "react-hook-form";
import Upload from "@assets/icons/upload.svg";
import File from "@assets/icons/file.svg";
import Cross from "@assets/icons/cross.svg";
import { ValidationProps } from "@/types";
import { ValidationRules } from "@/utils/ValidationRegister";
import PhotoModal from "../photoModal";

interface IProp {
  names: string;
  placeHolder?: string;
  inputHeight?: string;
  inputWidth?: string;
  ValidClassName?: string;
  CrossIcon?: string;
  UploadIcon?: string;
  FileIcon?: string;
  placeHolderSize?: string;
  uploadType?: string;
  textClassName?: string;
  placeHoldercolor?: string;
  labelClassName?: string;
  maxFile?: number;
  validation?: ValidationProps;
  onChangeImage?: (value: string) => void;
}

const FileField = ({
  maxFile = 1,
  uploadType,
  UploadIcon,
  CrossIcon,
  ValidClassName,
  validation,
  inputHeight,
  inputWidth,
  onChangeImage,
  textClassName,
  placeHoldercolor,
  FileIcon,
  placeHolderSize,
  names,
}: IProp) => {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  const [photoModal, setPhotoModal] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [fileType, setFileType] = useState<string>("");

  // Get current form value using watch
  const { watch } = useFormContext();
  const selectedFile = watch(names);

  // Handle preview URL generation
  useEffect(() => {
    if (selectedFile) {
      const url = URL.createObjectURL(selectedFile);
      setPreviewUrl(url);
      setFileType(selectedFile.type);
      return () => URL.revokeObjectURL(url);
    } else {
      setPreviewUrl(null);
      setFileType("");
    }
  }, [selectedFile]);

  const handleRemoveFile = (onChange: (value: any) => void) => {
    setPreviewUrl(null);
    setFileType("");
    onChange(null);
    onChangeImage?.("");
  };

  const acceptOnlyImages = {
    "image/*": [".png", ".jpg", ".jpeg", ".gif"],
  };

  const acceptOnlyPDFs = {
    "application/pdf": [".pdf"],
  };

  const acceptImagesAndPDFs = {
    "image/*": [".png", ".jpg", ".jpeg", ".gif"],
    "application/pdf": [".pdf"],
  };

  // Check if file can be previewed in modal
  const canPreview = (file: File) => {
    return file.type.startsWith("image/") || file.type === "application/pdf";
  };

  return (
    <Controller
      control={control}
      name={names}
      rules={ValidationRules(validation)}
      render={({ field }) => {
        return (
          <div className="relative">
            <div className="flex flex-col items-center">
              <div
                className={clsx(
                  `outline-0 !py-${inputHeight} !px-${inputWidth} md:!p-2 sm:!p-2 w-full`,
                  textClassName
                    ? textClassName
                    : "!px-2 !py-3 rounded-sm border-dotted border-2 border-[#F2F2F2]",
                  `placeholder:text-[${placeHoldercolor}] placeholder:text-[${placeHolderSize}]`
                )}
              >
                <Dropzone
                  onDrop={(acceptedFiles: any) => {
                    if (acceptedFiles.length > 0) {
                      const file = acceptedFiles[0];
                      field.onChange(file);
                      onChangeImage?.(file.name);
                    }
                  }}
                  maxFiles={maxFile}
                  accept={
                    uploadType === "image"
                      ? acceptOnlyImages
                      : uploadType === "pdf"
                      ? acceptOnlyPDFs
                      : acceptImagesAndPDFs
                  }
                >
                  {({ getRootProps, getInputProps }) => (
                    <section>
                      <div
                        {...getRootProps()}
                        className="cursor-pointer hover:opacity-80 transition-opacity"
                      >
                        <input {...getInputProps()} />
                        <label
                          htmlFor="file-upload"
                          className="flex flex-col items-center gap-1.5"
                        >
                          <img
                            src={UploadIcon || Upload}
                            width={50}
                            height={50}
                            alt="Upload icon"
                          />
                          <p className="!p-2 bg-[#5081B9] text-white rounded-md hover:bg-[#3a6ea5] transition-colors">
                            {selectedFile ? "Replace File" : "Upload File"}
                          </p>
                          <p className="text-xs text-gray-500">
                            {selectedFile
                              ? selectedFile.name
                              : "Drag & drop or click to browse"}
                          </p>
                          <p className="text-xs text-gray-500">
                            {`${maxFile}`} file(s) maximum
                          </p>
                        </label>
                      </div>
                    </section>
                  )}
                </Dropzone>
              </div>

              {selectedFile && (
                <div className="flex flex-row items-center justify-between bg-gray-100 p-2 rounded-md !mt-2 w-full max-w-xs">
                  <div
                    className={clsx(
                      "flex flex-row items-center gap-2 overflow-hidden",
                      canPreview(selectedFile) && "cursor-pointer hover:bg-gray-200 rounded p-1 transition-colors"
                    )}
                    onClick={() => {
                      if (canPreview(selectedFile)) {
                        setPhotoModal(true);
                      }
                    }}
                  >
                    <img
                      src={FileIcon || File}
                      width={20}
                      height={20}
                      alt="File icon"
                    />
                    <p className="text-[12px] truncate flex-1">
                      {selectedFile.name}
                    </p>
                    {canPreview(selectedFile) && (
                      <span className="text-xs text-blue-600 ml-1">
                        (click to preview)
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => handleRemoveFile(field.onChange)}
                    className="p-1 hover:bg-gray-200 rounded-full transition-colors"
                    aria-label="Remove file"
                  >
                    <img
                      src={CrossIcon || Cross}
                      width={16}
                      height={16}
                      alt="Remove icon"
                    />
                  </button>
                </div>
              )}
            </div>

            <PhotoModal
              isOpen={photoModal}
              onClose={() => setPhotoModal(false)}
              image={previewUrl}
              fileType={fileType}
              fileName={selectedFile?.name}
            />

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

export default FileField;