import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCurrentUser } from "../component/authentication/useCurrentUser";
import SideBar from "../component/dashboard/SideBar";

import DashboardMainContent from "../component/dashboard/DashboardMainContent";
import DashboardHeader from "../component/dashboard/DashboardHeader";
import AdminSignInInfoPopup from "../ui/AdminSignInInfoPopup";

const Dashboard = () => {
  const [showPopUp, setShowPopUp] = useState(false);
  const navigate = useNavigate();

  const {
    isAuthenticated,
    isLoading,
    user = {},
  } = useCurrentUser();

  // Use createdAt as email_confirmed_at (MySQL doesn't have email_confirmed_at by default)
  const email_confirmed_at = user?.email_confirmed_at || user?.createdAt;
  // Use createdAt as last_sign_in_at if not available (MySQL doesn't track last_sign_in_at by default)
  const last_sign_in_at = user?.last_sign_in_at || user?.createdAt;

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      return navigate("/");
    }
  }, [isAuthenticated, navigate, isLoading]);

  return (
    <div className="grid min-h-screen grid-cols-[18rem_1fr] overflow-hidden bg-dashboardBg font-primary">
      <SideBar />
      <div className=" relative bg-gray-100 dark:bg-dashboardBg2">
        <DashboardHeader />
        <DashboardMainContent isLoading={isLoading} />
        <AdminSignInInfoPopup
          lastSignIn={last_sign_in_at}
          emailConfirmDate={email_confirmed_at}
          showPopUp={showPopUp}
          setShowPopUp={setShowPopUp}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};

export default Dashboard;
