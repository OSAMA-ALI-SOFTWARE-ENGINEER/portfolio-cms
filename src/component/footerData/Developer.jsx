import React from "react";
import { developerLinks } from "./FooterLinksData";
import { motion } from "framer-motion";

const Developer = ({ setOpenModal }) => {
  return (
    <div>
      <h2 className=" text-2xl text-designColor mb-8 uppercase">Developers</h2>
      <ul className=" flex flex-col gap-4">
        {developerLinks.map((link) => {
          return (
            <motion.li
              whileHover={{ scale: 1.2, originX: 0, color: "#5cec2a" }}
              transition={{ type: "spring", stiffness: 400 }}
              className="text-lg dark:text-lightText text-gray-500 capitalize font-medium"
              key={link.id}
            >
              <button
                onClick={() => setOpenModal((show) => !show)}
                className=" outline-none rounded-sm focus:ring-2 border-none focus:ring-offset-2 focus:ring-designColor"
              >
                {link.name}
              </button>
            </motion.li>
          );
        })}
      </ul>
    </div>
  );
};

export default Developer;
