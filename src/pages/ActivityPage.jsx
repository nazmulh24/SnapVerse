import { useNavigate, useSearchParams } from "react-router";
import { useEffect, useState } from "react";
import { MdArrowBack } from "react-icons/md";
import RecentActivity from "../components/RightBarComponent/RecentActivity";
import SuggestedUsers from "../components/RightBarComponent/SuggestedUsers";

const ActivityPage = () => {
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
      const wasAutoSwitched = sessionStorage.getItem("activityAutoSwitched");

      setIsMobile(mobile);

      const currentModal = searchParams.get("modal") === "true";

      if (mobile && !currentModal) {
        setSearchParams({ modal: "true" });
        sessionStorage.setItem("activityAutoSwitched", "true");
      } else if (!mobile && currentModal && wasAutoSwitched) {
        setSearchParams({});
        sessionStorage.removeItem("activityAutoSwitched");
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => {
      window.removeEventListener("resize", handleResize);
      sessionStorage.removeItem("activityAutoSwitched");
    };
  }, [searchParams, setSearchParams]);

  const ActivityContent = () => (
    <div className="space-y-4">
      <RecentActivity />
      <div className="border-t border-gray-100" />
      <SuggestedUsers />
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
          <h1 className="text-lg font-semibold text-gray-900">Activity</h1>
          <div className="w-10" />
        </header>

        <main className="flex-1 overflow-y-auto bg-white p-4">
          <ActivityContent />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen max-w-3xl mx-auto bg-gray-50">
      <div className="p-2 md:p-1 lg:p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Activity</h1>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <ActivityContent />
        </div>
      </div>
    </div>
  );
};

export default ActivityPage;
