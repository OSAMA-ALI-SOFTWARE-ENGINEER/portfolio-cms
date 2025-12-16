import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import Hamburger from "hamburger-react";
import { motion } from "framer-motion";

import { navbarVariant } from "./navBarVariatns";
import { NavData } from "./NavData";
import MobileNav from "./MobileNav";
import MobileAuthNav from "../authentication/MobileAuthNav";

const Navbar = () => {
  const [showNav, setOpen] = useState(false);
  const handleScrollToTop = () => {
    window.scrollTo(0, 0);
  };

  return (
    <>
      <nav>
        <ul className=" hidden gap-4 capitalize text-gray-500 dark:text-gray-300  md:flex">
          {NavData.map((item) => {
            return (
              <motion.li
                key={item.name}
                variants={navbarVariant}
                whileHover="hover"
              >
                <NavLink
                  onClick={handleScrollToTop}
                  className=" rounded-sm border-none px-2 py-1 font-medium outline-none  hover:text-colorHover focus:ring-2 focus:ring-designColor  "
                  to={item.link}
                >
                  {item.name}
                </NavLink>
              </motion.li>
            );
          })}
        </ul>
      </nav>
      <div className="relative flex items-center gap-4">
        <MobileAuthNav />
        <motion.div
          className="block rounded-full text-designColor shadow-shadowTwo dark:bg-black dark:shadow-shadowOne md:hidden"
          variants={navbarVariant}
          whileHover="hover"
        >
          <Hamburger size={20} toggled={showNav} toggle={setOpen} />
        </motion.div>
      </div>
      {showNav && <MobileNav navbarVariant={navbarVariant} setOpen={setOpen} />}
    </>
  );
};

export default Navbar;
