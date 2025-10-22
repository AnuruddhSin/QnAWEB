import React, { useMemo } from 'react';
import { exportToCSV } from '../utils/csv';

export default function InsightsTable({
  insights = [],
  page,
  limit,
  total,
  setPage,
  setLimit,
  onExport,
  loading,
}) {
  const pages = Math.max(1, Math.ceil(total / limit));

  const rowsForExport = useMemo(() => insights.map(i => ({
    id: i._id,
    question: i.questionId?.title || i.questionId || '',
    summary: i.summary,
    createdBy: i.createdBy?.name || '',
    createdAt: i.createdAt ? new Date(i.createdAt).toISOString() : '',
    tags: (i.questionId?.tags || []).join(';'),
  })), [insights]);

  return (
    <div className="bg-white p-4 rounded shadow">
      <div className="flex items-center justify-between mb-3">
        <div className="text-sm text-gray-600">Showing {(page-1)*limit + 1} — {Math.min(page*limit, total)} of {total}</div>
        <div className="flex items-center gap-2">
          <select
            value={limit}
            onChange={(e) => setLimit(Number(e.target.value))}
            className="p-1 border rounded"
          >
            {[5,10,20,50].map(n => <option key={n} value={n}>{n}/page</option>)}
          </select>
          <button
            onClick={() => exportToCSV(`insights_export_${Date.now()}.csv`, rowsForExport)}
            className="px-3 py-1 bg-green-600 text-white rounded text-sm"
            disabled={!insights.length || loading}
          >
            Export CSV
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left table-auto">
          <thead>
            <tr className="text-sm text-gray-500">
              <th className="p-2">Question</th>
              <th className="p-2">Summary</th>
              <th className="p-2">Tags</th>
              <th className="p-2">By</th>
              <th className="p-2">Created</th>
            </tr>
          </thead>
          <tbody>
            {insights.map(i => (
              <tr key={i._id} className="border-t">
                <td className="p-2 align-top font-medium">{i.questionId?.title || i.questionId}</td>
                <td className="p-2 align-top text-sm">{i.summary}</td>
                <td className="p-2 align-top text-sm">{(i.questionId?.tags || []).join(', ')}</td>
                <td className="p-2 align-top text-sm">{i.createdBy?.name}</td>
                <td className="p-2 align-top text-sm">{new Date(i.createdAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-3 flex items-center justify-between">
        <div className="text-sm text-gray-600">Page {page} of {pages}</div>
        <div className="flex items-center gap-2">
          <button onClick={() => setPage(p => Math.max(1, p-1))} className="px-2 py-1 border rounded" disabled={page<=1}>Prev</button>
          <button onClick={() => setPage(p => Math.min(pages, p+1))} className="px-2 py-1 border rounded" disabled={page>=pages}>Next</button>
        </div>
      </div>
    </div>
  );
}
