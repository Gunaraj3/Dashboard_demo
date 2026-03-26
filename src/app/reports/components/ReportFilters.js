import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Calendar as CalendarIcon } from 'lucide-react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import styles from '../reports.module.css';
import { formatDate, convertTo24Hour, convertTo12Hour, SHIFT_CONFIG } from '../utils';

const ReportFilters = ({
  selectedShift, setSelectedShift,
  selectedLine, setSelectedLine, lines, setCurrentPage,
  selectedCamera, setSelectedCamera, cameras,
  selectedDate, setSelectedDate,
  startTime, setStartTime, endTime, setEndTime
}) => {
  const [showShiftDropdown, setShowShiftDropdown] = useState(false);
  const [showLineDropdown, setShowLineDropdown] = useState(false);
  const [showCameraDropdown, setShowCameraDropdown] = useState(false);

  const shiftRef = useRef(null);
  const lineRef = useRef(null);
  const cameraRef = useRef(null);

  // Close dropdowns on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (shiftRef.current && !shiftRef.current.contains(event.target)) setShowShiftDropdown(false);
      if (lineRef.current && !lineRef.current.contains(event.target)) setShowLineDropdown(false);
      if (cameraRef.current && !cameraRef.current.contains(event.target)) setShowCameraDropdown(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  return (
    <div className={styles.filters}>
      {/* Shift Filter */}
      <div className={styles.filterGroup}>
        <div className={styles.filterLabel}>Shift Select</div>
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
      </div>

      {/* Line Filter */}
      <div className={styles.filterGroup}>
        <div className={styles.filterLabel}>Line Select</div>
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
      </div>

      {/* Camera Filter */}
      <div className={styles.filterGroup}>
        <div className={styles.filterLabel}>Camera Select</div>
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
      </div>


      {/* Spacer to push date/time to the right if needed, or we can use margin-auto in CSS */}
      <div className={styles.filterSpacer}></div>

      {/* Date Filter */}
      <div className={styles.filterGroup}>
        <div className={styles.filterLabel}>
          <CalendarIcon size={14} /> Date Select
        </div>
        <div className={styles.dateInputWrapper}>
          <DatePicker
            selected={selectedDate}
            onChange={(date) => {
              setSelectedDate(date);
              setCurrentPage(1);
            }}
            dateFormat="MMM dd, yyyy"
            className={styles.datePickerInput}
            calendarClassName={styles.customCalendar}
            popperPlacement="bottom-start"
          />
        </div>
      </div>
      
      {/* Time Filter */}
      <div className={styles.filterGroup}>
        <div className={styles.filterLabel}>Time Range</div>
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
