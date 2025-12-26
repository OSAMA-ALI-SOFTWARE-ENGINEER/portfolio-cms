import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteBlogById } from "../../services/apiBlog";
import toast from "react-hot-toast";

export function useDeleteBlog() {
  const queryClient = useQueryClient();
  const { mutate: deleteBlog, isPending: isDeleting } = useMutation({
    mutationFn: ({ id, force }) => deleteBlogById(id, force),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminBlogs"] }); // Invalidate adminBlogs
      queryClient.invalidateQueries({ queryKey: ["Blogs"] }); // And public blogs
      toast.success("Blog deleted successfully");
    },
    onError: (err) => toast.error(err.message),
  });
  return { deleteBlog, isDeleting };
}
