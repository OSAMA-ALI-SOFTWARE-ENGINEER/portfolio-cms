import React from "react";
import { motion } from "framer-motion";

const pageTransitionVariants = {
  hidden: {
    x: "-100vw",
    opacity: 0,
  },
  visible: {
    x: 0,
    opacity: 1,
    transition: {
      duration: 0.6,

      when: "beforeChildren",
      staggerChildren: 0.4,
    },
  },
  exit: {
    x: "-100vw",
  },
};

const ResumeHome = () => {
  return (
    <motion.div
      className=" px-8 py-24"
      variants={pageTransitionVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <p className=" text-center text-designColor tracking-widest capitalize text-lg">
        short Intro
      </p>
      <div className=" grid grid-cols-1 md:grid-cols-2 gap-x-24 ">
        <div className=" border-b-[1px] border-gray-400 border-opacity-40 dark:border-opacity-100 dark:border-gray-800 py-6">
          <h2 className=" text-3xl capitalize font-medium py-8 dark:text-lightText">
            Objective:
          </h2>
          <p className=" text-lg">
            Highly skilled and motivated web developer with 2+ years of
            experience in designing and developing responsive and user-friendly
            websites. Committed to delivering high-quality code and exceptional
            user experiences. Seeking an opportunity to utilize my technical
            expertise and creativity to contribute to a dynamic organization.
          </p>
        </div>
        <div className="border-b-[1px] border-gray-400 border-opacity-40 dark:border-opacity-100 dark:border-gray-800 py-6">
          <h2 className=" text-3xl capitalize font-medium py-8 dark:text-lightText">
            Education and skills:
          </h2>
          <p>
            Still studying at BS Software engineering at abdul wali khan
            university mardan. I professioned with skill of modern web
            technologies.Details are mentioned in skill section.
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default ResumeHome;
