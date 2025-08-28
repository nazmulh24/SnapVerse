import DesktopSidebar from "../LeftBarComponent/DesktopSidebar";
import MobileNavigation from "../NavigationComponent/MobileNavigation";
import MobileSearchModal from "../LeftBarComponent/MobileSearchModal";
import MobileTopHeader from "../LeftBarComponent/MobileTopHeader";
import { useState } from "react";
import useAuthContext from "../../hooks/useAuthContext";

const Sidebar = ({ onWidthChange }) => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const { user, logoutUser } = useAuthContext();

  const handleSearchClick = () => {
    setIsSearchOpen(true);
  };

  const handleSearchClose = () => {
    setIsSearchOpen(false);
  };

  return (
    <>
      {/* Mobile Top Header */}
      <MobileTopHeader />

      {/* Desktop/Tablet Left Sidebar */}
      <DesktopSidebar
        user={user}
        onLogout={logoutUser}
        onWidthChange={onWidthChange}
      />

      {/* Mobile Bottom Navigation */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
        <div className="flex justify-center items-center py-1">
          <div className="flex justify-around items-center w-full max-w-sm mx-auto">
            <MobileNavigation onSearchClick={handleSearchClick} />
          </div>
        </div>
      </div>

      <MobileSearchModal isOpen={isSearchOpen} onClose={handleSearchClose} />
    </>
  );
};

export default Sidebar;
