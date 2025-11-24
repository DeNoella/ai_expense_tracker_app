const express = require('express');
const pool = require('../config/database');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

// Get all expenses
router.get('/', async (req, res) => {
  try {
    const { category, startDate, endDate, limit = 100 } = req.query;
    let query = 'SELECT * FROM expenses WHERE user_id = $1';
    const params = [req.user.userId];
    let paramIndex = 2;

    if (category) {
      query += ` AND category = $${paramIndex}`;
      params.push(category);
      paramIndex++;
    }

    if (startDate) {
      query += ` AND date >= $${paramIndex}`;
      params.push(startDate);
      paramIndex++;
    }

    if (endDate) {
      query += ` AND date <= $${paramIndex}`;
      params.push(endDate);
      paramIndex++;
    }

    query += ' ORDER BY date DESC, created_at DESC LIMIT $' + paramIndex;
    params.push(parseInt(limit));

    const result = await pool.query(query, params);
    res.json({ expenses: result.rows });
  } catch (error) {
    console.error('Get expenses error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get expense by ID
router.get('/:id', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM expenses WHERE id = $1 AND user_id = $2',
      [req.params.id, req.user.userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Expense not found' });
    }

    res.json({ expense: result.rows[0] });
  } catch (error) {
    console.error('Get expense error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create expense
router.post('/', async (req, res) => {
  try {
    const { category, amount, date, description } = req.body;

    if (!category || !amount || !date) {
      return res.status(400).json({ error: 'Category, amount, and date are required' });
    }

    const result = await pool.query(
      'INSERT INTO expenses (user_id, category, amount, date, description) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [req.user.userId, category, amount, date, description || null]
    );

    res.status(201).json({ expense: result.rows[0] });
  } catch (error) {
    console.error('Create expense error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update expense
router.put('/:id', async (req, res) => {
  try {
    const { category, amount, date, description } = req.body;

    const result = await pool.query(
      'UPDATE expenses SET category = $1, amount = $2, date = $3, description = $4 WHERE id = $5 AND user_id = $6 RETURNING *',
      [category, amount, date, description, req.params.id, req.user.userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Expense not found' });
    }

    res.json({ expense: result.rows[0] });
  } catch (error) {
    console.error('Update expense error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete expense
router.delete('/:id', async (req, res) => {
  try {
    const result = await pool.query(
      'DELETE FROM expenses WHERE id = $1 AND user_id = $2 RETURNING id',
      [req.params.id, req.user.userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Expense not found' });
    }

    res.json({ message: 'Expense deleted successfully' });
  } catch (error) {
    console.error('Delete expense error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get expense statistics
router.get('/stats/summary', async (req, res) => {
  try {
    const { month, year } = req.query;
    const currentDate = new Date();
    const targetMonth = month || currentDate.getMonth() + 1;
    const targetYear = year || currentDate.getFullYear();

    // Total expenses for the month
    const totalResult = await pool.query(
      `SELECT COALESCE(SUM(amount), 0) as total 
       FROM expenses 
       WHERE user_id = $1 
       AND EXTRACT(MONTH FROM date) = $2 
       AND EXTRACT(YEAR FROM date) = $3`,
      [req.user.userId, targetMonth, targetYear]
    );

    // Expenses by category
    const categoryResult = await pool.query(
      `SELECT category, COALESCE(SUM(amount), 0) as total 
       FROM expenses 
       WHERE user_id = $1 
       AND EXTRACT(MONTH FROM date) = $2 
       AND EXTRACT(YEAR FROM date) = $3 
       GROUP BY category 
       ORDER BY total DESC`,
      [req.user.userId, targetMonth, targetYear]
    );

    // Last 6 months trend
    const trendResult = await pool.query(
      `SELECT 
         EXTRACT(MONTH FROM date) as month,
         EXTRACT(YEAR FROM date) as year,
         COALESCE(SUM(amount), 0) as total
       FROM expenses 
       WHERE user_id = $1 
       AND date >= DATE_TRUNC('month', CURRENT_DATE - INTERVAL '5 months')
       GROUP BY EXTRACT(MONTH FROM date), EXTRACT(YEAR FROM date)
       ORDER BY year, month`,
      [req.user.userId]
    );

    res.json({
      totalExpenses: parseFloat(totalResult.rows[0].total),
      byCategory: categoryResult.rows.map(row => ({
        category: row.category,
        total: parseFloat(row.total)
      })),
      trend: trendResult.rows.map(row => ({
        month: parseInt(row.month),
        year: parseInt(row.year),
        total: parseFloat(row.total)
      }))
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;

