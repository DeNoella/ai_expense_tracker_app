const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../config/database');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Register
router.post('/register', async (req, res) => {
  try {
    console.log('📥 Registration request received:', {
      body: req.body,
      headers: req.headers['content-type']
    });

    const { full_name, email, password } = req.body;

    console.log('📝 Registration attempt:', { 
      email, 
      hasPassword: !!password, 
      hasName: !!full_name,
      passwordLength: password?.length 
    });

    if (!full_name || !email || !password) {
      console.log('❌ Validation failed: Missing fields');
      return res.status(400).json({ error: 'All fields are required' });
    }

    if (password.length < 6) {
      console.log('❌ Validation failed: Password too short');
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    // Check if user exists
    console.log('🔍 Checking if user exists...');
    const existingUser = await pool.query(
      'SELECT id FROM users WHERE email = $1',
      [email]
    );

    if (existingUser.rows.length > 0) {
      console.log('❌ User already exists:', email);
      return res.status(400).json({ error: 'Email already registered' });
    }
    
    console.log('✅ Email is available');

    // Hash password
    console.log('🔐 Hashing password...');
    const saltRounds = 10;
    const password_hashed = await bcrypt.hash(password, saltRounds);
    console.log('✅ Password hashed');

    // Insert user
    console.log('💾 Inserting user into database...');
    const result = await pool.query(
      'INSERT INTO users (full_name, email, password_hashed) VALUES ($1, $2, $3) RETURNING id, full_name, email',
      [full_name, email, password_hashed]
    );
    console.log('✅ User inserted:', result.rows[0].email);

    const user = result.rows[0];

    // Generate JWT
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET || 'your-secret-key-change-in-production',
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: user.id,
        full_name: user.full_name,
        email: user.email
      }
    });
  } catch (error) {
    console.error('❌ Registration error:', {
      message: error.message,
      code: error.code,
      stack: error.stack
    });
    
    // Provide more specific error messages
    if (error.code === '23505') {
      console.log('❌ Duplicate email error');
      return res.status(400).json({ error: 'Email already registered' });
    }
    
    if (error.code === 'ECONNREFUSED' || error.code === 'ENOTFOUND' || error.code === '28P01') {
      console.log('❌ Database connection error');
      return res.status(500).json({ 
        error: 'Database connection failed. Please check your database configuration.',
        details: error.message
      });
    }

    if (error.code === '3D000') {
      console.log('❌ Database does not exist');
      return res.status(500).json({ 
        error: 'Database does not exist. Please create the "finwise" database.',
        details: error.message
      });
    }

    console.log('❌ Unknown error occurred');
    res.status(500).json({ 
      error: 'Internal server error',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Find user
    const result = await pool.query(
      'SELECT id, full_name, email, password_hashed FROM users WHERE email = $1',
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const user = result.rows[0];

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password_hashed);

    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Generate JWT
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET || 'your-secret-key-change-in-production',
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        full_name: user.full_name,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get current user
router.get('/me', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, full_name, email, created_at FROM users WHERE id = $1',
      [req.user.userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ user: result.rows[0] });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;

