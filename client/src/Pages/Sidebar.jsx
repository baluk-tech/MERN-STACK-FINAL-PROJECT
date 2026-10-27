import React, { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { useCart } from '../Components/CartContext'; // 🚨 CHANGED: Import Cart Context

function Sidebar() {
  const [showSidebar, setShowSidebar] = useState(false);
  const location = useLocation();
  
  const { cart, cartCount } = useCart(); // 🚨 CHANGED: Get Cart data and count

  const sidebarItems = [
    { icon: 'bi bi-grid-1x2-fill',    name: 'Dashboard',          link: '/dashboard'},
    { icon: 'bi bi-bar-chart-line',   name: 'My order stats',     link: '/my-order-stats' },
    { icon: 'bi bi-rulers',           name: 'Measurement',        link: '/measurement' },
    { icon: 'bi bi-cart',             name: 'Cart',               link: '/cart' }, // 🚨 CHANGED: Point to /cart
    { icon: 'bi bi-heart-fill',       name: 'Favourite designs',  link: '/favourite-designs' },
    { icon: 'bi bi-bag-check',        name: 'Recent orders',      link: '/recent-orders' },
    { icon: 'bi bi-stars',            name: 'Ask AI suggestions', link: '/ai-suggestions' },
    { icon: 'bi bi-gear-fill',        name: 'Settings',           link: '/settings' }
  ];

  return (
    <>
      <section className="d-flex flex-column flex-lg-row min-vh-100" style={{ background: 'var(--background)' }}>
        
        {/* --- Mobile Header --- */}
        <div className="d-lg-none p-3 shadow-sm d-flex align-items-center bg-white w-100">
          <button
            className="btn text-white border-0"
            style={{ background: "var(--purple)" }}
            onClick={() => setShowSidebar(true)}
          >
            <i className="bi bi-list fs-4"></i>
          </button>
          <h5 className="mb-0 ms-3 fw-bold" style={{ color: 'var(--purple)' }}>Menu</h5>
        </div>

        {/* --- Backdrop for Mobile Sidebar --- */}
        {showSidebar && (
          <div
            className="position-fixed top-0 start-0 w-100 h-100"
            style={{ backgroundColor: "rgba(0,0,0,0.5)", zIndex: 1040 }}
            onClick={() => setShowSidebar(false)}
          ></div>
        )}

        {/* --- Desktop Sidebar --- */}
        <div
          className="d-none d-lg-block my-4 ms-4 rounded-4 shadow p-4 text-white flex-shrink-0"
          style={{ background: "var(--purple)", width: "260px" }}
        >
          <div className="d-flex flex-column gap-2">
            {sidebarItems.map((item, index) => {
              const isActive = location.pathname === item.link; 

              return (
                <div 
                  key={index} 
                  className={`py-2 px-3 rounded-3 nav-item d-flex align-items-center justify-content-between gap-3 ${isActive ? 'bg-white shadow-sm' : ''}`}
                  style={{ transition: 'all 0.3s ease' }}
                >
                  <div className="d-flex align-items-center gap-3 w-100">
                    <i 
                      className={`${item.icon} fs-5`} 
                      style={{ color: isActive ? 'var(--purple)' : 'white' }}
                    ></i>
                    <Link 
                      to={item.link} 
                      className="text-decoration-none w-100"
                      style={{ 
                        color: isActive ? 'var(--purple)' : 'white', 
                        fontWeight: isActive ? '700' : '500' 
                      }}
                    >
                      {item.name}
                    </Link>
                  </div>
                  
                  {/* 🚨 CHANGED: Add Badge for Cart */}
                  {item.name === 'Cart' && cartCount > 0 && (
                    <span className="badge rounded-pill bg-danger" style={{ fontSize: '0.7rem' }}>
                      {cartCount}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* --- Mobile Sidebar --- */}
        <div
          className="position-fixed top-0 start-0 h-100 text-white p-4"
          style={{
            width: "260px",
            background: "var(--purple)",
            zIndex: 1050,
            transform: showSidebar ? "translateX(0)" : "translateX(-100%)",
            transition: "transform 0.3s ease-in-out",
          }}
        >
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h5 className="m-0 fw-bold">Menu</h5>
            <button className="btn btn-sm btn-light border-0" onClick={() => setShowSidebar(false)}>
              <i className="bi bi-x-lg text-dark"></i>
            </button>
          </div>
          <div className="d-flex flex-column gap-2">
            {sidebarItems.map((item, index) => {
              const isActive = location.pathname === item.link;

              return (
                <div 
                  key={index} 
                  className={`py-2 px-3 rounded-3 nav-item d-flex align-items-center justify-content-between gap-3 ${isActive ? 'bg-white shadow-sm' : ''}`}
                  style={{ transition: 'all 0.3s ease' }}
                >
                  <div className="d-flex align-items-center gap-3 w-100">
                    <i 
                      className={`${item.icon} fs-5`} 
                      style={{ color: isActive ? 'var(--purple)' : 'white' }}
                    ></i>
                    <Link
                      to={item.link}
                      className="text-decoration-none w-100"
                      style={{ 
                        color: isActive ? 'var(--purple)' : 'white', 
                        fontWeight: isActive ? '700' : '500' 
                      }}
                      onClick={() => setShowSidebar(false)}
                    >
                      {item.name}
                    </Link>
                  </div>

                  {/* 🚨 CHANGED: Add Badge for Cart (Mobile) */}
                  {item.name === 'Cart' && cartCount > 0 && (
                    <span className="badge rounded-pill bg-danger" style={{ fontSize: '0.7rem' }}>
                      {cartCount}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* --- Main Content Area --- */}
        <div 
          className="flex-grow-1 p-3 p-lg-4 custom-scroll-container w-100"
          style={{ minWidth: 0, overflowX: 'hidden' }}
        >
          <Outlet />
        </div>

      </section>
    </>
  );
}

export default Sidebar;