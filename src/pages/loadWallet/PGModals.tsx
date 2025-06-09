import React from "react";
import { ImCross } from "react-icons/im";

const PGModals = ({
    modalVisible,
    modalContent,
    closeModal,
    handlePrint
}) => {
    return (
        <>
            {/* Main Modal */}
            {modalVisible && (
                <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-gray-100 p-8 rounded-xl shadow-lg max-w-4xl max-h-[80vh] overflow-y-auto relative flex flex-col transform transition-transform duration-300 ease-in-out scale-95 hover:scale-100">

                        <button
                            onClick={closeModal}
                            className="absolute top-2 right-2 p-2 text-gray-600 focus:outline-none"
                        >
                            <ImCross />
                        </button>

                        <div className="flex-1 overflow-y-auto">
                            {(() => {
                                try {
                                    const parsed = typeof modalContent === "string"
                                        ? JSON.parse(modalContent)
                                        : modalContent;

                                    const isFailure =
                                        parsed?.apiResponseData?.responseCode === "401" ||
                                        parsed?.apiResponseMessage?.toUpperCase() === "FAILURE";
                                    const isSuccess = 
                                        parsed?.apiResponseData?.responseCode === "200";
                                        // parsed?.apiResponseMessage?.toUpperCase() === "";
                                    if (isFailure|| isSuccess) {
                                        return (
                                            <div className="text-center text-md font-medium text-red-600 mt-3">
                                                <p>Transaction Failed or cancelled.</p>
                                            </div>
                                        );
                                    }


                                } catch (err) {
                                    // Not JSON, assume it's HTML
                                    return <>
                                        <div dangerouslySetInnerHTML={{ __html: modalContent }} />
                                        <div className="text-center">
                                            <button
                                                onClick={handlePrint}
                                                className="mt-4 px-4 py-2 bg-[#4b5a9f] text-white rounded hover:bg-[#4fb5b7] transition-colors self-center mb-4"
                                            >
                                                Print
                                            </button>
                                        </div>

                                    </>
                                }
                            })()
                            }
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default PGModals;