import React from "react";
import StatusCardSkeleton from "./StatusCardSkeleton";

const StatusCard = ({ svg, title, subTitle, percetageValue, isLoading }) => {
  if (isLoading) return <StatusCardSkeleton />;

  return (
    <div className=" flex min-h-[10rem] flex-col items-start justify-center gap-3 rounded-sm bg-white px-6 shadow-md dark:bg-dashboardBg">
      <div className=" flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-700 dark:bg-gray-700 dark:text-white">
        {svg}
      </div>
      <div>
        <h2 className=" text-2xl font-semibold text-stone-800 dark:text-white">
          {title}
        </h2>
        <div className="flex items-center gap-4 ">
          <p className=" text-sm capitalize text-gray-500 dark:text-gray-400">
            {subTitle}
          </p>
          <p
            className={`${Number(percetageValue)?.toFixed(0) > 0 ? "text-green-600" : "text-sky-600"}`}
          >
            {percetageValue?.toFixed(2)}%{" "}
            {Number(percetageValue)?.toFixed(0) > 0 && (
              <span className=" text-xl">&uarr;</span>
            )}
            {Number(percetageValue)?.toFixed(0) < 5 && (
              <span className=" text-xl">&darr;</span>
            )}
          </p>
        </div>
      </div>
    </div>
  );
};

export default StatusCard;
