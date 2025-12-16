import React from "react";
import { Link, NavLink } from "react-router-dom";
import { useCurrentUser } from "./useCurrentUser";
import { useLogout } from "../logout/useLogout";

const Auth = () => {
  const { logout, isPending } = useLogout();
  const { user, isLoading, isAuthenticated } = useCurrentUser();
  const name = user?.user_metadata?.name;
  const avatar = user?.user_metadata?.avatar;

  if (isLoading)
    return (
      <div className="hidden gap-3 sm:flex">
        <div className=" h-8 w-20 animate-pulse rounded-md bg-gray-300"></div>
        <div className=" h-8 w-20 animate-pulse rounded-md bg-gray-300"></div>
      </div>
    );

  return (
    <div className=" hidden items-center gap-2 md:flex">
      {isAuthenticated && !isLoading ? (
        <>
          <img
            className=" hidden h-8 w-8 rounded-full bg-gray-400 object-cover lg:block"
            src={avatar || "/images.png"}
            alt=""
          />
          <NavLink
            to={"me"}
            className=" rounded-sm border-none px-2 py-1 font-medium capitalize text-blue-500 underline outline-none duration-300 hover:no-underline focus:ring-2 focus:ring-designColor dark:text-gray-300"
          >
            {name}
          </NavLink>
          <button
            onClick={logout}
            disabled={isPending}
            className=" rounded-md bg-gradient-to-br from-designColor to-stone-500 px-4 py-1.5 font-medium capitalize text-stone-200 transition-all duration-300 hover:bg-transparent hover:bg-gradient-to-tl hover:from-designColor hover:to-stone-500 active:scale-90"
          >
            logout
          </button>
        </>
      ) : (
        <>
          <Link
            className=" rounded-md bg-gray-300 px-4 py-1.5 font-semibold capitalize text-stone-600 transition-all duration-300 dark:btn-neutral  hover:shadow-xl dark:bg-gray-300 dark:bg-none dark:text-stone-600 dark:hover:border-gray-400 dark:hover:text-gray-300 dark:hover:shadow-shadowOne"
            to={"login"}
          >
            Login
          </Link>
          <Link
            className=" rounded-md bg-sky-500 px-4 py-1.5 font-semibold capitalize text-stone-200 transition-all duration-300 dark:btn-neutral  hover:shadow-xl dark:bg-gray-300 dark:bg-none dark:text-stone-600 dark:hover:border-gray-400 dark:hover:text-gray-300 dark:hover:shadow-shadowOne"
            to={"register"}
          >
            signup
          </Link>
        </>
      )}
    </div>
  );
};

export default Auth;
