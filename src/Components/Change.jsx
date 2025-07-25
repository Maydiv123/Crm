import React, { useState, useEffect } from 'react';
import './Change.css';
import EditIcon from '../assets/Edit.png';
import { leadsAPI } from '../services/api';
import { activityLogsAPI } from '../services/api';
import { usePipeline } from '../context/PipelineContext';

const stageOptions = [
  { label: 'Initial Contact', color: '#bfe3ff' },
  { label: 'Discussions', color: '#fff7b2' },
  { label: 'Decision Making', color: '#ffe1a6' },
  { label: 'Contract Discussion', color: '#ffc6d0' },
  { label: 'Deal Won', color: '#d2f7b2' },
  { label: 'Deal Lost', color: '#e6e6e6' },
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

export default function Change({ onBack, stage, setStage, timeline, lead = mockLead, onFieldUpdate, onLeadUpdate }) {
  const [activeTab, setActiveTab] = useState('Main');
  const [note, setNote] = useState('');
  const [stageDropdown, setStageDropdown] = useState(false);
  const [activityLog, setActivityLog] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showStageConfirm, setShowStageConfirm] = useState(false);
  const [pendingStage, setPendingStage] = useState(null);
  
  // Get pipeline data from global context
  const { pipelines, selectedPipelineIndex } = usePipeline();
  
  // State for current lead data from database
  const [currentLead, setCurrentLead] = useState(lead);
  const [isLoadingLead, setIsLoadingLead] = useState(false);
  
  // Editable field states
  const [editField, setEditField] = useState(null);
  const [fieldValues, setFieldValues] = useState({
    name: lead.name || lead.contactName || '',
    company: lead.companyName || lead.company || '',
    phone: lead.contactPhone || lead.phone || '',
    email: lead.contactEmail || lead.email || '',
    position: lead.position || '',
    address: lead.companyAddress || lead.address || '',
    user: lead.user || 'Abhishek',
    sale: lead.amount ? `₹${lead.amount}` : '₹0',
  });

  // Add state for position edit
  const [originalPosition, setOriginalPosition] = useState(fieldValues.position);
  const [positionLoading, setPositionLoading] = useState(false);

  // Add generic edit state for all fields
  const [editLoading, setEditLoading] = useState(false);
  const [originalValues, setOriginalValues] = useState(fieldValues);

  // Function to fetch lead data from database
  const fetchLeadFromDB = async () => {
    if (!lead.id) return;
    
    try {
      setIsLoadingLead(true);
      const response = await leadsAPI.getById(lead.id);
      const freshLead = response.data;
      setCurrentLead(freshLead);
      
      // Update field values with fresh data
      setFieldValues({
        name: freshLead.contactName || freshLead.name || '',
        company: freshLead.companyName || freshLead.company || '',
        phone: freshLead.contactPhone || freshLead.phone || '',
        email: freshLead.contactEmail || freshLead.email || '',
        position: freshLead.contactPosition || freshLead.position || '',
        address: freshLead.companyAddress || freshLead.address || '',
        user: freshLead.user || 'Abhishek',
        sale: freshLead.amount ? `₹${freshLead.amount}` : '₹0',
      });
      
      // Update original values
      setOriginalValues({
        name: freshLead.contactName || freshLead.name || '',
        company: freshLead.companyName || freshLead.company || '',
        phone: freshLead.contactPhone || freshLead.phone || '',
        email: freshLead.contactEmail || freshLead.email || '',
        position: freshLead.contactPosition || freshLead.position || '',
        address: freshLead.companyAddress || freshLead.address || '',
        user: freshLead.user || 'Abhishek',
        sale: freshLead.amount ? `₹${freshLead.amount}` : '₹0',
      });
      
      console.log('Fetched fresh lead data:', freshLead);
    } catch (error) {
      console.error('Error fetching lead from DB:', error);
    } finally {
      setIsLoadingLead(false);
    }
  };

  // Fetch lead data from database when component mounts
  useEffect(() => {
    fetchLeadFromDB();
  }, [lead.id]);

  // Fetch activity log for this lead
  useEffect(() => {
    const fetchActivityLog = async () => {
      if (!lead.id) return;
      
      try {
        setIsLoading(true);
        const response = await activityLogsAPI.getAll({ leadId: lead.id });
        if (response.data && response.data.activityLogs) {
          setActivityLog(response.data.activityLogs);
        }
      } catch (error) {
        console.error('Error fetching activity log:', error);
        // Fallback to timeline prop if available
        if (timeline && timeline.length > 0) {
          setActivityLog(timeline.map(item => ({
            id: Date.now() + Math.random(),
            action: item.text,
            timestamp: item.time,
            type: 'field_update'
          })));
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchActivityLog();
  }, [lead.id, timeline]);

  const handleStageSelect = (label) => {
    if (label === stage) {
      setStageDropdown(false);
      return;
    }
    
    // Show confirmation prompt
    setPendingStage(label);
    setShowStageConfirm(true);
    setStageDropdown(false);
  };

  const handleStageConfirm = async () => {
    if (!pendingStage) return;
    
    const oldStage = stage;
    const newStage = pendingStage;
    
    try {
      // Log the stage change activity
      await activityLogsAPI.create({
        leadId: lead.id,
        action: `Stage changed from "${oldStage}" to "${newStage}"`,
        type: 'stage_change',
        details: {
          oldStage,
          newStage,
          changedBy: fieldValues.user || 'Abhishek'
        }
      });
      
      // Update the activity log
      const newActivity = {
        id: Date.now(),
        action: `Stage changed from "${oldStage}" to "${newStage}"`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        type: 'stage_change',
        details: {
          oldStage,
          newStage,
          changedBy: fieldValues.user || 'Abhishek'
        }
      };
      
      setActivityLog(prev => [newActivity, ...prev]);
      
      // Update lead in backend
      if (lead.id) {
        await leadsAPI.updateStage(lead.id, newStage);
      }
      
      // Update local stage
      setStage(newStage);
      
      // Notify parent component
      if (onLeadUpdate) {
        onLeadUpdate({ ...lead, stage: newStage });
      }
      
      // Refresh data from database after successful stage change
      await fetchLeadFromDB();
      
      // Close confirmation
      setShowStageConfirm(false);
      setPendingStage(null);
    } catch (error) {
      console.error('Error logging stage change:', error);
      alert('Failed to update stage. Please try again.');
    }
  };

  const handleStageCancel = () => {
    setShowStageConfirm(false);
    setPendingStage(null);
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
      const oldValue = originalValues[field] || '';
      const newValue = fieldValues[field] || '';
      
      console.log('Saving field:', field, 'from', oldValue, 'to', newValue);
      
      // Only update if value actually changed (normalize for comparison)
      const normalizedOldValue = String(oldValue).trim();
      const normalizedNewValue = String(newValue).trim();
      
      if (normalizedOldValue !== normalizedNewValue) {
        // Map frontend field names to backend field names
        const fieldMapping = {
          'name': 'contactName',
          'company': 'companyName', 
          'phone': 'contactPhone',
          'email': 'contactEmail',
          'position': 'contactPosition',
          'address': 'companyAddress',
          'sale': 'amount'
        };
        
        const backendField = fieldMapping[field] || field;
        const updateData = {
          [backendField]: field === 'sale' ? newValue.replace('₹', '') : newValue
        };
        
        console.log('Updating backend with:', updateData);
        await leadsAPI.update(lead.id, updateData);
        
        // Log the field change activity
        try {
          await activityLogsAPI.create({
            leadId: lead.id,
            action: `Field "${field}" updated from "${normalizedOldValue}" to "${normalizedNewValue}"`,
            type: 'field_update',
            details: {
              field,
              oldValue: normalizedOldValue,
              newValue: normalizedNewValue,
              changedBy: fieldValues.user || 'Abhishek'
            }
          });
          
          // Update the activity log
          const newActivity = {
            id: Date.now(),
            action: `Field "${field}" updated from "${normalizedOldValue}" to "${normalizedNewValue}"`,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            type: 'field_update',
            details: {
              field,
              oldValue: normalizedOldValue,
              newValue: normalizedNewValue,
              changedBy: fieldValues.user || 'Abhishek'
            }
          };
          
          setActivityLog(prev => [newActivity, ...prev]);
        } catch (error) {
          console.error('Error logging field change:', error);
        }
        
        // Notify parent component
        if (onLeadUpdate) {
          // Create updated lead with frontend field names for the interface
          const updatedLead = { 
            ...lead, 
            [backendField]: field === 'sale' ? newValue.replace('₹', '') : newValue 
          };
          
          // Also update the frontend field names for display
          const frontendFieldMapping = {
            'contactName': 'contactName',
            'companyName': 'companyName', 
            'contactPhone': 'contactPhone',
            'contactEmail': 'contactEmail',
            'contactPosition': 'position',
            'companyAddress': 'address',
            'amount': 'sale'
          };
          
          const frontendField = frontendFieldMapping[backendField];
          if (frontendField) {
            updatedLead[frontendField] = field === 'sale' ? newValue : newValue;
          }
          
          console.log('Change.jsx: Sending updated lead to parent:', updatedLead);
          onLeadUpdate(updatedLead);
        }
        
        setEditField(null);
        console.log('✅ Field updated successfully!');
        
        // Refresh data from database after successful update
        await fetchLeadFromDB();
        
        // Notify parent component with fresh data
        if (onLeadUpdate) {
          onLeadUpdate(currentLead);
        }
      } else {
        console.log('No change detected, skipping update');
        console.log('Normalized old value:', normalizedOldValue);
        console.log('Normalized new value:', normalizedNewValue);
        // Show a friendly message instead of error
        alert('No changes detected - the value is the same as before.');
      }
    } catch (error) {
      console.error('❌ Error updating field:', error);
      
      // Check if it's a "no changes" error from backend
      if (error.response?.status === 400 && error.response?.data?.message?.includes('No changes detected')) {
        alert('No changes detected - the value is the same as before.');
      } else {
        alert('Failed to update field. Please try again.');
      }
    } finally {
      setEditLoading(false);
    }
  };

  return (
    <div className="lead-detail-root">
      {/* Loading indicator */}
      {isLoadingLead && (
        <div style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          background: 'rgba(0,0,0,0.8)',
          color: 'white',
          padding: '20px',
          borderRadius: '8px',
          zIndex: 10000
        }}>
          Loading lead data...
        </div>
      )}
      
      {/* Stage Change Confirmation Modal */}
      {showStageConfirm && (
        <div className="stage-confirm-overlay">
          <div className="stage-confirm-modal">
            <div className="stage-confirm-header">
              <h3>Confirm Stage Change</h3>
            </div>
            <div className="stage-confirm-content">
              <p>Are you sure you want to change the stage from</p>
              <div className="stage-confirm-stages">
                <span className="stage-confirm-old">{stage}</span>
                <span className="stage-confirm-arrow">→</span>
                <span className="stage-confirm-new">{pendingStage}</span>
              </div>
              <p>This action will be logged in the activity history.</p>
            </div>
            <div className="stage-confirm-actions">
              <button 
                className="stage-confirm-cancel" 
                onClick={handleStageCancel}
              >
                Cancel
              </button>
              <button 
                className="stage-confirm-save" 
                onClick={handleStageConfirm}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
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
          <span className="lead-detail-id">#{currentLead.id}</span>
          <span className="lead-detail-addtags">+ADD TAGS</span>
        </div>
        <div className="lead-detail-stage-row">
          <div className="lead-detail-stage-dropdown-wrapper">
            <button
              className="lead-detail-stage-btn"
              style={{ 
                background: (() => {
                  const stageColors = [
                    '#e3f1ff', // blue
                    '#fff9c4', // yellow
                    '#ffe0b2', // orange
                    '#ffd6d6', // red
                    '#e0ffd6', // green
                    '#f0f0f0'  // gray
                  ];
                  const stageIndex = pipelines[selectedPipelineIndex]?.stages.findIndex(s => s === stage) || 0;
                  return stageColors[stageIndex % stageColors.length] || '#f7f8fa';
                })()
              }}
              onClick={() => setStageDropdown(v => !v)}
            >
              <span className="lead-detail-stage-btn-label">{stage}</span>
              <span className="lead-detail-stage-btn-arrow">▾</span>
            </button>
            {stageDropdown && (
              <div className="lead-detail-stage-dropdown">
                {pipelines[selectedPipelineIndex]?.stages.map((stageName, idx) => {
                  // Kommo-style stage colors
                  const stageColors = [
                    '#e3f1ff', // blue
                    '#fff9c4', // yellow
                    '#ffe0b2', // orange
                    '#ffd6d6', // red
                    '#e0ffd6', // green
                    '#f0f0f0'  // gray
                  ];
                  
                  return (
                    <div
                      key={stageName}
                      className="lead-detail-stage-dropdown-item"
                      style={{ background: stageColors[idx % stageColors.length] }}
                      onClick={() => handleStageSelect(stageName)}
                    >
                      {stage === stageName && <span className="lead-detail-stage-check">✓</span>}
                      {stageName}
                    </div>
                  );
                })}
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
                <div className="lead-detail-value">
                  <span>{fieldValues.user}</span>
                  <span style={{color: '#888', fontSize: '0.9rem', marginLeft: '8px'}}>(Read-only)</span>
                </div>
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
            <div className="lead-detail-today">
              Activity Log: {activityLog.length} events 
              <span className="lead-detail-expand">Expand</span>
            </div>
            {isLoading ? (
              <div className="lead-detail-timeline-item">
                <span className="lead-detail-timeline-time">Loading...</span> Fetching activity history...
              </div>
            ) : activityLog.length > 0 ? (
              activityLog.map((item, i) => (
                <div className="lead-detail-timeline-item" key={item.id || i}>
                  <span className="lead-detail-timeline-time">{item.timestamp}</span> 
                  <span className="lead-detail-timeline-action">{item.action}</span>
                  {item.details && item.details.changedBy && (
                    <span className="lead-detail-timeline-user">by {item.details.changedBy}</span>
                  )}
                </div>
              ))
            ) : (
              <div className="lead-detail-timeline-item">
                <span className="lead-detail-timeline-time">No activity</span> 
                No activity recorded for this lead yet.
              </div>
            )}
          </div>
        </div>
        <div className="lead-detail-note-row">
          <span className="lead-detail-note-label">Note:</span>
          <input
            className="lead-detail-note-input"
            placeholder="type here"
            value={note}
            onChange={e => setNote(e.target.value)}
            onKeyDown={async (e) => {
              if (e.key === 'Enter' && note.trim()) {
                try {
                  // Save note to backend
                  await leadsAPI.addNote(lead.id, { content: note });
                  
                  // Log the note activity
                  await activityLogsAPI.create({
                    leadId: lead.id,
                    action: `Note added: "${note}"`,
                    type: 'note_added',
                    details: {
                      note: note,
                      addedBy: fieldValues.user || 'Abhishek'
                    }
                  });
                  
                  // Update activity log
                  const newActivity = {
                    id: Date.now(),
                    action: `Note added: "${note}"`,
                    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    type: 'note_added',
                    details: {
                      note: note,
                      addedBy: fieldValues.user || 'Abhishek'
                    }
                  };
                  
                  setActivityLog(prev => [newActivity, ...prev]);
                  setNote(''); // Clear the input
                } catch (error) {
                  console.error('Error saving note:', error);
                }
              }
            }}
          />
        </div>
      </div>
    </div>
  );
}
