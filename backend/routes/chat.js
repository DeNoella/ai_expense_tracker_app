const express = require('express');
const pool = require('../config/database');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

router.use(authenticateToken);

// Get chat history
router.get('/history', async (req, res) => {
  try {
    const { limit = 50 } = req.query;
    const result = await pool.query(
      'SELECT * FROM chat_history WHERE user_id = $1 ORDER BY created_at DESC LIMIT $2',
      [req.user.userId, parseInt(limit)]
    );

    res.json({ history: result.rows.reverse() }); // Reverse to show oldest first
  } catch (error) {
    console.error('Get chat history error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Clear chat history
router.delete('/history', async (req, res) => {
  try {
    await pool.query(
      'DELETE FROM chat_history WHERE user_id = $1',
      [req.user.userId]
    );

    res.json({ message: 'Chat history cleared successfully' });
  } catch (error) {
    console.error('Clear chat history error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;

