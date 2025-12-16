import React from "react";
import DashboardLoader from "./DashboardLoader";
import { Outlet } from "react-router-dom";

const DashboardMainContent = ({ isLoading }) => {
  if (isLoading) return <DashboardLoader />;
  return (
    <div className="mx-auto mt-8 w-full space-y-8 pb-4 md:max-w-[95%]">
      <Outlet />
    </div>
  );
};

export default DashboardMainContent;
