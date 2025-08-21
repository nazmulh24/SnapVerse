import { useState } from "react";
import { useLocation } from "react-router";
import NavigationSection from "./NavigationSection";
import { navigationSections } from "./navigationData";

const DesktopNavigation = () => {
  const location = useLocation();
  const isActive = (path) => location.pathname === path;

  // Initialize section visibility state from configuration
  const [sectionsExpanded, setSectionsExpanded] = useState(() => {
    const initialState = {};
    navigationSections.forEach((section) => {
      if (!section.alwaysVisible) {
        initialState[section.key] = section.defaultExpanded || false;
      }
    });
    return initialState;
  });

  // Toggle section visibility
  const toggleSection = (sectionKey) => {
    setSectionsExpanded((prev) => ({
      ...prev,
      [sectionKey]: !prev[sectionKey],
    }));
  };

  return (
    <nav className="flex-1 p-4">
      {navigationSections.map((section) => (
        <NavigationSection
          key={section.key}
          title={section.title}
          items={section.items}
          isExpanded={
            section.alwaysVisible ? true : sectionsExpanded[section.key]
          }
          onToggle={
            section.alwaysVisible ? null : () => toggleSection(section.key)
          }
          isActive={isActive}
          className={section.className}
        />
      ))}
    </nav>
  );
};

export default DesktopNavigation;
