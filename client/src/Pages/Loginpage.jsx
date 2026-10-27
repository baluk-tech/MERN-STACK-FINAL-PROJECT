import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { GoogleLogin, useGoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../Components/Authcontext';

function Loginpage() {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const {Login} = useAuth();

  const handleSubmit = (e) => {
    e.preventDefault();

    axios.post("http://localhost:5000/api/auth/login", { email, password }).then((res) => {
      Login({...res.data});
      setMessage("Login successful");
      setTimeout(() => {
        navigate("/home");
      }, 2000)
      if (res.data.role === "admin") {
        setMessage("Admin login successful");
        setTimeout(() => {
          navigate("/admin/dashboard"); // 👈 Updated Admin route to match new setup
        }, 2000)
      }
    }).catch((err) => {
      setMessage("Login failed. Please check your email and password.");
    })
  }

  return (
    <>
      <section className="vh-auto d-flex align-items-center justify-content-center p-3" style={{ background: 'var(--background)', color: 'var(--text)' }}>
        <div className="p-5 vh-auto rounded-4 shadow col-xxl-4 card my-5">
          <div className="text-center mb-5" style={{ fontFamily: 'var(--font-heading)' }} ><h1>Login Form</h1></div>

          <div className="d-flex justify-content-center mb-3">
            <GoogleLogin
              onSuccess={credentialResponse => {
                axios.post("http://localhost:5000/api/auth/oauth-login", {
                  token: credentialResponse.credential
                }).then((res) => {
                  setMessage("Login successful");
                  setTimeout(() => {
                  Login({...res.data,role:"user"});
                    navigate("/home");
                  }, 2000)
                })
              }}
              onError={() => {
                console.log('Login Failed');
              }}
              useOneTap
              width={320} // 🚨 FIXED: width percentage-la irunthatha number-ku maathiyachu
            />
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
              {/* 🚨 FIXED: autoComplete="email" add panniyachu */}
              <input type="email" id='email' autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} className='form-control' required />
            </div>

            <div className=" d-flex flex-column gap-3 mb-3  ">
              <label>Password:</label>
              <div className='list-group list-group-horizontal'>
                {/* 🚨 FIXED: autoComplete="current-password" add panniyachu */}
                <input type={showPassword ? "text" : "password"} id='password' autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} className='form-control' required />
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

export default Loginpage;