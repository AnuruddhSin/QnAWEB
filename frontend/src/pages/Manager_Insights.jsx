import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Legend,
  CartesianGrid,
} from "recharts";
import "../styles/Insights.css";

export default function Insights() {
  const [insights, setInsights] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [questionId, setQuestionId] = useState("");
  const [answers, setAnswers] = useState([]); // ✅ NEW

  const [summary, setSummary] = useState("");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("qa_token");
  const user = JSON.parse(localStorage.getItem("qa_user") || "{}");

  const fetchData = async () => {
    setLoading(true);
    try {
      const [insRes, qRes, aRes] = await Promise.all([
        axios.get("/api/insights", {
          headers: { Authorization: "Bearer " + token },
        }),
        axios.get("/api/questions", {
          headers: { Authorization: "Bearer " + token },
        }),
        axios.get("/api/answers", { headers: { Authorization: "Bearer " + token } }),
       
      ]);
      setInsights(insRes.data || []);
      setQuestions(qRes.data || []);
      setAnswers(aRes.data || []);
    } catch (err) {
      console.error("Error fetching data:", err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!questionId || !summary.trim()) return alert("Please fill all fields");
    try {
      await axios.post(
        "/api/insights",
        { questionId, summary },
        { headers: { Authorization: "Bearer " + token } }
      );
      setSummary("");
      setQuestionId("");
      fetchData();
    } catch (err) {
      console.error("Error creating insight:", err);
      alert("Failed to create insight.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this insight?")) return;
    try {
      await axios.delete(`/api/insights/${id}`, {
        headers: { Authorization: "Bearer " + token },
      });
      setInsights((prev) => prev.filter((i) => i._id !== id));
    } catch (err) {
      console.error("Error deleting insight:", err);
      alert("Failed to delete insight. Please try again.");
    }
  };

  const totalQuestions = questions.length;
  const totalInsights = insights.length;
  const uniqueTags = [...new Set(questions.flatMap((q) => q.tags || []))].length;

  const COLORS = ["#6366f1", "#22c55e", "#f97316", "#e11d48", "#8b5cf6"];

  const tagData = useMemo(() => {
    const map = {};
    insights.forEach((i) =>
      (i.questionId?.tags || []).forEach(
        (tag) => (map[tag] = (map[tag] || 0) + 1)
      )
    );
    return Object.entries(map).map(([tag, count]) => ({ tag, count }));
  }, [insights]);

  const barData = useMemo(() => {
  return questions.map((q) => {
    const answerCount = answers.filter(
      (a) => a.questionId?._id === q._id || a.questionId === q._id
    ).length;

    const insightCount = insights.filter(
      (i) => i.questionId?._id === q._id
    ).length;

    return {
      title:
        q.title?.length > 25
          ? q.title.slice(0, 25) + "…"
          : q.title || "Untitled",
      answers: answerCount,
      insights: insightCount,
    };
  });
}, [questions, answers, insights]);


  const filtered = insights.filter((i) =>
    i.questionId?.title?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="insights-dashboard">
      <header className="dashboard-header">
        <h1>Manager Insights Dashboard</h1>
        <p>Analyze team activity, track engagement, and manage insights.</p>
      </header>

      {loading ? (
        <div className="loading">Loading...</div>
      ) : (
        <div className="dashboard-content">
          <div className="dashboard-grid">
            <div className="left-column">
              <div className="kpi-grid">
                <div className="kpi-box">
                  <h2>{totalQuestions}</h2>
                  <p>Total Questions</p>
                </div>
                <div className="kpi-box">
                  <h2>{totalInsights}</h2>
                  <p>Total Insights</p>
                </div>
                <div className="kpi-box">
                  <h2>{uniqueTags}</h2>
                  <p>Unique Tags</p>
                </div>
              </div>

              <div className="chart-card">
                <h3>Insights by Tag</h3>
                {tagData.length > 0 ? (
              <ResponsiveContainer width="100%" height={260}>
  <PieChart>
    <Pie
      dataKey="count" 
      data={tagData}
      outerRadius={100}
      label={({ tag, count }) => `${tag} (${count})`} 
    >
      {tagData.map((entry, i) => (
        <Cell key={i} fill={COLORS[i % COLORS.length]} />
      ))}
    </Pie>

    <Tooltip
      formatter={(value, name, props) => [`${value} insights`, props.payload.tag]}
    />

    <Legend/>
  </PieChart>
</ResponsiveContainer>



                ) : (
                  <p className="empty">No tag data available.</p>
                )}
              </div>

              <div className="chart-card">
                <h3>Answers vs Insights (per Question)</h3>
                {barData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={260}>
                    <BarChart data={barData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="title" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="answers" fill="#3b82f6" name="Answers" />
                      <Bar dataKey="insights" fill="#22c55e" name="Insights" />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <p className="empty">No chart data available.</p>
                )}
              </div>
            </div>

            <div className="right-column">
              <div className="search-box">
                <input
                  type="text"
                  placeholder="Search by question title..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>

              <div className="table-container">
                <h3>All Insights</h3>
                <div className="table-scroll">
                  {filtered.length === 0 ? (
                    <p className="empty">No insights found.</p>
                  ) : (
                    <table>
                      <thead>
                        <tr>
                          <th>Question</th>
                          <th>Summary</th>
                          <th>Tags</th>
                          <th>By</th>
                          <th>Date</th>
                          {user?.role === "manager" && <th>Action</th>}
                        </tr>
                      </thead>
                      <tbody>
                        {filtered.map((i) => (
                          <tr key={i._id}>
                            <td>{i.questionId?.title}</td>
                            <td>{i.summary}</td>
                            <td>{(i.questionId?.tags || []).join(", ")}</td>
                            <td>{i.createdBy?.name || "Manager"}</td>
                            <td>{new Date(i.createdAt).toLocaleDateString()}</td>
                            {user?.role === "manager" && (
                              <td>
                                <button
                                  className="delete-insight-btn"
                                  onClick={() => handleDelete(i._id)}
                                >
                                  Delete
                                </button>
                              </td>
                            )}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>

              <div className="create-box">
                <h3>Create New Insight</h3>
                <form onSubmit={handleCreate}>
                  <select
                    value={questionId}
                    onChange={(e) => setQuestionId(e.target.value)}
                    required
                  >
                    <option value="">Select Question</option>
                    {questions.map((q) => (
                      <option key={q._id} value={q._id}>
                        {q.title}
                      </option>
                    ))}
                  </select>
                  <textarea
                    placeholder="Write your insight summary..."
                    value={summary}
                    onChange={(e) => setSummary(e.target.value)}
                    required
                  />
                  <button type="submit">Add Insight</button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
