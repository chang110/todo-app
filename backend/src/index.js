const express = require('express');
const cors = require('cors');
const path = require('path');
const todoRoutes = require('./routes/todos');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// API routes
app.use('/api/todos', todoRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Todo App API is running' });
});

// Serve frontend static files in production
app.use(express.static(path.join(__dirname, '..', '..', 'frontend', 'build')));

// Catch-all: serve frontend for non-API routes (SPA fallback)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', '..', 'frontend', 'build', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Todo App API server running on http://localhost:${PORT}`);
});

module.exports = app;
