export function exportToCSV(filename, rows = []) {
  if (!rows || !rows.length) return;
  const keys = Object.keys(rows[0]);
  const csv = [
    keys.join(','),
    ...rows.map(r =>
      keys.map(k => {
        let v = r[k] ?? '';
        v = String(v).replace(/"/g, '""'); // escape quotes
        if (v.includes(',') || v.includes('"') || v.includes('\n')) {
          return `"${v}"`;
        }
        return v;
      }).join(',')
    )
  ].join('\n');

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
