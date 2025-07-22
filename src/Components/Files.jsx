import React, { useRef, useState } from 'react';
import './Task.css';

export default function Files({ leadId }) {
  const [files, setFiles] = useState([
    { id: 1, name: 'contract.pdf', size: '2.5MB', date: '2024-07-19' },
    { id: 2, name: 'design.png', size: '1.2MB', date: '2024-07-20' },
  ]);
  const fileInput = useRef();

  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setFiles([
      ...files,
      { id: Date.now(), name: file.name, size: (file.size/1024/1024).toFixed(1) + 'MB', date: new Date().toISOString().slice(0,10) },
    ]);
    fileInput.current.value = '';
  };
  const handleDelete = (id) => setFiles(files.filter(f => f.id !== id));
  return (
    <div className="crm-task-wrapper">
      <div className="crm-task-header">
        <span>Files</span>
      </div>
      <div style={{marginBottom:12}}>
        <input type="file" ref={fileInput} style={{marginBottom:8}} onChange={handleUpload} />
      </div>
      <ul className="crm-task-list">
        {files.map(file => (
          <li key={file.id} className="crm-task-item">
            <div className="crm-task-main">
              <div className="crm-task-title" style={{fontWeight:500}}>{file.name}</div>
              <div className="crm-task-meta">{file.size} • {file.date}</div>
            </div>
            <div className="crm-task-actions">
              <button className="crm-task-delete-btn" onClick={()=>handleDelete(file.id)}>Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
} 