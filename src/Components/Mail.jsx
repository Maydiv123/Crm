import React, { useState, useEffect, useRef } from 'react';
import './Mail.css';

// Fallback data in case backend is not running
const fallbackInbox = [
  {
    id: 1,
    from_email: 'support@crm.com',
    from_name: 'CRM Support Team',
    subject: 'Welcome to CRM - Getting Started Guide',
    message: 'Hi there! Welcome to our CRM system. We\'re excited to have you on board. This email contains important information to help you get started with our platform. You\'ll find tutorials, best practices, and tips to make the most of your CRM experience. If you have any questions, feel free to reach out to our support team.',
    created_at: '2024-07-19 14:00',
    is_read: false,
    has_attachment: true,
    priority: 'high',
    is_starred: true
  },
  {
    id: 2,
    from_email: 'info@company.com',
    from_name: 'Company Finance',
    subject: 'Your Invoice #INV-2024-001',
    message: 'Dear valued customer, Please find attached your invoice for the services provided. The total amount due is $1,250.00. Payment is due within 30 days. You can pay online through our secure payment portal or contact our billing department for alternative payment methods.',
    created_at: '2024-07-18 10:30',
    is_read: true,
    has_attachment: true,
    priority: 'normal',
    is_starred: false
  },
  {
    id: 3,
    from_email: 'marketing@techcorp.com',
    from_name: 'TechCorp Marketing',
    subject: 'New Product Launch - Exclusive Early Access',
    message: 'We\'re thrilled to announce our latest product launch! As a valued customer, you get exclusive early access to our new AI-powered analytics dashboard. This revolutionary tool will transform how you analyze your business data and make informed decisions.',
    created_at: '2024-07-17 09:15',
    is_read: false,
    has_attachment: false,
    priority: 'normal',
    is_starred: false
  },
  {
    id: 4,
    from_email: 'hr@company.com',
    from_name: 'Human Resources',
    subject: 'Monthly Team Meeting - July 2024',
    message: 'Hello team! This is a reminder about our monthly team meeting scheduled for Friday, July 26th at 2:00 PM. We\'ll be discussing Q3 goals, upcoming projects, and team updates. Please prepare your updates and join us in the conference room.',
    created_at: '2024-07-16 16:45',
    is_read: true,
    has_attachment: false,
    priority: 'normal',
    is_starred: false
  },
  {
    id: 5,
    from_email: 'alerts@security.com',
    from_name: 'Security Alerts',
    subject: 'Security Update Required - Action Needed',
    message: 'IMPORTANT: We detected unusual login activity on your account. For your security, we recommend changing your password immediately. Click the link below to reset your password securely. If you didn\'t attempt this login, please contact our security team.',
    created_at: '2024-07-15 11:20',
    is_read: false,
    has_attachment: false,
    priority: 'high',
    is_starred: true
  }
];

const fallbackSent = [
  {
    id: 6,
    to_email: 'john@example.com',
    to_name: 'John Smith',
    from_email: 'admin@crm.com',
    from_name: 'Admin User',
    subject: 'Project Update - Q3 Goals',
    message: 'Hi John, I wanted to provide you with an update on our Q3 project goals. We\'ve made significant progress on the CRM integration and are on track to meet our deadlines. Let me know if you need any additional information.',
    created_at: '2024-07-19 14:00',
    is_read: true,
    has_attachment: false,
    priority: 'normal',
    is_starred: false
  },
  {
    id: 7,
    to_email: 'jane@example.com',
    to_name: 'Jane Doe',
    from_email: 'admin@crm.com',
    from_name: 'Admin User',
    subject: 'Invoice Sent - Payment Confirmation',
    message: 'Hi Jane, I\'ve sent the invoice for our recent project. The total amount is $2,500.00. Please review and let me know if you have any questions. Payment is due within 30 days.',
    created_at: '2024-07-18 10:30',
    is_read: true,
    has_attachment: false,
    priority: 'normal',
    is_starred: false
  }
];

const fallbackTrash = [
  {
    id: 8,
    from_email: 'old@company.com',
    from_name: 'Old Company',
    to_email: 'admin@crm.com',
    to_name: 'Admin User',
    subject: 'Old Project Details',
    message: 'This is an old email that was deleted. It contains outdated project information that is no longer relevant.',
    created_at: '2024-07-15 09:00',
    deleted_at: '2024-07-20 14:30',
    is_read: true,
    has_attachment: false,
    priority: 'normal',
    is_starred: false
  },
  {
    id: 9,
    from_email: 'spam@example.com',
    from_name: 'Spam Sender',
    to_email: 'admin@crm.com',
    to_name: 'Admin User',
    subject: 'Spam Email - Deleted',
    message: 'This was a spam email that was deleted. It contained unwanted promotional content.',
    created_at: '2024-07-10 11:20',
    deleted_at: '2024-07-18 16:45',
    is_read: false,
    has_attachment: false,
    priority: 'normal',
    is_starred: false
  }
];

export default function Mail() {
  const [tab, setTab] = useState('inbox');
  const [showCompose, setShowCompose] = useState(false);
  const [selectedEmail, setSelectedEmail] = useState(null);
  const [form, setForm] = useState({ to: '', subject: '', message: '' });
  const [selectedRecipients, setSelectedRecipients] = useState([]);
  const [showBulkMode, setShowBulkMode] = useState(false);
  const [inbox, setInbox] = useState(fallbackInbox);
  const [sent, setSent] = useState(fallbackSent);
  const [trash, setTrash] = useState(fallbackTrash);
  const [search, setSearch] = useState('');
  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [emailSuggestions, setEmailSuggestions] = useState([]);
  const [allLeadEmails, setAllLeadEmails] = useState([]);
  const [selectedEmails, setSelectedEmails] = useState([]);
  const [showSidebar, setShowSidebar] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showLeadsDropdown, setShowLeadsDropdown] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const suggestionBoxRef = useRef(null);

  // Fetch emails from database
  const fetchEmails = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.log('No token found, using fallback data');
        return;
      }

      const [inboxResponse, sentResponse, trashResponse] = await Promise.all([
        fetch('/api/mail/inbox', {
          headers: { Authorization: `Bearer ${token}` }
        }),
        fetch('/api/mail/sent', {
          headers: { Authorization: `Bearer ${token}` }
        }),
        fetch('/api/mail/trash', {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);

      if (inboxResponse.ok) {
        const inboxData = await inboxResponse.json();
        if (inboxData.emails && inboxData.emails.length > 0) {
          setInbox(inboxData.emails);
        }
      } else {
        console.log('Inbox API failed, using fallback data');
      }

      if (sentResponse.ok) {
        const sentData = await sentResponse.json();
        if (sentData.emails && sentData.emails.length > 0) {
          setSent(sentData.emails);
        }
      } else {
        console.log('Sent API failed, using fallback data');
      }

      if (trashResponse.ok) {
        const trashData = await trashResponse.json();
        if (trashData.emails && trashData.emails.length > 0) {
          setTrash(trashData.emails);
        }
      } else {
        console.log('Trash API failed, using fallback data');
      }
    } catch (err) {
      console.error('Failed to fetch emails:', err);
      console.log('Using fallback data due to error');
    }
  };

  // Fetch all lead emails on mount
  useEffect(() => {
    fetch('/api/leads/emails/public')
      .then(res => res.json())
      .then(data => {
        if (data.emails && data.emails.length > 0) {
          console.log('✅ Real emails loaded from database:', data.emails);
          setAllLeadEmails(data.emails);
        } else {
          console.log('⚠️ No emails found in database');
          setAllLeadEmails([]);
        }
      })
      .catch(err => {
        console.log('❌ API failed, no emails available');
        setAllLeadEmails([]);
      });
  }, []);

  // Fetch emails on mount
  useEffect(() => {
    fetchEmails();
  }, []);

  // Auto-hide success and error messages after 4 seconds
  useEffect(() => {
    if (success || error) {
      const timer = setTimeout(() => {
        setSuccess('');
        setError('');
      }, 4000);
      
      return () => clearTimeout(timer);
    }
  }, [success, error]);



  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showLeadsDropdown && !event.target.closest('.gmail-compose-to-container') && !event.target.closest('.gmail-leads-dropdown')) {
        setShowLeadsDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showLeadsDropdown]);

  // Update suggestions as user types
  useEffect(() => {
    if (form.to) {
      setEmailSuggestions(
        allLeadEmails.filter(email =>
          email.toLowerCase().includes(form.to.toLowerCase()) && email !== form.to
        ).slice(0, 5)
      );
    } else {
      setEmailSuggestions([]);
    }
  }, [form.to, allLeadEmails]);

  const handleSuggestionClick = (email) => {
    setForm({ ...form, to: email });
    setEmailSuggestions([]);
  };

  const handleRecipientToggle = (email) => {
    console.log('handleRecipientToggle called with:', email);
    console.log('showBulkMode:', showBulkMode);
    console.log('current selectedRecipients:', selectedRecipients);
    
    if (showBulkMode) {
      setSelectedRecipients(prev => {
        const isSelected = prev.includes(email);
        const newSelection = isSelected 
          ? prev.filter(e => e !== email)
          : [...prev, email];
        console.log('Email was selected:', isSelected, 'New selection:', newSelection);
        return newSelection;
      });
    } else {
      setForm({ ...form, to: email });
      setShowLeadsDropdown(false);
    }
  };

  const toggleBulkMode = () => {
    console.log('toggleBulkMode called, current showBulkMode:', showBulkMode);
    setShowBulkMode(!showBulkMode);
    setSelectedRecipients([]);
    setForm({ ...form, to: '' });
    console.log('Bulk mode toggled to:', !showBulkMode);
  };

  const handleMinimize = () => {
    setIsMinimized(!isMinimized);
    setIsMaximized(false);
  };

  const handleMaximize = () => {
    setIsMaximized(!isMaximized);
    setIsMinimized(false);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSend = async (e) => {
    e.preventDefault();
    setSending(true);
    setSuccess('');
    setError('');
    
    try {
      // Determine recipients based on mode
      const recipients = showBulkMode ? selectedRecipients : [form.to];
      
      if (showBulkMode && selectedRecipients.length === 0) {
        setError('Please select at least one recipient for bulk mail.');
        setSending(false);
        return;
      }
      
      // Send to each recipient
      const sendPromises = recipients.map(async (recipient) => {
        const response = await fetch('/api/mail/send', {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify({
            to: recipient,
            subject: form.subject,
            message: form.message
          })
        });
        return { recipient, response };
      });
      
      const results = await Promise.all(sendPromises);
      const successfulSends = results.filter(r => r.response.ok);
      const failedSends = results.filter(r => !r.response.ok);
      
      if (successfulSends.length > 0) {
        // Create sent emails for successful sends
        const newSentEmails = successfulSends.map((result, index) => ({
          id: Date.now() + index,
          to_email: result.recipient,
          to_name: result.recipient.split('@')[0],
          from_email: 'admin@crm.com',
          from_name: 'Admin User',
          subject: form.subject,
          message: form.message,
          created_at: new Date().toISOString(),
          is_read: true,
          has_attachment: false,
          priority: 'normal',
          is_starred: false
        }));
        
        setSent(prevSent => [...newSentEmails, ...prevSent]);
        
        if (showBulkMode) {
          setSuccess(`Bulk mail sent successfully! ${successfulSends.length} email(s) sent.`);
        } else {
          setSuccess('Email sent successfully!');
        }
        
        setShowCompose(false);
        setForm({ to: '', subject: '', message: '' });
        setShowLeadsDropdown(false);
        setSelectedRecipients([]);
        setShowBulkMode(false);
        setTab('sent');
      }
      
      if (failedSends.length > 0) {
        setError(`Failed to send ${failedSends.length} email(s). Please try again.`);
      }
      
    } catch (err) {
      console.error('Send error:', err);
      setError('Failed to send email(s). Please try again.');
    }
    
    setSending(false);
  };

  const handleEmailClick = async (email) => {
    setSelectedEmail(email);
    if (!email.is_read) {
      try {
        const response = await fetch(`/api/mail/read/${email.id}`, {
          method: 'PUT',
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        if (response.ok) {
          // Update local state
          if (tab === 'inbox') {
            setInbox(inbox.map(e => e.id === email.id ? { ...e, is_read: true } : e));
          }
        }
      } catch (err) {
        console.error('Failed to mark as read:', err);
        // Update local state anyway for fallback
        if (tab === 'inbox') {
          setInbox(inbox.map(e => e.id === email.id ? { ...e, is_read: true } : e));
        }
      }
    }
  };

  const handleEmailSelect = (emailId) => {
    setSelectedEmails(prev => 
      prev.includes(emailId) 
        ? prev.filter(id => id !== emailId)
        : [...prev, emailId]
    );
  };

  const handleSelectAll = () => {
    const currentEmails = tab === 'inbox' ? filteredInbox : filteredSent;
    if (selectedEmails.length === currentEmails.length) {
      setSelectedEmails([]);
    } else {
      setSelectedEmails(currentEmails.map(email => email.id));
    }
  };

  const toggleStar = async (emailId, e) => {
    e.stopPropagation();
    try {
      const response = await fetch(`/api/mail/star/${emailId}`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      if (response.ok) {
        // Update local state
        if (tab === 'inbox') {
          setInbox(inbox.map(e => e.id === emailId ? { ...e, is_starred: !e.is_starred } : e));
        } else {
          setSent(sent.map(e => e.id === emailId ? { ...e, is_starred: !e.is_starred } : e));
        }
      }
    } catch (err) {
      console.error('Failed to toggle star:', err);
      // Update local state anyway for fallback
      if (tab === 'inbox') {
        setInbox(inbox.map(e => e.id === emailId ? { ...e, is_starred: !e.is_starred } : e));
      } else {
        setSent(sent.map(e => e.id === emailId ? { ...e, is_starred: !e.is_starred } : e));
      }
    }
  };

  // Delete single email
  const handleDeleteEmail = async (emailId) => {
    setDeleting(true);
    setSuccess('');
    setError('');
    
    try {
      if (tab === 'trash') {
        // Permanent delete from trash
        const response = await fetch(`/api/mail/permanent-delete/${emailId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        
        if (response.ok) {
          // Remove from trash
          setTrash(trash.filter(email => email.id !== emailId));
          
          // Clear selection if deleted email was selected
          setSelectedEmails(prev => prev.filter(id => id !== emailId));
          
          // Clear preview if deleted email was being viewed
          if (selectedEmail && selectedEmail.id === emailId) {
            setSelectedEmail(null);
          }
          
          setSuccess('Email permanently deleted!');
        } else {
          const data = await response.json();
          setError(data.message || 'Failed to delete email.');
        }
      } else {
        // Move to trash (inbox/sent)
        const response = await fetch(`/api/mail/delete/${emailId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        
        if (response.ok) {
          // Get the email to be deleted
          let deletedEmail = null;
          if (tab === 'inbox') {
            deletedEmail = inbox.find(email => email.id === emailId);
            setInbox(inbox.filter(email => email.id !== emailId));
          } else if (tab === 'sent') {
            deletedEmail = sent.find(email => email.id === emailId);
            setSent(sent.filter(email => email.id !== emailId));
          }
          
          // Add to trash if email was found
          if (deletedEmail) {
            const trashEmail = {
              ...deletedEmail,
              deleted_at: new Date().toISOString()
            };
            setTrash(prevTrash => [trashEmail, ...prevTrash]);
          }
          
          // Clear selection if deleted email was selected
          setSelectedEmails(prev => prev.filter(id => id !== emailId));
          
          // Clear preview if deleted email was being viewed
          if (selectedEmail && selectedEmail.id === emailId) {
            setSelectedEmail(null);
          }
          
          setSuccess('Email moved to trash!');
        } else {
          const data = await response.json();
          setError(data.message || 'Failed to delete email.');
        }
      }
    } catch (err) {
      setError('Failed to delete email. Please try again.');
      
      if (tab === 'trash') {
        // Even if API fails, remove from frontend
        setTrash(trash.filter(email => email.id !== emailId));
        setSelectedEmails(prev => prev.filter(id => id !== emailId));
        if (selectedEmail && selectedEmail.id === emailId) {
          setSelectedEmail(null);
        }
        setSuccess('Email permanently deleted!');
      } else {
        // Even if API fails, move to trash for better UX
        let deletedEmail = null;
        if (tab === 'inbox') {
          deletedEmail = inbox.find(email => email.id === emailId);
          setInbox(inbox.filter(email => email.id !== emailId));
        } else if (tab === 'sent') {
          deletedEmail = sent.find(email => email.id === emailId);
          setSent(sent.filter(email => email.id !== emailId));
        }
        
        if (deletedEmail) {
          const trashEmail = {
            ...deletedEmail,
            deleted_at: new Date().toISOString()
          };
          setTrash(prevTrash => [trashEmail, ...prevTrash]);
        }
        
        // Clear selection if deleted email was selected
        setSelectedEmails(prev => prev.filter(id => id !== emailId));
        
        // Clear preview if deleted email was being viewed
        if (selectedEmail && selectedEmail.id === emailId) {
          setSelectedEmail(null);
        }
        
        setSuccess('Email moved to trash!');
      }
    }
    
    setDeleting(false);
  };

  // Bulk delete selected emails
  const handleBulkDelete = async () => {
    if (selectedEmails.length === 0) {
      setError('Please select emails to delete.');
      return;
    }

    setDeleting(true);
    setSuccess('');
    setError('');
    
    try {
      const response = await fetch('/api/mail/bulk-delete', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          emailIds: selectedEmails,
          type: tab // 'inbox' or 'sent'
        })
      });
      
      if (response.ok) {
        if (tab === 'trash') {
          // Permanent delete from trash
          setTrash(trash.filter(email => !selectedEmails.includes(email.id)));
          setSelectedEmails([]);
          if (selectedEmail && selectedEmails.includes(selectedEmail.id)) {
            setSelectedEmail(null);
          }
          setSuccess(`${selectedEmails.length} email(s) permanently deleted!`);
        } else {
          // Get emails to be deleted and move to trash
          let deletedEmails = [];
          if (tab === 'inbox') {
            deletedEmails = inbox.filter(email => selectedEmails.includes(email.id));
            setInbox(inbox.filter(email => !selectedEmails.includes(email.id)));
          } else if (tab === 'sent') {
            deletedEmails = sent.filter(email => selectedEmails.includes(email.id));
            setSent(sent.filter(email => !selectedEmails.includes(email.id)));
          }
          
          // Add to trash
          const trashEmails = deletedEmails.map(email => ({
            ...email,
            deleted_at: new Date().toISOString()
          }));
          setTrash(prevTrash => [...trashEmails, ...prevTrash]);
          
          // Clear selection
          setSelectedEmails([]);
          
          // Clear preview if deleted email was being viewed
          if (selectedEmail && selectedEmails.includes(selectedEmail.id)) {
            setSelectedEmail(null);
          }
          
          setSuccess(`${selectedEmails.length} email(s) moved to trash!`);
        }
      } else {
        const data = await response.json();
        setError(data.message || 'Failed to delete emails.');
      }
    } catch (err) {
      setError('Failed to delete emails. Please try again.');
      
      if (tab === 'trash') {
        // Even if API fails, remove from frontend
        setTrash(trash.filter(email => !selectedEmails.includes(email.id)));
        setSelectedEmails([]);
        if (selectedEmail && selectedEmails.includes(selectedEmail.id)) {
          setSelectedEmail(null);
        }
        setSuccess(`${selectedEmails.length} email(s) permanently deleted!`);
      } else {
        // Even if API fails, move to trash for better UX
        let deletedEmails = [];
        if (tab === 'inbox') {
          deletedEmails = inbox.filter(email => selectedEmails.includes(email.id));
          setInbox(inbox.filter(email => !selectedEmails.includes(email.id)));
        } else if (tab === 'sent') {
          deletedEmails = sent.filter(email => selectedEmails.includes(email.id));
          setSent(sent.filter(email => !selectedEmails.includes(email.id)));
        }
        
        // Add to trash
        const trashEmails = deletedEmails.map(email => ({
          ...email,
          deleted_at: new Date().toISOString()
        }));
        setTrash(prevTrash => [...trashEmails, ...prevTrash]);
        
        // Clear selection
        setSelectedEmails([]);
        
        // Clear preview if deleted email was being viewed
        if (selectedEmail && selectedEmails.includes(selectedEmail.id)) {
          setSelectedEmail(null);
        }
        
        setSuccess(`${selectedEmails.length} email(s) moved to trash!`);
      }
    }
    
    setDeleting(false);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);
    
    if (diffInHours < 24) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffInHours < 48) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString();
    }
  };

  const getInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  // Filtered lists
  const filteredInbox = inbox.filter(
    (mail) =>
      mail.from_email.toLowerCase().includes(search.toLowerCase()) ||
      mail.from_name.toLowerCase().includes(search.toLowerCase()) ||
      mail.subject.toLowerCase().includes(search.toLowerCase())
  );
  const filteredSent = sent.filter(
    (mail) =>
      mail.to_email.toLowerCase().includes(search.toLowerCase()) ||
      mail.to_name.toLowerCase().includes(search.toLowerCase()) ||
      mail.subject.toLowerCase().includes(search.toLowerCase())
  );
  const filteredTrash = trash.filter(
    (mail) =>
      (mail.from_email && mail.from_email.toLowerCase().includes(search.toLowerCase())) ||
      (mail.from_name && mail.from_name.toLowerCase().includes(search.toLowerCase())) ||
      (mail.to_email && mail.to_email.toLowerCase().includes(search.toLowerCase())) ||
      (mail.to_name && mail.to_name.toLowerCase().includes(search.toLowerCase())) ||
      mail.subject.toLowerCase().includes(search.toLowerCase())
  );

  const currentEmails = tab === 'inbox' ? filteredInbox : tab === 'sent' ? filteredSent : filteredTrash;

  return (
    <div className="gmail-container">
      {/* Header */}
      <div className="gmail-header">
        <div className="gmail-header-left">
          <button 
            className="gmail-menu-btn"
            onClick={() => setShowSidebar(!showSidebar)}
          >
            <svg width="24" height="24" viewBox="0 0 24 24">
              <path fill="currentColor" d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/>
            </svg>
          </button>
          <div className="gmail-logo">
            <svg width="40" height="40" viewBox="0 0 24 24">
              <path fill="#4285f4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34a853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#fbbc05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#ea4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            <span>Gmail</span>
          </div>
          <div className="gmail-search">
            <div className="gmail-search-box">
              <svg className="gmail-search-icon" width="20" height="20" viewBox="0 0 24 24">
                <path fill="currentColor" d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
              </svg>
              <input
                type="text"
                placeholder="Search in mail"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
              <svg className="gmail-search-options" width="20" height="20" viewBox="0 0 24 24">
                <path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
            </div>
          </div>
        </div>
        <div className="gmail-header-right">
          
         
          <button className="gmail-compose-btn" onClick={() => setShowCompose(true)}>
            <svg width="20" height="20" viewBox="0 0 24 24">
              <path fill="currentColor" d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
            </svg>
            <span>Compose</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="gmail-content">
        {/* Sidebar */}
        {showSidebar && (
          <div className="gmail-sidebar">
            <div className={`gmail-sidebar-item ${tab === 'inbox' ? 'active' : ''}`} onClick={() => setTab('inbox')}>
              <svg width="20" height="20" viewBox="0 0 24 24">
                <path fill="currentColor" d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
              </svg>
              <span>Inbox</span>
              <span className="gmail-count">{inbox.filter(e => !e.is_read).length}</span>
            </div>
            <div className={`gmail-sidebar-item ${tab === 'sent' ? 'active' : ''}`} onClick={() => setTab('sent')}>
              <svg width="20" height="20" viewBox="0 0 24 24">
                <path fill="currentColor" d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
              </svg>
              <span>Sent</span>
            </div>
            <div className={`gmail-sidebar-item ${tab === 'trash' ? 'active' : ''}`} onClick={() => setTab('trash')}>
              <svg width="20" height="20" viewBox="0 0 24 24">
                <path fill="currentColor" d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
              </svg>
              <span>Trash</span>
              <span className="gmail-count">{trash.length}</span>
            </div>
          </div>
        )}

        {/* Email List */}
        <div className="gmail-email-list">
          <div className="gmail-list-header">
            <div className="gmail-list-header-left">
              <input
                type="checkbox"
                checked={selectedEmails.length === currentEmails.length && currentEmails.length > 0}
                onChange={handleSelectAll}
              />
             
              {selectedEmails.length > 0 && (
                <button 
                  className="gmail-delete-btn"
                  onClick={handleBulkDelete}
                  disabled={deleting}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
                  </svg>
                  {deleting ? 'Deleting...' : `Delete (${selectedEmails.length})`}
                </button>
              )}
             
            </div>
            <div className="gmail-list-header-right">
              <span>{currentEmails.length} of {tab === 'inbox' ? inbox.length : tab === 'sent' ? sent.length : trash.length}</span>
            </div>
          </div>

          <div className="gmail-emails">
            {currentEmails.length === 0 ? (
              <div className="gmail-empty">
                <svg width="64" height="64" viewBox="0 0 24 24">
                  <path fill="#dadce0" d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                </svg>
                <span>No messages found</span>
              </div>
            ) : (
              currentEmails.map((email) => (
                <div
                  key={email.id}
                  className={`gmail-email-item ${selectedEmail?.id === email.id ? 'selected' : ''} ${!email.is_read ? 'unread' : ''}`}
                  onClick={() => handleEmailClick(email)}
                >
                  <div className="gmail-email-checkbox">
                    <input
                      type="checkbox"
                      checked={selectedEmails.includes(email.id)}
                      onChange={(e) => {
                        e.stopPropagation();
                        handleEmailSelect(email.id);
                      }}
                    />
                  </div>
                  <button 
                    className={`gmail-star-btn ${email.is_starred ? 'starred' : ''}`}
                    onClick={(e) => toggleStar(email.id, e)}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24">
                      <path fill="currentColor" d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
                    </svg>
                  </button>
                  <div className="gmail-email-avatar">
                    {getInitials(tab === 'inbox' ? email.from_name : tab === 'sent' ? email.to_name : (email.from_name || email.to_name))}
                  </div>
                  <div className="gmail-email-content">
                    <div className="gmail-email-sender">
                      {tab === 'inbox' ? email.from_name : tab === 'sent' ? email.to_name : (email.from_name || email.to_name)}
                    </div>
                    <div className="gmail-email-subject">
                      {email.subject}
                      {email.has_attachment && (
                        <svg className="gmail-attachment" width="16" height="16" viewBox="0 0 24 24">
                          <path fill="currentColor" d="M16.5 6v11.5c0 2.21-1.79 4-4 4s-4-1.79-4-4V5c0-1.38 1.12-2.5 2.5-2.5s2.5 1.12 2.5 2.5v10.5c0 .55-.45 1-1 1s-1-.45-1-1V6H10v9.5c0 1.38 1.12 2.5 2.5 2.5s2.5-1.12 2.5-2.5V5c0-2.21-1.79-4-4-4S7 2.79 7 5v12.5c0 3.04 2.46 5.5 5.5 5.5s5.5-2.46 5.5-5.5V6h-1.5z"/>
                        </svg>
                      )}
                      {email.priority === 'high' && (
                        <svg className="gmail-priority" width="16" height="16" viewBox="0 0 24 24">
                          <path fill="#ea4335" d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                        </svg>
                      )}
                    </div>
                    <div className="gmail-email-preview">
                      {email.message.substring(0, 100)}...
                    </div>
                  </div>
                  <div className="gmail-email-date">
                    {formatDate(email.created_at)}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Email Preview */}
        {selectedEmail && (
          <div className="gmail-email-preview-panel">
            <div className="gmail-email-preview-header">
              <div className="gmail-email-preview-subject">
                {selectedEmail.subject}
              </div>
              <div className="gmail-email-preview-actions">
                <button className="gmail-action-btn">
                  <svg width="20" height="20" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                  </svg>
                </button>
                <button 
                  className="gmail-action-btn"
                  onClick={() => handleDeleteEmail(selectedEmail.id)}
                  disabled={deleting}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24">
                    <path fill="currentColor" d={tab === 'trash' ? "M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" : "M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"}/>
                  </svg>
                </button>
                <button 
                  className="gmail-close-preview"
                  onClick={() => setSelectedEmail(null)}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                  </svg>
                </button>
              </div>
            </div>
            <div className="gmail-email-preview-body">
              <div className="gmail-email-preview-info">
                <div className="gmail-email-preview-from">
                  <strong>From:</strong> {selectedEmail.from_name} &lt;{selectedEmail.from_email}&gt;
                </div>
                <div className="gmail-email-preview-date">
                  <strong>Date:</strong> {formatDate(selectedEmail.created_at)}
                </div>
              </div>
              <div className="gmail-email-preview-message">
                {selectedEmail.message}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Compose Modal */}
      {showCompose && (
        <div className={`gmail-compose-modal ${isMinimized ? 'minimized' : ''} ${isMaximized ? 'maximized' : ''}`}>
          <div className="gmail-compose-header">
            <div className="gmail-compose-title" onClick={isMinimized ? handleMinimize : undefined}>
              <svg width="20" height="20" viewBox="0 0 24 24" style={{ marginRight: '8px' }}>
                <path fill="currentColor" d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
              </svg>
              <span>New Message</span>
            </div>
            <div className="gmail-compose-actions">
              <button 
                className="gmail-compose-minimize"
                title="Minimize"
                onClick={handleMinimize}
              >
                <svg width="16" height="16" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M19 13H5v-2h14v2z"/>
                </svg>
              </button>
              <button 
                className="gmail-compose-maximize"
                title={isMaximized ? "Restore" : "Maximize"}
                onClick={handleMaximize}
              >
                <svg width="16" height="16" viewBox="0 0 24 24">
                  <path fill="currentColor" d={isMaximized ? "M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z" : "M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"}/>
                </svg>
              </button>
              <button 
                className="gmail-compose-close"
                title="Close"
                onClick={() => {
                  setShowCompose(false);
                  setShowLeadsDropdown(false);
                  setForm({ to: '', subject: '', message: '' });
                  setSelectedRecipients([]);
                  setShowBulkMode(false);
                  setIsMinimized(false);
                  setIsMaximized(false);
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                </svg>
              </button>
            </div>
          </div>
          <form onSubmit={handleSend}>
            <div className="gmail-compose-field">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                <label style={{ fontSize: '14px', fontWeight: '500', color: '#202124' }}>To:</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '12px', color: '#5f6368' }}>
                    {showBulkMode ? 'Bulk Mode' : 'Single Mode'}
                  </span>
                  <button 
                    type="button"
                    onClick={toggleBulkMode}
                    style={{
                      background: showBulkMode ? '#34a853' : '#1a73e8',
                      color: 'white',
                      border: 'none',
                      borderRadius: '20px',
                      padding: '6px 12px',
                      fontSize: '12px',
                      fontWeight: '500',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.transform = 'translateY(-1px)';
                      e.target.style.boxShadow = '0 2px 6px rgba(0,0,0,0.15)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.transform = 'translateY(0)';
                      e.target.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)';
                    }}
                  >
                    {showBulkMode ? (
                      <>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                        </svg>
                        Single Mode
                      </>
                    ) : (
                      <>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
                        </svg>
                        Bulk Mode
                      </>
                    )}
                  </button>
                </div>
              </div>
              
              {showBulkMode ? (
                <div>
                  <div style={{ 
                    border: '1px solid #e8eaed', 
                    borderRadius: '8px', 
                    padding: '12px', 
                    minHeight: '48px',
                    background: '#f8f9fa',
                    transition: 'all 0.2s ease'
                  }}>
                    {selectedRecipients.length > 0 ? (
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                        {selectedRecipients.map((email, index) => (
                          <span key={index} style={{
                            background: 'linear-gradient(135deg, #1a73e8, #4285f4)',
                            color: 'white',
                            padding: '6px 12px',
                            borderRadius: '20px',
                            fontSize: '13px',
                            fontWeight: '500',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            boxShadow: '0 2px 4px rgba(26, 115, 232, 0.2)',
                            transition: 'all 0.2s ease'
                          }}>
                            {email}
                            <button 
                              type="button"
                              onClick={() => handleRecipientToggle(email)}
                              style={{
                                background: 'rgba(255, 255, 255, 0.2)',
                                border: 'none',
                                color: 'white',
                                cursor: 'pointer',
                                fontSize: '16px',
                                borderRadius: '50%',
                                width: '20px',
                                height: '20px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                transition: 'all 0.2s ease'
                              }}
                              onMouseEnter={(e) => {
                                e.target.style.background = 'rgba(255, 255, 255, 0.3)';
                                e.target.style.transform = 'scale(1.1)';
                              }}
                              onMouseLeave={(e) => {
                                e.target.style.background = 'rgba(255, 255, 255, 0.2)';
                                e.target.style.transform = 'scale(1)';
                              }}
                            >
                              ×
                            </button>
                          </span>
                        ))}
                      </div>
                    ) : (
                      <span style={{ color: '#5f6368', fontSize: '14px' }}>
                        Select recipients from dropdown below
                      </span>
                    )}
                  </div>
                  <div style={{ 
                    marginTop: '12px', 
                    padding: '8px 12px',
                    background: showBulkMode ? '#e8f5e8' : '#fef7e0',
                    borderRadius: '6px',
                    border: `1px solid ${showBulkMode ? '#c8e6c9' : '#ffecb3'}`
                  }}>
                    <div style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'space-between',
                      fontSize: '13px'
                    }}>
                      <span style={{ 
                        color: showBulkMode ? '#2e7d32' : '#f57c00',
                        fontWeight: '500'
                      }}>
                        {selectedRecipients.length} recipient(s) selected
                      </span>
                      <span style={{ 
                        color: showBulkMode ? '#2e7d32' : '#f57c00',
                        fontSize: '11px',
                        fontWeight: '600',
                        padding: '2px 8px',
                        background: showBulkMode ? '#c8e6c9' : '#ffecb3',
                        borderRadius: '12px'
                      }}>
                        {showBulkMode ? 'BULK MODE' : 'SINGLE MODE'}
                      </span>
                    </div>
                  </div>
                  
                  {/* Dropdown button for bulk mode */}
                  <div style={{ marginTop: '8px' }}>
                    <button 
                      type="button"
                      className="gmail-leads-dropdown-btn"
                      onClick={() => setShowLeadsDropdown(!showLeadsDropdown)}
                      style={{
                        background: 'linear-gradient(135deg, #1a73e8, #4285f4)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        padding: '10px 20px',
                        cursor: 'pointer',
                        fontSize: '14px',
                        fontWeight: '500',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        boxShadow: '0 2px 8px rgba(26, 115, 232, 0.3)',
                        transition: 'all 0.2s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.transform = 'translateY(-2px)';
                        e.target.style.boxShadow = '0 4px 12px rgba(26, 115, 232, 0.4)';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.transform = 'translateY(0)';
                        e.target.style.boxShadow = '0 2px 8px rgba(26, 115, 232, 0.3)';
                      }}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24">
                        <path fill="currentColor" d="M7 10l5 5 5-5z"/>
                      </svg>
                      Select Recipients
                    </button>
                  </div>
                </div>
              ) : (
                <div className="gmail-compose-to-container">
                  <input
                    name="to"
                    type="email"
                    value={form.to}
                    onChange={handleChange}
                    required={!showBulkMode}
                    placeholder="Recipients"
                    autoComplete="off"
                  />
                  <button 
                    type="button"
                    className="gmail-leads-dropdown-btn"
                    onClick={() => setShowLeadsDropdown(!showLeadsDropdown)}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24">
                      <path fill="currentColor" d="M7 10l5 5 5-5z"/>
                    </svg>
                  </button>
                </div>
              )}
              
              {showLeadsDropdown && (
                <div className="gmail-leads-dropdown">
                  <div className="gmail-leads-dropdown-header">
                    <span>Select from Leads</span>
                    <button 
                      type="button"
                      onClick={() => setShowLeadsDropdown(false)}
                      className="gmail-leads-dropdown-close"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24">
                        <path fill="currentColor" d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                      </svg>
                    </button>
                  </div>
                  <div className="gmail-leads-dropdown-content">
                    {allLeadEmails.length > 0 ? (
                      allLeadEmails.map((email, idx) => (
                        <div 
                          key={idx} 
                          className={`gmail-lead-email-item ${showBulkMode && selectedRecipients.includes(email) ? 'selected' : ''}`}
                        >
                          {showBulkMode && (
                            <input 
                              type="checkbox" 
                              checked={selectedRecipients.includes(email)}
                              onChange={(e) => {
                                e.stopPropagation();
                                if (selectedRecipients.includes(email)) {
                                  setSelectedRecipients(prev => prev.filter(e => e !== email));
                                } else {
                                  setSelectedRecipients(prev => [...prev, email]);
                                }
                              }}
                              onClick={(e) => {
                                e.stopPropagation();
                                e.preventDefault();
                              }}
                              style={{ cursor: 'pointer', zIndex: 1000 }}
                            />
                          )}
                          {!showBulkMode && (
                            <div style={{ width: '18px', height: '18px', marginRight: '8px' }}></div>
                          )}
                          <div 
                            onClick={(e) => {
                              e.stopPropagation();
                              e.preventDefault();
                              if (showBulkMode) {
                                if (selectedRecipients.includes(email)) {
                                  setSelectedRecipients(prev => prev.filter(e => e !== email));
                                } else {
                                  setSelectedRecipients(prev => [...prev, email]);
                                }
                              } else {
                                setForm({ ...form, to: email });
                                setShowLeadsDropdown(false);
                              }
                            }}
                            style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', zIndex: 999 }}
                          >
                            <svg width="16" height="16" viewBox="0 0 24 24">
                              <path fill="currentColor" d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                            </svg>
                            <span>{email}</span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="gmail-lead-email-empty">
                        <span>No leads found</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
              
              {emailSuggestions.length > 0 && (
                <div className="gmail-suggestions">
                  {emailSuggestions.map((email, idx) => (
                    <div key={idx} onClick={() => handleSuggestionClick(email)}>
                      {email}
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="gmail-compose-field">
              <label>Subject:</label>
              <input
                name="subject"
                type="text"
                value={form.subject}
                onChange={handleChange}
                required
                placeholder="Subject"
                className="gmail-compose-input"
              />
            </div>
            <div className="gmail-compose-field message-field">
              <label>Message:</label>
              <textarea
                name="message"
                value={form.message}
                onChange={handleChange}
                required
                placeholder="Write your message..."
                rows={12}
                className="gmail-compose-textarea"
              />
            </div>
            <div className="gmail-compose-footer">
              <div className="gmail-compose-footer-left">
                <button type="submit" className="gmail-compose-send-btn" disabled={sending}>
                  {sending ? (
                    <>
                      <svg width="16" height="16" viewBox="0 0 24 24" className="gmail-spinner">
                        <path fill="currentColor" d="M12 2A10 10 0 0 0 2 12a10 10 0 0 0 10 10 10 10 0 0 0 10-10A10 10 0 0 0 12 2zm0 18a8 8 0 0 1-8-8 8 8 0 0 1 8-8 8 8 0 0 1 8 8 8 8 0 0 1-8 8z"/>
                      </svg>
                      Sending...
                    </>
                  ) : (
                    <>
                      <svg width="16" height="16" viewBox="0 0 24 24">
                        <path fill="currentColor" d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
                      </svg>
                      {showBulkMode ? `Send to ${selectedRecipients.length} recipient(s)` : 'Send'}
                    </>
                  )}
                </button>
              </div>
              <div className="gmail-compose-footer-right">
                <button 
                  type="button" 
                  className="gmail-compose-discard-btn"
                  onClick={() => {
                    setShowCompose(false);
                    setShowLeadsDropdown(false);
                    setForm({ to: '', subject: '', message: '' });
                    setSelectedRecipients([]);
                    setShowBulkMode(false);
                    setIsMinimized(false);
                    setIsMaximized(false);
                  }}
                >
                  Discard
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* Success/Error Messages */}
      {success && (
        <div className="gmail-notification success">
          {success}
        </div>
      )}
      {error && (
        <div className="gmail-notification error">
          {error}
        </div>
      )}
    </div>
  );
}
