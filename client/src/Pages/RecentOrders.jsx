import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiBox, FiClock, FiCheckCircle, FiChevronRight } from 'react-icons/fi';
import instance from '../Utils/Middleware'; 

function RecentOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await instance.get('/orders/my-orders');
        const fetchedOrders = res.data.orders || res.data || [];
        setOrders(fetchedOrders);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const getStatusBadge = (status) => {
    const s = (status || 'Pending').toLowerCase();
    if (s === 'delivered') return <span className="badge bg-success-subtle text-success border border-success-subtle px-3 py-2"><FiCheckCircle className="me-1"/> Delivered</span>;
    if (s === 'dispatched' || s === 'shipped') return <span className="badge bg-warning-subtle text-warning-emphasis border border-warning-subtle px-3 py-2"><FiBox className="me-1"/> Dispatched</span>;
    if (s === 'processing' || s === 'stitching') return <span className="badge bg-primary-subtle text-primary border border-primary-subtle px-3 py-2"><FiClock className="me-1"/> Processing</span>;
    return <span className="badge bg-secondary-subtle text-dark border border-secondary-subtle px-3 py-2"><FiClock className="me-1"/> {status || 'Pending'}</span>;
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100 bg-light">
        <div className="spinner-border" style={{ color: 'var(--purple)' }}></div>
      </div>
    );
  }

  return (
    <div className="bg-light min-vh-100 py-5">
      <div className="container" style={{ maxWidth: '900px' }}>
        
        <div className="d-flex align-items-center justify-content-between mb-4">
          <h3 className="fw-bold text-dark mb-0">My Recent Orders</h3>
          <Link className="btn btn-outline-dark btn-sm rounded-pill px-4" to="/home">Continue Shopping</Link>
        </div>

        {orders.length === 0 ? (
          <div className="text-center py-5 bg-white rounded-4 shadow-sm border">
            <div className="display-1 text-muted mb-3">📦</div>
            <h4 className="fw-bold text-dark">No orders found</h4>
            <p className="text-muted">Looks like you haven't placed any stitching orders yet.</p>
            <Link className="btn text-white mt-3 px-4 py-2 rounded-3" style={{ background: 'var(--purple)' }} to="/home">
              Explore Designs
            </Link>
          </div>
        ) : (
          <div className="d-flex flex-column gap-4">
            {orders.map((order) => (
              <div key={order._id} className="card border-0 shadow-sm rounded-4 bg-white overflow-hidden">
                
                <div className="card-header bg-white border-bottom p-4 d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
                  <div className="d-flex flex-wrap gap-4">
                    <div>
                      <small className="text-muted text-uppercase fw-bold" style={{ fontSize: '11px' }}>Order Placed</small>
                      <p className="mb-0 fw-medium text-dark">{new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                    </div>
                    <div>
                      <small className="text-muted text-uppercase fw-bold" style={{ fontSize: '11px' }}>Total Amount</small>
                      <p className="mb-0 fw-medium text-dark">₹{order.totalAmount?.toLocaleString()}</p>
                    </div>
                    <div>
                      <small className="text-muted text-uppercase fw-bold" style={{ fontSize: '11px' }}>Order ID</small>
                      <p className="mb-0 fw-medium text-muted">#{order._id.substring(order._id.length - 8).toUpperCase()}</p>
                    </div>
                  </div>
                  <div>
                    {getStatusBadge(order.orderStatus)}
                  </div>
                </div>

                <div className="card-body p-4">
                  <div className="row g-4 align-items-center">
                    <div className="col-md-9">
                      <div className="d-flex flex-column gap-3">
                        {order.items?.slice(0, 2).map((item, index) => (
                          <div key={index} className="d-flex gap-3 align-items-center">
                            <img 
                              src={item.image ? `http://localhost:5000/uploads/${item.image}` : 'https://via.placeholder.com/60x80'} 
                              alt="product" 
                              className="rounded-3 object-fit-cover border"
                              style={{ width: '60px', height: '80px' }}
                            />
                            <div>
                              <h6 className="fw-bold text-dark mb-1">{item.title || 'Custom Stitched Garment'}</h6>
                              <small className="text-muted d-block">Qty: {item.quantity}</small>
                            </div>
                          </div>
                        ))}
                        {order.items?.length > 2 && (
                          <p className="small fw-bold text-primary mb-0 ms-2">
                            + {order.items.length - 2} more item(s)
                          </p>
                        )}
                      </div>
                    </div>
                    
                    <div className="col-md-3 text-md-end mt-4 mt-md-0">
                      <button 
                        className="btn w-100 fw-bold rounded-pill text-white py-2 shadow-sm"
                        style={{ background: 'var(--purple)' }}
                        onClick={() => navigate('/my-order-stats', { state: { orderData: order } })}
                      >
                        Track Order <FiChevronRight/>
                      </button>
                    </div>
                  </div>
                </div>

              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default RecentOrders;