import { useQuery } from "@tanstack/react-query";
import { getAllVisitors } from "../../services/apiVisitorCounter";

export function useAllVisitors() {
  const {
    data: visitors,
    isLoading: isLoadingVisitors,
    isError,
  } = useQuery({
    queryKey: ["visitors"],
    queryFn: getAllVisitors,
  });

  return { visitors, isError, isLoadingVisitors };
}
