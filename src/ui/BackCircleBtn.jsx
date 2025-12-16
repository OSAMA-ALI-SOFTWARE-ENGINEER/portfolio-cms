import React from "react";
import { useNavigate } from "react-router-dom";

const BackCircleBtn = () => {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(-1)}
      className=" ml-4 flex aspect-square w-16 items-center justify-center rounded-full border-none bg-gray-200 font-semibold capitalize text-gray-500 shadow-shadowTwo transition-all duration-300 hover:text-designColor hover:shadow-none active:translate-y-2 dark:bg-black dark:bg-opacity-25 dark:text-white dark:shadow-shadowOne dark:hover:text-designColor dark:hover:shadow-none"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth="2.5"
        stroke="currentColor"
        className="h-6 w-6"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9 15 3 9m0 0 6-6M3 9h12a6 6 0 0 1 0 12h-3"
        />
      </svg>
    </button>
  );
};

export default BackCircleBtn;
