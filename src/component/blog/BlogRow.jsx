import React from "react";
import { Link } from "react-router-dom";

const BlogRow = ({ blogContent }) => {
  const { title, blogImage, author, id } = blogContent;

  return (
    <div className="rounded-md bg-gray-200 px-3 py-6 text-gray-500 shadow-shadowTwo duration-300 hover:shadow-none dark:bg-bodyColor dark:text-gray-200 dark:shadow-shadowOne dark:hover:shadow-none">
      <div className=" flex gap-5">
        <img
          className=" aspect-square w-20 rounded-md border border-gray-300 object-cover dark:border-gray-800 sm:w-40"
          src={blogImage}
          alt="blog"
        />
        <div className=" space-y-2">
          <h3 className=" line-clamp-1 text-base font-semibold capitalize sm:line-clamp-2 sm:text-2xl">
            {title}
          </h3>
          <p>
            Written by:{" "}
            <span className=" font-medium capitalize opacity-70">{author}</span>{" "}
          </p>
          <Link
            to={`/blog/${id}`}
            className=" link mt-8 block w-fit text-blue-500 hover:no-underline"
          >
            Learn more
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BlogRow;
