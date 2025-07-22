import express from 'express';
import pool from '../config/db.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

// Test endpoint without authentication
router.get('/test', async (req, res) => {
  try {
    const [activities] = await pool.execute('SELECT COUNT(*) as count FROM activity_logs');
    res.json({ 
      message: 'Activity logs test successful', 
      count: activities[0].count,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Test endpoint error:', error);
    res.status(500).json({ message: 'Test failed', error: error.message });
  }
});

// Get all activity logs with optional filtering
router.get('/', auth, async (req, res) => {
  try {
    console.log('Activity logs request received');
    
    // Simple query first to test
    const [activities] = await pool.execute(`
      SELECT 
        al.id,
        al.created_at as date,
        u.name as user,
        al.object_type as objectType,
        al.object_name as objectName,
        al.event_type as event,
        al.event_description as description,
        al.value_before,
        al.value_after,
        al.impact,
        al.priority
      FROM activity_logs al
      LEFT JOIN users u ON al.user_id = u.id
      ORDER BY al.created_at DESC
      LIMIT 50
    `);

    console.log('Query executed successfully, found', activities.length, 'activities');

    // Get basic stats
    const [statsResult] = await pool.execute(`
      SELECT 
        COUNT(*) as total,
        COUNT(CASE WHEN object_type = 'Lead' THEN 1 END) as leads
      FROM activity_logs
    `);

    res.json({
      activities: activities.map(activity => ({
        ...activity,
        valueBefore: JSON.parse(activity.valueBefore || '[]'),
        valueAfter: JSON.parse(activity.valueAfter || '[]')
      })),
      stats: statsResult[0],
      filters: {
        users: ['All'],
        objectTypes: ['All'],
        eventTypes: ['All'],
        impacts: ['All', 'positive', 'negative', 'neutral']
      }
    });

  } catch (error) {
    console.error('Error fetching activity logs:', error);
    res.status(500).json({ message: 'Error fetching activity logs', error: error.message });
  }
});

// Create new activity log
router.post('/', auth, async (req, res) => {
  try {
    const {
      objectType,
      objectId,
      objectName,
      eventType,
      eventDescription,
      valueBefore = [],
      valueAfter = [],
      impact = 'neutral',
      priority = 'medium'
    } = req.body;

    const userId = req.user.id;

    const query = `
      INSERT INTO activity_logs 
      (user_id, object_type, object_id, object_name, event_type, event_description, value_before, value_after, impact, priority)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const [result] = await pool.execute(query, [
      userId,
      objectType,
      objectId,
      objectName,
      eventType,
      eventDescription,
      JSON.stringify(valueBefore),
      JSON.stringify(valueAfter),
      impact,
      priority
    ]);

    res.status(201).json({
      message: 'Activity log created successfully',
      id: result.insertId
    });

  } catch (error) {
    console.error('Error creating activity log:', error);
    res.status(500).json({ message: 'Error creating activity log' });
  }
});

// Get activity log by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;

    const query = `
      SELECT 
        al.id,
        al.created_at as date,
        u.name as user,
        al.object_type as objectType,
        al.object_name as objectName,
        al.event_type as event,
        al.event_description as description,
        al.value_before,
        al.value_after,
        al.impact,
        al.priority
      FROM activity_logs al
      LEFT JOIN users u ON al.user_id = u.id
      WHERE al.id = ?
    `;

    const [activities] = await pool.execute(query, [id]);

    if (activities.length === 0) {
      return res.status(404).json({ message: 'Activity log not found' });
    }

    const activity = activities[0];
    activity.valueBefore = JSON.parse(activity.valueBefore || '[]');
    activity.valueAfter = JSON.parse(activity.valueAfter || '[]');

    res.json(activity);

  } catch (error) {
    console.error('Error fetching activity log:', error);
    res.status(500).json({ message: 'Error fetching activity log' });
  }
});

// Delete activity log (admin only)
router.delete('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;

    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admin only.' });
    }

    const [result] = await pool.execute('DELETE FROM activity_logs WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Activity log not found' });
    }

    res.json({ message: 'Activity log deleted successfully' });

  } catch (error) {
    console.error('Error deleting activity log:', error);
    res.status(500).json({ message: 'Error deleting activity log' });
  }
});

export default router; 