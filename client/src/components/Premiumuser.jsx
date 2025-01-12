import React from "react";

const PremiumUserpage = ({ isPremium }) => {
  return (
    <div style={styles.pageContainer}>
      <div style={styles.container}>
        <h1 style={styles.heading}>Welcome to the Premium Zone 🎉</h1>
        <p style={styles.subHeading}>
          You now have exclusive access to premium content, resources, and much more!
        </p>
        <div style={styles.features}>
          <ul>
          <li>📖 Access to premium-only content</li>
            <li>📚 Early access to new releases</li>
            <li>💸 Special discounts on purchases</li>
            <li>🚫 Ad-free reading experience</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

// Inline CSS styles
const styles = {
  pageContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh", // Full viewport height
    backgroundColor: "#ffffff",
  },
  container: {
    textAlign: "center",
    padding: "20px",
    maxWidth: "800px",
    margin: "0 auto",
    fontFamily: "'Arial', sans-serif",
    backgroundColor: "#f8f9fa",
    borderRadius: "8px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
  },
  heading: {
    color: "#4CAF50",
    fontSize: "2.5rem",
  },
  subHeading: {
    color: "#555",
    fontSize: "1.2rem",
    marginTop: "10px",
  },
  features: {
    marginTop: "20px",
    fontSize: "1.1rem",
    lineHeight: "1.8",
  },
};

export default PremiumUserpage;
