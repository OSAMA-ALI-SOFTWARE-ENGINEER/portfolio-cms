import React, { useEffect, useState } from "react";

import FormRow from "../../ui/FormRow";
import { useCurrentUser } from "../authentication/useCurrentUser";
import { useUpdateUser } from "./useUpdateUser";
import toast from "react-hot-toast";
import { ColorRing } from "react-loader-spinner";
const Userdata = () => {
  const { user } = useCurrentUser();
  const { update, isUpdating } = useUpdateUser();
  const email = user?.email;
  const name = user?.user_metadata?.name;
  const [fullName, setFullname] = useState(name);
  const [avatar, setAvatar] = useState(null);

  useEffect(() => {
    setFullname(name);
  }, [name]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const avatarSize = avatar && avatar?.size;
    const isLessImage = avatarSize / 1000 <= 1000 || null;

    if (!isLessImage) {
      toast.error("image should be less than 1mb");
      e.target.reset();
      return;
    }
    update(
      { name: fullName, avatar },
      {
        onSuccess: () => {
          toast.success("Account setting updated successfully.");
          setFullname(name);
          e.target.reset();
        },
      },
    );
  };

  const handleCancel = () => {
    setFullname(name);
    setAvatar(null);
  };

  return (
    <div className="mx-auto max-w-2xl py-8">
      <form
        onSubmit={handleSubmit}
        className=" grid grid-cols-1 gap-8 rounded-xl p-6 shadow-shadowTwo dark:shadow-shadowOne"
      >
        <h2 className="text-center text-lg font-bold capitalize text-sky-500 dark:text-sky-300">
          Modify your data
        </h2>
        <FormRow lable={"Email"} col={2}>
          <input
            type="email"
            value={email}
            placeholder="Enter email"
            disabled
            className="input-bordered input-info input w-full max-w-xs bg-white text-zinc-500 disabled:border-none disabled:bg-gray-400 disabled:text-gray-700 dark:bg-zinc-800 dark:disabled:text-gray-500"
          />
        </FormRow>
        <FormRow lable={"FullName"} col={2}>
          <input
            type="text"
            value={fullName}
            placeholder="your name"
            disabled={isUpdating}
            onChange={(e) => setFullname(e.target.value)}
            className="input-bordered input-info input w-full max-w-xs bg-gray-100 font-medium text-zinc-500 disabled:border-none disabled:bg-gray-400 disabled:text-gray-700 dark:bg-zinc-800 dark:text-gray-300 dark:disabled:text-gray-200"
          />
        </FormRow>

        <FormRow lable={"Photo"} col={2}>
          <input
            type="file"
            disabled={isUpdating}
            accept="image/*"
            onChange={(e) => setAvatar(e.target.files[0])}
            className="file-input-bordered file-input-accent file-input file-input-md bg-gray-300 text-black sm:file-input-md dark:bg-white"
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
              "update"
            )}
          </button>
          <button
            type="reset"
            disabled={isUpdating}
            onClick={handleCancel}
            className="btn border-none bg-gray-300 capitalize text-gray-500 hover:scale-95"
          >
            cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default Userdata;
