import React, { useEffect, useState } from "react";

import contactWebp from "../../image/contact.webp";
import contactMin from "../../image/contact-min.jpg";
import { Link } from "react-router-dom";
import { Blurhash } from "react-blurhash";
import HomeIcons from "../homeData/HomeIcons";

const ContactImage = () => {
  const [imageLoader, setImageLoader] = useState(false);

  useEffect(() => {
    const img = new Image();
    img.onload = () => {
      setImageLoader(true);
    };
    img.src = contactWebp || contactMin;
  }, []);

  return (
    <div className=" group flex w-full flex-col gap-4 overflow-hidden rounded-xl p-8 text-lg text-gray-500 shadow-shadowTwo dark:text-white dark:shadow-shadowOne lg:w-[35%]">
      <div className={`${imageLoader ? " hidden" : " inline"}`}>
        <Blurhash
          hash="LGGHl75S+]R6NK}?xta00h=w-TkV"
          width={400}
          height={300}
          resolutionX={32}
          resolutionY={32}
          punch={1}
        />
      </div>

      <picture>
        <source srcSet={contactWebp} type="image/webp" />
        <source srcSet={contactMin} type="image/jpg" />
        <img
          loading="lazy"
          className={` ${
            imageLoader ? " inline" : "hidden"
          } mb-6 w-full  rounded-xl duration-300 group-hover:scale-110`}
          src={contactMin}
          alt="Contact"
        />
      </picture>

      <h3 className=" text-4xl font-bold capitalize ">Osama ali</h3>
      <p>Full stack developer</p>
      <p>
        'No Stack to Full stack'. Full stack development with technologies and
        languages are React js for frontend and Firebase for backend.
      </p>
      <div className=" flex flex-col sm:flex-row sm:items-center sm:gap-2">
        <p className=" text-xl capitalize">phone :</p>
        <Link
          className=" text-gray-500 dark:text-lightText"
          to={"tel:+923485033323"}
        >
          +923485033323
        </Link>
      </div>
      <div className=" flex flex-col sm:flex-row sm:items-center  sm:gap-2">
        <p className=" text-xl capitalize">Email:</p>
        <Link
          className=" text-gray-500 dark:text-lightText"
          to={"mailto:osama.websecure@gmail.com"}
        >
          osama.websecure@gmail.com
        </Link>
      </div>
      <HomeIcons />
    </div>
  );
};

export default ContactImage;
