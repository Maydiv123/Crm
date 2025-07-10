import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Interface from './Components/Interface';
import Dashboard from './Components/Dashboard';
import Calendar from './Components/Calendar';
import Change from './Components/Change';
import Introduction from './Components/Introduction';
import Login from './Components/Login';
import Signup from './Components/Signup';
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
import { FiLogOut } from 'react-icons/fi';

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

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return <div>Loading...</div>;
  }
  
  return isAuthenticated ? children : <Navigate to="/login" />;
};

function AppLayout() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const currentPath = window.location.pathname;
  const isNoSidebar = ["/", "/login", "/signup"].includes(currentPath);
  
  const handleLogout = () => {
    logout();
    navigate("/login");
  };
  
  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      {!isNoSidebar && (
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
          <div style={{ marginTop: 'auto', padding: '20px' }}>
            <button 
              onClick={handleLogout}
              style={{
                width: '100%',
                padding: '10px',
                background: '#ff4757',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <FiLogOut style={{ fontSize: '1.3em' }} />
            
            </button>
          </div>
        </aside>
      )}
      <div style={{ flex: 1, minWidth: 0 }}>
        <Routes>
          <Route path="/" element={<Introduction />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="/leads" element={
            <ProtectedRoute>
              <Interface navigate={navigate} />
            </ProtectedRoute>
          } />
          <Route path="/calendar" element={
            <ProtectedRoute>
              <Calendar />
            </ProtectedRoute>
          } />
          <Route path="/leads/:leadId" element={
            <ProtectedRoute>
              <Change />
            </ProtectedRoute>
          } />
        </Routes>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <AppLayout />
      </Router>
      <style>{`
        /* Hide all scrollbars but keep scrolling functional */
        ::-webkit-scrollbar { display: none !important; }
        html, body, * {
          scrollbar-width: none !important;
          -ms-overflow-style: none !important;
        }
      `}</style>
    </AuthProvider>
  );
}
