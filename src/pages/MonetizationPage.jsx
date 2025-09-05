import React from "react";
import { BiStar, BiCheck, BiX } from "react-icons/bi";
import AuthApiClient from "../services/auth-api-client";

const MonetizationPage = () => {
  const handlePayment = async (planName, amount) => {
    try {
      // Create order data for the subscription plan
      const orderData = {
        amount: amount,
        orderId: `plan_${planName.toLowerCase()}_${Date.now()}`,
        numItems: 1,
      };

      const response = await AuthApiClient.post(`payment/initiate/`, {
        amount: orderData.amount,
        orderId: orderData.orderId,
        numItems: orderData.numItems,
      });

      console.log("Payment response:", response);

      if (response.status === 200) {
        // Handle successful payment initiation
        alert(
          `Payment initiated for ${planName} plan. Redirecting to SSLCommerz...`
        );
        // Here you would typically redirect to the payment gateway
        // window.location.href = response.data.payment_url;
      }
    } catch (error) {
      console.error("Payment error:", error);
      alert(
        `Failed to initiate payment for ${planName} plan. Please try again.`
      );
    }
  };

  const handlePurchasePlan = (planName, amount) => {
    handlePayment(planName, amount);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-4">
            Choose Your Plan
          </h1>
          <p className="text-xl text-gray-600">Simple pricing for everyone</p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
          {/* Free Plan */}
          <div className="bg-white rounded-xl p-8 border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-r from-gray-400 to-gray-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <BiStar className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Free</h3>
              <div className="mb-4">
                <span className="text-4xl font-bold text-gray-900">৳0</span>
                <span className="text-gray-500 ml-2">/month</span>
              </div>
              <p className="text-gray-600">Perfect for getting started</p>
            </div>

            <ul className="space-y-4 mb-8">
              <li className="flex items-center">
                <BiCheck className="w-5 h-5 text-green-500 mr-3" />
                <span className="text-gray-700">Basic posts & sharing</span>
              </li>
              <li className="flex items-center">
                <BiCheck className="w-5 h-5 text-green-500 mr-3" />
                <span className="text-gray-700">Follow up to 100 users</span>
              </li>
              <li className="flex items-center">
                <BiCheck className="w-5 h-5 text-green-500 mr-3" />
                <span className="text-gray-700">1GB storage</span>
              </li>
              <li className="flex items-center opacity-50">
                <BiX className="w-5 h-5 text-gray-400 mr-3" />
                <span className="text-gray-500">HD video uploads</span>
              </li>
              <li className="flex items-center opacity-50">
                <BiX className="w-5 h-5 text-gray-400 mr-3" />
                <span className="text-gray-500">Analytics</span>
              </li>
            </ul>

            <button className="w-full bg-gradient-to-r from-gray-100 to-gray-200 text-gray-500 py-3 rounded-xl font-semibold shadow-md">
              Current Plan
            </button>
          </div>

          {/* Pro Plan */}
          <div className="bg-white rounded-xl p-8 border-2 border-blue-500 relative shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 transform">
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
              <span className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-6 py-2 rounded-full text-sm font-semibold shadow-lg">
                Recommended
              </span>
            </div>

            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <BiStar className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Pro</h3>
              <div className="mb-4">
                <span className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  ৳99
                </span>
                <span className="text-gray-500 ml-2">/month</span>
              </div>
              <p className="text-gray-600">For content creators</p>
            </div>

            <ul className="space-y-4 mb-8">
              <li className="flex items-center">
                <BiCheck className="w-5 h-5 text-green-500 mr-3" />
                <span className="text-gray-700">Everything in Free</span>
              </li>
              <li className="flex items-center">
                <BiCheck className="w-5 h-5 text-green-500 mr-3" />
                <span className="text-gray-700">Unlimited follows</span>
              </li>
              <li className="flex items-center">
                <BiCheck className="w-5 h-5 text-green-500 mr-3" />
                <span className="text-gray-700">HD video uploads</span>
              </li>
              <li className="flex items-center">
                <BiCheck className="w-5 h-5 text-green-500 mr-3" />
                <span className="text-gray-700">10GB storage</span>
              </li>
              <li className="flex items-center">
                <BiCheck className="w-5 h-5 text-green-500 mr-3" />
                <span className="text-gray-700">Analytics dashboard</span>
              </li>
            </ul>

            <button
              onClick={() => handlePurchasePlan("Pro", 99)}
              className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-4 rounded-xl font-semibold hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              Upgrade to Pro
            </button>
          </div>
        </div>

        {/* Plan Comparison */}
        <div className="mt-12 bg-white rounded-xl p-8 border border-gray-200 shadow-lg hover:shadow-xl transition-shadow duration-300">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent text-center mb-8">
            Plan Comparison
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-gray-200 bg-gradient-to-r from-gray-50 to-blue-50">
                  <th className="text-left py-6 px-6 font-bold text-gray-900 rounded-tl-lg">
                    Features
                  </th>
                  <th className="text-center py-6 px-6 font-bold text-gray-900">
                    Free
                  </th>
                  <th className="text-center py-6 px-6 font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent rounded-tr-lg">
                    Pro
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-100 hover:bg-blue-50 transition-colors duration-200">
                  <td className="py-5 px-6 text-gray-700 font-medium">
                    Posts & Sharing
                  </td>
                  <td className="py-5 px-6 text-center">
                    <BiCheck className="w-6 h-6 text-green-500 mx-auto drop-shadow-sm" />
                  </td>
                  <td className="py-5 px-6 text-center">
                    <BiCheck className="w-6 h-6 text-green-500 mx-auto drop-shadow-sm" />
                  </td>
                </tr>
                <tr className="border-b border-gray-100 hover:bg-blue-50 transition-colors duration-200">
                  <td className="py-5 px-6 text-gray-700 font-medium">
                    Follow Limit
                  </td>
                  <td className="py-5 px-6 text-center text-gray-600 font-semibold">
                    100 users
                  </td>
                  <td className="py-5 px-6 text-center bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent font-bold">
                    Unlimited
                  </td>
                </tr>
                <tr className="border-b border-gray-100 hover:bg-blue-50 transition-colors duration-200">
                  <td className="py-5 px-6 text-gray-700 font-medium">
                    Storage
                  </td>
                  <td className="py-5 px-6 text-center text-gray-600 font-semibold">
                    1GB
                  </td>
                  <td className="py-5 px-6 text-center bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent font-bold">
                    10GB
                  </td>
                </tr>
                <tr className="border-b border-gray-100 hover:bg-blue-50 transition-colors duration-200">
                  <td className="py-5 px-6 text-gray-700 font-medium">
                    HD Video Uploads
                  </td>
                  <td className="py-5 px-6 text-center">
                    <BiX className="w-6 h-6 text-red-500 mx-auto drop-shadow-sm" />
                  </td>
                  <td className="py-5 px-6 text-center">
                    <BiCheck className="w-6 h-6 text-green-500 mx-auto drop-shadow-sm" />
                  </td>
                </tr>
                <tr className="border-b border-gray-100 hover:bg-blue-50 transition-colors duration-200">
                  <td className="py-5 px-6 text-gray-700 font-medium">
                    Analytics Dashboard
                  </td>
                  <td className="py-5 px-6 text-center">
                    <BiX className="w-6 h-6 text-red-500 mx-auto drop-shadow-sm" />
                  </td>
                  <td className="py-5 px-6 text-center">
                    <BiCheck className="w-6 h-6 text-green-500 mx-auto drop-shadow-sm" />
                  </td>
                </tr>
                <tr className="bg-gradient-to-r from-gray-50 to-blue-50">
                  <td className="py-6 px-6 text-gray-900 font-bold text-lg">
                    Monthly Price
                  </td>
                  <td className="py-6 px-6 text-center text-gray-900 font-bold text-xl">
                    ৳0
                  </td>
                  <td className="py-6 px-6 text-center bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent font-bold text-xl">
                    ৳99
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MonetizationPage;
