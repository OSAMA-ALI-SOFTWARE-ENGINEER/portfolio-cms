import React from "react";
import { motion } from "framer-motion";
import { useTypewriter, Cursor } from "react-simple-typewriter";
import HomeIcons from "./HomeIcons";
// import { Link } from "react-router-dom";

const childVariant = {
  hidden: {
    opacity: 0,
    x: -100,
  },
  visible: {
    opacity: 1,
    x: 0,
  },
};

const iconVariants = {
  hover: {
    scale: 1.2,
    originX: 0,
    color: "#ff014f",
    transition: {
      type: "spring",
      stiffness: 300,
    },
  },
};

const HomeLeft = () => {
  const [text] = useTypewriter({
    words: [
      "UI designer.",
      "Professional coder.",
      "React Developer.",
      "Wordpress Full Stack Developer.",
    ],
    loop: {},
    typeSpeed: 50,
    deleteSpeed: 50,
  });

  function handleDownload() {
    window.open("/data/Osama.pdf", "_blank");
  }
  return (
    <motion.div className=" w-full self-start lg:w-1/2">
      <motion.p
        className="mb-4 text-lg font-normal uppercase"
        variants={childVariant}
      >
        welcome to my world
      </motion.p>
      <motion.h1
        className=" mb-4  text-3xl font-bold tracking-tighter dark:text-gray-200 md:text-5xl"
        variants={childVariant}
      >
        Hi, I'm <span className=" text-designColor">Osama Ali</span>
        <motion.p variants={childVariant}>
          a {text}
          <span>
            <Cursor
              cursorBlinking={false}
              cursorColor="#ff014f"
              cursorStyle="✏"
            />
          </span>
        </motion.p>
      </motion.h1>
      <motion.p className=" mb-4 text-lg sm:text-xl" variants={childVariant}>
        I am a full stack developer building with Next.js, Express, and MySQL,
        delivering performant, production-ready apps.
      </motion.p>

      <motion.div
        className=" flex flex-col items-center gap-12 sm:flex-row"
        variants={childVariant}
      >
        <motion.div>
          <HomeIcons />
        </motion.div>
        <motion.div variants={iconVariants} whileHover={"hover"}>
          <button
            onClick={handleDownload}
            className=" rounded px-8 py-2.5 capitalize text-gray-700 hover:text-colorHover shadow-shadowTwo dark:bg-designColor dark:text-white dark:shadow-none sm:px-16 sm:py-4"
            to="/data/Osama.pdf"
            target="_blank"
            download
          >
            download cv
          </button>
        </motion.div>
      </motion.div>

      {/* <motion.p className=" mb-4 text-lg sm:text-xl" variants={childVariant}> */}
      <motion.div
        className=" flex flex-col items-center rounded-xl p-6 mt-12 sm:flex-row"
        variants={childVariant}
      >
        <div
          className="badge-base LI-profile-badge border-l-dashboardBg rounded-xl"
          data-locale="en_US"
          data-size="large"
          data-theme="dark"
          data-type="HORIZONTAL"
          data-vanity="osama-alibs"
          data-version="v1"
        >
          <a
            className="badge-base__link LI-simple-link"
            href="https://pk.linkedin.com/in/osama-alibs?trk=profile-badge"
          >
            {" "}
          </a>
        </div>
      </motion.div>
    </motion.div>

    
  );
};

export default HomeLeft;
