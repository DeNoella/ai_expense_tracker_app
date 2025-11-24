const express = require('express');
const pool = require('../config/database');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

router.use(authenticateToken);

// Get budget
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM budget WHERE user_id = $1',
      [req.user.userId]
    );

    if (result.rows.length === 0) {
      return res.json({ budget: null });
    }

    // Get current month expenses
    const currentDate = new Date();
    const month = currentDate.getMonth() + 1;
    const year = currentDate.getFullYear();

    const expenseResult = await pool.query(
      `SELECT COALESCE(SUM(amount), 0) as total 
       FROM expenses 
       WHERE user_id = $1 
       AND EXTRACT(MONTH FROM date) = $2 
       AND EXTRACT(YEAR FROM date) = $3`,
      [req.user.userId, month, year]
    );

    const spent = parseFloat(expenseResult.rows[0].total);
    const budget = parseFloat(result.rows[0].monthly_budget);
    const remaining = budget - spent;
    const usagePercent = budget > 0 ? (spent / budget) * 100 : 0;

    res.json({
      budget: {
        ...result.rows[0],
        monthly_budget: parseFloat(result.rows[0].monthly_budget),
        spent,
        remaining,
        usagePercent: Math.round(usagePercent * 100) / 100
      }
    });
  } catch (error) {
    console.error('Get budget error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Set/Update budget
router.post('/', async (req, res) => {
  try {
    const { monthly_budget } = req.body;

    if (!monthly_budget || monthly_budget <= 0) {
      return res.status(400).json({ error: 'Valid monthly budget is required' });
    }

    // Check if budget exists
    const existing = await pool.query(
      'SELECT id FROM budget WHERE user_id = $1',
      [req.user.userId]
    );

    let result;
    if (existing.rows.length > 0) {
      // Update
      result = await pool.query(
        'UPDATE budget SET monthly_budget = $1, updated_at = CURRENT_TIMESTAMP WHERE user_id = $2 RETURNING *',
        [monthly_budget, req.user.userId]
      );
    } else {
      // Insert
      result = await pool.query(
        'INSERT INTO budget (user_id, monthly_budget) VALUES ($1, $2) RETURNING *',
        [req.user.userId, monthly_budget]
      );
    }

    res.json({ budget: result.rows[0] });
  } catch (error) {
    console.error('Set budget error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get income
router.get('/income', async (req, res) => {
  try {
    const currentDate = new Date();
    const month = currentDate.getMonth() + 1;
    const year = currentDate.getFullYear();

    const result = await pool.query(
      `SELECT COALESCE(SUM(amount), 0) as total 
       FROM income 
       WHERE user_id = $1 
       AND EXTRACT(MONTH FROM date) = $2 
       AND EXTRACT(YEAR FROM date) = $3`,
      [req.user.userId, month, year]
    );

    res.json({ totalIncome: parseFloat(result.rows[0].total) });
  } catch (error) {
    console.error('Get income error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Add income
router.post('/income', async (req, res) => {
  try {
    const { amount, source, date } = req.body;

    if (!amount || !date) {
      return res.status(400).json({ error: 'Amount and date are required' });
    }

    const result = await pool.query(
      'INSERT INTO income (user_id, amount, source, date) VALUES ($1, $2, $3, $4) RETURNING *',
      [req.user.userId, amount, source || null, date]
    );

    res.status(201).json({ income: result.rows[0] });
  } catch (error) {
    console.error('Add income error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;

