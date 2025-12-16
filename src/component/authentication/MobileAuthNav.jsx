import React, { useState } from "react";
import PersonIcon from "@mui/icons-material/Person";

import { useCurrentUser } from "./useCurrentUser";
import { Link } from "react-router-dom";
import { useOutSideClick } from "../../hooks/useOutSideClick";
import { useLogout } from "../logout/useLogout";

const MobileAuthNav = () => {
  const { user, isAuthenticated } = useCurrentUser();
  const [show, setShow] = useState(false);
  const { logout, isPending } = useLogout();

  const onClose = () => setShow((show) => !show);
  const ref = useOutSideClick(onClose);

  const name = user?.user_metadata?.name;
  const avatar = user?.user_metadata?.avatar;

  return (
    <>
      <button
        onClick={onClose}
        className=" block rounded-md px-1 py-1.5 text-gray-500 dark:text-gray-200 md:hidden "
      >
        <PersonIcon fontSize="large" className=" text-sky-500" />
      </button>

      {show && (
        <div
          ref={ref}
          className=" absolute -bottom-0 right-2 flex w-44 translate-y-[100%] flex-col gap-6  rounded-xl bg-gray-200 px-8 py-8 shadow-shadowTwo dark:bg-bodyColor dark:shadow-shadowOne "
        >
          <div className=" w-full border-b border-gray-400 pb-3 dark:border-black/50">
            <h3 className=" text-center font-bold capitalize text-gray-500 dark:text-white">
              account
            </h3>
          </div>
          {isAuthenticated ? (
            <>
              <div className=" flex flex-col items-center gap-3">
                <img
                  className=" h-8 w-8 rounded-full bg-gray-400 object-cover"
                  src={avatar || "/images.png"}
                  alt=""
                />
                <span className=" text-sm  font-semibold capitalize text-gray-500 dark:text-white">
                  {name}
                </span>
                <div className=" mt-3 space-x-2">
                  <PersonIcon
                    fontSize="medium"
                    className=" rounded-md bg-sky-600 p-1 text-lg text-sky-200"
                  />
                  <Link
                    className="link-info link font-bold capitalize text-gray-500 dark:text-white"
                    to={"/me"}
                  >
                    profile
                  </Link>
                </div>
              </div>
              <button
                onClick={logout}
                disabled={isPending}
                className="btn-error btn-sm btn capitalize"
              >
                logout
              </button>
            </>
          ) : (
            <>
              <Link
                className="btn-sm btn capitalize dark:btn-neutral"
                to={"login"}
                onClick={onClose}
              >
                Login
              </Link>
              <Link
                onClick={onClose}
                className="btn-info btn-sm btn capitalize"
                to={"register"}
              >
                signup
              </Link>
            </>
          )}
        </div>
      )}
    </>
  );
};

export default MobileAuthNav;
