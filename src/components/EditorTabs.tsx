import React from "react";

export function EditorTabs({ tabs, activeTab, onTabChange }: {
  tabs: { label: string }[];
  activeTab: number;
  onTabChange: (idx: number) => void;
}) {
  return (
    <div className="flex h-8 border-b border-[#222] bg-[#1e1e1e]">
      {tabs.map((tab, idx) => (
        <button
          key={tab.label}
          className={`px-4 h-full flex items-center text-sm border-r border-[#222] 
            ${activeTab === idx ? "bg-[#23272e] text-blue-400" : "text-gray-300 hover:bg-[#23272e]"}
          `}
          onClick={() => onTabChange(idx)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
