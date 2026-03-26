'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutGrid, FileText, Calendar, LogOut, X } from 'lucide-react';
import styles from './Sidebar.module.css';
import { clsx } from 'clsx';

export default function Sidebar({ isOpen, onClose, onLogout }) {
  const pathname = usePathname();

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: <LayoutGrid size={22} /> },
    { name: 'Report', path: '/reports', icon: <FileText size={22} /> },
  ];

  return (
    <aside className={clsx(styles.sidebar, isOpen && styles.show)}>
      <div className={styles.logoSection}>
        <h1 className={styles.logo}>SIEMENS</h1>
        <button className={styles.closeBtn} onClick={onClose}>
          <X size={24} />
        </button>
      </div>

      <nav className={styles.nav}>
        {navItems.map((item) => (
          <Link 
            key={item.path} 
            href={item.path}
            className={clsx(styles.navItem, pathname === item.path && styles.active)}
            onClick={onClose}
          >
            <span className={styles.icon}>{item.icon}</span>
            <span className={styles.name}>{item.name}</span>
          </Link>
        ))}
      </nav>

      <div className={styles.footerWrap}>
        <button className={styles.logoutBtn} onClick={onLogout}>
          <LogOut size={20} />
          <span>Logout</span>
        </button>

        <div className={styles.footer}>
          <p className={styles.devBy}>Developed By <span className={styles.crimson}>Crimson </span><span className={styles.white}>Tech</span></p>
          <p className={styles.licenseBy}>License By <span className={styles.siemens}>Siemens</span></p>
        </div>
      </div>
    </aside>
  );
}
