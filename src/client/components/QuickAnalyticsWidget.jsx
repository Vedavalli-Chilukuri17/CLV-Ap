import React from 'react';

export default function QuickAnalyticsWidget() {
  return (
    <div className="widget">
      <div className="widget-header">📈 Quick Analytics</div>
      <div style={{ 
        padding: '40px', 
        textAlign: 'center', 
        background: '#f9f9f9', 
        border: '1px solid #e0e0e0',
        borderRadius: '6px'
      }}>
        <div style={{ fontSize: '48px', marginBottom: '10px' }}>📊</div>
        <div>Upload a file to view analytics</div>
      </div>
    </div>
  );
}