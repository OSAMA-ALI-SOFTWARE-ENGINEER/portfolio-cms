import { useQuery } from "@tanstack/react-query";
import { getBlog } from "../../services/apiBlog";

export function useSingleBlog(id) {
  const {
    data: Blog,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["blog", id],
    queryFn: () => getBlog(id),
  });

  return { Blog, isLoading, isError };
}
