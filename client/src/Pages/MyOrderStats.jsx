import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import instance from '../Utils/Middleware'; 

function MyOrderStats() {
  const location = useLocation();
  const [timeRange, setTimeRange] = useState('6months');
  const [loading, setLoading] = useState(false);

  const [liveOrders, setLiveOrders] = useState([]);
  const [selectedOrderId, setSelectedOrderId] = useState(null);

  const [stats, setStats] = useState({
    totalSpent: 0,
    avgOrderValue: 0,
    totalGarments: 0,
    turnaroundDays: 0,
    spendingHistory: [
      { month: 'Jan', amount: 0 }, { month: 'Feb', amount: 0 }, { month: 'Mar', amount: 0 },
      { month: 'Apr', amount: 0 }, { month: 'May', amount: 0 }, { month: 'Jun', amount: 0 },
    ],
    categories: [{ name: 'No Data', count: 0, percentage: 0, color: 'bg-secondary' }],
    fabrics: [{ name: 'No Data', percentage: 0, color: '#6c757d' }],
  });

  // --- API CALLS (Stats & Real Orders) ---
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const statsRes = await instance.get(`/orders/order-stats?range=${timeRange}`);
        if (statsRes.data && statsRes.data.stats) {
          setStats(statsRes.data.stats);
        }

        const ordersRes = await instance.get('/orders/my-orders');
        const fetchedOrders = ordersRes.data.orders || ordersRes.data || [];
        
        if (fetchedOrders.length > 0) {
          setLiveOrders(fetchedOrders);
          
          // RecentOrders page-l irunthu state vanthuruntha atha select pannu, illana first order
          const passedOrderId = location.state?.orderData?._id;
          if (passedOrderId && fetchedOrders.some(o => o._id === passedOrderId)) {
            setSelectedOrderId(passedOrderId);
          } else {
            setSelectedOrderId(fetchedOrders[0]._id);
          }
        }
      } catch (err) {
        console.error('Failed to load dashboard data', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [timeRange, location.state]);

  const maxSpending = Math.max(...stats.spendingHistory.map((item) => item.amount), 1);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Pending': return 'bg-warning-subtle text-warning border border-warning-subtle';
      case 'Processing': return 'bg-primary-subtle text-primary border border-primary-subtle';
      case 'Dispatched': return 'bg-info-subtle text-info border border-info-subtle';
      case 'Delivered': return 'bg-success-subtle text-success border border-success-subtle';
      case 'Cancelled': return 'bg-danger-subtle text-danger border border-danger-subtle';
      default: return 'bg-secondary-subtle text-secondary';
    }
  };

  const trackingSteps = ['Pending', 'Processing', 'Dispatched', 'Delivered'];
  
  const getStepIndex = (status) => {
    const index = trackingSteps.indexOf(status);
    return index !== -1 ? index : 0;
  };

  const activeOrder = liveOrders.find(o => o._id === selectedOrderId);
  const currentStepIndex = activeOrder ? getStepIndex(activeOrder.orderStatus) : 0;

  return (
    <div className="container-fluid py-4 dashboard-container card border-0 shadow-sm rounded-4 w-100" style={{ background: 'var(--background)' }}>
      
      {/* --- Header & Filter Dropdown --- */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3 px-2">
        <div>
          <h3 className="fw-bold mb-1 text-dark">My Order Stats</h3>
          <p className="text-muted small mb-0">Track your wardrobe analytics, tailoring activity, and expense history.</p>
        </div>
        <div>
          <select 
            className="form-select border-0 shadow-sm bg-white fw-semibold"
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            disabled={loading}
          >
            <option value="30days">Last 30 Days</option>
            <option value="6months">Last 6 Months</option>
            <option value="year">This Year</option>
            <option value="all">All Time</option>
          </select>
        </div>
      </div>

      {/* --- KPI Cards Row --- */}
      <div className="row g-3 mb-4 w-100 mx-0">
        <div className="col-md-3 col-sm-6 px-2">
          <div className="stat-card p-3 rounded-4 custom-bg-purple h-100 shadow-sm">
            <div className="d-flex align-items-center mb-2">
              <div className="icon-box icon-purple rounded-circle d-flex align-items-center justify-content-center p-2">
                <i className="bi bi-cash-stack fs-5"></i>
              </div>
              <span className="ms-2 fw-semibold text-dark small">Total Spent</span>
            </div>
            <h3 className="fw-bold mb-0 text-dark">₹{stats.totalSpent.toLocaleString()}</h3>
          </div>
        </div>

        <div className="col-md-3 col-sm-6 px-2">
          <div className="stat-card p-3 rounded-4 custom-bg-green h-100 shadow-sm">
            <div className="d-flex align-items-center mb-2">
              <div className="icon-box icon-green rounded-circle d-flex align-items-center justify-content-center p-2">
                <i className="bi bi-receipt fs-5"></i>
              </div>
              <span className="ms-2 fw-semibold text-dark small">Avg Order Value</span>
            </div>
            <h3 className="fw-bold mb-0 text-dark">₹{stats.avgOrderValue.toLocaleString()}</h3>
          </div>
        </div>

        <div className="col-md-3 col-sm-6 px-2">
          <div className="stat-card p-3 rounded-4 custom-bg-orange h-100 shadow-sm">
            <div className="d-flex align-items-center mb-2">
              <div className="icon-box icon-orange rounded-circle d-flex align-items-center justify-content-center p-2">
                <i className="bi bi-scissors fs-5"></i>
              </div>
              <span className="ms-2 fw-semibold text-dark small">Items Tailored</span>
            </div>
            <h3 className="fw-bold mb-0 text-dark">{stats.totalGarments}</h3>
          </div>
        </div>

        <div className="col-md-3 col-sm-6 px-2">
          <div className="stat-card p-3 rounded-4 custom-bg-red h-100 shadow-sm">
            <div className="d-flex align-items-center mb-2">
              <div className="icon-box icon-red rounded-circle d-flex align-items-center justify-content-center p-2">
                <i className="bi bi-clock-history fs-5"></i>
              </div>
              <span className="ms-2 fw-semibold text-dark small">Avg Turnaround</span>
            </div>
            <h3 className="fw-bold mb-0 text-dark">{stats.turnaroundDays} <span className="fs-6 fw-normal">Days</span></h3>
          </div>
        </div>
      </div>

      {/* --- Charts & Breakdown Row --- */}
      <div className="row g-4 mb-4 align-items-stretch w-100 mx-0">
        <div className="col-lg-7 px-2">
          <div className="card border-0 rounded-4 shadow-sm p-4 h-100 bg-white">
            <h6 className="fw-bold mb-4 text-dark d-flex align-items-center">
              <i className="bi bi-graph-up me-2 text-primary"></i> Spending Trend (₹)
            </h6>
            <div className="d-flex align-items-end justify-content-between pt-4 pb-2 px-2" style={{ height: '220px' }}>
              {stats.spendingHistory.map((item, idx) => {
                const barHeight = Math.round((item.amount / maxSpending) * 160);
                return (
                  <div key={idx} className="d-flex flex-column align-items-center flex-fill">
                    <span className="small text-muted mb-1" style={{ fontSize: '11px' }}>₹{item.amount}</span>
                    <div className="rounded-3 w-50" style={{ height: `${barHeight}px`, backgroundColor: 'var(--purple)', transition: 'height 0.4s ease' }}></div>
                    <span className="small fw-semibold mt-2 text-dark">{item.month}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="col-lg-5 px-2">
          <div className="card border-0 rounded-4 shadow-sm p-4 h-100 bg-white">
            <h6 className="fw-bold mb-4 text-dark d-flex align-items-center">
              <i className="bi bi-pie-chart me-2 text-success"></i> Wardrobe Category Share
            </h6>
            <div className="d-flex flex-column gap-3 overflow-auto" style={{ maxHeight: '220px' }}>
              {stats.categories.map((cat, idx) => (
                <div key={idx}>
                  <div className="d-flex justify-content-between small fw-semibold mb-1">
                    <span>{cat.name} ({cat.count})</span>
                    <span>{cat.percentage}%</span>
                  </div>
                  <div className="progress" style={{ height: '8px' }}>
                    <div className={`progress-bar rounded-pill ${cat.color}`} role="progressbar" style={{ width: `${cat.percentage}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* --- LIVE: Order Management & Tracking Row --- */}
      <div className="row g-4 mb-4 align-items-stretch w-100 mx-0">
        
        {/* Real Order Management Table */}
        <div className="col-lg-7 px-2">
          <div className="card border-0 rounded-4 shadow-sm p-4 h-100 bg-white">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h6 className="fw-bold text-dark mb-0 d-flex align-items-center">
                Live Order History
              </h6>
            </div>
            
            <div className="table-responsive" style={{ maxHeight: '350px' }}>
              <table className="table table-hover table-borderless align-middle mb-0 text-nowrap">
                <thead className="bg-light rounded-3 position-sticky top-0" style={{ zIndex: 1 }}>
                  <tr>
                    <th className="py-3 px-3 text-muted small fw-semibold rounded-start-3">Order ID</th>
                    <th className="py-3 px-3 text-muted small fw-semibold">Main Item</th>
                    <th className="py-3 px-3 text-muted small fw-semibold">Order Date</th>
                    <th className="py-3 px-3 text-muted small fw-semibold">Status</th>
                    <th className="py-3 px-3 text-muted small fw-semibold rounded-end-3">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {liveOrders.length > 0 ? (
                    liveOrders.map((order) => (
                      <tr 
                        key={order._id} 
                        className="border-bottom" 
                        style={{ borderColor: '#f3f4f6', cursor: 'pointer', backgroundColor: selectedOrderId === order._id ? '#f8f9fa' : 'transparent' }}
                        onClick={() => setSelectedOrderId(order._id)}
                      >
                        <td className="py-3 px-3 fw-bold text-primary small">
                          #{order._id.substring(order._id.length - 6).toUpperCase()}
                        </td>
                        <td className="py-3 px-3">
                          <div className="d-flex align-items-center gap-2">
                            <img 
                              src={order.items[0]?.image ? `http://localhost:5000/uploads/${order.items[0].image}` : 'https://via.placeholder.com/40/4F46E5/FFFFFF?text=S'} 
                              alt={order.items[0]?.title || 'Item'} 
                              className="rounded-2 object-fit-cover" 
                              width="36" height="36" 
                            />
                            <div>
                              <span className="fw-semibold text-dark small d-block">{order.items[0]?.title || 'Custom Garment'}</span>
                              {order.items.length > 1 && <span className="small text-muted" style={{ fontSize: '10px' }}>+ {order.items.length - 1} more items</span>}
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-3 text-muted small">{formatDate(order.createdAt)}</td>
                        <td className="py-3 px-3">
                          <span className={`badge rounded-pill px-3 py-2 fw-medium ${getStatusBadge(order.orderStatus)}`}>
                            {order.orderStatus}
                          </span>
                        </td>
                        <td className="py-3 px-3 fw-bold text-dark small">₹{order.totalAmount.toLocaleString()}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="text-center py-5 text-muted">
                        No orders found. Place your first order to see history here!
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Dynamic Order Tracking Stepper */}
        <div className="col-lg-5 px-2">
          <div className="card border-0 rounded-4 shadow-sm p-4 h-100 bg-white">
            
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h6 className="fw-bold text-dark mb-0 d-flex align-items-center">
                Live Tracking
              </h6>
            </div>

            {activeOrder ? (
              <>
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <div>
                    <span className="fw-bold fs-5 text-dark d-block">Order #{activeOrder._id.substring(activeOrder._id.length - 6).toUpperCase()}</span>
                    <span className="badge bg-light text-dark border mt-1"><i className="bi bi-wallet2 me-1"></i> {activeOrder.paymentMethod}</span>
                  </div>
                  <div className="text-end">
                    <span className="small text-muted d-block">Placed on {formatDate(activeOrder.createdAt)}</span>
                    <span className={`badge mt-1 ${activeOrder.paymentStatus === 'Paid' ? 'bg-success' : 'bg-warning text-dark'}`}>
                      Payment: {activeOrder.paymentStatus}
                    </span>
                  </div>
                </div>

                {/* 🚨 FIXED STEPPER LAYOUT (Dash error resolved) 🚨 */}
                <div className="position-relative mb-5 mt-3 px-2">
                  <div className="position-absolute w-100" style={{ height: '3px', background: '#e5e7eb', top: '14px', zIndex: 1, left: 0 }}></div>
                  <div className="position-absolute" style={{ height: '3px', background: '#10b981', top: '14px', width: `${(currentStepIndex / (trackingSteps.length - 1)) * 100}%`, zIndex: 2, left: 0, transition: 'width 0.4s ease' }}></div>
                  
                  <div className="d-flex justify-content-between position-relative" style={{ zIndex: 3 }}>
                    {trackingSteps.map((step, idx) => {
                      let isCompleted = idx < currentStepIndex;
                      let isActive = idx === currentStepIndex;
                      
                      return (
                        <div key={idx} className="d-flex flex-column align-items-center" style={{ width: '60px' }}>
                          <div 
                            className={`rounded-circle d-flex justify-content-center align-items-center mb-2 shadow-sm`}
                            style={{ 
                              width: '32px', height: '32px', 
                              background: isCompleted ? '#10b981' : '#ffffff',
                              border: isActive ? '3px solid #3b82f6' : (isCompleted ? 'none' : '3px solid #e5e7eb'),
                              transition: 'all 0.3s ease'
                            }}
                          >
                            {isCompleted && <i className="bi bi-check text-white fs-5"></i>}
                            {isActive && <div className="rounded-circle" style={{ width: '10px', height: '10px', background: '#3b82f6' }}></div>}
                          </div>
                          <span className={`text-center fw-semibold ${isCompleted || isActive ? 'text-dark' : 'text-muted'}`} style={{ fontSize: '11px', lineHeight: '1.2' }}>
                            {step}
                          </span>
                        </div>
                      )
                    })}
                  </div>
                </div>

                {/* Status Alert Box */}
                <div className={`p-3 rounded-3 d-flex align-items-center gap-2 mb-3 border ${activeOrder.orderStatus === 'Cancelled' ? 'bg-danger-subtle border-danger-subtle' : 'bg-primary-subtle border-primary-subtle'}`}>
                  <i className={`bi bi-info-circle-fill ${activeOrder.orderStatus === 'Cancelled' ? 'text-danger' : 'text-primary'}`}></i>
                  <span className={`small fw-medium ${activeOrder.orderStatus === 'Cancelled' ? 'text-danger' : 'text-primary'}`}>
                    {activeOrder.orderStatus === 'Pending' && "Your order is received and waiting for tailor confirmation."}
                    {activeOrder.orderStatus === 'Processing' && "Your garment is currently being stitched with precision."}
                    {activeOrder.orderStatus === 'Dispatched' && "Good news! Your order is on the way."}
                    {activeOrder.orderStatus === 'Delivered' && "Order delivered successfully. Enjoy your custom fit!"}
                    {activeOrder.orderStatus === 'Cancelled' && "This order has been cancelled."}
                  </span>
                </div>

                {/* Expected Delivery */}
                {activeOrder.orderStatus !== 'Cancelled' && activeOrder.orderStatus !== 'Delivered' && (
                  <div className="d-flex align-items-center gap-2 mt-auto">
                    <i className="bi bi-truck fs-5 text-muted"></i>
                    <span className="fw-semibold text-primary small">
                      Expected Delivery: {(() => {
                        let d = new Date(activeOrder.createdAt);
                        d.setDate(d.getDate() + 5);
                        return formatDate(d);
                      })()}
                    </span>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-5">
                <i className="bi bi-box-seam fs-1 text-muted mb-3 d-block"></i>
                <p className="text-muted">Select an order from the list to track its status.</p>
              </div>
            )}

          </div>
        </div>
      </div>

    </div>
  );
}

export default MyOrderStats;