import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateVisitors as updateVisitorsApi, updateDeviceInfo, detectDeviceType, detectBrowser } from "../../services/apiVisitorCounter";

export function useUpdateVisitor() {
  const queryClient = useQueryClient();
  
  const { mutate: updateVisitors } = useMutation({
    mutationFn: updateVisitorsApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["visitors"] });
    },
    onError: (err) => {
      console.error("Visitor update error:", err);
      // Don't show toast for visitor tracking errors to avoid spam
    },
  });

  // Enhanced update function that also tracks device info
  const updateVisitorWithDeviceInfo = async (route) => {
    try {
      // Update visitor counter
      await updateVisitors(route);
      
      // Update device and browser info
      const deviceType = detectDeviceType();
      const browser = detectBrowser();
      await updateDeviceInfo(deviceType, browser);
    } catch (error) {
      console.error("Failed to update visitor info:", error);
    }
  };

  return { 
    updateVisitors: updateVisitorWithDeviceInfo,
    updateVisitorsOnly: updateVisitors 
  };
}
