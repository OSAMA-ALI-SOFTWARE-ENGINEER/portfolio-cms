import React from "react";
import { useBlogs } from "./useBlogs";
import { useVisitorStats } from "../visitor/useVisitorStats";

const BlogHero = () => {
    const { count: blogCount } = useBlogs();
    const { stats } = useVisitorStats();

    // Use real data where available, fallback for others
    const totalViews = stats?.blogPageCounter || 0;
    // Estimate reads as 60% of views for now (mock logic)
    const totalReads = Math.floor(totalViews * 0.6);

    return (
        <div className="relative mb-12 w-full overflow-hidden rounded-3xl bg-gradient-to-br from-gray-900 via-slate-900 to-black p-8 text-center text-white shadow-2xl sm:p-12">
            {/* Background Decorative Elements */}
            <div className="absolute -left-10 -top-10 h-64 w-64 rounded-full bg-sky-500/20 blur-[100px]" />
            <div className="absolute -right-10 -bottom-10 h-64 w-64 rounded-full bg-purple-500/20 blur-[100px]" />

            <div className="relative z-10 flex flex-col items-center justify-center space-y-6">
                <h1 className="font-secondary text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
                    <span className="bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                        Our Latest Insights
                    </span>
                </h1>

                <p className="max-w-2xl text-lg text-gray-400 sm:text-xl">
                    Explore articles on web development, tech trends, and my personal journey in software engineering.
                </p>

                {/* Counters */}
                <div className="mt-8 grid grid-cols-3 gap-8 sm:gap-16">
                    <div className="flex flex-col items-center gap-1">
                        <span className="text-3xl font-bold text-sky-400 sm:text-4xl">
                            {blogCount || 0}
                        </span>
                        <span className="text-xs font-medium uppercase tracking-wider text-gray-500 sm:text-sm">
                            Posts
                        </span>
                    </div>

                    <div className="flex flex-col items-center gap-1">
                        {/* Using 'en-US' locale for comma separation e.g. 1,234 */}
                        <span className="text-3xl font-bold text-purple-400 sm:text-4xl">
                            {totalViews.toLocaleString('en-US')}
                        </span>
                        <span className="text-xs font-medium uppercase tracking-wider text-gray-500 sm:text-sm">
                            Views
                        </span>
                    </div>

                    <div className="flex flex-col items-center gap-1">
                        <span className="text-3xl font-bold text-emerald-400 sm:text-4xl">
                            {totalReads.toLocaleString('en-US')}+
                        </span>
                        <span className="text-xs font-medium uppercase tracking-wider text-gray-500 sm:text-sm">
                            Reads
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BlogHero;
