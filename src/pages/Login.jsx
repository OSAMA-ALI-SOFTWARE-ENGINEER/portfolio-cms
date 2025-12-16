import React, { useEffect } from "react";
import LoginForm from "../component/login/LoginForm";
import { useCurrentUser } from "../component/authentication/useCurrentUser";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useCurrentUser();

  useEffect(() => {
    if (isAuthenticated) return navigate("/dashboard");
  }, [navigate, isAuthenticated]);
  return (
    <div className=" flex items-center justify-center bg-gray-200 py-16 font-primary dark:bg-bodyColor">
      <LoginForm />
    </div>
  );
};

export default Login;
