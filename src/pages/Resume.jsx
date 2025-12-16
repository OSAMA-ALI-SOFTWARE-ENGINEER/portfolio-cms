import React, { useEffect } from "react";
// import { motion } from "framer-motion";
import ResumeNavbar from "../component/resume/ResumeNavbar";
import { Outlet } from "react-router-dom";
import { useUpdateVisitor } from "../component/visitor/useUpdateVisitor";

const Resume = () => {
  const { updateVisitors } = useUpdateVisitor();
  useEffect(() => {
    updateVisitors("/resume");
  }, [updateVisitors]);
  
  return (
    <div className="osama min-h-screen bg-gray-300 px-2 font-primary text-gray-500 dark:bg-bodyColor dark:text-gray-300 md:px-6">
      <div className=" py-12 text-center">
        <p className=" mb-4 text-lg uppercase text-designColor opacity-95">
          2+ year of experience
        </p>
        <h2 className=" mb-8 text-4xl font-bold capitalize sm:text-6xl">
          My Resume
        </h2>
      </div>
      <ResumeNavbar />
      <Outlet />
    </div>
  );
};

export default Resume;
