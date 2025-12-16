import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createUser as createUserApi } from "../../services/apiAuth";
import toast from "react-hot-toast";

export function useCreateUser() {
  const queryClient = useQueryClient();
  
  const { mutate: createUser, isPending: isCreating } = useMutation({
    mutationFn: ({ name, email, password, avatar }) =>
      createUserApi({ name, email, password, avatar }),
    
    onSuccess: (user) => {
      // Invalidate and refetch user data
      queryClient.invalidateQueries({ queryKey: ["user"] });
      toast.success(
        `Welcome ${user.name}! Your account has been created successfully.`
      );
    },
    
    onError: (err) => {
      console.error("Registration error:", err);
      toast.error(err.message || "Registration failed. Please try again.");
    },
  });
  
  return { createUser, isCreating };
}
