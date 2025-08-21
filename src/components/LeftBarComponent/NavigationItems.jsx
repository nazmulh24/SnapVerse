import React from "react";
import { Link, useLocation } from "react-router";
import {
  MdHome,
  MdSearch,
  MdExplore,
  MdMovieCreation,
  MdFavoriteBorder,
  MdAddBox,
  MdPerson,
} from "react-icons/md";

const NavigationItems = ({ isMobile = false }) => {
  const location = useLocation();

  const sidebarItems = [
    { icon: MdHome, label: "Home", path: "/" },
    { icon: MdSearch, label: "Search", path: "/search" },
    { icon: MdExplore, label: "Explore", path: "/explore" },
    { icon: MdMovieCreation, label: "Reels", path: "/reels" },
    { icon: MdFavoriteBorder, label: "Messages", path: "/messages" },
    { icon: MdAddBox, label: "Create", path: "/create" },
    { icon: MdPerson, label: "Profile", path: "/profile" },
  ];

  const isActive = (path) => location.pathname === path;

  if (isMobile) {
    return (
      <nav className="flex justify-around items-center py-2">
        {sidebarItems.slice(0, 5).map((item, index) => (
          <Link
            key={index}
            to={item.path}
            className={`flex flex-col items-center p-2 transition-all duration-200 ${
              isActive(item.path) ? "text-purple-600" : "text-gray-600"
            }`}
          >
            <item.icon
              className={`text-2xl transition-all duration-200 ${
                isActive(item.path) ? "scale-110" : ""
              }`}
            />
            <span className="text-xs mt-1 font-medium">{item.label}</span>
          </Link>
        ))}
      </nav>
    );
  }

  return (
    <nav className="flex-1 p-4">
      <ul className="space-y-2">
        {sidebarItems.map((item, index) => (
          <li key={index}>
            <Link
              to={item.path}
              className={`flex items-center space-x-4 p-3 rounded-xl transition-all duration-200 group ${
                isActive(item.path)
                  ? "bg-gradient-to-r from-purple-100 to-pink-100 text-purple-600"
                  : "hover:bg-gray-100 text-gray-700"
              }`}
            >
              <item.icon
                className={`text-2xl transition-all duration-200 ${
                  isActive(item.path)
                    ? "text-purple-600 scale-110"
                    : "group-hover:scale-105"
                }`}
              />
              <span
                className={`font-medium transition-all duration-200 ${
                  isActive(item.path) ? "font-semibold" : ""
                }`}
              >
                {item.label}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default NavigationItems;
