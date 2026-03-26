import { Loader2 } from 'lucide-react';
import styles from '../dashboard.module.css';

const SummaryCards = ({ loading, stats }) => {
  if (loading) {
    return (
      <div className={styles.card} style={{ gridColumn: 'span 3', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Loader2 className={styles.spinner} size={24} />
        <span style={{ marginLeft: '10px' }}>Loading stats...</span>
      </div>
    );
  }

  return (
    <>
      <div className={`${styles.card} ${styles.online}`}>
        <div className={styles.cardValue}>{stats.online}</div>
        <div className={styles.cardTitle}>Online Cameras</div>
      </div>
      <div className={`${styles.card} ${styles.offline}`}>
        <div className={styles.cardValue}>{stats.offline}</div>
        <div className={styles.cardTitle}>Offline Cameras</div>
      </div>
      <div className={`${styles.card} ${styles.total}`}>
        <div className={styles.cardValue}>{stats.totalLines}</div>
        <div className={styles.cardTitle}>Total Lines</div>
      </div>
    </>
  );
};

export default SummaryCards;
