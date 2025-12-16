export const moblNavVariant = {
  hidden: {
    x: "-100vw",
    opacity: 0,
  },
  visible: {
    x: 0,
    opacity: 1,
    transition: {
      duration: 0.4,
    },
  },
};

export const navbarVariant = {
  hover: {
    scale: 1.2,
    originX: 0,
    transition: { type: "spring", stiffness: 500 },
  },
};
