import React from "react";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { useBlogComments } from "../comment/useBlogComments";
import { useCreateComment } from "../comment/useCreateComment";
import { dateFormatter } from "../../helper/DateFormatter";

const CommentSection = ({ blogId }) => {
    const { register, handleSubmit, reset, formState: { errors } } = useForm();
    const { comments, isLoading } = useBlogComments(blogId);
    const { createComment, isCreating } = useCreateComment();

    const onSubmit = (data) => {
        createComment({ blogId, ...data }, {
            onSuccess: () => {
                reset();
            }
        });
    };

    return (
        <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
            <h3 className="mb-8 text-2xl font-bold text-gray-900 dark:text-white">
                Comments ({comments?.length || 0})
            </h3>

            {/* Comment Form */}
            <div className="mb-12 rounded-2xl bg-gray-50 p-6 dark:bg-gray-800/50 sm:p-8">
                <h4 className="mb-6 text-lg font-semibold text-gray-800 dark:text-gray-200">
                    Leave a comment
                </h4>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                        <div>
                            <label htmlFor="name" className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Name
                            </label>
                            <input
                                id="name"
                                type="text"
                                {...register("name", { required: "Name is required" })}
                                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-gray-900 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
                                placeholder="John Doe"
                            />
                            {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>}
                        </div>
                        <div>
                            <label htmlFor="email" className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Email
                            </label>
                            <input
                                id="email"
                                type="email"
                                {...register("email", {
                                    required: "Email is required",
                                    pattern: {
                                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                        message: "Invalid email address"
                                    }
                                })}
                                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-gray-900 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
                                placeholder="john@example.com"
                            />
                            {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>}
                        </div>
                    </div>
                    <div>
                        <label htmlFor="content" className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Comment
                        </label>
                        <textarea
                            id="content"
                            rows={4}
                            {...register("content", { required: "Comment cannot be empty" })}
                            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-gray-900 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
                            placeholder="Share your thoughts..."
                        />
                        {errors.content && <p className="mt-1 text-xs text-red-500">{errors.content.message}</p>}
                    </div>

                    <div className="flex justify-end">
                        <button
                            type="submit"
                            disabled={isCreating}
                            className="inline-flex items-center justify-center rounded-lg bg-sky-600 px-6 py-2.5 text-sm font-semibold text-white transition-all hover:bg-sky-700 hover:shadow-lg hover:shadow-sky-500/30 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 disabled:opacity-70 disabled:cursor-not-allowed dark:focus:ring-offset-gray-900"
                        >
                            {isCreating ? (
                                <>
                                    <svg className="mr-2 h-4 w-4 animate-spin text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Posting...
                                </>
                            ) : (
                                "Post Comment"
                            )}
                        </button>
                    </div>
                </form>
            </div>

            {/* Comment List */}
            <div className="space-y-6">
                {isLoading ? (
                    <div className="animate-pulse space-y-4">
                        {[1, 2].map((i) => (
                            <div key={i} className="flex gap-4">
                                <div className="h-12 w-12 rounded-full bg-gray-200 dark:bg-gray-700"></div>
                                <div className="flex-1 space-y-2">
                                    <div className="h-4 w-1/4 rounded bg-gray-200 dark:bg-gray-700"></div>
                                    <div className="h-16 w-full rounded bg-gray-200 dark:bg-gray-700"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : comments.length === 0 ? (
                    <div className="py-8 text-center text-gray-500 dark:text-gray-400">
                        No comments yet. Be the first to share your thoughts!
                    </div>
                ) : (
                    comments.map((comment) => (
                        <motion.div
                            key={comment.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="group flex gap-4"
                        >
                            <div className="flex-shrink-0">
                                <img
                                    className="h-10 w-10 rounded-full bg-gray-100 object-cover ring-2 ring-white dark:ring-gray-800 sm:h-12 sm:w-12"
                                    src={`https://ui-avatars.com/api/?name=${encodeURIComponent(comment.name)}&background=random`}
                                    alt={comment.name}
                                />
                            </div>
                            <div className="flex-1 rounded-2xl bg-gray-50 px-4 py-3 dark:bg-gray-800/50 sm:px-6 sm:py-5">
                                <div className="mb-2 flex items-center justify-between">
                                    <h5 className="font-bold text-gray-900 dark:text-white">
                                        {comment.name}
                                        {comment.role === 'admin' && (
                                            <span className="ml-2 inline-flex items-center rounded bg-sky-100 px-2 py-0.5 text-xs font-medium text-sky-800 dark:bg-sky-900/30 dark:text-sky-300">
                                                Author
                                            </span>
                                        )}
                                    </h5>
                                    <span className="text-xs text-gray-500 dark:text-gray-400">
                                        {dateFormatter(comment.created_at)}
                                    </span>
                                </div>
                                <div className="prose prose-sm max-w-none text-gray-600 dark:text-gray-300">
                                    <p>{comment.content}</p>
                                </div>
                            </div>
                        </motion.div>
                    ))
                )}
            </div>
        </div>
    );
};

export default CommentSection;
