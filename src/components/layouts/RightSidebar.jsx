import UserProfile from "../RightBarComponent/UserProfile";
import SuggestedUsers from "../RightBarComponent/SuggestedUsers";
import RecentActivity from "../RightBarComponent/RecentActivity";
import RightSidebarFooter from "../RightBarComponent/RightSidebarFooter";

const RightSidebar = () => {
  // Default user data - in a real app, this would come from props or state
  const currentUser = {
    username: "nazmul_hossain",
    fullName: "Nazmul Hossain",
    avatar: "/user-profile-illustration.png",
  };

  return (
    <div className="hidden lg:flex absolute right-0 top-0 h-screen w-80 bg-white border-l border-gray-200 flex-col z-30 overflow-y-auto">
      {/* User Profile Section */}
      <div className="border-b border-gray-100">
        <UserProfile user={currentUser} />
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
