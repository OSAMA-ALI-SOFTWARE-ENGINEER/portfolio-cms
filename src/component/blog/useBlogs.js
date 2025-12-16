import { useQuery } from "@tanstack/react-query";
import { getBlogs } from "../../services/apiBlog";
import { useSearchParams } from "react-router-dom";

export function useBlogs() {
  const [searchParams] = useSearchParams();
  const searchInput = searchParams.get("search") || "";

  let {
    data: { data: Blogs, count } = {},
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["Blogs"],
    queryFn: () => getBlogs(searchInput),
  });
  const filterBlogs = Blogs?.filter((blog) =>
    blog.title.toLocaleLowerCase().includes(searchInput.toLocaleLowerCase()) ||
    blog.keyword.toLocaleLowerCase().includes(searchInput.toLocaleLowerCase())
      ? blog
      : null,
  );

  return { filterBlogs, isLoading, isError, count };
}
