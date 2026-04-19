import React, { useState, useEffect } from 'react';
import TodoList from './components/TodoList';
import TodoForm from './components/TodoForm';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

function App() {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTodos = async () => {
    try {
      const res = await fetch(`${API_URL}/todos`);
      const json = await res.json();
      setTodos(json.data || []);
    } catch (err) {
      console.error('Failed to fetch todos:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  const addTodo = async (title, description) => {
    try {
      const res = await fetch(`${API_URL}/todos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description }),
      });
      const json = await res.json();
      if (json.success) {
        setTodos(prev => [json.data, ...prev]);
      }
    } catch (err) {
      console.error('Failed to add todo:', err);
    }
  };

  const updateTodo = async (id, updates) => {
    try {
      const res = await fetch(`${API_URL}/todos/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      const json = await res.json();
      if (json.success) {
        setTodos(prev => prev.map(t => (t.id === id ? json.data : t)));
      }
    } catch (err) {
      console.error('Failed to update todo:', err);
    }
  };

  const deleteTodo = async (id) => {
    try {
      const res = await fetch(`${API_URL}/todos/${id}`, {
        method: 'DELETE',
      });
      const json = await res.json();
      if (json.success) {
        setTodos(prev => prev.filter(t => t.id !== id));
      }
    } catch (err) {
      console.error('Failed to delete todo:', err);
    }
  };

  const toggleTodo = async (id) => {
    try {
      const res = await fetch(`${API_URL}/todos/${id}/toggle`, {
        method: 'PATCH',
      });
      const json = await res.json();
      if (json.success) {
        setTodos(prev => prev.map(t => (t.id === id ? json.data : t)));
      }
    } catch (err) {
      console.error('Failed to toggle todo:', err);
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', marginTop: '50px', fontSize: '18px', color: '#888' }}>
        Loading...
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '700px', margin: '0 auto', padding: '20px' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '30px', fontSize: '28px', color: '#2c3e50' }}>
        📝 Todo App
      </h1>
      <TodoForm onAdd={addTodo} />
      <TodoList
        todos={todos}
        onUpdate={updateTodo}
        onDelete={deleteTodo}
        onToggle={toggleTodo}
      />
    </div>
  );
}

export default App;
