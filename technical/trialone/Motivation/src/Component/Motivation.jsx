import React, { useState, useEffect } from 'react';

function Motivation() {
  const [quote, setQuote] = useState("");
  const [author, setAuthor] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchQuote = async () => {
    setLoading(true);
    try {
      const response = await fetch("https://dummyjson.com/quotes/random");
      const data = await response.json();
      setQuote(data.quote);   // ✅ Corrected property name
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

  return (
    <div style={{
      textAlign: "center",
      color: "white",
      marginTop: "3rem",
      fontFamily: "Georgia, serif"
    }}>
      {loading ? (
        <p>Loading quote...</p>
      ) : (
        <>
          <p style={{ fontSize: "1.3rem", maxWidth: "400px", margin: "auto" }}>
            “{quote}”
          </p>
          <small>- {author}</small>
          <br />
          <button 
            onClick={fetchQuote}
            style={{
              marginTop: "1rem",
              backgroundColor: "#111",
              color: "white",
              border: "none",
              borderRadius: "5px",
              padding: "0.5rem 1rem",
              cursor: "pointer"
            }}
          >
            New Quote
          </button>
        </>
      )}
    </div>
  );
}

export default Motivation;
