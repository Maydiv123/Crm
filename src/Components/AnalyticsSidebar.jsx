import React from "react";
import { Link, useLocation } from "react-router-dom";
import "./Stat.css";

const analyticsItems = [
  { label: "Win-Loss Analysis", path: "/stats" },
  { label: "Consolidated report", path: "/consolidated-report" },
  { label: "Report by activities", path: "/report-by-activities" },
  { label: "Activity Log", path: "/activity-log" },
  { label: "Call report", path: "/call-report" },
  { label: "Goal report", path: "/goal-report" },
];

export default function AnalyticsSidebar() {
  const location = useLocation();
  return (
    <aside className="stat-sidebar">
      <h2>ANALYTICS</h2>
      <ul>
        {analyticsItems.map((item) => (
          <li key={item.label}>
            <Link
              to={item.path}
              className={location.pathname === item.path ? "active" : ""}
              style={{ color: "inherit", textDecoration: "none", display: "block", width: "100%" }}
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  );
} 