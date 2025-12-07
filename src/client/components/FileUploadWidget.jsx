import React from 'react';

export default function FileUploadWidget() {
  return (
    <div className="widget">
      <div className="widget-header">⬆️ File Upload Control</div>
      <div style={{ marginBottom: '15px' }}>
        <strong>Source Type</strong>
        <div style={{ marginTop: '8px' }}>
          <select style={{ width: '100%', padding: '8px' }}>
            <option>Select Source Type...</option>
          </select>
        </div>
      </div>
      <div>
        <strong>📁 Upload Dataset</strong>
        <div className="upload-area" style={{ marginTop: '8px' }}>
          <div style={{ fontSize: '24px', marginBottom: '10px' }}>📁</div>
          <div>Drag $[AMP] Drop files or click</div>
          <div style={{ fontSize: '12px', color: '#666', marginTop: '5px' }}>
            Supported: .CSV, .XLSX, .JSON (Max: 100MB)
          </div>
        </div>
      </div>
    </div>
  );
}