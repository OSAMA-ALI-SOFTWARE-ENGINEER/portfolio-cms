import React from "react";
import UpdatePassword from "../user/UpdatePassword";

const SettingsPassword = () => {
  return (
    <div className="w-full font-primary">
      <h1 className="pt-8 text-center text-xl font-bold capitalize text-emerald-500 dark:text-white sm:text-3xl">
        Security Settings
      </h1>
      <UpdatePassword />
    </div>
  );
};

export default SettingsPassword;
