import React from "react";
import logo from "../image/logo.png";
import { Link } from "react-router-dom";

const Logo = () => {
  return (
    <Link to={"/"} className=" flex w-36 items-center gap-2 sm:w-40">
      <img className={` w-full `} src={logo} alt="Logo" loading="lazy" />
    </Link>
  );
};

export default Logo;
