import React, { useEffect } from "react";
import PageTransition from "../ui/PageTransition";

import Blogs from "../component/blog/Blogs";
import { useUpdateVisitor } from "../component/visitor/useUpdateVisitor";

const Blog = () => {
  const { updateVisitors } = useUpdateVisitor();
  useEffect(() => {
    updateVisitors("/blog");
  }, [updateVisitors]);
  return (
    <PageTransition className=" min-h-screen bg-gray-200 text-gray-400 dark:bg-bodyColor dark:text-lightText ">
      <Blogs />
    </PageTransition>
  );
};

export default Blog;
