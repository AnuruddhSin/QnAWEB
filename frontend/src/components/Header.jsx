import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { FiMenu, FiX, FiSearch, FiSun, FiMoon } from "react-icons/fi";
import { AuthContext } from "../context/AuthContext"; 
export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  

  const [mobileOpen, setMobileOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(
    () => localStorage.getItem("theme") === "dark"
  );
  const [query, setQuery] = useState("");
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("qa_user"));
    } catch {
      return null;
    }
  });
  const [profileOpen, setProfileOpen] = useState(false);

  const mobileRef = useRef(null);
  const hamburgerRef = useRef(null);
  const profileRef = useRef(null);

  useEffect(() => {
    const html = document.documentElement;
    if (darkMode) {
      html.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      html.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  useEffect(() => {
    setMobileOpen(false);
    setProfileOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    function handleClickOutside(e) {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    }
    if (profileOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [profileOpen]);

  useEffect(() => {
    function handleClickOutside(e) {
      if (
        mobileRef.current &&
        !mobileRef.current.contains(e.target) &&
        hamburgerRef.current &&
        !hamburgerRef.current.contains(e.target)
      ) {
        setMobileOpen(false);
      }
    }
    if (mobileOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [mobileOpen]);

  const handleLogout = () => {
    localStorage.removeItem("qa_user");
    localStorage.removeItem("qa_token");
    setUser(null);
    navigate("/login");
  };

  const onSearchSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/questions?q=${encodeURIComponent(query.trim())}`);
      setQuery("");
    } else {
      navigate("/questions");
    }
  };

  const navLinks = [
    { label: "Questions", to: "/questions" },
    { label: "Ask", to: "/ask" },
    ...(user?.role === "manager"
      ? [{ label: "Manager Insights", to: "/manager" }]
      : []),
  ];

  return (
    <header className="header" role="banner" aria-label="Main header">
      <div className="header-inner">
        <div className="header-left">
          <Link to="/" className="logo" aria-label="Home">
            <div className="logo-badge"> Q&A</div>
            <div className="logo-text">
              <div className="brand">Mini Q.&.A.</div>
              <div className="tagline">Mini Q.&.A. Platform</div>
            </div>
          </Link>

         
        </div>

        <div className="header-right">
           <nav className="nav-desktop" aria-label="Primary navigation">
            {navLinks.map((n) => {
              const active = location.pathname === n.to;
              return (
                <Link
                  key={n.to}
                  to={n.to}
                  className={`nav-link ${active ? "active" : ""}`}
                >
                  {n.label}
                </Link>
              );
            })}
          </nav>
          <button
            onClick={() => setDarkMode((s) => !s)}
            className="icon-btn"
            title={darkMode ? "Switch to light mode" : "Switch to dark mode"}
            aria-pressed={darkMode}
          >
            {darkMode ? <FiSun /> : <FiMoon />}
          </button>

          {user ? (
            <div ref={profileRef} className="profile-wrapper">
              <button
                className="avatar-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  setProfileOpen((prev) => !prev);
                }}
                aria-expanded={profileOpen}
                aria-label="Open profile menu"
              >
                <img
                  src="/src/assets/avatar.png"
                  alt="avatar"
                  className="avatar"
                  onError={(e) => {
                    e.currentTarget.src =
                      "https://cdn-icons-png.flaticon.com/512/3135/3135715.png";
                  }}
                />
              </button>

              <div className={`profile-menu ${profileOpen ? "show" : ""}`}>
                <div className="profile-header">
                  <strong>{user?.name || "User"}</strong>
                  <small className="role">{user?.role || "Member"}</small>
                </div>

             

                <button
                  className="profile-item destructive"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </div>
            </div>
          ) : (
            <Link to="/login" className="btn-login">
              Login
            </Link>
          )}

          <button
            ref={hamburgerRef}
            className="icon-btn mobile-only"
            onClick={() => setMobileOpen((s) => !s)}
            aria-label="Toggle menu"
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <FiX /> : <FiMenu />}
          </button>
        </div>
      </div>

      <div
        ref={mobileRef}
        className={`mobile-panel ${mobileOpen ? "open" : ""}`}
        aria-hidden={!mobileOpen}
      >
        <nav className="mobile-nav">
          {navLinks.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              className={`mobile-link ${
                location.pathname === n.to ? "active" : ""
              }`}
              onClick={() => setMobileOpen(false)}
            >
              {n.label}
            </Link>
          ))}

          <div className="mobile-divider" />
          <button
            className="mobile-theme-toggle"
            onClick={() => setDarkMode((s) => !s)}
          >
            {darkMode ? "Switch to light mode" : "Switch to dark mode"}
          </button>
          <div className="mobile-divider" />

          {user ? (
            <>
           
              <button
                onClick={() => {
                  handleLogout();
                  setMobileOpen(false);
                }}
                className="mobile-link destructive"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              to="/login"
              onClick={() => setMobileOpen(false)}
              className="mobile-link"
            >
              Login
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
