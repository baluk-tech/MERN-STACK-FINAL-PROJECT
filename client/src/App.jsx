import { useState } from 'react';
import { Routes, Route, Outlet, Navigate } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { AuthProvider } from './Components/Authcontext';
import { CartProvider } from './Components/CartContext';

import { Navbar, Footer, Scroll } from './Components/index';
import { Sidebar, Registerpage, Loginpage, ForgotPassword, ResetPassword, Myprofile, Home, ProductView, Dashboard, MyOrderStats, Measurement, Cart, LandingPage, Checkout, RecentOrders, Favourites, Settings, AskAI,  AdminLayout, Admindashboard, AdminOrders, AdminUsers, AdminProducts } from './Pages/index';

function App() {

  const token = localStorage.getItem("token");

  return (
    <>
      <AuthProvider>
        <CartProvider>
          <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID} >

          <div className='d-flex flex-column min-vh-100'>

            <Navbar />

            <main className='flex-grow-1'>
              <Routes>
                <Route element={<>
                    <Outlet/>
                    <Scroll/>
                  </>} >

                  {token ? (
                    <Route path="/" element={<Navigate to="/home" />} />
                  ) : (
                    <Route path="/" element={<LandingPage />} />
                  )}

                  <Route path="/home" element={<Home />} />
                  <Route path="/signup" element={<Registerpage />} />
                  <Route path="/login" element={<Loginpage />} />
                  <Route path="/forgot-password" element={<ForgotPassword />} />
                  <Route path="/reset-password/:resetPasswordToken" element={<ResetPassword />} />
                  <Route path="/profile" element={<Myprofile />} />
                  <Route path="/product/:id" element={<ProductView />} />
                  <Route path="/checkout" element={<Checkout />} />
                  <Route element={<Sidebar />} >
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/my-order-stats" element={<MyOrderStats />} />
                    <Route path="/measurement" element={<Measurement />} />
                    <Route path="/cart" element={<Cart />} />
                    <Route path="/favourite-designs" element={<Favourites />} />
                    <Route path="/recent-orders" element={<RecentOrders />} />
                    <Route path="/ai-suggestions" element={<AskAI />} />
                    <Route path="/settings" element={<Settings />} />
                    <Route path="/quick-actions" element={<Dashboard />} />
                  </Route>
                  
                  {/* --- 🚨 ADMIN ROUTES FIXED 🚨 --- */}
                  <Route path="/admin" element={<AdminLayout />} >
                    {/* /admin nu vantha automatic-a dashboard-ku pogum */}
                    <Route index element={<Navigate to="/admin/dashboard" />} />
                    
                    {/* Main Admin Pages */}
                    <Route path="dashboard" element={<Admindashboard />} />
                    <Route path="admin-dashboard" element={<Navigate to="/admin/dashboard" />} />
                    <Route path="orders" element={<AdminOrders />} />
                    <Route path="users" element={<AdminUsers />} />
                    <Route path="products" element={<AdminProducts />} />
                  </Route>

                  {/* 🚨 Pazhaya URLs-a Automatic-a Redirect Panna 🚨 */}
                  <Route path="/admin-dashboard" element={<Navigate to="/admin/dashboard" />} />
                  <Route path="/admin-orders" element={<Navigate to="/admin/orders" />} />
                </Route>
              </Routes>
            </main>

            <Footer />

            </div>

          </GoogleOAuthProvider>
        </CartProvider>
      </AuthProvider>
    </>
  )
}

export default App
