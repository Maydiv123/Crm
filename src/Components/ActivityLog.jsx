import React, { useState, useEffect } from "react";
import AnalyticsSidebar from "./AnalyticsSidebar";
import { activityLogsAPI } from "../services/api";
import "./ActivityLog.css";

function Tag({ type, value, color }) {
  return (
    <span className={`activity-tag activity-tag-${color}`}>
      {type}: <b>{value}</b>
    </span>
  );
}

function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true
  });
}

function getTimeAgo(dateString) {
  const now = new Date();
  const date = new Date(dateString);
  const diffInSeconds = Math.floor((now - date) / 1000);
  
  if (diffInSeconds < 60) return `${diffInSeconds}s ago`;
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  return `${Math.floor(diffInSeconds / 86400)}d ago`;
}

function getImpactIcon(impact) {
  switch (impact) {
    case 'positive': return '📈';
    case 'negative': return '📉';
    case 'neutral': return '➡️';
    default: return '➡️';
  }
}

export default function ActivityLog() {
  const [activities, setActivities] = useState([]);
  const [filteredActivities, setFilteredActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedUser, setSelectedUser] = useState("All");
  const [selectedObjectType, setSelectedObjectType] = useState("All");
  const [selectedEvent, setSelectedEvent] = useState("All");
  const [selectedImpact, setSelectedImpact] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(50);
  const [showStats, setShowStats] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    today: 0,
    leads: 0,
    contacts: 0,
    invoices: 0,
    tasks: 0,
    positive: 0,
    negative: 0,
    neutral: 0
  });
  const [filters, setFilters] = useState({
    users: ['All'],
    objectTypes: ['All'],
    eventTypes: ['All'],
    impacts: ['All', 'positive', 'negative', 'neutral']
  });

  // Fetch activity logs from backend
  const fetchActivityLogs = async (params = {}) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await activityLogsAPI.getAll({
        page: currentPage,
        limit: itemsPerPage,
        user: selectedUser,
        objectType: selectedObjectType,
        eventType: selectedEvent,
        impact: selectedImpact,
        search: searchTerm,
        ...params
      });

      const { activities: fetchedActivities, stats: fetchedStats, filters: fetchedFilters } = response.data;
      
      setActivities(fetchedActivities);
      setFilteredActivities(fetchedActivities);
      setStats(fetchedStats);
      setFilters(fetchedFilters);
      
    } catch (err) {
      console.error('Error fetching activity logs:', err);
      setError('Failed to load activity logs. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Initial data fetch
  useEffect(() => {
    fetchActivityLogs();
  }, []);

  // Filter activities when filters change
  useEffect(() => {
    fetchActivityLogs();
  }, [selectedUser, selectedObjectType, selectedEvent, selectedImpact, searchTerm, currentPage]);

  // Handle refresh
  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await fetchActivityLogs();
    } catch (err) {
      console.error('Error refreshing:', err);
    } finally {
      setIsRefreshing(false);
    }
  };

  // Export functionality
  const handleExport = () => {
    const csvContent = [
      ['Date & Time', 'User', 'Object Type', 'Object Name', 'Event', 'Value Before', 'Value After', 'Description', 'Impact'],
      ...filteredActivities.map(item => [
        formatDate(item.date),
        item.user,
        item.objectType,
        item.objectName,
        item.event,
        item.valueBefore.map(v => `${v.type}: ${v.value}`).join('; ') || '-',
        item.valueAfter.map(v => `${v.type}: ${v.value}`).join('; ') || '-',
        item.description,
        item.impact
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `activity-log-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (loading && activities.length === 0) {
    return (
      <div style={{ display: 'flex', height: '100%' }}>
        <AnalyticsSidebar />
        <div className="activity-log-container">
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '50vh',
            fontSize: '18px',
            color: '#666'
          }}>
            📊 Loading activity logs...
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ display: 'flex', height: '100%' }}>
        <AnalyticsSidebar />
        <div className="activity-log-container">
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '50vh',
            fontSize: '18px',
            color: '#f44336',
            textAlign: 'center',
            flexDirection: 'column',
            gap: '12px'
          }}>
            <div>❌ {error}</div>
            <button
              onClick={() => fetchActivityLogs()}
              style={{
                padding: '8px 16px',
                border: '1px solid #f44336',
                borderRadius: '6px',
                background: 'white',
                color: '#f44336',
                cursor: 'pointer'
              }}
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', height: '100%' }}>
      <AnalyticsSidebar />
      <div className="activity-log-container">
        {/* Header */}
        <div className="activity-log-header">
          <div className="activity-log-header-left">
            <img 
              src="/src/assets/stats.png" 
              alt="Activity Log" 
              style={{ width: '32px', height: '32px' }}
            />
            <h1 className="activity-log-header-title">
              Activity Log
            </h1>
          </div>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <button
              onClick={() => setShowStats(!showStats)}
              style={{
                padding: '8px 16px',
                border: '1px solid #ddd',
                borderRadius: '6px',
                background: showStats ? '#1976d2' : 'white',
                color: showStats ? 'white' : '#666',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              {showStats ? '📊 Hide Stats' : '📊 Show Stats'}
            </button>
            <button
              onClick={handleExport}
              style={{
                padding: '8px 16px',
                border: '1px solid #ddd',
                borderRadius: '6px',
                background: 'white',
                color: '#666',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              📥 Export CSV
            </button>
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className={`activity-log-refresh-btn ${isRefreshing ? 'spinning' : ''}`}
            >
              <img 
                src="/src/assets/stats.png" 
                alt="Refresh" 
                style={{ 
                  width: '24px', 
                  height: '24px',
                  opacity: isRefreshing ? 0.7 : 1
                }}
              />
            </button>
          </div>
        </div>

        {/* Statistics Dashboard */}
        {showStats && (
          <div className="activity-log-stats">
            <div className="activity-log-stats-grid">
              <div className="activity-log-stat-card">
                <div className="activity-log-stat-icon">📊</div>
                <div className="activity-log-stat-content">
                  <div className="activity-log-stat-value">{stats.total}</div>
                  <div className="activity-log-stat-label">Total Activities</div>
                </div>
              </div>
              <div className="activity-log-stat-card">
                <div className="activity-log-stat-icon">📅</div>
                <div className="activity-log-stat-content">
                  <div className="activity-log-stat-value">{stats.today}</div>
                  <div className="activity-log-stat-label">Today</div>
                </div>
              </div>
              <div className="activity-log-stat-card">
                <div className="activity-log-stat-icon">🎯</div>
                <div className="activity-log-stat-content">
                  <div className="activity-log-stat-value">{stats.leads}</div>
                  <div className="activity-log-stat-label">Lead Activities</div>
                </div>
              </div>
              <div className="activity-log-stat-card">
                <div className="activity-log-stat-icon">👥</div>
                <div className="activity-log-stat-content">
                  <div className="activity-log-stat-value">{stats.contacts}</div>
                  <div className="activity-log-stat-label">Contact Activities</div>
                </div>
              </div>
              <div className="activity-log-stat-card">
                <div className="activity-log-stat-icon">📄</div>
                <div className="activity-log-stat-content">
                  <div className="activity-log-stat-value">{stats.invoices}</div>
                  <div className="activity-log-stat-label">Invoice Activities</div>
                </div>
              </div>
              <div className="activity-log-stat-card">
                <div className="activity-log-stat-icon">✅</div>
                <div className="activity-log-stat-content">
                  <div className="activity-log-stat-value">{stats.tasks}</div>
                  <div className="activity-log-stat-label">Task Activities</div>
                </div>
              </div>
              <div className="activity-log-stat-card positive">
                <div className="activity-log-stat-icon">📈</div>
                <div className="activity-log-stat-content">
                  <div className="activity-log-stat-value">{stats.positive}</div>
                  <div className="activity-log-stat-label">Positive Impact</div>
                </div>
              </div>
              <div className="activity-log-stat-card negative">
                <div className="activity-log-stat-icon">📉</div>
                <div className="activity-log-stat-content">
                  <div className="activity-log-stat-value">{stats.negative}</div>
                  <div className="activity-log-stat-label">Negative Impact</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="activity-log-filters">
          <div className="activity-log-filters-grid">
            <div className="activity-log-filter-group">
              <label className="activity-log-filter-label">Search</label>
              <input
                type="text"
                placeholder="Search activities..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="activity-log-filter-input"
              />
            </div>
            <div className="activity-log-filter-group">
              <label className="activity-log-filter-label">User</label>
              <select
                value={selectedUser}
                onChange={(e) => setSelectedUser(e.target.value)}
                className="activity-log-filter-select"
              >
                {filters.users.map(user => (
                  <option key={user} value={user}>{user}</option>
                ))}
              </select>
            </div>
            <div className="activity-log-filter-group">
              <label className="activity-log-filter-label">Object Type</label>
              <select
                value={selectedObjectType}
                onChange={(e) => setSelectedObjectType(e.target.value)}
                className="activity-log-filter-select"
              >
                {filters.objectTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
            <div className="activity-log-filter-group">
              <label className="activity-log-filter-label">Event</label>
              <select
                value={selectedEvent}
                onChange={(e) => setSelectedEvent(e.target.value)}
                className="activity-log-filter-select"
              >
                {filters.eventTypes.map(event => (
                  <option key={event} value={event}>{event}</option>
                ))}
              </select>
            </div>
            <div className="activity-log-filter-group">
              <label className="activity-log-filter-label">Impact</label>
              <select
                value={selectedImpact}
                onChange={(e) => setSelectedImpact(e.target.value)}
                className="activity-log-filter-select"
              >
                {filters.impacts.map(impact => (
                  <option key={impact} value={impact}>
                    {impact === 'All' ? 'All' : 
                     impact === 'positive' ? '📈 Positive' :
                     impact === 'negative' ? '📉 Negative' : '➡️ Neutral'}
                  </option>
                ))}
              </select>
            </div>
            <div className="activity-log-count">
              Showing {filteredActivities.length} of {stats.total} activities
            </div>
          </div>
        </div>

        {/* Activity Table */}
        <div className="activity-log-table-wrapper">
          <table className="activity-log-table">
            <thead>
              <tr>
                <th>Date & Time</th>
                <th>User</th>
                <th>Object Type</th>
                <th>Object Name</th>
                <th>Event</th>
                <th>Value Before</th>
                <th>Value After</th>
                <th>Description</th>
                <th>Impact</th>
              </tr>
            </thead>
            <tbody>
              {filteredActivities.map((row) => (
                <tr key={row.id} className={`activity-row impact-${row.impact}`}>
                  <td>
                    <div style={{ fontFamily: 'monospace', fontSize: '0.9em' }}>
                      {formatDate(row.date)}
                    </div>
                    <div style={{ fontSize: '0.8em', color: '#666', marginTop: '2px' }}>
                      {getTimeAgo(row.date)}
                    </div>
                  </td>
                  <td style={{ fontWeight: '600' }}>{row.user}</td>
                  <td>
                    <span className={`object-type-badge object-type-${row.objectType.toLowerCase()}`}>
                      {row.objectType}
                    </span>
                  </td>
                  <td style={{ fontWeight: '500' }}>{row.objectName}</td>
                  <td style={{ color: '#666' }}>{row.event}</td>
                  <td>
                    {row.valueBefore.length > 0 ? row.valueBefore.map((tag, i) => (
                      <Tag key={i} {...tag} />
                    )) : "-"}
                  </td>
                  <td>
                    {row.valueAfter.length > 0 ? row.valueAfter.map((tag, i) => (
                      <Tag key={i} {...tag} />
                    )) : "-"}
                  </td>
                  <td style={{ fontSize: '0.9em', color: '#666', maxWidth: '200px' }}>
                    {row.description}
                  </td>
                  <td>
                    <span style={{
                      padding: '4px 8px',
                      borderRadius: '4px',
                      fontSize: '0.8em',
                      fontWeight: '600',
                      background: row.impact === 'positive' ? '#e8f5e8' :
                                 row.impact === 'negative' ? '#ffebee' : '#f5f5f5',
                      color: row.impact === 'positive' ? '#2e7d32' :
                             row.impact === 'negative' ? '#c62828' : '#666'
                    }}>
                      {getImpactIcon(row.impact)} {row.impact}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {stats.total > itemsPerPage && (
          <div className="activity-log-pagination">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="activity-log-pagination-btn"
            >
              ← Previous
            </button>
            <span className="activity-log-pagination-info">
              Page {currentPage} of {Math.ceil(stats.total / itemsPerPage)}
            </span>
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, Math.ceil(stats.total / itemsPerPage)))}
              disabled={currentPage === Math.ceil(stats.total / itemsPerPage)}
              className="activity-log-pagination-btn"
            >
              Next →
            </button>
          </div>
        )}

        {/* Show message if no activities */}
        {filteredActivities.length === 0 && (
          <div style={{
            width: '98%',
            maxWidth: '1400px',
            background: 'white',
            padding: '40px',
            borderRadius: '12px',
            textAlign: 'center',
            marginTop: '20px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
          }}>
            <div style={{ fontSize: '18px', color: '#666', marginBottom: '8px' }}>
              📊 No activities found
            </div>
            <div style={{ fontSize: '14px', color: '#999' }}>
              Try adjusting your filters or search terms
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 