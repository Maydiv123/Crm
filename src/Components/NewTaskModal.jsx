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

const NewTaskModal = ({ open, onClose }) => {
  const [selectedQuick, setSelectedQuick] = useState('Tomorrow');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState('12:00AM');
  const [monthDate, setMonthDate] = useState(new Date());
  const [showAdvanced, setShowAdvanced] = useState(false);
  const monthMatrix = getMonthMatrix(monthDate);

  if (!open) return null;

  if (!showAdvanced) {
    // Simple modal with quick options
    return (
      <div className="ntm2-overlay">
        <div className="ntm2-modal" style={{minWidth: 350, minHeight: 120, padding: 32}}>
          <input className="ntm2-input" placeholder="Contact, lead or customer" style={{marginBottom: 16}} />
          <div style={{display: 'flex', alignItems: 'center', gap: 8, marginBottom: 18}}>
            {quickOptions.map(opt => (
              <button
                key={opt}
                className={`ntm2-quick-opt${selectedQuick === opt ? ' selected' : ''}`}
                style={{fontSize: '1.08rem', padding: '6px 16px', border: 'none', background: '#f7f8fa', borderRadius: 6, cursor: 'pointer'}}
                onClick={() => { setSelectedQuick(opt); setShowAdvanced(true); }}
              >
                {opt}
              </button>
            ))}
          </div>
          <div style={{marginBottom: 18}}>
            for <a href="#" className="ntm2-user">Abhishek</a>:
            <span className="ntm2-type"><span className="ntm2-type-icon">🔄</span> <b>Follow-up</b></span>
          </div>
          <div className="ntm2-actions">
            <button className="ntm2-set" onClick={onClose}>Set</button>
            <button className="ntm2-cancel" onClick={onClose}>Cancel</button>
          </div>
        </div>
      </div>
    );
  }

  // Advanced calendar/time picker UI (existing code)
  return (
    <div className="ntm2-overlay">
      <div className="ntm2-modal">
        <div className="ntm2-top">
          <input className="ntm2-input" placeholder="Contact or lead" />
          <span className="ntm2-for">for <a href="#" className="ntm2-user">Abhishek</a>:</span>
          <span className="ntm2-type"><span className="ntm2-type-icon">🔄</span> <b>Follow-up</b></span>
        </div>
        <div className="ntm2-content">
          <div className="ntm2-quick">
            {quickOptions.map(opt => (
              <div
                key={opt}
                className={`ntm2-quick-opt${selectedQuick === opt ? ' selected' : ''}`}
                onClick={() => setSelectedQuick(opt)}
              >
                {opt}
              </div>
            ))}
          </div>
          <div className="ntm2-calendar">
            <div className="ntm2-cal-header">
              <button onClick={() => setMonthDate(new Date(monthDate.getFullYear(), monthDate.getMonth() - 1, 1))}>{'<'}</button>
              <span>{monthDate.toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}</span>
              <button onClick={() => setMonthDate(new Date(monthDate.getFullYear(), monthDate.getMonth() + 1, 1))}>{'>'}</button>
            </div>
            <div className="ntm2-cal-grid">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(d => (
                <div className="ntm2-cal-dayhead" key={d}>{d}</div>
              ))}
              {monthMatrix.flat().map((day, i) => {
                const isCurrentMonth = day.getMonth() === monthDate.getMonth();
                const isSelected = selectedDate.toDateString() === day.toDateString();
                return (
                  <div
                    key={i}
                    className={`ntm2-cal-cell${isCurrentMonth ? '' : ' out'}${isSelected ? ' selected' : ''}`}
                    onClick={() => isCurrentMonth && setSelectedDate(day)}
                  >
                    {day.getDate()}
                  </div>
                );
              })}
            </div>
          </div>
          <div className="ntm2-times">
            {timeSlots.map(t => (
              <div
                key={t}
                className={`ntm2-time-opt${selectedTime === t ? ' selected' : ''}`}
                onClick={() => setSelectedTime(t)}
              >
                {t}
              </div>
            ))}
          </div>
        </div>
        <div className="ntm2-actions">
          <button className="ntm2-set" onClick={onClose}>Set</button>
          <button className="ntm2-cancel" onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default NewTaskModal; 