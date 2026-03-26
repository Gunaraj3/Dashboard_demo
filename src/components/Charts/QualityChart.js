import { memo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const QualityChart = memo(function QualityChart({ data: propData }) {
  const chartData = propData && propData.length > 0 ? propData : [
    { time: '0:00', rejection: 0 },
    { time: '23:00', rejection: 0 }
  ];

  return (
    <div style={{ width: '100%', height: 180, position: 'relative' }}>
      <div style={{ 
        position: 'absolute', 
        top: -10, 
        right: 0, 
        display: 'flex', 
        alignItems: 'center', 
        gap: '4px', 
        fontSize: '11px', 
        fontWeight: 600,
        backgroundColor: 'rgba(255,255,255,0.8)',
        padding: '2px 6px',
        borderRadius: '4px'
      }}>
        <div style={{ width: '12px', height: '12px', backgroundColor: '#ff8787', borderRadius: '2px' }}></div>
        <span>Rejection Count</span>
      </div>
      <ResponsiveContainer>
        <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E0E0E0" />
          <XAxis 
            dataKey="time" 
            axisLine={true} 
            tickLine={false} 
            tick={{ fontSize: 10, fill: '#666' }} 
            minTickGap={20}
          />
          <YAxis 
            axisLine={true} 
            tickLine={false} 
            tick={{ fontSize: 10, fill: '#666' }}
            allowDecimals={false}
          />
          <Tooltip 
            cursor={{ fill: 'rgba(0,0,0,0.05)' }}
            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
          />
          <Bar dataKey="rejection" fill="#ff8787" radius={[2, 2, 0, 0]} barSize={20} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
});

export default QualityChart;
