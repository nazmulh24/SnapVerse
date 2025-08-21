import MobileNavigation from "../NavigationComponent/MobileNavigation";
import DesktopNavigation from "../NavigationComponent/DesktopNavigation";

const NavigationItems = ({ isMobile = false, onSearchClick }) => {
  if (isMobile) {
    return <MobileNavigation onSearchClick={onSearchClick} />;
  }

  return <DesktopNavigation />;
};

export default NavigationItems;
