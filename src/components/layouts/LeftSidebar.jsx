import DesktopSidebar from "../LeftBarComponent/DesktopSidebar";
import MobileBottomNavigation from "../LeftBarComponent/MobileBottomNavigation";
import MobileTopHeader from "../LeftBarComponent/MobileTopHeader";

const Sidebar = ({ onWidthChange }) => {
  // Default user data - in a real app, this would come from props or state
  const currentUser = {
    name: "Nazmul Hossain",
    username: "@nazmul_hossain",
    avatar: "/user-profile-illustration.png",
  };

  return (
    <>
      {/* Mobile Top Header */}
      <MobileTopHeader />

      {/* Desktop/Tablet Left Sidebar */}
      <DesktopSidebar user={currentUser} onWidthChange={onWidthChange} />

      {/* Mobile Bottom Navigation */}
      <MobileBottomNavigation />
    </>
  );
};

export default Sidebar;
