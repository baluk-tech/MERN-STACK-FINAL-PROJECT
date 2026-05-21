import { useState } from 'react'
import Navbar from './Components/Navbar'
import Sidebar from './Pages/Sidebar'
import Registerpage from './Pages/Registerpage'
import Loginpage from './Pages/Loginpage'
import ForgotPassword from './Pages/Forgotpassword'
import ResetPassword from './Pages/Resetpassword'
import Myprofile from './Pages/Myprofile'
import { Routes, Route, Outlet } from 'react-router-dom'
import Footer from './Components/Footer'
import Dashboard from './Pages/Dashboard'
import LandingPage from './Pages/Landingpage'
import { useEffect } from 'react'
import Scroll from './Components/Scroll'


function App() {
  useEffect(()=>{
    
  },[])
  return (
    <>
      <Navbar />
      <Routes>
        <Route element={<>
            <Outlet/>
            <Scroll/>
          </>}>
          
        <Route path="/" element={<LandingPage />} />
        <Route path="/signup" element={<Registerpage />} />
        <Route path="/login" element={<Loginpage />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:resetPasswordToken" element={<ResetPassword />} />
        <Route path="/profile" element={<Myprofile />} />
        <Route path="/dashboard" element={<Dashboard />} />
        </Route>
        
      </Routes>
      <Footer />
    </>
  )
}

export default App
