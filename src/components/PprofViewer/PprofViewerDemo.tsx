import React, { useState } from 'react';
import { PprofViewer, flamegraphColorSchemes } from './index';
import type { Profile } from '../../utils/pprof-format';

// This is a demo component to test the PprofViewer
// In actual usage, you would pass a real Profile object from pprof-format
export function PprofViewerDemo() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [colorScheme, setColorScheme] = useState<keyof typeof flamegraphColorSchemes>('pastel');
  const [headerStyle, setHeaderStyle] = useState<'default' | 'compact'>('default');

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const arrayBuffer = await file.arrayBuffer();
      let data;

      // Check if gzipped and decompress
      const head = new Uint8Array(arrayBuffer.slice(0, 2));
      const isGz = head[0] === 0x1f && head[1] === 0x8b;

      if (isGz) {
        const ds = new DecompressionStream("gzip");
        const decompressed = file.stream().pipeThrough(ds);
        const decompressedBuffer = await new Response(decompressed).arrayBuffer();
        data = new Uint8Array(decompressedBuffer);
      } else {
        data = new Uint8Array(arrayBuffer);
      }

      // Parse using pprof-format
      const { Profile } = await import('../../utils/pprof-format');
      const parsedProfile = Profile.decode(data);
      setProfile(parsedProfile);
    } catch (error) {
      console.error('Error loading profile:', error);
      alert('Error loading profile: ' + (error as Error).message);
    }
  };

  if (!profile) {
    return (
      <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
        <h2>PProf Viewer Demo</h2>
        <p>Upload a pprof profile file to test the component:</p>
        <input
          type="file"
          accept=".prof,.gz,.pprof"
          onChange={handleFileUpload}
          style={{ marginBottom: '20px' }}
        />
        <p style={{ fontSize: '14px', color: '#666' }}>
          This demo loads the original HTML implementation to compare with the React component.
        </p>
      </div>
    );
  }

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '10px', borderBottom: '1px solid #ccc', background: '#f5f5f5' }}>
        <h3 style={{ margin: '0 0 10px 0' }}>PProf Viewer Demo</h3>
        <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
          <label>
            Color Scheme:
            <select
              value={colorScheme}
              onChange={(e) => setColorScheme(e.target.value as keyof typeof flamegraphColorSchemes)}
              style={{ marginLeft: '8px' }}
            >
              <option value="pastel">Pastel (Default)</option>
              <option value="classic">Classic Flame Graph</option>
              <option value="blue">Blue</option>
              <option value="green">Green</option>
              <option value="monochrome">Monochrome</option>
            </select>
          </label>

          <label>
            Header Style:
            <select
              value={headerStyle}
              onChange={(e) => setHeaderStyle(e.target.value as 'default' | 'compact')}
              style={{ marginLeft: '8px' }}
            >
              <option value="default">Default</option>
              <option value="compact">Compact</option>
            </select>
          </label>

          <button
            onClick={() => setProfile(null)}
            style={{ padding: '4px 8px' }}
          >
            Load New File
          </button>
        </div>
      </div>

      <div style={{ flex: 1 }}>
        <PprofViewer
          profile={profile}
          colorFunction={flamegraphColorSchemes[colorScheme]}
          headerStyle={headerStyle}
          theme={{
            borderColor: '#ddd',
            headerBackgroundColor: '#f8f9fa',
          }}
        />
      </div>
    </div>
  );
}