import React, { useState, useEffect } from 'react';
import instance from '../Utils/Middleware';

function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      const res = await instance.get('/admin/users');
      setUsers(res.data.users || []);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Block / Unblock Action
  const handleBlockToggle = async (userId, currentStatus, userName) => {
    const actionText = currentStatus ? 'UNBLOCK' : 'BLOCK';
    if (window.confirm(`Are you sure you want to ${actionText} ${userName || 'this user'}?`)) {
      try {
        await instance.put(`/admin/block-user/${userId}`);
        fetchUsers(); // Refresh UI
      } catch (error) {
        console.error("Error updating block status:", error);
        alert(error.response?.data?.message || "Failed to update user status");
      }
    }
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleString('en-IN', {
      day: '2-digit', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit', hour12: true
    });
  };

  return (
    <div className="bg-white rounded-4 shadow-sm p-4 p-md-5 border-0">
      
      <div className="d-flex justify-content-between align-items-center mb-4 pb-3 border-bottom gap-3">
        <div>
          <h2 className="fw-bold mb-1 text-dark">User Management</h2>
          <p className="text-muted mb-0">Monitor registered customers and manage account access.</p>
        </div>
        <span className="badge bg-primary-subtle text-primary border px-4 py-2 rounded-pill fs-6">
          Total Users: {users.length}
        </span>
      </div>

      {loading ? (
        <div className="text-center py-5 my-5">
          <div className="spinner-border text-primary" role="status"></div>
        </div>
      ) : users.length === 0 ? (
        <div className="text-center py-5 my-5 bg-light rounded-4">
          <h4 className="text-muted">No users registered yet.</h4>
        </div>
      ) : (
        <div className="table-responsive rounded-4 border">
          <table className="table table-hover align-middle mb-0">
            <thead className="bg-light">
              <tr>
                <th className="py-3 px-4 text-muted fw-bold">Name & Role</th>
                <th className="py-3 px-3 text-muted fw-bold">Email Address</th>
                <th className="py-3 px-3 text-muted fw-bold">Joined On</th>
                <th className="py-3 px-3 text-muted fw-bold text-center">Status</th>
                <th className="py-3 px-4 text-end text-muted fw-bold">Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => {
                // 🚨 FIX: Role undefined ah iruntha 'user' nu fallback edukkurom
                const userRole = u.role || 'user';
                
                return (
                  <tr key={u._id} className={u.isBlocked ? 'bg-light opacity-75' : ''}>
                    <td className="py-3 px-4">
                      {/* Name undefined ah iruntha handle pandrom */}
                      <span className="fw-bold text-dark d-block">{u.name || 'Unknown User'}</span>
                      <span 
                        className={`badge mt-1 ${userRole === 'admin' ? 'bg-purple-subtle text-purple border border-purple-subtle' : 'bg-secondary-subtle text-secondary border'}`} 
                        style={userRole === 'admin' ? { color: 'var(--purple)' } : {}}
                      >
                        {userRole.toUpperCase()}
                      </span>
                    </td>
                    <td className="py-3 px-3 fw-semibold text-muted">{u.email}</td>
                    
                    <td className="py-3 px-3 text-secondary" style={{ fontSize: '0.85rem' }}>
                      <i className="bi bi-calendar-check me-1"></i>
                      {formatDateTime(u.createdAt)}
                    </td>

                    <td className="py-3 px-3 text-center">
                      {u.isBlocked ? (
                        <span className="badge bg-danger-subtle text-danger border border-danger-subtle px-3 py-2 rounded-pill">Blocked</span>
                      ) : (
                        <span className="badge bg-success-subtle text-success border border-success-subtle px-3 py-2 rounded-pill">Active</span>
                      )}
                    </td>

                    <td className="py-3 px-4 text-end">
                      {userRole !== 'admin' && (
                        <button 
                          className={`btn btn-sm px-3 fw-bold rounded-pill shadow-sm ${u.isBlocked ? 'btn-success' : 'btn-outline-danger'}`}
                          onClick={() => handleBlockToggle(u._id, u.isBlocked, u.name)}
                        >
                          {u.isBlocked ? (
                             <><i className="bi bi-unlock-fill me-1"></i> Unblock</>
                          ) : (
                             <><i className="bi bi-slash-circle me-1"></i> Block</>
                          )}
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default AdminUsers;