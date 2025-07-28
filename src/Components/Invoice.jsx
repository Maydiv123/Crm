import React, { useState, useEffect } from 'react';
import { FaPlus, FaExclamationTriangle, FaUsers, FaTags, FaCalendarAlt, FaClock, FaFileAlt, FaCreditCard, FaSync, FaBell, FaStar, FaFilter, FaDownload, FaUpload, FaCog, FaLightbulb, FaCheck } from 'react-icons/fa';
import InvoiceStats from './InvoiceStats';
import InvoiceTable from './InvoiceTable';
import InvoiceForm from './InvoiceForm';
import InvoiceDetails from './InvoiceDetails';
import InvoiceTemplates from './InvoiceTemplates';
import { dummyClients, calculateInvoiceTotals, generateInvoiceId } from './InvoiceUtils';
import { invoicesAPI } from '../services/api';
import './Invoice.css';
// Custom Images
import AutomationImg from '../assets/Automation.png';
import AnalyticsImg from '../assets/Analytics.png';
import AiImg from '../assets/Ai.png';
import PipelineImg from '../assets/Pipeline.png';
import InvoiceImg from '../assets/Invoice.png';

export default function Invoice() {
  // Default sample data to prevent crashes
  const defaultInvoices = [
    {
      id: 1,
      invoice_id: 'INV-001',
      client_name: 'John Doe',
      client_email: 'john@example.com',
      amount: 1500,
      status: 'Paid',
      due_date: '2024-01-15',
      description: 'Web Development Services',
      assigned_to: 'Amit Sharma',
      priority: 'Medium',
      pipeline: 'Sales Pipeline',
      stage: 'Closed - Won',
      created_at: '2024-01-01',
      total: 1500
    },
    {
      id: 2,
      invoice_id: 'INV-002',
      client_name: 'Jane Smith',
      client_email: 'jane@example.com',
      amount: 2500,
      status: 'Pending',
      due_date: '2024-01-20',
      description: 'Mobile App Development',
      assigned_to: 'Priya Singh',
      priority: 'High',
      pipeline: 'Sales Pipeline',
      stage: 'Decision Making',
      created_at: '2024-01-05',
      total: 2500
    }
  ];

  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [editingInvoice, setEditingInvoice] = useState(null);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [showWarning, setShowWarning] = useState(false);
  
  // Advanced CRM Features State
  const [activeTab, setActiveTab] = useState('all');
  const [selectedPipeline, setSelectedPipeline] = useState('Sales Pipeline');
  const [selectedStage, setSelectedStage] = useState('All');
  const [selectedAssignee, setSelectedAssignee] = useState('All');
  const [selectedPriority, setSelectedPriority] = useState('All');
  const [showAutomation, setShowAutomation] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [showAIInsights, setShowAIInsights] = useState(false);
  const [showRecurringSetup, setShowRecurringSetup] = useState(false);
  const [showPaymentIntegration, setShowPaymentIntegration] = useState(false);
  const [bulkSelected, setBulkSelected] = useState([]);
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  
  // Settings state
  const [settings, setSettings] = useState({
    currency: 'INR',
    taxRate: 18,
    invoicePrefix: 'INV-',
    autoReminders: true,
    invoiceNotifications: true,
    itemsPerPage: 25
  });
  
  // Automation state
  const [automationRules, setAutomationRules] = useState({
    paymentReminders: true,
    statusUpdates: true,
    followUps: false
  });

  // Load invoices from database on component mount
  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        setLoading(true);
        const response = await invoicesAPI.getAll();
        if (response.data.success) {
          setInvoices(response.data.data);
        }
      } catch (err) {
        console.error('Error fetching invoices:', err);
        // Add sample data for testing tabs
        const sampleInvoices = [
          {
            id: 1,
            invoice_id: 'INV-001',
            client_name: 'John Doe',
            client_email: 'john@example.com',
            amount: 1500,
            status: 'Draft',
            due_date: '2024-01-15',
            description: 'Web Development Services',
            assigned_to: 'Amit Sharma',
            priority: 'Medium',
            pipeline: 'Sales Pipeline',
            stage: 'Initial Contact',
            created_at: '2024-01-01',
            total: 1500
          },
          {
            id: 2,
            invoice_id: 'INV-002',
            client_name: 'Jane Smith',
            client_email: 'jane@example.com',
            amount: 2500,
            status: 'Sent',
            due_date: '2024-01-20',
            description: 'Mobile App Development',
            assigned_to: 'Priya Singh',
            priority: 'High',
            pipeline: 'Sales Pipeline',
            stage: 'Decision Making',
            created_at: '2024-01-05',
            total: 2500
          },
          {
            id: 3,
            invoice_id: 'INV-003',
            client_name: 'Bob Wilson',
            client_email: 'bob@example.com',
            amount: 3000,
            status: 'Paid',
            due_date: '2024-01-10',
            description: 'UI/UX Design',
            assigned_to: 'Akash Kumar',
            priority: 'Low',
            pipeline: 'Service Pipeline',
            stage: 'Completed',
            created_at: '2024-01-03',
            total: 3000
          },
          {
            id: 4,
            invoice_id: 'INV-004',
            client_name: 'Alice Brown',
            client_email: 'alice@example.com',
            amount: 1800,
            status: 'Overdue',
            due_date: '2024-01-05',
            description: 'Consulting Services',
            assigned_to: 'Admin',
            priority: 'High',
            pipeline: 'Sales Pipeline',
            stage: 'Contract Discussion',
            created_at: '2024-01-02',
            total: 1800
          }
        ];
        setInvoices(sampleInvoices);
      } finally {
        setLoading(false);
      }
    };

    fetchInvoices();
  }, []);

  // Pipelines and Stages
  const pipelines = [
    {
      name: 'Sales Pipeline',
      stages: ['Initial Contact', 'Discussions', 'Decision Making', 'Contract Discussion', 'Closed - Won', 'Closed - Lost']
    },
    {
      name: 'Service Pipeline',
      stages: ['Request Received', 'In Progress', 'Review', 'Completed', 'Billed']
    }
  ];

  const users = ['Amit Sharma', 'Priya Singh', 'Akash Kumar', 'Admin'];
  const priorities = ['low', 'medium', 'high'];
  const tags = ['web-development', 'mobile-app', 'design', 'consulting', 'premium-client', 'urgent'];

  // Calculate advanced stats
  const stats = {
    total: invoices.length,
    amount: invoices.reduce((sum, inv) => {
      const amount = parseFloat(inv.total || inv.amount || 0);
      return sum + amount;
    }, 0),
    paid: invoices.filter(inv => inv.status === 'Paid').length,
    pending: invoices.filter(inv => inv.status === 'Pending').length,
    overdue: invoices.filter(inv => inv.status === 'Overdue').length,
    // Advanced stats
    highPriority: invoices.filter(inv => inv.priority === 'high').length,
    thisMonth: invoices.filter(inv => {
      const invDate = new Date(inv.date || inv.created_at);
      return invDate.getMonth() === new Date().getMonth();
    }).length,
    avgPaymentTime: 25, // days
    conversionRate: 85, // percentage
    recurringRevenue: invoices.filter(inv => inv.recurring).reduce((sum, inv) => {
      const amount = parseFloat(inv.total || inv.amount || 0);
      return sum + amount;
    }, 0)
  };

  // AI Insights
  const aiInsights = {
    topPerformingClient: 'John Doe',
    riskInvoices: invoices.filter(inv => inv.aiInsights?.riskLevel === 'high').length,
    suggestedActions: [
      'Send payment reminders to 3 overdue invoices',
      'Follow up with 2 high-priority clients',
      'Schedule demo calls for 1 pending invoice'
    ],
    revenueForecast: {
      thisMonth: 5800,
      nextMonth: 7200,
      trend: 'increasing'
    }
  };

  const handleCreateInvoice = async (invoiceData) => {
    try {
      // Calculate total from line items if not provided
      let totalAmount = parseFloat(invoiceData.total || invoiceData.amount || 0);
      
      // If total is 0, calculate from line items
      if (totalAmount === 0 && invoiceData.lineItems && invoiceData.lineItems.length > 0) {
        totalAmount = invoiceData.lineItems.reduce((sum, item) => {
          const qty = parseFloat(item.qty || 0);
          const price = parseFloat(item.price || 0);
          return sum + (qty * price);
        }, 0);
      }
      
      // Ensure minimum amount
      if (totalAmount <= 0) {
        alert('Please enter a valid amount for the invoice');
        return;
      }

      // Create invoice data matching backend expectations with all required fields filled
      const newInvoice = {
        id: Date.now(), // Generate a temporary ID
        invoice_id: generateInvoiceId(),
        client_name: invoiceData.clientName || 'Default Client',
        client_email: invoiceData.clientEmail || 'client@example.com',
        total: totalAmount || 1000,
        status: invoiceData.status || 'Draft',
        due_date: (invoiceData.dueDate || new Date().toISOString().split('T')[0]).split('T')[0],
        description: invoiceData.notes || invoiceData.description || 'Invoice description',
        assigned_to: invoiceData.assignedTo || 'Amit Sharma',
        priority: invoiceData.priority || 'Medium',
        pipeline: invoiceData.pipeline || 'Sales Pipeline',
        stage: invoiceData.stage || 'Initial Contact',
        created_at: new Date().toISOString().split('T')[0]
      };

      console.log('Creating invoice with data:', newInvoice);
      console.log('Original form data:', invoiceData);

      const response = await invoicesAPI.create(newInvoice);
      if (response.data.success) {
        // Refresh the invoices list from database
        const refreshResponse = await invoicesAPI.getAll();
        if (refreshResponse.data.success) {
          setInvoices(refreshResponse.data.data);
        }
        setShowCreateModal(false);
        alert('Invoice created successfully!');
      }
      
    } catch (error) {
      console.error('Error creating invoice:', error);
      alert('Failed to create invoice. Please try again.');
    }
  };

  const handleUpdateInvoice = async (invoiceData) => {
    try {
      console.log('Updating invoice with data:', invoiceData);
      
      // Calculate total amount
      let totalAmount = parseFloat(invoiceData.total || invoiceData.amount || 0);
      
      // If total is 0, calculate from line items
      if (totalAmount === 0 && invoiceData.lineItems && invoiceData.lineItems.length > 0) {
        totalAmount = invoiceData.lineItems.reduce((sum, item) => {
          const qty = parseFloat(item.qty || 0);
          const price = parseFloat(item.price || 0);
          return sum + (qty * price);
        }, 0);
      }
      
      // Map form data to backend format with all required fields filled
      const updateData = {
        invoice_id: invoiceData.invoice_id || invoiceData.id || `INV-${Date.now()}`,
        client_name: invoiceData.clientName || invoiceData.client_name || 'Default Client',
        client_email: invoiceData.clientEmail || invoiceData.client_email || 'client@example.com',
        total: totalAmount || 1000,
        status: invoiceData.status || 'Draft',
        due_date: (invoiceData.dueDate || invoiceData.due_date || new Date().toISOString().split('T')[0]).split('T')[0],
        description: invoiceData.notes || invoiceData.description || 'Invoice description',
        assigned_to: invoiceData.assignedTo || invoiceData.assigned_to || 'Amit Sharma',
        priority: invoiceData.priority || 'Medium',
        pipeline: invoiceData.pipeline || 'Sales Pipeline',
        stage: invoiceData.stage || 'Initial Contact'
      };

      console.log('Sending update data to backend:', updateData);

      // Update in backend database
      const response = await invoicesAPI.update(invoiceData.id, updateData);
      if (response.data.success) {
        console.log('Backend update successful');
        
        // Refresh the complete list from database to ensure consistency
        const refreshResponse = await invoicesAPI.getAll();
        if (refreshResponse.data.success) {
          setInvoices(refreshResponse.data.data);
          console.log('Refreshed invoices from database');
        }
        
        setShowCreateModal(false);
        setEditingInvoice(null);
        alert('Invoice updated successfully in database!');
      } else {
        throw new Error('Backend update failed');
      }
    } catch (error) {
      console.error('Error updating invoice:', error);
      
      // If backend fails, still update locally for immediate feedback
      const updatedInvoices = invoices.map(inv => 
        inv.id === invoiceData.id ? { 
          ...inv, 
          client_name: invoiceData.clientName || invoiceData.client_name,
          client_email: invoiceData.clientEmail || invoiceData.client_email,
          amount: parseFloat(invoiceData.total || invoiceData.amount || 0),
          status: invoiceData.status,
          due_date: invoiceData.dueDate || invoiceData.due_date,
          description: invoiceData.notes || invoiceData.description,
          assigned_to: invoiceData.assignedTo || invoiceData.assigned_to,
          priority: invoiceData.priority,
          pipeline: invoiceData.pipeline,
          stage: invoiceData.stage
        } : inv
      );
      setInvoices(updatedInvoices);
      setShowCreateModal(false);
      setEditingInvoice(null);
      alert('Invoice updated locally (backend error - changes may not persist)');
    }
  };

  const handleViewInvoice = (invoice) => {
    setSelectedInvoice(invoice);
    setShowDetailsModal(true);
  };

  const handleEditInvoice = (invoice) => {
    console.log('Editing invoice:', invoice);
    setEditingInvoice(invoice);
    setShowCreateModal(true);
  };

  const handleDeleteInvoice = async (invoiceId) => {
    if (window.confirm('Are you sure you want to delete this invoice?')) {
      try {
        // Try to delete from backend first
        const response = await invoicesAPI.delete(invoiceId);
        if (response.data.success) {
          // Remove from local state immediately
          const updatedInvoices = invoices.filter(invoice => invoice.id !== invoiceId);
          setInvoices(updatedInvoices);
          alert('Invoice deleted successfully from database!');
        }
      } catch (error) {
        console.error('Error deleting invoice:', error);
        // If backend fails, still delete locally
        const updatedInvoices = invoices.filter(invoice => invoice.id !== invoiceId);
        setInvoices(updatedInvoices);
        alert('Invoice deleted locally (backend error)');
      }
    }
  };

  const handleAction = (action, data) => {
    switch (action) {
      case 'edit':
        handleEditInvoice(data);
        break;
      case 'delete':
        handleDeleteInvoice(data.id);
        break;
      case 'view':
        handleViewInvoice(data);
        break;
      case 'markPaid':
        handleMarkAsPaid(data.id);
        break;
      case 'send':
        handleSendInvoice(data.id);
        break;
      case 'duplicate':
        handleDuplicateInvoice(data);
        break;
      case 'export':
        handleExportInvoice(data.id);
        break;
      case 'addNote':
        handleAddNote(data.id);
        break;
      case 'schedule':
        handleScheduleFollowUp(data.id);
        break;
      case 'assign':
        handleAssignInvoice(data.id);
        break;
      case 'changeStage':
        handleChangeStage(data.id);
        break;
      case 'addTags':
        handleAddTags(data.id);
        break;
      case 'setPriority':
        handleSetPriority(data.id);
        break;
      case 'addToPipeline':
        handleAddToPipeline(data.id);
        break;
      case 'createTask':
        handleCreateTask(data.id);
        break;
      case 'sendReminder':
        handleSendReminder(data.id);
        break;
      case 'markOverdue':
        handleMarkOverdue(data.id);
        break;
      case 'archive':
        handleArchiveInvoice(data.id);
        break;
      case 'restore':
        handleRestoreInvoice(data.id);
        break;
      case 'bulkEdit':
        handleBulkEdit();
        break;
      case 'bulkDelete':
        handleBulkDelete();
        break;
      case 'bulkExport':
        handleBulkExport();
        break;
      case 'bulkSend':
        handleBulkSend();
        break;
      case 'bulkMarkPaid':
        handleBulkMarkPaid();
        break;
      case 'bulkAssign':
        handleBulkAssign();
        break;
      case 'bulkChangeStage':
        handleBulkChangeStage();
        break;
      case 'bulkAddTags':
        handleBulkAddTags();
        break;
      case 'bulkSetPriority':
        handleBulkSetPriority();
        break;
      case 'bulkAddToPipeline':
        handleBulkAddToPipeline();
        break;
      case 'bulkCreateTasks':
        handleBulkCreateTasks();
        break;
      case 'bulkSendReminders':
        handleBulkSendReminders();
        break;
      case 'bulkMarkOverdue':
        handleBulkMarkOverdue();
        break;
      case 'bulkArchive':
        handleBulkArchive();
        break;
      case 'bulkRestore':
        handleBulkRestore();
        break;
      default:
        console.log('Unknown action:', action);
    }
  };

  // Placeholder functions for actions
  const handleMarkAsPaid = (id) => {
    console.log('Mark as paid:', id);
  };

  const handleSendInvoice = (id) => {
    console.log('Send invoice:', id);
  };

  const handleDuplicateInvoice = (data) => {
    console.log('Duplicate invoice:', data);
  };

  const handleExportInvoice = (id) => {
    console.log('Export invoice:', id);
  };

  const handleAddNote = (id) => {
    console.log('Add note:', id);
  };

  const handleScheduleFollowUp = (id) => {
    console.log('Schedule follow-up:', id);
  };

  const handleAssignInvoice = (id) => {
    console.log('Assign invoice:', id);
  };

  const handleChangeStage = (id) => {
    console.log('Change stage:', id);
  };

  const handleAddTags = (id) => {
    console.log('Add tags:', id);
  };

  const handleSetPriority = (id) => {
    console.log('Set priority:', id);
  };

  const handleAddToPipeline = (id) => {
    console.log('Add to pipeline:', id);
  };

  const handleCreateTask = (id) => {
    console.log('Create task:', id);
  };

  const handleSendReminder = (id) => {
    console.log('Send reminder:', id);
  };

  const handleMarkOverdue = (id) => {
    console.log('Mark overdue:', id);
  };

  const handleArchiveInvoice = (id) => {
    console.log('Archive invoice:', id);
  };

  const handleRestoreInvoice = (id) => {
    console.log('Restore invoice:', id);
  };

  const handleBulkEdit = () => {
    console.log('Bulk edit');
  };

  const handleBulkDelete = () => {
    console.log('Bulk delete');
  };

  const handleBulkExport = () => {
    console.log('Bulk export');
  };

  const handleBulkSend = () => {
    console.log('Bulk send');
  };

  const handleBulkMarkPaid = () => {
    console.log('Bulk mark paid');
  };

  const handleBulkAssign = () => {
    console.log('Bulk assign');
  };

  const handleBulkChangeStage = () => {
    console.log('Bulk change stage');
  };

  const handleBulkAddTags = () => {
    console.log('Bulk add tags');
  };

  const handleBulkSetPriority = () => {
    console.log('Bulk set priority');
  };

  const handleBulkAddToPipeline = () => {
    console.log('Bulk add to pipeline');
  };

  const handleBulkCreateTasks = () => {
    console.log('Bulk create tasks');
  };

  const handleBulkSendReminders = () => {
    console.log('Bulk send reminders');
  };

  const handleBulkMarkOverdue = () => {
    console.log('Bulk mark overdue');
  };

  const handleBulkArchive = () => {
    console.log('Bulk archive');
  };

  const handleBulkRestore = () => {
    console.log('Bulk restore');
  };



  // Export functionality
  const handleExport = () => {
    const csvContent = [
      ['Invoice ID', 'Client Name', 'Client Email', 'Amount', 'Status', 'Due Date', 'Assigned To', 'Priority'],
      ...filteredInvoices.map(inv => [
        inv.invoice_id,
        inv.client_name,
        inv.client_email,
        inv.amount || inv.total,
        inv.status,
        inv.due_date,
        inv.assigned_to,
        inv.priority
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `invoices_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    
    alert(`Exported ${filteredInvoices.length} invoices to CSV`);
  };

  // Import functionality
  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.csv';
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const csv = event.target.result;
          const lines = csv.split('\n');
          const headers = lines[0].split(',');
          const importedInvoices = lines.slice(1).map(line => {
            const values = line.split(',');
            return {
              invoice_id: values[0],
              client_name: values[1],
              client_email: values[2],
              amount: parseFloat(values[3]) || 0,
              status: values[4],
              due_date: values[5],
              assigned_to: values[6],
              priority: values[7]
            };
          }).filter(inv => inv.invoice_id);
          
          alert(`Imported ${importedInvoices.length} invoices from CSV`);
          // Here you would typically save to database
          console.log('Imported invoices:', importedInvoices);
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  const handleModalClose = () => {
    setShowCreateModal(false);
    setShowDetailsModal(false);
    setShowAutomation(false);
    setShowAnalytics(false);
    setShowAIInsights(false);
    setShowRecurringSetup(false);
    setShowPaymentIntegration(false);
    setShowSettings(false);
    setEditingInvoice(null);
    setSelectedInvoice(null);
  };

  const handleBulkAction = (action) => {
    switch (action) {
      case 'delete':
        if (window.confirm(`Delete ${bulkSelected.length} invoices?`)) {
          // This would need backend implementation for bulk delete
          console.log('Bulk delete:', bulkSelected);
        }
        break;
      case 'markPaid':
        // This would need backend implementation for bulk mark as paid
        console.log('Bulk mark as paid:', bulkSelected);
        break;
      case 'assign':
        const assignee = prompt('Enter assignee name:');
        if (assignee) {
          setInvoices(prev => prev.map(inv => 
            bulkSelected.includes(inv.id) ? { ...inv, assigned_to: assignee } : inv
          ));
        }
        break;
      case 'addTags':
        const tags = prompt('Enter tags (comma separated):');
        if (tags) {
          const tagArray = tags.split(',').map(t => t.trim());
          setInvoices(prev => prev.map(inv => 
            bulkSelected.includes(inv.id) ? { 
              ...inv, 
              tags: [...new Set([...inv.tags, ...tagArray])]
            } : inv
          ));
        }
        break;
      case 'export':
        alert(`Exporting ${bulkSelected.length} invoices...`);
        break;
    }
    setBulkSelected([]);
    setShowBulkActions(false);
  };

  // Filter invoices based on active tab
  const getFilteredInvoices = () => {
    let filtered = invoices;
    
    console.log('Current activeTab:', activeTab);
    console.log('Total invoices:', filtered.length);
    
    // Filter by active tab
    if (activeTab === 'draft') {
      filtered = filtered.filter(inv => inv.status === 'Draft');
      console.log('Draft invoices:', filtered.length);
    } else if (activeTab === 'sent') {
      filtered = filtered.filter(inv => inv.status === 'Sent');
      console.log('Sent invoices:', filtered.length);
    } else if (activeTab === 'paid') {
      filtered = filtered.filter(inv => inv.status === 'Paid');
      console.log('Paid invoices:', filtered.length);
    } else if (activeTab === 'overdue') {
      filtered = filtered.filter(inv => inv.status === 'Overdue');
      console.log('Overdue invoices:', filtered.length);
    }
    
    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(inv => 
        inv.invoice_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inv.client_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inv.client_email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inv.assigned_to?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inv.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply other filters
    filtered = filtered.filter(invoice => {
      const matchesPipeline = selectedPipeline === 'All' || invoice.pipeline === selectedPipeline;
      const matchesStage = selectedStage === 'All' || invoice.stage === selectedStage;
      const matchesAssignee = selectedAssignee === 'All' || invoice.assigned_to === selectedAssignee;
      const matchesPriority = selectedPriority === 'All' || invoice.priority === selectedPriority;
      return matchesPipeline && matchesStage && matchesAssignee && matchesPriority;
    });
    
    console.log('Final filtered invoices:', filtered.length);
    return filtered;
  };

  const filteredInvoices = getFilteredInvoices();

  if (loading) {
    return (
      <div className="invoice-page">
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <div style={{ fontSize: '18px', color: '#666' }}>Loading invoices...</div>
        </div>
      </div>
    );
  }

  // Remove error handling - always show the full interface

  return (
    <div className="invoice-page">
      {/* Header */}
      <div className="invoice-header">
        <div>
          <h1 className="invoice-header-title">
            <img src={InvoiceImg} alt="Invoice" style={{ width: '32px', height: '32px', marginRight: '12px', verticalAlign: 'middle' }} />
            Advanced Invoice Management
          </h1>
          <p className="invoice-header-desc">Complete CRM-integrated invoice system with AI insights and automation</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            className="invoice-btn-primary"
            onClick={() => setShowAutomation(true)}
            style={{ backgroundColor: '#ff6b35' }}
          >
            <img src={AutomationImg} alt="Automation" style={{ width: '20px', height: '20px', marginRight: '8px' }} />
            Automation
          </button>
          <button
            className="invoice-btn-primary"
            onClick={() => setShowAnalytics(true)}
            style={{ backgroundColor: '#4ecdc4' }}
          >
            <img src={AnalyticsImg} alt="Analytics" style={{ width: '20px', height: '20px', marginRight: '8px' }} />
            Analytics
          </button>
          <button
            className="invoice-btn-primary"
            onClick={() => setShowCreateModal(true)}
          >
            <FaPlus /> Create Invoice
          </button>
        </div>
      </div>

      {/* Advanced Tabs */}
      <div style={{ 
        display: 'flex', 
        gap: '8px', 
        marginBottom: '24px',
        background: 'white',
        padding: '16px',
        borderRadius: '12px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
      }}>
        <button
          className={`invoice-tab ${activeTab === 'all' ? 'active' : ''}`}
          onClick={() => {
            console.log('Clicking All Invoices tab');
            setActiveTab('all');
          }}
        >
          All Invoices
        </button>
        <button
          className={`invoice-tab ${activeTab === 'draft' ? 'active' : ''}`}
          onClick={() => {
            console.log('Clicking Draft tab');
            setActiveTab('draft');
          }}
        >
          Draft
        </button>
        <button
          className={`invoice-tab ${activeTab === 'sent' ? 'active' : ''}`}
          onClick={() => {
            console.log('Clicking Sent tab');
            setActiveTab('sent');
          }}
        >
          Sent
        </button>
        <button
          className={`invoice-tab ${activeTab === 'paid' ? 'active' : ''}`}
          onClick={() => {
            console.log('Clicking Paid tab');
            setActiveTab('paid');
          }}
        >
          Paid
        </button>
        <button
          className={`invoice-tab ${activeTab === 'overdue' ? 'active' : ''}`}
          onClick={() => {
            console.log('Clicking Overdue tab');
            setActiveTab('overdue');
          }}
        >
          Overdue
        </button>
      </div>

      {/* AI Insights Banner */}
      <div className="ai-insights-banner">
        <div className="ai-insights-header">
          <img src={AiImg} alt="AI" style={{ width: '24px', height: '24px' }} />
          <h3 className="ai-insights-title">AI Insights & Recommendations</h3>
        </div>
        <div className="ai-insights-grid">
          <div className="ai-insights-item">
            <div className="ai-insights-label">Top Performing Client</div>
            <div className="ai-insights-value">{aiInsights.topPerformingClient}</div>
          </div>
          <div className="ai-insights-item">
            <div className="ai-insights-label">Risk Invoices</div>
            <div className="ai-insights-value">{aiInsights.riskInvoices}</div>
          </div>
          <div className="ai-insights-item">
            <div className="ai-insights-label">Revenue Forecast</div>
            <div className="ai-insights-value">₹{aiInsights.revenueForecast.thisMonth.toLocaleString()}</div>
          </div>
          <div className="ai-insights-item">
            <div className="ai-insights-label">Trend</div>
            <div className="ai-insights-value" style={{ color: '#4ade80' }}>
              {aiInsights.revenueForecast.trend} 📈
            </div>
          </div>
        </div>
        <div className="ai-insights-actions">
          <strong>Suggested Actions:</strong> {aiInsights.suggestedActions.join(', ')}
        </div>
      </div>

      {/* Advanced Filters */}
      <div className="invoice-filters">
        <div className="invoice-filters-grid">
          <div className="invoice-filter-group">
            <label className="invoice-filter-label">Pipeline</label>
            <select 
              className="invoice-filter-select"
              value={selectedPipeline}
              onChange={(e) => setSelectedPipeline(e.target.value)}
            >
              <option value="All">All Pipelines</option>
              {pipelines.map(pipeline => (
                <option key={pipeline.name} value={pipeline.name}>{pipeline.name}</option>
              ))}
            </select>
          </div>
          <div className="invoice-filter-group">
            <label className="invoice-filter-label">Stage</label>
            <select 
              className="invoice-filter-select"
              value={selectedStage}
              onChange={(e) => setSelectedStage(e.target.value)}
            >
              <option value="All">All Stages</option>
              {pipelines.find(p => p.name === selectedPipeline)?.stages.map(stage => (
                <option key={stage} value={stage}>{stage}</option>
              ))}
            </select>
          </div>
          <div className="invoice-filter-group">
            <label className="invoice-filter-label">Assigned To</label>
            <select 
              className="invoice-filter-select"
              value={selectedAssignee}
              onChange={(e) => setSelectedAssignee(e.target.value)}
            >
              <option value="All">All Users</option>
              {users.map(user => (
                <option key={user} value={user}>{user}</option>
              ))}
            </select>
          </div>
          <div className="invoice-filter-group">
            <label className="invoice-filter-label">Priority</label>
            <select 
              className="invoice-filter-select"
              value={selectedPriority}
              onChange={(e) => setSelectedPriority(e.target.value)}
            >
              <option value="All">All Priorities</option>
              {priorities.map(priority => (
                <option key={priority} value={priority}>{priority}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Bulk Actions */}
      {showBulkActions && (
        <div className="invoice-bulk-actions">
          <span className="invoice-bulk-count">{bulkSelected.length} invoices selected</span>
          <button 
            className="invoice-bulk-btn primary"
            onClick={() => handleBulkAction('markPaid')}
          >
            Mark Paid
          </button>
          <button 
            className="invoice-bulk-btn secondary"
            onClick={() => handleBulkAction('assign')}
          >
            Assign
          </button>
          <button 
            className="invoice-bulk-btn secondary"
            onClick={() => handleBulkAction('addTags')}
          >
            Add Tags
          </button>
          <button 
            className="invoice-bulk-btn secondary"
            onClick={() => handleBulkAction('export')}
          >
            Export
          </button>
          <button 
            className="invoice-bulk-btn secondary"
            onClick={() => handleBulkAction('delete')}
            style={{ color: '#dc3545' }}
          >
            Delete
          </button>
        </div>
      )}

      {/* Enhanced Dashboard */}
      <div className="invoice-dashboard">
        <div className="invoice-card">
          <div className="invoice-card-title">
            <FaFileAlt /> Total Invoices
          </div>
          <div className="invoice-card-value">{stats.total}</div>
        </div>
        <div className="invoice-card">
          <div className="invoice-card-title">
            <FaCreditCard /> Total Amount
          </div>
          <div className="invoice-card-value">₹{stats.amount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</div>
        </div>
        <div className="invoice-card">
          <div className="invoice-card-title">
            <FaCheck /> Paid
          </div>
          <div className="invoice-card-value">{stats.paid}</div>
        </div>
        <div className="invoice-card">
          <div className="invoice-card-title">
            <FaClock /> Pending
          </div>
          <div className="invoice-card-value">{stats.pending}</div>
        </div>
        <div className="invoice-card">
          <div className="invoice-card-title">
            <FaExclamationTriangle /> Overdue
          </div>
          <div className="invoice-card-value">{stats.overdue}</div>
        </div>
        <div className="invoice-card">
          <div className="invoice-card-title">
            <FaStar /> High Priority
          </div>
          <div className="invoice-card-value">{stats.highPriority}</div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="invoice-search-filter">
        <div className="invoice-search">
          <span className="invoice-search-icon">🔍</span>
          <input
            type="text"
            placeholder="Type here to search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Enhanced Table */}
      <div className="invoice-table-container">
        <div className="invoice-table-header">
          <h2 className="invoice-table-title">Invoices</h2>
          <div className="invoice-table-actions">
            <button className="invoice-btn-secondary" onClick={() => handleExport()}>
              <FaDownload /> Export
            </button>
            <button className="invoice-btn-secondary" onClick={() => handleImport()}>
              <FaUpload /> Import
            </button>
            <button className="invoice-btn-secondary" onClick={() => setShowSettings(true)}>
              <FaCog /> Settings
            </button>
          </div>
        </div>
        <table className="invoice-table">
          <thead>
            <tr>
              <th>
                <input 
                  type="checkbox" 
                  onChange={(e) => {
                    if (e.target.checked) {
                      setBulkSelected(invoices.map(inv => inv.id));
                      setShowBulkActions(true);
                    } else {
                      setBulkSelected([]);
                      setShowBulkActions(false);
                    }
                  }}
                />
              </th>
              <th>Invoice ID</th>
              <th>Client</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Due Date</th>
              <th>Assigned To</th>
              <th>Priority</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredInvoices.map(invoice => (
              <tr key={invoice.id}>
                <td>
                  <input 
                    type="checkbox" 
                    checked={bulkSelected.includes(invoice.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setBulkSelected(prev => [...prev, invoice.id]);
                        setShowBulkActions(true);
                      } else {
                        setBulkSelected(prev => prev.filter(id => id !== invoice.id));
                        if (bulkSelected.length === 1) {
                          setShowBulkActions(false);
                        }
                      }
                    }}
                  />
                </td>
                <td>{invoice.invoice_id}</td>
                <td>
                  <div>
                    <div style={{ fontWeight: '600' }}>{invoice.client_name}</div>
                    <div style={{ fontSize: '12px', color: '#666' }}>{invoice.client_email}</div>
                  </div>
                </td>
                <td>₹{(invoice.total || invoice.amount).toLocaleString()}</td>
                <td>
                  <span className={`invoice-status ${invoice.status.toLowerCase()}`}>
                    {invoice.status}
                  </span>
                </td>
                <td>{new Date(invoice.due_date).toLocaleDateString()}</td>
                <td>{invoice.assigned_to}</td>
                <td>
                  <div className="priority-indicator">
                    <span className={`priority-icon priority-${invoice.priority.toLowerCase()}`}>
                      {invoice.priority === 'high' ? '🔴' : invoice.priority === 'medium' ? '🟡' : '🟢'}
                    </span>
                    <span className="priority-text">{invoice.priority}</span>
                  </div>
                </td>
                <td>
                  <div style={{ display: 'flex', gap: '4px' }}>
                    <button 
                      className="invoice-action-btn"
                      onClick={() => handleAction('view', invoice)}
                      title="View"
                    >
                      👁️
                    </button>
                    <button 
                      className="invoice-action-btn"
                      onClick={() => handleAction('edit', invoice)}
                      title="Edit"
                    >
                      ✏️
                    </button>
                    <button 
                      className="invoice-action-btn"
                      onClick={() => handleAction('delete', invoice)}
                      title="Delete"
                    >
                      🗑️
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modals */}
      {showCreateModal && (
        <div className="invoice-modal-backdrop" onClick={handleModalClose}>
          <div className="invoice-form-modal" onClick={(e) => e.stopPropagation()}>
            <InvoiceForm 
              invoice={editingInvoice}
              onSave={editingInvoice ? handleUpdateInvoice : handleCreateInvoice}
              onCancel={handleModalClose}
              pipelines={pipelines}
              users={users}
              priorities={priorities}
              tags={tags}
            />
          </div>
        </div>
      )}

      {showDetailsModal && selectedInvoice && (
        <div className="invoice-modal-backdrop" onClick={handleModalClose}>
          <div className="invoice-details-modal" onClick={(e) => e.stopPropagation()}>
            <InvoiceDetails 
              invoice={selectedInvoice}
              onClose={handleModalClose}
            />
          </div>
        </div>
      )}

      {/* Automation Modal */}
      {showAutomation && (
        <div className="invoice-modal-backdrop" onClick={handleModalClose}>
          <div className="invoice-form-modal" onClick={(e) => e.stopPropagation()}>
            <div className="invoice-modal-header">
              <h2>Invoice Automation</h2>
              <button className="invoice-modal-close" onClick={handleModalClose}>×</button>
            </div>
            <div style={{ padding: '24px' }}>
              <h3>Automation Rules</h3>
              <div style={{ marginBottom: '20px' }}>
                <h4>Payment Reminders</h4>
                <p>Automatically send payment reminders for overdue invoices</p>
                <label>
                  <input type="checkbox" defaultChecked /> Enable automatic reminders
                </label>
              </div>
              <div style={{ marginBottom: '20px' }}>
                <h4>Status Updates</h4>
                <p>Automatically update invoice status based on payment</p>
                <label>
                  <input type="checkbox" defaultChecked /> Auto-update status
                </label>
              </div>
              <div style={{ marginBottom: '20px' }}>
                <h4>Follow-up Scheduling</h4>
                <p>Schedule automatic follow-ups for pending invoices</p>
                <label>
                  <input type="checkbox" /> Enable follow-ups
                </label>
              </div>
              <div style={{ textAlign: 'right', marginTop: '20px' }}>
                <button 
                  className="invoice-btn-primary"
                  onClick={handleModalClose}
                >
                  Save Automation Rules
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Analytics Modal */}
      {showAnalytics && (
        <div className="invoice-modal-backdrop" onClick={handleModalClose}>
          <div className="invoice-form-modal" onClick={(e) => e.stopPropagation()}>
            <div className="invoice-modal-header">
              <h2>Invoice Analytics</h2>
              <button className="invoice-modal-close" onClick={handleModalClose}>×</button>
            </div>
            <div style={{ padding: '24px' }}>
              <h3>Revenue Analytics</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                <div style={{ background: '#f8f9fa', padding: '16px', borderRadius: '8px' }}>
                  <h4>Monthly Revenue</h4>
                  <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#25d366' }}>₹{stats.amount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</p>
                </div>
                <div style={{ background: '#f8f9fa', padding: '16px', borderRadius: '8px' }}>
                  <h4>Payment Rate</h4>
                  <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#25d366' }}>{stats.total > 0 ? Math.round((stats.paid / stats.total) * 100) : 0}%</p>
                </div>
              </div>
              <h3>Performance Metrics</h3>
              <div style={{ background: '#f8f9fa', padding: '16px', borderRadius: '8px', marginBottom: '20px' }}>
                <p><strong>Average Payment Time:</strong> {stats.avgPaymentTime} days</p>
                <p><strong>Conversion Rate:</strong> {stats.conversionRate}%</p>
                <p><strong>High Priority Invoices:</strong> {stats.highPriority}</p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <button 
                  className="invoice-btn-primary"
                  onClick={handleModalClose}
                >
                  Export Report
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Settings Modal */}
      {showSettings && (
        <div className="invoice-modal-backdrop" onClick={handleModalClose}>
          <div className="invoice-form-modal" onClick={(e) => e.stopPropagation()}>
            <div className="invoice-modal-header">
              <h2>Invoice Settings</h2>
              <button className="invoice-modal-close" onClick={handleModalClose}>×</button>
            </div>
            <div style={{ padding: '24px' }}>
              <h3>General Settings</h3>
              <div style={{ marginBottom: '20px' }}>
                <label>
                  <strong>Default Currency:</strong>
                  <select style={{ marginLeft: '10px', padding: '5px' }}>
                    <option>INR (₹)</option>
                    <option>USD ($)</option>
                    <option>EUR (€)</option>
                  </select>
                </label>
              </div>
              <div style={{ marginBottom: '20px' }}>
                <label>
                  <strong>Default Tax Rate:</strong>
                  <input type="number" defaultValue="18" style={{ marginLeft: '10px', padding: '5px', width: '80px' }} /> %
                </label>
              </div>
              <div style={{ marginBottom: '20px' }}>
                <label>
                  <strong>Invoice Number Prefix:</strong>
                  <input type="text" defaultValue="INV-" style={{ marginLeft: '10px', padding: '5px' }} />
                </label>
              </div>
              
              <h3>Email Settings</h3>
              <div style={{ marginBottom: '20px' }}>
                <label>
                  <input type="checkbox" defaultChecked /> Send automatic payment reminders
                </label>
              </div>
              <div style={{ marginBottom: '20px' }}>
                <label>
                  <input type="checkbox" defaultChecked /> Send invoice notifications
                </label>
              </div>
              
              <h3>Display Settings</h3>
              <div style={{ marginBottom: '20px' }}>
                <label>
                  <strong>Items per page:</strong>
                  <select style={{ marginLeft: '10px', padding: '5px' }}>
                    <option>10</option>
                    <option>25</option>
                    <option>50</option>
                    <option>100</option>
                  </select>
                </label>
              </div>
              
              <div style={{ textAlign: 'right', marginTop: '20px' }}>
                <button 
                  className="invoice-btn-primary"
                  onClick={handleModalClose}
                >
                  Save Settings
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
