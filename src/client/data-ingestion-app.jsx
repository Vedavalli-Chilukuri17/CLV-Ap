import React from 'react';
import './data-ingestion.css';
import FileUploadWidget from './components/FileUploadWidget.jsx';
import CRMDataAnalyticsWidget from './components/CRMDataAnalyticsWidget.jsx';
import DataPreviewWidget from './components/DataPreviewWidget.jsx';
import QuickAnalyticsWidget from './components/QuickAnalyticsWidget.jsx';
import ValidationStatusWidget from './components/ValidationStatusWidget.jsx';
import FileListWidget from './components/FileListWidget.jsx';

export default function DataIngestionApp() {
  return (
    <div className="data-ingestion-container">
      <div className="widgets-grid">
        <div className="widget-row">
          <FileUploadWidget />
          <DataPreviewWidget />
        </div>
        
        {/* CRM Data Analytics & Dataset Sheet - New Section */}
        <div className="full-width-widget">
          <CRMDataAnalyticsWidget />
        </div>
        
        <div className="widget-row">
          <QuickAnalyticsWidget />
          <ValidationStatusWidget />
        </div>
        <div className="full-width-widget">
          <FileListWidget />
        </div>
      </div>
    </div>
  );
}