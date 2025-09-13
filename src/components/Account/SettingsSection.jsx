import React, { useState } from "react";
import { Link, useNavigate } from "react-router";
import { MdChevronRight, MdSwitchAccount, MdLogout } from "react-icons/md";
import useAuthContext from "../../hooks/useAuthContext";

const SettingsSection = ({ settingsItems }) => {
  const navigate = useNavigate();
  const { logoutUser } = useAuthContext();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = () => {
    setShowLogoutConfirm(true);
  };

  const confirmLogout = async () => {
    setIsLoggingOut(true);
    try {
      logoutUser(() => {
        // Navigate to login page after successful logout
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
  return (
    <div className="space-y-6 m-4">
      <h2 className="text-2xl font-bold text-slate-900">Settings & Support</h2>

      {/* Settings Section */}
      <div className="space-y-1">
        <h3 className="text-lg font-semibold text-slate-700 mb-3">Settings</h3>
        {settingsItems.map((item, index) => (
          <Link
            key={index}
            to={item.href}
            className="flex items-center gap-4 p-4 bg-white rounded-xl border border-slate-200 hover:border-slate-300 hover:shadow-md transition-all duration-200"
          >
            <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center">
              <item.icon className="w-6 h-6 text-slate-600" />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-slate-900">{item.label}</h4>
            </div>
            <MdChevronRight className="w-5 h-5 text-slate-400" />
          </Link>
        ))}
      </div>

      {/* Account Actions */}
      <div className="space-y-1">
        <h3 className="text-lg font-semibold text-slate-700 mb-3">Account</h3>
        <button className="w-full flex items-center gap-4 p-4 bg-white rounded-xl border border-slate-200 hover:border-slate-300 hover:shadow-md transition-all duration-200">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
            <MdSwitchAccount className="w-6 h-6 text-blue-600" />
          </div>
          <div className="flex-1 text-left">
            <h4 className="font-semibold text-slate-900">Switch Account</h4>
          </div>
          <MdChevronRight className="w-5 h-5 text-slate-400" />
        </button>

        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-4 p-4 bg-white rounded-xl border border-red-200 hover:border-red-300 hover:shadow-md transition-all duration-200 text-red-600"
        >
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
            <MdLogout className="w-6 h-6 text-red-600" />
          </div>
          <div className="flex-1 text-left">
            <h4 className="font-semibold">Logout</h4>
          </div>
          <MdChevronRight className="w-5 h-5 text-red-400" />
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

export default SettingsSection;
