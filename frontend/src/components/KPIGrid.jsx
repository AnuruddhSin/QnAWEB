import React, { useMemo } from 'react';

export default function KPIGrid({ insights, questions }) {
  const totalInsights = insights.length;
  const totalQuestions = questions.length;
  const uniqueTags = useMemo(() => {
    const s = new Set();
    questions.forEach(q => (q.tags || []).forEach(t => s.add(t)));
    return s.size;
  }, [questions]);

  const mostDiscussed = useMemo(() => {
    if (!questions?.length) return null;
    const q = [...questions].sort((a, b) => (b.answers?.length || 0) - (a.answers?.length || 0))[0];
    return q;
  }, [questions]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div className="bg-white p-4 rounded shadow">
        <div className="text-sm text-gray-500">Total Questions</div>
        <div className="text-2xl font-semibold">{totalQuestions}</div>
      </div>
      <div className="bg-white p-4 rounded shadow">
        <div className="text-sm text-gray-500">Total Insights</div>
        <div className="text-2xl font-semibold">{totalInsights}</div>
      </div>
      <div className="bg-white p-4 rounded shadow">
        <div className="text-sm text-gray-500">Unique Tags</div>
        <div className="text-2xl font-semibold">{uniqueTags}</div>
      </div>
      <div className="bg-white p-4 rounded shadow">
        <div className="text-sm text-gray-500">Most Discussed</div>
        <div className="text-sm font-medium">{mostDiscussed?.title || '—'}</div>
        <div className="text-xs text-gray-500">{(mostDiscussed?.answers?.length || 0)} answers</div>
      </div>
    </div>
  );
}
