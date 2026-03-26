'use client';

import { ChevronDown, Calendar } from 'lucide-react';
import styles from '../reports.module.css';
import CalendarPopup from './CalendarPopup';
import { formatDate, convertTo24Hour, convertTo12Hour, SHIFT_CONFIG } from '../utils';

const ReportFilters = ({
  selectedShift, setSelectedShift, showShiftDropdown, setShowShiftDropdown, shiftRef,
  selectedLine, setSelectedLine, showLineDropdown, setShowLineDropdown, lineRef, lines, setCurrentPage,
  selectedCamera, setSelectedCamera, showCameraDropdown, setShowCameraDropdown, cameraRef, cameras,
  selectedDate, setSelectedDate, showCalendar, setShowCalendar, calendarRef,
  startTime, setStartTime, endTime, setEndTime
}) => {
  return (
    <div className={styles.filters}>
      {/* Shift Filter */}
      <div className={styles.filterWrapper} ref={shiftRef}>
        <button className={styles.filterBtn} onClick={() => setShowShiftDropdown(!showShiftDropdown)}>
          {selectedShift} <ChevronDown size={18} />
        </button>
        {showShiftDropdown && (
          <div className={styles.dropdown}>
            {['All Shift', ...Object.values(SHIFT_CONFIG).map(c => c.label)].map(shift => (
              <div 
                key={shift} 
                className={`${styles.dropdownItem} ${selectedShift === shift ? styles.selected : ''}`}
                onClick={() => {
                  setSelectedShift(shift);
                  setShowShiftDropdown(false);
                }}
              >
                {shift}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Line Filter */}
      <div className={styles.filterWrapper} ref={lineRef}>
        <button className={styles.filterBtn} onClick={() => setShowLineDropdown(!showLineDropdown)}>
          {selectedLine ? (selectedLine.name || `Line ${selectedLine.id}`) : 'Select Line'} <ChevronDown size={18} />
        </button>
        {showLineDropdown && (
          <div className={styles.dropdown}>
            {lines.map(line => (
              <div 
                key={line.id} 
                className={`${styles.dropdownItem} ${selectedLine && selectedLine.id === line.id ? styles.selected : ''}`}
                onClick={() => {
                  setSelectedLine(line);
                  localStorage.setItem('recentlyUsedLineId', line.id);
                  setCurrentPage(1);
                  setShowLineDropdown(false);
                }}
              >
                {line.name || `Line ${line.id}`}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Camera Filter */}
      <div className={styles.filterWrapper} ref={cameraRef}>
        <button className={styles.filterBtn} onClick={() => setShowCameraDropdown(!showCameraDropdown)}>
          <span style={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap', maxWidth: '150px' }}>
            {selectedCamera ? (selectedCamera.name || `Camera ${selectedCamera.id}`) : 'All Cameras'}
          </span>
          <ChevronDown size={18} style={{ flexShrink: 0, marginLeft: '4px' }} />
        </button>
        {showCameraDropdown && (
          <div className={styles.dropdown}>
            <div 
              className={`${styles.dropdownItem} ${!selectedCamera ? styles.selected : ''}`}
              onClick={() => {
                setSelectedCamera(null);
                setShowCameraDropdown(false);
              }}
            >
              All Cameras
            </div>
            {cameras && cameras.length > 0 ? (
              cameras.map(camera => (
                <div 
                  key={camera.id} 
                  className={`${styles.dropdownItem} ${selectedCamera && selectedCamera.id === camera.id ? styles.selected : ''}`}
                  onClick={() => {
                    setSelectedCamera(camera);
                    setShowCameraDropdown(false);
                  }}
                >
                  {camera.name || `Camera ${camera.id}`}
                </div>
              ))
            ) : (
              <div className={styles.dropdownItem} style={{ color: '#999', cursor: 'default' }}>
                No cameras found
              </div>
            )}
          </div>
        )}
      </div>

      {/* Date & Time Filters */}
      <div className={styles.dateTimeFilters}>
        <div 
          className={styles.dateInputContainer} 
          onClick={() => setShowCalendar(!showCalendar)}
          ref={calendarRef}
        >
          <Calendar size={18} />
          <span className={styles.dateValue}>{formatDate(selectedDate)}</span>
          {showCalendar && (
            <CalendarPopup 
              selectedDate={selectedDate} 
              onSelect={setSelectedDate} 
              onClose={() => setShowCalendar(false)} 
            />
          )}
        </div>
        
        <div className={styles.timeRangeContainer}>
          <input 
            type="time" 
            className={styles.timeInput} 
            value={convertTo24Hour(startTime)} 
            onChange={(e) => setStartTime(convertTo12Hour(e.target.value))}
          />
          <span className={styles.timeSeparator}>-</span>
          <input 
            type="time" 
            className={styles.timeInput} 
            value={convertTo24Hour(endTime)} 
            onChange={(e) => setEndTime(convertTo12Hour(e.target.value))}
          />
        </div>
      </div>
    </div>
  );
};

export default ReportFilters;
