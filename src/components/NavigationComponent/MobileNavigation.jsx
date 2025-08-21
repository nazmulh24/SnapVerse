import { Link, useLocation } from "react-router";
import { MdSearch } from "react-icons/md";
import { primaryItems } from "./navigationData";

const MobileNavigation = ({ onSearchClick }) => {
  const location = useLocation();
  const isActive = (path) => location.pathname === path;

  return (
    <nav className="flex justify-around items-center py-1 w-full px-1">
      {primaryItems.slice(0, 2).map((item, index) => (
        <Link
          key={index}
          to={item.path}
          className={`flex flex-col items-center px-1 xs:px-2 py-1 transition-all duration-200 relative ${
            isActive(item.path) ? "text-purple-600" : "text-gray-600"
          }`}
        >
          <item.icon
            className={`${
              item.label === "Messages"
                ? "text-lg xs:text-xl sm:text-2xl"
                : "text-lg xs:text-xl sm:text-2xl"
            } transition-all duration-200 ${
              isActive(item.path) ? "scale-110" : ""
            }`}
          />
          <span className="text-xs mt-0.5 font-medium leading-tight">
            {item.label}
          </span>
          {/* Badge */}
          {item.badge && (
            <div className="absolute -top-1 right-1 w-4 h-4 xs:w-5 xs:h-5 bg-red-500 rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-bold">{item.badge}</span>
            </div>
          )}
        </Link>
      ))}

      {/* Search button in center */}
      <button
        onClick={onSearchClick}
        className="flex flex-col items-center px-1 py-1 transition-all duration-200 text-gray-600 hover:text-purple-600"
      >
        <MdSearch className="text-lg xs:text-xl sm:text-2xl transition-all duration-200 hover:scale-110" />
        <span className="text-xs mt-0.5 font-medium leading-tight">Search</span>
      </button>

      {/* Friends and Account */}
      {primaryItems.slice(3, 5).map((item, index) => (
        <Link
          key={index + 3}
          to={item.path}
          className={`flex flex-col items-center px-1 py-1 transition-all duration-200 ${
            isActive(item.path) ? "text-purple-600" : "text-gray-600"
          }`}
        >
          <item.icon
            className={`text-lg xs:text-xl sm:text-2xl transition-all duration-200 ${
              isActive(item.path) ? "scale-110" : ""
            }`}
          />
          <span className="text-xs mt-0.5 font-medium leading-tight">
            {item.label}
          </span>
        </Link>
      ))}
    </nav>
  );
};

export default MobileNavigation;
