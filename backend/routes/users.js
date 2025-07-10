import express from 'express';
import { body, validationResult } from 'express-validator';
import pool from '../config/db.js';
import { auth, adminAuth } from '../middleware/auth.js';

const router = express.Router();

// GET /api/users - Get all users (admin only)
router.get('/', adminAuth, async (req, res) => {
  try {
    const [users] = await pool.execute(
      'SELECT id, name, email, role, avatar, isActive, createdAt FROM users'
    );
    res.json(users);
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/users/:id - Get user by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const [users] = await pool.execute(
      'SELECT id, name, email, role, avatar, isActive, createdAt FROM users WHERE id = ?',
      [req.params.id]
    );
    if (users.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    // Users can only view their own profile unless they're admin
    if (req.user.id !== Number(req.params.id) && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }
    res.json(users[0]);
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT /api/users/:id - Update user (admin only or own profile)
router.put('/:id', auth, [
  body('name', 'Name is required').not().isEmpty(),
  body('email', 'Please include a valid email').isEmail()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    // Users can only update their own profile unless they're admin
    if (req.user.id !== Number(req.params.id) && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }
    const { name, email, role, isActive } = req.body;
    const updates = ['name = ?', 'email = ?'];
    const params = [name, email];
    // Only admins can update role and isActive
    if (req.user.role === 'admin') {
      if (role) {
        updates.push('role = ?');
        params.push(role);
      }
      if (typeof isActive === 'boolean') {
        updates.push('isActive = ?');
        params.push(isActive);
      }
    }
    params.push(req.params.id);
    await pool.execute(
      `UPDATE users SET ${updates.join(', ')} WHERE id = ?`,
      params
    );
    const [users] = await pool.execute(
      'SELECT id, name, email, role, avatar, isActive, createdAt FROM users WHERE id = ?',
      [req.params.id]
    );
    if (users.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(users[0]);
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE /api/users/:id - Delete user (admin only)
router.delete('/:id', adminAuth, async (req, res) => {
  try {
    const [users] = await pool.execute(
      'SELECT id FROM users WHERE id = ?',
      [req.params.id]
    );
    if (users.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    // Prevent admin from deleting themselves
    if (req.user.id === Number(req.params.id)) {
      return res.status(400).json({ message: 'Cannot delete your own account' });
    }
    await pool.execute(
      'DELETE FROM users WHERE id = ?',
      [req.params.id]
    );
    res.json({ message: 'User removed' });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router; 