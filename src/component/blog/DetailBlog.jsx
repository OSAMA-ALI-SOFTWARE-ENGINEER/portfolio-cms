import React from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { useSingleBlog } from "./useSingleBlog";
import PageLoader from "../../ui/PageLoader";
import Error from "../../ui/Error";
import Author from "./Author";
import BackCircleBtn from "../../ui/BackCircleBtn";
import DetailBlogContent from "./DetailBlogContent";
import DetailBlogGallery from "./DetailBlogGallery";
import { dateFormatter } from "../../helper/DateFormatter";
import { Link } from "react-router-dom";

const DetailBlog = () => {
  const { blogId } = useParams();
  const { Blog, isLoading, isError } = useSingleBlog(blogId);

  if (isLoading) return <PageLoader />;
  if (isError) return <Error />;
  
  const {
    title,
    author,
    authorImage,
    createdAt,
    blogImage,
    category,
    content,
    author_linkdin,
    linkdin_followers,
    gallery,
  } = Blog;

  // Helper to construct image URL
  const getImageUrl = (path) => {
    if (!path) return null;
    if (path.startsWith("http") || path.startsWith("https")) return path;
    
    // Remove any absolute path prefixes
    let cleanPath = path;
    
    // If it contains a drive letter or full path, extract just the uploads part
    if (path.includes(':') || path.includes('xampp') || path.includes('backend')) {
      if (path.includes('uploads')) {
        const parts = path.split('uploads');
        cleanPath = 'uploads' + parts[parts.length - 1].replace(/\\/g, '/');
      }
    } else {
      cleanPath = path.replace(/^backend[\\/]/, "").replace(/\\/g, "/");
    }
    
    const fullUrl = `http://localhost:5000/${cleanPath}`;
    return fullUrl;
  };

  const heroImageUrl = getImageUrl(blogImage) || `https://placehold.co/1920x600?text=${encodeURIComponent(title)}`;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gray-50 font-primary dark:bg-bodyColor"
    >
      {/* Full-width Hero Section with Background Image */}
      <div className="relative h-[60vh] min-h-[400px] w-full overflow-hidden">
        {/* Background Image with Overlay */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${heroImageUrl})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/70" />
        </div>

        {/* Back Button */}
        <div className="absolute left-4 top-4 z-10 sm:left-8 sm:top-8">
          <BackCircleBtn />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 flex h-full items-end">
          <div className="container mx-auto max-w-6xl px-4 pb-12 sm:px-6 lg:px-8">
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="space-y-4"
            >
              {/* Category Badge */}
              <div className="flex items-center gap-3">
                <span className="inline-flex items-center gap-2 rounded-full bg-sky-500/90 px-4 py-1.5 text-sm font-semibold text-white backdrop-blur-sm">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="2"
                    stroke="currentColor"
                    className="h-4 w-4"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9.568 3H5.25A2.25 2.25 0 0 0 3 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 0 0 5.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 0 0 9.568 3Z"
                    />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6Z" />
                  </svg>
                  {category}
                </span>
              </div>

              {/* Title */}
              <h1 className="max-w-4xl font-secondary text-3xl font-bold capitalize leading-tight text-white sm:text-5xl lg:text-6xl">
                {title}
              </h1>

              {/* Author Info */}
              <div className="flex items-center gap-4 border-l-4 border-sky-500 pl-4">
                <img
                  className="h-12 w-12 rounded-full object-cover ring-2 ring-white/20"
                  src={
                    authorImage && !authorImage.includes("via.placeholder.com") && !authorImage.includes("C:\\") && !authorImage.includes("C:/")
                      ? authorImage
                      : "https://ui-avatars.com/api/?name=" + encodeURIComponent(author)
                  }
                  alt={`Author ${author}`}
                />
                <div className="flex flex-col text-sm text-white sm:text-base">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">{author}</span>
                    <span className="text-gray-300">•</span>
                    <Link
                      className="font-medium text-sky-400 transition-colors hover:text-sky-300"
                      to={author_linkdin}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Follow
                    </Link>
                  </div>
                  <div className="flex items-center gap-2 text-gray-300">
                    <span>{dateFormatter(createdAt)}</span>
                    <span className="text-gray-500">•</span>
                    <span>10 min read</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="container mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="flex flex-col gap-12"
        >
          <DetailBlogContent content={content} />

          {gallery && gallery.length > 0 && <DetailBlogGallery gallery={gallery} />}

          <div className="my-8 h-px w-full bg-gradient-to-r from-transparent via-gray-300 to-transparent dark:via-gray-700" />

          <Author
            authorImage={authorImage}
            author={author}
            author_linkdin={author_linkdin}
            linkdin_followers={linkdin_followers}
          />
        </motion.div>
      </div>
    </motion.div>
  );
};

export default DetailBlog;
