import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteBlogById } from "../../services/apiBlog";
import toast from "react-hot-toast";

export function useDeleteBlog() {
  const queryClient = useQueryClient();
  const { mutate: deleteBlog, isPending: isDeleting } = useMutation({
    mutationFn: deleteBlogById,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["Blogs"] });
      toast.success("Blog delete successfully");
    },
    onError: (err) => toast.error(err.message),
  });
  return { deleteBlog, isDeleting };
}
