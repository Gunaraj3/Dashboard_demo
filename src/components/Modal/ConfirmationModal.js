'use client';

import { useEffect, useRef } from 'react';
import { LogOut, X } from 'lucide-react';
import styles from './ConfirmationModal.module.css';

export default function ConfirmationModal({ isOpen, onConfirm, onCancel, title, message }) {
  const confirmBtnRef = useRef(null);
  const cancelBtnRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      // Focus the confirm button when the modal opens
      setTimeout(() => {
        confirmBtnRef.current?.focus();
      }, 50);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Handle keyboard shortcuts
  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      onCancel();
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
      // Toggle focus between buttons
      if (document.activeElement === confirmBtnRef.current) {
        cancelBtnRef.current?.focus();
      } else if (document.activeElement === cancelBtnRef.current) {
        confirmBtnRef.current?.focus();
      }
    }
  };

  return (
    <div 
      className={styles.backdrop} 
      onClick={onCancel}
      onKeyDown={handleKeyDown}
      tabIndex={-1} // Ensure backdrop can receive keyboard events
    >
      <div className={styles.modal} onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
        <div className={styles.iconWrapper}>
          <LogOut size={32} />
        </div>
        
        <h2 className={styles.title}>{title || 'Confirm Logout'}</h2>
        <p className={styles.message}>{message || 'Are you sure you want to log out? You will need to log in again to access the system.'}</p>
        
        <div className={styles.actions}>
          <button 
            ref={cancelBtnRef}
            className={`${styles.btn} ${styles.cancelBtn}`} 
            onClick={onCancel}
          >
            Cancel
          </button>
          <button 
            ref={confirmBtnRef}
            className={`${styles.btn} ${styles.confirmBtn}`} 
            onClick={onConfirm}
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
