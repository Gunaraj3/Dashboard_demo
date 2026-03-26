'use client';

import { X } from 'lucide-react';
import styles from '../reports.module.css';

const ImageModal = ({ previewItem, setPreviewItem }) => {
  if (!previewItem) return null;

  return (
    <div className={styles.modalOverlay} onClick={() => setPreviewItem(null)}>
      <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h3 className={styles.modalTitle}>Inspection Detail - {previewItem.asset}</h3>
          <button className={styles.closeBtn} onClick={() => setPreviewItem(null)}>
            <X size={24} />
          </button>
        </div>
        <div className={styles.modalDivider}></div>
        <div className={styles.modalBody}>
          <div className={styles.imagePlaceholder}>
            {previewItem.image ? (
              <img 
                src={previewItem.image.startsWith('data:') ? previewItem.image : `data:image/jpeg;base64,${previewItem.image}`} 
                alt="Preview" 
                style={{ maxWidth: '100%', borderRadius: '8px' }}
              />
            ) : (
              <p>No image available</p>
            )
            }
          </div>
          <div className={styles.itemDetails} style={{ marginTop: '20px' }}>
            <p><strong>Status:</strong> {previewItem.status}</p>
            <p><strong>Time:</strong> {previewItem.year}-{previewItem.month}-{previewItem.day} {previewItem.time}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageModal;
