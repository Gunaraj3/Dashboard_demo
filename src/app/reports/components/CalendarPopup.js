'use client';

import { useState, useEffect } from 'react';
import styles from '../reports.module.css';
import { months, weekDays, getDaysInMonth, getFirstDayOfMonth } from '../utils';

const CalendarPopup = ({ selectedDate, onSelect, onClose }) => {
  const [currentDate, setCurrentDate] = useState(selectedDate || new Date(2026, 2, 1)); // Deterministic default
  const [tempSelectedDate, setTempSelectedDate] = useState(selectedDate);
  const [today, setToday] = useState(null);

  useEffect(() => {
    if (!selectedDate) {
      setCurrentDate(new Date());
    }
    setToday(new Date());
  }, [selectedDate]);

  const daysInMonth = getDaysInMonth(currentDate.getFullYear(), currentDate.getMonth());
  const firstDayOfMonth = getFirstDayOfMonth(currentDate.getFullYear(), currentDate.getMonth());

  const handleMonthChange = (e) => {
    setCurrentDate(new Date(currentDate.getFullYear(), parseInt(e.target.value), 1));
  };

  const handleYearChange = (e) => {
    setCurrentDate(new Date(parseInt(e.target.value), currentDate.getMonth(), 1));
  };

  const handleDayClick = (day) => {
    setTempSelectedDate(new Date(currentDate.getFullYear(), currentDate.getMonth(), day));
  };

  const handleConfirm = (e) => {
    e.stopPropagation();
    if (tempSelectedDate) {
      onSelect(tempSelectedDate);
    }
    onClose();
  };

  const handleClear = (e) => {
    e.stopPropagation();
    setTempSelectedDate(null);
  };

  const years = [];
  const displayYear = currentDate.getFullYear();
  for (let y = displayYear - 10; y <= displayYear + 10; y++) {
    years.push(y);
  }

  const days = [];
  for (let i = 0; i < firstDayOfMonth; i++) {
    days.push(<div key={`empty-${i}`} className={`${styles.day} ${styles.empty}`}></div>);
  }

  for (let i = 1; i <= daysInMonth; i++) {
    const isSelected = tempSelectedDate && 
                      tempSelectedDate.getDate() === i && 
                      tempSelectedDate.getMonth() === currentDate.getMonth() && 
                      tempSelectedDate.getFullYear() === currentDate.getFullYear();
    const isToday = today && 
                    today.getDate() === i && 
                    today.getMonth() === currentDate.getMonth() && 
                    today.getFullYear() === currentDate.getFullYear();
    
    days.push(
      <div 
        key={i} 
        className={`${styles.day} ${isSelected ? styles.selected : ''} ${isToday ? styles.today : ''}`}
        onClick={() => handleDayClick(i)}
      >
        {i}
      </div>
    );
  }

  return (
    <div className={styles.calendarPopup} onClick={(e) => e.stopPropagation()}>
      <div className={styles.calendarHeader}>
        <div className={styles.headerSelectors}>
          <select value={currentDate.getMonth()} onChange={handleMonthChange} className={styles.calendarSelect}>
            {months.map((m, idx) => <option key={m} value={idx}>{m}</option>)}
          </select>
          <select value={currentDate.getFullYear()} onChange={handleYearChange} className={styles.calendarSelect}>
            {years.map(y => <option key={y} value={y}>{y}</option>)}
          </select>
        </div>
      </div>
      <div className={styles.weekdays}>
        {weekDays.map(day => <div key={day} className={styles.weekday}>{day}</div>)}
      </div>
      <div className={styles.daysGrid}>
        {days}
      </div>
      <div className={styles.calendarActions}>
        <button className={styles.clearBtn} onClick={handleClear}>Clear</button>
        <button className={styles.confirmBtn} onClick={handleConfirm}>Confirm</button>
      </div>
    </div>
  );
};

export default CalendarPopup;
