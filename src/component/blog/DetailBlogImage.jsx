import React from "react";

const DetailBlogImage = ({ blogImage, category, author }) => {
  return (
    <figure className="group relative flex flex-col items-center overflow-hidden rounded-xl">
      <div className="relative w-full overflow-hidden rounded-xl shadow-2xl transition-all duration-500 hover:shadow-sky-500/10">
        <img
          className="h-auto w-full object-cover transition-transform duration-700 will-change-transform group-hover:scale-105 sm:max-h-[600px]"
          src={
            blogImage && !blogImage.includes("via.placeholder.com") && !blogImage.includes("C:\\") && !blogImage.includes("C:/")
              ? blogImage
              : "https://placehold.co/1200x600?text=Hero+Image"
          }
          alt="Blog post"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      </div>
      
      <figcaption className="mt-6 flex w-full flex-wrap items-center justify-between gap-4 border-b border-gray-200 pb-4 dark:border-gray-700">
        <span className="flex items-center gap-2 rounded-full bg-sky-100 px-4 py-1.5 text-sm font-semibold text-sky-600 dark:bg-sky-900/30 dark:text-sky-400">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="2"
            stroke="currentColor"
            className="h-4 w-4"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9.568 3H5.25A2.25 2.25 0 0 0 3 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 0 0 5.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 0 0 9.568 3Z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 6h.008v.008H6V6Z"
            />
          </svg>
          {category}
        </span>
      </figcaption>
    </figure>
  );
};

export default DetailBlogImage;
