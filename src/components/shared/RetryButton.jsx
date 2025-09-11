import React from "react";

const RetryButton = ({ onRetry, isLoading = false, className = "" }) => {
  return (
    <button
      onClick={onRetry}
      disabled={isLoading}
      className={`btn btn-outline btn-sm gap-2 ${className}`}
      aria-label="Retry request"
    >
      {isLoading ? (
        <>
          <span className="loading loading-spinner loading-xs"></span>
          Retrying...
        </>
      ) : (
        <>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
          Try Again
        </>
      )}
    </button>
  );
};

export default RetryButton;
