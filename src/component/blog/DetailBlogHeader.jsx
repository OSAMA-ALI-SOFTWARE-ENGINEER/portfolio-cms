import React from "react";
import { Link } from "react-router-dom";
import { dateFormatter } from "../../helper/DateFormatter";

const DetailBlogHeader = ({
  title,
  authorImage,
  author,
  created_at,
  author_linkdin,
}) => {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-secondary text-3xl font-bold capitalize leading-tight text-gray-900 dark:text-white sm:text-5xl lg:text-6xl">
        {title}
      </h1>
      
      <div className="flex items-center gap-4 border-l-4 border-sky-500 pl-4">
        <img
          className="h-12 w-12 rounded-full object-cover ring-2 ring-sky-500/20"
          src={
            authorImage && !authorImage.includes("via.placeholder.com") && !authorImage.includes("C:\\") && !authorImage.includes("C:/")
              ? authorImage
              : "https://ui-avatars.com/api/?name=" + encodeURIComponent(author)
          }
          alt={`Author ${author}`}
        />
        <div className="flex flex-col text-sm sm:text-base">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-gray-900 dark:text-gray-100">
              {author}
            </span>
            <span className="text-gray-400">•</span>
            <Link
              className="font-medium text-sky-500 transition-colors hover:text-sky-600"
              to={author_linkdin}
              target="_blank"
              rel="noopener noreferrer"
            >
              Follow
            </Link>
          </div>
          <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
            <span>{dateFormatter(created_at)}</span>
            <span className="text-gray-300 dark:text-gray-600">•</span>
            <span>10 min read</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailBlogHeader;
