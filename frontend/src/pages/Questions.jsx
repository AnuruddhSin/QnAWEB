import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { Loader2, Search, RefreshCw, Tag, Plus, Trash2 } from "lucide-react";
import "../styles/Questions.css";

const Questions = () => {
  const [questions, setQuestions] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedTag, setSelectedTag] = useState(null);
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("qa_user"));
    } catch {
      return null;
    }
  });

  const fetch = useCallback(
    async (query = "") => {
      try {
        setLoading(true);
        setError("");
        const token = localStorage.getItem("qa_token");
        const res = await axios.get(
          `/api/questions${query ? "?search=" + encodeURIComponent(query) : ""}`,
          { headers: { Authorization: "Bearer " + token } }
        );
        setQuestions(res.data || []);
      } catch (err) {
        console.error(err);
        setError("Failed to load questions. Please try again.");
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // Debounced search
  useEffect(() => {
    const handler = setTimeout(() => {
      fetch(search || selectedTag || "");
    }, 380);
    return () => clearTimeout(handler);
  }, [search, selectedTag, fetch]);

  const handleTagClick = (tag) => {
    setSelectedTag(tag === selectedTag ? null : tag);
    setSearch("");
  };

  // Delete Question (Manager only)
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this question?")) return;
    try {
      const token = localStorage.getItem("qa_token");
      await axios.delete(`/api/questions/${id}`, {
        headers: { Authorization: "Bearer " + token },
      });
      setQuestions((prev) => prev.filter((q) => q._id !== id));
    } catch (err) {
      console.error("Failed to delete:", err);
      alert("Failed to delete question. Try again.");
    }
  };

  return (
    <div className="questions-page" role="main">
      <div className="search-container">
        <div className="search-bar" role="search" aria-label="Search questions">
          <Search size={18} />
          <input
            aria-label="Search input"
            placeholder="Search questions by title, description or tags..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button
            className="refresh-btn"
            onClick={() => fetch(search)}
            title="Refresh questions"
            type="button"
          >
            <RefreshCw size={16} /> Refresh
          </button>
        </div>
      </div>

      {selectedTag && (
        <div className="filter-bar" role="status" aria-live="polite">
          <Tag size={14} />
          Filtering by <b>{selectedTag}</b>
          <button
            className="clear-filter"
            onClick={() => setSelectedTag(null)}
            aria-label="Clear filter"
          >
            ×
          </button>
        </div>
      )}

      {loading ? (
        <div className="loading-state">
          <Loader2 className="spin" size={28} />
          <p>Loading questions...</p>
        </div>
      ) : error ? (
        <div className="error-state">
          <p>{error}</p>
          <button onClick={() => fetch(search)}>Retry</button>
        </div>
      ) : questions.length === 0 ? (
        <div className="empty-state">
          <p>No questions found</p>
          <small>Try searching with different keywords or tags.</small>
        </div>
      ) : (
        <div className="questions-grid" aria-live="polite">
          {questions.map((q) => (
            <div key={q._id} className="question-card" role="article">
              <div className="question-header">
                <h3>
                  <Link to={`/questions/${q._id}`}>{q.title}</Link>
                </h3>

                {/* Show delete button only if user is manager */}
                {user?.role === "manager" && (
                  <button
                    className="delete-btn"
                    onClick={() => handleDelete(q._id)}
                    title="Delete Question"
                    aria-label={`Delete ${q.title}`}
                  >
                    <Trash2 size={18} />
                  </button>
                )}
              </div>

              <p>
                {q.description ? q.description.slice(0, 160) : "No description available."}
                {q.description && q.description.length > 160 ? "…" : ""}
              </p>

              <div className="card-footer">
                <div className="tags">
                  {q.tags?.map((tag) => (
                    <button
                      key={tag}
                      className={`tag ${selectedTag === tag ? "active" : ""}`}
                      onClick={() => handleTagClick(tag)}
                      aria-pressed={selectedTag === tag}
                    >
                      #{tag}
                    </button>
                  ))}
                </div>
                <div className="author">
                  By <b>{q.createdBy?.name || "Anonymous"}</b>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Link to="/ask" className="ask-btn" title="Ask a Question" aria-label="Ask a question">
        <Plus size={22} />
      </Link>

      <footer className="site-footer simple-footer">
        <div className="footer-inner">
          <div className="footer-brand">
          </div>
          
        </div>
      </footer>
    </div>
  );
};

export default Questions;
