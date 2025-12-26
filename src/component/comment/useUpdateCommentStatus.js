import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateCommentStatus as updateCommentStatusApi } from "../../services/apiComment";
import toast from "react-hot-toast";

export function useUpdateCommentStatus() {
    const queryClient = useQueryClient();

    const { mutate: updateStatus, isPending: isUpdating } = useMutation({
        mutationFn: updateCommentStatusApi,
        onSuccess: (data) => {
            toast.success(data.message || "Comment status updated");
            queryClient.invalidateQueries({ queryKey: ["adminComments"] });
            queryClient.invalidateQueries({ queryKey: ["blogComments"] }); // Also invalidate public view
        },
        onError: (err) => {
            toast.error(err.message || "Failed to update status");
        },
    });

    return { updateStatus, isUpdating };
}
