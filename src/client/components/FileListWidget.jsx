import React from 'react';

export default function FileListWidget() {
  const files = [
    {
      name: "Customer_Database_Export.csv",
      status: "validated",
      source: "External",
      size: "5.2MB",
      records: "1,000",
      columns: "6",
      quality: "98.5%",
      timestamp: "2025-01-03 10:15"
    },
    {
      name: "PolicyHolder_Analytics.xlsx",
      status: "validated",
      source: "Internal",
      size: "3.1MB",
      records: "750",
      columns: "8",
      quality: "96.2%",
      timestamp: "2025-01-03 09:30"
    },
    {
      name: "Campaign_Results_Q4.json",
      status: "pending",
      source: "Campaign",
      size: "4.7MB",
      records: "900",
      columns: "12",
      quality: "89.1%",
      timestamp: "2025-01-03 08:45"
    },
    {
      name: "CRM_Integration_Data.csv",
      status: "validated",
      source: "CRM",
      size: "7.8MB",
      records: "1,200",
      columns: "10",
      quality: "94.7%",
      timestamp: "2025-01-02 16:20"
    },
    {
      name: "External_Vendor_Feed.xlsx",
      status: "failed",
      source: "External",
      size: "2.3MB",
      records: "450",
      columns: "5",
      quality: "76.3%",
      timestamp: "2025-01-02 14:10"
    },
    {
      name: "Risk_Assessment_Data.json",
      status: "validated",
      source: "Internal",
      size: "6.1MB",
      records: "880",
      columns: "9",
      quality: "97.8%",
      timestamp: "2025-01-02 11:35"
    }
  ];

  const getStatusIcon = (status) => {
    switch(status) {
      case 'validated': return '✅';
      case 'pending': return '⏳';
      case 'failed': return '❌';
      default: return '⏳';
    }
  };

  const getStatusClass = (status) => {
    switch(status) {
      case 'validated': return 'status-validated';
      case 'pending': return 'status-pending';
      case 'failed': return 'status-failed';
      default: return 'status-pending';
    }
  };

  const getStatusText = (status) => {
    switch(status) {
      case 'validated': return 'Validated';
      case 'pending': return 'Pending';
      case 'failed': return 'Failed';
      default: return 'Pending';
    }
  };

  return (
    <div className="widget">
      <div className="widget-header">📂 File Management</div>
      {files.map((file, index) => (
        <div key={index} className="file-list-item">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1 }}>
            <div style={{ fontSize: '20px' }}>📄</div>
            <div className="file-info">
              <div className="file-name">{file.name}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                <span className={`status-badge ${getStatusClass(file.status)}`}>
                  {getStatusIcon(file.status)} {getStatusText(file.status)}
                </span>
              </div>
              <div className="file-meta">
                <span>🏷️Source: {file.source}</span>
                <span>💾Size: {file.size}</span>
                <span>📊Records: {file.records}</span>
                <span>🗂️Columns: {file.columns}</span>
                <span>🎯Quality: {file.quality}</span>
              </div>
              <div style={{ fontSize: '11px', color: '#888' }}>
                ⏰{file.timestamp}
              </div>
            </div>
          </div>
          <div className="file-actions">
            <button className="btn btn-primary">👁️ View</button>
            <button className="btn btn-secondary">🔄 Revalidate</button>
            <button className="btn btn-danger">🗑️ Delete</button>
          </div>
        </div>
      ))}
    </div>
  );
}