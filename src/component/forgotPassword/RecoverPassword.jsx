import React from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";

import { useUpdateUser } from "../user/useUpdateUser";
import toast from "react-hot-toast";

const RecoverPassword = () => {
  const navigate = useNavigate();
  const { update, isUpdating } = useUpdateUser();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = ({ password }) => {
    update(
      { password },
      {
        onSuccess: () => {
          toast.success("Password reset successfully.");
          navigate("/");
        },
        onError: (err) => toast.error(err.message),
      },
    );
  };
  const onError = (err) => {};
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-gray-200 font-primary text-gray-500 dark:bg-bodyColor dark:text-white">
      <div className="rounded-xl p-6 shadow-shadowTwo dark:shadow-shadowOne">
        <h2 className=" mb-2 text-2xl font-medium text-gray-600 dark:text-white ">
          Reset your password
        </h2>
        <p className=" mb-8 w-3/4 text-sm font-semibold text-gray-500 dark:text-gray-400">
          Type in a new secure password and press save to update your password
        </p>

        <form
          onSubmit={handleSubmit(onSubmit, onError)}
          className=" flex flex-col gap-2"
        >
          <label className="font-medium capitalize  text-gray-600 dark:text-gray-400">
            new password
          </label>
          <div className="flex flex-col gap-1">
            <input
              type="password"
              disabled={isUpdating}
              className=" input-bordered input-info input input-sm bg-gray-200  text-slate-700 dark:bg-transparent dark:text-slate-50"
              {...register("password", {
                required: "This field is required",
                minLength: {
                  value: 6,
                  message: "Should be 6 character long!",
                },
              })}
            />
            <p className="text-sm font-medium text-red-500">
              {errors?.password?.message}
            </p>
            <div className="divider"></div>
          </div>
          <button
            disabled={isUpdating}
            className=" btn-success btn-sm btn capitalize duration-200 hover:bg-opacity-70"
          >
            save new password
          </button>
          <p className=" mt-4 text-center text-sm font-medium text-gray-600 dark:text-gray-300">
            already have an account?
            <Link
              disabled={isUpdating}
              to={"/login"}
              className=" link-info link capitalize"
            >
              sign in
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default RecoverPassword;
