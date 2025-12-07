import React, { useState, useEffect } from 'react';
import { display, value } from '../utils/fields.js';
import './CRMDataAnalyticsWidget.css';

export default function CRMDataAnalyticsWidget() {
  const [datasets, setDatasets] = useState([]);
  const [selectedDataset, setSelectedDataset] = useState(null);
  const [previewData, setPreviewData] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);

  useEffect(() => {
    loadDatasets();
    const interval = setInterval(loadDatasets, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const loadDatasets = async () => {
    try {
      setLoading(true);
      // Mock CRM datasets - in real implementation, this would fetch from ingestion logs
      const mockDatasets = [
        {
          sys_id: { value: 'dataset1', display_value: 'dataset1' },
          file_name: { value: 'policy_holders_2024.csv', display_value: 'policy_holders_2024.csv' },
          source_type: { value: 'CRM', display_value: 'CRM' },
          upload_date: { value: '2024-01-15 10:30:00', display_value: '2024-01-15 10:30:00' },
          validation_status: { value: 'validated', display_value: 'Validated' },
          record_count: { value: 5000, display_value: '5,000' },
          file_size: { value: '2.5MB', display_value: '2.5MB' },
          author: { value: 'admin', display_value: 'System Administrator' }
        },
        {
          sys_id: { value: 'dataset2', display_value: 'dataset2' },
          file_name: { value: 'customer_interactions_q4.xlsx', display_value: 'customer_interactions_q4.xlsx' },
          source_type: { value: 'CRM', display_value: 'CRM' },
          upload_date: { value: '2024-01-14 15:45:00', display_value: '2024-01-14 15:45:00' },
          validation_status: { value: 'pending', display_value: 'Pending' },
          record_count: { value: 12500, display_value: '12,500' },
          file_size: { value: '4.8MB', display_value: '4.8MB' },
          author: { value: 'data.analyst', display_value: 'Data Analyst' }
        }
      ];
      
      setDatasets(mockDatasets);
      setLastUpdated(new Date().toLocaleString());
    } catch (error) {
      console.error('Error loading datasets:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadDatasetPreview = async (dataset) => {
    try {
      // Mock preview data - in real implementation, fetch actual data preview
      const mockPreviewData = [
        { policyholder_id: 'PH001', first_name: 'John', last_name: 'Smith', age: 35, clv_score: 850, tier: 'Gold', tenure_months: 24 },
        { policyholder_id: 'PH002', first_name: 'Sarah', last_name: 'Johnson', age: 42, clv_score: 720, tier: 'Silver', tenure_months: 18 },
        { policyholder_id: 'PH003', first_name: 'Michael', last_name: 'Brown', age: 28, clv_score: 650, tier: 'Bronze', tenure_months: 12 },
        { policyholder_id: 'PH004', first_name: 'Emily', last_name: 'Davis', age: 39, clv_score: 780, tier: 'Gold', tenure_months: 36 },
        { policyholder_id: 'PH005', first_name: 'David', last_name: 'Wilson', age: 31, clv_score: 690, tier: 'Silver', tenure_months: 15 }
      ];
      
      setPreviewData(mockPreviewData);
      
      // Mock analytics data
      const mockAnalytics = {
        avg_policy_tenure: '22.5 months',
        avg_premium: '$1,245',
        avg_claims_per_customer: '1.3',
        high_clv_percentage: '35%'
      };
      
      setAnalytics(mockAnalytics);
    } catch (error) {
      console.error('Error loading dataset preview:', error);
    }
  };

  const handleDatasetSelect = (dataset) => {
    setSelectedDataset(dataset);
    loadDatasetPreview(dataset);
  };

  const handleViewDataset = (dataset) => {
    // Navigate to full dataset view
    window.open(`/nav_to.do?uri=x_hete_clvmaximi_0_policy_holder_list.do`, '_blank');
  };

  const handleViewMetadata = (dataset) => {
    // Navigate to metadata view
    alert(`Viewing metadata for: ${display(dataset.file_name)}`);
  };

  const getStatusBadgeClass = (status) => {
    switch (status.toLowerCase()) {
      case 'validated': return 'status-validated';
      case 'pending': return 'status-pending';
      case 'failed': return 'status-failed';
      default: return 'status-pending';
    }
  };

  const renderDatasetCards = () => (
    <div className="dataset-cards-section">
      <div className="section-header">
        <h3>📊 CRM Datasets</h3>
        <div className="refresh-info">
          {loading && <span className="refresh-indicator">🔄 Refreshing...</span>}
          {lastUpdated && <span className="last-updated">Last updated: {lastUpdated}</span>}
        </div>
      </div>
      <div className="dataset-cards">
        {datasets.map(dataset => (
          <div 
            key={value(dataset.sys_id)} 
            className={`dataset-card ${selectedDataset && value(selectedDataset.sys_id) === value(dataset.sys_id) ? 'selected' : ''}`}
            onClick={() => handleDatasetSelect(dataset)}
          >
            <div className="dataset-header">
              <div className="dataset-name">{display(dataset.file_name)}</div>
              <span className={`status-badge ${getStatusBadgeClass(display(dataset.validation_status))}`}>
                {display(dataset.validation_status)}
              </span>
            </div>
            <div className="dataset-meta">
              <div>📁 {display(dataset.record_count)} records</div>
              <div>💾 {display(dataset.file_size)}</div>
              <div>📅 {new Date(display(dataset.upload_date)).toLocaleDateString()}</div>
            </div>
            <div className="dataset-actions">
              <button className="btn btn-primary" onClick={(e) => { e.stopPropagation(); handleViewDataset(dataset); }}>
                View Dataset
              </button>
              <button className="btn btn-secondary" onClick={(e) => { e.stopPropagation(); handleViewMetadata(dataset); }}>
                View Metadata
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderDataSheetPreview = () => {
    if (!selectedDataset || !previewData.length) {
      return (
        <div className="preview-section">
          <h3>📋 Data Sheet Preview</h3>
          <div className="no-data">Select a dataset to preview data</div>
        </div>
      );
    }

    const columns = Object.keys(previewData[0]);
    
    return (
      <div className="preview-section">
        <div className="section-header">
          <h3>📋 Data Sheet Preview</h3>
          <div className="preview-stats">
            <span>Rows: {display(selectedDataset.record_count)}</span>
            <span>Columns: {columns.length}</span>
          </div>
        </div>
        <div className="preview-table-container">
          <table className="preview-table">
            <thead>
              <tr>
                {columns.map(col => (
                  <th key={col}>{col.replace(/_/g, ' ').toUpperCase()}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {previewData.slice(0, 10).map((row, index) => (
                <tr key={index}>
                  {columns.map(col => (
                    <td key={col}>{row[col]}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const renderQuickAnalytics = () => {
    if (!selectedDataset || !analytics) {
      return (
        <div className="analytics-section">
          <h3>📈 Quick Analytics</h3>
          <div className="no-data">Select a dataset to view analytics</div>
        </div>
      );
    }

    return (
      <div className="analytics-section">
        <h3>📈 Quick Analytics</h3>
        <div className="analytics-grid">
          <div className="analytics-card">
            <div className="analytics-value">{analytics.avg_policy_tenure}</div>
            <div className="analytics-label">Avg. Policy Tenure</div>
          </div>
          <div className="analytics-card">
            <div className="analytics-value">{analytics.avg_premium}</div>
            <div className="analytics-label">Avg. Premium</div>
          </div>
          <div className="analytics-card">
            <div className="analytics-value">{analytics.avg_claims_per_customer}</div>
            <div className="analytics-label">Avg. Claims per Customer</div>
          </div>
          <div className="analytics-card">
            <div className="analytics-value">{analytics.high_clv_percentage}</div>
            <div className="analytics-label">% High CLV Customers</div>
          </div>
        </div>
      </div>
    );
  };

  const renderMetadataSummary = () => {
    if (!selectedDataset) {
      return (
        <div className="metadata-section">
          <h3>ℹ️ Metadata Summary</h3>
          <div className="no-data">Select a dataset to view metadata</div>
        </div>
      );
    }

    return (
      <div className="metadata-section">
        <h3>ℹ️ Metadata Summary</h3>
        <div className="metadata-grid">
          <div className="metadata-item">
            <div className="metadata-label">File Name</div>
            <div className="metadata-value">{display(selectedDataset.file_name)}</div>
          </div>
          <div className="metadata-item">
            <div className="metadata-label">Source Type</div>
            <div className="metadata-value">{display(selectedDataset.source_type)}</div>
          </div>
          <div className="metadata-item">
            <div className="metadata-label">Upload Date & Time</div>
            <div className="metadata-value">{display(selectedDataset.upload_date)}</div>
          </div>
          <div className="metadata-item">
            <div className="metadata-label">Validation Status</div>
            <div className="metadata-value">
              <span className={`status-badge ${getStatusBadgeClass(display(selectedDataset.validation_status))}`}>
                {display(selectedDataset.validation_status)}
              </span>
            </div>
          </div>
          <div className="metadata-item">
            <div className="metadata-label">Author/User</div>
            <div className="metadata-value">{display(selectedDataset.author)}</div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="crm-analytics-widget">
      <div className="widget-header">
        <h2>📊 CRM Data Analytics & Dataset Sheet</h2>
        <button className="refresh-btn" onClick={loadDatasets} disabled={loading}>
          🔄 Refresh
        </button>
      </div>
      
      <div className="analytics-layout">
        {renderDatasetCards()}
        
        <div className="analytics-panels">
          {renderDataSheetPreview()}
          
          <div className="bottom-panels">
            {renderQuickAnalytics()}
            {renderMetadataSummary()}
          </div>
        </div>
      </div>
    </div>
  );
}