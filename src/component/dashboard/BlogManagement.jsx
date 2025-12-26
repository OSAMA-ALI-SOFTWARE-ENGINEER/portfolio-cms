import React, { useState } from "react";
// import { useBlogs } from "../blog/useBlogs"; // Replaced by useAdminBlogs
import { useAdminBlogs } from "../blog/useAdminBlogs";
import { dateFormatter } from "../../helper/DateFormatter";
import DashboardLoader from "./DashboardLoader";
import Error from "../../ui/Error";
import DeleteSvg from "../../ui/DeleteSvg";
import EditSvg from "../../ui/EditSvg";
import AddSvg from "../../ui/AddSvg";
import { Link, useSearchParams } from "react-router-dom"; // Added useSearchParams
import UpdateBlog from "../blog/UpdateBlog";
import CreateBlog from "../blog/CreateBlog";
import Button from "../../ui/Button";
import { useDeleteBlog } from "../blog/useDeleteBlog";
import { useBulkUpdateBlogs } from "../blog/useBulkUpdateBlogs";
import { useUpdateBlogStatus } from "../blog/useUpdateBlogStatus";
import DeleteConfirmationModal from "./DeleteConfirmationModal";

const BlogManagement = () => {
  const [activeTab, setActiveTab] = useState("all");
  const { deleteBlog, isDeleting } = useDeleteBlog();
  const { bulkUpdateBlogs, isBulkUpdating } = useBulkUpdateBlogs();
  const { updateStatus } = useUpdateBlogStatus();

  // Use admin hook with active tab status
  const { blogs: filteredBlogs, isLoading, isError } = useAdminBlogs(activeTab);

  const [isMenuOpen, setIsMenuOpen] = useState(null);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [blogToDelete, setBlogToDelete] = useState(null);
  const [editId, setEditId] = useState(null);
  const [selectedBlogs, setSelectedBlogs] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();

  const handleMenuToggle = (index) => {
    setIsMenuOpen(isMenuOpen === index ? null : index);
  };

  const handleAddClick = () => {
    setIsMenuOpen(null);
    setShowAddModal(true);
  };

  const closeUpdateModal = () => setShowUpdateModal(false);
  const closeAddModal = () => setShowAddModal(false);

  const handleUpdate = (id) => {
    setIsMenuOpen(null);
    setEditId(id);
    setShowUpdateModal(true);
  };

  const handleDelete = (blog) => {
    setBlogToDelete(blog);
    setShowDeleteModal(true);
    setIsMenuOpen(null);
  };

  const handleConfirmDelete = (isPermanent) => {
    if (blogToDelete) {
      deleteBlog({ id: blogToDelete.id, force: isPermanent });
      setShowDeleteModal(false);
      setBlogToDelete(null);
    }
  };

  const handleRestore = (id) => {
    updateStatus({ id, status: 'draft' });
    setIsMenuOpen(null);
  };

  // Bulk selection handlers
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedBlogs(filteredBlogs.map(blog => blog.id));
    } else {
      setSelectedBlogs([]);
    }
  };

  const handleSelectBlog = (blogId) => {
    setSelectedBlogs(prev =>
      prev.includes(blogId)
        ? prev.filter(id => id !== blogId)
        : [...prev, blogId]
    );
  };

  // Bulk action handlers
  const handleBulkDelete = () => {
    const isTrash = activeTab === 'trash';
    // For bulk delete, we might still want a simple confirm or a bulk modal.
    // User request specifically mentioned "delete the blog post", implying single action.
    // I'll keep bulk delete simple for now or use the modal if length is 1.
    // To respect the request "Need a popup model when i wanna delete the blog post", assumes single.

    // Let's use standard confirm for bulk for now to avoid complexity of multi-delete modal,
    // or we could adapt the modal, but the request was specific about "checkbox for confirming... second one temporary".
    // This logic applies 1:1 best.

    const message = isTrash
      ? `Permanently delete ${selectedBlogs.length} blog(s)? This cannot be undone.`
      : `Move ${selectedBlogs.length} blog(s) to trash?`;

    if (window.confirm(message)) {
      selectedBlogs.forEach(id => deleteBlog({ id, force: isTrash }));
      setSelectedBlogs([]);
    }
  };

  const handleBulkPublish = () => {
    bulkUpdateBlogs({ blogIds: selectedBlogs, isPublished: true });
    setSelectedBlogs([]);
  };

  const handleBulkDraft = () => {
    bulkUpdateBlogs({ blogIds: selectedBlogs, isPublished: false });
    setSelectedBlogs([]);
  };

  const handleSearchObj = (e) => {
    searchParams.set("search", e.target.value);
    setSearchParams(searchParams);
  };
  const searchQuery = searchParams.get("search") || "";


  if (isLoading) return <DashboardLoader />;
  if (isError) return <Error />;

  const tabs = [
    { id: 'all', label: 'All' },
    { id: 'published', label: 'Published' },
    { id: 'draft', label: 'Drafts' },
    { id: 'trash', label: 'Trash' }
  ];

  return (
    <>
      {showAddModal && <CreateBlog onClose={closeAddModal} />}

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleConfirmDelete}
        title={blogToDelete?.title}
        isPermanentDelete={activeTab === 'trash'}
      />

      <div className="text-sm text-stone-600 dark:text-white">
        <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-3xl font-semibold">Manage Blogs</h1>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            {/* Search Input */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search blogs..."
                value={searchQuery}
                onChange={handleSearchObj}
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 pr-10 text-sm text-gray-700 placeholder-gray-400 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/20 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:placeholder-gray-500 sm:w-64"
              />
              <svg
                className="absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>

            <Button onClick={handleAddClick} svg={<AddSvg />}>
              create blog
            </Button>
          </div>
        </div>

        {/* Status Tabs */}
        <div className="mb-6 flex space-x-1 rounded-xl bg-gray-100 p-1 dark:bg-gray-800/50">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                setSelectedBlogs([]); // Clear selection on tab change
              }}
              className={`w-full rounded-lg py-2.5 text-sm font-medium leading-5 ring-white ring-opacity-60 focus:outline-none focus:ring-2 disabled:opacity-50
                    ${activeTab === tab.id
                  ? 'bg-white text-sky-700 shadow dark:bg-gray-700 dark:text-white'
                  : 'text-gray-500 hover:bg-white/[0.12] hover:text-sky-600 dark:text-gray-400 dark:hover:text-white'
                }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Bulk Actions Bar */}
        {selectedBlogs.length > 0 && (
          <div className="mb-4 flex items-center justify-between rounded-lg bg-sky-50 p-4 dark:bg-sky-900/20">
            <span className="font-semibold text-sky-700 dark:text-sky-300">
              {selectedBlogs.length} blog(s) selected
            </span>
            <div className="flex gap-2">
              {activeTab !== 'trash' && (
                <>
                  <button onClick={handleBulkPublish} disabled={isBulkUpdating} className="rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-green-700 disabled:opacity-50">Publish</button>
                  <button onClick={handleBulkDraft} disabled={isBulkUpdating} className="rounded-md bg-yellow-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-yellow-700 disabled:opacity-50">Draft</button>
                </>
              )}
              <button
                onClick={handleBulkDelete}
                disabled={isDeleting}
                className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700 disabled:opacity-50"
              >
                {activeTab === 'trash' ? 'Delete Permanently' : 'Delete'}
              </button>
            </div>
          </div>
        )}

        {/* Table Content */}
        <div className="flex min-h-[75vh] flex-col rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">

          <div className="flex-1 overflow-x-auto scrollBar-hide">
            <table className="table table-xs w-full text-left sm:table-md md:table-lg">
              <thead className="border-b border-gray-200 bg-gray-50 text-xs uppercase text-gray-500 dark:border-gray-700 dark:bg-gray-700/50 dark:text-gray-400">
                <tr>
                  <th className="w-12 px-6 py-3">
                    <input
                      type="checkbox"
                      checked={filteredBlogs?.length > 0 && selectedBlogs.length === filteredBlogs.length}
                      onChange={handleSelectAll}
                      className="h-4 w-4 cursor-pointer rounded border-gray-300 text-sky-600 focus:ring-2 focus:ring-sky-500"
                    />
                  </th>
                  <th className="px-6 py-3">Title</th>
                  {activeTab === 'all' && <th className="px-6 py-3">Status</th>}
                  <th className="px-6 py-3">Author</th>
                  <th className="px-6 py-3">Created</th>
                  <th className="px-6 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {filteredBlogs?.length === 0 ? (
                  <tr>
                    <td colSpan={10} className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <span className="text-4xl">📭</span>
                        <p className="text-lg font-medium">No blogs found in {activeTab}</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredBlogs?.map((blog, index) => {
                    const getImageUrl = (path) => {
                      if (!path) return null;
                      if (path.startsWith("file:") || path.includes("/Temp/") || path.includes("\\Temp\\")) return null;
                      if (path.startsWith("http") || path.startsWith("https")) return path;
                      let cleanPath = path;
                      if (path.includes(':') || path.includes('xampp') || path.includes('backend')) {
                        if (path.includes('uploads')) {
                          const parts = path.split('uploads');
                          cleanPath = 'uploads' + parts[parts.length - 1].replace(/\\/g, '/');
                        } else return null;
                      } else {
                        cleanPath = path.replace(/^backend[\\/]/, "").replace(/\\/g, "/");
                      }
                      return `http://localhost:5000/${cleanPath}`;
                    };
                    const imageUrl = getImageUrl(blog?.blogImage);

                    return (
                      <tr
                        key={blog.id}
                        className="group bg-white duration-200 hover:bg-gray-50 dark:bg-gray-800 dark:hover:bg-gray-700/50"
                      >
                        <td className="px-6 py-4">
                          <input
                            type="checkbox"
                            checked={selectedBlogs.includes(blog.id)}
                            onChange={() => handleSelectBlog(blog.id)}
                            className="h-4 w-4 cursor-pointer rounded border-gray-300 text-sky-600 focus:ring-2 focus:ring-sky-500"
                          />
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-4">
                            <div className="avatar">
                              <div className="h-10 w-10 overflow-hidden rounded-lg shadow-sm">
                                {imageUrl ? (
                                  <img src={imageUrl} alt="blog" className="h-full w-full object-cover" onError={(e) => {
                                    e.target.style.display = 'none';
                                    e.target.nextSibling.style.display = 'flex';
                                  }} />
                                ) : null}
                                <div className="hidden h-full w-full items-center justify-center bg-gradient-to-br from-sky-400 to-cyan-600 text-sm font-bold text-white" style={{ display: imageUrl ? 'none' : 'flex' }}>
                                  {blog.title.charAt(0).toUpperCase()}
                                </div>
                              </div>
                            </div>
                            <div className="flex flex-col">
                              <Link to={`/blog/${blog.id}`} className="font-medium text-gray-900 transition-colors hover:text-sky-600 dark:text-white dark:hover:text-sky-400">
                                {blog?.title?.slice(0, 40)}...
                              </Link>
                              <span className="text-xs text-gray-500">{blog?.category}</span>
                            </div>
                          </div>
                        </td>

                        {activeTab === 'all' && (
                          <td className="px-6 py-4">
                            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium
                            ${blog.status === 'published' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' :
                                blog.status === 'draft' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300' :
                                  'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                              }`}>
                              {blog.status}
                            </span>
                          </td>
                        )}

                        <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">{blog.author}</td>
                        <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">{dateFormatter(blog.createdAt)}</td>
                        <td className="px-6 py-4">
                          <div className="relative">
                            <button
                              className="rounded-full p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-700"
                              onClick={() => handleMenuToggle(index)}
                            >
                              <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                              </svg>
                            </button>

                            {isMenuOpen === index && (
                              <div className="absolute right-0 top-full z-10 mt-1 w-48 origin-top-right rounded-md border border-gray-100 bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none dark:border-gray-700 dark:bg-gray-800">
                                {activeTab === 'trash' ? (
                                  <>
                                    <button className="flex w-full items-center gap-2 px-4 py-2 text-sm text-green-600 hover:bg-gray-50 dark:hover:bg-gray-700" onClick={() => handleRestore(blog.id)}>
                                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" /></svg>
                                      Restore
                                    </button>
                                    <button className="flex w-full items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-gray-50 dark:hover:bg-gray-700" onClick={() => handleDelete(blog)}>
                                      <DeleteSvg /> Delete Permanently
                                    </button>
                                  </>
                                ) : (
                                  <>
                                    <button className="flex w-full items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 dark:text-gray-200 dark:hover:bg-gray-700" onClick={() => handleUpdate(blog.id)}>
                                      <EditSvg /> Edit
                                    </button>
                                    <button className="flex w-full items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-gray-50 dark:text-red-400 dark:hover:bg-gray-700" onClick={() => handleDelete(blog)}>
                                      <DeleteSvg /> Delete
                                    </button>
                                    <Link to={`/blog/${blog.id}`} target="_blank" className="flex w-full items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 dark:text-gray-200 dark:hover:bg-gray-700">
                                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                                      View
                                    </Link>
                                  </>
                                )}
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
              {showUpdateModal && (
                <UpdateBlog
                  onClose={closeUpdateModal}
                  editId={editId}
                // setEditId={setEditId}
                />
              )}
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default BlogManagement;
