import React from "react";
import AnalyticsSidebar from "./AnalyticsSidebar";
import "./Stat.css";

const analyticsItems = [
  { label: "Win-Loss Analysis", path: "/stats" },
  { label: "Consolidated report", path: "/consolidated-report" },
  { label: "Report by activities", path: "/report-by-activities" },
  { label: "Activity Log", path: "/activity-log" },
  { label: "Call report", path: "/call-report" },
  { label: "Goal report", path: "/goal-report" },
];

const pipelineStages = [
  {
    name: "Initial contact",
    leads: 2,
    amount: 0,
    summary: "0 entered, 0 lost",
  },
  {
    name: "Discussions",
    leads: 1,
    amount: 121,
    summary: "3 entered, 0 lost",
  },
  {
    name: "Decision making",
    leads: 2,
    amount: 0,
    summary: "2 entered, 0 lost",
  },
  {
    name: "Contract discussion",
    leads: 0,
    amount: 0,
    summary: "0 entered, 0 lost",
  },
  {
    name: "Won",
    leads: 0,
    amount: 0,
    highlight: true,
    summary: "0 won",
  },
  {
    name: "Lost",
    leads: 0,
    amount: 0,
    lostCard: true,
    summary: "0 lost",
  },
];

const verticalLabels = ["WITHIN STAGE", "ENTERED STAGE", "LOST"];

const pipelineSummary = [
  { stage: "Initial contact", leads: 2 },
  { stage: "Discussions", leads: 1 },
  { stage: "Decision making", leads: 2 },
  { stage: "Contract discussion", leads: 0 },
  { stage: "Won", leads: 0 },
  { stage: "Lost", leads: 0 },
];

const maxLeads = Math.max(...pipelineSummary.map(row => row.leads), 1);

export default function Stat() {
  return (
    <div className="stat-container">
      <AnalyticsSidebar />
      <main className="stat-main">
        <div className="stat-header">
          <button className="stat-filter-btn">Filter</button>
          <span className="stat-title">WIN-LOSS ANALYSIS</span>
        </div>
        <div className="stat-pipeline-row">
          <div className="stat-pipeline-labels">
            {verticalLabels.map((lbl) => (
              <div className="stat-pipeline-label" key={lbl}>{lbl}</div>
            ))}
          </div>
          <div className="stat-pipeline-cards">
            <div className="stat-new">NEW<br/><span>5</span></div>
            {pipelineStages.map((stage) => (
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
          {pipelineSummary.length === 0 ? (
            <div className="stat-nodata">
              <div className="stat-nodata-icon">🗄️</div>
              <div>Not enough data for report</div>
            </div>
          ) : (
            <div className="stat-pipeline-bar-graph">
              {pipelineSummary.map((row) => (
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
        <div className="stat-nodata">
          <div className="stat-nodata-icon">🗄️</div>
          <div>Not enough data for report</div>
        </div>
      </main>
    </div>
  );
}
