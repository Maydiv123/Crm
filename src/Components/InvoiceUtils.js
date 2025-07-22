// Invoice Management System Utilities

// Dummy data for clients
export const dummyClients = [
  {
    id: 'C-001',
    name: 'John Doe',
    email: 'john@example.com',
    phone: '+91 9000000001',
    address: '22, Park Lane, Mumbai, Maharashtra 400001',
    company: 'Tech Solutions Inc.',
    website: 'www.techsolutions.com',
    notes: 'Premium client, prefers email communication',
    tags: ['premium', 'tech', 'recurring'],
    createdAt: '2024-01-01',
    lastContact: '2024-01-15'
  },
  {
    id: 'C-002',
    name: 'Jane Smith',
    email: 'jane@example.com',
    phone: '+91 9000000002',
    address: '55, MG Road, Pune, Maharashtra 411001',
    company: 'Design Studio',
    website: 'www.designstudio.com',
    notes: 'Creative agency, needs quick turnaround',
    tags: ['design', 'agency', 'urgent'],
    createdAt: '2024-01-05',
    lastContact: '2024-01-20'
  },
  {
    id: 'C-003',
    name: 'Mike Johnson',
    email: 'mike@example.com',
    phone: '+91 9000000003',
    address: '88, Brigade Road, Bangalore, Karnataka 560001',
    company: 'Consulting Corp',
    website: 'www.consultingcorp.com',
    notes: 'Enterprise client, requires detailed proposals',
    tags: ['enterprise', 'consulting', 'high-value'],
    createdAt: '2024-01-10',
    lastContact: '2024-01-25'
  },
  {
    id: 'C-004',
    name: 'Sarah Wilson',
    email: 'sarah@example.com',
    phone: '+91 9000000004',
    address: '123, Anna Salai, Chennai, Tamil Nadu 600002',
    company: 'Startup Ventures',
    website: 'www.startupventures.com',
    notes: 'New startup, budget conscious',
    tags: ['startup', 'budget', 'new'],
    createdAt: '2024-01-12',
    lastContact: '2024-01-28'
  },
  {
    id: 'C-005',
    name: 'David Brown',
    email: 'david@example.com',
    phone: '+91 9000000005',
    address: '456, Banjara Hills, Hyderabad, Telangana 500034',
    company: 'Healthcare Solutions',
    website: 'www.healthcaresolutions.com',
    notes: 'Healthcare industry, compliance requirements',
    tags: ['healthcare', 'compliance', 'regulated'],
    createdAt: '2024-01-15',
    lastContact: '2024-01-30'
  }
];

// Dummy user data
export const dummyUser = {
  name: 'Amit Sharma',
  email: 'amit@company.com',
  phone: '+91 9876543210',
  avatar: 'https://via.placeholder.com/150',
  logo: 'https://via.placeholder.com/200x80',
  company: 'Your Company Name',
  address: '123 Business Street, City, State 12345',
  website: 'www.yourcompany.com',
  gstin: '22AAAAA0000A1Z5',
  pan: 'AAAAA0000A'
};

// Calculate invoice totals
export const calculateInvoiceTotals = (lineItems, taxRate = 18, discount = 0) => {
  const subtotal = lineItems.reduce((sum, item) => {
    return sum + (item.qty || 0) * (item.price || 0);
  }, 0);
  
  const tax = (subtotal * (taxRate || 0)) / 100;
  const total = subtotal + tax - (discount || 0);
  
  return {
    subtotal: Math.round(subtotal * 100) / 100,
    tax: Math.round(tax * 100) / 100,
    total: Math.round(total * 100) / 100
  };
};

// Generate unique invoice ID
export const generateInvoiceId = () => {
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.random().toString(36).substr(2, 3).toUpperCase();
  return `INV-${timestamp}-${random}`;
};

// Format currency
export const formatCurrency = (amount, currency = 'INR') => {
  return new Intl.NumberFormat(currency === 'INR' ? 'en-IN' : 'en-US', {
    style: 'currency',
    currency: currency,
  }).format(amount || 0);
};

// Format date
export const formatDate = (dateString) => {
  if (!dateString) return 'Not set';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

// Get status class for styling
export const getStatusClass = (status) => {
  switch (status?.toLowerCase()) {
    case 'paid':
      return 'paid';
    case 'pending':
      return 'sent';
    case 'overdue':
      return 'overdue';
    case 'draft':
      return 'draft';
    case 'cancelled':
      return 'cancelled';
    default:
      return 'draft';
  }
};

// Priority management
export const PRIORITY_LEVELS = {
  HIGH: 'high',
  MEDIUM: 'medium',
  LOW: 'low'
};

export const getPriorityColor = (priority) => {
  switch(priority) {
    case PRIORITY_LEVELS.HIGH: return '#dc3545';
    case PRIORITY_LEVELS.MEDIUM: return '#ffc107';
    case PRIORITY_LEVELS.LOW: return '#28a745';
    default: return '#6c757d';
  }
};

export const getPriorityIcon = (priority) => {
  switch(priority) {
    case PRIORITY_LEVELS.HIGH: return '🔴';
    case PRIORITY_LEVELS.MEDIUM: return '🟡';
    case PRIORITY_LEVELS.LOW: return '🟢';
    default: return '⚪';
  }
};

export const getPriorityLabel = (priority) => {
  switch(priority) {
    case PRIORITY_LEVELS.HIGH: return 'High Priority';
    case PRIORITY_LEVELS.MEDIUM: return 'Medium Priority';
    case PRIORITY_LEVELS.LOW: return 'Low Priority';
    default: return 'No Priority';
  }
};

// Tag management
export const COMMON_TAGS = [
  'web-development',
  'mobile-app',
  'design',
  'consulting',
  'premium-client',
  'urgent',
  'startup',
  'enterprise',
  'healthcare',
  'finance',
  'education',
  'ecommerce',
  'saas',
  'api-integration',
  'maintenance',
  'support'
];

export const getTagColor = (tag) => {
  const colors = [
    '#e3f2fd', '#f3e5f5', '#e8f5e8', '#fff3e0',
    '#fce4ec', '#f1f8e9', '#e0f2f1', '#fafafa'
  ];
  const index = tag.length % colors.length;
  return colors[index];
};

// Activity tracking
export const ACTIVITY_TYPES = {
  CREATED: 'created',
  UPDATED: 'updated',
  SENT: 'sent',
  PAID: 'paid',
  OVERDUE: 'overdue',
  FOLLOWUP: 'followup',
  STAGE_CHANGED: 'stage_changed',
  ASSIGNED: 'assigned',
  TAGGED: 'tagged'
};

export const getActivityIcon = (type) => {
  switch(type) {
    case ACTIVITY_TYPES.CREATED: return '📝';
    case ACTIVITY_TYPES.UPDATED: return '✏️';
    case ACTIVITY_TYPES.SENT: return '📤';
    case ACTIVITY_TYPES.PAID: return '💰';
    case ACTIVITY_TYPES.OVERDUE: return '⚠️';
    case ACTIVITY_TYPES.FOLLOWUP: return '📞';
    case ACTIVITY_TYPES.STAGE_CHANGED: return '🔄';
    case ACTIVITY_TYPES.ASSIGNED: return '👤';
    case ACTIVITY_TYPES.TAGGED: return '🏷️';
    default: return '📋';
  }
};

export const getActivityDescription = (type, data = {}) => {
  switch(type) {
    case ACTIVITY_TYPES.CREATED:
      return 'Invoice created';
    case ACTIVITY_TYPES.UPDATED:
      return 'Invoice updated';
    case ACTIVITY_TYPES.SENT:
      return 'Invoice sent to client';
    case ACTIVITY_TYPES.PAID:
      return 'Payment received';
    case ACTIVITY_TYPES.OVERDUE:
      return 'Invoice overdue';
    case ACTIVITY_TYPES.FOLLOWUP:
      return `Follow up call made${data.notes ? `: ${data.notes}` : ''}`;
    case ACTIVITY_TYPES.STAGE_CHANGED:
      return `Stage changed to ${data.newStage}`;
    case ACTIVITY_TYPES.ASSIGNED:
      return `Assigned to ${data.assignee}`;
    case ACTIVITY_TYPES.TAGGED:
      return `Tags updated: ${data.tags?.join(', ')}`;
    default:
      return 'Activity logged';
  }
};

// Task management
export const TASK_STATUS = {
  PENDING: 'pending',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  OVERDUE: 'overdue',
  CANCELLED: 'cancelled'
};

export const TASK_TYPES = {
  FOLLOW_UP: 'Follow up',
  PAYMENT_REMINDER: 'Payment reminder',
  DEMO_CALL: 'Demo call',
  PROPOSAL: 'Proposal',
  CONTRACT: 'Contract',
  DELIVERY: 'Delivery',
  SUPPORT: 'Support'
};

export const getTaskStatusColor = (status) => {
  switch(status) {
    case TASK_STATUS.COMPLETED: return '#28a745';
    case TASK_STATUS.IN_PROGRESS: return '#007bff';
    case TASK_STATUS.PENDING: return '#ffc107';
    case TASK_STATUS.OVERDUE: return '#dc3545';
    case TASK_STATUS.CANCELLED: return '#6c757d';
    default: return '#6c757d';
  }
};

// File management
export const FILE_TYPES = {
  PDF: 'pdf',
  DOC: 'doc',
  DOCX: 'docx',
  XLS: 'xls',
  XLSX: 'xlsx',
  IMAGE: 'image',
  ZIP: 'zip',
  OTHER: 'other'
};

export const getFileIcon = (fileName) => {
  const extension = fileName.split('.').pop()?.toLowerCase();
  switch(extension) {
    case 'pdf': return '📄';
    case 'doc':
    case 'docx': return '📝';
    case 'xls':
    case 'xlsx': return '📊';
    case 'jpg':
    case 'jpeg':
    case 'png':
    case 'gif': return '🖼️';
    case 'zip':
    case 'rar': return '📦';
    default: return '📎';
  }
};

export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// Payment processing
export const PAYMENT_METHODS = {
  BANK_TRANSFER: 'Bank Transfer',
  CARD: 'Credit/Debit Card',
  UPI: 'UPI',
  CHEQUE: 'Cheque',
  CASH: 'Cash',
  PAYPAL: 'PayPal',
  STRIPE: 'Stripe',
  RAZORPAY: 'Razorpay'
};

export const PAYMENT_STATUS = {
  PENDING: 'pending',
  COMPLETED: 'completed',
  FAILED: 'failed',
  REFUNDED: 'refunded',
  CANCELLED: 'cancelled'
};

export const getPaymentStatusColor = (status) => {
  switch(status) {
    case PAYMENT_STATUS.COMPLETED: return '#28a745';
    case PAYMENT_STATUS.PENDING: return '#ffc107';
    case PAYMENT_STATUS.FAILED: return '#dc3545';
    case PAYMENT_STATUS.REFUNDED: return '#6f42c1';
    case PAYMENT_STATUS.CANCELLED: return '#6c757d';
    default: return '#6c757d';
  }
};

// AI Insights calculations
export const calculatePaymentProbability = (invoice) => {
  let probability = 70; // Base probability
  
  // Adjust based on client history
  if (invoice.clientHistory?.paymentOnTime > 0.8) probability += 15;
  if (invoice.clientHistory?.paymentOnTime < 0.5) probability -= 20;
  
  // Adjust based on amount
  if (invoice.total > 10000) probability -= 10;
  if (invoice.total < 1000) probability += 5;
  
  // Adjust based on days overdue
  if (invoice.status === 'Overdue') {
    const daysOverdue = Math.floor((new Date() - new Date(invoice.dueDate)) / (1000 * 60 * 60 * 24));
    probability -= Math.min(daysOverdue * 2, 30);
  }
  
  // Adjust based on priority
  if (invoice.priority === 'high') probability += 5;
  if (invoice.priority === 'low') probability -= 5;
  
  return Math.max(0, Math.min(100, probability));
};

export const calculateRiskLevel = (invoice) => {
  const probability = calculatePaymentProbability(invoice);
  
  if (probability >= 80) return 'low';
  if (probability >= 50) return 'medium';
  return 'high';
};

export const generateSuggestedActions = (invoice) => {
  const actions = [];
  const probability = calculatePaymentProbability(invoice);
  
  if (invoice.status === 'Overdue') {
    actions.push('Send urgent payment reminder');
    actions.push('Schedule follow-up call');
  }
  
  if (probability < 50) {
    actions.push('Offer payment plan');
    actions.push('Send legal notice');
  }
  
  if (invoice.stage === 'Initial Contact') {
    actions.push('Schedule discovery call');
    actions.push('Send proposal');
  }
  
  if (invoice.stage === 'Discussions') {
    actions.push('Send case studies');
    actions.push('Schedule demo');
  }
  
  if (actions.length === 0) {
    actions.push('Send thank you email');
    actions.push('Request testimonials');
  }
  
  return actions.slice(0, 3); // Return max 3 actions
};

// Pipeline management
export const PIPELINES = {
  SALES: 'Sales Pipeline',
  SERVICE: 'Service Pipeline',
  SUPPORT: 'Support Pipeline',
  CUSTOM: 'Custom Pipeline'
};

export const SALES_STAGES = [
  'Initial Contact',
  'Qualification',
  'Proposal',
  'Negotiation',
  'Closed - Won',
  'Closed - Lost'
];

export const SERVICE_STAGES = [
  'Request Received',
  'In Progress',
  'Review',
  'Completed',
  'Billed'
];

export const getPipelineStages = (pipeline) => {
  switch(pipeline) {
    case PIPELINES.SALES: return SALES_STAGES;
    case PIPELINES.SERVICE: return SERVICE_STAGES;
    default: return SALES_STAGES;
  }
};

// Validation functions
export const validateInvoice = (invoice) => {
  const errors = [];
  
  if (!invoice.clientName) errors.push('Client name is required');
  if (!invoice.date) errors.push('Invoice date is required');
  if (!invoice.dueDate) errors.push('Due date is required');
  if (!invoice.lineItems || invoice.lineItems.length === 0) {
    errors.push('At least one line item is required');
  }
  
  invoice.lineItems?.forEach((item, index) => {
    if (!item.desc) errors.push(`Line item ${index + 1}: Description is required`);
    if (!item.qty || item.qty <= 0) errors.push(`Line item ${index + 1}: Quantity must be greater than 0`);
    if (!item.price || item.price < 0) errors.push(`Line item ${index + 1}: Price must be 0 or greater`);
  });
  
  return errors;
};

export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePhone = (phone) => {
  const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
};

// Date utilities
export const addDays = (date, days) => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

export const isOverdue = (dueDate) => {
  return new Date(dueDate) < new Date();
};

export const getDaysUntilDue = (dueDate) => {
  const today = new Date();
  const due = new Date(dueDate);
  const diffTime = due - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

// Invoice templates
export const invoiceTemplates = [
  {
    id: 'default',
    name: 'Default',
    description: 'Classic professional template',
    preview: '📄'
  },
  {
    id: 'modern',
    name: 'Modern',
    description: 'Clean and contemporary design',
    preview: '✨'
  },
  {
    id: 'minimal',
    name: 'Minimal',
    description: 'Simple and elegant layout',
    preview: '⚪'
  },
  {
    id: 'professional',
    name: 'Professional',
    description: 'Corporate style template',
    preview: '💼'
  }
];

// Export utilities
export const exportToCSV = (invoices) => {
  const headers = [
    'Invoice ID',
    'Client Name',
    'Date',
    'Due Date',
    'Amount',
    'Status',
    'Pipeline',
    'Stage',
    'Assigned To',
    'Priority'
  ];
  
  const csvContent = [
    headers.join(','),
    ...invoices.map(invoice => [
      invoice.id,
      invoice.clientName,
      invoice.date,
      invoice.dueDate,
      invoice.total,
      invoice.status,
      invoice.pipeline,
      invoice.stage,
      invoice.assignedTo,
      invoice.priority
    ].join(','))
  ].join('\n');
  
  const blob = new Blob([csvContent], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `invoices-${new Date().toISOString().split('T')[0]}.csv`;
  a.click();
  window.URL.revokeObjectURL(url);
};

export const exportToPDF = (invoice) => {
  // This would integrate with a PDF library like jsPDF
  console.log('Exporting to PDF:', invoice);
  alert('PDF export functionality would be implemented here');
};

// Search and filter utilities
export const searchInvoices = (invoices, searchTerm) => {
  if (!searchTerm) return invoices;
  
  const term = searchTerm.toLowerCase();
  return invoices.filter(invoice => 
    invoice.id.toLowerCase().includes(term) ||
    invoice.clientName.toLowerCase().includes(term) ||
    invoice.clientEmail.toLowerCase().includes(term) ||
    invoice.assignedTo?.toLowerCase().includes(term) ||
    invoice.tags?.some(tag => tag.toLowerCase().includes(term))
  );
};

export const filterInvoices = (invoices, filters) => {
  return invoices.filter(invoice => {
    if (filters.status && filters.status !== 'All' && invoice.status !== filters.status) return false;
    if (filters.pipeline && filters.pipeline !== 'All' && invoice.pipeline !== filters.pipeline) return false;
    if (filters.stage && filters.stage !== 'All' && invoice.stage !== filters.stage) return false;
    if (filters.assignee && filters.assignee !== 'All' && invoice.assignedTo !== filters.assignee) return false;
    if (filters.priority && filters.priority !== 'All' && invoice.priority !== filters.priority) return false;
    if (filters.year && filters.year !== 'All') {
      const invoiceYear = new Date(invoice.date).getFullYear().toString();
      if (invoiceYear !== filters.year) return false;
    }
    return true;
  });
};

// Statistics calculations
export const calculateStats = (invoices) => {
  const total = invoices.length;
  const amount = invoices.reduce((sum, inv) => sum + inv.total, 0);
  const paid = invoices.filter(inv => inv.status === 'Paid').length;
  const pending = invoices.filter(inv => inv.status === 'Pending').length;
  const overdue = invoices.filter(inv => inv.status === 'Overdue').length;
  const highPriority = invoices.filter(inv => inv.priority === 'high').length;
  const thisMonth = invoices.filter(inv => {
    const invoiceDate = new Date(inv.date);
    const now = new Date();
    return invoiceDate.getMonth() === now.getMonth() && 
           invoiceDate.getFullYear() === now.getFullYear();
  }).length;
  
  return {
    total,
    amount,
    paid,
    pending,
    overdue,
    highPriority,
    thisMonth,
    avgPaymentTime: 25, // This would be calculated from actual data
    conversionRate: Math.round((paid / total) * 100) || 0,
    recurringRevenue: invoices.filter(inv => inv.recurring).reduce((sum, inv) => sum + inv.total, 0)
  };
}; 