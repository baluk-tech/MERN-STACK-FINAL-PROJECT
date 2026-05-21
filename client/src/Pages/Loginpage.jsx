import React from 'react'
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';

function Loginpage() {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    axios.post("http://localhost:5000/api/auth/login", { email, password }).then((res) => {
      localStorage.setItem("token", res.data.token)
      console.log(res.data);
      setMessage("Login successful");
      setTimeout(() => {
        window.location.href="/dashboard";
      }, 2000)
    }).catch((err) => {
      console.error(err);
      setMessage("Login failed. Please check your email and password.");
    })
  }



  return (
    <>
      <section className="vh-auto d-flex align-items-center justify-content-center p-3" style={{ background: 'var(--background)', color: 'var(--text)' }}>
        <div className="p-5 vh-auto rounded-4 shadow col-xxl-4 card my-5">
          <div className="text-center mb-4" style={{ fontFamily: 'var(--font-heading)' }} ><h1>Login Form</h1></div>

          <div>
            <button className="btn btn-outline-primary w-100 mb-4">
              <i className="bi bi-google"></i> Continue with Google
            </button>
          </div>

          <div className="fp-divider">
            <div className="fp-divider-line" />
            <span className="fp-divider-text">or</span>
            <div className="fp-divider-line" />
          </div>

          {message && <div className="alert alert-info">{message}</div>}

          <form onSubmit={handleSubmit}>
            <div className='d-flex flex-column gap-3 mb-3'>
              <label>Email:</label>
              <input type="email" id='email' value={email} onChange={(e) => setEmail(e.target.value)} className='form-control' required />
            </div>

            <div className=" d-flex flex-column gap-3 mb-3  ">
              <label>Password:</label>
              <div className='list-group list-group-horizontal'>
                <input type={showPassword ? "text" : "password"} id='password' value={password} onChange={(e) => setPassword(e.target.value)} className='form-control' required />
                <span onClick={() => setShowPassword(!showPassword)} style={{cursor: 'pointer' }} className='list-group-item'>
                  {showPassword ? (<i className="bi bi-eye"></i>) : (<i className="bi bi-eye-slash"></i>)}
                </span>
              </div>
            </div>

            <div>
              <input type="checkbox" className='form-check-input shadow' id="rememberMe" />
              <label className='form-check-label'> Remember me</label>
            </div>

            <div className="text-center mt-3">
              <button style={{background: 'var(--accent)'}} className='text-light btn px-4 py-2 mb-2 w-100'>Login</button>
              <Link to="/forgot-password" className='text-decoration-none'><p>Forgot password?</p></Link>
              <p>Don't have an account? <Link to="/signup" className='text-decoration-none'>Register</Link></p>
            </div>
          </form>
        </div>
      </section>
    </>
    )
}

export default Loginpage