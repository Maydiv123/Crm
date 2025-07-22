import React, { useState } from 'react';
import { FaEdit, FaPrint, FaDownload, FaEnvelope, FaCopy, FaTrash, FaUsers, FaTags, FaStar, FaCalendarAlt, FaClock, FaFileAlt, FaCheck, FaTimes, FaExclamationTriangle, FaRobot, FaCreditCard, FaSync, FaHistory, FaTasks, FaFolder, FaLightbulb, FaGlobe, FaProjectDiagram } from 'react-icons/fa';
import { formatCurrency, formatDate, getStatusClass } from './InvoiceUtils';

export default function InvoiceDetails({ invoice, onClose, onAction }) {
  const [activeTab, setActiveTab] = useState('details');

  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'high': return '#dc3545';
      case 'medium': return '#ffc107';
      case 'low': return '#28a745';
      default: return '#6c757d';
    }
  };

  const getPriorityIcon = (priority) => {
    switch(priority) {
      case 'high': return '🔴';
      case 'medium': return '🟡';
      case 'low': return '🟢';
      default: return '⚪';
    }
  };

  const getActivityIcon = (type) => {
    switch(type) {
      case 'created': return '📝';
      case 'sent': return '📤';
      case 'paid': return '💰';
      case 'overdue': return '⚠️';
      case 'followup': return '📞';
      case 'updated': return '✏️';
      default: return '📋';
    }
  };

  const getTaskStatusColor = (status) => {
    switch(status) {
      case 'completed': return '#28a745';
      case 'pending': return '#ffc107';
      case 'overdue': return '#dc3545';
      default: return '#6c757d';
    }
  };

  const getPaymentStatusColor = (status) => {
    switch(status) {
      case 'completed': return '#28a745';
      case 'pending': return '#ffc107';
      case 'failed': return '#dc3545';
      default: return '#6c757d';
    }
  };

  const tabs = [
    { id: 'details', label: 'Details', icon: '📋' },
    { id: 'timeline', label: 'Timeline', icon: '📅' },
    { id: 'tasks', label: 'Tasks', icon: '✅' },
    { id: 'files', label: 'Files', icon: '📁' },
    { id: 'payments', label: 'Payments', icon: '💰' },
    { id: 'ai-insights', label: 'AI Insights', icon: '🤖' }
  ];

  return (
    <div className="invoice-modal-backdrop">
      <div className="invoice-modal invoice-details-modal">
        <div className="invoice-modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <h2 style={{ margin: 0 }}>Invoice Details</h2>
            <span className={`invoice-status ${getStatusClass(invoice.status)}`}>
              {invoice.status}
            </span>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={() => onAction('edit', invoice.id)}
              style={{
                padding: '6px 12px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                backgroundColor: 'white',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                fontSize: '12px'
              }}
            >
              <FaEdit /> Edit
            </button>
            <button
              onClick={() => onAction('duplicate', invoice.id)}
              style={{
                padding: '6px 12px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                backgroundColor: 'white',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                fontSize: '12px'
              }}
            >
              <FaCopy /> Duplicate
            </button>
            <button
              onClick={() => onAction('print', invoice.id)}
              style={{
                padding: '6px 12px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                backgroundColor: 'white',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                fontSize: '12px'
              }}
            >
              <FaPrint /> Print
            </button>
            <button className="invoice-modal-close" onClick={onClose}>&times;</button>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ 
          display: 'flex', 
          borderBottom: '1px solid #eee',
          marginBottom: '20px'
        }}>
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: '12px 16px',
                border: 'none',
                background: activeTab === tab.id ? '#25d366' : 'transparent',
                color: activeTab === tab.id ? 'white' : '#666',
                cursor: 'pointer',
                fontSize: '14px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <span>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div style={{ maxHeight: '60vh', overflowY: 'auto' }}>
          {activeTab === 'details' && (
            <div>
              {/* Basic Information */}
              <div style={{ marginBottom: '24px' }}>
                <h3 style={{ marginBottom: '16px', color: '#333' }}>📋 Basic Information</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                  <div>
                    <label style={{ fontSize: '12px', color: '#666', marginBottom: '4px', display: 'block' }}>Invoice ID</label>
                    <div style={{ fontWeight: '600', fontSize: '16px' }}>{invoice.id}</div>
                  </div>
                  <div>
                    <label style={{ fontSize: '12px', color: '#666', marginBottom: '4px', display: 'block' }}>Date</label>
                    <div>{formatDate(invoice.date)}</div>
                  </div>
                  <div>
                    <label style={{ fontSize: '12px', color: '#666', marginBottom: '4px', display: 'block' }}>Due Date</label>
                    <div>{formatDate(invoice.dueDate)}</div>
                  </div>
                  <div>
                    <label style={{ fontSize: '12px', color: '#666', marginBottom: '4px', display: 'block' }}>Total Amount</label>
                    <div style={{ fontWeight: '600', fontSize: '18px', color: '#25d366' }}>{formatCurrency(invoice.total)}</div>
                  </div>
                </div>
              </div>

              {/* Client Information */}
              <div style={{ marginBottom: '24px' }}>
                <h3 style={{ marginBottom: '16px', color: '#333' }}>👤 Client Information</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                  <div>
                    <label style={{ fontSize: '12px', color: '#666', marginBottom: '4px', display: 'block' }}>Name</label>
                    <div style={{ fontWeight: '600' }}>{invoice.clientName}</div>
                  </div>
                  <div>
                    <label style={{ fontSize: '12px', color: '#666', marginBottom: '4px', display: 'block' }}>Email</label>
                    <div>{invoice.clientEmail}</div>
                  </div>
                  <div>
                    <label style={{ fontSize: '12px', color: '#666', marginBottom: '4px', display: 'block' }}>Phone</label>
                    <div>{invoice.clientPhone}</div>
                  </div>
                  <div>
                    <label style={{ fontSize: '12px', color: '#666', marginBottom: '4px', display: 'block' }}>Address</label>
                    <div>{invoice.clientAddress}</div>
                  </div>
                </div>
              </div>

              {/* CRM Information */}
              <div style={{ marginBottom: '24px' }}>
                <h3 style={{ marginBottom: '16px', color: '#333' }}>🔄 CRM Information</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                  <div>
                    <label style={{ fontSize: '12px', color: '#666', marginBottom: '4px', display: 'block' }}>
                                          <FaProjectDiagram style={{ marginRight: '4px' }} />
                    Pipeline
                    </label>
                    <div style={{ fontWeight: '600' }}>{invoice.pipeline}</div>
                  </div>
                  <div>
                    <label style={{ fontSize: '12px', color: '#666', marginBottom: '4px', display: 'block' }}>Stage</label>
                    <div style={{ 
                      padding: '4px 8px', 
                      backgroundColor: '#f0f2f5', 
                      borderRadius: '12px',
                      display: 'inline-block',
                      fontSize: '12px'
                    }}>
                      {invoice.stage}
                    </div>
                  </div>
                  <div>
                    <label style={{ fontSize: '12px', color: '#666', marginBottom: '4px', display: 'block' }}>
                      <FaUsers style={{ marginRight: '4px' }} />
                      Assigned To
                    </label>
                    <div>{invoice.assignedTo}</div>
                  </div>
                  <div>
                    <label style={{ fontSize: '12px', color: '#666', marginBottom: '4px', display: 'block' }}>
                      <FaStar style={{ marginRight: '4px' }} />
                      Priority
                    </label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span>{getPriorityIcon(invoice.priority)}</span>
                      <span style={{ color: getPriorityColor(invoice.priority), fontWeight: '600' }}>
                        {invoice.priority}
                      </span>
                    </div>
                  </div>
                  <div>
                    <label style={{ fontSize: '12px', color: '#666', marginBottom: '4px', display: 'block' }}>
                                          <FaGlobe style={{ marginRight: '4px' }} />
                    Source
                    </label>
                    <div>{invoice.source}</div>
                  </div>
                  <div>
                    <label style={{ fontSize: '12px', color: '#666', marginBottom: '4px', display: 'block' }}>
                      <FaClock style={{ marginRight: '4px' }} />
                      Expected Close Date
                    </label>
                    <div>{invoice.expectedCloseDate ? formatDate(invoice.expectedCloseDate) : 'Not set'}</div>
                  </div>
                </div>

                {/* Tags */}
                {invoice.tags && invoice.tags.length > 0 && (
                  <div style={{ marginTop: '16px' }}>
                    <label style={{ fontSize: '12px', color: '#666', marginBottom: '8px', display: 'block' }}>
                      <FaTags style={{ marginRight: '4px' }} />
                      Tags
                    </label>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                      {invoice.tags.map((tag, index) => (
                        <span
                          key={index}
                          style={{
                            padding: '4px 8px',
                            backgroundColor: '#f0f2f5',
                            borderRadius: '12px',
                            fontSize: '12px',
                            color: '#666'
                          }}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Line Items */}
              <div style={{ marginBottom: '24px' }}>
                <h3 style={{ marginBottom: '16px', color: '#333' }}>📝 Line Items</h3>
                <div style={{ border: '1px solid #eee', borderRadius: '8px', overflow: 'hidden' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead style={{ backgroundColor: '#f8f9fa' }}>
                      <tr>
                        <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #eee' }}>Description</th>
                        <th style={{ padding: '12px', textAlign: 'right', borderBottom: '1px solid #eee' }}>Qty</th>
                        <th style={{ padding: '12px', textAlign: 'right', borderBottom: '1px solid #eee' }}>Price</th>
                        <th style={{ padding: '12px', textAlign: 'right', borderBottom: '1px solid #eee' }}>Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {invoice.lineItems.map((item, index) => (
                        <tr key={index}>
                          <td style={{ padding: '12px', borderBottom: '1px solid #eee' }}>{item.desc}</td>
                          <td style={{ padding: '12px', textAlign: 'right', borderBottom: '1px solid #eee' }}>{item.qty}</td>
                          <td style={{ padding: '12px', textAlign: 'right', borderBottom: '1px solid #eee' }}>{formatCurrency(item.price)}</td>
                          <td style={{ padding: '12px', textAlign: 'right', borderBottom: '1px solid #eee', fontWeight: '600' }}>
                            {formatCurrency(item.qty * item.price)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Totals */}
              <div style={{ marginBottom: '24px' }}>
                <h3 style={{ marginBottom: '16px', color: '#333' }}>💰 Totals</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                  <div>
                    <label style={{ fontSize: '12px', color: '#666', marginBottom: '4px', display: 'block' }}>Subtotal</label>
                    <div>{formatCurrency(invoice.subtotal)}</div>
                  </div>
                  <div>
                    <label style={{ fontSize: '12px', color: '#666', marginBottom: '4px', display: 'block' }}>Tax ({invoice.taxRate}%)</label>
                    <div>{formatCurrency(invoice.tax)}</div>
                  </div>
                  <div>
                    <label style={{ fontSize: '12px', color: '#666', marginBottom: '4px', display: 'block' }}>Discount</label>
                    <div>{formatCurrency(invoice.discount)}</div>
                  </div>
                  <div>
                    <label style={{ fontSize: '12px', color: '#666', marginBottom: '4px', display: 'block' }}>Total</label>
                    <div style={{ fontWeight: '600', fontSize: '18px', color: '#25d366' }}>{formatCurrency(invoice.total)}</div>
                  </div>
                </div>
              </div>

              {/* Additional Information */}
              {(invoice.notes || invoice.terms || invoice.projectRef) && (
                <div style={{ marginBottom: '24px' }}>
                  <h3 style={{ marginBottom: '16px', color: '#333' }}>📄 Additional Information</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                    {invoice.projectRef && (
                      <div>
                        <label style={{ fontSize: '12px', color: '#666', marginBottom: '4px', display: 'block' }}>Project Reference</label>
                        <div>{invoice.projectRef}</div>
                      </div>
                    )}
                    {invoice.notes && (
                      <div>
                        <label style={{ fontSize: '12px', color: '#666', marginBottom: '4px', display: 'block' }}>Notes</label>
                        <div>{invoice.notes}</div>
                      </div>
                    )}
                    {invoice.terms && (
                      <div>
                        <label style={{ fontSize: '12px', color: '#666', marginBottom: '4px', display: 'block' }}>Terms & Conditions</label>
                        <div>{invoice.terms}</div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'timeline' && (
            <div>
              <h3 style={{ marginBottom: '16px', color: '#333' }}>📅 Activity Timeline</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {invoice.activities?.map((activity, index) => (
                  <div key={index} style={{ 
                    display: 'flex', 
                    gap: '12px', 
                    padding: '12px',
                    backgroundColor: '#f8f9fa',
                    borderRadius: '8px'
                  }}>
                    <div style={{ fontSize: '20px' }}>{getActivityIcon(activity.type)}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: '500', marginBottom: '4px' }}>{activity.description}</div>
                      <div style={{ fontSize: '12px', color: '#666' }}>
                        {activity.user} • {new Date(activity.date).toLocaleString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'tasks' && (
            <div>
              <h3 style={{ marginBottom: '16px', color: '#333' }}>✅ Tasks</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {invoice.tasks?.map((task, index) => (
                  <div key={index} style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '12px',
                    backgroundColor: '#f8f9fa',
                    borderRadius: '8px'
                  }}>
                    <div>
                      <div style={{ fontWeight: '500', marginBottom: '4px' }}>{task.title}</div>
                      <div style={{ fontSize: '12px', color: '#666' }}>
                        Due: {formatDate(task.dueDate)} • Assigned to: {task.assignedTo}
                      </div>
                    </div>
                    <div style={{ 
                      padding: '4px 8px',
                      backgroundColor: getTaskStatusColor(task.status),
                      color: 'white',
                      borderRadius: '12px',
                      fontSize: '12px',
                      fontWeight: '500'
                    }}>
                      {task.status}
                    </div>
                  </div>
                ))}
                {(!invoice.tasks || invoice.tasks.length === 0) && (
                  <div style={{ textAlign: 'center', color: '#666', padding: '40px' }}>
                    No tasks assigned to this invoice
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'files' && (
            <div>
              <h3 style={{ marginBottom: '16px', color: '#333' }}>📁 Files</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {invoice.files?.map((file, index) => (
                  <div key={index} style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '12px',
                    backgroundColor: '#f8f9fa',
                    borderRadius: '8px'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <FaFileAlt style={{ fontSize: '20px', color: '#666' }} />
                      <div>
                        <div style={{ fontWeight: '500', marginBottom: '4px' }}>{file.name}</div>
                        <div style={{ fontSize: '12px', color: '#666' }}>
                          {file.size} • Uploaded by {file.uploadedBy} on {formatDate(file.date)}
                        </div>
                      </div>
                    </div>
                    <button
                      style={{
                        padding: '6px 12px',
                        border: '1px solid #ddd',
                        borderRadius: '4px',
                        backgroundColor: 'white',
                        cursor: 'pointer',
                        fontSize: '12px'
                      }}
                    >
                      Download
                    </button>
                  </div>
                ))}
                {(!invoice.files || invoice.files.length === 0) && (
                  <div style={{ textAlign: 'center', color: '#666', padding: '40px' }}>
                    No files attached to this invoice
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'payments' && (
            <div>
              <h3 style={{ marginBottom: '16px', color: '#333' }}>💰 Payment History</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {invoice.paymentHistory?.map((payment, index) => (
                  <div key={index} style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '12px',
                    backgroundColor: '#f8f9fa',
                    borderRadius: '8px'
                  }}>
                    <div>
                      <div style={{ fontWeight: '500', marginBottom: '4px' }}>
                        {formatCurrency(payment.amount)} via {payment.method}
                      </div>
                      <div style={{ fontSize: '12px', color: '#666' }}>
                        {formatDate(payment.date)}
                      </div>
                    </div>
                    <div style={{ 
                      padding: '4px 8px',
                      backgroundColor: getPaymentStatusColor(payment.status),
                      color: 'white',
                      borderRadius: '12px',
                      fontSize: '12px',
                      fontWeight: '500'
                    }}>
                      {payment.status}
                    </div>
                  </div>
                ))}
                {(!invoice.paymentHistory || invoice.paymentHistory.length === 0) && (
                  <div style={{ textAlign: 'center', color: '#666', padding: '40px' }}>
                    No payment history available
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'ai-insights' && (
            <div>
              <h3 style={{ marginBottom: '16px', color: '#333' }}>🤖 AI Insights</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '24px' }}>
                <div style={{ 
                  padding: '16px',
                  backgroundColor: '#f8f9fa',
                  borderRadius: '8px',
                  textAlign: 'center'
                }}>
                  <div style={{ fontSize: '24px', marginBottom: '8px' }}>📊</div>
                  <div style={{ fontSize: '12px', color: '#666', marginBottom: '4px' }}>Payment Probability</div>
                  <div style={{ fontSize: '24px', fontWeight: '600', color: '#25d366' }}>
                    {invoice.aiInsights?.paymentProbability}%
                  </div>
                </div>
                <div style={{ 
                  padding: '16px',
                  backgroundColor: '#f8f9fa',
                  borderRadius: '8px',
                  textAlign: 'center'
                }}>
                  <div style={{ fontSize: '24px', marginBottom: '8px' }}>⚠️</div>
                  <div style={{ fontSize: '12px', color: '#666', marginBottom: '4px' }}>Risk Level</div>
                  <div style={{ 
                    fontSize: '18px', 
                    fontWeight: '600',
                    color: invoice.aiInsights?.riskLevel === 'high' ? '#dc3545' : 
                           invoice.aiInsights?.riskLevel === 'medium' ? '#ffc107' : '#28a745'
                  }}>
                    {invoice.aiInsights?.riskLevel}
                  </div>
                </div>
              </div>

              {invoice.aiInsights?.suggestedActions && (
                <div>
                  <h4 style={{ marginBottom: '12px', color: '#333' }}>💡 Suggested Actions</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {invoice.aiInsights.suggestedActions.map((action, index) => (
                      <div key={index} style={{ 
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '8px 12px',
                        backgroundColor: '#e8f5e8',
                        borderRadius: '6px'
                      }}>
                        <FaLightbulb style={{ color: '#25d366' }} />
                        <span>{action}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 