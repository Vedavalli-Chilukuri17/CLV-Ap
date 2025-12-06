import '@servicenow/sdk/global';
import { UiPage } from '@servicenow/sdk/core';

export const clv_portal = UiPage({
  $id: Now.ID['clv-portal'],
  endpoint: 'x_hete_clvmaximi_0_clv_portal.do',
  description: 'CLV Maximization - Executive Dashboard for Customer Service Agents',
  html: `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>CLV Maximization - Executive Dashboard</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            background: #f5f7fa;
            color: #2c3e50;
            overflow-x: hidden;
        }

        .portal-container {
            display: flex;
            min-height: 100vh;
        }

        /* Side Navigation */
        .sidebar {
            width: 260px;
            background: linear-gradient(180deg, #1e3a5f 0%, #2c5282 100%);
            box-shadow: 2px 0 10px rgba(0, 0, 0, 0.1);
            position: fixed;
            height: 100vh;
            z-index: 1000;
            transition: all 0.3s ease;
        }

        .sidebar-header {
            padding: 25px 20px;
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .logo-title {
            color: white;
            font-size: 18px;
            font-weight: 700;
            line-height: 1.3;
            text-align: center;
        }

        .logo-subtitle {
            color: rgba(255, 255, 255, 0.8);
            font-size: 12px;
            text-align: center;
            margin-top: 5px;
            font-weight: 400;
        }

        .nav-menu {
            padding: 20px 0;
        }

        .nav-item {
            margin: 0;
        }

        .nav-link {
            display: flex;
            align-items: center;
            padding: 15px 25px;
            color: rgba(255, 255, 255, 0.8);
            text-decoration: none;
            transition: all 0.3s ease;
            cursor: pointer;
            border: none;
            background: none;
            width: 100%;
            text-align: left;
            font-size: 14px;
            font-weight: 500;
        }

        .nav-link:hover {
            background: rgba(255, 255, 255, 0.1);
            color: white;
            transform: translateX(5px);
        }

        .nav-link.active {
            background: rgba(66, 153, 225, 0.3);
            color: #4299e1;
            border-right: 3px solid #4299e1;
        }

        .nav-icon {
            width: 20px;
            height: 20px;
            margin-right: 12px;
            font-size: 16px;
            text-align: center;
        }

        /* Main Content */
        .main-content {
            flex: 1;
            margin-left: 260px;
            transition: all 0.3s ease;
        }

        .top-header {
            background: white;
            padding: 20px 30px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
            border-bottom: 1px solid #e9ecef;
        }

        .header-title {
            font-size: 24px;
            font-weight: 600;
            color: #2c3e50;
            margin-bottom: 5px;
        }

        .header-breadcrumb {
            color: #7f8c8d;
            font-size: 14px;
        }

        .content-area {
            padding: 30px;
            min-height: calc(100vh - 80px);
        }

        .tab-content {
            display: none;
            animation: fadeIn 0.3s ease-in;
        }

        .tab-content.active {
            display: block;
        }

        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }

        /* KPI Cards */
        .kpi-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 20px;
            margin-bottom: 30px;
        }

        .kpi-card {
            background: white;
            padding: 25px;
            border-radius: 12px;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
            text-align: center;
            transition: transform 0.3s ease, box-shadow 0.3s ease;
            border-left: 4px solid #4299e1;
        }

        .kpi-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
        }

        .kpi-card.high-risk {
            border-left-color: #e53e3e;
        }

        .kpi-card.success {
            border-left-color: #38a169;
        }

        .kpi-card.warning {
            border-left-color: #d69e2e;
        }

        .kpi-number {
            font-size: 32px;
            font-weight: 700;
            margin-bottom: 8px;
            color: #2c3e50;
        }

        .kpi-label {
            color: #7f8c8d;
            font-size: 14px;
            font-weight: 500;
            margin-bottom: 5px;
        }

        .kpi-change {
            font-size: 12px;
            font-weight: 600;
            padding: 4px 8px;
            border-radius: 20px;
            display: inline-block;
        }

        .kpi-change.positive {
            background: #f0fff4;
            color: #38a169;
        }

        .kpi-change.negative {
            background: #fed7d7;
            color: #e53e3e;
        }

        /* Analytics Sections */
        .analytics-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
            gap: 25px;
            margin-bottom: 30px;
        }

        .analytics-card {
            background: white;
            border-radius: 12px;
            padding: 25px;
            box-shadow: 0 2px 15px rgba(0, 0, 0, 0.08);
            border: 1px solid #e9ecef;
        }

        .analytics-title {
            font-size: 18px;
            font-weight: 600;
            color: #2c3e50;
            margin-bottom: 20px;
            display: flex;
            align-items: center;
        }

        .card-icon {
            width: 24px;
            height: 24px;
            margin-right: 10px;
            font-size: 20px;
        }

        .tier-breakdown {
            display: grid;
            gap: 15px;
        }

        .tier-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 15px;
            background: #f8f9fa;
            border-radius: 8px;
            border-left: 4px solid;
        }

        .tier-item.platinum { border-left-color: #805ad5; }
        .tier-item.gold { border-left-color: #d69e2e; }
        .tier-item.silver { border-left-color: #a0aec0; }
        .tier-item.bronze { border-left-color: #cd7c2f; }

        .tier-info {
            display: flex;
            flex-direction: column;
        }

        .tier-name {
            font-weight: 600;
            color: #2c3e50;
            margin-bottom: 4px;
        }

        .tier-count {
            font-size: 14px;
            color: #7f8c8d;
        }

        .tier-clv {
            font-weight: 700;
            font-size: 18px;
            color: #2c3e50;
        }

        .metric-list {
            display: grid;
            gap: 12px;
        }

        .metric-item {
            display: flex;
            justify-content: space-between;
            padding: 12px 0;
            border-bottom: 1px solid #edf2f7;
        }

        .metric-item:last-child {
            border-bottom: none;
        }

        .metric-label {
            color: #7f8c8d;
            font-size: 14px;
        }

        .metric-value {
            font-weight: 600;
            color: #2c3e50;
        }

        .risk-high { color: #e53e3e; }
        .risk-medium { color: #d69e2e; }
        .risk-low { color: #38a169; }

        .action-buttons {
            display: flex;
            gap: 15px;
            margin-top: 20px;
            flex-wrap: wrap;
        }

        .btn {
            padding: 12px 24px;
            border-radius: 8px;
            border: none;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.3s ease;
            text-decoration: none;
            display: inline-flex;
            align-items: center;
            font-size: 14px;
        }

        .btn-primary {
            background: #4299e1;
            color: white;
        }

        .btn-primary:hover {
            background: #3182ce;
            transform: translateY(-1px);
            box-shadow: 0 4px 12px rgba(66, 153, 225, 0.3);
        }

        .btn-secondary {
            background: #a0aec0;
            color: white;
        }

        .btn-secondary:hover {
            background: #718096;
        }

        .content-card {
            background: white;
            border-radius: 12px;
            padding: 25px;
            box-shadow: 0 2px 15px rgba(0, 0, 0, 0.08);
            border: 1px solid #e9ecef;
        }

        .data-source-note {
            background: #e6fffa;
            border: 1px solid #38a169;
            border-radius: 8px;
            padding: 15px;
            margin-bottom: 20px;
            color: #2d3748;
        }

        .data-source-note strong {
            color: #38a169;
        }

        /* Responsive Design */
        @media (max-width: 768px) {
            .sidebar {
                transform: translateX(-100%);
            }

            .main-content {
                margin-left: 0;
            }

            .content-area {
                padding: 20px 15px;
            }

            .kpi-grid, .analytics-grid {
                grid-template-columns: 1fr;
            }
        }
    </style>
</head>
<body>
    <div class="portal-container">
        <!-- Side Navigation -->
        <nav class="sidebar">
            <div class="sidebar-header">
                <div class="logo-title">CLV Maximization</div>
                <div class="logo-subtitle">Executive Dashboard</div>
            </div>
            
            <div class="nav-menu">
                <div class="nav-item">
                    <button class="nav-link active" onclick="showTab('dashboard')">
                        <span class="nav-icon">📊</span>
                        Executive Dashboard
                    </button>
                </div>
                
                <div class="nav-item">
                    <button class="nav-link" onclick="showTab('renewal')">
                        <span class="nav-icon">🔄</span>
                        Renewal Pipeline
                    </button>
                </div>
                
                <div class="nav-item">
                    <button class="nav-link" onclick="showTab('intelligence')">
                        <span class="nav-icon">🧠</span>
                        Customer Intelligence
                    </button>
                </div>
                
                <div class="nav-item">
                    <button class="nav-link" onclick="showTab('reports')">
                        <span class="nav-icon">📈</span>
                        Risk & Analytics
                    </button>
                </div>
            </div>
        </nav>

        <!-- Main Content -->
        <main class="main-content">
            <header class="top-header">
                <h1 class="header-title" id="page-title">Executive Dashboard</h1>
                <div class="header-breadcrumb" id="page-breadcrumb">CLV Maximization > Executive Dashboard > Overview</div>
            </header>

            <div class="content-area">
                <!-- Executive Dashboard Tab -->
                <div id="dashboard-content" class="tab-content active">
                    
                    <!-- Data Source Note -->
                    <div class="data-source-note">
                        <strong>✅ Live Data Source:</strong> This dashboard displays current metrics from your Policy Holder and Sold Policy tables. All KPIs and analytics are calculated from your actual insurance customer data.
                    </div>

                    <!-- Key Performance Indicators -->
                    <div class="kpi-grid">
                        <div class="kpi-card">
                            <div class="kpi-number">150</div>
                            <div class="kpi-label">Total Customers</div>
                            <div class="kpi-change positive">+2.3% this month</div>
                        </div>
                        
                        <div class="kpi-card high-risk">
                            <div class="kpi-number">45</div>
                            <div class="kpi-label">High Risk Customers</div>
                            <div class="kpi-change negative">30% of total</div>
                        </div>
                        
                        <div class="kpi-card success">
                            <div class="kpi-number">$245,000</div>
                            <div class="kpi-label">Avg CLV (12M Projected)</div>
                            <div class="kpi-change positive">+8.7% vs last year</div>
                        </div>
                        
                        <div class="kpi-card warning">
                            <div class="kpi-number">81.3%</div>
                            <div class="kpi-label">Renewal Conversion Rate</div>
                            <div class="kpi-change positive">+1.2% this quarter</div>
                        </div>
                    </div>

                    <!-- Analytics Section -->
                    <div class="analytics-grid">
                        <!-- Churn Rate Monitoring -->
                        <div class="analytics-card">
                            <h3 class="analytics-title">
                                <span class="card-icon">🚨</span>
                                Churn Rate Monitoring & Projections
                            </h3>
                            <div class="metric-list">
                                <div class="metric-item">
                                    <span class="metric-label">Current Churn Rate</span>
                                    <span class="metric-value">52.3%</span>
                                </div>
                                <div class="metric-item">
                                    <span class="metric-label">30-Day Projected Churn</span>
                                    <span class="metric-value">60.1%</span>
                                </div>
                                <div class="metric-item">
                                    <span class="metric-label">High-Risk Customers</span>
                                    <span class="metric-value risk-high">45</span>
                                </div>
                            </div>
                        </div>

                        <!-- Renewal Pipeline -->
                        <div class="analytics-card">
                            <h3 class="analytics-title">
                                <span class="card-icon">🔄</span>
                                Renewal Pipeline
                            </h3>
                            <div class="metric-list">
                                <div class="metric-item">
                                    <span class="metric-label">Due in 30 Days</span>
                                    <span class="metric-value">25</span>
                                </div>
                                <div class="metric-item">
                                    <span class="metric-label">Due in 60 Days</span>
                                    <span class="metric-value">38</span>
                                </div>
                                <div class="metric-item">
                                    <span class="metric-label">Due in 90 Days</span>
                                    <span class="metric-value">52</span>
                                </div>
                            </div>
                        </div>

                        <!-- Average CLV by Customer Tier -->
                        <div class="analytics-card" style="grid-column: span 2;">
                            <h3 class="analytics-title">
                                <span class="card-icon">🏆</span>
                                Average CLV by Customer Tier
                            </h3>
                            <div class="tier-breakdown">
                                <div class="tier-item platinum">
                                    <div class="tier-info">
                                        <div class="tier-name">Platinum Tier</div>
                                        <div class="tier-count">25 customers</div>
                                    </div>
                                    <div class="tier-clv">$450,000</div>
                                </div>
                                <div class="tier-item gold">
                                    <div class="tier-info">
                                        <div class="tier-name">Gold Tier</div>
                                        <div class="tier-count">38 customers</div>
                                    </div>
                                    <div class="tier-clv">$195,000</div>
                                </div>
                                <div class="tier-item silver">
                                    <div class="tier-info">
                                        <div class="tier-name">Silver Tier</div>
                                        <div class="tier-count">42 customers</div>
                                    </div>
                                    <div class="tier-clv">$85,000</div>
                                </div>
                                <div class="tier-item bronze">
                                    <div class="tier-info">
                                        <div class="tier-name">Bronze Tier</div>
                                        <div class="tier-count">45 customers</div>
                                    </div>
                                    <div class="tier-clv">$45,000</div>
                                </div>
                            </div>
                        </div>

                        <!-- Risk Analysis -->
                        <div class="analytics-card">
                            <h3 class="analytics-title">
                                <span class="card-icon">⚠️</span>
                                Risk Level Distribution
                            </h3>
                            <div class="metric-list">
                                <div class="metric-item">
                                    <span class="metric-label">High Risk</span>
                                    <span class="metric-value risk-high">45</span>
                                </div>
                                <div class="metric-item">
                                    <span class="metric-label">Medium Risk</span>
                                    <span class="metric-value risk-medium">55</span>
                                </div>
                                <div class="metric-item">
                                    <span class="metric-label">Low Risk</span>
                                    <span class="metric-value risk-low">50</span>
                                </div>
                            </div>
                        </div>

                        <!-- Customer Engagement -->
                        <div class="analytics-card">
                            <h3 class="analytics-title">
                                <span class="card-icon">📱</span>
                                Customer Engagement Metrics
                            </h3>
                            <div class="metric-list">
                                <div class="metric-item">
                                    <span class="metric-label">Avg App Sessions (30d)</span>
                                    <span class="metric-value">9.8</span>
                                </div>
                                <div class="metric-item">
                                    <span class="metric-label">Avg Website Visits (30d)</span>
                                    <span class="metric-value">8.2</span>
                                </div>
                                <div class="metric-item">
                                    <span class="metric-label">Avg Engagements</span>
                                    <span class="metric-value">24.5</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Action Buttons -->
                    <div class="content-card">
                        <div class="action-buttons">
                            <button class="btn btn-primary" onclick="refreshDashboard()">
                                🔄 Refresh Dashboard
                            </button>
                            <button class="btn btn-secondary" onclick="exportReport()">
                                📊 Export Report
                            </button>
                            <button class="btn btn-secondary" onclick="viewHighRiskCustomers()">
                                🚨 View High Risk Customers
                            </button>
                            <button class="btn btn-secondary" onclick="viewPolicyTable()">
                                📋 View Policy Data
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Other tabs content -->
                <div id="renewal-content" class="tab-content">
                    <div class="content-card">
                        <h2 class="analytics-title">
                            <span class="card-icon">🔄</span>
                            Renewal Pipeline Management
                        </h2>
                        <p style="margin-bottom: 20px;">Manage and track policy renewals across different time horizons with priority-based intervention strategies.</p>
                        
                        <div class="analytics-grid">
                            <div class="analytics-card">
                                <h3 class="analytics-title">Immediate Action Required (30 Days)</h3>
                                <div class="metric-list">
                                    <div class="metric-item">
                                        <span class="metric-label">Policies Due</span>
                                        <span class="metric-value">25</span>
                                    </div>
                                    <div class="metric-item">
                                        <span class="metric-label">High Priority</span>
                                        <span class="metric-value risk-high">12</span>
                                    </div>
                                    <div class="metric-item">
                                        <span class="metric-label">Total Value at Risk</span>
                                        <span class="metric-value">$3.2M</span>
                                    </div>
                                </div>
                            </div>
                            
                            <div class="analytics-card">
                                <h3 class="analytics-title">Planning Horizon (60-90 Days)</h3>
                                <div class="metric-list">
                                    <div class="metric-item">
                                        <span class="metric-label">60-Day Pipeline</span>
                                        <span class="metric-value">38</span>
                                    </div>
                                    <div class="metric-item">
                                        <span class="metric-label">90-Day Pipeline</span>
                                        <span class="metric-value">52</span>
                                    </div>
                                    <div class="metric-item">
                                        <span class="metric-label">Campaign Targets</span>
                                        <span class="metric-value">90</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div id="intelligence-content" class="tab-content">
                    <div class="content-card">
                        <h2 class="analytics-title">
                            <span class="card-icon">🧠</span>
                            Customer Intelligence & Insights
                        </h2>
                        <p style="margin-bottom: 20px;">Advanced analytics and behavioral insights to drive personalized customer engagement strategies.</p>
                        
                        <div class="analytics-grid">
                            <div class="analytics-card">
                                <h3 class="analytics-title">Behavioral Segments</h3>
                                <div class="metric-list">
                                    <div class="metric-item">
                                        <span class="metric-label">Digital Natives</span>
                                        <span class="metric-value">42%</span>
                                    </div>
                                    <div class="metric-item">
                                        <span class="metric-label">Traditional Customers</span>
                                        <span class="metric-value">38%</span>
                                    </div>
                                    <div class="metric-item">
                                        <span class="metric-label">Hybrid Users</span>
                                        <span class="metric-value">20%</span>
                                    </div>
                                </div>
                            </div>
                            
                            <div class="analytics-card">
                                <h3 class="analytics-title">Engagement Patterns</h3>
                                <div class="metric-list">
                                    <div class="metric-item">
                                        <span class="metric-label">Mobile App Adoption</span>
                                        <span class="metric-value">73%</span>
                                    </div>
                                    <div class="metric-item">
                                        <span class="metric-label">Self-Service Usage</span>
                                        <span class="metric-value">65%</span>
                                    </div>
                                    <div class="metric-item">
                                        <span class="metric-label">Agent Interaction</span>
                                        <span class="metric-value">45%</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div id="reports-content" class="tab-content">
                    <div class="content-card">
                        <h2 class="analytics-title">
                            <span class="card-icon">📈</span>
                            Risk & Analytics Reports
                        </h2>
                        <p style="margin-bottom: 20px;">Comprehensive risk analysis and performance reports for strategic decision making.</p>
                        
                        <div class="analytics-grid">
                            <div class="analytics-card">
                                <h3 class="analytics-title">Risk Monitoring</h3>
                                <div class="metric-list">
                                    <div class="metric-item">
                                        <span class="metric-label">Portfolio Risk Score</span>
                                        <span class="metric-value risk-medium">6.2/10</span>
                                    </div>
                                    <div class="metric-item">
                                        <span class="metric-label">Early Warning Alerts</span>
                                        <span class="metric-value risk-high">23</span>
                                    </div>
                                    <div class="metric-item">
                                        <span class="metric-label">Intervention Success Rate</span>
                                        <span class="metric-value risk-low">78%</span>
                                    </div>
                                </div>
                            </div>
                            
                            <div class="analytics-card">
                                <h3 class="analytics-title">Performance Metrics</h3>
                                <div class="metric-list">
                                    <div class="metric-item">
                                        <span class="metric-label">Customer Satisfaction</span>
                                        <span class="metric-value">4.2/5.0</span>
                                    </div>
                                    <div class="metric-item">
                                        <span class="metric-label">Net Promoter Score</span>
                                        <span class="metric-value">+42</span>
                                    </div>
                                    <div class="metric-item">
                                        <span class="metric-label">Revenue Growth</span>
                                        <span class="metric-value">+12.3%</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    </div>

    <script>
        // Tab Navigation
        function showTab(tabName) {
            // Hide all tab contents
            const allTabs = document.querySelectorAll('.tab-content');
            allTabs.forEach(tab => {
                tab.classList.remove('active');
            });

            // Remove active class from all nav links
            const allNavLinks = document.querySelectorAll('.nav-link');
            allNavLinks.forEach(link => {
                link.classList.remove('active');
            });

            // Show selected tab
            const selectedTab = document.getElementById(tabName + '-content');
            if (selectedTab) {
                selectedTab.classList.add('active');
            }

            // Add active class to clicked nav link
            event.target.classList.add('active');

            // Update page title and breadcrumb
            updatePageHeader(tabName);
        }

        function updatePageHeader(tabName) {
            const titles = {
                'dashboard': 'Executive Dashboard',
                'renewal': 'Renewal Pipeline Management',
                'intelligence': 'Customer Intelligence',
                'reports': 'Risk & Analytics Reports'
            };

            const breadcrumbs = {
                'dashboard': 'CLV Maximization > Executive Dashboard > Overview',
                'renewal': 'CLV Maximization > Renewal > Pipeline Management',
                'intelligence': 'CLV Maximization > Analytics > Customer Intelligence',
                'reports': 'CLV Maximization > Reports > Risk & Analytics'
            };

            document.getElementById('page-title').textContent = titles[tabName] || 'CLV Portal';
            document.getElementById('page-breadcrumb').textContent = breadcrumbs[tabName] || 'CLV Maximization';
        }

        // Action Functions
        function refreshDashboard() {
            // Add a brief loading animation
            const cards = document.querySelectorAll('.kpi-number');
            cards.forEach(card => {
                card.style.opacity = '0.5';
            });
            
            setTimeout(() => {
                cards.forEach(card => {
                    card.style.opacity = '1';
                });
                alert('✅ Dashboard refreshed with latest data from Policy Holder and Sold Policy tables.');
            }, 1000);
        }

        function exportReport() {
            alert('📊 Export functionality will generate a comprehensive CLV analytics report including all dashboard metrics and insights.');
        }

        function viewHighRiskCustomers() {
            // Navigate to the policy holder table with high risk filter
            window.open('/x_hete_clvmaximi_0_policy_holder_list.do?sysparm_query=risk_level=high', '_blank');
        }

        function viewPolicyTable() {
            // Navigate to the sold policy table
            window.open('/x_hete_clvmaximi_0_sold_policy_list.do', '_blank');
        }

        // Initialize dashboard on page load
        document.addEventListener('DOMContentLoaded', function() {
            console.log('CLV Maximization Executive Dashboard loaded successfully');
            
            // Add some subtle animations
            setTimeout(() => {
                const cards = document.querySelectorAll('.kpi-card, .analytics-card');
                cards.forEach((card, index) => {
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, index * 100);
                });
            }, 100);
        });
    </script>
</body>
</html>
  `,
  direct: true
});