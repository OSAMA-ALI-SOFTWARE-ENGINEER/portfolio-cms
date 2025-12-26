import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createComment as createCommentApi } from "../../services/apiComment";
import toast from "react-hot-toast";

export function useCreateComment() {
    const queryClient = useQueryClient();

    const { mutate: createComment, isPending: isCreating } = useMutation({
        mutationFn: createCommentApi,
        onSuccess: (data) => {
            // Don't invalidate immediately if moderation is on, because it won't show up anyway.
            // But clearing cache is good practice.
            // Show success message telling user it's pending moderation.
            toast.success(data.message || "Comment submitted for approval!");

            // Optionally invalidate to show if we decide to show "Your pending comments"
            // queryClient.invalidateQueries({ queryKey: ["blogComments"] }); 
        },
        onError: (err) => {
            toast.error(err.response?.data?.message || err.message || "Failed to post comment");
        },
    });

    return { createComment, isCreating };
}
