import React, { useState } from 'react';
import { createInsight } from '../api/insightsApi';

export default function InsightForm({ questions = [], onCreated = () => {} }) {
  const [questionId, setQuestionId] = useState('');
  const [summary, setSummary] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const submit = async (e) => {
    e.preventDefault();
    setError(null);
    if (!questionId || !summary.trim()) {
      setError('Please select a question and add a summary.');
      return;
    }
    setLoading(true);
    try {
      const created = await createInsight({ questionId, summary: summary.trim() });
      setSummary('');
      setQuestionId('');
      onCreated(created); 
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to create insight');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submit} className="bg-white p-4 rounded shadow">
      <h3 className="text-lg font-semibold mb-2">Create Insight</h3>
      {error && <div className="text-red-600 mb-2">{error}</div>}
      <label className="block text-sm text-gray-600">Question</label>
      <select
        value={questionId}
        onChange={(e) => setQuestionId(e.target.value)}
        className="mt-1 mb-2 p-2 border rounded w-full"
        required
      >
        <option value="">— Select question —</option>
        {questions.map(q => <option key={q._id} value={q._id}>{q.title}</option>)}
      </select>

      <label className="block text-sm text-gray-600">Summary</label>
      <textarea
        value={summary}
        onChange={(e) => setSummary(e.target.value)}
        rows={4}
        className="mt-1 mb-2 p-2 border rounded w-full"
        placeholder="High-level summary or recommended action..."
        required
      />

      <div className="flex items-center justify-end gap-2">
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-60"
        >
          {loading ? 'Creating…' : 'Create Insight'}
        </button>
      </div>
    </form>
  );
}
