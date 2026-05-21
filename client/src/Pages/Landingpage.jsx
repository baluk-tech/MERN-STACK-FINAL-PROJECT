import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import StitchingLogo from '../assets/SewingBusinessLogo.jpg'
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer"

/* ══════════════════════════════════════════════════
   DATA ARRAYS
══════════════════════════════════════════════════ */

const FEATURES = [
  {
    emoji: "👕", bg: "#EDE9FE",
    title: "AI Measurements",
    desc:  "Get precise body measurements using our advanced AI technology.",
  },
  {
    emoji: "🖼️", bg: "#DBEAFE",
    title: "Upload Your Design",
    desc:  "Upload any design or choose from our collection and make it uniquely yours.",
  },
  {
    emoji: "🧑‍💼", bg: "#D1FAE5",
    title: "Expert Tailors",
    desc:  "Our professional tailors ensure perfect stitching and premium quality.",
  },
  {
    emoji: "🏷️", bg: "#FEF3C7",
    title: "Price Estimation",
    desc:  "Get instant price estimate based on fabric, design and measurements.",
  },
  {
    emoji: "🚚", bg: "#FCE7F3",
    title: "Fast Delivery",
    desc:  "We ensure on-time delivery right to your doorstep, every single time.",
  },
];

const STEPS = [
  { num:1, emoji:"☁️",  title:"Upload Design",    desc:"Upload your design or choose from our collection." },
  { num:2, emoji:"🤖",  title:"AI Measurement",   desc:"Get your body measured accurately using our AI technology." },
  { num:3, emoji:"💳",  title:"Confirm & Pay",     desc:"Review measurements and price. Confirm your order and pay." },
  { num:4, emoji:"✂️",  title:"We Stitch",         desc:"Our expert tailors stitch your outfit with perfect precision." },
  { num:5, emoji:"📦",  title:"Deliver to You",   desc:"Your order is delivered safely to your doorstep." },
];


/* ══════════════════════════════════════════════════
   MANNEQUIN SVG
══════════════════════════════════════════════════ */
function MannequinSVG() {
  return (
    <svg className="mannequin-svg" viewBox="0 0 320 500" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Base + pole */}
      <ellipse cx="160" cy="485" rx="56" ry="12" fill="#14143A"/>
      <rect x="150" y="438" width="20" height="50" rx="4" fill="#1E1E50"/>
      {/* Torso bottom block */}
      <rect x="80" y="352" width="160" height="86" rx="10" fill="#141435" stroke="#3A3A7A" strokeWidth="1"/>
      {/* Main jacket body */}
      <path d="M92 132 Q80 178 76 248 Q72 298 80 352 L240 352 Q248 298 244 248 Q240 178 228 132Z"
        fill="#1A1A42" stroke="#5B4AE8" strokeWidth="1.5"/>
      {/* Left panel */}
      <path d="M92 132 L134 208 L134 352 L80 352 Q72 298 76 248 Q80 178 92 132Z"
        fill="#141435" stroke="#2E2E70" strokeWidth="0.8"/>
      {/* Right panel */}
      <path d="M228 132 L186 208 L186 352 L240 352 Q248 298 244 248 Q240 178 228 132Z"
        fill="#141435" stroke="#2E2E70" strokeWidth="0.8"/>
      {/* Left lapel */}
      <path d="M134 132 L160 202 L160 132Z" fill="#1E1E52" stroke="#7C5AFF" strokeWidth="1.2"/>
      {/* Right lapel */}
      <path d="M186 132 L160 202 L160 132Z" fill="#1E1E52" stroke="#7C5AFF" strokeWidth="1.2"/>
      {/* Centre button line */}
      <line x1="160" y1="202" x2="160" y2="352" stroke="#5B4AE8" strokeWidth="0.8" strokeDasharray="3 4"/>
      {/* Buttons */}
      <circle cx="160" cy="232" r="3.5" fill="#9D7AFF"/>
      <circle cx="160" cy="258" r="3.5" fill="#9D7AFF"/>
      <circle cx="160" cy="284" r="3.5" fill="#9D7AFF"/>
      {/* Left pocket */}
      <rect x="90" y="200" width="36" height="26" rx="5" fill="none" stroke="#7C5AFF" strokeWidth="1"/>
      {/* Left shoulder */}
      <path d="M92 132 Q66 117 54 144 Q48 164 70 178 L92 170"
        fill="#1A1A42" stroke="#5B4AE8" strokeWidth="1.5"/>
      {/* Right shoulder */}
      <path d="M228 132 Q254 117 266 144 Q272 164 250 178 L228 170"
        fill="#1A1A42" stroke="#5B4AE8" strokeWidth="1.5"/>
      {/* Neck */}
      <rect x="143" y="88" width="34" height="48" rx="6" fill="#1E1E4A" stroke="#5B4AE8" strokeWidth="1"/>
      {/* Head */}
      <ellipse cx="160" cy="68" rx="28" ry="32" fill="#1E1E4A" stroke="#5B4AE8" strokeWidth="1.5"/>
      <ellipse cx="160" cy="40" rx="11" ry="7" fill="#252560" stroke="#3A3A80" strokeWidth="1"/>
      {/* Stitch seam hints */}
      <path d="M76 152 Q80 182 76 218" stroke="#7C5AFF" strokeWidth="0.7" strokeDasharray="2 4"/>
      <path d="M244 152 Q240 182 244 218" stroke="#7C5AFF" strokeWidth="0.7" strokeDasharray="2 4"/>
      {/* Tape measure */}
      <path d="M50 200 Q40 228 50 256" stroke="#F59E0B" strokeWidth="2.2" strokeDasharray="3 3" fill="none"/>
      {/* Ambient glow ring */}
      <ellipse cx="160" cy="230" rx="185" ry="210" fill="none" stroke="rgba(124,58,237,0.10)" strokeWidth="44"/>
    </svg>
  );
}

/* ══════════════════════════════════════════════════
   ICON SVGs (inline — no external icon library needed)
══════════════════════════════════════════════════ */
const ArrowRight = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14M12 5l7 7-7 7"/>
  </svg>
);
const PlayIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M8 5v14l11-7z"/>
  </svg>
);
const CheckCircle = ({ color }) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={color || "currentColor"} strokeWidth="2.5" strokeLinecap="round">
    <circle cx="12" cy="12" r="10"/>
    <path d="M8 12l3 3 5-5"/>
  </svg>
);
const ScissorIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round">
    <path d="M6 3l12 18M18 3L6 21"/>
    <circle cx="12" cy="12" r="2" fill="white" stroke="none"/>
  </svg>
);

/* ══════════════════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════════════════ */
export default function LandingPage() {
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

  return (
    <>

      {/* ─────────────────────────────────────
          HERO
      ───────────────────────────────────── */}
      <section className="hero-section" id="home">
        <div className="hero-glow-left" />
        <div className="hero-glow-right" />
        <div className="hero-dots" />

        <div className="container position-relative">
          <div className="row align-items-center gy-5">

            {/* Left text */}
            <div className="col-lg-6">
              <div className="hero-badge">
                <span className="hero-badge-dot" />
                Powered by Advanced AI
              </div>

              <h1 className="hero-h1">
                AI-Powered Stitching,<br />
                Perfected for <span className="hero-h1-accent">You</span>
              </h1>

              <p className="hero-desc">
                Upload your design, get AI measurements, and let our expert
                tailors stitch it to perfection. Custom fit. Your style.
              </p>

              <div className="d-flex flex-wrap gap-3">
                <Link to="/signup" className="btn-hero-primary">
                  Get Started <ArrowRight />
                </Link>
                <Link to="#howitworks" className="btn-hero-outline">
                  <PlayIcon /> How It Works
                </Link>
              </div>

              <div className="hero-trust-row">
                <span className="hero-trust-item"><span className="trust-icon">⚙️</span> AI Measurements</span>
                <span className="hero-trust-item"><span className="trust-icon">🧑‍💼</span> Expert Tailors</span>
                <span className="hero-trust-item"><span className="trust-icon">🚚</span> On-time Delivery</span>
              </div>
            </div>

            {/* Right visual */}
            <div className="col-lg-6">
              <div className="hero-visual-wrap">
                <div className="mannequin-container">
                  <MannequinSVG />

                  {/* AI Body Scan */}
                  <div className="float-card fc-top-right">
                    <div className="float-card-icon-wrap" style={{ background:"#EDE9FE" }}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#7C3AED" strokeWidth="2">
                        <rect x="3" y="3" width="18" height="18" rx="3"/>
                        <circle cx="12" cy="10" r="3"/>
                        <path d="M6 21v-1a6 6 0 0112 0v1"/>
                      </svg>
                    </div>
                    <div className="float-card-body">
                      <p className="fc-title">AI Body Scan</p>
                      <p className="fc-sub">98% Accurate</p>
                    </div>
                  </div>

                  {/* Your Design */}
                  <div className="float-card fc-bottom-left">
                    <div className="float-card-icon-wrap" style={{ background:"#FEF3C7" }}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#D97706" strokeWidth="2">
                        <rect x="3" y="3" width="18" height="18" rx="2"/>
                        <circle cx="8.5" cy="8.5" r="1.5"/>
                        <path d="M21 15l-5-5L5 21"/>
                      </svg>
                    </div>
                    <div className="float-card-body">
                      <p className="fc-sub">Your Design</p>
                      <p className="fc-title">Uploaded ✓</p>
                    </div>
                  </div>

                  {/* Perfect Fit */}
                  <div className="float-card fc-bottom-right">
                    <div className="float-card-icon-wrap" style={{ background:"#D1FAE5" }}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2.2">
                        <circle cx="12" cy="12" r="10"/>
                        <path d="M8 12l3 3 5-5"/>
                      </svg>
                    </div>
                    <div className="float-card-body">
                      <p className="fc-title">Perfect Fit</p>
                      <p className="fc-sub">Guaranteed</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────
          FEATURES — Why Choose StitchAI?
      ───────────────────────────────────── */}
      <section className="features-section" id="features">
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="section-title">
              Why Choose <span className="accent">StitchAI?</span>
            </h2>
          </div>

          <div className="row g-4 justify-content-center">
            {FEATURES.map((f) => (
              <div key={f.title} className="col-sm-6 col-lg" ref={r}>
                <div className={`feature-card`}>
                  <div className="feature-icon-box" style={{ background: f.bg }}>
                    <span style={{ fontSize:"1.5rem" }}>{f.emoji}</span>
                  </div>
                  <h5>{f.title}</h5>
                  <p>{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────
          HOW IT WORKS
      ───────────────────────────────────── */}
      <section className="how-section" id="howitworks">
        <div className="container">
          <div className="text-center mb-2">
            <h2 className="section-title">How It Works?</h2>
          </div>

          <div className="steps-flex p-2 d-lg-flex align-items-lg-start justify-content-lg-center d-md-flex justify-content-md-start">
            {STEPS.map((step, i) => (
              <div key={step.num} style={{ display:"contents" }}>
                <div className="step-block" ref={r}>
                  <div className="step-circle-wrap">
                    <div className="step-circle">
                      <span style={{ fontSize:"1.6rem" }}>{step.emoji}</span>
                    </div>
                    <div className="step-num-badge">{step.num}</div>
                  </div>
                  <h6>{step.title}</h6>
                  <p>{step.desc}</p>
                </div>
                {i < STEPS.length - 1 && (
                  <div className="step-connector-line" key={`c-${i}`} />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* ─────────────────────────────────────
          CTA BANNER
      ───────────────────────────────────── */}
      <section className="cta-section" id="aboutus">
        <div className="cta-blob-1" />
        <div className="cta-blob-2" />
        <div className="container position-relative">
          <div className="d-flex flex-column flex-md-row align-items-center justify-content-between gap-4">
            <div className="d-flex align-items-center gap-4">
              {/* Sewing machine SVG */}
              <div className="cta-machine-icon d-none d-md-block">
                <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
                  <rect x="8" y="32" width="52" height="28" rx="8"
                    fill="rgba(255,255,255,0.12)" stroke="rgba(255,255,255,0.35)" strokeWidth="2"/>
                  <rect x="16" y="20" width="30" height="16" rx="5"
                    fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.25)" strokeWidth="1.5"/>
                  <circle cx="56" cy="48" r="9"
                    fill="rgba(255,255,255,0.1)" stroke="rgba(255,255,255,0.35)" strokeWidth="1.5"/>
                  <circle cx="56" cy="48" r="3.5" fill="rgba(255,255,255,0.28)"/>
                  <line x1="31" y1="20" x2="31" y2="6" stroke="rgba(255,255,255,0.35)" strokeWidth="2"/>
                  <circle cx="31" cy="5" r="4.5" fill="rgba(255,255,255,0.2)" stroke="rgba(255,255,255,0.45)" strokeWidth="1.5"/>
                  <line x1="8" y1="60" x2="60" y2="60" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" strokeDasharray="4 3"/>
                </svg>
              </div>
              <div>
                <h2 className="mb-1">Ready to Get Your Perfect Fit?</h2>
                <p className="mb-0">Join thousands of happy customers who trust StitchAI for their custom stitching.</p>
              </div>
            </div>
            <Link to="/login" className="btn-cta-white">
              Get Started Now <ArrowRight />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}