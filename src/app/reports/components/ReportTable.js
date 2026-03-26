'use client';

import { ChevronDown, Eye, Loader2 } from 'lucide-react';
import styles from '../reports.module.css';

const ReportTable = ({ loading, reportData, filteredData, error, fetchReports, setPreviewItem }) => {
  const getStatusClass = (status) => {
    if (status === 'GOOD') return styles.statusGood;
    if (status === 'NG') return styles.statusNG;
    return '';
  };

  return (
    <div className={styles.tableContainer}>
      {loading && reportData.length === 0 ? (
        <div className={styles.loadingState}>
          <Loader2 className={styles.spinner} size={40} />
          <p>Loading reports...</p>
        </div>
      ) : error && reportData.length === 0 ? (
        <div className={styles.errorState}>
          <p>Error: {error}</p>
          <button onClick={fetchReports} className={styles.retryBtn}>Retry</button>
        </div>
      ) : (
        <div style={{ position: 'relative' }}>
          {loading && reportData.length > 0 && (
            <div className={styles.loadingOverlay}>
              <Loader2 className={styles.spinner} size={40} />
              <p>Updating results...</p>
            </div>
          )}
          <table className={styles.table}>
            <thead>
              <tr>
                <th className={styles.th}>Year <ChevronDown size={14} /></th>
                <th className={styles.th}>Month <ChevronDown size={14} /></th>
                <th className={styles.th}>Day <ChevronDown size={14} /></th>
                <th className={styles.th}>Time</th>
                <th className={styles.th}>Camera</th>
                {/* <th className={styles.th}>Shift</th> */}
                <th className={styles.th}>Asset Value</th>
                <th className={styles.th}>Read Value</th>
                <th className={styles.th}>Asset Type</th>
                <th className={styles.th}>Status</th>
                <th className={styles.th}>Image</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.length > 0 ? filteredData.map((row) => (
                <tr key={row.id}>
                  <td className={styles.td}>{row.year}</td>
                  <td className={styles.td}>{row.month}</td>
                  <td className={styles.td}>{row.day}</td>
                  <td className={styles.td}>{row.time}</td>
                  <td className={styles.td}>{row.camera}</td>
                  {/* <td className={styles.td}>{row.shift}</td>  */}
                  <td className={styles.td}>{row.asset}</td>
                  <td className={styles.td}>{row.read}</td>
                  <td className={styles.td}>{row.type}</td>
                  <td className={styles.td}>
                    <span className={getStatusClass(row.status)}>{row.status}</span>
                  </td>
                  <td className={styles.td}>
                    <div className={styles.viewImage} onClick={() => setPreviewItem(row)}>
                      <Eye size={16} /> View Image
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="11" className={styles.td} style={{ textAlign: 'center' }}>No reports found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ReportTable;
