'use client';

import dynamic from 'next/dynamic';
import { useRef, useState, useEffect } from 'react';
import MainLayout from '@/components/MainLayout/MainLayout';
import Link from 'next/link';
import { ArrowRight, Loader2 } from 'lucide-react';
import Skeleton from '@/components/Common/Skeleton';

// Hooks
import { useDashboardData } from './hooks/useDashboardData';

// Components
import SummaryCards from './components/SummaryCards';
import DashboardFilters from './components/DashboardFilters';
import DashboardGrid from './components/DashboardGrid';
import styles from './dashboard.module.css';

const AvailabilityChart = dynamic(() => import('@/components/Charts/AvailabilityChart'), { 
  ssr: false,
  loading: () => <Skeleton height="200px" />
});
const MultiDayAvailabilityChart = dynamic(() => import('@/components/Charts/MultiDayAvailabilityChart'), { 
  ssr: false,
  loading: () => <Skeleton height="300px" />
});

export default function DashboardPage() {
  const {
    stats, loading, loadingCharts, setLoadingCharts,
    lines, selectedLine, setSelectedLine,
    performanceData, overviewData, qualityData, shiftData, 
    availabilitySegments, availabilityRangeData, availabilityTodayStats,
    overviewTimeRange, setOverviewTimeRange,
    shiftTimeRange, setShiftTimeRange,
    availabilityTimeRange, setAvailabilityTimeRange,
    camerasInLine, setCamerasInLine,
    selectedCameraId, setSelectedCameraId
  } = useDashboardData();

  const [showLineDropdown, setShowLineDropdown] = useState(false);
  const [showCameraDropdown, setShowCameraDropdown] = useState(false);
  const lineDropdownRef = useRef(null);
  const cameraDropdownRef = useRef(null);

  // Click outside handling for dropdowns
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (lineDropdownRef.current && !lineDropdownRef.current.contains(event.target)) setShowLineDropdown(false);
      if (cameraDropdownRef.current && !cameraDropdownRef.current.contains(event.target)) setShowCameraDropdown(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <MainLayout>
      <div className={styles.dashboard}>
        {/* Top Section with Cards and View Line Button */}
        <div className={styles.topSection}>
          <div className={styles.summaryCards}>
            <SummaryCards loading={loading} stats={stats} />
          </div>
        </div>

        {/* Full Width Controls */}
        <div className={styles.fullWidthSection}>
          <DashboardFilters 
            selectedLine={selectedLine} setSelectedLine={setSelectedLine}
            showLineDropdown={showLineDropdown} setShowLineDropdown={setShowLineDropdown}
            lines={lines} dropdownRef={lineDropdownRef}
            selectedCameraId={selectedCameraId} setSelectedCameraId={setSelectedCameraId}
            showCameraDropdown={showCameraDropdown} setShowCameraDropdown={setShowCameraDropdown}
            camerasInLine={camerasInLine} cameraDropdownRef={cameraDropdownRef}
            setCamerasInLine={setCamerasInLine}
            setLoadingCharts={setLoadingCharts}
          />
        </div>

        {/* Main Dashboard Grid */}
        <DashboardGrid 
          loadingCharts={loadingCharts} 
          performanceData={performanceData} 
          qualityData={qualityData}
          overviewData={overviewData} 
          overviewTimeRange={overviewTimeRange} 
          setOverviewTimeRange={setOverviewTimeRange}
          shiftData={shiftData} 
          shiftTimeRange={shiftTimeRange} 
          setShiftTimeRange={setShiftTimeRange}
        />

        {/* Full Width Availability at Bottom */}
        <div className={styles.chartCard} style={{ padding: '16px 24px' }}>
            <div className={styles.chartHeader} style={{ marginBottom: '12px' }}>
              <h3 className={styles.chartTitle}>Availability</h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                {loadingCharts && <Loader2 className={styles.spinner} size={16} />}
                <select 
                  className={styles.dropdown}
                  value={availabilityTimeRange}
                  onChange={(e) => setAvailabilityTimeRange(e.target.value)}
                >
                  <option value="today">Today</option>
                  <option value="7days">Last 7 days</option>
                  <option value="30days">Last 30 days</option>
                </select>
              </div>
            </div>
            {availabilityTimeRange === 'today' ? (
              <AvailabilityChart 
                segments={availabilitySegments} 
                uptime={availabilityTodayStats.uptime} 
                downtime={availabilityTodayStats.downtime} 
                availabilityPercent={availabilityTodayStats.availabilityPercent}
              />
            ) : (
              <MultiDayAvailabilityChart data={availabilityRangeData} />
            )}
          </div>
      </div>
    </MainLayout>
  );
}
