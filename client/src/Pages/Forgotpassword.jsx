import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

function EnvelopeLockIcon() {
  return (
    <svg
      className="fp-envelope-svg"
      viewBox="0 0 90 72"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Envelope body */}
      <rect x="4" y="28" width="82" height="52" rx="6" fill="#2563EB" />
      {/* Envelope bottom flap shadow */}
      <rect x="4" y="48" width="82" height="32" rx="0" fill="#1D4ED8" />
      <rect x="4" y="74" width="82" height="6" rx="3" fill="#1D4ED8" />
      {/* Left flap */}
      <path d="M4 28 L45 54 L4 80" fill="#3B82F6" />
      {/* Right flap */}
      <path d="M86 28 L45 54 L86 80" fill="#2563EB" />
      {/* Letter / card inside envelope */}
      <rect x="22" y="6" width="46" height="52" rx="5" fill="white" />
      {/* Lock icon on letter */}
      {/* Lock body */}
      <rect x="36" y="30" width="18" height="14" rx="3" fill="#2563EB" />
      {/* Lock shackle */}
      <path
        d="M39 30 V26 A6 6 0 0 1 51 26 V30"
        stroke="#2563EB"
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
      />
      {/* Keyhole */}
      <circle cx="45" cy="36" r="2.2" fill="white" />
      <rect x="44" y="37" width="2" height="3.5" rx="1" fill="white" />
    </svg>
  );
}

/* ══════════════════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════════════════ */
function ForgotPassword() {
  const [email, setEmail]       = useState("");
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);
  const [submitted, setSubmitted] = useState(false);

  /* ── Validation ─────────────────────────────────── */
  const validateEmail = (val) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(val);

  /* ── Submit handler ─────────────────────────────── */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email.trim()) {
      setError("Email address is required.");
      return;
    }
    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    setError("");
    setLoading(true);

    try {
        await axios.post("http://localhost:5000/api/mail/send-forgot-password-email", { email });
        setSubmitted(true);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  /* ── Arrow left icon ────────────────────────────── */
  const ArrowLeft = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 12H5M12 5l-7 7 7 7" />
    </svg>
  );

  /* ── Check icon ────────────────────────────────── */
  const CheckIcon = () => (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none"
      stroke="#22C55E" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 6L9 17l-5-5" />
    </svg>
  );

  /* ── Mail icon ─────────────────────────────────── */
  const MailIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="4" width="20" height="16" rx="3" />
      <path d="M2 7l10 7 10-7" />
    </svg>
  );

  /* ── Info icon ─────────────────────────────────── */
  const InfoIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
      stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="8" strokeWidth="3" />
      <line x1="12" y1="12" x2="12" y2="16" />
    </svg>
  );

  /* ════════════════════════════════════════════════
     RENDER
  ════════════════════════════════════════════════ */
  return (
    <div className="fp-page ">
      {/* Background blobs — CSS radial gradients */}
      <div className="fp-blob fp-blob-tl" />
      <div className="fp-blob fp-blob-br" />
      <div className="fp-blob fp-blob-bl" />

      {/* ── CARD ─────────────────────────────────── */}
      <div className="fp-card">

        {/* ── SUCCESS STATE ──────────────────────── */}
        {submitted ? (
          <div className="fp-success-wrap">
            <div className="fp-success-icon-circle">
              <CheckIcon />
            </div>
            <h2 className="fp-success-title">Check Your Email</h2>
            <p className="fp-success-text">
              We've sent a password reset link to{" "}
              <strong>{email}</strong>.<br />
              Please check your inbox.
            </p>
            <button
              className="fp-btn"
              style={{ marginBottom: "20px" }}
              onClick={() => {
                setEmail("");
                setSubmitted(false);
              }}
            >
              Send Again
            </button>
            <div className="fp-divider">
              <div className="fp-divider-line" />
              <span className="fp-divider-text">or</span>
              <div className="fp-divider-line" />
            </div>
            <Link to="/login">
              <button className="fp-back-btn">
                <ArrowLeft /> Back to Login
              </button>
            </Link>
          </div>

        ) : (
          /* ── FORM STATE ──────────────────────────── */
          <>
            {/* Icon area */}
            <div className="fp-icon-wrap">
              {/* Decorative + signs */}
              <div className="fp-deco fp-plus fp-plus-tl">+</div>
              <div className="fp-deco fp-plus fp-plus-tr">+</div>
              <div className="fp-deco fp-plus fp-plus-br">+</div>
              {/* Decorative dots */}
              <div className="fp-deco fp-dot fp-dot-tl" />
              <div className="fp-deco fp-dot fp-dot-bl" />
              {/* Icon circle */}
              <div className="fp-icon-circle">
                <EnvelopeLockIcon />
              </div>
            </div>

            {/* Title */}
            <h1 className="fp-title">Forgot Password?</h1>
            <p className="fp-subtitle">
              No worries! Enter your email address and we'll send you a link to
              reset your password.
            </p>

            {/* Form */}
            <form onSubmit={handleSubmit} noValidate>
              {/* Email field */}
              <div className="mb-1">
                <label htmlFor="fp-email" className="fp-label">
                  Email Address
                </label>
                <div className="fp-input-wrap">
                  <span className="fp-input-icon">
                    <MailIcon />
                  </span>
                  <input
                    id="fp-email"
                    type="email"
                    className={`fp-input${error ? " is-error" : ""}`}
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (error) setError("");
                    }}
                    autoComplete="email"
                    disabled={loading}
                  />
                </div>
                {error && (
                  <p className="fp-error-msg">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
                      stroke="#EF4444" strokeWidth="2.5" strokeLinecap="round">
                      <circle cx="12" cy="12" r="10" />
                      <line x1="12" y1="8" x2="12" y2="12" />
                      <line x1="12" y1="16" x2="12.01" y2="16" />
                    </svg>
                    {error}
                  </p>
                )}
              </div>

              {/* Submit button */}
              <button
                type="submit"
                className="fp-btn"
                disabled={loading}
                style={{ marginTop: "20px" }}
              >
                {loading ? (
                  <>
                    <span className="fp-spinner" />
                    Sending...
                  </>
                ) : (
                  "Send Reset Link"
                )}
              </button>
            </form>

            {/* Info box */}
            <div className="fp-info-box">
              <div className="fp-info-icon">
                <InfoIcon />
              </div>
              <p className="fp-info-text">
                If your email is registered with us, you will receive a password
                reset link shortly.
              </p>
            </div>

            {/* Divider */}
            <div className="fp-divider">
              <div className="fp-divider-line" />
              <span className="fp-divider-text">or</span>
              <div className="fp-divider-line" />
            </div>

            {/* Back to login */}
            <Link to="/login">
              <button className="fp-back-btn" type="button">
                <ArrowLeft /> Back to Login
              </button>
            </Link>
          </>
        )}
      </div>
    </div>
  );
}

export default ForgotPassword;