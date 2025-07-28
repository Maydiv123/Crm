import React, { useState, useEffect } from 'react';
import { tasksAPI } from '../services/api.js';
import './UserCalendar.css';

export default function UserCalendar({ userId, userName, onClose }) {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);

  useEffect(() => {
    fetchTasks();
  }, [userId, currentMonth]);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const response = await tasksAPI.getCalendarTasks(userId);
      setTasks(response.data.tasks || []);
    } catch (error) {
      console.error('Failed to fetch tasks:', error);
      setError('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  const updateTaskStatus = async (taskId, status) => {
    try {
      await tasksAPI.updateStatus(taskId, status);
      fetchTasks(); // Refresh tasks
      setSelectedTask(null);
    } catch (error) {
      console.error('Failed to update task status:', error);
      setError('Failed to update task status');
    }
  };

  const deleteTask = async (taskId) => {
    if (!window.confirm('Are you sure you want to delete this task?')) {
      return;
    }

    try {
      await tasksAPI.delete(taskId);
      fetchTasks(); // Refresh tasks
      setSelectedTask(null);
    } catch (error) {
      console.error('Failed to delete task:', error);
      setError('Failed to delete task');
    }
  };

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDay = firstDay.getDay();

    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDay; i++) {
      days.push(null);
    }

    // Add all days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }

    return days;
  };

  const getTasksForDate = (date) => {
    if (!date) return [];
    const dateStr = date.toISOString().split('T')[0];
    return tasks.filter(task => task.due_date === dateStr);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return '#27ae60';
      case 'in_progress': return '#f39c12';
      case 'cancelled': return '#e74c3c';
      default: return '#3498db';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'completed': return 'Completed';
      case 'in_progress': return 'In Progress';
      case 'cancelled': return 'Cancelled';
      default: return 'Pending';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const days = getDaysInMonth(currentMonth);
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  if (loading) {
    return (
      <div className="user-calendar-overlay">
        <div className="user-calendar-content">
          <div className="user-calendar-loading">Loading calendar...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="user-calendar-overlay">
      <div className="user-calendar-content">
        <div className="user-calendar-header">
          <h2>{userName}'s Calendar</h2>
          <button className="user-calendar-close" onClick={onClose}>×</button>
        </div>

        {error && <div className="user-calendar-error">{error}</div>}

        <div className="user-calendar-controls">
          <button onClick={prevMonth}>&lt; Previous</button>
          <h3>{monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}</h3>
          <button onClick={nextMonth}>Next &gt;</button>
        </div>

        <div className="user-calendar-grid">
          <div className="user-calendar-weekdays">
            <div>Sun</div>
            <div>Mon</div>
            <div>Tue</div>
            <div>Wed</div>
            <div>Thu</div>
            <div>Fri</div>
            <div>Sat</div>
          </div>

          <div className="user-calendar-days">
            {days.map((day, index) => {
              const dayTasks = getTasksForDate(day);
              const isToday = day && day.toDateString() === new Date().toDateString();
              const isSelected = selectedDate && day && day.toDateString() === selectedDate.toDateString();

              return (
                <div
                  key={index}
                  className={`user-calendar-day ${!day ? 'empty' : ''} ${isToday ? 'today' : ''} ${isSelected ? 'selected' : ''}`}
                  onClick={() => day && setSelectedDate(day)}
                >
                  {day && <span className="day-number">{day.getDate()}</span>}
                  {dayTasks.length > 0 && (
                    <div className="day-tasks">
                      {dayTasks.slice(0, 2).map(task => (
                        <div
                          key={task.id}
                          className="day-task-indicator"
                          style={{ backgroundColor: getStatusColor(task.status) }}
                          title={task.title}
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedTask(task);
                          }}
                        />
                      ))}
                      {dayTasks.length > 2 && (
                        <div className="more-tasks">+{dayTasks.length - 2}</div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {selectedDate && (
          <div className="user-calendar-day-details">
            <h4>Tasks for {selectedDate.toLocaleDateString()}</h4>
            {getTasksForDate(selectedDate).length === 0 ? (
              <p>No tasks scheduled for this date.</p>
            ) : (
              <div className="day-tasks-list">
                {getTasksForDate(selectedDate).map(task => (
                  <div key={task.id} className="day-task-item">
                    <div className="task-info">
                      <h5>{task.title}</h5>
                      <p>{task.description}</p>
                      <small>Type: {task.type} | Assigned by: {task.assigned_by_name}</small>
                    </div>
                    <div className="task-actions">
                      <select
                        value={task.status}
                        onChange={(e) => updateTaskStatus(task.id, e.target.value)}
                      >
                        <option value="pending">Pending</option>
                        <option value="in_progress">In Progress</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                      <button onClick={() => deleteTask(task.id)}>Delete</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {selectedTask && (
          <div className="user-calendar-task-modal">
            <div className="task-modal-content">
              <h3>{selectedTask.title}</h3>
              <p><strong>Description:</strong> {selectedTask.description}</p>
              <p><strong>Due Date:</strong> {formatDate(selectedTask.due_date)}</p>
              <p><strong>Type:</strong> {selectedTask.type}</p>
              <p><strong>Status:</strong> {getStatusText(selectedTask.status)}</p>
              <p><strong>Assigned by:</strong> {selectedTask.assigned_by_name}</p>
              
              <div className="task-modal-actions">
                <select
                  value={selectedTask.status}
                  onChange={(e) => updateTaskStatus(selectedTask.id, e.target.value)}
                >
                  <option value="pending">Pending</option>
                  <option value="in_progress">In Progress</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
                <button onClick={() => deleteTask(selectedTask.id)}>Delete Task</button>
                <button onClick={() => setSelectedTask(null)}>Close</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 