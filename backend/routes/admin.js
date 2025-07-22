import express from 'express';
import pool from '../config/db.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

// Middleware to check if user is admin
const requireAdmin = async (req, res, next) => {
  try {
    const [rows] = await pool.execute(
      'SELECT role FROM users WHERE id = ?',
      [req.user.id]
    );
    
    if (rows.length === 0 || rows[0].role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }
    
    next();
  } catch (error) {
    console.error('Admin check error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get dashboard stats
router.get('/stats', auth, requireAdmin, async (req, res) => {
  try {
    // Get total admins (users with admin role)
    const [adminsResult] = await pool.execute('SELECT COUNT(*) as count FROM users WHERE role = "admin"');
    const totalAdmins = adminsResult[0].count;

    // Get total leads
    const [leadsResult] = await pool.execute('SELECT COUNT(*) as count FROM leads');
    const totalLeads = leadsResult[0].count;

    // Get total messages sent (assuming messages table exists)
    const [messagesResult] = await pool.execute('SELECT COUNT(*) as count FROM messages');
    const totalMessages = messagesResult[0].count || 0;

    // Get total revenue (assuming payments table exists)
    const [revenueResult] = await pool.execute('SELECT SUM(amount) as total FROM payments WHERE status = "completed"');
    const totalRevenue = revenueResult[0].total || 0;

    // Get active packages count
    const [packagesResult] = await pool.execute('SELECT COUNT(*) as count FROM packages WHERE status = "active"');
    const activePackages = packagesResult[0].count;

    // Get pending permissions
    const [permissionsResult] = await pool.execute('SELECT COUNT(*) as count FROM user_permissions WHERE status = "pending"');
    const pendingPermissions = permissionsResult[0].count;

    res.json({
      totalAdmins,
      totalLeads,
      totalMessages,
      totalRevenue,
      activePackages,
      pendingPermissions
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ message: 'Error fetching dashboard stats' });
  }
});

// Get advertisements
router.get('/advertisements', auth, requireAdmin, async (req, res) => {
  try {
    const [rows] = await pool.execute(`
      SELECT 
        id, 
        title, 
        description, 
        image_url, 
        views, 
        clicks, 
        status, 
        created_at,
        updated_at
      FROM advertisements 
      ORDER BY created_at DESC
    `);
    
    res.json(rows);
  } catch (error) {
    console.error('Error fetching advertisements:', error);
    res.status(500).json({ message: 'Error fetching advertisements' });
  }
});

// Create advertisement
router.post('/advertisements', auth, requireAdmin, async (req, res) => {
  try {
    const { title, description, imageUrl, targetAudience, budget } = req.body;
    
    const [result] = await pool.execute(`
      INSERT INTO advertisements (title, description, image_url, target_audience, budget, status, created_at)
      VALUES (?, ?, ?, ?, ?, 'active', NOW())
    `, [title, description, imageUrl, targetAudience, budget]);
    
    res.status(201).json({ 
      id: result.insertId, 
      message: 'Advertisement created successfully' 
    });
  } catch (error) {
    console.error('Error creating advertisement:', error);
    res.status(500).json({ message: 'Error creating advertisement' });
  }
});

// Update advertisement
router.put('/advertisements/:id', auth, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, imageUrl, targetAudience, budget, status } = req.body;
    
    await pool.execute(`
      UPDATE advertisements 
      SET title = ?, description = ?, image_url = ?, target_audience = ?, budget = ?, status = ?, updated_at = NOW()
      WHERE id = ?
    `, [title, description, imageUrl, targetAudience, budget, status, id]);
    
    res.json({ message: 'Advertisement updated successfully' });
  } catch (error) {
    console.error('Error updating advertisement:', error);
    res.status(500).json({ message: 'Error updating advertisement' });
  }
});

// Delete advertisement
router.delete('/advertisements/:id', auth, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    
    await pool.execute('DELETE FROM advertisements WHERE id = ?', [id]);
    
    res.json({ message: 'Advertisement deleted successfully' });
  } catch (error) {
    console.error('Error deleting advertisement:', error);
    res.status(500).json({ message: 'Error deleting advertisement' });
  }
});

// Get packages
router.get('/packages', auth, requireAdmin, async (req, res) => {
  try {
    const [rows] = await pool.execute(`
      SELECT 
        p.id,
        p.name,
        p.description,
        p.price,
        p.features,
        p.status,
        p.created_at,
        COUNT(up.user_id) as subscribers,
        SUM(up.amount) as revenue
      FROM packages p
      LEFT JOIN user_packages up ON p.id = up.package_id
      GROUP BY p.id
      ORDER BY p.created_at DESC
    `);
    
    // Parse features JSON
    const packages = rows.map(pkg => ({
      ...pkg,
      features: pkg.features ? (typeof pkg.features === 'string' ? JSON.parse(pkg.features) : pkg.features) : []
    }));
    
    res.json(packages);
  } catch (error) {
    console.error('Error fetching packages:', error);
    res.status(500).json({ message: 'Error fetching packages' });
  }
});

// Create package
router.post('/packages', auth, requireAdmin, async (req, res) => {
  try {
    const { name, description, price, features, status } = req.body;
    
    const [result] = await pool.execute(`
      INSERT INTO packages (name, description, price, features, status, created_at)
      VALUES (?, ?, ?, ?, ?, NOW())
    `, [name, description, price, JSON.stringify(features), status]);
    
    res.status(201).json({ 
      id: result.insertId, 
      message: 'Package created successfully' 
    });
  } catch (error) {
    console.error('Error creating package:', error);
    res.status(500).json({ message: 'Error creating package' });
  }
});

// Update package
router.put('/packages/:id', auth, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, features, status } = req.body;
    
    await pool.execute(`
      UPDATE packages 
      SET name = ?, description = ?, price = ?, features = ?, status = ?, updated_at = NOW()
      WHERE id = ?
    `, [name, description, price, JSON.stringify(features), status, id]);
    
    res.json({ message: 'Package updated successfully' });
  } catch (error) {
    console.error('Error updating package:', error);
    res.status(500).json({ message: 'Error updating package' });
  }
});

// Get users with permissions
router.get('/users', auth, requireAdmin, async (req, res) => {
  try {
    const [rows] = await pool.execute(`
      SELECT 
        u.id,
        u.name,
        u.email,
        u.role,
        u.isActive as status,
        u.createdAt as created_at,
        u.avatar,
        GROUP_CONCAT(up.permission_name) as permissions
      FROM users u
      LEFT JOIN user_permissions up ON u.id = up.user_id
      GROUP BY u.id
      ORDER BY u.createdAt DESC
    `);
    
    res.json(rows);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Error fetching users' });
  }
});

// Get individual user details
router.get('/users/:id', auth, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    console.log('Fetching user details for ID:', id);
    
    // Get user details
    const [userRows] = await pool.execute(`
      SELECT 
        u.id,
        u.name,
        u.email,
        u.role,
        u.isActive as status,
        u.createdAt as created_at,
        u.avatar
      FROM users u
      WHERE u.id = ?
    `, [id]);
    
    if (userRows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    const user = userRows[0];
    
    // Get user permissions
    const [permissionRows] = await pool.execute(`
      SELECT permission_name, status, granted_at
      FROM user_permissions
      WHERE user_id = ?
      ORDER BY granted_at DESC
    `, [id]);
    
    // Get user activity logs
    const [activityRows] = await pool.execute(`
      SELECT 
        al.event_type as action,
        al.event_description as description,
        al.created_at
      FROM activity_logs al
      WHERE al.user_id = ?
      ORDER BY al.created_at DESC
      LIMIT 20
    `, [id]);
    
    // Get user leads count
    const [leadsResult] = await pool.execute(`
      SELECT COUNT(*) as total_leads
      FROM leads
      WHERE assigned_to = ?
    `, [id]);
    
    // Get bulk messages count
    const [bulkMessagesResult] = await pool.execute(`
      SELECT COUNT(*) as total_bulk_messages
      FROM messages
      WHERE user_id = ? AND type IN ('email', 'sms', 'whatsapp')
    `, [id]);
    
    // Get current active package details
    const [packageResult] = await pool.execute(`
      SELECT 
        p.id,
        p.name,
        p.description,
        p.price,
        p.features,
        up.amount,
        up.status as subscription_status,
        up.created_at as subscribed_at,
        up.end_date as expires_at
      FROM user_packages up
      LEFT JOIN packages p ON up.package_id = p.id
      WHERE up.user_id = ? AND up.status = 'active'
      ORDER BY up.created_at DESC
      LIMIT 1
    `, [id]);
    
    // Get employee count (users managed by this user)
    const [employeeResult] = await pool.execute(`
      SELECT COUNT(*) as total_employees
      FROM users
      WHERE id != ?
    `, [id]);
    
    // Get recent bulk messages
    const [recentMessagesResult] = await pool.execute(`
      SELECT 
        recipient,
        subject,
        type,
        status,
        created_at
      FROM messages
      WHERE user_id = ? AND type IN ('email', 'sms', 'whatsapp')
      ORDER BY created_at DESC
      LIMIT 10
    `, [id]);
    
    const response = {
      ...user,
      permissions: permissionRows,
      activity_logs: activityRows,
      total_leads: leadsResult[0].total_leads,
      total_bulk_messages: bulkMessagesResult[0].total_bulk_messages,
      current_package: packageResult[0] || null,
      total_employees: employeeResult[0].total_employees,
      recent_messages: recentMessagesResult
    };
    
    console.log('User details response:', response);
    res.json(response);
  } catch (error) {
    console.error('Error fetching user details:', error);
    console.error('Error details:', {
      code: error.code,
      errno: error.errno,
      sqlState: error.sqlState,
      sqlMessage: error.sqlMessage
    });
    res.status(500).json({ 
      message: 'Error fetching user details', 
      error: error.message,
      details: {
        code: error.code,
        errno: error.errno,
        sqlState: error.sqlState,
        sqlMessage: error.sqlMessage
      }
    });
  }
});

// Get available permissions
router.get('/permissions', auth, requireAdmin, async (req, res) => {
  try {
    const availablePermissions = [
      'view_leads',
      'create_leads',
      'edit_leads',
      'delete_leads',
      'view_reports',
      'manage_users',
      'manage_packages',
      'manage_advertisements',
      'view_analytics',
      'export_data',
      'manage_settings'
    ];
    
    res.json(availablePermissions);
  } catch (error) {
    console.error('Error fetching permissions:', error);
    res.status(500).json({ message: 'Error fetching permissions' });
  }
});

// Update user permissions
router.put('/users/:id/permissions', auth, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { permissions } = req.body;
    
    // Delete existing permissions
    await pool.execute('DELETE FROM user_permissions WHERE user_id = ?', [id]);
    
    // Add new permissions
    for (const permission of permissions) {
      await pool.execute(`
        INSERT INTO user_permissions (user_id, permission_name, status, granted_at)
        VALUES (?, ?, 'granted', NOW())
      `, [id, permission]);
    }
    
    res.json({ message: 'User permissions updated successfully' });
  } catch (error) {
    console.error('Error updating user permissions:', error);
    res.status(500).json({ message: 'Error updating user permissions' });
  }
});

// Get user activity logs
router.get('/activity-logs', auth, requireAdmin, async (req, res) => {
  try {
    const [rows] = await pool.execute(`
      SELECT 
        al.id,
        al.user_id,
        u.name as user_name,
        al.action,
        al.description,
        al.ip_address,
        al.created_at
      FROM activity_logs al
      JOIN users u ON al.user_id = u.id
      ORDER BY al.created_at DESC
      LIMIT 100
    `);
    
    res.json(rows);
  } catch (error) {
    console.error('Error fetching activity logs:', error);
    res.status(500).json({ message: 'Error fetching activity logs' });
  }
});

// Get monthly analytics
router.get('/analytics/monthly', auth, requireAdmin, async (req, res) => {
  try {
    const [rows] = await pool.execute(`
      SELECT 
        DATE_FORMAT(created_at, '%Y-%m') as month,
        COUNT(*) as new_users,
        SUM(CASE WHEN role = 'client' THEN 1 ELSE 0 END) as new_clients
      FROM users
      WHERE created_at >= DATE_SUB(NOW(), INTERVAL 6 MONTH)
      GROUP BY DATE_FORMAT(created_at, '%Y-%m')
      ORDER BY month
    `);
    
    res.json(rows);
  } catch (error) {
    console.error('Error fetching monthly analytics:', error);
    res.status(500).json({ message: 'Error fetching monthly analytics' });
  }
});

// Get company statistics
router.get('/company-stats', auth, requireAdmin, async (req, res) => {
  try {
    const { dateRange = 'month' } = req.query;
    
    // Calculate date range
    const now = new Date();
    let startDate = new Date();
    
    switch (dateRange) {
      case 'week':
        startDate.setDate(now.getDate() - 7);
        break;
      case 'month':
        startDate.setMonth(now.getMonth() - 1);
        break;
      case 'quarter':
        startDate.setMonth(now.getMonth() - 3);
        break;
      case 'year':
        startDate.setFullYear(now.getFullYear() - 1);
        break;
      default:
        startDate.setMonth(now.getMonth() - 1);
    }

    // Get total revenue
    const [revenueResult] = await pool.execute(`
      SELECT COALESCE(SUM(amount), 0) as total_revenue
      FROM payments
      WHERE status = 'completed' AND created_at >= ?
    `, [startDate]);

    // Get total leads
    const [leadsResult] = await pool.execute(`
      SELECT COUNT(*) as total_leads
      FROM leads
      WHERE createdAt >= ?
    `, [startDate]);

    // Get conversion rate
    const [conversionResult] = await pool.execute(`
      SELECT 
        COUNT(CASE WHEN status = 'won' THEN 1 END) as won_leads,
        COUNT(*) as total_leads
      FROM leads
      WHERE createdAt >= ?
    `, [startDate]);

    // Get active customers
    const [customersResult] = await pool.execute(`
      SELECT COUNT(DISTINCT user_id) as active_customers
      FROM user_packages
      WHERE status = 'active'
    `);

    // Get total employees
    const [employeesResult] = await pool.execute(`
      SELECT COUNT(*) as total_employees
      FROM users
      WHERE role IN ('admin', 'user', 'manager')
    `);

    // Get total messages
    const [messagesResult] = await pool.execute(`
      SELECT COUNT(*) as total_messages
      FROM messages
      WHERE created_at >= ?
    `, [startDate]);

    // Get active packages
    const [packagesResult] = await pool.execute(`
      SELECT COUNT(*) as active_packages
      FROM packages
      WHERE status = 'active'
    `);

    // Get pending payments
    const [pendingResult] = await pool.execute(`
      SELECT COALESCE(SUM(amount), 0) as pending_payments
      FROM payments
      WHERE status = 'pending'
    `);

    const conversionRate = conversionResult[0].total_leads > 0 
      ? (conversionResult[0].won_leads / conversionResult[0].total_leads * 100).toFixed(1)
      : 0;

    const stats = {
      totalRevenue: revenueResult[0].total_revenue,
      totalLeads: leadsResult[0].total_leads,
      conversionRate: parseFloat(conversionRate),
      activeCustomers: customersResult[0].active_customers,
      totalEmployees: employeesResult[0].total_employees,
      totalMessages: messagesResult[0].total_messages,
      activePackages: packagesResult[0].active_packages,
      pendingPayments: pendingResult[0].pending_payments
    };

    res.json(stats);
  } catch (error) {
    console.error('Error fetching company stats:', error);
    res.status(500).json({ message: 'Error fetching company stats' });
  }
});

// Get revenue data
router.get('/revenue-data', auth, requireAdmin, async (req, res) => {
  try {
    const { dateRange = 'month' } = req.query;
    
    // Mock revenue data for now
    const revenueData = [
      { month: 'Jan', revenue: 45000, leads: 120, customers: 85 },
      { month: 'Feb', revenue: 52000, leads: 135, customers: 92 },
      { month: 'Mar', revenue: 48000, leads: 110, customers: 88 },
      { month: 'Apr', revenue: 61000, leads: 150, customers: 105 },
      { month: 'May', revenue: 58000, leads: 140, customers: 98 },
      { month: 'Jun', revenue: 72000, leads: 180, customers: 125 },
    ];

    res.json(revenueData);
  } catch (error) {
    console.error('Error fetching revenue data:', error);
    res.status(500).json({ message: 'Error fetching revenue data' });
  }
});

// Get team performance
router.get('/team-performance', auth, requireAdmin, async (req, res) => {
  try {
    const [teamData] = await pool.execute(`
      SELECT 
        u.name,
        COUNT(l.id) as leads,
        COALESCE(SUM(l.amount), 0) as revenue,
        CASE 
          WHEN COUNT(l.id) > 0 THEN 
            ROUND((COUNT(CASE WHEN l.status = 'won' THEN 1 END) * 100.0 / COUNT(l.id)), 1)
          ELSE 0 
        END as conversion
      FROM users u
      LEFT JOIN leads l ON u.id = l.assigned_to
      WHERE u.role IN ('admin', 'user', 'manager')
      GROUP BY u.id, u.name
      ORDER BY revenue DESC
    `);

    res.json(teamData);
  } catch (error) {
    console.error('Error fetching team performance:', error);
    res.status(500).json({ message: 'Error fetching team performance' });
  }
});

// Get payment history
router.get('/payment-history', auth, requireAdmin, async (req, res) => {
  try {
    const [payments] = await pool.execute(`
      SELECT 
        p.id,
        u.name as user,
        p.amount,
        p.status,
        p.created_at as date,
        p.payment_method as method
      FROM payments p
      LEFT JOIN users u ON p.user_id = u.id
      ORDER BY p.created_at DESC
      LIMIT 50
    `);

    res.json(payments);
  } catch (error) {
    console.error('Error fetching payment history:', error);
    res.status(500).json({ message: 'Error fetching payment history' });
  }
});

// Get user activity
router.get('/user-activity', auth, requireAdmin, async (req, res) => {
  try {
    const [activity] = await pool.execute(`
      SELECT 
        al.user_id,
        u.name as user_name,
        al.event_type as action,
        al.event_description as description,
        al.created_at
      FROM activity_logs al
      LEFT JOIN users u ON al.user_id = u.id
      ORDER BY al.created_at DESC
      LIMIT 100
    `);

    res.json(activity);
  } catch (error) {
    console.error('Error fetching user activity:', error);
    res.status(500).json({ message: 'Error fetching user activity' });
  }
});

// Get blocked users
router.get('/blocked-users', auth, requireAdmin, async (req, res) => {
  try {
    const [blockedUsers] = await pool.execute(`
      SELECT 
        id,
        name,
        email,
        role,
        isActive as status
      FROM users
      WHERE isActive = 0
      ORDER BY updatedAt DESC
    `);

    res.json(blockedUsers);
  } catch (error) {
    console.error('Error fetching blocked users:', error);
    res.status(500).json({ message: 'Error fetching blocked users' });
  }
});

// Get login history
router.get('/login-history', auth, requireAdmin, async (req, res) => {
  try {
    // Mock login history data for now
    const loginHistory = [
      { user: 'Admin User', email: 'admin@crm.com', lastLogin: '2025-07-22 10:30', ip: '192.168.1.100', status: 'active' },
      { user: 'John Doe', email: 'john@company.com', lastLogin: '2025-07-22 09:15', ip: '192.168.1.101', status: 'active' },
      { user: 'Jane Smith', email: 'jane@company.com', lastLogin: '2025-07-21 16:45', ip: '192.168.1.102', status: 'blocked' },
      { user: 'Mike Johnson', email: 'mike@company.com', lastLogin: '2025-07-21 14:20', ip: '192.168.1.103', status: 'active' },
    ];

    res.json(loginHistory);
  } catch (error) {
    console.error('Error fetching login history:', error);
    res.status(500).json({ message: 'Error fetching login history' });
  }
});

// Block user
router.post('/block-user/:id', auth, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    
    await pool.execute(`
      UPDATE users 
      SET isActive = 0, updatedAt = NOW()
      WHERE id = ?
    `, [id]);

    res.json({ message: 'User blocked successfully' });
  } catch (error) {
    console.error('Error blocking user:', error);
    res.status(500).json({ message: 'Error blocking user' });
  }
});

// Unblock user
router.post('/unblock-user/:id', auth, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    
    await pool.execute(`
      UPDATE users 
      SET isActive = 1, updatedAt = NOW()
      WHERE id = ?
    `, [id]);

    res.json({ message: 'User unblocked successfully' });
  } catch (error) {
    console.error('Error unblocking user:', error);
    res.status(500).json({ message: 'Error unblocking user' });
  }
});

export default router; 