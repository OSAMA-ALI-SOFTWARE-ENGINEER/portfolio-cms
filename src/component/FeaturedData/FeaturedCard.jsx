import React from "react";
import { motion } from "framer-motion";

const FeaturedCard = ({ card }) => {
  return (
    <motion.div className="  group dark:bg-bodyColor shadow-shadowTwo dark:shadow-shadowOne px-8 py-16 w-full rounded-lg hover:bg-gradient-to-b from-black to-gray-700 hover:text-white dark:text-gray-300 text-gray-500 flex flex-col gap-6 ">
      <p className="text-designColor transition-all duration-500 group-hover:-translate-y-8 ">
        {card.icon}
      </p>
      <h3 className=" text-3xl font-bold transition-all duration-500 group-hover:-translate-y-8">
        {card.heading}
      </h3>
      <p className=" md:text-lg transition-all duration-500 group-hover:-translate-y-8">
        {card.description}
      </p>
    </motion.div>
  );
};

export default FeaturedCard;
