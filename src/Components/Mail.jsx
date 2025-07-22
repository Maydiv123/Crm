import React, { useState, useEffect, useRef } from 'react';
import './Mail.css';
import mailIcon from '../assets/email.png';

const dummyInbox = [
  {
    from: 'support@crm.com',
    subject: 'Welcome to CRM',
    message: 'Hi, welcome to our CRM!',
    date: '2024-07-19 14:00',
  },
  {
    from: 'info@company.com',
    subject: 'Your Invoice',
    message: 'Your invoice is attached.',
    date: '2024-07-18 10:30',
  },
];
const dummySent = [
  {
    to: 'john@example.com',
    subject: 'Welcome to CRM',
    message: 'Hi John, welcome to our CRM!',
    date: '2024-07-19 14:00',
  },
  {
    to: 'jane@example.com',
    subject: 'Invoice Sent',
    message: 'Hi Jane, your invoice has been sent.',
    date: '2024-07-18 10:30',
  },
];

export default function Mail() {
  const [tab, setTab] = useState('inbox');
  const [showCompose, setShowCompose] = useState(false);
  const [form, setForm] = useState({ to: '', subject: '', message: '' });
  const [inbox] = useState(dummyInbox);
  const [sent, setSent] = useState(dummySent);
  const [search, setSearch] = useState('');
  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [emailSuggestions, setEmailSuggestions] = useState([]);
  const [allLeadEmails, setAllLeadEmails] = useState([]);
  const suggestionBoxRef = useRef(null);

  // Fetch all lead emails on mount
  useEffect(() => {
    fetch('/api/leads/emails', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })
      .then(res => res.json())
      .then(data => {
        if (data.emails) setAllLeadEmails(data.emails);
      });
  }, []);

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

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSend = async (e) => {
    e.preventDefault();
    setSending(true);
    setSuccess('');
    setError('');
    try {
      const response = await fetch('/api/mail/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: form.to,
          subject: form.subject,
          message: form.message
        })
      });
      const data = await response.json();
      if (response.ok) {
        setSent([
          { ...form, date: new Date().toLocaleString() },
          ...sent,
        ]);
        setShowCompose(false);
        setForm({ to: '', subject: '', message: '' });
        setSuccess('Email sent successfully!');
        setTab('sent');
      } else {
        setError(data.message || 'Failed to send email.');
      }
    } catch (err) {
      setError('Failed to send email.');
    }
    setSending(false);
  };

  // Filtered lists
  const filteredInbox = inbox.filter(
    (mail) =>
      mail.from.toLowerCase().includes(search.toLowerCase()) ||
      mail.subject.toLowerCase().includes(search.toLowerCase())
  );
  const filteredSent = sent.filter(
    (mail) =>
      mail.to.toLowerCase().includes(search.toLowerCase()) ||
      mail.subject.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="crm-mail-dark-bg">
      <div className="crm-mail-toolbar">
        <div className="crm-mail-tabs">
          <button className={tab === 'inbox' ? 'active' : ''} onClick={() => setTab('inbox')}>INBOX</button>
          <button className={tab === 'sent' ? 'active' : ''} onClick={() => setTab('sent')}>SENT</button>
        </div>
        <div className="crm-mail-toolbar-actions">
          <input
            className="crm-mail-search"
            type="text"
            placeholder="Search and filter"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <button className="mail-compose-btn" onClick={() => setShowCompose(true)}>
            <img src={mailIcon} alt="Compose" style={{ width: 20, height: 20, marginRight: 8, verticalAlign: 'middle' }} />
            COMPOSE
          </button>
        </div>
      </div>
      <div className="crm-mail-list-card">
        <table className="crm-mail-table">
          <thead>
            <tr>
              {tab === 'inbox' ? <th>FROM</th> : <th>TO</th>}
              <th>SUBJECT</th>
              <th>DATE</th>
            </tr>
          </thead>
          <tbody>
            {(tab === 'inbox' ? filteredInbox : filteredSent).length === 0 ? (
              <tr>
                <td colSpan={3} style={{ textAlign: 'center', color: '#e0e0e0', fontStyle: 'italic', padding: '32px 0' }}>
                  Sorry, there are no messages.
                </td>
              </tr>
            ) : (
              (tab === 'inbox' ? filteredInbox : filteredSent).map((mail, idx) => (
                <tr key={idx}>
                  <td>{tab === 'inbox' ? mail.from : mail.to}</td>
                  <td>{mail.subject}</td>
                  <td>{mail.date}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {showCompose && (
        <div className="mail-modal-backdrop">
          <div className="mail-modal">
            <div className="mail-modal-header">
              <img src={mailIcon} alt="Mail" style={{ width: 28, height: 28, marginRight: 10 }} />
              <h3 style={{ flex: 1 }}>Compose Email</h3>
              <button className="mail-modal-close" onClick={() => setShowCompose(false)}>&times;</button>
            </div>
            <form className="mail-form" onSubmit={handleSend}>
              <label>To</label>
              <input name="to" type="email" value={form.to} onChange={handleChange} required placeholder="Recipient email" autoComplete="off" />
              {emailSuggestions.length > 0 && (
                <div className="mail-suggestion-box" ref={suggestionBoxRef} style={{ position: 'absolute', background: '#fff', border: '1px solid #e0e0e0', borderRadius: 6, zIndex: 10, width: '100%' }}>
                  {emailSuggestions.map((email, idx) => (
                    <div key={idx} style={{ padding: '8px 12px', cursor: 'pointer' }} onClick={() => handleSuggestionClick(email)}>
                      {email}
                    </div>
                  ))}
                </div>
              )}
              <label>Subject</label>
              <input name="subject" type="text" value={form.subject} onChange={handleChange} required placeholder="Subject" />
              <label>Message</label>
              <textarea name="message" value={form.message} onChange={handleChange} required placeholder="Write your message..." rows={6} />
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '18px' }}>
                <button type="button" className="mail-cancel-btn" onClick={() => setShowCompose(false)}>Cancel</button>
                <button type="submit" className="mail-send-btn" disabled={sending}>{sending ? 'Sending...' : 'Send'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
