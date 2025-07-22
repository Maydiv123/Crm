import React, { useState, useEffect } from 'react';
import { FiUsers, FiUserCheck, FiKey, FiDollarSign, FiPackage, FiShield, FiPlus, FiEdit, FiTrash2, FiEye } from 'react-icons/fi';
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

  const [advertisements, setAdvertisements] = useState([]);
  const [packages, setPackages] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [showPermissionsModal, setShowPermissionsModal] = useState(false);
  const [showUserDetailsModal, setShowUserDetailsModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedUserId, setSelectedUserId] = useState(null);

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

      // Fetch advertisements
      const adsResponse = await adminAPI.getAdvertisements();
      setAdvertisements(adsResponse.data);

      // Fetch packages
      const packagesResponse = await adminAPI.getPackages();
      setPackages(packagesResponse.data);

      // Fetch users
      const usersResponse = await adminAPI.getUsers();
      setUsers(usersResponse.data);

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
      setAdvertisements([
        {
          id: 1,
          title: "Summer Sale Campaign",
          description: "Promote our summer deals",
          imageUrl: "https://via.placeholder.com/300x200",
          views: 1200,
          clicks: 150
        }
      ]);
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
          avatar: "https://via.placeholder.com/40x40"
        }
      ]);
      setLoading(false);
    }
  };

  const handleAddAdvertisement = () => {
    // Implementation for adding advertisement
    console.log('Add advertisement');
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
          className={`tab-button ${activeTab === 'advertisements' ? 'active' : ''}`}
          onClick={() => setActiveTab('advertisements')}
        >
          Advertisements
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

      {activeTab === 'advertisements' && (
        <div className="advertisements-section">
          <div className="section-header">
            <h2>Advertisements</h2>
            <button className="add-button" onClick={handleAddAdvertisement}>
              <FiPlus /> Add Advertisement
            </button>
          </div>

          <div className="ads-grid">
            {advertisements.map((ad) => (
              <div key={ad.id} className="ad-card">
                <div className="ad-image">
                  <img src={ad.imageUrl} alt={ad.title} />
                </div>
                <div className="ad-content">
                  <h3>{ad.title}</h3>
                  <p>{ad.description}</p>
                  <div className="ad-stats">
                    <span>Views: {ad.views}</span>
                    <span>Clicks: {ad.clicks}</span>
                  </div>
                  <div className="ad-actions">
                    <button className="action-btn edit">
                      <FiEdit /> Edit
                    </button>
                    <button className="action-btn delete">
                      <FiTrash2 /> Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
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
    </div>
  );
};

export default AdminDashboard; 