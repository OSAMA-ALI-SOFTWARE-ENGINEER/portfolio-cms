import React from "react";
import MiniLoader from "../dashboard/MiniLoader";
import { Bar } from "react-chartjs-2";

const BarChart = ({ isLoadingVisitors, htmlClassName, visitors }) => {
  return (
    <div className=" flex min-h-[20rem] w-full items-center justify-center rounded-md bg-white px-2 py-4 shadow-lg dark:bg-dashboardBg">
      {isLoadingVisitors ? (
        <MiniLoader />
      ) : (
        <Bar
          data={{
            labels: ["/home", "/features", "/blog", "/resume", "/contact"],
            datasets: [
              {
                label: "Page Visitors",
                data: [
                  visitors?.homePageCounter,
                  visitors?.featurePageCounter,
                  visitors?.blogPageCounter,
                  visitors?.resumePageCounter,
                  visitors?.contactPageCounter,
                ],
                borderRadius: 5,
              },
            ],
          }}
          options={{
            plugins: {
              title: {
                text: "Website page Resource",
              },
            },
            scales: {
              x: {
                ticks: {
                  color: htmlClassName === "dark" ? "#fff" : "#444e52",
                },
              },
              y: {
                ticks: {
                  color: htmlClassName === "dark" ? "#fff" : "#444e52",
                },
              },
            },
          }}
        />
      )}
    </div>
  );
};

export default BarChart;
