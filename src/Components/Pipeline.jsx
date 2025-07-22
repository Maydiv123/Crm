import React, { useState } from "react";
import "./Pipeline.css";

const Pipeline = () => {
  const [selectedPipeline, setSelectedPipeline] = useState("Sales Pipeline");
  const [bulkMessage, setBulkMessage] = useState("");

  const pipelines = [
    "Sales Pipeline",
    "Marketing Pipeline", 
    "Support Pipeline"
  ];

  const stages = [
    { name: "Initial Contact", leads: 3, value: "₹0" },
    { name: "Discussions", leads: 0, value: "₹0" },
    { name: "Decision Making", leads: 0, value: "₹0" },
    { name: "Contract Discussion", leads: 0, value: "₹0" },
    { name: "Closed - Won", leads: 0, value: "₹0" },
    { name: "Closed - Lost", leads: 2, value: "₹0" }
  ];

  const handleBulkMessage = (stageName) => {
    if (bulkMessage.trim()) {
      alert(`Sending bulk message to ${stageName} stage: ${bulkMessage}`);
      setBulkMessage("");
    }
  };

  return (
    <div className="pipeline-container">
      <div className="pipeline-header">
        <div className="pipeline-selector">
          <select 
            value={selectedPipeline} 
            onChange={(e) => setSelectedPipeline(e.target.value)}
            className="pipeline-dropdown"
          >
            {pipelines.map(pipeline => (
              <option key={pipeline} value={pipeline}>{pipeline}</option>
            ))}
          </select>
        </div>
        
        <div className="pipeline-stats">
          <span className="stat">1 lead: ₹0</span>
          <button className="automate-btn">AUTOMATE</button>
          <button className="new-lead-btn">+ NEW LEAD</button>
        </div>
      </div>

      <div className="pipeline-subheader">
        <div className="quick-stats">
          <span>With tasks due today: 0</span>
          <span>Without tasks assigned: 1</span>
          <span>With overdue tasks: 0</span>
          <span>New today / yesterday: 1/0</span>
        </div>
        <div className="prospective-sales">Prospective sales No data</div>
      </div>

      <div className="pipeline-board">
        {stages.map((stage, index) => (
          <div key={index} className="pipeline-column">
            <div className="column-header">
              <h3>{stage.name}</h3>
              <div className="lead-count">{stage.leads} lead(s): {stage.value}</div>
            </div>
            
            <button className="quick-add-btn">Quick add</button>
            
            <div className="bulk-message-section">
              <textarea
                placeholder="Type bulk message..."
                value={bulkMessage}
                onChange={(e) => setBulkMessage(e.target.value)}
                className="bulk-message-input"
              />
              <button 
                onClick={() => handleBulkMessage(stage.name)}
                className="send-bulk-btn"
                disabled={stage.leads === 0}
              >
                Send to {stage.leads} leads
              </button>
            </div>

            <div className="leads-container">
              {stage.leads > 0 && (
                <div className="lead-card">
                  <div className="lead-info">
                    <h4>Abhishek kumar</h4>
                    <p>Stage: {stage.name}</p>
                  </div>
                  <div className="lead-actions">
                    <button className="send-message-btn">Send Message</button>
                    <button className="view-details-btn">View Details</button>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Pipeline; 