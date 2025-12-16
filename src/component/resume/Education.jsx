import React from "react";
import ResumeCard from "./ResumeCard";
import { motion } from "framer-motion";

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

const Education = () => {
  return (
    <motion.div
      variants={pageTransitionVariants}
      initial="hidden"
      animate="visible"
      className="pb-16"
    >
      <div className=" my-12 text-center font-primary text-gray-500 dark:text-lightText ">
        <p className=" mb-4 text-designColor opacity-95">2016 - 2024</p>
        <h2 className=" text-3xl font-bold capitalize sm:text-4xl">
          Education Quality
        </h2>
      </div>
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:p-8">
        <ResumeCard
          title={"BSc in Software Engineering"}
          subTitle={"AWKUM Mardan (2020-2024) "}
          result={"3.32/4"}
          desc={
            "My graduation travel is start from abdul wali khan university mardan (Garden campus). I did my Bcs from 2020 - 2024. This was my fruitful moment and this was the place where the organization able me to work in industry and stay stand in my own foots. "
          }
        />
        <ResumeCard
          title={"FSc pre-engineering"}
          subTitle={"LAMPS College Peshawar (2018 - 2020) "}
          result={"804/1100"}
          desc={
            "Fsc done from LAMPS College Peshawar. I was at third place in my college. It was a an awesome moment ever in college life. "
          }
        />
        <ResumeCard
          title={"Metric in Science"}
          subTitle={"New Qurtaba Model School Sher Garh Mardan (2016 - 2018) "}
          result={"896/1100"}
          desc={
            "Metric done from New Qurtaba Model School Sher Garh Mardan. I was at fourth place in my school. It was a an awesome moment ever in my school life. "
          }
        />
      </div>
    </motion.div>
  );
};

export default Education;
