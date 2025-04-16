import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // Import useNavigate

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
  
  // Initialize useNavigate
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
    console.log(`Field Changed: ${name} = ${value}`);
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

    console.log("Payload:", payload);

    try {
      const response = await api.post(`/auth/${endpoint}`, payload, {
        headers: { "X-Requested-With": "XMLHttpRequest" }
      });

      console.log("Response Data:", response.data);

      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
      }

      if (isLogin) {
        // Redirect to the homepage or dashboard after login
        navigate("/home"); // Modify this path based on your app's route
      } else {
        // Redirect to login page after successful registration
        alert("Registration successful, please login");
        setIsLogin(true);
      }
      
      // Clear form data after successful registration
      if (!isLogin) {
        setFormData({ name: "", email: "", password: "", dateOfBirth: "" });
      }

    } catch (error) {
      console.error("Error occurred:", error);
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

  const styles = {
    container: {
      maxWidth: 400,
      margin: "50px auto",
      padding: 30,
      boxShadow: "0 0 10px rgba(0,0,0,0.1)",
      borderRadius: 8,
      textAlign: "center",
      fontFamily: "sans-serif",
    },
    form: {
      display: "flex",
      flexDirection: "column",
      gap: 12,
    },
    formGroup: {
      textAlign: "left",
      marginBottom: 15,
    },
    label: {
      display: "block",
      marginBottom: 5,
      fontSize: 14,
      fontWeight: 500,
      color: "#444",
    },
    input: {
      width: "100%",
      padding: 10,
      fontSize: 16,
      borderRadius: 5,
      border: "1px solid #ccc",
    },
    button: {
      padding: 12,
      fontSize: 16,
      backgroundColor: "#3B8575",
      color: "#fff",
      border: "none",
      borderRadius: 5,
      cursor: "pointer",
      marginTop: 5,
      transition: "background-color 0.3s",
    },
    disabledButton: {
      backgroundColor: "#8ebdb2",
      cursor: "not-allowed",
    },
    toggle: {
      marginTop: 15,
      color: "#3B8575",
      cursor: "pointer",
      textDecoration: "underline",
    },
    errorMessage: {
      color: "#d32f2f",
      margin: "10px 0",
      fontSize: 14,
      textAlign: "left",
    },
    spinnerContainer: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    spinner: {
      width: 16,
      height: 16,
      marginRight: 8,
      border: "2px solid rgba(255,255,255,0.3)",
      borderRadius: "50%",
      borderTopColor: "#fff",
      animation: "spin 1s ease-in-out infinite",
    }
  };

  return (
    <div style={styles.container}>
      <h2>{isLogin ? "Login" : "Register"}</h2>

      <form onSubmit={handleSubmit} style={styles.form}>
        {!isLogin && (
          <>
            <div style={styles.formGroup}>
              <label htmlFor="name" style={styles.label}>Full Name</label>
              <input
                id="name"
                name="name"
                placeholder="Full Name"
                value={formData.name}
                onChange={handleChange}
                style={styles.input}
                required
              />
            </div>

            <div style={styles.formGroup}>
              <label htmlFor="dateOfBirth" style={styles.label}>Date of Birth</label>
              <input
                id="dateOfBirth"
                name="dateOfBirth"
                type="date"
                value={formData.dateOfBirth}
                onChange={handleChange}
                style={styles.input}
                required
              />
            </div>
          </>
        )}

        <div style={styles.formGroup}>
          <label htmlFor="email" style={styles.label}>Email</label>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            style={styles.input}
            required
          />
        </div>

        <div style={styles.formGroup}>
          <label htmlFor="password" style={styles.label}>Password</label>
          <input
            id="password"
            name="password"
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            style={styles.input}
            required
          />
        </div>

        {error && <div style={styles.errorMessage}>{error}</div>}

        <button 
          type="submit" 
          style={isLoading ? {...styles.button, ...styles.disabledButton} : styles.button}
          disabled={isLoading}
        >
          {isLoading ? (
            <div style={styles.spinnerContainer}>
              <div style={styles.spinner}></div>
              <span>Processing...</span>
            </div>
          ) : (
            isLogin ? "Login" : "Register"
          )}
        </button>
      </form>

      <p onClick={() => setIsLogin(!isLogin)} style={styles.toggle}>
        {isLogin ? "Don't have an account? Register" : "Already have an account? Login"}
      </p>
    </div>
  );
};

export default AuthForm;
