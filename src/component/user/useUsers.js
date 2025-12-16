import { useQuery } from "@tanstack/react-query";
import { getUsers } from "../../services/apiUser";

export function useUsers() {
  const {
    data: { users } = {},
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["Users"],
    queryFn: getUsers,
  });

  return { users, isLoading, isError };
}
