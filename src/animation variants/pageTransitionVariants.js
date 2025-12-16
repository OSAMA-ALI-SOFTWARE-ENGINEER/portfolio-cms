export const pageTransitionVariants = {
  hidden: {
    x: "100vw",
    opacity: 0,
  },
  visible: {
    x: 0,
    opacity: 1,
    transition: {
      // duration: 0.1,
      type: "spring",
      stiffness: 20,
    },
  },
  exit: {
    x: "-100vw",
  },
};
