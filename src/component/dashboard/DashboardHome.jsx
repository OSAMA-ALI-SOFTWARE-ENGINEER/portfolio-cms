import React, { useEffect, useState } from "react";
import StatusCards from "./StatusCards";
import { useAllVisitors } from "../visitor/useAllVisitors";
import BarChart from "../charts/BarChart";
import LineChart from "../charts/LineChart";
import DoughnutChart from "../charts/DoughnutChart";

import { defaults } from "chart.js/auto";

const DashboardHome = () => {
  const [htmlClassName, setHtmlClassName] = useState(() => {
    return document.querySelector("html").className;
  });

  defaults.maintainAspectRatio = false;
  defaults.responsive = true;
  defaults.plugins.title.display = true;
  defaults.plugins.title.align = "start";
  defaults.plugins.title.font.size = 20;
  htmlClassName === "dark"
    ? (defaults.color = "#fff")
    : (defaults.color = "#000");
  htmlClassName === "dark"
    ? (defaults.plugins.title.color = "white")
    : (defaults.plugins.title.color = "black");
  const { visitors, isLoadingVisitors } = useAllVisitors();

  useEffect(() => {
    const htmlElement = document.querySelector("html");

    const handleClassNameChange = () => {
      setHtmlClassName(htmlElement.className);
    };

    const observer = new MutationObserver(handleClassNameChange);

    observer.observe(htmlElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    // Initial check
    handleClassNameChange();

    return () => {
      observer.disconnect();
    };
  }, []);
  return (
    <>
      <StatusCards />
      <div className=" grid grid-cols-1 justify-items-center gap-x-8 gap-y-14 overflow-hidden px-2 py-12 md:grid-cols-2 md:justify-items-start md:gap-y-10">
        <BarChart
          isLoadingVisitors={isLoadingVisitors}
          htmlClassName={htmlClassName}
          visitors={visitors}
        />
        <LineChart
          isLoadingVisitors={isLoadingVisitors}
          htmlClassName={htmlClassName}
          visitors={visitors}
        />
        <DoughnutChart isLoadingVisitors={isLoadingVisitors} />
      </div>
    </>
  );
};

export default DashboardHome;
