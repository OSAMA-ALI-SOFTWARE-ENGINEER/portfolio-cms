import React from "react";
import { motion, AnimatePresence } from "framer-motion";

const FormRow = ({ 
  children, 
  lable, 
  error, 
  extend = false, 
  isValid = null,
  hint = null 
}) => {
  return (
    <div className={`${extend ? " col-span-2" : ""} space-y-2`}>
      <label className=" font-normal capitalize text-inherit">{lable}:</label>
      <div className=" space-y-1">
        <div className="relative">
          {children}
          {isValid === true && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="absolute right-3 top-1/2 -translate-y-1/2"
            >
              <svg
                className="h-5 w-5 text-green-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </motion.div>
          )}
        </div>
        <AnimatePresence mode="wait">
          {error && (
            <motion.p
              key="error"
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className=" text-xs font-medium text-red-400 dark:text-red-300"
            >
              {error}
            </motion.p>
          )}
          {hint && !error && (
            <motion.p
              key="hint"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className=" text-xs font-medium text-gray-400 dark:text-gray-500"
            >
              {hint}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default FormRow;
