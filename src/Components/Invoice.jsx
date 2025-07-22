import React, { useState, useEffect } from 'react';
import { FaPlus, FaExclamationTriangle, FaUsers, FaTags, FaCalendarAlt, FaClock, FaFileAlt, FaCreditCard, FaSync, FaBell, FaStar, FaFilter, FaDownload, FaUpload, FaCog, FaLightbulb } from 'react-icons/fa';
import InvoiceStats from './InvoiceStats';
import InvoiceTable from './InvoiceTable';
import InvoiceForm from './InvoiceForm';
import InvoiceDetails from './InvoiceDetails';
import InvoiceTemplates from './InvoiceTemplates';
import { dummyClients, calculateInvoiceTotals, generateInvoiceId } from './InvoiceUtils';
import './Invoice.css';
// Custom Images
import AutomationImg from '../assets/Automation.png';
import AnalyticsImg from '../assets/Analytics.png';
import AiImg from '../assets/Ai.png';
import PipelineImg from '../assets/Pipeline.png';
import InvoiceImg from '../assets/Invoice.png';

export default function Invoice() {
  const [invoices, setInvoices] = useState([
    {
      id: 'INV-001',
      clientId: 'C-001',
      clientName: 'John Doe',
      clientEmail: 'john@example.com',
      clientAddress: '22, Park Lane, Mumbai',
      clientPhone: '+91 9000000001',
      date: '2024-01-15',
      dueDate: '2024-02-15',
      status: 'Paid',
      lineItems: [
        { desc: 'Web Development', qty: 1, price: 1500 }
      ],
      taxRate: 18,
      discount: 0,
      subtotal: 1500,
      tax: 270,
      total: 1770,
      notes: 'Thank you for your business!',
      terms: 'Payment due within 30 days',
      projectRef: 'WEB-2024-001',
      template: 'default',
      currency: 'INR',
      // Advanced CRM Features
      pipeline: 'Sales Pipeline',
      stage: 'Closed - Won',
      assignedTo: 'Amit Sharma',
      priority: 'high',
      tags: ['web-development', 'premium-client'],
      expectedCloseDate: '2024-02-15',
      lastContactDate: '2024-01-20',
      source: 'Website',
      activities: [
        { type: 'created', user: 'Amit Sharma', date: '2024-01-15', description: 'Invoice created' },
        { type: 'sent', user: 'Amit Sharma', date: '2024-01-16', description: 'Invoice sent to client' },
        { type: 'paid', user: 'System', date: '2024-02-15', description: 'Payment received' }
      ],
      tasks: [
        { id: 1, title: 'Follow up on payment', dueDate: '2024-02-10', status: 'completed', assignedTo: 'Amit Sharma' },
        { id: 2, title: 'Send thank you email', dueDate: '2024-02-16', status: 'pending', assignedTo: 'Amit Sharma' }
      ],
      files: [
        { name: 'contract.pdf', size: '2.5MB', uploadedBy: 'Amit Sharma', date: '2024-01-15' },
        { name: 'design-mockups.zip', size: '15MB', uploadedBy: 'Amit Sharma', date: '2024-01-20' }
      ],
      paymentHistory: [
        { date: '2024-02-15', amount: 1770, method: 'Bank Transfer', status: 'completed' }
      ],
      recurring: false,
      recurringInterval: null,
      aiInsights: {
        paymentProbability: 95,
        riskLevel: 'low',
        suggestedActions: ['Send reminder email', 'Follow up call']
      }
    },
    {
      id: 'INV-002',
      clientId: 'C-002',
      clientName: 'Jane Smith',
      clientEmail: 'jane@example.com',
      clientAddress: '55, MG Road, Pune',
      clientPhone: '+91 9000000002',
      date: '2024-01-20',
      dueDate: '2024-02-20',
      status: 'Pending',
      lineItems: [
        { desc: 'Mobile App Development', qty: 1, price: 2000 },
        { desc: 'UI/UX Design', qty: 1, price: 500 }
      ],
      taxRate: 18,
      discount: 100,
      subtotal: 2500,
      tax: 450,
      total: 2850,
      notes: '',
      terms: 'Payment due within 30 days',
      projectRef: 'MOB-2024-001',
      template: 'modern',
      currency: 'INR',
      // Advanced CRM Features
      pipeline: 'Sales Pipeline',
      stage: 'Discussions',
      assignedTo: 'Priya Singh',
      priority: 'medium',
      tags: ['mobile-app', 'design'],
      expectedCloseDate: '2024-02-25',
      lastContactDate: '2024-01-25',
      source: 'Referral',
      activities: [
        { type: 'created', user: 'Priya Singh', date: '2024-01-20', description: 'Invoice created' },
        { type: 'sent', user: 'Priya Singh', date: '2024-01-21', description: 'Invoice sent to client' },
        { type: 'followup', user: 'Priya Singh', date: '2024-01-25', description: 'Follow up call made' }
      ],
      tasks: [
        { id: 3, title: 'Send payment reminder', dueDate: '2024-02-15', status: 'pending', assignedTo: 'Priya Singh' },
        { id: 4, title: 'Schedule demo call', dueDate: '2024-02-18', status: 'pending', assignedTo: 'Priya Singh' }
      ],
      files: [
        { name: 'app-requirements.docx', size: '1.2MB', uploadedBy: 'Priya Singh', date: '2024-01-20' }
      ],
      paymentHistory: [],
      recurring: false,
      recurringInterval: null,
      aiInsights: {
        paymentProbability: 75,
        riskLevel: 'medium',
        suggestedActions: ['Schedule demo', 'Send case studies']
      }
    },
    {
      id: 'INV-003',
      clientId: 'C-003',
      clientName: 'Mike Johnson',
      clientEmail: 'mike@example.com',
      clientAddress: '88, Brigade Road, Bangalore',
      clientPhone: '+91 9000000003',
      date: '2024-01-10',
      dueDate: '2024-02-10',
      status: 'Overdue',
      lineItems: [
        { desc: 'Consulting Services', qty: 10, price: 100 }
      ],
      taxRate: 18,
      discount: 0,
      subtotal: 1000,
      tax: 180,
      total: 1180,
      notes: 'Please pay as soon as possible',
      terms: 'Payment due within 30 days',
      projectRef: 'CON-2024-001',
      template: 'minimal',
      currency: 'INR',
      // Advanced CRM Features
      pipeline: 'Sales Pipeline',
      stage: 'Decision Making',
      assignedTo: 'Akash Kumar',
      priority: 'high',
      tags: ['consulting', 'urgent'],
      expectedCloseDate: '2024-02-28',
      lastContactDate: '2024-02-05',
      source: 'Cold Call',
      activities: [
        { type: 'created', user: 'Akash Kumar', date: '2024-01-10', description: 'Invoice created' },
        { type: 'sent', user: 'Akash Kumar', date: '2024-01-11', description: 'Invoice sent to client' },
        { type: 'overdue', user: 'System', date: '2024-02-10', description: 'Invoice overdue' },
        { type: 'followup', user: 'Akash Kumar', date: '2024-02-05', description: 'Urgent follow up call' }
      ],
      tasks: [
        { id: 5, title: 'Urgent payment follow up', dueDate: '2024-02-12', status: 'overdue', assignedTo: 'Akash Kumar' },
        { id: 6, title: 'Legal action preparation', dueDate: '2024-02-20', status: 'pending', assignedTo: 'Akash Kumar' }
      ],
      files: [
        { name: 'consultation-report.pdf', size: '3.1MB', uploadedBy: 'Akash Kumar', date: '2024-01-10' }
      ],
      paymentHistory: [],
      recurring: false,
      recurringInterval: null,
      aiInsights: {
        paymentProbability: 30,
        riskLevel: 'high',
        suggestedActions: ['Legal notice', 'Payment plan offer']
      }
    }
  ]);

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
    amount: invoices.reduce((sum, inv) => sum + inv.total, 0),
    paid: invoices.filter(inv => inv.status === 'Paid').length,
    pending: invoices.filter(inv => inv.status === 'Pending').length,
    overdue: invoices.filter(inv => inv.status === 'Overdue').length,
    // Advanced stats
    highPriority: invoices.filter(inv => inv.priority === 'high').length,
    thisMonth: invoices.filter(inv => new Date(inv.date).getMonth() === new Date().getMonth()).length,
    avgPaymentTime: 25, // days
    conversionRate: 85, // percentage
    recurringRevenue: invoices.filter(inv => inv.recurring).reduce((sum, inv) => sum + inv.total, 0)
  };

  // AI Insights
  const aiInsights = {
    topPerformingClient: 'John Doe',
    riskInvoices: invoices.filter(inv => inv.aiInsights.riskLevel === 'high').length,
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

  const handleCreateInvoice = (invoiceData) => {
    const newInvoice = {
      ...invoiceData,
      id: generateInvoiceId(),
      createdAt: new Date().toISOString(),
      // Add CRM features
      pipeline: selectedPipeline,
      stage: 'Initial Contact',
      assignedTo: 'Amit Sharma',
      priority: 'medium',
      tags: [],
      expectedCloseDate: '',
      lastContactDate: new Date().toISOString(),
      source: 'Manual',
      activities: [
        { type: 'created', user: 'Amit Sharma', date: new Date().toISOString(), description: 'Invoice created' }
      ],
      tasks: [],
      files: [],
      paymentHistory: [],
      recurring: false,
      recurringInterval: null,
      aiInsights: {
        paymentProbability: 70,
        riskLevel: 'medium',
        suggestedActions: ['Send invoice', 'Follow up call']
      }
    };
    setInvoices(prev => [newInvoice, ...prev]);
    setShowCreateModal(false);
    setShowWarning(false);
  };

  const handleEditInvoice = (invoice) => {
    setEditingInvoice(invoice);
    setShowCreateModal(true);
  };

  const handleUpdateInvoice = (invoiceData) => {
    setInvoices(prev => prev.map(inv => 
      inv.id === invoiceData.id ? { 
        ...invoiceData, 
        updatedAt: new Date().toISOString(),
        activities: [
          ...inv.activities,
          { type: 'updated', user: 'Amit Sharma', date: new Date().toISOString(), description: 'Invoice updated' }
        ]
      } : inv
    ));
    setShowCreateModal(false);
    setEditingInvoice(null);
    setShowWarning(false);
  };

  const handleDeleteInvoice = (invoiceId) => {
    if (window.confirm('Are you sure you want to delete this invoice?')) {
      setInvoices(prev => prev.filter(inv => inv.id !== invoiceId));
    }
  };

  const handleViewInvoice = (invoice) => {
    setSelectedInvoice(invoice);
    setShowDetailsModal(true);
  };

  const handleAction = (action, data) => {
    switch (action) {
      case 'markPaid':
        if (Array.isArray(data)) {
          setInvoices(prev => prev.map(inv => 
            data.includes(inv.id) ? { 
              ...inv, 
              status: 'Paid',
              stage: 'Closed - Won',
              activities: [
                ...inv.activities,
                { type: 'paid', user: 'System', date: new Date().toISOString(), description: 'Payment received' }
              ]
            } : inv
          ));
        } else {
          setInvoices(prev => prev.map(inv => 
            inv.id === data ? { 
              ...inv, 
              status: 'Paid',
              stage: 'Closed - Won',
              activities: [
                ...inv.activities,
                { type: 'paid', user: 'System', date: new Date().toISOString(), description: 'Payment received' }
              ]
            } : inv
          ));
        }
        break;
      case 'duplicate':
        const original = invoices.find(inv => inv.id === data);
        if (original) {
          const duplicate = {
            ...original,
            id: generateInvoiceId(),
            status: 'Draft',
            date: new Date().toISOString().split('T')[0],
            dueDate: '',
            createdAt: new Date().toISOString(),
            activities: [
              { type: 'created', user: 'Amit Sharma', date: new Date().toISOString(), description: 'Invoice duplicated' }
            ]
          };
          setInvoices(prev => [duplicate, ...prev]);
        }
        break;
      case 'export':
        alert('Export functionality coming soon!');
        break;
      case 'print':
        alert('Print functionality coming soon!');
        break;
      case 'sendEmail':
        alert('Email functionality coming soon!');
        break;
      case 'convertToRecurring':
        setShowRecurringSetup(true);
        break;
      case 'setupPayment':
        setShowPaymentIntegration(true);
        break;
      default:
        break;
    }
  };

  const handleModalClose = () => {
    if (showWarning) {
      if (window.confirm('You have unsaved changes. Are you sure you want to close?')) {
        setShowCreateModal(false);
        setEditingInvoice(null);
        setShowWarning(false);
      }
    } else {
      setShowCreateModal(false);
      setEditingInvoice(null);
    }
  };

  const handleBulkAction = (action) => {
    switch (action) {
      case 'markPaid':
        setInvoices(prev => prev.map(inv => 
          bulkSelected.includes(inv.id) ? { 
            ...inv, 
            status: 'Paid',
            stage: 'Closed - Won'
          } : inv
        ));
        break;
      case 'assign':
        const assignee = prompt('Enter assignee name:');
        if (assignee) {
          setInvoices(prev => prev.map(inv => 
            bulkSelected.includes(inv.id) ? { ...inv, assignedTo: assignee } : inv
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

  const filteredInvoices = invoices.filter(invoice => {
    const matchesPipeline = selectedPipeline === 'All' || invoice.pipeline === selectedPipeline;
    const matchesStage = selectedStage === 'All' || invoice.stage === selectedStage;
    const matchesAssignee = selectedAssignee === 'All' || invoice.assignedTo === selectedAssignee;
    const matchesPriority = selectedPriority === 'All' || invoice.priority === selectedPriority;
    return matchesPipeline && matchesStage && matchesAssignee && matchesPriority;
  });

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
        {['all', 'pipeline', 'automation', 'analytics', 'ai-insights'].map(tab => (
          <button
            key={tab}
            onClick={() => {
              setActiveTab(tab);
              if (tab === 'automation') setShowAutomation(true);
              if (tab === 'analytics') setShowAnalytics(true);
            }}
            style={{
              padding: '8px 16px',
              border: 'none',
              borderRadius: '6px',
              background: activeTab === tab ? '#25d366' : '#f0f2f5',
              color: activeTab === tab ? 'white' : '#666',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {tab === 'all' && (
              <>
                <img src={InvoiceImg} alt="Invoice" style={{ width: '18px', height: '18px', marginRight: '8px' }} />
                All Invoices
              </>
            )}
            {tab === 'pipeline' && (
              <>
                <img src={PipelineImg} alt="Pipeline" style={{ width: '18px', height: '18px', marginRight: '8px' }} />
                Pipeline
              </>
            )}
            {tab === 'automation' && (
              <>
                <img src={AutomationImg} alt="Automation" style={{ width: '18px', height: '18px', marginRight: '8px' }} />
                Automation
              </>
            )}
            {tab === 'analytics' && (
              <>
                <img src={AnalyticsImg} alt="Analytics" style={{ width: '18px', height: '18px', marginRight: '8px' }} />
                Analytics
              </>
            )}
            {tab === 'ai-insights' && (
              <>
                <img src={AiImg} alt="AI" style={{ width: '18px', height: '18px', marginRight: '8px' }} />
                AI Insights
              </>
            )}
          </button>
        ))}
      </div>

      {/* AI Insights Banner */}
      {(showAIInsights || activeTab === 'ai-insights') && (
        <div style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          padding: '20px',
          borderRadius: '12px',
          marginBottom: '24px',
          boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
            <img src={AiImg} alt="AI" style={{ width: '20px', height: '20px' }} />
            <h3 style={{ margin: 0, fontSize: '18px' }}>AI Insights</h3>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
            <div>
              <div style={{ fontSize: '14px', opacity: 0.9 }}>Top Performing Client</div>
              <div style={{ fontSize: '18px', fontWeight: '600' }}>{aiInsights.topPerformingClient}</div>
            </div>
            <div>
              <div style={{ fontSize: '14px', opacity: 0.9 }}>Risk Invoices</div>
              <div style={{ fontSize: '18px', fontWeight: '600' }}>{aiInsights.riskInvoices}</div>
            </div>
            <div>
              <div style={{ fontSize: '14px', opacity: 0.9 }}>Revenue Forecast</div>
              <div style={{ fontSize: '18px', fontWeight: '600' }}>₹{aiInsights.revenueForecast.thisMonth}</div>
            </div>
          </div>
          <div style={{ marginTop: '12px', fontSize: '14px' }}>
            <strong>Suggested Actions:</strong> {aiInsights.suggestedActions.join(', ')}
          </div>
        </div>
      )}

      {/* Automation Tab Content */}
      {activeTab === 'automation' && (
        <div style={{
          background: 'white',
          padding: '24px',
          borderRadius: '12px',
          marginBottom: '24px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
            <img src={AutomationImg} alt="Automation" style={{ width: '32px', height: '32px' }} />
            <h2 style={{ margin: 0, color: '#333' }}>Automation Dashboard</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
            <div style={{ padding: '20px', border: '1px solid #e0e0e0', borderRadius: '8px' }}>
              <h3 style={{ margin: '0 0 12px 0', color: '#333' }}>Active Rules</h3>
              <ul style={{ margin: 0, paddingLeft: '20px', color: '#666' }}>
                <li>Payment reminders for overdue invoices</li>
                <li>Auto-assign tasks when invoices are created</li>
                <li>Stage transitions on payment received</li>
              </ul>
            </div>
            <div style={{ padding: '20px', border: '1px solid #e0e0e0', borderRadius: '8px' }}>
              <h3 style={{ margin: '0 0 12px 0', color: '#333' }}>Recent Activity</h3>
              <div style={{ fontSize: '14px', color: '#666' }}>
                <div>✅ 3 reminders sent today</div>
                <div>✅ 2 tasks auto-assigned</div>
                <div>✅ 1 stage transition completed</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Analytics Tab Content */}
      {activeTab === 'analytics' && (
        <div style={{
          background: 'white',
          padding: '24px',
          borderRadius: '12px',
          marginBottom: '24px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
            <img src={AnalyticsImg} alt="Analytics" style={{ width: '32px', height: '32px' }} />
            <h2 style={{ margin: 0, color: '#333' }}>Analytics Dashboard</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
            <div style={{ padding: '20px', border: '1px solid #e0e0e0', borderRadius: '8px' }}>
              <h3 style={{ margin: '0 0 12px 0', color: '#333' }}>Revenue Trends</h3>
              <div style={{ fontSize: '14px', color: '#666' }}>
                <div>📈 Monthly growth: +12.5%</div>
                <div>📈 Quarterly growth: +8.2%</div>
                <div>📈 Yearly growth: +15.3%</div>
              </div>
            </div>
            <div style={{ padding: '20px', border: '1px solid #e0e0e0', borderRadius: '8px' }}>
              <h3 style={{ margin: '0 0 12px 0', color: '#333' }}>Client Performance</h3>
              <div style={{ fontSize: '14px', color: '#666' }}>
                <div>🏆 Top client: John Doe (₹1,770)</div>
                <div>⚡ Fastest payer: Jane Smith (5 days)</div>
                <div>📊 Avg payment time: 25 days</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Advanced Filters */}
      <div style={{
        background: 'white',
        padding: '20px',
        borderRadius: '12px',
        marginBottom: '24px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
      }}>
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center' }}>
          <div>
            <label style={{ fontSize: '12px', color: '#666', marginBottom: '4px', display: 'block' }}>Pipeline</label>
            <select
              value={selectedPipeline}
              onChange={(e) => setSelectedPipeline(e.target.value)}
              style={{ padding: '8px 12px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '14px' }}
            >
              <option value="All">All Pipelines</option>
              {pipelines.map(p => <option key={p.name} value={p.name}>{p.name}</option>)}
            </select>
          </div>
          <div>
            <label style={{ fontSize: '12px', color: '#666', marginBottom: '4px', display: 'block' }}>Stage</label>
            <select
              value={selectedStage}
              onChange={(e) => setSelectedStage(e.target.value)}
              style={{ padding: '8px 12px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '14px' }}
            >
              <option value="All">All Stages</option>
              {selectedPipeline !== 'All' && pipelines.find(p => p.name === selectedPipeline)?.stages.map(s => 
                <option key={s} value={s}>{s}</option>
              )}
            </select>
          </div>
          <div>
            <label style={{ fontSize: '12px', color: '#666', marginBottom: '4px', display: 'block' }}>Assignee</label>
            <select
              value={selectedAssignee}
              onChange={(e) => setSelectedAssignee(e.target.value)}
              style={{ padding: '8px 12px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '14px' }}
            >
              <option value="All">All Users</option>
              {users.map(u => <option key={u} value={u}>{u}</option>)}
            </select>
          </div>
          <div>
            <label style={{ fontSize: '12px', color: '#666', marginBottom: '4px', display: 'block' }}>Priority</label>
            <select
              value={selectedPriority}
              onChange={(e) => setSelectedPriority(e.target.value)}
              style={{ padding: '8px 12px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '14px' }}
            >
              <option value="All">All Priorities</option>
              {priorities.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* Enhanced Stats Dashboard */}
      <InvoiceStats stats={stats} />

      {/* Bulk Actions */}
      {bulkSelected.length > 0 && (
        <div style={{
          background: '#fffbe6',
          border: '1px solid #ffc107',
          borderRadius: '8px',
          padding: '12px 16px',
          marginBottom: '16px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          <span style={{ fontWeight: 600 }}>{bulkSelected.length} invoices selected</span>
          <button
            onClick={() => handleBulkAction('markPaid')}
            style={{
              padding: '6px 12px',
              border: 'none',
              borderRadius: '4px',
              backgroundColor: '#25d366',
              color: 'white',
              cursor: 'pointer',
              fontSize: '12px'
            }}
          >
            Mark as Paid
          </button>
          <button
            onClick={() => handleBulkAction('assign')}
            style={{
              padding: '6px 12px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              backgroundColor: 'white',
              cursor: 'pointer',
              fontSize: '12px'
            }}
          >
            Assign
          </button>
          <button
            onClick={() => handleBulkAction('addTags')}
            style={{
              padding: '6px 12px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              backgroundColor: 'white',
              cursor: 'pointer',
              fontSize: '12px'
            }}
          >
            Add Tags
          </button>
          <button
            onClick={() => handleBulkAction('export')}
            style={{
              padding: '6px 12px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              backgroundColor: 'white',
              cursor: 'pointer',
              fontSize: '12px'
            }}
          >
            Export
          </button>
        </div>
      )}

      {/* Enhanced Table */}
      <InvoiceTable
        invoices={filteredInvoices}
        onEdit={handleEditInvoice}
        onDelete={handleDeleteInvoice}
        onView={handleViewInvoice}
        onAction={handleAction}
        bulkSelected={bulkSelected}
        setBulkSelected={setBulkSelected}
        showBulkActions={showBulkActions}
        setShowBulkActions={setShowBulkActions}
      />

      {/* Create/Edit Modal */}
      {showCreateModal && (
        <InvoiceForm
          invoice={editingInvoice}
          onSave={editingInvoice ? handleUpdateInvoice : handleCreateInvoice}
          onCancel={handleModalClose}
          pipelines={pipelines}
          users={users}
          priorities={priorities}
          tags={tags}
        />
      )}

      {/* Details Modal */}
      {showDetailsModal && (
        <InvoiceDetails
          invoice={selectedInvoice}
          onClose={() => setShowDetailsModal(false)}
          onAction={handleAction}
        />
      )}

      {/* Future Features Modals */}
      {showAutomation && (
        <div className="invoice-modal-backdrop">
          <div className="invoice-modal">
            <button className="invoice-modal-close" onClick={() => setShowAutomation(false)}>&times;</button>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <span style={{ fontSize: '2rem' }}>⚡</span>
              <h2 style={{ margin: 0 }}>Automation Rules</h2>
            </div>
            <p style={{ color: '#666', marginBottom: '20px' }}>
              Automate your invoice workflow with these rules. Set up reminders, recurring invoices, and more to save time and reduce manual work.
            </p>
            <ul style={{ color: '#333', fontSize: '16px', lineHeight: 1.7, paddingLeft: '20px' }}>
              <li><b>Payment Reminders:</b> Automatically send payment reminders for overdue invoices.</li>
              <li><b>Recurring Invoices:</b> Generate invoices automatically for subscriptions or retainers.</li>
              <li><b>Stage Transitions:</b> Move invoices to the next stage when payment is received.</li>
              <li><b>Auto-assign Tasks:</b> Assign follow-up tasks to team members when invoices are overdue.</li>
              <li><b>Custom Triggers:</b> Set up your own automation rules (coming soon!).</li>
            </ul>
            <div style={{ marginTop: '24px', color: '#888', fontSize: '14px' }}>
              <b>Note:</b> Advanced automation builder is coming soon. For now, these are sample rules.
            </div>
          </div>
        </div>
      )}

      {showAnalytics && (
        <div className="invoice-modal-backdrop">
          <div className="invoice-modal">
            <button className="invoice-modal-close" onClick={() => setShowAnalytics(false)}>&times;</button>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <img src={AnalyticsImg} alt="Analytics" style={{ width: '32px', height: '32px' }} />
              <h2 style={{ margin: 0 }}>Advanced Analytics</h2>
            </div>
            <p style={{ color: '#666', marginBottom: '20px' }}>
              Get deep insights into your invoice and payment data. Track revenue trends, client performance, and pipeline efficiency.
            </p>
            <ul style={{ color: '#333', fontSize: '16px', lineHeight: 1.7, paddingLeft: '20px' }}>
              <li><b>Revenue Trends:</b> Visualize your revenue growth and patterns over time.</li>
              <li><b>Client Performance:</b> Analyze which clients pay fastest and generate the most revenue.</li>
              <li><b>Pipeline Efficiency:</b> Measure conversion rates and how quickly invoices move through stages.</li>
              <li><b>Overdue Analysis:</b> See which invoices are most overdue and take action.</li>
              <li><b>Custom Reports:</b> Build your own analytics dashboards (coming soon!).</li>
            </ul>
            <div style={{ marginTop: '24px', color: '#888', fontSize: '14px' }}>
              <b>Note:</b> Interactive analytics and charts are coming soon. For now, these are sample insights.
            </div>
          </div>
        </div>
      )}

      {/* Warning for unsaved changes */}
      {showWarning && (
        <div className="invoice-warning">
          <FaExclamationTriangle />
          You have unsaved changes. Please save or cancel before closing.
        </div>
      )}
    </div>
  );
}
