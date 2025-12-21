import React from "react";
import Userdata from "../user/Userdata";

const SettingsProfile = () => {
  return (
    <div className="w-full font-primary">
      <h1 className="pt-8 text-center text-xl font-bold capitalize text-emerald-500 dark:text-white sm:text-3xl">
        Profile Settings
      </h1>
      <Userdata />
    </div>
  );
};

export default SettingsProfile;
