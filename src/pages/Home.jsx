import React, { useEffect } from "react";
import HomeImage from "../component/homeData/HomeImage";

import PageTransition from "../ui/PageTransition";
import HomeLeft from "../component/homeData/HomeLeft";
import CertificatesSection from "../component/homeData/CertificatesSection";
import { useUpdateVisitor } from "../component/visitor/useUpdateVisitor";
import IntroVideo from "../component/homeData/IntroVideo";


const Home = () => {
  const { updateVisitors } = useUpdateVisitor();

  useEffect(() => {
    updateVisitors("/");
  }, [updateVisitors]);
  return (
    <PageTransition
      className="min-h-screen bg-gray-200 p-4 font-primary text-xl font-medium text-gray-500 dark:bg-bodyColor 
    dark:text-gray-300 sm:p-8"
    >
      <div className=" relative mb-36 flex flex-col items-center justify-between gap-8 border-b-2 border-gray-300 border-opacity-50 py-16 pb-72 dark:border-gray-900/40 sm:px-4 sm:pb-80 lg:flex-row lg:items-center lg:gap-16">
        {/* Home left side */}

        <HomeLeft />
        {/* Home Right side */}
        <HomeImage />
        <IntroVideo />
      </div>

      {/* Certificates */}
      <CertificatesSection />
    </PageTransition>
  );
};

export default Home;
