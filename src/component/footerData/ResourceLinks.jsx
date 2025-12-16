import React from "react";
import { resourceLinks } from "./FooterLinksData";
import { motion } from "framer-motion";

const ResourceLinks = ({ setOpenModal }) => {
  return (
    <div>
      <div>
        <h2 className=" text-2xl text-designColor mb-8 uppercase">resources</h2>
        <ul className=" flex flex-col gap-4">
          {resourceLinks.map((link) => {
            return (
              <motion.li
                whileHover={{ scale: 1.2, originX: 0, color: "#5cec2a" }}
                transition={{ type: "spring", stiffness: 400 }}
                className=" dark:text-lightText text-gray-500 text-lg capitalize font-medium"
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
    </div>
  );
};

export default ResourceLinks;
