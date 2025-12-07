import React, { useEffect, useState, useMemo, useCallback, useRef } from 'react';
import { DashboardService } from './services/DashboardService.js';
import KPICard from './components/KPICard.jsx';
import CustomerIntelligence from './components/CustomerIntelligence.jsx';
import RenewalManagement from './components/RenewalManagement.jsx';
import './app.css';

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

  // Enhanced Data Ingestion state
  const [ingestionState, setIngestionState] = useState({
    uploadedFile: null,
    uploadProgress: 0,
    isUploading: false,
    selectedSourceType: '',
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
    
    // Recent Data Uploads (Section 3) - Enhanced with more details
    recentUploads: [
      {
        id: '1',
        fileName: 'External Data 1',
        sourceType: 'External',
        size: '5MB',
        recordCount: 1000,
        uploadedTime: '2023-09-01 10:00',
        status: 'Validated',
        quality: 98.5,
        columns: 6,
        lastValidated: '2023-09-01 10:15',
        validationErrors: 0
      },
      {
        id: '2', 
        fileName: 'Customer File',
        sourceType: 'Internal',
        size: '3MB',
        recordCount: 750,
        uploadedTime: '2023-09-02 14:30',
        status: 'Validated',
        quality: 96.2,
        columns: 8,
        lastValidated: '2023-09-02 14:45',
        validationErrors: 0
      },
      {
        id: '3',
        fileName: 'Campaign Data',
        sourceType: 'External',
        size: '4MB',
        recordCount: 900,
        uploadedTime: '2023-09-03 09:45',
        status: 'Pending',
        quality: 89.1,
        columns: 12,
        lastValidated: null,
        validationErrors: null
      },
      {
        id: '4',
        fileName: 'CRM_Integration_Data.csv',
        sourceType: 'CRM',
        size: '7.8MB',
        recordCount: 1200,
        uploadedTime: '2023-09-04 16:20',
        status: 'Validated',
        quality: 94.7,
        columns: 10,
        lastValidated: '2023-09-04 16:35',
        validationErrors: 0
      },
      {
        id: '5',
        fileName: 'External_Vendor_Feed.xlsx',
        sourceType: 'External',
        size: '2.3MB',
        recordCount: 450,
        uploadedTime: '2023-09-05 14:10',
        status: 'Failed',
        quality: 76.3,
        columns: 5,
        lastValidated: '2023-09-05 14:25',
        validationErrors: 12
      },
      {
        id: '6',
        fileName: 'Risk_Assessment_Data.json',
        sourceType: 'Internal',
        size: '6.1MB',
        recordCount: 880,
        uploadedTime: '2023-09-06 11:35',
        status: 'Validated',
        quality: 97.8,
        columns: 9,
        lastValidated: '2023-09-06 11:50',
        validationErrors: 0
      }
    ],
    
    // Footer Metrics (Section 4)
    footerMetrics: {
      dataQualityScore: 94.7,
      totalRecordsIngested: 1127891,
      lastSyncTime: '3h ago',
      qualityTrend: '+2.3%',
      recordsTrend: '+156,332',
      syncStatus: 'healthy'
    },
    
    // Table state
    currentPage: 1,
    itemsPerPage: 6,
    sortBy: 'uploadedTime',
    sortDirection: 'desc',
    filterStatus: 'all',
    searchQuery: ''
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

  // Enhanced Data Ingestion Functions
  const handleFileUpload = (files) => {
    const file = files[0];
    if (!file) return;

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
      uploadedFile: file,
      isUploading: true,
      uploadProgress: 0,
      filePreview: null,
      quickAnalytics: null,
      validationStatus: null
    }));

    // Simulate upload progress
    const progressInterval = setInterval(() => {
      setIngestionState(prev => {
        const newProgress = prev.uploadProgress + 10;
        if (newProgress >= 100) {
          clearInterval(progressInterval);
          // Generate mock preview and analytics after upload
          generateFilePreview(file);
          return {
            ...prev,
            uploadProgress: 100,
            isUploading: false
          };
        }
        return {
          ...prev,
          uploadProgress: newProgress
        };
      });
    }, 200);
  };

  const generateFilePreview = (file) => {
    // Mock data preview based on file type
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

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    handleFileUpload(files);
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const deleteUpload = (uploadId) => {
    const confirmed = confirm('Are you sure you want to delete this upload?');
    if (confirmed) {
      setIngestionState(prev => ({
        ...prev,
        recentUploads: prev.recentUploads.filter(upload => upload.id !== uploadId)
      }));
    }
  };

  const viewUpload = (upload) => {
    alert(`Viewing details for: ${upload.fileName}\n\nSource: ${upload.sourceType}\nSize: ${upload.size}\nRecords: ${upload.recordCount}\nQuality: ${upload.quality}%\nColumns: ${upload.columns}\nStatus: ${upload.status}\nLast Validated: ${upload.lastValidated || 'Never'}\nValidation Errors: ${upload.validationErrors || 0}`);
  };

  const revalidateUpload = (uploadId) => {
    alert(`Initiating revalidation for dataset ID: ${uploadId}\n\nValidation workflow will be triggered and results will be updated in real-time.`);
  };

  // Table functions
  const handleSort = (column) => {
    setIngestionState(prev => ({
      ...prev,
      sortBy: column,
      sortDirection: prev.sortBy === column && prev.sortDirection === 'asc' ? 'desc' : 'asc'
    }));
  };

  const handleFilter = (status) => {
    setIngestionState(prev => ({
      ...prev,
      filterStatus: status,
      currentPage: 1
    }));
  };

  const handleSearch = (query) => {
    setIngestionState(prev => ({
      ...prev,
      searchQuery: query,
      currentPage: 1
    }));
  };

  // Filter and sort uploads
  const getFilteredUploads = () => {
    let filtered = [...ingestionState.recentUploads];
    
    // Apply status filter
    if (ingestionState.filterStatus !== 'all') {
      filtered = filtered.filter(upload => 
        upload.status.toLowerCase() === ingestionState.filterStatus.toLowerCase()
      );
    }
    
    // Apply search filter
    if (ingestionState.searchQuery) {
      filtered = filtered.filter(upload => 
        upload.fileName.toLowerCase().includes(ingestionState.searchQuery.toLowerCase()) ||
        upload.sourceType.toLowerCase().includes(ingestionState.searchQuery.toLowerCase())
      );
    }
    
    // Apply sorting
    filtered.sort((a, b) => {
      let aVal = a[ingestionState.sortBy];
      let bVal = b[ingestionState.sortBy];
      
      if (ingestionState.sortBy === 'uploadedTime') {
        aVal = new Date(aVal);
        bVal = new Date(bVal);
      } else if (ingestionState.sortBy === 'recordCount') {
        aVal = Number(aVal);
        bVal = Number(bVal);
      }
      
      if (aVal < bVal) return ingestionState.sortDirection === 'asc' ? -1 : 1;
      if (aVal > bVal) return ingestionState.sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
    
    return filtered;
  };

  // Pagination
  const getPaginatedUploads = () => {
    const filtered = getFilteredUploads();
    const startIndex = (ingestionState.currentPage - 1) * ingestionState.itemsPerPage;
    return filtered.slice(startIndex, startIndex + ingestionState.itemsPerPage);
  };

  const getTotalPages = () => {
    return Math.ceil(getFilteredUploads().length / ingestionState.itemsPerPage);
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

  // Enhanced Data Ingestion Content Component - SIMPLIFIED VERSION WITHOUT PROBLEMATIC WIDGET
  const IngestionContent = () => (
    <div className="data-ingestion-comprehensive">
      <h2 className="section-title">📥 Data Ingestion & Management</h2>
      <p className="tab-description">
        Modular, dynamic interface supporting multi-source file uploads, validation workflows, preview panels, 
        ingestion analytics, and audit tracking with real-time data from ServiceNow built-in tables.
      </p>

      {/* Section 1: Summary Metrics Panel (Top) - FLEXBOX LAYOUT */}
      <div className="summary-metrics-section">
        <h3 className="widget-section-title">📊 Summary Metrics Panel</h3>
        <div className="summary-metrics-flexbox" style={{
          display: 'flex',
          gap: '25px',
          flexWrap: 'wrap',
          marginBottom: '30px'
        }}>
          <div style={{flex: '1', minWidth: '300px'}}>
            <KPICard
              title="Total Datasets"
              value={ingestionState.summaryMetrics.totalDatasets.toString()}
              subtitle="All uploaded datasets"
              trend="📊 Click to drill-down"
              icon="📁"
              className={ingestionState.summaryMetrics.failedValidations > 0 ? 'has-anomaly' : ''}
              onClick={() => alert('Drilling down to dataset-level details:\n\n• Active Datasets: 42\n• Archived Datasets: 5\n• Processing Queue: 2\n\nClick on individual datasets for detailed metadata and lineage information.')}
            />
          </div>
          
          <div style={{flex: '1', minWidth: '300px'}}>
            <KPICard
              title="Viewed Datasets"
              value={ingestionState.summaryMetrics.viewedDatasets.toString()}
              subtitle="Datasets opened/reviewed"
              trend="👁️ View dataset details"
              icon="📋"
              onClick={() => alert('Drilling down to viewed datasets:\n\n• Recently Viewed: 12\n• Frequently Accessed: 8\n• Pending Review: 18\n\nAccess detailed viewing logs and user activity tracking.')}
            />
          </div>
          
          <div style={{flex: '1', minWidth: '300px'}}>
            <KPICard
              title="Validated Datasets"
              value={ingestionState.summaryMetrics.validatedDatasets.toString()}
              subtitle="Successfully validated"
              trend={`${ingestionState.summaryMetrics.failedValidations} failures detected`}
              trendDirection={ingestionState.summaryMetrics.failedValidations > 0 ? 'down' : 'up'}
              icon="✅"
              className={ingestionState.summaryMetrics.failedValidations > 0 ? 'has-anomaly' : ''}
              onClick={() => alert(`Validation Summary:\n\n✅ Validated: ${ingestionState.summaryMetrics.validatedDatasets}\n❌ Failed: ${ingestionState.summaryMetrics.failedValidations}\n⏳ Pending: ${ingestionState.summaryMetrics.totalDatasets - ingestionState.summaryMetrics.validatedDatasets - ingestionState.summaryMetrics.failedValidations}\n\nClick for detailed validation logs and error analysis.`)}
            />
          </div>
        </div>
      </div>

      {/* Section 2: Upload & Validation Workflow */}
      <div className="upload-workflow-section">
        <h3 className="widget-section-title">⚙️ Upload & Validation Workflow</h3>
        
        {/* Upload Interface */}
        <div className="upload-interface-container">
          <div className="upload-zone-widget">
            <div className="widget-header">
              <h4 className="widget-title">📤 Drag-and-Drop Upload Interface</h4>
              <div className="refresh-indicator">🔄 Real-time status</div>
            </div>
            <div className="widget-content">
              <div className="upload-controls-enhanced">
                <div className="source-selector">
                  <label className="form-label">Select Source Type</label>
                  <select 
                    className="form-control source-select-enhanced"
                    value={ingestionState.selectedSourceType}
                    onChange={(e) => setIngestionState(prev => ({...prev, selectedSourceType: e.target.value}))}
                  >
                    <option value="">Select Source Type...</option>
                    <option value="external">External</option>
                    <option value="crm">CRM</option>
                    <option value="campaign">Campaign</option>
                    <option value="internal">Internal</option>
                  </select>
                </div>
                
                <button className="btn btn-primary upload-btn-enhanced" onClick={triggerFileInput}>
                  📁 Upload Dataset
                </button>
              </div>
              
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv,.xlsx,.json"
                onChange={(e) => handleFileUpload(Array.from(e.target.files))}
                style={{ display: 'none' }}
              />
              
              <div 
                className={`upload-dropzone-enhanced ${ingestionState.isUploading ? 'uploading' : ''}`}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onClick={triggerFileInput}
              >
                <div className="dropzone-content">
                  <div className="dropzone-icon">📁</div>
                  <div className="dropzone-text">
                    {ingestionState.isUploading ? 'Uploading...' : 'Drag & Drop files or click to upload'}
                  </div>
                  <div className="dropzone-formats">
                    Supported: <strong>.CSV</strong>, <strong>.XLSX</strong>, <strong>.JSON</strong> (Max: <strong>100MB</strong>)
                  </div>
                </div>
                
                {ingestionState.isUploading && (
                  <div className="upload-progress">
                    <div className="progress-bar">
                      <div 
                        className="progress-fill" 
                        style={{ width: `${ingestionState.uploadProgress}%` }}
                      ></div>
                    </div>
                    <div className="progress-text">{ingestionState.uploadProgress}%</div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Preview, Analytics, and Validation Panels - FLEXBOX LAYOUT */}
        <div className="workflow-panels-flexbox" style={{
          display: 'flex',
          gap: '25px',
          flexWrap: 'wrap',
          marginTop: '30px'
        }}>
          {/* Data Preview Panel */}
          <div className="workflow-panel" style={{flex: '1', minWidth: '350px'}}>
            <div className="panel-header">
              <h4 className="panel-title">📋 Data Preview Panel</h4>
            </div>
            <div className="panel-content">
              {!ingestionState.filePreview ? (
                <div className="empty-state">
                  <div className="empty-icon">📄</div>
                  <p className="empty-message">No data preview available. Please upload a file to preview data.</p>
                </div>
              ) : (
                <div className="data-preview-enhanced">
                  <div className="preview-header">First 10 rows preview:</div>
                  <div className="preview-table-container">
                    <table className="preview-table-enhanced">
                      <thead>
                        <tr>
                          {ingestionState.filePreview[0]?.map((header, index) => (
                            <th key={index}>{header}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {ingestionState.filePreview.slice(1, 11).map((row, index) => (
                          <tr key={index}>
                            {row.map((cell, cellIndex) => (
                              <td key={cellIndex}>{cell}</td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Quick Analytics Panel */}
          <div className="workflow-panel" style={{flex: '1', minWidth: '350px'}}>
            <div className="panel-header">
              <h4 className="panel-title">📈 Quick Analytics Panel</h4>
            </div>
            <div className="panel-content">
              {!ingestionState.quickAnalytics ? (
                <div className="empty-state">
                  <div className="empty-icon">📊</div>
                  <p className="empty-message">Upload a file to view analytics</p>
                </div>
              ) : (
                <div className="analytics-stats-enhanced">
                  <div className="stat-item-enhanced">
                    <span className="stat-icon">📊</span>
                    <span className="stat-label">Record Count:</span>
                    <span className="stat-value">{ingestionState.quickAnalytics.recordCount.toLocaleString()}</span>
                  </div>
                  <div className="stat-item-enhanced">
                    <span className="stat-icon">🗂️</span>
                    <span className="stat-label">Column Count:</span>
                    <span className="stat-value">{ingestionState.quickAnalytics.columnCount}</span>
                  </div>
                  <div className="stat-item-enhanced">
                    <span className="stat-icon">⚠️</span>
                    <span className="stat-label">Null Values:</span>
                    <span className="stat-value">{ingestionState.quickAnalytics.nullValues}</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Validation Panel */}
          <div className="workflow-panel" style={{flex: '1', minWidth: '350px'}}>
            <div className="panel-header">
              <h4 className="panel-title">✅ Validation Panel</h4>
            </div>
            <div className="panel-content">
              {!ingestionState.validationStatus ? (
                <div className="validation-pending">
                  <div className="validation-icon">⏳</div>
                  <p className="validation-message">
                    Validation result not found. Uploaded file has not been processed with validation rules.
                  </p>
                  <div className="validation-actions">
                    <button 
                      className="btn btn-primary btn-sm"
                      onClick={runValidation}
                      disabled={!ingestionState.uploadedFile || ingestionState.isValidating}
                    >
                      {ingestionState.isValidating ? '⏳ Running Validation...' : '🔍 Run Validation'}
                    </button>
                    <button 
                      className="btn btn-secondary btn-sm"
                      disabled={!ingestionState.uploadedFile}
                    >
                      🔄 Reprocess
                    </button>
                  </div>
                </div>
              ) : (
                <div className="validation-result-enhanced">
                  <div className={`validation-status-enhanced ${ingestionState.validationStatus.status.toLowerCase()}`}>
                    {ingestionState.validationStatus.status === 'Validated' ? '✅' : '❌'} {ingestionState.validationStatus.status}
                  </div>
                  <div className="validation-timestamp">
                    Processed: {ingestionState.validationStatus.timestamp}
                  </div>
                  {ingestionState.validationStatus.errors?.length > 0 && (
                    <div className="validation-errors">
                      <h5>Validation Errors:</h5>
                      {ingestionState.validationStatus.errors.map((error, index) => (
                        <div key={index} className="error-item">❌ {error}</div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Section 3: Recent Data Uploads Table */}
      <div className="uploads-table-section">
        <h3 className="widget-section-title">📋 Recent Data Uploads Table</h3>
        
        <div className="table-controls">
          <div className="table-filters">
            <input
              type="text"
              className="search-input"
              placeholder="🔍 Search files..."
              value={ingestionState.searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
            />
            <select
              className="filter-select"
              value={ingestionState.filterStatus}
              onChange={(e) => handleFilter(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="validated">Validated</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
            </select>
          </div>
          
          <div className="table-info">
            Showing {getPaginatedUploads().length} of {getFilteredUploads().length} datasets
          </div>
        </div>

        <div className="uploads-table-container">
          <table className="uploads-table-enhanced">
            <thead>
              <tr>
                <th onClick={() => handleSort('fileName')} className="sortable">
                  📄 File Name {ingestionState.sortBy === 'fileName' && (ingestionState.sortDirection === 'asc' ? '▲' : '▼')}
                </th>
                <th onClick={() => handleSort('sourceType')} className="sortable">
                  🏷️ Source Type {ingestionState.sortBy === 'sourceType' && (ingestionState.sortDirection === 'asc' ? '▲' : '▼')}
                </th>
                <th onClick={() => handleSort('size')} className="sortable">
                  💾 Size {ingestionState.sortBy === 'size' && (ingestionState.sortDirection === 'asc' ? '▲' : '▼')}
                </th>
                <th onClick={() => handleSort('recordCount')} className="sortable">
                  📊 Record Count {ingestionState.sortBy === 'recordCount' && (ingestionState.sortDirection === 'asc' ? '▲' : '▼')}
                </th>
                <th onClick={() => handleSort('uploadedTime')} className="sortable">
                  ⏰ Uploaded Time {ingestionState.sortBy === 'uploadedTime' && (ingestionState.sortDirection === 'asc' ? '▲' : '▼')}
                </th>
                <th>📈 Status</th>
                <th>⚙️ Actions</th>
              </tr>
            </thead>
            <tbody>
              {getPaginatedUploads().map((upload) => (
                <tr key={upload.id} className="upload-row">
                  <td className="file-name-cell">
                    <div className="file-info-inline">
                      <span className="file-icon">📄</span>
                      <span className="file-name-text" title={upload.fileName}>{upload.fileName}</span>
                    </div>
                  </td>
                  <td>
                    <span className={`source-badge source-${upload.sourceType.toLowerCase()}`}>
                      {upload.sourceType}
                    </span>
                  </td>
                  <td>{upload.size}</td>
                  <td>{upload.recordCount.toLocaleString()}</td>
                  <td>{upload.uploadedTime}</td>
                  <td>
                    <div className="status-cell">
                      <span className={`status-badge status-${upload.status.toLowerCase()}`}>
                        {upload.status === 'Validated' ? '✅' : upload.status === 'Pending' ? '⏳' : '❌'} {upload.status}
                      </span>
                      {upload.status === 'Failed' && (
                        <div className="error-count">
                          ⚠️ {upload.validationErrors} errors
                        </div>
                      )}
                    </div>
                  </td>
                  <td>
                    <div className="actions-cell">
                      <button 
                        className="btn btn-sm btn-outline action-btn"
                        onClick={() => viewUpload(upload)}
                        title="View details"
                      >
                        👁️ View
                      </button>
                      <button 
                        className="btn btn-sm btn-outline action-btn"
                        onClick={() => revalidateUpload(upload.id)}
                        title="Revalidate dataset"
                      >
                        🔄 Revalidate
                      </button>
                      <button 
                        className="btn btn-sm btn-danger action-btn"
                        onClick={() => deleteUpload(upload.id)}
                        title="Delete dataset"
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="pagination-container">
          <div className="pagination-info">
            Page {ingestionState.currentPage} of {getTotalPages()}
          </div>
          <div className="pagination-controls">
            <button 
              className="btn btn-sm btn-outline"
              disabled={ingestionState.currentPage === 1}
              onClick={() => setIngestionState(prev => ({...prev, currentPage: prev.currentPage - 1}))}
            >
              ← Previous
            </button>
            <span className="page-numbers">
              {Array.from({length: getTotalPages()}, (_, i) => i + 1).map(pageNum => (
                <button
                  key={pageNum}
                  className={`btn btn-sm ${pageNum === ingestionState.currentPage ? 'btn-primary' : 'btn-outline'}`}
                  onClick={() => setIngestionState(prev => ({...prev, currentPage: pageNum}))}
                >
                  {pageNum}
                </button>
              ))}
            </span>
            <button 
              className="btn btn-sm btn-outline"
              disabled={ingestionState.currentPage === getTotalPages()}
              onClick={() => setIngestionState(prev => ({...prev, currentPage: prev.currentPage + 1}))}
            >
              Next →
            </button>
          </div>
        </div>
      </div>

      {/* Section 4: Footer Metrics Panel - FLEXBOX LAYOUT */}
      <div className="footer-metrics-section">
        <h3 className="widget-section-title">📊 Ingestion Performance KPIs</h3>
        <div className="footer-metrics-flexbox" style={{
          display: 'flex',
          gap: '25px',
          flexWrap: 'wrap'
        }}>
          <div style={{flex: '1', minWidth: '300px'}}>
            <KPICard
              title="Data Quality Score"
              value={`${ingestionState.footerMetrics.dataQualityScore}%`}
              subtitle="Calculated from validation logs"
              trend={`${ingestionState.footerMetrics.qualityTrend} vs previous sync`}
              trendDirection="up"
              icon="🎯"
              onClick={() => alert(`Data Quality Breakdown:\n\n📊 Overall Score: ${ingestionState.footerMetrics.dataQualityScore}%\n📈 Trend: ${ingestionState.footerMetrics.qualityTrend}\n\n✅ Schema Compliance: 96.2%\n🔧 Data Integrity: 94.5%\n📏 Format Validation: 93.8%\n\nClick for detailed quality audit logs and recommendations.`)}
            />
          </div>
          
          <div style={{flex: '1', minWidth: '300px'}}>
            <KPICard
              title="Total Records Ingested"
              value={ingestionState.footerMetrics.totalRecordsIngested.toLocaleString()}
              subtitle="Across all data sources"
              trend={`${ingestionState.footerMetrics.recordsTrend} this sync`}
              trendDirection="up"
              icon="📈"
              onClick={() => alert(`Ingestion Statistics:\n\n📊 Total Records: ${ingestionState.footerMetrics.totalRecordsIngested.toLocaleString()}\n📈 Growth: ${ingestionState.footerMetrics.recordsTrend}\n\n📁 By Source:\n• External: 450,332\n• CRM: 387,291\n• Campaign: 290,268\n\nAccess detailed ingestion logs and performance metrics.`)}
            />
          </div>
          
          <div style={{flex: '1', minWidth: '300px'}}>
            <KPICard
              title="Last Sync"
              value={ingestionState.footerMetrics.lastSyncTime}
              subtitle={`Status: ${ingestionState.footerMetrics.syncStatus}`}
              trend="🔄 Auto-refresh enabled"
              icon="⏱️"
              onClick={() => alert(`Sync Status Details:\n\n⏰ Last Sync: ${ingestionState.footerMetrics.lastSyncTime}\n✅ Status: ${ingestionState.footerMetrics.syncStatus.toUpperCase()}\n🔄 Next Sync: In 27 minutes\n\n📋 Sync History:\n• 09:00 - Success (1.2M records)\n• 06:00 - Success (890K records)\n• 03:00 - Success (756K records)\n\nView complete sync audit trail and configuration.`)}
            />
          </div>
        </div>
      </div>

      {/* User Identity Display */}
      <div className="user-identity">
        <div className="user-avatar-small">ET</div>
        <div className="user-details-small">
          <div className="user-name-small">Emma Thompson</div>
          <div className="user-role-small">Senior Data Analyst</div>
        </div>
        <div className="last-updated">
          Last updated: {new Date().toLocaleString()} | 
          <span className="refresh-indicator"> 🔄 Real-time updates active</span>
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
              <span class="nav-icon">📥</span>
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