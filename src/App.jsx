import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, Navigate } from 'react-router-dom';
import Interface from './Components/Interface';
import Dashboard from './Components/Dashboard';
import Calendar from './Components/Calendar';
import Change from './Components/Change';
import Introduction from './Components/Introduction';
import './Components/Change.css';
import dashboardIcon from './assets/dashboard.png';
import leadsIcon from './assets/user-engagement.png';
import chatsIcon from './assets/bubble-chat.png';
import whatsappIcon from './assets/whatsapp.png';
import calendarIcon from './assets/calendar.png';
import listsIcon from './assets/list.png';
import mailIcon from './assets/email.png';
import statsIcon from './assets/stats.png';
import settingsIcon from './assets/setting.png';

const sidebarItems = [
  { icon: dashboardIcon, label: "Dashboard", path: "/dashboard" },
  { icon: leadsIcon, label: "Leads", path: "/leads" },
  { icon: chatsIcon, label: "Chats", path: "/chats" },
  { icon: whatsappIcon, label: "WhatsApp", path: "/whatsapp" },
  { icon: calendarIcon, label: "Calendar", path: "/calendar" },
  { icon: listsIcon, label: "Lists", path: "/lists" },
  { icon: mailIcon, label: "Mail", path: "/mail" },
  { icon: statsIcon, label: "Stats", path: "/stats" },
  { icon: settingsIcon, label: "Settings", path: "/settings" },
];

function AppLayout() {
  const navigate = useNavigate();
  const currentPath = window.location.pathname;
  const isIntro = currentPath === "/";
  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      {!isIntro && (
        <aside className="crm-sidebar">
          <div className="crm-logo">A</div>
          <nav>
            {sidebarItems.map((item) => (
              <Link
                to={item.path}
                key={item.label}
                className={`crm-sidebar-item${currentPath.startsWith(item.path) ? ' active' : ''}`}
                style={{ textDecoration: 'none', color: 'inherit' }}
              >
                <span className="crm-sidebar-icon">
                  <img src={item.icon} alt={item.label} style={{ width: 28, height: 28, objectFit: 'contain' }} />
                </span>
                <span className="crm-sidebar-label">{item.label}</span>
              </Link>
            ))}
          </nav>
        </aside>
      )}
      <div style={{ flex: 1, minWidth: 0 }}>
        <Routes>
          <Route path="/" element={<Introduction />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/leads" element={<Interface navigate={navigate} />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/leads/:leadId" element={<Change />} />
        </Routes>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <AppLayout />
    </Router>
  );
}
