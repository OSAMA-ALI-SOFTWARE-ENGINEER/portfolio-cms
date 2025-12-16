import React from "react";

const ResumeCard = ({ title, subTitle, result, desc }) => {
  return (
    <div className=" group relative flex flex-col gap-8 shadow-shadowTwo dark:bg-bodyColor dark:shadow-shadowOne rounded-lg px-4 sm:px-10 py-16 text-gray-500 hover:text-gray-600 dark:text-lightText dark:hover:text-gray-200 text-opacity-95 transition-all duration-300">
      <div className=" flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-3">
        <div>
          <h3 className="text-lg sm:text-3xl mb-2 font-bold">{title}</h3>
          <p className=" text-xs sm:text-sm">{subTitle}</p>
        </div>
        <div className=" uppercase tracking-widest font-medium shadow-shadowTwo dark:bg-black bg-opacity-50 rounded-md px-4 py-2 text-designColor text-xs sm:text-sm dark:shadow-shadowOne">
          {result}
        </div>
      </div>
      <p className=" text-sm sm:text-lg">{desc}</p>
      <div className="absolute top-4 right-4">
        <span className=" w-4 h-4 flex items-center justify-center bg-black bg-opacity-50 rounded-full">
          <span className=" inline-block w-2 h-2 rounded-full bg-slate-800 group-hover:bg-green-400 dark:group-hover:bg-designColor "></span>
        </span>
      </div>
    </div>
  );
};

export default ResumeCard;
