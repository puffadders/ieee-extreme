import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Theme from './Theme';
import "../Css/Motivation.css";

function Motivation() {
  const [quote, setQuote] = useState("");
  const [author, setAuthor] = useState("");
  const [loading, setLoading] = useState(false);
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');

  const fetchQuote = async () => {
    setLoading(true);
    try {
      const response = await fetch("https://dummyjson.com/quotes/random");
      const data = await response.json();
      setQuote(data.quote);
      setAuthor(data.author);
    } catch (error) {
      console.error("Error fetching the quote:", error);
      setQuote("An error occurred while fetching the quote.");
      setAuthor("");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchQuote();
  }, []);

  useEffect(() => {
    document.body.className = theme;
    localStorage.setItem('theme', theme);
  }, [theme]);

  return (
    <div className={`motivation-container ${theme}`}>
      {/* Theme Toggle Button */}
      <button
        className="theme-toggle"
        onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
      >
        Switch to {theme === 'light' ? 'dark' : 'light'} mode
      </button>

      {loading ? (
        <p>Loading quote...</p>
      ) : (
        <>
          <p className="quote">“{quote}”</p>
          <small className="author">- {author}</small>
          <br />
          <button className="new-quote" onClick={fetchQuote}>New Quote</button>
        </>
      )}

      <br />
      <Link to="/">Go Back</Link>
    </div>
  );
}

export default Motivation;
