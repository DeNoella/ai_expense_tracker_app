'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface TrendData {
  month: number;
  year: number;
  total: number;
}

const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export default function ExpenseTrendChart({ data }: { data: TrendData[] }) {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 bg-gray-50 rounded-lg">
        <p className="text-gray-500">No trend data available</p>
      </div>
    );
  }

  const chartData = data.map((item) => ({
    month: monthNames[item.month - 1],
    year: item.year,
    total: item.total,
    label: `${monthNames[item.month - 1]} ${item.year}`,
  }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="label" />
        <YAxis />
        <Tooltip formatter={(value: number) => `$${value.toFixed(2)}`} />
        <Legend />
        <Line
          type="monotone"
          dataKey="total"
          stroke="#3B82F6"
          strokeWidth={2}
          name="Expenses"
          dot={{ fill: '#3B82F6', r: 4 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

