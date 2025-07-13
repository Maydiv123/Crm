import express from 'express';
import { body, validationResult } from 'express-validator';
import pool from '../config/db.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

// GET /api/leads - Get all leads for the authenticated user
router.get('/', auth, async (req, res) => {
  try {
    const { page = 1, limit = 10, stage, status, search, pipeline } = req.query;
    const limitNum = parseInt(limit, 10) || 10;
    const pageNum = parseInt(page, 10) || 1;
    const offsetNum = (pageNum - 1) * limitNum;
    let where = '';
    let params = [];
    if (req.user.role !== 'admin') {
      where = 'WHERE assigned_to = ?';
      params.push(req.user.id);
    } else {
      where = 'WHERE 1=1';
    }
    if (pipeline) {
      where += ' AND pipeline = ?';
      params.push(pipeline);
    }
    if (stage) {
      where += ' AND stage = ?';
      params.push(stage);
    }
    if (status) {
      where += ' AND status = ?';
      params.push(status);
    }
    if (search) {
      where += ' AND (name LIKE ? OR contact_name LIKE ? OR company_name LIKE ?)';
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }
    console.log('limitNum:', limitNum, 'offsetNum:', offsetNum, 'params:', [...params, limitNum, offsetNum]);
    const [leads] = await pool.execute(
      `SELECT * FROM leads ${where} ORDER BY createdAt DESC LIMIT ${limitNum} OFFSET ${offsetNum}`,
      params
    );
    const [countRows] = await pool.execute(
      `SELECT COUNT(*) as total FROM leads ${where}`,
      params
    );
    const total = countRows[0].total;
    res.json({
      leads,
      totalPages: Math.ceil(total / limitNum),
      currentPage: pageNum,
      total
    });
  } catch (error) {
    console.error('Get leads error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/leads/:id - Get lead by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const [leads] = await pool.execute(
      `SELECT * FROM leads WHERE id = ?`,
      [req.params.id]
    );
    if (leads.length === 0) {
      return res.status(404).json({ message: 'Lead not found' });
    }
    const lead = leads[0];
    if (lead.assigned_to !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }
    // Get notes
    const [notes] = await pool.execute(
      `SELECT n.*, u.name as created_by_name FROM notes n LEFT JOIN users u ON n.created_by = u.id WHERE n.lead_id = ? ORDER BY n.createdAt DESC`,
      [lead.id]
    );
    lead.notes = notes;
    res.json(lead);
  } catch (error) {
    console.error('Get lead error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/leads - Create a new lead
router.post('/', auth, [
  body('name', 'Name is required').not().isEmpty(),
  body('stage', 'Stage is required').not().isEmpty()
], async (req, res) => {
  console.log('Create lead request body:', req.body); // Debug log
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const {
      name,
      amount = 0,
      stage,
      pipeline = 'Sales Pipeline',
      contactName = '',
      contactPhone = '',
      contactEmail = '',
      contactPosition = '',
      companyName = '',
      companyAddress = '',
      source = '',
      priority = 'medium',
      expectedCloseDate = null
    } = req.body;
    const [result] = await pool.execute(
      `INSERT INTO leads (name, amount, stage, pipeline, contact_name, contact_phone, contact_email, contact_position, company_name, company_address, assigned_to, created_by, source, priority, expected_close_date) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [name, amount, stage, pipeline, contactName, contactPhone, contactEmail, contactPosition, companyName, companyAddress, req.user.id, req.user.id, source, priority, expectedCloseDate]
    );
    const [leads] = await pool.execute(
      `SELECT * FROM leads WHERE id = ?`,
      [result.insertId]
    );
    res.status(201).json(leads[0]);
  } catch (error) {
    console.error('Create lead error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT /api/leads/:id - Update a lead
router.put('/:id', auth, async (req, res) => {
  try {
    const [leads] = await pool.execute(
      `SELECT * FROM leads WHERE id = ?`,
      [req.params.id]
    );
    if (leads.length === 0) {
      return res.status(404).json({ message: 'Lead not found' });
    }
    const lead = leads[0];
    if (lead.assigned_to !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }
    // Only allow updating certain fields
    const fields = [
      'name', 'amount', 'stage', 'pipeline', 'contact_name', 'contact_phone', 'contact_email', 'contact_position', 'company_name', 'company_address', 'status', 'source', 'priority', 'expected_close_date', 'last_contact_date'
    ];
    const updates = [];
    const params = [];
    for (const field of fields) {
      if (req.body[field] !== undefined) {
        updates.push(`${field} = ?`);
        params.push(req.body[field]);
      }
    }
    if (updates.length === 0) {
      return res.status(400).json({ message: 'No fields to update' });
    }
    params.push(req.params.id);
    await pool.execute(
      `UPDATE leads SET ${updates.join(', ')} WHERE id = ?`,
      params
    );
    const [updatedLeads] = await pool.execute(
      `SELECT * FROM leads WHERE id = ?`,
      [req.params.id]
    );
    res.json(updatedLeads[0]);
  } catch (error) {
    console.error('Update lead error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// PATCH /api/leads/:id/stage - Update only the stage of a lead
router.patch('/:id/stage', auth, async (req, res) => {
  const { id } = req.params;
  const { stage } = req.body;
  try {
    const [leads] = await pool.execute(
      `SELECT * FROM leads WHERE id = ?`,
      [id]
    );
    if (leads.length === 0) {
      return res.status(404).json({ message: 'Lead not found' });
    }
    const lead = leads[0];
    if (lead.assigned_to !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }
    await pool.execute(
      `UPDATE leads SET stage = ? WHERE id = ?`,
      [stage, id]
    );
    res.json({ success: true });
  } catch (error) {
    console.error('Update lead stage error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE /api/leads/:id - Delete a lead
router.delete('/:id', auth, async (req, res) => {
  try {
    const [leads] = await pool.execute(
      `SELECT * FROM leads WHERE id = ?`,
      [req.params.id]
    );
    if (leads.length === 0) {
      return res.status(404).json({ message: 'Lead not found' });
    }
    const lead = leads[0];
    if (lead.assigned_to !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }
    await pool.execute(
      `DELETE FROM leads WHERE id = ?`,
      [req.params.id]
    );
    res.json({ message: 'Lead removed' });
  } catch (error) {
    console.error('Delete lead error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/leads/:id/notes - Add a note to a lead
router.post('/:id/notes', auth, [
  body('content', 'Note content is required').not().isEmpty()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const [leads] = await pool.execute(
      `SELECT * FROM leads WHERE id = ?`,
      [req.params.id]
    );
    if (leads.length === 0) {
      return res.status(404).json({ message: 'Lead not found' });
    }
    const lead = leads[0];
    if (lead.assigned_to !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }
    await pool.execute(
      `INSERT INTO notes (lead_id, content, created_by) VALUES (?, ?, ?)`,
      [req.params.id, req.body.content, req.user.id]
    );
    // Return updated notes
    const [notes] = await pool.execute(
      `SELECT n.*, u.name as created_by_name FROM notes n LEFT JOIN users u ON n.created_by = u.id WHERE n.lead_id = ? ORDER BY n.createdAt DESC`,
      [req.params.id]
    );
    res.json(notes);
  } catch (error) {
    console.error('Add note error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/leads/stats/overview - Get lead statistics
router.get('/stats/overview', auth, async (req, res) => {
  try {
    const [stats] = await pool.execute(
      `SELECT stage, COUNT(*) as count, SUM(amount) as totalAmount FROM leads WHERE assigned_to = ? GROUP BY stage`,
      [req.user.id]
    );
    const [totalLeadsRow] = await pool.execute(
      `SELECT COUNT(*) as totalLeads FROM leads WHERE assigned_to = ?`,
      [req.user.id]
    );
    const [totalAmountRow] = await pool.execute(
      `SELECT SUM(amount) as totalAmount FROM leads WHERE assigned_to = ?`,
      [req.user.id]
    );
    res.json({
      stageStats: stats,
      totalLeads: totalLeadsRow[0].totalLeads,
      totalAmount: totalAmountRow[0].totalAmount || 0
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router; 