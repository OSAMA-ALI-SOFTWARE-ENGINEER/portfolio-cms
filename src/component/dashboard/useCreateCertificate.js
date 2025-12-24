import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiFormRequest } from "../../services/api";
import toast from "react-hot-toast";

export const useCreateCertificate = () => {
  const queryClient = useQueryClient();

  const { mutate: createCertificate, isLoading: isCreating } = useMutation({
    mutationFn: (formData) => apiFormRequest("/certificates", formData),
    onSuccess: () => {
      toast.success("Certificate created successfully");
      queryClient.invalidateQueries(["certificates"]);
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });

  return { createCertificate, isCreating };
};
