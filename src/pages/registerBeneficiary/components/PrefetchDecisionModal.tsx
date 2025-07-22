import { RxCross2 } from "react-icons/rx";

interface IProps {
  isOpen: boolean;
  onReKYC: () => void;
  onProceed: () => void;
  onClose: () => void;
  form: string;
}

const PrefetchDecisionModal = ({
  isOpen,
  onReKYC,
  onProceed,
  onClose,
  form,
}: IProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            {form === "beneficiary" ? "Beneficiary" : "Form"} Verification
            Required
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <RxCross2 size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <p className="text-gray-600 mb-6">
            Your verification status needs to be updated to proceed with this
            action. Please choose how you'd like to continue.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-row items-center gap-4">
            {/* Re-KYC Button */}
            <button
              onClick={() => {
                onReKYC();
                onClose();
              }}
              className="w-full flex items-center justify-center gap-3 bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg transition-colors duration-200 font-medium"
            >
              <div className="text-left">
                <div className="font-medium">Re-verify Identity</div>
                <div className="text-sm text-blue-100">
                  Complete KYC verification process
                </div>
              </div>
            </button>

            {/* Proceed Button */}
            <button
              onClick={() => {
                onProceed();
                onClose();
              }}
              className="w-full flex items-center justify-center gap-3 bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-lg transition-colors duration-200 font-medium"
            >
              <div className="text-left">
                <div className="font-medium">Proceed to Next Step</div>
                <div className="text-sm text-green-100">
                  Continue with current verification
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrefetchDecisionModal;
