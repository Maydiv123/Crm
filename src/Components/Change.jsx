import React, { useState } from 'react';
import './Change.css';

const stageOptions = [
  { label: 'Initial Contact', color: '#bfe3ff' },
  { label: 'Discussions', color: '#fff7b2' },
  { label: 'Decision Making', color: '#ffe1a6' },
  { label: 'Contract Discussion', color: '#ffc6d0' },
  { label: 'Closed - won', color: '#d2f7b2' },
  { label: 'Closed - lost', color: '#e6e6e6' },
];

const mockLead = {
  id: 4199848,
  name: 'Abhishek kumar',
  stage: 'Initial contact',
  date: 'Today',
  user: 'Abhishek',
  sale: '₹0',
  company: 'Company name not specified',
  phone: '096256 13008',
  email: '',
  position: '',
  address: 'Bhardwaj traders shop, kanhai road, behind cyber park, Jharsa, sec-39, gurugram',
};

const tabs = ['Main', 'Statistics', 'Media', 'Products', 'Setup'];

export default function Change({ onBack, stage, setStage, timeline }) {
  const [activeTab, setActiveTab] = useState('Main');
  const [note, setNote] = useState('');
  const [stageDropdown, setStageDropdown] = useState(false);

  const handleStageSelect = (label) => {
    setStage(label);
    setStageDropdown(false);
  };

  return (
    <div className="lead-detail-root">
      <div className="lead-detail-left">
        {onBack && (
          <button className="lead-detail-back-btn" onClick={onBack}>&larr; Back</button>
        )}
        <div className="lead-detail-leadname">{mockLead.name}</div>
        <div className="lead-detail-idrow">
          <span className="lead-detail-id">#{mockLead.id}</span>
          <span className="lead-detail-addtags">+ADD TAGS</span>
        </div>
        <div className="lead-detail-stage-row">
          <div className="lead-detail-stage-dropdown-wrapper">
            <button
              className="lead-detail-stage-btn"
              style={{ background: stageOptions.find(s => s.label === stage)?.color || '#f7f8fa' }}
              onClick={() => setStageDropdown(v => !v)}
            >
              <span className="lead-detail-stage-btn-label">{stage}</span>
              <span className="lead-detail-stage-btn-arrow">▾</span>
            </button>
            {stageDropdown && (
              <div className="lead-detail-stage-dropdown">
                {stageOptions.map(opt => (
                  <div
                    key={opt.label}
                    className="lead-detail-stage-dropdown-item"
                    style={{ background: opt.color }}
                    onClick={() => handleStageSelect(opt.label)}
                  >
                    {stage === opt.label && <span className="lead-detail-stage-check">✓</span>}
                    {opt.label}
                  </div>
                ))}
              </div>
            )}
          </div>
          <span className="lead-detail-date">({mockLead.date})</span>
        </div>
        <div className="lead-detail-tabs-inside">
          {tabs.map(tab => (
            <div
              key={tab}
              className={`lead-detail-tab-inside${activeTab === tab ? ' active' : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </div>
          ))}
        </div>
        <div className="lead-detail-tabcontent">
          {activeTab === 'Main' && (
            <>
              <div className="lead-detail-section">
                <div className="lead-detail-label">Responsible user</div>
                <div className="lead-detail-value">{mockLead.user}</div>
              </div>
              <div className="lead-detail-section">
                <div className="lead-detail-label">Sale</div>
                <div className="lead-detail-value">{mockLead.sale}</div>
              </div>
              <div className="lead-detail-section">
                <div className="lead-detail-label">Company</div>
                <div className="lead-detail-value">{mockLead.company}</div>
              </div>
              <div className="lead-detail-section">
                <div className="lead-detail-label">Work phone</div>
                <div className="lead-detail-value"><a href={`tel:${mockLead.phone}`}>{mockLead.phone}</a></div>
              </div>
              <div className="lead-detail-section">
                <div className="lead-detail-label">Work email</div>
                <div className="lead-detail-value">{mockLead.email || '...'}</div>
              </div>
              <div className="lead-detail-section">
                <div className="lead-detail-label">Position</div>
                <div className="lead-detail-value">{mockLead.position || '...'}</div>
              </div>
              <div className="lead-detail-section">
                <div className="lead-detail-label">Address</div>
                <div className="lead-detail-value">{mockLead.address}</div>
              </div>
            </>
          )}
          {activeTab === 'Statistics' && (
            <div className="lead-detail-section">Statistics content...</div>
          )}
          {activeTab === 'Media' && (
            <div className="lead-detail-section">Media content...</div>
          )}
          {activeTab === 'Products' && (
            <div className="lead-detail-section">Products content...</div>
          )}
          {activeTab === 'Setup' && (
            <div className="lead-detail-section">Setup content...</div>
          )}
        </div>
      </div>
      <div className="lead-detail-right">
        <div className="lead-detail-timeline-search">
          <input className="lead-detail-timeline-search-input" placeholder="Search and filter" />
        </div>
        <div className="lead-detail-content">
          <div className="lead-detail-timeline">
            <div className="lead-detail-today">Today Create: {timeline.length} events <span className="lead-detail-expand">Expand</span></div>
            {timeline.map((item, i) => (
              <div className="lead-detail-timeline-item" key={i}>
                <span className="lead-detail-timeline-time">{item.time}</span> {item.text}
              </div>
            ))}
          </div>
        </div>
        <div className="lead-detail-note-row">
          <span className="lead-detail-note-label">Note:</span>
          <input
            className="lead-detail-note-input"
            placeholder="type here"
            value={note}
            onChange={e => setNote(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}
