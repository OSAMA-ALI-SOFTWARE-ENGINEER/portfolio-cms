import React from "react";

import FormRow from "../../ui/FormRow";
import { useForm } from "react-hook-form";
import { useUpdateUser } from "./useUpdateUser";
import toast from "react-hot-toast";
import { ColorRing } from "react-loader-spinner";

const UpdatePassword = () => {
  const { update, isUpdating } = useUpdateUser();

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
    reset,
  } = useForm();
  const onSubmit = ({ password }) => {
    update(
      { password },
      {
        onSuccess: () => {
          toast.success("Password updated successfully.");
          reset();
        },
      },
    );
  };
  const onError = (err) => {};

  return (
    <div className="mx-auto max-w-2xl py-8">
      <form
        onSubmit={handleSubmit(onSubmit, onError)}
        className=" grid grid-cols-1 gap-8 rounded-xl p-6 shadow-shadowTwo dark:shadow-shadowOne"
      >
        <h2 className="text-center text-lg font-bold capitalize text-sky-500 dark:text-sky-300">
          Modify your password
        </h2>
        <FormRow
          lable={"password (min 6 chars)"}
          error={errors?.password?.message}
        >
          <input
            type="password"
            placeholder="******"
            disabled={isUpdating}
            className="input-bordered input-info input w-full max-w-xs bg-white font-medium text-zinc-500 disabled:border-none disabled:bg-gray-400 disabled:text-gray-700 dark:bg-zinc-800 dark:disabled:text-gray-500"
            {...register("password", {
              required: "Field is required",
              minLength: {
                value: 6,
                message: "Password should be 6 character long",
              },
            })}
          />
        </FormRow>
        <FormRow
          lable={"confirm password"}
          error={errors?.ConfirmePassword?.message}
        >
          <input
            type="password"
            placeholder="******"
            disabled={isUpdating}
            className="input-bordered input-info input w-full max-w-xs bg-white font-medium text-zinc-500 disabled:border-none disabled:bg-gray-400 disabled:text-gray-700 dark:bg-zinc-800 dark:disabled:text-gray-200"
            {...register("ConfirmePassword", {
              required: "Field is required",
              validate: (value) =>
                value === getValues().password || "Password should be match",
            })}
          />
        </FormRow>

        <div className=" mt-8 flex gap-3 justify-self-end">
          <button
            disabled={isUpdating}
            type="submit"
            className="btn flex min-w-[8rem] items-center justify-center border-none bg-sky-500 capitalize text-bodyColor  hover:scale-95 hover:bg-sky-600 disabled:text-bodyColor disabled:opacity-75 dark:bg-sky-300"
          >
            {isUpdating ? (
              <ColorRing
                height={35}
                width={35}
                colors={["#1D303D", "#1D303D", "#1D303D", "#1D303D", "#1D303D"]}
              />
            ) : (
              "update password"
            )}
          </button>
          <button
            type="reset"
            disabled={isUpdating}
            className="btn border-none bg-gray-300 capitalize text-gray-500 hover:scale-95"
          >
            cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdatePassword;
