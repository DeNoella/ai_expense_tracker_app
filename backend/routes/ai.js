const express = require('express');
const pool = require('../config/database');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

router.use(authenticateToken);

// AI Analysis endpoint
router.post('/analyze', async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Get user's expense data
    const currentDate = new Date();
    const month = currentDate.getMonth() + 1;
    const year = currentDate.getFullYear();

    // Get expenses for current month
    const expensesResult = await pool.query(
      `SELECT category, amount, date, description 
       FROM expenses 
       WHERE user_id = $1 
       AND EXTRACT(MONTH FROM date) = $2 
       AND EXTRACT(YEAR FROM date) = $3 
       ORDER BY date DESC`,
      [req.user.userId, month, year]
    );

    // Get expenses by category
    const categoryResult = await pool.query(
      `SELECT category, COALESCE(SUM(amount), 0) as total 
       FROM expenses 
       WHERE user_id = $1 
       AND EXTRACT(MONTH FROM date) = $2 
       AND EXTRACT(YEAR FROM date) = $3 
       GROUP BY category 
       ORDER BY total DESC`,
      [req.user.userId, month, year]
    );

    // Get budget
    const budgetResult = await pool.query(
      'SELECT monthly_budget FROM budget WHERE user_id = $1',
      [req.user.userId]
    );

    // Get last 6 months trend
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

    // Get total income
    const incomeResult = await pool.query(
      `SELECT COALESCE(SUM(amount), 0) as total 
       FROM income 
       WHERE user_id = $1 
       AND EXTRACT(MONTH FROM date) = $2 
       AND EXTRACT(YEAR FROM date) = $3`,
      [req.user.userId, month, year]
    );

    const expenses = expensesResult.rows;
    const categories = categoryResult.rows;
    const budget = budgetResult.rows[0]?.monthly_budget || 0;
    const trend = trendResult.rows;
    const totalIncome = parseFloat(incomeResult.rows[0].total);
    const totalExpenses = categories.reduce((sum, cat) => sum + parseFloat(cat.total), 0);
    const remaining = budget - totalExpenses;

    // AI Analysis Logic
    const response = analyzeExpenseQuery(
      message.toLowerCase(),
      expenses,
      categories,
      budget,
      totalExpenses,
      remaining,
      totalIncome,
      trend
    );

    // Save to chat history
    await pool.query(
      'INSERT INTO chat_history (user_id, message, response) VALUES ($1, $2, $3)',
      [req.user.userId, message, response]
    );

    res.json({ response, data: { categories, totalExpenses, budget, remaining, totalIncome } });
  } catch (error) {
    console.error('AI analyze error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// AI Analysis function
function analyzeExpenseQuery(message, expenses, categories, budget, totalExpenses, remaining, totalIncome, trend) {
  const msg = message.toLowerCase();

  // How much spent on category
  if (msg.includes('spend') && msg.includes('food')) {
    const foodTotal = categories.find(c => c.category.toLowerCase() === 'food')?.total || 0;
    return `You have spent $${parseFloat(foodTotal).toFixed(2)} on food this month.`;
  }

  if (msg.includes('spend') && msg.includes('transport')) {
    const transportTotal = categories.find(c => c.category.toLowerCase() === 'transport')?.total || 0;
    return `You have spent $${parseFloat(transportTotal).toFixed(2)} on transport this month.`;
  }

  // Budget tracking
  if (msg.includes('budget') || msg.includes('on track')) {
    if (budget === 0) {
      return `You haven't set a monthly budget yet. Set one to track your spending!`;
    }
    const usagePercent = (totalExpenses / budget) * 100;
    if (usagePercent > 100) {
      const over = totalExpenses - budget;
      return `⚠️ You are ${usagePercent.toFixed(1)}% over your budget this month. You've exceeded by $${over.toFixed(2)}. Consider reviewing your expenses.`;
    } else if (usagePercent > 80) {
      return `You're at ${usagePercent.toFixed(1)}% of your budget. You have $${remaining.toFixed(2)} remaining. Be mindful of your spending.`;
    } else {
      return `✅ Great job! You're at ${usagePercent.toFixed(1)}% of your budget. You have $${remaining.toFixed(2)} remaining this month.`;
    }
  }

  // Category spending
  if (msg.includes('category') && (msg.includes('most') || msg.includes('highest'))) {
    if (categories.length === 0) {
      return `You haven't recorded any expenses this month yet.`;
    }
    const topCategory = categories[0];
    return `You're spending the most on ${topCategory.category} with $${parseFloat(topCategory.total).toFixed(2)} this month.`;
  }

  // Total spending
  if (msg.includes('total') || msg.includes('how much') && msg.includes('spend')) {
    return `Your total expenses this month are $${totalExpenses.toFixed(2)}.`;
  }

  // Prediction
  if (msg.includes('predict') || msg.includes('next month')) {
    if (trend.length < 2) {
      return `I need more historical data to make accurate predictions. Keep tracking your expenses!`;
    }
    const avgMonthly = trend.reduce((sum, t) => sum + parseFloat(t.total), 0) / trend.length;
    return `Based on your spending patterns, I predict you'll spend approximately $${avgMonthly.toFixed(2)} next month.`;
  }

  // Income vs expenses
  if (msg.includes('income') || msg.includes('saving')) {
    const savings = totalIncome - totalExpenses;
    if (savings > 0) {
      return `Your income this month is $${totalIncome.toFixed(2)} and expenses are $${totalExpenses.toFixed(2)}. You're saving $${savings.toFixed(2)}! 🎉`;
    } else {
      return `Your expenses ($${totalExpenses.toFixed(2)}) exceed your income ($${totalIncome.toFixed(2)}) by $${Math.abs(savings).toFixed(2)}. Consider reviewing your spending.`;
    }
  }

  // Recommendations
  if (msg.includes('recommend') || msg.includes('suggestion') || msg.includes('advice')) {
    if (categories.length === 0) {
      return `Start by tracking your expenses regularly to get personalized recommendations.`;
    }
    const topCategory = categories[0];
    const recommendations = [];
    
    if (parseFloat(topCategory.total) > budget * 0.3) {
      recommendations.push(`Consider reducing spending on ${topCategory.category} (currently ${((parseFloat(topCategory.total) / budget) * 100).toFixed(1)}% of budget).`);
    }
    
    if (totalExpenses > budget) {
      recommendations.push(`You're over budget. Review your largest expenses and identify areas to cut back.`);
    } else if (remaining < budget * 0.2) {
      recommendations.push(`You're close to your budget limit. Be mindful of additional expenses.`);
    } else {
      recommendations.push(`You're doing well with your budget! Keep up the good financial habits.`);
    }

    return recommendations.join(' ');
  }

  // Default response
  return `I can help you with:
- Total spending this month: $${totalExpenses.toFixed(2)}
- Budget status: ${budget > 0 ? `${((totalExpenses / budget) * 100).toFixed(1)}% used` : 'Not set'}
- Top spending category: ${categories[0]?.category || 'None'} ($${categories[0]?.total || 0})
- Remaining budget: $${remaining.toFixed(2)}

Ask me specific questions like "How much did I spend on food?" or "Am I on track with my budget?"`;
}

module.exports = router;

