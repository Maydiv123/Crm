import React from "react";

export default function ListSettings({ onClose }) {
  return (
    <div style={{position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.25)', zIndex: 4000, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
      <div style={{background: '#fff', borderRadius: 12, minWidth: 340, minHeight: 180, boxShadow: '0 4px 32px rgba(0,0,0,0.18)', padding: 32, position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
        <button onClick={onClose} style={{position: 'absolute', top: 16, right: 24, fontSize: 24, background: 'none', border: 'none', color: '#888', cursor: 'pointer'}}>×</button>
        <h2 style={{margin: '0 0 18px 0'}}>List Settings</h2>
        <div style={{color: '#555', fontSize: 18}}>List settings options will appear here.</div>
      </div>
    </div>
  );
} 