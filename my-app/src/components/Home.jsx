import React, { useEffect, useState } from "react";

const Home = () => {
  const [users, setUsers] = useState([]);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [userStatus, setUserStatus] = useState({}); // Store user-specific status

  useEffect(() => {
    // Fetch users data from API
    fetch("http://localhost:3000/api/auth/users")
      .then((response) => response.json())
      .then((data) => {
        setUsers(data);
        
        // Load status from localStorage if exists
        const storedStatus = JSON.parse(localStorage.getItem("userStatus")) || {};
        setUserStatus(storedStatus);
      })
      .catch((error) => console.error("Error fetching users:", error));
  }, []);

  const handlePhotoChange = (userId, e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const photoUrl = reader.result;
        // Save photo URL in localStorage for the specific user
        localStorage.setItem(`photo_${userId}`, photoUrl);
        setSelectedPhoto(photoUrl);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleStatusChange = (userId, newStatus) => {
    const updatedStatus = { ...userStatus, [userId]: newStatus };
    setUserStatus(updatedStatus);
    // Save status in localStorage
    localStorage.setItem("userStatus", JSON.stringify(updatedStatus));
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>Welcome to the Home Page!</h1>
      <p style={styles.subHeader}>You are successfully logged in.</p>
      <div style={styles.tableContainer}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.tableHeader}>Photo</th>
              <th style={styles.tableHeader}>Name</th>
              <th style={styles.tableHeader}>Date of Birth</th>
              <th style={styles.tableHeader}>Email</th>
              <th style={styles.tableHeader}>Created At</th>
              <th style={styles.tableHeader}>Status</th>
              <th style={styles.tableHeader}>Action</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id} style={styles.tableRow}>
                <td style={styles.tableCell}>
                  <img
                    src={localStorage.getItem(`photo_${user._id}`) || selectedPhoto || "/default-profile.png"}
                    alt="Profile"
                    style={styles.photo}
                  />
                  <input
                    type="file"
                    onChange={(e) => handlePhotoChange(user._id, e)}
                    style={styles.fileInput}
                  />
                </td>
                <td style={styles.tableCell}>{user.name}</td>
                <td style={styles.tableCell}>{new Date(user.dateOfBirth).toLocaleDateString()}</td>
                <td style={styles.tableCell}>{user.email}</td>
                <td style={styles.tableCell}>{new Date(user.createdAt).toLocaleDateString()}</td>
                <td style={styles.tableCell}>
                  <select
                    value={userStatus[user._id] || "Active"}
                    onChange={(e) => handleStatusChange(user._id, e.target.value)}
                    style={styles.dropdown}
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                    <option value="Suspended">Suspended</option>
                  </select>
                </td>
                <td style={styles.tableCell}>
                  <button style={styles.actionButton}>
                    <span style={styles.icon}>⚙️</span> Settings
                  </button>
                  <button style={styles.deleteButton}>
                    <span style={styles.icon}>❌</span> Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: "20px",
    fontFamily: "Arial, sans-serif",
    backgroundColor: "#f4f7fc",
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    backdropFilter: "blur(10px)", // Glassmorphism effect
    boxShadow: "0 4px 15px rgba(0, 0, 0, 0.1)",
    borderRadius: "10px",
    background: "rgba(255, 255, 255, 0.1)", // Semi-transparent background
  },
  header: {
    fontSize: "2rem",
    color: "#333",
    marginBottom: "10px",
  },
  subHeader: {
    fontSize: "1.2rem",
    color: "#666",
    marginBottom: "20px",
  },
  tableContainer: {
    width: "80%",
    marginTop: "20px",
    overflowX: "auto",
    borderRadius: "8px",
    backgroundColor: "#fff",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
  },
  tableHeader: {
    padding: "12px",
    backgroundColor: "#3B8575",
    color: "#fff",
    textAlign: "left",
    fontWeight: "bold",
  },
  tableRow: {
    borderBottom: "1px solid #ddd",
  },
  tableCell: {
    padding: "12px",
    color: "#333",
    textAlign: "left",
  },
  dropdown: {
    padding: "8px",
    borderRadius: "4px",
    border: "1px solid #ccc",
    cursor: "pointer",
  },
  fileInput: {
    marginTop: "10px",
  },
  photo: {
    width: "50px",
    height: "50px",
    borderRadius: "50%",
    marginRight: "10px",
  },
  actionButton: {
    padding: "8px 12px",
    backgroundColor: "#3B8575",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    marginRight: "10px",
  },
  deleteButton: {
    padding: "8px 12px",
    backgroundColor: "#E74C3C",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
  icon: {
    marginRight: "5px",
  },
};

export default Home;
