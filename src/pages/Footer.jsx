import React from "react";
import Logo from "../ui/Logo";
import Developer from "../component/footerData/Developer";
import ResourceLinks from "../component/footerData/ResourceLinks";
import HomeIcons from "../component/homeData/HomeIcons";
import Modal from "../ui/Modal";


const Footer = ({ setOpenModal, openModal, onClose }) => {
  const curYear = new Date().getFullYear();
  return (
    <>
      <div className=" relative min-h-screen w-full border-t-2 border-gray-300 bg-gray-200 p-10 font-primary dark:border-gray-900/40 dark:bg-bodyColor dark:text-lightText ">
        <div className=" mb-8 grid grid-cols-1 gap-y-10 pt-8 sm:grid-cols-2 sm:justify-items-center sm:gap-y-24 md:grid-cols-3">
          {/* Footer logo */}
          <div className="">
            <Logo />
            <HomeIcons />
          </div>

          {/* Footer Links */}
          <Developer setOpenModal={setOpenModal} />
          <ResourceLinks setOpenModal={setOpenModal} />
        </div>
        <p className=" absolute bottom-0 left-[50%] mx-auto my-4 -translate-x-[50%] whitespace-nowrap text-center text-xs text-gray-500  sm:text-lg">
          copyright &copy;{curYear}. All rights reserved by <em><a 
             href="https://www.linkedin.com/in/osama-alibs/" target="_blank" className="text-gray-100 hover:text-green-400" rel="noreferrer">Osama Ali</a></em>
        </p>
      </div>
      {openModal && (
        <Modal onClose={onClose} title={"under building"}>
          Sorry! These pages are under construction. We will build those pages
          as soon as possible. If you need any contact information or any
          material you can contact us through website or directly through email.
          Thank You
        </Modal>
      )}
    </>
  );
};

export default Footer;
