import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/AskQuestion.css";
import { useNavigate } from "react-router-dom";

export default function AskQuestion() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const draft = JSON.parse(localStorage.getItem("qa_draft_question"));
    if (draft) {
      setTitle(draft.title || "");
      setDescription(draft.description || "");
      setTags(draft.tags || []);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(
      "qa_draft_question",
      JSON.stringify({ title, description, tags })
    );
  }, [title, description, tags]);

  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
    }
    setTagInput("");
  };

  const removeTag = (tagToRemove) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  const submit = async (e) => {
    e.preventDefault();
    setError("");

    if (!title.trim()) return setError("Title is required");
    if (title.trim().length < 10)
      return setError("Title must be at least 10 characters");

    try {
      const token = localStorage.getItem("qa_token");
      await axios.post(
        "/api/questions",
        { title, description, tags },
        { headers: { Authorization: "Bearer " + token }, withCredentials: true }
      );

      localStorage.removeItem("qa_draft_question");
      navigate("/questions");
    } catch (err) {
      console.error(err);
      setError("❌ Could not post question. Please try again.");
    }
  };

  return (
    <div className="page-wrapper">
      <div className="ask-page">
        <div className="ask-header">
          <h2>Ask a Question</h2>
          <p>Be specific and imagine you’re asking another person face-to-face.</p>
        </div>

        {error && <div className="error-banner">{error}</div>}

        <form onSubmit={submit} className="ask-form">
          <label>Title</label>
          <input
            type="text"
            placeholder="E.g Query 1 What do you want to ask"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            maxLength={150}
          />
          <div className="char-count">{title.length}/150</div>

          <label>Description</label>
          <textarea
            placeholder="Explain what you’ve tried and what you expected..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={6}
            maxLength={2000}
          />
          <div className="char-count">{description.length}/2000</div>

          <label>Tags</label>
          <div className="tag-input-container">
            <input
              type="text"
              placeholder="Add tags (press Enter)"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addTag();
                }
              }}
            />
            <button
              type="button"
              className="btn-tag"
              onClick={addTag}
              disabled={!tagInput.trim()}
            >
              Add
            </button>
          </div>

          <div className="tag-list">
            {tags.map((tag, index) => (
              <span key={index} className="tag">
                #{tag}
                <button
                  type="button"
                  className="remove-tag"
                  onClick={() => removeTag(tag)}
                >
                  ×
                </button>
              </span>
            ))}
          </div>

          <div className="form-actions">
            <button type="submit" className="btn-submit">
              🚀 Post Question
            </button>
            <button
              type="button"
              className="btn-clear"
              onClick={() => {
                setTitle("");
                setDescription("");
                setTags([]);
                localStorage.removeItem("qa_draft_question");
              }}
            >
              🗑️ Clear Draft
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
