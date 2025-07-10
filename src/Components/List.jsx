import React from "react";
import "./List.css";

export default function List({ showSelect, leads = [] }) {
  return (
    <div className="list-leads-container">
      {leads.map((lead, idx) => (
        <div className="lead-row" key={lead.id || idx}>
          {showSelect && <input type="checkbox" className="lead-select-checkbox" />}
          <span className="lead-title">{lead.title || lead.name || `Lead #${lead.id || idx+1}`}</span>
        </div>
      ))}
    </div>
  );
}
