import { useMutation, useQueryClient } from "@tanstack/react-query";
import { bulkUpdateBlogs as bulkUpdateBlogsApi } from "../../services/apiBlog";
import toast from "react-hot-toast";

export function useBulkUpdateBlogs() {
  const queryClient = useQueryClient();

  const { mutate: bulkUpdateBlogs, isPending: isBulkUpdating } = useMutation({
    mutationFn: bulkUpdateBlogsApi,
    onSuccess: () => {
      toast.success("Blogs updated successfully");
      queryClient.invalidateQueries({ queryKey: ["blogs"] });
    },
    onError: (err) => {
      toast.error(err.message || "Failed to update blogs");
    },
  });

  return { bulkUpdateBlogs, isBulkUpdating };
}
