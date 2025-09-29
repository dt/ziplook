import { useMemo } from "react";
import { useApp } from "../../state/AppContext";
import type { ZipEntryMeta } from "../../state/types";

interface ProfileNode {
  id: string;
  name: string;
  cpuProfile?: ZipEntryMeta;
  heapProfile?: ZipEntryMeta;
}

function ProfilesView() {
  const { state, dispatch } = useApp();

  // Group profile files by node
  const profileNodes = useMemo(() => {
    if (!state.zip) return [];

    const nodes = new Map<string, ProfileNode>();

    // Find all profile files - look for exact patterns
    state.zip.entries.forEach((entry) => {
      if (entry.isDir) return;

      const isCpuProfile = entry.name.endsWith('cpu.pprof');
      const isHeapProfile = entry.name.endsWith('heap.pprof');

      if (!isCpuProfile && !isHeapProfile) return;

      // Extract node ID from path like nodes/X/cpu.pprof or nodes/X/heap.pprof
      let nodeId = 'unknown';
      const nodesMatch = entry.path.match(/\/nodes\/(\d+)\//);
      if (nodesMatch) {
        nodeId = nodesMatch[1];
      }

      // Create or get node entry
      if (!nodes.has(nodeId)) {
        nodes.set(nodeId, {
          id: nodeId,
          name: nodeId === 'unknown' ? 'Unknown Node' : `Node ${nodeId}`,
        });
      }

      const node = nodes.get(nodeId)!;
      if (isCpuProfile) {
        node.cpuProfile = entry;
      }
      if (isHeapProfile) {
        node.heapProfile = entry;
      }
    });

    // Sort nodes numerically
    return Array.from(nodes.values()).sort((a, b) => {
      if (a.id === 'unknown') return 1;
      if (b.id === 'unknown') return -1;
      const aNum = parseInt(a.id);
      const bNum = parseInt(b.id);
      return aNum - bNum;
    });
  }, [state.zip]);

  const openProfile = (entry: ZipEntryMeta) => {
    // Create a new pprof tab
    const newTab = {
      kind: "pprof" as const,
      id: `pprof-${entry.id}`,
      fileId: entry.id,
      title: entry.path,
    };

    dispatch({
      type: "OPEN_TAB",
      tab: newTab,
    });
  };

  if (!state.zip) {
    return (
      <div className="empty-state">
        <p>No zip file loaded</p>
        <p
          style={{
            fontSize: "11px",
            color: "var(--text-muted)",
            marginTop: "8px",
          }}
        >
          Drag and drop a debug.zip file to get started
        </p>
      </div>
    );
  }

  if (profileNodes.length === 0) {
    return (
      <div className="empty-state">
        <p>No profile files found</p>
        <p
          style={{
            fontSize: "11px",
            color: "var(--text-muted)",
            marginTop: "8px",
          }}
        >
          Looking for cpu.pprof and heap.pprof files
        </p>
      </div>
    );
  }

  return (
    <div className="profiles-view">
      <div className="profiles-tree">
        {profileNodes.map((node) => (
          <div key={node.id} className="profile-node-tree">
            <div className="profile-node-header">{node.name}</div>
            <div className="profile-node-items">
              {node.cpuProfile ? (
                <div
                  className="profile-item"
                  onClick={() => openProfile(node.cpuProfile!)}
                  title={`Open ${node.cpuProfile.name}`}
                >
                  <span className="profile-item-name">cpu</span>
                </div>
              ) : (
                <div className="profile-item disabled">
                  <span className="profile-item-name crossed-out">cpu</span>
                </div>
              )}
              {node.heapProfile ? (
                <div
                  className="profile-item"
                  onClick={() => openProfile(node.heapProfile!)}
                  title={`Open ${node.heapProfile.name}`}
                >
                  <span className="profile-item-name">heap</span>
                </div>
              ) : (
                <div className="profile-item disabled">
                  <span className="profile-item-name crossed-out">heap</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ProfilesView;