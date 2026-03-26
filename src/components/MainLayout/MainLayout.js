'use client';

import { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Image from 'next/image';
import { Menu } from 'lucide-react';
import { clsx } from 'clsx';
import Sidebar from '../Sidebar/Sidebar';
import ConfirmationModal from '../Modal/ConfirmationModal';
import styles from './MainLayout.module.css';

export default function MainLayout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = () => {
    setShowLogoutModal(true);
  };

  const confirmLogout = () => {
    // Simple redirect to login for template
    setShowLogoutModal(false);
    router.push('/login');
  };

  return (
    <div className={styles.layout}>
      <Sidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
        onLogout={handleLogout}
      />
      
      {isSidebarOpen && (
        <div 
          className={styles.overlay} 
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <main className={styles.main}>
        <header className={styles.topBar}>
          <button 
            className={styles.menuButton} 
            onClick={() => setIsSidebarOpen(true)}
          >
            <Menu size={24} />
          </button>
          
          <div className={styles.headerTitle}>
            PRODUCTION TRACEABILITY SYSTEM
          </div> 
        </header>
        
        <div className={styles.content} key={pathname}>
          {children}
        </div>
      </main>

      <ConfirmationModal 
        isOpen={showLogoutModal}
        onConfirm={confirmLogout}
        onCancel={() => setShowLogoutModal(false)}
      />
    </div>
  );
}
