import React from "react";
import { useNavigate } from "react-router-dom";

const Error = () => {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen flex-col items-center gap-4 bg-gray-200 pt-12 text-center text-gray-500 dark:bg-bodyColor dark:text-gray-200">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth="2.5"
        stroke="currentColor"
        className="h-12 w-12 text-designColor"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
        />
      </svg>

      <h1 className=" text-4xl  font-semibold">There was an unknown Error.</h1>
      <p className=" text-lg">
        May be there was an internal error on the server. You can try again
        letter.
      </p>
      <button
        onClick={() => navigate(-1, { replace: true })}
        className=" rounded border-none bg-gray-200 px-6 py-1.5 font-semibold capitalize text-gray-500 shadow-shadowTwo duration-300 hover:shadow-none active:translate-y-2 dark:bg-black dark:bg-opacity-25 dark:text-white dark:shadow-shadowOne dark:hover:shadow-none"
      >
        go back &larr;
      </button>
    </div>
  );
};

export default Error;
