import React from "react";
import { Link } from "react-router";

const Logo = ({ className = "" }) => {
  return (
    <div className={`p-6 border-b border-gray-100 ${className}`}>
      <Link to="/" className="flex items-center space-x-2">
        <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          SnapVerse
        </span>
      </Link>
    </div>
  );
};

export default Logo;
