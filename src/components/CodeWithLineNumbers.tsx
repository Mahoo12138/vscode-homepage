import React from "react";

export function CodeWithLineNumbers({ code }: { code: string }) {
  const lines = code.split("\\n");
  return (
    <pre className="flex bg-transparent p-0 m-0">
      <code className="flex">
        <span className="text-right select-none px-6 text-gray-500">
          {lines.map((_, i) => (
            <div key={i} className="h-5 leading-5">{i + 1}</div>
          ))}
        </span>
        <span className="text-gray-200">
          {lines.map((line, i) => (
            <div key={i} className="h-5 leading-5 whitespace-pre">{line}</div>
          ))}
        </span>
      </code>
    </pre>
  );
}
