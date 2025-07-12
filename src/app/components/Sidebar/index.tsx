"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useModal } from "../ModalContext";

const Sidebar = ({ isSidebar = false }: { isSidebar?: boolean }) => {
  const pathname = usePathname();
  const { openProfile } = useModal();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const menuItems = [
    { label: "Dashboard", href: "/dashboard", onClick: undefined },
    { label: "Profile", href: "#", onClick: openProfile },
    { label: "Settings", href: "/dashboard/settings", onClick: undefined },
  ];

  if (isSidebar) {
    return (
      <aside className="sidebar">
        <h2>Your App</h2>
        <ul className="menu-vertical flex flex-col gap-2">
          {menuItems.map(({ label, href, onClick }) => {
            const active = href !== "#" && pathname === href;

            return (
              <li tabIndex={0} key={label} className={active ? "active" : ""}>
                {onClick ? (
                  <button onClick={onClick} className="w-full text-left">
                    {label}
                  </button>
                ) : (
                  <Link href={href}>{label}</Link>
                )}
              </li>
            );
          })}
        </ul>
      </aside>
    );
  }

  return (
    <div className="relative inline-block text-left">
      <button
        onClick={() => setDropdownOpen(!dropdownOpen)}
        aria-haspopup="true"
        aria-expanded={dropdownOpen}
        className="btn btn-ghost p-2 rounded-full"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 stroke-current"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
      {dropdownOpen && (
        <ul
          tabIndex={0}
          className="absolute left-0 mt-2 w-48 bg-white rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 z-10"
          onBlur={() => setDropdownOpen(false)}
        >
          {menuItems.map(({ label, href, onClick }) => {
            const active = href !== "#" && pathname === href;

            return (
              <li
                tabIndex={-1}
                key={label}
                className={`px-4 py-2 rounded cursor-pointer hover:bg-gray-100 ${
                  active ? "bg-blue-100 text-blue-700 font-semibold" : ""
                }`}
                onClick={() => setDropdownOpen(false)}
              >
                {onClick ? (
                  <button onClick={onClick} className="w-full text-left">
                    {label}
                  </button>
                ) : (
                  <Link href={href}>{label}</Link>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default Sidebar;
