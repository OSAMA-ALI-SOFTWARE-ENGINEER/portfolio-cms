import React from "react";
import StatusCard from "./StatusCard";
import { useAllVisitors } from "../visitor/useAllVisitors";
import EyeSvg from "../../ui/EyeSvg";
import { useBlogs } from "../blog/useBlogs";
import StatusCardBookSvg from "../../ui/StatusCardBookSvg";

const StatusCards = () => {
  // 1) visitor card stats
  const { visitors, isLoadingVisitors } = useAllVisitors();
  const totalVisitors = (visitors?.counter / 1000).toFixed(2) + "k";

  // 2) Blog card stats
  let { count, isLoading } = useBlogs();
  let totalBlogs = count;
  totalBlogs = (totalBlogs * 100) / 1000 + "k";
  return (
    <div className="  grid max-w-full grid-cols-4 gap-x-6 ">
      <StatusCard
        svg={<EyeSvg />}
        title={totalVisitors}
        subTitle={"total views"}
        percetageValue={(visitors?.counter / 10000) * 100}
        isLoading={isLoadingVisitors}
      />
      <StatusCard
        title={totalBlogs}
        subTitle={"total blogs"}
        percetageValue={(count / 1000) * 100}
        svg={<StatusCardBookSvg />}
        isLoading={isLoading}
      />
      <StatusCard />
      <StatusCard />
    </div>
  );
};

export default StatusCards;
