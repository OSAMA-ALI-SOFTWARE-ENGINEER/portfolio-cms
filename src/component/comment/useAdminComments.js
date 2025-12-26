import { useQuery } from "@tanstack/react-query";
import { getAdminComments } from "../../services/apiComment";
import { useSearchParams } from "react-router-dom";

export function useAdminComments(activeTab = 'all') {
    const [searchParams] = useSearchParams();
    const search = searchParams.get("search") || "";
    const page = parseInt(searchParams.get("page")) || 1;

    const {
        isLoading,
        data: { data: comments, count } = {},
        isError,
        error,
    } = useQuery({
        queryKey: ["adminComments", activeTab, search, page],
        queryFn: () => getAdminComments({ status: activeTab, search, page }),
        keepPreviousData: true,
    });

    return { isLoading, comments, count, isError, error };
}
