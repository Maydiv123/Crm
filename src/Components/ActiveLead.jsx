import React from "react";
import "./ActiveLead.css";

export default function ActiveLead({ onClose }) {
  return (
    <div className="activelead-dropdown-center">
      <div className="activelead-dropdown-content2">
        <div className="activelead-leftcol activelead-scrollable">
          <div className="activelead-menu-title">Active leads</div>
          <div className="activelead-menu-item active">Active leads</div>
          <div className="activelead-menu-item">My leads</div>
          <div className="activelead-menu-item">Won leads</div>
          <div className="activelead-menu-item">Lost leads</div>
          <div className="activelead-menu-item orange">● Leads without Tasks</div>
          <div className="activelead-menu-item red">● Leads with Overdue Tasks</div>
          <div className="activelead-menu-item">Deleted</div>
        </div>
        <div className="activelead-rightcol activelead-scrollable">
          <div className="activelead-filter-title">LEAD PROPERTIES</div>
          <input className="activelead-input" placeholder="Lead name" />
          <input className="activelead-input" placeholder="Any time" />
          <input className="activelead-input" placeholder="Active stages" />
          <input className="activelead-input" placeholder="Lead Source: All values" />
          <input className="activelead-input" placeholder="Users" />
          <input className="activelead-input" placeholder="Created by" />
          <input className="activelead-input" placeholder="Modified by" />
          <input className="activelead-input" placeholder="Tasks: All values" />
          <input className="activelead-input" placeholder="Sales value -" />
          <div className="activelead-filter-title">Statistics</div>
          <input className="activelead-input" placeholder="utm_content" />
          <input className="activelead-input" placeholder="utm_medium" />
          <input className="activelead-input" placeholder="utm_campaign" />
          <input className="activelead-input" placeholder="utm_source" />
          <input className="activelead-input" placeholder="utm_term" />
          <input className="activelead-input" placeholder="utm_referrer" />
          <input className="activelead-input" placeholder="referrer" />
          <input className="activelead-input" placeholder="gclientid" />
          <input className="activelead-input" placeholder="gclid" />
          <input className="activelead-input" placeholder="fbclid" />
          <select className="activelead-input">
            <option>Select field</option>
          </select>
          <div className="activelead-section-title">CONVERSATIONS</div>
          <div className="activelead-section-title">PROPERTIES OF A LINKED CONTACT</div>
          <div className="activelead-section-title">PROPERTIES OF A LINKED COMPANY</div>
          <div className="activelead-section-title">PRODUCTS</div>
          <div className="activelead-tags">
            <div className="activelead-tags-title">TAGS <span className="activelead-tags-manage">Manage</span></div>
            <input className="activelead-input" placeholder="Find tags" />
          </div>
        </div>
        <button className="activelead-close" onClick={onClose}>×</button>
      </div>
    </div>
  );
}
