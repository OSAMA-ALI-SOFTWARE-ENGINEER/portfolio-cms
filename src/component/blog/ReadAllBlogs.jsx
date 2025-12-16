import React from "react";
import BlogRow from "./BlogRow";
import { useBlogs } from "./useBlogs";
import Error from "../../ui/Error";
// import SubPageLoader from "../../ui/SubPageLoader";
import BlogLoader from "./BlogLoader";
import { useSearchParams } from "react-router-dom";

const ReadAllBlogs = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const searchvalue = searchParams.get("search");
  const { filterBlogs, isLoading, isError } = useBlogs();
  if (isLoading) return <BlogLoader />;
  if (isError) return <Error />;

  function handleClearFilter() {
    searchParams.set("search", "");
    setSearchParams(searchParams);
  }
  return (
    <div className="my-9 flex flex-col gap-4 px-2 sm:max-w-[900px]">
      {searchvalue && (
        <div className="text-right">
          <button
            onClick={handleClearFilter}
            className=" border-none bg-none capitalize text-designColor underline outline-none hover:no-underline"
          >
            cancel filter <span className="text-2xl">&times;</span>
          </button>
        </div>
      )}
      {filterBlogs?.length > 0 ? (
        filterBlogs?.map((blog) => <BlogRow key={blog.id} blogContent={blog} />)
      ) : (
        <h3 className="text-center text-3xl font-bold capitalize">
          No blog Found.
        </h3>
      )}
    </div>
  );
};

export default ReadAllBlogs;
