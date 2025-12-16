import React from "react";
import FacebookOutlinedIcon from "@mui/icons-material/FacebookOutlined";
import TwitterIcon from "@mui/icons-material/Twitter";
import InstagramIcon from "@mui/icons-material/Instagram";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const iconVariants = {
  hover: {
    scale: 1.2,
    originX: 0,
    color: "#5cec2a",
    transition: {
      type: "spring",
      stiffness: 300,
    },
  },
};

const HomeIcons = () => {
  return (
    <div>
      <div className="mt-8">
        <motion.h2 className="mb-2 uppercase text-lg font-normal">
          Find me on
        </motion.h2>
        <div className="flex gap-4 text-white">
          <motion.div
            className=" socialIcons"
            variants={iconVariants}
            whileHover="hover"
          >
            <Link
              to={"/"}
              className="outline-none rounded-sm focus:ring-2 border-none focus:ring-offset-2 focus:ring-designColor"
            >
              <FacebookOutlinedIcon />
            </Link>
          </motion.div>
          <motion.div
            className=" socialIcons"
            variants={iconVariants}
            whileHover="hover"
          >
            <Link
              to={"/"}
              className="outline-none rounded-sm focus:ring-2 border-none focus:ring-offset-2 focus:ring-designColor"
            >
              <TwitterIcon />
            </Link>
          </motion.div>
          <motion.div
            className="socialIcons"
            variants={iconVariants}
            whileHover="hover"
          >
            <Link
              to={"/"}
              className=" outline-none rounded-sm focus:ring-2 border-none focus:ring-offset-2 focus:ring-designColor"
            >
              <InstagramIcon />
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default HomeIcons;
