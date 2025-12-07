import React, { useState, useEffect } from 'react';
import KPICard from './KPICard.jsx';
import { display, value } from '../utils/fields.js';
import './RenewalManagement.css';

export default function RenewalManagement() {
  // State for renewal data
  const [renewalData, setRenewalData] = useState({
    highRiskCustomers: {
      count: 47,
      customers: [
        {
          id: '1',
          name: 'Nicole Martin',
          premium: 1470,
          riskScore: 840,
          creditScore: null,
          policies: [
            { type: 'Umbrella', status: 'Opportunity' },
            { type: 'Auto', status: 'Coverage' }
          ],
          actions: [
            'Umbrella is a coverage opportunity. Recommend coverage.',
            'Auto is a coverage opportunity. Recommend coverage.'
          ]
        },
        {
          id: '2',
          name: 'Sarah Williams',
          premium: 2150,
          riskScore: 875,
          creditScore: 645,
          policies: [
            { type: 'Home', status: 'Coverage' },
            { type: 'Auto', status: 'Opportunity' }
          ],
          actions: [
            'Auto is a coverage opportunity. Recommend coverage.',
            'Term Life is a coverage gap. Immediate action required.'
          ]
        }
      ]
    },
    cvrAtRisk: {
      count: 23,
      customers: [
        {
          id: '3',
          name: 'Michael Johnson',
          premium: 3600,
          riskScore: 820,
          creditScore: 720,
          policies: [
            { type: 'Umbrella', status: 'Coverage' },
            { type: 'Auto', status: 'Coverage' }
          ],
          actions: [
            'Umbrella is a coverage opportunity. Recommend coverage.',
            'Auto is a coverage opportunity. Recommend coverage.'
          ]
        },
        {
          id: '4',
          name: 'Jennifer Davis',
          premium: 4200,
          riskScore: 795,
          creditScore: 748,
          policies: [
            { type: 'Home', status: 'Coverage' },
            { type: 'Auto', status: 'Coverage' },
            { type: 'Umbrella', status: 'Opportunity' }
          ],
          actions: [
            'Premium customer with multiple policies. Retain at all costs.',
            'Umbrella upgrade available with 15% discount.'
          ]
        }
      ]
    },
    missingCoverages: {
      count: 89,
      customers: [
        {
          id: '5',
          name: 'John Smith',
          premium: 4247,
          riskScore: 660,
          creditScore: 680,
          policies: [
            { type: 'Auto', status: 'Coverage' }
          ],
          actions: [
            'Auto is a coverage opportunity. Recommend coverage.',
            'Term Life is a coverage opportunity. Recommend coverage.'
          ]
        },
        {
          id: '6',
          name: 'Maria Rodriguez',
          premium: 1850,
          riskScore: 720,
          creditScore: 692,
          policies: [
            { type: 'Home', status: 'Coverage' }
          ],
          actions: [
            'Auto coverage gap identified. High conversion opportunity.',
            'Umbrella liability recommended for property protection.'
          ]
        }
      ]
    }
  });

  // State for renewal pipeline table
  const [pipelineData, setPipelineData] = useState({
    renewals: [
      {
        id: '1',
        customerName: 'Nicole Martin',
        renewalDate: '2024-02-15',
        renewalStatus: 'High',
        opportunityScore: 78,
        renewalAmount: 1470,
        clvScore: 240000,
        tier: 'Gold',
        daysToRenewal: 12
      },
      {
        id: '2',
        customerName: 'Michael Johnson',
        renewalDate: '2024-02-18',
        renewalStatus: 'High',
        opportunityScore: 85,
        renewalAmount: 3600,
        clvScore: 450000,
        tier: 'Platinum',
        daysToRenewal: 15
      },
      {
        id: '3',
        customerName: 'John Smith',
        renewalDate: '2024-02-22',
        renewalStatus: 'Medium',
        opportunityScore: 92,
        renewalAmount: 4247,
        clvScore: 380000,
        tier: 'Platinum',
        daysToRenewal: 19
      },
      {
        id: '4',
        customerName: 'Sarah Williams',
        renewalDate: '2024-02-25',
        renewalStatus: 'High',
        opportunityScore: 67,
        renewalAmount: 2150,
        clvScore: 195000,
        tier: 'Gold',
        daysToRenewal: 22
      },
      {
        id: '5',
        customerName: 'Jennifer Davis',
        renewalDate: '2024-02-28',
        renewalStatus: 'Low',
        opportunityScore: 94,
        renewalAmount: 4200,
        clvScore: 520000,
        tier: 'Platinum',
        daysToRenewal: 25
      },
      {
        id: '6',
        customerName: 'Maria Rodriguez',
        renewalDate: '2024-03-05',
        renewalStatus: 'Medium',
        opportunityScore: 73,
        renewalAmount: 1850,
        clvScore: 165000,
        tier: 'Silver',
        daysToRenewal: 30
      },
      {
        id: '7',
        customerName: 'David Chen',
        renewalDate: '2024-03-08',
        renewalStatus: 'Low',
        opportunityScore: 88,
        renewalAmount: 2890,
        clvScore: 295000,
        tier: 'Gold',
        daysToRenewal: 33
      },
      {
        id: '8',
        customerName: 'Lisa Anderson',
        renewalDate: '2024-03-12',
        renewalStatus: 'Medium',
        opportunityScore: 81,
        renewalAmount: 3250,
        clvScore: 410000,
        tier: 'Platinum',
        daysToRenewal: 37
      }
    ]
  });

  // State for next best actions
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [actionRecommendations, setActionRecommendations] = useState({
    customerScript: '',
    churnMitigation: [],
    crossSellSuggestions: [],
    outreachChannels: [],
    recommendedChannel: ''
  });

  // Filter and search states
  const [filters, setFilters] = useState({
    tier: 'all',
    status: 'all',
    timeframe: 'all'
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Generate action recommendations for selected customer
  const generateActionRecommendations = (customer) => {
    const recommendations = {
      customerScript: `Hi ${customer.customerName}, we value your loyalty and want to offer you a ${customer.tier === 'Platinum' ? '15' : customer.tier === 'Gold' ? '10' : '8'}% renewal discount on your ${customer.renewalAmount > 3000 ? 'comprehensive' : 'standard'} policy. Your renewal date of ${new Date(customer.renewalDate).toLocaleDateString()} is approaching, and we'd love to discuss your coverage needs.`,
      
      churnMitigation: [
        'Re-engage with value-based messaging highlighting policy benefits',
        'Emphasize claims support and customer service excellence',
        `Offer ${customer.tier === 'Platinum' ? 'premium' : 'standard'} loyalty perks and incentives`,
        'Highlight competitive advantages and market positioning'
      ],
      
      crossSellSuggestions: [
        { product: 'Term Life Insurance', priority: 'High', revenue: '$450/year' },
        { product: 'Jewelry & Collectibles', priority: 'Medium', revenue: '$280/year' },
        { product: 'Pet Insurance', priority: 'Medium', revenue: '$320/year' },
        { product: 'Umbrella Liability', priority: 'High', revenue: '$180/year' }
      ],
      
      outreachChannels: [
        { channel: 'Email Campaign', priority: 'High', effectiveness: '85%' },
        { channel: 'Contact Center', priority: 'High', effectiveness: '92%' },
        { channel: 'SMS Campaign', priority: 'Medium', effectiveness: '73%' },
        { channel: 'In-App Notification', priority: 'Low', effectiveness: '64%' }
      ],
      
      recommendedChannel: customer.renewalStatus === 'High' ? 'Contact Center' : 'Email Campaign'
    };
    
    setActionRecommendations(recommendations);
  };

  // Handle customer selection from any section
  const selectCustomer = (customerData) => {
    setSelectedCustomer(customerData);
    generateActionRecommendations(customerData);
  };

  // Filter and search pipeline data
  const getFilteredRenewals = () => {
    let filtered = [...pipelineData.renewals];
    
    // Apply tier filter
    if (filters.tier !== 'all') {
      filtered = filtered.filter(renewal => renewal.tier.toLowerCase() === filters.tier);
    }
    
    // Apply status filter
    if (filters.status !== 'all') {
      filtered = filtered.filter(renewal => renewal.renewalStatus.toLowerCase() === filters.status);
    }
    
    // Apply timeframe filter
    if (filters.timeframe !== 'all') {
      const timeframeDays = {
        '30': 30,
        '60': 60,
        '90': 90
      };
      if (timeframeDays[filters.timeframe]) {
        filtered = filtered.filter(renewal => renewal.daysToRenewal <= timeframeDays[filters.timeframe]);
      }
    }
    
    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(renewal => 
        renewal.customerName.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    return filtered;
  };

  // Pagination
  const getPaginatedRenewals = () => {
    const filtered = getFilteredRenewals();
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filtered.slice(startIndex, startIndex + itemsPerPage);
  };

  const getTotalPages = () => {
    return Math.ceil(getFilteredRenewals().length / itemsPerPage);
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(amount);
  };

  // Execute actions
  const executeScript = () => {
    if (!selectedCustomer) {
      alert('Please select a customer first to generate personalized script.');
      return;
    }
    
    alert(`Executing personalized script for ${selectedCustomer.customerName}:\n\n${actionRecommendations.customerScript}\n\nScript will be delivered via ${actionRecommendations.recommendedChannel}.`);
  };

  const reviewCustomer = () => {
    if (!selectedCustomer) {
      alert('Please select a customer to review.');
      return;
    }
    
    alert(`Opening detailed customer review for:\n\n${selectedCustomer.customerName}\nRenewal Amount: ${formatCurrency(selectedCustomer.renewalAmount)}\nRisk Level: ${selectedCustomer.renewalStatus}\nCLV Score: ${formatCurrency(selectedCustomer.clvScore)}\n\nFull customer profile and history will be displayed.`);
  };

  const scheduleFollowUp = () => {
    if (!selectedCustomer) {
      alert('Please select a customer to schedule follow-up.');
      return;
    }
    
    alert(`Scheduling follow-up for ${selectedCustomer.customerName}:\n\nRecommended Follow-up: 3-5 days\nChannel: ${actionRecommendations.recommendedChannel}\nPriority: ${selectedCustomer.renewalStatus}\n\nTask will be created in ServiceNow with automated reminders.`);
  };

  const sendReminder = (customer) => {
    alert(`Sending renewal reminder to ${customer.customerName}:\n\nChannel: Email + SMS\nContent: Personalized renewal notice\nScheduled: Immediate delivery\n\nReminder logged in customer engagement history.`);
  };

  const launchCampaign = (customer) => {
    alert(`Launching targeted campaign for ${customer.customerName}:\n\nCampaign Type: Retention + Cross-sell\nChannel: Multi-channel (Email, SMS, Call)\nDuration: 14-day sequence\nBudget: Tier-based allocation\n\nCampaign execution logged for tracking.`);
  };

  const viewProfile = (customer) => {
    selectCustomer(customer);
    alert(`Loading complete customer profile for ${customer.customerName}:\n\n• Policy History & Claims\n• Payment History & Credit Score\n• Engagement Timeline\n• Risk Assessment Details\n• Coverage Recommendations\n\nProfile data loaded from Policy_Records and Customer_Profiles tables.`);
  };

  const exportData = () => {
    const csvData = getFilteredRenewals().map(renewal => ({
      'Customer Name': renewal.customerName,
      'Renewal Date': renewal.renewalDate,
      'Status': renewal.renewalStatus,
      'Opportunity Score': renewal.opportunityScore,
      'Renewal Amount': renewal.renewalAmount,
      'CLV Score': renewal.clvScore,
      'Tier': renewal.tier,
      'Days to Renewal': renewal.daysToRenewal
    }));
    
    alert(`Exporting ${csvData.length} renewal records to CSV:\n\nFile: renewal_pipeline_${new Date().toISOString().split('T')[0]}.csv\nRecords: ${csvData.length}\nColumns: 8\n\nDownload will begin shortly.`);
  };

  return (
    <div className="renewal-management">
      {/* Header */}
      <div className="renewal-header">
        <div className="header-content">
          <h2 className="renewal-title">🔄 Renewal Review & Next Best Action</h2>
          <p className="renewal-subtitle">
            Monitor renewal readiness, detect coverage gaps, assess risk scores, and execute next-best-action campaigns
          </p>
          <div className="header-actions">
            <button className="btn btn-outline" onClick={exportData}>
              📤 Export Data
            </button>
            <div className="workspace-timestamp">
              Last updated: {new Date().toLocaleTimeString()}
            </div>
          </div>
        </div>
      </div>

      {/* Section 1: Renewal Snapshot Summary */}
      <div className="renewal-snapshot">
        <h3 className="section-title">📊 Renewal Snapshot Summary</h3>
        
        <div className="snapshot-panels">
          {/* High-Risk Customers Panel */}
          <div className="snapshot-panel high-risk-panel">
            <div className="panel-header">
              <h4 className="panel-title">⚠️ High-Risk Customers</h4>
              <div className="panel-count">{renewalData.highRiskCustomers.count}</div>
            </div>
            <div className="panel-content">
              {renewalData.highRiskCustomers.customers.slice(0, 2).map((customer) => (
                <div key={customer.id} className="customer-card" onClick={() => selectCustomer({
                  customerName: customer.name,
                  renewalAmount: customer.premium,
                  renewalStatus: 'High',
                  clvScore: customer.premium * 150,
                  tier: customer.premium > 3000 ? 'Platinum' : customer.premium > 2000 ? 'Gold' : 'Silver',
                  renewalDate: '2024-02-15'
                })}>
                  <div className="customer-header">
                    <div className="customer-name">{customer.name}</div>
                    <div className="customer-premium">{formatCurrency(customer.premium)}</div>
                  </div>
                  <div className="customer-details">
                    <div className="detail-row">
                      <span className="detail-label">Risk Score:</span>
                      <span className="risk-score high-risk">{customer.riskScore}</span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">Credit Score:</span>
                      <span className="credit-score">{customer.creditScore || 'N/A'}</span>
                    </div>
                  </div>
                  <div className="customer-policies">
                    {customer.policies.map((policy, index) => (
                      <span key={index} className={`policy-badge ${policy.status.toLowerCase()}`}>
                        {policy.type} ({policy.status})
                      </span>
                    ))}
                  </div>
                  <div className="customer-actions">
                    {customer.actions.map((action, index) => (
                      <div key={index} className="action-item">• {action}</div>
                    ))}
                  </div>
                </div>
              ))}
              <div className="panel-footer">
                <button className="btn btn-sm btn-outline">View All High-Risk</button>
              </div>
            </div>
          </div>

          {/* Total CVR at Risk Panel */}
          <div className="snapshot-panel cvr-risk-panel">
            <div className="panel-header">
              <h4 className="panel-title">💰 Total CVR at Risk</h4>
              <div className="panel-count">{renewalData.cvrAtRisk.count}</div>
            </div>
            <div className="panel-content">
              {renewalData.cvrAtRisk.customers.slice(0, 2).map((customer) => (
                <div key={customer.id} className="customer-card" onClick={() => selectCustomer({
                  customerName: customer.name,
                  renewalAmount: customer.premium,
                  renewalStatus: 'High',
                  clvScore: customer.premium * 140,
                  tier: customer.premium > 3000 ? 'Platinum' : customer.premium > 2000 ? 'Gold' : 'Silver',
                  renewalDate: '2024-02-18'
                })}>
                  <div className="customer-header">
                    <div className="customer-name">{customer.name}</div>
                    <div className="customer-premium">{formatCurrency(customer.premium)}</div>
                  </div>
                  <div className="customer-details">
                    <div className="detail-row">
                      <span className="detail-label">Risk Score:</span>
                      <span className="risk-score medium-risk">{customer.riskScore}</span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">Credit Score:</span>
                      <span className="credit-score">{customer.creditScore}</span>
                    </div>
                  </div>
                  <div className="customer-policies">
                    {customer.policies.map((policy, index) => (
                      <span key={index} className={`policy-badge ${policy.status.toLowerCase()}`}>
                        {policy.type} ({policy.status})
                      </span>
                    ))}
                  </div>
                  <div className="customer-actions">
                    {customer.actions.map((action, index) => (
                      <div key={index} className="action-item">• {action}</div>
                    ))}
                  </div>
                </div>
              ))}
              <div className="panel-footer">
                <button className="btn btn-sm btn-outline">View All CVR Risk</button>
              </div>
            </div>
          </div>

          {/* Missing Coverages Panel */}
          <div className="snapshot-panel missing-coverage-panel">
            <div className="panel-header">
              <h4 className="panel-title">🔍 Missing Coverages</h4>
              <div className="panel-count">{renewalData.missingCoverages.count}</div>
            </div>
            <div className="panel-content">
              {renewalData.missingCoverages.customers.slice(0, 2).map((customer) => (
                <div key={customer.id} className="customer-card" onClick={() => selectCustomer({
                  customerName: customer.name,
                  renewalAmount: customer.premium,
                  renewalStatus: 'Medium',
                  clvScore: customer.premium * 120,
                  tier: customer.premium > 3000 ? 'Platinum' : customer.premium > 2000 ? 'Gold' : 'Silver',
                  renewalDate: '2024-02-22'
                })}>
                  <div className="customer-header">
                    <div className="customer-name">{customer.name}</div>
                    <div className="customer-premium">{formatCurrency(customer.premium)}</div>
                  </div>
                  <div className="customer-details">
                    <div className="detail-row">
                      <span className="detail-label">Risk Score:</span>
                      <span className="risk-score low-risk">{customer.riskScore}</span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">Credit Score:</span>
                      <span className="credit-score">{customer.creditScore}</span>
                    </div>
                  </div>
                  <div className="customer-policies">
                    {customer.policies.map((policy, index) => (
                      <span key={index} className={`policy-badge ${policy.status.toLowerCase()}`}>
                        {policy.type} ({policy.status})
                      </span>
                    ))}
                  </div>
                  <div className="customer-actions">
                    {customer.actions.map((action, index) => (
                      <div key={index} className="action-item">• {action}</div>
                    ))}
                  </div>
                </div>
              ))}
              <div className="panel-footer">
                <button className="btn btn-sm btn-outline">View All Coverage Gaps</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Section 2: Renewal Pipeline Table */}
      <div className="renewal-pipeline">
        <h3 className="section-title">📋 Renewal Pipeline Table</h3>
        
        <div className="pipeline-controls">
          <div className="controls-left">
            <input
              type="text"
              className="search-input"
              placeholder="🔍 Search customers..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
            />
            
            <select
              className="filter-select"
              value={filters.tier}
              onChange={(e) => {
                setFilters(prev => ({ ...prev, tier: e.target.value }));
                setCurrentPage(1);
              }}
            >
              <option value="all">All Tiers</option>
              <option value="platinum">Platinum</option>
              <option value="gold">Gold</option>
              <option value="silver">Silver</option>
              <option value="bronze">Bronze</option>
            </select>
            
            <select
              className="filter-select"
              value={filters.status}
              onChange={(e) => {
                setFilters(prev => ({ ...prev, status: e.target.value }));
                setCurrentPage(1);
              }}
            >
              <option value="all">All Status</option>
              <option value="high">High Risk</option>
              <option value="medium">Medium Risk</option>
              <option value="low">Low Risk</option>
            </select>
            
            <select
              className="filter-select"
              value={filters.timeframe}
              onChange={(e) => {
                setFilters(prev => ({ ...prev, timeframe: e.target.value }));
                setCurrentPage(1);
              }}
            >
              <option value="all">All Timeframes</option>
              <option value="30">Next 30 Days</option>
              <option value="60">Next 60 Days</option>
              <option value="90">Next 90 Days</option>
            </select>
          </div>
          
          <div className="controls-right">
            <button className="btn btn-outline" onClick={exportData}>
              📤 Export
            </button>
            <div className="table-info">
              Showing {getPaginatedRenewals().length} of {getFilteredRenewals().length} renewals
            </div>
          </div>
        </div>

        <div className="pipeline-table-container">
          <table className="pipeline-table">
            <thead>
              <tr>
                <th>👤 Customer Name</th>
                <th>📅 Renewal Date</th>
                <th>⚠️ Renewal Status</th>
                <th>🎯 Opportunity Score</th>
                <th>💰 Renewal Amount</th>
                <th>📊 CLV Score</th>
                <th>🏆 Tier</th>
                <th>⚙️ Actions</th>
              </tr>
            </thead>
            <tbody>
              {getPaginatedRenewals().map((renewal) => (
                <tr key={renewal.id} className="pipeline-row">
                  <td className="customer-name-cell">
                    <div className="customer-info">
                      <div className="customer-name-text">{renewal.customerName}</div>
                      <div className="days-to-renewal">{renewal.daysToRenewal} days</div>
                    </div>
                  </td>
                  <td>{new Date(renewal.renewalDate).toLocaleDateString()}</td>
                  <td>
                    <span className={`status-badge status-${renewal.renewalStatus.toLowerCase()}`}>
                      {renewal.renewalStatus === 'High' ? '🔴' : renewal.renewalStatus === 'Medium' ? '🟡' : '🟢'} 
                      {renewal.renewalStatus}
                    </span>
                  </td>
                  <td>
                    <div className="opportunity-score">
                      <div className="score-number">{renewal.opportunityScore}</div>
                      <div className="score-bar">
                        <div 
                          className="score-fill" 
                          style={{ width: `${renewal.opportunityScore}%` }}
                        ></div>
                      </div>
                    </div>
                  </td>
                  <td className="amount-cell">{formatCurrency(renewal.renewalAmount)}</td>
                  <td className="clv-cell">{formatCurrency(renewal.clvScore)}</td>
                  <td>
                    <span className={`tier-badge tier-${renewal.tier.toLowerCase()}`}>
                      {renewal.tier === 'Platinum' ? '💎' : 
                       renewal.tier === 'Gold' ? '🥇' : 
                       renewal.tier === 'Silver' ? '🥈' : '🥉'} 
                      {renewal.tier}
                    </span>
                  </td>
                  <td className="actions-cell">
                    <div className="action-buttons">
                      <button 
                        className="btn btn-sm btn-outline"
                        onClick={() => viewProfile(renewal)}
                        title="View Profile"
                      >
                        👁️
                      </button>
                      <button 
                        className="btn btn-sm btn-outline"
                        onClick={() => sendReminder(renewal)}
                        title="Send Reminder"
                      >
                        📧
                      </button>
                      <button 
                        className="btn btn-sm btn-primary"
                        onClick={() => launchCampaign(renewal)}
                        title="Launch Campaign"
                      >
                        🚀
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
            Page {currentPage} of {getTotalPages()}
          </div>
          <div className="pagination-controls">
            <button 
              className="btn btn-sm btn-outline"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
            >
              ← Previous
            </button>
            {Array.from({length: getTotalPages()}, (_, i) => i + 1).slice(
              Math.max(0, currentPage - 3), 
              Math.min(getTotalPages(), currentPage + 2)
            ).map(pageNum => (
              <button
                key={pageNum}
                className={`btn btn-sm ${pageNum === currentPage ? 'btn-primary' : 'btn-outline'}`}
                onClick={() => setCurrentPage(pageNum)}
              >
                {pageNum}
              </button>
            ))}
            <button 
              className="btn btn-sm btn-outline"
              disabled={currentPage === getTotalPages()}
              onClick={() => setCurrentPage(currentPage + 1)}
            >
              Next →
            </button>
          </div>
        </div>
      </div>

      {/* Section 3: Next Best Action Panel */}
      <div className="next-best-action">
        <h3 className="section-title">🎯 Next Best Action Panel</h3>
        
        {!selectedCustomer ? (
          <div className="no-selection">
            <div className="no-selection-icon">🎯</div>
            <p>Select a customer from the panels above to view personalized recommendations and next best actions.</p>
          </div>
        ) : (
          <div className="action-recommendations">
            <div className="selected-customer">
              <h4 className="customer-title">Selected Customer: {selectedCustomer.customerName}</h4>
              <div className="customer-summary">
                <span className="summary-item">Amount: {formatCurrency(selectedCustomer.renewalAmount)}</span>
                <span className="summary-item">Status: {selectedCustomer.renewalStatus}</span>
                <span className="summary-item">CLV: {formatCurrency(selectedCustomer.clvScore)}</span>
                <span className="summary-item">Tier: {selectedCustomer.tier}</span>
              </div>
            </div>

            <div className="recommendation-sections">
              {/* Customer-Specific Campaign Script */}
              <div className="recommendation-card script-card">
                <h5 className="card-title">💬 Customer-Specific Campaign Script</h5>
                <div className="script-content">
                  <textarea 
                    className="script-textarea"
                    value={actionRecommendations.customerScript}
                    onChange={(e) => setActionRecommendations(prev => ({
                      ...prev,
                      customerScript: e.target.value
                    }))}
                    rows={4}
                  />
                  <div className="dynamic-fields">
                    <span className="field-tag">{'{CustomerName}'}</span>
                    <span className="field-tag">{'{ProductName}'}</span>
                    <span className="field-tag">{'{RenewalDate}'}</span>
                    <span className="field-tag">{'{DiscountOffer}'}</span>
                  </div>
                </div>
              </div>

              {/* Churn Mitigation Actions */}
              <div className="recommendation-card mitigation-card">
                <h5 className="card-title">🛡️ Churn Mitigation Actions</h5>
                <div className="mitigation-list">
                  {actionRecommendations.churnMitigation.map((action, index) => (
                    <div key={index} className="mitigation-item">
                      <span className="item-icon">•</span>
                      <span className="item-text">{action}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Cross-Sell / Up-Sell Suggestions */}
              <div className="recommendation-card crosssell-card">
                <h5 className="card-title">🚀 Cross-Sell / Up-Sell Suggestions</h5>
                <div className="crosssell-list">
                  {actionRecommendations.crossSellSuggestions.map((suggestion, index) => (
                    <div key={index} className="crosssell-item">
                      <div className="suggestion-header">
                        <span className="product-name">{suggestion.product}</span>
                        <span className={`priority-badge priority-${suggestion.priority.toLowerCase()}`}>
                          {suggestion.priority}
                        </span>
                      </div>
                      <div className="suggestion-revenue">{suggestion.revenue}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Outreach Channels */}
              <div className="recommendation-card channels-card">
                <h5 className="card-title">📢 Outreach Channels</h5>
                <div className="channels-list">
                  {actionRecommendations.outreachChannels.map((channel, index) => (
                    <div key={index} className="channel-item">
                      <div className="channel-info">
                        <span className="channel-name">{channel.channel}</span>
                        <span className={`channel-priority priority-${channel.priority.toLowerCase()}`}>
                          {channel.priority}
                        </span>
                      </div>
                      <div className="channel-effectiveness">{channel.effectiveness}</div>
                    </div>
                  ))}
                </div>
                <div className="recommended-channel">
                  <strong>Recommended: </strong>
                  <span className="recommended-channel-name">{actionRecommendations.recommendedChannel}</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="action-buttons-section">
              <button className="btn btn-primary action-btn" onClick={executeScript}>
                🚀 Execute Script
              </button>
              <button className="btn btn-secondary action-btn" onClick={reviewCustomer}>
                📋 Review
              </button>
              <button className="btn btn-outline action-btn" onClick={scheduleFollowUp}>
                📅 Schedule Follow-Up
              </button>
            </div>
          </div>
        )}
      </div>

      {/* User Identity Display */}
      <div className="user-identity">
        <div className="user-avatar">ET</div>
        <div className="user-details">
          <div className="user-name">Emma Thompson</div>
          <div className="user-role">Senior Marketing Analyst</div>
        </div>
        <div className="last-updated">
          Last updated: {new Date().toLocaleString()} | 
          <span className="refresh-indicator"> 🔄 Real-time updates active</span>
        </div>
      </div>
    </div>
  );
}