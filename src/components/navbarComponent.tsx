"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useAppSelector, useAppDispatch } from "@/lib/redux/hooks";
import { deleteCookie } from "cookies-next";
import { onLogout } from "@/lib/redux/features/authSlice";
import { useState } from "react";
import SearchInput from "./SearchEvents";

export default function Navbar() {
  const auth = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Define Menu based on user role
  const guestMenu = [
    { name: "Home", href: "/" },
    { name: "Event", href: "/all-events" },
    { name: "About", href: "/about" },
  ];

  const customerMenu = [
    { name: "Home", href: "/" },
    { name: "Event", href: "/all-events" },
    { name: "My Tickets", href: "/my-tickets" },
    { name: "Profile", href: "/profile" },
  ];

  const organizerMenu = [
    { name: "Home", href: "/" },
    { name: "Dashboard", href: "/dashboard" },
    { name: "Profile", href: "/profile" },
  ];

  const menuItems = auth.isLogin
    ? auth.user.role === "ORGANIZER"
      ? organizerMenu
      : customerMenu
    : guestMenu;

  const handleLogout = () => {
    dispatch(onLogout());
    deleteCookie("access_token");
    router.push("/");
  };

  return (
    <nav className="bg-gradient-to-r from-violet-500 to-indigo-600 text-white shadow-lg sticky top-0 z-50  max-auto w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          {/* Logo */}
          <Link
            href="/"
            className="text-2xl font-bold hover:text-gray-200 transition"
          >
            {/* <img src="/" 
                        alt="" 
                        className="h-16 w-auto object-contain"
                        /> */}
            LOGO
          </Link>

          <div className="flex-1 mx-8 px-4">
            <SearchInput />
          </div>

          {/* Desktop menu */}
          <div className="hidden md:flex items-center space-x-6">
            {menuItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`text-sm font-medium hover:text-gray-200 transition ${
                  pathname === item.href ? "underline underline-offset-4" : ""
                }`}
              >
                {item.name}
              </Link>
            ))}

            {auth.isLogin ? (
              <>
                <span className="text-gray-200">
                  Hi, {auth.user.first_name}
                </span>
                <button
                  onClick={handleLogout}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-transform transform hover:scale-105"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => router.push("/login")}
                  className="bg-indigo-500 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium "
                >
                  Sign In
                </button>
                <button
                  onClick={() => router.push("/register")}
                  className="bg-indigo-500 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                >
                  Sign Up
                </button>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button onClick={toggleMenu}>
              {isMenuOpen ? (
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden px-4 pb-4">
          <div className="flex flex-col gap-4">
            {menuItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setIsMenuOpen(false)}
                className={`text-sm font-medium hover:text-gray-200 ${
                  pathname === item.href ? "underline underline-offset-4" : ""
                }`}
              >
                {item.name}
              </Link>
            ))}

            {auth.isLogin ? (
              <>
                <span className="text-gray-200">
                  Hi, {auth.user.first_name}
                </span>
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMenuOpen(false);
                  }}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => {
                    router.push("/login");
                    setIsMenuOpen(false);
                  }}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium"
                >
                  Sign In
                </button>
                <button
                  onClick={() => {
                    router.push("/register");
                    setIsMenuOpen(false);
                  }}
                  className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md text-sm font-medium"
                >
                  Sign Up
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
