import React from "react";
import NavigationItems from "./NavigationItems";

const MobileBottomNavigation = () => {
  return (
    <div className="sm:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
      <NavigationItems isMobile={true} />
    </div>
  );
};

export default MobileBottomNavigation;
