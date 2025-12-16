import React, { useEffect } from "react";
import { dateAndTimeFormatter } from "../helper/dateAndTimeFormatter";
import { useLocation } from "react-router-dom";

const AdminSignInInfoPopup = ({
  lastSignIn,
  emailConfirmDate,
  showPopUp,
  setShowPopUp,
  isLoading,
}) => {
  const location = useLocation();
  const closePopUp = () => setShowPopUp(false);
  useEffect(() => {
    !isLoading && location.pathname === "/dashboard" && setShowPopUp(true);
  }, [location, isLoading, setShowPopUp]);
  return (
    <div
      className={`${showPopUp ? " pointer-events-auto visible translate-x-0 opacity-100" : " pointer-events-none invisible translate-x-[100%] opacity-0"} absolute right-1 top-4 z-30 flex min-h-[7rem] w-fit cursor-pointer flex-col justify-center gap-4 rounded bg-designColor/80 px-6 text-white transition-all duration-700`}
    >
      <button
        onClick={closePopUp}
        className=" absolute right-1 top-0 text-3xl duration-300 hover:text-gray-400"
      >
        &times;
      </button>
      <p className=" font-semibold">
        Last sign In at:{" "}
        <span className=" ml-1 text-base font-normal ">
          {dateAndTimeFormatter(lastSignIn)}
        </span>
      </p>
      <p className=" font-semibold">
        Email confirmed at:{" "}
        <span className=" ml-1 text-base font-normal ">
          {dateAndTimeFormatter(emailConfirmDate)}
        </span>
      </p>
    </div>
  );
};

export default AdminSignInInfoPopup;
