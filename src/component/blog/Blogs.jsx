import React from "react";
// import CreateBlog from "./CreateBlog";
import ReadAllBlogs from "./ReadAllBlogs";
import BlogSidebar from "./BlogSidebar";
import BlogHero from "./BlogHero";
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
    <div className="container mx-auto px-4 py-8 font-primary">
      <BlogHero />
      <div className="grid grid-cols-1 gap-y-12 md:grid-cols-[2fr_20rem] md:gap-y-0 md:gap-x-12">
        <div className="relative">
          <ReadAllBlogs />
        </div>
        <BlogSidebar />
      </div>
    </div>
  );
};

export default Blogs;
