/* eslint-disable @typescript-eslint/no-explicit-any */
import { MdOutlinePending } from "react-icons/md";

interface IProps {
  showBankAcc?: boolean;
  senderData: any;
}

const SenderDetails = ({ showBankAcc = true, senderData }: IProps) => {

  return (
    <>
      {senderData ? (
        <div className=" mt-4 h-full rounded-xl bg-white w-full">
          <div className="bg-gradient-to-r from-[#4b5a9f] to-[#4fb5b7] p-4 rounded-t-xl text-white">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                <span className="text-blue-600 text-lg font-bold uppercase">
                  {senderData?.firstName?.charAt(0) || "N"}
                  {senderData?.lastName?.charAt(0) || "A"}
                </span>
              </div>
              <div>
                <h3 className="text-lg font-semibold capitalize">
                  {senderData?.firstName || senderData?.name || ""}{" "}
                  {senderData?.lastName || ""}
                </h3>
                <p className="text-sm font-light capitalize">
                  {senderData?.mobile_no || ""}
                </p>
                {showBankAcc && (
                  <div className=" bg-gray-100 rounded-md justify-center px-2">
                    {senderData?.accountVerificationStage?.toLowerCase() !==
                      "completed" && (
                      <p className="flex items-center text-orange-600 py-1">
                        <MdOutlinePending className="w-4 h-4" />
                        <span className="text-sm ml-1">KYC Pending</span>
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="p-4 mb-2">
            <div className="grid grid-cols-1 gap-3">
              <div className="flex items-start space-x-2">
                <p className="font-semibold">Full Name:</p>
                <p className="capitalize">
                  {senderData?.firstName || senderData?.name || "N/A"}{" "}
                  {senderData?.middleName} {senderData?.lastName}
                </p>
              </div>

              {showBankAcc && (
                <div className="flex items-start space-x-2">
                  <p className="font-semibold">Bank Acct:</p>
                  <p>{senderData?.accountNumber || "N/A"}</p>
                </div>
              )}

              <div className="flex items-start space-x-2">
                <p className="font-semibold">Mobile No:</p>
                <p>
                  {senderData?.mobileNumber || senderData?.mobileNumber || "N/A"}
                </p>
              </div>
              <div className="flex items-start space-x-2">
                <p className="font-semibold">Pan:</p>
                <p>{senderData?.pan || "N/A"}</p>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
};
export default SenderDetails;
