import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../Components/CartContext';

function Cart() {
  const { cart, removeFromCart, updateQuantity, getCartTotal, clearCart } = useCart();
  const navigate = useNavigate();

  // Price calculations
  const subtotal = getCartTotal();
  const platformFee = cart.length > 0 ? 49 : 0; 
  const total = subtotal + platformFee;

  const handleCheckout = () => {
    alert(`Order Placed Successfully! Total: ₹${total.toLocaleString()}`);
    clearCart();
    navigate('/dashboard'); // Order panna piragu dashboard-ku anuppidrom
  };

  // --- EMPTY CART UI ---
  if (cart.length === 0) {
    return (
      <div className="container min-vh-100 d-flex flex-column align-items-center justify-content-center py-5">
        <div className="text-center bg-white p-5 rounded-4 shadow-sm border" style={{ maxWidth: '500px', width: '100%' }}>
          <div className="mb-4 d-flex justify-content-center">
            <div className="rounded-circle d-flex align-items-center justify-content-center" style={{ width: '100px', height: '100px', background: 'var(--lavender-bg)', color: 'var(--purple)' }}>
              <i className="bi bi-cart-x fs-1"></i>
            </div>
          </div>
          <h3 className="fw-bold text-dark mb-2">Your Cart is Empty!</h3>
          <p className="text-muted mb-4">Looks like you haven't added any designs to your cart yet.</p>
          <Link to="/home" className="btn px-4 py-2 text-white fw-bold rounded-3" style={{ background: 'var(--purple)' }}>
            Start Shopping
          </Link>
        </div>
      </div>
    );
  }

  // --- CART WITH ITEMS UI ---
  return (
    <div className="container py-5 min-vh-100">
      <h2 className="fw-bold mb-4 text-dark d-flex align-items-center gap-2">
        Shopping Cart <span className="badge bg-primary-subtle text-primary rounded-pill fs-6">{cart.length}</span>
      </h2>

      <div className="row g-4">
        {/* LEFT COLUMN: Cart Items */}
        <div className="col-lg-8">
          <div className="card border-0 shadow-sm rounded-4 bg-white overflow-hidden">
            <div className="card-header bg-white border-bottom py-3 px-4">
              <h6 className="fw-bold mb-0 text-dark">Cart Items</h6>
            </div>
            <div className="card-body p-0">
              <ul className="list-group list-group-flush">
                {cart.map((item) => (
                  <li key={item._id} className="list-group-item p-4 border-bottom">
                    <div className="d-flex flex-column flex-sm-row gap-4 align-items-sm-center">
                      
                      {/* 🚨 CHANGED: Image-a Link panni wrap panniyachu 🚨 */}
                      <Link to={`/product/${item._id}`} className="flex-shrink-0" style={{ width: '100px', height: '120px' }}>
                        <img 
                          src={item.image ? `http://localhost:5000/uploads/${item.image}` : 'https://via.placeholder.com/100x120?text=Image'} 
                          alt={item.title} 
                          className="w-100 h-100 object-fit-cover rounded-3 border"
                          style={{ transition: '0.3s', cursor: 'pointer' }}
                          onMouseOver={(e) => e.target.style.opacity = '0.8'}
                          onMouseOut={(e) => e.target.style.opacity = '1'}
                        />
                      </Link>

                      {/* Product Details */}
                      <div className="flex-grow-1">
                        <div className="d-flex justify-content-between align-items-start mb-1">
                          
                          {/* 🚨 CHANGED: Title-aiyum Link panni wrap panniyachu 🚨 */}
                          <Link to={`/product/${item._id}`} className="text-decoration-none">
                            <h5 className="fw-bold text-dark mb-0 hover-purple">{item.title}</h5>
                          </Link>

                          <button 
                            className="btn btn-sm text-danger p-0 border-0" 
                            onClick={() => removeFromCart(item._id)}
                            title="Remove item"
                          >
                            <i className="bi bi-trash3 fs-5"></i>
                          </button>
                        </div>
                        <p className="text-muted small mb-2">{item.category} • {item.fabric || item.material}</p>
                        <h5 className="fw-bold text-dark mb-3">₹{item.price.toLocaleString()}</h5>

                        {/* Quantity Controls */}
                        <div className="d-flex align-items-center gap-3">
                          <span className="small fw-semibold text-muted">Quantity:</span>
                          <div className="d-flex align-items-center border rounded-2" style={{ background: '#f8f9fa' }}>
                            <button 
                              className="btn btn-sm border-0 px-2" 
                              onClick={() => updateQuantity(item._id, item.quantity - 1)}
                              disabled={item.quantity <= 1}
                            >
                              <i className="bi bi-dash"></i>
                            </button>
                            <span className="fw-bold px-3">{item.quantity}</span>
                            <button 
                              className="btn btn-sm border-0 px-2" 
                              onClick={() => updateQuantity(item._id, item.quantity + 1)}
                            >
                              <i className="bi bi-plus"></i>
                            </button>
                          </div>
                        </div>

                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Order Summary */}
        <div className="col-lg-4">
          <div className="card border-0 shadow-sm rounded-4 bg-white position-sticky" style={{ top: '100px' }}>
            <div className="card-header bg-white border-bottom py-3 px-4">
              <h6 className="fw-bold mb-0 text-dark">Order Summary</h6>
            </div>
            <div className="card-body p-4">
              
              <div className="d-flex justify-content-between mb-3">
                <span className="text-muted fw-medium">Subtotal ({cart.length} items)</span>
                <span className="fw-bold text-dark">₹{subtotal.toLocaleString()}</span>
              </div>
              
              <div className="d-flex justify-content-between mb-3">
                <span className="text-muted fw-medium">Platform Fee</span>
                <span className="fw-bold text-dark">₹{platformFee}</span>
              </div>
              
              <div className="d-flex justify-content-between mb-4 pb-3 border-bottom">
                <span className="text-muted fw-medium">Delivery Charges</span>
                <span className="fw-bold text-success">Free</span>
              </div>

              <div className="d-flex justify-content-between mb-4">
                <span className="fs-5 fw-bold text-dark">Total Amount</span>
                <span className="fs-5 fw-bold text-dark">₹{total.toLocaleString()}</span>
              </div>

              {/* Proceed to Checkout Button */}
              <button 
                className="btn w-100 py-3 text-white fw-bold rounded-3 shadow-sm mt-4"
                style={{ background: 'var(--purple)', transition: 'all 0.3s ease' }}
                disabled={cart.length === 0}
                onClick={() => {
                  // 🚨 PUDHU LOGIC: Direct-a Checkout page-ku anuppurom!
                  navigate('/checkout'); 
                }}
              >
                Proceed to Checkout <i className="bi bi-arrow-right ms-2"></i>
              </button>
              
              <div className="d-flex align-items-center justify-content-center gap-2 text-muted small">
                <i className="bi bi-shield-check text-success fs-5"></i>
                <span>Safe and Secure Payments</span>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Cart;