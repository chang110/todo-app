const express = require('express');
const router = express.Router();
const { run, all, get } = require('../db/database');

// GET /api/todos - Get all todos
router.get('/', async (req, res) => {
  try {
    const { completed } = req.query;
    let sql = 'SELECT * FROM todos';
    const params = [];

    if (completed !== undefined) {
      sql += ' WHERE completed = ?';
      params.push(parseInt(completed, 10));
    }

    sql += ' ORDER BY created_at DESC';
    const todos = await all(sql, params);
    res.json({ success: true, data: todos });
  } catch (err) {
    console.error('Error fetching todos:', err.message);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

// GET /api/todos/:id - Get a single todo
router.get('/:id', async (req, res) => {
  try {
    const todo = await get('SELECT * FROM todos WHERE id = ?', [req.params.id]);
    if (!todo) {
      return res.status(404).json({ success: false, error: 'Todo not found' });
    }
    res.json({ success: true, data: todo });
  } catch (err) {
    console.error('Error fetching todo:', err.message);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

// POST /api/todos - Create a new todo
router.post('/', async (req, res) => {
  try {
    const { title, description } = req.body;

    if (!title || title.trim() === '') {
      return res.status(400).json({ success: false, error: 'Title is required' });
    }

    const result = await run(
      'INSERT INTO todos (title, description, completed) VALUES (?, ?, 0)',
      [title.trim(), (description || '').trim()]
    );

    const todo = await get('SELECT * FROM todos WHERE id = ?', [result.lastID]);
    res.status(201).json({ success: true, data: todo });
  } catch (err) {
    console.error('Error creating todo:', err.message);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

// PUT /api/todos/:id - Update a todo
router.put('/:id', async (req, res) => {
  try {
    const existing = await get('SELECT * FROM todos WHERE id = ?', [req.params.id]);
    if (!existing) {
      return res.status(404).json({ success: false, error: 'Todo not found' });
    }

    const { title, description, completed } = req.body;
    const updates = [];
    const params = [];

    if (title !== undefined) {
      updates.push('title = ?');
      params.push(title.trim());
    }
    if (description !== undefined) {
      updates.push('description = ?');
      params.push(description.trim());
    }
    if (completed !== undefined) {
      updates.push('completed = ?');
      params.push(completed ? 1 : 0);
    }

    if (updates.length === 0) {
      return res.status(400).json({ success: false, error: 'No fields to update' });
    }

    updates.push('updated_at = CURRENT_TIMESTAMP');
    params.push(req.params.id);

    await run(`UPDATE todos SET ${updates.join(', ')} WHERE id = ?`, params);
    const todo = await get('SELECT * FROM todos WHERE id = ?', [req.params.id]);
    res.json({ success: true, data: todo });
  } catch (err) {
    console.error('Error updating todo:', err.message);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

// DELETE /api/todos/:id - Delete a todo
router.delete('/:id', async (req, res) => {
  try {
    const existing = await get('SELECT * FROM todos WHERE id = ?', [req.params.id]);
    if (!existing) {
      return res.status(404).json({ success: false, error: 'Todo not found' });
    }

    await run('DELETE FROM todos WHERE id = ?', [req.params.id]);
    res.json({ success: true, message: 'Todo deleted successfully' });
  } catch (err) {
    console.error('Error deleting todo:', err.message);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

// PATCH /api/todos/:id/toggle - Toggle todo completion
router.patch('/:id/toggle', async (req, res) => {
  try {
    const existing = await get('SELECT * FROM todos WHERE id = ?', [req.params.id]);
    if (!existing) {
      return res.status(404).json({ success: false, error: 'Todo not found' });
    }

    const newCompleted = existing.completed ? 0 : 1;
    await run(
      'UPDATE todos SET completed = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [newCompleted, req.params.id]
    );

    const todo = await get('SELECT * FROM todos WHERE id = ?', [req.params.id]);
    res.json({ success: true, data: todo });
  } catch (err) {
    console.error('Error toggling todo:', err.message);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

module.exports = router;
