import React, { useState, useRef } from 'react';
import './data-ingestion.css';

export default function DataIngestionApp() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState('idle');
  const [sourceType, setSourceType] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Status');
  const [filePreview, setFilePreview] = useState(null);
  const [quickAnalytics, setQuickAnalytics] = useState(null);
  const [validationStatus, setValidationStatus] = useState(null);
  const [isValidating, setIsValidating] = useState(false);
  const fileInputRef = useRef(null);

  // Summary Metrics (Section 1) - Dynamic data from ServiceNow tables
  const [summaryMetrics] = useState({
    totalDatasets: 47,
    viewedDatasets: 38,
    validatedDatasets: 42,
    failedValidations: 5
  });

  // Footer Metrics (Section 4)
  const [footerMetrics] = useState({
    dataQualityScore: 94.7,
    totalRecordsIngested: 1127891,
    lastSyncTime: '3h ago',
    qualityTrend: '+2.3%',
    recordsTrend: '+156,332',
    syncStatus: 'healthy'
  });

  // Enhanced mock data for Recent Data Uploads (Section 3)
  const mockFiles = [
    {
      id: 1,
      name: 'External Data 1',
      sourceType: 'External',
      size: '5MB',
      recordCount: 1000,
      uploadedTime: '2023-09-01 10:00',
      status: 'validated',
      statusText: '✅ Validated',
      errors: 0,
      quality: 98.5,
      columns: 6
    },
    {
      id: 2,
      name: 'Customer File',
      sourceType: 'Internal',
      size: '3MB',
      recordCount: 750,
      uploadedTime: '2023-09-02 14:30',
      status: 'validated',
      statusText: '✅ Validated',
      errors: 0,
      quality: 96.2,
      columns: 8
    },
    {
      id: 3,
      name: 'Campaign Data',
      sourceType: 'External',
      size: '4MB',
      recordCount: 900,
      uploadedTime: '2023-09-03 09:45',
      status: 'pending',
      statusText: '⏳ Pending',
      errors: 0,
      quality: 89.1,
      columns: 12
    },
    {
      id: 4,
      name: 'CRM_Integration_Data.csv',
      sourceType: 'CRM',
      size: '7.8MB',
      recordCount: 1200,
      uploadedTime: '2023-09-04 16:20',
      status: 'validated',
      statusText: '✅ Validated',
      errors: 0,
      quality: 94.7,
      columns: 10
    },
    {
      id: 5,
      name: 'External_Vendor_Feed.xlsx',
      sourceType: 'External',
      size: '2.3MB',
      recordCount: 450,
      uploadedTime: '2023-09-05 14:10',
      status: 'failed',
      statusText: '❌ Failed',
      errors: 12,
      quality: 76.3,
      columns: 5
    },
    {
      id: 6,
      name: 'Risk_Assessment_Data.json',
      sourceType: 'Internal',
      size: '6.1MB',
      recordCount: 880,
      uploadedTime: '2023-09-06 11:35',
      status: 'validated',
      statusText: '✅ Validated',
      errors: 0,
      quality: 97.8,
      columns: 9
    }
  ];

  const filteredFiles = mockFiles.filter(file => {
    const matchesSearch = file.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All Status' || 
      (statusFilter === 'Validated' && file.status === 'validated') ||
      (statusFilter === 'Pending' && file.status === 'pending') ||
      (statusFilter === 'Failed' && file.status === 'failed');
    return matchesSearch && matchesStatus;
  });

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Validate file type
      const allowedTypes = ['.csv', '.xlsx', '.json'];
      const fileExtension = '.' + file.name.split('.').pop().toLowerCase();
      if (!allowedTypes.includes(fileExtension)) {
        alert('Please upload a valid file format: .CSV, .XLSX, or .JSON');
        return;
      }

      // Validate file size (100MB max)
      const maxSize = 100 * 1024 * 1024; // 100MB in bytes
      if (file.size > maxSize) {
        alert('File size exceeds 100MB limit. Please upload a smaller file.');
        return;
      }

      setSelectedFile(file);
      setUploadStatus('uploading');
      setFilePreview(null);
      setQuickAnalytics(null);
      setValidationStatus(null);
      
      // Simulate upload process
      setTimeout(() => {
        setUploadStatus('completed');
        generateFilePreview(file);
      }, 2000);
    }
  };

  const generateFilePreview = (file) => {
    // Mock data preview
    const mockPreviewData = [
      ['Customer ID', 'Name', 'Email', 'CLV', 'Tier', 'Risk Level'],
      ['C001', 'John Smith', 'john@email.com', '$45,000', 'Gold', 'Low'],
      ['C002', 'Jane Doe', 'jane@email.com', '$67,500', 'Platinum', 'Medium'],
      ['C003', 'Bob Johnson', 'bob@email.com', '$23,000', 'Silver', 'High'],
      ['C004', 'Alice Brown', 'alice@email.com', '$89,000', 'Platinum', 'Low'],
      ['C005', 'Charlie Wilson', 'charlie@email.com', '$34,000', 'Bronze', 'Medium'],
      ['C006', 'Diana Davis', 'diana@email.com', '$52,000', 'Gold', 'Low'],
      ['C007', 'Ethan Miller', 'ethan@email.com', '$78,000', 'Platinum', 'Medium'],
      ['C008', 'Fiona Garcia', 'fiona@email.com', '$31,000', 'Silver', 'High'],
      ['C009', 'George Rodriguez', 'george@email.com', '$65,000', 'Gold', 'Low'],
      ['C010', 'Helen Martinez', 'helen@email.com', '$42,000', 'Silver', 'Medium']
    ];

    const mockAnalytics = {
      recordCount: Math.floor(Math.random() * 5000) + 500,
      columnCount: 6,
      nullValues: Math.floor(Math.random() * 50) + 5
    };

    setFilePreview(mockPreviewData);
    setQuickAnalytics(mockAnalytics);
  };

  const runValidation = () => {
    setIsValidating(true);
    
    // Simulate validation process
    setTimeout(() => {
      const validationResult = {
        status: Math.random() > 0.2 ? 'Validated' : 'Failed',
        errors: Math.random() > 0.5 ? [] : ['Missing required field: Customer ID', 'Invalid email format in row 15'],
        timestamp: new Date().toLocaleString()
      };

      setValidationStatus(validationResult);
      setIsValidating(false);
    }, 3000);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file) {
      handleFileUpload({ target: { files: [file] } });
    }
  };

  const viewFile = (file) => {
    alert(`Viewing details for: ${file.name}\n\nSource: ${file.sourceType}\nSize: ${file.size}\nRecords: ${file.recordCount}\nQuality: ${file.quality}%\nColumns: ${file.columns}\nStatus: ${file.statusText}\nLast Updated: ${file.uploadedTime}`);
  };

  const revalidateFile = (file) => {
    alert(`Initiating revalidation for: ${file.name}\n\nValidation workflow will be triggered and results will be updated in real-time.`);
  };

  const deleteFile = (fileId) => {
    const confirmed = confirm('Are you sure you want to delete this dataset?');
    if (confirmed) {
      alert(`Dataset ID ${fileId} has been marked for deletion.`);
    }
  };

  const drillDownMetric = (metricName) => {
    alert(`Drilling down into ${metricName} details:\n\n• View detailed audit logs\n• Filter by date range\n• Export data for analysis\n• Configure alerts and notifications`);
  };

  return (
    <div className="data-ingestion-container">
      {/* User Identity Display */}
      <div className="user-identity-header">
        <div className="user-avatar">ET</div>
        <div className="user-details">
          <div className="user-name">Emma Thompson</div>
          <div className="user-role">Data Analytics Manager</div>
        </div>
        <div className="last-sync">Last sync: {footerMetrics.lastSyncTime}</div>
      </div>

      {/* Section 1: Summary Metrics Panel */}
      <div className="summary-metrics-section">
        <h2 className="section-title">📊 Data Ingestion Overview</h2>
        <div className="summary-metrics-grid">
          <div className="metric-card total-datasets" onClick={() => drillDownMetric('Total Datasets')}>
            <div className="metric-header">
              <div className="metric-icon">📁</div>
              <div className="metric-trend">↗️ +5 this week</div>
            </div>
            <div className="metric-value">{summaryMetrics.totalDatasets}</div>
            <div className="metric-label">Total Datasets</div>
            <div className="metric-subtitle">All uploaded datasets</div>
          </div>

          <div className="metric-card viewed-datasets" onClick={() => drillDownMetric('Viewed Datasets')}>
            <div className="metric-header">
              <div className="metric-icon">👁️</div>
              <div className="metric-trend">📈 81% view rate</div>
            </div>
            <div className="metric-value">{summaryMetrics.viewedDatasets}</div>
            <div className="metric-label">Viewed Datasets</div>
            <div className="metric-subtitle">Opened/previewed files</div>
          </div>

          <div className="metric-card validated-datasets" onClick={() => drillDownMetric('Validated Datasets')}>
            <div className="metric-header">
              <div className="metric-icon">✅</div>
              <div className="metric-trend">🎯 89% success rate</div>
            </div>
            <div className="metric-value">{summaryMetrics.validatedDatasets}</div>
            <div className="metric-label">Validated Datasets</div>
            <div className="metric-subtitle">Successfully validated</div>
          </div>

          {summaryMetrics.failedValidations > 0 && (
            <div className="metric-card failed-validations anomaly" onClick={() => drillDownMetric('Failed Validations')}>
              <div className="metric-header">
                <div className="metric-icon">⚠️</div>
                <div className="metric-trend">❗ Attention needed</div>
              </div>
              <div className="metric-value">{summaryMetrics.failedValidations}</div>
              <div className="metric-label">Failed Validations</div>
              <div className="metric-subtitle">Require review</div>
            </div>
          )}
        </div>
      </div>

      {/* Section 2: Upload & Validation Workflow */}
      <div className="upload-workflow-section">
        <h2 className="section-title">📤 Upload & Validation Workflow</h2>
        <p className="section-subtitle">Drag-and-drop upload interface with real-time validation and preview</p>
        
        <div className="workflow-grid">
          {/* Upload Interface */}
          <div className="workflow-card upload-card">
            <div className="card-header">
              <h3 className="card-title">📁 Dataset Upload</h3>
            </div>
            <div className="card-content">
              {/* Source Type Selection */}
              <div className="form-group">
                <label className="form-label">Select Source Type</label>
                <select 
                  className="form-select"
                  value={sourceType}
                  onChange={(e) => setSourceType(e.target.value)}
                >
                  <option value="">Select Source Type...</option>
                  <option value="external">External</option>
                  <option value="crm">CRM</option>
                  <option value="campaign">Campaign</option>
                  <option value="internal">Internal</option>
                  <option value="api">API</option>
                </select>
              </div>

              {/* Upload Area */}
              <div 
                className="upload-drop-zone"
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".csv,.xlsx,.json"
                  onChange={handleFileUpload}
                  style={{ display: 'none' }}
                />
                
                {uploadStatus === 'idle' && (
                  <div className="upload-content">
                    <div className="upload-icon">📁</div>
                    <div className="upload-text">Drag & Drop files or click to upload</div>
                    <div className="upload-formats">Supported: .CSV, .XLSX, .JSON</div>
                    <div className="upload-limit">Max file size: 100MB</div>
                  </div>
                )}
                
                {uploadStatus === 'uploading' && (
                  <div className="upload-content">
                    <div className="upload-icon spinning">⏳</div>
                    <div className="upload-text">Uploading...</div>
                    <div className="upload-filename">{selectedFile?.name}</div>
                    <div className="progress-bar">
                      <div className="progress-fill"></div>
                    </div>
                  </div>
                )}
                
                {uploadStatus === 'completed' && (
                  <div className="upload-content success">
                    <div className="upload-icon">✅</div>
                    <div className="upload-text">Upload Complete</div>
                    <div className="upload-filename">{selectedFile?.name}</div>
                    <button className="btn btn-primary" onClick={() => fileInputRef.current?.click()}>
                      📁 Upload Another File
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Data Preview Panel */}
          <div className="workflow-card preview-card">
            <div className="card-header">
              <h3 className="card-title">📋 Data Preview Panel</h3>
              <div className="card-subtitle">First 10 rows</div>
            </div>
            <div className="card-content">
              {!filePreview ? (
                <div className="empty-state">
                  <div className="empty-icon">📄</div>
                  <div className="empty-text">No data preview available. Please upload a file to preview data</div>
                </div>
              ) : (
                <div className="preview-table-container">
                  <div className="preview-table">
                    {filePreview.map((row, rowIndex) => (
                      <div key={rowIndex} className={`preview-row ${rowIndex === 0 ? 'header-row' : ''}`}>
                        {row.map((cell, cellIndex) => (
                          <div key={cellIndex} className="preview-cell">
                            {cell}
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Analytics and Validation Row */}
        <div className="workflow-grid">
          {/* Quick Analytics Panel */}
          <div className="workflow-card analytics-card">
            <div className="card-header">
              <h3 className="card-title">📈 Quick Analytics Panel</h3>
            </div>
            <div className="card-content">
              {!quickAnalytics ? (
                <div className="empty-state">
                  <div className="empty-icon">📊</div>
                  <div className="empty-text">Upload a file to view analytics</div>
                </div>
              ) : (
                <div className="analytics-stats">
                  <div className="stat-item">
                    <div className="stat-label">Record Count</div>
                    <div className="stat-value">{quickAnalytics.recordCount.toLocaleString()}</div>
                  </div>
                  <div className="stat-item">
                    <div className="stat-label">Column Count</div>
                    <div className="stat-value">{quickAnalytics.columnCount}</div>
                  </div>
                  <div className="stat-item">
                    <div className="stat-label">Null Values</div>
                    <div className="stat-value">{quickAnalytics.nullValues}</div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Validation Panel */}
          <div className="workflow-card validation-card">
            <div className="card-header">
              <h3 className="card-title">✅ Validation Panel</h3>
            </div>
            <div className="card-content">
              {isValidating ? (
                <div className="validating-state">
                  <div className="validating-icon spinning">⏳</div>
                  <div className="validating-text">Running validation rules...</div>
                </div>
              ) : !validationStatus ? (
                <div className="empty-state">
                  <div className="empty-icon">⏳</div>
                  <div className="empty-text">Validation result not found. Uploaded file has not been processed with validation rules</div>
                </div>
              ) : (
                <div className="validation-result">
                  <div className={`validation-status status-${validationStatus.status.toLowerCase()}`}>
                    {validationStatus.status === 'Validated' ? '✅' : '❌'} {validationStatus.status}
                  </div>
                  <div className="validation-timestamp">Validated: {validationStatus.timestamp}</div>
                  {validationStatus.errors.length > 0 && (
                    <div className="validation-errors">
                      <div className="errors-title">Errors found:</div>
                      {validationStatus.errors.map((error, index) => (
                        <div key={index} className="error-item">• {error}</div>
                      ))}
                    </div>
                  )}
                </div>
              )}
              
              <div className="validation-actions">
                <button 
                  className="btn btn-primary" 
                  onClick={runValidation}
                  disabled={isValidating || !selectedFile}
                >
                  {isValidating ? '⏳ Validating...' : '🔍 Run Validation'}
                </button>
                <button 
                  className="btn btn-secondary"
                  disabled={!validationStatus}
                >
                  🔄 Reprocess
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Section 3: Recent Data Uploads Table */}
      <div className="uploads-table-section">
        <div className="table-header-section">
          <h2 className="section-title">📋 Recent Data Uploads</h2>
          <div className="table-controls">
            <div className="search-container">
              <input
                type="text"
                placeholder="🔍 Search files..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>
            <select 
              className="status-filter"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option>All Status</option>
              <option>Validated</option>
              <option>Pending</option>
              <option>Failed</option>
            </select>
          </div>
        </div>

        <div className="table-info-bar">
          <span className="results-count">Showing {filteredFiles.length} of {mockFiles.length} datasets</span>
          <div className="table-actions">
            <button className="btn btn-sm btn-secondary">📊 Export Report</button>
            <button className="btn btn-sm btn-primary">📥 Bulk Actions</button>
          </div>
        </div>

        <div className="uploads-table">
          <div className="table-header">
            <div className="table-cell header-cell sortable">
              <span>📄 File Name</span>
            </div>
            <div className="table-cell header-cell">
              <span>🏷️ Source Type</span>
            </div>
            <div className="table-cell header-cell">
              <span>💾 Size</span>
            </div>
            <div className="table-cell header-cell">
              <span>📊 Record Count</span>
            </div>
            <div className="table-cell header-cell sortable">
              <span>⏰ Uploaded Time ▼</span>
            </div>
            <div className="table-cell header-cell">
              <span>📈 Status</span>
            </div>
            <div className="table-cell header-cell">
              <span>⚙️ Actions</span>
            </div>
          </div>

          {filteredFiles.map((file) => (
            <div key={file.id} className="table-row" title={`Quality Score: ${file.quality}% | Columns: ${file.columns}`}>
              <div className="table-cell file-name-cell">
                <div className="file-info">
                  <span className="file-icon">📄</span>
                  <div className="file-details">
                    <div className="file-name">{file.name}</div>
                    <div className="file-quality">Quality: {file.quality}%</div>
                  </div>
                </div>
              </div>
              <div className="table-cell">
                <span className={`source-badge source-${file.sourceType.toLowerCase()}`}>
                  {file.sourceType}
                </span>
              </div>
              <div className="table-cell">{file.size}</div>
              <div className="table-cell">
                <div className="record-count">
                  {file.recordCount.toLocaleString()}
                  <div className="column-count">{file.columns} columns</div>
                </div>
              </div>
              <div className="table-cell">{file.uploadedTime}</div>
              <div className="table-cell">
                <div className={`status-badge status-${file.status}`}>
                  {file.statusText}
                  {file.errors > 0 && (
                    <div className="error-indicator">⚠️ {file.errors} errors</div>
                  )}
                </div>
              </div>
              <div className="table-cell actions-cell">
                <div className="action-buttons">
                  <button 
                    className="btn btn-sm btn-primary"
                    onClick={() => viewFile(file)}
                    title="View details and validation logs"
                  >
                    👁️ View
                  </button>
                  <button 
                    className="btn btn-sm btn-secondary"
                    onClick={() => revalidateFile(file)}
                    title="Re-run validation workflow"
                  >
                    🔄 Revalidate
                  </button>
                  <button 
                    className="btn btn-sm btn-danger"
                    onClick={() => deleteFile(file.id)}
                    title="Delete dataset"
                  >
                    🗑️ Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="table-pagination">
          <div className="pagination-info">
            Page 1 of 1 • {filteredFiles.length} total results
          </div>
          <div className="pagination-controls">
            <button className="btn btn-sm btn-secondary" disabled>← Previous</button>
            <button className="btn btn-sm btn-secondary" disabled>Next →</button>
          </div>
        </div>
      </div>

      {/* Section 4: Footer Metrics Panel */}
      <div className="footer-metrics-section">
        <h2 className="section-title">📊 Ingestion KPIs</h2>
        <div className="footer-metrics-grid">
          <div className="footer-metric-card quality-score" onClick={() => drillDownMetric('Data Quality Score')}>
            <div className="metric-header">
              <div className="metric-icon">🎯</div>
              <div className="metric-trend positive">{footerMetrics.qualityTrend}</div>
            </div>
            <div className="metric-value">{footerMetrics.dataQualityScore}%</div>
            <div className="metric-label">Data Quality Score</div>
            <div className="metric-subtitle">Validation success rate</div>
            <div className="metric-description">
              Calculated from ingestion and validation logs with trend vs previous sync
            </div>
          </div>

          <div className="footer-metric-card records-ingested" onClick={() => drillDownMetric('Total Records Ingested')}>
            <div className="metric-header">
              <div className="metric-icon">📈</div>
              <div className="metric-trend positive">{footerMetrics.recordsTrend}</div>
            </div>
            <div className="metric-value">{footerMetrics.totalRecordsIngested.toLocaleString()}</div>
            <div className="metric-label">Total Records Ingested</div>
            <div className="metric-subtitle">Cumulative data processed</div>
            <div className="metric-description">
              All-time total with audit tracking and drill-down capability
            </div>
          </div>

          <div className="footer-metric-card sync-time" onClick={() => drillDownMetric('Last Sync')}>
            <div className="metric-header">
              <div className="metric-icon">🔄</div>
              <div className={`sync-indicator ${footerMetrics.syncStatus}`}>
                {footerMetrics.syncStatus === 'healthy' ? '🟢' : '🟡'} {footerMetrics.syncStatus}
              </div>
            </div>
            <div className="metric-value">{footerMetrics.lastSyncTime}</div>
            <div className="metric-label">Last Sync Timestamp</div>
            <div className="metric-subtitle">Real-time data refresh</div>
            <div className="metric-description">
              Auto-refresh indicators with sync status monitoring
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="ingestion-footer">
        <div className="footer-info">
          <p>🔄 Data refreshes automatically every 15 minutes</p>
          <p>📊 All metrics calculated from ServiceNow ingestion tables</p>
          <p>🔐 Audit logs available with user tracking and timestamps</p>
        </div>
        <div className="footer-timestamp">
          Last updated: {new Date().toLocaleString()}
        </div>
      </div>
    </div>
  );
}