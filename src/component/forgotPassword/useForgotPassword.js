import { useMutation } from "@tanstack/react-query";
import { forgotPassword } from "../../services/apiAuth";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export function useForgotPassword() {
  const navigate = useNavigate();

  const { mutate: sentLink, isPending: isSending } = useMutation({
    mutationFn: (email) => forgotPassword(email),
    onSuccess: () => {
      toast.success(
        "If you registered using your email and password, a reset link will sent to your mail."
      );
      navigate("/login", { replace: true });
    },
    onError: (err) => toast.error(err.message),
  });
  return { sentLink, isSending };
}
