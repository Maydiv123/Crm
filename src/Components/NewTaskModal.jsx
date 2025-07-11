import React, { useState } from 'react';
import './NewTaskModal.css';

const quickOptions = [
  'In 15 minutes',
  'In 30 minutes',
  'In an hour',
  'Today',
  'Tomorrow',
  'This week',
  'In 7 days',
  'In 30 days',
  'In 1 year',
];

const timeSlots = [
  '12:00AM', '12:30AM', '1:00AM', '1:30AM', '2:00AM', '2:30AM', '3:00AM', '3:30AM',
  '4:00AM', '4:30AM', '5:00AM', '5:30AM', '6:00AM', '6:30AM', '7:00AM', '7:30AM',
  '8:00AM', '8:30AM', '9:00AM', '9:30AM', '10:00AM', '10:30AM', '11:00AM', '11:30AM',
  '12:00PM', '12:30PM', '1:00PM', '1:30PM', '2:00PM', '2:30PM', '3:00PM', '3:30PM',
  '4:00PM', '4:30PM', '5:00PM', '5:30PM', '6:00PM', '6:30PM', '7:00PM', '7:30PM',
  '8:00PM', '8:30PM', '9:00PM', '9:30PM', '10:00PM', '10:30PM', '11:00PM', '11:30PM',
];

function getMonthMatrix(date) {
  const d = new Date(date.getFullYear(), date.getMonth(), 1);
  const firstDay = d.getDay();
  const daysInMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  let matrix = [];
  let week = [];
  let dayNum = 1 - firstDay;
  for (let i = 0; i < 6; i++) {
    week = [];
    for (let j = 0; j < 7; j++) {
      let day = new Date(date.getFullYear(), date.getMonth(), dayNum);
      week.push(day);
      dayNum++;
    }
    matrix.push(week);
  }
  return matrix;
}

export default function NewTaskModal({ open, onClose, onAdd }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState(() => new Date().toISOString().slice(0,10));

  if (!open) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    onAdd({ title, description, due_date: dueDate });
    setTitle('');
    setDescription('');
    setDueDate(new Date().toISOString().slice(0,10));
    onClose();
  };

  return (
    <div className="calendar-newtask-overlay" onClick={onClose}>
      <div className="calendar-newtask-modal" onClick={e => e.stopPropagation()}>
        <div className="calendar-newtask-header">New Task</div>
        <form onSubmit={handleSubmit}>
          <input
            className="calendar-newtask-input"
            placeholder="Title"
            value={title}
            onChange={e => setTitle(e.target.value)}
            required
          />
          <textarea
            className="calendar-newtask-textarea"
            placeholder="Description"
            value={description}
            onChange={e => setDescription(e.target.value)}
          />
          <input
            className="calendar-newtask-input"
            type="date"
            value={dueDate}
            onChange={e => setDueDate(e.target.value)}
          />
          <div className="calendar-newtask-actions">
            <button type="submit" className="calendar-newtask-save">Save</button>
            <button type="button" className="calendar-newtask-cancel" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
} 