import { Link, useNavigate } from "react-router";
import { MdLogout } from "react-icons/md";
import useAuthContext from "../../hooks/useAuthContext";
import { useState } from "react";

const UserProfileSection = ({ user }) => {
  const { logoutUser } = useAuthContext();
  const navigate = useNavigate();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = () => {
    setShowLogoutConfirm(true);
  };

  const confirmLogout = async () => {
    setIsLoggingOut(true);
    try {
      logoutUser(() => {
        navigate("/login");
      });
    } catch (error) {
      console.error("Logout error:", error);
      setIsLoggingOut(false);
    }
    setShowLogoutConfirm(false);
  };

  const cancelLogout = () => {
    setShowLogoutConfirm(false);
  };

  const getProfileImage = (profile_picture) => {
    if (!profile_picture || profile_picture.trim() === "") {
      return "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp";
    }
    if (profile_picture.startsWith("http") || profile_picture.startsWith("/")) {
      return profile_picture;
    }
    return `https://res.cloudinary.com/dlkq5sjum/${profile_picture}`;
  };

  if (!user) {
    return (
      <div className="p-4 border-t border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3 p-3 rounded-xl flex-1 animate-pulse">
            <div className="w-10 h-10 rounded-full bg-gray-200" />
            <div className="flex-1">
              <div className="h-4 bg-gray-200 rounded w-24 mb-2" />
              <div className="h-3 bg-gray-100 rounded w-16" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 border-t border-gray-100">
      <div className="flex items-center justify-between">
        <Link
          to="/account"
          className="flex items-center space-x-3 p-3 rounded-xl hover:bg-gray-100 transition-all duration-200 flex-1"
        >
          <img
            src={getProfileImage(user.profile_picture)}
            alt="profile"
            className="w-10 h-10 rounded-full object-cover border-2 border-gray-200"
          />
          <div className="flex-1">
            <p className="font-medium text-gray-900">{user.full_name}</p>
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

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-transparent flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 mx-4 max-w-sm w-full shadow-xl border border-gray-200">
            <h3 className="text-lg font-semibold text-slate-900 mb-2">
              Confirm Logout
            </h3>
            <p className="text-slate-600 mb-6">
              Are you sure you want to logout? You'll need to sign in again to
              access your account.
            </p>
            <div className="flex gap-3">
              <button
                onClick={cancelLogout}
                className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmLogout}
                disabled={isLoggingOut}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-red-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
              >
                {isLoggingOut ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Logging out...
                  </>
                ) : (
                  "Logout"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfileSection;
