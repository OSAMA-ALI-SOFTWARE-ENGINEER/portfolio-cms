import React from "react";
import { motion } from "framer-motion";
import ResumeCard from "./ResumeCard";

const pageTransitionVariants = {
  hidden: {
    x: "100vw",
    opacity: 0,
  },
  visible: {
    x: 0,
    opacity: 1,
    transition: {
      duration: 0.6,
    },
  },
  exit: {
    x: "-100vw",
  },
};

const Experience = () => {
  return (
    <motion.div
      variants={pageTransitionVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="py-16"
    >
      <div className=" font-primary text-gray-500 dark:text-lightText text-center my-12 ">
        <p className=" text-designColor opacity-95 mb-4">2020 - 2023</p>
        <h2 className=" text-3xl sm:text-4xl capitalize font-bold">
          Job Training & Experience
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-16 gap-y-12  md:px-16">
        <ResumeCard
          title={"Web Developer & Trainer"}
          subTitle={"LTE IT Academy & Software House (2021 - 2022)"}
          result={"Takht Bhai Mardan"}
          desc={
            "Train and encourage students for specially web developement. It is true that train others can improve knowledge."
          }
        />
        <ResumeCard
          title={"Wordpress Developer Expert Level"}
          subTitle={"LTE IT Hub (2023 - 20223)"}
          result={"Mardan"}
          desc={
            "Instruct and encourage students for specially web developement and many more development technologies and languages. It is true that train and instruct others can improve knowledge."
          }
        />
        <ResumeCard
          title={"Front-end Developer"}
          subTitle={"Zoom online classes (2023 - 2024)"}
          result={"Mardan"}
          desc={
            "Mostly skill based learning is taken online. Many organizations start to certified those E-learning oragnizations. I Provide front-end development with language of Javascript and React js."
          }
        />
        {/* <ResumeCard
          title={"Back-end Developer "}
          subTitle={"Zoom online classes (2020 - 2022)"}
          result={"Swabi"}
          desc={
            "Mostly skill based learning is taken online. Many organizations start to certified those E-learning oragnizations. I Provide back-end development with language of Node js and Google provided very awesome technologie which is called Firebase.."
          }
        /> */}
      </div>
    </motion.div>
  );
};

export default Experience;
