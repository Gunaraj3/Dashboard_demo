import { memo } from 'react';

const AvailabilityChart = memo(function AvailabilityChart({ segments: propSegments, uptime = 0, downtime = 0, availabilityPercent = null }) {
  const segments = propSegments && propSegments.length > 0 ? propSegments : [
    { type: 'idle', width: '100%' },
  ];

  const colors = {
    error: '#ff8787',
    good: '#63e6be',
    idle: '#e2e8f0',
  };

  return (
    <div style={{ width: '100%', marginTop: '10px', position: 'relative' }}>
      {/* Main Availability Bar */}
      <div style={{ 
        display: 'flex', 
        height: '40px', 
        borderRadius: '8px', 
        overflow: 'hidden', 
        border: '1px solid #eee',
        boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.05)',
        position: 'relative',
        zIndex: 2
      }}>
        {segments.map((seg, i) => (
          <div 
            key={i} 
            style={{ 
              width: seg.width, 
              backgroundColor: colors[seg.type] || colors.error,
              cursor: seg.startTime ? 'pointer' : 'default',
              transition: 'filter 0.2s ease',
              height: '100%'
            }} 
            title={seg.startTime ? `${seg.startTime} - ${seg.endTime}: ${seg.status || 'Idle'}` : 'Idle'}
          />
        ))}
      </div>

      {/* Time Axis */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        padding: '0 2px', 
        marginTop: '12px', 
        fontSize: '10px', 
        color: '#888',
        fontWeight: 500,
        position: 'relative',
        zIndex: 3
      }}>
        <span>00:00</span>
        <span>04:00</span>
        <span>08:00</span>
        <span>12:00</span>
        <span>16:00</span>
        <span>20:00</span>
        <span>00:00</span>
      </div>
      
      {/* Legend */}
      <div style={{ 
        display: 'flex', 
        gap: '20px', 
        marginTop: '15px',
        flexWrap: 'wrap'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '12px', height: '12px', backgroundColor: colors.good, borderRadius: '2px' }} />
          <span style={{ fontSize: '12px', fontWeight: 600, color: '#444' }}>
            Run Time: {uptime >= 60 ? `${Math.floor(uptime/60)}h ${uptime%60}m` : `${uptime}m`}
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '12px', height: '12px', backgroundColor: colors.error, borderRadius: '2px' }} />
          <span style={{ fontSize: '12px', fontWeight: 600, color: '#444' }}>
            Down Time: {downtime > 60 ? `${Math.floor(downtime/60)}h ${downtime%60}m` : `${downtime}m`}
          </span>
        </div>
      </div>
    </div>
  );
});

export default AvailabilityChart;
