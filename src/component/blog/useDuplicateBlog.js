import { useMutation, useQueryClient } from "@tanstack/react-query";
import { duplicateBlog as duplicateBlogApi } from "../../services/apiBlog";
import toast from "react-hot-toast";

export function useDuplicateBlog() {
    const queryClient = useQueryClient();

    const { mutate: duplicateBlog, isLoading: isDuplicating } = useMutation({
        mutationFn: duplicateBlogApi,
        onSuccess: () => {
            toast.success("Blog duplicated successfully");
            queryClient.invalidateQueries({ queryKey: ["Blogs"] });
            queryClient.invalidateQueries({ queryKey: ["adminBlogs"] });
        },
        onError: (err) => {
            toast.error(err.message);
        },
    });

    return { duplicateBlog, isDuplicating };
}
