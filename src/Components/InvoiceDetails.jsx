import React from 'react';
import { FaTimes, FaDownload, FaPrint, FaEnvelope } from 'react-icons/fa';
import './Invoice.css';

export default function InvoiceDetails({ invoice, onClose }) {
  const formatCurrency = (amount) => {
    return `₹${parseFloat(amount || 0).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN');
  };

  return (
    <div className="invoice-details-modal">
        <div className="invoice-modal-header">
        <h2>Invoice Details - {invoice.invoice_id}</h2>
        <button className="invoice-modal-close" onClick={onClose}>
          <FaTimes />
        </button>
      </div>
      
      <div style={{ padding: '24px' }}>
        {/* Invoice Header */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '30px' }}>
          <div>
            <h3>Client Information</h3>
            <p><strong>Name:</strong> {invoice.client_name}</p>
            <p><strong>Email:</strong> {invoice.client_email}</p>
            {invoice.client_address && <p><strong>Address:</strong> {invoice.client_address}</p>}
            {invoice.client_phone && <p><strong>Phone:</strong> {invoice.client_phone}</p>}
          </div>
          <div>
            <h3>Invoice Information</h3>
            <p><strong>Invoice ID:</strong> {invoice.invoice_id}</p>
            <p><strong>Date:</strong> {formatDate(invoice.date || invoice.created_at)}</p>
            <p><strong>Due Date:</strong> {formatDate(invoice.due_date)}</p>
            <p><strong>Status:</strong> 
              <span className={`invoice-status ${invoice.status.toLowerCase()}`} style={{ marginLeft: '8px' }}>
                {invoice.status}
              </span>
            </p>
          </div>
        </div>

        {/* Amount Details */}
        <div style={{ background: '#f8f9fa', padding: '20px', borderRadius: '8px', marginBottom: '20px' }}>
          <h3>Amount Details</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <p><strong>Total Amount:</strong> {formatCurrency(invoice.total || invoice.amount)}</p>
            {invoice.subtotal && <p><strong>Subtotal:</strong> {formatCurrency(invoice.subtotal)}</p>}
            {invoice.tax && <p><strong>Tax:</strong> {formatCurrency(invoice.tax)}</p>}
            {invoice.discount && <p><strong>Discount:</strong> {formatCurrency(invoice.discount)}</p>}
          </div>
              </div>

              {/* CRM Information */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                  <div>
            <h3>CRM Information</h3>
            <p><strong>Pipeline:</strong> {invoice.pipeline}</p>
            <p><strong>Stage:</strong> {invoice.stage}</p>
            <p><strong>Assigned To:</strong> {invoice.assigned_to}</p>
            <p><strong>Priority:</strong> 
              <span style={{ 
                color: invoice.priority === 'high' ? '#dc3545' : 
                       invoice.priority === 'medium' ? '#ffc107' : '#28a745',
                marginLeft: '8px'
              }}>
                        {invoice.priority}
                      </span>
            </p>
                  </div>
                  <div>
            <h3>Additional Information</h3>
            {invoice.description && <p><strong>Description:</strong> {invoice.description}</p>}
            {invoice.notes && <p><strong>Notes:</strong> {invoice.notes}</p>}
            {invoice.tags && invoice.tags.length > 0 && (
                  <div>
                <strong>Tags:</strong>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginTop: '4px' }}>
                  {Array.isArray(invoice.tags) ? invoice.tags.map((tag, index) => (
                    <span key={index} className="invoice-tag">{tag}</span>
                  )) : (
                    <span className="invoice-tag">{invoice.tags}</span>
                  )}
                    </div>
                  </div>
                )}
          </div>
              </div>

              {/* Line Items */}
        {invoice.line_items && invoice.line_items.length > 0 && (
          <div style={{ marginBottom: '20px' }}>
            <h3>Line Items</h3>
            <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
              <thead>
                <tr style={{ background: '#f8f9fa' }}>
                  <th style={{ padding: '8px', textAlign: 'left', border: '1px solid #ddd' }}>Description</th>
                  <th style={{ padding: '8px', textAlign: 'right', border: '1px solid #ddd' }}>Quantity</th>
                  <th style={{ padding: '8px', textAlign: 'right', border: '1px solid #ddd' }}>Price</th>
                  <th style={{ padding: '8px', textAlign: 'right', border: '1px solid #ddd' }}>Total</th>
                      </tr>
                    </thead>
                    <tbody>
                {Array.isArray(invoice.line_items) ? invoice.line_items.map((item, index) => (
                        <tr key={index}>
                    <td style={{ padding: '8px', border: '1px solid #ddd' }}>{item.desc || item.description}</td>
                    <td style={{ padding: '8px', textAlign: 'right', border: '1px solid #ddd' }}>{item.qty}</td>
                    <td style={{ padding: '8px', textAlign: 'right', border: '1px solid #ddd' }}>{formatCurrency(item.price)}</td>
                    <td style={{ padding: '8px', textAlign: 'right', border: '1px solid #ddd' }}>{formatCurrency(item.qty * item.price)}</td>
                  </tr>
                )) : (
                  <tr>
                    <td style={{ padding: '8px', border: '1px solid #ddd' }} colSpan="4">No line items available</td>
                        </tr>
                )}
                    </tbody>
                  </table>
            </div>
          )}

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '30px' }}>
          <button className="invoice-btn-secondary" onClick={() => window.print()}>
            <FaPrint /> Print
          </button>
          <button className="invoice-btn-secondary" onClick={() => alert('Download functionality coming soon!')}>
            <FaDownload /> Download PDF
          </button>
          <button className="invoice-btn-secondary" onClick={() => alert('Email functionality coming soon!')}>
            <FaEnvelope /> Send Email
          </button>
          <button className="invoice-btn-primary" onClick={onClose}>
            Close
                    </button>
        </div>
      </div>
    </div>
  );
} 