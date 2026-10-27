import React, { useState, useEffect, useRef } from 'react';
import StitchingLogo from '../assets/SewingBusinessLogo.jpg';
import { Link, useLocation } from 'react-router-dom'; 
import { useAuth } from './Authcontext';
import { FaUserCircle } from 'react-icons/fa';
import { useCart } from './CartContext'; 

const NAV_LINKS = [
  { label: "Home",         to: "/#home" },
  { label: "Features",     to: "/#features" },
  { label: "How It Works", to: "/#howitworks" },
  { label: "About Us",     to: "/#aboutus" }
];

const USER_NAV = [
  { label: "Home",      to: "/home" },
  { label: "Dashboard", to: "/dashboard" },
  { label: "Order",     to: "/my-order-stats"} 
];

function Navbar() {
  const { user, Logout } = useAuth();
  const { cartCount } = useCart(); 
  const location = useLocation(); 

  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const revealRefs = useRef([]);

  const isLinkActive = (path) => {
    if (path.includes('#')) {
      return (location.pathname + location.hash) === path || (location.pathname === '/' && path === '/#home');
    }
    return location.pathname === path;
  };

  useEffect(() => {
    const handle = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handle);
    return () => window.removeEventListener("scroll", handle);
  }, []);

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add("visible"); }),
      { threshold: 0.12 }
    );
    revealRefs.current.forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, []);

  const mobileLinks = user?.role === "user" ? USER_NAV : (user?.role === "admin" ? [] : NAV_LINKS);

  return (
    <>
      <nav className={`navbar-stitchai${scrolled ? " scrolled" : ""}`}>
        <div className="container">
          <div className="d-flex align-items-center justify-content-between w-100">

            <Link to="/#home" className="nav-logo">
              <div className="logo-box"><img src={StitchingLogo} height="50" width="50" alt="Stitching Logo" /></div>
              Stitch<span className="nav-logo-accent">Site</span>
            </Link>

            {/* DESKTOP MENU */}
            { user?.role === "user" ? (
              <ul className="nav-desktop d-none d-lg-flex list-unstyled mb-0 align-items-center gap-1">
                {USER_NAV.map((usernav) => {
                  const active = isLinkActive(usernav.to);
                  return (
                    <li key={usernav.label}>
                      <Link 
                        to={usernav.to} 
                        className={`nav-link-custom ${active ? 'fw-bold' : ''}`}
                        style={{ 
                          background: active ? 'rgba(255, 255, 255, 0.15)' : 'transparent',
                          color: active ? '#ffffff' : 'rgba(255,255,255,0.7)'
                        }}
                      >
                        {usernav.label}
                      </Link>
                    </li>
                  )
                })}
              </ul>
            ) :
            user?.role === "admin" ? (
              <ul className="nav-desktop d-none d-lg-flex list-unstyled mb-0 align-items-center gap-1">
                <li>
                  <div className="fw-bolder fs-4" style={{ color: 'var(--purple)' }}>Admin Dashboard</div>
                </li>
              </ul>
            ) : (
              <ul className="nav-desktop d-none d-lg-flex list-unstyled mb-0 align-items-center gap-1">
                {NAV_LINKS.map((l) => {
                  const active = isLinkActive(l.to);
                  return (
                    <li key={l.label}>
                      <Link 
                        to={l.to} 
                        className={`nav-link-custom ${active ? 'fw-bold' : ''}`}
                        style={{ 
                          background: active ? 'rgba(255, 255, 255, 0.15)' : 'transparent',
                          color: active ? '#ffffff' : 'rgba(255,255,255,0.7)'
                        }}
                      >
                        {l.label}
                      </Link>
                    </li>
                  )
                })}
              </ul>
            )}

            {/* ACTION BUTTONS */}
            {user ? (
              <div className="d-none d-lg-flex align-items-center gap-3">
                {user.role === "user" && (
                  <Link to="/cart" className="position-relative text-white text-decoration-none mt-1" style={{ transition: 'all 0.2s' }}>
                    <i className="bi bi-cart3 fs-4"></i>
                    {cartCount > 0 && (
                      <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger" style={{ fontSize: '0.65rem' }}>
                        {cartCount}
                      </span>
                    )}
                  </Link>
                )}
                <Link to="/profile"><div className="rounded-circle p-2 profile-icon"><FaUserCircle size={30} className='btn text-white p-0' /></div></Link>
                <button className="btn-nav-login" onClick={Logout}>Logout</button>
              </div>
            ) : (
              <div className="d-none d-lg-flex align-items-center gap-2">
                <Link to="/login"><button className="btn-nav-login">Login</button></Link>
                <Link to="/signup"><button className="btn-nav-signup">Sign Up</button></Link>
              </div>
            )}

            {/* 🚨 CHANGED LOGIC: Admin-a iruntha Sidebar open panna signal anuppurom 🚨 */}
            <button
              className="navbar-toggler-custom d-lg-none"
              onClick={() => {
                if (user?.role === 'admin') {
                  window.dispatchEvent(new CustomEvent('toggleAdminSidebar'));
                } else {
                  setMenuOpen((p) => !p);
                }
              }}
            >
              {menuOpen ? <i className="bi bi-x-lg"></i> : <i className="bi bi-list"></i>}
            </button>
          </div>

          {/* MOBILE MENU */}
          <div className={`mobile-menu${menuOpen ? " open" : ""}`}>
            {mobileLinks.map((l) => {
              const active = isLinkActive(l.to);
              return (
                <Link 
                  key={l.label} 
                  to={l.to} 
                  className={`nav-link-custom ${active ? 'fw-bold' : ''}`} 
                  style={{ 
                    background: active ? 'rgba(255, 255, 255, 0.15)' : 'transparent',
                    color: active ? '#ffffff' : 'rgba(255,255,255,0.7)'
                  }}
                  onClick={() => setMenuOpen(false)}
                >
                  {l.label}
                </Link>
              )
            })}
            
            {user ? (
              <div className="mobile-menu-btns align-items-center mt-3 pt-3 border-top" style={{ borderColor: 'rgba(255,255,255,0.1)'}}>
                {user.role === "user" && (
                  <Link to="/cart" className="position-relative text-white text-decoration-none me-4" onClick={() => setMenuOpen(false)}>
                    <i className="bi bi-cart3 fs-3"></i>
                    {cartCount > 0 && (
                      <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger" style={{ fontSize: '0.65rem' }}>
                        {cartCount}
                      </span>
                    )}
                  </Link>
                )}
                <Link to="/profile" onClick={() => setMenuOpen(false)}><div className="rounded-circle p-2 profile-icon"><FaUserCircle size={30} className='btn text-white p-0' /></div></Link>
                <button className="btn-nav-login ms-2" onClick={() => { Logout(); setMenuOpen(false); }}>Logout</button>
              </div>
            ) : (
              <div className="mobile-menu-btns mt-3 pt-3 border-top" style={{ borderColor: 'rgba(255,255,255,0.1)'}}>
                <Link to="/login" onClick={() => setMenuOpen(false)}><button className="btn-nav-login">Login</button></Link>
                <Link to="/signup" onClick={() => setMenuOpen(false)}><button className="btn-nav-signup">Sign Up</button></Link>
              </div>
            )}
          </div>
        </div>
      </nav>
    </>
  )
}

export default Navbar;