var CLVDashboardAjax = Class.create();

CLVDashboardAjax.prototype = Object.extendsObject(global.AbstractAjaxProcessor, {

    getDashboardData: function() {
        try {
            gs.info('CLVDashboardAjax: Starting getDashboardData');
            
            var result = {
                policyHolders: this.getPolicyHolderMetrics(),
                soldPolicies: this.getSoldPolicyMetrics(),
                success: true
            };
            
            gs.info('CLVDashboardAjax: Data retrieved successfully');
            return JSON.stringify(result);
        } catch (error) {
            gs.error('CLVDashboardAjax: Error getting dashboard data: ' + error.toString());
            return JSON.stringify({
                error: error.toString(),
                success: false,
                fallbackData: this.getFallbackData()
            });
        }
    },
    
    getFallbackData: function() {
        // Return sample data based on what we know exists in the tables
        return {
            policyHolders: {
                totalCount: 150,
                highRiskCount: 45,
                avgCLV: 245000,
                tiers: {
                    platinum: { count: 25, avgCLV: 450000 },
                    gold: { count: 38, avgCLV: 195000 },
                    silver: { count: 42, avgCLV: 85000 },
                    bronze: { count: 45, avgCLV: 45000 }
                },
                riskDistribution: { high: 45, medium: 55, low: 50 },
                avgAppSessions: "9.8",
                avgWebsiteVisits: "8.2",
                avgEngagements: "24.5",
                avgChurnRisk: "52.3"
            },
            soldPolicies: {
                totalCount: 280,
                activeCount: 200,
                renewedCount: 65,
                expiredCount: 15,
                renewals30Days: 25,
                renewals60Days: 38,
                renewals90Days: 52
            }
        };
    },
    
    getPolicyHolderMetrics: function() {
        try {
            gs.info('CLVDashboardAjax: Getting policy holder metrics');
            var gr = new GlideRecord('x_hete_clvmaximi_0_policy_holder');
            gr.query();
            
            var totalCount = 0;
            var highRiskCount = 0;
            var totalCLV = 0;
            var clvCount = 0;
            var totalAppSessions = 0;
            var totalWebsiteVisits = 0;
            var totalEngagements = 0;
            var totalChurnRisk = 0;
            var churnCount = 0;
            
            var tiers = {
                platinum: {count: 0, totalCLV: 0},
                gold: {count: 0, totalCLV: 0},
                silver: {count: 0, totalCLV: 0},
                bronze: {count: 0, totalCLV: 0}
            };
            
            var riskDistribution = {
                high: 0,
                medium: 0,
                low: 0
            };
            
            while (gr.next()) {
                totalCount++;
                
                // Risk levels
                var riskLevel = gr.getValue('risk_level') || '';
                if (riskLevel == 'high') {
                    highRiskCount++;
                    riskDistribution.high++;
                } else if (riskLevel == 'medium') {
                    riskDistribution.medium++;
                } else if (riskLevel == 'low') {
                    riskDistribution.low++;
                }
                
                // CLV calculation
                var clvStr = gr.getValue('clv') || '0';
                var clv = parseInt(clvStr, 10);
                if (!isNaN(clv) && clv > 0) {
                    totalCLV += clv;
                    clvCount++;
                    
                    // Tier calculations
                    var tier = gr.getValue('tier') || '';
                    if (tier == 'Platinum') {
                        tiers.platinum.count++;
                        tiers.platinum.totalCLV += clv;
                    } else if (tier == 'gold') {
                        tiers.gold.count++;
                        tiers.gold.totalCLV += clv;
                    } else if (tier == 'silver') {
                        tiers.silver.count++;
                        tiers.silver.totalCLV += clv;
                    } else if (tier == 'bronze') {
                        tiers.bronze.count++;
                        tiers.bronze.totalCLV += clv;
                    }
                }
                
                // Engagement metrics
                var appSessionsStr = gr.getValue('app_sessions_30_days') || '0';
                var appSessions = parseInt(appSessionsStr, 10);
                if (!isNaN(appSessions)) {
                    totalAppSessions += appSessions;
                }
                
                var websiteVisitsStr = gr.getValue('website_visits_30_days') || '0';
                var websiteVisits = parseInt(websiteVisitsStr, 10);
                if (!isNaN(websiteVisits)) {
                    totalWebsiteVisits += websiteVisits;
                }
                
                var engagementsStr = gr.getValue('number_of_engagements') || '0';
                var engagements = parseInt(engagementsStr, 10);
                if (!isNaN(engagements)) {
                    totalEngagements += engagements;
                }
                
                // Churn risk
                var churnRiskStr = gr.getValue('churn_risk') || '0';
                var churnRisk = parseFloat(churnRiskStr);
                if (!isNaN(churnRisk)) {
                    totalChurnRisk += churnRisk;
                    churnCount++;
                }
            }
            
            gs.info('CLVDashboardAjax: Processed ' + totalCount + ' policy holders');
            
            return {
                totalCount: totalCount,
                highRiskCount: highRiskCount,
                avgCLV: clvCount > 0 ? Math.round(totalCLV / clvCount) : 0,
                tiers: {
                    platinum: {
                        count: tiers.platinum.count,
                        avgCLV: tiers.platinum.count > 0 ? Math.round(tiers.platinum.totalCLV / tiers.platinum.count) : 0
                    },
                    gold: {
                        count: tiers.gold.count,
                        avgCLV: tiers.gold.count > 0 ? Math.round(tiers.gold.totalCLV / tiers.gold.count) : 0
                    },
                    silver: {
                        count: tiers.silver.count,
                        avgCLV: tiers.silver.count > 0 ? Math.round(tiers.silver.totalCLV / tiers.silver.count) : 0
                    },
                    bronze: {
                        count: tiers.bronze.count,
                        avgCLV: tiers.bronze.count > 0 ? Math.round(tiers.bronze.totalCLV / tiers.bronze.count) : 0
                    }
                },
                riskDistribution: riskDistribution,
                avgAppSessions: totalCount > 0 ? (totalAppSessions / totalCount).toFixed(1) : "0",
                avgWebsiteVisits: totalCount > 0 ? (totalWebsiteVisits / totalCount).toFixed(1) : "0",
                avgEngagements: totalCount > 0 ? (totalEngagements / totalCount).toFixed(1) : "0",
                avgChurnRisk: churnCount > 0 ? (totalChurnRisk / churnCount).toFixed(1) : "0"
            };
        } catch (error) {
            gs.error('CLVDashboardAjax: Error in getPolicyHolderMetrics: ' + error.toString());
            throw error;
        }
    },
    
    getSoldPolicyMetrics: function() {
        try {
            gs.info('CLVDashboardAjax: Getting sold policy metrics');
            var gr = new GlideRecord('x_hete_clvmaximi_0_sold_policy');
            gr.query();
            
            var totalCount = 0;
            var activeCount = 0;
            var renewedCount = 0;
            var expiredCount = 0;
            var renewals30Days = 0;
            var renewals60Days = 0;
            var renewals90Days = 0;
            
            // Calculate date thresholds - using simpler approach
            var today = new Date();
            var thirtyDaysFromNow = new Date(today.getTime() + (30 * 24 * 60 * 60 * 1000));
            var sixtyDaysFromNow = new Date(today.getTime() + (60 * 24 * 60 * 60 * 1000));
            var ninetyDaysFromNow = new Date(today.getTime() + (90 * 24 * 60 * 60 * 1000));
            
            while (gr.next()) {
                totalCount++;
                
                var status = gr.getValue('status') || '';
                if (status == 'active') {
                    activeCount++;
                } else if (status == 'renewed') {
                    renewedCount++;
                } else if (status == 'expired') {
                    expiredCount++;
                }
                
                // Calculate renewal pipeline - simplified
                var renewalDateStr = gr.getValue('renewal_date');
                if (renewalDateStr) {
                    try {
                        var renewalDate = new Date(renewalDateStr);
                        if (renewalDate <= thirtyDaysFromNow) {
                            renewals30Days++;
                        } else if (renewalDate <= sixtyDaysFromNow) {
                            renewals60Days++;
                        } else if (renewalDate <= ninetyDaysFromNow) {
                            renewals90Days++;
                        }
                    } catch (dateError) {
                        gs.warn('CLVDashboardAjax: Error parsing renewal date: ' + renewalDateStr);
                    }
                }
            }
            
            gs.info('CLVDashboardAjax: Processed ' + totalCount + ' sold policies');
            
            return {
                totalCount: totalCount,
                activeCount: activeCount,
                renewedCount: renewedCount,
                expiredCount: expiredCount,
                renewals30Days: renewals30Days,
                renewals60Days: renewals60Days,
                renewals90Days: renewals90Days
            };
        } catch (error) {
            gs.error('CLVDashboardAjax: Error in getSoldPolicyMetrics: ' + error.toString());
            throw error;
        }
    },

    type: 'CLVDashboardAjax'
});