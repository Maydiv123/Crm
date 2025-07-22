import express from 'express';
import pool from '../config/db.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

// GET /api/tasks - fetch all tasks for the authenticated user
router.get('/', auth, async (req, res) => {
  try {
    const [tasks] = await pool.execute('SELECT * FROM tasks WHERE user_id = ? ORDER BY due_date ASC, createdAt DESC', [req.user.id]);
    res.json({ tasks });
  } catch (error) {
    console.error('Get tasks error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/tasks/all - fetch all tasks without user filtering
router.get('/all', auth, async (req, res) => {
  try {
    const [tasks] = await pool.execute('SELECT * FROM tasks ORDER BY due_date ASC, createdAt DESC');
    res.json({ tasks });
  } catch (error) {
    console.error('Get all tasks error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/tasks - create a new task
router.post('/', auth, async (req, res) => {
  try {
    const { title, description, due_date, type } = req.body;
    if (!title) return res.status(400).json({ message: 'Title is required' });
    
    const [result] = await pool.execute(
      'INSERT INTO tasks (title, description, due_date, user_id, type) VALUES (?, ?, ?, ?, ?)',
      [title, description || '', due_date || null, req.user.id, type || 'Follow up']
    );
    
    // Return the created task
    const [newTask] = await pool.execute('SELECT * FROM tasks WHERE id = ?', [result.insertId]);
    res.status(201).json(newTask[0]);
  } catch (error) {
    console.error('Create task error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router; 