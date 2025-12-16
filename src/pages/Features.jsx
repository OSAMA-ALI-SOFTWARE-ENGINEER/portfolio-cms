import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { featuredData } from "../component/FeaturedData/FeaturedData";
import FeaturedCard from "../component/FeaturedData/FeaturedCard";
import { pageTransitionVariants } from "../animation variants/pageTransitionVariants";
import { useUpdateVisitor } from "../component/visitor/useUpdateVisitor";

const Features = () => {
  const { updateVisitors } = useUpdateVisitor();
  useEffect(() => {
    updateVisitors("/features");
  }, [updateVisitors]);
  return (
    <motion.div
      className=" min-h-screen bg-gray-300 px-2 py-8 font-primary text-white dark:bg-bodyColor sm:px-8"
      variants={pageTransitionVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <div className=" mb-8">
        <p className=" text-lg uppercase text-designColor ">Features</p>
        <h2 className="text-5xl font-bold capitalize text-gray-500 dark:text-lightText">
          What I Do
        </h2>
      </div>

      <div className="grid grid-cols-1 gap-y-12 md:grid-cols-2 md:gap-x-8 lg:grid-cols-3 lg:gap-x-12">
        {featuredData.map((card) => {
          return <FeaturedCard key={card.id} card={card} />;
        })}
      </div>
    </motion.div>
  );
};

export default Features;
