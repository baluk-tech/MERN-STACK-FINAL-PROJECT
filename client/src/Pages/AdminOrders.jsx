import React, { useState, useEffect } from 'react';
import instance from '../Utils/Middleware';

function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const fetchAllOrders = async () => {
    try {
      const res = await instance.get('/orders/admin/all-orders');
      setOrders(res.data.orders || res.data || []);
    } catch (error) {
      console.error("Error fetching admin orders:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllOrders();
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await instance.put(`/orders/admin/status/${orderId}`, { orderStatus: newStatus });
      alert("Order status updated successfully!");
      fetchAllOrders();
    } catch (error) {
      console.error("Failed to update status:", error);
      alert("Failed to update order status.");
    }
  };

  // 🚨 PUTHUSA ADD PANNATHU: Date & Time Formatter Helper 🚨
  const formatDateTime = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleString('en-IN', {
      day: 'numeric', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit', hour12: true
    });
  };

  return (
    <div className="bg-white rounded-4 shadow-sm p-4 p-md-5 border-0">
        
      <div className="d-flex justify-content-between align-items-center mb-4 pb-3 border-bottom">
        <div>
          <h2 className="fw-bold mb-1 text-dark">Orders Management</h2>
          <p className="text-muted mb-0">View customer measurements, dates, and update tracking status.</p>
        </div>
        <span className="badge bg-purple-subtle text-purple border px-4 py-2 rounded-pill fs-6" style={{ color: 'var(--purple)', borderColor: 'var(--purple)' }}>
          Total: {orders.length} Orders
        </span>
      </div>

      {loading ? (
        <div className="text-center py-5 my-5">
          <div className="spinner-border text-primary" role="status"></div>
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-5 my-5 bg-light rounded-4">
          <h4 className="text-muted">No orders received yet.</h4>
        </div>
      ) : (
        <div className="table-responsive rounded-4 border">
          <table className="table table-hover align-middle mb-0">
            <thead className="bg-light">
              <tr>
                <th className="py-3 px-4 text-muted fw-bold">Order ID & Date</th>
                <th className="py-3 px-3 text-muted fw-bold">Customer</th>
                <th className="py-3 px-3 text-muted fw-bold">Items & Fit</th>
                <th className="py-3 px-3 text-muted fw-bold">Amount</th>
                <th className="py-3 px-3 text-muted fw-bold">Status & Update Time</th>
                <th className="py-3 px-4 text-end text-muted fw-bold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id}>
                  {/* ORDER ID & DATE */}
                  <td className="py-3 px-4">
                    <span className="fw-bold text-primary d-block fs-6">
                      #{order._id.substring(order._id.length - 6).toUpperCase()}
                    </span>
                    <small className="text-muted fw-medium d-block mt-1" style={{ fontSize: '0.8rem' }}>
                      <i className="bi bi-calendar2-check me-1"></i>
                      {formatDateTime(order.createdAt)}
                    </small>
                  </td>

                  {/* CUSTOMER DETAILS */}
                  <td className="py-3 px-3">
                    <span className="fw-bold text-dark d-block">{order.shippingAddress?.name || 'Customer'}</span>
                    <small className="text-muted"><i className="bi bi-telephone-fill me-1"></i> {order.shippingAddress?.phone}</small>
                  </td>

                  {/* ITEMS & FIT */}
                  <td className="py-3 px-3">
                    <span className="fw-semibold text-dark d-block">{order.items?.[0]?.title || 'Custom Garment'}</span>
                    <span className="badge bg-light text-dark border mt-1">Profile: {order.measurement?.profileName || 'Standard'}</span>
                  </td>

                  {/* AMOUNT */}
                  <td className="py-3 px-3 fw-bold text-dark fs-6">₹{order.totalAmount?.toLocaleString()}</td>

                  {/* STATUS & UPDATE TIME */}
                  <td className="py-3 px-3">
                    <div className="d-flex flex-column gap-2 align-items-start">
                      <div className="d-flex align-items-center gap-2">
                        <span className={`badge rounded-pill px-3 py-2 fw-bold border ${
                          order.orderStatus === 'Pending' ? 'bg-warning-subtle text-warning border-warning-subtle' :
                          order.orderStatus === 'Processing' ? 'bg-primary-subtle text-primary border-primary-subtle' :
                          order.orderStatus === 'Dispatched' ? 'bg-info-subtle text-info border-info-subtle' :
                          order.orderStatus === 'Delivered' ? 'bg-success-subtle text-success border-success-subtle' :
                          'bg-danger-subtle text-danger border-danger-subtle'
                        }`}>
                          {order.orderStatus === 'Processing' ? 'Stitching' : order.orderStatus}
                        </span>

                        <select 
                          className="form-select form-select-sm fw-semibold shadow-sm"
                          style={{ width: '130px', cursor: 'pointer', backgroundColor: '#f8f9fa', borderColor: '#e9ecef' }}
                          value={order.orderStatus}
                          onChange={(e) => handleStatusChange(order._id, e.target.value)}
                        >
                          <option value="Pending">Pending</option>
                          <option value="Processing">Stitching</option>
                          <option value="Dispatched">Dispatched</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </div>
                      <small className="text-secondary fw-semibold" style={{ fontSize: '0.75rem' }}>
                        <i className="bi bi-clock-history me-1"></i>
                        Updated: {formatDateTime(order.updatedAt || order.createdAt)}
                      </small>
                    </div>
                  </td>

                  {/* ACTIONS */}
                  <td className="py-3 px-4 text-end">
                    <button 
                      className="btn btn-sm text-white fw-semibold rounded-pill px-3 shadow-sm"
                      style={{ background: 'var(--purple)' }}
                      onClick={() => setSelectedOrder(order)}
                    >
                      Measurements
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* --- MEASUREMENTS POPUP MODAL FIXED --- */}
      {selectedOrder && (
        <div className="modal-backdrop-custom" style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.6)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1050 }}>
          <div className="bg-white rounded-4 shadow-lg p-4 p-md-5" style={{ width: '90%', maxWidth: '650px', maxHeight: '85vh', overflowY: 'auto' }}>
            
            <div className="d-flex justify-content-between align-items-center mb-4 pb-3 border-bottom">
              <h4 className="fw-bold mb-0 text-dark d-flex align-items-center gap-2">
                <i className="bi bi-rulers text-primary"></i> Customer Measurements
              </h4>
              <button className="btn-close fs-5" onClick={() => setSelectedOrder(null)}></button>
            </div>

            <div className="row g-3 mb-4 bg-light p-3 rounded-4 border border-light-subtle">
              <div className="col-sm-6">
                <p className="mb-1 text-muted small text-uppercase fw-bold">Customer Name</p>
                <h6 className="fw-bold text-dark mb-0">{selectedOrder.shippingAddress?.name || 'N/A'}</h6>
              </div>
              <div className="col-sm-6">
                <p className="mb-1 text-muted small text-uppercase fw-bold">Phone Number</p>
                <h6 className="fw-bold text-dark mb-0">{selectedOrder.shippingAddress?.phone || 'N/A'}</h6>
              </div>
              <div className="col-sm-6">
                <p className="mb-1 text-muted small text-uppercase fw-bold">Profile Name</p>
                <h6 className="fw-bold text-dark mb-0">{selectedOrder.measurement?.profileName || 'Standard Profile'}</h6>
              </div>
              <div className="col-sm-6">
                <p className="mb-1 text-muted small text-uppercase fw-bold">Fit Type</p>
                <h6 className="fw-bold text-dark mb-0">
                  <span className="badge bg-primary-subtle text-primary border border-primary-subtle">
                    {selectedOrder.measurement?.fitType || 'Regular Fit'}
                  </span>
                </h6>
              </div>
            </div>

            <h6 className="fw-bold mt-4 mb-3" style={{ color: 'var(--purple)' }}>Tailoring Specifications (Inches) :</h6>
            
            <div className="row g-3">
              {selectedOrder.measurement ? (
                Object.entries(selectedOrder.measurement).map(([key, val]) => {
                  if (['profileName', 'fitType', 'height', '_id', '__v'].includes(key)) return null;
                  if (!val || val === 'undefined' || val === 'null' || val === '') return null;
                  
                  return (
                    <div className="col-sm-3 col-6" key={key}>
                      <div className="p-3 border rounded-4 text-center bg-white shadow-sm h-100 d-flex flex-column justify-content-center align-items-center transition-hover">
                        <span className="d-block text-capitalize text-muted small fw-bold mb-1">{key}</span> 
                        <span className="fs-4 fw-bold text-dark">{val}"</span>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="col-12 text-center py-4 bg-light rounded-4">
                  <p className="text-muted fw-bold mb-0">No measurements provided for this order.</p>
                </div>
              )}
            </div>

            <div className="mt-5 text-end border-top pt-3">
              <button className="btn text-white px-5 py-2 fw-bold rounded-pill shadow-sm" style={{ background: 'var(--purple)' }} onClick={() => setSelectedOrder(null)}>
                Done
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default AdminOrders;