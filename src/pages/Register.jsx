import { useForm } from "react-hook-form";
import { Link } from "react-router";
import useAuthContext from "../hooks/useAuthContext";
import ErrorAlert from "../components/Alert/ErrorAlert";
import SuccessAlert from "../components/Alert/SuccessAlert";
import { useState } from "react";

const Register = () => {
  const { registerUser, resendActivation, errorMsg } = useAuthContext();
  const [successMsg, setSuccessMsg] = useState("");
  const [registeredEmail, setRegisteredEmail] = useState("");
  const [resendLoading, setResendLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  //   const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    const emailData = data.email;
    delete data.confirm_password;

    try {
      const response = await registerUser(data);
      console.log(response);
      if (response.success) {
        setSuccessMsg(response.message);
        setRegisteredEmail(emailData);
      }
    } catch (error) {
      console.log("Registration failed", error);
    }
  };

  const handleResendActivation = async () => {
    setResendLoading(true);
    try {
      const response = await resendActivation(registeredEmail);
      if (response.success) {
        setSuccessMsg(
          "Activation link has been resent to your email address. Please check your inbox."
        );
      }
    } catch (error) {
      console.log("Resend activation failed", error);
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12 bg-base-200">
      <div className="card w-full max-w-md bg-base-100 shadow-xl">
        <div className="card-body">
          {errorMsg && <ErrorAlert error={errorMsg} />}
          {successMsg && <SuccessAlert success={successMsg} />}

          <h2 className="card-title text-2xl font-bold">Sign Up</h2>
          <p className="text-base-content/70">
            Create an account to get started
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
            <div className="form-control">
              <label className="label" htmlFor="first_name">
                <span className="label-text">First Name</span>
              </label>
              <input
                id="first_name"
                type="text"
                placeholder="John"
                className="input input-bordered w-full"
                {...register("first_name", {
                  required: "First Name is Required",
                })}
              />
              {errors.first_name && (
                <span className="label-text-alt text-error">
                  {errors.first_name.message}
                </span>
              )}
            </div>

            <div className="form-control">
              <label className="label" htmlFor="last_name">
                <span className="label-text">Last Name</span>
              </label>
              <input
                id="last_name"
                type="text"
                placeholder="Doe"
                className="input input-bordered w-full"
                {...register("last_name", {
                  required: "Last Name is Required",
                })}
              />
              {errors.last_name && (
                <span className="label-text-alt text-error">
                  {errors.last_name.message}
                </span>
              )}
            </div>

            <div className="form-control">
              <label className="label" htmlFor="username">
                <span className="label-text">User Name</span>
              </label>
              <input
                id="username"
                type="text"
                placeholder="@username"
                className="input input-bordered w-full"
                {...register("username", {
                  required: "User Name is required",
                  minLength: {
                    value: 4,
                    message:
                      "Username must be at least 4 characters (including @)",
                  },
                  maxLength: {
                    value: 21,
                    message:
                      "Username must be at most 21 characters (including @)",
                  },
                  pattern: {
                    value: /^@[a-zA-Z0-9_]{3,20}$/,
                    message:
                      "Username must start with @ and contain only letters, numbers, and underscores (min 3 after @)",
                  },
                })}
              />
              {errors.username && (
                <span className="label-text-alt text-error">
                  {errors.username.message}
                </span>
              )}
            </div>

            <div className="form-control">
              <label className="label" htmlFor="email">
                <span className="label-text">Email</span>
              </label>
              <input
                id="email"
                type="email"
                placeholder="name@example.com"
                className="input input-bordered w-full"
                {...register("email", {
                  required: "Email is Required",
                })}
              />
              {errors.email && (
                <span className="label-text-alt text-error">
                  {errors.email.message}
                </span>
              )}
              {/* <p>Email: {watch("email")}</p> */}
            </div>

            <div className="form-control">
              <label className="label" htmlFor="password">
                <span className="label-text">Password</span>
              </label>
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                className="input input-bordered w-full"
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 8,
                    message: "Password must be at least 8 characters",
                  },
                })}
              />
              {errors.password && (
                <span className="label-text-alt text-error">
                  {errors.password.message}
                </span>
              )}
            </div>

            <div className="form-control">
              <label className="label" htmlFor="confirmPassword">
                <span className="label-text">Confirm Password</span>
              </label>
              <input
                id="confirmPassword"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                className="input input-bordered w-full"
                {...register("confirm_password", {
                  required: "Confirm Password is required",
                  validate: (value) =>
                    value === watch("password") || "Password do not match",
                })}
              />
              {errors.confirm_password && (
                <span className="label-text-alt text-error">
                  {errors.confirm_password.message}
                </span>
              )}
            </div>

            {/* Show Password Checkbox  */}
            <div className="form-control">
              <label className="label cursor-pointer">
                <span className="label-text">Show Password</span>
                <input
                  type="checkbox"
                  className="toggle"
                  checked={showPassword}
                  onChange={() => setShowPassword(!showPassword)}
                />
              </label>
            </div>

            <button type="submit" className="btn btn-primary w-full">
              Register
            </button>
          </form>

          <div className="text-center mt-4">
            <p className="text-base-content/70">
              Already have an account?{" "}
              <Link to="/login" className="link link-primary">
                Sign in
              </Link>
            </p>
            {successMsg && registeredEmail && (
              <div className="mt-4">
                <p className="text-base-content/70 mb-2">
                  Didn't receive the activation email?
                </p>
                <button
                  onClick={handleResendActivation}
                  className="btn btn-outline btn-sm"
                  disabled={resendLoading}
                >
                  {resendLoading ? "Resending..." : "Resend Activation Link"}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
