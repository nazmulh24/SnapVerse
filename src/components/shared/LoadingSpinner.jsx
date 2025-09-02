import React from "react";

const LoadingSpinner = ({
  size = "md",
  text = "",
  className = "",
  showText = true,
  variant = "primary",
}) => {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-8 h-8",
    xl: "w-12 h-12",
  };

  const colorClasses = {
    primary: "text-purple-600",
    secondary: "text-gray-500",
    white: "text-white",
  };

  return (
    <div
      className={`flex flex-col items-center justify-center py-4 ${className}`}
    >
      <div
        className={`animate-spin rounded-full border-2 border-gray-300 border-t-current ${sizeClasses[size]} ${colorClasses[variant]}`}
        role="status"
        aria-label="Loading"
      >
        <span className="sr-only">Loading...</span>
      </div>
      {showText && (text || "Loading...") && (
        <p className={`mt-2 text-sm ${colorClasses[variant]} font-medium`}>
          {text || "Loading..."}
        </p>
      )}
    </div>
  );
};

export default LoadingSpinner;
