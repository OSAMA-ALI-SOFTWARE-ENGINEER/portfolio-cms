import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateBlogStatus } from "../../services/apiBlog";
import toast from "react-hot-toast";

export function useUpdateBlogStatus() {
    const queryClient = useQueryClient();
    const { mutate: updateStatus, isPending: isUpdatingStatus } = useMutation({
        mutationFn: ({ id, status }) => updateBlogStatus(id, status),
        onSuccess: (_, { status }) => {
            queryClient.invalidateQueries({ queryKey: ["adminBlogs"] });
            queryClient.invalidateQueries({ queryKey: ["Blogs"] });
            toast.success(`Blog moved to ${status}`);
        },
        onError: (err) => toast.error(err.message),
    });
    return { updateStatus, isUpdatingStatus };
}
