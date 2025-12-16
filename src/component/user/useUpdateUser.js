import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateCurrentUser } from "../../services/apiAuth";
import toast from "react-hot-toast";

export function useUpdateUser() {
  const queryClient = useQueryClient();

  const { mutate: update, isPending: isUpdating } = useMutation({
    mutationFn: ({ name, password, avatar }) =>
      updateCurrentUser({ name, password, avatar }),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["user"],
      });
    },
    onError: (err) => toast.error(err.message),
  });
  return { update, isUpdating };
}
