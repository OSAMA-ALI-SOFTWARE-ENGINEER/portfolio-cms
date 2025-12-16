import React, { useEffect, useState } from "react";
import Navbar from "../component/navbar/Navbar";

import Logo from "./Logo";
import AuthNav from "../component/authentication/AuthNav";
import ToggleDarkMode from "./ToggleDarkMode";

const Header = () => {
  const [theme, setTheme] = useState("dark");
  const [show, setShow] = useState("translate-y-0");
  const [lastScroll, setLastScroll] = useState(0);

  useEffect(() => {
    if (localStorage.getItem("theme") === null) {
      localStorage.setItem(
        "theme",
        window.matchMedia("(prefers-color-scheme: dark)").matches,
        "theme",
      );
    }
  }, []);

  useEffect(() => {
    const html = document.querySelector("html");
    if (localStorage.getItem("theme") === "dark") {
      html.classList.add("dark");
      setTheme("dark");
    } else {
      html.classList.remove("dark");
      setTheme("light");
    }
  }, [theme]);

  const handleTheme = () => {
    if (localStorage.getItem("theme") === "dark") {
      localStorage.setItem("theme", "light");
      setTheme("light");
    } else {
      localStorage.setItem("theme", "dark");
      setTheme("dark");
    }
  };

  useEffect(() => {
    function controlNavbar() {
      if (window.scrollY > 200) {
        if (window.scrollY > lastScroll) {
          setShow("-translate-y-[80px]");
        } else {
          setShow("shadow-lg");
        }
      } else {
        setShow("translate-y-0");
      }
      setLastScroll(window.scrollY);
    }
    window.addEventListener("scroll", controlNavbar);

    return () => {
      window.removeEventListener("scroll", controlNavbar);
    };
  }, [lastScroll]);

  return (
    <header
      className={` ${show} sticky top-0 z-10 flex h-20 items-center justify-between border-b border-gray-300 bg-gray-200 px-1 font-primary text-lightText  transition-transform duration-700  dark:border-gray-800 dark:bg-bodyColor sm:px-4`}
    >
      <div className=" flex items-center gap-4">
        <Logo />
        <ToggleDarkMode handleTheme={handleTheme} />
      </div>
      <Navbar />
      <AuthNav />
    </header>
  );
};

export default Header;
