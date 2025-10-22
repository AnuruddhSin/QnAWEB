import { useEffect, useState, useCallback } from 'react';
import * as api from '../api/insightsApi';

export function useInsights({ initialPage = 1, initialLimit = 10 } = {}) {
  const [insights, setInsights] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState(null); 
  const [error, setError] = useState(null);

  const [page, setPage] = useState(initialPage);
  const [limit, setLimit] = useState(initialLimit);
  const [search, setSearch] = useState('');
  const [tag, setTag] = useState('');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [total, setTotal] = useState(0);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = { page, limit, search, tag, from, to };
      const [insightsRes, questionsRes] = await Promise.all([
        api.fetchInsights(params),
        api.fetchQuestions(),
      ]);
      if (Array.isArray(insightsRes)) {
        setInsights(insightsRes);
        setTotal(insightsRes.length);
      } else {
        setInsights(insightsRes.data || insightsRes.insights || []);
        setTotal(insightsRes.total ?? (insightsRes.data?.length ?? 0));
      }
      setQuestions(questionsRes || []);
      try {
        const s = await api.fetchStats();
        setStats(s);
      } catch (e) {
        setStats(null);
      }
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [page, limit, search, tag, from, to]);

  useEffect(() => {
    load();
  }, [load]);

  const refresh = () => load();

  return {
    insights,
    questions,
    loading,
    error,
    stats,
    pagination: { page, setPage, limit, setLimit, total },
    filters: { search, setSearch, tag, setTag, from, setFrom, to, setTo },
    refresh,
  };
}
