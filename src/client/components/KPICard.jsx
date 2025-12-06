import React from 'react';
import './KPICard.css';

export default function KPICard({ title, value, subtitle, trend, trendDirection, icon }) {
  const trendClass = trendDirection === 'up' ? 'trend-up' : 
                    trendDirection === 'down' ? 'trend-down' : 'trend-neutral';

  return (
    <div className="kpi-card">
      <div className="kpi-header">
        <h3 className="kpi-title">{title}</h3>
        {icon && <span className="kpi-icon">{icon}</span>}
      </div>
      <div className="kpi-value">{value}</div>
      {subtitle && <div className="kpi-subtitle">{subtitle}</div>}
      {trend && (
        <div className={`kpi-trend ${trendClass}`}>
          <span className="trend-arrow">
            {trendDirection === 'up' ? '↗' : trendDirection === 'down' ? '↘' : '→'}
          </span>
          {trend}
        </div>
      )}
    </div>
  );
}