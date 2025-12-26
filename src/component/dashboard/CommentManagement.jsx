import React, { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useAdminComments } from "../comment/useAdminComments";
import { useUpdateCommentStatus } from "../comment/useUpdateCommentStatus";
import { useDeleteComment } from "../comment/useDeleteComment";
import DashboardLoader from "./DashboardLoader";
import Error from "../../ui/Error";
import DataTable from "../../ui/dashboard/DataTable";
import DeleteConfirmationModal from "./DeleteConfirmationModal";
import { dateFormatter } from "../../helper/DateFormatter";
import toast from "react-hot-toast";

const CommentManagement = () => {
    const [activeTab, setActiveTab] = useState("pending");
    const [searchParams, setSearchParams] = useSearchParams();
    const { updateStatus, isUpdating } = useUpdateCommentStatus();
    const { deleteComment, isDeleting } = useDeleteComment();

    // Fetch data
    const { comments, isLoading, isError } = useAdminComments(activeTab);

    // Modal State
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [commentToDelete, setCommentToDelete] = useState(null);

    const handleSearchObj = (e) => {
        searchParams.set("search", e.target.value);
        setSearchParams(searchParams);
    };
    const searchQuery = searchParams.get("search") || "";

    const handleApprove = (id) => {
        updateStatus({ id, status: "approved" });
    };

    const handleReject = (id) => {
        updateStatus({ id, status: "trash" });
    };

    const handleRestore = (id) => {
        updateStatus({ id, status: "pending" });
    };

    const handleDeleteClick = (comment) => {
        setCommentToDelete(comment);
        setDeleteModalOpen(true);
    };

    const handleConfirmDelete = (isPermanent) => {
        if (!commentToDelete) return;

        if (isPermanent) {
            deleteComment(commentToDelete.id);
        } else {
            // Soft delete (Move to trash)
            updateStatus({ id: commentToDelete.id, status: "trash" });
        }
    };

    // Columns Configuration
    const columns = [
        {
            header: "Author",
            accessor: "name",
            render: (row) => (
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 flex-shrink-0 overflow-hidden rounded-full border border-gray-200 bg-gray-100 dark:border-gray-700 dark:bg-gray-700">
                        <img
                            src={`https://ui-avatars.com/api/?name=${encodeURIComponent(row.name)}&background=random`}
                            alt={row.name}
                            className="h-full w-full object-cover"
                        />
                    </div>
                    <div>
                        <div className="font-semibold text-gray-900 dark:text-white">{row.name}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">{row.email}</div>
                    </div>
                </div>
            )
        },
        {
            header: "Comment",
            accessor: "content",
            render: (row) => (
                <div className="max-w-md">
                    <p className="line-clamp-2 text-sm text-gray-600 dark:text-gray-300" title={row.content}>
                        {row.content}
                    </p>
                    <div className="mt-1 text-xs text-gray-400">
                        On: <span className="font-medium text-sky-600 dark:text-sky-400">{row.blog_title || 'Unknown Blog'}</span>
                    </div>
                </div>
            )
        },
        {
            header: "Date",
            accessor: "created_at",
            render: (row) => <span className="text-xs text-gray-500">{dateFormatter(row.created_at)}</span>
        },
        {
            header: "Status",
            accessor: "status",
            render: (row) => (
                <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize
                    ${row.status === 'approved' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' :
                        row.status === 'pending' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300' :
                            'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                    }
                `}>
                    {row.status}
                </span>
            )
        },
        {
            header: "Actions",
            accessor: "actions",
            render: (row) => (
                <div className="flex items-center gap-2">
                    {row.status === 'pending' && (
                        <>
                            <button
                                onClick={() => handleApprove(row.id)}
                                disabled={isUpdating}
                                className="rounded p-1 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20"
                                title="Approve"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                                </svg>
                            </button>
                            <button
                                onClick={() => handleReject(row.id)}
                                disabled={isUpdating}
                                className="rounded p-1 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                                title="Reject / Trash"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </>
                    )}
                    {row.status === 'approved' && (
                        <button
                            onClick={() => handleReject(row.id)}
                            disabled={isUpdating}
                            className="rounded p-1 text-orange-500 hover:bg-orange-50 dark:hover:bg-orange-900/20"
                            title="Move to Trash"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m20.25 7.5-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5m8.25 3v6.75m0 0-3-3m3 3 3-3M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z" />
                            </svg>
                        </button>
                    )}
                    {row.status === 'trash' && (
                        <>
                            <button
                                onClick={() => handleRestore(row.id)}
                                disabled={isUpdating}
                                className="rounded p-1 text-sky-600 hover:bg-sky-50 dark:hover:bg-sky-900/20"
                                title="Restore to Pending"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 15 3 9m0 0 6-6M3 9h12a6 6 0 0 1 0 12h-3" />
                                </svg>
                            </button>
                            <button
                                onClick={() => handleDeleteClick(row)}
                                disabled={isDeleting}
                                className="rounded p-1 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                                title="Delete Permanently"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                </svg>
                            </button>
                        </>
                    )}
                </div>
            )
        }
    ];

    if (isLoading) return <DashboardLoader />;
    if (isError) return <Error />;

    const tabs = [
        { id: 'pending', label: 'Pending' },
        { id: 'approved', label: 'Approved' },
        { id: 'trash', label: 'Trash' }
    ];

    return (
        <div className="space-y-6">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
                    Manage Comments
                </h1>

                {/* Search */}
                <div className="relative w-full sm:w-72">
                    <input
                        type="text"
                        placeholder="Search comments..."
                        className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-10 pr-4 text-sm text-gray-700 outline-none transition-all focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
                        onChange={handleSearchObj}
                        value={searchQuery}
                    />
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 rounded-xl bg-gray-100 p-1 dark:bg-gray-800/50">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex-1 rounded-lg py-2.5 text-sm font-medium transition-all duration-200 ${activeTab === tab.id
                                ? 'bg-white text-sky-600 shadow-sm dark:bg-gray-700 dark:text-white'
                                : 'text-gray-500 hover:bg-gray-200/50 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-700/50 dark:hover:text-gray-200'
                            }`}
                    >
                        {tab.label}
                        {/* You could add counts here if available from API */}
                    </button>
                ))}
            </div>

            {/* Content */}
            <div className="flex min-h-[75vh] flex-col rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
                <DataTable
                    columns={columns}
                    data={comments || []}
                    isLoading={isLoading}
                    emptyMessage={
                        activeTab === 'pending' ? "No pending comments! All caught up. 🎉" :
                            activeTab === 'trash' ? "Trash is empty." :
                                "No comments found."
                    }
                />
            </div>

            <DeleteConfirmationModal
                isOpen={deleteModalOpen}
                onClose={() => setDeleteModalOpen(false)}
                onConfirm={handleConfirmDelete}
                title={commentToDelete ? `Comment by ${commentToDelete.name}` : 'Comment'}
            />
        </div>
    );
};

export default CommentManagement;
