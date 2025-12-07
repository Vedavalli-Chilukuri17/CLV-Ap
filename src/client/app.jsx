import React, { useEffect, useState, useMemo, useCallback, useRef } from 'react';
import { DashboardService } from './services/DashboardService.js';
import KPICard from './components/KPICard.jsx';
import CustomerIntelligence from './components/CustomerIntelligence.jsx';
import RenewalManagement from './components/RenewalManagement.jsx';
import './app.css';
import './data-ingestion.css';

export default function App() {
  const service = useMemo(() => new DashboardService(), []);
  
  // Navigation state
  const [activeTab, setActiveTab] = useState('dashboard');
  
  // Dashboard data state
  const [dashboardData, setDashboardData] = useState({
    totalCustomers: { count: 0 },
    highRiskCustomers: { count: 0, percentage: 0 },
    averageCLV: { average: 0, total: 0 },
    renewalRate: { rate: 0, renewed: 0, opportunities: 0 },
    churnRate: { rate: 0, atRiskCount: 0, avgRisk: 0 },
    clvByTier: {},
    trends: { renewalTrend: [], churnTrend: [] }
  });
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Campaign Designer state - ISOLATED campaign name state
  const [campaignName, setCampaignName] = useState('');
  const [campaignState, setCampaignState] = useState({
    type: '',
    channel: '',
    priority: '',
    customerType: '',
    tier: '',
    productFrequency: [],
    toneStyle: '',
    messageBody: '',
    launchDate: '',
    launchTime: '',
    deliveryChannels: [],
    status: 'draft',
    segmentation: {
      count: 0,
      clv: 0,
      churn: 0,
      engagement: 0
    }
  });

  const [isGeneratingContent, setIsGeneratingContent] = useState(false);

  // Data Ingestion State - Updated to match new comprehensive design
  const [ingestionState, setIngestionState] = useState({
    selectedFile: null,
    uploadStatus: 'idle',
    sourceType: '',
    searchTerm: '',
    statusFilter: 'All Status',
    filePreview: null,
    quickAnalytics: null,
    validationStatus: null,
    isValidating: false,

    // Summary Metrics (Section 1)
    summaryMetrics: {
      totalDatasets: 47,
      viewedDatasets: 38,
      validatedDatasets: 42,
      failedValidations: 5
    },

    // Footer Metrics (Section 4)
    footerMetrics: {
      dataQualityScore: 94.7,
      totalRecordsIngested: 1127891,
      lastSyncTime: '3h ago',
      qualityTrend: '+2.3%',
      recordsTrend: '+156,332',
      syncStatus: 'healthy'
    }
  });

  // File input ref for data ingestion
  const fileInputRef = useRef(null);
  // Debounce timer ref
  const debounceTimerRef = useRef(null);

  // Load dashboard data
  useEffect(() => {
    loadDashboard();
  }, [service]);

  const loadDashboard = async () => {
    try {
      setLoading(true);
      setError(null);

      const [
        totalCustomers,
        highRiskCustomers,
        averageCLV,
        renewalRate,
        churnRate,
        clvByTier,
        trends
      ] = await Promise.allSettled([
        service.getTotalCustomers(),
        service.getHighRiskCustomers(),
        service.getAverageCLV(),
        service.getRenewalConversionRate(),
        service.getChurnRate(),
        service.getCLVByTier(),
        service.getTrendData()
      ]);

      // Handle promise results
      setDashboardData({
        totalCustomers: totalCustomers.status === 'fulfilled' ? totalCustomers.value : { count: 0 },
        highRiskCustomers: highRiskCustomers.status === 'fulfilled' ? highRiskCustomers.value : { count: 0, percentage: 0 },
        averageCLV: averageCLV.status === 'fulfilled' ? averageCLV.value : { average: 0, total: 0 },
        renewalRate: renewalRate.status === 'fulfilled' ? renewalRate.value : { rate: 0, renewed: 0, opportunities: 0 },
        churnRate: churnRate.status === 'fulfilled' ? churnRate.value : { rate: 0, atRiskCount: 0, avgRisk: 0 },
        clvByTier: clvByTier.status === 'fulfilled' ? clvByTier.value : {},
        trends: trends.status === 'fulfilled' ? trends.value : { renewalTrend: [], churnTrend: [] }
      });

    } catch (err) {
      setError('Failed to load dashboard data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatNumber = (num) => {
    return new Intl.NumberFormat('en-US').format(num);
  };

  const handleNavigation = (tabName) => {
    setActiveTab(tabName);
  };

  const getPageTitle = () => {
    const titles = {
      dashboard: 'Executive Dashboard',
      renewal: 'Renewal Pipeline Management',
      intelligence: 'Customer Intelligence',
      campaign: 'Campaign Designer',
      ingestion: 'Data Ingestion & Management'
    };
    return titles[activeTab] || 'Executive Dashboard';
  };

  const getBreadcrumb = () => {
    const breadcrumbs = {
      dashboard: 'CLV Maximization > Executive Dashboard > Overview',
      renewal: 'CLV Maximization > Renewal > Pipeline Management',
      intelligence: 'CLV Maximization > Analytics > Customer Intelligence',
      campaign: 'CLV Maximization > Marketing > Campaign Designer',
      ingestion: 'CLV Maximization > Data > Ingestion & Processing'
    };
    return breadcrumbs[activeTab] || 'CLV Maximization > Executive Dashboard > Overview';
  };

  // DEBOUNCED segmentation update function
  const debouncedUpdateSegmentation = useCallback((campaignType, customerType, tier) => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    
    debounceTimerRef.current = setTimeout(() => {
      if (campaignType && customerType) {
        const baseSegmentationData = {
          'retention,existing': { count: 85, clv: 195000, churn: 45, engagement: 18 },
          'retention,at_risk': { count: 45, clv: 125000, churn: 75, engagement: 8 },
          'upsell,high_clv': { count: 25, clv: 450000, churn: 15, engagement: 32 },
          'upsell,existing': { count: 65, clv: 180000, churn: 25, engagement: 22 },
          'winback,at_risk': { count: 35, clv: 95000, churn: 85, engagement: 5 },
          'crosssell,new': { count: 20, clv: 75000, churn: 10, engagement: 15 }
        };
        
        const key = `${campaignType},${customerType}`.toLowerCase().replace(/[\s-]/g, '_');
        let data = baseSegmentationData[key] || { count: 50, clv: 150000, churn: 40, engagement: 15 };
        
        // Adjust data based on tier selection
        if (tier) {
          const tierMultipliers = {
            'platinum': { count: 0.3, clv: 2.5, churn: 0.4, engagement: 1.8 },
            'gold': { count: 0.5, clv: 1.8, churn: 0.6, engagement: 1.4 },
            'silver': { count: 0.7, clv: 1.2, churn: 0.8, engagement: 1.1 },
            'bronze': { count: 0.9, clv: 0.8, churn: 1.2, engagement: 0.8 }
          };
          
          const multiplier = tierMultipliers[tier] || { count: 1, clv: 1, churn: 1, engagement: 1 };
          data = {
            count: Math.round(data.count * multiplier.count),
            clv: Math.round(data.clv * multiplier.clv),
            churn: Math.round(data.churn * multiplier.churn),
            engagement: Math.round(data.engagement * multiplier.engagement)
          };
        }
        
        setCampaignState(prev => ({
          ...prev,
          segmentation: data
        }));
      }
    }, 500);
  }, []);

  // Campaign Designer Functions - Simplified event handlers
  const handleCampaignTypeChange = (e) => {
    const value = e.target.value;
    setCampaignState(prev => ({
      ...prev,
      type: value
    }));
    debouncedUpdateSegmentation(value, campaignState.customerType, campaignState.tier);
  };

  const handleChannelChange = (e) => {
    setCampaignState(prev => ({
      ...prev,
      channel: e.target.value
    }));
  };

  const handlePriorityChange = (e) => {
    setCampaignState(prev => ({
      ...prev,
      priority: e.target.value
    }));
  };

  const handleCustomerTypeChange = (e) => {
    const value = e.target.value;
    setCampaignState(prev => ({
      ...prev,
      customerType: value
    }));
    debouncedUpdateSegmentation(campaignState.type, value, campaignState.tier);
  };

  const handleTierChange = (e) => {
    const value = e.target.value;
    setCampaignState(prev => ({
      ...prev,
      tier: value
    }));
    debouncedUpdateSegmentation(campaignState.type, campaignState.customerType, value);
  };

  const handleToneStyleChange = (e) => {
    setCampaignState(prev => ({
      ...prev,
      toneStyle: e.target.value
    }));
  };

  // COMPLETELY ISOLATED campaign name handler
  const handleCampaignNameChange = useCallback((e) => {
    setCampaignName(e.target.value);
  }, []);

  const toggleProductFrequency = (product) => {
    setCampaignState(prev => ({
      ...prev,
      productFrequency: prev.productFrequency.includes(product)
        ? prev.productFrequency.filter(p => p !== product)
        : [...prev.productFrequency, product]
    }));
  };

  const toggleDeliveryChannel = (channel) => {
    setCampaignState(prev => ({
      ...prev,
      deliveryChannels: prev.deliveryChannels.includes(channel)
        ? prev.deliveryChannels.filter(c => c !== channel)
        : [...prev.deliveryChannels, channel]
    }));
  };

  const generateAIContent = async () => {
    if (!campaignName || !campaignState.type || !campaignState.toneStyle) {
      alert('Please fill in Campaign Name, Type, and Tone Style before generating content.');
      return;
    }

    setIsGeneratingContent(true);
    
    // Simulate AI content generation
    setTimeout(() => {
      const templates = {
        'retention_friendly': `Hi {CustomerName},\n\nWe hope you're enjoying your insurance coverage with us! As your renewal date of {RenewalDate} approaches, we wanted to reach out personally.\n\nAs a valued customer, you're eligible for our exclusive {OfficeDiscount}% renewal discount available at our {OfficeLocation} office.\n\nYour current {ProductName} policy has been protecting you, and we'd love to continue that protection.\n\nReply to this message or visit us to secure your renewal today!\n\nBest regards,\nYour Insurance Team`,
        
        'upsell_professional': `Dear {CustomerName},\n\nThank you for your continued trust in our insurance services. As we review your current {ProductName} policy, we've identified opportunities to enhance your coverage.\n\nBased on your profile, we recommend considering additional coverage options that could provide even greater protection for your needs.\n\nOur team at {OfficeLocation} is ready to discuss these opportunities. Take advantage of our current {OfficeDiscount}% upgrade discount.\n\nSchedule your consultation today.\n\nSincerely,\nInsurance Advisory Team`,
        
        'winback_urgent': `{CustomerName}, we miss you!\n\nWe noticed your policy lapsed and want to make it easy for you to return.\n\n⚠️ Don't leave yourself unprotected - gaps in coverage can be costly!\n\n🎯 SPECIAL OFFER: Return within 30 days and receive {OfficeDiscount}% off your new {ProductName} policy.\n\nVisit our {OfficeLocation} office or call us immediately.\n\nYour protection matters - let's get you covered again!`,
        
        'crosssell_conversational': `Hey {CustomerName}!\n\nHope you're doing well! We've been taking care of your {ProductName} policy and love having you as a customer.\n\nSince you're already protected with us, have you thought about extending that same great coverage to other areas of your life?\n\nOur {OfficeLocation} team can show you how to save with our multi-policy discounts - including an additional {OfficeDiscount}% savings!\n\nLet's chat soon!\n\nCheers,\nYour Insurance Family`
      };
      
      const key = `${campaignState.type}_${campaignState.toneStyle}`.toLowerCase();
      let generatedContent = templates[key] || templates['retention_friendly'];
      
      // Add message brief that can be removed
      generatedContent = `[MESSAGE BRIEF: This campaign targets ${campaignState.customerType} customers for ${campaignState.type} with ${campaignState.toneStyle} tone. Remove this brief before final send.]\n\n${generatedContent}`;
      
      setCampaignState(prev => ({
        ...prev,
        messageBody: generatedContent
      }));
      
      setIsGeneratingContent(false);
    }, 2500);
  };

  const saveCampaign = () => {
    if (!campaignName || !campaignState.type || !campaignState.messageBody) {
      alert('Please fill in Campaign Name, Type, and generate content before saving.');
      return;
    }

    // Simulate saving to Campaign_Drafts table
    const timestamp = new Date().toISOString();
    console.log('Saving campaign to Campaign_Drafts:', {
      name: campaignName,
      ...campaignState,
      savedAt: timestamp,
      author: 'Emma Thompson'
    });

    setCampaignState(prev => ({
      ...prev,
      status: 'saved'
    }));

    alert('Campaign draft saved successfully! Stored in Campaign_Drafts table with timestamp and author metadata.');
  };

  const launchCampaign = () => {
    if (!campaignState.messageBody || !campaignState.launchDate || !campaignState.launchTime) {
      alert('Please generate content and set launch date/time before launching.');
      return;
    }

    if (campaignState.deliveryChannels.length === 0) {
      alert('Please select at least one delivery channel.');
      return;
    }

    // Check if message brief is still present and warn user
    if (campaignState.messageBody.includes('[MESSAGE BRIEF:')) {
      const confirmed = confirm('Your message still contains the message brief. Please remove it before launching or continue anyway?');
      if (!confirmed) {
        return;
      }
    }

    const confirmed = confirm(`Launch campaign "${campaignName}" immediately?\n\nThis will trigger outreach workflows for: ${campaignState.deliveryChannels.join(', ')}`);
    
    if (confirmed) {
      // Simulate storing in Campaign_Execution_Log
      const executionData = {
        campaignName: campaignName,
        launchTimestamp: new Date().toISOString(),
        channels: campaignState.deliveryChannels,
        targetCount: campaignState.segmentation.count,
        status: 'launched'
      };

      console.log('Storing in Campaign_Execution_Log:', executionData);
      
      setCampaignState(prev => ({
        ...prev,
        status: 'launched'
      }));

      alert('Campaign launched successfully! Execution logged in Campaign_Execution_Log. Outreach workflows initiated.');
    }
  };

  // Mock files data for ingestion
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

  // Data ingestion functions
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

      setIngestionState(prev => ({
        ...prev,
        selectedFile: file,
        uploadStatus: 'uploading',
        filePreview: null,
        quickAnalytics: null,
        validationStatus: null
      }));
      
      // Simulate upload process
      setTimeout(() => {
        setIngestionState(prev => ({...prev, uploadStatus: 'completed'}));
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

    setIngestionState(prev => ({
      ...prev,
      filePreview: mockPreviewData,
      quickAnalytics: mockAnalytics
    }));
  };

  const runValidation = () => {
    setIngestionState(prev => ({
      ...prev,
      isValidating: true
    }));
    
    // Simulate validation process
    setTimeout(() => {
      const validationResult = {
        status: Math.random() > 0.2 ? 'Validated' : 'Failed',
        errors: Math.random() > 0.5 ? [] : ['Missing required field: Customer ID', 'Invalid email format in row 15'],
        timestamp: new Date().toLocaleString()
      };

      setIngestionState(prev => ({
        ...prev,
        isValidating: false,
        validationStatus: validationResult
      }));
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

  const filteredFiles = mockFiles.filter(file => {
    const matchesSearch = file.name.toLowerCase().includes(ingestionState.searchTerm.toLowerCase());
    const matchesStatus = ingestionState.statusFilter === 'All Status' || 
      (ingestionState.statusFilter === 'Validated' && file.status === 'validated') ||
      (ingestionState.statusFilter === 'Pending' && file.status === 'pending') ||
      (ingestionState.statusFilter === 'Failed' && file.status === 'failed');
    return matchesSearch && matchesStatus;
  });

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

  // Original Dashboard Content Component
  const DashboardContent = () => {
    if (loading) {
      return (
        <div className="loading">Loading dashboard data...</div>
      );
    }

    if (error) {
      return (
        <div className="error">
          <p>{error}</p>
          <button onClick={loadDashboard} className="retry-button">
            Retry
          </button>
        </div>
      );
    }

    return (
      <>
        {/* Main KPIs */}
        <div className="kpi-grid">
          <KPICard
            title="Total Customers"
            value={formatNumber(dashboardData.totalCustomers.count)}
            subtitle="Active policyholders"
            icon="👥"
          />
          
          <KPICard
            title="High Risk Customers"
            value={formatNumber(dashboardData.highRiskCustomers.count)}
            subtitle={`${dashboardData.highRiskCustomers.percentage}% of total`}
            trend={`${dashboardData.highRiskCustomers.percentage}% high risk`}
            trendDirection="down"
            icon="⚠️"
          />
          
          <KPICard
            title="Average CLV (12 months)"
            value={formatCurrency(dashboardData.averageCLV.average)}
            subtitle={`Based on ${formatNumber(dashboardData.averageCLV.total)} customers`}
            trend="Trending stable"
            trendDirection="neutral"
            icon="💰"
          />
          
          <KPICard
            title="Renewal Conversion Rate"
            value={`${dashboardData.renewalRate.rate}%`}
            subtitle={`${formatNumber(dashboardData.renewalRate.renewed)} of ${formatNumber(dashboardData.renewalRate.opportunities)} opportunities`}
            trend="Target: 75%"
            trendDirection={dashboardData.renewalRate.rate >= 75 ? 'up' : 'down'}
            icon="🔄"
          />
        </div>

        {/* Secondary KPIs */}
        <div className="secondary-kpis">
          <div className="kpi-section">
            <h2 className="section-title">Churn Monitoring & Projections</h2>
            <div className="kpi-grid-small">
              <KPICard
                title="Churn Risk Rate"
                value={`${dashboardData.churnRate.rate}%`}
                subtitle={`${formatNumber(dashboardData.churnRate.atRiskCount)} customers at risk`}
                trend={`Avg risk: ${dashboardData.churnRate.avgRisk}%`}
                trendDirection={dashboardData.churnRate.rate > 15 ? 'up' : 'down'}
                icon="📉"
              />
            </div>
          </div>
        </div>

        {/* CLV by Tier */}
        <div className="tier-analysis">
          <h2 className="section-title">Average CLV by Customer Tier</h2>
          <div className="tier-grid">
            {Object.entries(dashboardData.clvByTier).map(([tierKey, tierData]) => (
              <div key={tierKey} className="tier-card">
                <div className="tier-header">
                  <h3 className="tier-name">{tierData.tier}</h3>
                  <div className={`tier-badge tier-${tierKey}`}>
                    {tierKey === 'platinum' ? '💎' : 
                     tierKey === 'gold' ? '🥇' : 
                     tierKey === 'silver' ? '🥈' : '🥉'}
                  </div>
                </div>
                <div className="tier-clv">{formatCurrency(tierData.average)}</div>
                <div className="tier-count">{formatNumber(tierData.count)} customers</div>
              </div>
            ))}
          </div>
        </div>

        {/* Trend Analysis */}
        <div className="trend-section">
          <h2 className="section-title">Trend Analysis (Last 6 Months)</h2>
          <div className="trend-cards">
            <div className="trend-card">
              <h3>Renewal Conversion Trend</h3>
              <div className="trend-chart">
                {dashboardData.trends.renewalTrend.map((point, index) => (
                  <div key={index} className="trend-point">
                    <div className="trend-bar" style={{height: `${point.rate}%`}}></div>
                    <div className="trend-label">{point.month}</div>
                    <div className="trend-value">{point.rate.toFixed(1)}%</div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="trend-card">
              <h3>Churn Rate Trend</h3>
              <div className="trend-chart churn-chart">
                {dashboardData.trends.churnTrend.map((point, index) => (
                  <div key={index} className="trend-point">
                    <div className="trend-bar churn-bar" style={{height: `${point.rate * 6}%`}}></div>
                    <div className="trend-label">{point.month}</div>
                    <div className="trend-value">{point.rate.toFixed(1)}%</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="dashboard-footer">
          <p>Last updated: {new Date().toLocaleString()}</p>
          <p>Data refreshes every 15 minutes automatically</p>
        </div>
      </>
    );
  };

  // Tab Content Components - Now using the new RenewalManagement component
  const RenewalContent = () => <RenewalManagement />;

  // Customer Intelligence Content - Using the new component
  const IntelligenceContent = () => <CustomerIntelligence />;

  const CampaignContent = () => (
    <div className="campaign-designer">
      <h2 className="section-title">📢 Campaign Designer</h2>
      <p className="tab-description">
        Enables marketing and customer success teams to build, preview, launch, and track personalized campaigns using GPT-powered content generation and predictive targeting.
      </p>

      {/* Section 1: Campaign Setup Panel */}
      <div className="campaign-section">
        <div className="section-header">
          <h3 className="section-title">⚙️ Campaign Details</h3>
        </div>
        
        <div className="campaign-form-grid">
          <div className="form-group">
            <label className="form-label">Campaign Name</label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g., Fall Renters Campaign"
              value={campaignName}
              onChange={handleCampaignNameChange}
              autoComplete="off"
              key="campaign-name-input" 
            />
          </div>

          <div className="form-group">
            <label className="form-label">Campaign Type</label>
            <select
              className="form-control dropdown-select"
              value={campaignState.type}
              onChange={handleCampaignTypeChange}
            >
              <option value="">Select campaign type...</option>
              <option value="retention">Retention</option>
              <option value="upsell">Upsell</option>
              <option value="winback">Win-back</option>
              <option value="crosssell">Cross-sell</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Channel</label>
            <select
              className="form-control dropdown-select"
              value={campaignState.channel}
              onChange={handleChannelChange}
            >
              <option value="">Select channel...</option>
              <option value="email">Email</option>
              <option value="sms">SMS</option>
              <option value="push">Push Notification</option>
              <option value="inapp">In-app Messaging</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Priority</label>
            <select
              className="form-control dropdown-select"
              value={campaignState.priority}
              onChange={handlePriorityChange}
            >
              <option value="">Select priority...</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Customer Type</label>
            <select
              className="form-control dropdown-select"
              value={campaignState.customerType}
              onChange={handleCustomerTypeChange}
            >
              <option value="">Select customer type...</option>
              <option value="new">New</option>
              <option value="existing">Existing</option>
              <option value="high_clv">High CLV</option>
              <option value="at_risk">At Risk</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Tier</label>
            <select
              className="form-control dropdown-select"
              value={campaignState.tier}
              onChange={handleTierChange}
            >
              <option value="">Select tier...</option>
              <option value="platinum">Platinum</option>
              <option value="gold">Gold</option>
              <option value="silver">Silver</option>
              <option value="bronze">Bronze</option>
            </select>
          </div>
        </div>

        {/* Dynamic Customer Segmentation Panel */}
        {campaignState.type && campaignState.customerType && (
          <div className="segmentation-panel">
            <h4 className="segmentation-title">🎯 Target Customer Segmentation</h4>
            <div className="segmentation-stats">
              <div className="stat-card">
                <div className="stat-number">{campaignState.segmentation.count}</div>
                <div className="stat-label">Target Customers</div>
              </div>
              <div className="stat-card">
                <div className="stat-number">${campaignState.segmentation.clv.toLocaleString()}</div>
                <div className="stat-label">Avg CLV</div>
              </div>
              <div className="stat-card">
                <div className="stat-number">{campaignState.segmentation.churn}%</div>
                <div className="stat-label">Churn Risk</div>
              </div>
              <div className="stat-card">
                <div className="stat-number">{campaignState.segmentation.engagement}</div>
                <div className="stat-label">Avg Engagement</div>
              </div>
            </div>
          </div>
        )}

        {/* Product Frequency Selection */}
        <div className="form-group">
          <label className="form-label">Product Frequency</label>
          <div className="checkbox-grid">
            {[
              'Auto Renew',
              'Monthly Installments', 
              'Annual Payments',
              'New Policy',
              'Personal Property Coverage',
              'Umbrella Liability',
              'Homeowners Coverage',
              'Renters Coverage',
              'Auto Coverage'
            ].map((product) => (
              <div key={product} className="checkbox-item">
                <input
                  type="checkbox"
                  id={product.replace(/\s+/g, '-').toLowerCase()}
                  checked={campaignState.productFrequency.includes(product)}
                  onChange={() => toggleProductFrequency(product)}
                />
                <label htmlFor={product.replace(/\s+/g, '-').toLowerCase()}>{product}</label>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Section 2: Campaign Content Panel */}
      <div className="campaign-section">
        <div className="section-header">
          <h3 className="section-title">✍️ Campaign Content</h3>
        </div>

        <div className="campaign-form-grid">
          <div className="form-group">
            <label className="form-label">Tone Style</label>
            <select
              className="form-control dropdown-select"
              value={campaignState.toneStyle}
              onChange={handleToneStyleChange}
            >
              <option value="">Select tone...</option>
              <option value="professional">Professional</option>
              <option value="friendly">Friendly</option>
              <option value="urgent">Urgent</option>
              <option value="conversational">Conversational</option>
            </select>
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">🤖 Message Body with Dynamic Keywords</label>
          <textarea
            className="form-control message-textarea"
            placeholder="AI-generated campaign message will appear here..."
            value={campaignState.messageBody}
            onChange={(e) => setCampaignState(prev => ({ ...prev, messageBody: e.target.value }))}
            rows={8}
          />
          
          <div className="keyword-tags">
            <span className="keyword-tag">{'{CustomerName}'}</span>
            <span className="keyword-tag">{'{OfficeLocation}'}</span>
            <span className="keyword-tag">{'{OfficeDiscount}'}</span>
            <span className="keyword-tag">{'{ProductName}'}</span>
            <span className="keyword-tag">{'{RenewalDate}'}</span>
          </div>
        </div>

        {isGeneratingContent && (
          <div className="ai-generating">
            <div className="ai-spinner"></div>
            <span>Generating personalized content with GPT...</span>
          </div>
        )}

        <div className="button-group">
          <button 
            className="btn btn-ai" 
            onClick={generateAIContent}
            disabled={isGeneratingContent}
          >
            🤖 Generate with AI
          </button>
          <button className="btn btn-secondary" onClick={generateAIContent}>
            🔄 Regenerate
          </button>
          <button className="btn btn-success" onClick={saveCampaign}>
            💾 Save Campaign
          </button>
        </div>
      </div>

      {/* Section 3: Schedule & Launch Panel */}
      <div className="campaign-section">
        <div className="section-header">
          <h3 className="section-title">🚀 Schedule & Launch</h3>
        </div>

        <div className="campaign-form-grid">
          <div className="form-group">
            <label className="form-label">Launch Date</label>
            <input
              type="date"
              className="form-control"
              value={campaignState.launchDate}
              onChange={(e) => setCampaignState(prev => ({ ...prev, launchDate: e.target.value }))}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Launch Time</label>
            <input
              type="time"
              className="form-control"
              value={campaignState.launchTime}
              onChange={(e) => setCampaignState(prev => ({ ...prev, launchTime: e.target.value }))}
            />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Delivery Channels</label>
          <div className="checkbox-grid">
            {[
              { id: 'email', label: '📧 Send Email' },
              { id: 'sms', label: '📱 Send SMS' },
              { id: 'ai_profiling', label: '🧠 Enable AI Profiling' }
            ].map((channel) => (
              <div key={channel.id} className="checkbox-item">
                <input
                  type="checkbox"
                  id={channel.id}
                  checked={campaignState.deliveryChannels.includes(channel.id)}
                  onChange={() => toggleDeliveryChannel(channel.id)}
                />
                <label htmlFor={channel.id}>{channel.label}</label>
              </div>
            ))}
          </div>
        </div>

        <div className="campaign-status">
          <span className={`status-badge status-${campaignState.status}`}>
            {campaignState.status === 'draft' && '📝 Draft'}
            {campaignState.status === 'saved' && '💾 Saved'}
            {campaignState.status === 'scheduled' && '📅 Scheduled'}
            {campaignState.status === 'launched' && '🚀 Launched'}
          </span>
        </div>

        <div className="button-group">
          <button className="btn btn-primary" onClick={launchCampaign}>
            🚀 Launch Campaign
          </button>
          <button className="btn btn-secondary">
            📅 Schedule for Later
          </button>
        </div>
      </div>

      {/* Section 4: Campaign Performance Tracker */}
      <div className="campaign-section">
        <div className="section-header">
          <h3 className="section-title">📊 Campaign Performance Tracker</h3>
        </div>

        <div className="performance-grid">
          <div className="performance-card">
            <div className="performance-number">24.3%</div>
            <div className="performance-label">Open Rate</div>
            <button className="drill-down-btn">📊 Details</button>
          </div>
          <div className="performance-card">
            <div className="performance-number">8.7%</div>
            <div className="performance-label">Click-Through Rate</div>
            <button className="drill-down-btn">📊 Details</button>
          </div>
          <div className="performance-card">
            <div className="performance-number">3.2%</div>
            <div className="performance-label">Conversion Rate</div>
            <button className="drill-down-btn">📊 Details</button>
          </div>
          <div className="performance-card">
            <div className="performance-number" style={{color: '#10b981'}}>-12%</div>
            <div className="performance-label">Churn Impact</div>
            <button className="drill-down-btn">📊 Details</button>
          </div>
        </div>

        <div className="performance-details">
          <div className="performance-section">
            <h4>📈 Segment-wise Performance</h4>
            <div className="segment-performance">
              <div className="segment-row">
                <span>Platinum Tier:</span>
                <span className="performance-value">34.2%</span>
              </div>
              <div className="segment-row">
                <span>Gold Tier:</span>
                <span className="performance-value">28.7%</span>
              </div>
              <div className="segment-row">
                <span>Email Channel:</span>
                <span className="performance-value">22.1%</span>
              </div>
              <div className="segment-row">
                <span>SMS Channel:</span>
                <span className="performance-value">31.5%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* User Identity Display */}
      <div className="user-identity">
        <div className="user-avatar-small">ET</div>
        <div className="user-details-small">
          <div className="user-name-small">Emma Thompson</div>
          <div className="user-role-small">Senior Marketing Analyst</div>
        </div>
        <div className="last-updated">Last updated: {new Date().toLocaleString()}</div>
      </div>
    </div>
  );

  // NEW: Comprehensive Data Ingestion Content Component
  const IngestionContent = () => (
    <div className="data-ingestion-container">
      {/* User Identity Header */}
      <div className="user-identity-header">
        <div className="user-avatar">ET</div>
        <div className="user-details">
          <div className="user-name">Emma Thompson</div>
          <div className="user-role">Data Analytics Manager</div>
        </div>
        <div className="last-sync">Last sync: {ingestionState.footerMetrics.lastSyncTime}</div>
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
            <div className="metric-value">{ingestionState.summaryMetrics.totalDatasets}</div>
            <div className="metric-label">Total Datasets</div>
            <div className="metric-subtitle">All uploaded datasets</div>
          </div>

          <div className="metric-card viewed-datasets" onClick={() => drillDownMetric('Viewed Datasets')}>
            <div className="metric-header">
              <div className="metric-icon">👁️</div>
              <div className="metric-trend">📈 81% view rate</div>
            </div>
            <div className="metric-value">{ingestionState.summaryMetrics.viewedDatasets}</div>
            <div className="metric-label">Viewed Datasets</div>
            <div className="metric-subtitle">Opened/previewed files</div>
          </div>

          <div className="metric-card validated-datasets" onClick={() => drillDownMetric('Validated Datasets')}>
            <div className="metric-header">
              <div className="metric-icon">✅</div>
              <div className="metric-trend">🎯 89% success rate</div>
            </div>
            <div className="metric-value">{ingestionState.summaryMetrics.validatedDatasets}</div>
            <div className="metric-label">Validated Datasets</div>
            <div className="metric-subtitle">Successfully validated</div>
          </div>

          {ingestionState.summaryMetrics.failedValidations > 0 && (
            <div className="metric-card failed-validations anomaly" onClick={() => drillDownMetric('Failed Validations')}>
              <div className="metric-header">
                <div className="metric-icon">⚠️</div>
                <div className="metric-trend">❗ Attention needed</div>
              </div>
              <div className="metric-value">{ingestionState.summaryMetrics.failedValidations}</div>
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
                  value={ingestionState.sourceType}
                  onChange={(e) => setIngestionState(prev => ({...prev, sourceType: e.target.value}))}
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
                
                {ingestionState.uploadStatus === 'idle' && (
                  <div className="upload-content">
                    <div className="upload-icon">📁</div>
                    <div className="upload-text">Drag & Drop files or click to upload</div>
                    <div className="upload-formats">Supported: .CSV, .XLSX, .JSON</div>
                    <div className="upload-limit">Max file size: 100MB</div>
                  </div>
                )}
                
                {ingestionState.uploadStatus === 'uploading' && (
                  <div className="upload-content">
                    <div className="upload-icon spinning">⏳</div>
                    <div className="upload-text">Uploading...</div>
                    <div className="upload-filename">{ingestionState.selectedFile?.name}</div>
                    <div className="progress-bar">
                      <div className="progress-fill"></div>
                    </div>
                  </div>
                )}
                
                {ingestionState.uploadStatus === 'completed' && (
                  <div className="upload-content success">
                    <div className="upload-icon">✅</div>
                    <div className="upload-text">Upload Complete</div>
                    <div className="upload-filename">{ingestionState.selectedFile?.name}</div>
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
              {!ingestionState.filePreview ? (
                <div className="empty-state">
                  <div className="empty-icon">📄</div>
                  <div className="empty-text">No data preview available. Please upload a file to preview data</div>
                </div>
              ) : (
                <div className="preview-table-container">
                  <div className="preview-table">
                    {ingestionState.filePreview.map((row, rowIndex) => (
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
              {!ingestionState.quickAnalytics ? (
                <div className="empty-state">
                  <div className="empty-icon">📊</div>
                  <div className="empty-text">Upload a file to view analytics</div>
                </div>
              ) : (
                <div className="analytics-stats">
                  <div className="stat-item">
                    <div className="stat-label">Record Count</div>
                    <div className="stat-value">{ingestionState.quickAnalytics.recordCount.toLocaleString()}</div>
                  </div>
                  <div className="stat-item">
                    <div className="stat-label">Column Count</div>
                    <div className="stat-value">{ingestionState.quickAnalytics.columnCount}</div>
                  </div>
                  <div className="stat-item">
                    <div className="stat-label">Null Values</div>
                    <div className="stat-value">{ingestionState.quickAnalytics.nullValues}</div>
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
              {ingestionState.isValidating ? (
                <div className="validating-state">
                  <div className="validating-icon spinning">⏳</div>
                  <div className="validating-text">Running validation rules...</div>
                </div>
              ) : !ingestionState.validationStatus ? (
                <div className="empty-state">
                  <div className="empty-icon">⏳</div>
                  <div className="empty-text">Validation result not found. Uploaded file has not been processed with validation rules</div>
                </div>
              ) : (
                <div className="validation-result">
                  <div className={`validation-status status-${ingestionState.validationStatus.status.toLowerCase()}`}>
                    {ingestionState.validationStatus.status === 'Validated' ? '✅' : '❌'} {ingestionState.validationStatus.status}
                  </div>
                  <div className="validation-timestamp">Validated: {ingestionState.validationStatus.timestamp}</div>
                  {ingestionState.validationStatus.errors.length > 0 && (
                    <div className="validation-errors">
                      <div className="errors-title">Errors found:</div>
                      {ingestionState.validationStatus.errors.map((error, index) => (
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
                  disabled={ingestionState.isValidating || !ingestionState.selectedFile}
                >
                  {ingestionState.isValidating ? '⏳ Validating...' : '🔍 Run Validation'}
                </button>
                <button 
                  className="btn btn-secondary"
                  disabled={!ingestionState.validationStatus}
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
                value={ingestionState.searchTerm}
                onChange={(e) => setIngestionState(prev => ({...prev, searchTerm: e.target.value}))}
                className="search-input"
              />
            </div>
            <select 
              className="status-filter"
              value={ingestionState.statusFilter}
              onChange={(e) => setIngestionState(prev => ({...prev, statusFilter: e.target.value}))}
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
              <div className="metric-trend positive">{ingestionState.footerMetrics.qualityTrend}</div>
            </div>
            <div className="metric-value">{ingestionState.footerMetrics.dataQualityScore}%</div>
            <div className="metric-label">Data Quality Score</div>
            <div className="metric-subtitle">Validation success rate</div>
            <div className="metric-description">
              Calculated from ingestion and validation logs with trend vs previous sync
            </div>
          </div>

          <div className="footer-metric-card records-ingested" onClick={() => drillDownMetric('Total Records Ingested')}>
            <div className="metric-header">
              <div className="metric-icon">📈</div>
              <div className="metric-trend positive">{ingestionState.footerMetrics.recordsTrend}</div>
            </div>
            <div className="metric-value">{ingestionState.footerMetrics.totalRecordsIngested.toLocaleString()}</div>
            <div className="metric-label">Total Records Ingested</div>
            <div className="metric-subtitle">Cumulative data processed</div>
            <div className="metric-description">
              All-time total with audit tracking and drill-down capability
            </div>
          </div>

          <div className="footer-metric-card sync-time" onClick={() => drillDownMetric('Last Sync')}>
            <div className="metric-header">
              <div className="metric-icon">🔄</div>
              <div className={`sync-indicator ${ingestionState.footerMetrics.syncStatus}`}>
                {ingestionState.footerMetrics.syncStatus === 'healthy' ? '🟢' : '🟡'} {ingestionState.footerMetrics.syncStatus}
              </div>
            </div>
            <div className="metric-value">{ingestionState.footerMetrics.lastSyncTime}</div>
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

  const renderTabContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardContent />;
      case 'renewal':
        return <RenewalContent />;
      case 'intelligence':
        return <IntelligenceContent />;
      case 'campaign':
        return <CampaignContent />;
      case 'ingestion':
        return <IngestionContent />;
      default:
        return <DashboardContent />;
    }
  };

  return (
    <div className="app-container">
      {/* Sidebar Navigation */}
      <nav className="sidebar">
        <div className="sidebar-header">
          <div className="logo-title">CLV Maximization</div>
          <div className="logo-subtitle">Executive Dashboard</div>
        </div>
        
        <div className="nav-menu">
          <div className="nav-item">
            <button 
              className={`nav-link ${activeTab === 'dashboard' ? 'active' : ''}`}
              onClick={() => handleNavigation('dashboard')}
            >
              <span className="nav-icon">📊</span>
              Dashboard
            </button>
          </div>
          
          <div className="nav-item">
            <button 
              className={`nav-link ${activeTab === 'renewal' ? 'active' : ''}`}
              onClick={() => handleNavigation('renewal')}
            >
              <span className="nav-icon">🔄</span>
              Renewal
            </button>
          </div>
          
          <div className="nav-item">
            <button 
              className={`nav-link ${activeTab === 'intelligence' ? 'active' : ''}`}
              onClick={() => handleNavigation('intelligence')}
            >
              <span className="nav-icon">🧠</span>
              Customer Intelligence
            </button>
          </div>
          
          <div className="nav-item">
            <button 
              className={`nav-link ${activeTab === 'campaign' ? 'active' : ''}`}
              onClick={() => handleNavigation('campaign')}
            >
              <span className="nav-icon">📢</span>
              Campaign
            </button>
          </div>
          
          <div className="nav-item">
            <button 
              className={`nav-link ${activeTab === 'ingestion' ? 'active' : ''}`}
              onClick={() => handleNavigation('ingestion')}
            >
              <span className="nav-icon">📥</span>
              Data Ingestion
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <div className="main-content">
        {/* Header */}
        <div className="dashboard-header">
          <div className="header-content">
            <h1 className="dashboard-title">{getPageTitle()}</h1>
            <p className="dashboard-subtitle">{getBreadcrumb()}</p>
            <button onClick={loadDashboard} className="refresh-button" title="Refresh Data">
              🔄
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div className="dashboard-content">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
}