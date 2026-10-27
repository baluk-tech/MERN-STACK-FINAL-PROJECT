import React, { useState, useEffect } from 'react';
import { FaStar, FaRegStar, FaSearch, FaHeart } from 'react-icons/fa';
import { FiHeart } from 'react-icons/fi';
import instance from '../Utils/Middleware';
import { useCart } from '../Components/CartContext'; // 🚨 PUDHUSA ADD PANNIYIRUKKOM
import { Link } from 'react-router-dom';

function Home () {
  const { addToCart } = useCart(); // 🚨 CART FUNCTION-A EDUKKUROM
  
  const [prods, setProds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedPriceRange, setSelectedPriceRange] = useState("");
  const [selectedSortOption, setSelectedSortOption] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);

  const [wishlistIds, setWishlistIds] = useState([]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedCategory, selectedPriceRange, selectedSortOption]);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError("");

      try {
        const res = await instance.get("/products", {
          params: {
            search: searchTerm || undefined,
            category: selectedCategory || undefined,
            price: selectedPriceRange || undefined,
            sort: selectedSortOption || undefined,
            page: currentPage,
            limit: 10
          }
        })
        if (res.data && res.data.products) {
          setProds(res.data.products);
          setTotalPages(res.data.totalPages || 1);
          setTotalProducts(res.data.totalProducts || 0);
        } else {
          setProds([])
        }
      } catch (err) {
        setError("Failed to fetch products. Please try again")
      } finally {
        setLoading(false);
      }
    };

    const delayDebounceFn = setTimeout(() => {
      fetchProducts();
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, selectedCategory, selectedPriceRange, selectedSortOption, currentPage]);

  // 🚨 PUDHUSU: Page load aagumbothu user-oda fav items-a thedi yedukkurom 🚨
  useEffect(() => {
    const fetchUserWishlist = async () => {
      try {
        const res = await instance.get('/user/wishlist');
        // Vantah wishlist items-oda ID-a mattum array-la vechukurom
        const ids = res.data.map(item => item._id || item);
        setWishlistIds(ids);
      } catch (error) {
        console.error("Could not fetch wishlist", error);
      }
    };
    fetchUserWishlist();
  }, []);

  // 🚨 PUDHUSU: Toggle Function (Add & Remove rendum onna seiyum) 🚨
  const handleToggleWishlist = async (productId) => {
    const isFav = wishlistIds.includes(productId); // Already irukka nu check pandrom

    try {
      if (isFav) {
        // Iruntha Remove pandrom
        await instance.delete(`/user/wishlist/remove/${productId}`);
        setWishlistIds(prev => prev.filter(id => id !== productId)); // UI-la udane update
      } else {
        // Illana Add pandrom
        await instance.post('/user/wishlist/add', { productId });
        setWishlistIds(prev => [...prev, productId]); // UI-la udane update
      }
    } catch (error) {
      console.error("Error toggling wishlist:", error);
      alert("Failed to update wishlist. Please make sure you are logged in.");
    }
  };

  const categories = ["Pant", "Shirt", "Sweater", "Hoodie"];

  const priceRanges = [
    { label: "0 - 500",     value: "0-500" },
    { label: "500 - 1000",  value: "500-1000" },
    { label: "1000 - 2000", value: "1000-2000" },
    { label: "2000+",       value: "2000-plus" }
  ];

  const sortOptions = [
    { label: "Popularity", value: "" },
    { label: "Price: Low to High", value: "price_asc" },
    { label: "Price: High to Low", value: "price_desc" }
  ];

  return (
    <div className="container-fluid mt-4 px-lg-5 min-vh-100">
      {/* Top Navbar Simulation */}
      <nav className="d-flex justify-content-between align-items-center mb-4 pb-3 border-bottom">
        <h2 className="fw-bold mb-0">Our Collection</h2>
        <div className="d-none d-md-flex gap-4">
          <a href="#" className="text-dark text-decoration-none fw-semibold border-bottom border-dark border-2 pb-1">Shop</a>
          <a href="#" className="text-muted text-decoration-none">Most Wanted</a>
          <a href="#" className="text-muted text-decoration-none">New Arrival</a>
          <a href="#" className="text-muted text-decoration-none">Brands</a>
        </div>
        <div></div>
      </nav>

      <div className="row">
        {/* Sidebar (Filters) */}
        <aside className="col-md-3 d-none d-md-block pr-4">
          <div className="filter-section mb-4 p-3 bg-white rounded-3 shadow-sm border">
            <h6 className="fw-bold mb-3">Categories</h6>
            <ul className="list-unstyled custom-sidebar-list mb-0">
              {categories.map((cat, index) => (
                <li key={index}>
                  <input 
                    type="checkbox" 
                    className="me-2"
                    checked={selectedCategory === cat}
                    onChange={() => setSelectedCategory(selectedCategory === cat ? "" : cat)}
                  /> 
                  {cat}
                </li>
              ))}
            </ul>
          </div>
          
          <div className="filter-section mb-4 p-3 bg-white rounded-3 shadow-sm border">
            <h6 className="fw-bold mb-3">Price Range (₹)</h6>
            <ul className="list-unstyled custom-sidebar-list mb-0">
              {priceRanges.map((range, index) => (
                <li key={index}>
                  <input 
                    type="checkbox" 
                    className="me-2"
                    checked={selectedPriceRange === range.value}
                    onChange={() => setSelectedPriceRange(selectedPriceRange === range.value ? "" : range.value)}
                  />
                  {range.label}
                </li>
              ))}
            </ul>
          </div>
        </aside>

        {/* Main Product Grid */}
        <main className="col-md-9">
          <div className='input-group mb-4 shadow-sm rounded-3 overflow-hidden'>
            <span className='input-group-text bg-white border-end-0 border py-2'>
              <FaSearch className='text-muted' />
            </span>
            <input 
              type="text"
              className='form-control border-start-0 border shadow-none py-2'
              placeholder='Search for designs, fabrics...'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h6 className="mb-0 text-muted">Showing 1-10 of {totalProducts} results</h6>
            <select 
              className="form-select w-auto border shadow-sm bg-white"
              value={selectedSortOption}
              onChange={(e) => setSelectedSortOption(e.target.value)}
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {error && <div className='alert alert-danger'>{error}</div>}

          {loading && (
            <div className="text-center my-5">
              <div className="spinner-border" style={{ color: 'var(--purple)' }}></div>
            </div>
          )}

          {!loading && !error && (
            prods.length === 0 ? (
            <div className='text-center my-5 text-muted bg-white p-5 rounded-4 shadow-sm border'>
              <i className="bi bi-box-seam fs-1 mb-3 text-secondary d-block"></i>
              <h4>No products found.</h4>
              <p>Try searching for a different design or fabric.</p>
            </div>
          ) : (
            // Bootstrap Grid
            <div className="row row-cols-1 row-cols-sm-2 row-cols-lg-3 g-4">
              {prods.map((product) => (
                <div className="col" key={product._id}>
                  <div className="card h-100 custom-product-card border-0 shadow-sm rounded-4 overflow-hidden position-relative">
                    
                    <button 
                        className="btn btn-light position-absolute top-0 end-0 m-2 rounded-circle shadow-sm d-flex align-items-center justify-content-center"
                        style={{ width: '38px', height: '38px', zIndex: 10, padding: 0, transition: 'all 0.2s ease-in-out' }}
                        onClick={(e) => {
                            e.preventDefault(); 
                            e.stopPropagation();
                            handleToggleWishlist(product._id);
                        }}
                    >
                        {wishlistIds.includes(product._id) ? (
                            // 🚨 Iruntha Red Fill Heart
                            <FaHeart size={22} style={{ color: '#ff4d4f' }} /> 
                        ) : (
                            // 🚨 Illana Normal Heart
                            <FiHeart size={22} style={{ color: 'var(--purple)' }} /> 
                        )}
                    </button>

                    <Link to={`/product/${product._id}`} className="text-decoration-none">
                      <div className="position-relative bg-light image-container" style={{ aspectRatio: '3/4' }}>
                        <img 
                          src={product.image ? `http://localhost:5000/uploads/${product.image}` : 'https://via.placeholder.com/300x400?text=No+Image'} 
                          className="card-img-top product-img h-100 w-100" 
                          alt={product.title} 
                          style={{ objectFit: 'cover' }}
                        />
                      </div>
                    </Link>

                    <div className="card-body d-flex flex-column p-3">
                      <Link to={`/product/${product._id}`} className="text-decoration-none">
                        <h6 className="card-title fw-bold mb-1 text-dark text-truncate">{product.title}</h6>
                      </Link>
                      <p className="small text-muted mb-2">{product.category}</p>
                      
                      <div className="d-flex align-items-center mb-3 text-warning small">
                        <FaStar /> <FaStar /> <FaStar /> <FaStar /> <FaRegStar /> 
                        <span className="text-muted ms-1">({product.reviews || Math.floor(Math.random() * 50) + 10})</span>
                      </div>
                      
                      <div className="mt-auto d-flex flex-column gap-3">
                        <div className="d-flex align-items-center gap-2">
                          <span className="fw-bold fs-5 text-dark">₹{product.price}</span>
                          {product.price && (
                            <span className="text-muted text-decoration-line-through small">
                              ₹{(product.price * 1.2).toFixed(0)}  
                            </span>
                          )}
                        </div>
                        
                        {/* 🚨 ADD TO CART BUTTON 🚨 */}
                        <button 
                          className="btn w-100 rounded-3 text-white fw-medium py-2 d-flex align-items-center justify-content-center gap-2"
                          style={{ background: 'var(--purple)', transition: 'all 0.3s ease' }}
                          onClick={() => addToCart(product)}
                        >
                          <i className="bi bi-cart-plus"></i> Add to Cart
                        </button>
                      </div>
                    </div>

                  </div>
                </div>
              ))}
            </div>
          ))}

          {/* Pagination */}
          {!loading && totalPages > 1 && (
            <div className="d-flex justify-content-center mt-5 mb-4">
              <ul className="pagination custom-pagination shadow-sm rounded-3 overflow-hidden">
                <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                  <button 
                    className="page-link border-0 text-dark" 
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                  >
                    Prev
                  </button>
                </li>
                
                {[...Array(totalPages)].map((_, index) => {
                  const pageNumber = index + 1;
                  return (
                    <li key={pageNumber} className={`page-item ${currentPage === pageNumber ? 'active' : ''}`}>
                      <button 
                        className={`page-link border-0 ${currentPage === pageNumber ? 'text-white' : 'text-dark'}`}
                        style={{ background: currentPage === pageNumber ? 'var(--purple)' : 'white' }} 
                        onClick={() => setCurrentPage(pageNumber)}
                      >
                        {pageNumber}
                      </button>
                    </li>
                  );
                })}

                <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                  <button 
                    className="page-link border-0 text-dark" 
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </button>
                </li>
              </ul>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Home;