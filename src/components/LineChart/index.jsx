import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

// CustomAreaChart Component
const CustomAreaChart = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart
        data={data}
        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
        {/* Gradient definition */}
        <defs>
          <linearGradient id="colorWeight" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#38C68B" stopOpacity={0.8} />
            <stop offset="95%" stopColor="#38C68B" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Area
          type="monotone"
          dataKey="weight"
          stroke="#38C68B"
          fillOpacity={1}
          fill="url(#colorWeight)"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default CustomAreaChart;
