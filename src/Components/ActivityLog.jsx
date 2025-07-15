import React from "react";
import AnalyticsSidebar from "./AnalyticsSidebar";
import "./ActivityLog.css";

const activityData = [
  {
    date: "10.07.2025 6:52PM",
    user: "Abhishek",
    objectType: "Lead",
    objectName: "Lead #4229080",
    event: "Sales stage changed",
    valueBefore: [
      { type: "Pipeline", value: "Contract discussion", color: "pink" },
    ],
    valueAfter: [
      { type: "Pipeline", value: "Decision making", color: "yellow" },
    ],
  },
  {
    date: "10.07.2025 6:52PM",
    user: "Abhishek",
    objectType: "Lead",
    objectName: "Lead #4229080",
    event: "Sales stage changed",
    valueBefore: [
      { type: "Pipeline", value: "Decision making", color: "yellow" },
    ],
    valueAfter: [
      { type: "Pipeline", value: "Contract discussion", color: "pink" },
    ],
  },
  {
    date: "10.07.2025 6:47PM",
    user: "Abhishek",
    objectType: "Lead",
    objectName: "Lead #4999888",
    event: "Lead created",
    valueBefore: [],
    valueAfter: [],
  },
  {
    date: "10.07.2025 6:47PM",
    user: "Abhishek",
    objectType: "Contact",
    objectName: "sx,z",
    event: "Contact created",
    valueBefore: [],
    valueAfter: [],
  },
  {
    date: "10.07.2025 4:49PM",
    user: "Abhishek",
    objectType: "Lead",
    objectName: "Abhishek kumar",
    event: "Sales stage changed",
    valueBefore: [
      { type: "Pipeline", value: "Initial contact", color: "blue" },
    ],
    valueAfter: [
      { type: "Pipeline", value: "Discussions", color: "teal" },
    ],
  },
  // ...more rows as needed
];

function Tag({ type, value, color }) {
  return (
    <span className={`activity-tag activity-tag-${color}`}>{type} <b>{value}</b></span>
  );
}

export default function ActivityLog() {
  return (
    <div style={{ display: 'flex', height: '100%' }}>
      <AnalyticsSidebar />
      <div className="activity-log-container">
        <div className="activity-log-table-wrapper">
          <table className="activity-log-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>User</th>
                <th>Object Type</th>
                <th>Object Name</th>
                <th>Event</th>
                <th>Value Before</th>
                <th>Value After</th>
              </tr>
            </thead>
            <tbody>
              {activityData.map((row, idx) => (
                <tr key={idx}>
                  <td>{row.date}</td>
                  <td>{row.user}</td>
                  <td>{row.objectType}</td>
                  <td>{row.objectName}</td>
                  <td>{row.event}</td>
                  <td>
                    {row.valueBefore.length > 0 ? row.valueBefore.map((tag, i) => (
                      <Tag key={i} {...tag} />
                    )) : "-"}
                  </td>
                  <td>
                    {row.valueAfter.length > 0 ? row.valueAfter.map((tag, i) => (
                      <Tag key={i} {...tag} />
                    )) : "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
} 