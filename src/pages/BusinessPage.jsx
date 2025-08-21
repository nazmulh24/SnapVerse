import React from "react";
import { BiBriefcase, BiRocket, BiHeart, BiTime } from "react-icons/bi";
import { AiOutlineWarning, AiFillStar } from "react-icons/ai";
import { HiOutlineEmojiHappy } from "react-icons/hi";
import { RiWifiOffLine } from "react-icons/ri";

const BusinessPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-yellow-50 flex items-center justify-center p-4">
      <div className="max-w-lg w-full bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/20 p-8 text-center">
        {/* Main Icon with Animation */}
        <div className="mb-8 relative">
          <div className="w-24 h-24 bg-gradient-to-r from-green-400 to-blue-400 rounded-full flex items-center justify-center mx-auto shadow-lg transform hover:scale-110 transition-transform duration-300">
            <BiBriefcase className="w-12 h-12 text-white" />
          </div>
          {/* Floating stars */}
          <AiFillStar className="absolute top-0 right-8 w-6 h-6 text-yellow-400 animate-pulse" />
          <AiFillStar className="absolute bottom-2 left-6 w-4 h-4 text-green-400 animate-bounce" />
        </div>

        {/* Title with Gradient */}
        <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent mb-4">
          Business Coming Soon!
        </h1>

        {/* Subtitle */}
        <p className="text-gray-600 mb-8 leading-relaxed text-lg">
          We're working on a Business feature to help you grow and manage your
          brand. Stay tuned for more business tools! 💼
        </p>

        {/* Enhanced Status Cards */}
        <div className="space-y-4 mb-8">
          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200/50 rounded-xl p-4 transform hover:scale-105 transition-transform duration-200">
            <div className="flex items-center justify-center space-x-3">
              <AiOutlineWarning className="w-5 h-5 text-yellow-600" />
              <span className="text-yellow-700 font-medium">
                Feature Under Construction
              </span>
            </div>
          </div>

          <div className="bg-gradient-to-r from-red-50 to-pink-50 border border-red-200/50 rounded-xl p-4 transform hover:scale-105 transition-transform duration-200">
            <div className="flex items-center justify-center space-x-3">
              <RiWifiOffLine className="w-5 h-5 text-red-600" />
              <span className="text-red-700 font-medium">
                API Integration Pending
              </span>
            </div>
          </div>

          <div className="bg-gradient-to-r from-blue-50 to-green-50 border border-blue-200/50 rounded-xl p-4 transform hover:scale-105 transition-transform duration-200">
            <div className="flex items-center justify-center space-x-3">
              <BiRocket className="w-5 h-5 text-blue-600" />
              <span className="text-blue-700 font-medium">
                Launching Very Soon
              </span>
            </div>
          </div>
        </div>

        {/* Enhanced Fun Message */}
        <div className="bg-gradient-to-r from-green-100 via-blue-100 to-yellow-100 rounded-xl p-5 mb-8 border border-green-200/50">
          <div className="flex items-center justify-center mb-2">
            <HiOutlineEmojiHappy className="w-6 h-6 text-green-600 mr-2" />
            <span className="font-bold text-green-700 text-lg">
              Meanwhile...
            </span>
          </div>
          <p className="text-green-700">
            Why not check out trending posts and reels? More business features
            are coming soon!
          </p>
          <div className="flex items-center justify-center mt-3 space-x-2">
            <BiHeart className="w-5 h-5 text-blue-500 animate-pulse" />
            <span className="text-sm text-green-600 font-medium">
              Made with love
            </span>
            <BiHeart className="w-5 h-5 text-blue-500 animate-pulse" />
          </div>
        </div>

        {/* Enhanced Loading Section */}
        <div className="bg-gray-50 rounded-xl p-6">
          <div className="flex items-center justify-center space-x-3 mb-3">
            <BiTime className="w-5 h-5 text-gray-500" />
            <span className="text-gray-600 font-medium">
              Development Status
            </span>
          </div>
          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
            <div className="bg-gradient-to-r from-green-400 to-blue-400 h-2 rounded-full w-1/16 animate-pulse"></div>
          </div>
          {/* Animated Dots */}
          <div className="flex items-center justify-center space-x-2 mb-3">
            <div className="w-3 h-3 bg-gradient-to-r from-green-400 to-blue-400 rounded-full animate-bounce"></div>
            <div
              className="w-3 h-3 bg-gradient-to-r from-green-400 to-blue-400 rounded-full animate-bounce"
              style={{ animationDelay: "0.1s" }}
            ></div>
            <div
              className="w-3 h-3 bg-gradient-to-r from-green-400 to-blue-400 rounded-full animate-bounce"
              style={{ animationDelay: "0.2s" }}
            ></div>
          </div>
          <p className="text-sm text-gray-500 font-medium">
            Building something incredible...
          </p>
          <p className="text-xs text-gray-400 mt-1">0% Complete</p>
        </div>
      </div>
    </div>
  );
};

export default BusinessPage;
