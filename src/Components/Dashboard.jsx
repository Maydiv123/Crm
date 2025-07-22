import React, { useState } from "react";
import { FaCog, FaEdit, FaPlus } from "react-icons/fa";
import { BsThreeDotsVertical } from "react-icons/bs";
import { FaTrash } from "react-icons/fa";
import "./Dashboard.css";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import axios from 'axios';
import { DndContext, closestCenter } from '@dnd-kit/core';
import { SortableContext, useSortable, arrayMove, horizontalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

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
  const [showEvents, setShowEvents] = useState(false);
  const [events, setEvents] = useState([]);
  const [eventForm, setEventForm] = useState({ title: '', date: '', time: '', user: '', desc: '' });
  const [editEventIdx, setEditEventIdx] = useState(null);
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
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const role = user.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : '';
  const email = user.email || '';

  const handleEventFormChange = (e) => {
    const { name, value } = e.target;
    setEventForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddEvent = () => {
    if (!eventForm.title || !eventForm.date || !eventForm.time || !eventForm.user) return;
    setEvents((prev) => [...prev, { ...eventForm }]);
    setEventForm({ title: '', date: '', time: '', user: '', desc: '' });
  };

  const handleEditEvent = (idx) => {
    setEditEventIdx(idx);
    setEventForm(events[idx]);
  };

  const handleSaveEditEvent = () => {
    setEvents((prev) => prev.map((ev, i) => i === editEventIdx ? { ...eventForm } : ev));
    setEditEventIdx(null);
    setEventForm({ title: '', date: '', time: '', user: '', desc: '' });
  };

  const handleDeleteEvent = (idx) => {
    setEvents((prev) => prev.filter((_, i) => i !== idx));
  };

  const menuOptions = [
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
  }, []);

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
    // Prevent duplicate cards by type
    if (cards.some(card => card.type === widgetTemplates[opt].type)) return;
    setCards(prev => [...prev, widgetTemplates[opt]]);
  };

  const handleDelete = (idx) => {
    setCards(prev => prev.filter((_, i) => i !== idx));
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
    <div className="dashboard-bg" style={bgImages[bg] ? { backgroundImage: `url(${bgImages[bg]})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}}>
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
        <button className="dashboard-events-btn" onClick={() => setShowEvents(true)}>EVENTS</button>
        <button className="dashboard-menu-btn" onClick={() => setIsMenuOpen((v) => !v)}><BsThreeDotsVertical /></button>
        {isMenuOpen && (
          <div className="dashboard-menu-dropdown">
            {menuOptions.map((opt, i) => (
              <div className="dashboard-menu-option" key={i} onClick={() => handleMenuSelect(opt)}>{opt}</div>
            ))}
          </div>
        )}
      </header>
      {showEvents && (
        <div className="dashboard-events-overlay">
          <div className="dashboard-events-content">
            <div className="dashboard-events-header">
              <h2>Events</h2>
              <button className="dashboard-events-close" onClick={() => setShowEvents(false)}>×</button>
            </div>
            <form className="dashboard-event-form" onSubmit={e => { e.preventDefault(); editEventIdx !== null ? handleSaveEditEvent() : handleAddEvent(); }}>
              <input name="title" placeholder="Event Title" value={eventForm.title} onChange={handleEventFormChange} required />
              <input name="date" type="date" value={eventForm.date} onChange={handleEventFormChange} required />
              <input name="time" type="time" value={eventForm.time} onChange={handleEventFormChange} required />
              <select name="user" value={eventForm.user} onChange={handleEventFormChange} required>
                <option value="">Assign User</option>
                {users.map(u => <option key={u} value={u}>{u}</option>)}
              </select>
              <textarea name="desc" placeholder="Description/Notes" value={eventForm.desc} onChange={handleEventFormChange} />
              <button type="submit">{editEventIdx !== null ? 'Save' : 'Add Event'}</button>
            </form>
            <div className="dashboard-events-list">
              {events.length === 0 && <div className="dashboard-event-item">No events yet. (Add your events here!)</div>}
              {events.map((ev, i) => (
                <div className="dashboard-event-item" key={i}>
                  <div style={{ fontWeight: 600, fontSize: '1.1em' }}>{ev.title}</div>
                  <div>Date: {ev.date} | Time: {ev.time}</div>
                  <div>User: {ev.user}</div>
                  {ev.desc && <div style={{ marginTop: 4 }}>{ev.desc}</div>}
                  <div style={{ marginTop: 8, display: 'flex', gap: 10 }}>
                    <button className="dashboard-event-edit-btn" onClick={() => handleEditEvent(i)}>Edit</button>
                    <button className="dashboard-event-delete-btn" onClick={() => handleDeleteEvent(i)}>Delete</button>
                  </div>
                </div>
              ))}
            </div>
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
                          <button className="dashboard-card-edit-btn" onClick={() => handleEdit(idx)}><FaEdit /></button>
                          <button className="dashboard-card-delete-btn" onClick={() => handleDelete(idx)}><FaTrash /></button>
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
      </div>
    </div>
  );
}
