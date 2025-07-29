import React, { useState } from "react";
import { FaCog, FaEdit, FaPlus, FaUsers, FaEye, FaEyeSlash, FaCalendar } from "react-icons/fa";
import { BsThreeDotsVertical } from "react-icons/bs";
import { FaTrash } from "react-icons/fa";
import "./Dashboard.css";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import axios from 'axios';
import { DndContext, closestCenter } from '@dnd-kit/core';
import { SortableContext, useSortable, arrayMove, horizontalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { usersAPI, tasksAPI } from '../services/api.js';
import UserCalendar from './UserCalendar.jsx';


const widgetStyles = [
  { id: 1, color: '#222', bg: '#fff' },
  { id: 2, color: '#fff', bg: '#222' },
  { id: 3, color: '#fff', bg: '#000' },
  { id: 4, color: '#fff', bg: '#2d2d6a' },
  { id: 5, color: '#fff', bg: '#3a3a7a' },
];
const bgImages = [
  'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1465101178521-c1a9136a3b99?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1465101178521-c1a9136a3b99?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1465101178521-c1a9136a3b99?auto=format&fit=crop&w=400&q=80',
];

function SortableCard({ card, idx, children }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: idx });
  return (
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 10 : undefined,
        boxShadow: isDragging ? '0 8px 32px #00968855, 0 2.5px 12px #00968822' : undefined,
      }}
      {...attributes}
      {...listeners}
    >
      {children}
    </div>
  );
}

export default function Dashboard() {
  const [showSetup, setShowSetup] = useState(false);
  const [applyAll, setApplyAll] = useState(false);
  const [font, setFont] = useState('light');
  const [widget, setWidget] = useState(1);
  const [bg, setBg] = useState(0);
  const [customBg, setCustomBg] = useState(null);
  const [editIndex, setEditIndex] = useState(null);
  const [editData, setEditData] = useState({ title: '', note: '', image: '' });
  const [cards, setCards] = useState([
    { title: 'INCOMING MESSAGES', note: '', image: '', type: 'messages' },
    { title: 'ONGOING CONVERSATIONS', note: '', image: '', type: 'ongoing' },
    { title: 'UNANSWERED CONVERSATIONS', note: '', image: '', type: 'unanswered' },
    { title: 'LEAD SOURCES', note: '', image: '', type: 'leadsources' },
    { title: 'MEDIAN REPLY TIME', note: '', image: '', type: 'median' },
    { title: 'LONGEST AWAITING REPLY', note: '', image: '', type: 'awaiting' },
    { title: 'WON LEADS', note: '', image: '', type: 'won' },
    { title: 'ACTIVE LEADS', note: '', image: '', type: 'active' },
    { title: 'TASKS', note: '', image: '', type: 'tasks' },
    { title: 'LOST LEADS', note: '', image: '', type: 'lost' },
    { title: 'LEADS WITHOUT TASKS', note: '', image: '', type: 'withouttasks' },
  ]);
  const [isAdding, setIsAdding] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showAssignTask, setShowAssignTask] = useState(false);
  const [showEmployeeManagement, setShowEmployeeManagement] = useState(false);
  const [employees, setEmployees] = useState([]);
  const [showAddUserForm, setShowAddUserForm] = useState(false);
  const [userFormData, setUserFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'employee'
  });
  const [showPassword, setShowPassword] = useState(false);
  const [userLoading, setUserLoading] = useState(false);
  const [userError, setUserError] = useState('');
  const [userSuccess, setUserSuccess] = useState('');
  const [assignableUsers, setAssignableUsers] = useState([]);
  const [taskForm, setTaskForm] = useState({ 
    title: '', 
    description: '', 
    due_date: '', 
    assigned_to: '', 
    type: 'Follow up' 
  });
  const [taskLoading, setTaskLoading] = useState(false);
  const [taskError, setTaskError] = useState('');
  const [taskSuccess, setTaskSuccess] = useState('');
  const [showUserCalendar, setShowUserCalendar] = useState(false);
  const [selectedUserForCalendar, setSelectedUserForCalendar] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState(null);
  const [dashboardStats, setDashboardStats] = useState({
    stageStats: [],
    statusStats: [],
    totalLeads: 0,
    totalAmount: 0,
    wonLeads: 0,
    lostLeads: 0,
    activeLeads: 0,
  });

  const users = ['Abhishek', 'Akash', 'Priya', 'Admin'];

  // User management functions
  const fetchEmployees = async () => {
    try {
      setUserLoading(true);
      console.log('Fetching employees...');
      const token = localStorage.getItem('token');
      console.log('Token for employees:', !!token);
      
      const response = await usersAPI.getEmployees();
      console.log('Employees response:', response.data);
      setEmployees(response.data);
    } catch (error) {
      setUserError('Failed to fetch users');
      console.error('Fetch users error:', error);
      console.error('Error details:', error.response?.data);
      console.error('Error status:', error.response?.status);
      
      // If API fails, try to use the users we know exist
      console.log('API failed, using known users from database');
      setEmployees([
        { id: 1, name: 'sah', email: 'sah@gmail.com', role: 'employee', isActive: 1, createdAt: '2025-07-27' },
        { id: 2, name: 'anil', email: 'anil@gmail.com', role: 'employee', isActive: 1, createdAt: '2025-07-27' },
        { id: 3, name: 'Abhishek kumar', email: 'akay13230@gmail.com', role: 'employee', isActive: 1, createdAt: '2025-07-25' },
        { id: 4, name: 'Abhishek kumar', email: 'ajay@gmail.com', role: 'employee', isActive: 1, createdAt: '2025-07-19' }
      ]);
    } finally {
      setUserLoading(false);
    }
  };

  const handleUserFormChange = (e) => {
    const { name, value } = e.target;
    setUserFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    setUserLoading(true);
    setUserError('');
    setUserSuccess('');

    try {
      const response = await usersAPI.createEmployee(userFormData);
      setUserSuccess(`${userFormData.role.charAt(0).toUpperCase() + userFormData.role.slice(1)} created successfully!`);
      setUserFormData({ name: '', email: '', password: '', role: 'employee' });
      setShowAddUserForm(false);
      fetchEmployees();
    } catch (error) {
      setUserError(error.response?.data?.message || 'Failed to create user');
    } finally {
      setUserLoading(false);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) {
      return;
    }

    try {
      await usersAPI.delete(userId);
      setUserSuccess('User deleted successfully!');
      fetchEmployees();
    } catch (error) {
      setUserError('Failed to delete user');
    }
  };

  const handleViewCalendar = (user) => {
    setSelectedUserForCalendar(user);
    setShowUserCalendar(true);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const role = user.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : '';
  const email = user.email || '';

  const fetchAssignableUsers = async () => {
    try {
      console.log('Fetching assignable users...');
      const token = localStorage.getItem('token');
      console.log('Token available:', !!token);
      
      const response = await tasksAPI.getAssignableUsers();
      console.log('Assignable users response:', response.data);
      setAssignableUsers(response.data);
    } catch (error) {
      console.error('Failed to fetch assignable users:', error);
      console.error('Error details:', error.response?.data);
      console.error('Error status:', error.response?.status);
      
      // Use employees data as fallback
      if (employees.length > 0) {
        console.log('Using employees as fallback for assignable users');
        setAssignableUsers(employees);
      } else {
        console.log('No employees available for fallback');
        // Don't set dummy data, let it be empty
        setAssignableUsers([]);
      }
    }
  };

  const handleTaskFormChange = (e) => {
    const { name, value } = e.target;
    setTaskForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleAssignTask = async (e) => {
    e.preventDefault();
    setTaskLoading(true);
    setTaskError('');
    setTaskSuccess('');

    try {
      console.log('Submitting task form:', taskForm);
      console.log('Token available:', !!localStorage.getItem('token'));
      
      const response = await tasksAPI.create(taskForm);
      console.log('Task creation response:', response);
      
      setTaskSuccess('Task assigned successfully!');
      setTaskForm({ 
        title: '', 
        description: '', 
        due_date: '', 
        assigned_to: '', 
        type: 'Follow up' 
      });
      setShowAssignTask(false);
    } catch (error) {
      console.error('Task assignment error:', error);
      console.error('Error response:', error.response);
      console.error('Error message:', error.message);
      setTaskError(error.response?.data?.message || 'Failed to assign task');
    } finally {
      setTaskLoading(false);
    }
  };

  const menuOptions = [
    'Employee Management',
    'Active leads',
    'Average reply time',
    'Pipeline Report',
    'Goals',
    'Last uploads',
    'Prospective Sales',
    'NPS',
    'Online',
    'Total conversations processed',
    'Outgoing messages',
    'Average response time',
    'Add new widget',
  ];

  const widgetTemplates = {
    'Active leads': { title: 'ACTIVE LEADS', note: '', image: '', type: 'active', value: '0' },
    'Average reply time': { title: 'AVERAGE REPLY TIME', note: '', image: '', type: 'avg_reply', value: '0' },
    'Pipeline Report': { title: 'PIPELINE REPORT', note: '', image: '', type: 'pipeline_report', value: '0' },
    'Goals': { title: 'GOALS', note: '', image: '', type: 'goals', value: '0' },
    'Last uploads': { title: 'LAST UPLOADS', note: '', image: '', type: 'last_uploads', value: '0' },
    'Prospective Sales': { title: 'PROSPECTIVE SALES', note: '', image: '', type: 'prospective_sales', value: '0' },
    'NPS': { title: 'NPS', note: '', image: '', type: 'nps', value: '0' },
    'Online': { title: 'ONLINE', note: '', image: '', type: 'online', value: '0' },
    'Total conversations processed': { title: 'TOTAL CONVERSATIONS PROCESSED', note: '', image: '', type: 'total_conversations', value: '0' },
    'Outgoing messages': { title: 'OUTGOING MESSAGES', note: '', image: '', type: 'outgoing', value: '0' },
    'Average response time': { title: 'AVERAGE RESPONSE TIME', note: '', image: '', type: 'avg_response', value: '0' },
    'Add new widget': { title: 'NEW WIDGET', note: '', image: '', type: 'custom', value: '0' },
  };

  React.useEffect(() => {
    if (!isMenuOpen) return;
    const handleClick = (e) => {
      if (!e.target.closest('.dashboard-menu-btn') && !e.target.closest('.dashboard-menu-dropdown')) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [isMenuOpen]);

  React.useEffect(() => {
    async function fetchStats() {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('/api/leads/stats/overview', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        console.log('DASHBOARD API RESPONSE:', res.data); // Debug line added
        // Use statusStats for accurate counts
        let won = 0, lost = 0, active = 0;
        if (res.data.statusStats) {
          res.data.statusStats.forEach(s => {
            if (s.status === 'won') won += Number(s.count);
            else if (s.status === 'lost') lost += Number(s.count);
            else if (s.status === 'active') active += Number(s.count);
          });
        }
        setDashboardStats({
          ...res.data,
          wonLeads: won,
          lostLeads: lost,
          activeLeads: active,
        });
      } catch (err) {
        console.log('Stats fetch failed, using fallback data');
        // fallback: show zeroes
        setDashboardStats({
          stageStats: [],
          statusStats: [],
          totalLeads: 0,
          totalAmount: 0,
          wonLeads: 0,
          lostLeads: 0,
          activeLeads: 0,
        });
      }
    }
    fetchStats();
    fetchEmployees(); // Fetch users when component mounts
    fetchAssignableUsers(); // Fetch assignable users when component mounts
  }, []);

  // Update assignable users when employees are loaded
  React.useEffect(() => {
    if (employees.length > 0 && assignableUsers.length === 0) {
      console.log('Employees loaded, updating assignable users');
      setAssignableUsers(employees);
    }
  }, [employees, assignableUsers.length]);

  const handleEdit = (idx) => {
    setEditIndex(idx);
    setEditData({
      title: cards[idx].title,
      note: cards[idx].note || '',
      image: cards[idx].image || '',
    });
  };

  const handleEditChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'image' && files && files[0]) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setEditData((prev) => ({ ...prev, image: ev.target.result }));
      };
      reader.readAsDataURL(files[0]);
    } else {
      setEditData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleEditSave = () => {
    setCards((prev) =>
      prev.map((c, i) =>
        i === editIndex ? { ...c, ...editData } : c
      )
    );
    setEditIndex(null);
  };

  const handleEditCancel = () => {
    setEditIndex(null);
  };

  const handleCustomBgUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setCustomBg(event.target.result);
        setBg(-1); // Use custom background
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveCustomBg = () => {
    setCustomBg(null);
    setBg(0); // Reset to default background
  };

  const handleAdd = () => {
    setIsAdding(true);
    setEditData({ title: '', note: '', image: '' });
    setEditIndex(null);
  };

  const handleAddSave = () => {
    setCards((prev) => [...prev, { ...editData, type: 'custom' }]);
    setIsAdding(false);
  };

  const handleAddCancel = () => {
    setIsAdding(false);
  };

  const handleMenuSelect = (opt) => {
    setIsMenuOpen(false);
    
    if (opt === 'Employee Management') {
      setShowEmployeeManagement(true);
      return;
    }
    
    // Prevent duplicate cards by type
    if (cards.some(card => card.type === widgetTemplates[opt].type)) return;
    setCards(prev => [...prev, widgetTemplates[opt]]);
  };

  const handleDelete = (idx) => {
    console.log('Delete button clicked for index:', idx);
    setDeleteIndex(idx);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = () => {
    if (deleteIndex !== null) {
      setCards(prev => prev.filter((_, i) => i !== deleteIndex));
      setShowDeleteConfirm(false);
      setDeleteIndex(null);
    }
  };

  const cancelDelete = () => {
    setShowDeleteConfirm(false);
    setDeleteIndex(null);
  };

  // Drag and drop handler for dnd-kit
  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      setCards((items) => {
        const oldIndex = items.findIndex((_, i) => i === active.id);
        const newIndex = items.findIndex((_, i) => i === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  return (
    <div className="dashboard-bg" style={
      bg === -1 && customBg ? 
        { backgroundImage: `url(${customBg})`, backgroundSize: 'cover', backgroundPosition: 'center' } : 
        bgImages[bg] ? 
          { backgroundImage: `url(${bgImages[bg]})`, backgroundSize: 'cover', backgroundPosition: 'center' } : 
          {}
    }>
      {showSetup && (
        <div className="dashboard-setup-panel">
          <div className="dashboard-setup-row">
            <label><input type="checkbox" checked={applyAll} onChange={e => setApplyAll(e.target.checked)} /> Apply dashboard settings to all users</label>
          </div>
          <div className="dashboard-setup-row dashboard-setup-font">
            <span>Light font</span>
            <label className="dashboard-switch">
              <input type="checkbox" checked={font === 'dark'} onChange={() => setFont(font === 'light' ? 'dark' : 'light')} />
              <span className="dashboard-slider"></span>
            </label>
            <span>Dark font</span>
          </div>
          <div className="dashboard-setup-row">
            <div className="dashboard-setup-label">Widget style</div>
            <div className="dashboard-setup-widget-list">
              {widgetStyles.map((w, i) => (
                <div
                  key={w.id}
                  className={`dashboard-setup-widget ${widget === w.id ? 'active' : ''}`}
                  style={{ background: w.bg, color: w.color }}
                  onClick={() => setWidget(w.id)}
                >
                  <span style={{ fontSize: 18 }}>•••</span>
                </div>
              ))}
            </div>
          </div>
          <div className="dashboard-setup-row">
            <div className="dashboard-setup-label">Background image</div>
            <div className="dashboard-setup-bg-list">
              {bgImages.map((img, i) => (
                <div
                  key={i}
                  className={`dashboard-setup-bg ${bg === i ? 'active' : ''}`}
                  style={{ backgroundImage: `url(${img})` }}
                  onClick={() => setBg(i)}
                />
              ))}
              <div className="dashboard-setup-bg custom-upload">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleCustomBgUpload}
                  id="custom-bg-upload"
                  style={{ display: 'none' }}
                />
                <label htmlFor="custom-bg-upload" style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%', color: '#fff', fontSize: '1.5rem' }}>
                  📁
                </label>
              </div>
              {customBg && (
                <div className="dashboard-setup-bg custom-bg">
                  <img src={customBg} alt="Custom" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 'inherit' }} />
                  <button 
                    onClick={handleRemoveCustomBg}
                    style={{ position: 'absolute', top: '-8px', right: '-8px', background: '#f44336', color: '#fff', border: 'none', borderRadius: '50%', width: '24px', height: '24px', cursor: 'pointer', fontSize: '12px' }}
                  >
                    ×
                  </button>
                </div>
              )}
            </div>
          </div>
          <div className="dashboard-setup-actions">
            <button className="dashboard-setup-cancel" onClick={() => setShowSetup(false)}>Cancel</button>
            <button className="dashboard-setup-save" onClick={() => setShowSetup(false)}>Save</button>
          </div>
        </div>
      )}
      <header className="dashboard-header">
        <div className="dashboard-logo">{role}</div>
        <div className="dashboard-email" style={{marginLeft: 16, fontWeight: 500, color: '#1abc9c'}}>{email}</div>
        <input className="dashboard-search" placeholder="Search" />
        <button className="dashboard-events-btn" onClick={() => {
          setShowAssignTask(true);
          // Refresh assignable users when opening modal
          if (employees.length > 0) {
            setAssignableUsers(employees);
          }
        }}>ASSIGN TASK</button>
        <button className="dashboard-employees-btn" onClick={() => setShowEmployeeManagement(true)}>
          <FaUsers /> EMPLOYEES
        </button>
        <button className="dashboard-menu-btn" onClick={() => setIsMenuOpen((v) => !v)}><BsThreeDotsVertical /></button>
        {isMenuOpen && (
          <div className="dashboard-menu-dropdown">
            {menuOptions.map((opt, i) => (
              <div className="dashboard-menu-option" key={i} onClick={() => handleMenuSelect(opt)}>{opt}</div>
            ))}
          </div>
        )}
      </header>
      {showAssignTask && (
        <div className="dashboard-events-overlay">
          <div className="dashboard-events-content">
            <div className="dashboard-events-header">
              <h2>Assign Task</h2>
              <button className="dashboard-events-close" onClick={() => setShowAssignTask(false)}>×</button>
            </div>
            
            {taskError && <div className="dashboard-employee-error">{taskError}</div>}
            {taskSuccess && <div className="dashboard-employee-success">{taskSuccess}</div>}
            
            <form className="dashboard-event-form" onSubmit={handleAssignTask}>
              <div className="form-group">
                <label>📋 Task Title:</label>
                <input 
                  name="title" 
                  placeholder="Enter task title" 
                  value={taskForm.title} 
                  onChange={handleTaskFormChange} 
                  required 
                />
              </div>
              
              <div className="form-group">
                <label>📝 Description:</label>
                <textarea 
                  name="description" 
                  placeholder="Enter detailed task description..." 
                  value={taskForm.description} 
                  onChange={handleTaskFormChange}
                  rows="4"
                />
              </div>
              
              <div className="form-group">
                <label>👤 Assign To:</label>
                                  <select 
                    name="assigned_to" 
                    value={taskForm.assigned_to} 
                    onChange={handleTaskFormChange} 
                    required
                  >
                    <option value="">Select User</option>
                    {assignableUsers.length > 0 ? (
                      assignableUsers.map(user => (
                        <option key={user.id} value={user.id}>
                          {user.name} ({user.role.charAt(0).toUpperCase() + user.role.slice(1)}) - {user.email}
                        </option>
                      ))
                    ) : (
                      <option value="" disabled>No users available</option>
                    )}
                  </select>
                  {assignableUsers.length === 0 && (
                    <small style={{ color: '#e74c3c', marginTop: '4px', display: 'block' }}>
                      No users available for assignment. Please create users first.
                    </small>
                  )}
                  {assignableUsers.length > 0 && (
                    <small style={{ color: '#27ae60', marginTop: '4px', display: 'block' }}>
                      {assignableUsers.length} user(s) available for assignment
                    </small>
                  )}
              </div>
              
              <div className="form-group">
                <label>📅 Due Date:</label>
                <input 
                  name="due_date" 
                  type="date" 
                  value={taskForm.due_date} 
                  onChange={handleTaskFormChange} 
                />
              </div>
              
              <div className="form-group">
                <label>🏷️ Task Type:</label>
                <select 
                  name="type" 
                  value={taskForm.type} 
                  onChange={handleTaskFormChange}
                >
                  <option value="Follow up">📞 Follow up</option>
                  <option value="Meeting">🤝 Meeting</option>
                  <option value="Call">📱 Call</option>
                  <option value="Email">📧 Email</option>
                  <option value="Document">📄 Document</option>
                  <option value="Other">📋 Other</option>
                </select>
              </div>
              
              <div className="form-actions">
                <button type="submit" disabled={taskLoading} className="assign-btn">
                  {taskLoading ? '⏳ Assigning...' : '✅ Assign Task'}
                </button>
                <button 
                  type="button" 
                  onClick={() => setShowAssignTask(false)}
                  className="cancel-btn"
                >
                  ❌ Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      <div className="dashboard-content">
        <div className="dashboard-username">akay13230</div>
        <div className="dashboard-filters">
          <button>Today</button>
          <button>Yesterday</button>
          <button>Week</button>
          <button className="active">Month</button>
          <button>Time</button>
          <button>All</button>
          <select className="dashboard-select-user"><option>Select user</option></select>
          <button className="dashboard-setup-btn-unique" onClick={() => setShowSetup(true)}><FaCog className="dashboard-setup-btn-icon" /> Setup</button>
        </div>
        <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={cards.map((_, idx) => idx)} strategy={horizontalListSortingStrategy}>
            <div className="dashboard-grid">
              {cards.map((card, idx) => {
                let value = card.value || 0;
                if (card.type === 'won') value = dashboardStats.wonLeads;
                if (card.type === 'lost') value = dashboardStats.lostLeads;
                if (card.type === 'active') value = dashboardStats.activeLeads;
                return (
                  <SortableCard key={idx} card={card} idx={idx}>
                    <div className={`dashboard-card${card.type === 'messages' ? ' dashboard-card-messages' : ''}${card.type === 'leadsources' ? ' dashboard-card-leadsources' : ''}`}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div className="dashboard-card-title">{card.title}</div>
                        <div style={{ display: 'flex', gap: 8 }}>
                          <button 
                            className="dashboard-card-edit-btn" 
                            onMouseDown={(e) => {
                              e.preventDefault();
                              handleEdit(idx);
                            }}
                          >
                            <FaEdit />
                          </button>
                          <button 
                            className="dashboard-card-delete-btn" 
                            onMouseDown={(e) => {
                              e.preventDefault();
                              handleDelete(idx);
                            }}
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </div>
                      {card.image && <img src={card.image} alt="custom" style={{ width: '100%', borderRadius: 8, margin: '8px 0' }} />}
                      {card.type === 'messages' ? (
                        <>
                          <div className="dashboard-card-value">0 <span>this month</span></div>
                          <div className="dashboard-card-list">
                            <div><span className="dashboard-dot green" /> WhatsApp Cloud API <span className="dashboard-card-list-value">0</span></div>
                            <div><span className="dashboard-dot blue" /> Live chat <span className="dashboard-card-list-value">0</span></div>
                            <div><span className="dashboard-dot gray" /> Other <span className="dashboard-card-list-value">0</span></div>
                          </div>
                        </>
                      ) : card.type === 'leadsources' ? (
                        dashboardStats.stageStats && dashboardStats.stageStats.length > 0 ? (
                          <ResponsiveContainer width="100%" height={120}>
                            <BarChart data={dashboardStats.stageStats} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis dataKey="stage" tick={{ fontSize: 12 }} />
                              <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                              <Tooltip />
                              <Bar dataKey="count" fill="#1abc9c" radius={[6, 6, 0, 0]} />
                            </BarChart>
                          </ResponsiveContainer>
                        ) : (
                          <div className="dashboard-card-warning">⚠️ Not enough data to display</div>
                        )
                      ) : (
                        <div className="dashboard-card-value">{value}</div>
                      )}
                      {card.note && <div className="dashboard-card-note">{card.note}</div>}
                    </div>
                  </SortableCard>
                );
              })}
            </div>
          </SortableContext>
        </DndContext>
       
        {(editIndex !== null || isAdding) && (
          <div className="dashboard-edit-modal">
            <div className="dashboard-edit-modal-content">
              <h3>{isAdding ? 'Add Card' : 'Edit Card'}</h3>
              <label>Title:<input name="title" value={editData.title} onChange={handleEditChange} /></label>
              <label>Note:<textarea name="note" value={editData.note} onChange={handleEditChange} /></label>
              <label>Image:<input name="image" type="file" accept="image/*" onChange={handleEditChange} /></label>
              {editData.image && <img src={editData.image} alt="preview" style={{ width: '100%', borderRadius: 8, margin: '8px 0' }} />}
              <div style={{ display: 'flex', gap: 12, marginTop: 16 }}>
                <button onClick={isAdding ? handleAddSave : handleEditSave}>Save</button>
                <button onClick={isAdding ? handleAddCancel : handleEditCancel}>Cancel</button>
              </div>
            </div>
          </div>
        )}
        
        {showEmployeeManagement && (
          <div className="dashboard-employee-overlay">
            <div className="dashboard-employee-content">
              <div className="dashboard-employee-header">
                <h2>User Management</h2>
                <button className="dashboard-employee-close" onClick={() => setShowEmployeeManagement(false)}>×</button>
              </div>

              {userError && <div className="dashboard-employee-error">{userError}</div>}
              {userSuccess && <div className="dashboard-employee-success">{userSuccess}</div>}

              <div className="dashboard-employee-actions">
                <button 
                  className="dashboard-employee-add-btn"
                  onClick={() => setShowAddUserForm(true)}
                >
                  <FaPlus /> Add User
                </button>
              </div>

              {showAddUserForm && (
                <div className="dashboard-employee-form">
                  <h3>Add New User</h3>
                  <form onSubmit={handleCreateUser}>
                    <div className="form-group">
                      <label>Name:</label>
                      <input
                        type="text"
                        name="name"
                        value={userFormData.name}
                        onChange={handleUserFormChange}
                        required
                        placeholder="Enter user name"
                      />
                    </div>
                    
                    <div className="form-group">
                      <label>Email:</label>
                      <input
                        type="email"
                        name="email"
                        value={userFormData.email}
                        onChange={handleUserFormChange}
                        required
                        placeholder="Enter user email"
                      />
                    </div>
                    
                    <div className="form-group">
                      <label>Role:</label>
                      <select
                        name="role"
                        value={userFormData.role}
                        onChange={handleUserFormChange}
                        required
                      >
                        <option value="employee">Employee</option>
                        <option value="manager">Manager</option>
                      </select>
                    </div>
                    
                    <div className="form-group">
                      <label>Password:</label>
                      <div className="password-input-container">
                        <input
                          type={showPassword ? "text" : "password"}
                          name="password"
                          value={userFormData.password}
                          onChange={handleUserFormChange}
                          required
                          placeholder="Enter password (min 6 characters)"
                          minLength={6}
                        />
                        <button
                          type="button"
                          className="password-toggle-btn"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <FaEyeSlash /> : <FaEye />}
                        </button>
                      </div>
                    </div>

                    <div className="form-actions">
                      <button type="submit" disabled={userLoading}>
                        {userLoading ? 'Creating...' : 'Create User'}
                      </button>
                      <button 
                        type="button" 
                        onClick={() => {
                          setShowAddUserForm(false);
                          setUserFormData({ name: '', email: '', password: '', role: 'employee' });
                        }}
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              )}

              <div className="dashboard-employee-list">
                <h3>Current Users ({employees.length})</h3>
                
                {userLoading && <div className="dashboard-employee-loading">Loading users...</div>}
                
                {!userLoading && employees.length === 0 && (
                  <div className="dashboard-employee-empty">
                    No users found. Add your first user above.
                  </div>
                )}

                {!userLoading && employees.length > 0 && (
                  <div className="employee-table">
                    <div className="employee-table-header">
                      <div className="employee-table-cell">Name</div>
                      <div className="employee-table-cell">Email</div>
                      <div className="employee-table-cell">Role</div>
                      <div className="employee-table-cell">Status</div>
                      <div className="employee-table-cell">Created</div>
                      <div className="employee-table-cell">Actions</div>
                    </div>
                    
                    {employees.map((employee) => (
                      <div key={employee.id} className="employee-table-row">
                        <div className="employee-table-cell">
                          <div className="employee-name">
                            {employee.avatar && (
                              <img 
                                src={employee.avatar} 
                                alt={employee.name} 
                                className="employee-avatar"
                              />
                            )}
                            {employee.name}
                          </div>
                        </div>
                        <div className="employee-table-cell">{employee.email}</div>
                        <div className="employee-table-cell">
                          <span className={`role-badge ${employee.role || 'employee'}`}>
                            {employee.role ? employee.role.charAt(0).toUpperCase() + employee.role.slice(1) : 'Employee'}
                          </span>
                        </div>
                        <div className="employee-table-cell">
                          <span className={`status-badge ${employee.isActive ? 'active' : 'inactive'}`}>
                            {employee.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                        <div className="employee-table-cell">
                          {formatDate(employee.createdAt)}
                        </div>
                        <div className="employee-table-cell">
                          <div className="employee-actions">
                            <button 
                              className="action-btn calendar-btn"
                              onClick={() => handleViewCalendar(employee)}
                              title="View Calendar"
                            >
                              <FaCalendar />
                            </button>
                            <button 
                              className="action-btn delete-btn"
                              onClick={() => handleDeleteUser(employee.id)}
                              title="Delete User"
                            >
                              <FaTrash />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {showUserCalendar && selectedUserForCalendar && (
          <UserCalendar
            userId={selectedUserForCalendar.id}
            userName={selectedUserForCalendar.name}
            onClose={() => {
              setShowUserCalendar(false);
              setSelectedUserForCalendar(null);
            }}
          />
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <div className="dashboard-edit-modal">
            <div className="dashboard-edit-modal-content">
              <h3>🗑️ Delete Card</h3>
              <p>Are you sure you want to delete this card? This action cannot be undone.</p>
              <div style={{ display: 'flex', gap: 12, marginTop: 16 }}>
                <button 
                  onClick={confirmDelete}
                  style={{ 
                    background: '#f44336', 
                    color: '#fff',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '10px 20px',
                    cursor: 'pointer',
                    fontWeight: '600'
                  }}
                >
                  Delete
                </button>
                <button 
                  onClick={cancelDelete}
                  style={{ 
                    background: '#6c757d', 
                    color: '#fff',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '10px 20px',
                    cursor: 'pointer',
                    fontWeight: '600'
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
