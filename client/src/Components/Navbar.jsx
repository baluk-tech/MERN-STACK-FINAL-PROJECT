import React from 'react'
import { useState, useEffect, useRef } from 'react';
import StitchingLogo from '../assets/SewingBusinessLogo.jpg'
import { NavLink, Link } from 'react-router-dom'

const NAV_LINKS = [
  { label: "Home",         to: "/#home" },
  { label: "Features",     to: "/#features" },
  { label: "How It Works", to: "/#howitworks" },
  { label: "About Us",     to: "/#aboutus" }
];

const USER_NAV = [
  { label: "Dashboard", to: "/dashboard" },
  { label: "Order", to: "/order"}
]

function Navbar() {
  const token = localStorage.getItem("token");

  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const revealRefs = useRef([]);
      /* Scroll shadow on navbar */
  useEffect(() => {
    const handle = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handle);
    return () => window.removeEventListener("scroll", handle);
  }, []);
      /* IntersectionObserver scroll-reveal */
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add("visible"); }),
      { threshold: 0.12 }
    );
    revealRefs.current.forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, []);
      const r = (el) => { if (el && !revealRefs.current.includes(el)) revealRefs.current.push(el); };

    const tokenRemove = () => {
      localStorage.removeItem("token");
      window.location.href="/login";
    }

  return (
    <>
      <nav className={`navbar-stitchai${scrolled ? " scrolled" : ""}`}>
        <div className="container">
          <div className="d-flex align-items-center justify-content-between w-100">

            <Link to="/#home" className="nav-logo">
              <div className="logo-box"><img src={StitchingLogo} height="50" width="50" alt="Stitching Logo" /></div>
              Stitch<span className="nav-logo-accent">Site</span>
            </Link>

            { token ? (
              <ul className="nav-desktop d-none d-lg-flex list-unstyled mb-0 align-items-center gap-1">
                {USER_NAV.map((usernav) => (
                  <li key={usernav.label}>
                    <NavLink to={usernav.to} className="nav-link-custom">{usernav.label}</NavLink>
                  </li>
                ))}
              </ul>
            ) :
            (<ul className="nav-desktop d-none d-lg-flex list-unstyled mb-0 align-items-center gap-1">
              {NAV_LINKS.map((l) => (
                <li key={l.label}>
                  <NavLink to={l.to} className="nav-link-custom">{l.label}</NavLink>
                </li>
              ))}
            </ul>)
            }

            {token ? (
              <div className="d-none d-lg-flex align-items-center gap-2">
                <button className="btn-nav-login" onClick={tokenRemove}>Logout</button>
              </div>
            ) : (
              <div className="d-none d-lg-flex align-items-center gap-2">
                <Link to="/login"><button className="btn-nav-login">Login</button></Link>
                <Link to="/signup"><button className="btn-nav-signup">Sign Up</button></Link>
              </div>
            )}

            <button
              className="navbar-toggler-custom d-lg-none"
              onClick={() => setMenuOpen((p) => !p)}
            >
              {menuOpen ? <i className="bi bi-x-lg"></i> : <i className="bi bi-list"></i>}
            </button>
          </div>

          <div className={`mobile-menu${menuOpen ? " open" : ""}`}>
            {NAV_LINKS.map((l) => (
              <Link key={l.label} to={l.to} className="nav-link-custom" onClick={() => setMenuOpen(false)}>
                {l.label}
              </Link>
            ))}
            <div className="mobile-menu-btns">
              <Link to="/login"><button className="btn-nav-login">Login</button></Link>
              <Link to="/signup"><button className="btn-nav-signup">Sign Up</button></Link>
            </div>
          </div>
        </div>
      </nav>
    </>
  )
}

export default Navbar