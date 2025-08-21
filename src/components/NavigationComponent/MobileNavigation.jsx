import { Link, useLocation } from "react-router";
import { MdSearch } from "react-icons/md";
import { primaryItems } from "./navigationData";

const MobileNavigation = ({ onSearchClick }) => {
  const location = useLocation();
  const isActive = (path) => location.pathname === path;

  return (
    <nav className="flex justify-around items-center py-2">
      {/* First 4 primary navigation items for mobile */}
      {primaryItems.slice(0, 4).map((item, index) => (
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

      {/* Search button */}
      <button
        onClick={onSearchClick}
        className="flex flex-col items-center p-2 transition-all duration-200 text-gray-600 hover:text-purple-600"
      >
        <MdSearch className="text-2xl transition-all duration-200 hover:scale-110" />
        <span className="text-xs mt-1 font-medium">Search</span>
      </button>
    </nav>
  );
};

export default MobileNavigation;
