import React from 'react'
import { useState, useEffect } from 'react';

function Productfilter() {

  const[products, setProducts] = useState([]);
  const[loading, setLoading] = useState(true);
  const[error, setError] = useState("");

  const[searchTerm, setSearchTerm] = useState("");
  const[selectCategory, setSelectCategory] = useState("");

  useEffect(() => {
    const fetchFilteredProducts = async () => {
      setLoading(true);
      setError("");
      
      try {
        const res = await instance.get("/admin/products", {
          params: {
            search: setSearchTerm || undefined,
            category: setCategory || undefined
          }
        });
        if (res.data && res.data.product) {
          setProducts(res.data.product);
        } else {
          setProducts([]);
        }
      } catch (err) {
        console.log("Error: ",err);
        setError("Failed to fetch products. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    const delayDebounceFn = setTimeout(() => {
      fetchFilteredProducts();
    }, 500);

    return clearTimeout(delayDebounceFn);

  }, [searchTerm, category]);

  return (
    <>
    <div className="container mt-4">
      {/* --- Filter Controls --- */}
      <div className="row mb-4">
        <div className="col-md-6 mb-3 mb-md-0">
          <input
            type="text"
            className="form-control shadow-sm"
            placeholder="Search products by text..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="col-md-6">
          <select 
            className="form-select shadow-sm" 
            value={category} 
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">All Categories</option>
            <option value="Dresses">Dresses</option>
            <option value="Pants">Pants</option>
            <option value="Jackets">Jackets</option>
            <option value="Accessories">Accessories</option>
          </select>
        </div>
      </div>

      {/* --- Error & Loading States --- */}
      {error && <div className="alert alert-danger">{error}</div>}
      {loading && <div className="text-center my-5"><div className="spinner-border"></div></div>}

      {/* --- Product Grid --- */}
      {!loading && !error && (
        <div className="row row-cols-1 row-cols-md-3 g-4">
          {products.length > 0 ? (
            products.map((item) => (
              <div className="col" key={item._id}>
                <div className="card h-100 shadow-sm border-0">
                  {/* Fallback image if your DB doesn't have imageUrl yet */}
                  <img 
                    src={item.image && `http://localhost:5000/uploads/${item.image}`} 
                    className="card-img-top" 
                    alt={item.title || 'Product'} 
                  />
                  <div className="card-body">
                    <h5 className="card-title fw-bold">{item.title}</h5>
                    <p className="card-text text-muted">{item.category}</p>
                    <p className="card-text fw-bold text-dark">${item.price}</p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-12 text-center text-muted mt-5">
              <h5>No products found matching your criteria.</h5>
            </div>
          )}
        </div>
      )}
    </div>
    </>
  )
}

export default Productfilter