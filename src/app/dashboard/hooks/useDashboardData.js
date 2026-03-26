import { useState, useEffect, useRef } from 'react';
// import { api } from '@/lib/api';
import { normalizeStatus } from '@/lib/statusUtils';

// Helper to safely parse dates from backend, assuming UTC if no offset exists
const parseSafeDate = (dateStr) => {
  if (!dateStr) return null;
  let normalized = dateStr.replace(' ', 'T');
  if (!normalized.includes('Z') && !normalized.match(/[+-]\d{2}:?\d{2}$/)) {
    normalized += 'Z';
  }
  const date = new Date(normalized);
  return isNaN(date.getTime()) ? null : date;
};

// Mock Data
const MOCK_LINES = [
  { id: 1, name: 'Tracter-7', is_active: true, timezone: 'Asia/Kolkata' },
  { id: 2, name: 'Engine-Line', is_active: true, timezone: 'Asia/Kolkata' },
  { id: 3, name: 'Assembly-F1', is_active: true, timezone: 'Asia/Kolkata' }
];

const MOCK_CAMERAS = [
  { id: 101, name: 'Cam-01-Front', is_active: true, last_seen_at: '2026-03-24T10:00:00Z' },
  { id: 102, name: 'Cam-02-Rear', is_active: true, last_seen_at: '2026-03-24T10:05:00Z' }
];

export function useDashboardData() {
  const [stats, setStats] = useState({ online: 8, offline: 2, totalLines: 3 });
  const [loading, setLoading] = useState(false);
  const [loadingCharts, setLoadingCharts] = useState(false);
  
  const [lines, setLines] = useState(MOCK_LINES);
  const [selectedLine, setSelectedLine] = useState('Tracter-7');
  
  const [performanceData, setPerformanceData] = useState([]);
  const [overviewData, setOverviewData] = useState([
    { name: 'GOOD', value: 850, color: '#097938' },
    { name: 'NG', value: 45, color: '#d64141' }
  ]);
  const [qualityData, setQualityData] = useState([]);
  const [shiftData, setShiftData] = useState([
    { name: 'Shift 1', expected: 4320, actual: 3800, rejection: 20 },
    { name: 'Shift 2', expected: 4320, actual: 3950, rejection: 15 },
    { name: 'Shift 3', expected: 8640, actual: 7200, rejection: 50 }
  ]);
  const [availabilitySegments, setAvailabilitySegments] = useState([]);
  const [availabilityRangeData, setAvailabilityRangeData] = useState([]);
  const [availabilityTodayStats, setAvailabilityTodayStats] = useState({ uptime: 1320, downtime: 120, availabilityPercent: 91.6 });
  
  const [overviewTimeRange, setOverviewTimeRange] = useState('today');
  const [shiftTimeRange, setShiftTimeRange] = useState('today');
  const [availabilityTimeRange, setAvailabilityTimeRange] = useState('today');
  
  const [camerasInLine, setCamerasInLine] = useState(MOCK_CAMERAS);
  const [selectedCameraId, setSelectedCameraId] = useState(101);

  useEffect(() => {
    // Initialize mock performance and quality data
    const mockPerf = [];
    for (let i = 0; i < 24; i++) {
        mockPerf.push({
            time: `${i}:00`,
            expected: 720,
            actual: Math.floor(Math.random() * 200) + 500,
            rejection: Math.floor(Math.random() * 20),
            total: 720
        });
    }
    setPerformanceData(mockPerf);
    setQualityData(mockPerf.map(h => ({ time: h.time, rejection: h.rejection })));

    // Mock availability segments
    const segments = [
        { type: 'good', width: '30%', startTime: '00:00', endTime: '08:00', status: 'Running' },
        { type: 'error', width: '5%', startTime: '08:00', endTime: '09:12', status: 'Down' },
        { type: 'good', width: '45%', startTime: '09:12', endTime: '20:00', status: 'Running' },
        { type: 'idle', width: '20%', startTime: '20:00', endTime: '24:00', status: 'Idle' }
    ];
    setAvailabilitySegments(segments);

    // Mock availability range data
    const rangeData = [];
    for (let i = 0; i < 7; i++) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        rangeData.push({
            date: d.toISOString().split('T')[0],
            uptime: 1200 + Math.floor(Math.random() * 200),
            downtime: 100 + Math.floor(Math.random() * 100),
            availability: 90 + Math.random() * 8
        });
    }
    setAvailabilityRangeData(rangeData.reverse());

  }, [overviewTimeRange, shiftTimeRange, availabilityTimeRange]);

  return {
    stats, loading, loadingCharts, setLoadingCharts,
    lines, selectedLine, setSelectedLine,
    performanceData, overviewData, qualityData, shiftData, 
    availabilitySegments, availabilityRangeData, availabilityTodayStats,
    overviewTimeRange, setOverviewTimeRange,
    shiftTimeRange, setShiftTimeRange,
    availabilityTimeRange, setAvailabilityTimeRange,
    camerasInLine, setCamerasInLine,
    selectedCameraId, setSelectedCameraId
  };
}
