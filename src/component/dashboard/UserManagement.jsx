import React, { useState } from "react";
import { useUsers } from "../user/useUsers";
import { useDeleteUser } from "../user/useDeleteUser";
import { dateFormatter } from "../../helper/DateFormatter";
import DashboardLoader from "./DashboardLoader";
import Error from "../../ui/Error";
import DeleteSvg from "../../ui/DeleteSvg";

const UserManagement = () => {
  const { users, isLoading, isError } = useUsers();
  const { deleteUser, isDeleting } = useDeleteUser();
  const [isMenuOpen, setIsMenuOpen] = useState(null);

  const handleMenuToggle = (index) => {
    setIsMenuOpen(isMenuOpen === index ? null : index);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      deleteUser(id);
      setIsMenuOpen(null);
    }
  };

  if (isLoading) return <DashboardLoader />;
  if (isError) return <Error />;

  return (
    <div className="text-sm text-stone-600 dark:text-white">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-3xl font-semibold">All Users</h1>
      </div>
      <div className="scrollBar-hide">
        <table className="table-xs table sm:table-md md:table-lg">
          <thead className="text-stone-400">
            <tr className="border-gray-200 dark:border-gray-600">
              <th>User</th>
              <th>Email</th>
              <th>Role</th>
              <th>Joined at</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users?.map((user, index) => (
              <tr
                key={user.id}
                className="border-gray-200 duration-300 odd:bg-gray-200 hover:bg-gray-300 dark:border-gray-600 dark:odd:bg-gray-800 dark:hover:bg-gray-500"
              >
                <td>
                  <div className="flex items-center gap-3">
                    <div className="avatar">
                      <div className="mask mask-squircle h-12 w-12">
                        <img
                          src={
                            user.avatar && !user.avatar.includes("via.placeholder.com")
                              ? user.avatar
                              : "https://ui-avatars.com/api/?name=" + user.name
                          }
                          alt={user.name}
                          className="border border-gray-400 bg-gray-200"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = "https://ui-avatars.com/api/?name=" + user.name;
                          }}
                        />
                      </div>
                    </div>
                    <div className="font-bold">{user.name}</div>
                  </div>
                </td>
                <td>{user.email}</td>
                <td>
                  <span className={`badge ${user.isAdmin ? "badge-primary" : "badge-ghost"}`}>
                    {user.isAdmin ? "Admin" : "User"}
                  </span>
                </td>
                <td>{dateFormatter(user.createdAt)}</td>
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
                    <div className="absolute right-0 w-48 rounded-md border border-gray-200 bg-white text-blue-500 shadow-lg z-50">
                      <ul>
                        <li className="cursor-pointer px-4 py-2 hover:bg-gray-100">
                          <button
                            disabled={isDeleting || user.isAdmin} // Prevent deleting admins for safety, or at least yourself (handled by backend)
                            className="flex items-center gap-2 disabled:cursor-not-allowed disabled:opacity-50"
                            onClick={() => handleDelete(user.id)}
                          >
                            <DeleteSvg />
                            <span>Delete</span>
                          </button>
                        </li>
                      </ul>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserManagement;
