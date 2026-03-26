import { ChevronDown } from 'lucide-react';
import styles from '../dashboard.module.css';

const DashboardFilters = ({ 
  selectedLine, setSelectedLine, showLineDropdown, setShowLineDropdown, lines, dropdownRef,
  selectedCameraId, setSelectedCameraId, showCameraDropdown, setShowCameraDropdown, camerasInLine, cameraDropdownRef,
  setCamerasInLine, setLoadingCharts
}) => {
  return (
    <div className={styles.lineSelectorRow}>
      <div className={styles.filterGroup}>
        <div className={styles.filterLabel}>Line Select</div>
        <div className={styles.lineSelectorContainer} ref={dropdownRef}>
          <div 
            className={styles.lineSelector} 
            onClick={() => setShowLineDropdown(!showLineDropdown)}
            style={{ cursor: 'pointer' }}
          >
            {selectedLine || 'Select Line'} <ChevronDown size={16} />
          </div>
          
          {showLineDropdown && (
            <div className={styles.lineDropdown}>
              {lines.map((line) => (
                <div 
                  key={line.id} 
                  className={`${styles.dropdownItem} ${selectedLine === (line.name || `Line ${line.id}`) ? styles.selected : ''}`}
                  onClick={() => {
                    setSelectedLine(line.name || `Line ${line.id}`);
                    setCamerasInLine([]);
                    setSelectedCameraId(null);
                    setLoadingCharts(true);
                    setShowLineDropdown(false);
                  }}
                >
                  {line.name || `Line ${line.id}`}
                </div>
              ))}
              {lines.length === 0 && <div className={styles.dropdownItem}>No lines available</div>}
            </div>
          )}
        </div>
      </div>

      <div className={styles.filterGroup}>
        <div className={styles.filterLabel}>Camera Select</div>
        <div className={styles.lineSelectorContainer} ref={cameraDropdownRef}>
          <div 
            className={`${styles.lineSelector} ${styles.cameraSelector}`}
            onClick={() => setShowCameraDropdown(!showCameraDropdown)}
            style={{ cursor: 'pointer' }}
          >
            {selectedCameraId === 'all' ? 'All Cameras' : (camerasInLine.find(c => c.id === selectedCameraId)?.name || 'Select Camera')} <ChevronDown size={16} />
          </div>
          
          {showCameraDropdown && (
            <div className={styles.lineDropdown}>
              <div 
                className={`${styles.dropdownItem} ${selectedCameraId === 'all' ? styles.selected : ''}`}
                onClick={() => {
                  setSelectedCameraId('all');
                  setLoadingCharts(true);
                  setShowCameraDropdown(false);
                }}
              >
                All Cameras
              </div>
              {camerasInLine.map((camera) => (
                <div 
                  key={camera.id} 
                  className={`${styles.dropdownItem} ${selectedCameraId === camera.id ? styles.selected : ''}`}
                  onClick={() => {
                    setSelectedCameraId(camera.id);
                    setLoadingCharts(true);
                    setShowCameraDropdown(false);
                  }}
                >
                  {camera.name || `Camera ${camera.id}`}
                </div>
              ))}
              {camerasInLine.length === 0 && <div className={styles.dropdownItem}>No cameras available</div>}
              <div className={styles.ruleInfo}>Max 2 cameras per line</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardFilters;
