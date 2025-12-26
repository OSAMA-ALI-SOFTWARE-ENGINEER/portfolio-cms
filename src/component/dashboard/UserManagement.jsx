import React, { useState } from "react";
import { useUsers } from "../user/useUsers";
import { useDeleteUser } from "../user/useDeleteUser";
import { dateFormatter } from "../../helper/DateFormatter";
import DashboardLoader from "./DashboardLoader";
import Error from "../../ui/Error";
import EditSvg from "../../ui/EditSvg";
import DeleteSvg from "../../ui/DeleteSvg";
import EditUserModal from "./EditUserModal";
import { getImageUrl } from "../../helper/imageHelper";
import DataTable from "../../ui/dashboard/DataTable";

const UserManagement = () => {
  const { users, isLoading, isError } = useUsers();
  const { deleteUser, isDeleting } = useDeleteUser();
  const [isMenuOpen, setIsMenuOpen] = useState(null);
  const [editingUser, setEditingUser] = useState(null);

  const handleMenuToggle = (index) => {
    setIsMenuOpen(isMenuOpen === index ? null : index);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      deleteUser(id);
      setIsMenuOpen(null);
    }
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setIsMenuOpen(null);
  };

  if (isLoading) return <DashboardLoader />;
  if (isError) return <Error />;

  const columns = [
    {
      header: "User",
      accessor: "name",
      render: (user) => (
        <div className="flex items-center gap-3">
          <div className="flex-shrink-0">
            <img
              className="h-10 w-10 rounded-full border border-gray-200 object-cover dark:border-gray-700"
              src={
                user.avatar && !user.avatar.includes("via.placeholder.com")
                  ? getImageUrl(user.avatar)
                  : "https://ui-avatars.com/api/?name=" + user.name
              }
              alt={user.name}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "https://ui-avatars.com/api/?name=" + user.name;
              }}
            />
          </div>
          <div className="font-semibold text-gray-900 dark:text-white">{user.name}</div>
        </div>
      ),
    },
    {
      header: "Email",
      accessor: "email",
    },
    {
      header: "Role",
      accessor: "role",
      render: (user) => (
        <span
          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${user.isAdmin
            ? "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300"
            : user.role === "editor"
              ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
              : "bg-gray-100 text-gray-800 dark:bg-gray-700/30 dark:text-gray-300"
            }`}
        >
          {user.isAdmin ? "Admin" : user.role === "editor" ? "Editor" : "User"}
        </span>
      ),
    },
    {
      header: "Joined at",
      accessor: "createdAt",
      render: (user) => dateFormatter(user.createdAt),
    },
    {
      header: "Actions",
      accessor: "actions",
      render: (user, index) => (
        <div className="relative">
          <button
            onClick={() => handleMenuToggle(user.id)}
            className="rounded-full p-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
              />
            </svg>
          </button>

          {isMenuOpen === user.id && (
            <div className="glass absolute right-0 top-full z-50 mt-1 w-36 origin-top-right rounded-lg shadow-xl ring-1 ring-black ring-opacity-5 focus:outline-none">
              <div className="py-1">
                <button
                  onClick={() => handleEdit(user)}
                  className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-white/10"
                >
                  <EditSvg className="mr-3 h-4 w-4" />
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(user.id)}
                  disabled={isDeleting || user.isAdmin}
                  className="flex w-full items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 disabled:opacity-50"
                >
                  <DeleteSvg className="mr-3 h-4 w-4" />
                  Delete
                </button>
              </div>
            </div>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6 p-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">All Users</h1>
      </div>

      <div className="w-full">
        <DataTable
          columns={columns}
          data={users}
          isLoading={isLoading}
          emptyMessage="No users found."
        />
      </div>

      {editingUser && (
        <EditUserModal
          user={editingUser}
          isOpen={!!editingUser}
          onClose={() => setEditingUser(null)}
        />
      )}
    </div>
  );
};

export default UserManagement;
