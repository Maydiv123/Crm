import React, { useState, useEffect } from 'react';
import { 
  FiDollarSign, FiUsers, FiTrendingUp, FiTrendingDown, FiUserCheck, 
  FiUserX, FiMail, FiMessageSquare, FiPackage, FiShield, FiEye,
  FiLock, FiUnlock, FiActivity, FiCalendar, FiBarChart2, FiPieChart,
  FiDownload, FiFilter, FiRefreshCw, FiAlertCircle, FiCheckCircle,
  FiSearch, FiEdit, FiTrash2, FiPlus, FiSettings, FiBell, FiUserPlus,
  FiFileText, FiPrinter, FiShare2, FiMoreVertical, FiStar, FiAward,
  FiLinkedin, FiClock, FiPause
} from 'react-icons/fi';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, 
  ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line,
  AreaChart, Area
} from 'recharts';
import { companyAPI } from '../services/api.js';
import api from '../services/api.js';
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
  
  // New states for admin management
  const [admins, setAdmins] = useState([]);
  const [showSendMessageModal, setShowSendMessageModal] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [sendMessageLoading, setSendMessageLoading] = useState(false);
  const [newMessage, setNewMessage] = useState({
    recipient: '',
    subject: '',
    content: '',
    type: 'email',
    recipients_count: 1
  });
  
  // New states for employee management
  const [showEmployeeDetailsModal, setShowEmployeeDetailsModal] = useState(false);
  const [showEditEmployeeModal, setShowEditEmployeeModal] = useState(false);
  const [editEmployeeLoading, setEditEmployeeLoading] = useState(false);
  const [editEmployeeData, setEditEmployeeData] = useState({
    name: '',
    email: '',
    role: '',
    package: '',
    packageExpiry: ''
  });
  
  // LinkedIn Integration states
  const [linkedinStatus, setLinkedinStatus] = useState('disconnected');
  const [linkedinLastSync, setLinkedinLastSync] = useState(null);
  const [linkedinTotalLeads, setLinkedinTotalLeads] = useState(0);
  const [linkedinLoading, setLinkedinLoading] = useState(false);
  
  // LinkedIn Feature Modals
  const [showRealTimeModal, setShowRealTimeModal] = useState(false);
  const [showAnalyticsModal, setShowAnalyticsModal] = useState(false);
  const [showOutreachModal, setShowOutreachModal] = useState(false);
  const [showCreateCampaignModal, setShowCreateCampaignModal] = useState(false);
  const [realTimeData, setRealTimeData] = useState([]);
  const [analyticsData, setAnalyticsData] = useState({});
  const [outreachCampaigns, setOutreachCampaigns] = useState([]);
  const [newCampaign, setNewCampaign] = useState({
    name: '',
    template: '',
    recipients: 0,
    industry: '',
    schedule: 'immediate'
  });
  const [createCampaignLoading, setCreateCampaignLoading] = useState(false);

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

  // Mock admin data
  const mockAdmins = [
    {
      id: 1,
      name: 'Rahul Sharma',
      email: 'rahul@company.com',
      role: 'Senior Admin',
      status: 'active',
      employees: [
        {
          id: 1,
          name: 'Priya Patel',
          email: 'priya@company.com',
          role: 'Sales Executive',
          package: 'Premium',
          packageExpiry: '2025-08-15',
          daysRemaining: 22,
          status: 'active',
          leads: 45,
          revenue: 125000
        },
        {
          id: 2,
          name: 'Amit Kumar',
          email: 'amit@company.com',
          role: 'Marketing Manager',
          package: 'Basic',
          packageExpiry: '2025-07-30',
          daysRemaining: 6,
          status: 'active',
          leads: 32,
          revenue: 89000
        },
        {
          id: 3,
          name: 'Neha Singh',
          email: 'neha@company.com',
          role: 'Customer Support',
          package: 'Enterprise',
          packageExpiry: '2025-09-20',
          daysRemaining: 58,
          status: 'active',
          leads: 28,
          revenue: 76000
        }
      ]
    },
    {
      id: 2,
      name: 'Sneha Verma',
      email: 'sneha@company.com',
      role: 'Admin Manager',
      status: 'active',
      employees: [
        {
          id: 4,
          name: 'Vikram Malhotra',
          email: 'vikram@company.com',
          role: 'Business Analyst',
          package: 'Premium',
          packageExpiry: '2025-07-25',
          daysRemaining: 1,
          status: 'active',
          leads: 38,
          revenue: 112000
        },
        {
          id: 5,
          name: 'Anjali Gupta',
          email: 'anjali@company.com',
          role: 'HR Executive',
          package: 'Basic',
          packageExpiry: '2025-08-10',
          daysRemaining: 17,
          status: 'active',
          leads: 15,
          revenue: 45000
        }
      ]
    },
    {
      id: 3,
      name: 'Arjun Mehta',
      email: 'arjun@company.com',
      role: 'Junior Admin',
      status: 'active',
      employees: [
        {
          id: 6,
          name: 'Kavya Reddy',
          email: 'kavya@company.com',
          role: 'Data Analyst',
          package: 'Enterprise',
          packageExpiry: '2025-07-28',
          daysRemaining: 4,
          status: 'active',
          leads: 52,
          revenue: 145000
        }
      ]
    }
  ];

  useEffect(() => {
    fetchDashboardData();
    setNotifications(mockNotifications);
    setAdmins(mockAdmins); // Set mock admin data
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

  const handleSendMessageToEmployee = (admin, employee) => {
    setSelectedAdmin(admin);
    setSelectedEmployee(employee);
    setNewMessage({
      recipient: employee.email,
      subject: '',
      content: '',
      type: 'email',
      recipients_count: 1
    });
    setShowSendMessageModal(true);
  };

  const handleSendMessageConfirm = async () => {
    if (!newMessage.recipient || !newMessage.subject || !newMessage.content) {
      alert('Please fill in all required fields.');
      return;
    }
    
    try {
      setSendMessageLoading(true);
      
      // Call API to send message
      await companyAPI.sendMessage({
        recipient: newMessage.recipient,
        subject: newMessage.subject,
        content: newMessage.content,
        type: newMessage.type,
        recipients_count: newMessage.recipients_count
      });
      
      alert(`Message sent successfully to ${selectedEmployee?.name}!`);
      
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

  const getPriorityColor = (daysRemaining) => {
    if (daysRemaining <= 7) return '#dc2626'; // Red - urgent
    if (daysRemaining <= 14) return '#d97706'; // Orange - medium
    return '#059669'; // Green - safe
  };

  const getPriorityText = (daysRemaining) => {
    if (daysRemaining <= 7) return 'Urgent';
    if (daysRemaining <= 14) return 'Medium';
    return 'Safe';
  };

  const handleViewEmployee = (admin, employee) => {
    setSelectedAdmin(admin);
    setSelectedEmployee(employee);
    setShowEmployeeDetailsModal(true);
  };

  const handleEditEmployee = (admin, employee) => {
    setSelectedAdmin(admin);
    setSelectedEmployee(employee);
    setEditEmployeeData({
      name: employee.name,
      email: employee.email,
      role: employee.role,
      package: employee.package,
      packageExpiry: employee.packageExpiry
    });
    setShowEditEmployeeModal(true);
  };

  const handleEditEmployeeConfirm = async () => {
    if (!editEmployeeData.name || !editEmployeeData.email || !editEmployeeData.role) {
      alert('Please fill in all required fields.');
      return;
    }
    
    try {
      setEditEmployeeLoading(true);
      
      // Call API to update employee
      await companyAPI.updateEmployee(selectedEmployee.id, editEmployeeData);
      
      alert(`Employee ${editEmployeeData.name} updated successfully!`);
      
      // Update the local state
      setAdmins(prevAdmins => 
        prevAdmins.map(admin => 
          admin.id === selectedAdmin.id 
            ? {
                ...admin,
                employees: admin.employees.map(emp => 
                  emp.id === selectedEmployee.id 
                    ? { ...emp, ...editEmployeeData }
                    : emp
                )
              }
            : admin
        )
      );
      
      // Close modal and reset form
      setShowEditEmployeeModal(false);
      setEditEmployeeData({
        name: '',
        email: '',
        role: '',
        package: '',
        packageExpiry: ''
      });
      
    } catch (error) {
      console.error('Error updating employee:', error);
      alert('Failed to update employee. Please try again.');
    } finally {
      setEditEmployeeLoading(false);
    }
  };

  const handleEditEmployeeChange = (field, value) => {
    setEditEmployeeData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleLinkedInConnect = async () => {
    try {
      setLinkedinLoading(true);
      
      // For demo purposes - simulate LinkedIn connection
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setLinkedinStatus('connected');
      setLinkedinLastSync(new Date().toLocaleString());
      setLinkedinTotalLeads(1250);
      
      alert('LinkedIn Sales Navigator connected successfully! (Demo Mode)');
      
    } catch (error) {
      console.error('Error connecting to LinkedIn:', error);
      alert('Failed to connect to LinkedIn. Please try again.');
    } finally {
      setLinkedinLoading(false);
    }
  };

  const handleLinkedInSync = async () => {
    try {
      setLinkedinLoading(true);
      
      // For demo purposes - simulate LinkedIn sync
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const newLeads = Math.floor(Math.random() * 50) + 10;
      setLinkedinLastSync(new Date().toLocaleString());
      setLinkedinTotalLeads(prev => prev + newLeads);
      
      alert(`LinkedIn data synced successfully! ${newLeads} new leads imported. (Demo Mode)`);
      
    } catch (error) {
      console.error('Error syncing LinkedIn data:', error);
      alert('Failed to sync LinkedIn data. Please try again.');
    } finally {
      setLinkedinLoading(false);
    }
  };

  // LinkedIn Feature Handlers
  const handleRealTimeTracking = () => {
    // Mock real-time data
    const mockData = [
      { lead: 'John Smith', company: 'Tech Corp', action: 'Profile Viewed', time: '2 min ago', status: 'active' },
      { lead: 'Sarah Johnson', company: 'Marketing Inc', action: 'Message Sent', time: '5 min ago', status: 'sent' },
      { lead: 'Mike Wilson', company: 'Sales Pro', action: 'Connection Request', time: '8 min ago', status: 'pending' },
      { lead: 'Lisa Brown', company: 'Business Solutions', action: 'Email Opened', time: '12 min ago', status: 'opened' },
      { lead: 'David Lee', company: 'Innovation Labs', action: 'Meeting Scheduled', time: '15 min ago', status: 'scheduled' }
    ];
    setRealTimeData(mockData);
    setShowRealTimeModal(true);
  };

  const handleAdvancedAnalytics = () => {
    // Mock analytics data
    const mockAnalytics = {
      totalLeads: 1273,
      conversionRate: 23.5,
      avgResponseTime: '2.3 hours',
      topIndustries: [
        { industry: 'Technology', count: 456, conversion: 28.2 },
        { industry: 'Healthcare', count: 234, conversion: 19.8 },
        { industry: 'Finance', count: 189, conversion: 31.5 },
        { industry: 'Education', count: 156, conversion: 15.2 },
        { industry: 'Manufacturing', count: 138, conversion: 22.1 }
      ],
      leadQuality: {
        excellent: 45,
        good: 38,
        average: 12,
        poor: 5
      },
      monthlyTrends: [
        { month: 'Jan', leads: 89, conversions: 21 },
        { month: 'Feb', leads: 112, conversions: 28 },
        { month: 'Mar', leads: 156, conversions: 37 },
        { month: 'Apr', leads: 134, conversions: 32 },
        { month: 'May', leads: 178, conversions: 42 },
        { month: 'Jun', leads: 203, conversions: 48 }
      ]
    };
    setAnalyticsData(mockAnalytics);
    setShowAnalyticsModal(true);
  };

  const handleAutomatedOutreach = () => {
    // Mock outreach campaigns
    const mockCampaigns = [
      {
        id: 1,
        name: 'Tech Industry Outreach',
        status: 'active',
        recipients: 234,
        sent: 189,
        opened: 156,
        replied: 23,
        scheduled: 12,
        template: 'Hi {firstName}, I noticed your work at {company}...'
      },
      {
        id: 2,
        name: 'Healthcare Follow-up',
        status: 'paused',
        recipients: 156,
        sent: 134,
        opened: 98,
        replied: 18,
        scheduled: 8,
        template: 'Hi {firstName}, following up on our previous conversation...'
      },
      {
        id: 3,
        name: 'Finance Decision Makers',
        status: 'draft',
        recipients: 89,
        sent: 0,
        opened: 0,
        replied: 0,
        scheduled: 0,
        template: 'Hi {firstName}, I believe {company} could benefit from...'
      }
    ];
    setOutreachCampaigns(mockCampaigns);
    setShowOutreachModal(true);
  };

  const handleCreateCampaign = () => {
    setShowCreateCampaignModal(true);
  };

  const handleNewCampaignChange = (field, value) => {
    setNewCampaign(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleCreateCampaignConfirm = async () => {
    if (!newCampaign.name || !newCampaign.template) {
      alert('Please fill in all required fields');
      return;
    }

    setCreateCampaignLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const campaign = {
        id: outreachCampaigns.length + 1,
        name: newCampaign.name,
        status: 'draft',
        recipients: newCampaign.recipients,
        sent: 0,
        opened: 0,
        replied: 0,
        scheduled: 0,
        template: newCampaign.template,
        industry: newCampaign.industry,
        schedule: newCampaign.schedule
      };

      setOutreachCampaigns(prev => [campaign, ...prev]);
      setShowCreateCampaignModal(false);
      setNewCampaign({
        name: '',
        template: '',
        recipients: 0,
        industry: '',
        schedule: 'immediate'
      });
      
      alert('Campaign created successfully!');
    } catch (error) {
      console.error('Error creating campaign:', error);
      alert('Failed to create campaign. Please try again.');
    } finally {
      setCreateCampaignLoading(false);
    }
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
          className={`tab-button ${activeTab === 'admin-management' ? 'active' : ''}`}
          onClick={() => setActiveTab('admin-management')}
        >
          <FiShield /> Admin Management
        </button>
        <button 
          className={`tab-button ${activeTab === 'linkedin-integration' ? 'active' : ''}`}
          onClick={() => setActiveTab('linkedin-integration')}
        >
          <FiLinkedin /> LinkedIn Integration
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

      {activeTab === 'admin-management' && (
        <div className="admin-management-section">
          <div className="section-header">
            <h2>Admin Management</h2>
            <p>Manage admins and their employees, packages, and communications</p>
          </div>

          <div className="admins-grid">
            {admins.map((admin) => (
              <div key={admin.id} className="admin-card">
                <div className="admin-header">
                  <div className="admin-info">
                    <div className="admin-avatar">
                      {admin.name.charAt(0)}
                    </div>
                    <div className="admin-details">
                      <h3>{admin.name}</h3>
                      <p>{admin.email}</p>
                      <span className={`role-badge ${admin.role.toLowerCase().replace(' ', '-')}`}>
                        {admin.role}
                      </span>
                    </div>
                  </div>
                  <div className="admin-stats">
                    <div className="stat-item">
                      <span className="stat-label">Employees</span>
                      <span className="stat-value">{admin.employees.length}</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-label">Total Revenue</span>
                      <span className="stat-value">₹{admin.employees.reduce((sum, emp) => sum + emp.revenue, 0).toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                <div className="employees-section">
                  <h4>Employees Under {admin.name}</h4>
                  <div className="employees-list">
                    {admin.employees.map((employee) => (
                      <div key={employee.id} className="employee-card">
                        <div className="employee-info">
                          <div className="employee-avatar">
                            {employee.name.charAt(0)}
                          </div>
                          <div className="employee-details">
                            <h5>{employee.name}</h5>
                            <p>{employee.email}</p>
                            <span className="role-badge">{employee.role}</span>
                          </div>
                        </div>
                        
                        <div className="employee-package">
                          <div className="package-info">
                            <span className="package-name">{employee.package}</span>
                            <span 
                              className="package-expiry"
                              style={{ color: getPriorityColor(employee.daysRemaining) }}
                            >
                              Expires: {employee.packageExpiry} ({employee.daysRemaining} days)
                            </span>
                            <span 
                              className={`priority-badge ${getPriorityText(employee.daysRemaining).toLowerCase()}`}
                              style={{ backgroundColor: getPriorityColor(employee.daysRemaining) + '20', color: getPriorityColor(employee.daysRemaining) }}
                            >
                              {getPriorityText(employee.daysRemaining)}
                            </span>
                          </div>
                        </div>

                        <div className="employee-performance">
                          <div className="performance-item">
                            <span>Leads:</span>
                            <strong>{employee.leads}</strong>
                          </div>
                          <div className="performance-item">
                            <span>Revenue:</span>
                            <strong>₹{employee.revenue.toLocaleString()}</strong>
                          </div>
                        </div>

                        <div className="employee-actions">
                          <button 
                            className="action-btn message"
                            onClick={() => handleSendMessageToEmployee(admin, employee)}
                            title="Send Message"
                          >
                            <FiMessageSquare /> Message
                          </button>
                          <button 
                            className="action-btn view"
                            onClick={() => handleViewEmployee(admin, employee)}
                            title="View Details"
                          >
                            <FiEye /> View
                          </button>
                          <button 
                            className="action-btn edit"
                            onClick={() => handleEditEmployee(admin, employee)}
                            title="Edit Employee"
                          >
                            <FiEdit /> Edit
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

             {activeTab === 'linkedin-integration' && (
         <div className="linkedin-integration-section">
           <div className="section-header">
             <h2>LinkedIn Integration</h2>
             <p>Connect your LinkedIn Sales Navigator account to access premium leads and insights.</p>
           </div>
           
           <div className="integration-status">
             <h3>LinkedIn Sales Navigator Status:</h3>
             <div className="status-grid">
               <div className="status-item">
                 <strong>Connection Status:</strong>
                 <span className={`status-badge ${linkedinStatus}`}>
                   {linkedinStatus === 'connected' ? 'Connected' : 'Disconnected'}
                 </span>
               </div>
               <div className="status-item">
                 <strong>Last Sync:</strong>
                 <span>{linkedinLastSync || 'Never'}</span>
               </div>
               <div className="status-item">
                 <strong>Total Leads:</strong>
                 <span>{linkedinTotalLeads.toLocaleString()}</span>
               </div>
             </div>
           </div>
           
           <div className="integration-actions">
             <button 
               className={`btn-primary ${linkedinLoading ? 'loading' : ''}`}
               onClick={() => handleLinkedInConnect()}
               disabled={linkedinLoading}
             >
               {linkedinLoading ? (
                 <>
                   <FiRefreshCw className="spinning" /> Connecting...
                 </>
               ) : (
                 <>
                   <FiLinkedin /> Connect LinkedIn
                 </>
               )}
             </button>
             <button 
               className="btn-secondary"
               onClick={() => handleLinkedInSync()}
               disabled={linkedinStatus !== 'connected' || linkedinLoading}
             >
               <FiRefreshCw /> Sync Now
             </button>
           </div>
           
           <div className="integration-features">
             <h3>LinkedIn Sales Navigator Features:</h3>
             <div className="features-grid">
               <div className="feature-card">
                 <div className="feature-icon">
                   <FiUserCheck />
                 </div>
                 <h4>Premium Lead Access</h4>
                 <p>Access to 500M+ LinkedIn profiles with advanced search filters</p>
               </div>
               <div className="feature-card clickable" onClick={handleRealTimeTracking}>
                 <div className="feature-icon">
                   <FiTrendingUp />
                 </div>
                 <h4>Real-time Tracking</h4>
                 <p>Track lead engagement and conversion in real-time</p>
                 <div className="feature-action">
                   <span>Click to view live data</span>
                 </div>
               </div>
               <div className="feature-card clickable" onClick={handleAdvancedAnalytics}>
                 <div className="feature-icon">
                   <FiBarChart2 />
                 </div>
                 <h4>Advanced Analytics</h4>
                 <p>Detailed reporting on lead quality and conversion rates</p>
                 <div className="feature-action">
                   <span>Click to view reports</span>
                 </div>
               </div>
               <div className="feature-card clickable" onClick={handleAutomatedOutreach}>
                 <div className="feature-icon">
                   <FiMail />
                 </div>
                 <h4>Automated Outreach</h4>
                 <p>Automated messaging and follow-up sequences</p>
                 <div className="feature-action">
                   <span>Click to manage campaigns</span>
                 </div>
               </div>
             </div>
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

      {/* Send Message Modal */}
      {showSendMessageModal && selectedEmployee && (
        <div className="modal-overlay" onClick={() => setShowSendMessageModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Send Message to Employee</h3>
              <button 
                className="modal-close"
                onClick={() => setShowSendMessageModal(false)}
              >
                ×
              </button>
            </div>
            
            <div className="modal-body">
              <div className="employee-info-modal">
                <div className="employee-avatar">
                  {selectedEmployee.name.charAt(0)}
                </div>
                <div>
                  <h4>{selectedEmployee.name}</h4>
                  <p>{selectedEmployee.email}</p>
                  <span className="role-badge">{selectedEmployee.role}</span>
                </div>
              </div>
              
              <div className="send-message-form">
                <div className="form-group">
                  <label>Subject:</label>
                  <input
                    type="text"
                    placeholder="Message subject"
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
                    <FiMessageSquare /> Send Message
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Employee Details Modal */}
      {showEmployeeDetailsModal && selectedEmployee && (
        <div className="modal-overlay" onClick={() => setShowEmployeeDetailsModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Employee Details</h3>
              <button onClick={() => setShowEmployeeDetailsModal(false)}>×</button>
            </div>
            <div className="modal-content">
              <div className="employee-details-info">
                <div className="employee-avatar-large">
                  {selectedEmployee.name.charAt(0)}
                </div>
                <div>
                  <h4>{selectedEmployee.name}</h4>
                  <p>{selectedEmployee.email}</p>
                  <span className="role-badge">{selectedEmployee.role}</span>
                </div>
              </div>
              <div className="employee-details-package">
                <h5>Package Details</h5>
                <p>Package: <strong>{selectedEmployee.package}</strong></p>
                <p>Expires: <strong>{selectedEmployee.packageExpiry}</strong></p>
                <p>Days Remaining: <strong>{selectedEmployee.daysRemaining}</strong></p>
                <span 
                  className={`priority-badge ${getPriorityText(selectedEmployee.daysRemaining).toLowerCase()}`}
                  style={{ backgroundColor: getPriorityColor(selectedEmployee.daysRemaining) + '20', color: getPriorityColor(selectedEmployee.daysRemaining) }}
                >
                  Priority: {getPriorityText(selectedEmployee.daysRemaining)}
                </span>
              </div>
              <div className="employee-details-performance">
                <h5>Performance</h5>
                <p>Leads: <strong>{selectedEmployee.leads}</strong></p>
                <p>Revenue: <strong>₹{selectedEmployee.revenue.toLocaleString()}</strong></p>
              </div>
              <div className="employee-actions">
                <button 
                  className="action-btn edit"
                  onClick={() => handleEditEmployee(selectedAdmin, selectedEmployee)}
                >
                  <FiEdit /> Edit
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Employee Modal */}
      {showEditEmployeeModal && selectedEmployee && (
        <div className="modal-overlay" onClick={() => setShowEditEmployeeModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Edit Employee</h3>
              <button onClick={() => setShowEditEmployeeModal(false)}>×</button>
            </div>
            <div className="modal-content">
              <form onSubmit={(e) => { e.preventDefault(); handleEditEmployeeConfirm(); }}>
                <div className="form-group">
                  <label>Name:</label>
                  <input
                    type="text"
                    value={editEmployeeData.name}
                    onChange={(e) => handleEditEmployeeChange('name', e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Email:</label>
                  <input
                    type="email"
                    value={editEmployeeData.email}
                    onChange={(e) => handleEditEmployeeChange('email', e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Role:</label>
                  <select
                    value={editEmployeeData.role}
                    onChange={(e) => handleEditEmployeeChange('role', e.target.value)}
                    required
                  >
                    <option value="Sales Executive">Sales Executive</option>
                    <option value="Marketing Manager">Marketing Manager</option>
                    <option value="Business Analyst">Business Analyst</option>
                    <option value="HR Executive">HR Executive</option>
                    <option value="Data Analyst">Data Analyst</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Package:</label>
                  <select
                    value={editEmployeeData.package}
                    onChange={(e) => handleEditEmployeeChange('package', e.target.value)}
                    required
                  >
                    <option value="Basic">Basic</option>
                    <option value="Premium">Premium</option>
                    <option value="Enterprise">Enterprise</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Package Expiry:</label>
                  <input
                    type="date"
                    value={editEmployeeData.packageExpiry}
                    onChange={(e) => handleEditEmployeeChange('packageExpiry', e.target.value)}
                    required
                  />
                </div>
                <div className="form-actions">
                  <button type="button" onClick={() => setShowEditEmployeeModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" disabled={editEmployeeLoading}>
                    {editEmployeeLoading ? (
                      <>
                        <FiRefreshCw className="spinning" /> Saving...
                      </>
                    ) : (
                      <>
                        <FiCheckCircle /> Save Changes
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Real-time Tracking Modal */}
      {showRealTimeModal && (
        <div className="modal-overlay" onClick={() => setShowRealTimeModal(false)}>
          <div className="modal-content large-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Real-time Lead Tracking</h3>
              <button onClick={() => setShowRealTimeModal(false)}>×</button>
            </div>
            <div className="modal-body">
              <div className="real-time-stats">
                <div className="stat-card">
                  <h4>Active Leads</h4>
                  <span className="stat-number">1273</span>
                </div>
                <div className="stat-card">
                  <h4>Engagement Rate</h4>
                  <span className="stat-number">23.5%</span>
                </div>
                <div className="stat-card">
                  <h4>Response Time</h4>
                  <span className="stat-number">2.3h</span>
                </div>
              </div>
              <div className="real-time-activity">
                <h4>Live Activity Feed</h4>
                <div className="activity-list">
                  {realTimeData.map((activity, index) => (
                    <div key={index} className="activity-item">
                      <div className="activity-icon">
                        {activity.status === 'active' && <FiTrendingUp />}
                        {activity.status === 'sent' && <FiMail />}
                        {activity.status === 'pending' && <FiClock />}
                        {activity.status === 'opened' && <FiEye />}
                        {activity.status === 'scheduled' && <FiCalendar />}
                      </div>
                      <div className="activity-content">
                        <div className="activity-header">
                          <strong>{activity.lead}</strong> at <strong>{activity.company}</strong>
                        </div>
                        <div className="activity-action">{activity.action}</div>
                        <div className="activity-time">{activity.time}</div>
                      </div>
                      <div className={`activity-status ${activity.status}`}>
                        {activity.status}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Advanced Analytics Modal */}
      {showAnalyticsModal && (
        <div className="modal-overlay" onClick={() => setShowAnalyticsModal(false)}>
          <div className="modal-content large-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Advanced Analytics Dashboard</h3>
              <button onClick={() => setShowAnalyticsModal(false)}>×</button>
            </div>
            <div className="modal-body">
              <div className="analytics-overview">
                <div className="overview-card">
                  <h4>Total Leads</h4>
                  <span className="overview-number">{analyticsData.totalLeads?.toLocaleString()}</span>
                </div>
                <div className="overview-card">
                  <h4>Conversion Rate</h4>
                  <span className="overview-number">{analyticsData.conversionRate}%</span>
                </div>
                <div className="overview-card">
                  <h4>Avg Response Time</h4>
                  <span className="overview-number">{analyticsData.avgResponseTime}</span>
                </div>
              </div>
              
              <div className="analytics-charts">
                <div className="chart-section">
                  <h4>Top Industries</h4>
                  <div className="industry-list">
                    {analyticsData.topIndustries?.map((industry, index) => (
                      <div key={index} className="industry-item">
                        <div className="industry-info">
                          <span className="industry-name">{industry.industry}</span>
                          <span className="industry-count">{industry.count} leads</span>
                        </div>
                        <div className="industry-bar">
                          <div 
                            className="industry-progress" 
                            style={{ width: `${(industry.count / 456) * 100}%` }}
                          ></div>
                        </div>
                        <span className="industry-conversion">{industry.conversion}% conversion</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="chart-section">
                  <h4>Lead Quality Distribution</h4>
                  <div className="quality-chart">
                    <div className="quality-item">
                      <span className="quality-label">Excellent</span>
                      <div className="quality-bar">
                        <div className="quality-progress excellent" style={{ width: `${analyticsData.leadQuality?.excellent}%` }}></div>
                      </div>
                      <span className="quality-percentage">{analyticsData.leadQuality?.excellent}%</span>
                    </div>
                    <div className="quality-item">
                      <span className="quality-label">Good</span>
                      <div className="quality-bar">
                        <div className="quality-progress good" style={{ width: `${analyticsData.leadQuality?.good}%` }}></div>
                      </div>
                      <span className="quality-percentage">{analyticsData.leadQuality?.good}%</span>
                    </div>
                    <div className="quality-item">
                      <span className="quality-label">Average</span>
                      <div className="quality-bar">
                        <div className="quality-progress average" style={{ width: `${analyticsData.leadQuality?.average}%` }}></div>
                      </div>
                      <span className="quality-percentage">{analyticsData.leadQuality?.average}%</span>
                    </div>
                    <div className="quality-item">
                      <span className="quality-label">Poor</span>
                      <div className="quality-bar">
                        <div className="quality-progress poor" style={{ width: `${analyticsData.leadQuality?.poor}%` }}></div>
                      </div>
                      <span className="quality-percentage">{analyticsData.leadQuality?.poor}%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Automated Outreach Modal */}
      {showOutreachModal && (
        <div className="modal-overlay" onClick={() => setShowOutreachModal(false)}>
          <div className="modal-content large-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Automated Outreach Campaigns</h3>
              <button onClick={() => setShowOutreachModal(false)}>×</button>
            </div>
            <div className="modal-body">
              <div className="campaigns-header">
                <button className="btn-primary" onClick={handleCreateCampaign}>
                  <FiPlus /> Create New Campaign
                </button>
              </div>
              
              <div className="campaigns-list">
                {outreachCampaigns.map((campaign) => (
                  <div key={campaign.id} className="campaign-card">
                    <div className="campaign-header">
                      <h4>{campaign.name}</h4>
                      <span className={`campaign-status ${campaign.status}`}>
                        {campaign.status}
                      </span>
                    </div>
                    
                    <div className="campaign-stats">
                      <div className="stat-item">
                        <span className="stat-label">Recipients</span>
                        <span className="stat-value">{campaign.recipients}</span>
                      </div>
                      <div className="stat-item">
                        <span className="stat-label">Sent</span>
                        <span className="stat-value">{campaign.sent}</span>
                      </div>
                      <div className="stat-item">
                        <span className="stat-label">Opened</span>
                        <span className="stat-value">{campaign.opened}</span>
                      </div>
                      <div className="stat-item">
                        <span className="stat-label">Replied</span>
                        <span className="stat-value">{campaign.replied}</span>
                      </div>
                      <div className="stat-item">
                        <span className="stat-label">Scheduled</span>
                        <span className="stat-value">{campaign.scheduled}</span>
                      </div>
                    </div>
                    
                    <div className="campaign-template">
                      <h5>Message Template:</h5>
                      <p>{campaign.template}</p>
                    </div>
                    
                    <div className="campaign-actions">
                      <button className="action-btn edit">
                        <FiEdit /> Edit
                      </button>
                      <button className="action-btn pause">
                        <FiPause /> Pause
                      </button>
                      <button className="action-btn delete">
                        <FiTrash2 /> Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create Campaign Modal */}
      {showCreateCampaignModal && (
        <div className="modal-overlay" onClick={() => setShowCreateCampaignModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Create New Campaign</h3>
              <button onClick={() => setShowCreateCampaignModal(false)}>×</button>
            </div>
            <div className="modal-body">
              <form onSubmit={(e) => { e.preventDefault(); handleCreateCampaignConfirm(); }}>
                <div className="form-group">
                  <label>Campaign Name *</label>
                  <input
                    type="text"
                    value={newCampaign.name}
                    onChange={(e) => handleNewCampaignChange('name', e.target.value)}
                    placeholder="e.g., Tech Industry Outreach"
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label>Target Industry</label>
                  <select
                    value={newCampaign.industry}
                    onChange={(e) => handleNewCampaignChange('industry', e.target.value)}
                  >
                    <option value="">Select Industry</option>
                    <option value="Technology">Technology</option>
                    <option value="Healthcare">Healthcare</option>
                    <option value="Finance">Finance</option>
                    <option value="Education">Education</option>
                    <option value="Manufacturing">Manufacturing</option>
                    <option value="Retail">Retail</option>
                    <option value="Real Estate">Real Estate</option>
                    <option value="Consulting">Consulting</option>
                  </select>
                </div>
                
                <div className="form-group">
                  <label>Estimated Recipients</label>
                  <input
                    type="number"
                    value={newCampaign.recipients}
                    onChange={(e) => handleNewCampaignChange('recipients', parseInt(e.target.value) || 0)}
                    placeholder="0"
                    min="0"
                  />
                </div>
                
                <div className="form-group">
                  <label>Schedule</label>
                  <select
                    value={newCampaign.schedule}
                    onChange={(e) => handleNewCampaignChange('schedule', e.target.value)}
                  >
                    <option value="immediate">Send Immediately</option>
                    <option value="scheduled">Schedule for Later</option>
                    <option value="drip">Drip Campaign</option>
                  </select>
                </div>
                
                <div className="form-group">
                  <label>Message Template *</label>
                  <textarea
                    value={newCampaign.template}
                    onChange={(e) => handleNewCampaignChange('template', e.target.value)}
                    placeholder="Hi {firstName}, I noticed your work at {company}..."
                    rows="6"
                    required
                  />
                  <div className="template-variables">
                    <small>Available variables: {'{firstName}'}, {'{lastName}'}, {'{company}'}, {'{position}'}</small>
                  </div>
                </div>
                
                <div className="form-actions">
                  <button type="button" onClick={() => setShowCreateCampaignModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" disabled={createCampaignLoading}>
                    {createCampaignLoading ? (
                      <>
                        <FiRefreshCw className="spinning" /> Creating...
                      </>
                    ) : (
                      <>
                        <FiPlus /> Create Campaign
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CompanyDashboard; 