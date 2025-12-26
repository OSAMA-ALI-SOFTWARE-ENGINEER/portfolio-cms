import React from "react";
import { Link } from "react-router-dom";

const Author = ({ authorImage, author, author_linkdin, linkdin_followers }) => {
  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col items-center gap-6 rounded-2xl bg-white p-6 shadow-xl dark:bg-gray-800/50 sm:flex-row sm:gap-8 sm:p-8">
      <div className="relative">
        <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-sky-400 to-cyan-300 opacity-75 blur"></div>
        <img
          className="relative h-20 w-20 rounded-full object-cover ring-4 ring-white dark:ring-gray-800 sm:h-24 sm:w-24"
          src={
            typeof authorImage === 'string' && authorImage && !authorImage.includes("via.placeholder.com") && !authorImage.includes("C:\\") && !authorImage.includes("C:/")
              ? authorImage
              : "https://ui-avatars.com/api/?name=" + encodeURIComponent(author)
          }
          alt={`Author ${author}`}
        />
      </div>

      <div className="flex flex-1 flex-col items-center text-center sm:items-start sm:text-left">
        <h3 className="text-lg font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
          Written by
        </h3>
        <h2 className="mt-1 text-2xl font-bold capitalize text-gray-900 dark:text-white">
          {author}
        </h2>

        <div className="mt-4 flex flex-wrap items-center justify-center gap-4 sm:justify-start">
          <div className="flex items-center gap-2 rounded-lg bg-gray-100 px-3 py-1 dark:bg-gray-700">
            <span className="font-bold text-sky-600 dark:text-sky-400">
              {linkdin_followers > 500 ? "500+" : linkdin_followers}
            </span>
            <span className="text-sm text-gray-600 dark:text-gray-300">Followers</span>
          </div>

          <Link
            to={author_linkdin}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-2 rounded-full bg-sky-500 px-6 py-2 font-semibold text-white transition-all hover:bg-sky-600 hover:shadow-lg hover:shadow-sky-500/30 active:scale-95"
          >
            <span>Follow on LinkedIn</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="h-4 w-4 transition-transform group-hover:translate-x-1"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Author;
