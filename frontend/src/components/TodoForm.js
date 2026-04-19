import React, { useState } from 'react';

function TodoForm({ onAdd }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    onAdd(title, description);
    setTitle('');
    setDescription('');
  };

  return (
    <form onSubmit={handleSubmit} style={{
      background: '#fff',
      padding: '20px',
      borderRadius: '8px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      marginBottom: '24px'
    }}>
      <h3 style={{ marginBottom: '12px', fontSize: '16px', color: '#555' }}>Add New Todo</h3>
      <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="What needs to be done?"
          style={{
            flex: 1,
            padding: '10px 14px',
            fontSize: '15px',
            border: '1px solid #ddd',
            borderRadius: '6px',
            outline: 'none'
          }}
        />
        <button type="submit" style={{
          padding: '10px 20px',
          fontSize: '15px',
          background: '#3498db',
          color: '#fff',
          border: 'none',
          borderRadius: '6px',
          cursor: 'pointer',
          fontWeight: 'bold'
        }}>
          Add
        </button>
      </div>
      <input
        type="text"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Description (optional)"
        style={{
          width: '100%',
          padding: '10px 14px',
          fontSize: '14px',
          border: '1px solid #ddd',
          borderRadius: '6px',
          outline: 'none'
        }}
      />
    </form>
  );
}

export default TodoForm;
