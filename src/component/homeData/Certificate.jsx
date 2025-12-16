import React from "react";
import { Link } from "react-router-dom";

const Certificate = ({ imageMin, imageWebp, verifyUrl, pdfUrl }) => {
  function handleDownload(pdf) {
    window.open(pdf, "_blank");
  }

  return (
    <div className=" group relative overflow-hidden rounded-lg p-6 shadow-shadowTwo transition-all duration-200 hover:shadow-none dark:shadow-shadowOne">
      <picture>
        <source srcSet={imageWebp} type="image/webp" />
        <source srcSet={imageMin} type="image/jpg" />
        <img
          className="w-full rounded-lg transition-all duration-300 group-hover:scale-105 "
          src={imageMin}
          alt=""
        />
      </picture>

      <div className=" mt-8 flex items-center gap-4">
        <Link
          className=" z-30 flex flex-[1] items-center justify-center gap-2 rounded-lg bg-gray-200 px-6 py-2 text-sm font-semibold text-sky-500 shadow-shadowTwo transition-all duration-300 hover:text-sky-600 hover:shadow-none dark:bg-bodyColor dark:text-designColor dark:shadow-shadowOne dark:hover:shadow-none"
          to={verifyUrl}
        >
          <span>Verify</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="h-6 w-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0 1 12 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 0 1 3 12c0-1.605.42-3.113 1.157-4.418"
            />
          </svg>
        </Link>
        <button
          onClick={() => handleDownload(pdfUrl)}
          className=" z-30 flex-[1] justify-center rounded-lg bg-gray-200 px-6 py-2 text-sm font-semibold text-sky-500 shadow-shadowTwo transition-all duration-300 hover:text-sky-600 hover:shadow-none dark:bg-bodyColor dark:text-designColor dark:shadow-shadowOne hover:dark:shadow-none"
        >
          View <span className=" uppercase">pdf</span>
        </button>
      </div>
    </div>
  );
};

export default Certificate;
