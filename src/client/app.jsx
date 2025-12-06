import React, { useEffect, useState, useMemo } from 'react';
import { DashboardService } from './services/DashboardService.js';
import KPICard from './components/KPICard.jsx';
import './app.css';

export default function App() {
  const service = useMemo(() => new DashboardService(), []);
  
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

  if (loading) {
    return (
      <div className="dashboard-container">
        <div className="loading">Loading dashboard data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-container">
        <div className="error">
          <p>{error}</p>
          <button onClick={loadDashboard} className="retry-button">
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      {/* Header */}
      <div className="dashboard-header">
        <div className="header-content">
          <h1 className="dashboard-title">CLV Maximization - The Renewal Imperative</h1>
          <p className="dashboard-subtitle">Executive Dashboard for Customer Service Agents</p>
          <button onClick={loadDashboard} className="refresh-button" title="Refresh Data">
            🔄
          </button>
        </div>
      </div>

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
          <h2 className="section-title">Churn Monitoring $[AMP] Projections</h2>
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
    </div>
  );
}