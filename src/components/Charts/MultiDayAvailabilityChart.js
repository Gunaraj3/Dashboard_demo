import { memo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const MultiDayAvailabilityChart = memo(function MultiDayAvailabilityChart({ data }) {
  // data: [{ date: '2024-01-01', uptime: 120, downtime: 30 }, ...]
  
  const formatDuration = (mins) => {
    if (mins >= 60) return `${Math.floor(mins/60)}h ${mins%60}m`;
    return `${mins}m`;
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div style={{ 
          backgroundColor: 'rgba(255, 255, 255, 0.95)', 
          padding: '12px', 
          border: '1px solid #eef2f6', 
          borderRadius: '12px',
          boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05)',
          backdropFilter: 'blur(4px)'
        }}>
          <p style={{ margin: '0 0 8px', fontWeight: 'bold', color: '#1e293b', fontSize: '13px' }}>{label}</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {payload.map((entry, index) => (
              <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: entry.color }} />
                  <span style={{ fontSize: '12px', color: '#64748b' }}>{entry.name}</span>
                </div>
                <span style={{ fontSize: '12px', fontWeight: 600, color: '#0f172a', marginLeft: '12px' }}>
                  {formatDuration(entry.value)}
                </span>
              </div>
            ))}
            {payload[0]?.payload?.availability !== undefined && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'space-between', marginTop: '4px', paddingTop: '4px', borderTop: '1px solid #f1f5f9' }}>
                <span style={{ fontSize: '12px', color: '#64748b' }}>Availability</span>
                <span style={{ fontSize: '12px', fontWeight: 700, color: '#097938' }}>
                  {payload[0].payload.availability.toFixed(1)}%
                </span>
              </div>
            )}
          </div>
        </div>
      );
    }
    return null;
  };

  // Determine tick interval for X-axis to avoid crowding
  const tickInterval = data.length > 10 ? (data.length > 20 ? 4 : 2) : 0;

  return (
    <div style={{ width: '100%', height: 320, marginTop: '20px', padding: '0 10px' }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 20, right: 10, left: 10, bottom: 20 }}
          barGap={0}
        >
          <defs>
            <linearGradient id="upGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#63e6be" stopOpacity={1}/>
              <stop offset="100%" stopColor="#4bc0a3" stopOpacity={0.9}/>
            </linearGradient>
            <linearGradient id="downGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ff8787" stopOpacity={1}/>
              <stop offset="100%" stopColor="#e06c6c" stopOpacity={0.9}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
          <XAxis 
            dataKey="date" 
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 11, fill: '#94a3b8' }}
            dy={10}
            interval={tickInterval}
            tickFormatter={(val) => {
              try {
                const d = new Date(val);
                return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
              } catch(e) { return val; }
            }}
          />
          <YAxis 
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 11, fill: '#94a3b8' }}
            width={45}
            tickFormatter={(val) => val >= 60 ? `${Math.floor(val/60)}h` : `${val}m`}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f8fafc', opacity: 0.5 }} />
          <Legend 
            verticalAlign="top" 
            align="right" 
            height={40}
            iconType="circle"
            formatter={(value) => <span style={{ color: '#64748b', fontSize: '12px', fontWeight: 500 }}>{value}</span>}
          />
          <Bar 
            name="Run Time" 
            dataKey="uptime" 
            stackId="a" 
            fill="url(#upGradient)" 
            radius={[0, 0, 0, 0]}
            barSize={data.length > 10 ? 10 : 20}
          />
          <Bar 
            name="Down Time" 
            dataKey="downtime" 
            stackId="a" 
            fill="url(#downGradient)" 
            radius={[4, 4, 0, 0]}
            barSize={data.length > 10 ? 10 : 20}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
});

export default MultiDayAvailabilityChart;
