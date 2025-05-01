const express = require('express');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const app = express();
app.use(express.json());

// Simple health check  
app.get('/', (req, res) => {
    res.send('Supabase API is running!');
});

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_PUBLIC_KEY);

// Auth routes
const authRoutes = require('./routes/auth')(supabase);
app.use('/api/auth', authRoutes);

// Gadget routes (protected)
const gadgetsRoutes = require('./routes/gadgets')(supabase);
app.use('/api/gadgets', gadgetsRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
