import React, { useState, useEffect } from 'react';
import { 
  FiDollarSign, FiUsers, FiTrendingUp, FiTrendingDown, FiUserCheck, 
  FiUserX, FiMail, FiMessageSquare, FiPackage, FiShield, FiEye,
  FiLock, FiUnlock, FiActivity, FiCalendar, FiBarChart2, FiPieChart,
  FiDownload, FiFilter, FiRefreshCw, FiAlertCircle, FiCheckCircle,
  FiSearch, FiEdit, FiTrash2, FiPlus, FiSettings, FiBell, FiUserPlus,
  FiFileText, FiPrinter, FiShare2, FiMoreVertical, FiStar, FiAward
} from 'react-icons/fi';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, 
  ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line,
  AreaChart, Area
} from 'recharts';
import { companyAPI } from '../services/api.js';
import './CompanyDashboard.css';

const CompanyDashboard = () => {
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalLeads: 0,
    conversionRate: 0,
    activeCustomers: 0,
    totalEmployees: 0,
    totalMessages: 0,
    activePackages: 0,
    pendingPayments: 0
  });

  const [revenueData, setRevenueData] = useState([]);
  const [leadPipeline, setLeadPipeline] = useState([]);
  const [teamPerformance, setTeamPerformance] = useState([]);
  const [paymentHistory, setPaymentHistory] = useState([]);
  const [userActivity, setUserActivity] = useState([]);
  const [blockedUsers, setBlockedUsers] = useState([]);
  const [loginHistory, setLoginHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [dateRange, setDateRange] = useState('month');
  
  // New state for advanced features
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserDetails, setShowUserDetails] = useState(false);

  // Mock data for charts
  const monthlyRevenue = [
    { month: 'Jan', revenue: 45000, leads: 120, customers: 85 },
    { month: 'Feb', revenue: 52000, leads: 135, customers: 92 },
    { month: 'Mar', revenue: 48000, leads: 110, customers: 88 },
    { month: 'Apr', revenue: 61000, leads: 150, customers: 105 },
    { month: 'May', revenue: 58000, leads: 140, customers: 98 },
    { month: 'Jun', revenue: 72000, leads: 180, customers: 125 },
  ];

  const pipelineData = [
    { stage: 'Initial Contact', count: 45, value: 225000 },
    { stage: 'Discussion', count: 32, value: 320000 },
    { stage: 'Proposal', count: 28, value: 420000 },
    { stage: 'Negotiation', count: 15, value: 375000 },
    { stage: 'Closed Won', count: 12, value: 480000 },
  ];

  const teamData = [
    { name: 'John Doe', leads: 45, revenue: 125000, conversion: 78, status: 'active' },
    { name: 'Jane Smith', leads: 38, revenue: 98000, conversion: 82, status: 'active' },
    { name: 'Mike Johnson', leads: 52, revenue: 145000, conversion: 75, status: 'active' },
    { name: 'Sarah Wilson', leads: 29, revenue: 76000, conversion: 85, status: 'inactive' },
  ];

  const paymentData = [
    { id: 1, user: 'John Doe', amount: 999, status: 'completed', date: '2025-07-22', method: 'Credit Card' },
    { id: 2, user: 'Jane Smith', amount: 1999, status: 'pending', date: '2025-07-21', method: 'Bank Transfer' },
    { id: 3, user: 'Mike Johnson', amount: 4999, status: 'completed', date: '2025-07-20', method: 'UPI' },
    { id: 4, user: 'Sarah Wilson', amount: 999, status: 'failed', date: '2025-07-19', method: 'Credit Card' },
  ];

  const loginData = [
    { user: 'Admin User', email: 'admin@crm.com', lastLogin: '2025-07-22 10:30', ip: '192.168.1.100', status: 'active' },
    { user: 'John Doe', email: 'john@company.com', lastLogin: '2025-07-22 09:15', ip: '192.168.1.101', status: 'active' },
    { user: 'Jane Smith', email: 'jane@company.com', lastLogin: '2025-07-21 16:45', ip: '192.168.1.102', status: 'blocked' },
    { user: 'Mike Johnson', email: 'mike@company.com', lastLogin: '2025-07-21 14:20', ip: '192.168.1.103', status: 'active' },
  ];

  // Mock notifications
  const mockNotifications = [
    { id: 1, type: 'payment', message: 'New payment received: ₹999 from John Doe', time: '2 min ago', read: false },
    { id: 2, type: 'lead', message: 'New lead assigned: ABC Corp', time: '5 min ago', read: false },
    { id: 3, type: 'user', message: 'User Sarah Wilson has been blocked', time: '10 min ago', read: true },
    { id: 4, type: 'system', message: 'System backup completed successfully', time: '1 hour ago', read: true },
  ];

  useEffect(() => {
    fetchDashboardData();
    setNotifications(mockNotifications);
  }, [dateRange]);

  // Close notifications when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      const notificationContainer = document.querySelector('.notification-container');
      if (notificationContainer && !notificationContainer.contains(event.target)) {
        setShowNotifications(false);
      }
    };

    if (showNotifications) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showNotifications]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch company stats
      const statsResponse = await companyAPI.getCompanyStats(dateRange);
      setStats(statsResponse.data);

      // Fetch revenue data
      const revenueResponse = await companyAPI.getRevenueData(dateRange);
      setRevenueData(revenueResponse.data);

      // Fetch team performance
      const teamResponse = await companyAPI.getTeamPerformance();
      setTeamPerformance(teamResponse.data);

      // Fetch payment history
      const paymentResponse = await companyAPI.getPaymentHistory();
      setPaymentHistory(paymentResponse.data);

      // Fetch user activity
      const activityResponse = await companyAPI.getUserActivity();
      setUserActivity(activityResponse.data);

      // Fetch blocked users
      const blockedResponse = await companyAPI.getBlockedUsers();
      setBlockedUsers(blockedResponse.data);

      // Fetch login history
      const loginResponse = await companyAPI.getLoginHistory();
      setLoginHistory(loginResponse.data);

      setLoading(false);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      // Set mock data for testing
      setStats({
        totalRevenue: 720000,
        totalLeads: 180,
        conversionRate: 78.5,
        activeCustomers: 125,
        totalEmployees: 8,
        totalMessages: 2500,
        activePackages: 3,
        pendingPayments: 4500
      });
      setRevenueData(monthlyRevenue);
      setLeadPipeline(pipelineData);
      setTeamPerformance(teamData);
      setPaymentHistory(paymentData);
      setLoginHistory(loginData);
      setLoading(false);
    }
  };

  const handleBlockUser = async (userId) => {
    try {
      await companyAPI.blockUser(userId);
      fetchDashboardData(); // Refresh data
      addNotification('user', `User has been blocked successfully`);
      alert('User blocked successfully');
    } catch (error) {
      console.error('Error blocking user:', error);
      alert('Error blocking user');
    }
  };

  const handleUnblockUser = async (userId) => {
    try {
      await companyAPI.unblockUser(userId);
      fetchDashboardData(); // Refresh data
      addNotification('user', `User has been unblocked successfully`);
      alert('User unblocked successfully');
    } catch (error) {
      console.error('Error unblocking user:', error);
      alert('Error unblocking user');
    }
  };

  const handleExportData = (type) => {
    // Implementation for exporting data
    console.log('Exporting', type, 'data');
    addNotification('system', `${type} data exported successfully`);
    
    // Create and download CSV file
    const csvContent = generateCSVData(type);
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${type}_data_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const generateCSVData = (type) => {
    let headers = '';
    let data = '';
    
    switch(type) {
      case 'revenue':
        headers = 'Month,Revenue\n';
        data = revenueData.map(item => `${item.month},${item.revenue}`).join('\n');
        break;
      case 'team':
        headers = 'Name,Leads,Revenue,Conversion Rate\n';
        data = teamPerformance.map(item => `${item.name},${item.leads},${item.revenue},${item.conversionRate}%`).join('\n');
        break;
      case 'payments':
        headers = 'User,Amount,Status,Date\n';
        data = paymentHistory.map(item => `${item.user},${item.amount},${item.status},${item.date}`).join('\n');
        break;
      default:
        return '';
    }
    
    return headers + data;
  };

  const handlePrintData = (type) => {
    addNotification('system', `Printing ${type} data...`);
    window.print();
  };

  const handleShareData = (type) => {
    if (navigator.share) {
      navigator.share({
        title: `${type.charAt(0).toUpperCase() + type.slice(1)} Dashboard Data`,
        text: `Check out our ${type} performance data!`,
        url: window.location.href
      });
    } else {
      addNotification('system', 'Sharing not supported on this browser');
    }
  };

  const handleRefreshData = async () => {
    setRefreshing(true);
    try {
      await fetchDashboardData();
      addNotification('system', 'Data refreshed successfully!');
    } catch (error) {
      addNotification('system', 'Failed to refresh data');
    } finally {
      setRefreshing(false);
    }
  };

  // Quick actions for better UX
  const quickActions = {
    addUser: () => {
      setShowAddUserModal(true);
      addNotification('system', 'Add user modal opened');
    },
    exportAll: () => {
      handleExportData('all');
      addNotification('system', 'All data exported');
    },
    printDashboard: () => {
      window.print();
      addNotification('system', 'Dashboard printed');
    },
    shareDashboard: () => {
      if (navigator.share) {
        navigator.share({
          title: 'Company Dashboard',
          text: 'Check out our company performance!',
          url: window.location.href
        });
      }
    }
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.ctrlKey || event.metaKey) {
        switch(event.key) {
          case 'r':
            event.preventDefault();
            handleRefreshData();
            break;
          case 'e':
            event.preventDefault();
            quickActions.exportAll();
            break;
          case 'p':
            event.preventDefault();
            quickActions.printDashboard();
            break;
          case 'n':
            event.preventDefault();
            quickActions.addUser();
            break;
        }
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, []);

  const addNotification = (type, message) => {
    const newNotification = {
      id: Date.now(),
      type,
      message,
      time: 'Just now',
      read: false
    };
    setNotifications(prev => [newNotification, ...prev]);
  };

  const markNotificationAsRead = (id) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const handleAddUser = () => {
    setShowAddUserModal(true);
  };

  const handleUserDetails = (user) => {
    setSelectedUser(user);
    setShowUserDetails(true);
  };

  const filteredTeamData = teamPerformance.filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || member.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const filteredPaymentData = paymentHistory.filter(payment => {
    const matchesSearch = payment.user.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || payment.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="company-dashboard">
        <div className="loading-spinner">Loading Company Dashboard...</div>
      </div>
    );
  }

  return (
    <div className="company-dashboard">
      <div className="dashboard-header">
        <div className="header-content">
          <h1>Company Dashboard</h1>
          <p>Complete overview of your business performance and operations</p>
        </div>
        <div className="header-actions">
          {/* Quick Actions Toolbar */}
          <div className="quick-actions-toolbar">
            <button 
              className="quick-action-btn" 
              onClick={quickActions.addUser}
              title="Add User (Ctrl+N)"
            >
              <img src="/src/assets/add.png" alt="Add" className="quick-action-icon" />
              <span className="quick-action-text">Add</span>
            </button>
            <button 
              className="quick-action-btn" 
              onClick={quickActions.exportAll}
              title="Export All (Ctrl+E)"
            >
              <img src="/src/assets/export.png" alt="Export" className="quick-action-icon" />
              <span className="quick-action-text">Export</span>
            </button>
            <button 
              className="quick-action-btn" 
              onClick={quickActions.printDashboard}
              title="Print (Ctrl+P)"
            >
              <img src="/src/assets/printing.png" alt="Print" className="quick-action-icon" />
              <span className="quick-action-text">Print</span>
            </button>
            <button 
              className="quick-action-btn" 
              onClick={quickActions.shareDashboard}
              title="Share Dashboard"
            >
              <img src="/src/assets/share.png" alt="Share" className="quick-action-icon" />
              <span className="quick-action-text">Share</span>
            </button>
          </div>
          
          <div className="notification-container">
            <button 
              className="notification-btn"
              onClick={() => setShowNotifications(!showNotifications)}
            >
              <FiBell />
              {notifications.filter(n => !n.read).length > 0 && (
                <span className="notification-badge">
                  {notifications.filter(n => !n.read).length}
                </span>
              )}
            </button>
            {showNotifications && (
              <div className="notifications-dropdown">
                <div className="notifications-header">
                  <h3>Notifications</h3>
                  <button onClick={() => setNotifications([])}>Clear All</button>
                </div>
                {notifications.length > 0 ? (
                  notifications.map(notification => (
                    <div 
                      key={notification.id} 
                      className={`notification-item ${!notification.read ? 'unread' : ''}`}
                      onClick={() => markNotificationAsRead(notification.id)}
                    >
                      <div className="notification-icon">
                        {notification.type === 'payment' && <FiDollarSign />}
                        {notification.type === 'lead' && <FiUserCheck />}
                        {notification.type === 'user' && <FiUsers />}
                        {notification.type === 'system' && <FiSettings />}
                      </div>
                      <div className="notification-content">
                        <p>{notification.message}</p>
                        <span className="notification-time">{notification.time}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="no-notifications">No notifications</p>
                )}
              </div>
            )}
          </div>
          <select 
            value={dateRange} 
            onChange={(e) => setDateRange(e.target.value)}
            className="date-filter"
          >
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="quarter">This Quarter</option>
            <option value="year">This Year</option>
          </select>
          <button 
            className={`refresh-btn ${refreshing ? 'refreshing' : ''}`} 
            onClick={handleRefreshData}
            disabled={refreshing}
          >
            <FiRefreshCw className={refreshing ? 'spinning' : ''} /> 
            {refreshing ? 'Refreshing...' : 'Refresh'}
          </button>
          <button className="settings-btn" onClick={() => setShowSettingsModal(true)}>
            <FiSettings />
          </button>
        </div>
      </div>

      <div className="dashboard-tabs">
        <button 
          className={`tab-button ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          <FiBarChart2 /> Overview
        </button>
        <button 
          className={`tab-button ${activeTab === 'financial' ? 'active' : ''}`}
          onClick={() => setActiveTab('financial')}
        >
          <FiDollarSign /> Financial
        </button>
        <button 
          className={`tab-button ${activeTab === 'team' ? 'active' : ''}`}
          onClick={() => setActiveTab('team')}
        >
          <FiUsers /> Team
        </button>
        <button 
          className={`tab-button ${activeTab === 'payments' ? 'active' : ''}`}
          onClick={() => setActiveTab('payments')}
        >
          <FiPackage /> Payments
        </button>
        <button 
          className={`tab-button ${activeTab === 'security' ? 'active' : ''}`}
          onClick={() => setActiveTab('security')}
        >
          <FiShield /> Security
        </button>
      </div>

      {activeTab === 'overview' && (
        <div className="overview-section">
          <div className="stats-grid">
            <div className="stat-card revenue">
              <div className="stat-icon">
                <FiDollarSign />
              </div>
              <div className="stat-content">
                <h3>₹{stats.totalRevenue.toLocaleString()}</h3>
                <p>Total Revenue</p>
                <span className="trend positive">
                  <FiTrendingUp /> +12.5%
                </span>
              </div>
            </div>

            <div className="stat-card leads">
              <div className="stat-icon">
                <FiUserCheck />
              </div>
              <div className="stat-content">
                <h3>{stats.totalLeads}</h3>
                <p>Total Leads</p>
                <span className="trend positive">
                  <FiTrendingUp /> +8.3%
                </span>
              </div>
            </div>

            <div className="stat-card conversion">
              <div className="stat-icon">
                <FiTrendingUp />
              </div>
              <div className="stat-content">
                <h3>{stats.conversionRate}%</h3>
                <p>Conversion Rate</p>
                <span className="trend positive">
                  <FiTrendingUp /> +2.1%
                </span>
              </div>
            </div>

            <div className="stat-card customers">
              <div className="stat-icon">
                <FiUsers />
              </div>
              <div className="stat-content">
                <h3>{stats.activeCustomers}</h3>
                <p>Active Customers</p>
                <span className="trend positive">
                  <FiTrendingUp /> +15.2%
                </span>
              </div>
            </div>
          </div>

          <div className="charts-section">
            <div className="chart-container">
              <div className="chart-header">
                <h3>Revenue Trend</h3>
                <div className="chart-actions">
                  <button onClick={() => handleExportData('revenue')}>
                    <FiDownload /> Export
                  </button>
                  <button onClick={() => window.print()}>
                    <FiPrinter /> Print
                  </button>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Area type="monotone" dataKey="revenue" stroke="#667eea" fill="#667eea" fillOpacity={0.3} />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="chart-container">
              <div className="chart-header">
                <h3>Lead Pipeline</h3>
                <div className="chart-actions">
                  <button onClick={() => handleExportData('pipeline')}>
                    <FiDownload /> Export
                  </button>
                  <button onClick={() => window.print()}>
                    <FiPrinter /> Print
                  </button>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={leadPipeline}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="stage" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'financial' && (
        <div className="financial-section">
          <div className="section-header">
            <h2>Financial Overview</h2>
            <div className="header-actions">
              <button onClick={() => handleExportData('financial')}>
                <FiDownload /> Export Report
              </button>
              <button onClick={() => window.print()}>
                <FiPrinter /> Print Report
              </button>
            </div>
          </div>

          <div className="financial-grid">
            <div className="financial-card">
              <h3>Revenue Breakdown</h3>
              <div className="revenue-breakdown">
                <div className="breakdown-item">
                  <span>Basic Package</span>
                  <span>₹{stats.totalRevenue * 0.4}</span>
                </div>
                <div className="breakdown-item">
                  <span>Premium Package</span>
                  <span>₹{stats.totalRevenue * 0.35}</span>
                </div>
                <div className="breakdown-item">
                  <span>Enterprise Package</span>
                  <span>₹{stats.totalRevenue * 0.25}</span>
                </div>
              </div>
            </div>

            <div className="financial-card">
              <h3>Growth Metrics</h3>
              <div className="growth-metrics">
                <div className="metric-item">
                  <span>Monthly Growth</span>
                  <span className="positive">+12.5%</span>
                </div>
                <div className="metric-item">
                  <span>Quarterly Growth</span>
                  <span className="positive">+28.3%</span>
                </div>
                <div className="metric-item">
                  <span>Yearly Growth</span>
                  <span className="positive">+45.7%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'team' && (
        <div className="team-section">
          <div className="section-header">
            <h2>Team Performance</h2>
            <div className="header-actions">
              <button onClick={handleAddUser}>
                <FiUserPlus /> Add User
              </button>
              <button onClick={() => handleExportData('team')}>
                <FiDownload /> Export
              </button>
            </div>
          </div>

          <div className="filters-section">
            <div className="filters-left">
              <div className="search-box">
                <FiSearch />
                <input
                  type="text"
                  placeholder="Search team members..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="filters-right">
              <select 
                value={filterStatus} 
                onChange={(e) => setFilterStatus(e.target.value)}
                className="status-filter"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>

          <div className="team-table">
            <table>
              <thead>
                <tr>
                  <th>Employee</th>
                  <th>Leads Managed</th>
                  <th>Revenue Generated</th>
                  <th>Conversion Rate</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredTeamData.map((member) => (
                  <tr key={member.name}>
                    <td>
                      <div className="employee-info">
                        <div className="employee-avatar">
                          {member.name.charAt(0)}
                        </div>
                        <span>{member.name}</span>
                      </div>
                    </td>
                    <td>{member.leads}</td>
                    <td>₹{member.revenue.toLocaleString()}</td>
                    <td>{member.conversion}%</td>
                    <td>
                      <span className={`status-badge ${member.status}`}>
                        {member.status}
                      </span>
                    </td>
                    <td>
                      <div className="user-actions">
                        <button 
                          className="action-btn view"
                          onClick={() => handleUserDetails(member)}
                        >
                          <FiEye /> View
                        </button>
                        <button className="action-btn edit">
                          <FiEdit /> Edit
                        </button>
                        <button className="action-btn delete">
                          <FiTrash2 /> Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'payments' && (
        <div className="payments-section">
          <div className="section-header">
            <h2>Payment Management</h2>
            <div className="header-actions">
              <button onClick={() => handleExportData('payments')}>
                <FiDownload /> Export
              </button>
              <button onClick={() => window.print()}>
                <FiPrinter /> Print
              </button>
            </div>
          </div>

          <div className="payment-stats">
            <div className="payment-stat">
              <h3>Total Payments</h3>
              <p>₹{(stats.totalRevenue * 0.8).toLocaleString()}</p>
            </div>
            <div className="payment-stat">
              <h3>Pending Payments</h3>
              <p>₹{stats.pendingPayments.toLocaleString()}</p>
            </div>
            <div className="payment-stat">
              <h3>Failed Payments</h3>
              <p>₹{(stats.totalRevenue * 0.05).toLocaleString()}</p>
            </div>
          </div>

          <div className="filters-section">
            <div className="filters-left">
              <div className="search-box">
                <FiSearch />
                <input
                  type="text"
                  placeholder="Search payments..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="filters-right">
              <select 
                value={filterStatus} 
                onChange={(e) => setFilterStatus(e.target.value)}
                className="status-filter"
              >
                <option value="all">All Status</option>
                <option value="completed">Completed</option>
                <option value="pending">Pending</option>
                <option value="failed">Failed</option>
              </select>
            </div>
          </div>

          <div className="payment-table">
            <table>
              <thead>
                <tr>
                  <th>User</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th>Method</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredPaymentData.map((payment) => (
                  <tr key={payment.id}>
                    <td>{payment.user}</td>
                    <td>₹{payment.amount}</td>
                    <td>
                      <span className={`status-badge ${payment.status}`}>
                        {payment.status}
                      </span>
                    </td>
                    <td>{payment.date}</td>
                    <td>{payment.method}</td>
                    <td>
                      <div className="user-actions">
                        <button className="action-btn view">
                          <FiEye /> View
                        </button>
                        <button className="action-btn edit">
                          <FiEdit /> Edit
                        </button>
                        <button className="action-btn share">
                          <FiShare2 /> Share
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'security' && (
        <div className="security-section">
          <div className="section-header">
            <h2>Security & Access Control</h2>
            <div className="header-actions">
              <button onClick={() => handleExportData('security')}>
                <FiDownload /> Export Logs
              </button>
            </div>
          </div>

          <div className="security-grid">
            <div className="security-card">
              <h3>Login History</h3>
              <div className="login-table">
                <table>
                  <thead>
                    <tr>
                      <th>User</th>
                      <th>Email</th>
                      <th>Last Login</th>
                      <th>IP Address</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loginHistory.map((login, index) => (
                      <tr key={index}>
                        <td>{login.user}</td>
                        <td>{login.email}</td>
                        <td>{login.lastLogin}</td>
                        <td>{login.ip}</td>
                        <td>
                          <span className={`status-badge ${login.status}`}>
                            {login.status}
                          </span>
                        </td>
                        <td>
                          {login.status === 'active' ? (
                            <button 
                              className="action-btn block"
                              onClick={() => handleBlockUser(index)}
                            >
                              <FiLock /> Block
                            </button>
                          ) : (
                            <button 
                              className="action-btn unblock"
                              onClick={() => handleUnblockUser(index)}
                            >
                              <FiUnlock /> Unblock
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="security-card">
              <h3>Blocked Users</h3>
              <div className="blocked-users">
                {blockedUsers.length > 0 ? (
                  blockedUsers.map((user, index) => (
                    <div key={index} className="blocked-user">
                      <div className="user-info">
                        <span>{user.name}</span>
                        <span className="email">{user.email}</span>
                      </div>
                      <button 
                        className="action-btn unblock"
                        onClick={() => handleUnblockUser(user.id)}
                      >
                        <FiUnlock /> Unblock
                      </button>
                    </div>
                  ))
                ) : (
                  <p className="no-data">No blocked users</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modals */}
      {showAddUserModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>Add New User</h3>
              <button onClick={() => setShowAddUserModal(false)}>×</button>
            </div>
            <div className="modal-content">
              <form>
                <div className="form-group">
                  <label>Name</label>
                  <input type="text" placeholder="Enter user name" />
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <input type="email" placeholder="Enter email" />
                </div>
                <div className="form-group">
                  <label>Role</label>
                  <select>
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                    <option value="manager">Manager</option>
                  </select>
                </div>
                <div className="form-actions">
                  <button type="button" onClick={() => setShowAddUserModal(false)}>
                    Cancel
                  </button>
                  <button type="submit">
                    Add User
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {showUserDetails && selectedUser && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>User Details</h3>
              <button onClick={() => setShowUserDetails(false)}>×</button>
            </div>
            <div className="modal-content">
              <div className="user-details">
                <div className="user-avatar-large">
                  {selectedUser.name.charAt(0)}
                </div>
                <h4>{selectedUser.name}</h4>
                <div className="user-stats">
                  <div className="stat">
                    <span>Leads Managed</span>
                    <strong>{selectedUser.leads}</strong>
                  </div>
                  <div className="stat">
                    <span>Revenue Generated</span>
                    <strong>₹{selectedUser.revenue.toLocaleString()}</strong>
                  </div>
                  <div className="stat">
                    <span>Conversion Rate</span>
                    <strong>{selectedUser.conversion}%</strong>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {showSettingsModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>Dashboard Settings</h3>
              <button onClick={() => setShowSettingsModal(false)}>×</button>
            </div>
            <div className="modal-content">
              <div className="settings-section">
                <h4>Notifications</h4>
                <label>
                  <input type="checkbox" defaultChecked /> Email notifications
                </label>
                <label>
                  <input type="checkbox" defaultChecked /> Payment alerts
                </label>
                <label>
                  <input type="checkbox" /> Security alerts
                </label>
              </div>
              <div className="settings-section">
                <h4>Data Refresh</h4>
                <select defaultValue="5">
                  <option value="1">Every 1 minute</option>
                  <option value="5">Every 5 minutes</option>
                  <option value="15">Every 15 minutes</option>
                  <option value="30">Every 30 minutes</option>
                </select>
              </div>
              <div className="form-actions">
                <button type="button" onClick={() => setShowSettingsModal(false)}>
                  Cancel
                </button>
                <button type="submit">
                  Save Settings
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CompanyDashboard; 