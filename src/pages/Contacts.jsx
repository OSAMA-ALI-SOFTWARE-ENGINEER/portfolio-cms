import React, { useEffect } from "react";
import ContactImage from "../component/contactData/ContactImage";
import ContactForm from "../component/contactData/ContactForm";
import PageTransition from "../ui/PageTransition";
import { useUpdateVisitor } from "../component/visitor/useUpdateVisitor";

const Contacts = () => {
  const { updateVisitors } = useUpdateVisitor();
  useEffect(() => {
    updateVisitors("/contacts");
  }, [updateVisitors]);
  return (
    <PageTransition
      className=" min-h-screen bg-gray-200 pb-20 font-primary dark:bg-bodyColor sm:p-8"
    >
      <div className=" my-b py-10 text-center">
        <p className=" text-lg uppercase text-designColor ">contact</p>
        <h2 className="text-2xl font-bold capitalize text-gray-500 dark:text-lightText sm:text-5xl">
          Contact With Me
        </h2>
      </div>

      <div className=" flex flex-col items-start gap-16 p-2 dark:text-gray-400 lg:flex-row xl:p-9">
        <ContactImage />
        <ContactForm />
      </div>
    </PageTransition>
  );
};

export default Contacts;
