import React, { useState, useEffect } from "react";
import BlogCard from "./BlogCard";
import { useBlogs } from "./useBlogs";
import Error from "../../ui/Error";
import BlogLoader from "./BlogLoader";
import { useSearchParams } from "react-router-dom";

const ReadAllBlogs = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const searchvalue = searchParams.get("search");
  const { filterBlogs, isLoading, isError } = useBlogs();

  // Pagination State
  const [visibleCount, setVisibleCount] = useState(6);

  // Reset visible count when search changes
  useEffect(() => {
    setVisibleCount(6);
  }, [searchvalue]);

  if (isLoading) return <BlogLoader />;
  if (isError) return <Error />;

  function handleClearFilter() {
    searchParams.set("search", "");
    setSearchParams(searchParams);
  }

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + 6);
  };

  const hasMore = filterBlogs && visibleCount < filterBlogs.length;
  const visibleBlogs = filterBlogs?.slice(0, visibleCount);

  return (
    <div className="my-9 flex flex-col gap-8 px-4 sm:max-w-full">
      {/* Header / Filter Status */}
      {searchvalue && (
        <div className="flex items-center justify-between rounded-xl bg-sky-50 px-4 py-3 text-sky-900 border border-sky-100 dark:bg-sky-900/20 dark:text-sky-300 dark:border-sky-500/20">
          <span className="font-medium">
            Search results for: <strong>"{searchvalue}"</strong>
          </span>
          <button
            onClick={handleClearFilter}
            className="flex items-center gap-1 text-sm font-semibold hover:text-sky-600 hover:underline"
          >
            Clear Filter <span className="text-lg">&times;</span>
          </button>
        </div>
      )}

      {/* Blogs Grid */}
      {visibleBlogs?.length > 0 ? (
        <>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-2">
            {visibleBlogs.map((blog) => (
              <BlogCard key={blog.id} blog={blog} />
            ))}
          </div>

          {/* Load More Button */}
          {hasMore && (
            <div className="mt-8 flex justify-center">
              <button
                onClick={handleLoadMore}
                className="group relative overflow-hidden rounded-full bg-sky-500 px-8 py-3 font-bold uppercase tracking-wider text-white shadow-lg transition-all hover:-translate-y-0.5 hover:shadow-sky-500/40"
              >
                <span className="relative z-10 flex items-center gap-2">
                  Load More
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="2.5"
                    stroke="currentColor"
                    className="h-4 w-4 transition-transform group-hover:translate-y-0.5"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                  </svg>
                </span>
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="flex h-64 flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50 text-center dark:border-gray-700 dark:bg-black/20">
          <p className="text-xl font-medium text-gray-500">No blogs found matching your search.</p>
          <button
            onClick={handleClearFilter}
            className="mt-4 text-sky-500 hover:underline"
          >
            View all blogs
          </button>
        </div>
      )}
    </div>
  );
};

export default ReadAllBlogs;
