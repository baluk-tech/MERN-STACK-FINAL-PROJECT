import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { FaStar, FaRegStar, FaArrowLeft, FaTruck, FaShieldAlt } from 'react-icons/fa';
import instance from '../Utils/Middleware';
import { useCart } from '../Components/CartContext';

function ProductView() {
  const { id } = useParams(); // URL-la irunthu Product ID edukkurom
  const navigate = useNavigate();
  const { addToCart } = useCart();
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        // Backend-la intha single product-a thedi edukkurom
        const res = await instance.get(`/products/${id}`);
        setProduct(res.data.product || res.data);
      } catch (err) {
        setError("Failed to load product details.");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="vh-100 d-flex justify-content-center align-items-center">
        <div className="spinner-border" style={{ color: 'var(--purple)' }}></div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container py-5 text-center min-vh-100">
        <h3 className="text-danger">{error || "Product not found!"}</h3>
        <button className="btn btn-outline-dark mt-3" onClick={() => navigate(-1)}>Go Back</button>
      </div>
    );
  }

  return (
    <div className="container py-5 min-vh-100">
      {/* Back Button */}
      <button className="btn btn-link text-decoration-none text-dark p-0 mb-4 d-flex align-items-center gap-2" onClick={() => navigate(-1)}>
        <FaArrowLeft /> Back to Collection
      </button>

      <div className="row g-5">
        {/* Left Column: Product Image */}
        <div className="col-md-6">
          <div className="bg-light rounded-4 overflow-hidden shadow-sm d-flex justify-content-center align-items-center" style={{ minHeight: '500px' }}>
            <img 
              src={product.image ? `http://localhost:5000/uploads/${product.image}` : 'https://via.placeholder.com/500x600?text=No+Image'} 
              alt={product.title} 
              className="img-fluid w-100 h-100 object-fit-cover"
            />
          </div>
        </div>

        {/* Right Column: Product Details */}
        <div className="col-md-6">
          <span className="badge bg-primary-subtle text-primary rounded-pill px-3 py-2 mb-3">
            {product.category || "General"}
          </span>
          <h2 className="fw-bold text-dark mb-2">{product.title}</h2>
          
          <div className="d-flex align-items-center text-warning mb-4">
            <FaStar /> <FaStar /> <FaStar /> <FaStar /> <FaRegStar /> 
            <span className="text-muted ms-2 small">(4.0 / 5 based on reviews)</span>
          </div>

          <div className="mb-4">
            <h3 className="fw-bold text-dark mb-0">₹{product.price?.toLocaleString()}</h3>
            <p className="text-muted small">Inclusive of all taxes</p>
          </div>

          <p className="text-muted mb-4" style={{ lineHeight: '1.8' }}>
            {product.description || "Experience the perfect blend of comfort and style with this premium design. Tailored to perfection, it ensures a flawless fit for any occasion."}
          </p>

          <div className="row g-3 mb-4">
            <div className="col-6">
              <div className="border rounded-3 p-3 bg-white">
                <span className="d-block text-muted small mb-1">Fabric Material</span>
                <span className="fw-semibold text-dark">{product.fabric || product.material || "Premium Cotton"}</span>
              </div>
            </div>
            <div className="col-6">
              <div className="border rounded-3 p-3 bg-white">
                <span className="d-block text-muted small mb-1">Stitching Time</span>
                <span className="fw-semibold text-dark">3 - 5 Days</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="d-flex gap-3 mb-5">
            <button 
              className="btn flex-grow-1 py-3 fw-bold rounded-3 shadow-sm"
              style={{ color: 'var(--purple)', border: '2px solid var(--purple)', backgroundColor: 'white' }}
              onClick={() => {
                addToCart(product);
                alert(`${product.title} added to cart!`);
              }}
            >
              <i className="bi bi-cart-plus me-2"></i> Add to Cart
            </button>
            
            <button
              className='btn flex-grow-1 py-3 text-white fw-bold rounded-3 shadow-sm'
              style={{ background: 'var(--purple)' }}
              onClick={() => {
                navigate('/checkout', {
                  state: {
                    checkoutItems: [{ ...product, quantity: 1 }],
                  }
                });
              }}
            >
              <i className='bi bi-lightning-charge-fill me-2'></i> Buy Now
            </button>
          </div>

          {/* Value Props */}
          <div className="d-flex flex-column gap-3 pt-4 border-top">
            <div className="d-flex align-items-center gap-3 text-muted">
              <FaTruck className="fs-5 text-primary" />
              <span>Free delivery on orders above ₹1000</span>
            </div>
            <div className="d-flex align-items-center gap-3 text-muted">
              <FaShieldAlt className="fs-5 text-success" />
              <span>100% Quality Guarantee & Perfect Fit</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductView;