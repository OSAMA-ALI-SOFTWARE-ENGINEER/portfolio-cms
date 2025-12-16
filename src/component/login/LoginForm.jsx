import React, { useState, useEffect } from "react";
import FormRow from "../../ui/FormRow";
import { useForm } from "react-hook-form";
import { useLogin } from "./useLogin";
import { Link, useNavigate } from "react-router-dom";
import { useCurrentUser } from "../authentication/useCurrentUser";
import SubPageLoader from "../../ui/SubPageLoader";
import toast from "react-hot-toast";
import PasswordToggle from "../../ui/PasswordToggle";
import { motion } from "framer-motion";

const LoginForm = () => {
  const navigate = useNavigate();
  const { login, isPending } = useLogin();
  const { isAuthenticated, isLoading } = useCurrentUser();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    mode: "onChange", // Enable real-time validation
  });

  const emailValue = watch("email");
  const passwordValue = watch("password");

  // Real-time email validation
  const isEmailValid = 
    emailValue && 
    !errors.email && 
    /\S+@\S+\.\S+/.test(emailValue);

  // Real-time password validation
  const isPasswordValid = passwordValue && !errors.password && passwordValue.length > 0;

  const onSubmit = ({ email, password }) => {
    login({ email, password });
  };

  const onError = (err) => {
    console.log(err);
  };

  // Handle navigation in useEffect to avoid render-time navigation
  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      navigate("/dashboard", { replace: true });
    }
  }, [isAuthenticated, isLoading, navigate]);

  if (isLoading) return <SubPageLoader />;
  if (isAuthenticated) {
    return null; // Return null while redirecting
  }

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      autoComplete="off"
      onSubmit={handleSubmit(onSubmit, onError)}
      className="mx-5 mt-3 w-full space-y-8 rounded-xl bg-gray-100 px-3 py-10 text-gray-500 shadow-shadowTwo dark:bg-[#191b1e] dark:text-white dark:shadow-shadowOne sm:mx-0 sm:max-w-2xl sm:space-y-10 sm:px-8"
    >
      <h2 className="text-center text-2xl font-semibold capitalize text-sky-500 dark:text-sky-300 sm:text-3xl">
        Login to your account
      </h2>

      <FormRow 
        lable="email" 
        error={errors?.email?.message}
        isValid={isEmailValid}
      >
        <input
          type="email"
          placeholder="Enter your email"
          autoComplete="email"
          className={`h-12 w-full rounded-lg border bg-white p-4 pr-12 text-gray-700 shadow-sm outline-none transition-all duration-200 focus:ring-2 dark:bg-[#1a1d23] dark:text-lightText dark:placeholder:text-gray-500 ${
            errors?.email?.message
              ? "border-red-400 focus:border-red-400 focus:ring-red-400/20"
              : isEmailValid
              ? "border-green-400 focus:border-green-400 focus:ring-green-400/20"
              : "border-gray-300 focus:border-sky-500 focus:ring-sky-500/20 dark:border-gray-600"
          }`}
          {...register("email", {
            required: "Email is required",
            pattern: {
              value: /\S+@\S+\.\S+/,
              message: "Please provide a valid email address",
            },
            validate: {
              checkFormat: (value) => {
                if (!value) return true;
                return /\S+@\S+\.\S+/.test(value) || "Invalid email format";
              },
            },
          })}
          disabled={isPending}
        />
      </FormRow>

      <FormRow 
        lable="password" 
        error={errors?.password?.message}
        isValid={isPasswordValid}
      >
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Enter your password"
            autoComplete="current-password"
            className={`h-12 w-full rounded-lg border bg-white p-4 pr-12 text-gray-700 shadow-sm outline-none transition-all duration-200 focus:ring-2 dark:bg-[#1a1d23] dark:text-lightText dark:placeholder:text-gray-500 ${
              errors?.password?.message
                ? "border-red-400 focus:border-red-400 focus:ring-red-400/20"
                : isPasswordValid
                ? "border-green-400 focus:border-green-400 focus:ring-green-400/20"
                : "border-gray-300 focus:border-sky-500 focus:ring-sky-500/20 dark:border-gray-600"
            }`}
            {...register("password", {
              required: "Password is required",
              minLength: {
                value: 1,
                message: "Password cannot be empty",
              },
            })}
            disabled={isPending}
          />
          <PasswordToggle 
            show={showPassword} 
            onToggle={() => setShowPassword(!showPassword)} 
          />
        </div>
      </FormRow>

      <div className="space-y-4">
        <button
          disabled={isPending}
          type="submit"
          className="btn-info btn w-full text-sm transition-all duration-300 hover:scale-[1.02] hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50 sm:text-base"
        >
          {isPending ? (
            <span className="flex items-center justify-center gap-2">
              <svg
                className="h-5 w-5 animate-spin"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Logging in...
            </span>
          ) : (
            "Login"
          )}
        </button>
        <div className="divider text-xs sm:text-sm">OR</div>
      </div>

      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:gap-0">
        <p className="whitespace-nowrap text-sm font-light">
          Don't have an account?
          <Link
            className="link ml-2 font-medium capitalize text-sky-500 transition-colors hover:text-sky-600 dark:text-sky-400 dark:hover:text-sky-300"
            to={"/register"}
          >
            signup
          </Link>
        </p>
        <Link
          className="link text-sm font-medium capitalize text-sky-500 transition-colors hover:text-sky-600 dark:text-sky-400 dark:hover:text-sky-300"
          to={"/forgot-password"}
        >
          forgot password?
        </Link>
      </div>
    </motion.form>
  );
};

export default LoginForm;
