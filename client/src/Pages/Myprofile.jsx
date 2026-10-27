import React, { useEffect, useState } from 'react';
import instance from '../Utils/Middleware';
import EditMyprofile from '../Components/EditMyprofile'; // Path check pannikkonga

function Myprofile() {
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    instance.get('/user/profile')
      .then((res) => {
        setUserDetails(res.data.user);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Profile load error:", err);
        setLoading(false);
      });
  }, []);

  // API data varavaraikkum loading spinner kaattum
  if (loading) {
    return (
      <div className="vh-100 d-flex justify-content-center align-items-center">
        <div className="spinner-border" style={{ color: 'var(--purple)' }}></div>
      </div>
    );
  }

  if (!userDetails) {
    return <div className="vh-100 d-flex justify-content-center align-items-center text-danger">Failed to load profile.</div>;
  }

  return (
    <div className="container py-5 min-vh-100 d-flex justify-content-center">
      <div className="card shadow border-0 profile-card w-100 rounded-4" style={{ maxWidth: '600px', background: "var(--background)", height: 'fit-content' }}>
        <div className="card-body p-4 p-md-5">

          {/* Header & Edit Button */}
          <div className="d-flex justify-content-between align-items-center mb-4 border-bottom pb-3">
            <h4 className="fw-bold mb-0 text-dark">My Profile</h4>
            <EditMyprofile user={userDetails} setUserDetails={setUserDetails} />
          </div>

          {/* Profile Picture & Name */}
          <div className="d-flex align-items-center gap-4 mb-5">
            <img
              src={userDetails.profilePicture ? `http://localhost:5000/uploads/${userDetails.profilePicture}` : "https://via.placeholder.com/100"}
              alt="profile"
              className="profile-img shadow-sm"
              style={{ width: '85px', height: '85px', objectFit: 'cover', borderRadius: '50%' }}
            />
            <div>
              <h3 className="fw-bold mb-1">{userDetails.name} {userDetails.lastName}</h3>
              <span className="badge text-white" style={{ background: 'var(--purple)' }}>{userDetails.role || 'User'}</span>
            </div>
          </div>

          {/* Profile Details List */}
          <div className="profile-details d-flex flex-column gap-3">
            <div className="row">
              <div className="col-4 text-muted fw-semibold">Email</div>
              <div className="col-8 fw-bold text-dark">{userDetails.email || '-'}</div>
            </div>
            <div className="row">
              <div className="col-4 text-muted fw-semibold">Phone</div>
              <div className="col-8 fw-bold text-dark">{userDetails.phone || '-'}</div>
            </div>
            <div className="row">
              <div className="col-4 text-muted fw-semibold">Gender</div>
              <div className="col-8 fw-bold text-dark">{userDetails.gender || '-'}</div>
            </div>
            <div className="row">
              <div className="col-4 text-muted fw-semibold">Date of birth</div>
              <div className="col-8 fw-bold text-dark">{userDetails.dob || '-'}</div>
            </div>
            <div className="row">
              <div className="col-4 text-muted fw-semibold">Address</div>
              <div className="col-8 fw-bold text-dark">{userDetails.address || '-'}</div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Myprofile;