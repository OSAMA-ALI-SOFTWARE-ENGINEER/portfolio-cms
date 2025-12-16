import React from "react";
import { useNavigate } from "react-router-dom";

function PageNotFound() {
  const navigate = useNavigate();
  return (
    <div className=" h-56 items-center flex justify-center flex-col gap-6 dark:bg-bodyColor bg-gray-200 text-gray-400">
      <h1 className="  text-2xl sm:text-4xl font-bold  ">Page Not found</h1>
      <button
        onClick={() => navigate(-1, { replace: true })}
        className=" capitalize shadow-shadowTwo font-semibold active:translate-y-2 duration-300 dark:bg-black hover:shadow-none dark:bg-opacity-25 dark:text-white text-gray-500 dark:shadow-shadowOne bg-gray-200 px-6 py-1.5 border-none"
      >
        go back &larr;
      </button>
    </div>
  );
}

export default PageNotFound;
