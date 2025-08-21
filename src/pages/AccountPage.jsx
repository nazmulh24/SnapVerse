import { useNavigate, useSearchParams } from "react-router";
import { useEffect, useState } from "react";
import { Link } from "react-router";
import { MdArrowBack, MdNotifications } from "react-icons/md";
import {
  discoverItems,
  businessItems,
  moreItems,
} from "../components/NavigationComponent/navigationData";

const AccountPage = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  const handleBack = () => {
    // Simple and reliable back navigation
    const hasModal = searchParams.get("modal") === "true";

    if (hasModal) {
      // If in modal, go back to home (most reliable)
      navigate("/");
    } else {
      // For regular page, try history back, fallback to home
      if (window.history.length > 1) {
        navigate(-1);
      } else {
        navigate("/");
      }
    }
  };

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      const wasAutoSwitched = sessionStorage.getItem("accountAutoSwitched");

      setIsMobile(mobile);

      const currentModal = searchParams.get("modal") === "true";

      if (mobile && !currentModal) {
        setSearchParams({ modal: "true" });
        sessionStorage.setItem("accountAutoSwitched", "true");
      } else if (!mobile && currentModal && wasAutoSwitched) {
        setSearchParams({});
        sessionStorage.removeItem("accountAutoSwitched");
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => {
      window.removeEventListener("resize", handleResize);
      sessionStorage.removeItem("accountAutoSwitched");
    };
  }, [searchParams, setSearchParams]);

  const AccountContent = () => (
    <div className="space-y-4">
      {/* Profile Section */}
      <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
        {/* The main container is now always a vertical stack */}
        <div className="flex flex-col items-center text-center space-y-3">
          {/* Profile Picture */}
          <div className="w-20 h-20 rounded-full overflow-hidden bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center border-2 border-white shadow-sm">
            <span className="text-white font-bold text-3xl tracking-wide">
              N
            </span>
          </div>

          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-900 leading-tight">
              Nazmul Hossain
            </h2>
            <p className="text-gray-500 text-sm">@nazmul_hossain</p>

            {/* Stats section is always centered */}
            <div className="flex justify-center items-center space-x-6 mt-3">
              <div className="text-center">
                <div className="font-bold text-lg text-gray-900">1.2K</div>
                <div className="text-xs text-gray-500">Followers</div>
              </div>
              <div className="text-center">
                <div className="font-bold text-lg text-gray-900">890</div>
                <div className="text-xs text-gray-500">Following</div>
              </div>
              <div className="text-center">
                <div className="font-bold text-lg text-gray-900">45</div>
                <div className="text-xs text-gray-500">Posts</div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-3 mt-6">
          <Link
            to="/profile/edit"
            className="flex-1 bg-indigo-600 text-white py-3 px-4 rounded-xl text-center font-semibold hover:bg-indigo-700 transition-colors shadow-md hover:shadow-lg"
          >
            Edit Profile
          </Link>
          <Link
            to="/profile/share"
            className="flex-1 text-indigo-600 border border-gray-200 py-3 px-4 rounded-xl text-center font-semibold hover:bg-gray-50 transition-colors"
          >
            Share Profile
          </Link>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white p-4 rounded-lg border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Quick Actions
        </h3>
        <div className="grid grid-cols-2 gap-3">
          <Link
            to="/activity"
            className="flex items-center space-x-2 p-2 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors"
          >
            <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
              <span className="text-purple-600 font-bold">15</span>
            </div>
            <div>
              <div className="font-medium text-gray-900">Activity</div>
              <div className="text-sm text-gray-500">New notifications</div>
            </div>
          </Link>
          <Link
            to="/saved"
            className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
          >
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-blue-600 font-bold">23</span>
            </div>
            <div>
              <div className="font-medium text-gray-900">Saved</div>
              <div className="text-sm text-gray-500">Saved posts</div>
            </div>
          </Link>
        </div>
      </div>

      {/* Discover Section */}
      <div className="bg-white p-2 rounded-lg border border-gray-100">
        <h3 className="text-lg p-1 font-semibold text-gray-900 mb-2">
          Discover
        </h3>
        <div className="space-y-1">
          {discoverItems.map((item, index) => (
            <Link
              key={index}
              to={item.path}
              className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <div className="flex items-center space-x-3">
                <item.icon className="text-xl text-gray-600" />
                <span className="text-gray-900 font-medium">{item.label}</span>
              </div>
              <div className="flex items-center space-x-2">
                {item.isPro && (
                  <span className="px-2 py-1 bg-purple-100 text-purple-600 text-xs font-medium rounded-full">
                    Pro
                  </span>
                )}
                <span className="text-gray-400">›</span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Business Tools Section */}
      <div className="bg-white p-2 rounded-lg border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Business Tools
        </h3>
        <div className="space-y-1">
          {businessItems.map((item, index) => (
            <Link
              key={index}
              to={item.path}
              className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <div className="flex items-center space-x-3">
                <item.icon className="text-xl text-gray-600" />
                <span className="text-gray-900 font-medium">{item.label}</span>
              </div>
              <div className="flex items-center space-x-2">
                {item.isPro && (
                  <span className="px-2 py-1 bg-purple-100 text-purple-600 text-xs font-medium rounded-full">
                    Pro
                  </span>
                )}
                <span className="text-gray-400">›</span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Settings & Support Section */}
      <div className="bg-white p-2 rounded-lg border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Settings & Support
        </h3>
        <div className="space-y-1">
          {moreItems.map((item, index) => (
            <Link
              key={index}
              to={item.path}
              className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <div className="flex items-center space-x-3">
                <item.icon className="text-xl text-gray-600" />
                <span className="text-gray-900 font-medium">{item.label}</span>
              </div>
              <span className="text-gray-400">›</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Account Actions */}
      <div className="bg-white p-2 rounded-lg border border-gray-100">
        <div className="space-y-1">
          <button className="w-full text-left p-2 hover:bg-gray-50 rounded-lg transition-colors">
            <span className="text-gray-900 font-medium">Switch Account</span>
          </button>
          <button className="w-full text-left p-2 hover:bg-red-50 rounded-lg transition-colors">
            <span className="text-red-600 font-medium">Log Out</span>
          </button>
        </div>
      </div>

      {/* App Info */}
      <div className="bg-white p-2 rounded-lg border border-gray-100">
        <div className="text-center text-gray-500 text-sm space-y-1">
          <div>SnapVerse v1.0.0</div>
          <div>© 2025 SnapVerse. All rights reserved.</div>
          <div className="flex justify-center space-x-4 mt-2">
            <Link to="/terms" className="hover:text-purple-600">
              Terms
            </Link>
            <Link to="/privacy" className="hover:text-purple-600">
              Privacy
            </Link>
            <Link to="/about" className="hover:text-purple-600">
              About
            </Link>
          </div>
        </div>
      </div>
    </div>
  );

  if (isMobile) {
    return (
      <div className="fixed inset-0 bg-white z-[60] flex flex-col">
        <header className="p-4 border-b border-gray-200 flex items-center justify-between">
          <button
            onClick={handleBack}
            className="p-2 rounded-full hover:bg-gray-100 text-gray-700 hover:text-purple-600 transition-colors"
            aria-label="Go back"
          >
            <MdArrowBack className="text-xl" />
          </button>
          <h1 className="text-xl font-semibold text-gray-900">Account</h1>
        </header>

        <main className="flex-1 overflow-y-auto bg-gray-50 p-4">
          <AccountContent />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen max-w-3xl mx-auto bg-gray-50">
      <div className="p-3 md:px-1 md:py-2 lg:p-4">
        <div className="mb-6">
          <h1 className="text-4xl font-bold text-gray-900">Account</h1>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <AccountContent />
        </div>
      </div>
    </div>
  );
};

export default AccountPage;
