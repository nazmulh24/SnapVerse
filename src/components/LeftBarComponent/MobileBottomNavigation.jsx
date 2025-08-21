import React, { useState } from "react";
import { Link, useLocation } from "react-router";
import {
  MdHome,
  MdMessage,
  MdSearch,
  MdPeople,
  MdAccountCircle,
} from "react-icons/md";
import MobileSearchModal from "./MobileSearchModal";

const MobileBottomNavigation = () => {
  const location = useLocation();
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  const handleSearchClick = () => {
    setIsSearchOpen(true);
  };

  const handleSearchClose = () => {
    setIsSearchOpen(false);
  };

  // Mobile navigation items - 5 icons in center
  const mobileNavItems = [
    {
      icon: MdHome,
      label: "Home",
      path: "/",
    },
    {
      icon: MdMessage,
      label: "Messages",
      path: "/messages",
      badge: "5",
    },
    {
      icon: MdSearch,
      label: "Search",
      action: "search",
    },
    {
      icon: MdPeople,
      label: "Friends",
      path: "/friends",
    },
    {
      icon: MdAccountCircle,
      label: "Account",
      path: "/profile",
    },
  ];

  return (
    <>
      <div className="sm:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
        <nav className="flex justify-center items-center py-2">
          <div className="flex justify-around items-center w-full max-w-sm mx-auto">
            {mobileNavItems.map((item, index) => {
              if (item.action === "search") {
                return (
                  <button
                    key={index}
                    onClick={handleSearchClick}
                    className="flex flex-col items-center p-3 transition-all duration-200 text-gray-600 hover:text-purple-600 relative"
                  >
                    <item.icon className="text-2xl transition-all duration-200 hover:scale-110" />
                    <span className="text-xs mt-1 font-medium">
                      {item.label}
                    </span>
                  </button>
                );
              }

              // Hide Account button on md and lg screens
              if (item.label === "Account") {
                return (
                  <Link
                    key={index}
                    to={item.path}
                    className={`flex-col items-center p-3 transition-all duration-200 relative hidden ${
                      isActive(item.path)
                        ? "text-purple-600"
                        : "text-gray-600 hover:text-purple-600"
                    }`}
                    style={{ display: window.innerWidth >= 768 ? 'none' : 'flex' }}
                  >
                    <item.icon
                      className={`text-3xl transition-all duration-200 ${
                        isActive(item.path) ? "scale-110" : "hover:scale-110"
                      }`}
                    />
                    <span className="text-xs mt-1 font-medium">{item.label}</span>

                    {/* Badge */}
                    {item.badge && (
                      <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs font-bold">
                          {item.badge}
                        </span>
                      </div>
                    )}
                  </Link>
                );
              }

              return (
                <Link
                  key={index}
                  to={item.path}
                  className={`flex flex-col items-center p-3 transition-all duration-200 relative ${
                    item.label === "Account" ? "md:hidden lg:hidden" : ""
                  } ${
                    isActive(item.path)
                      ? "text-purple-600"
                      : "text-gray-600 hover:text-purple-600"
                  }`}
                >
                  <item.icon
                    className={`text-3xl transition-all duration-200 ${
                      isActive(item.path) ? "scale-110" : "hover:scale-110"
                    }`}
                  />
                  <span className="text-xs mt-1 font-medium">{item.label}</span>

                  {/* Badge */}
                  {item.badge && (
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-bold">
                        {item.badge}
                      </span>
                    </div>
                  )}
                </Link>
              );
            })}
          </div>
        </nav>
      </div>

      <MobileSearchModal isOpen={isSearchOpen} onClose={handleSearchClose} />
    </>
  );
};

export default MobileBottomNavigation;
