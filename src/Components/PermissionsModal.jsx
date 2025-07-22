import React, { useState, useEffect } from 'react';
import { FiX, FiSave, FiShield } from 'react-icons/fi';
import { adminAPI } from '../services/api';
import './PermissionsModal.css';

const PermissionsModal = ({ user, onClose, onUpdate }) => {
  const [availablePermissions, setAvailablePermissions] = useState([]);
  const [selectedPermissions, setSelectedPermissions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      fetchPermissions();
      // Set current user permissions
      const currentPermissions = user.permissions ? 
        (typeof user.permissions === 'string' ? user.permissions.split(',') : user.permissions) : 
        [];
      setSelectedPermissions(currentPermissions);
    }
  }, [user]);

  const fetchPermissions = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getPermissions();
      setAvailablePermissions(response.data);
    } catch (error) {
      console.error('Error fetching permissions:', error);
      setError('Failed to load permissions');
    } finally {
      setLoading(false);
    }
  };

  const handlePermissionToggle = (permission) => {
    setSelectedPermissions(prev => 
      prev.includes(permission)
        ? prev.filter(p => p !== permission)
        : [...prev, permission]
    );
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError('');
      await adminAPI.updateUserPermissions(user.id, selectedPermissions);
      onUpdate && onUpdate();
      onClose();
    } catch (error) {
      console.error('Error updating permissions:', error);
      setError('Failed to update permissions');
    } finally {
      setSaving(false);
    }
  };

  const permissionLabels = {
    view_leads: 'View Leads',
    create_leads: 'Create Leads',
    edit_leads: 'Edit Leads',
    delete_leads: 'Delete Leads',
    view_reports: 'View Reports',
    manage_users: 'Manage Users',
    manage_packages: 'Manage Packages',
    manage_advertisements: 'Manage Advertisements',
    view_analytics: 'View Analytics',
    export_data: 'Export Data',
    manage_settings: 'Manage Settings'
  };

  if (!user) return null;

  return (
    <div className="permissions-modal-overlay" onClick={onClose}>
      <div className="permissions-modal" onClick={e => e.stopPropagation()}>
        <div className="permissions-modal-header">
          <div className="permissions-modal-title">
            <FiShield className="permissions-icon" />
            <span>Manage Permissions - {user.name}</span>
          </div>
          <button className="permissions-modal-close" onClick={onClose}>
            <FiX />
          </button>
        </div>

        <div className="permissions-modal-content">
          {error && (
            <div className="permissions-error">
              {error}
            </div>
          )}

          <div className="permissions-user-info">
            <div className="permissions-user-avatar">
              {user.avatar_url ? (
                <img src={user.avatar_url} alt={user.name} />
              ) : (
                <div className="permissions-user-initial">
                  {user.name.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            <div className="permissions-user-details">
              <h3>{user.name}</h3>
              <p>{user.email}</p>
              <span className={`permissions-user-role ${user.role}`}>
                {user.role}
              </span>
            </div>
          </div>

          <div className="permissions-section">
            <h4>Available Permissions</h4>
            <p className="permissions-description">
              Select the permissions you want to grant to this user:
            </p>

            {loading ? (
              <div className="permissions-loading">Loading permissions...</div>
            ) : (
              <div className="permissions-grid">
                {availablePermissions.map(permission => (
                  <label key={permission} className="permission-item">
                    <input
                      type="checkbox"
                      checked={selectedPermissions.includes(permission)}
                      onChange={() => handlePermissionToggle(permission)}
                    />
                    <span className="permission-label">
                      {permissionLabels[permission] || permission}
                    </span>
                  </label>
                ))}
              </div>
            )}
          </div>

          <div className="permissions-summary">
            <p>
              <strong>Selected:</strong> {selectedPermissions.length} of {availablePermissions.length} permissions
            </p>
          </div>
        </div>

        <div className="permissions-modal-footer">
          <button className="permissions-cancel-btn" onClick={onClose}>
            Cancel
          </button>
          <button 
            className="permissions-save-btn" 
            onClick={handleSave}
            disabled={saving}
          >
            <FiSave />
            {saving ? 'Saving...' : 'Save Permissions'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PermissionsModal; 