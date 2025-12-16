import React, { useState, useRef } from "react";
// import { motion } from "framer-motion";
import emailjs from "emailjs-com";
import { ColorRing } from "react-loader-spinner";

const ContactForm = () => {
  const form = useRef();
  const [errMsg, setErrMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [formData, setForm] = useState({
    name: "",
    phoneNumber: "",
    email: "",
    message: "",
  });

  const handleChange = (e) => {
    setForm({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (
      !formData.name ||
      !formData.phoneNumber ||
      !formData.email ||
      !formData.message
    ) {
      setErrMsg("Please fill all fields!");
    } else {
      try {
        await emailjs.sendForm(
          "service_m82s5ao",
          "template_far7jw3",
          form.current,
          "S17RPM0A64oZIB_ha",
        );
        setErrMsg("Your message has been sent successfully.");
        setTimeout(() => {
          setErrMsg("");
        }, 5000);
        setForm({
          name: "",
          phoneNumber: "",
          email: "",
          message: "",
        });
      } catch (error) {
        setErrMsg("Something went wrong! Please tr again.");
      }
    }
    setTimeout(() => {
      setErrMsg("");
    }, 10000);
    setLoading(false);
  };
  return (
    <div className=" w-full rounded-xl p-4 shadow-shadowTwo dark:shadow-shadowOne sm:p-12  lg:w-[60%]">
      <form
        ref={form}
        className=" flex flex-col gap-8 pb-12 text-gray-400"
        onSubmit={handleSubmit}
      >
        {errMsg && (
          <p
            className={` ${
              errMsg === "Your message has been sent successfully."
                ? "text-green-500"
                : "text-orange-600"
            } animate-bounce p-4 text-center text-xl tracking-wide shadow-shadowTwo dark:shadow-shadowOne `}
          >
            {errMsg}
          </p>
        )}
        <div className=" flex flex-col gap-10 md:flex-row">
          <div className="flex w-full flex-col gap-4 sm:w-[50%]">
            <label className=" contactLabel" htmlFor="name">
              Your Name
            </label>
            <input
              name="name"
              className="contactInput"
              id="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
            />
          </div>
          <div className="flex w-full flex-col gap-4 sm:w-[50%]">
            <label className=" contactLabel" htmlFor="phoneNumber">
              Phone Number
            </label>
            <input
              name="phoneNumber"
              className=" contactInput"
              id="phoneNumber"
              type="number"
              value={formData.phoneNumber}
              onChange={handleChange}
            />
          </div>
        </div>
        <div className="flex w-full flex-col gap-4">
          <label className="contactLabel" htmlFor="email">
            Email
          </label>
          <input
            name="email"
            className=" contactInput"
            id="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
          />
        </div>
        <div className="flex w-full flex-col gap-4">
          <label className=" contactLabel" htmlFor="message">
            Message
          </label>
          <textarea
            className=" resize-none rounded-lg border-gray-700 bg-gray-200 p-4 text-gray-500 shadow-shadowTwo outline-none outline-offset-2 focus-visible:border-b-transparent focus-visible:outline-designColor dark:border-b-[1px] dark:bg-[#191b1e] dark:text-lightText dark:shadow-none"
            name="message"
            id="message"
            cols="30"
            rows="10"
            value={formData.message}
            onChange={handleChange}
          ></textarea>
        </div>
        {!loading ? (
          <button className="rounded-lg bg-gray-200 p-4 text-center text-lg font-medium uppercase text-gray-500 shadow-shadowTwo duration-200 hover:scale-95 dark:bg-[#191b1e] dark:text-gray-200 dark:shadow-none">
            send
          </button>
        ) : (
          <button
            disabled
            className=" flex justify-center rounded-lg bg-gray-200 p-4 text-center text-lg font-medium uppercase text-gray-500 shadow-shadowTwo duration-200 hover:scale-95 disabled:cursor-not-allowed disabled:hover:scale-100 dark:bg-[#191b1e] dark:text-gray-200 dark:shadow-none"
          >
            <ColorRing height={40} />
          </button>
        )}

        {errMsg && (
          <p
            className={` ${
              errMsg === "Your message has been sent successfully."
                ? "text-green-500"
                : "text-orange-800"
            } animate-bounce p-4 text-center text-xl tracking-wide shadow-shadowTwo dark:shadow-shadowOne `}
          >
            {errMsg}
          </p>
        )}
      </form>
    </div>
  );
};

export default ContactForm;
