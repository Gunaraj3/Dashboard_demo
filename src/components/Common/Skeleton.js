'use client';

import styles from './Skeleton.module.css';

const Skeleton = ({ width, height, borderRadius = '8px', className = '' }) => {
  return (
    <div 
      className={`${styles.skeleton} ${className}`}
      style={{ 
        width: width || '100%', 
        height: height || '20px',
        borderRadius 
      }}
    />
  );
};

export default Skeleton;
