import React, { useState } from "react";
import NavigationItems from "./NavigationItems";
import MobileSearchModal from "./MobileSearchModal";

const MobileBottomNavigation = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const handleSearchClick = () => {
    setIsSearchOpen(true);
  };

  const handleSearchClose = () => {
    setIsSearchOpen(false);
  };

  return (
    <>
      <div className="sm:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
        <NavigationItems isMobile={true} onSearchClick={handleSearchClick} />
      </div>

      <MobileSearchModal isOpen={isSearchOpen} onClose={handleSearchClose} />
    </>
  );
};

export default MobileBottomNavigation;
