import React from "react";
import { motion } from "framer-motion";

const skillVariant = {
  hidden: {
    opacity: 0,
    scale: 0,
  },
  visible: {
    scale: 1,
    opacity: 1,
    transition: {
      type: "spring",
      when: "beforeChildren",
      staggerChildren: 0.4,
    },
  },
};

const ProgressBar = ({ title, percentage }) => {
  const childVariant = {
    hidden: {
      opacity: 0,
      width: 0,
    },
    visible: {
      opacity: 1,
      width: percentage,
      transition: {
        duration: 2,
      },
    },
  };
  return (
    <motion.div variants={skillVariant} initial="hidden" animate="visible">
      <p className=" uppercase font-medium">{title}</p>
      <span className=" inline-block w-full h-3 rounded-lg bg-black bg-opacity-40  relative">
        <motion.span
          variants={childVariant}
          className={` absolute top-0 left-0 inline-block w-[${percentage}] rounded-lg h-full bg-gradient-to-r from-blue-500 via-pink-500 to-red-500`}
        >
          <span className=" absolute -top-7 dark:text-lightText right-0">
            {percentage}
          </span>
        </motion.span>
      </span>
    </motion.div>
  );
};

export default ProgressBar;
