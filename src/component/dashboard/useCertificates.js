import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "../../services/api";

export const useCertificates = () => {
  const {
    data: certificates,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["certificates"],
    queryFn: async () => {
      const data = await apiRequest("/certificates");
      return data.certificates;
    },
  });

  return { certificates, isLoading, error };
};
