import React from "react";
import MiniLoader from "../dashboard/MiniLoader";
import { Doughnut } from "react-chartjs-2";

const DoughnutChart = ({ isLoadingVisitors }) => {
  return (
    <div className=" flex min-h-[20rem] w-full items-center justify-center rounded-md bg-white px-2 py-4 shadow-lg dark:bg-dashboardBg">
      {isLoadingVisitors ? (
        <MiniLoader />
      ) : (
        <Doughnut
          data={{
            labels: ["Mobile", "Desktop", "Tablet"],
            datasets: [
              {
                label: "Device",
                data: [500, 1050, 700],
                borderRadius: 2,
                borderWidth: 0,
              },
            ],
          }}
          options={{
            plugins: {
              title: {
                text: "Device Resource",
              },
            },
          }}
        />
      )}
    </div>
  );
};

export default DoughnutChart;
