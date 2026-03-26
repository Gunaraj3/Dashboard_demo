import { memo } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const PerformanceChart = memo(function PerformanceChart({ data: propData }) {
  const chartData = propData && propData.length > 0 ? propData : [
    { time: '0:00', expected: 250, actual: 0, rejection: 0 },
    { time: '23:00', expected: 250, actual: 0, rejection: 0 }
  ];

  return (
    <div style={{ width: '100%', height: 320, position: 'relative' }}>
      {/* Custom Legend */}
      <div style={{ 
        position: 'absolute', 
        top: -30, 
        right: 0, 
        display: 'flex', 
        gap: '15px', 
        fontSize: '11px', 
        fontWeight: 600,
        flexWrap: 'wrap',
        justifyContent: 'flex-end'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <div style={{ width: '10px', height: '2px', backgroundColor: '#a68eef' }}></div>
          <div style={{ width: '6px', height: '6px', borderRadius: '50%', border: '1px solid #a68eef', marginLeft: '-8px' }}></div>
          <span>Total</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <div style={{ width: '10px', height: '2px', backgroundColor: '#4dabf7' }}></div>
          <div style={{ width: '6px', height: '6px', borderRadius: '50%', border: '1px solid #4dabf7', marginLeft: '-8px' }}></div>
          <span>Expected</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <div style={{ width: '10px', height: '2px', backgroundColor: '#63e6be' }}></div>
          <div style={{ width: '6px', height: '6px', borderRadius: '50%', border: '1px solid #63e6be', marginLeft: '-8px' }}></div>
          <span>Actual</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <div style={{ width: '10px', height: '2px', backgroundColor: '#ff8787' }}></div>
          <div style={{ width: '6px', height: '6px', borderRadius: '50%', border: '1px solid #ff8787', marginLeft: '-8px' }}></div>
          <span>Rejection</span>
        </div>
      </div>

      <ResponsiveContainer>
        <AreaChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#63e6be" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#63e6be" stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="colorExpected" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#4dabf7" stopOpacity={0.2}/>
              <stop offset="95%" stopColor="#4dabf7" stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#7950f2" stopOpacity={0.2}/>
              <stop offset="95%" stopColor="#7950f2" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e0e0e0" />
          <XAxis 
            dataKey="time" 
            axisLine={true} 
            tickLine={false} 
            tick={{ fontSize: 10, fill: '#666' }} 
            padding={{ left: 10, right: 10 }}
            minTickGap={20}
          />
          <YAxis 
            axisLine={true} 
            tickLine={false} 
            tick={{ fontSize: 10, fill: '#666' }}
          />
          <Tooltip 
            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
          />
          
          <Area 
            type="monotone" 
            dataKey="expected" 
            stroke="#4dabf7" 
            fillOpacity={1} 
            fill="url(#colorExpected)" 
            strokeWidth={2}
            dot={false}
          />
          <Area 
            type="monotone" 
            dataKey="total" 
            stroke="#b9a5f4" 
            fillOpacity={1} 
            fill="url(#colorTotal)" 
            strokeWidth={2.6}
            dot={{ r: 2.6, fill: '#b9a5f4', strokeWidth: 0 }}
          />
          <Area 
            type="monotone" 
            dataKey="actual" 
            stroke="#5ad9b3" 
            fillOpacity={1} 
            fill="url(#colorActual)" 
            strokeWidth={1.6}
            dot={{ r: 2.2, fill: '#5ad9b3', strokeWidth: 0 }}
          />
          <Area 
            type="monotone" 
            dataKey="rejection" 
            stroke="#ff8787" 
            fill="none" 
            strokeWidth={1.5}
            strokeDasharray="5 5"
            dot={{ r: 2, fill: '#ff8787', strokeWidth: 0 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
});

export default PerformanceChart;
