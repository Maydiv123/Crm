import React, { useState } from 'react';
import './Task.css';

export default function Notes({ leadId }) {
  const [notes, setNotes] = useState([
    { id: 1, text: 'First note for this lead', date: '2024-07-19' },
    { id: 2, text: 'Follow up next week', date: '2024-07-20' },
  ]);
  const [newNote, setNewNote] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState('');

  const handleAdd = () => {
    if (!newNote.trim()) return;
    setNotes([
      ...notes,
      { id: Date.now(), text: newNote, date: new Date().toISOString().slice(0, 10) },
    ]);
    setNewNote('');
  };
  const handleDelete = (id) => setNotes(notes.filter(n => n.id !== id));
  const handleEdit = (id, text) => {
    setEditingId(id);
    setEditText(text);
  };
  const handleEditSave = (id) => {
    setNotes(notes.map(n => n.id === id ? { ...n, text: editText } : n));
    setEditingId(null);
    setEditText('');
  };
  return (
    <div className="crm-task-wrapper">
      <div className="crm-task-header">
        <span>Notes</span>
      </div>
      <div style={{marginBottom:12}}>
        <textarea
          className="crm-task-input"
          placeholder="Add a note..."
          value={newNote}
          onChange={e => setNewNote(e.target.value)}
          style={{width:'100%',minHeight:48}}
        />
        <button className="crm-task-save-btn" style={{marginTop:4}} onClick={handleAdd}>Add Note</button>
      </div>
      <ul className="crm-task-list">
        {notes.map(note => (
          <li key={note.id} className="crm-task-item">
            <div className="crm-task-main">
              <div className="crm-task-title" style={{fontWeight:500}}>Note</div>
              <div className="crm-task-desc">
                {editingId === note.id ? (
                  <>
                    <textarea
                      className="crm-task-input"
                      value={editText}
                      onChange={e => setEditText(e.target.value)}
                      style={{width:'100%',minHeight:36}}
                    />
                    <button className="crm-task-save-btn" style={{marginTop:4,marginRight:6}} onClick={()=>handleEditSave(note.id)}>Save</button>
                    <button className="crm-task-delete-btn" style={{marginTop:4}} onClick={()=>setEditingId(null)}>Cancel</button>
                  </>
                ) : (
                  <>{note.text}</>
                )}
              </div>
              <div className="crm-task-meta">{note.date}</div>
            </div>
            <div className="crm-task-actions">
              {editingId !== note.id && (
                <>
                  <button className="crm-task-save-btn" onClick={()=>handleEdit(note.id, note.text)} style={{marginBottom:4}}>Edit</button>
                  <button className="crm-task-delete-btn" onClick={()=>handleDelete(note.id)}>Delete</button>
                </>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
} 