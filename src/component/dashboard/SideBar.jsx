import React from "react";
import Logo from "../../ui/Logo";
import { Link, useLocation } from "react-router-dom";
import UserSvg from "../../ui/UserSvg";
import BlogBookSvg from "../../ui/BlogBookSvg";
import WebsiteSvg from "../../ui/WebsiteSvg";
import SettingsIcon from "../../ui/SettingsIcon";
import CommentSvg from "../../ui/CommentSvg";
import { useLogout } from "../logout/useLogout";

const SideBar = () => {
  const location = useLocation();
  const { logout, isPending } = useLogout();
  const [isSettingsOpen, setIsSettingsOpen] = React.useState(
    location.pathname.includes("/dashboard/settings")
  );

  return (
    <aside className="glass flex h-full flex-col border-r-0 px-6 py-6 text-slate-300">
      <Logo />
      <ul className="  mt-20 flex flex-col gap-4">
        <Link
          className={` ${location.pathname === "/dashboard" ? "bg-gradient-to-r from-designColor to-transparent text-white shadow-lg" : "hover:bg-glassHover text-slate-400"} flex min-h-[3rem] cursor-pointer items-center gap-2 rounded-xl px-6 font-medium capitalize transition-all duration-300 `}
          to={"/dashboard"}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="h-6 w-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
            />
          </svg>
          <span>home</span>
        </Link>
        <Link
          className={` ${location.pathname === "/dashboard/manage-blogs" ? "bg-gradient-to-r from-designColor to-transparent text-white shadow-lg" : "hover:bg-glassHover text-slate-400"} flex min-h-[3rem] cursor-pointer items-center gap-2 rounded-xl px-6 font-medium capitalize transition-all duration-300 `}
          to={"/dashboard/manage-blogs"}
        >
          <BlogBookSvg />
          <span>manage blogs</span>
        </Link>
        <Link
          className={` ${location.pathname === "/dashboard/manage-comments" ? "bg-gradient-to-r from-designColor to-transparent text-white shadow-lg" : "hover:bg-glassHover text-slate-400"} flex min-h-[3rem] cursor-pointer items-center gap-2 rounded-xl px-6 font-medium capitalize transition-all duration-300 `}
          to={"/dashboard/manage-comments"}
        >
          <CommentSvg />
          <span>manage comments</span>
        </Link>
        <Link
          className={` ${location.pathname === "/dashboard/manage-users" ? "bg-gradient-to-r from-designColor to-transparent text-white shadow-lg" : "hover:bg-glassHover text-slate-400"} flex min-h-[3rem] cursor-pointer items-center gap-2 rounded-xl px-6 font-medium capitalize transition-all duration-300 `}
          to={"/dashboard/manage-users"}
        >
          <UserSvg />
          <span>manage users</span>
        </Link>
        <Link
          className={` ${location.pathname === "/dashboard/manage-certificates" ? "bg-gradient-to-r from-designColor to-transparent text-white shadow-lg" : "hover:bg-glassHover text-slate-400"} flex min-h-[3rem] cursor-pointer items-center gap-2 rounded-xl px-6 font-medium capitalize transition-all duration-300 `}
          to={"/dashboard/manage-certificates"}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="h-6 w-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M16.5 3.75V16.5L12 14.25 7.5 16.5V3.75m9 0H18A2.25 2.25 0 0120.25 6v12A2.25 2.25 0 0118 20.25H6A2.25 2.25 0 013.75 18V6A2.25 2.25 0 016 3.75h1.5m9 0h-9"
            />
          </svg>
          <span>Certificates</span>
        </Link>
        {/* Settings Dropdown */}
        <div className="flex flex-col gap-2">
          <button
            onClick={() => setIsSettingsOpen(!isSettingsOpen)}
            className={` ${location.pathname.includes("/dashboard/settings")
              ? "bg-gradient-to-r from-designColor to-transparent text-white shadow-lg"
              : "hover:bg-glassHover text-slate-400"
              } flex min-h-[3rem] w-full cursor-pointer items-center justify-between gap-2 rounded-xl px-6 font-medium capitalize transition-all duration-300 `}
          >
            <div className="flex items-center gap-2">
              <SettingsIcon />
              <span>settings</span>
            </div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className={`h-4 w-4 transition-transform duration-200 ${isSettingsOpen ? "rotate-180" : ""
                }`}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19.5 8.25l-7.5 7.5-7.5-7.5"
              />
            </svg>
          </button>

          {/* Sub-menu */}
          <div
            className={`flex flex-col gap-2 overflow-hidden transition-all duration-300 ${isSettingsOpen ? "max-h-40 opacity-100" : "max-h-0 opacity-0"
              }`}
          >
            <Link
              className={` ${location.pathname === "/dashboard/settings/profile"
                ? "text-primary"
                : "text-slate-400"
                } ml-8 flex min-h-[2.5rem] cursor-pointer items-center gap-2 rounded-md px-4 text-sm font-medium capitalize transition-all duration-200 hover:text-primary `}
              to={"/dashboard/settings/profile"}
            >
              <UserSvg />
              <span>Profile</span>
            </Link>
            <Link
              className={` ${location.pathname === "/dashboard/settings/password"
                ? "text-primary"
                : "text-slate-400"
                } ml-8 flex min-h-[2.5rem] cursor-pointer items-center gap-2 rounded-md px-4 text-sm font-medium capitalize transition-all duration-200 hover:text-primary `}
              to={"/dashboard/settings/password"}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="h-5 w-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
                />
              </svg>
              <span>Password</span>
            </Link>
          </div>
        </div>
        <Link
          className={` ${location.pathname === "/" ? "bg-gradient-to-r from-designColor to-transparent text-white shadow-lg" : "hover:bg-glassHover text-slate-400"} flex min-h-[3rem] cursor-pointer items-center gap-2 rounded-xl px-6 font-medium capitalize transition-all duration-300 `}
          to={"/"}
          target="_blank"
          rel="noopener noreferrer"
        >
          <WebsiteSvg />
          <span>visite website</span>
        </Link>
      </ul>
      <button
        onClick={logout}
        disabled={isPending}
        className="mt-auto mb-6 flex min-h-[3rem] cursor-pointer items-center gap-2 rounded-xl border border-red-500/20 bg-red-500/10 px-6 font-medium capitalize text-red-400 transition-all duration-300 hover:bg-red-500 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
          className="h-6 w-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75"
          />
        </svg>
        <span>{isPending ? "Logging out..." : "logout"}</span>
      </button>
    </aside>
  );
};

export default SideBar;
