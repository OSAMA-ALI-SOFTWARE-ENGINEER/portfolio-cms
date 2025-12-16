import React from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { useForgotPassword } from "./useForgotPassword";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const { sentLink, isSending } = useForgotPassword();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = ({ email }) => {
    sentLink(email);
  };
  const onError = (err) => {};
  return (
    <div className="flex w-full justify-center bg-gray-200 py-16 font-primary text-gray-500 dark:bg-bodyColor dark:text-white">
      <div className="mx-2 h-fit rounded-xl px-6 py-10  shadow-shadowTwo dark:shadow-shadowOne sm:mx-0 sm:p-6">
        <button
          onClick={() => navigate(-1)}
          className=" mb-5 rounded-md py-1.5 font-semibold"
        >
          {" "}
          &larr; Back
        </button>
        <h2 className=" mb-2 text-2xl font-medium text-gray-600 dark:text-white ">
          Reset your password
        </h2>
        <p className=" mb-8 w-3/4 text-sm font-semibold text-gray-500 dark:text-gray-400">
          Type in your email and we'll send you a link to reset your password
        </p>

        <form
          onSubmit={handleSubmit(onSubmit, onError)}
          className=" flex flex-col gap-2"
        >
          <label className="font-medium capitalize  text-gray-600 dark:text-gray-400">
            Email
          </label>
          <div className="flex flex-col gap-1">
            <input
              type="email"
              disabled={isSending}
              className=" input-bordered input-info input input-sm bg-gray-200  text-slate-700 dark:bg-transparent dark:text-slate-50"
              {...register("email", {
                required: "This field is required",
              })}
            />
            <p className="text-sm font-medium text-red-500">
              {errors?.email?.message}
            </p>
          </div>
          <div className="divider"></div>
          <button
            disabled={isSending}
            className=" btn-success btn-sm btn capitalize duration-200 hover:bg-opacity-70"
          >
            sent reset email
          </button>
          <p className=" mt-4 text-center text-sm font-medium text-gray-600 dark:text-gray-300">
            already have an account?
            <Link to={"/login"} className=" link-info link capitalize">
              sign in
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
