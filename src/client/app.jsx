import React, { useEffect, useState, useMemo } from 'react';
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
    <div className="tab-content">
      <h2 className="section-title">📢 Campaign Designer</h2>
      <p className="tab-description">Design, create, and launch targeted marketing campaigns with AI-powered content generation and customer segmentation.</p>
      
      <div className="kpi-grid">
        <KPICard
          title="Active Campaigns"
          value="12"
          subtitle="Currently running"
          icon="🚀"
        />
        <KPICard
          title="Campaign Performance"
          value="24.3%"
          subtitle="Average open rate"
          icon="📊"
        />
        <KPICard
          title="Conversion Rate"
          value="3.2%"
          subtitle="Campaign to policy conversion"
          icon="🎯"
        />
        <KPICard
          title="ROI Impact"
          value="$2.40"
          subtitle="Revenue per dollar spent"
          icon="💵"
        />
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