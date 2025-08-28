import UserProfile from "../RightBarComponent/UserProfile";
import SuggestedUsers from "../RightBarComponent/SuggestedUsers";
import RecentActivity from "../RightBarComponent/RecentActivity";
import RightSidebarFooter from "../RightBarComponent/RightSidebarFooter";
import useAuthContext from "../../hooks/useAuthContext";

const RightSidebar = () => {
  const { user } = useAuthContext();

  return (
    <div className="hidden lg:flex absolute right-0 top-0 h-screen w-80 bg-white border-l border-gray-200 flex-col z-30 overflow-y-auto">
      {/* User Profile Section */}
      <div className="border-b border-gray-100">
        <UserProfile user={user} />
      </div>

      {/* Suggested Users */}
      <SuggestedUsers />

      {/* Recent Activity */}
      <RecentActivity />

      {/* Footer */}
      <div className="mt-auto">
        <RightSidebarFooter />
      </div>
    </div>
  );
};

export default RightSidebar;
