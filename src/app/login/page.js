'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff } from 'lucide-react';
import styles from './login.module.css';
// import { api } from '../../lib/api';

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const router = useRouter();

  useEffect(() => {
    setIsCheckingAuth(false);
  }, [router]);

  if (isCheckingAuth) {
    return null;
  }

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!username || !password) {
      setError('Please enter both username and password.');
      setLoading(false);
      return;
    }

    // Mock login delay
    setTimeout(() => {
      localStorage.setItem('access_token', 'template-dummy-token');
      router.push('/dashboard');
      setLoading(false);
    }, 1000);
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.brandRow}>
          <h1 className={styles.logo}>NAME</h1>
          {/* <img src="/images/munjal.jpg" alt="munjal" className={styles.logoImg} /> */}
        </div>
        <p className={styles.subHeader}>NAME PRODUCTION TRACEABILITY SYSTEM</p>
      </header>

      <div className={styles.loginCard}>
        <h2 className={styles.title}>Log in</h2>
        {error && <div className={styles.errorMessage}>{error}</div>}
        <form onSubmit={handleLogin}>
          <div className={styles.formGroup}>
            <label className={styles.label}>Email / Username</label>
            <input
              type="text"
              className={styles.input}
              placeholder="Enter your email"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              disabled={loading}
            />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>Password</label>
            <div className={styles.inputWrapper}>
              <input
                type={showPassword ? 'text' : 'password'}
                className={styles.input}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
              />
              <span 
                className={styles.eyeIcon}
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </span>
            </div>
          </div>
          <button 
            type="submit" 
            className={styles.loginButton}
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Log in'}
          </button>
        </form>
      </div>

      <footer className={styles.footer}>
        <p>Developed By <span className={styles.crimson}>Name </span><span className={styles.tech}>Tech</span></p>
        <p className={styles.italic}>License By <span className={styles.siemens}>Name</span></p>
      </footer>
    </div>
  );
}
