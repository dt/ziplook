import { useMemo } from "react";
import FilesView from "./sidebar/FilesView";
import TablesView from "./sidebar/TablesView";
import SearchView from "./sidebar/SearchView";
import ProfilesView from "./sidebar/ProfilesView";
import StackgazerView from "./sidebar/StackgazerView";
import { useApp } from "../state/AppContext";

interface SidebarProps {
  activeView: "files" | "tables" | "search" | "profiles" | "stackgazer";
  isVisible: boolean;
  width: number;
  style?: React.CSSProperties;
  onCollapse?: () => void;
}

function Sidebar({ activeView, isVisible, width, style, onCollapse }: SidebarProps) {
  const { state } = useApp();

  // Calculate loading progress for tables view
  const tablesProgress = useMemo(() => {
    if (activeView !== "tables") return null;

    const tables = Object.values(state.tables);
    const loadableTables = tables.filter((t) => !t.isError);
    if (loadableTables.length === 0) return null;

    // Only count non-deferred tables (deferred tables aren't loaded until clicked)
    const autoLoadTables = loadableTables.filter((t) => !t.deferred);
    if (autoLoadTables.length === 0) return null;

    // Count tables that are either loaded or failed
    const completedCount = autoLoadTables.filter(
      (t) => t.loaded || t.loadError,
    ).length;
    const totalCount = autoLoadTables.length;

    // If all tables are completed, hide the progress
    if (completedCount === totalCount) return null;

    return { completedCount, totalCount };
  }, [activeView, state.tables]);

  const getTitle = () => {
    switch (activeView) {
      case "files":
        return "Files";
      case "tables":
        return "Tables";
      case "search":
        return "Search";
      case "profiles":
        return "Profiles";
      case "stackgazer":
        return "Stack Traces";
    }
  };

  const getContent = () => {
    switch (activeView) {
      case "files":
        return <FilesView />;
      case "tables":
        return <TablesView />;
      case "search":
        return <SearchView />;
      case "profiles":
        return <ProfilesView />;
      case "stackgazer":
        return <StackgazerView onCollapse={onCollapse} />;
    }
  };

  return (
    <div
      className={`sidebar ${!isVisible ? "collapsed" : ""}`}
      style={{
        width: isVisible ? `${width}px` : undefined,
        ...style
      }}
    >
      <div className="sidebar-header">
        <span>{getTitle()}</span>
        {tablesProgress && (
          <span className="tables-progress-label">
            {tablesProgress.completedCount}/{tablesProgress.totalCount}
          </span>
        )}
      </div>
      <div className="sidebar-content">{getContent()}</div>
    </div>
  );
}

export default Sidebar;
