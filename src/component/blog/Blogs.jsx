import React from "react";
// import CreateBlog from "./CreateBlog";
import ReadAllBlogs from "./ReadAllBlogs";
import BlogSidebar from "./BlogSidebar";
// import { useCurrentUser } from "../authentication/useCurrentUser";
// import { useNavigate, useSearchParams } from "react-router-dom";

const Blogs = () => {
  // const navigate = useNavigate();
  // const [searchParams, setSearchParams] = useSearchParams();
  // const searchInput = searchParams.get("search") || "";

  // 1). Get admin data to show create buttong conditionally

  // const [showModal, setShowModal] = useState(false);

  // 1). Close modal function
  // const onClose = () => setShowModal(false);

  // 2). clear search filter function

  // const handleSearchFilter = () => {
  //   searchParams.set("search", "");
  //   setSearchParams(searchParams);
  //   navigate("/blog");
  // };

  return (
    <div className=" grid grid-cols-1 gap-y-12 py-8 font-primary md:grid-cols-[2fr_20rem] md:gap-y-0">
      <div className=" relative">
        <ReadAllBlogs />
      </div>
      <BlogSidebar />
    </div>
  );
};

export default Blogs;
