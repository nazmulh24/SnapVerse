import React from "react";
import { MdArrowBack } from "react-icons/md";

const AccountHeader = ({ onBack }) => {
  return (
    <div className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
        <button
          onClick={onBack}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <MdArrowBack className="w-6 h-6 text-gray-600" />
        </button>
        <h1 className="text-lg font-semibold text-gray-900">Account</h1>
        <div className="w-10"></div> {/* Spacer */}
      </div>
    </div>
  );
};

export default AccountHeader;
