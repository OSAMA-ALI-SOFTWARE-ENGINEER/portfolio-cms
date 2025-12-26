import React from "react";
import { motion } from "framer-motion";

const Button = ({ children, onClick, svg = null, disable }) => {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="flex items-center gap-2 rounded-md bg-sky-600 px-6 py-1.5 font-primary text-lg capitalize  text-white duration-300 hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:bg-sky-600"
      onClick={onClick}
      disabled={disable}
    >
      {svg && svg}
      <span className="block">{children}</span>
    </motion.button>
  );
};

export default Button;
