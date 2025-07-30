import React from 'react';
import { FaUser, FaCalendar, FaClock, FaTag, FaFlag, FaCheckCircle, FaTimes, FaEdit, FaTrash } from 'react-icons/fa';
import './TaskDetailsModal.css';

const TaskDetailsModal = ({ task, isOpen, onClose, onEdit, onDelete }) => {
  if (!isOpen || !task) return null;

  const formatDate = (dateString) => {
    if (!dateString) return 'Not set';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (timeString) => {
    if (!timeString) return 'Not set';
    return timeString;
  };

  const getPriorityColor = (priority) => {
    switch (priority?.toLowerCase()) {
      case 'high': return '#ff6b6b';
      case 'medium': return '#ffa726';
      case 'low': return '#66bb6a';
      default: return '#667eea';
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed': return '#66bb6a';
      case 'in progress': return '#ffa726';
      case 'pending': return '#ff6b6b';
      default: return '#667eea';
    }
  };

  return (
    <div className="task-details-overlay" onClick={onClose}>
      <div className="task-details-content" onClick={(e) => e.stopPropagation()}>
        <div className="task-details-header">
          <h2 className="task-details-title">{task.title}</h2>
          <div className="task-details-actions">
            <button className="task-details-action-btn edit" onClick={() => onEdit(task)}>
              <FaEdit />
            </button>
            <button className="task-details-action-btn delete" onClick={() => onDelete(task.id)}>
              <FaTrash />
            </button>
            <button className="task-details-close" onClick={onClose}>
              <FaTimes />
            </button>
          </div>
        </div>

        <div className="task-details-body">
          <div className="task-details-section">
            <h3 className="task-details-section-title">Task Information</h3>
            <div className="task-details-grid">
              <div className="task-details-item">
                <FaUser className="task-details-icon" />
                <div className="task-details-info">
                  <label>Created By</label>
                  <span>{task.created_by || task.assigned_to || 'Unknown'}</span>
                </div>
              </div>

              <div className="task-details-item">
                <FaCalendar className="task-details-icon" />
                <div className="task-details-info">
                  <label>Due Date</label>
                  <span>{formatDate(task.due_date)}</span>
                </div>
              </div>

              <div className="task-details-item">
                <FaClock className="task-details-icon" />
                <div className="task-details-info">
                  <label>Due Time</label>
                  <span>{formatTime(task.due_time)}</span>
                </div>
              </div>

              <div className="task-details-item">
                <FaTag className="task-details-icon" />
                <div className="task-details-info">
                  <label>Type</label>
                  <span>{task.type || 'General'}</span>
                </div>
              </div>

              <div className="task-details-item">
                <FaFlag className="task-details-icon" />
                <div className="task-details-info">
                  <label>Priority</label>
                  <span style={{ color: getPriorityColor(task.priority) }}>
                    {task.priority || 'Normal'}
                  </span>
                </div>
              </div>

              <div className="task-details-item">
                <FaCheckCircle className="task-details-icon" />
                <div className="task-details-info">
                  <label>Status</label>
                  <span style={{ color: getStatusColor(task.status) }}>
                    {task.status || 'Pending'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {task.description && (
            <div className="task-details-section">
              <h3 className="task-details-section-title">Description</h3>
              <div className="task-details-description">
                {task.description}
              </div>
            </div>
          )}

          <div className="task-details-section">
            <h3 className="task-details-section-title">Additional Details</h3>
            <div className="task-details-grid">
              <div className="task-details-item">
                <div className="task-details-info">
                  <label>Created At</label>
                  <span>{formatDate(task.created_at)}</span>
                </div>
              </div>

              <div className="task-details-item">
                <div className="task-details-info">
                  <label>Last Updated</label>
                  <span>{formatDate(task.updated_at)}</span>
                </div>
              </div>

              {task.assigned_to && (
                <div className="task-details-item">
                  <div className="task-details-info">
                    <label>Assigned To</label>
                    <span>{task.assigned_to}</span>
                  </div>
                </div>
              )}

              {task.pipeline && (
                <div className="task-details-item">
                  <div className="task-details-info">
                    <label>Pipeline</label>
                    <span>{task.pipeline}</span>
                  </div>
                </div>
              )}

              {task.stage && (
                <div className="task-details-item">
                  <div className="task-details-info">
                    <label>Stage</label>
                    <span>{task.stage}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="task-details-footer">
          <button className="task-details-btn secondary" onClick={onClose}>
            Close
          </button>
          <button className="task-details-btn primary" onClick={() => onEdit(task)}>
            Edit Task
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskDetailsModal; 