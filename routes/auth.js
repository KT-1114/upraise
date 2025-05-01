const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

module.exports = (supabase) => {
  const router = express.Router();

  // POST /api/auth/register
  router.post('/register', async (req, res) => {
    const { username, password } = req.body;

    // Check for existing user
    const { data: existing } = await supabase
      .from('users')
      .select('id')
      .eq('username', username)
      .maybeSingle();

    if (existing) {
      return res.status(409).json({ error: 'Username already taken' });
    }

    const hashed = await bcrypt.hash(password, 10);
    const { data, error } = await supabase
      .from('users')
      .insert([{ username, password: hashed }])
      .select();

    if (error) return res.status(500).json({ error: error.message });

    res.status(201).json({ message: 'User registered successfully' });
  });

  // POST /api/auth/login
  router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('username', username)
      .maybeSingle();

    if (error || !user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user.id, username: user.username }, process.env.JWT_SECRET_KEY, {
      expiresIn: '1h'
    });

    res.json({ token });
  });

  return router;
};
