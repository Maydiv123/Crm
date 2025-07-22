import React, { useState, useEffect } from "react";
import AnalyticsSidebar from "./AnalyticsSidebar";
import { leadsAPI } from "../services/api";
import "./Stat.css";

const analyticsItems = [
  { label: "Win-Loss Analysis", path: "/stats" },
  { label: "Activity Log", path: "/activity-log" },
];

const verticalLabels = ["WITHIN STAGE", "ENTERED STAGE", "LOST"];

export default function Stat() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statsData, setStatsData] = useState({
    newLeads: 0,
    pipelineStages: [],
    overallStats: {},
    pipelineSummary: []
  });

  useEffect(() => {
    fetchWinLossStats();
  }, []);

  const fetchWinLossStats = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await leadsAPI.getWinLossStats();
      setStatsData(response.data);
    } catch (err) {
      console.error('Error fetching win-loss stats:', err);
      setError('Failed to load analytics data');
    } finally {
      setLoading(false);
    }
  };

  const maxLeads = Math.max(...statsData.pipelineSummary.map(row => row.leads), 1);

  if (loading) {
    return (
      <div className="stat-container">
        <AnalyticsSidebar />
        <main className="stat-main">
          <div className="stat-loading">
            <div className="stat-loading-spinner"></div>
            <div>Loading analytics...</div>
          </div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="stat-container">
        <AnalyticsSidebar />
        <main className="stat-main">
          <div className="stat-error">
            <div className="stat-error-icon">⚠️</div>
            <div>{error}</div>
            <button onClick={fetchWinLossStats} className="stat-retry-btn">
              Retry
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="stat-container">
      <AnalyticsSidebar />
      <main className="stat-main">
        <div className="stat-header">
          <button className="stat-filter-btn">Filter</button>
          <span className="stat-title">WIN-LOSS ANALYSIS</span>
          <button 
            onClick={fetchWinLossStats} 
            className="stat-refresh-btn"
            title="Refresh data"
          >
            🔄
          </button>
        </div>
        <div className="stat-pipeline-row">
          <div className="stat-pipeline-labels">
            {verticalLabels.map((lbl) => (
              <div className="stat-pipeline-label" key={lbl}>{lbl}</div>
            ))}
          </div>
          <div className="stat-pipeline-cards">
            <div className="stat-new">NEW<br/><span>{statsData.newLeads}</span></div>
            {statsData.pipelineStages.map((stage) => (
              <div
                key={stage.name}
                className={`stat-stage-card${stage.highlight ? " stat-stage-won" : ""}${stage.lostCard ? " stat-stage-lost" : ""}`}
              >
                <div className="stat-stage-title">{stage.name}</div>
                <div className="stat-stage-leads">{stage.leads} lead{stage.leads !== 1 ? "s" : ""}</div>
                <div className="stat-stage-amount">₹{stage.amount}</div>
                <div className="stat-booklet">
                  {stage.summary}
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* Pipeline summary graph below cards */}
        <div className="stat-pipeline-summary-section">
          {statsData.pipelineSummary.length === 0 ? (
            <div className="stat-nodata">
              <div className="stat-nodata-icon">🗄️</div>
              <div>Not enough data for report</div>
            </div>
          ) : (
            <div className="stat-pipeline-bar-graph">
              {statsData.pipelineSummary.map((row) => (
                <div className="stat-bar-row" key={row.stage}>
                  <span className="stat-bar-label">{row.stage}</span>
                  <div className="stat-bar-outer">
                    <div
                      className="stat-bar-inner"
                      style={{ width: `${(row.leads / maxLeads) * 100}%` }}
                    >
                      {row.leads > 0 && <span className="stat-bar-value">{row.leads}</span>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        {/* Overall stats section */}
        {statsData.overallStats && (
          <div className="stat-overall-section">
            <h3>Overall Performance</h3>
            <div className="stat-overall-grid">
              <div className="stat-overall-card">
                <div className="stat-overall-label">Total Leads</div>
                <div className="stat-overall-value">{statsData.overallStats.totalLeads || 0}</div>
              </div>
              <div className="stat-overall-card">
                <div className="stat-overall-label">Won</div>
                <div className="stat-overall-value won">{statsData.overallStats.totalWon || 0}</div>
              </div>
              <div className="stat-overall-card">
                <div className="stat-overall-label">Lost</div>
                <div className="stat-overall-value lost">{statsData.overallStats.totalLost || 0}</div>
              </div>
              <div className="stat-overall-card">
                <div className="stat-overall-label">Active</div>
                <div className="stat-overall-value active">{statsData.overallStats.totalActive || 0}</div>
              </div>
              <div className="stat-overall-card">
                <div className="stat-overall-label">Total Amount</div>
                <div className="stat-overall-value">₹{statsData.overallStats.totalAmount || 0}</div>
              </div>
              <div className="stat-overall-card">
                <div className="stat-overall-label">Win Rate</div>
                <div className="stat-overall-value">
                  {statsData.overallStats.totalLeads > 0 
                    ? `${Math.round((statsData.overallStats.totalWon / statsData.overallStats.totalLeads) * 100)}%`
                    : '0%'
                  }
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
