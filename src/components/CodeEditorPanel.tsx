import React from "react";

export function CodeEditorPanel({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-[#1e1e1e] border border-[#333] rounded-b h-full overflow-auto font-mono text-sm">
      {children}
    </div>
  );
}
