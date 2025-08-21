import { Link } from "react-router";
import { MdExpandMore, MdExpandLess } from "react-icons/md";

const NavigationSection = ({
  title,
  items,
  isExpanded,
  onToggle,
  isActive,
  className = "",
}) => {
  return (
    <div className={`mb-6 ${className}`}>
      {title && (
        <button
          onClick={onToggle}
          className="flex items-center justify-between w-full text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 px-3 hover:text-gray-700 transition-colors duration-200"
        >
          <span>{title}</span>
          {onToggle &&
            (isExpanded ? (
              <MdExpandLess className="text-sm" />
            ) : (
              <MdExpandMore className="text-sm" />
            ))}
        </button>
      )}

      {(isExpanded || !onToggle) && (
        <ul className="space-y-2">
          {items.map((item, index) => {
            // Handle responsive visibility
            let responsiveClasses = "";
            if (item.responsive === "md-only") {
              responsiveClasses = "hidden md:flex lg:hidden";
            }

            return (
              <li key={index} className={responsiveClasses}>
                <Link
                  to={item.path}
                  className={`flex items-center space-x-4 p-3 rounded-xl transition-all duration-200 group ${
                    isActive(item.path)
                      ? "bg-gradient-to-r from-purple-100 to-pink-100 text-purple-600"
                      : "hover:bg-gray-100 text-gray-700"
                  } ${item.className || ""}`}
                >
                  <item.icon
                    className={`transition-all duration-200 ${
                      title ? "text-xl" : "text-2xl"
                    } ${
                      isActive(item.path)
                        ? "text-purple-600 scale-110"
                        : "group-hover:scale-105"
                    }`}
                  />
                  <span
                    className={`font-medium transition-all duration-200 ${
                      title ? "text-sm" : "text-base"
                    } ${isActive(item.path) ? "font-semibold" : ""}`}
                  >
                    {item.label}
                  </span>
                  {item.badge && (
                    <span className="ml-auto bg-purple-100 text-purple-600 text-xs px-2 py-1 rounded-full font-medium">
                      {item.badge}
                    </span>
                  )}
                  {item.isPro && (
                    <span className="ml-auto bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs px-2 py-1 rounded-full font-bold">
                      PRO
                    </span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default NavigationSection;
