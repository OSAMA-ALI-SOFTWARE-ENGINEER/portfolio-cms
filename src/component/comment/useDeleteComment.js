import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteComment as deleteCommentApi } from "../../services/apiComment";
import toast from "react-hot-toast";

export function useDeleteComment() {
    const queryClient = useQueryClient();

    const { mutate: deleteComment, isPending: isDeleting } = useMutation({
        mutationFn: deleteCommentApi,
        onSuccess: () => {
            toast.success("Comment deleted permanently");
            queryClient.invalidateQueries({ queryKey: ["adminComments"] });
            queryClient.invalidateQueries({ queryKey: ["blogComments"] });
        },
        onError: (err) => {
            toast.error(err.message || "Failed to delete comment");
        },
    });

    return { deleteComment, isDeleting };
}
