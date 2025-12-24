import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "../../services/api";
import toast from "react-hot-toast";

export const useDeleteCertificate = () => {
  const queryClient = useQueryClient();

  const { mutate: deleteCertificate, isLoading: isDeleting } = useMutation({
    mutationFn: (id) => apiRequest(`/certificates/${id}`, { method: 'DELETE' }),
    onSuccess: () => {
      toast.success("Certificate deleted successfully");
      queryClient.invalidateQueries(["certificates"]);
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });

  return { deleteCertificate, isDeleting };
};
