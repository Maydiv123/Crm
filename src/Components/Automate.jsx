import React, { useState, useEffect } from "react";
import { FaCheck, FaTrash } from "react-icons/fa";
import "./Automate.css";
import { pipelineAPI } from '../services/api';
import { useNavigate } from 'react-router-dom';
import { usePipeline } from '../context/PipelineContext';

const defaultColumns = [
  { key: "initialContact", label: "Initial Contact", hint: null, isDefault: true },
  { key: "discussions", label: "Discussions", hint: "Add hints", isDefault: true },
  { key: "decisionMaking", label: "Decision Making", hint: "Add hints", isDefault: true },
  { key: "contractDiscussion", label: "Contract Discussion", hint: "Add hints", isDefault: true },
  { key: "dealWon", label: "Deal Won", hint: null, isDefault: true },
  { key: "dealLost", label: "Deal Lost", hint: null, isDefault: true },
];

function HintsModal({ stage, hints, onChange, onClose, onSave }) {
  return (
    <div className="automate-hints-overlay" onClick={onClose}>
      <div className="automate-hints-modal" onClick={e => e.stopPropagation()}>
        <div className="automate-hints-header">
          <span>Hints for the '{stage}' stage</span>
          <div>
            <button className="automate-hints-cancel" onClick={onClose}>Cancel</button>
            <button className="automate-hints-save" onClick={onSave}>Save</button>
          </div>
        </div>
        <div className="automate-hints-section">
          <div className="automate-hints-label">Beginner</div>
          <div className="automate-hints-desc">Add helper text for new users</div>
          <textarea className="automate-hints-input" value={hints.beginner} onChange={e => onChange('beginner', e.target.value)} placeholder="Description" />
        </div>
        <div className="automate-hints-section">
          <div className="automate-hints-label">Intermediate</div>
          <div className="automate-hints-desc">Add helper text for users with some experience</div>
          <textarea className="automate-hints-input" value={hints.intermediate} onChange={e => onChange('intermediate', e.target.value)} placeholder="Description" />
        </div>
        <div className="automate-hints-section">
          <div className="automate-hints-label">Expert</div>
          <div className="automate-hints-desc">Add helper text for all other users</div>
          <textarea className="automate-hints-input" value={hints.expert} onChange={e => onChange('expert', e.target.value)} placeholder="Description" />
        </div>
      </div>
    </div>
  );
}

export default function Automate({ onBack }) {
  const [columns, setColumns] = useState(defaultColumns);
  const [editingIdx, setEditingIdx] = useState(null);
  const [editValue, setEditValue] = useState("");
  const [hintsModalIdx, setHintsModalIdx] = useState(null);
  const [hintsDraft, setHintsDraft] = useState({ beginner: "", intermediate: "", expert: "" });
  const navigate = useNavigate();
  
  // Use global pipeline context
  const { getCurrentPipelineStages } = usePipeline();

  // Sync with global pipeline context on mount and when stages change
  useEffect(() => {
    const currentStages = getCurrentPipelineStages();
    if (currentStages.length > 0) {
      setColumns(currentStages);
    }
  }, [getCurrentPipelineStages]);

  const handlePlusClick = (idx) => {
    // Insert a new column after idx, set it to edit mode
    const newCol = {
      key: `custom_${Date.now()}`,
      label: "New Pipeline",
      hint: null,
      isDefault: false,
      isEditing: true,
      hints: { beginner: "", intermediate: "", expert: "" },
    };
    setColumns(cols => [
      ...cols.slice(0, idx + 1),
      newCol,
      ...cols.slice(idx + 1)
    ]);
    setEditingIdx(idx + 1);
    setEditValue("");
  };

  const handleEditChange = (e) => {
    setEditValue(e.target.value);
  };

  const handleEditSave = (idx) => {
    setColumns(cols => {
      if (!editValue.trim()) {
        // Remove the column if empty
        return cols.filter((_, i) => i !== idx);
      }
      return cols.map((col, i) =>
        i === idx ? { ...col, label: editValue, isEditing: false } : { ...col, isEditing: false }
      );
    });
    setEditingIdx(null);
    setEditValue("");
  };

  const handleEditStart = (idx, label) => {
    setEditingIdx(idx);
    setEditValue(label);
    setColumns(cols => cols.map((col, i) => ({ ...col, isEditing: i === idx })));
  };

  const handleEditBlur = (idx) => {
    handleEditSave(idx);
  };

  const handleEditKeyDown = (e, idx) => {
    if (e.key === "Enter") {
      handleEditSave(idx);
    }
  };

  const handleDelete = (idx) => {
    setColumns(cols => cols.filter((_, i) => i !== idx));
    if (editingIdx === idx) {
      setEditingIdx(null);
      setEditValue("");
    }
  };

  const handleHintsClick = (idx) => {
    setHintsModalIdx(idx);
    setHintsDraft({
      beginner: columns[idx].hints?.beginner || "",
      intermediate: columns[idx].hints?.intermediate || "",
      expert: columns[idx].hints?.expert || "",
    });
  };
  const handleHintsChange = (field, value) => {
    setHintsDraft(draft => ({ ...draft, [field]: value }));
  };
  const handleHintsSave = () => {
    setColumns(cols => cols.map((col, i) =>
      i === hintsModalIdx ? { ...col, hints: { ...hintsDraft } } : col
    ));
    setHintsModalIdx(null);
  };
  const handleHintsClose = () => {
    setHintsModalIdx(null);
  };

  const handleSave = async () => {
    try {
      await pipelineAPI.save(columns);
      alert('Pipeline saved!');
      // Refresh the pipeline data after saving
      const pipelineRes = await pipelineAPI.get();
      if (pipelineRes.data && pipelineRes.data.columns) {
        setColumns(pipelineRes.data.columns);
      }
    } catch (error) {
      console.error('Error saving pipeline:', error);
      alert('Failed to save pipeline');
    }
  };



  return (
    <div className="automate-container">
      <aside className="automate-sidebar">
        <div className="automate-sidebar-title">PIPELINE</div>
        <div className="automate-lead-sources">
          <div className="automate-lead-source-box">
            <div className="automate-lead-source-title">Incoming leads <span className="automate-toggle on" /></div>
            <div className="automate-lead-source-desc">Keep your pipeline cleaner by adding this pre-pipeline stage, which allows you to accept or decline potential leads</div>
          </div>
          <div className="automate-lead-source-box">
            <div className="automate-lead-source-title">Duplicate control <span className="automate-toggle" /></div>
            <div className="automate-lead-source-desc">Choose how the system detects and deals with duplicate incoming leads</div>
            <a className="automate-lead-source-link" href="#">Set up rules</a>
          </div>
          <div className="automate-lead-source-box automate-lead-source-messenger">
            <div className="automate-messenger-icon">🟩</div>
            <div>
              <div className="automate-lead-source-title">Admin Demo</div>
              <div className="automate-lead-source-desc">Messenger</div>
            </div>
          </div>
          <button className="automate-add-source">+ Add source</button>
        </div>
        <div className="automate-scoring">
          <div className="automate-scoring-title">SCORING</div>
          <div className="automate-scoring-desc">Lead scoring allows you to assign each lead a value that represents the probability of closing it successfully</div>
          <a className="automate-lead-source-link" href="#">Setup</a>
        </div>
      </aside>
      <main className="automate-main">
        <div className="automate-main-header">
          <button className="automate-back-btn" onClick={() => navigate('/leads')}>Back</button>
          <button className="automate-save-btn" onClick={handleSave}>Save</button>
        </div>
        <div className="automate-kanban-wrapper">
          <div className="automate-kanban">
            {columns.map((col, idx) => (
              <div className={`automate-kanban-col${col.key === "incoming" ? " automate-kanban-col-incoming" : ""}`} key={col.key}>
                <div className="automate-kanban-col-title">
                  {col.isEditing ? (
                    <input
                      className="automate-addstage-input"
                      type="text"
                      value={editValue}
                      onChange={handleEditChange}
                      onBlur={() => handleEditBlur(idx)}
                      onKeyDown={e => handleEditKeyDown(e, idx)}
                      autoFocus
                    />
                  ) : (
                    <span onDoubleClick={() => handleEditStart(idx, col.label)}>{col.label}</span>
                  )}
                  <span className="automate-kanban-col-plus" onClick={() => handlePlusClick(idx)}>+</span>
                  {idx !== 0 && (
                    <span className="automate-kanban-col-delete" onClick={() => handleDelete(idx)} title="Delete pipeline"><FaTrash /></span>
                  )}
                </div>
                {(() => {
                  const hints = col.hints || {};
                  const hintCount = [hints.beginner, hints.intermediate, hints.expert].filter(Boolean).length;
                  if (hintCount > 0) {
                    return (
                      <div className="automate-kanban-col-hint" onClick={() => handleHintsClick(idx)}>
                        {hintCount} hint{hintCount > 1 ? 's' : ''}
                      </div>
                    );
                  } else if (col.hint) {
                    return (
                      <div className="automate-kanban-col-hint" onClick={() => handleHintsClick(idx)}>{col.hint}</div>
                    );
                  } else {
                    return null;
                  }
                })()}
              </div>
            ))}
          </div>
        </div>
        {hintsModalIdx !== null && (
          <HintsModal
            stage={columns[hintsModalIdx].label}
            hints={hintsDraft}
            onChange={handleHintsChange}
            onClose={handleHintsClose}
            onSave={handleHintsSave}
          />
        )}
      </main>
    </div>
  );
}
