import { memo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const ShiftProductionChart = memo(function ShiftProductionChart({ data: propData }) {
  const chartData = propData && propData.length > 0 ? propData : [
    { name: 'Shift 1', expected: 580, actual: 0, rejection: 0 },
    { name: 'Shift 2', expected: 320, actual: 0, rejection: 0 },
    { name: 'Shift 3', expected: 480, actual: 0, rejection: 0 },
  ];

  return (
    <div style={{ width: '100%', height: 250 }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} barGap={8} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E0E0E0" />
          <XAxis 
            dataKey="name" 
            axisLine={true} 
            tickLine={false} 
            tick={{ fontSize: 12, fill: '#666' }} 
          />
          <YAxis 
            axisLine={true} 
            tickLine={false} 
            tick={{ fontSize: 12, fill: '#666' }}
            allowDecimals={false}
          />
          <Tooltip 
            cursor={{ fill: 'rgba(0,0,0,0.05)' }}
            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
          />
          <Legend verticalAlign="top" align="right" iconType="square" wrapperStyle={{ paddingBottom: '10px' }} content={(props) => {
            const { payload } = props;
            return (
              <div style={{ display: 'flex', gap: '12px', rowGap: '5px', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                {payload.map((entry, index) => (
                  <div key={`item-${index}`} style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
                    <div style={{ width: '12px', height: '12px', backgroundColor: entry.color, borderRadius: '2px' }} />
                    <span style={{ fontSize: 13, color: entry.color }}>{entry.value}</span>
                  </div>
                ))}
              </div>
            );
          }}
          
          />
          <Bar dataKey="expected" name="Expected" fill="#1c7ed6" radius={[2, 2, 0, 0]} barSize={25} />
          <Bar dataKey="actual" name="Actual" fill="#63e6be" radius={[2, 2, 0, 0]} barSize={25} />
          <Bar dataKey="rejection" name="Rejection" fill="#ff8787" radius={[2, 2, 0, 0]} barSize={25} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
});

export default ShiftProductionChart;
