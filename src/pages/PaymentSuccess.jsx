import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router";
import {
  BiCheck,
  BiX,
  BiStar,
  BiChevronRight,
  BiDownload,
  BiShareAlt,
} from "react-icons/bi";

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const [paymentStatus, setPaymentStatus] = useState("loading");
  const [paymentData, setPaymentData] = useState({});
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    // Get payment data from URL parameters
    const status = searchParams.get("status");
    const orderId = searchParams.get("tran_id");
    const amount = searchParams.get("amount");
    const planName = searchParams.get("plan_name");

    setPaymentData({
      status,
      orderId,
      amount,
      planName,
    });

    // Set payment status based on URL params
    if (status === "VALID" || status === "VALIDATED") {
      setPaymentStatus("success");
      setShowConfetti(true);
    } else if (status === "FAILED" || status === "CANCELLED") {
      setPaymentStatus("failed");
    } else {
      setPaymentStatus("success"); // Default for demo
      setShowConfetti(true);
    }
  }, [searchParams]);

  if (paymentStatus === "loading") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Processing payment...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
        <div className="absolute top-40 right-20 w-72 h-72 bg-indigo-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse delay-2000"></div>
        <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse delay-4000"></div>
      </div>

      {/* Confetti Effect */}
      {showConfetti && paymentStatus === "success" && (
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-bounce"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 2}s`,
              }}
            >
              <div
                className={`w-2 h-2 rounded-full ${
                  [
                    "bg-blue-500",
                    "bg-indigo-500",
                    "bg-purple-500",
                    "bg-green-500",
                    "bg-yellow-500",
                  ][Math.floor(Math.random() * 5)]
                }`}
              ></div>
            </div>
          ))}
        </div>
      )}

      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <div className="max-w-md w-full">
          {paymentStatus === "success" ? (
            <div className="bg-white rounded-3xl shadow-2xl p-8 text-center border border-gray-100 backdrop-blur-sm">
              {/* Success Icon */}
              <div className="relative mb-8">
                <div className="w-24 h-24 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto shadow-2xl transform hover:scale-105 transition-transform duration-300">
                  <BiCheck className="w-12 h-12 text-white animate-pulse" />
                </div>
                <div className="absolute -top-2 -right-2">
                  <div className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center shadow-lg">
                    <BiStar className="w-4 h-4 text-yellow-800" />
                  </div>
                </div>
              </div>

              {/* Success Message */}
              <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-green-700 bg-clip-text text-transparent mb-3">
                Payment Successful!
              </h1>
              <p className="text-gray-600 mb-8 text-lg">
                Welcome to the Pro experience! Your upgrade has been processed
                successfully.
              </p>

              {/* Payment Details Card */}
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6 mb-8 border border-gray-200">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="text-left">
                    <p className="text-gray-500 font-medium">Plan</p>
                    <p className="font-bold text-gray-900">
                      {paymentData.planName || "Pro"} Plan
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-gray-500 font-medium">Amount</p>
                    <p className="font-bold text-gray-900">
                      ৳{paymentData.amount || "99"}
                    </p>
                  </div>
                  {paymentData.orderId && (
                    <div className="col-span-2 pt-4 border-t border-gray-200">
                      <p className="text-gray-500 font-medium text-center">
                        Transaction ID
                      </p>
                      <p className="font-mono text-xs text-gray-700 bg-gray-200 rounded-lg px-3 py-2 mt-1">
                        {paymentData.orderId}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-4">
                <Link
                  to="/"
                  className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-4 rounded-xl font-semibold hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center space-x-2"
                >
                  <span>Start Using Pro Features</span>
                  <BiChevronRight className="w-5 h-5" />
                </Link>

                <div className="flex space-x-3">
                  <button className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl font-medium hover:bg-gray-200 transition-colors duration-200 flex items-center justify-center space-x-2">
                    <BiDownload className="w-4 h-4" />
                    <span>Receipt</span>
                  </button>
                  <button className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl font-medium hover:bg-gray-200 transition-colors duration-200 flex items-center justify-center space-x-2">
                    <BiShareAlt className="w-4 h-4" />
                    <span>Share</span>
                  </button>
                </div>

                <Link
                  to="/monetization"
                  className="block text-gray-500 hover:text-gray-700 transition-colors duration-200 text-sm underline"
                >
                  Return to Monetization
                </Link>
              </div>

              {/* Pro Features Preview */}
              <div className="mt-8 p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border border-blue-100">
                <h3 className="font-semibold text-gray-900 mb-3">
                  🎉 You now have access to:
                </h3>
                <ul className="text-sm text-gray-700 space-y-2">
                  <li className="flex items-center space-x-2">
                    <BiCheck className="w-4 h-4 text-green-500" />
                    <span>HD video uploads</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <BiCheck className="w-4 h-4 text-green-500" />
                    <span>Analytics dashboard</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <BiCheck className="w-4 h-4 text-green-500" />
                    <span>Unlimited follows</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <BiCheck className="w-4 h-4 text-green-500" />
                    <span>10GB storage</span>
                  </li>
                </ul>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-3xl shadow-2xl p-8 text-center border border-gray-100">
              {/* Error Icon */}
              <div className="w-24 h-24 bg-gradient-to-br from-red-400 to-red-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl">
                <BiX className="w-12 h-12 text-white" />
              </div>

              {/* Error Message */}
              <h1 className="text-3xl font-bold text-red-600 mb-3">
                Payment Failed
              </h1>
              <p className="text-gray-600 mb-8 text-lg">
                Unfortunately, we couldn't process your payment. Please try
                again.
              </p>

              {/* Action Buttons */}
              <div className="space-y-4">
                <Link
                  to="/monetization"
                  className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-4 rounded-xl font-semibold hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center space-x-2"
                >
                  <span>Try Again</span>
                </Link>

                <Link
                  to="/"
                  className="block text-gray-500 hover:text-gray-700 transition-colors duration-200 text-sm underline"
                >
                  Return to Home
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;
