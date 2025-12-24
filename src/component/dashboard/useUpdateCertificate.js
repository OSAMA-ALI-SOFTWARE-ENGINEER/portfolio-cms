import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiFormRequest } from "../../services/api";
import toast from "react-hot-toast";

export const useUpdateCertificate = () => {
  const queryClient = useQueryClient();

  const { mutate: updateCertificate, isLoading: isUpdating } = useMutation({
    mutationFn: ({ id, data }) => apiFormRequest(`/certificates/${id}`, data, { method: 'PUT' }),
    onSuccess: () => {
      toast.success("Certificate updated successfully");
      queryClient.invalidateQueries(["certificates"]);
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });

  return { updateCertificate, isUpdating };
};
