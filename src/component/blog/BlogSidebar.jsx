import React, { useState } from "react";
import { useSearchParams } from "react-router-dom";

const BlogSidebar = () => {
  const [searchInput, setSearchInput] = useState("");

  const [searchParams, setSearchParams] = useSearchParams();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!searchInput) return;
    searchParams.set("search", searchInput);
    setSearchParams(searchParams);
  };
  return (
    <aside className=" flex flex-col gap-3 self-start px-3 [grid-row:1] dark:bg-bodyColor md:sticky md:top-24 md:[grid-column:2/3] ">
      <form onSubmit={handleSubmit} className=" flex items-center">
        <input
          type="text"
          value={searchInput}
          required
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder="search blog..."
          className=" input-info input h-8 w-full rounded border-none bg-gray-200 dark:bg-bodyColor"
        />
        <button className=" rounded bg-sky-500 px-6 py-2 font-semibold capitalize tracking-wider text-white">
          search
        </button>
      </form>
    </aside>
  );
};

export default BlogSidebar;
