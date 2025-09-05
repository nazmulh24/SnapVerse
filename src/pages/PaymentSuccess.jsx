import { Link } from "react-router";

const PaymentSuccess = () => {
  return (
    <div>
      <h1>Payment Successful!</h1>
      <p>Your payment has been processed successfully.</p>
      <span>
        Return to{" "}
        <Link to="/monetization" className="text-blue-500 hover:underline">
          Monitization
        </Link>
      </span>
    </div>
  );
};

export default PaymentSuccess;
