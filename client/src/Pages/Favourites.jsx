import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiTrash2, FiShoppingCart, FiHeart } from 'react-icons/fi';
import instance from '../Utils/Middleware';
import { useCart } from '../Components/CartContext'; // Adjust path if needed

function Favourites() {
  const [favourites, setFavourites] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart(); // Cart-la direct-a add panna hook

  // 1. Fetch Wishlist Data
  useEffect(() => {
    fetchWishlist();
  }, []);

  const fetchWishlist = async () => {
    try {
      const res = await instance.get('/user/wishlist'); // Route setup padi
      setFavourites(res.data || []);
    } catch (error) {
      console.error("Error fetching wishlist:", error);
    } finally {
      setLoading(false);
    }
  };

  // 2. Remove from Wishlist
  const handleRemove = async (productId) => {
    try {
      await instance.delete(`/user/wishlist/remove/${productId}`);
      // UI-la irunthu antha product-a udane thookurom
      setFavourites(favourites.filter(item => item._id !== productId));
    } catch (error) {
      console.error("Error removing from wishlist:", error);
      alert("Failed to remove item.");
    }
  };

  // 3. Move to Cart
  const handleMoveToCart = (product) => {
    addToCart(product);
    alert("Added to Cart!");
    // Venumna cart-ku add aana udane wishlist-la irunthu thookidalam (Optional)
    // handleRemove(product._id); 
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
      <div className="container" style={{ maxWidth: '1000px' }}>
        
        <div className="d-flex align-items-center justify-content-between mb-4">
          <h3 className="fw-bold text-dark mb-0 d-flex align-items-center gap-2">
            <FiHeart style={{ color: 'var(--purple)' }} /> My Favourites
          </h3>
          <span className="badge bg-secondary rounded-pill px-3 py-2">
            {favourites.length} {favourites.length === 1 ? 'Item' : 'Items'}
          </span>
        </div>

        {favourites.length === 0 ? (
          // Empty State UI
          <div className="text-center py-5 bg-white rounded-4 shadow-sm border mt-4">
            <div className="display-1 text-muted mb-3"><FiHeart className="text-light" /></div>
            <h4 className="fw-bold text-dark">Your wishlist is empty</h4>
            <p className="text-muted mb-4">Save your favourite stitching designs here to view them later.</p>
            <Link className="btn text-white px-4 py-2 rounded-3 fw-bold" style={{ background: 'var(--purple)' }} to="/home">
              Discover Designs
            </Link>
          </div>
        ) : (
          // Grid View for Favourites
          <div className="row g-4">
            {favourites.map((product) => (
              <div key={product._id} className="col-12 col-sm-6 col-md-4">
                <div className="card border-0 shadow-sm rounded-4 h-100 overflow-hidden product-card-hover">
                  
                  {/* Product Image */}
                  <div className="position-relative" style={{ height: '240px', backgroundColor: '#f8f9fa' }}>
                    <Link to={`/product/${product._id}`}>
                      <img 
                        src={product.image ? `http://localhost:5000/uploads/${product.image}` : 'https://via.placeholder.com/300x400'} 
                        alt={product.title}
                        className="w-100 h-100 object-fit-cover"
                      />
                    </Link>

                    {/* Delete Button overlaid on image */}
                    <button 
                      className="btn btn-light position-absolute top-0 end-0 m-2 rounded-circle shadow-sm d-flex align-items-center justify-content-center"
                      style={{ width: '35px', height: '35px', color: 'red', zIndex: 10, padding: 0 }}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleRemove(product._id);
                      }}
                      title="Remove from Favourites"
                    >
                      <FiTrash2 size={20} />
                    </button>
                  </div>

                  {/* Product Details */}
                  <div className="card-body p-3 d-flex flex-column">
                    <Link to={`/product/${product._id}`} className="text-decoration-none">
                      <h6 className="fw-bold text-dark mb-1 text-truncate" title={product.title}>
                        {product.title}
                      </h6>
                    </Link>
                    <p className="small text-muted mb-2">{product.category || 'Custom Fit'}</p>
                    <div className="mt-auto d-flex justify-content-between align-items-center">
                      <span className="fw-bold fs-5 text-dark">₹{product.price}</span>
                    </div>
                    
                    <hr className="my-3 text-muted opacity-25" />
                    
                    {/* Move to Cart Button */}
                    <button 
                      className="btn w-100 fw-bold rounded-pill text-white py-2 d-flex justify-content-center align-items-center gap-2"
                      style={{ background: 'var(--purple)' }}
                      onClick={() => handleMoveToCart(product)}
                    >
                      <FiShoppingCart /> Add to Cart
                    </button>
                  </div>

                </div>
              </div>
            ))}
          </div>
        )}

      </div>

      {/* Add a tiny CSS for hover effect in your global styles or right here */}
      <style>{`
        .product-card-hover { transition: transform 0.2s ease, box-shadow 0.2s ease; }
        .product-card-hover:hover { transform: translateY(-5px); box-shadow: 0 10px 20px rgba(0,0,0,0.1) !important; }
      `}</style>
    </div>
  );
}

export default Favourites;