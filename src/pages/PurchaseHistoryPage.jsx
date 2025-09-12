import React from "react";
import {
  BiHistory,
  BiCalendar,
  BiDollarCircle,
  BiCheckCircle,
  BiTime,
  BiArrowBack,
} from "react-icons/bi";
import { useNavigate } from "react-router";

const PurchaseHistoryPage = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate("/monetization");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-6 sm:py-8 md:py-12">
        {/* Header */}
        <div className="mb-8 sm:mb-10 md:mb-12">
          <div className="flex items-center gap-4 mb-6">
            <button
              onClick={handleBack}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-all duration-200 hover:bg-gray-100 px-3 py-2 rounded-lg"
            >
              <BiArrowBack className="w-5 h-5" />
              <span className="font-medium">Back to Monetization</span>
            </button>
          </div>

          <div className="text-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-3 sm:mb-4">
              Purchase History
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 px-4">
              Complete overview of your subscription payments
            </p>
          </div>
        </div>

        {/* Purchase History Section */}
        <div className="bg-white rounded-xl p-4 sm:p-6 md:p-8 border border-gray-200 shadow-lg hover:shadow-xl transition-shadow duration-300">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 sm:mb-8 gap-3 sm:gap-0">
            <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
              Transaction History
            </h2>
            <div className="flex items-center text-gray-600">
              <BiHistory className="w-5 h-5 sm:w-6 sm:h-6 mr-2" />
              <span className="text-sm">Last 6 months</span>
            </div>
          </div>

          <div className="space-y-3 sm:space-y-4">
            {/* Demo Purchase Entry 1 */}
            <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-xl p-4 sm:p-6 hover:shadow-md transition-all duration-300">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
                <div className="flex items-center space-x-3 sm:space-x-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center shadow-lg flex-shrink-0">
                    <BiCheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold text-gray-900 text-sm sm:text-base">
                      Pro Plan Subscription
                    </h3>
                    <div className="flex flex-col sm:flex-row sm:items-center text-xs sm:text-sm text-gray-600 mt-1 gap-1 sm:gap-0">
                      <div className="flex items-center">
                        <BiCalendar className="w-3 h-3 sm:w-4 sm:h-4 mr-1 flex-shrink-0" />
                        <span>Dec 15, 2024</span>
                      </div>
                      <span className="hidden sm:inline mx-2">•</span>
                      <span>Monthly Plan</span>
                    </div>
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="text-lg sm:text-xl font-bold text-green-600">
                    ৳99.00
                  </div>
                  <div className="text-xs sm:text-sm text-gray-500">
                    Payment ID: #PAY-2024-001
                  </div>
                </div>
              </div>
              <div className="mt-3 sm:mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-0 text-xs sm:text-sm">
                <div className="flex items-center text-green-600">
                  <BiCheckCircle className="w-3 h-3 sm:w-4 sm:h-4 mr-1 flex-shrink-0" />
                  <span>Payment Successful</span>
                </div>
                <div className="text-gray-500">Expires: Jan 15, 2025</div>
              </div>
            </div>

            {/* Demo Purchase Entry 2 */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-4 sm:p-6 hover:shadow-md transition-all duration-300">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
                <div className="flex items-center space-x-3 sm:space-x-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full flex items-center justify-center shadow-lg flex-shrink-0">
                    <BiCheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold text-gray-900 text-sm sm:text-base">
                      Pro Plan Subscription
                    </h3>
                    <div className="flex flex-col sm:flex-row sm:items-center text-xs sm:text-sm text-gray-600 mt-1 gap-1 sm:gap-0">
                      <div className="flex items-center">
                        <BiCalendar className="w-3 h-3 sm:w-4 sm:h-4 mr-1 flex-shrink-0" />
                        <span>Nov 15, 2024</span>
                      </div>
                      <span className="hidden sm:inline mx-2">•</span>
                      <span>Monthly Plan</span>
                    </div>
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="text-lg sm:text-xl font-bold text-blue-600">
                    ৳99.00
                  </div>
                  <div className="text-xs sm:text-sm text-gray-500">
                    Payment ID: #PAY-2024-002
                  </div>
                </div>
              </div>
              <div className="mt-3 sm:mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-0 text-xs sm:text-sm">
                <div className="flex items-center text-blue-600">
                  <BiCheckCircle className="w-3 h-3 sm:w-4 sm:h-4 mr-1 flex-shrink-0" />
                  <span>Payment Successful</span>
                </div>
                <div className="text-gray-500">Expired: Dec 15, 2024</div>
              </div>
            </div>

            {/* Demo Purchase Entry 3 */}
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-xl p-4 sm:p-6 hover:shadow-md transition-all duration-300">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
                <div className="flex items-center space-x-3 sm:space-x-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full flex items-center justify-center shadow-lg flex-shrink-0">
                    <BiCheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold text-gray-900 text-sm sm:text-base">
                      Pro Plan Subscription
                    </h3>
                    <div className="flex flex-col sm:flex-row sm:items-center text-xs sm:text-sm text-gray-600 mt-1 gap-1 sm:gap-0">
                      <div className="flex items-center">
                        <BiCalendar className="w-3 h-3 sm:w-4 sm:h-4 mr-1 flex-shrink-0" />
                        <span>Oct 15, 2024</span>
                      </div>
                      <span className="hidden sm:inline mx-2">•</span>
                      <span>Monthly Plan</span>
                    </div>
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="text-lg sm:text-xl font-bold text-purple-600">
                    ৳99.00
                  </div>
                  <div className="text-xs sm:text-sm text-gray-500">
                    Payment ID: #PAY-2024-003
                  </div>
                </div>
              </div>
              <div className="mt-3 sm:mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-0 text-xs sm:text-sm">
                <div className="flex items-center text-purple-600">
                  <BiCheckCircle className="w-3 h-3 sm:w-4 sm:h-4 mr-1 flex-shrink-0" />
                  <span>Payment Successful</span>
                </div>
                <div className="text-gray-500">Expired: Nov 15, 2024</div>
              </div>
            </div>

            {/* Demo Purchase Entry 4 - First Purchase */}
            <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-xl p-4 sm:p-6 hover:shadow-md transition-all duration-300">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
                <div className="flex items-center space-x-3 sm:space-x-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg flex-shrink-0">
                    <BiCheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold text-gray-900 text-sm sm:text-base">
                      Pro Plan Subscription
                    </h3>
                    <div className="flex flex-col sm:flex-row sm:items-center text-xs sm:text-sm text-gray-600 mt-1 gap-1 sm:gap-0">
                      <div className="flex items-center">
                        <BiCalendar className="w-3 h-3 sm:w-4 sm:h-4 mr-1 flex-shrink-0" />
                        <span>Sep 15, 2024</span>
                      </div>
                      <span className="hidden sm:inline mx-2">•</span>
                      <span>First Purchase 🎉</span>
                    </div>
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="text-lg sm:text-xl font-bold text-orange-600">
                    ৳99.00
                  </div>
                  <div className="text-xs sm:text-sm text-gray-500">
                    Payment ID: #PAY-2024-004
                  </div>
                </div>
              </div>
              <div className="mt-3 sm:mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-0 text-xs sm:text-sm">
                <div className="flex items-center text-orange-600">
                  <BiCheckCircle className="w-3 h-3 sm:w-4 sm:h-4 mr-1 flex-shrink-0" />
                  <span>Payment Successful</span>
                </div>
                <div className="text-gray-500">Expired: Oct 15, 2024</div>
              </div>
            </div>
          </div>

          {/* Summary Stats */}
          <div className="mt-6 sm:mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-4 sm:p-6 text-center">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-3 shadow-lg">
                <BiDollarCircle className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <div className="text-xl sm:text-2xl font-bold text-green-600">
                ৳396
              </div>
              <div className="text-xs sm:text-sm text-gray-600">
                Total Spent
              </div>
            </div>

            <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 rounded-xl p-4 sm:p-6 text-center">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-blue-400 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-3 shadow-lg">
                <BiHistory className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <div className="text-xl sm:text-2xl font-bold text-blue-600">
                4
              </div>
              <div className="text-xs sm:text-sm text-gray-600">
                Total Purchases
              </div>
            </div>

            <div className="bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200 rounded-xl p-4 sm:p-6 text-center sm:col-span-2 lg:col-span-1">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-purple-400 to-indigo-500 rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-3 shadow-lg">
                <BiTime className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <div className="text-xl sm:text-2xl font-bold text-purple-600">
                4
              </div>
              <div className="text-xs sm:text-sm text-gray-600">
                Months Active
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-gradient-to-r from-gray-600 to-gray-700 text-white px-6 sm:px-8 py-2.5 sm:py-3 rounded-xl font-semibold hover:from-gray-700 hover:to-gray-800 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 text-sm sm:text-base">
              Download All Invoices
            </button>
            <button className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 sm:px-8 py-2.5 sm:py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 text-sm sm:text-base">
              Export to PDF
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PurchaseHistoryPage;
