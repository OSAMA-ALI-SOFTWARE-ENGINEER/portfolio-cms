import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateBlog as updateBlogApi } from "../../services/apiBlog";
import toast from "react-hot-toast";

export function useUpdateBlog() {
  const queryClient = useQueryClient();
  const { mutate: updateBlog, isPending: isUpdating } = useMutation({
    mutationFn: ({ newBlog, id }) => updateBlogApi(newBlog, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["Blogs"] });
      toast.success("Blog updated successfully");
    },
    onError: (err) => toast.error(err.message),
  });
  return { updateBlog, isUpdating };
}
