"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useAppSelector, useAppDispatch } from "@/lib/redux/hooks";
import { deleteCookie } from "cookies-next";
import { onLogout } from "@/lib/redux/features/authSlice";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import SearchInput from "./SearchEvents";

export default function Navbar() {
  const auth = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleDropdown = () => setOpenDropdown(!openDropdown);

  const handleLogout = () => {
    dispatch(onLogout());
    deleteCookie("access_token");
    router.push("/");
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpenDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const guestMenu = [
    { name: "Home", href: "/" },
    { name: "Event", href: "/all-events" },
    { name: "About", href: "/about" },
  ];

  const customerMenu = [
    { name: "Home", href: "/" },
    { name: "Event", href: "/all-events" },
  ];

  const organizerMenu = [
    { name: "Dashboard", href: "/dashboard" },
    { name: "Profile", href: "/profile" },
  ];

  const menuItems = auth.isLogin
    ? auth.user.role === "ORGANIZER"
      ? organizerMenu
      : customerMenu
    : guestMenu;

  return (
    <nav className="bg-gradient-to-r from-violet-500 to-indigo-600 text-white shadow-lg sticky top-0 z-50 w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          {/* Logo */}
          <Link
            href="/"
            className="text-2xl font-bold hover:text-gray-200 transition"
          >
            LOGO
          </Link>

          {/* Search */}
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
              <div className="relative" ref={dropdownRef}>
                <button onClick={toggleDropdown}>
                  <div className="w-9 h-9 rounded-full overflow-hidden border-2 border-white">
                    <Image
                      src={auth.user.avatar || "/no-photo.jpg"}
                      alt="avatar"
                      width={36}
                      height={36}
                      className="object-cover w-full h-full"
                    />
                  </div>
                </button>

                {openDropdown && (
                  <div className="absolute right-0 mt-2 w-48 bg-white text-black rounded-md shadow-lg z-50">
                    {auth.user.role === "ORGANIZER" ? (
                      <>
                        <button
                          onClick={() => router.push("/dashboard")}
                          className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm"
                        >
                          Dashboard
                        </button>
                        <button
                          onClick={() => router.push("/profile")}
                          className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm"
                        >
                          Profile
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => router.push("/my-tickets")}
                          className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm"
                        >
                          My Ticket
                        </button>
                        <button
                          onClick={() => router.push("/profile")}
                          className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm"
                        >
                          Profile
                        </button>
                      </>
                    )}
                    <hr className="my-1" />
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm text-red-600"
                    >
                      Keluar
                    </button>
                  </div>
                )}
              </div>
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
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {isMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
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
                {auth.user.role === "ORGANIZER" ? (
                  <>
                    <button
                      onClick={() => {
                        router.push("/dashboard");
                        setIsMenuOpen(false);
                      }}
                      className="text-left text-sm px-4 py-2 hover:bg-gray-100 rounded"
                    >
                      Dashboard
                    </button>
                    <button
                      onClick={() => {
                        router.push("/profile");
                        setIsMenuOpen(false);
                      }}
                      className="text-left text-sm px-4 py-2 hover:bg-gray-100 rounded"
                    >
                      Profile
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => {
                        router.push("/my-tickets");
                        setIsMenuOpen(false);
                      }}
                      className="text-left text-sm px-2 py-2 hover:bg-gradient-to-r from-indigo-600 to-violet-500 rounded"
                    >
                      My Ticket
                    </button>
                    <button
                      onClick={() => {
                        router.push("/profile");
                        setIsMenuOpen(false);
                      }}
                      className="text-left text-sm px-2 py-2  hover:bg-gradient-to-r from-indigo-600 to-violet-500 rounded"
                    >
                      Profile
                    </button>
                  </>
                )}

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
