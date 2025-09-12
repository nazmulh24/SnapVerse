import { useState, useEffect } from "react";
import LeftSidebar from "./LeftSidebar";
import RightSidebar from "./RightSidebar";
import { Outlet } from "react-router";

const MainLayout = () => {
  const [leftSidebarWidth, setLeftSidebarWidth] = useState(320); // Default width 320px
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 640); // Use sm breakpoint (640px)

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 640); // Use sm breakpoint
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleSidebarWidthChange = (newWidth) => {
    setLeftSidebarWidth(newWidth);
  };

  return (
    <div className="h-screen max-w-8xl mx-auto bg-gray-50 relative overflow-hidden">
      <LeftSidebar onWidthChange={handleSidebarWidthChange} />
      <RightSidebar />

      <div
        className="lg:mr-80 overflow-y-auto transition-all duration-200 mt-16 sm:mt-0"
        style={{
          marginLeft: isDesktop ? `${leftSidebarWidth}px` : "0px",
          height: isDesktop ? "calc(100vh)" : "calc(100vh - 128px)", // 64px top + 64px bottom on mobile
        }}
      >
        <Outlet />
      </div>
    </div>
  );
};

export default MainLayout;
