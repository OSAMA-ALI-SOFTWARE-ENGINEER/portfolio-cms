import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCurrentUser } from "../authentication/useCurrentUser";
import { getImageUrl } from "../../helper/imageHelper";

const AdminInfo = () => {
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();
  const { user } = useCurrentUser();
  let avatar = user?.avatar || user?.user_metadata?.avatar;
  
  if (avatar && !avatar.includes("via.placeholder.com")) {
    avatar = getImageUrl(avatar);
  } else {
    avatar = "/images.png";
  }

  const handleOptionClick = (path) => {
    setIsHovered(false);
    navigate(path);
  };

  return (
    <div
      className="relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex cursor-pointer items-center gap-2 rounded-lg px-2 py-1 transition-all duration-200 hover:bg-gray-100 dark:hover:bg-[#333A48]">
        <p className="font-medium">Admin</p>
        <img
          src={avatar}
          alt="admin"
          className="h-10 w-10 rounded-full object-cover ring-2 ring-primary transition-all duration-200 hover:ring-primary/70"
        />
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="2"
          stroke="currentColor"
          className={`h-4 w-4 transition-transform duration-300 ${
            isHovered ? "rotate-180" : ""
          }`}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m19.5 8.25-7.5 7.5-7.5-7.5"
          />
        </svg>
      </div>

      {/* Dropdown Menu */}
      <div
        className={`absolute right-0 top-full z-50 mt-2 w-56 origin-top-right overflow-hidden rounded-lg bg-white shadow-lg ring-1 ring-black/5 transition-all duration-300 dark:bg-[#333A48] ${
          isHovered
            ? "translate-y-0 opacity-100 scale-100"
            : "-translate-y-2 opacity-0 scale-95 pointer-events-none"
        }`}
      >
        <div className="py-1">
          {/* Settings */}
          <button
            onClick={() => handleOptionClick("/dashboard/settings/profile")}
            className="group flex w-full items-center gap-3 px-4 py-3 text-left text-sm text-gray-700 transition-all duration-200 hover:bg-primary/10 hover:text-primary dark:text-gray-300 dark:hover:bg-primary/20"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="h-5 w-5 transition-transform duration-200 group-hover:rotate-90"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            <span className="font-medium">Settings</span>
          </button>

          {/* Profile Details */}
          <button
            onClick={() => handleOptionClick("/dashboard/settings/profile")}
            className="group flex w-full items-center gap-3 px-4 py-3 text-left text-sm text-gray-700 transition-all duration-200 hover:bg-primary/10 hover:text-primary dark:text-gray-300 dark:hover:bg-primary/20"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="h-5 w-5 transition-transform duration-200 group-hover:scale-110"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
              />
            </svg>
            <span className="font-medium">Profile Details</span>
          </button>

          {/* Account Details */}
          <button
            onClick={() => handleOptionClick("/dashboard/settings/password")}
            className="group flex w-full items-center gap-3 px-4 py-3 text-left text-sm text-gray-700 transition-all duration-200 hover:bg-primary/10 hover:text-primary dark:text-gray-300 dark:hover:bg-primary/20"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="h-5 w-5 transition-transform duration-200 group-hover:scale-110"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 9h3.75M15 12h3.75M15 15h3.75M4.5 19.5h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5zm6-10.125a1.875 1.875 0 11-3.75 0 1.875 1.875 0 013.75 0z"
              />
            </svg>
            <span className="font-medium">Account Details</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminInfo;
