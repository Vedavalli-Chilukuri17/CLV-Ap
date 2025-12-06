import React, { useEffect, useState, useMemo, useCallback, useRef } from 'react';
import { DashboardService } from './services/DashboardService.js';
import KPICard from './components/KPICard.jsx';
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

  // Campaign Designer state
  const [campaignState, setCampaignState] = useState({
    name: '',
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
      targetCount: 0,
      avgCLV: 0,
      churnRisk: 0,
      engagement: 0
    }
  });

  const [isGeneratingContent, setIsGeneratingContent] = useState(false);

  // Ref for campaign name input to manage cursor
  const campaignNameInputRef = useRef(null);

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

  // Campaign Designer Functions
  const updateCampaignField = useCallback((field, value) => {
    setCampaignState(prev => ({
      ...prev,
      [field]: value
    }));

    // Update segmentation when campaign type, customer type, or tier changes
    if (field === 'type' || field === 'customerType' || field === 'tier') {
      setTimeout(() => {
        updateSegmentation(
          field === 'type' ? value : campaignState.type,
          field === 'customerType' ? value : campaignState.customerType,
          field === 'tier' ? value : campaignState.tier
        );
      }, 0);
    }
  }, [campaignState.type, campaignState.customerType, campaignState.tier]);

  // Special handler for campaign name input with cursor management
  const handleCampaignNameChange = (e) => {
    const value = e.target.value;
    updateCampaignField('name', value);
    
    // Keep focus and cursor on the input after every character entry
    setTimeout(() => {
      if (campaignNameInputRef.current) {
        campaignNameInputRef.current.focus();
        // Set cursor position to the end of the text
        const length = value.length;
        campaignNameInputRef.current.setSelectionRange(length, length);
      }
    }, 0);
  };

  const updateSegmentation = (campaignType, customerType, tier) => {
    if (campaignType && customerType) {
      // Simulate segmentation data based on campaign, customer type, and tier
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
  };

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
    if (!campaignState.name || !campaignState.type || !campaignState.toneStyle) {
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
    if (!campaignState.name || !campaignState.type || !campaignState.messageBody) {
      alert('Please fill in Campaign Name, Type, and generate content before saving.');
      return;
    }

    // Simulate saving to Campaign_Drafts table
    const timestamp = new Date().toISOString();
    console.log('Saving campaign to Campaign_Drafts:', {
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

    const confirmed = confirm(`Launch campaign "${campaignState.name}" immediately?\n\nThis will trigger outreach workflows for: ${campaignState.deliveryChannels.join(', ')}`);
    
    if (confirmed) {
      // Simulate storing in Campaign_Execution_Log
      const executionData = {
        campaignName: campaignState.name,
        launchTimestamp: new Date().toISOString(),
        channels: campaignState.deliveryChannels,
        targetCount: campaignState.segmentation.targetCount,
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

  // Tab Content Components
  const RenewalContent = () => (
    <div className="tab-content">
      <h2 className="section-title">🔄 Renewal Pipeline Management</h2>
      <p className="tab-description">Manage and track policy renewals across different time horizons with priority-based intervention strategies.</p>
      
      <div className="kpi-grid">
        <KPICard
          title="Due in 30 Days"
          value="25"
          subtitle="Immediate action required"
          icon="⏰"
        />
        <KPICard
          title="Due in 60 Days"
          value="38"
          subtitle="Planning horizon"
          icon="📅"
        />
        <KPICard
          title="Due in 90 Days"
          value="52"
          subtitle="Strategic planning"
          icon="📈"
        />
        <KPICard
          title="Total Value at Risk"
          value="$3.2M"
          subtitle="Potential revenue impact"
          icon="💰"
        />
      </div>
    </div>
  );

  const IntelligenceContent = () => (
    <div className="tab-content">
      <h2 className="section-title">🧠 Customer Intelligence & Insights</h2>
      <p className="tab-description">Advanced analytics and behavioral insights to drive personalized customer engagement strategies.</p>
      
      <div className="kpi-grid">
        <KPICard
          title="Digital Natives"
          value="42%"
          subtitle="Tech-savvy customers"
          icon="📱"
        />
        <KPICard
          title="Traditional Customers"
          value="38%"
          subtitle="Phone & in-person preference"
          icon="📞"
        />
        <KPICard
          title="Hybrid Users"
          value="20%"
          subtitle="Multi-channel engagement"
          icon="🔗"
        />
        <KPICard
          title="Mobile App Adoption"
          value="73%"
          subtitle="Self-service engagement"
          icon="📲"
        />
      </div>
    </div>
  );

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
              ref={campaignNameInputRef}
              type="text"
              className="form-control"
              placeholder="e.g., Fall Renters Campaign"
              value={campaignState.name}
              onChange={handleCampaignNameChange}
              autoComplete="off"
              onBlur={() => {
                // Re-focus after blur to maintain cursor position
                setTimeout(() => {
                  if (campaignNameInputRef.current && campaignState.name) {
                    campaignNameInputRef.current.focus();
                  }
                }, 10);
              }}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Campaign Type</label>
            <select
              className="form-control"
              value={campaignState.type}
              onChange={(e) => updateCampaignField('type', e.target.value)}
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
              className="form-control"
              value={campaignState.channel}
              onChange={(e) => updateCampaignField('channel', e.target.value)}
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
              className="form-control"
              value={campaignState.priority}
              onChange={(e) => updateCampaignField('priority', e.target.value)}
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
              className="form-control"
              value={campaignState.customerType}
              onChange={(e) => updateCampaignField('customerType', e.target.value)}
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
              className="form-control"
              value={campaignState.tier}
              onChange={(e) => updateCampaignField('tier', e.target.value)}
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
              className="form-control"
              value={campaignState.toneStyle}
              onChange={(e) => updateCampaignField('toneStyle', e.target.value)}
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
            onChange={(e) => updateCampaignField('messageBody', e.target.value)}
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
              onChange={(e) => updateCampaignField('launchDate', e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Launch Time</label>
            <input
              type="time"
              className="form-control"
              value={campaignState.launchTime}
              onChange={(e) => updateCampaignField('launchTime', e.target.value)}
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

  const IngestionContent = () => (
    <div className="tab-content">
      <h2 className="section-title">📥 Data Ingestion & Management</h2>
      <p className="tab-description">Manage data imports, transformations, and integrations to keep your customer intelligence platform up-to-date.</p>
      
      <div className="kpi-grid">
        <KPICard
          title="Records Processed"
          value="430"
          subtitle="Last 2 hours"
          icon="📊"
        />
        <KPICard
          title="Success Rate"
          value="98.4%"
          subtitle="Data quality excellent"
          icon="✅"
        />
        <KPICard
          title="Validation Errors"
          value="7"
          subtitle="Require attention"
          icon="⚠️"
        />
        <KPICard
          title="Data Sources"
          value="5"
          subtitle="Active integrations"
          icon="🔗"
        />
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