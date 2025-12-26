import React from "react";
import { Link } from "react-router-dom";
import { dateFormatter } from "../../helper/DateFormatter";
import { getImageUrl } from "../../helper/imageHelper";

const BlogCard = ({ blog }) => {
    const { id, title, blogImage, author, authorImage, createdAt, content } = blog;

    // Create excerpt (approx 25 words)
    const excerpt = content
        ? content.replace(/<[^>]*>/g, "").split(" ").slice(0, 25).join(" ") + "..."
        : "";

    return (
        <div className="group relative flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:bg-cardBg dark:shadow-none dark:hover:shadow-black/30">
            {/* Hero Image */}
            <div className="relative aspect-[16/9] w-full overflow-hidden">
                <Link to={`/blog/${id}`}>
                    <img
                        src={getImageUrl(blogImage) || `https://placehold.co/600x400?text=${encodeURIComponent(title)}`}
                        alt={title}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                        onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = `https://placehold.co/600x400?text=${encodeURIComponent(title)}`;
                        }}
                    />
                </Link>
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            </div>

            {/* Content Body */}
            <div className="flex flex-1 flex-col p-6">
                {/* Date */}
                <div className="mb-3 text-xs font-semibold uppercase tracking-wider text-sky-500">
                    {dateFormatter(createdAt)}
                </div>

                {/* Title */}
                <Link to={`/blog/${id}`} className="mb-3 block">
                    <h3 className="line-clamp-2 font-secondary text-xl font-bold leading-tight text-gray-800 transition-colors group-hover:text-sky-500 dark:text-gray-100">
                        {title}
                    </h3>
                </Link>

                {/* Author */}
                <div className="mb-4 flex items-center gap-2">
                    <div className="h-8 w-8 overflow-hidden rounded-full ring-2 ring-gray-100 dark:ring-gray-700">
                        <img
                            src={authorImage ? getImageUrl(authorImage) : `https://ui-avatars.com/api/?name=${encodeURIComponent(author)}`}
                            alt={author}
                            className="h-full w-full object-cover"
                        />
                    </div>
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                        {author}
                    </span>
                </div>

                {/* Excerpt */}
                <p className="mb-6 line-clamp-3 flex-1 text-sm leading-relaxed text-gray-500 dark:text-gray-400">
                    {excerpt}
                </p>

                {/* Footer Button */}
                <Link
                    to={`/blog/${id}`}
                    className="group/btn inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gray-50 py-3 text-sm font-bold uppercase tracking-wider text-gray-700 transition-colors hover:bg-sky-500 hover:text-white dark:bg-black/20 dark:text-gray-300 dark:hover:bg-sky-600/20 dark:hover:text-sky-400"
                >
                    <span>View in Detail</span>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="2"
                        stroke="currentColor"
                        className="h-4 w-4 transition-transform duration-300 group-hover/btn:translate-x-1"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                    </svg>
                </Link>
            </div>
        </div>
    );
};

export default BlogCard;
