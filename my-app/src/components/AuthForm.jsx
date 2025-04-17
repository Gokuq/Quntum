import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; 

const AuthForm = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    dateOfBirth: "",
  });

  const navigate = useNavigate();

  const api = axios.create({
    baseURL: "http://localhost:3000/api",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json"
    },
    withCredentials: true
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const endpoint = isLogin ? "login" : "register";
    const payload = isLogin
      ? { email: formData.email, password: formData.password }
      : { name: formData.name, email: formData.email, password: formData.password, dateOfBirth: formData.dateOfBirth };

    try {
      const response = await api.post(`/auth/${endpoint}`, payload, {
        headers: { "X-Requested-With": "XMLHttpRequest" }
      });

      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
      }

      if (isLogin) {
        navigate("/home");
      } else {
        alert("Registration successful, please login");
        setIsLogin(true);
      }

      if (!isLogin) {
        setFormData({ name: "", email: "", password: "", dateOfBirth: "" });
      }

    } catch (error) {
      if (error.response) {
        setError(error.response.data.message || `Error: ${error.response.status}`);
      } else if (error.request) {
        setError("No response from server. Please check your connection.");
      } else {
        setError(error.message || "An unknown error occurred");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const toggleForm = () => {
    setIsLogin(!isLogin);
    setError(null);
    setFormData({ name: "", email: "", password: "", dateOfBirth: "" });
  };

  const styles = {
    background: {
      background: "linear-gradient(to bottom right, #0fd9c6, #034e4e)",
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "1rem 0",
      boxSizing: "border-box",
    },
    card: {
      backgroundColor: "#1e2a38",
      borderRadius: "16px",
      padding: "2rem",
      width: "90%",
      maxWidth: "400px",
      boxShadow: "0 8px 20px rgba(0,0,0,0.4)",
      position: "relative",
      color: "#fff",
      display: "flex",
      flexDirection: "column",
      gap: "1.5rem",
    },
    header: {
      backgroundColor: "#3ef0d3",
      color: "#000",
      textAlign: "center",
      padding: "0.75rem",
      borderRadius: "8px",
      fontWeight: "bold",
      marginTop: "-3rem",
      marginBottom: "0.5rem",
      boxShadow: "0 4px 12px rgba(0,240,210,0.3)",
    },
    userCircle: {
      width: "80px",
      height: "80px",
      borderRadius: "50%",
      backgroundColor: "#2f3d4d",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      margin: "0 auto 1rem",
      border: "4px solid #3ef0d3",
      boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
    },
    userIcon: {
      fontSize: "40px",
      color: "#3ef0d3",
    },
    formGroup: {
      display: "flex",
      flexDirection: "column",
      gap: "0.5rem",
    },
    label: {
      fontSize: "0.9rem",
      fontWeight: "500",
      color: "#fff",
      marginBottom: "0.25rem",
    },
    input: {
      padding: "0.75rem",
      borderRadius: "8px",
      border: "1px solid #3a4a5d",
      outline: "none",
      backgroundColor: "#2f3d4d",
      color: "#fff",
      fontSize: "1rem",
      transition: "border-color 0.3s ease",
      width: "100%",
      boxSizing: "border-box",
    },
    inputFocus: {
      borderColor: "#3ef0d3",
    },
    footer: {
      display: "flex",
      justifyContent: "space-between",
      fontSize: "0.85rem",
      color: "#bbb",
      marginTop: "0.5rem",
    },
    switchFormText: {
      cursor: "pointer",
      color: "#3ef0d3",
      textDecoration: "none",
      fontWeight: "500",
      transition: "color 0.3s ease",
    },
    switchFormTextHover: {
      color: "#fff",
    },
    button: {
      backgroundColor: "#3ef0d3",
      color: "#000",
      padding: "0.8rem",
      borderRadius: "8px",
      fontWeight: "bold",
      border: "none",
      cursor: "pointer",
      fontSize: "1rem",
      transition: "all 0.3s ease",
      marginTop: "0.5rem",
    },
    buttonHover: {
      backgroundColor: "#2ad4bc",
      boxShadow: "0 4px 12px rgba(62,240,211,0.3)",
    },
    errorMessage: {
      color: "#ff5c5c",
      fontSize: "14px",
      backgroundColor: "rgba(255, 92, 92, 0.1)",
      padding: "0.5rem",
      borderRadius: "4px",
      borderLeft: "3px solid #ff5c5c",
    }
  };

  return (
    <div style={styles.background}>
      <div style={styles.card}>
        <div style={styles.header}>
          <h2>{isLogin ? "Login" : "Register"}</h2>
        </div>

        <div style={styles.userCircle}>
          <div style={styles.userIcon}>
            {/* User icon as text, could be replaced with an SVG icon */}
            👤
          </div>
        </div>
        
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {!isLogin && (
            <>
              <div style={styles.formGroup}>
                <label style={styles.label} htmlFor="name">Full Name</label>
                <input
                  style={styles.input}
                  id="name"
                  name="name"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label} htmlFor="dateOfBirth">Date of Birth</label>
                <input
                  style={styles.input}
                  id="dateOfBirth"
                  name="dateOfBirth"
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                  required
                />
              </div>
            </>
          )}

          <div style={styles.formGroup}>
            <label style={styles.label} htmlFor="email">Email</label>
            <input
              style={styles.input}
              id="email"
              name="email"
              type="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label} htmlFor="password">Password</label>
            <input
              style={styles.input}
              id="password"
              name="password"
              type="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          {error && <div style={styles.errorMessage}>{error}</div>}

          <button
            type="submit"
            style={isLoading ? 
              { ...styles.button, opacity: "0.7", cursor: "not-allowed" } : 
              styles.button}
            disabled={isLoading}
            onMouseOver={(e) => {
              if (!isLoading) {
                e.target.style.backgroundColor = styles.buttonHover.backgroundColor;
                e.target.style.boxShadow = styles.buttonHover.boxShadow;
              }
            }}
            onMouseOut={(e) => {
              if (!isLoading) {
                e.target.style.backgroundColor = styles.button.backgroundColor;
                e.target.style.boxShadow = "none";
              }
            }}
          >
            {isLoading ? "Processing..." : isLogin ? "Login" : "Register"}
          </button>

          {isLogin && (
            <div style={{ textAlign: "center", marginTop: "0.5rem" }}>
              <a 
                href="#" 
                style={{ color: "#a0c8c2", fontSize: "0.8rem", textDecoration: "none" }}
                onClick={(e) => e.preventDefault()}
              >
                Forgot your password?
              </a>
            </div>
          )}
        </form>

        <div style={styles.footer}>
          <p 
            style={styles.switchFormText}
            onClick={toggleForm}
            onMouseOver={(e) => {
              e.target.style.color = styles.switchFormTextHover.color;
            }}
            onMouseOut={(e) => {
              e.target.style.color = styles.switchFormText.color;
            }}
          >
            {isLogin ? "Don't have an account? Register" : "Already have an account? Login"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;