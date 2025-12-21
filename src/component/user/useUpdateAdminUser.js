import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { updateAdminUserApi } from "../../services/apiAuth";

export const useUpdateAdminUser = () => {
  const queryClient = useQueryClient();

  const { mutate: updateUser, isLoading: isUpdating } = useMutation({
    mutationFn: ({ id, data }) => updateAdminUserApi(id, data),
    onSuccess: () => {
      toast.success("User updated successfully");
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });

  return { updateUser, isUpdating };
};
