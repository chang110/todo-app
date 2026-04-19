import React, { useState } from 'react';

function TodoItem({ todo, onUpdate, onDelete, onToggle }) {
  const [editing, setEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(todo.title);
  const [editDescription, setEditDescription] = useState(todo.description);

  const handleSave = () => {
    if (!editTitle.trim()) return;
    onUpdate(todo.id, { title: editTitle, description: editDescription });
    setEditing(false);
  };

  const handleCancel = () => {
    setEditTitle(todo.title);
    setEditDescription(todo.description);
    setEditing(false);
  };

  return (
    <div style={{
      background: '#fff',
      padding: '16px',
      borderRadius: '8px',
      boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
      marginBottom: '10px',
      borderLeft: `4px solid ${todo.completed ? '#2ecc71' : '#3498db'}`,
      opacity: todo.completed ? 0.7 : 1
    }}>
      {editing ? (
        <div>
          <input
            type="text"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            placeholder="Title"
            style={{
              width: '100%',
              padding: '8px',
              fontSize: '15px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              marginBottom: '8px'
            }}
          />
          <input
            type="text"
            value={editDescription}
            onChange={(e) => setEditDescription(e.target.value)}
            placeholder="Description"
            style={{
              width: '100%',
              padding: '8px',
              fontSize: '14px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              marginBottom: '8px'
            }}
          />
          <div style={{ display: 'flex', gap: '8px' }}>
            <button onClick={handleSave} style={{
              padding: '6px 14px',
              background: '#2ecc71',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}>Save</button>
            <button onClick={handleCancel} style={{
              padding: '6px 14px',
              background: '#95a5a6',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}>Cancel</button>
          </div>
        </div>
      ) : (
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
          <input
            type="checkbox"
            checked={!!todo.completed}
            onChange={() => onToggle(todo.id)}
            style={{ marginTop: '4px', width: '18px', height: '18px', cursor: 'pointer' }}
          />
          <div style={{ flex: 1 }}>
            <h4 style={{
              fontSize: '16px',
              margin: '0 0 4px 0',
              textDecoration: todo.completed ? 'line-through' : 'none',
              color: todo.completed ? '#999' : '#2c3e50'
            }}>
              {todo.title}
            </h4>
            {todo.description && (
              <p style={{ fontSize: '14px', color: '#777', margin: 0 }}>
                {todo.description}
              </p>
            )}
            <p style={{ fontSize: '12px', color: '#bbb', margin: '6px 0 0 0' }}>
              Created: {new Date(todo.created_at).toLocaleString()}
            </p>
          </div>
          <button onClick={() => setEditing(true)} style={{
            padding: '4px 10px',
            background: 'transparent',
            border: '1px solid #3498db',
            color: '#3498db',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '13px'
          }}>Edit</button>
          <button onClick={() => onDelete(todo.id)} style={{
            padding: '4px 10px',
            background: 'transparent',
            border: '1px solid #e74c3c',
            color: '#e74c3c',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '13px'
          }}>Delete</button>
        </div>
      )}
    </div>
  );
}

function TodoList({ todos, onUpdate, onDelete, onToggle }) {
  if (todos.length === 0) {
    return (
      <div style={{
        textAlign: 'center',
        padding: '40px',
        color: '#aaa',
        fontSize: '16px',
        background: '#fff',
        borderRadius: '8px',
        boxShadow: '0 1px 4px rgba(0,0,0,0.08)'
      }}>
        No todos yet. Add one above!
      </div>
    );
  }

  return (
    <div>
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onUpdate={onUpdate}
          onDelete={onDelete}
          onToggle={onToggle}
        />
      ))}
    </div>
  );
}

export default TodoList;
