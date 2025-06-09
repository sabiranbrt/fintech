import React from "react";
import { useEffect, useState } from "react";
import interceptor from "@/services/interceptor";
import { toast } from "react-toastify";
import Loader from "../LoaderComponent";

const LeftSection = ({ merchantData, slabDetails}) => {
    return (
        <div className="p-2 space-y-2">
            {/* Merchant Details */}
            <div className="bg-gray-50 rounded-xl p-2">
                <h2 className="text-sm font-medium text-gray-600 justify-center mb-1">Merchant Details</h2>
                 <div className="space-y-2 r">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p className="text-sm text-gray-500">Agent Name</p>
                            <p className="text-sm font-medium text-gray-800">
                                {merchantData.name_as_per_aadhaar || "N/A"}
                            </p>    
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Agent Phone</p>
                            <p className="text-sm font-medium text-gray-800">
                                {merchantData.user_mobile || "N/A"}
                            </p>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p className="text-sm text-gray-500">Agent Email</p>
                            <p className="text-sm font-medium text-gray-800">
                                {merchantData.email_id || "N/A"}
                            </p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Business Name</p>
                            <p className="text-sm font-medium text-gray-800">
                                {merchantData.business_name || "N/A"}
                            </p>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p className="text-sm text-gray-500">Business State</p>
                            <p className="text-sm font-medium text-gray-800">
                                {merchantData.business_state || "N/A"}
                            </p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Business Pin Code</p>
                            <p className="text-sm font-medium text-gray-800">
                                {merchantData.business_pin_code || "N/A"}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Slab Section */}
            <div className="bg-gray-50 rounded-xl p-2">
                    <div className="max-h-[200px] overflow-y-auto mt-3">
                        <table className="w-full text-xs">
                            <thead>
                                <tr className="bg-gray-50">
                                    <th className="p-1 text-left">Slab</th>
                                    <th className="p-1 text-left">Range</th>
                                    <th className="p-1 text-left">Charges</th>
                                    <th className="p-1 text-left">GST</th>
                                </tr>
                            </thead>
                            <tbody>
                                {slabDetails?.map((item, index) => (
                                    <tr key={index} className="border-b last:border-b-0">
                                        <td className="p-1">{item.slabSequence}</td>
                                        <td className="p-1">
                                            ₹{item.minTxnValue} - ₹{item.maxTxnValue}
                                        </td>
                                        <td className="p-1">
                                            {item.calculationType === "PERCENTAGE"
                                                ? `${item.charges}`
                                                : `₹${item.charges}`}
                                        </td>
                                        <td className="p-1">{item.gst}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
            </div>
        </div>
    );
};

export default LeftSection;