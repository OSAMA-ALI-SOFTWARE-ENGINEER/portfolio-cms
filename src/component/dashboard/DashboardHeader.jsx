import React from "react";
import DarkLightModeToggle from "./DarkLightModeToggle";
import AdminInfo from "./AdminInfo";

const DashboardHeader = () => {
  return (
    <header className=" flex h-20 flex-col justify-center bg-white px-4 text-stone-600 shadow-md dark:bg-dashboardBg dark:text-white ">
      <div className="flex items-center justify-between ">
        <form className=" h-14 grow overflow-hidden  rounded-full px-2">
          <div className=" flex items-center gap-2">
            <button type="submit">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="2"
                stroke="currentColor"
                className="h-6 w-6 text-stone-500 hover:text-sky-500"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                />
              </svg>
            </button>

            <input
              type="text"
              placeholder="Search everything..."
              className=" h-14 w-full border-none bg-white outline-none dark:bg-dashboardBg"
            />
          </div>
        </form>

        <div className=" flex items-center gap-4">
          <DarkLightModeToggle />
          <AdminInfo />
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
