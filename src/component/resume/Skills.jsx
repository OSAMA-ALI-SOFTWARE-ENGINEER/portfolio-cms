import React from "react";
import { motion } from "framer-motion";
import ProgressBar from "./ProgressBar";

const pageTransitionVariants = {
  hidden: {
    x: "100vw",
    opacity: 0,
  },
  visible: {
    x: 0,
    opacity: 1,
    transition: {
      // delay: 0.2,
      duration: 0.6,

      when: "beforeChildren",
      staggerChildren: 0.4,
    },
  },
  exit: {
    x: "-100vw",
  },
};
const Skills = () => {
  return (
    <motion.div
      variants={pageTransitionVariants}
      initial="hidden"
      animate="visible"
      className=" pb-16 px-2 sm:px-8"
    >
      <div className=" font-primary text-gray-500 dark:text-lightText text-center my-4 md:my-12">
        <p
          className=" text-designColor opacity-95 mt-10
         tracking-widest"
        >
          Features
        </p>
        <h2 className=" text-2xl sm:text-4xl capitalize font-bold mb-12">
          Development skills
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-8">
        <ProgressBar title={"html5"} percentage={"100%"} />
        <ProgressBar title={"css3"} percentage={"100%"} />
        <ProgressBar title={"Tailwind css"} percentage={"100%"} />
        <ProgressBar title={"Bootstrap css"} percentage={"100%"} />
        <ProgressBar title={"Javascript"} percentage={"100%"} />
        <ProgressBar title={"React js"} percentage={"95%"} />
        <ProgressBar title={"Vite js"} percentage={"100%"} />
        <ProgressBar title={"Node js"} percentage={"90%"} />
        <ProgressBar title={"Express js"} percentage={"90%"} />
        <ProgressBar title={"Supabase"} percentage={"90%"} />
        <ProgressBar title={"Firebase"} percentage={"95%"} />
      </div>
    </motion.div>
  );
};

export default Skills;
