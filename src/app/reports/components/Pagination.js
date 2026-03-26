'use client';

import { ChevronLeft, ChevronRight, Download } from 'lucide-react';
import styles from '../reports.module.css';

const Pagination = ({ currentPage, setCurrentPage, pageSize, totalItems }) => {
  // If there's no data, show "0-0 of 0"
  const startRange = totalItems === 0 
    ? 0 
    : (currentPage - 1) * pageSize + 1;
  
  const endRange = totalItems === 0
    ? 0
    : Math.min(currentPage * pageSize, totalItems);

  const totalPages = Math.ceil(totalItems / pageSize);

  return (
    <div className={styles.footer}>
      <div className={styles.pagination}>
        <button 
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))} 
            disabled={currentPage === 1 || totalItems === 0}
            className={styles.pagiBtn}
            style={{ 
              background: 'none', 
              border: 'none', 
              cursor: (currentPage === 1 || totalItems === 0) ? 'not-allowed' : 'pointer', 
              color: (currentPage === 1 || totalItems === 0) ? '#ccc' : 'inherit' 
            }}
        >
            <ChevronLeft size={20} />
        </button>
        <span>
            {totalItems === 0 ? '0 of 0 pages' : `${currentPage} of ${totalPages} pages`}
        </span>
        <button 
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage >= totalPages || totalItems === 0}
            className={styles.pagiBtn}
            style={{ 
              background: 'none', 
              border: 'none', 
              cursor: (currentPage >= totalPages || totalItems === 0) ? 'not-allowed' : 'pointer', 
              color: (currentPage >= totalPages || totalItems === 0) ? '#ccc' : 'inherit' 
            }}
        >
            <ChevronRight size={20} />
        </button>
      </div>
    </div>
  );
};

export default Pagination;
