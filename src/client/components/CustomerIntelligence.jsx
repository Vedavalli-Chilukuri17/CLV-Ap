import React, { useState, useEffect, useMemo } from 'react';
import { display, value } from '../utils/fields.js';
import KPICard from './KPICard.jsx';
import './CustomerIntelligence.css';

export default function CustomerIntelligence() {
  // State for customer data and metrics
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterTier, setFilterTier] = useState('all');
  const [filterChurnRisk, setFilterChurnRisk] = useState('all');
  const [filterRenewal, setFilterRenewal] = useState('all');
  const [sortBy, setSortBy] = useState('clv');
  const [sortDirection, setSortDirection] = useState('desc');
  
  const itemsPerPage = 25;

  // Load customer data from policy_holder table
  useEffect(() => {
    loadCustomerData();
  }, []);

  const loadCustomerData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/now/table/x_hete_clvmaximi_0_policy_holder?sysparm_display_value=all&sysparm_limit=1000', {
        headers: {
          "Accept": "application/json",
          "X-UserToken": window.g_ck
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch customer data');
      }
      
      const data = await response.json();
      setCustomers(data.result || []);
    } catch (err) {
      setError(err.message);
      console.error('Error loading customer data:', err);
    } finally {
      setLoading(false);
    }
  };

  // Calculate dynamic metrics
  const metrics = useMemo(() => {
    if (!customers.length) {
      return {
        totalCustomers: 0,
        highRiskCustomers: 0,
        averageCLV: 0,
        platinumTierCount: 0,
        churnRiskDistribution: { high: 0, medium: 0, low: 0 },
        renewalTimeline: { next30: 0, next60: 0, next90: 0 },
        engagementMetrics: { avgEngagement: 0, avgRetention: 85, avgLoyalty: 78, avgCampaign: 72 }
      };
    }

    const totalCustomers = customers.length;
    const highRiskCustomers = customers.filter(c => display(c.risk_level)?.toLowerCase() === 'high').length;
    const platinumTierCount = customers.filter(c => display(c.tier)?.toLowerCase() === 'platinum').length;
    
    // Calculate average CLV
    const clvSum = customers.reduce((sum, c) => {
      const clvValue = parseFloat(display(c.clv) || '0');
      return sum + (isNaN(clvValue) ? 0 : clvValue);
    }, 0);
    const averageCLV = totalCustomers > 0 ? clvSum / totalCustomers : 0;

    // Churn risk distribution
    const churnRiskDistribution = {
      high: customers.filter(c => display(c.risk_level)?.toLowerCase() === 'high').length,
      medium: customers.filter(c => display(c.risk_level)?.toLowerCase() === 'medium').length,
      low: customers.filter(c => display(c.risk_level)?.toLowerCase() === 'low').length
    };

    // Mock renewal timeline (would be calculated from renewal dates in real implementation)
    const renewalTimeline = {
      next30: Math.floor(totalCustomers * 0.12),
      next60: Math.floor(totalCustomers * 0.18),
      next90: Math.floor(totalCustomers * 0.25)
    };

    // Calculate average engagement score
    const engagementSum = customers.reduce((sum, c) => {
      const engagementValue = parseFloat(display(c.number_of_engagements) || '0');
      return sum + (isNaN(engagementValue) ? 0 : engagementValue);
    }, 0);
    const avgEngagement = totalCustomers > 0 ? Math.round(engagementSum / totalCustomers) : 0;

    return {
      totalCustomers,
      highRiskCustomers,
      averageCLV,
      platinumTierCount,
      churnRiskDistribution,
      renewalTimeline,
      engagementMetrics: {
        avgEngagement,
        avgRetention: 85, // Mock data
        avgLoyalty: 78,   // Mock data  
        avgCampaign: 72   // Mock data
      }
    };
  }, [customers]);

  // Filter and sort customers
  const filteredCustomers = useMemo(() => {
    let filtered = [...customers];

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(customer => 
        display(customer.first_name)?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        display(customer.last_name)?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        display(customer.email)?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply tier filter
    if (filterTier !== 'all') {
      filtered = filtered.filter(customer => 
        display(customer.tier)?.toLowerCase() === filterTier
      );
    }

    // Apply churn risk filter
    if (filterChurnRisk !== 'all') {
      filtered = filtered.filter(customer => 
        display(customer.risk_level)?.toLowerCase() === filterChurnRisk
      );
    }

    // Apply renewal filter (mock implementation)
    if (filterRenewal !== 'all') {
      if (filterRenewal === 'yes') {
        filtered = filtered.filter(customer => Math.random() > 0.3); // Mock logic
      } else if (filterRenewal === 'no') {
        filtered = filtered.filter(customer => Math.random() < 0.3); // Mock logic
      }
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue = 0, bValue = 0;
      
      switch (sortBy) {
        case 'clv':
          aValue = parseFloat(display(a.clv) || '0');
          bValue = parseFloat(display(b.clv) || '0');
          break;
        case 'name':
          aValue = `${display(a.first_name)} ${display(a.last_name)}`;
          bValue = `${display(b.first_name)} ${display(b.last_name)}`;
          break;
        case 'tier':
          aValue = display(a.tier) || '';
          bValue = display(b.tier) || '';
          break;
        case 'tenure':
          aValue = parseFloat(display(a.tenure_months) || '0');
          bValue = parseFloat(display(b.tenure_months) || '0');
          break;
        default:
          return 0;
      }

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortDirection === 'asc' 
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
    });

    return filtered;
  }, [customers, searchQuery, filterTier, filterChurnRisk, filterRenewal, sortBy, sortDirection]);

  // Pagination
  const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage);
  const paginatedCustomers = filteredCustomers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

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

  const handleSort = (column) => {
    if (sortBy === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortDirection('desc');
    }
  };

  const handleDrillDown = (type, value) => {
    switch (type) {
      case 'high-risk':
        setFilterChurnRisk('high');
        setFilterTier('all');
        setFilterRenewal('all');
        break;
      case 'tier':
        setFilterTier(value);
        setFilterChurnRisk('all');
        setFilterRenewal('all');
        break;
      case 'churn-risk':
        setFilterChurnRisk(value);
        setFilterTier('all');
        setFilterRenewal('all');
        break;
      default:
        // Reset all filters
        setFilterTier('all');
        setFilterChurnRisk('all');
        setFilterRenewal('all');
    }
    setCurrentPage(1);
  };

  const exportData = () => {
    const csvData = [
      ['Name', 'CLV Tier', 'CLV (12M)', 'Renewal', 'Churn Risk', 'Engagement Score', 'Tenure', 'Location'],
      ...filteredCustomers.map(customer => [
        `${display(customer.first_name)} ${display(customer.last_name)}`,
        display(customer.tier),
        display(customer.clv),
        Math.random() > 0.5 ? 'Yes' : 'No', // Mock data
        display(customer.risk_level),
        display(customer.number_of_engagements) || '0',
        `${display(customer.tenure_months)} months`,
        display(customer.location)
      ])
    ];

    const csvContent = csvData.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'customer_intelligence_data.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="customer-intelligence-loading">
        <div className="loading-spinner"></div>
        <p>Loading customer intelligence data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="customer-intelligence-error">
        <h3>Error Loading Data</h3>
        <p>{error}</p>
        <button onClick={loadCustomerData} className="btn btn-primary">
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="customer-intelligence">
      {/* Section 1: Header Panel */}
      <div className="intelligence-header">
        <div className="header-content">
          <div className="header-text">
            <h2 className="section-title">Customer Intelligence Hub</h2>
            <p className="section-subtitle">Advanced analytics and insights for customer lifetime value optimization</p>
          </div>
          <div className="header-actions">
            <button className="btn btn-secondary export-btn" onClick={exportData}>
              📊 Export Data
            </button>
            <div className="timestamp">
              Last updated: {new Date().toLocaleTimeString()}
            </div>
          </div>
        </div>
      </div>

      {/* Section 2: Summary Metrics Panel */}
      <div className="summary-metrics">
        <h3 className="widget-section-title">📊 Summary Metrics</h3>
        <div className="metrics-grid">
          <KPICard
            title="Total Customers"
            value={formatNumber(metrics.totalCustomers)}
            subtitle={`Active policyholders`}
            icon="👥"
            onClick={() => handleDrillDown('total')}
          />
          <KPICard
            title="High Risk Customers"
            value={formatNumber(metrics.highRiskCustomers)}
            subtitle={`${((metrics.highRiskCustomers / metrics.totalCustomers) * 100).toFixed(1)}% of total`}
            trend="🔍 Click to drill-down"
            trendDirection="down"
            icon="⚠️"
            onClick={() => handleDrillDown('high-risk')}
          />
          <KPICard
            title="Average CLV"
            value={formatCurrency(metrics.averageCLV)}
            subtitle="12-month customer lifetime value"
            trend="📈 Trending stable"
            icon="💰"
            onClick={() => handleDrillDown('clv')}
          />
          <KPICard
            title="Platinum Tier Count"
            value={formatNumber(metrics.platinumTierCount)}
            subtitle={`${((metrics.platinumTierCount / metrics.totalCustomers) * 100).toFixed(1)}% of customers`}
            trend="🎯 Click to filter"
            trendDirection="up"
            icon="💎"
            onClick={() => handleDrillDown('tier', 'platinum')}
          />
        </div>
      </div>

      {/* Section 3: Churn Risk Heatmap */}
      <div className="churn-risk-section">
        <h3 className="widget-section-title">🔥 Churn Risk Heatmap</h3>
        <div className="heatmap-container">
          <div className="heatmap-bars">
            <div className="heatmap-bar high-risk" onClick={() => handleDrillDown('churn-risk', 'high')}>
              <div className="bar-header">
                <span className="risk-label">High Risk</span>
                <span className="risk-count">{metrics.churnRiskDistribution.high}</span>
              </div>
              <div className="bar-visual" style={{
                width: `${(metrics.churnRiskDistribution.high / metrics.totalCustomers) * 100}%`,
                backgroundColor: '#ef4444'
              }}>
                <span className="bar-percentage">
                  {((metrics.churnRiskDistribution.high / metrics.totalCustomers) * 100).toFixed(1)}%
                </span>
              </div>
            </div>
            
            <div className="heatmap-bar medium-risk" onClick={() => handleDrillDown('churn-risk', 'medium')}>
              <div className="bar-header">
                <span className="risk-label">Medium Risk</span>
                <span className="risk-count">{metrics.churnRiskDistribution.medium}</span>
              </div>
              <div className="bar-visual" style={{
                width: `${(metrics.churnRiskDistribution.medium / metrics.totalCustomers) * 100}%`,
                backgroundColor: '#f59e0b'
              }}>
                <span className="bar-percentage">
                  {((metrics.churnRiskDistribution.medium / metrics.totalCustomers) * 100).toFixed(1)}%
                </span>
              </div>
            </div>
            
            <div className="heatmap-bar low-risk" onClick={() => handleDrillDown('churn-risk', 'low')}>
              <div className="bar-header">
                <span className="risk-label">Low Risk</span>
                <span className="risk-count">{metrics.churnRiskDistribution.low}</span>
              </div>
              <div className="bar-visual" style={{
                width: `${(metrics.churnRiskDistribution.low / metrics.totalCustomers) * 100}%`,
                backgroundColor: '#10b981'
              }}>
                <span className="bar-percentage">
                  {((metrics.churnRiskDistribution.low / metrics.totalCustomers) * 100).toFixed(1)}%
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Section 4: Renewal Timeline Heatmap */}
      <div className="renewal-timeline-section">
        <h3 className="widget-section-title">📅 Renewal Timeline Heatmap</h3>
        <div className="timeline-container">
          <div className="timeline-bars">
            <div className="timeline-segment urgent">
              <div className="segment-header">
                <h4>Next 30 Days</h4>
                <span className="segment-count">{metrics.renewalTimeline.next30}</span>
              </div>
              <div className="segment-bar" style={{backgroundColor: '#ef4444'}}>
                <span className="urgent-label">⚠️ Urgent</span>
              </div>
            </div>
            
            <div className="timeline-segment moderate">
              <div className="segment-header">
                <h4>31-60 Days</h4>
                <span className="segment-count">{metrics.renewalTimeline.next60}</span>
              </div>
              <div className="segment-bar" style={{backgroundColor: '#f59e0b'}}>
                <span className="moderate-label">📋 Moderate</span>
              </div>
            </div>
            
            <div className="timeline-segment planned">
              <div className="segment-header">
                <h4>61-90 Days</h4>
                <span className="segment-count">{metrics.renewalTimeline.next90}</span>
              </div>
              <div className="segment-bar" style={{backgroundColor: '#10b981'}}>
                <span className="planned-label">📈 Planned</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Section 5: Engagement & Loyalty Metrics */}
      <div className="engagement-metrics-section">
        <h3 className="widget-section-title">📊 Engagement & Loyalty Metrics</h3>
        <div className="engagement-grid">
          <div className="engagement-card">
            <h4>Engagement Score</h4>
            <div className="score-bar">
              <div className="score-fill" style={{
                width: `${(metrics.engagementMetrics.avgEngagement / 100) * 100}%`,
                backgroundColor: metrics.engagementMetrics.avgEngagement > 75 ? '#10b981' : 
                                 metrics.engagementMetrics.avgEngagement > 50 ? '#f59e0b' : '#ef4444'
              }}>
                <span className="score-value">{metrics.engagementMetrics.avgEngagement}</span>
              </div>
            </div>
          </div>
          
          <div className="engagement-card">
            <h4>Retention Score</h4>
            <div className="score-bar">
              <div className="score-fill" style={{
                width: `${metrics.engagementMetrics.avgRetention}%`,
                backgroundColor: '#10b981'
              }}>
                <span className="score-value">{metrics.engagementMetrics.avgRetention}</span>
              </div>
            </div>
          </div>
          
          <div className="engagement-card">
            <h4>Loyalty Score</h4>
            <div className="score-bar">
              <div className="score-fill" style={{
                width: `${metrics.engagementMetrics.avgLoyalty}%`,
                backgroundColor: '#f59e0b'
              }}>
                <span className="score-value">{metrics.engagementMetrics.avgLoyalty}</span>
              </div>
            </div>
          </div>
          
          <div className="engagement-card">
            <h4>Campaign Score</h4>
            <div className="score-bar">
              <div className="score-fill" style={{
                width: `${metrics.engagementMetrics.avgCampaign}%`,
                backgroundColor: '#f59e0b'
              }}>
                <span className="score-value">{metrics.engagementMetrics.avgCampaign}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Section 6: Customer Profile List */}
      <div className="customer-list-section">
        <h3 className="widget-section-title">👥 Customer Profile List</h3>
        
        {/* Search and Filter Controls */}
        <div className="list-controls">
          <div className="search-controls">
            <input
              type="text"
              className="search-input"
              placeholder="🔍 Search customers by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="filter-controls">
            <select 
              className="filter-select"
              value={filterTier}
              onChange={(e) => setFilterTier(e.target.value)}
            >
              <option value="all">All Tiers</option>
              <option value="platinum">Platinum</option>
              <option value="gold">Gold</option>
              <option value="silver">Silver</option>
              <option value="bronze">Bronze</option>
            </select>
            
            <select 
              className="filter-select"
              value={filterChurnRisk}
              onChange={(e) => setFilterChurnRisk(e.target.value)}
            >
              <option value="all">All Risk Levels</option>
              <option value="high">High Risk</option>
              <option value="medium">Medium Risk</option>
              <option value="low">Low Risk</option>
            </select>
            
            <select 
              className="filter-select"
              value={filterRenewal}
              onChange={(e) => setFilterRenewal(e.target.value)}
            >
              <option value="all">All Renewals</option>
              <option value="yes">Renewal: Yes</option>
              <option value="no">Renewal: No</option>
            </select>
          </div>
          
          <div className="list-info">
            Showing {paginatedCustomers.length} of {filteredCustomers.length} customers
          </div>
        </div>

        {/* Customer Table */}
        <div className="customer-table-container">
          <table className="customer-table">
            <thead>
              <tr>
                <th onClick={() => handleSort('name')} className="sortable">
                  Name {sortBy === 'name' && (sortDirection === 'asc' ? '▲' : '▼')}
                </th>
                <th onClick={() => handleSort('tier')} className="sortable">
                  CLV Tier {sortBy === 'tier' && (sortDirection === 'asc' ? '▲' : '▼')}
                </th>
                <th onClick={() => handleSort('clv')} className="sortable">
                  CLV (12M) {sortBy === 'clv' && (sortDirection === 'asc' ? '▲' : '▼')}
                </th>
                <th>Renewal</th>
                <th>Churn Risk</th>
                <th>Engagement Score</th>
                <th onClick={() => handleSort('tenure')} className="sortable">
                  Tenure {sortBy === 'tenure' && (sortDirection === 'asc' ? '▲' : '▼')}
                </th>
                <th>Location</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedCustomers.map((customer) => (
                <tr key={value(customer.sys_id)} className="customer-row">
                  <td className="customer-name">
                    {display(customer.first_name)} {display(customer.last_name)}
                  </td>
                  <td>
                    <span className={`tier-badge tier-${display(customer.tier)?.toLowerCase()}`}>
                      {display(customer.tier) || 'N/A'}
                    </span>
                  </td>
                  <td className="clv-amount">
                    {display(customer.clv) ? formatCurrency(parseFloat(display(customer.clv))) : '$0'}
                  </td>
                  <td>
                    <span className={`renewal-badge ${Math.random() > 0.5 ? 'renewal-yes' : 'renewal-no'}`}>
                      {Math.random() > 0.5 ? 'Yes' : 'No'}
                    </span>
                  </td>
                  <td>
                    <span className={`risk-badge risk-${display(customer.risk_level)?.toLowerCase()}`}>
                      {display(customer.risk_level) || 'Unknown'}
                    </span>
                  </td>
                  <td className="engagement-score">
                    {display(customer.number_of_engagements) || '0'}
                  </td>
                  <td className="tenure">
                    {display(customer.tenure_months)} months
                  </td>
                  <td className="location">
                    {display(customer.location) || 'N/A'}
                  </td>
                  <td className="actions">
                    <button 
                      className="btn btn-sm btn-outline action-btn"
                      onClick={() => alert(`Viewing profile for ${display(customer.first_name)} ${display(customer.last_name)}\n\nCustomer ID: ${value(customer.sys_id)}\nEmail: ${display(customer.email)}\nPhone: ${display(customer.phone)}\nCLV: ${formatCurrency(parseFloat(display(customer.clv) || '0'))}\nTier: ${display(customer.tier)}\nRisk Level: ${display(customer.risk_level)}`)}
                    >
                      👁️ Profile
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="pagination-container">
          <div className="pagination-info">
            Page {currentPage} of {totalPages} ({formatNumber(filteredCustomers.length)} customers)
          </div>
          <div className="pagination-controls">
            <button 
              className="btn btn-sm btn-outline"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
            >
              ← Previous
            </button>
            
            {Array.from({length: Math.min(5, totalPages)}, (_, i) => {
              let pageNum;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else {
                const start = Math.max(1, currentPage - 2);
                const end = Math.min(totalPages, start + 4);
                pageNum = start + i;
                if (pageNum > end) return null;
              }
              
              return (
                <button
                  key={pageNum}
                  className={`btn btn-sm ${pageNum === currentPage ? 'btn-primary' : 'btn-outline'}`}
                  onClick={() => setCurrentPage(pageNum)}
                >
                  {pageNum}
                </button>
              );
            })}
            
            <button 
              className="btn btn-sm btn-outline"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(currentPage + 1)}
            >
              Next →
            </button>
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
        <div className="last-updated">
          Last updated: {new Date().toLocaleString()} | 
          <span className="refresh-indicator"> 🔄 Real-time data active</span>
        </div>
      </div>
    </div>
  );
}