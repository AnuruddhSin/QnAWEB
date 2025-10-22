import React, { useMemo } from 'react';
import {
  ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, LineChart, Line
} from 'recharts';

const COLORS = ['#3b82f6', '#10b981', '#f97316', '#e11d48', '#8b5cf6', '#06b6d4'];

export default function ChartsPanel({ insights = [], questions = [] }) {
  const tagData = useMemo(() => {
    const map = {};
    insights.forEach(i => {
      (i.questionId?.tags || []).forEach(t => (map[t] = (map[t] || 0) + 1));
    });
    return Object.entries(map).map(([tag, count]) => ({ name: tag, value: count }));
  }, [insights]);

  const barData = useMemo(() => {
    return questions
      .map(q => ({
        title: q.title.length > 20 ? q.title.slice(0, 20) + '…' : q.title,
        answers: q.answers?.length || 0,
        insights: insights.filter(i => i.questionId?._id === q._id).length,
      }))
      .sort((a, b) => (b.answers + b.insights) - (a.answers + a.insights))
      .slice(0, 8);
  }, [questions, insights]);

  const lineData = useMemo(() => {
    const map = {};
    insights.forEach(i => {
      const day = new Date(i.createdAt).toISOString().slice(0,10);
      map[day] = (map[day] || 0) + 1;
    });
    return Object.entries(map).sort(([a],[b]) => a.localeCompare(b)).map(([day, count]) => ({ day, insights: count }));
  }, [insights]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <div className="bg-white p-4 rounded shadow col-span-1 lg:col-span-1">
        <h4 className="font-medium mb-2">Insights by Tag</h4>
        {tagData.length ? (
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={tagData} dataKey="value" nameKey="name" outerRadius={80} label>
                {tagData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        ) : <div className="text-sm text-gray-500">No tag data</div>}
      </div>

      <div className="bg-white p-4 rounded shadow col-span-1 lg:col-span-1">
        <h4 className="font-medium mb-2">Answers vs Insights (top questions)</h4>
        {barData.length ? (
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={barData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="title" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="answers" name="Answers" fill={COLORS[0]} />
              <Bar dataKey="insights" name="Insights" fill={COLORS[1]} />
            </BarChart>
          </ResponsiveContainer>
        ) : <div className="text-sm text-gray-500">Insufficient data</div>}
      </div>

      <div className="bg-white p-4 rounded shadow col-span-1 lg:col-span-1">
        <h4 className="font-medium mb-2">Insights Trend</h4>
        {lineData.length ? (
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={lineData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="insights" stroke={COLORS[2]} strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        ) : <div className="text-sm text-gray-500">No trend data</div>}
      </div>
    </div>
  );
}
