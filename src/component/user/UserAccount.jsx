import React, { useEffect } from "react";
import Userdata from "./Userdata";
import UpdatePassword from "./UpdatePassword";
import { useCurrentUser } from "../authentication/useCurrentUser";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import PageLoader from "../../ui/PageLoader";

const UserAccount = () => {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading } = useCurrentUser();

  useEffect(() => {
    if (!isAuthenticated && !isLoading) {
      toast.error("Login to access this route");
      navigate("/login", { replace: true });
      return;
    }
  }, [isAuthenticated, isLoading, navigate]);
  if (isLoading) {
    return <PageLoader />;
  }
  return (
    <div className="min-h-screen w-full bg-gray-200 font-primary dark:bg-bodyColor">
      <h1 className=" pt-8 text-center text-xl font-bold capitalize text-emerald-500 dark:text-white sm:text-3xl">
        account settings
      </h1>
      <Userdata />
      <UpdatePassword />
    </div>
  );
};

export default UserAccount;
