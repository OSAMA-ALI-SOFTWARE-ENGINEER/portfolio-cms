import { useQuery } from "@tanstack/react-query";
import { getAdminBlogs } from "../../services/apiBlog";
import { useSearchParams } from "react-router-dom";

export function useAdminBlogs(status = 'published') {
    const [searchParams] = useSearchParams();
    const searchInput = searchParams.get("search") || "";
    const page = parseInt(searchParams.get("page") || 1);

    const {
        data: { data: blogs, count, total, pages } = {},
        isLoading,
        isError,
    } = useQuery({
        queryKey: ["adminBlogs", status, searchInput, page],
        queryFn: () => getAdminBlogs(page, 10, status, searchInput),
    });

    return { blogs, isLoading, isError, count, total, pages };
}
