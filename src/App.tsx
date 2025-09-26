import { useState, useCallback, useRef, useEffect } from "react";
import "./styles/global.css";
import "./styles/App.css";
import "./styles/crdb.css";
import "./styles/error-viewer.css";
import "./styles/navigation.css";
import IconRail from "./components/IconRail";
import Sidebar from "./components/Sidebar";
import MainPanel from "./components/MainPanel";
import { MemoryMonitor } from "./components/MemoryMonitor";
import { AppProvider, useApp } from "./state/AppContext";
import { NavigationProvider } from "./components/NavigationProvider";
import { useKeyboardShortcuts } from "./hooks/useKeyboardShortcuts";
import { useKeyboardNavigation } from "./hooks/useKeyboardNavigation";

type ActiveView = "files" | "tables" | "search" | "stackgazer";

function AppContent() {
  const { state, dispatch } = useApp();
  const [activeView, setActiveView] = useState<ActiveView>("tables");
  const [sidebarVisible, setSidebarVisible] = useState(true);
  const [sidebarWidth, setSidebarWidth] = useState(360);
  const [memoryMonitorOpen, setMemoryMonitorOpen] = useState(false);

  // DuckDB is now initialized in the DB worker through WorkerManager

  // Send stack data to iframe when explicitly told by controller
  // This will be triggered by a specific action, not automatically
  const sendStackDataToIframe = useCallback(() => {
    if (!state.zip || !state.stackData) {
      return;
    }

    // Only proceed if we have actual stack data
    if (Object.keys(state.stackData).length === 0) {
      return;
    }

    // Find the preloaded iframe
    const preloadedIframe = document.getElementById(
      "stackgazer-preload",
    ) as HTMLIFrameElement;
    if (!preloadedIframe) return;

    console.log(`🎯 Sending ${Object.keys(state.stackData).length} stack files to iframe:`, Object.keys(state.stackData));

    // Wait a bit for iframe to be ready, then send data one file at a time
    setTimeout(() => {
      try {
        if (preloadedIframe.contentWindow) {
          // Send each file individually
          for (const [path, content] of Object.entries(state.stackData || {})) {
            preloadedIframe.contentWindow.postMessage(
              {
                type: "LOAD_STACK_FILE",
                path: path,
                content: content,
              },
              window.location.origin,
            );
          }
        }
      } catch (error) {
        console.error("App: Error sending data to stackgazer iframe:", error);
      }
    }, 100);
  }, [state.zip, state.stackData]);

  // Expose function globally so DropZone can call it
  useEffect(() => {
    (window as any).sendStackDataToIframe = sendStackDataToIframe;
    return () => {
      delete (window as any).sendStackDataToIframe;
    };
  }, [sendStackDataToIframe]);

  const [isDragging, setIsDragging] = useState(false);
  const navigation = useKeyboardNavigation();
  const dragRef = useRef<{ startX: number; startWidth: number } | null>(null);

  const handleViewChange = (view: ActiveView) => {
    if (view === activeView && sidebarVisible) {
      // If clicking the current view, toggle sidebar
      setSidebarVisible(false);
    } else {
      // Otherwise, show sidebar and change view
      setSidebarVisible(true);
      setActiveView(view);
    }
  };

  // Global keyboard shortcuts
  const toggleSidebar = useCallback(() => {
    setSidebarVisible((prev) => !prev);
  }, []);

  const focusFilterInput = useCallback(() => {
    const filterInput = document.querySelector(
      ".filter-input",
    ) as HTMLInputElement;
    if (filterInput) {
      filterInput.focus();
      filterInput.select();
      navigation.setFilterFocus();
      navigation.clearNavigation();
    }
  }, [navigation]);

  const handleArrowDown = useCallback(() => {
    const activeElement = document.activeElement as HTMLElement;
    if (
      activeElement &&
      (activeElement.classList.contains("filter-input") ||
        activeElement.classList.contains("search-input"))
    ) {
      // Focus is in filter input, move to first result
      navigation.setNavigating(true);
      navigation.highlightIndex(0);
      activeElement.blur();
    } else if (navigation.state.isNavigating) {
      // Already navigating, move to next item
      navigation.highlightNext();
    }
  }, [navigation]);

  const handleArrowUp = useCallback(() => {
    if (navigation.state.isNavigating) {
      if (navigation.state.highlightedIndex === 0) {
        // At first item, return to filter
        navigation.clearNavigation();
        focusFilterInput();
      } else {
        navigation.highlightPrev();
      }
    }
  }, [navigation, focusFilterInput]);

  const handleEnterOrRight = useCallback(() => {
    if (navigation.state.isNavigating) {
      const highlightedItem = navigation.getHighlightedItem();
      if (highlightedItem) {
        // Trigger click on highlighted item
        if (highlightedItem.element) {
          highlightedItem.element.click();
        }
      }
    }
  }, [navigation]);

  const handleTabSwitch = useCallback(
    (tabNumber: number) => {
      if (tabNumber >= 1 && tabNumber <= 9) {
        const tabIndex = tabNumber - 1;
        if (state.openTabs[tabIndex]) {
          dispatch({ type: "SET_ACTIVE_TAB", id: state.openTabs[tabIndex].id });
        }
      }
    },
    [state.openTabs, dispatch],
  );

  // Sidebar resize functionality
  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      setIsDragging(true);
      dragRef.current = {
        startX: e.clientX,
        startWidth: sidebarWidth,
      };
    },
    [sidebarWidth],
  );

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging || !dragRef.current) return;

      const deltaX = e.clientX - dragRef.current.startX;
      const newWidth = Math.max(
        200,
        Math.min(600, dragRef.current.startWidth + deltaX),
      );
      setSidebarWidth(newWidth);
    },
    [isDragging],
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    dragRef.current = null;
  }, []);

  // Add global mouse event listeners for dragging
  useEffect(() => {
    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "col-resize";
      document.body.style.userSelect = "none";
    } else {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    };
  }, [isDragging, handleMouseMove, handleMouseUp]);

  useKeyboardShortcuts([
    { key: "/", handler: focusFilterInput },
    { key: "b", cmd: true, handler: toggleSidebar },
    { key: "ArrowDown", handler: handleArrowDown },
    { key: "ArrowUp", handler: handleArrowUp },
    { key: "Enter", handler: handleEnterOrRight },
    { key: "ArrowRight", handler: handleEnterOrRight },
    // Tab switching with cmd-number
    { key: "1", cmd: true, handler: () => handleTabSwitch(1) },
    { key: "2", cmd: true, handler: () => handleTabSwitch(2) },
    { key: "3", cmd: true, handler: () => handleTabSwitch(3) },
    { key: "4", cmd: true, handler: () => handleTabSwitch(4) },
    { key: "5", cmd: true, handler: () => handleTabSwitch(5) },
    { key: "6", cmd: true, handler: () => handleTabSwitch(6) },
    { key: "7", cmd: true, handler: () => handleTabSwitch(7) },
    { key: "8", cmd: true, handler: () => handleTabSwitch(8) },
    { key: "9", cmd: true, handler: () => handleTabSwitch(9) },
  ]);

  // Check if stackgazer iframe should be full-screen
  const isStackgazerFullScreen = activeView === "stackgazer" && state.zip && state.stackgazerReady;

  return (
    <>
      <div
        className={`app-container ${
          !sidebarVisible || isStackgazerFullScreen
            ? "sidebar-collapsed"
            : ""
        }`}
      >
        <IconRail
          activeView={activeView}
          onViewChange={handleViewChange}
          onMemoryMonitorOpen={() => setMemoryMonitorOpen(true)}
        />
        {!isStackgazerFullScreen && (
          <>
            <Sidebar
              activeView={activeView}
              isVisible={sidebarVisible}
              width={sidebarWidth}
            />
            {sidebarVisible && (
              <div
                className="sidebar-resize-handle"
                onMouseDown={handleMouseDown}
              />
            )}
            <MainPanel />
          </>
        )}
        {/* Preloaded iframe that gets repositioned when stackgazer is active */}
        <div
          id="stackgazer-iframe-container"
          style={{
            position: isStackgazerFullScreen ? "static" : "absolute",
            left: isStackgazerFullScreen ? "auto" : "-9999px",
            top: isStackgazerFullScreen ? "auto" : "-9999px",
            width: isStackgazerFullScreen ? "100%" : "1px",
            height: isStackgazerFullScreen ? "100%" : "1px",
            flex: isStackgazerFullScreen ? 1 : "none",
            display: isStackgazerFullScreen ? "flex" : "block",
            flexDirection: "column",
            overflow: "hidden",
          }}
        >
          <iframe
            src="./stackgazer.html"
            style={{
              width: "100%",
              height: "100%",
              border: "none",
              backgroundColor: "white",
            }}
            id="stackgazer-preload"
          />
        </div>
      </div>

      {/* Memory Monitor Modal - rendered outside app container for proper overlay */}
      <MemoryMonitor
        isOpen={memoryMonitorOpen}
        onClose={() => setMemoryMonitorOpen(false)}
      />
    </>
  );
}

function App() {
  return (
    <AppProvider>
      <NavigationProvider>
        <AppContent />
      </NavigationProvider>
    </AppProvider>
  );
}

export default App;
