import { useMutation, useQueryClient } from "@tanstack/react-query";
import { login as loginApi } from "../../services/apiAuth";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export function useLogin() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  
  const { mutate: login, isPending } = useMutation({
    mutationFn: ({ email, password }) => loginApi({ email, password }),
    
    onSuccess: (data) => {
      // Set user data in cache immediately so authentication state is correct
      if (data?.user) {
        queryClient.setQueryData(["user"], data.user);
      }
      toast.success("Login successful!");
      // Navigate to dashboard after successful login
      navigate("/dashboard", { replace: true });
      // Also invalidate to trigger a background refetch for fresh data
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },

    onError: (err) => {
      console.error("Login error:", err);
      toast.error(err.message || "Login failed. Please try again.");
    },
  });

  return { login, isPending };
}
