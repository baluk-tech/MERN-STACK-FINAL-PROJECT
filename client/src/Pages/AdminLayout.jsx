import React, { useState, useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../Components/Authcontext'; // Auth import panniyachu
// import './AdminStyle.css'; (Unga CSS file)

function AdminLayout() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  
  // Auth context-la irunthu Logout function edukkurom
  const { Logout } = useAuth();

  const handleLogout = () => {
    if (Logout) Logout();
    navigate('/'); // Logout aanathum home page-kku poidum
  };

  useEffect(() => {
    const handleToggle = () => setIsMobileMenuOpen(true);
    window.addEventListener('toggleAdminSidebar', handleToggle);
    return () => window.removeEventListener('toggleAdminSidebar', handleToggle);
  }, []);

  return (
    <div className="admin-layout-wrapper">
      
      {/* DARK OVERLAY */}
      {isMobileMenuOpen && (
        <div className="sidebar-overlay" onClick={() => setIsMobileMenuOpen(false)}></div>
      )}

      {/* SIDEBAR */}
      <div className={`admin-sidebar ${isMobileMenuOpen ? 'open' : ''}`}>
        
        <div className="sidebar-header d-flex justify-content-between align-items-center p-4">
           <h4 className="fw-bold mb-0" style={{ color: 'var(--purple)' }}>
             <i className="bi bi-scissors me-2"></i>StitchAdmin
           </h4>
           <button className="btn border-0 d-md-none fs-3 text-secondary p-0" onClick={() => setIsMobileMenuOpen(false)}>
             <i className="bi bi-x-circle-fill"></i>
           </button>
        </div>

        {/* 🚨 mb-auto (margin-bottom: auto) add pannirukken, ithu keela irukka logout-a bottom-kku thallidum 🚨 */}
        <ul className="nav nav-pills flex-column mt-2 gap-2 px-3 mb-auto">
          <li className="nav-item">
            <Link 
              to="/admin/dashboard" 
              className={`nav-link text-dark fw-semibold py-3 px-4 rounded-4 ${location.pathname === '/admin/dashboard' ? 'shadow-sm' : ''}`} 
              style={location.pathname === '/admin/dashboard' ? { background: 'var(--purple)', color: 'white' } : {}}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <i className="bi bi-grid-fill me-3 fs-5"></i> Dashboard
            </Link>
          </li>
          <li className="nav-item">
            <Link 
              to="/admin/orders" 
              className={`nav-link text-dark fw-semibold py-3 px-4 rounded-4 ${location.pathname === '/admin/orders' ? 'shadow-sm' : ''}`} 
              style={location.pathname === '/admin/orders' ? { background: 'var(--purple)', color: 'white' } : {}}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <i className="bi bi-box-seam-fill me-3 fs-5"></i> Orders
            </Link>
          </li>
          <li className="nav-item">
            <Link 
              to="/admin/products" 
              className={`nav-link text-dark fw-semibold py-3 px-4 rounded-4 ${location.pathname === '/admin/products' ? 'shadow-sm' : ''}`} 
              style={location.pathname === '/admin/products' ? { background: 'var(--purple)', color: 'white' } : {}}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <i className="bi bi-tags-fill me-3 fs-5"></i> Products
            </Link>
          </li>
          <li className="nav-item">
            <Link 
              to="/admin/users" 
              className={`nav-link text-dark fw-semibold py-3 px-4 rounded-4 ${location.pathname === '/admin/users' ? 'shadow-sm' : ''}`} 
              style={location.pathname === '/admin/users' ? { background: 'var(--purple)', color: 'white' } : {}}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <i className="bi bi-people-fill me-3 fs-5"></i> Users Management
            </Link>
          </li>
        </ul>

        {/* 🚨 PUDHUSA ADD PANNA PROFILE & LOGOUT BOTTOM SECTION 🚨 */}
        <div className="sidebar-footer p-3 mt-3 border-top">
          <Link to="/profile" className="btn btn-light w-100 mb-2 d-flex justify-content-start align-items-center fw-bold shadow-sm" onClick={() => setIsMobileMenuOpen(false)}>
            <i className="bi bi-person-circle me-3 fs-5 text-primary"></i> My Profile
          </Link>
          <button className="btn btn-outline-danger w-100 d-flex justify-content-start align-items-center fw-bold shadow-sm" onClick={handleLogout}>
            <i className="bi bi-box-arrow-right me-3 fs-5"></i> Logout
          </button>
        </div>

      </div>

      {/* MAIN CONTENT AREA */}
      <div className="admin-main-content">
        <Outlet />
      </div>

    </div>
  );
}

export default AdminLayout;