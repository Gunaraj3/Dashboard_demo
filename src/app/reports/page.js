'use client';

import { useState, useEffect, useRef } from 'react';
import MainLayout from '@/components/MainLayout/MainLayout';
// import { api } from '@/lib/api';
import { FileDown } from 'lucide-react';
import styles from './reports.module.css';

// Components
import ReportFilters from './components/ReportFilters';
import ReportTable from './components/ReportTable';
import Pagination from './components/Pagination';
import ImageModal from './components/ImageModal';
import { normalizeStatus } from '@/lib/statusUtils';

// Utils
import { 
  timeToMinutes,
  getCurrentShift,
  formatDateForBackend,
  formatTimeForBackend,
  mapShiftForBackend,
  extractPayloadText,
  SHIFT_CONFIG
} from './utils';

const MOCK_REPORT_DATA = Array.from({ length: 150 }, (_, i) => ({
  id: i + 1,
  year: '2026',
  month: 'Mar',
  day: '24',
  time: '14:20:15',
  camera: 'Cam-01-Front',
  shift: 'Shift 1',
  asset: 'PART-' + (1000 + i),
  read: 'OK-' + (2000 + i),
  type: 'Disc',
  status: (i % 10 === 0) ? 'NG' : 'GOOD', // Deterministic status
  reason: '-',
  image: null
}));

const MOCK_LINES = [
  { id: 1, name: 'Tracter-7', is_active: true },
  { id: 2, name: 'Engine-Line', is_active: true }
];

const MOCK_CAMERAS = [
  { id: 101, name: 'Cam-01-Front', is_active: true },
  { id: 102, name: 'Cam-02-Rear', is_active: true }
];

export default function ReportsPage() {
  const [mounted, setMounted] = useState(false);
  const [reportData, setReportData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [previewItem, setPreviewItem] = useState(null);
  const [isPolling, setIsPolling] = useState(false);
  
  const [selectedDate, setSelectedDate] = useState(null); // Initialize as null
  const [startTime, setStartTime] = useState('12:00 AM');
  const [endTime, setEndTime] = useState('11:59 PM');
  const [selectedShift, setSelectedShift] = useState('All Shift');
  
  const [lines, setLines] = useState(MOCK_LINES);
  const [selectedLine, setSelectedLine] = useState(MOCK_LINES[0]);
  const [cameras, setCameras] = useState(MOCK_CAMERAS);
  const [selectedCamera, setSelectedCamera] = useState(MOCK_CAMERAS[0]);

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(50);
  const [totalItems, setTotalItems] = useState(150);
  const [latestHeartbeat, setLatestHeartbeat] = useState(null);

  const calendarRef = useRef(null);
  const shiftRef = useRef(null);
  const lineRef = useRef(null);
  const cameraRef = useRef(null);

  useEffect(() => {
    setMounted(true);
    setSelectedDate(new Date());
    setLatestHeartbeat({
      timestamp: new Date().toISOString(),
      cameraName: 'Cam-01-Front'
    });
    setReportData(MOCK_REPORT_DATA.slice(0, 50));
  }, []);

  const handleLineChange = (line) => {
    setSelectedLine(line);
    // Mock update: just reset to first page
    handlePageChange(1);
  };

  const handleCameraChange = (camera) => {
    setSelectedCamera(camera);
    handlePageChange(1);
  };

  const handleShiftChange = (shift) => {
    setSelectedShift(shift);
    handlePageChange(1);
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
    handlePageChange(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    const start = (page - 1) * pageSize;
    setReportData(MOCK_REPORT_DATA.slice(start, start + pageSize));
  };

  const handleExport = () => {
    alert('This is a template. Export functionality is currently demonstration only.');
  };

  const togglePolling = () => {
    setIsPolling(!isPolling);
  };

  return (
    <MainLayout>
      <div className={styles.reports}>
        <div className={styles.headerRow}>
          <div className={styles.titleGroup}>
            <h2 className={styles.title}>Reports</h2>
            {mounted && latestHeartbeat && (
              <div className={styles.heartbeatBadge}>
                <span className={styles.pulseDot}></span>
                Latest Activity: {new Date(latestHeartbeat.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true })} ({latestHeartbeat.cameraName})
              </div>
            )}
          </div>
          <div className={styles.pollingControls}>
            <span className={styles.pollingStatus}>Auto-refresh: {isPolling ? 'ON' : 'OFF'}</span>
            <button 
              onClick={togglePolling} 
              className={`${styles.pollingBtn} ${isPolling ? styles.pollingActive : ''}`}
            >
              {isPolling ? 'Pause Updates' : 'Resume Updates'}
            </button>
            <button 
              onClick={handleExport} 
              className={` ${styles.exportBtn}`}
              disabled={loading}
              title="Export filtered reports as PDF"
            >
              <FileDown size={18} /> Export PDF
            </button>
          </div>
        </div>

        <ReportFilters 
          selectedShift={selectedShift} setSelectedShift={handleShiftChange}
          showShiftDropdown={false} setShowShiftDropdown={() => {}}
          shiftRef={shiftRef}
          selectedLine={selectedLine} setSelectedLine={handleLineChange}
          showLineDropdown={false} setShowLineDropdown={() => {}}
          lineRef={lineRef} lines={lines} setCurrentPage={handlePageChange}
          selectedCamera={selectedCamera} setSelectedCamera={handleCameraChange}
          showCameraDropdown={false} setShowCameraDropdown={() => {}}
          cameraRef={cameraRef} cameras={cameras}
          selectedDate={selectedDate} setSelectedDate={handleDateChange}
          showCalendar={false} setShowCalendar={() => {}}
          calendarRef={calendarRef}
          startTime={startTime} setStartTime={() => {}}
          endTime={endTime} setEndTime={() => {}}
        />

        <ReportTable 
          loading={loading} reportData={reportData} filteredData={reportData}
          error={error} fetchReports={() => {}} setPreviewItem={setPreviewItem}
        />

        <Pagination 
          currentPage={currentPage} setCurrentPage={handlePageChange}
          pageSize={pageSize} totalItems={totalItems}
        />

        <ImageModal previewItem={previewItem} setPreviewItem={setPreviewItem} />
      </div>
    </MainLayout>
  );
}