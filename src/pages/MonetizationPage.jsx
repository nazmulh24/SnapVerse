import React, { useState } from "react";
import {
  BiStar,
  BiCheck,
  BiX,
  BiHistory,
  BiDollarCircle,
} from "react-icons/bi";
import { useNavigate } from "react-router";
import AuthApiClient from "../services/auth-api-client";

const MonetizationPage = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handlePayment = async () => {
    setLoading(true);
    try {
      const response = await AuthApiClient.post(`payment/initiate/`);
      console.log("Payment response:", response);
      if (response.status === 200) {
        window.location.href = response.data.payment_url;
      } else {
        alert("Payment failed");
      }
    } catch (error) {
      console.error("❌ Payment Error Details:");
      console.error("Error:", error);
      console.error("Status:", error.response?.status);
      console.error("Backend Error:", error.response?.data);
      console.error("Message:", error.message);

      alert(
        `Payment failed: ${
          error.response?.data?.detail || error.message || "Unknown error"
        }`
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-6 sm:py-8 md:py-12">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-10 md:mb-12">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-3 sm:mb-4">
            Choose Your Plan
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 px-4">
            Simple pricing for everyone
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 md:gap-8 max-w-5xl mx-auto">
          {/* Free Plan */}
          <div className="bg-white rounded-xl p-4 sm:p-6 md:p-8 border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="text-center mb-6 sm:mb-8">
              <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-gradient-to-r from-gray-400 to-gray-500 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 shadow-lg">
                <BiStar className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-white" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
                Free
              </h3>
              <div className="mb-4">
                <span className="text-3xl sm:text-4xl font-bold text-gray-900">
                  ৳0
                </span>
                <span className="text-gray-500 ml-2 text-sm sm:text-base">
                  /month
                </span>
              </div>
              <p className="text-gray-600 text-sm sm:text-base">
                Perfect for getting started
              </p>
            </div>

            <ul className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
              <li className="flex items-center">
                <BiCheck className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 mr-2 sm:mr-3 flex-shrink-0" />
                <span className="text-gray-700 text-sm sm:text-base">
                  Basic posts & sharing
                </span>
              </li>
              <li className="flex items-center">
                <BiCheck className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 mr-2 sm:mr-3 flex-shrink-0" />
                <span className="text-gray-700 text-sm sm:text-base">
                  Follow up to 100 users
                </span>
              </li>
              <li className="flex items-center">
                <BiCheck className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 mr-2 sm:mr-3 flex-shrink-0" />
                <span className="text-gray-700 text-sm sm:text-base">
                  1GB storage
                </span>
              </li>
              <li className="flex items-center opacity-50">
                <BiX className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 mr-2 sm:mr-3 flex-shrink-0" />
                <span className="text-gray-500 text-sm sm:text-base">
                  HD video uploads
                </span>
              </li>
              <li className="flex items-center opacity-50">
                <BiX className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 mr-2 sm:mr-3 flex-shrink-0" />
                <span className="text-gray-500 text-sm sm:text-base">
                  Analytics
                </span>
              </li>
            </ul>

            <button className="w-full bg-gradient-to-r from-gray-100 to-gray-200 text-gray-500 py-2.5 sm:py-3 rounded-xl font-semibold shadow-md text-sm sm:text-base">
              Current Plan
            </button>
          </div>

          {/* Pro Plan */}
          <div className="bg-white rounded-xl p-4 sm:p-6 md:p-8 border-2 border-blue-500 relative shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 transform">
            <div className="absolute -top-3 sm:-top-4 left-1/2 transform -translate-x-1/2">
              <span className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-3 sm:px-4 md:px-6 py-1 sm:py-2 rounded-full text-xs sm:text-sm font-semibold shadow-lg">
                Recommended
              </span>
            </div>

            <div className="text-center mb-6 sm:mb-8">
              <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 shadow-lg">
                <BiStar className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-white" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
                Pro
              </h3>
              <div className="mb-4">
                <span className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  ৳99
                </span>
                <span className="text-gray-500 ml-2 text-sm sm:text-base">
                  /month
                </span>
              </div>
              <p className="text-gray-600 text-sm sm:text-base">
                For content creators
              </p>
            </div>

            <ul className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
              <li className="flex items-center">
                <BiCheck className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 mr-2 sm:mr-3 flex-shrink-0" />
                <span className="text-gray-700 text-sm sm:text-base">
                  Everything in Free
                </span>
              </li>
              <li className="flex items-center">
                <BiCheck className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 mr-2 sm:mr-3 flex-shrink-0" />
                <span className="text-gray-700 text-sm sm:text-base">
                  Unlimited follows
                </span>
              </li>
              <li className="flex items-center">
                <BiCheck className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 mr-2 sm:mr-3 flex-shrink-0" />
                <span className="text-gray-700 text-sm sm:text-base">
                  HD video uploads
                </span>
              </li>
              <li className="flex items-center">
                <BiCheck className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 mr-2 sm:mr-3 flex-shrink-0" />
                <span className="text-gray-700 text-sm sm:text-base">
                  10GB storage
                </span>
              </li>
              <li className="flex items-center">
                <BiCheck className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 mr-2 sm:mr-3 flex-shrink-0" />
                <span className="text-gray-700 text-sm sm:text-base">
                  Analytics dashboard
                </span>
              </li>
            </ul>

            <button
              onClick={handlePayment}
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-3 sm:py-4 rounded-xl font-semibold hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 text-sm sm:text-base"
            >
              {loading ? "Processing..." : "Upgrade to Pro"}
            </button>
          </div>
        </div>

        {/* Plan Comparison */}
        <div className="mt-8 sm:mt-10 md:mt-12 bg-white rounded-xl p-4 sm:p-6 md:p-8 border border-gray-200 shadow-lg hover:shadow-xl transition-shadow duration-300">
          <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent text-center mb-6 sm:mb-8">
            Plan Comparison
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[500px]">
              <thead>
                <tr className="border-b-2 border-gray-200 bg-gradient-to-r from-gray-50 to-blue-50">
                  <th className="text-left py-4 sm:py-6 px-3 sm:px-6 font-bold text-gray-900 rounded-tl-lg text-sm sm:text-base">
                    Features
                  </th>
                  <th className="text-center py-4 sm:py-6 px-3 sm:px-6 font-bold text-gray-900 text-sm sm:text-base">
                    Free
                  </th>
                  <th className="text-center py-4 sm:py-6 px-3 sm:px-6 font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent rounded-tr-lg text-sm sm:text-base">
                    Pro
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-100 hover:bg-blue-50 transition-colors duration-200">
                  <td className="py-3 sm:py-5 px-3 sm:px-6 text-gray-700 font-medium text-sm sm:text-base">
                    Posts & Sharing
                  </td>
                  <td className="py-3 sm:py-5 px-3 sm:px-6 text-center">
                    <BiCheck className="w-5 h-5 sm:w-6 sm:h-6 text-green-500 mx-auto drop-shadow-sm" />
                  </td>
                  <td className="py-3 sm:py-5 px-3 sm:px-6 text-center">
                    <BiCheck className="w-5 h-5 sm:w-6 sm:h-6 text-green-500 mx-auto drop-shadow-sm" />
                  </td>
                </tr>
                <tr className="border-b border-gray-100 hover:bg-blue-50 transition-colors duration-200">
                  <td className="py-3 sm:py-5 px-3 sm:px-6 text-gray-700 font-medium text-sm sm:text-base">
                    Follow Limit
                  </td>
                  <td className="py-3 sm:py-5 px-3 sm:px-6 text-center text-gray-600 font-semibold text-sm sm:text-base">
                    100 users
                  </td>
                  <td className="py-3 sm:py-5 px-3 sm:px-6 text-center bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent font-bold text-sm sm:text-base">
                    Unlimited
                  </td>
                </tr>
                <tr className="border-b border-gray-100 hover:bg-blue-50 transition-colors duration-200">
                  <td className="py-3 sm:py-5 px-3 sm:px-6 text-gray-700 font-medium text-sm sm:text-base">
                    Storage
                  </td>
                  <td className="py-3 sm:py-5 px-3 sm:px-6 text-center text-gray-600 font-semibold text-sm sm:text-base">
                    1GB
                  </td>
                  <td className="py-3 sm:py-5 px-3 sm:px-6 text-center bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent font-bold text-sm sm:text-base">
                    10GB
                  </td>
                </tr>
                <tr className="border-b border-gray-100 hover:bg-blue-50 transition-colors duration-200">
                  <td className="py-3 sm:py-5 px-3 sm:px-6 text-gray-700 font-medium text-sm sm:text-base">
                    HD Video Uploads
                  </td>
                  <td className="py-3 sm:py-5 px-3 sm:px-6 text-center">
                    <BiX className="w-5 h-5 sm:w-6 sm:h-6 text-red-500 mx-auto drop-shadow-sm" />
                  </td>
                  <td className="py-3 sm:py-5 px-3 sm:px-6 text-center">
                    <BiCheck className="w-5 h-5 sm:w-6 sm:h-6 text-green-500 mx-auto drop-shadow-sm" />
                  </td>
                </tr>
                <tr className="border-b border-gray-100 hover:bg-blue-50 transition-colors duration-200">
                  <td className="py-3 sm:py-5 px-3 sm:px-6 text-gray-700 font-medium text-sm sm:text-base">
                    Analytics Dashboard
                  </td>
                  <td className="py-3 sm:py-5 px-3 sm:px-6 text-center">
                    <BiX className="w-5 h-5 sm:w-6 sm:h-6 text-red-500 mx-auto drop-shadow-sm" />
                  </td>
                  <td className="py-3 sm:py-5 px-3 sm:px-6 text-center">
                    <BiCheck className="w-5 h-5 sm:w-6 sm:h-6 text-green-500 mx-auto drop-shadow-sm" />
                  </td>
                </tr>
                <tr className="bg-gradient-to-r from-gray-50 to-blue-50">
                  <td className="py-4 sm:py-6 px-3 sm:px-6 text-gray-900 font-bold text-base sm:text-lg">
                    Monthly Price
                  </td>
                  <td className="py-4 sm:py-6 px-3 sm:px-6 text-center text-gray-900 font-bold text-lg sm:text-xl">
                    ৳0
                  </td>
                  <td className="py-4 sm:py-6 px-3 sm:px-6 text-center bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent font-bold text-lg sm:text-xl">
                    ৳99
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Purchase History Link Section */}
        <div className="mt-8 sm:mt-10 md:mt-12 bg-white rounded-xl p-6 sm:p-8 md:p-10 border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300">
          <div className="text-center">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 shadow-lg">
              <BiHistory className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-3 sm:mb-4">
              Purchase History
            </h2>
            <p className="text-gray-600 mb-6 sm:mb-8 text-sm sm:text-base max-w-md mx-auto">
              View your complete transaction history, download invoices, and
              track your subscription payments
            </p>
            <button
              onClick={() => navigate("/purchase-history")}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 text-sm sm:text-base inline-flex items-center gap-2"
            >
              <BiHistory className="w-5 h-5" />
              View Purchase History
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MonetizationPage;
