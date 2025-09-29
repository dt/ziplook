import { useState, useRef, useEffect } from "react";
import { useApp } from "../state/AppContext";

function TabBar() {
  const { state, dispatch } = useApp();
  const [editingTabId, setEditingTabId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState("");
  const editInputRef = useRef<HTMLInputElement>(null);

  const handleTabClick = (tabId: string) => {
    if (!editingTabId) {
      dispatch({ type: "SET_ACTIVE_TAB", id: tabId });
    }
  };

  const handleTabDoubleClick = (tabId: string) => {
    if (!editingTabId) {
      // Double-click to start editing
      const tab = state.openTabs.find((t) => t.id === tabId);
      if (tab) {
        setEditingTabId(tabId);
        setEditingTitle(tab.title);
      }
    }
  };

  const handleTabClose = (tabId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch({ type: "CLOSE_TAB", id: tabId });
  };

  const handleTitleSubmit = () => {
    if (editingTabId && editingTitle.trim()) {
      dispatch({
        type: "UPDATE_TAB",
        id: editingTabId,
        updates: { title: editingTitle.trim() },
      });
    }
    setEditingTabId(null);
    setEditingTitle("");
  };

  const handleTitleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleTitleSubmit();
    } else if (e.key === "Escape") {
      setEditingTabId(null);
      setEditingTitle("");
    }
  };

  useEffect(() => {
    if (editingTabId && editInputRef.current) {
      editInputRef.current.focus();
      editInputRef.current.select();
    }
  }, [editingTabId]);

  return (
    <div className="tab-bar">
      {state.openTabs.map((tab) => (
        <div
          key={tab.id}
          className={`tab ${state.activeTabId === tab.id ? "active" : ""}`}
          onClick={() => handleTabClick(tab.id)}
          onDoubleClick={() => handleTabDoubleClick(tab.id)}
        >
          {editingTabId === tab.id ? (
            <input
              ref={editInputRef}
              className="tab-title-edit"
              value={editingTitle}
              onChange={(e) => setEditingTitle(e.target.value)}
              onKeyDown={handleTitleKeyDown}
              onBlur={handleTitleSubmit}
              onClick={(e) => e.stopPropagation()}
            />
          ) : (
            <span className="tab-title" title={tab.title}>
              <span className="tab-icon">
                {tab.kind === "file" ? "📄" : tab.kind === "sql" ? "📖" : tab.kind === "pprof" ? "📈" : "⚠️"}
              </span>
              {tab.title}
            </span>
          )}
          <button
            className="tab-close"
            onClick={(e) => handleTabClose(tab.id, e)}
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );
}

export default TabBar;
