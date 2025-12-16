import React from "react";
import { NavLink } from "react-router-dom";

const ResumeNavbar = () => {
  return (
    <div className=" mx-auto">
      <ul className=" flex flex-col gap-4 sm:grid sm:grid-cols-3 bg-gray-300 shadow-shadowTwo dark:shadow-none dark:bg-black dark:bg-opacity-25 text-gray-500 dark:text-gray-300 rounded-lg">
        <NavLink to={"education"}>
          <li className=" resume-nav ">Education</li>
        </NavLink>
        <NavLink to={"skills"}>
          <li className="resume-nav ">Professional skills</li>
        </NavLink>
        <NavLink to={"experience"}>
          <li className=" resume-nav ">experience</li>
        </NavLink>
      </ul>
    </div>
  );
};

export default ResumeNavbar;
