import React, { useEffect } from 'react'
import { useAuth } from '../Components/Authcontext';
import Loginpage from './Loginpage';
import instance from '../Utils/Middleware'
import { useState } from 'react';

function Dashboard() {
  const { user } = useAuth();

  const [userProfile, setUserProfile] = useState("")

  useEffect(() => {
    const response = instance.get('/user/profile').then((res) => {
    setUserProfile(res.data.user)
    }).catch((err) => {
      console.log(err)
    })
  }, [])

  return (  
    <>
    <section>
      <div className="container-fluid py-4 dashboard-container card shadow my-5" style={{ background: "var(--background)"}}>
        {/* --- Top Header & Stats Section --- */}
        <div className="row mb-4 align-items-center">

          {/* Welcome Text */}
          <div className="col-xl-3 col-lg-4 mb-4 mb-lg-0">
            <div className="welcome-section pe-3">
              <h6 className="text-muted fw-semibold mb-1">Welcome back,</h6>
              <h2 className="fw-bold mb-3 d-flex align-items-center">
                {userProfile.name} {userProfile.lastName} <span className="ms-2 fs-4">👋</span>
              </h2>
              <p className="text-muted small mb-0">Here's what's happening with your account today.</p>
            </div>
          </div>

          {/* Top Stat Cards */}
          <div className="col-xl-12 col-lg-8 my-5">
            <div className="row g-3">
              {/* Total Orders */}
              <div className="col-md-3 col-sm-6">
                <div className="stat-card p-3 rounded-4 custom-bg-purple h-100">
                  <div className="d-flex align-items-center mb-3">
                    <div className="icon-box icon-purple rounded-circle d-flex align-items-center justify-content-center">
                      <i className="bi bi-bag"></i>
                    </div>
                    <span className="ms-2 fw-semibold text-dark fs-7">Total Orders</span>
                  </div>
                  <h3 className="fw-bold mb-3 text-dark">12</h3>
                  <a href="#orders" className="text-decoration-none fw-semibold link-purple small">
                    View all orders <i className="bi bi-arrow-right"></i>
                  </a>
                </div>
              </div>

              {/* Active Orders */}
              <div className="col-md-3 col-sm-6">
                <div className="stat-card p-3 rounded-4 custom-bg-green h-100">
                  <div className="d-flex align-items-center mb-3">
                    <div className="icon-box icon-green rounded-circle d-flex align-items-center justify-content-center">
                      <i className="bi bi-hourglass-split"></i>
                    </div>
                    <span className="ms-2 fw-semibold text-dark fs-7">Active Orders</span>
                  </div>
                  <h3 className="fw-bold mb-3 text-dark">2</h3>
                  <a href="#active" className="text-decoration-none fw-semibold link-green small">
                    View active <i className="bi bi-arrow-right"></i>
                  </a>
                </div>
              </div>

              {/* Completed Orders */}
              <div className="col-md-3 col-sm-6">
                <div className="stat-card p-3 rounded-4 custom-bg-orange h-100">
                  <div className="d-flex align-items-center mb-3">
                    <div className="icon-box icon-orange rounded-circle d-flex align-items-center justify-content-center">
                      <i className="bi bi-check-circle"></i>
                    </div>
                    <span className="ms-2 fw-semibold text-dark fs-7">Completed Orders</span>
                  </div>
                  <h3 className="fw-bold mb-3 text-dark">10</h3>
                  <a href="#completed" className="text-decoration-none fw-semibold link-orange small">
                    View completed <i className="bi bi-arrow-right"></i>
                  </a>
                </div>
              </div>

              {/* Saved Measurements */}
              <div className="col-md-3 col-sm-6">
                <div className="stat-card p-3 rounded-4 custom-bg-red h-100">
                  <div className="d-flex align-items-center mb-3">
                    <div className="icon-box icon-red rounded-circle d-flex align-items-center justify-content-center">
                      {/* Inline SVG for ruler since Bootstrap icons ruler isn't diagonal */}
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 1 0 2.829 2.828z"></path><path d="m18 2-2 2"></path><path d="m14 6-2 2"></path><path d="m10 10-2 2"></path><path d="m6 14-2 2"></path></svg>
                    </div>
                    <span className="ms-2 fw-semibold text-dark fs-7">Saved Measurements</span>
                  </div>
                  <h3 className="fw-bold mb-3 text-dark">4</h3>
                  <a href="#measurements" className="text-decoration-none fw-semibold link-red small">
                    View measurements <i className="bi bi-arrow-right"></i>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* --- Main Content Section --- */}
        <div className="row g-4 align-items-stretch">

          {/* Recent Activity */}
          <div className="col-lg-4 col-md-5">
            <div className="card h-100 border rounded-4 custom-shadow-sm p-4">
              <h6 className="fw-bold mb-4 text-dark">Recent Activity</h6>
              <div className="activity-list d-flex flex-column gap-4">

                <div className="d-flex align-items-center justify-content-between">
                  <div className="d-flex align-items-center">
                    <div className="activity-icon icon-purple"><i className="bi bi-clipboard-check"></i></div>
                    <span className="ms-3 small fw-medium">Your shirt stitching is completed.</span>
                  </div>
                  <span className="text-muted small-text">2 hours ago</span>
                </div>

                <div className="d-flex align-items-center justify-content-between">
                  <div className="d-flex align-items-center">
                    <div className="activity-icon icon-purple"><i className="bi bi-check-circle"></i></div>
                    <span className="ms-3 small fw-medium">Order #1234 has been dispatched.</span>
                  </div>
                  <span className="text-muted small-text">1 day ago</span>
                </div>

                <div className="d-flex align-items-center justify-content-between">
                  <div className="d-flex align-items-center">
                    <div className="activity-icon icon-green"><i className="bi bi-person"></i></div>
                    <span className="ms-3 small fw-medium">Measurement profile updated.</span>
                  </div>
                  <span className="text-muted small-text">2 days ago</span>
                </div>

                <div className="d-flex align-items-center justify-content-between">
                  <div className="d-flex align-items-center">
                    <div className="activity-icon icon-green"><i className="bi bi-wallet2"></i></div>
                    <span className="ms-3 small fw-medium">Payment of ₹1,499 successful.</span>
                  </div>
                  <span className="text-muted small-text">3 days ago</span>
                </div>

                <div className="d-flex align-items-center justify-content-between">
                  <div className="d-flex align-items-center">
                    <div className="activity-icon icon-green"><i className="bi bi-stars"></i></div>
                    <span className="ms-3 small fw-medium">New design added to saved.</span>
                  </div>
                  <span className="text-muted small-text">3 days ago</span>
                </div>

              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="col-lg-8 col-md-7">
            <div className="card h-100 border rounded-4 custom-shadow-sm p-4">
              <h6 className="fw-bold mb-4 text-dark">Quick Actions</h6>
              <div className="row g-3 h-100">

                {/* Upload AI */}
                <div className="col-sm-6 col-md-3">
                  <div className="quick-action-card h-100 rounded-4 custom-bg-purple d-flex flex-column align-items-center justify-content-center p-3 text-center">
                    <div className="qa-icon icon-purple mb-2">
                      <i className="bi bi-upload fs-3"></i>
                    </div>
                    <span className="fw-semibold small text-dark">Upload<br/>AI Measurement</span>
                  </div>
                </div>

                {/* Place New Order */}
                <div className="col-sm-6 col-md-3">
                  <div className="quick-action-card h-100 rounded-4 bg-light-blue d-flex flex-column align-items-center justify-content-center p-3 text-center">
                    <div className="qa-icon icon-blue mb-2">
                      <i className="bi bi-bag fs-3"></i>
                    </div>
                    <span className="fw-semibold small text-dark">Place<br/>New Order</span>
                  </div>
                </div>

                {/* View My Orders */}
                <div className="col-sm-6 col-md-3">
                  <div className="quick-action-card h-100 rounded-4 custom-bg-green d-flex flex-column align-items-center justify-content-center p-3 text-center">
                    <div className="qa-icon icon-green mb-2">
                      <i className="bi bi-card-list fs-3"></i>
                    </div>
                    <span className="fw-semibold small text-dark">View<br/>My Orders</span>
                  </div>
                </div>

                {/* Explore New Designs */}
                <div className="col-sm-6 col-md-3">
                  <div className="quick-action-card h-100 rounded-4 custom-bg-red d-flex flex-column align-items-center justify-content-center p-3 text-center">
                    <div className="qa-icon icon-red mb-2">
                      {/* SVG for T-shirt */}
                      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.38 3.46 16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.47a2 2 0 0 0-1.34-2.23z"></path></svg>
                    </div>
                    <span className="fw-semibold small text-dark">Explore<br/>New Designs</span>
                  </div>
                </div>

              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
    </>
  )
}

export default Dashboard