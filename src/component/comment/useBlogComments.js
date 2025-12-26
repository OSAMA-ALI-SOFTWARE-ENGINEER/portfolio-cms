import { useQuery } from "@tanstack/react-query";
import { getBlogComments } from "../../services/apiComment";

export function useBlogComments(blogId) {
    const {
        isLoading,
        data: comments, // Expecting array directly or object? API returns { success, data: [] } usually?
        // Let's check apiComment.js: return response.data. so it returns the whole object from backend { success: true, count: N, data: [] }
        isError,
        error,
    } = useQuery({
        queryKey: ["blogComments", blogId],
        queryFn: () => getBlogComments(blogId),
        enabled: !!blogId,
    });

    return { isLoading, comments: comments?.data || [], count: comments?.count || 0, isError, error };
}
