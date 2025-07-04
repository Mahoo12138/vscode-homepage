import * as React from "react";
import type { HeadFC, PageProps } from "gatsby";
// import { VSCodePanelTab, VSCodePanels } from "@vscode-elements/react-elements";
// 改为尝试 VSCodeTabs/VSCodeTab/VSCodeTabPanel
import { VscodeTabs, VscodeTabHeader, VscodeTabPanel } from "@vscode-elements/react-elements";
import { EditorTabs } from '../components/EditorTabs';
import { CodeEditorPanel } from '../components/CodeEditorPanel';
import { CodeWithLineNumbers } from '../components/CodeWithLineNumbers';

const MIN_SIDEBAR_WIDTH = 48;
const CLOSE_THRESHOLD = 250; // 新增，拖动到此宽度及以下时关闭
const DEFAULT_SIDEBAR_WIDTH = 240;
const MAX_SIDEBAR_WIDTH = 400;
const TOOLBAR_WIDTH = 48;
const THEME_COLOR = "#007acc";
const SIDEBAR_CONTENT_THRESHOLD = 30; // 宽度小于此值只渲染空壳

const activityBarItems = [
  { key: "explorer", icon: "📁", label: "资源管理器" },
  { key: "search", icon: "🔍", label: "搜索" },
  { key: "git", icon: "🔀", label: "源代码管理" },
  { key: "run", icon: "▶️", label: "运行和调试" },
  { key: "ext", icon: "🧩", label: "扩展" },
];

const IndexPage: React.FC<PageProps> = () => {
  const [sidebarWidth, setSidebarWidth] = React.useState(DEFAULT_SIDEBAR_WIDTH);
  const [isDragging, setIsDragging] = React.useState(false);
  const [activePanel, setActivePanel] = React.useState(activityBarItems[0].key);
  const dragStartX = React.useRef(0);
  const dragStartWidth = React.useRef(0);
  const sidebarRef = React.useRef<HTMLDivElement | null>(null);
  const mainRef = React.useRef<HTMLDivElement | null>(null);

  // 拖拽逻辑
  const onResizerMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    dragStartX.current = e.clientX;
    dragStartWidth.current = sidebarWidth;
    document.body.style.userSelect = "none";
    document.body.style.cursor = "col-resize";
  };

  React.useEffect(() => {
    if (!isDragging) {
      document.body.style.userSelect = "";
      document.body.style.cursor = "";
      return;
    }
    const onMouseMove = (e: MouseEvent) => {
      let delta = e.clientX - dragStartX.current;
      let newWidth: number;

      if (dragStartWidth.current === 0) {
        // 关闭状态下向右拖
        if (delta < MIN_SIDEBAR_WIDTH) {
          newWidth = 0;
        } else {
          newWidth = delta; // 直接跟随鼠标
        }
      } else {
        // 正常拖动
        newWidth = dragStartWidth.current + delta;
        if (newWidth < MIN_SIDEBAR_WIDTH) {
          newWidth = 0;
        }
      }
      newWidth = Math.max(0, Math.min(MAX_SIDEBAR_WIDTH, newWidth));
      setSidebarWidth(newWidth);
    };

    const onMouseUp = () => {
      setIsDragging(false);
      if (sidebarWidth < MIN_SIDEBAR_WIDTH) {
        setSidebarWidth(0);
      } else {
        setSidebarWidth(sidebarWidth);
      }
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, [isDragging, sidebarWidth]);

  // 侧边栏内容
  const renderSidebarPanel = () => {
    switch (activePanel) {
      case "explorer":
        return (
          <div>
            <div className="mb-6">
              <div className="w-16 h-16 rounded-full mb-3 bg-gray-700" />
              <div className="font-bold text-lg">你的名字</div>
              <div className="text-sm text-gray-400">前端开发者</div>
            </div>
          </div>
        );
      case "search":
        return <div className="text-gray-400">🔍 搜索面板（占位）</div>;
      case "git":
        return <div className="text-gray-400">🔀 源代码管理面板（占位）</div>;
      case "run":
        return <div className="text-gray-400">▶️ 运行和调试面板（占位）</div>;
      case "ext":
        return <div className="text-gray-400">🧩 扩展面板（占位）</div>;
      default:
        return null;
    }
  };

  const codeTabs = [
    { label: "main.ts", content: "function hello() {\\n  console.log('Hello, world!');\\n}" },
    { label: "about.md", content: "# 关于\\n\\n这是一个演示。" }
  ];

  const [activeTab, setActiveTab] = React.useState(0);

  // 侧边栏是否显示内容
  const showSidebarContent = sidebarWidth >= MIN_SIDEBAR_WIDTH;

  return (
    <div className="flex flex-col h-screen">
      {/* 顶栏 */}
      <div
        className="flex items-center px-4 text-white font-medium select-none"
        style={{ height: 32, background: "#23272e", fontSize: 15, letterSpacing: 1 }}
      >
        <span className="mr-3">🧑‍💻</span> VSCode 个人主页
      </div>
      {/* 主体内容区 */}
      <div className="flex flex-1 min-h-0">
        {/* 工具栏 */}
        <nav
          className="flex flex-col items-center py-2 gap-2 z-20 select-none border-r"
          style={{ width: TOOLBAR_WIDTH, background: "#23272e", borderRightColor: "#222" }}
        >
          {activityBarItems.map((item) => (
            <button
              key={item.key}
              className={`w-10 h-10 flex items-center justify-center rounded text-xl transition-colors
                ${activePanel === item.key ? "bg-[#222] text-blue-400" : "hover:bg-[#222] text-gray-400"}
              `}
              onClick={() => {
                setActivePanel(item.key);
                if (sidebarWidth === 0) setSidebarWidth(DEFAULT_SIDEBAR_WIDTH);
              }}
              title={item.label}
            >
              {item.icon}
            </button>
          ))}
        </nav>
        {/* 侧边栏 */}
        <div
          ref={sidebarRef}
          className={`h-full bg-[#2c2c32] flex-shrink-0`}
          style={{
            width: sidebarWidth,
            minWidth: 0,
            maxWidth: MAX_SIDEBAR_WIDTH,
            overflow: "hidden",
            opacity: sidebarWidth === 0 ? 0 : 1,
            pointerEvents: sidebarWidth === 0 ? "none" : "auto",
            transition: isDragging ? "none" : "width 0.15s, opacity 0.15s",
            willChange: "width",
          }}
        >
          <div className={`h-full transition-opacity duration-100 ${showSidebarContent ? "opacity-100" : "opacity-0 pointer-events-none"}`}>
            {renderSidebarPanel()}
          </div>
        </div>
        {/* 拖拽条 */}
        <div
          className={`
            w-2 cursor-ew-resize z-30 transition-colors duration-150
            ${isDragging ? "bg-blue-500" : "hover:bg-blue-400"}
          `}
          onMouseDown={onResizerMouseDown}
          style={{ userSelect: "none" }}
        />
        {/* Main Content */}
        <main ref={mainRef} className="flex-1 bg-[#1e1e1e] p-0">
          <div className="h-full">
            <EditorTabs
              tabs={codeTabs}
              activeTab={activeTab}
              onTabChange={setActiveTab}
            />
            <CodeEditorPanel>
              <CodeWithLineNumbers code={codeTabs[activeTab].content} />
            </CodeEditorPanel>
          </div>
        </main>
      </div>
      {/* 底栏 */}
      <div
        className="flex items-center px-4 text-white select-none"
        style={{ height: 24, background: "#007acc", fontSize: 13 }}
      >
        <span>🟢 Online</span>
        <span className="ml-4">© 2024 你的名字</span>
      </div>
    </div>
  );
};

export default IndexPage;

export const Head: HeadFC = () => <title>Home Page</title>;
