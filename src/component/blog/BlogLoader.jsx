import React from "react";

const BlogLoader = () => {
  return (
    <div className="my-8 flex flex-col gap-3 px-2">
      {[...new Array(3)]?.map((_, i) => {
        return (
          <div
            key={i}
            className=" h-28 w-full animate-pulse rounded-lg bg-gray-300 dark:bg-gray-900 sm:h-52 sm:w-[90%]"
          ></div>
        );
      })}
    </div>
  );
};

export default BlogLoader;
