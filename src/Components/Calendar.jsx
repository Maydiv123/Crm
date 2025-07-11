import React, { useState } from 'react';
import './Calendar.css';
import { FaPhone, FaBriefcase, FaRegClock } from 'react-icons/fa';
import NewTaskModal from './NewTaskModal';
import './NewTaskModal.css';
import { tasksAPI } from '../services/api';

function getWeekDates(date) {
  // Returns array of Date objects for the week (Sun-Sat) containing 'date'
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
  // Returns a matrix (array of weeks) for the month containing 'date'
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
  const [tab, setTab] = useState('day');
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
    { icon: <FaRegClock />, value: '', disabled: true },
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
  const [tasks, setTasks] = useState([]);

  // Fetch tasks on mount
  React.useEffect(() => {
    tasksAPI.getAll().then(res => {
      console.log('API response for tasks:', res);
      if (res.data && res.data.tasks) {
        setTasks(res.data.tasks);
        console.log('Tasks set in state:', res.data.tasks);
      }
    });
  }, []);

  // Add new task handler
  const handleAddTask = async (task) => {
    await tasksAPI.create(task);
    // Refetch tasks after adding
    const res = await tasksAPI.getAll();
    console.log('API response after adding task:', res);
    if (res.data && res.data.tasks) {
      setTasks(res.data.tasks);
      console.log('Tasks set in state after add:', res.data.tasks);
    }
  };

  return (
    <div className="calendar-root">
      <div className="calendar-header">
        <div className="calendar-tabs">
          <button className={tab === 'day' ? 'active' : ''} onClick={() => setTab('day')}>DAY</button>
          <button className={tab === 'week' ? 'active' : ''} onClick={() => setTab('week')}>WEEK</button>
          <button className={tab === 'month' ? 'active' : ''} onClick={() => setTab('month')}>MONTH</button>
        </div>
        <div className="calendar-filters">
          <button className="calendar-my-tasks active">My Tasks</button>
          <button className="calendar-new-filter" onClick={() => setShowFilterPanel(true)}>New filter</button>
        </div>
        <div className="calendar-header-actions">
          <span className="calendar-todos-count">0 to-dos</span>
          <button className="calendar-sync-btn">SYNC</button>
          <div style={{ position: 'relative', display: 'inline-block' }}>
            <button className="calendar-menu-btn" onClick={() => setMenuOpen((v) => !v)}>⋮</button>
            {menuOpen && (
              <div className="calendar-menu-dropdown">
                <div className="calendar-menu-option">Export</div>
                <div className="calendar-menu-option" onClick={() => { setShowManageTaskTypes(true); setMenuOpen(false); }}>Manage task types</div>
              </div>
            )}
          </div>
          <button className="calendar-new-task-btn" onClick={() => { setShowNewTaskModal(true); console.log('Button clicked, modal should open'); }}>+ NEW TASK</button>
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
                {weekDates.map((d, i) => (
                  <div className="calendar-week-day-header" key={i}>
                    <div>{d.toLocaleDateString(undefined, { weekday: 'short' })}</div>
                    <div>{d.getDate()}</div>
                  </div>
                ))}
              </div>
              <div className="calendar-week-days-cols">
                {weekDates.map((d, i) => (
                  <div className="calendar-week-day-col" key={i}>
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
              {tasks.filter(
                t => t.due_date && t.due_date.slice(0,10) === dayDate.toISOString().slice(0,10)
              ).map(task => (
                <div key={task.id} className="calendar-task-item">
                  <b>{task.title}</b><br/>{task.description}
                </div>
              ))}
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
                  const isFirstOfMonth = day.getDate() === 1 && isCurrentMonth;
                  return (
                    <div className={`calendar-month-cell${isCurrentMonth ? '' : ' calendar-month-cell-out'}`} key={j}>
                      <div className="calendar-month-cell-date">
                        {isFirstOfMonth
                          ? `${day.getDate()} ${day.toLocaleDateString(undefined, { month: 'short', year: 'numeric' })}`
                          : day.getDate()}
                      </div>
                      {/* Show tasks for this day */}
                      {tasks.filter(t => t.due_date && t.due_date.slice(0,10) === day.toISOString().slice(0,10))
                        .map(task => (
                          <div key={task.id} className="calendar-task-item" style={{fontSize: '0.9em', marginTop: 2}}>
                            {task.title}
                          </div>
                      ))}
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
    </div>
  );
};

export default Calendar;
