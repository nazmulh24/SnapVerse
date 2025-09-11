import RetryButton from "../shared/RetryButton";

const ErrorAlert = ({
  error,
  onRetry,
  isRetrying = false,
  showRetry = false,
}) => {
  // Function to get user-friendly error messages
  const getUserFriendlyMessage = (error) => {
    if (typeof error === "string") {
      // Handle timeout specifically
      if (error.includes("timeout") || error.includes("ECONNABORTED")) {
        return "The request is taking longer than expected. Please check your internet connection and try again.";
      }
      return error;
    }

    // Handle error objects
    if (error && typeof error === "object") {
      // Handle timeout errors
      if (error.code === "ECONNABORTED" || error.message?.includes("timeout")) {
        return "The server is taking too long to respond. Please try again in a moment.";
      }

      // Handle network errors
      if (
        error.message?.includes("Network Error") ||
        error.code === "ERR_NETWORK"
      ) {
        return "Unable to connect to the server. Please check your internet connection.";
      }

      // Handle specific API error messages
      if (error.error) {
        return error.error;
      }

      if (error.message) {
        return error.message;
      }
    }

    return "Something went wrong. Please try again.";
  };

  return (
    <div role="alert" className="alert alert-error">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6 shrink-0 stroke-current"
        fill="none"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
      <div className="flex flex-1 flex-col sm:flex-row sm:items-center sm:justify-between">
        <span>{getUserFriendlyMessage(error)}</span>
        {showRetry && onRetry && (
          <div className="mt-2 sm:mt-0 sm:ml-4">
            <RetryButton onRetry={onRetry} isLoading={isRetrying} />
          </div>
        )}
      </div>
    </div>
  );
};

export default ErrorAlert;
