import React from 'react'
import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

function Registerpage() {

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [message, setMessage] = useState("");


  const navigate = useNavigate();

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);
  }

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      setMessage("Please enter a valid email address.");
      return;
    }

    if (password.length < 8) {
      setMessage("Password must be at least 8 characters long.");
      return;
    }

    if (!/[A-Z]/.test(password)) {
      setMessage("Password must contain at least one uppercase letter.");
      return;
    }

    if (!/[0-9]/.test(password)) {
      setMessage("Password must contain at least one number.");
      return;
    }

    if (!/[!@#$%^&*]/.test(password)) {
      setMessage("Password must contain at least one special character (!@#$%^&*).");
      return;
    }

    if (password !== confirmPassword) {
      setMessage("Passwords do not match. Please enter the same password in both fields.");
      return;
    }

    const user = { name, email, password };

    axios.post("http://localhost:5000/api/auth/register", user).then((res) => {
      setMessage(res.data.message);
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    }).catch((err) => {
      console.error(err);
      setMessage( "An error occurred during registration. Please try again.");
    });
  }
  return (
    <>
      <section className="d-flex align-items-center justify-content-center p-3"  style={{ background: 'var(--background)', color: 'var(--text)' }}>
        <div className="p-5 vh-auto rounded-4 shadow col-xxl-4 card mx-auto my-5">
          <div className="text-center mb-5" style={{ color: 'var(--text)', fontFamily: 'var(--font-heading)' }} ><h1>Register Form</h1></div>
          {message && <div className="alert alert-info">{message}</div>}

          <form onSubmit={handleSubmit} >
            <div className='d-flex flex-column gap-3 mb-3'>
              <label>Name:</label>
              <input type="text" id='name' value={name} onChange={(e) => setName(e.target.value)} className='form-control' placeholder='Enter your name' required />
            </div>

            <div className='d-flex flex-column gap-3 mb-3'>
              <label>Email:</label>
              <input type="email" id='email' value={email} onChange={(e) => setEmail(e.target.value)} className='form-control' placeholder='Enter your email' required />
            </div>

            <div className='d-flex flex-column gap-3 mb-3'>
              <label>Password:</label>
              <div className='list-group list-group-horizontal'>
                <input type={showPassword ? "text" : "password"} id='password' value={password} onChange={(e) => setPassword(e.target.value)} className='form-control list-group-item' placeholder='Enter your password' required />
                <span onClick={() => setShowPassword(!showPassword)} style={{cursor: 'pointer' }} className='list-group-item'>
                {showPassword ? (<i className="bi bi-eye"></i>) : (<i className="bi bi-eye-slash"></i>)}
                </span>
              </div>
            </div>

            <div className='d-flex flex-column gap-3 mb-3'>
              <label>Confirm Password:</label>
              <div className='list-group list-group-horizontal'>
                 <input type={showConfirmPassword ? "text" : "password"} id='confirmPassword' value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className='form-control' placeholder='Confirm your password' required />
                 <span onClick={() => setShowConfirmPassword(!showConfirmPassword)} style={{cursor: "pointer"}} className='list-group-item'>
                   {showConfirmPassword ? (<i className="bi bi-eye"></i>) : (<i className="bi bi-eye-slash"></i>)}
                 </span>
              </div>
            </div>

            <div className="text-center mt-4">
              <button type="submit" style={{background: 'var(--accent)'}} className='text-light btn w-100 mb-3'>Register</button>
              <p>Already have an account? <Link to="/login" className='text-decoration-none'>Login</Link></p>
            </div>
          </form>
        </div>
      </section>
    </>
  )
}

export default Registerpage