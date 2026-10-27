import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import instance from '../Utils/Middleware';
import { useCart } from '../Components/CartContext';

function Checkout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { cart, clearCart } = useCart();

  // Buy Now vazhiya vantha antha 1 product, illana Cart items
  const isBuyNow = location.state?.fromBuyNow || false;
  const [items, setItems] = useState(
    location.state?.checkoutItems || cart
  );

  // Step Controller    
  const [step, setStep] = useState(1);
  const [placingOrder, setPlacingOrder] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // 🚨 1. ADDRESS STATE 🚨
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState('');
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [newAddress, setNewAddress] = useState({ name: '', phone: '', street: '', city: '', state: '', pincode: '', type: 'Home' });

  // 🚨 2. MEASUREMENT STATE (User Manual Selection) 🚨
  const [measurements, setMeasurements] = useState([]);
  
  // User entha checkbox tick pandranga nu paakka
  const [needShirtMeas, setNeedShirtMeas] = useState(false);
  const [needPantMeas, setNeedPantMeas] = useState(false);
  
  // Thani thaniya ID save panna
  const [selectedShirtMeasId, setSelectedShirtMeasId] = useState('');
  const [selectedPantMeasId, setSelectedPantMeasId] = useState('');
  const [showMeasForm, setShowMeasForm] = useState(false);

  const handleNextStep = (nextStepNumber) => {
    
    // Pinnaadi pogumbothu (Back) validation thevayilla
    if (nextStepNumber > step) {
      
      // 🚨 STEP 1 TO STEP 2 VALIDATION 🚨
      if (nextStepNumber === 2) {
        if (!selectedAddressId) {
          alert("Please select or add a Delivery Address to continue!");
          return; 
        }
        
        // User ethume check pannala na error varum
        if (!needShirtMeas && !needPantMeas) {
          alert("Please select what you are stitching (Shirt or Pant or Both)!");
          return;
        }
        // Shirt tick panni irunthu, profile select pannala na error
        if (needShirtMeas && !selectedShirtMeasId) {
          alert("Please select a measurement profile for your Shirt/Top!");
          return;
        }
        // Pant tick panni irunthu, profile select pannala na error
        if (needPantMeas && !selectedPantMeasId) {
          alert("Please select a measurement profile for your Pant/Bottom!");
          return;
        }
      }

      // STEP 2 TO STEP 3 VALIDATION
      if (nextStepNumber === 3) {
        if (!paymentMethod) {
          alert("Please select a Payment Method!");
          return;
        }
        if (paymentMethod === 'UPI' && !upiId.trim()) {
          alert("Please enter your UPI ID!");
          return;
        }
      }
    }

    // ELLAM CORRECT-A IRUNTHA MATTUM SPINNER VARUM
    setIsTransitioning(true);
    setTimeout(() => {
      setStep(nextStepNumber);
      setIsTransitioning(false);
    }, 1000); 
  };

  // 🚨 3. REAL BACKEND API FETCHING 🚨
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // A. Measurement-a edukkurom
        const measRes = await instance.get('/user/measurement/me');
        if (measRes.data) {
          const measList = Array.isArray(measRes.data) ? measRes.data : [measRes.data];
          
          if (measList.length > 0) {
            setMeasurements(measList);
          } else {
            setShowMeasForm(true); 
          }
        }

        // B. Address-a edukkurom
        const userRes = await instance.get('/user/profile');
        const fetchedAddresses = userRes.data?.user?.addresses || userRes.data?.addresses || [];
        
        if (fetchedAddresses.length > 0) {
          setAddresses(fetchedAddresses);
          setSelectedAddressId(fetchedAddresses[0]._id || fetchedAddresses[0].id);
          setShowAddressForm(false);
        } else {
          setShowAddressForm(true); 
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        setShowAddressForm(true);
      }
    };

    fetchUserData();
  }, []);

  // --- 3. PAYMENT STATE ---
  const [paymentMethod, setPaymentMethod] = useState('UPI');
  const [upiId, setUpiId] = useState('');

  // ID check update
  const currentAddress = addresses.find(a => (a._id || a.id) === selectedAddressId);
  const currentShirtMeas = measurements.find(m => (m._id || m.id) === selectedShirtMeasId);
  const currentPantMeas = measurements.find(m => (m._id || m.id) === selectedPantMeasId);

  // Price Calculations
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const platformFee = items.length > 0 ? 49 : 0;
  const deliveryFee = subtotal > 1000 ? 0 : 60;
  const totalAmount = subtotal + platformFee + deliveryFee;

  // 🚨 PUDHU SAVE FUNCTION (Database-kooda connect aaguthu) 🚨
  const handleAddAddress = async (e) => {
    e.preventDefault();
    try {
      const res = await instance.post('/user/address/add', newAddress);
      const updatedAddresses = res.data.addresses;
      setAddresses(updatedAddresses);
      
      const newAddrId = updatedAddresses[updatedAddresses.length - 1]._id;
      setSelectedAddressId(newAddrId);
      
      setShowAddressForm(false);
      setNewAddress({ name: '', phone: '', street: '', city: '', state: '', pincode: '', type: 'Home' });
      alert("Address Saved to Profile!");
    } catch (error) {
      console.error(error);
      alert("Failed to save address permanently.");
    }
  };

  // Quantity Change inside Step 3 Review
  const updateItemQty = (id, delta) => {
    setItems(prev => prev.map(item => 
      item._id === id ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item
    ));
  };

  // 🚨 FINAL ORDER SUBMISSION 🚨
  const handlePlaceOrder = async () => {
    setPlacingOrder(true);

    // Merge measurements based on what user checked
    let mergedMeasurement = { 
        profileName: "",
        fitType: currentShirtMeas?.fitType || currentPantMeas?.fitType || "Regular Fit",
        height: currentShirtMeas?.height || currentPantMeas?.height || "" 
    };
    let title = [];

    if (needShirtMeas && currentShirtMeas) {
        title.push(`Shirt: ${currentShirtMeas.profileName}`);
        mergedMeasurement = {
            ...mergedMeasurement,
            neck: currentShirtMeas.neck, shoulder: currentShirtMeas.shoulder, chest: currentShirtMeas.chest, 
            waist: currentShirtMeas.waist, hip: currentShirtMeas.hip, sleeveLength: currentShirtMeas.sleeveLength, 
            armhole: currentShirtMeas.armhole, bicep: currentShirtMeas.bicep, wrist: currentShirtMeas.wrist, 
            shirtLength: currentShirtMeas.shirtLength
        };
    }
    
    if (needPantMeas && currentPantMeas) {
        title.push(`Pant: ${currentPantMeas.profileName}`);
        mergedMeasurement = {
            ...mergedMeasurement,
            pantWaist: currentPantMeas.pantWaist, pantHip: currentPantMeas.pantHip, thigh: currentPantMeas.thigh, 
            knee: currentPantMeas.knee, bottom: currentPantMeas.bottom, inseam: currentPantMeas.inseam, 
            outseam: currentPantMeas.outseam, rise: currentPantMeas.rise, pantLength: currentPantMeas.pantLength, 
            ankle: currentPantMeas.ankle
        };
    }
    
    mergedMeasurement.profileName = title.join(" | ");

    try {
      const res = await instance.post('/orders/create', {
        cartItems: items,
        totalAmount: totalAmount,
        shippingAddress: currentAddress,
        measurement: mergedMeasurement, // API ku merge panna data pohum
        paymentMethod: paymentMethod
      });

      if (res.status === 201) {
        if (!isBuyNow) {
          clearCart(); 
        }
        alert('🎉 Order Placed Successfully!');
        navigate('/my-order-stats');
      }
    } catch (error) {
      console.error('Order Error:', error);
      alert('Failed to place order. Please try again.');
    } finally {
      setPlacingOrder(false);
    }
  };

  if (!items || items.length === 0) {
    return (
      <div className="container py-5 text-center min-vh-100">
        <h3>No items selected for checkout.</h3>
        <Link to="/home" className="btn btn-dark mt-3">Back to Shop</Link>
      </div>
    );
  }

  return (
    <div className="bg-light min-vh-100 py-4">
      <div className="container">
        
        {/* Checkout Header (Amazon Style) */}
        <div className="d-flex justify-content-between align-items-center bg-white p-3 rounded-4 shadow-sm mb-4 border">
          <h4 className="fw-bold mb-0" style={{ color: 'var(--purple)' }}>
            <i className="bi bi-lock-fill me-2"></i>Secure Checkout
          </h4>
          <div className="d-flex align-items-center gap-2 small fw-semibold text-muted">
            <span className={step >= 1 ? "text-dark fw-bold" : ""}>1. Address & Fit</span>
            <i className="bi bi-chevron-right"></i>
            <span className={step >= 2 ? "text-dark fw-bold" : ""}>2. Payment</span>
            <i className="bi bi-chevron-right"></i>
            <span className={step === 3 ? "text-dark fw-bold" : ""}>3. Review & Place Order</span>
          </div>
        </div>

        <div className="row g-4">
          {/* ================= LEFT COLUMN (STEPS) ================= */}
          <div className="col-lg-8">

            {/* COMPACT SUMMARY CARD 1 (Visible in Step 2 & 3) */}
            {step > 1 && (
              <div className="card border-0 shadow-sm rounded-4 mb-3 bg-white">
                <div className="card-body p-3 px-4">
                  <div className="d-flex justify-content-between align-items-start">
                    <div className="row w-100">
                      <div className="col-md-6 mb-2 mb-md-0">
                        <div className="d-flex align-items-center gap-2 mb-1">
                          <span className="badge rounded-circle bg-success p-1"><i className="bi bi-check2"></i></span>
                          <h6 className="fw-bold mb-0 text-dark">Delivery Address</h6>
                        </div>
                        <div className="ps-4 small text-muted">
                          <strong className="text-dark">{currentAddress?.name}</strong> ({currentAddress?.type})<br />
                          {currentAddress?.street}, {currentAddress?.city}<br />
                          {currentAddress?.state} - {currentAddress?.pincode} | 📞 {currentAddress?.phone}
                        </div>
                      </div>

                      <div className="col-md-6 border-start-md">
                        <div className="d-flex align-items-center gap-2 mb-1">
                          <i className="bi bi-rulers text-primary"></i>
                          <h6 className="fw-bold mb-0 text-dark">Selected Profiles</h6>
                        </div>
                        <div className="ps-4 small text-muted">
                          {needShirtMeas && currentShirtMeas && (
                              <div className="mb-1"><strong>Shirt:</strong> {currentShirtMeas.profileName}</div>
                          )}
                          {needPantMeas && currentPantMeas && (
                              <div><strong>Pant:</strong> {currentPantMeas.profileName}</div>
                          )}
                        </div>
                      </div>
                    </div>

                    <button className="btn btn-sm btn-outline-secondary fw-semibold px-3 rounded-3 flex-shrink-0" onClick={() => handleNextStep(1)}>
                      Change
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* COMPACT SUMMARY CARD 2 (Visible in Step 3) */}
            {step > 2 && (
              <div className="card border-0 shadow-sm rounded-4 mb-3 bg-white">
                <div className="card-body p-3 px-4 d-flex justify-content-between align-items-center">
                  <div className="d-flex align-items-center gap-3">
                    <span className="badge rounded-circle bg-success p-1"><i className="bi bi-check2"></i></span>
                    <div>
                      <h6 className="fw-bold mb-0 text-dark">Payment Method</h6>
                      <span className="small text-muted">Paying via <strong className="text-dark">{paymentMethod}</strong> {upiId && `(${upiId})`}</span>
                    </div>
                  </div>
                  <button className="btn btn-sm btn-outline-secondary fw-semibold px-3 rounded-3" onClick={() => handleNextStep(2)}>
                    Change
                  </button>
                </div>
              </div>
            )}

            {/* ================= STEP 1 ACTIVE VIEW ================= */}
            {isTransitioning ? (
              <div className="card border-0 shadow-sm rounded-4 bg-white p-5 d-flex flex-column justify-content-center align-items-center" style={{ minHeight: '400px' }}>
                <div className="spinner-border" style={{ color: 'var(--purple)', width: '3rem', height: '3rem' }}></div>
                <h6 className="mt-3 fw-bold text-muted">Securely Loading...</h6>
              </div>
            ) : (
              <>
                {step === 1 && (
                <div className="card border-0 shadow-sm rounded-4 bg-white p-4">
                    
                    {/* Part A: Select Address */}
                    <h5 className="fw-bold text-dark mb-3">
                    Select a Delivery Address
                    </h5>

                    <div className="row g-3 mb-4">
                    {addresses.map((addr) => {
                        const addrId = addr._id || addr.id; 
                        const isSelected = selectedAddressId === addrId;
                        return (
                        <div className="col-md-6" key={addrId}>
                            <div 
                                className={`p-3 rounded-3 border h-100 ${isSelected ? 'border-2 bg-light' : ''}`}
                                style={{ borderColor: isSelected ? 'var(--purple)' : '#dee2e6', cursor: 'pointer' }}
                                onClick={() => setSelectedAddressId(addrId)}
                            >
                                <div className="d-flex justify-content-between align-items-center mb-2">
                                    <div className="form-check mb-0">
                                        <input 
                                            className="form-check-input" type="radio" name="deliveryAddress" 
                                            checked={isSelected} onChange={() => setSelectedAddressId(addrId)} style={{ cursor: 'pointer' }}
                                        />
                                        <label className="form-check-label fw-bold text-dark ms-1" style={{ cursor: 'pointer' }}>{addr.name}</label>
                                    </div>
                                    <span className="badge bg-secondary-subtle text-dark">{addr.type}</span>
                                </div>
                                <p className="small text-muted mb-1 ps-4">{addr.street}, {addr.city}</p>
                                <p className="small text-muted mb-1 ps-4">{addr.state} - {addr.pincode}</p>
                                <p className="small text-dark fw-medium mb-0 ps-4">📞 {addr.phone}</p>
                            </div>
                        </div>
                        )
                    })}
                    </div>

                    {!showAddressForm ? (
                    <button className="btn btn-sm btn-outline-dark mb-4 align-self-start" onClick={() => setShowAddressForm(true)}>
                        <i className="bi bi-plus-lg me-1"></i> Add a New Address
                    </button>
                    ) : (
                    <form onSubmit={handleAddAddress} className="bg-light p-3 rounded-3 border mb-4">
                        <h6 className="fw-bold mb-3">Add New Delivery Address</h6>
                        <div className="row g-2">
                        <div className="col-md-6"><input className="form-control form-control-sm" placeholder="Full Name" required value={newAddress.name} onChange={e => setNewAddress({...newAddress, name: e.target.value})} /></div>
                        <div className="col-md-6"><input className="form-control form-control-sm" placeholder="Phone Number" required value={newAddress.phone} onChange={e => setNewAddress({...newAddress, phone: e.target.value})} /></div>
                        <div className="col-12"><input className="form-control form-control-sm" placeholder="Street / House No." required value={newAddress.street} onChange={e => setNewAddress({...newAddress, street: e.target.value})} /></div>
                        <div className="col-md-4"><input className="form-control form-control-sm" placeholder="City" required value={newAddress.city} onChange={e => setNewAddress({...newAddress, city: e.target.value})} /></div>
                        <div className="col-md-4"><input className="form-control form-control-sm" placeholder="State" required value={newAddress.state} onChange={e => setNewAddress({...newAddress, state: e.target.value})} /></div>
                        <div className="col-md-4"><input className="form-control form-control-sm" placeholder="Pincode" required value={newAddress.pincode} onChange={e => setNewAddress({...newAddress, pincode: e.target.value})} /></div>
                        </div>
                        <div className="mt-3 d-flex gap-2">
                        <button type="submit" className="btn btn-sm text-white" style={{ background: 'var(--purple)' }}>Save Address</button>
                        <button type="button" className="btn btn-sm btn-secondary" onClick={() => setShowAddressForm(false)}>Cancel</button>
                        </div>
                    </form>
                    )}

                    <hr className="my-3" />

                    {/* Part B: Manual Checkbox for Measurements */}
                    <h5 className="fw-bold text-dark mb-3 mt-2">
                        What are you stitching in this order?
                    </h5>

                    {/* 🚨 BUG FIX: User innum Measurement Profile create pannala na intha box kaattum 🚨 */}
                    {measurements.length === 0 && (
                        <div className="alert alert-warning d-flex justify-content-between align-items-center rounded-3 mb-4">
                            <div>
                                <strong>No Measurement Profiles Found!</strong>
                                <p className="small mb-0">Please create a manual or AI measurement profile first.</p>
                            </div>
                            <Link to="/measurement" className="btn btn-sm btn-dark fw-semibold px-3">
                                + Add Measurement
                            </Link>
                        </div>
                    )}

                    <div className="d-flex flex-wrap gap-4 mb-4 p-3 rounded-3" style={{ backgroundColor: '#f8f9fe', border: '1px solid #e0e7ff' }}>
                        <div className="form-check">
                            <input 
                                className="form-check-input" type="checkbox" id="checkShirt" style={{ cursor: 'pointer' }}
                                checked={needShirtMeas} onChange={(e) => setNeedShirtMeas(e.target.checked)} 
                            />
                            <label className="form-check-label fw-bold text-dark" htmlFor="checkShirt" style={{ cursor: 'pointer' }}>
                                👕 Shirt / Top
                            </label>
                        </div>
                        <div className="form-check">
                            <input 
                                className="form-check-input" type="checkbox" id="checkPant" style={{ cursor: 'pointer' }}
                                checked={needPantMeas} onChange={(e) => setNeedPantMeas(e.target.checked)} 
                            />
                            <label className="form-check-label fw-bold text-dark" htmlFor="checkPant" style={{ cursor: 'pointer' }}>
                                👖 Pant / Bottom
                            </label>
                        </div>
                    </div>

                    {/* 🚨 SHIRT PROFILE SELECTOR 🚨 */}
                    {needShirtMeas && (
                        <div className="mb-4 ps-3 border-start border-3" style={{ borderColor: 'var(--purple)' }}>
                            <h6 className="fw-bold text-dark mb-2">Select Shirt Measurement Profile:</h6>
                            <div className="d-flex gap-2 overflow-auto pb-2 custom-scrollbar">
                                {measurements.map((meas) => {
                                    const measId = meas._id || meas.id;
                                    return (
                                    <button 
                                        key={`shirt-${measId}`}
                                        className={`btn rounded-pill px-4 fw-medium text-nowrap border ${selectedShirtMeasId === measId ? 'btn-dark' : 'btn-light'}`}
                                        onClick={() => setSelectedShirtMeasId(measId)}
                                    >
                                        {meas.profileName}
                                    </button>
                                    )
                                })}
                            </div>
                        </div>
                    )}

                    {/* 🚨 PANT PROFILE SELECTOR 🚨 */}
                    {needPantMeas && (
                        <div className="mb-4 ps-3 border-start border-3 border-info">
                            <h6 className="fw-bold text-dark mb-2">Select Pant Measurement Profile:</h6>
                            <div className="d-flex gap-2 overflow-auto pb-2 custom-scrollbar">
                                {measurements.map((meas) => {
                                    const measId = meas._id || meas.id;
                                    return (
                                    <button 
                                        key={`pant-${measId}`}
                                        className={`btn rounded-pill px-4 fw-medium text-nowrap border ${selectedPantMeasId === measId ? 'btn-dark' : 'btn-light'}`}
                                        onClick={() => setSelectedPantMeasId(measId)}
                                    >
                                        {meas.profileName}
                                    </button>
                                    )
                                })}
                            </div>
                        </div>
                    )}

                    {/* Navigation Button */}
                    <button 
                        className="btn py-2 px-4 text-white fw-bold rounded-3 align-self-start mt-3"
                        style={{ background: 'var(--purple)' }}
                        onClick={() => handleNextStep(2)}
                    >
                    Use this Address & Measurement <i className="bi bi-arrow-right ms-1"></i>
                    </button>
                </div>
                )}

                {/* ================= STEP 2 ACTIVE VIEW ================= */}
                {step === 2 && (
                <div className="card border-0 shadow-sm rounded-4 bg-white p-4">
                    <h5 className="fw-bold text-dark mb-4">
                    Select a Payment Method
                    </h5>

                    <div className="d-flex flex-column gap-3 mb-4">
                    <div 
                        className={`p-3 rounded-3 border ${paymentMethod === 'UPI' ? 'border-2 bg-light' : ''}`}
                        style={{ borderColor: paymentMethod === 'UPI' ? 'var(--purple)' : '#dee2e6', cursor: 'pointer' }}
                        onClick={() => setPaymentMethod('UPI')}
                    >
                        <div className="form-check">
                        <input className="form-check-input" type="radio" checked={paymentMethod === 'UPI'} onChange={() => setPaymentMethod('UPI')} />
                        <label className="form-check-label fw-bold text-dark">UPI (GPay, PhonePe, Paytm)</label>
                        </div>
                        {paymentMethod === 'UPI' && (
                        <div className="ps-4 mt-2" style={{ maxWidth: '320px' }}>
                            <input 
                            type="text" className="form-control form-control-sm" placeholder="Enter UPI ID (e.g. balu@okaxis)"
                            value={upiId} onChange={(e) => setUpiId(e.target.value)}
                            />
                        </div>
                        )}
                    </div>

                    <div 
                        className={`p-3 rounded-3 border ${paymentMethod === 'Credit / Debit Card' ? 'border-2 bg-light' : ''}`}
                        style={{ borderColor: paymentMethod === 'Credit / Debit Card' ? 'var(--purple)' : '#dee2e6', cursor: 'pointer' }}
                        onClick={() => setPaymentMethod('Credit / Debit Card')}
                    >
                        <div className="form-check">
                        <input className="form-check-input" type="radio" checked={paymentMethod === 'Credit / Debit Card'} onChange={() => setPaymentMethod('Credit / Debit Card')} />
                        <label className="form-check-label fw-bold text-dark">Credit or Debit Card</label>
                        </div>
                    </div>

                    <div 
                        className={`p-3 rounded-3 border ${paymentMethod === 'Net Banking' ? 'border-2 bg-light' : ''}`}
                        style={{ borderColor: paymentMethod === 'Net Banking' ? 'var(--purple)' : '#dee2e6', cursor: 'pointer' }}
                        onClick={() => setPaymentMethod('Net Banking')}
                    >
                        <div className="form-check">
                        <input className="form-check-input" type="radio" checked={paymentMethod === 'Net Banking'} onChange={() => setPaymentMethod('Net Banking')} />
                        <label className="form-check-label fw-bold text-dark">Net Banking</label>
                        </div>
                    </div>

                    <div 
                        className={`p-3 rounded-3 border ${paymentMethod === 'Cash on Delivery (COD)' ? 'border-2 bg-light' : ''}`}
                        style={{ borderColor: paymentMethod === 'Cash on Delivery (COD)' ? 'var(--purple)' : '#dee2e6', cursor: 'pointer' }}
                        onClick={() => setPaymentMethod('Cash on Delivery (COD)')}
                    >
                        <div className="form-check">
                        <input className="form-check-input" type="radio" checked={paymentMethod === 'Cash on Delivery (COD)'} onChange={() => setPaymentMethod('Cash on Delivery (COD)')} />
                        <label className="form-check-label fw-bold text-dark">Cash on Delivery / Pay on Delivery</label>
                        <p className="small text-muted mb-0">Cash, UPI and Cards accepted on delivery.</p>
                        </div>
                    </div>
                    </div>

                    <button 
                    className="btn py-2 px-4 text-white fw-bold rounded-3 align-self-start"
                    style={{ background: 'var(--purple)' }}
                    onClick={() => handleNextStep(3)}
                    >
                    Use this payment method <i className="bi bi-arrow-right ms-1"></i>
                    </button>
                </div>
                )}

                {/* ================= STEP 3 ACTIVE VIEW ================= */}
                {step === 3 && (
                <div className="card border-0 shadow-sm rounded-4 bg-white p-4">
                    <h5 className="fw-bold text-dark mb-3">
                    Review items and stitching delivery
                    </h5>

                    <div className="p-3 rounded-3 bg-success-subtle border border-success-subtle mb-4">
                    <h6 className="fw-bold text-success mb-1">
                        <i className="bi bi-box-seam me-2"></i>
                        Estimated Tailoring & Delivery: 4 - 5 Working Days
                    </h6>
                    <p className="small text-muted mb-0">
                        Your garment will be custom-stitched based on your selected measurement profiles.
                    </p>
                    </div>

                    <div className="d-flex flex-column gap-3 mb-4">
                    {items.map((item) => (
                        <div key={item._id} className="d-flex gap-3 p-3 border rounded-3 align-items-center">
                        <img 
                            src={item.image ? `http://localhost:5000/uploads/${item.image}` : 'https://via.placeholder.com/90x110'} 
                            alt={item.title}
                            className="rounded-3 object-fit-cover border"
                            style={{ width: '85px', height: '105px' }}
                        />
                        <div className="flex-grow-1">
                            <h6 className="fw-bold text-dark mb-1">{item.title}</h6>
                            <p className="small text-muted mb-1">
                            Category: {item.category || 'Custom'} | Fabric: {item.fabric || item.material || 'Premium Cotton'}
                            </p>
                            <h6 className="fw-bold text-danger mb-2">₹{item.price.toLocaleString()}</h6>

                            <div className="d-flex align-items-center gap-2">
                            <span className="small text-muted">Qty:</span>
                            <button className="btn btn-sm btn-outline-secondary py-0 px-2" onClick={() => updateItemQty(item._id, -1)}>-</button>
                            <span className="fw-bold small px-1">{item.quantity}</span>
                            <button className="btn btn-sm btn-outline-secondary py-0 px-2" onClick={() => updateItemQty(item._id, 1)}>+</button>
                            </div>
                        </div>
                        </div>
                    ))}
                    </div>

                    <div className="p-3 bg-light rounded-3 border d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-3">
                    <div>
                        <h5 className="fw-bold text-danger mb-0">Order Total: ₹{totalAmount.toLocaleString()}</h5>
                        <p className="small text-muted mb-0">By placing your order, you agree to StitchSite's tailoring terms.</p>
                    </div>
                    <button 
                        className="btn py-3 px-5 text-white fw-bold rounded-3 shadow-sm d-flex align-items-center justify-content-center gap-2"                        style={{ background: 'var(--purple)' }}
                        disabled={placingOrder}
                        onClick={handlePlaceOrder}
                    >
                        {placingOrder ? (
                            <>
                                <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                Placing Your Order...
                            </>
                        ) : (
                            'Place Your Order'
                        )}
                    </button>
                    </div>
                </div>
                )}
              </>
            )}

          </div>

          {/* ================= RIGHT COLUMN (STICKY ORDER SUMMARY) ================= */}
          <div className="col-lg-4">
            <div className="card border-0 shadow-sm rounded-4 bg-white p-4 position-sticky" style={{ top: '100px' }}>
              
              {step === 1 && (
                <button className="btn w-100 py-2 text-white fw-bold rounded-3 mb-3" style={{ background: 'var(--purple)' }} onClick={() => handleNextStep(2)}>
                  Use this Address & Fit
                </button>
              )}
              {step === 2 && (
                <button className="btn w-100 py-2 text-white fw-bold rounded-3 mb-3" style={{ background: 'var(--purple)' }} onClick={() => handleNextStep(3)}>
                  Use this Payment Method
                </button>
              )}
              {step === 3 && (
                <button 
                    className="btn w-100 py-3 text-white fw-bold rounded-3 mb-3 shadow-sm d-flex align-items-center justify-content-center gap-2" 
                    style={{ background: 'var(--purple)' }} 
                    disabled={placingOrder} 
                    onClick={handlePlaceOrder}
                >
                  {placingOrder ? (
                      <>
                          <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                          Processing Order...
                      </>
                  ) : (
                      'Place Your Order'
                  )}
                </button>
              )}

              <h6 className="fw-bold text-dark border-bottom pb-2 mb-3">Order Summary</h6>

              <div className="d-flex justify-content-between small mb-2">
                <span className="text-muted">Items ({items.reduce((s, i) => s + i.quantity, 0)}):</span>
                <span className="fw-medium">₹{subtotal.toLocaleString()}</span>
              </div>
              <div className="d-flex justify-content-between small mb-2">
                <span className="text-muted">Platform & Stitching Fee:</span>
                <span className="fw-medium">₹{platformFee}</span>
              </div>
              <div className="d-flex justify-content-between small mb-3 pb-2 border-bottom">
                <span className="text-muted">Delivery:</span>
                <span className="fw-medium text-success">{deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}</span>
              </div>

              <div className="d-flex justify-content-between align-items-center mb-2">
                <span className="fs-5 fw-bold text-danger">Order Total:</span>
                <span className="fs-5 fw-bold text-danger">₹{totalAmount.toLocaleString()}</span>
              </div>
              
              <div className="bg-light p-2 rounded-2 text-center small text-muted mt-2">
                <i className="bi bi-shield-lock-fill text-success me-1"></i> 100% Fit & Quality Protection
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Checkout;