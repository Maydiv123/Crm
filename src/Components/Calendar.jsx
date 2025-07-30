import React, { useState } from 'react';
import './Calendar.css';
import { FaPhone, FaBriefcase, FaRegClock, FaCalendarAlt, FaPlus, FaSync, FaEllipsisV } from 'react-icons/fa';
import NewTaskModal from './NewTaskModal';
import TaskDetailsModal from './TaskDetailsModal';
import './NewTaskModal.css';
import './TaskDetailsModal.css';
import { tasksAPI } from '../services/api';

function getWeekDates(date) {
  const d = new Date(date);
  const week = [];
  const sunday = new Date(d.setDate(d.getDate() - d.getDay()));
  for (let i = 0; i < 7; i++) {
    const day = new Date(sunday);
    day.setDate(sunday.getDate() + i);
    week.push(day);
  }
  return week;
}

function getMonthMatrix(date) {
  const d = new Date(date.getFullYear(), date.getMonth(), 1);
  const firstDay = d.getDay();
  const daysInMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  const prevMonthDays = new Date(date.getFullYear(), date.getMonth(), 0).getDate();
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

const Calendar = () => {
  const [tab, setTab] = useState('month');
  const [weekStart, setWeekStart] = useState(() => {
    const now = new Date();
    return new Date(now.setDate(now.getDate() - now.getDay()));
  });
  const [dayDate, setDayDate] = useState(() => new Date());
  const weekDates = getWeekDates(weekStart);
  const timeSlots = Array.from({ length: 13 }, (_, i) => `${6 + i}:00AM`.replace('12:00AM', '12:00PM').replace('13:00AM', '1:00PM').replace('11:00AM', '11:00AM').replace('12:00PM', '12:00PM').replace('13:00PM', '1:00PM'));
  const [monthDate, setMonthDate] = useState(() => new Date());
  const monthMatrix = getMonthMatrix(monthDate);
  const [menuOpen, setMenuOpen] = useState(false);
  const [showManageTaskTypes, setShowManageTaskTypes] = useState(false);
  const [taskTypes, setTaskTypes] = useState([
    { icon: <FaPhone />, value: 'Follow-up' },
    { icon: <FaBriefcase />, value: 'Meeting' },
    { icon: <FaRegClock />, value: 'Reminder' },
  ]);
  const handleTaskTypeChange = (i, val) => {
    setTaskTypes(prev => prev.map((t, idx) => idx === i ? { ...t, value: val } : t));
  };

  const handlePrevWeek = () => {
    setWeekStart(prev => new Date(prev.getFullYear(), prev.getMonth(), prev.getDate() - 7));
  };
  const handleNextWeek = () => {
    setWeekStart(prev => new Date(prev.getFullYear(), prev.getMonth(), prev.getDate() + 7));
  };
  const handleToday = () => {
    const now = new Date();
    setWeekStart(new Date(now.setDate(now.getDate() - now.getDay())));
    setDayDate(new Date());
  };
  const handlePrevDay = () => {
    setDayDate(prev => new Date(prev.getFullYear(), prev.getMonth(), prev.getDate() - 1));
  };
  const handleNextDay = () => {
    setDayDate(prev => new Date(prev.getFullYear(), prev.getMonth(), prev.getDate() + 1));
  };
  const handlePrevMonth = () => {
    setMonthDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };
  const handleNextMonth = () => {
    setMonthDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };
  const handleMonthToday = () => {
    setMonthDate(new Date());
  };
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const filterCategories = [
    'My Tasks',
    'Uncompleted Tasks',
    'Completed Tasks',
    'All Tasks',
    'Deleted Tasks',
  ];
  const filterFields = [
    { placeholder: 'Any time' },
    { placeholder: 'All types' },
    { placeholder: 'Pipelines, stages' },
    { placeholder: 'All stages' },
    { placeholder: 'Abhishek' },
    { placeholder: 'Creator' },
  ];
  const [showNewTaskModal, setShowNewTaskModal] = useState(false);
  const [showTaskDetailsModal, setShowTaskDetailsModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch tasks on mount
  React.useEffect(() => {
    const fetchTasks = () => {
      setIsLoading(true);
      tasksAPI.getAllTasks().then(res => {
        if (res.data && res.data.tasks) {
          setTasks(res.data.tasks);
          console.log('Fetched tasks:', res.data.tasks.length);
        }
        setIsLoading(false);
      }).catch(err => {
        console.error('Error fetching tasks:', err);
        setIsLoading(false);
      });
    };
    fetchTasks();
    const handler = () => fetchTasks();
    window.addEventListener('tasks-updated', handler);
    return () => window.removeEventListener('tasks-updated', handler);
  }, []);

  // Add new task handler
  const handleAddTask = async (task) => {
    try {
      const response = await tasksAPI.create(task);
      console.log('Task created:', response.data);
      
      setTasks(prevTasks => [...prevTasks, response.data]);
      
      const res = await tasksAPI.getAllTasks();
      if (res.data && res.data.tasks) {
        setTasks(res.data.tasks);
        console.log('Tasks updated after adding:', res.data.tasks.length);
      }
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  // Task details handlers
  const handleTaskClick = (task) => {
    setSelectedTask(task);
    setShowTaskDetailsModal(true);
  };

  const handleCloseTaskDetails = () => {
    setShowTaskDetailsModal(false);
    setSelectedTask(null);
  };

  const handleEditTask = (task) => {
    // For now, just close the details modal
    // You can implement edit functionality later
    setShowTaskDetailsModal(false);
    setSelectedTask(null);
    console.log('Edit task:', task);
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await tasksAPI.delete(taskId);
      setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
      setShowTaskDetailsModal(false);
      setSelectedTask(null);
      console.log('Task deleted:', taskId);
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  // Helper function to get tasks for a specific date
  const getTasksForDate = (date) => {
    const dateString = date.toISOString().slice(0, 10);
    return tasks.filter(task => task.due_date && task.due_date.slice(0, 10) === dateString);
  };

  // Helper function to format task display
  const formatTaskDisplay = (task) => {
    // Determine task type and priority for styling
    const getTaskTypeClass = () => {
      if (task.type) {
        const type = task.type.toLowerCase();
        if (type.includes('follow') || type.includes('call')) return 'follow-up';
        if (type.includes('meet') || type.includes('appointment')) return 'meeting';
        if (type.includes('remind') || type.includes('note')) return 'reminder';
      }
      return '';
    };

    const getPriorityClass = () => {
      if (task.priority) {
        const priority = task.priority.toLowerCase();
        if (priority.includes('high') || priority.includes('urgent')) return 'high-priority';
        if (priority.includes('medium') || priority.includes('normal')) return 'medium-priority';
        if (priority.includes('low')) return 'low-priority';
      }
      return '';
    };

    const getStatusClass = () => {
      if (task.status && task.status.toLowerCase().includes('complete')) return 'completed';
      return '';
    };

    const taskClasses = [
      'calendar-task-item',
      getTaskTypeClass(),
      getPriorityClass(),
      getStatusClass()
    ].filter(Boolean).join(' ');

    return (
      <div 
        key={task.id} 
        className={taskClasses}
        onClick={() => handleTaskClick(task)}
        style={{ cursor: 'pointer' }}
      >
        <div style={{ 
          fontWeight: '700', 
          fontSize: '12px', 
          marginBottom: '4px',
          textShadow: '0 1px 2px rgba(0,0,0,0.1)'
        }}>
          {task.title}
        </div>
        {task.description && (
          <div style={{ 
            fontSize: '10px', 
            opacity: 0.9, 
            lineHeight: '1.3',
            textShadow: '0 1px 1px rgba(0,0,0,0.1)'
          }}>
            {task.description.length > 25 ? task.description.substring(0, 25) + '...' : task.description}
          </div>
        )}
        {task.due_time && (
          <div style={{ 
            fontSize: '9px', 
            opacity: 0.8, 
            marginTop: '3px',
            fontWeight: '500',
            textShadow: '0 1px 1px rgba(0,0,0,0.1)'
          }}>
            ⏰ {task.due_time}
          </div>
        )}
      </div>
    );
  };

  // Get task count for today
  const getTodayTaskCount = () => {
    const today = new Date();
    return getTasksForDate(today).length;
  };

  return (
    <div className="calendar-root">
      <div className="calendar-header">
        <div className="calendar-tabs">
          <button className={tab === 'day' ? 'active' : ''} onClick={() => setTab('day')}>
            <FaCalendarAlt style={{ marginRight: '6px' }} />
            DAY
          </button>
          <button className={tab === 'week' ? 'active' : ''} onClick={() => setTab('week')}>
            <FaCalendarAlt style={{ marginRight: '6px' }} />
            WEEK
          </button>
          <button className={tab === 'month' ? 'active' : ''} onClick={() => setTab('month')}>
            <FaCalendarAlt style={{ marginRight: '6px' }} />
            MONTH
          </button>
        </div>
        <div className="calendar-filters">
          <button className="calendar-my-tasks active">My Tasks</button>
          <button className="calendar-new-filter" onClick={() => setShowFilterPanel(true)}>New filter</button>
        </div>
        <div className="calendar-header-actions">
          <span className="calendar-todos-count">
            {isLoading ? 'Loading...' : `${getTodayTaskCount()} to-dos today`}
          </span>
          <button className="calendar-sync-btn" onClick={() => window.location.reload()}>
            <FaSync style={{ marginRight: '6px' }} />
            SYNC
          </button>
          <div style={{ position: 'relative', display: 'inline-block' }}>
            <button className="calendar-menu-btn" onClick={() => setMenuOpen((v) => !v)}>
              <FaEllipsisV />
            </button>
            {menuOpen && (
              <div className="calendar-menu-dropdown">
                <div className="calendar-menu-option">Export Calendar</div>
                <div className="calendar-menu-option" onClick={() => { setShowManageTaskTypes(true); setMenuOpen(false); }}>Manage task types</div>
                <div className="calendar-menu-option">Settings</div>
              </div>
            )}
          </div>
          <button className="calendar-new-task-btn" onClick={() => { setShowNewTaskModal(true); console.log('Button clicked, modal should open'); }}>
            <FaPlus style={{ marginRight: '6px' }} />
            NEW TASK
          </button>
        </div>
      </div>
      {tab === 'week' ? (
        <div className="calendar-week-view">
          <div className="calendar-week-toolbar">
            <button className="calendar-week-arrow" onClick={handlePrevWeek}>&lt;</button>
            <span className="calendar-week-range">
              {weekDates[0].toLocaleDateString(undefined, { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}
              {' - '}
              {weekDates[6].toLocaleDateString(undefined, { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}
            </span>
            <button className="calendar-week-arrow" onClick={handleNextWeek}>&gt;</button>
            <button className="calendar-today-btn" onClick={handleToday}>Today</button>
          </div>
          <div className="calendar-week-grid">
            <div className="calendar-week-times">
              <div className="calendar-week-times-header" />
              {timeSlots.map((slot, i) => (
                <div className="calendar-week-time" key={i}>{slot}</div>
              ))}
            </div>
            <div className="calendar-week-days">
              <div className="calendar-week-days-row">
                {weekDates.map((d, i) => {
                  const isToday = d.toDateString() === new Date().toDateString();
                  return (
                    <div className="calendar-week-day-header" key={i} style={{
                      background: isToday ? 'rgba(102, 126, 234, 0.1)' : 'rgba(248, 249, 250, 0.9)'
                    }}>
                      <div style={{ fontSize: '12px', fontWeight: '500', color: '#6c757d', marginBottom: '4px' }}>
                        {d.toLocaleDateString(undefined, { weekday: 'short' })}
                      </div>
                      <div style={{ 
                        fontSize: '18px', 
                        fontWeight: '600',
                        color: isToday ? '#667eea' : '#2c3e50'
                      }}>
                        {d.getDate()}
                      </div>
                  </div>
                  );
                })}
              </div>
              <div className="calendar-week-days-cols">
                {weekDates.map((d, i) => (
                  <div className="calendar-week-day-col" key={i}>
                    {getTasksForDate(d).map(task => formatTaskDisplay(task))}
                    {timeSlots.map((_, j) => (
                      <div className="calendar-week-cell" key={j}></div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : tab === 'day' ? (
        <div className="calendar-day-view">
          <div className="calendar-day-toolbar">
            <button className="calendar-week-arrow" onClick={handlePrevDay}>&lt;</button>
            <span className="calendar-day-date">
              {dayDate.toLocaleDateString(undefined, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
            </span>
            <button className="calendar-week-arrow" onClick={handleNextDay}>&gt;</button>
            <button className="calendar-today-btn" onClick={handleToday}>Today</button>
          </div>
          <div className="calendar-day-grid">
            <div className="calendar-week-times">
              <div className="calendar-week-times-header" />
              {timeSlots.map((slot, i) => (
                <div className="calendar-week-time" key={i}>{slot}</div>
              ))}
            </div>
            <div className="calendar-day-col">
              <div className="calendar-day-header">All day</div>
              {getTasksForDate(dayDate).map(task => formatTaskDisplay(task))}
              {timeSlots.map((_, j) => (
                <div className="calendar-day-cell" key={j}></div>
              ))}
            </div>
          </div>
        </div>
      ) : tab === 'month' ? (
        <div className="calendar-month-view">
          <div className="calendar-month-toolbar">
            <button className="calendar-week-arrow" onClick={handlePrevMonth}>&lt;</button>
            <span className="calendar-month-label">
              {monthDate.toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}
            </span>
            <button className="calendar-week-arrow" onClick={handleNextMonth}>&gt;</button>
            <button className="calendar-today-btn" onClick={handleMonthToday}>Today</button>
          </div>
          <div className="calendar-month-grid">
            <div className="calendar-month-days-row">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d, i) => (
                <div className="calendar-month-day-header" key={i}>{d}</div>
              ))}
            </div>
            {monthMatrix.map((week, i) => (
              <div className="calendar-month-week" key={i}>
                {week.map((day, j) => {
                  const isCurrentMonth = day.getMonth() === monthDate.getMonth();
                  const isToday = day.toDateString() === new Date().toDateString();
                  const dayTasks = getTasksForDate(day);
                  
                  return (
                    <div className={`calendar-month-cell${isCurrentMonth ? '' : ' calendar-month-cell-out'}`} key={j}>
                      <div className="calendar-month-cell-date" style={{
                        color: isToday ? '#667eea' : undefined,
                        fontWeight: isToday ? '700' : '600',
                        background: isToday ? 'rgba(102, 126, 234, 0.1)' : 'transparent',
                        borderRadius: '50%',
                        width: '24px',
                        height: '24px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginBottom: '8px'
                      }}>
                        {day.getDate()}
                      </div>
                      {dayTasks.slice(0, 3).map(task => {
                        const getTaskTypeClass = () => {
                          if (task.type) {
                            const type = task.type.toLowerCase();
                            if (type.includes('follow') || type.includes('call')) return 'follow-up';
                            if (type.includes('meet') || type.includes('appointment')) return 'meeting';
                            if (type.includes('remind') || type.includes('note')) return 'reminder';
                          }
                          return '';
                        };

                        const getPriorityClass = () => {
                          if (task.priority) {
                            const priority = task.priority.toLowerCase();
                            if (priority.includes('high') || priority.includes('urgent')) return 'high-priority';
                            if (priority.includes('medium') || priority.includes('normal')) return 'medium-priority';
                            if (priority.includes('low')) return 'low-priority';
                          }
                          return '';
                        };

                        const getStatusClass = () => {
                          if (task.status && task.status.toLowerCase().includes('complete')) return 'completed';
                          return '';
                        };

                        const taskClasses = [
                          'calendar-task-item',
                          getTaskTypeClass(),
                          getPriorityClass(),
                          getStatusClass()
                        ].filter(Boolean).join(' ');

                        return (
                          <div 
                            key={task.id} 
                            className={taskClasses} 
                            style={{
                              fontSize: '9px',
                              marginTop: '3px',
                              padding: '6px 8px',
                              borderRadius: '8px',
                              cursor: 'pointer'
                            }}
                            onClick={() => handleTaskClick(task)}
                          >
                            <div style={{ 
                              fontWeight: '700', 
                              marginBottom: '2px',
                              textShadow: '0 1px 1px rgba(0,0,0,0.1)'
                            }}>
                              {task.title.length > 12 ? task.title.substring(0, 12) + '...' : task.title}
                            </div>
                          </div>
                        );
                      })}
                      {dayTasks.length > 3 && (
                        <div className="calendar-task-count" style={{
                          fontSize: '9px',
                          marginTop: '4px',
                          display: 'inline-block'
                        }}>
                          +{dayTasks.length - 3} more
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="calendar-board">
          <div className="calendar-col">
            <div className="calendar-col-title">TO-DO TODAY</div>
            <div className="calendar-col-count">0 to-dos</div>
            <div className="calendar-col-list"><div className="calendar-col-empty" /></div>
          </div>
          <div className="calendar-col">
            <div className="calendar-col-title">TO-DO TOMORROW</div>
            <div className="calendar-col-count">0 to-dos</div>
            <div className="calendar-col-list"><div className="calendar-col-empty" /></div>
          </div>
        </div>
      )}
      
      {showManageTaskTypes && (
        <div className="calendar-manage-task-overlay">
          <div className="calendar-manage-task-content">
            <div className="calendar-manage-task-header">
              <span>Manage task types</span>
              <button className="calendar-manage-task-close" onClick={() => setShowManageTaskTypes(false)}>×</button>
            </div>
            <form className="calendar-manage-task-form" onSubmit={e => { e.preventDefault(); setShowManageTaskTypes(false); }}>
              {taskTypes.map((t, i) => (
                <div className="calendar-manage-task-row" key={i}>
                  <span className="calendar-manage-task-icon">{t.icon}</span>
                  <input
                    className="calendar-manage-task-input"
                    value={t.value}
                    onChange={e => handleTaskTypeChange(i, e.target.value)}
                    placeholder={i === 2 ? 'Custom task type' : ''}
                    disabled={!!t.disabled}
                  />
                </div>
              ))}
              <div className="calendar-manage-task-actions">
                <button type="submit" className="calendar-manage-task-save">Save</button>
                <button type="button" className="calendar-manage-task-cancel" onClick={() => setShowManageTaskTypes(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
      {showFilterPanel && (
        <div className="calendar-filter-overlay" onClick={e => { if (e.target.classList.contains('calendar-filter-overlay')) setShowFilterPanel(false); }}>
          <div className="calendar-filter-panel">
            <div className="calendar-filter-left">
              {filterCategories.map((cat, i) => (
                <div className={`calendar-filter-category${i === 0 ? ' active' : ''}`} key={i}>{cat}</div>
              ))}
            </div>
            <div className="calendar-filter-right">
              {filterFields.map((f, i) => (
                <input className="calendar-filter-input" key={i} placeholder={f.placeholder} />
              ))}
            </div>
          </div>
        </div>
      )}
      <NewTaskModal open={showNewTaskModal} onClose={() => setShowNewTaskModal(false)} onAdd={handleAddTask} />
      <TaskDetailsModal 
        task={selectedTask}
        isOpen={showTaskDetailsModal}
        onClose={handleCloseTaskDetails}
        onEdit={handleEditTask}
        onDelete={handleDeleteTask}
      />
    </div>
  );
};

export default Calendar;
