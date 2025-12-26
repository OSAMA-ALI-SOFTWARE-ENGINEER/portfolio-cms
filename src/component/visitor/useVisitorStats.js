import { useQuery } from "@tanstack/react-query";
import { getVisitorStats } from "../../services/apiVisitor";

export function useVisitorStats() {
    const {
        isLoading,
        data: stats,
        error,
    } = useQuery({
        queryKey: ["visitorStats"],
        queryFn: getVisitorStats,
        staleTime: 5 * 60 * 1000, // cache for 5 minutes
    });

    return { isLoading, stats, error };
}
