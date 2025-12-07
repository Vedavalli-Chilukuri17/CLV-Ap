import React from 'react';

export default function DataPreviewWidget() {
  return (
    <div className="widget">
      <div className="widget-header">📋 Data Preview</div>
      <div style={{ 
        padding: '40px', 
        textAlign: 'center', 
        background: '#f9f9f9', 
        border: '1px solid #e0e0e0',
        borderRadius: '6px'
      }}>
        <div style={{ fontSize: '48px', marginBottom: '10px' }}>📄</div>
        <div>No data preview available. Upload a file to preview data.</div>
      </div>
    </div>
  );
}