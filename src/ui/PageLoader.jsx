import { RotatingLines } from "react-loader-spinner";
import React from "react";

const PageLoader = () => {
  return (
    <div className=" flex min-h-screen items-center justify-center bg-gray-200 dark:bg-bodyColor">
      <RotatingLines height={50} width={50} strokeColor="#087DC3" />
    </div>
  );
};

export default PageLoader;
