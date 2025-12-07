import React from 'react';

export default function ValidationStatusWidget() {
  return (
    <div className="widget">
      <div className="widget-header">✅ Validation Status</div>
      <div style={{ 
        padding: '40px', 
        textAlign: 'center', 
        background: '#f9f9f9', 
        border: '1px solid #e0e0e0',
        borderRadius: '6px'
      }}>
        <div style={{ fontSize: '48px', marginBottom: '10px' }}>⏳</div>
        <div>Validation result not found. Upload and undefined file for validation.</div>
      </div>
      <div style={{ marginTop: '15px', textAlign: 'center' }}>
        <button className="btn btn-primary" style={{ marginRight: '10px' }}>
          🔍 Run Validation
        </button>
        <button className="btn btn-secondary">
          🔄 Reprocess
        </button>
      </div>
    </div>
  );
}