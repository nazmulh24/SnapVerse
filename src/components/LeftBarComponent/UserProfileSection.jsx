import { Link } from "react-router";
import { MdLogout } from "react-icons/md";

const UserProfileSection = ({ user, onLogout }) => {
  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    } else {
      // Default logout behavior - you can modify this as needed
      // TODO: Implement proper logout functionality
      // For example: localStorage.removeItem('token'); window.location.href = '/login';
    }
  };

  return (
    <div className="p-4 border-t border-gray-100">
      <div className="flex items-center justify-between">
        <Link
          to="/account"
          className="flex items-center space-x-3 p-3 rounded-xl hover:bg-gray-100 transition-all duration-200 flex-1"
        >
          <img
            src={user.avatar}
            alt="Profile"
            className="w-10 h-10 rounded-full object-cover border-2 border-gray-200"
          />
          <div className="flex-1">
            <p className="font-medium text-gray-900">{user.name}</p>
            <p className="text-sm text-gray-500">{user.username}</p>
          </div>
        </Link>

        <button
          onClick={handleLogout}
          className="p-2 rounded-xl hover:bg-red-50 hover:text-red-600 text-gray-600 transition-all duration-200 ml-2"
          title="Logout"
        >
          <MdLogout className="text-xl" />
        </button>
      </div>
    </div>
  );
};

export default UserProfileSection;
