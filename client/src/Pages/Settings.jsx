import React, { useState, useEffect } from 'react';
import { FiUser, FiLock, FiBell, FiCheckCircle } from 'react-icons/fi';
import instance from '../Utils/Middleware';

function Settings() {
  const [activeTab, setActiveTab] = useState('account');
  const [loading, setLoading] = useState(true);

  // Profile States
  const [profile, setProfile] = useState({ name: '', email: '', phone: '' });
  const [profileMsg, setProfileMsg] = useState('');

  // Password States
  const [passwords, setPasswords] = useState({ oldPassword: '', newPassword: '', confirmPassword: '' });
  const [passMsg, setPassMsg] = useState({ text: '', type: '' });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await instance.get('/user/profile');
        const user = res.data?.user || res.data;
        setProfile({ name: user.name || '', email: user.email || '', phone: user.phone || '' });
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, []);

  // Update Profile
  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setProfileMsg('');
    try {
      const res = await instance.put('/user/profile/update', { name: profile.name, phone: profile.phone });
      setProfileMsg(res.data.message);
      setTimeout(() => setProfileMsg(''), 3000);
    } catch (error) {
      alert("Failed to update profile");
    }
  };

  // Change Password
  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setPassMsg({ text: '', type: '' });

    if (passwords.newPassword !== passwords.confirmPassword) {
      return setPassMsg({ text: "New passwords do not match!", type: 'danger' });
    }
    if (passwords.newPassword.length < 6) {
      return setPassMsg({ text: "Password must be at least 6 characters.", type: 'danger' });
    }

    try {
      const res = await instance.put('/user/profile/change-password', { 
        oldPassword: passwords.oldPassword, 
        newPassword: passwords.newPassword 
      });
      setPassMsg({ text: res.data.message, type: 'success' });
      setPasswords({ oldPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      setPassMsg({ text: error.response?.data?.message || "Error changing password", type: 'danger' });
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100 bg-light">
        <div className="spinner-border" style={{ color: 'var(--purple)' }}></div>
      </div>
    );
  }

  return (
    <div className="bg-light min-vh-100 py-5">
      <div className="container" style={{ maxWidth: '1000px' }}>
        
        <h3 className="fw-bold text-dark mb-4">Account Settings</h3>

        <div className="row g-4">
          {/* Sidebar Menu */}
          <div className="col-md-4 col-lg-3">
            <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
              <div className="list-group list-group-flush">
                <button 
                  className={`list-group-item list-group-item-action py-3 d-flex align-items-center gap-2 fw-medium ${activeTab === 'account' ? 'active text-white' : 'text-dark'}`}
                  style={{ background: activeTab === 'account' ? 'var(--purple)' : 'white' }}
                  onClick={() => setActiveTab('account')}
                >
                  <FiUser size={18} /> Profile Details
                </button>
                <button 
                  className={`list-group-item list-group-item-action py-3 d-flex align-items-center gap-2 fw-medium ${activeTab === 'security' ? 'active text-white' : 'text-dark'}`}
                  style={{ background: activeTab === 'security' ? 'var(--purple)' : 'white' }}
                  onClick={() => setActiveTab('security')}
                >
                  <FiLock size={18} /> Security & Password
                </button>
                <button 
                  className={`list-group-item list-group-item-action py-3 d-flex align-items-center gap-2 fw-medium ${activeTab === 'notifications' ? 'active text-white' : 'text-dark'}`}
                  style={{ background: activeTab === 'notifications' ? 'var(--purple)' : 'white' }}
                  onClick={() => setActiveTab('notifications')}
                >
                  <FiBell size={18} /> Notifications
                </button>
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="col-md-8 col-lg-9">
            
            {/* --- 1. ACCOUNT TAB --- */}
            {activeTab === 'account' && (
              <div className="card border-0 shadow-sm rounded-4 bg-white p-4 p-md-5">
                <h5 className="fw-bold text-dark mb-4">Personal Information</h5>
                
                {profileMsg && (
                  <div className="alert alert-success d-flex align-items-center py-2"><FiCheckCircle className="me-2" /> {profileMsg}</div>
                )}

                <form onSubmit={handleProfileUpdate}>
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label small fw-bold text-muted">Full Name</label>
                      <input type="text" className="form-control" value={profile.name} onChange={(e) => setProfile({...profile, name: e.target.value})} required />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small fw-bold text-muted">Phone Number</label>
                      <input type="text" className="form-control" value={profile.phone} onChange={(e) => setProfile({...profile, phone: e.target.value})} />
                    </div>
                    <div className="col-12">
                      <label className="form-label small fw-bold text-muted">Email Address (Read-only)</label>
                      <input type="email" className="form-control text-muted" value={profile.email} disabled style={{ backgroundColor: '#f8f9fa' }} />
                      <div className="form-text">To change your email, please contact customer support.</div>
                    </div>
                  </div>
                  <button type="submit" className="btn text-white fw-bold px-4 py-2 mt-4 rounded-3" style={{ background: 'var(--purple)' }}>
                    Save Changes
                  </button>
                </form>
              </div>
            )}

            {/* --- 2. SECURITY TAB --- */}
            {activeTab === 'security' && (
              <div className="card border-0 shadow-sm rounded-4 bg-white p-4 p-md-5">
                <h5 className="fw-bold text-dark mb-4">Change Password</h5>

                {passMsg.text && (
                  <div className={`alert alert-${passMsg.type} py-2`}>{passMsg.text}</div>
                )}

                <form onSubmit={handlePasswordChange}>
                  <div className="mb-3">
                    <label className="form-label small fw-bold text-muted">Current Password</label>
                    <input type="password" className="form-control" value={passwords.oldPassword} onChange={(e) => setPasswords({...passwords, oldPassword: e.target.value})} required />
                  </div>
                  <div className="mb-3">
                    <label className="form-label small fw-bold text-muted">New Password</label>
                    <input type="password" className="form-control" value={passwords.newPassword} onChange={(e) => setPasswords({...passwords, newPassword: e.target.value})} required />
                  </div>
                  <div className="mb-3">
                    <label className="form-label small fw-bold text-muted">Confirm New Password</label>
                    <input type="password" className="form-control" value={passwords.confirmPassword} onChange={(e) => setPasswords({...passwords, confirmPassword: e.target.value})} required />
                  </div>
                  <button type="submit" className="btn text-white fw-bold px-4 py-2 mt-3 rounded-3" style={{ background: 'var(--purple)' }}>
                    Update Password
                  </button>
                </form>
              </div>
            )}

            {/* --- 3. NOTIFICATIONS TAB --- */}
            {activeTab === 'notifications' && (
              <div className="card border-0 shadow-sm rounded-4 bg-white p-4 p-md-5">
                <h5 className="fw-bold text-dark mb-4">Email & SMS Preferences</h5>
                
                <div className="d-flex justify-content-between align-items-center border-bottom pb-3 mb-3">
                  <div>
                    <h6 className="mb-0 fw-bold">Order Updates</h6>
                    <small className="text-muted">Receive tracking and delivery updates.</small>
                  </div>
                  <div className="form-check form-switch">
                    <input className="form-check-input" type="checkbox" defaultChecked style={{ cursor: 'pointer' }} />
                  </div>
                </div>

                <div className="d-flex justify-content-between align-items-center border-bottom pb-3 mb-3">
                  <div>
                    <h6 className="mb-0 fw-bold">Promotional Offers</h6>
                    <small className="text-muted">Get notified about discounts and new fabrics.</small>
                  </div>
                  <div className="form-check form-switch">
                    <input className="form-check-input" type="checkbox" style={{ cursor: 'pointer' }} />
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>

      </div>
    </div>
  );
}

export default Settings;