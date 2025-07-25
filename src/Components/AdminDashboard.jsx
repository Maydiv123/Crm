import React, { useState, useEffect } from 'react';
import { FiUsers, FiUserCheck, FiKey, FiDollarSign, FiPackage, FiShield, FiPlus, FiEdit, FiTrash2, FiEye, FiAlertTriangle, FiClock, FiCalendar, FiRefreshCw, FiMessageSquare, FiMail, FiPhone, FiMessageCircle, FiX, FiSend } from 'react-icons/fi';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { adminAPI } from '../services/api.js';
import PermissionsModal from './PermissionsModal';
import UserDetailsModal from './UserDetailsModal';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalAdmins: 0,
    totalLeads: 0,
    totalMessages: 0,
    totalRevenue: 0,
    activePackages: 0,
    pendingPermissions: 0
  });

  const [messages, setMessages] = useState([]);
  const [packages, setPackages] = useState([]);
  const [users, setUsers] = useState([]);
  const [expiryAlerts, setExpiryAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [showPermissionsModal, setShowPermissionsModal] = useState(false);
  const [showUserDetailsModal, setShowUserDetailsModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [showRenewModal, setShowRenewModal] = useState(false);
  const [selectedAlert, setSelectedAlert] = useState(null);
  const [renewLoading, setRenewLoading] = useState(false);
  const [messageFilter, setMessageFilter] = useState('all');
  
  // New states for message functionality
  const [showMessageDetailsModal, setShowMessageDetailsModal] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [showResendModal, setShowResendModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  
  // New states for send new message
  const [showSendMessageModal, setShowSendMessageModal] = useState(false);
  const [sendMessageLoading, setSendMessageLoading] = useState(false);
  const [newMessage, setNewMessage] = useState({
    recipient: '',
    subject: '',
    content: '',
    type: 'email',
    recipients_count: 1
  });

  // Mock data for charts
  const monthlyData = [
    { month: 'Jan', admins: 5, revenue: 12000, messages: 4500 },
    { month: 'Feb', admins: 6, revenue: 15000, messages: 5200 },
    { month: 'Mar', admins: 7, revenue: 18000, messages: 6100 },
    { month: 'Apr', admins: 8, revenue: 17000, messages: 5800 },
    { month: 'May', admins: 9, revenue: 20000, messages: 6800 },
    { month: 'Jun', admins: 10, revenue: 25000, messages: 7500 },
  ];

  const packageData = [
    { name: 'Basic', value: 45, color: '#8884d8' },
    { name: 'Premium', value: 30, color: '#82ca9d' },
    { name: 'Enterprise', value: 25, color: '#ffc658' },
  ];

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch stats
      const statsResponse = await adminAPI.getStats();
      setStats(statsResponse.data);

      // Fetch messages
      const messagesResponse = await adminAPI.getMessages();
      setMessages(messagesResponse.data);

      // Fetch packages
      const packagesResponse = await adminAPI.getPackages();
      setPackages(packagesResponse.data);

      // Fetch users
      const usersResponse = await adminAPI.getUsers();
      setUsers(usersResponse.data);

      // Fetch expiry alerts
      const alertsResponse = await adminAPI.getExpiryAlerts();
      setExpiryAlerts(alertsResponse.data);

      setLoading(false);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      // Set mock data for testing
      setStats({
        totalAdmins: 3,
        totalLeads: 45,
        totalMessages: 1250,
        totalRevenue: 25000,
        activePackages: 2,
        pendingPermissions: 5
      });
      
      // Mock messages data
      const mockMessages = [
        {
          id: 1,
          user_name: "Admin User",
          user_email: "admin@company.com",
          recipient: "all@company.com",
          subject: "Monthly Newsletter - July 2025",
          content: "Welcome to our monthly newsletter! This month we have exciting updates about our new features and upcoming releases. We've added several new capabilities to help you manage your business more effectively. Stay tuned for more updates in the coming weeks.",
          type: "email",
          status: "delivered",
          created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          message_count: 150
        },
        {
          id: 2,
          user_name: "Admin User",
          user_email: "admin@company.com",
          recipient: "+91XXXXXXXXXX",
          subject: "System Maintenance Alert",
          content: "Scheduled maintenance will be performed tonight from 2 AM to 4 AM. Services may be temporarily unavailable. We apologize for any inconvenience and appreciate your patience.",
          type: "sms",
          status: "sent",
          created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
          message_count: 200
        },
        {
          id: 3,
          user_name: "Admin User",
          user_email: "admin@company.com",
          recipient: "whatsapp://send?phone=+91XXXXXXXXXX",
          subject: "New Feature Announcement",
          content: "We're excited to announce our new AI-powered lead scoring feature! Check it out in your dashboard. This feature will help you prioritize leads and improve your conversion rates.",
          type: "whatsapp",
          status: "delivered",
          created_at: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
          message_count: 75
        },
        {
          id: 4,
          user_name: "Admin User",
          user_email: "admin@company.com",
          recipient: "customers@company.com",
          subject: "Holiday Schedule Update",
          content: "Our office will be closed for Independence Day on August 15th. Support will be available via email. We wish you a happy Independence Day!",
          type: "email",
          status: "delivered",
          created_at: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
          message_count: 300
        },
        {
          id: 5,
          user_name: "Admin User",
          user_email: "admin@company.com",
          recipient: "+91XXXXXXXXXX",
          subject: "Payment Reminder",
          content: "Your subscription payment is due in 3 days. Please update your payment method to avoid service interruption. You can update your payment details in your account settings.",
          type: "sms",
          status: "sent",
          created_at: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
          message_count: 120
        }
      ];
      setMessages(mockMessages);
      
      setPackages([
        {
          id: 1,
          name: "Basic",
          description: "Essential features",
          price: 999,
          features: ["Lead Management", "Basic Analytics"],
          subscribers: 25,
          revenue: 24975
        }
      ]);
      setUsers([
        {
          id: 1,
          name: "Admin User",
          email: "admin@company.com",
          role: "admin",
          status: "active",
          lastLogin: "2025-07-21",
          avatar: null
        }
      ]);
      
      // Mock expiry alerts data
      const mockExpiryAlerts = [
        {
          id: 1,
          user_id: 1,
          user_name: "Abhishek Kumar",
          user_email: "abhishek@company.com",
          package_name: "Premium",
          expires_at: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days from now
          days_remaining: 5,
          priority: "urgent"
        },
        {
          id: 2,
          user_id: 2,
          user_name: "Priya Sharma",
          user_email: "priya@company.com",
          package_name: "Basic",
          expires_at: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000).toISOString(), // 12 days from now
          days_remaining: 12,
          priority: "medium"
        },
        {
          id: 3,
          user_id: 3,
          user_name: "Rahul Verma",
          user_email: "rahul@company.com",
          package_name: "Enterprise",
          expires_at: new Date(Date.now() + 22 * 24 * 60 * 60 * 1000).toISOString(), // 22 days from now
          days_remaining: 22,
          priority: "small"
        }
      ];
      setExpiryAlerts(mockExpiryAlerts);
      setLoading(false);
    }
  };

  const handleAddMessage = () => {
    setShowSendMessageModal(true);
    setNewMessage({
      recipient: '',
      subject: '',
      content: '',
      type: 'email',
      recipients_count: 1
    });
  };

  const handleEditPackage = (packageId) => {
    // Implementation for editing package
    console.log('Edit package:', packageId);
  };

  const handleManagePermissions = (user) => {
    setSelectedUser(user);
    setShowPermissionsModal(true);
  };

  const handleViewUser = (userId) => {
    setSelectedUserId(userId);
    setShowUserDetailsModal(true);
  };

  const handlePermissionsUpdate = () => {
    // Refresh users data after permissions update
    fetchDashboardData();
  };

  // New handlers for expiry alerts
  const handleViewUserFromAlert = (alert) => {
    setSelectedUserId(alert.user_id);
    setShowUserDetailsModal(true);
  };

  const handleRenewPackage = (alert) => {
    setSelectedAlert(alert);
    setShowRenewModal(true);
  };

  const handleRenewPackageConfirm = async () => {
    if (!selectedAlert) return;
    
    try {
      setRenewLoading(true);
      
      // Call API to renew package
      await adminAPI.renewPackage(selectedAlert.user_id, {
        package_name: selectedAlert.package_name,
        renewal_months: 12, // Default to 12 months
        amount: getPackagePrice(selectedAlert.package_name)
      });
      
      // Show success message
      alert(`Package renewed successfully for ${selectedAlert.user_name}!`);
      
      // Refresh data
      await fetchDashboardData();
      
      // Close modal
      setShowRenewModal(false);
      setSelectedAlert(null);
      
    } catch (error) {
      console.error('Error renewing package:', error);
      alert('Failed to renew package. Please try again.');
    } finally {
      setRenewLoading(false);
    }
  };

  // New handlers for message functionality
  const handleViewMessageDetails = (message) => {
    setSelectedMessage(message);
    setShowMessageDetailsModal(true);
  };

  const handleResendMessage = (message) => {
    setSelectedMessage(message);
    setShowResendModal(true);
  };

  const handleDeleteMessage = (message) => {
    setSelectedMessage(message);
    setShowDeleteModal(true);
  };

  const handleResendMessageConfirm = async () => {
    if (!selectedMessage) return;
    
    try {
      setResendLoading(true);
      
      // Call API to resend message
      await adminAPI.resendMessage(selectedMessage.id, {
        recipient: selectedMessage.recipient,
        subject: selectedMessage.subject,
        content: selectedMessage.content,
        type: selectedMessage.type
      });
      
      // Show success message
      alert(`Message resent successfully!`);
      
      // Refresh data
      await fetchDashboardData();
      
      // Close modal
      setShowResendModal(false);
      setSelectedMessage(null);
      
    } catch (error) {
      console.error('Error resending message:', error);
      alert('Failed to resend message. Please try again.');
    } finally {
      setResendLoading(false);
    }
  };

  const handleDeleteMessageConfirm = async () => {
    if (!selectedMessage) return;
    
    try {
      setDeleteLoading(true);
      
      // Call API to delete message
      await adminAPI.deleteMessage(selectedMessage.id);
      
      // Show success message
      alert(`Message deleted successfully!`);
      
      // Refresh data
      await fetchDashboardData();
      
      // Close modal
      setShowDeleteModal(false);
      setSelectedMessage(null);
      
    } catch (error) {
      console.error('Error deleting message:', error);
      alert('Failed to delete message. Please try again.');
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleSendMessageConfirm = async () => {
    if (!newMessage.recipient || !newMessage.subject || !newMessage.content) {
      alert('Please fill in all required fields.');
      return;
    }
    
    try {
      setSendMessageLoading(true);
      
      // Call API to send new message
      await adminAPI.sendMessage({
        recipient: newMessage.recipient,
        subject: newMessage.subject,
        content: newMessage.content,
        type: newMessage.type,
        recipients_count: newMessage.recipients_count
      });
      
      // Show success message
      alert(`Message sent successfully!`);
      
      // Refresh data
      await fetchDashboardData();
      
      // Close modal and reset form
      setShowSendMessageModal(false);
      setNewMessage({
        recipient: '',
        subject: '',
        content: '',
        type: 'email',
        recipients_count: 1
      });
      
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Failed to send message. Please try again.');
    } finally {
      setSendMessageLoading(false);
    }
  };

  const handleNewMessageChange = (field, value) => {
    setNewMessage(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const getPackagePrice = (packageName) => {
    const pkg = packages.find(p => p.name === packageName);
    return pkg ? pkg.price : 999;
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'urgent':
        return '#dc2626'; // Red
      case 'medium':
        return '#d97706'; // Orange
      case 'small':
        return '#059669'; // Green
      default:
        return '#6b7280'; // Gray
    }
  };

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'urgent':
        return <FiAlertTriangle style={{ color: '#dc2626' }} />;
      case 'medium':
        return <FiClock style={{ color: '#d97706' }} />;
      case 'small':
        return <FiCalendar style={{ color: '#059669' }} />;
      default:
        return <FiCalendar style={{ color: '#6b7280' }} />;
    }
  };

  const formatExpiryDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatMessageDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getMessageTypeIcon = (type) => {
    switch (type) {
      case 'email':
        return <FiMail style={{ color: '#3b82f6' }} />;
      case 'sms':
        return <FiPhone style={{ color: '#10b981' }} />;
      case 'whatsapp':
        return <FiMessageCircle style={{ color: '#25d366' }} />;
      default:
        return <FiMessageSquare style={{ color: '#6b7280' }} />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'delivered':
        return '#10b981';
      case 'sent':
        return '#3b82f6';
      case 'failed':
        return '#ef4444';
      default:
        return '#6b7280';
    }
  };

  const filteredMessages = messages.filter(message => {
    if (messageFilter === 'all') return true;
    return message.type === messageFilter;
  });

  if (loading) {
    return (
      <div className="admin-dashboard">
        <div className="loading-spinner">Loading...</div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <div className="admin-header">
        <h1>Admin Dashboard</h1>
        <p>Welcome to your company administration panel</p>
      </div>

      <div className="admin-tabs">
        <button 
          className={`tab-button ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </button>
        <button 
          className={`tab-button ${activeTab === 'information' ? 'active' : ''}`}
          onClick={() => setActiveTab('information')}
        >
          <FiMessageSquare style={{ marginRight: '6px' }} />
          Information
        </button>
        <button 
          className={`tab-button ${activeTab === 'packages' ? 'active' : ''}`}
          onClick={() => setActiveTab('packages')}
        >
          Packages
        </button>
        <button 
          className={`tab-button ${activeTab === 'users' ? 'active' : ''}`}
          onClick={() => setActiveTab('users')}
        >
          Users & Permissions
        </button>
        <button 
          className={`tab-button ${activeTab === 'expiry-alerts' ? 'active' : ''}`}
          onClick={() => setActiveTab('expiry-alerts')}
        >
          <FiAlertTriangle style={{ marginRight: '6px' }} />
          Package Expiry Alerts
          {expiryAlerts.length > 0 && (
            <span className="alert-badge">{expiryAlerts.length}</span>
          )}
        </button>
      </div>

      {activeTab === 'overview' && (
        <div className="overview-section">
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon">
                <FiUsers />
              </div>
              <div className="stat-content">
                <h3>{stats.totalAdmins}</h3>
                <p>Total Admins</p>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">
                <FiUserCheck />
              </div>
              <div className="stat-content">
                <h3>{stats.totalLeads}</h3>
                <p>Total Leads</p>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">
                <FiKey />
              </div>
              <div className="stat-content">
                <h3>{(stats.totalMessages || 0).toLocaleString()}</h3>
                <p>Total Messages</p>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">
                <FiDollarSign />
              </div>
              <div className="stat-content">
                <h3>₹{stats.totalRevenue.toLocaleString()}</h3>
                <p>Total Revenue</p>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">
                <FiPackage />
              </div>
              <div className="stat-content">
                <h3>{stats.activePackages}</h3>
                <p>Active Packages</p>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">
                <FiShield />
              </div>
              <div className="stat-content">
                <h3>{stats.pendingPermissions}</h3>
                <p>Pending Permissions</p>
              </div>
            </div>
          </div>

          <div className="charts-section">
            <div className="chart-container">
              <h3>Monthly Growth</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="admins" stroke="#8884d8" />
                  <Line type="monotone" dataKey="revenue" stroke="#82ca9d" />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="chart-container">
              <h3>Package Distribution</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={packageData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {packageData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'information' && (
        <div className="information-section">
          <div className="section-header">
            <h2>Company Messages</h2>
            <p>All messages sent from the company dashboard</p>
            <button className="add-button" onClick={handleAddMessage}>
              <FiPlus /> Send New Message
            </button>
          </div>

          <div className="message-filters">
            <button 
              className={`filter-btn ${messageFilter === 'all' ? 'active' : ''}`}
              onClick={() => setMessageFilter('all')}
            >
              All Messages ({messages.length})
            </button>
            <button 
              className={`filter-btn ${messageFilter === 'email' ? 'active' : ''}`}
              onClick={() => setMessageFilter('email')}
            >
              <FiMail /> Email ({messages.filter(m => m.type === 'email').length})
            </button>
            <button 
              className={`filter-btn ${messageFilter === 'sms' ? 'active' : ''}`}
              onClick={() => setMessageFilter('sms')}
            >
              <FiPhone /> SMS ({messages.filter(m => m.type === 'sms').length})
            </button>
            <button 
              className={`filter-btn ${messageFilter === 'whatsapp' ? 'active' : ''}`}
              onClick={() => setMessageFilter('whatsapp')}
            >
              <FiMessageCircle /> WhatsApp ({messages.filter(m => m.type === 'whatsapp').length})
            </button>
          </div>

          <div className="messages-grid">
            {filteredMessages.length === 0 ? (
              <div className="no-messages">
                <FiMessageSquare style={{ fontSize: '48px', color: '#6b7280', marginBottom: '16px' }} />
                <h3>No Messages Found</h3>
                <p>No messages match the current filter criteria.</p>
              </div>
            ) : (
              filteredMessages.map((message) => (
                <div key={message.id} className="message-card">
                  <div className="message-header">
                    <div className="message-type-icon">
                      {getMessageTypeIcon(message.type)}
                    </div>
                    <div className="message-meta">
                      <div className="message-sender">
                        <strong>{message.user_name}</strong>
                        <span className="message-email">{message.user_email}</span>
                      </div>
                      <div className="message-time">
                        {formatMessageDate(message.created_at)}
                      </div>
                    </div>
                    <div className="message-status">
                      <span 
                        className={`status-badge ${message.status}`}
                        style={{ backgroundColor: getStatusColor(message.status) + '20', color: getStatusColor(message.status) }}
                      >
                        {message.status.toUpperCase()}
                      </span>
                    </div>
                  </div>
                  
                  <div className="message-content">
                    <div className="message-subject">
                      <strong>{message.subject}</strong>
                    </div>
                    <div className="message-preview">
                      {message.content.length > 100 
                        ? message.content.substring(0, 100) + '...' 
                        : message.content
                      }
                    </div>
                    <div className="message-details">
                      <div className="message-recipient">
                        <strong>To:</strong> {message.recipient}
                      </div>
                      <div className="message-count">
                        <strong>Recipients:</strong> {message.message_count}
                      </div>
                    </div>
                  </div>
                  
                  <div className="message-actions">
                    <button 
                      className="action-btn view"
                      onClick={() => handleViewMessageDetails(message)}
                    >
                      <FiEye /> View Details
                    </button>
                    <button 
                      className="action-btn edit"
                      onClick={() => handleResendMessage(message)}
                    >
                      <FiRefreshCw /> Resend
                    </button>
                    <button 
                      className="action-btn delete"
                      onClick={() => handleDeleteMessage(message)}
                    >
                      <FiTrash2 /> Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {activeTab === 'packages' && (
        <div className="packages-section">
          <div className="section-header">
            <h2>Packages & Pricing</h2>
            <button className="add-button">
              <FiPlus /> Add Package
            </button>
          </div>

          <div className="packages-grid">
            {packages.map((pkg) => (
              <div key={pkg.id} className="package-card">
                <div className="package-header">
                  <h3>{pkg.name}</h3>
                  <div className="package-price">₹{pkg.price}</div>
                </div>
                <div className="package-features">
                  {pkg.features.map((feature, index) => (
                    <div key={index} className="feature-item">
                      <span className="feature-check">✓</span>
                      {feature}
                    </div>
                  ))}
                </div>
                <div className="package-stats">
                  <span>Subscribers: {pkg.subscribers}</span>
                  <span>Revenue: ₹{pkg.revenue}</span>
                </div>
                <div className="package-actions">
                  <button className="action-btn edit" onClick={() => handleEditPackage(pkg.id)}>
                    <FiEdit /> Edit
                  </button>
                  <button className="action-btn view">
                    <FiEye /> View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'users' && (
        <div className="users-section">
          <div className="section-header">
            <h2>Users & Permissions</h2>
          </div>

          <div className="users-table">
            <table>
              <thead>
                <tr>
                  <th>User</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Last Login</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td>
                      <div className="user-info">
                        {user.avatar ? (
                        <img src={user.avatar} alt={user.name} className="user-avatar" />
                        ) : (
                          <div className="user-avatar-placeholder">
                            {user.name.charAt(0).toUpperCase()}
                          </div>
                        )}
                        <span>{user.name}</span>
                      </div>
                    </td>
                    <td>{user.email}</td>
                    <td>
                      <span className={`role-badge ${user.role}`}>
                        {user.role}
                      </span>
                    </td>
                    <td>
                      <span className={`status-badge ${user.status}`}>
                        {user.status}
                      </span>
                    </td>
                    <td>{user.lastLogin}</td>
                    <td>
                      <div className="user-actions">
                        <button 
                          className="action-btn edit"
                          onClick={() => handleManagePermissions(user)}
                        >
                          <FiShield /> Permissions
                        </button>
                        <button 
                          className="action-btn view"
                          onClick={() => handleViewUser(user.id)}
                        >
                          <FiEye /> View
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

      {activeTab === 'expiry-alerts' && (
        <div className="expiry-alerts-section">
          <div className="section-header">
            <h2>Package Expiry Alerts</h2>
            <p>Users whose packages are expiring within the next 30 days</p>
          </div>

          <div className="alerts-grid">
            {expiryAlerts.length === 0 ? (
              <div className="no-alerts">
                <FiCalendar style={{ fontSize: '48px', color: '#6b7280', marginBottom: '16px' }} />
                <h3>No Expiry Alerts</h3>
                <p>All packages are up to date!</p>
              </div>
            ) : (
              expiryAlerts.map((alert) => (
                <div key={alert.id} className={`alert-card ${alert.priority}`}>
                  <div className="alert-header">
                    <div className="alert-icon">
                      {getPriorityIcon(alert.priority)}
                    </div>
                    <div className="alert-priority">
                      <span className={`priority-badge ${alert.priority}`}>
                        {alert.priority.toUpperCase()}
                      </span>
                    </div>
                  </div>
                  
                  <div className="alert-content">
                    <div className="alert-user-info">
                      <div className="user-avatar-placeholder">
                        {alert.user_name.charAt(0).toUpperCase()}
                      </div>
                      <div className="user-details">
                        <h4>{alert.user_name}</h4>
                        <p>{alert.user_email}</p>
                      </div>
                    </div>
                    
                    <div className="alert-package-info">
                      <div className="package-name">
                        <FiPackage style={{ marginRight: '8px' }} />
                        {alert.package_name} Package
                      </div>
                      <div className="expiry-info">
                        <div className="days-remaining">
                          <strong>{alert.days_remaining}</strong> days remaining
                        </div>
                        <div className="expiry-date">
                          Expires on: {formatExpiryDate(alert.expires_at)}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="alert-actions">
                    <button 
                      className="action-btn view"
                      onClick={() => handleViewUserFromAlert(alert)}
                    >
                      <FiEye /> View User
                    </button>
                    <button 
                      className="action-btn edit"
                      onClick={() => handleRenewPackage(alert)}
                    >
                      <FiRefreshCw /> Renew Package
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Modals */}
      {showPermissionsModal && selectedUser && (
        <PermissionsModal
          user={selectedUser}
          onClose={() => {
            setShowPermissionsModal(false);
            setSelectedUser(null);
          }}
          onUpdate={handlePermissionsUpdate}
        />
      )}

      {showUserDetailsModal && selectedUserId && (
        <UserDetailsModal
          userId={selectedUserId}
          onClose={() => {
            setShowUserDetailsModal(false);
            setSelectedUserId(null);
          }}
        />
      )}

      {/* Message Details Modal */}
      {showMessageDetailsModal && selectedMessage && (
        <div className="modal-overlay" onClick={() => setShowMessageDetailsModal(false)}>
          <div className="modal-content message-details-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Message Details</h3>
              <button 
                className="modal-close"
                onClick={() => setShowMessageDetailsModal(false)}
              >
                <FiX />
              </button>
            </div>
            
            <div className="modal-body">
              <div className="message-detail-header">
                <div className="message-detail-type-icon">
                  {getMessageTypeIcon(selectedMessage.type)}
                </div>
                <div className="message-detail-info">
                  <h4>{selectedMessage.subject}</h4>
                  <div className="message-detail-meta">
                    <span>Sent by: {selectedMessage.user_name}</span>
                    <span>Date: {formatMessageDate(selectedMessage.created_at)}</span>
                    <span 
                      className="message-detail-status"
                      style={{ color: getStatusColor(selectedMessage.status) }}
                    >
                      Status: {selectedMessage.status.toUpperCase()}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="message-detail-content">
                <h5>Message Content:</h5>
                <div className="message-detail-text">
                  {selectedMessage.content}
                </div>
              </div>
              
              <div className="message-detail-recipient">
                <h5>Recipient Information:</h5>
                <div className="message-detail-recipient-info">
                  <div><strong>To:</strong> {selectedMessage.recipient}</div>
                  <div><strong>Recipients:</strong> {selectedMessage.message_count}</div>
                  <div><strong>Type:</strong> {selectedMessage.type.toUpperCase()}</div>
                </div>
              </div>
            </div>
            
            <div className="modal-actions">
              <button 
                className="btn-secondary"
                onClick={() => setShowMessageDetailsModal(false)}
              >
                Close
              </button>
              <button 
                className="btn-primary"
                onClick={() => {
                  setShowMessageDetailsModal(false);
                  handleResendMessage(selectedMessage);
                }}
              >
                <FiRefreshCw /> Resend Message
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Resend Message Modal */}
      {showResendModal && selectedMessage && (
        <div className="modal-overlay" onClick={() => setShowResendModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Resend Message</h3>
              <button 
                className="modal-close"
                onClick={() => setShowResendModal(false)}
              >
                <FiX />
              </button>
            </div>
            
            <div className="modal-body">
              <div className="resend-message-info">
                <div className="message-type-icon">
                  {getMessageTypeIcon(selectedMessage.type)}
                </div>
                <div>
                  <h4>{selectedMessage.subject}</h4>
                  <p>Original message sent on {formatMessageDate(selectedMessage.created_at)}</p>
                </div>
              </div>
              
              <div className="resend-message-details">
                <h5>Message Details</h5>
                <div className="resend-detail-item">
                  <span>Recipient:</span>
                  <strong>{selectedMessage.recipient}</strong>
                </div>
                <div className="resend-detail-item">
                  <span>Message Type:</span>
                  <strong>{selectedMessage.type.toUpperCase()}</strong>
                </div>
                <div className="resend-detail-item">
                  <span>Content Preview:</span>
                  <strong>{selectedMessage.content.substring(0, 50)}...</strong>
                </div>
              </div>
              
              <div className="resend-confirmation">
                <p>Are you sure you want to resend this message?</p>
                <p className="resend-note">This will send the same message to the original recipient(s).</p>
              </div>
            </div>
            
            <div className="modal-actions">
              <button 
                className="btn-secondary"
                onClick={() => setShowResendModal(false)}
                disabled={resendLoading}
              >
                Cancel
              </button>
              <button 
                className="btn-primary"
                onClick={handleResendMessageConfirm}
                disabled={resendLoading}
              >
                {resendLoading ? (
                  <>
                    <FiRefreshCw className="spinning" /> Resending...
                  </>
                ) : (
                  <>
                    <FiRefreshCw /> Confirm Resend
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Message Modal */}
      {showDeleteModal && selectedMessage && (
        <div className="modal-overlay" onClick={() => setShowDeleteModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Delete Message</h3>
              <button 
                className="modal-close"
                onClick={() => setShowDeleteModal(false)}
              >
                <FiX />
              </button>
            </div>
            
            <div className="modal-body">
              <div className="delete-message-info">
                <div className="message-type-icon">
                  {getMessageTypeIcon(selectedMessage.type)}
                </div>
                <div>
                  <h4>{selectedMessage.subject}</h4>
                  <p>Sent on {formatMessageDate(selectedMessage.created_at)}</p>
                </div>
              </div>
              
              <div className="delete-message-details">
                <h5>Message Information</h5>
                <div className="delete-detail-item">
                  <span>Recipient:</span>
                  <strong>{selectedMessage.recipient}</strong>
                </div>
                <div className="delete-detail-item">
                  <span>Status:</span>
                  <strong>{selectedMessage.status.toUpperCase()}</strong>
                </div>
                <div className="delete-detail-item">
                  <span>Recipients:</span>
                  <strong>{selectedMessage.message_count}</strong>
                </div>
              </div>
              
              <div className="delete-confirmation">
                <p>Are you sure you want to delete this message?</p>
                <p className="delete-note">This action cannot be undone. The message will be permanently removed from the system.</p>
              </div>
            </div>
            
            <div className="modal-actions">
              <button 
                className="btn-secondary"
                onClick={() => setShowDeleteModal(false)}
                disabled={deleteLoading}
              >
                Cancel
              </button>
              <button 
                className="btn-danger"
                onClick={handleDeleteMessageConfirm}
                disabled={deleteLoading}
              >
                {deleteLoading ? (
                  <>
                    <FiTrash2 className="spinning" /> Deleting...
                  </>
                ) : (
                  <>
                    <FiTrash2 /> Confirm Delete
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Renew Package Modal */}
      {showRenewModal && selectedAlert && (
        <div className="modal-overlay" onClick={() => setShowRenewModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Renew Package</h3>
              <button 
                className="modal-close"
                onClick={() => setShowRenewModal(false)}
              >
                <FiX />
              </button>
            </div>
            
            <div className="modal-body">
              <div className="renew-user-info">
                <div className="user-avatar-placeholder">
                  {selectedAlert.user_name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h4>{selectedAlert.user_name}</h4>
                  <p>{selectedAlert.user_email}</p>
                </div>
              </div>
              
              <div className="renew-package-details">
                <h5>Package Details</h5>
                <div className="package-detail-item">
                  <span>Current Package:</span>
                  <strong>{selectedAlert.package_name}</strong>
                </div>
                <div className="package-detail-item">
                  <span>Current Expiry:</span>
                  <strong>{formatExpiryDate(selectedAlert.expires_at)}</strong>
                </div>
                <div className="package-detail-item">
                  <span>Renewal Amount:</span>
                  <strong>₹{getPackagePrice(selectedAlert.package_name)}</strong>
                </div>
                <div className="package-detail-item">
                  <span>Renewal Period:</span>
                  <strong>12 Months</strong>
                </div>
              </div>
              
              <div className="renew-confirmation">
                <p>Are you sure you want to renew the package for this user?</p>
                <p className="renew-note">This will extend the package validity by 12 months from the current expiry date.</p>
              </div>
            </div>
            
            <div className="modal-actions">
              <button 
                className="btn-secondary"
                onClick={() => setShowRenewModal(false)}
                disabled={renewLoading}
              >
                Cancel
              </button>
              <button 
                className="btn-primary"
                onClick={handleRenewPackageConfirm}
                disabled={renewLoading}
              >
                {renewLoading ? (
                  <>
                    <FiRefreshCw className="spinning" /> Processing...
                  </>
                ) : (
                  <>
                    <FiRefreshCw /> Confirm Renewal
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Send New Message Modal */}
      {showSendMessageModal && (
        <div className="modal-overlay" onClick={() => setShowSendMessageModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Send New Message</h3>
              <button 
                className="modal-close"
                onClick={() => setShowSendMessageModal(false)}
              >
                <FiX />
              </button>
            </div>
            
            <div className="modal-body">
              <div className="send-message-form">
                <div className="form-group">
                  <label>Recipient (Email, Phone, or WhatsApp URL):</label>
                  <input
                    type="text"
                    placeholder="e.g., user@example.com, +91XXXXXXXXXX, whatsapp://send?phone=+91XXXXXXXXXX"
                    value={newMessage.recipient}
                    onChange={(e) => handleNewMessageChange('recipient', e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Subject:</label>
                  <input
                    type="text"
                    placeholder="Subject"
                    value={newMessage.subject}
                    onChange={(e) => handleNewMessageChange('subject', e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Message Content:</label>
                  <textarea
                    placeholder="Your message content here..."
                    value={newMessage.content}
                    onChange={(e) => handleNewMessageChange('content', e.target.value)}
                    rows="5"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Message Type:</label>
                  <select
                    value={newMessage.type}
                    onChange={(e) => handleNewMessageChange('type', e.target.value)}
                    required
                  >
                    <option value="email">Email</option>
                    <option value="sms">SMS</option>
                    <option value="whatsapp">WhatsApp</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Recipients Count:</label>
                  <input
                    type="number"
                    placeholder="1"
                    value={newMessage.recipients_count}
                    onChange={(e) => handleNewMessageChange('recipients_count', parseInt(e.target.value) || 1)}
                    min="1"
                    required
                  />
                </div>
              </div>
            </div>
            
            <div className="modal-actions">
              <button 
                className="btn-secondary"
                onClick={() => setShowSendMessageModal(false)}
                disabled={sendMessageLoading}
              >
                Cancel
              </button>
              <button 
                className="btn-primary"
                onClick={handleSendMessageConfirm}
                disabled={sendMessageLoading}
              >
                {sendMessageLoading ? (
                  <>
                    <FiRefreshCw className="spinning" /> Sending...
                  </>
                ) : (
                  <>
                    <FiSend /> Send Message
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard; 