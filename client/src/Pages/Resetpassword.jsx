import { useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { FaLock, FaEye, FaEyeSlash, FaShieldAlt, FaSyncAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const ResetPassword = () => {
  const { resetPasswordToken } = useParams();
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
    const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }
    if (!/(?=.*[a-zA-Z])(?=.*\d)(?=.*[^a-zA-Z\d])/.test(newPassword)) {
      setError("Password must include letters, numbers & symbols.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
        await axios.put("http://localhost:5000/api/mail/send-reset-password-email", {  token: resetPasswordToken, newPassword });
        setSuccess("Your password has been reset successfully.");
        setTimeout(() => {
          navigate("/login");
        }, 2000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rp-bg d-flex align-items-center justify-content-center min-vh-100 px-3">
      {/* Decorative blobs */}
      <div className="rp-blob rp-blob--left" aria-hidden="true" />
      <div className="rp-blob rp-blob--right" aria-hidden="true" />

      <div className="rp-card card border-0 shadow-lg w-100">

        {/* ── Lock Icon ── */}
        <div className="rp-icon-wrap mx-auto mb-4">
          {/* sparkle +  top-left */}
          <span className="rp-sparkle rp-sparkle--plus" aria-hidden="true">+</span>
          {/* sparkle dot top-right */}
          <span className="rp-sparkle rp-sparkle--dot" aria-hidden="true" />

          <div className="rp-icon-circle">
            {/* Main lock */}
            <FaLock className="rp-fa-lock" aria-label="lock" />

            {/* Refresh badge — bottom-right overlap */}
            <span className="rp-refresh-badge" aria-hidden="true">
              <FaSyncAlt className="rp-fa-sync" />
            </span>
          </div>
        </div>

        {/* Heading */}
        <h1 className="rp-title text-center">Reset Password</h1>
        <p className="rp-subtitle text-center mb-4">
          Enter your new password below to reset your password.
        </p>

        {/* Alerts */}
        {error && (
          <div className="alert alert-danger py-2 px-3 mb-3 rp-alert" role="alert">
            {error || "An error occurred while resetting your password. Please try again."}
          </div>
        )}
        {success && (
          <div className="alert alert-success py-2 px-3 mb-3 rp-alert" role="alert">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>

          {/* ── New Password ── */}
          <div className="mb-4">
            <label htmlFor="newPassword" className="rp-label form-label">
              New Password
            </label>
            <div className="rp-input-wrap input-group">
              <span className="rp-input-icon input-group-text">
                <FaLock className="rp-field-icon" />
              </span>
              <input
                id="newPassword"
                type={showNew ? "text" : "password"}
                className="form-control rp-input"
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                autoComplete="new-password"
              />
              <button
                type="button"
                className="rp-eye-btn input-group-text"
                onClick={() => setShowNew(!showNew)}
                aria-label={showNew ? "Hide password" : "Show password"}
              >
                {showNew ? <FaEyeSlash className="rp-field-icon" /> : <FaEye className="rp-field-icon" />}
              </button>
            </div>
          </div>

          {/* ── Confirm Password ── */}
          <div className="mb-4">
            <label htmlFor="confirmPassword" className="rp-label form-label">
              Confirm Password
            </label>
            <div className="rp-input-wrap input-group">
              <span className="rp-input-icon input-group-text">
                <FaLock className="rp-field-icon" />
              </span>
              <input
                id="confirmPassword"
                type={showConfirm ? "text" : "password"}
                className="form-control rp-input"
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                autoComplete="new-password"
              />
              <button
                type="button"
                className="rp-eye-btn input-group-text"
                onClick={() => setShowConfirm(!showConfirm)}
                aria-label={showConfirm ? "Hide password" : "Show password"}
              >
                {showConfirm ? <FaEyeSlash className="rp-field-icon" /> : <FaEye className="rp-field-icon" />}
              </button>
            </div>
          </div>

          {/* ── Password Hint ── */}
          <div className="rp-hint d-flex align-items-start gap-3 mb-4">
            <span className="rp-hint-icon flex-shrink-0">
              <FaShieldAlt className="rp-shield-icon" />
            </span>
            <p className="rp-hint-text mb-0">
              Your password must be at least 8 characters long and include a mix of
              letters, numbers &amp; symbols.
            </p>
          </div>

          {/* ── Submit ── */}
          <button
            type="submit"
            className="btn rp-btn w-100 d-flex align-items-center justify-content-center gap-2"
            disabled={loading}
          >
            {loading ? (
              <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true" />
            ) : (
              <FaLock className="rp-btn-icon" aria-hidden="true" />
            )}
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>

        {/* ── Divider ── */}
        <div className="rp-divider d-flex align-items-center my-4">
          <hr className="flex-grow-1" />
          <span className="rp-divider-text mx-3">or</span>
          <hr className="flex-grow-1" />
        </div>

        {/* ── Back to Login ── */}
        <div className="text-center">
          <a href="/login" className="rp-back-link d-inline-flex align-items-center gap-2">
            <span className="rp-back-arrow">&#8592;</span>
            Back to Login
          </a>
        </div>

      </div>
    </div>
  );
};

export default ResetPassword;