import React, { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useCategories } from "./useCategories";

const BlogSidebar = () => {
  const [searchInput, setSearchInput] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();
  const { categories, isLoading } = useCategories();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!searchInput) return;
    searchParams.set("search", searchInput);
    setSearchParams(searchParams);
  };

  const handleCategoryClick = (category) => {
    searchParams.set("category", category);
    setSearchParams(searchParams);
  };

  return (
    <aside className="no-scrollbar sticky top-24 flex h-fit flex-col gap-8 overflow-y-auto px-4 pb-12 [grid-row:1] md:[grid-column:2/3]">
      {/* Search Widget */}
      <div className="rounded-2xl bg-white p-6 shadow-sm dark:bg-cardBg dark:shadow-none">
        <h3 className="mb-4 text-lg font-bold capitalize text-gray-800 dark:text-gray-100">
          Search
        </h3>
        <form onSubmit={handleSubmit} className="relative">
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Type to search..."
            className="w-full rounded-xl border-none bg-gray-100 px-4 py-3 pr-12 text-sm text-gray-700 outline-none focus:ring-2 focus:ring-sky-500/20 dark:bg-black/20 dark:text-gray-200"
          />
          <button
            type="submit"
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-gray-400 hover:bg-white hover:text-sky-500 hover:shadow-sm dark:hover:bg-gray-700 dark:hover:text-sky-400"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="h-5 w-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
            </svg>
          </button>
        </form>
      </div>

      {/* Categories Widget */}
      <div className="rounded-2xl bg-white p-6 shadow-sm dark:bg-cardBg dark:shadow-none">
        <h3 className="mb-6 text-lg font-bold capitalize text-gray-800 dark:text-gray-100">
          Categories
        </h3>

        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map(i => <div key={i} className="h-8 animate-pulse rounded-lg bg-gray-100 dark:bg-gray-700" />)}
          </div>
        ) : (
          <div className="flex flex-col space-y-2">
            {categories?.map((cat, index) => (
              <button
                key={index}
                onClick={() => handleCategoryClick(cat)}
                className="group flex items-center justify-between rounded-lg px-3 py-2 text-left text-sm font-medium text-gray-600 transition-colors hover:bg-sky-50 hover:text-sky-600 dark:text-gray-400 dark:hover:bg-sky-900/10 dark:hover:text-sky-400"
              >
                <span>{cat}</span>
                <span className="opacity-0 transition-opacity group-hover:opacity-100">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="h-4 w-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                  </svg>
                </span>
              </button>
            ))}

            {(!categories || categories.length === 0) && (
              <p className="text-sm text-gray-400">No categories found.</p>
            )}
          </div>
        )}
      </div>

      {/* Newsletter / CTA Widget (Optional Placeholder for "Aesthetics") */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-sky-500 to-indigo-600 p-6 text-white">
        <div className="relative z-10">
          <h3 className="mb-2 text-xl font-bold">Subscribe to Updates</h3>
          <p className="mb-4 text-sm text-sky-100">Get the latest articles sent to your inbox.</p>
          <div className="flex gap-2">
            <input placeholder="Email" className="w-full rounded-lg border-none bg-white/20 px-3 py-2 text-sm text-white placeholder-white/60 backdrop-blur-sm focus:ring-2 focus:ring-white/40" />
            <button className="rounded-lg bg-white px-3 py-2 text-sky-600 shadow-lg hover:bg-gray-50">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="h-5 w-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.126A59.768 59.768 0 0 1 21.485 12 59.77 59.77 0 0 1 3.27 20.876L5.999 12Zm0 0h7.5" />
              </svg>
            </button>
          </div>
        </div>

        {/* Decorative Circle */}
        <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-white/10 blur-xl" />
        <div className="absolute -bottom-8 -left-8 h-32 w-32 rounded-full bg-sky-400/20 blur-xl" />
      </div>
    </aside>
  );
};

export default BlogSidebar;
