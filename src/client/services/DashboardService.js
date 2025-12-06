// Service for CLV Dashboard analytics and data operations
export class DashboardService {
  constructor() {
    this.scope = 'x_hete_clvmaximi_0';
    this.policyHolderTable = `${this.scope}_policy_holder`;
    this.soldPolicyTable = `${this.scope}_sold_policy`;
    this.headers = {
      'Accept': 'application/json',
      'X-UserToken': window.g_ck
    };
  }

  async makeRequest(url) {
    const response = await fetch(url, { headers: this.headers });
    
    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`);
    }
    
    return await response.json();
  }

  async getTotalCustomers() {
    try {
      const allData = await this.makeRequest(
        `/api/now/table/${this.policyHolderTable}?sysparm_fields=sys_id`
      );
      return { count: allData.result ? allData.result.length : 0 };
    } catch (error) {
      return { count: 0 };
    }
  }

  async getHighRiskCustomers() {
    try {
      const highRiskData = await this.makeRequest(
        `/api/now/table/${this.policyHolderTable}?sysparm_query=risk_level=high&sysparm_fields=sys_id,risk_level&sysparm_display_value=all`
      );
      
      const totalCustomers = await this.getTotalCustomers();
      const highRiskCount = highRiskData.result ? highRiskData.result.length : 0;
      const percentage = totalCustomers.count > 0 ? ((highRiskCount / totalCustomers.count) * 100).toFixed(1) : 0;
      
      return { count: highRiskCount, percentage: parseFloat(percentage) };
    } catch (error) {
      return { count: 0, percentage: 0 };
    }
  }

  async getAverageCLV() {
    try {
      const data = await this.makeRequest(
        `/api/now/table/${this.policyHolderTable}?sysparm_fields=clv&sysparm_display_value=all&sysparm_query=clvISNOTEMPTY`
      );
      
      if (!data.result || data.result.length === 0) {
        return { average: 0, total: 0 };
      }
      
      let totalClv = 0;
      let validCount = 0;
      
      data.result.forEach(record => {
        const clvValue = record.clv?.value || record.clv;
        if (clvValue && !isNaN(clvValue)) {
          totalClv += parseInt(clvValue);
          validCount++;
        }
      });
      
      const average = validCount > 0 ? Math.round(totalClv / validCount) : 0;
      
      return { average, total: validCount };
    } catch (error) {
      return { average: 0, total: 0 };
    }
  }

  async getRenewalConversionRate() {
    try {
      const renewedData = await this.makeRequest(
        `/api/now/table/${this.soldPolicyTable}?sysparm_query=status=renewed&sysparm_fields=sys_id,status&sysparm_display_value=all`
      );
      
      const expiredData = await this.makeRequest(
        `/api/now/table/${this.soldPolicyTable}?sysparm_query=status=expired&sysparm_fields=sys_id,status&sysparm_display_value=all`
      );
      
      const renewedCount = renewedData.result ? renewedData.result.length : 0;
      const expiredCount = expiredData.result ? expiredData.result.length : 0;
      const totalRenewalOpportunities = renewedCount + expiredCount;
      
      const conversionRate = totalRenewalOpportunities > 0 
        ? ((renewedCount / totalRenewalOpportunities) * 100).toFixed(1)
        : 0;
      
      return { 
        rate: parseFloat(conversionRate), 
        renewed: renewedCount, 
        opportunities: totalRenewalOpportunities 
      };
    } catch (error) {
      return { rate: 0, renewed: 0, opportunities: 0 };
    }
  }

  async getChurnRate() {
    try {
      const highChurnData = await this.makeRequest(
        `/api/now/table/${this.policyHolderTable}?sysparm_fields=churn_risk&sysparm_display_value=all&sysparm_query=churn_riskGREATERTHAN70`
      );
      
      const totalCustomers = await this.getTotalCustomers();
      const highChurnCount = highChurnData.result ? highChurnData.result.length : 0;
      const churnRate = totalCustomers.count > 0 
        ? ((highChurnCount / totalCustomers.count) * 100).toFixed(1)
        : 0;
      
      let avgChurnRisk = 0;
      if (highChurnData.result && highChurnData.result.length > 0) {
        const validChurnValues = highChurnData.result
          .map(record => {
            const churnValue = record.churn_risk?.value || record.churn_risk;
            return parseFloat(churnValue) || 0;
          })
          .filter(val => val > 0);
        
        avgChurnRisk = validChurnValues.length > 0 
          ? (validChurnValues.reduce((sum, val) => sum + val, 0) / validChurnValues.length).toFixed(1)
          : 0;
      }
      
      return { 
        rate: parseFloat(churnRate), 
        atRiskCount: highChurnCount,
        avgRisk: parseFloat(avgChurnRisk)
      };
    } catch (error) {
      return { rate: 0, atRiskCount: 0, avgRisk: 0 };
    }
  }

  async getCLVByTier() {
    const tiers = ['platinum', 'gold', 'silver', 'bronze'];
    const results = {};
    
    try {
      for (const tier of tiers) {
        const data = await this.makeRequest(
          `/api/now/table/${this.policyHolderTable}?sysparm_query=tier=${tier}&sysparm_fields=clv,tier&sysparm_display_value=all`
        );
        
        if (data.result && data.result.length > 0) {
          let totalClv = 0;
          let validCount = 0;
          
          data.result.forEach(record => {
            const clvValue = record.clv?.value || record.clv;
            if (clvValue && !isNaN(clvValue)) {
              totalClv += parseInt(clvValue);
              validCount++;
            }
          });
          
          const average = validCount > 0 ? Math.round(totalClv / validCount) : 0;
          
          results[tier] = {
            average,
            count: data.result.length,
            tier: tier.charAt(0).toUpperCase() + tier.slice(1)
          };
        } else {
          results[tier] = {
            average: 0,
            count: 0,
            tier: tier.charAt(0).toUpperCase() + tier.slice(1)
          };
        }
      }
      
      return results;
    } catch (error) {
      tiers.forEach(tier => {
        results[tier] = {
          average: 0,
          count: 0,
          tier: tier.charAt(0).toUpperCase() + tier.slice(1)
        };
      });
      return results;
    }
  }

  async getTrendData() {
    // For demo purposes, generate mock trend data
    // In production, this would query historical data
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    return {
      renewalTrend: months.map((month, i) => ({
        month,
        rate: 65 + Math.random() * 20 // Mock data between 65-85%
      })),
      churnTrend: months.map((month, i) => ({
        month,
        rate: 8 + Math.random() * 6 // Mock data between 8-14%
      }))
    };
  }
}