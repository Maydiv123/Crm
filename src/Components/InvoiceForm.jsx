import React, { useState, useEffect } from 'react';
import { FaPlus, FaTrash, FaUpload, FaCalendarAlt, FaUsers, FaTags, FaStar, FaProjectDiagram, FaGlobe, FaClock } from 'react-icons/fa';
import { dummyClients, calculateInvoiceTotals, generateInvoiceId } from './InvoiceUtils';
import InvoiceImg from '../assets/Invoice.png';

export default function InvoiceForm({ invoice, onSave, onCancel, pipelines = [], users = [], priorities = [], tags = [] }) {
  const [formData, setFormData] = useState({
    id: '',
    clientId: '',
    clientName: '',
    clientEmail: '',
    clientAddress: '',
    clientPhone: '',
    date: new Date().toISOString().split('T')[0],
    dueDate: '',
    status: 'Draft',
    lineItems: [{ desc: '', qty: 1, price: 0 }],
    taxRate: 18,
    discount: 0,
    subtotal: 0,
    tax: 0,
    total: 0,
    notes: '',
    terms: 'Payment due within 30 days',
    projectRef: '',
    template: 'default',
    currency: 'INR',
    // Advanced CRM Features
    pipeline: 'Sales Pipeline',
    stage: 'Initial Contact',
    assignedTo: 'Amit Sharma',
    priority: 'medium',
    tags: [],
    expectedCloseDate: '',
    lastContactDate: new Date().toISOString().split('T')[0],
    source: 'Manual',
    recurring: false,
    recurringInterval: null,
    logo: null,
    // Supplier Details
    supplierName: '',
    supplierGSTIN: '',
    supplierAddress: '',
    supplierContact: '',
    supplierEmail: '',
    // Buyer Details (extended client info)
    buyerGSTIN: '',
    // Product Details (HSN/SAC will be per line item, handled below)
    // Bank Details
    bankName: '',
    bankAccount: '',
    bankIFSC: '',
    bankBranch: '',
    bankUPI: '',
  });

  const [showAdvanced, setShowAdvanced] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);
  const [tagInput, setTagInput] = useState('');

  useEffect(() => {
    if (invoice) {
      console.log('Setting form data for editing:', invoice);
      // Map backend data to form format
      const mappedData = {
        id: invoice.id || '',
        clientId: invoice.clientId || '',
        clientName: invoice.client_name || invoice.clientName || '',
        clientEmail: invoice.client_email || invoice.clientEmail || '',
        clientAddress: invoice.client_address || invoice.clientAddress || '',
        clientPhone: invoice.client_phone || invoice.clientPhone || '',
        date: invoice.date || invoice.created_at || new Date().toISOString().split('T')[0],
        dueDate: invoice.due_date || invoice.dueDate || '',
        status: invoice.status || 'Draft',
        lineItems: invoice.line_items || invoice.lineItems || [{ desc: '', qty: 1, price: 0 }],
        taxRate: invoice.tax_rate || 18,
        discount: invoice.discount || 0,
        subtotal: invoice.subtotal || 0,
        tax: invoice.tax || 0,
        total: invoice.total || invoice.amount || 0,
        notes: invoice.notes || invoice.description || '',
        terms: invoice.terms || 'Payment due within 30 days',
        projectRef: invoice.project_ref || '',
        template: invoice.template || 'default',
        currency: invoice.currency || 'INR',
        pipeline: invoice.pipeline || 'Sales Pipeline',
        stage: invoice.stage || 'Initial Contact',
        assignedTo: invoice.assigned_to || invoice.assignedTo || 'Amit Sharma',
        priority: invoice.priority || 'medium',
        tags: Array.isArray(invoice.tags) ? invoice.tags : (invoice.tags ? JSON.parse(invoice.tags) : []),
        expectedCloseDate: invoice.expected_close_date || '',
        lastContactDate: invoice.last_contact_date || new Date().toISOString().split('T')[0],
        source: invoice.source || 'Manual',
        recurring: invoice.recurring || false,
        recurringInterval: invoice.recurring_interval || null,
        logo: invoice.logo || null,
        supplierName: invoice.supplier_name || '',
        supplierGSTIN: invoice.supplier_gstin || '',
        supplierAddress: invoice.supplier_address || '',
        supplierContact: invoice.supplier_contact || '',
        supplierEmail: invoice.supplier_email || '',
        buyerGSTIN: invoice.buyer_gstin || '',
        bankName: invoice.bank_name || '',
        bankAccount: invoice.bank_account || '',
        bankIFSC: invoice.bank_ifsc || '',
        bankBranch: invoice.bank_branch || '',
        bankUPI: invoice.bank_upi || ''
      };
      setFormData(mappedData);
      if (mappedData.clientId) {
        const client = dummyClients.find(c => c.id === mappedData.clientId);
        setSelectedClient(client);
      }
    }
  }, [invoice]);

  useEffect(() => {
    try {
      if (formData.lineItems && formData.lineItems.length > 0) {
        const totals = calculateInvoiceTotals(formData.lineItems, formData.taxRate, formData.discount);
        setFormData(prev => ({ ...prev, ...totals }));
      }
    } catch (error) {
      console.error('Error calculating totals:', error);
    }
  }, [formData.lineItems, formData.taxRate, formData.discount]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleLineItemChange = (index, field, value) => {
    const newLineItems = [...formData.lineItems];
    newLineItems[index] = { ...newLineItems[index], [field]: value };
    setFormData(prev => ({ ...prev, lineItems: newLineItems }));
  };

  const addLineItem = () => {
    setFormData(prev => ({
      ...prev,
      lineItems: [...prev.lineItems, { desc: '', qty: 1, price: 0 }]
    }));
  };

  const removeLineItem = (index) => {
    if (formData.lineItems.length > 1) {
      const newLineItems = formData.lineItems.filter((_, i) => i !== index);
      setFormData(prev => ({ ...prev, lineItems: newLineItems }));
    }
  };

  const handleClientSelect = (client) => {
    setSelectedClient(client);
    setFormData(prev => ({
      ...prev,
      clientId: client.id,
      clientName: client.name,
      clientEmail: client.email,
      clientAddress: client.address,
      clientPhone: client.phone
    }));
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }));
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Calculate totals
    const calculatedTotals = calculateInvoiceTotals(formData.lineItems, formData.taxRate, formData.discount);
    
    // Ensure all required fields have values with defaults
    const invoiceData = {
      ...formData,
      ...calculatedTotals,
      // Ensure required fields have default values if empty
      clientName: formData.clientName || 'Default Client',
      clientEmail: formData.clientEmail || 'client@example.com',
      total: calculatedTotals.total || 1000,
      status: formData.status || 'Draft',
      dueDate: formData.dueDate || new Date().toISOString().split('T')[0],
      notes: formData.notes || 'Invoice description',
      assignedTo: formData.assignedTo || 'Amit Sharma',
      priority: formData.priority || 'Medium',
      pipeline: formData.pipeline || 'Sales Pipeline',
      stage: formData.stage || 'Initial Contact'
    };
    
    console.log('Submitting invoice data with all fields filled:', invoiceData);
    onSave(invoiceData);
  };

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, logo: file }));
    }
  };

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

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat(formData.currency === 'INR' ? 'en-IN' : 'en-US', {
      style: 'currency',
      currency: formData.currency,
    }).format(amount);
  };

  return (
    <div className="invoice-modal-backdrop">
      <div className="invoice-modal invoice-form-modal" style={{ borderRadius: '18px', boxShadow: '0 8px 32px rgba(0,0,0,0.12)', background: 'white', padding: 0 }}>
        <div className="invoice-modal-header" style={{ display: 'flex', alignItems: 'center', background: 'linear-gradient(90deg, #25d366 0%, #009688 100%)', borderTopLeftRadius: '18px', borderTopRightRadius: '18px', padding: '24px 32px', color: 'white', marginBottom: 0 }}>
          <img src={InvoiceImg} alt="Invoice" style={{ width: '36px', height: '36px', marginRight: '16px' }} />
          <h2 style={{ fontWeight: 700, fontSize: '1.6rem', margin: 0, flex: 1 }}>{invoice ? 'Edit Invoice' : 'Create New Invoice'}</h2>
          <button className="invoice-modal-close" onClick={onCancel} style={{ color: 'white', background: 'transparent', border: 'none', fontSize: '2rem', cursor: 'pointer' }}>&times;</button>
        </div>
        <form onSubmit={handleSubmit} className="invoice-form" style={{ padding: '32px', borderRadius: '0 0 18px 18px', background: 'white' }}>
          {/* Supplier Details */}
          <div className="invoice-form-section" style={{ marginBottom: '32px' }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
              <img src={InvoiceImg} alt="Supplier Info" style={{ width: '24px', height: '24px', marginRight: '10px' }} />
              <h3 style={{ fontWeight: 600, fontSize: '1.2rem', margin: 0, color: '#009688' }}>Supplier Details</h3>
            </div>
            <div className="invoice-form-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div>
                <label style={{ fontWeight: 500, color: '#333' }}>Supplier Name</label>
                <input type="text" value={formData.supplierName} onChange={e => handleInputChange('supplierName', e.target.value)} placeholder="Your company name" style={{ borderRadius: '8px', border: '1px solid #ddd', padding: '10px', width: '100%' }} />
              </div>
              <div>
                <label style={{ fontWeight: 500, color: '#333' }}>GSTIN</label>
                <input type="text" value={formData.supplierGSTIN} onChange={e => handleInputChange('supplierGSTIN', e.target.value)} placeholder="Supplier GSTIN" style={{ borderRadius: '8px', border: '1px solid #ddd', padding: '10px', width: '100%' }} />
              </div>
              <div style={{ gridColumn: '1/3' }}>
                <label style={{ fontWeight: 500, color: '#333' }}>Supplier Address</label>
                <textarea value={formData.supplierAddress} onChange={e => handleInputChange('supplierAddress', e.target.value)} placeholder="Supplier address" style={{ borderRadius: '8px', border: '1px solid #ddd', padding: '10px', width: '100%' }} />
              </div>
              <div>
                <label style={{ fontWeight: 500, color: '#333' }}>Contact</label>
                <input type="text" value={formData.supplierContact} onChange={e => handleInputChange('supplierContact', e.target.value)} placeholder="Supplier contact" style={{ borderRadius: '8px', border: '1px solid #ddd', padding: '10px', width: '100%' }} />
              </div>
              <div>
                <label style={{ fontWeight: 500, color: '#333' }}>Email</label>
                <input type="email" value={formData.supplierEmail} onChange={e => handleInputChange('supplierEmail', e.target.value)} placeholder="Supplier email" style={{ borderRadius: '8px', border: '1px solid #ddd', padding: '10px', width: '100%' }} />
              </div>
            </div>
          </div>
          <hr style={{ border: 'none', borderTop: '1px solid #eee', margin: '32px 0' }} />
          {/* Buyer Details (extra GSTIN field) */}
          <div className="invoice-form-section" style={{ marginBottom: '32px' }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
              <img src={InvoiceImg} alt="Buyer Info" style={{ width: '24px', height: '24px', marginRight: '10px' }} />
              <h3 style={{ fontWeight: 600, fontSize: '1.2rem', margin: 0, color: '#009688' }}>Buyer Details</h3>
            </div>
            <div className="invoice-form-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div>
                <label style={{ fontWeight: 500, color: '#333' }}>GSTIN</label>
                <input type="text" value={formData.buyerGSTIN} onChange={e => handleInputChange('buyerGSTIN', e.target.value)} placeholder="Buyer GSTIN" style={{ borderRadius: '8px', border: '1px solid #ddd', padding: '10px', width: '100%' }} />
              </div>
            </div>
          </div>
          {/* Basic Information */}
          <div className="invoice-form-section" style={{ marginBottom: '32px' }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
              <img src={InvoiceImg} alt="Basic Info" style={{ width: '24px', height: '24px', marginRight: '10px' }} />
              <h3 style={{ fontWeight: 600, fontSize: '1.2rem', margin: 0, color: '#009688' }}>Basic Information</h3>
            </div>
            <div className="invoice-form-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px' }}>
              <div>
                <label style={{ fontWeight: 500, color: '#333' }}>Invoice ID</label>
                <input
                  type="text"
                  value={formData.id || generateInvoiceId()}
                  onChange={(e) => handleInputChange('id', e.target.value)}
                  placeholder="Auto-generated"
                  style={{ borderRadius: '8px', border: '1px solid #ddd', padding: '10px', width: '100%' }}
                />
              </div>
              <div>
                <label style={{ fontWeight: 500, color: '#333' }}>Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => handleInputChange('status', e.target.value)}
                  style={{ borderRadius: '8px', border: '1px solid #ddd', padding: '10px', width: '100%' }}
                >
                  <option value="Draft">Draft</option>
                  <option value="Sent">Sent</option>
                  <option value="Paid">Paid</option>
                  <option value="Overdue">Overdue</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>
              <div>
                <label style={{ fontWeight: 500, color: '#333' }}>Date</label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => handleInputChange('date', e.target.value)}
                  style={{ borderRadius: '8px', border: '1px solid #ddd', padding: '10px', width: '100%' }}
                />
              </div>
              <div>
                <label style={{ fontWeight: 500, color: '#333' }}>Due Date</label>
                <input
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) => handleInputChange('dueDate', e.target.value)}
                  style={{ borderRadius: '8px', border: '1px solid #ddd', padding: '10px', width: '100%' }}
                />
              </div>
            </div>
          </div>
          <hr style={{ border: 'none', borderTop: '1px solid #eee', margin: '32px 0' }} />
          {/* Client Information */}
          <div className="invoice-form-section" style={{ marginBottom: '32px' }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
              <img src={InvoiceImg} alt="Client Info" style={{ width: '24px', height: '24px', marginRight: '10px' }} />
              <h3 style={{ fontWeight: 600, fontSize: '1.2rem', margin: 0, color: '#009688' }}>Client Information</h3>
            </div>
            <div className="invoice-form-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div>
                <label style={{ fontWeight: 500, color: '#333' }}>Select a client</label>
                <select
                  value={formData.clientId}
                  onChange={(e) => {
                    const client = dummyClients.find(c => c.id === e.target.value);
                    handleClientSelect(client);
                  }}
                  style={{ borderRadius: '8px', border: '1px solid #ddd', padding: '10px', width: '100%' }}
                >
                  <option value="">Select a client</option>
                  {dummyClients.map(client => (
                    <option key={client.id} value={client.id}>{client.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label style={{ fontWeight: 500, color: '#333' }}>Client name</label>
                <input
                  type="text"
                  value={formData.clientName}
                  onChange={(e) => handleInputChange('clientName', e.target.value)}
                  placeholder="Client name"
                  style={{ borderRadius: '8px', border: '1px solid #ddd', padding: '10px', width: '100%' }}
                />
              </div>
              <div>
                <label style={{ fontWeight: 500, color: '#333' }}>Client email</label>
                <input
                  type="email"
                  value={formData.clientEmail}
                  onChange={(e) => handleInputChange('clientEmail', e.target.value)}
                  placeholder="client@example.com"
                  style={{ borderRadius: '8px', border: '1px solid #ddd', padding: '10px', width: '100%' }}
                />
              </div>
              <div>
                <label style={{ fontWeight: 500, color: '#333' }}>Client phone</label>
                <input
                  type="text"
                  value={formData.clientPhone}
                  onChange={(e) => handleInputChange('clientPhone', e.target.value)}
                  placeholder="+91 9000000000"
                  style={{ borderRadius: '8px', border: '1px solid #ddd', padding: '10px', width: '100%' }}
                />
              </div>
              <div style={{ gridColumn: '1/3' }}>
                <label style={{ fontWeight: 500, color: '#333' }}>Client address</label>
                <textarea
                  value={formData.clientAddress}
                  onChange={(e) => handleInputChange('clientAddress', e.target.value)}
                  placeholder="Client address"
                  style={{ borderRadius: '8px', border: '1px solid #ddd', padding: '10px', width: '100%' }}
                />
              </div>
            </div>
          </div>
          <hr style={{ border: 'none', borderTop: '1px solid #eee', margin: '32px 0' }} />
          {/* CRM Integration */}
          <div className="invoice-form-section" style={{ marginBottom: '32px' }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
              <img src={InvoiceImg} alt="CRM" style={{ width: '24px', height: '24px', marginRight: '10px' }} />
              <h3 style={{ fontWeight: 600, fontSize: '1.2rem', margin: 0, color: '#009688' }}>CRM Integration</h3>
            </div>
            <div className="invoice-form-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px' }}>
              <div>
                <label style={{ fontWeight: 500, color: '#333' }}>Pipeline</label>
                <select
                  value={formData.pipeline}
                  onChange={(e) => handleInputChange('pipeline', e.target.value)}
                  style={{ borderRadius: '8px', border: '1px solid #ddd', padding: '10px', width: '100%' }}
                >
                  {pipelines.map(p => <option key={p.name} value={p.name}>{p.name}</option>)}
                </select>
              </div>
              <div>
                <label style={{ fontWeight: 500, color: '#333' }}>Stage</label>
                <select
                  value={formData.stage}
                  onChange={(e) => handleInputChange('stage', e.target.value)}
                  style={{ borderRadius: '8px', border: '1px solid #ddd', padding: '10px', width: '100%' }}
                >
                  {pipelines.find(p => p.name === formData.pipeline)?.stages.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label style={{ fontWeight: 500, color: '#333' }}>Assignee</label>
                <select
                  value={formData.assignedTo}
                  onChange={(e) => handleInputChange('assignedTo', e.target.value)}
                  style={{ borderRadius: '8px', border: '1px solid #ddd', padding: '10px', width: '100%' }}
                >
                  {users.map(u => <option key={u} value={u}>{u}</option>)}
                </select>
              </div>
              <div>
                <label style={{ fontWeight: 500, color: '#333' }}>Priority</label>
                <select
                  value={formData.priority}
                  onChange={(e) => handleInputChange('priority', e.target.value)}
                  style={{ borderRadius: '8px', border: '1px solid #ddd', padding: '10px', width: '100%' }}
                >
                  {priorities.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
              <div style={{ gridColumn: '1/3' }}>
                <label style={{ fontWeight: 500, color: '#333' }}>Tags</label>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <input
                    type="text"
                    value={tagInput}
                    onChange={e => setTagInput(e.target.value)}
                    placeholder="Add a tag"
                    style={{ borderRadius: '8px', border: '1px solid #ddd', padding: '10px', width: '100%' }}
                  />
                  <button type="button" onClick={handleAddTag} style={{ background: '#25d366', color: 'white', border: 'none', borderRadius: '8px', padding: '10px 16px', fontWeight: 600, cursor: 'pointer' }}>Add</button>
                </div>
                <div style={{ marginTop: '8px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {formData.tags.map(tag => (
                    <span key={tag} style={{ background: '#e0f7fa', color: '#009688', borderRadius: '6px', padding: '4px 10px', fontSize: '13px', display: 'inline-flex', alignItems: 'center' }}>
                      {tag}
                      <button type="button" onClick={() => handleRemoveTag(tag)} style={{ background: 'none', border: 'none', color: '#009688', marginLeft: '6px', cursor: 'pointer', fontSize: '15px' }}>&times;</button>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
          {/* Product Details (add HSN/SAC to each line item) */}
          <div className="invoice-form-section" style={{ marginBottom: '32px' }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
              <img src={InvoiceImg} alt="Product Info" style={{ width: '24px', height: '24px', marginRight: '10px' }} />
              <h3 style={{ fontWeight: 600, fontSize: '1.2rem', margin: 0, color: '#009688' }}>Product/Service Details</h3>
            </div>
            <div>
              {formData.lineItems.map((item, idx) => (
                <div key={idx} className="product-line-grid">
                  <input type="text" value={item.desc} onChange={e => handleLineItemChange(idx, 'desc', e.target.value)} placeholder="Description" style={{ borderRadius: '8px', border: '1px solid #ddd', padding: '10px' }} />
                  <input type="number" value={item.qty} onChange={e => handleLineItemChange(idx, 'qty', e.target.value)} placeholder="Qty" style={{ borderRadius: '8px', border: '1px solid #ddd', padding: '10px' }} />
                  <input type="number" value={item.price} onChange={e => handleLineItemChange(idx, 'price', e.target.value)} placeholder="Rate" style={{ borderRadius: '8px', border: '1px solid #ddd', padding: '10px' }} />
                  <input type="text" value={item.hsn || ''} onChange={e => handleLineItemChange(idx, 'hsn', e.target.value)} placeholder="HSN/SAC" style={{ borderRadius: '8px', border: '1px solid #ddd', padding: '10px' }} />
                  <button type="button" onClick={() => removeLineItem(idx)} style={{ background: '#ff6b35', color: 'white', border: 'none', borderRadius: '8px', padding: '8px 12px', fontWeight: 600, cursor: 'pointer' }}>Remove</button>
                </div>
              ))}
              <button type="button" onClick={addLineItem} style={{ background: '#25d366', color: 'white', border: 'none', borderRadius: '8px', padding: '10px 24px', fontWeight: 600, marginTop: '10px', cursor: 'pointer' }}>Add Item</button>
            </div>
          </div>
          <hr style={{ border: 'none', borderTop: '1px solid #eee', margin: '32px 0' }} />
          {/* Bank Details */}
          <div className="invoice-form-section" style={{ marginBottom: '32px' }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
              <img src={InvoiceImg} alt="Bank Info" style={{ width: '24px', height: '24px', marginRight: '10px' }} />
              <h3 style={{ fontWeight: 600, fontSize: '1.2rem', margin: 0, color: '#009688' }}>Bank Details</h3>
            </div>
            <div className="invoice-form-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div>
                <label style={{ fontWeight: 500, color: '#333' }}>Bank Name</label>
                <input type="text" value={formData.bankName} onChange={e => handleInputChange('bankName', e.target.value)} placeholder="Bank name" style={{ borderRadius: '8px', border: '1px solid #ddd', padding: '10px', width: '100%' }} />
              </div>
              <div>
                <label style={{ fontWeight: 500, color: '#333' }}>Account Number</label>
                <input type="text" value={formData.bankAccount} onChange={e => handleInputChange('bankAccount', e.target.value)} placeholder="Account number" style={{ borderRadius: '8px', border: '1px solid #ddd', padding: '10px', width: '100%' }} />
              </div>
              <div>
                <label style={{ fontWeight: 500, color: '#333' }}>IFSC</label>
                <input type="text" value={formData.bankIFSC} onChange={e => handleInputChange('bankIFSC', e.target.value)} placeholder="IFSC code" style={{ borderRadius: '8px', border: '1px solid #ddd', padding: '10px', width: '100%' }} />
              </div>
              <div>
                <label style={{ fontWeight: 500, color: '#333' }}>Branch</label>
                <input type="text" value={formData.bankBranch} onChange={e => handleInputChange('bankBranch', e.target.value)} placeholder="Branch" style={{ borderRadius: '8px', border: '1px solid #ddd', padding: '10px', width: '100%' }} />
              </div>
              <div style={{ gridColumn: '1/3' }}>
                <label style={{ fontWeight: 500, color: '#333' }}>UPI</label>
                <input type="text" value={formData.bankUPI} onChange={e => handleInputChange('bankUPI', e.target.value)} placeholder="UPI ID" style={{ borderRadius: '8px', border: '1px solid #ddd', padding: '10px', width: '100%' }} />
              </div>
            </div>
          </div>
          {/* Buttons */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '16px', marginTop: '32px' }}>
            <button type="button" onClick={onCancel} style={{ border: '1px solid #25d366', background: 'white', color: '#25d366', borderRadius: '8px', padding: '12px 32px', fontWeight: 600, fontSize: '1rem', cursor: 'pointer' }}>Cancel</button>
            <button type="submit" style={{ background: '#25d366', color: 'white', border: 'none', borderRadius: '8px', padding: '12px 32px', fontWeight: 600, fontSize: '1rem', cursor: 'pointer' }}>{invoice ? 'Update' : 'Add'}</button>
          </div>
        </form>
      </div>
    </div>
  );
} 