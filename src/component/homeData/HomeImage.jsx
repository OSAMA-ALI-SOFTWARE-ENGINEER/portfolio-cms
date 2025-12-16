import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

import imageWebp from "../../image/osama.webp";
import imageMin from "../../image/osama.png";
import { Blurhash } from "react-blurhash";

const parentVariant = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: {
      type: "spring",
      when: "beforeChildren",
      staggerChildren: 1,
    },
  },
};

const imageVariant = {
  hidden: {
    opacity: 0,
    x: "100vw",
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 2,
      type: "spring",
      stiffness: 100,
    },
  },
};

const imageBackVariant = {
  hidden: {
    opacity: 0,
    y: "-100vh",
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 2,
      type: "spring",
      stiffness: 100,
    },
  },
};
const HomeImage = () => {
  const [imageLoader, setImageLoader] = useState(false);

  useEffect(() => {
    const img = new Image();
    img.onload = () => {
      setImageLoader(true);
    };
    img.src = imageWebp || imageMin;
  }, []);
  return (
    <motion.div
      className=" relative "
      variants={parentVariant}
      initial="hidden"
      animate="visible"
    >
      <div className={`${imageLoader ? " hidden" : " inline"}`}>
        <Blurhash
          hash="LMGlI-Rj0gWV_NoJXnoz9tt7-9M{"
          width={300}
          height={300}
          resolutionX={50}
          resolutionY={50}
          punch={1}
        />
      </div>

      <div className={`${imageLoader ? " inline" : "  hidden "}`}>
        <picture>
          <source srcSet={imageWebp} type="image/webp" />
          <source srcSet={imageMin} type="image/png" />
          <motion.img
            loading="lazy"
            className=" relative z-10 h-[400px] w-[230px] lg:-mt-40 lg:h-[680px] lg:w-[370px] "
            src={imageMin}
            alt="Hero image"
            variants={imageVariant}
          />
        </picture>
        <motion.div
          className="absolute bottom-0 h-[300px] w-[230px] rounded-lg from-[#1e2024] to-[#202327] shadow-shadowTwo dark:shadow-shadowOne lg:h-[500px] lg:w-[370px]"
          variants={imageBackVariant}
        ></motion.div>
      </div>
    </motion.div>
  );
};

export default HomeImage;
