import React from "react";

const RightSidebarFooter = () => {
  const footerLinks = [
    "About",
    "Help",
    "Press",
    "API",
    "Jobs",
    "Privacy",
    "Terms",
    "Locations",
  ];

  return (
    <div className="p-6 border-t border-gray-200">
      <div className="space-y-4">
        <div className="flex flex-wrap gap-x-2 gap-y-1">
          {footerLinks.map((link, index) => (
            <React.Fragment key={link}>
              <a href="#" className="text-xs text-gray-400 hover:text-gray-600">
                {link}
              </a>
              {index < footerLinks.length - 1 && (
                <span className="text-xs text-gray-300">·</span>
              )}
            </React.Fragment>
          ))}
        </div>

        <div className="text-xs text-center text-gray-400">
          <p>© 2025 SnapVerse</p>
        </div>
      </div>
    </div>
  );
};

export default RightSidebarFooter;
