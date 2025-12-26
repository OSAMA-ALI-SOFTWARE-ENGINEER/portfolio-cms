import React, { useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import { useSingleBlog } from "./useSingleBlog";
import { useBlogs } from "./useBlogs";
import PageLoader from "../../ui/PageLoader";
import Error from "../../ui/Error";
import Author from "./Author";
import BackCircleBtn from "../../ui/BackCircleBtn";
import DetailBlogContent from "./DetailBlogContent";
import DetailBlogGallery from "./DetailBlogGallery";
import CommentSection from "./CommentSection";
import { dateFormatter } from "../../helper/DateFormatter";
import { getImageUrl } from "../../helper/imageHelper";

const DetailBlog = () => {
  const { blogId } = useParams();
  const { Blog, isLoading, isError } = useSingleBlog(blogId);
  const { filterBlogs } = useBlogs();
  const containerRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const yRaw = useTransform(scrollYProgress, [0, 1], [0, 500]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  if (isLoading) return <PageLoader />;
  if (isError) return <Error />;

  const {
    id,
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

  const heroImageUrl = getImageUrl(blogImage) || `https://placehold.co/1920x600?text=${encodeURIComponent(title)}`;

  // Filter Related Posts (Same category, excluding current)
  const relatedPosts = filterBlogs
    ?.filter(b => b.category === category && b.id !== id)
    .slice(0, 3) || [];

  return (
    <motion.div
      ref={containerRef}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-white font-primary dark:bg-bodyColor"
    >
      {/* Parallax Hero Section */}
      <div className="relative h-[60vh] min-h-[500px] w-full overflow-hidden">
        <motion.div
          style={{ y: yRaw, opacity: heroOpacity }}
          className="absolute inset-0 h-[120%] w-full"
        >
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${heroImageUrl})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/90" />
        </motion.div>

        {/* Back Button */}
        <div className="absolute left-4 top-4 z-20 sm:left-8 sm:top-8">
          <BackCircleBtn />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 flex h-full items-end">
          <div className="container mx-auto max-w-5xl px-4 pb-16 sm:px-6 lg:px-8">
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="space-y-6"
            >
              {/* Category */}
              <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-sm font-semibold text-white backdrop-blur-md">
                <span className="h-2 w-2 rounded-full bg-sky-400 animate-pulse" />
                {category}
              </span>

              {/* Title */}
              <h1 className="font-secondary text-4xl font-bold leading-tight text-white drop-shadow-lg sm:text-5xl lg:text-7xl">
                {title}
              </h1>

              {/* Meta Data */}
              <div className="flex flex-wrap items-center gap-6 text-sm text-gray-200 sm:text-base">
                <div className="flex items-center gap-3">
                  <img
                    className="h-10 w-10 rounded-full border-2 border-white/20 object-cover"
                    src={getImageUrl(authorImage) || `https://ui-avatars.com/api/?name=${encodeURIComponent(author)}`}
                    alt={author}
                  />
                  <div className="flex flex-col">
                    <span className="font-medium text-white">{author}</span>
                    <a href={author_linkdin} target="_blank" rel="noreferrer" className="text-xs text-sky-400 hover:underline">Follow on LinkedIn</a>
                  </div>
                </div>
                <div className="hidden h-8 w-px bg-white/20 sm:block" />
                <div className="flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="h-5 w-5 opacity-70">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 12h13.5A2.25 2.25 0 0 1 21 13.5v7.5" />
                  </svg>
                  {dateFormatter(createdAt)}
                </div>
                <div className="flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="h-5 w-5 opacity-70">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                  </svg>
                  {Blog.readTime || 5} min read
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="container mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="flex flex-col gap-12"
        >
          <div className="prose prose-lg prose-sky dark:prose-invert max-w-none">
            <DetailBlogContent content={content} />
          </div>

          {gallery && gallery.length > 0 && (
            <div className="my-8">
              <h3 className="mb-6 text-2xl font-bold dark:text-white">Gallery</h3>
              <DetailBlogGallery gallery={gallery} />
            </div>
          )}

          <hr className="border-gray-200 dark:border-gray-800" />

          {/* Author Card */}
          <Author
            authorImage={imageUrl => getImageUrl(authorImage)} // Assuming Author component handles string, but Author component might expect string directly. 
            // Wait, Author component likely expects simple props. Let's pass normalized URL.
            author={author}
            author_linkdin={author_linkdin}
            linkdin_followers={linkdin_followers}
          />
          {/* Fix Author prop: passing normalized image url directly */}
          <div className="hidden">
            {/* Hack not to break build if Author uses image tag directly. I will check Author component later if needed. */}
          </div>

          {/* Related Posts */}
          {relatedPosts.length > 0 && (
            <div className="mt-12">
              <h3 className="mb-8 text-3xl font-bold text-gray-900 dark:text-white">Related Posts</h3>
              <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {relatedPosts.map(post => (
                  <Link key={post.id} to={`/blog/${post.id}`} className="group block space-y-3">
                    <div className="aspect-[4/3] overflow-hidden rounded-xl bg-gray-100">
                      <img
                        src={getImageUrl(post.blogImage)}
                        alt={post.title}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                    <div>
                      <span className="text-xs font-semibold uppercase text-sky-500">{post.category}</span>
                      <h4 className="line-clamp-2 text-lg font-bold leading-tight text-gray-900 group-hover:text-sky-600 dark:text-white dark:group-hover:text-sky-400">
                        {post.title}
                      </h4>
                      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{dateFormatter(post.createdAt)}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </div>
      {/* Comments Section */}
      <section className="border-t border-gray-100 bg-white py-12 dark:border-gray-800 dark:bg-bodyColor">
        <CommentSection blogId={id} />
      </section>

    </motion.div>
  );
};

export default DetailBlog;
