import React, { useEffect } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { useOutSideClick } from "../hooks/useOutSideClick";
import { ModalVariant } from "../animation variants/ModalVariant";

export default function Modal({
  isLoading,
  children,
  onClose,
  title,
  size = "small",
  cancelButtonType = "reset",
}) {
  const ref = useOutSideClick(onClose);

  function handleClose() {
    onClose();
  }
  useEffect(() => {
    document.body.style.overflowY = "hidden";
    return () => {
      document.body.style.overflowY = "scroll";
    };
  }, []);
  
  return createPortal(
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed left-0 top-0 z-50 flex h-screen w-full items-center justify-center bg-black/60 backdrop-blur-md"
      >
        <motion.div
          key="modalBackdrop"
          variants={ModalVariant}
          initial="hidden"
          animate="visible"
          exit="hidden"
          ref={ref}
          className={`no-scrollbar relative flex max-h-[calc(100vh-4rem)] flex-col rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 shadow-2xl ring-1 ring-white/10 ${size === "large" ? "w-[95%] lg:w-[85%]" : "w-[95%] lg:w-[600px]"}`}
        >
          {/* Decorative gradient overlay */}
          <div className="pointer-events-none absolute inset-0 rounded-3xl bg-gradient-to-br from-sky-500/10 via-transparent to-purple-500/10" />
          
          {/* Close Button */}
          <motion.button
            onClick={handleClose}
            disabled={isLoading}
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
            className="absolute -right-4 -top-4 z-20 flex h-12 w-12 items-center justify-center rounded-full border-2 border-white/20 bg-gradient-to-br from-red-500 to-red-600 text-white shadow-lg shadow-red-500/50 outline-none transition-all duration-300 hover:shadow-xl hover:shadow-red-500/70 focus:ring-2 focus:ring-red-400 disabled:cursor-not-allowed disabled:opacity-50 disabled:grayscale"
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </motion.button>
          
          {/* Modal Header */}
          <div className="relative border-b border-white/10 px-6 py-6 sm:px-8 sm:py-8">
            <div className="flex items-center justify-center gap-3">
              {/* Decorative icon */}
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-sky-400 to-cyan-500 shadow-lg shadow-sky-500/30">
                <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </div>
              
              <h2 className="bg-gradient-to-r from-white via-sky-100 to-cyan-100 bg-clip-text text-2xl font-bold capitalize text-transparent sm:text-3xl">
                {title}
              </h2>
            </div>
            
            {/* Subtitle/Description */}
            <p className="mt-2 text-center text-sm text-slate-400">
              Fill in the details below to {title?.toLowerCase()}
            </p>
          </div>
          
          {/* Scrollable Content */}
          <div className="no-scrollbar relative flex-1 overflow-y-auto px-6 py-6 sm:px-8 sm:py-8">
            {/* Loading overlay */}
            {isLoading && (
              <div className="absolute inset-0 z-10 flex items-center justify-center rounded-b-3xl bg-slate-900/80 backdrop-blur-sm">
                <div className="flex flex-col items-center gap-4">
                  <div className="h-12 w-12 animate-spin rounded-full border-4 border-sky-500/30 border-t-sky-500" />
                  <p className="text-sm font-medium text-sky-400">Processing...</p>
                </div>
              </div>
            )}
            
            <div className="text-sm text-slate-200 sm:text-base">
              {children}
            </div>
          </div>
          
          {/* Footer gradient */}
          <div className="pointer-events-none h-8 rounded-b-3xl bg-gradient-to-t from-slate-900 to-transparent" />
        </motion.div>
      </motion.div>
    </AnimatePresence>,
    document.body,
  );
}
