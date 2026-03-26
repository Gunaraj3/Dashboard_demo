import dynamic from 'next/dynamic';
import { Loader2 } from 'lucide-react';
import Skeleton from '@/components/Common/Skeleton';
import styles from '../dashboard.module.css';

const PerformanceChart = dynamic(() => import('@/components/Charts/PerformanceChart'), { 
  ssr: false,
  loading: () => <Skeleton height="320px" />
});
const OverviewChart = dynamic(() => import('@/components/Charts/OverviewChart'), { 
  ssr: false,
  loading: () => <Skeleton height="320px" />
});
const QualityChart = dynamic(() => import('@/components/Charts/QualityChart'), { 
  ssr: false,
  loading: () => <Skeleton height="320px" />
});
const ShiftProductionChart = dynamic(() => import('@/components/Charts/ShiftProductionChart'), { 
  ssr: false,
  loading: () => <Skeleton height="320px" />
});

const DashboardGrid = ({ 
  loadingCharts, performanceData, qualityData, 
  overviewData, overviewTimeRange, setOverviewTimeRange,
  shiftData, shiftTimeRange, setShiftTimeRange
}) => {
  return (
    <div className={styles.grid}>
      {/* Left Column */}
      <div className={styles.mainCol}>
        <div className={styles.chartCard}>
          <div className={styles.chartHeader}>
            <h3 className={styles.chartTitle}>Performance</h3>
            {loadingCharts && <Loader2 className={styles.spinner} size={16} />}
          </div>
          <PerformanceChart data={performanceData} />
        </div>

        <div className={styles.chartCard}>
          <div className={styles.chartHeader}>
            <h3 className={styles.chartTitle}>Quality</h3>
            {loadingCharts && <Loader2 className={styles.spinner} size={16} />}
          </div>
          <QualityChart data={qualityData} />
        </div>
      </div>

      {/* Right Column */}
      <div className={styles.sideCol}>
        <div className={styles.chartCard}>
          <div className={styles.chartHeader}>
            <h3 className={styles.chartTitle}>Overview</h3>
            <select 
              className={styles.dropdown}
              value={overviewTimeRange}
              onChange={(e) => setOverviewTimeRange(e.target.value)}
            >
              <option value="today">Today</option>
              <option value="7days">Last 7 days</option>
              <option value="30days">Last 30 days</option>
            </select>
          </div>
          <OverviewChart data={overviewData} />
        </div>

        <div className={styles.chartCard}>
          <div className={styles.chartHeader}>
            <h3 className={styles.chartTitle}>Shift Wise Production</h3>
            <select 
              className={styles.dropdown}
              value={shiftTimeRange}
              onChange={(e) => setShiftTimeRange(e.target.value)}
            >
              <option value="today">Today</option>
              <option value="7days">Last 7 days</option>
              <option value="30days">Last 30 days</option>
            </select>
          </div>
          <ShiftProductionChart data={shiftData} />
        </div>
      </div>
    </div>
  );
};

export default DashboardGrid;
