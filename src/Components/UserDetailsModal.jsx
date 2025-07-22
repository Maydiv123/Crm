import React, { useState, useEffect } from 'react';
import { FiX, FiUser, FiMail, FiCalendar, FiActivity, FiTrendingUp, FiShield } from 'react-icons/fi';
import { adminAPI } from '../services/api';
import './UserDetailsModal.css';

const UserDetailsModal = ({ userId, onClose }) => {
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (userId) {
      fetchUserDetails();
    }
  }, [userId]);

  const fetchUserDetails = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await adminAPI.getUserDetails(userId);
      setUserDetails(response.data);
    } catch (error) {
      console.error('Error fetching user details:', error);
      setError('Failed to load user details');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Never';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return '#16a34a';
      case 'inactive': return '#dc2626';
      case 'pending': return '#d97706';
      default: return '#6b7280';
    }
  };

  if (loading) {
    return (
      <div className="user-details-modal-overlay" onClick={onClose}>
        <div className="user-details-modal" onClick={e => e.stopPropagation()}>
          <div className="user-details-loading">
            <div className="user-details-spinner"></div>
            <p>Loading user details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !userDetails) {
    return (
      <div className="user-details-modal-overlay" onClick={onClose}>
        <div className="user-details-modal" onClick={e => e.stopPropagation()}>
          <div className="user-details-error">
            <div className="user-details-error-icon">⚠️</div>
            <p>{error || 'User not found'}</p>
            <button onClick={onClose} className="user-details-close-btn">
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="user-details-modal-overlay" onClick={onClose}>
      <div className="user-details-modal" onClick={e => e.stopPropagation()}>
        <div className="user-details-modal-header">
          <div className="user-details-modal-title">
            <FiUser className="user-details-icon" />
            <span>User Details</span>
          </div>
          <button className="user-details-modal-close" onClick={onClose}>
            <FiX />
          </button>
        </div>

        <div className="user-details-modal-content">
          <div className="user-details-profile">
            <div className="user-details-avatar">
              {userDetails.avatar_url ? (
                <img src={userDetails.avatar_url} alt={userDetails.name} />
              ) : (
                <div className="user-details-initial">
                  {userDetails.name.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            <div className="user-details-info">
              <h2>{userDetails.name}</h2>
              <p className="user-details-email">
                <FiMail />
                {userDetails.email}
              </p>
              <div className="user-details-badges">
                <span 
                  className="user-details-role"
                  style={{ backgroundColor: userDetails.role === 'admin' ? '#fef3c7' : '#dbeafe' }}
                >
                  {userDetails.role}
                </span>
                <span 
                  className="user-details-status"
                  style={{ backgroundColor: getStatusColor(userDetails.status) + '20', color: getStatusColor(userDetails.status) }}
                >
                  {userDetails.status}
                </span>
              </div>
            </div>
          </div>

          <div className="user-details-sections">
            <div className="user-details-section">
              <h3>
                <FiCalendar />
                Account Information
              </h3>
              <div className="user-details-grid">
                <div className="user-details-item">
                  <label>Member Since</label>
                  <span>{formatDate(userDetails.created_at)}</span>
                </div>
                <div className="user-details-item">
                  <label>Last Login</label>
                  <span>{formatDate(userDetails.last_login)}</span>
                </div>
                <div className="user-details-item">
                  <label>Total Leads</label>
                  <span>{userDetails.total_leads || 0}</span>
                </div>
                <div className="user-details-item">
                  <label>Bulk Messages</label>
                  <span>{userDetails.total_bulk_messages || 0}</span>
                </div>
                <div className="user-details-item">
                  <label>Employees</label>
                  <span>{userDetails.total_employees || 0}</span>
                </div>
              </div>
            </div>

            {userDetails.current_package && (
              <div className="user-details-section">
                <h3>
                  <FiPackage />
                  Current Package
                </h3>
                <div className="user-details-package">
                  <div className="user-details-package-header">
                    <h4>{userDetails.current_package.name}</h4>
                    <span className="user-details-package-price">
                      ₹{userDetails.current_package.price}
                    </span>
                  </div>
                  <p className="user-details-package-description">
                    {userDetails.current_package.description}
                  </p>
                  <div className="user-details-package-details">
                    <div className="user-details-package-item">
                      <label>Subscription Date</label>
                      <span>{formatDate(userDetails.current_package.subscribed_at) || 'N/A'}</span>
                    </div>
                    <div className="user-details-package-item">
                      <label>Expires On</label>
                      <span>{formatDate(userDetails.current_package.expires_at) || 'No expiration'}</span>
                    </div>
                    <div className="user-details-package-item">
                      <label>Status</label>
                      <span className={`user-details-package-status ${userDetails.current_package.subscription_status}`}>
                        {userDetails.current_package.subscription_status}
                      </span>
                    </div>
                  </div>
                  {userDetails.current_package.features && (
                    <div className="user-details-package-features">
                      <h5>Package Features:</h5>
                      <div className="user-details-features-list">
                        {JSON.parse(userDetails.current_package.features).map((feature, index) => (
                          <span key={index} className="user-details-feature">
                            ✓ {feature}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="user-details-section">
              <h3>
                <FiShield />
                Permissions ({userDetails.permissions?.length || 0})
              </h3>
              {userDetails.permissions && userDetails.permissions.length > 0 ? (
                <div className="user-details-permissions">
                  {userDetails.permissions.map((permission, index) => (
                    <span key={index} className="user-details-permission">
                      {permission.permission_name}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="user-details-no-permissions">No permissions assigned</p>
              )}
            </div>

            <div className="user-details-section">
              <h3>
                <FiActivity />
                Recent Bulk Messages ({userDetails.recent_messages?.length || 0})
              </h3>
              {userDetails.recent_messages && userDetails.recent_messages.length > 0 ? (
                <div className="user-details-messages">
                  {userDetails.recent_messages.map((message, index) => (
                    <div key={index} className="user-details-message-item">
                      <div className="user-details-message-content">
                        <div className="user-details-message-header">
                          <span className="user-details-message-type">{message.type.toUpperCase()}</span>
                          <span className={`user-details-message-status ${message.status}`}>
                            {message.status}
                          </span>
                        </div>
                        <span className="user-details-message-recipient">{message.recipient}</span>
                        {message.subject && (
                          <span className="user-details-message-subject">{message.subject}</span>
                        )}
                      </div>
                      <span className="user-details-message-time">
                        {formatDate(message.created_at)}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="user-details-no-messages">No recent bulk messages</p>
              )}
            </div>

            <div className="user-details-section">
              <h3>
                <FiActivity />
                Recent Activity ({userDetails.activity_logs?.length || 0})
              </h3>
              {userDetails.activity_logs && userDetails.activity_logs.length > 0 ? (
                <div className="user-details-activity">
                  {userDetails.activity_logs.slice(0, 5).map((activity, index) => (
                    <div key={index} className="user-details-activity-item">
                      <div className="user-details-activity-content">
                        <span className="user-details-activity-action">{activity.action}</span>
                        <span className="user-details-activity-description">{activity.description}</span>
                      </div>
                      <span className="user-details-activity-time">
                        {formatDate(activity.created_at)}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="user-details-no-activity">No recent activity</p>
              )}
            </div>
          </div>
        </div>

        <div className="user-details-modal-footer">
          <button className="user-details-close-btn" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserDetailsModal; 