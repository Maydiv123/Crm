import React, { useEffect, useState } from 'react';
import './Task.css';

// Static user list for assignment
const users = [
  { id: 1, name: 'Abhishek Kumar' },
  { id: 2, name: 'Ayush Singh' },
  { id: 3, name: 'Komal Sharma' },
];

// Dummy tasksAPI (replace with your actual API import)
import { tasksAPI } from '../services/api';

export default function Task({ leadId }) {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    title: '',
    description: '',
    due_date: '',
    assigned_to: users[0].id,
  });
  const [error, setError] = useState('');

  // Fetch tasks for this lead
  useEffect(() => {
    setLoading(true);
    tasksAPI.getAll().then(res => {
      if (res.data && res.data.tasks) {
        setTasks(res.data.tasks.filter(t => t.leadId === leadId));
      }
    }).catch(() => setTasks([])).finally(() => setLoading(false));
  }, [leadId]);

  // Add new task
  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) {
      setError('Title is required');
      return;
    }
    setError('');
    try {
      const res = await tasksAPI.create({ ...form, leadId });
      setTasks([...tasks, res.data]);
      setForm({ title: '', description: '', due_date: '', assigned_to: users[0].id });
      setShowForm(false);
      window.dispatchEvent(new CustomEvent('tasks-updated'));
    } catch (err) {
      setError('Failed to add task');
    }
  };

  // Update status
  const handleStatusChange = async (task, status) => {
    try {
      await tasksAPI.update(task.id, { ...task, status });
      setTasks(tasks.map(t => t.id === task.id ? { ...t, status } : t));
      window.dispatchEvent(new CustomEvent('tasks-updated'));
    } catch {}
  };

  // Delete task
  const handleDelete = async (taskId) => {
    try {
      await tasksAPI.delete(taskId);
      setTasks(tasks.filter(t => t.id !== taskId));
      window.dispatchEvent(new CustomEvent('tasks-updated'));
    } catch {}
  };

  return (
    <div className="crm-task-wrapper">
      <div className="crm-task-header">
        <span>Tasks</span>
        <button className="crm-task-add-btn" onClick={() => setShowForm(f => !f)}>
          {showForm ? 'Cancel' : '+ Add Task'}
        </button>
      </div>
      {showForm && (
        <form className="crm-task-form" onSubmit={handleAddTask}>
          <input
            className="crm-task-input"
            placeholder="Title"
            value={form.title}
            onChange={e => setForm({ ...form, title: e.target.value })}
            required
          />
          <textarea
            className="crm-task-input"
            placeholder="Description"
            value={form.description}
            onChange={e => setForm({ ...form, description: e.target.value })}
          />
          <input
            className="crm-task-input"
            type="date"
            value={form.due_date}
            onChange={e => setForm({ ...form, due_date: e.target.value })}
          />
          <select
            className="crm-task-input"
            value={form.assigned_to}
            onChange={e => setForm({ ...form, assigned_to: e.target.value })}
          >
            {users.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
          </select>
          {error && <div className="crm-task-error">{error}</div>}
          <button className="crm-task-save-btn" type="submit">Save</button>
        </form>
      )}
      {loading ? (
        <div className="crm-task-loading">Loading...</div>
      ) : tasks.length === 0 ? (
        <div className="crm-task-empty">No tasks for this lead.</div>
      ) : (
        <ul className="crm-task-list">
          {tasks.map(task => (
            <li key={task.id} className={`crm-task-item crm-task-status-${task.status || 'pending'}`}>
              <div className="crm-task-main">
                <div className="crm-task-title">{task.title}</div>
                <div className="crm-task-desc">{task.description}</div>
                <div className="crm-task-meta">
                  <span>Due: {task.due_date || 'N/A'}</span>
                  <span>Assigned: {users.find(u => u.id == task.assigned_to)?.name || 'N/A'}</span>
                </div>
              </div>
              <div className="crm-task-actions">
                <select
                  value={task.status || 'pending'}
                  onChange={e => handleStatusChange(task, e.target.value)}
                  className="crm-task-status-select"
                >
                  <option value="pending">Pending</option>
                  <option value="done">Done</option>
                </select>
                <button className="crm-task-delete-btn" onClick={() => handleDelete(task.id)}>Delete</button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
