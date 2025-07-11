import express from 'express';
import pool from '../config/db.js';

const router = express.Router();

// GET /api/tasks - fetch all tasks
router.get('/', async (req, res) => {
  try {
    const [tasks] = await pool.execute('SELECT * FROM tasks ORDER BY due_date ASC, createdAt DESC');
    res.json({ tasks });
  } catch (error) {
    console.error('Get tasks error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/tasks - create a new task
router.post('/', async (req, res) => {
  try {
    const { title, description, due_date, user_id } = req.body;
    if (!title) return res.status(400).json({ message: 'Title is required' });
    await pool.execute(
      'INSERT INTO tasks (title, description, due_date, user_id) VALUES (?, ?, ?, ?)',
      [title, description || '', due_date || null, user_id || null]
    );
    res.json({ message: 'Task created!' });
  } catch (error) {
    console.error('Create task error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router; 