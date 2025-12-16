import { AnimatePresence, motion } from "framer-motion";
import { NavLink } from "react-router-dom";
import React, { useEffect } from "react";

import { NavData } from "./NavData";
import { moblNavVariant } from "./navBarVariatns";
import HomeIcons from "../homeData/HomeIcons";
import { useOutSideClick } from "../../hooks/useOutSideClick";
import Logo from "../../ui/Logo";

const MobileNav = ({ navbarVariant, setOpen }) => {
  const onClose = () => setOpen(false);
  const ref = useOutSideClick(onClose);

  useEffect(() => {
    document.body.style.overflowY = "hidden";
    return () => {
      document.body.style.overflowY = "scroll";
    };
  }, []);
  return (
    <AnimatePresence>
      <motion.div
        className=" scrollBar-hide absolute left-0 top-0 z-20 h-screen w-[75%] overflow-scroll bg-gray-300 px-2 py-8 dark:bg-gray-900"
        variants={moblNavVariant}
        initial="hidden"
        animate="visible"
        exit="hidden"
        ref={ref}
      >
        <div className=" flex flex-col gap-4 text-gray-500 dark:text-gray-400">
          {/* <div className=" flex items-center justify-between">
            <div className="flex items-center gap-4">
              <img
                className=" h-12 w-12 rounded-full border-2 border-gray-500 object-cover"
                src={logo}
                alt="Logo"
              />
              <h1 className="text-2xl font-bold">Aizy</h1>
            </div>
            <motion.button
              variants={navbarVariant}
              whileHover="hover"
              onClick={onClose}
            >
              <CloseIcon />
            </motion.button>
          </div> */}
          <Logo />
          <p className=" sm:text-md text-sm sm:font-medium">
            I use react packages for complex UI designs such as framer motion
            and many more packages. I am a full stack developer with stack of
            React and Firebase which is so powerfull and have high performance.
          </p>

          <ul className=" mt-4 flex flex-col items-start gap-4 text-xl capitalize">
            {NavData.map((item) => (
              <motion.li
                key={item.name}
                variants={navbarVariant}
                whileHover="hover"
                className=" sm:text-lg"
                onClick={() => setOpen(false)}
              >
                <NavLink to={item.link}>{item.name}</NavLink>
              </motion.li>
            ))}
          </ul>

          <HomeIcons />
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default MobileNav;
