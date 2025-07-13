import React, { useState } from 'react';
import './Change.css';
import EditIcon from '../assets/Edit.png';
import { leadsAPI } from '../services/api';

const stageOptions = [
  { label: 'Initial Contact', color: '#bfe3ff' },
  { label: 'Discussions', color: '#fff7b2' },
  { label: 'Decision Making', color: '#ffe1a6' },
  { label: 'Contract Discussion', color: '#ffc6d0' },
  { label: 'Deal - won', color: '#d2f7b2' },
  { label: 'Deal - lost', color: '#e6e6e6' },
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

export default function Change({ onBack, stage, setStage, timeline, lead = mockLead, onFieldUpdate }) {
  const [activeTab, setActiveTab] = useState('Main');
  const [note, setNote] = useState('');
  const [stageDropdown, setStageDropdown] = useState(false);
  // Editable field states
  const [editField, setEditField] = useState(null);
  const [fieldValues, setFieldValues] = useState({
    name: lead.name,
    company: lead.company,
    phone: lead.phone,
    email: lead.email,
    position: lead.position,
    address: lead.address,
    user: lead.user,
    sale: lead.sale,
  });

  // Add state for position edit
  const [originalPosition, setOriginalPosition] = useState(fieldValues.position);
  const [positionLoading, setPositionLoading] = useState(false);

  // Add generic edit state for all fields
  const [editLoading, setEditLoading] = useState(false);
  const [originalValues, setOriginalValues] = useState(fieldValues);

  const handleStageSelect = (label) => {
    setStage(label);
    setStageDropdown(false);
  };

  const handleFieldClick = (field) => setEditField(field);
  const handleFieldChange = (field, value) => setFieldValues(v => ({ ...v, [field]: value }));
  const handleFieldBlur = (field) => {
    setEditField(null);
    if (onFieldUpdate) onFieldUpdate(field, fieldValues[field]);
  };
  const handleFieldKeyDown = (e, field) => {
    if (e.key === 'Enter') {
      e.target.blur();
    }
  };

  const handleEditPosition = () => {
    setOriginalPosition(fieldValues.position);
    setEditField('position');
  };
  const handleCancelEditPosition = () => {
    setFieldValues(v => ({ ...v, position: originalPosition }));
    setEditField(null);
  };
  const handleSaveEditPosition = async () => {
    setPositionLoading(true);
    try {
      await leadsAPI.update(lead.id, { position: fieldValues.position });
      setEditField(null);
    } finally {
      setPositionLoading(false);
    }
  };

  const handleEditField = (field) => {
    setOriginalValues(fieldValues);
    setEditField(field);
  };
  const handleCancelEditField = () => {
    setFieldValues(originalValues);
    setEditField(null);
  };
  const handleSaveEditField = async (field) => {
    setEditLoading(true);
    try {
      await leadsAPI.update(lead.id, {
        name: fieldValues.name,
        company: fieldValues.company,
        phone: fieldValues.phone,
        email: fieldValues.email,
        position: fieldValues.position,
        address: fieldValues.address,
        user: fieldValues.user,
        sale: fieldValues.sale,
        // Add other required fields if needed
      });
      setEditField(null);
    } finally {
      setEditLoading(false);
    }
  };

  return (
    <div className="lead-detail-root">
      <div className="lead-detail-left">
        {onBack && (
          <button className="lead-detail-back-btn" onClick={onBack}>&larr; Back</button>
        )}
        <div className="lead-detail-leadname">
          {editField === 'name' ? (
            <input
              value={fieldValues.name}
              onChange={e => handleFieldChange('name', e.target.value)}
              onBlur={() => handleFieldBlur('name')}
              onKeyDown={e => handleFieldKeyDown(e, 'name')}
              autoFocus
              className="lead-detail-edit-input"
            />
          ) : (
            <span onClick={() => handleFieldClick('name')} style={{cursor:'pointer'}}>
              {fieldValues.name} <img src={EditIcon} alt="Edit" className="edit-icon" style={{width:18,height:18}} />
            </span>
          )}
        </div>
        <div className="lead-detail-idrow">
          <span className="lead-detail-id">#{lead.id}</span>
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
          <span className="lead-detail-date">({lead.date})</span>
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
                {editField === 'user' ? (
                  <div style={{display:'flex',flexDirection:'column',gap:8}}>
                    <input
                      value={fieldValues.user}
                      onChange={e => handleFieldChange('user', e.target.value)}
                      autoFocus
                      className="lead-detail-edit-input"
                    />
                    <div className="edit-actions">
                      <button type="button" className="edit-cancel-btn" onClick={handleCancelEditField} disabled={editLoading}>Cancel</button>
                      <button type="button" className="edit-save-btn" onClick={()=>handleSaveEditField('user')} disabled={editLoading}>Save</button>
                    </div>
                  </div>
                ) : (
                  <div className="lead-detail-value editable-row" onClick={()=>handleEditField('user')} style={{cursor:'pointer'}}>
                    <span>{fieldValues.user}</span> <img src={EditIcon} alt="Edit" className="edit-icon" style={{width:18,height:18}} />
                  </div>
                )}
              </div>
              <div className="lead-detail-section">
                <div className="lead-detail-label">Sale</div>
                {editField === 'sale' ? (
                  <div style={{display:'flex',flexDirection:'column',gap:8}}>
                    <input
                      type="number"
                      value={fieldValues.sale}
                      onChange={e => handleFieldChange('sale', e.target.value)}
                      autoFocus
                      className="lead-detail-edit-input"
                    />
                    <div className="edit-actions">
                      <button type="button" className="edit-cancel-btn" onClick={handleCancelEditField} disabled={editLoading}>Cancel</button>
                      <button type="button" className="edit-save-btn" onClick={()=>handleSaveEditField('sale')} disabled={editLoading}>Save</button>
                    </div>
                  </div>
                ) : (
                  <div className="lead-detail-value editable-row" onClick={() => handleFieldClick('sale')} style={{cursor:'pointer'}}>
                    <span>{fieldValues.sale}</span> <img src={EditIcon} alt="Edit" className="edit-icon" style={{width:18,height:18}} />
                  </div>
                )}
              </div>
              <div className="lead-detail-section">
                <div className="lead-detail-label">Company</div>
                {editField === 'company' ? (
                  <div style={{display:'flex',flexDirection:'column',gap:8}}>
                    <input
                      value={fieldValues.company || ""}
                      onChange={e => handleFieldChange('company', e.target.value)}
                      autoFocus
                      className="lead-detail-edit-input"
                    />
                    <div className="edit-actions">
                      <button type="button" className="edit-cancel-btn" onClick={handleCancelEditField} disabled={editLoading}>Cancel</button>
                      <button type="button" className="edit-save-btn" onClick={()=>handleSaveEditField('company')} disabled={editLoading}>Save</button>
                    </div>
                  </div>
                ) : (
                  <div className="lead-detail-value editable-row" onClick={()=>handleEditField('company')} style={{cursor:'pointer'}}>
                    <span>{fieldValues.company}</span> <img src={EditIcon} alt="Edit" className="edit-icon" style={{width:18,height:18}} />
                  </div>
                )}
              </div>
              <div className="lead-detail-section">
                <div className="lead-detail-label">Work phone</div>
                {editField === 'phone' ? (
                  <div style={{display:'flex',flexDirection:'column',gap:8}}>
                    <input
                      value={fieldValues.phone}
                      onChange={e => handleFieldChange('phone', e.target.value)}
                      autoFocus
                      className="lead-detail-edit-input"
                    />
                    <div className="edit-actions">
                      <button type="button" className="edit-cancel-btn" onClick={handleCancelEditField} disabled={editLoading}>Cancel</button>
                      <button type="button" className="edit-save-btn" onClick={()=>handleSaveEditField('phone')} disabled={editLoading}>Save</button>
                    </div>
                  </div>
                ) : (
                  <div className="lead-detail-value editable-row" onClick={() => handleFieldClick('phone')} style={{cursor:'pointer'}}>
                    <span><a href={`tel:${fieldValues.phone}`}>{fieldValues.phone}</a></span> <img src={EditIcon} alt="Edit" className="edit-icon" style={{width:18,height:18}} />
                  </div>
                )}
              </div>
              <div className="lead-detail-section">
                <div className="lead-detail-label">Work email</div>
                {editField === 'email' ? (
                  <div style={{display:'flex',flexDirection:'column',gap:8}}>
                    <input
                      value={fieldValues.email || ""}
                      onChange={e => handleFieldChange('email', e.target.value)}
                      autoFocus
                      className="lead-detail-edit-input"
                    />
                    <div className="edit-actions">
                      <button type="button" className="edit-cancel-btn" onClick={handleCancelEditField} disabled={editLoading}>Cancel</button>
                      <button type="button" className="edit-save-btn" onClick={()=>handleSaveEditField('email')} disabled={editLoading}>Save</button>
                    </div>
                  </div>
                ) : (
                  <div className="lead-detail-value editable-row" onClick={() => handleFieldClick('email')} style={{cursor:'pointer'}}>
                    <span>{fieldValues.email || '...'}</span> <img src={EditIcon} alt="Edit" className="edit-icon" style={{width:18,height:18}} />
                  </div>
                )}
              </div>
              <div className="lead-detail-section">
                <div className="lead-detail-label">Position</div>
                {editField === 'position' ? (
                  <div style={{display:'flex',flexDirection:'column',gap:8}}>
                    <input
                      value={fieldValues.position || ""}
                      onChange={e => handleFieldChange('position', e.target.value)}
                      autoFocus
                      className="lead-detail-edit-input"
                    />
                    <div className="edit-actions">
                      <button type="button" className="edit-cancel-btn" onClick={handleCancelEditPosition} disabled={positionLoading}>Cancel</button>
                      <button type="button" className="edit-save-btn" onClick={handleSaveEditPosition} disabled={positionLoading}>Save</button>
                    </div>
                  </div>
                ) : (
                  <div className="lead-detail-value editable-row" onClick={handleEditPosition} style={{cursor:'pointer'}}>
                    <span>{fieldValues.position || '...'}</span> <img src={EditIcon} alt="Edit" className="edit-icon" style={{width:18,height:18}} />
                  </div>
                )}
              </div>
              <div className="lead-detail-section">
                <div className="lead-detail-label">Address</div>
                {editField === 'address' ? (
                  <div style={{display:'flex',flexDirection:'column',gap:8}}>
                    <textarea
                      value={fieldValues.address}
                      onChange={e => handleFieldChange('address', e.target.value)}
                      autoFocus
                      className="lead-detail-edit-input"
                      rows={2}
                    />
                    <div className="edit-actions">
                      <button type="button" className="edit-cancel-btn" onClick={handleCancelEditField} disabled={editLoading}>Cancel</button>
                      <button type="button" className="edit-save-btn" onClick={()=>handleSaveEditField('address')} disabled={editLoading}>Save</button>
                    </div>
                  </div>
                ) : (
                  <div className="lead-detail-value editable-row" onClick={() => handleFieldClick('address')} style={{cursor:'pointer'}}>
                    <span>{fieldValues.address}</span> <img src={EditIcon} alt="Edit" className="edit-icon" style={{width:18,height:18}} />
                  </div>
                )}
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
