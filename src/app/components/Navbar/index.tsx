"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../store/store";
import { useModal } from "../ModalContext";
import {
  logout as logoutAction,
  setUser,
} from "../../store/features/authSlice";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";

const Navbar = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  const router = useRouter();
  const pathname = usePathname();
  const { openProfile } = useModal();
  const dispatch = useDispatch();
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const profileRef = useRef<HTMLDivElement>(null);

  // Close profile dropdown on outside click
  useEffect(() => {
    function onClickOutside(event: MouseEvent) {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target as Node)
      ) {
        setProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  // Logout handler calls logout API and Redux + redirects
  async function handleLogout() {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      dispatch(logoutAction());
      router.push("/login");
    } catch {
      // ignore error
    }
  }

  // Generate initials fallback for avatar
  const initials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
    : user?.email?.[0].toUpperCase() || "?";

  return (
    <nav className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between shadow-sm sticky top-0 z-50">
      {/* Left: Logo & Nav Links */}
      <div className="flex items-center space-x-6">
        <Link
          href="/dashboard"
          className="text-xl font-extrabold tracking-tight text-blue-600"
        >
          TRAK
        </Link>

        {/* Desktop links */}
        <ul className="hidden md:flex space-x-4 font-medium text-gray-700">
          <li>
            <button
              href="/dashboard"
              className={`px-3 py-2 rounded-md hover:bg-blue-50 ${
                pathname === "/dashboard"
                  ? "bg-blue-100 text-blue-700 font-semibold"
                  : ""
              }`}
            >
              Dashboard
            </button>
          </li>
          <li>
            <button
              onClick={() => {
                setMenuOpen(false);
                openProfile();
              }}
              className="px-3 py-2 rounded-md hover:bg-blue-50"
            >
              Profile
            </button>
          </li>
          <li>
            <button
              href="/dashboard/settings"
              className={`px-3 py-2 rounded-md hover:bg-blue-50 ${
                router.pathname === "/dashboard/settings"
                  ? "bg-blue-100 text-blue-700 font-semibold"
                  : ""
              }`}
            >
              Settings
            </button>
          </li>
        </ul>

        {/* Mobile hamburger */}
        <button
          aria-label="Toggle menu"
          onClick={() => setMenuOpen((open) => !open)}
          className="md:hidden p-2 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 stroke-current text-gray-700"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {menuOpen ? (
              <path d="M6 18L18 6M6 6l12 12" /> // close icon
            ) : (
              <path d="M4 6h16M4 12h16M4 18h16" /> // hamburger icon
            )}
          </svg>
        </button>
      </div>

      {/* Right: Profile avatar & dropdown */}
      <div className="relative" ref={profileRef}>
        <button
          onClick={() => setProfileOpen((open) => !open)}
          aria-haspopup="true"
          aria-expanded={profileOpen}
          className="flex items-center space-x-2 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-blue-500 rounded-full"
        >
          {user?.email ? (
            user?.avatarUrl ? (
              <img
                src={user.avatarUrl}
                alt={user.name || user.email}
                className="h-10 w-10 rounded-full object-cover"
              />
            ) : (
              <div className="h-10 w-10 flex items-center justify-center rounded-full bg-blue-600 text-white font-semibold select-none">
                {initials}
              </div>
            )
          ) : (
            <div className="h-10 w-10 rounded-full bg-gray-300 animate-pulse" />
          )}
          <span className="hidden sm:block font-medium text-gray-700">
            {user?.name || user?.email}
          </span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={`h-4 w-4 stroke-current transition-transform ${
              profileOpen ? "rotate-180" : "rotate-0"
            }`}
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M6 9l6 6 6-6" />
          </svg>
        </button>

        {/* Profile dropdown */}
        {profileOpen && (
          <ul
            className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50 py-1 text-gray-700 font-medium"
            role="menu"
            aria-orientation="vertical"
            aria-label="Profile menu"
          >
            <li>
              <button
                onClick={() => {
                  setProfileOpen(false);
                  openProfile();
                }}
                className="w-full text-left px-4 py-2 hover:bg-gray-100"
                role="menuitem"
              >
                Profile
              </button>
            </li>
            <li>
              <Link
                href="/dashboard/settings"
                className="block px-4 py-2 hover:bg-gray-100"
                role="menuitem"
                onClick={() => setProfileOpen(false)}
              >
                Settings
              </Link>
            </li>
            <li>
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100"
                role="menuitem"
              >
                Logout
              </button>
            </li>
          </ul>
        )}
      </div>

      {/* Mobile nav menu */}
      {menuOpen && (
        <ul className="absolute top-full left-0 right-0 bg-white border-t border-gray-200 shadow-lg md:hidden z-40 flex flex-col font-medium">
          <li>
            <Link
              href="/dashboard"
              className="block px-6 py-3 hover:bg-gray-100"
              onClick={() => setMenuOpen(false)}
            >
              Dashboard
            </Link>
          </li>
          <li>
            <button
              onClick={() => {
                setMenuOpen(false);
                setProfileOpen(false);
                openProfile();
              }}
              className="block w-full text-left px-6 py-3 hover:bg-gray-100"
            >
              Profile
            </button>
          </li>
          <li>
            <Link
              href="/dashboard/settings"
              className="block px-6 py-3 hover:bg-gray-100"
              onClick={() => setMenuOpen(false)}
            >
              Settings
            </Link>
          </li>
          <li>
            <button
              onClick={() => {
                setMenuOpen(false);
                handleLogout();
              }}
              className="block w-full text-left px-6 py-3 text-red-600 hover:bg-gray-100"
            >
              Logout
            </button>
          </li>
        </ul>
      )}
    </nav>
  );
};

export default Navbar;
