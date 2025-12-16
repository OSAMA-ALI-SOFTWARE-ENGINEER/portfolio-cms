import React, { useState } from "react";
import { useBlogs } from "../blog/useBlogs";
import { dateFormatter } from "../../helper/DateFormatter";
import DashboardLoader from "./DashboardLoader";
import Error from "../../ui/Error";
import DeleteSvg from "../../ui/DeleteSvg";
import EditSvg from "../../ui/EditSvg";
import AddSvg from "../../ui/AddSvg";
import { Link } from "react-router-dom";
import UpdateBlog from "../blog/UpdateBlog";
import CreateBlog from "../blog/CreateBlog";
import Button from "../../ui/Button";
import { useDeleteBlog } from "../blog/useDeleteBlog";
import { useBulkUpdateBlogs } from "../blog/useBulkUpdateBlogs";

const BlogManagement = () => {
  const { deleteBlog, isDeleting } = useDeleteBlog();
  const { bulkUpdateBlogs, isBulkUpdating } = useBulkUpdateBlogs();
  const [isMenuOpen, setIsMenuOpen] = useState(null);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [selectedBlogs, setSelectedBlogs] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

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

  const handleDelete = (id) => {
    deleteBlog(id);
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
    if (window.confirm(`Delete ${selectedBlogs.length} blog(s)?`)) {
      selectedBlogs.forEach(id => deleteBlog(id));
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

  const { filterBlogs, isError, isLoading } = useBlogs();

  // Filter blogs by search query
  const filteredBlogs = filterBlogs?.filter(blog =>
    blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    blog.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    blog.author.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  if (isLoading) return <DashboardLoader />;
  if (isError) return <Error />;
  
  return (
    <>
      {showAddModal && <CreateBlog onClose={closeAddModal} />}
      <div className="text-sm text-stone-600 dark:text-white">
        <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-3xl font-semibold">All Blogs</h1>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            {/* Search Input */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search blogs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
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

        {/* Bulk Actions Bar */}
        {selectedBlogs.length > 0 && (
          <div className="mb-4 flex items-center justify-between rounded-lg bg-sky-50 p-4 dark:bg-sky-900/20">
            <span className="font-semibold text-sky-700 dark:text-sky-300">
              {selectedBlogs.length} blog(s) selected
            </span>
            <div className="flex gap-2">
              <button
                onClick={handleBulkPublish}
                disabled={isBulkUpdating}
                className="rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-green-700 disabled:opacity-50"
              >
                Publish
              </button>
              <button
                onClick={handleBulkDraft}
                disabled={isBulkUpdating}
                className="rounded-md bg-yellow-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-yellow-700 disabled:opacity-50"
              >
                Draft
              </button>
              <button
                onClick={handleBulkDelete}
                disabled={isDeleting}
                className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700 disabled:opacity-50"
              >
                Delete
              </button>
            </div>
          </div>
        )}

        <div className="scrollBar-hide">
          <table className=" table-xs table sm:table-md md:table-lg ">
            {/* head */}
            <thead className=" text-stone-400">
                <tr className=" border-gray-200 dark:border-gray-600">
                <th className="w-12">
                  <input
                    type="checkbox"
                    checked={selectedBlogs.length === filteredBlogs.length && filteredBlogs.length > 0}
                    onChange={handleSelectAll}
                    className="h-4 w-4 cursor-pointer rounded border-gray-300 text-sky-600 focus:ring-2 focus:ring-sky-500"
                  />
                </th>
                <th>Title</th>
                <th>Author</th>
                <th>Created at</th>
                <th>Modified at</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {/* row 1 */}
              {filteredBlogs?.map((blog, index) => {
                // Helper to construct image URL
                const getImageUrl = (path) => {
                  if (!path) return null;
                  
                  // Block file:// URLs and temp paths
                  if (path.startsWith("file:") || path.includes("/Temp/") || path.includes("\\Temp\\")) {
                    return null;
                  }
                  
                  if (path.startsWith("http") || path.startsWith("https")) return path;
                  
                  // Remove any absolute path prefixes
                  let cleanPath = path;
                  
                  // If it contains a drive letter or full path, extract just the uploads part
                  if (path.includes(':') || path.includes('xampp') || path.includes('backend')) {
                    if (path.includes('uploads')) {
                      const parts = path.split('uploads');
                      cleanPath = 'uploads' + parts[parts.length - 1].replace(/\\/g, '/');
                    } else {
                      // Invalid path, return null
                      return null;
                    }
                  } else {
                    cleanPath = path.replace(/^backend[\\/]/, "").replace(/\\/g, "/");
                  }
                  
                  return `http://localhost:5000/${cleanPath}`;
                };

                const imageUrl = getImageUrl(blog?.blogImage);

                return (
                  <tr
                    key={blog.id}
                    className="border-gray-200 duration-300 odd:bg-gray-200 hover:bg-gray-300 dark:border-gray-600 dark:odd:bg-gray-800 dark:hover:bg-gray-500"
                  >
                    <td>
                      <input
                        type="checkbox"
                        checked={selectedBlogs.includes(blog.id)}
                        onChange={() => handleSelectBlog(blog.id)}
                        className="h-4 w-4 cursor-pointer rounded border-gray-300 text-sky-600 focus:ring-2 focus:ring-sky-500"
                      />
                    </td>
                    <td>
                      <div className="flex items-center gap-3">
                        <div className="avatar ">
                          <div className="mask mask-squircle h-12 w-12">
                            {imageUrl ? (
                              <img
                                src={imageUrl}
                                alt="blog"
                                className="border border-gray-400 bg-gray-200 object-cover"
                                onError={(e) => {
                                  e.target.onerror = null;
                                  // Replace with first letter avatar
                                  const parent = e.target.parentElement;
                                  parent.innerHTML = `
                                    <div class="flex h-full w-full items-center justify-center bg-gradient-to-br from-sky-400 to-cyan-600 text-xl font-bold text-white">
                                      ${blog.title.charAt(0).toUpperCase()}
                                    </div>
                                  `;
                                }}
                              />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-sky-400 to-cyan-600 text-xl font-bold text-white">
                                {blog.title.charAt(0).toUpperCase()}
                              </div>
                            )}
                          </div>
                        </div>
                        <div>
                          <Link 
                            to={`/blog/${blog.id}`}
                            className="text-xs font-bold transition-colors hover:text-sky-600 dark:hover:text-sky-400"
                          >
                            {blog?.title?.slice(0, 30)}...
                          </Link>
                          <div className="text-sm opacity-50">
                            {blog?.category}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className=" whitespace-nowrap">{blog.author}</td>
                    <td>{dateFormatter(blog.createdAt)}</td>
                    <td>{dateFormatter(blog.updatedAt)}</td>
                    <td>
                      <button
                        className="text-gray-500 hover:text-gray-700 dark:text-gray-300"
                        onClick={() => handleMenuToggle(index)}
                      >
                        <svg
                          className="h-6 w-6"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M12 6v.01M12 12v.01M12 18v.01"
                          ></path>
                        </svg>
                      </button>
                      {isMenuOpen === index && (
                        <div className="absolute right-0 w-48 rounded-md border border-gray-200 bg-white text-blue-500 shadow-lg">
                          <ul>
                            <li className="flex cursor-pointer items-center gap-2 px-4 py-2 hover:bg-gray-100">
                              <EditSvg />
                              <button onClick={() => handleUpdate(blog.id)}>
                                Update
                              </button>
                            </li>
                            <li className="cursor-pointer px-4 py-2 hover:bg-gray-100">
                              <button
                                disabled={isDeleting}
                                className="flex items-center gap-2 disabled:cursor-not-allowed disabled:opacity-50"
                                onClick={() => handleDelete(blog.id)}
                              >
                                <DeleteSvg />
                                <span>Delete</span>
                              </button>
                            </li>
                            <li className="cursor-pointer px-4 py-2  hover:bg-gray-100">
                              <Link
                                onClick={() => setIsMenuOpen(null)}
                                className="flex items-center gap-2"
                                to={`/blog/${blog.id}`}
                                target={"_blank"}
                              >
                                <span>
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth="2"
                                    stroke="currentColor"
                                    className=" h-4 w-4"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
                                    />
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                                    />
                                  </svg>
                                </span>
                                <span>View</span>
                              </Link>
                            </li>
                          </ul>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
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
    </>
  );
};

export default BlogManagement;
