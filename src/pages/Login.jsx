import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router";
import useAuthContext from "../hooks/useAuthContext";
import ErrorAlert from "../components/Alert/ErrorAlert";
import { useState } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const navigate = useNavigate();
  const { errorMsg, loginUser, resendActivation } = useAuthContext();

  // State management
  const [loading, setLoading] = useState(false);
  const [needsActivation, setNeedsActivation] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [resendLoading, setResendLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Form submission handler
  const onSubmit = async (data) => {
    setLoading(true);
    setNeedsActivation(false);

    try {
      const result = await loginUser(data);

      if (result.success) {
        navigate("/");
      } else if (result.needsActivation) {
        setNeedsActivation(true);
        setUserEmail(result.email);
      } else if (result.needsRegistration) {
        navigate("/register");
      }
    } catch (error) {
      console.error("Login Failed", error);
    } finally {
      setLoading(false);
    }
  };

  // Resend activation handler
  const handleResendActivation = async () => {
    setResendLoading(true);

    try {
      await resendActivation(userEmail);
      setNeedsActivation(false);
    } catch (error) {
      console.error("Resend activation failed", error);
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12 bg-base-200">
      <div className="card w-full max-w-md bg-base-100 shadow-xl">
        <div className="card-body">
          {/* Error Alert */}
          {errorMsg && <ErrorAlert error={errorMsg} />}

          {/* Header */}
          <h2 className="card-title text-2xl font-bold">Sign in</h2>
          <p className="text-base-content/70">
            Enter your email and password to access your account
          </p>

          {/* Login Form */}
          <form className="space-y-4 mt-4" onSubmit={handleSubmit(onSubmit)}>
            {/* Email Field */}
            <div className="form-control">
              <label className="label" htmlFor="email">
                <span className="label-text">Email</span>
              </label>
              <input
                id="email"
                type="email"
                placeholder="name@example.com"
                className={`input input-bordered w-full ${
                  errors.email ? "input-error" : ""
                }`}
                {...register("email", { required: "Email is required" })}
              />
              {errors.email && (
                <span className="label-text-alt text-error">
                  {errors.email.message}
                </span>
              )}
            </div>

            {/* Password Field */}
            <div className="form-control">
              <label className="label" htmlFor="password">
                <span className="label-text">Password</span>
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className={`input input-bordered w-full pr-12 ${
                    errors.password ? "input-error" : ""
                  }`}
                  {...register("password", {
                    required: "Password is required",
                  })}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 px-3 flex items-center hover:bg-transparent focus:outline-none z-10"
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <AiOutlineEyeInvisible className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  ) : (
                    <AiOutlineEye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </div>
              {errors.password && (
                <span className="label-text-alt text-error">
                  {errors.password.message}
                </span>
              )}
            </div>

            {/* Forgot Password Link */}
            <div className="text-base-content/70 text-center">
              <Link to="/forgot-password" className="link link-primary">
                Forgot your password?
              </Link>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              className="btn btn-primary w-full"
              disabled={loading}
            >
              {loading ? "Logging In..." : "Login"}
            </button>
          </form>

          {/* Activation Warning Box */}
          {needsActivation && (
            <div className="mt-4 p-4 bg-warning/10 border border-warning/20 rounded-lg">
              <p className="text-sm text-center mb-3">
                <strong>Login failed.</strong> This could be due to:
              </p>
              <ul className="text-xs text-left mb-3 space-y-1">
                <li>• Incorrect email or password</li>
                <li>• Account not activated yet</li>
                <li>• Email not registered</li>
              </ul>
              <button
                onClick={handleResendActivation}
                className="btn btn-warning w-full"
                disabled={resendLoading}
              >
                {resendLoading ? "Sending..." : "Resend Activation Email"}
              </button>
            </div>
          )}

          {/* Register Link */}
          <div className="text-center mt-4">
            <p className="text-base-content/70">
              Don&apos;t have an account?{" "}
              <Link to="/register" className="link link-primary">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
