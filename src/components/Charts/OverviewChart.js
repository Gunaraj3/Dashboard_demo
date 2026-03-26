import { memo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * (Math.PI / 180));
  const y = cy + radius * Math.sin(-midAngle * (Math.PI / 180));

  return (
    <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize="12" fontWeight="600">
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

const OverviewChart = memo(function OverviewChart({ data: propData }) {
  const chartData = propData && propData.length > 0 ? propData : [
    { name: 'N/A', value: 1, color: '#e9ecef' }
  ];

  const hasData = propData && propData.some(d => d.value > 0);

  return (
    <div style={{ width: '100%', height: 300, position: 'relative' }}>
      <ResponsiveContainer>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            paddingAngle={2}
            dataKey="value"
            labelLine={false}
            label={hasData ? renderCustomizedLabel : null}
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Legend 
            verticalAlign="bottom" 
            align="center" 
            iconType="circle"
            formatter={(value) => (
              <span style={{ color: '#333', fontWeight: 600, fontSize: '12px' }}>
                {value}
              </span>
            )}
          />
          <Tooltip 
            formatter={(value) => [`${value} records`, 'Status']}
            labelFormatter={(label, payload) => payload?.[0]?.name || label}
            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
});

export default OverviewChart;
