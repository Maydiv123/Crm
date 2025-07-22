import React, { useState, useMemo } from 'react';
import { FaSearch, FaFilter, FaSort, FaDownload, FaPrint, FaEdit, FaTrash, FaEye, FaCopy, FaEnvelope, FaUsers, FaTags, FaStar, FaCalendarAlt, FaClock, FaCreditCard, FaSync, FaCheck, FaLightbulb } from 'react-icons/fa';
import { formatCurrency, formatDate, getStatusClass } from './InvoiceUtils';
// Custom Images
import InvoiceImg from '../assets/Invoice.png';
import AnalyticsImg from '../assets/Analytics.png';
import AutomationImg from '../assets/Automation.png';
import PipelineImg from '../assets/Pipeline.png';
import AiImg from '../assets/Ai.png';

export default function InvoiceTable({ invoices, onEdit, onDelete, onView, onAction, bulkSelected = [], setBulkSelected, showBulkActions, setShowBulkActions }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterYear, setFilterYear] = useState('All');
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');

  const filteredInvoices = useMemo(() => {
    let filtered = invoices.filter(invoice => {
      const matchesSearch = 
        invoice.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        invoice.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        invoice.clientEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
        invoice.assignedTo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        invoice.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesStatus = filterStatus === 'All' || invoice.status === filterStatus;
      const matchesYear = filterYear === 'All' || new Date(invoice.date).getFullYear().toString() === filterYear;
      
      return matchesSearch && matchesStatus && matchesYear;
    });

    filtered.sort((a, b) => {
      let aVal = a[sortBy];
      let bVal = b[sortBy];
      
      if (sortBy === 'date' || sortBy === 'dueDate' || sortBy === 'expectedCloseDate') {
        aVal = new Date(aVal);
        bVal = new Date(bVal);
      } else if (sortBy === 'amount') {
        aVal = a.total;
        bVal = b.total;
      } else if (sortBy === 'priority') {
        const priorityOrder = { 'high': 3, 'medium': 2, 'low': 1 };
        aVal = priorityOrder[a.priority] || 0;
        bVal = priorityOrder[b.priority] || 0;
      }
      
      if (sortOrder === 'asc') {
        return aVal > bVal ? 1 : -1;
      } else {
        return aVal < bVal ? 1 : -1;
      }
    });

    return filtered;
  }, [invoices, searchTerm, filterStatus, filterYear, sortBy, sortOrder]);

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  const handleSelectAll = (checked) => {
    if (checked) {
      setBulkSelected(filteredInvoices.map(inv => inv.id));
    } else {
      setBulkSelected([]);
    }
  };

  const handleSelectInvoice = (invoiceId, checked) => {
    if (checked) {
      setBulkSelected(prev => [...prev, invoiceId]);
    } else {
      setBulkSelected(prev => prev.filter(id => id !== invoiceId));
    }
  };

  const handleBulkAction = (action) => {
    onAction(action, bulkSelected);
  };

  const years = useMemo(() => {
    const yearsSet = new Set();
    invoices.forEach(invoice => {
      yearsSet.add(new Date(invoice.date).getFullYear().toString());
    });
    return Array.from(yearsSet).sort((a, b) => b - a);
  }, [invoices]);

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

  return (
    <div>
      {/* Search and Filter */}
      <div className="invoice-search-filter">
        <div className="invoice-search">
          <img 
            src={AiImg} 
            alt="Search" 
            className="invoice-search-icon" 
            style={{ width: '16px', height: '16px' }}
          />
          <input
            type="text"
            placeholder="Search invoices by ID, client, assignee, or tags..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select
          className="invoice-filter"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="All">All Status</option>
          <option value="Draft">Draft</option>
          <option value="Sent">Sent</option>
          <option value="Paid">Paid</option>
          <option value="Overdue">Overdue</option>
          <option value="Cancelled">Cancelled</option>
        </select>
        <select
          className="invoice-filter"
          value={filterYear}
          onChange={(e) => setFilterYear(e.target.value)}
        >
          <option value="All">All Years</option>
          {years.map(year => (
            <option key={year} value={year}>{year}</option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="invoice-table-container">
        <div style={{
          padding: '20px',
          borderBottom: '1px solid #eee',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <h3 style={{ margin: 0, color: '#333', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <img src={InvoiceImg} alt="Invoice" style={{ width: '20px', height: '20px' }} />
            Invoices ({filteredInvoices.length})
          </h3>
          <div style={{ display: 'flex', gap: '10px' }}>
            {bulkSelected.length > 0 && (
              <>
                <button
                  onClick={() => handleBulkAction('markPaid')}
                  style={{
                    padding: '8px 12px',
                    border: 'none',
                    borderRadius: '6px',
                    backgroundColor: '#25d366',
                 
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px',
                    fontSize: '12px'
                  }}
                >
                  <FaCheck /> Mark Paid
                </button>
                <button
                  onClick={() => handleBulkAction('assign')}
                  style={{
                    padding: '8px 12px',
                    border: '1px solid #ddd',
                    borderRadius: '6px',
               
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px',
                    fontSize: '12px'
                  }}
                >
                  <FaUsers /> Assign
                </button>
              </>
            )}
            <button
              onClick={() => onAction('export', filteredInvoices.map(inv => inv.id))}
              style={{
                padding: '8px 12px',
                border: '1px solid #ddd',
                borderRadius: '6px',
                backgroundColor: 'white',
                color: '#666',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                fontSize: '12px'
              }}
            >
              <img src={AnalyticsImg} alt="Export" style={{ width: '14px', height: '14px' }} />
              Export All
            </button>
            <button
              onClick={() => onAction('print', filteredInvoices.map(inv => inv.id))}
              style={{
                padding: '8px 12px',
                border: '1px solid #ddd',
                borderRadius: '6px',
                backgroundColor: 'white',
                color: '#666',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                fontSize: '12px'
              }}
            >
              <img src={PipelineImg} alt="Print" style={{ width: '14px', height: '14px' }} />
              Print All
            </button>
          </div>
        </div>
        
        <table className="invoice-table">
          <thead>
            <tr>
              <th style={{ width: '40px' }}>
                <input
                  type="checkbox"
                  checked={bulkSelected.length === filteredInvoices.length && filteredInvoices.length > 0}
                  onChange={(e) => handleSelectAll(e.target.checked)}
                />
              </th>
              <th onClick={() => handleSort('id')} style={{ cursor: 'pointer' }}>
                Invoice ID <FaSort style={{ fontSize: '0.8rem', marginLeft: '4px' }} />
              </th>
              <th onClick={() => handleSort('clientName')} style={{ cursor: 'pointer' }}>
                Client <FaSort style={{ fontSize: '0.8rem', marginLeft: '4px' }} />
              </th>
              <th onClick={() => handleSort('amount')} style={{ cursor: 'pointer' }}>
                Amount <FaSort style={{ fontSize: '0.8rem', marginLeft: '4px' }} />
              </th>
              <th>Status</th>
              <th>Pipeline/Stage</th>
              <th>Assignee</th>
              <th>Priority</th>
              <th>Tags</th>
              <th onClick={() => handleSort('date')} style={{ cursor: 'pointer' }}>
                Date <FaSort style={{ fontSize: '0.8rem', marginLeft: '4px' }} />
              </th>
              <th onClick={() => handleSort('dueDate')} style={{ cursor: 'pointer' }}>
                Due Date <FaSort style={{ fontSize: '0.8rem', marginLeft: '4px' }} />
              </th>
              <th style={{ textAlign: 'center' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredInvoices.length === 0 ? (
              <tr>
                <td colSpan="13" className="invoice-empty-state">
                  No invoices found
                </td>
              </tr>
            ) : (
              filteredInvoices.map((invoice) => (
                <tr key={invoice.id}>
                  <td>
                    <input
                      type="checkbox"
                      checked={bulkSelected.includes(invoice.id)}
                      onChange={(e) => handleSelectInvoice(invoice.id, e.target.checked)}
                    />
                  </td>
                  <td style={{ fontWeight: '600' }}>{invoice.id}</td>
                  <td>
                    <div>
                      <div style={{ fontWeight: '500' }}>{invoice.clientName}</div>
                      <div style={{ fontSize: '0.9rem', color: '#666' }}>{invoice.clientEmail}</div>
                    </div>
                  </td>
                  <td style={{ fontWeight: '600' }}>{formatCurrency(invoice.total)}</td>
                  <td>
                    <span className={`invoice-status ${getStatusClass(invoice.status)}`}>
                      {invoice.status}
                    </span>
                  </td>
                  <td>
                    <div style={{ fontSize: '0.9rem' }}>
                      <div style={{ fontWeight: '500', color: '#333' }}>{invoice.pipeline}</div>
                      <div style={{ color: '#666', fontSize: '0.8rem' }}>{invoice.stage}</div>
                    </div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <FaUsers style={{ fontSize: '0.8rem', color: '#666' }} />
                      <span style={{ fontSize: '0.9rem' }}>{invoice.assignedTo}</span>
                    </div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <span style={{ fontSize: '1rem' }}>{getPriorityIcon(invoice.priority)}</span>
                      <span style={{ 
                        fontSize: '0.8rem', 
                        fontWeight: '500',
                        color: getPriorityColor(invoice.priority)
                      }}>
                        {invoice.priority}
                      </span>
                    </div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                      {invoice.tags?.slice(0, 2).map((tag, idx) => (
                        <span
                          key={idx}
                          style={{
                            padding: '2px 6px',
                            backgroundColor: '#f0f2f5',
                            borderRadius: '10px',
                            fontSize: '0.7rem',
                            color: '#666'
                          }}
                        >
                          {tag}
                        </span>
                      ))}
                      {invoice.tags?.length > 2 && (
                        <span style={{ fontSize: '0.7rem', color: '#999' }}>
                          +{invoice.tags.length - 2}
                        </span>
                      )}
                    </div>
                  </td>
                  <td>{formatDate(invoice.date)}</td>
                  <td>{formatDate(invoice.dueDate)}</td>
                  <td style={{ textAlign: 'center' }}>
                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                      <button
                        className="invoice-action-btn"
                        onClick={() => onView(invoice)}
                        title="View Details"
                      >
                        <FaEye />
                      </button>
                      <button
                        className="invoice-action-btn"
                        onClick={() => onEdit(invoice)}
                        title="Edit Invoice"
                      >
                        <FaEdit />
                      </button>
                      <button
                        className="invoice-action-btn"
                        onClick={() => onAction('duplicate', invoice.id)}
                        title="Duplicate"
                      >
                        <FaCopy />
                      </button>
                      <button
                        className="invoice-action-btn"
                        onClick={() => onAction('sendEmail', invoice.id)}
                        title="Send Email"
                      >
                        <FaEnvelope />
                      </button>
                      {invoice.recurring && (
                        <button
                          className="invoice-action-btn"
                          onClick={() => onAction('convertToRecurring', invoice.id)}
                          title="Recurring Setup"
                          style={{ color: '#764ba2' }}
                        >
                          <FaSync />
                        </button>
                      )}
                      <button
                        className="invoice-action-btn"
                        onClick={() => onAction('setupPayment', invoice.id)}
                        title="Payment Setup"
                        style={{ color: '#28a745' }}
                      >
                        <FaCreditCard />
                      </button>
                      <button
                        className="invoice-action-btn"
                        onClick={() => onDelete(invoice.id)}
                        title="Delete"
                        style={{ color: '#dc3545' }}
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
} 