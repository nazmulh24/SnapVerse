import React from "react";
import { Link } from "react-router";
import { MdChevronRight } from "react-icons/md";

const BusinessSection = ({ businessItems }) => {
  return (
    <div className="space-y-6 m-4">
      <h2 className="text-2xl font-bold text-slate-900">Business Tools</h2>
      <div className="grid gap-4">
        {businessItems.map((item, index) => (
          <Link
            key={index}
            to={item.href}
            className="flex items-center gap-4 p-4 bg-white rounded-xl border border-slate-200 hover:border-slate-300 hover:shadow-md transition-all duration-200"
          >
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <item.icon className="w-6 h-6 text-blue-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-slate-900">{item.label}</h3>
            </div>
            <MdChevronRight className="w-5 h-5 text-slate-400" />
          </Link>
        ))}
      </div>
    </div>
  );
};

export default BusinessSection;
