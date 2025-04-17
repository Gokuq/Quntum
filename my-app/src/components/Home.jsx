import React, { useEffect, useState } from "react";

// Regular CSS styles
const styles = {
  container: {
    width: "100%",
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "20px"
  },
  header: {
    fontSize: "24px",
    fontWeight: "bold",
    marginBottom: "20px"
  },
  tableContainer: {
    boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
    borderRadius: "8px",
    overflowX: "auto",
    backgroundColor: "white"
  },
  table: {
    width: "100%",
    borderCollapse: "collapse"
  },
  tableHeader: {
    padding: "12px 16px",
    textAlign: "left",
    fontSize: "12px",
    fontWeight: "600",
    color: "#6b7280",
    backgroundColor: "#f9fafb",
    borderBottom: "1px solid #e5e7eb",
    textTransform: "uppercase"
  },
  tableRow: {
    borderBottom: "1px solid #e5e7eb",
    transition: "background-color 0.2s ease",
    ':hover': {
      backgroundColor: "#f9fafb"
    }
  },
  tableCell: {
    padding: "12px 16px",
    textAlign: "left",
    fontSize: "14px",
    color: "#4b5563"
  },
  userInfo: {
    display: "flex",
    alignItems: "center"
  },
  avatar: {
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    objectFit: "cover",
    marginRight: "16px"
  },
  userName: {
    fontSize: "14px",
    fontWeight: "500",
    color: "#111827"
  },
  userEmail: {
    fontSize: "13px",
    color: "#6b7280"
  },
  badge: {
    display: "inline-flex",
    alignItems: "center",
    padding: "4px 8px",
    borderRadius: "9999px",
    fontSize: "12px",
    fontWeight: "500"
  },
  statusDot: {
    width: "8px",
    height: "8px",
    borderRadius: "50%",
    marginRight: "6px"
  },
  // Status colors
  active: {
    backgroundColor: "rgba(16, 185, 129, 0.1)",
    color: "#065f46"
  },
  activeDot: {
    backgroundColor: "#10b981"
  },
  inactive: {
    backgroundColor: "rgba(245, 158, 11, 0.1)",
    color: "#92400e"
  },
  inactiveDot: {
    backgroundColor: "#f59e0b"
  },
  suspended: {
    backgroundColor: "rgba(239, 68, 68, 0.1)",
    color: "#b91c1c"
  },
  suspendedDot: {
    backgroundColor: "#ef4444"
  },
  actionButton: {
    backgroundColor: "transparent",
    border: "none",
    cursor: "pointer",
    marginRight: "8px",
    padding: "5px"
  },
  settingsIcon: {
    color: "#2563eb"
  },
  deleteIcon: {
    color: "#dc2626"
  },
  // Modal styles
  modalOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 50
  },
  modalContent: {
    backgroundColor: "white",
    borderRadius: "8px",
    padding: "24px",
    width: "100%",
    maxWidth: "500px",
    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)"
  },
  modalHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "16px"
  },
  modalTitle: {
    fontSize: "18px",
    fontWeight: "500"
  },
  closeButton: {
    backgroundColor: "transparent",
    border: "none",
    cursor: "pointer",
    fontSize: "24px",
    color: "#9ca3af"
  },
  modalBody: {
    marginBottom: "16px"
  },
  photoContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    marginBottom: "16px"
  },
  largeAvatar: {
    width: "96px",
    height: "96px",
    borderRadius: "50%",
    objectFit: "cover",
    marginBottom: "16px"
  },
  formGroup: {
    marginBottom: "16px"
  },
  label: {
    display: "block",
    marginBottom: "8px",
    fontSize: "14px",
    fontWeight: "500",
    color: "#374151"
  },
  input: {
    width: "100%",
    padding: "8px 12px",
    borderRadius: "6px",
    border: "1px solid #d1d5db",
    fontSize: "14px"
  },
  select: {
    width: "100%",
    padding: "8px 12px",
    borderRadius: "6px",
    border: "1px solid #d1d5db",
    fontSize: "14px",
    backgroundColor: "white"
  },
  fileInput: {
    width: "100%",
    padding: "8px 0",
    fontSize: "14px"
  },
  modalFooter: {
    display: "flex",
    justifyContent: "flex-end"
  },
  saveButton: {
    backgroundColor: "#2563eb",
    color: "white",
    border: "none",
    borderRadius: "6px",
    padding: "8px 16px",
    fontSize: "14px",
    fontWeight: "500",
    cursor: "pointer"
  }
};

export default function UserTable() {
  const [users, setUsers] = useState([]);
  const [userPhotos, setUserPhotos] = useState({});
  const [userStatus, setUserStatus] = useState({});
  const [selectedUser, setSelectedUser] = useState(null);
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    // Fetch users data from API
    fetch("http://localhost:3000/api/auth/users")
      .then((response) => response.json())
      .then((data) => {
        setUsers(data);
        
        // Load status from localStorage
        const storedStatus = JSON.parse(localStorage.getItem("userStatus")) || {};
        setUserStatus(storedStatus);
        
        // Load all photos from localStorage
        const photos = {};
        data.forEach(user => {
          const photoUrl = localStorage.getItem(`photo_${user._id}`);
          if (photoUrl) {
            photos[user._id] = photoUrl;
          }
        });
        setUserPhotos(photos);
      })
      .catch((error) => {
        console.error("Error fetching users:", error);
      });
  }, []);

  const handlePhotoChange = (userId, e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const photoUrl = reader.result;
        
        // Update localStorage
        localStorage.setItem(`photo_${userId}`, photoUrl);
        
        // Update state
        setUserPhotos(prevPhotos => ({
          ...prevPhotos,
          [userId]: photoUrl
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleStatusChange = (userId, newStatus) => {
    const updatedStatus = { ...userStatus, [userId]: newStatus };
    setUserStatus(updatedStatus);
    localStorage.setItem("userStatus", JSON.stringify(updatedStatus));
  };

  const openSettingsPopup = (user) => {
    setSelectedUser(user);
    setShowSettings(true);
  };

  const closeSettingsPopup = () => {
    setShowSettings(false);
    setSelectedUser(null);
  };

  const getStatusStyle = (status) => {
    switch(status) {
      case "Active":
        return { badge: styles.active, dot: styles.activeDot };
      case "Inactive":
        return { badge: styles.inactive, dot: styles.inactiveDot };
      case "Suspended":
        return { badge: styles.suspended, dot: styles.suspendedDot };
      default:
        return { badge: styles.active, dot: styles.activeDot };
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>User Management</h1>
      
      <div style={styles.tableContainer}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.tableHeader}>#</th>
              <th style={styles.tableHeader}>Name</th>
              <th style={styles.tableHeader}>Date Created</th>
              <th style={styles.tableHeader}>Role</th>
              <th style={styles.tableHeader}>Status</th>
              <th style={styles.tableHeader}>Action</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => {
              const status = userStatus[user._id] || "Active";
              const statusStyle = getStatusStyle(status);
              
              return (
                <tr key={user._id} style={styles.tableRow}>
                  <td style={styles.tableCell}>{index + 1}</td>
                  <td style={styles.tableCell}>
                    <div style={styles.userInfo}>
                      <img 
                        style={styles.avatar}
                        src={userPhotos[user._id] || "/api/placeholder/40/40"}
                        alt={user.name}
                      />
                      <div>
                        <div style={styles.userName}>{user.name}</div>
                        <div style={styles.userEmail}>{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td style={styles.tableCell}>
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td style={styles.tableCell}>
                    {user.role || "User"}
                  </td>
                  <td style={styles.tableCell}>
                    <span style={{...styles.badge, ...statusStyle.badge}}>
                      <span style={{...styles.statusDot, ...statusStyle.dot}}></span>
                      {status}
                    </span>
                  </td>
                  <td style={styles.tableCell}>
                    <button 
                      onClick={() => openSettingsPopup(user)}
                      style={{...styles.actionButton, ...styles.settingsIcon}}
                    >
                      ⚙️
                    </button>
                    <button style={{...styles.actionButton, ...styles.deleteIcon}}>
                      ❌
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Settings Popup */}
      {showSettings && selectedUser && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <div style={styles.modalHeader}>
              <h3 style={styles.modalTitle}>User Settings</h3>
              <button onClick={closeSettingsPopup} style={styles.closeButton}>
                ×
              </button>
            </div>
            
            <div style={styles.modalBody}>
              <div style={styles.photoContainer}>
                <img 
                  src={userPhotos[selectedUser._id] || "/api/placeholder/100/100"} 
                  alt={selectedUser.name}
                  style={styles.largeAvatar}
                />
                <div style={styles.formGroup}>
                  <label style={styles.label}>
                    Profile Photo
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handlePhotoChange(selectedUser._id, e)}
                      style={styles.fileInput}
                    />
                  </label>
                </div>
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Name</label>
                <input
                  type="text"
                  style={styles.input}
                  value={selectedUser.name}
                  disabled
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Email</label>
                <input
                  type="email"
                  style={styles.input}
                  value={selectedUser.email}
                  disabled
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Status</label>
                <select
                  style={styles.select}
                  value={userStatus[selectedUser._id] || "Active"}
                  onChange={(e) => handleStatusChange(selectedUser._id, e.target.value)}
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                  <option value="Suspended">Suspended</option>
                </select>
              </div>
            </div>
            
            <div style={styles.modalFooter}>
              <button
                onClick={closeSettingsPopup}
                style={styles.saveButton}
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}