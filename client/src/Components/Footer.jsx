import React from 'react'
import { Link } from 'react-router-dom';
import StitchingLogo from '../assets/SewingBusinessLogo.jpg'

function Footer() {

  const QUICK_LINKS   = [
    { label: "Home",         to: "/#home" },
    { label: "Features",     to: "/#features" },
    { label: "How It Works", to: "/#howitworks" },
    { label: "About Us",     to: "/#aboutus" }
  ];
  const SUPPORT_LINKS = ["Help Center","Contact Us","Returns & Refunds","Terms & Conditions","Privacy Policy"];

  return (
    <>
      <footer className="footer-section">
        <div className="container">
          <div className="row gy-5">

            <div className="col-lg-3 col-md-6">
              <div className="footer-logo">
                <div className="logo-box"><img src={StitchingLogo} height={50} weight={50} alt="Stitching Logo" /></div>
                Stitch<span className="footer-logo-accent">Site</span>
              </div>
              <p className="footer-desc">
                AI-powered stitching platform that brings perfect fit, premium
                quality and convenience to your doorstep.
              </p>
              <div className="footer-social">
                {[<i className="bi bi-facebook"></i>,
                  <i className="bi bi-instagram"></i>,
                  <i className="bi bi-twitter"></i>,
                  <i className="bi bi-linkedin"></i>].map((Icon, i) => (
                  <Link key={i} to="#" className="social-btn">{Icon}</Link>
                ))}
              </div>
            </div>

            <div className="col-lg-2 col-md-3 col-6">
              <p className="footer-col-title">Quick Links</p>
              <ul className="footer-links-list">
                {QUICK_LINKS.map((ql, index) => <li key={index}><Link to={ql.to}>{ql.label}</Link></li>)}
              </ul>
            </div>

            <div className="col-lg-3 col-md-3 col-6">
              <p className="footer-col-title">Support</p>
              <ul className="footer-links-list">
                {SUPPORT_LINKS.map((l) => <li key={l}><Link to="/#">{l}</Link></li>)}
              </ul>
            </div>

            <div className="col-lg-4 col-md-6">
              <p className="footer-col-title">Contact Us</p>
              <ul className="footer-contact-list">
                <li><span className="contact-icon">✉️</span> support@stitchai.com</li>
                <li><span className="contact-icon">📞</span> +91 98765 43210</li>
                <li><span className="contact-icon">📍</span> 123, Fashion Street, Nagercoil, India - 400001</li>
              </ul>
            </div>
          </div>

          <div className="footer-divider" />
          <p className="footer-copy">© 2026 StitchAI. All rights reserved.</p>
        </div>
      </footer>
    </>
  )
}

export default Footer