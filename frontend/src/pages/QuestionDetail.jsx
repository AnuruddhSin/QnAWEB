import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import { motion, AnimatePresence } from "framer-motion";
import "../styles/QuestionDetail.css";

export default function QuestionDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [question, setQuestion] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedAnswer, setSelectedAnswer] = useState(null); 
  const leftColRef = useRef(null);
  const rightColRef = useRef(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("qa_token") || "";
      const qRes = await axios.get(`/api/questions/${id}`, {
        headers: token ? { Authorization: "Bearer " + token } : undefined,
      });
      const aRes = await axios.get(`/api/answers/${id}`, {
        headers: token ? { Authorization: "Bearer " + token } : undefined,
      });
      setQuestion(qRes.data);
      setAnswers(aRes.data || []);
    } catch (err) {
      console.error(err);
      setError("Could not fetch question details.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [id]);

  useEffect(() => {
    const syncHeights = () => {
      if (!leftColRef.current || !rightColRef.current) return;
      const lh = leftColRef.current.getBoundingClientRect().height;
      rightColRef.current.style.height = `${lh}px`;
    };
    syncHeights();
    window.addEventListener("resize", syncHeights);
    return () => window.removeEventListener("resize", syncHeights);
  }, [question, answers, selectedAnswer, loading]);

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    if (!text.trim()) {
      setError("Please write an answer before submitting.");
      return;
    }
    try {
      const token = localStorage.getItem("qa_token") || "";
      await axios.post(
        "/api/answers",
        { questionId: id, text },
        { headers: token ? { Authorization: "Bearer " + token } : undefined }
      );
      setText("");
      fetchData();
      if (rightColRef.current) {
        const list = rightColRef.current.querySelector(".answers-list");
        if (list) list.scrollTop = 0;
      }
    } catch (err) {
      console.error(err);
      setError("Could not add answer. Please try again.");
    }
  };

  if (loading)
    return (
      <div className="page-wrapper centered">
        <div className="spinner">Loading question…</div>
      </div>
    );

  if (error && !question)
    return (
      <div className="page-wrapper centered">
        <div className="error-banner">{error}</div>
      </div>
    );

  if (!question) return <div className="page-wrapper centered">No question found.</div>;

  return (
    <div className="page-wrapper">
<div className="page-heading animate-in" style={{ textAlign: "center", marginBottom: "2rem" }}>
  <h1
    className="page-title gradient-text"
    style={{
      fontSize: "1.8rem",
      fontWeight: "900",
      lineHeight: "1.2",
      marginBottom: "0.5rem",
    }}
  >
    {question.title}
  </h1>
  <div
    className="page-sub fancy-sub"
    style={{
      fontSize: "1.2rem",
      color: "#475569",
      fontWeight: "500",
    }}
  >
    Asked by <strong>{question.createdBy?.name || "Anonymous"}</strong>{" "}
    • {new Date(question.createdAt).toLocaleString()}
  </div>
</div>


      <div className="two-col-grid">
        <aside className="left-col" ref={leftColRef}>
          <div className="question-box">
            <div className="question-content">
              <h2>Your Question</h2><br></br>
              <div className="q-header">
                <h3 className="q-title small">{question.title}</h3>
              </div>
              <div className="q-body scrollable">
                <ReactMarkdown>{question.description || ""}</ReactMarkdown>
              </div>
            </div>

            <div className="q-footer">
              <div className="tag-row">
                {question.tags?.map((t, i) => (
                  <span className="pill" key={i}>
                    {t}
                  </span>
                ))}
              </div>

            
            </div>
          </div>
        </aside>

        <section className="right-col" ref={rightColRef}>
          <div className="answer-panel">
            <div className="answer-form-top">
              <h3>Your Answer</h3>
              <p className="small-muted">
                Write your answer in Markdown. Explain clearly and provide context.
              </p>

              {error && <div className="error-banner small">{error}</div>}

              <form onSubmit={submit} className="answer-form">
                <textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  aria-label="Answer text"
                  placeholder="Write your answer in Markdown. Provide examples, steps, or code snippets."
                />
                <div className="answer-actions">
                  <button type="submit" className="btn-primary">
                    Submit Answer
                  </button>
                  <button
                    type="button"
                    className="btn-ghost"
                    onClick={() => setText("")}
                    aria-label="Clear answer"
                  >
                    Clear
                  </button>
                </div>
              </form>
            </div>

            <div className="answers-list scrollable">
              <div className="answers-header">
                <strong>{answers.length}</strong> Answers
              </div>

              {answers.length === 0 && (
                <div className="empty-state">No answers yet — be the first to reply.</div>
              )}

              {answers.map((a) => (
                <motion.div
                  key={a._id}
                  layout
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="answer-card"
                >
                  <div className="answer-top">
                    <div className="answer-meta">
                      <strong>{a.createdBy?.name || "User"}</strong>
                      <span className="meta-dot">•</span>
                      <time>{new Date(a.createdAt).toLocaleString()}</time>
                    </div>
                    <div className="answer-controls">
                      <button
                        className="btn-link"
                        onClick={() => setSelectedAnswer(a)}
                        aria-label="Open full answer"
                      >
                        Open
                      </button>
                    </div>
                  </div>

                  <div className="answer-preview">
                    <ReactMarkdown>
                      {a.text.length > 220 ? a.text.slice(0, 220) + "…" : a.text}
                    </ReactMarkdown>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </div>

      <AnimatePresence>
        {selectedAnswer && (
          <motion.div
            className="detail-pane-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedAnswer(null)}
          >
            <motion.div
              className="detail-pane"
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 40, opacity: 0 }}
              transition={{ type: "spring", stiffness: 320, damping: 28 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="detail-header">
                <div>
                  <strong>{selectedAnswer.createdBy?.name || "User"}</strong>
                  <span className="meta-dot">•</span>
                  <time>{new Date(selectedAnswer.createdAt).toLocaleString()}</time>
                </div>
                <div>
                  <button className="btn-ghost" onClick={() => setSelectedAnswer(null)}>
                    Close
                  </button>
                </div>
              </div>

              <div className="detail-body">
                <ReactMarkdown>{selectedAnswer.text}</ReactMarkdown>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
