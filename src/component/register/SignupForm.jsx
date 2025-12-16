import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import FormRow from "../../ui/FormRow";
import { useCreateUser } from "./useCreateUser";
import PasswordToggle from "../../ui/PasswordToggle";
import { calculatePasswordStrength } from "../../helper/passwordStrength";
import { motion } from "framer-motion";

const SignupForm = () => {
  const navigate = useNavigate();
  const { createUser, isCreating } = useCreateUser();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
    getValues,
  } = useForm({
    mode: "onChange", // Enable real-time validation
  });

  const nameValue = watch("name");
  const emailValue = watch("email");
  const passwordValue = watch("password");
  const confirmPasswordValue = watch("confirmPassword");

  // Calculate password strength in real-time
  const passwordStrength = calculatePasswordStrength(passwordValue);

  // Real-time validation states
  const isNameValid = nameValue && !errors.name && nameValue.length >= 2;
  const isEmailValid = 
    emailValue && 
    !errors.email && 
    /\S+@\S+\.\S+/.test(emailValue);
  
  const isPasswordValid = 
    passwordValue && 
    !errors.password && 
    passwordValue.length >= 6;
  
  const isConfirmPasswordValid = 
    confirmPasswordValue && 
    !errors.confirmPassword && 
    confirmPasswordValue === passwordValue;

  const onSubmit = ({ name, email, password }) => {
    createUser(
      { name, email, password },
      {
        onSuccess: () => {
          reset();
          navigate("/", { replace: true });
        },
      },
    );
  };

  const onError = (err) => {
    console.log(err);
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      onSubmit={handleSubmit(onSubmit, onError)}
      className="mx-3 grid w-full grid-cols-1 gap-y-8 rounded-xl bg-gray-100 px-8 py-6 text-gray-500 shadow-shadowTwo dark:bg-[#191b1e] dark:text-white dark:shadow-shadowOne sm:mx-0 sm:w-3/5 sm:gap-y-10"
    >
      <h2 className="mb-3 text-center text-2xl font-semibold capitalize text-sky-500 dark:text-sky-300 sm:text-3xl">
        Register your Account
      </h2>

      <FormRow 
        lable="name" 
        error={errors?.name?.message}
        isValid={isNameValid}
        hint={nameValue && nameValue.length > 0 && nameValue.length < 2 ? "Name must be at least 2 characters" : null}
      >
        <input
          type="text"
          placeholder="Enter your full name"
          autoComplete="name"
          className={`h-12 w-full rounded-lg border bg-white p-4 pr-12 text-gray-700 shadow-sm outline-none transition-all duration-200 focus:ring-2 dark:bg-[#1a1d23] dark:text-lightText dark:placeholder:text-gray-500 sm:w-3/4 ${
            errors?.name?.message
              ? "border-red-400 focus:border-red-400 focus:ring-red-400/20"
              : isNameValid
              ? "border-green-400 focus:border-green-400 focus:ring-green-400/20"
              : "border-gray-300 focus:border-sky-500 focus:ring-sky-500/20 dark:border-gray-600"
          }`}
          {...register("name", {
            required: "Name is required",
            minLength: {
              value: 2,
              message: "Name must be at least 2 characters",
            },
            maxLength: {
              value: 50,
              message: "Name must be less than 50 characters",
            },
          })}
          disabled={isCreating}
        />
      </FormRow>

      <FormRow 
        lable="email" 
        error={errors?.email?.message}
        isValid={isEmailValid}
      >
        <input
          type="email"
          placeholder="Enter your email"
          autoComplete="email"
          className={`h-12 w-full rounded-lg border bg-white p-4 pr-12 text-gray-700 shadow-sm outline-none transition-all duration-200 focus:ring-2 dark:bg-[#1a1d23] dark:text-lightText dark:placeholder:text-gray-500 sm:w-3/4 ${
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
          })}
          disabled={isCreating}
        />
      </FormRow>

      <FormRow 
        lable="password" 
        error={errors?.password?.message}
        isValid={isPasswordValid && passwordStrength.strength >= 3}
      >
        <div className="space-y-2 sm:w-3/4">
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              autoComplete="new-password"
              className={`h-12 w-full rounded-lg border bg-white p-4 pr-12 text-gray-700 shadow-sm outline-none transition-all duration-200 focus:ring-2 dark:bg-[#1a1d23] dark:text-lightText dark:placeholder:text-gray-500 ${
                errors?.password?.message
                  ? "border-red-400 focus:border-red-400 focus:ring-red-400/20"
                  : isPasswordValid && passwordStrength.strength >= 3
                  ? "border-green-400 focus:border-green-400 focus:ring-green-400/20"
                  : "border-gray-300 focus:border-sky-500 focus:ring-sky-500/20 dark:border-gray-600"
              }`}
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters long",
                },
              })}
              disabled={isCreating}
            />
            <PasswordToggle 
              show={showPassword} 
              onToggle={() => setShowPassword(!showPassword)} 
            />
          </div>
          
          {/* Password Strength Indicator */}
          {passwordValue && passwordValue.length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-2"
            >
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-500 dark:text-gray-400">
                  Password Strength:
                </span>
                <span
                  className={`font-semibold ${
                    passwordStrength.color === "red"
                      ? "text-red-500"
                      : passwordStrength.color === "orange"
                      ? "text-orange-500"
                      : passwordStrength.color === "yellow"
                      ? "text-yellow-500"
                      : passwordStrength.color === "blue"
                      ? "text-blue-500"
                      : "text-green-500"
                  }`}
                >
                  {passwordStrength.label}
                </span>
              </div>
              
              {/* Strength Bar */}
              <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${passwordStrength.percentage}%` }}
                  transition={{ duration: 0.3 }}
                  className={`h-full ${
                    passwordStrength.color === "red"
                      ? "bg-red-500"
                      : passwordStrength.color === "orange"
                      ? "bg-orange-500"
                      : passwordStrength.color === "yellow"
                      ? "bg-yellow-500"
                      : passwordStrength.color === "blue"
                      ? "bg-blue-500"
                      : "bg-green-500"
                  }`}
                />
              </div>

              {/* Password Requirements */}
              <div className="grid grid-cols-2 gap-1 text-xs text-gray-500 dark:text-gray-400">
                <div className="flex items-center gap-1">
                  {passwordStrength.checks.length ? (
                    <svg className="h-4 w-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <svg className="h-4 w-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  )}
                  <span className={passwordStrength.checks.length ? "text-green-600 dark:text-green-400" : ""}>
                    At least 8 chars
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  {passwordStrength.checks.special ? (
                    <svg className="h-4 w-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <svg className="h-4 w-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  )}
                  <span className={passwordStrength.checks.special ? "text-green-600 dark:text-green-400" : ""}>
                    Special char
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  {passwordStrength.checks.lowercase ? (
                    <svg className="h-4 w-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <svg className="h-4 w-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  )}
                  <span className={passwordStrength.checks.lowercase ? "text-green-600 dark:text-green-400" : ""}>
                    Lowercase
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  {passwordStrength.checks.uppercase ? (
                    <svg className="h-4 w-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <svg className="h-4 w-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  )}
                  <span className={passwordStrength.checks.uppercase ? "text-green-600 dark:text-green-400" : ""}>
                    Uppercase
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  {passwordStrength.checks.number ? (
                    <svg className="h-4 w-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <svg className="h-4 w-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  )}
                  <span className={passwordStrength.checks.number ? "text-green-600 dark:text-green-400" : ""}>
                    Number
                  </span>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </FormRow>

      <FormRow
        lable="confirm password"
        error={errors?.confirmPassword?.message}
        isValid={isConfirmPasswordValid}
      >
        <div className="relative sm:w-3/4">
          <input
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Confirm your password"
            autoComplete="new-password"
            className={`h-12 w-full rounded-lg border bg-white p-4 pr-12 text-gray-700 shadow-sm outline-none transition-all duration-200 focus:ring-2 dark:bg-[#1a1d23] dark:text-lightText dark:placeholder:text-gray-500 ${
              errors?.confirmPassword?.message
                ? "border-red-400 focus:border-red-400 focus:ring-red-400/20"
                : isConfirmPasswordValid
                ? "border-green-400 focus:border-green-400 focus:ring-green-400/20"
                : "border-gray-300 focus:border-sky-500 focus:ring-sky-500/20 dark:border-gray-600"
            }`}
            {...register("confirmPassword", {
              required: "Please confirm your password",
              validate: (value) =>
                value === getValues().password || "Passwords do not match!",
            })}
            disabled={isCreating}
          />
          <PasswordToggle 
            show={showConfirmPassword} 
            onToggle={() => setShowConfirmPassword(!showConfirmPassword)} 
          />
        </div>
      </FormRow>

      <div className="space-y-4">
        <button
          disabled={isCreating || !isNameValid || !isEmailValid || !isPasswordValid || !isConfirmPasswordValid}
          type="submit"
          className="btn-success btn w-full text-sm transition-all duration-300 hover:scale-[1.02] hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50 sm:text-base"
        >
          {isCreating ? (
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
              Creating account...
            </span>
          ) : (
            "Sign Up"
          )}
        </button>
        <div className="divider text-xs sm:text-sm">OR</div>
      </div>

      <p className="text-sm font-medium sm:text-base">
        Already have an account?
        <Link 
          className="link ml-2 font-medium capitalize text-sky-500 transition-colors hover:text-sky-600 dark:text-sky-400 dark:hover:text-sky-300" 
          to="/login"
        >
          login
        </Link>
      </p>
    </motion.form>
  );
};

export default SignupForm;
