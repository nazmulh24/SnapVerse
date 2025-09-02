import React from "react";
import { Link } from "react-router";
import { MdChevronRight, MdSwitchAccount, MdLogout } from "react-icons/md";

const SettingsSection = ({ settingsItems }) => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-slate-900">Settings & Support</h2>

      {/* Settings Section */}
      <div className="space-y-1">
        <h3 className="text-lg font-semibold text-slate-700 mb-3">Settings</h3>
        {settingsItems.map((item, index) => (
          <Link
            key={index}
            to={item.href}
            className="flex items-center gap-4 p-4 bg-white rounded-xl border border-slate-200 hover:border-slate-300 hover:shadow-md transition-all duration-200"
          >
            <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center">
              <item.icon className="w-6 h-6 text-slate-600" />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-slate-900">{item.label}</h4>
            </div>
            <MdChevronRight className="w-5 h-5 text-slate-400" />
          </Link>
        ))}
      </div>

      {/* Account Actions */}
      <div className="space-y-1">
        <h3 className="text-lg font-semibold text-slate-700 mb-3">Account</h3>
        <button className="w-full flex items-center gap-4 p-4 bg-white rounded-xl border border-slate-200 hover:border-slate-300 hover:shadow-md transition-all duration-200">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
            <MdSwitchAccount className="w-6 h-6 text-blue-600" />
          </div>
          <div className="flex-1 text-left">
            <h4 className="font-semibold text-slate-900">Switch Account</h4>
          </div>
          <MdChevronRight className="w-5 h-5 text-slate-400" />
        </button>

        <button className="w-full flex items-center gap-4 p-4 bg-white rounded-xl border border-red-200 hover:border-red-300 hover:shadow-md transition-all duration-200 text-red-600">
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
            <MdLogout className="w-6 h-6 text-red-600" />
          </div>
          <div className="flex-1 text-left">
            <h4 className="font-semibold">Logout</h4>
          </div>
          <MdChevronRight className="w-5 h-5 text-red-400" />
        </button>
      </div>
    </div>
  );
};

export default SettingsSection;
