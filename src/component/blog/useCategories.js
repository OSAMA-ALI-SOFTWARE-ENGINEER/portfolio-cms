import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "../../services/api";

export function useCategories() {
    const {
        data: categories,
        isLoading,
        isError,
    } = useQuery({
        queryKey: ["categories"],
        queryFn: async () => {
            const response = await apiRequest("/blogs/categories/list");
            return response.data;
        },
    });

    return { categories, isLoading, isError };
}
