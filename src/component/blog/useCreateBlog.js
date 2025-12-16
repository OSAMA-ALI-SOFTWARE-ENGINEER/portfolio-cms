import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createBlog } from "../../services/apiBlog";
import toast from "react-hot-toast";

export function useCreateBlog() {
  const queryClient = useQueryClient();
  const { mutate: addBlog, isPending } = useMutation({
    mutationFn: createBlog,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["Blogs"] });
      toast.success("Blog created successfully.");
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });
  return { addBlog, isPending };
}
