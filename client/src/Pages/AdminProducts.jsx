import React, { useState, useEffect } from 'react';
import instance from '../Utils/Middleware';

function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal & Form States
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  
  const [formData, setFormData] = useState({
    title: '', description: '', price: '', category: '', material: '', stockLimit: ''
  });
  const [imageFile, setImageFile] = useState(null);

  // 1. Fetch All Products
  const fetchProducts = async () => {
    try {
      const res = await instance.get('/admin/all-products'); 
      setProducts(res.data.allProducts || res.data.products || []);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Form Input Handler
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  // Open Modal for Add
  const handleAddNew = () => {
    setIsEditing(false);
    setEditId(null);
    setFormData({ title: '', description: '', price: '', category: '', material: '', stockLimit: '' });
    setImageFile(null);
    setShowModal(true);
  };

  // Open Modal for Edit
  const handleEdit = (product) => {
    setIsEditing(true);
    setEditId(product._id);
    setFormData({
      title: product.title,
      description: product.description,
      price: product.price,
      category: product.category,
      material: product.material,
      stockLimit: product.stockLimit
    });
    setImageFile(null); 
    setShowModal(true);
  };

  // 2. Submit Add / Edit
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const data = new FormData();
    data.append('title', formData.title);
    data.append('description', formData.description);
    data.append('price', formData.price);
    data.append('category', formData.category);
    data.append('material', formData.material);
    data.append('stockLimit', formData.stockLimit);
    if (imageFile) {
      data.append('image', imageFile); 
    }

    try {
      if (isEditing) {
        await instance.put(`/admin/edit-product/${editId}`, data); 
        alert("Product updated successfully!");
      } else {
        await instance.post(`/admin/add-product`, data); 
        alert("New product added successfully!");
      }
      setShowModal(false);
      fetchProducts(); 
    } catch (error) {
      console.error("Error saving product:", error);
      alert("Failed to save product. Check console for details.");
    }
  };

  // 3. Delete Product
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await instance.delete(`/admin/delete-product/${id}`); 
        alert("Product deleted successfully!");
        fetchProducts(); 
      } catch (error) {
        console.error("Error deleting product:", error);
        alert("Failed to delete product.");
      }
    }
  };

  // Date & Time Formatter
  const formatDateTime = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleString('en-IN', {
      day: '2-digit', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit', hour12: true
    });
  };

  return (
    <div className="bg-white rounded-4 shadow-sm p-4 p-md-5 border-0">
      
      {/* Header */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 pb-3 border-bottom gap-3">
        <div>
          <h2 className="fw-bold mb-1 text-dark">Products & Designs</h2>
          <p className="text-muted mb-0">Manage your tailoring catalog, fabrics, and pricing.</p>
        </div>
        <button className="btn text-white fw-bold px-4 py-2 rounded-pill shadow-sm" style={{ background: 'var(--purple)' }} onClick={handleAddNew}>
          <i className="bi bi-plus-lg me-2"></i> Add New Product
        </button>
      </div>

      {/* Table */}
      {loading ? (
        <div className="text-center py-5 my-5">
          <div className="spinner-border text-primary" role="status"></div>
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-5 my-5 bg-light rounded-4">
          <h4 className="text-muted">No products available in catalog.</h4>
        </div>
      ) : (
        <div className="table-responsive rounded-4 border">
          <table className="table table-hover align-middle mb-0">
            <thead className="bg-light">
              <tr>
                <th className="py-3 px-4 text-muted fw-bold">Image</th>
                <th className="py-3 px-3 text-muted fw-bold">Title</th>
                <th className="py-3 px-3 text-muted fw-bold">Category</th>
                <th className="py-3 px-3 text-muted fw-bold">Price</th>
                <th className="py-3 px-3 text-muted fw-bold text-center">Stock</th>
                <th className="py-3 px-3 text-muted fw-bold">Timeline</th>
                <th className="py-3 px-4 text-end text-muted fw-bold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => {
                // 🚨 LOGIC: Add panna time-um, Update time-um vera ah irukka nu check pandrom (diff > 1000ms)
                const isActuallyUpdated = p.updatedAt && (new Date(p.updatedAt).getTime() - new Date(p.createdAt).getTime() > 1000);

                return (
                  <tr key={p._id}>
                    <td className="py-3 px-4">
                      <img 
                        src={p.image ? `http://localhost:5000/uploads/${p.image}` : 'https://via.placeholder.com/50'} 
                        alt="product" 
                        className="rounded-3 object-fit-cover shadow-sm"
                        style={{ width: '50px', height: '50px' }}
                      />
                    </td>
                    <td className="py-3 px-3 fw-bold text-dark">{p.title}</td>
                    <td className="py-3 px-3">
                      <span className="badge bg-secondary-subtle text-secondary border">{p.category}</span>
                    </td>
                    <td className="py-3 px-3 fw-bold text-success fs-6">₹{p.price}</td>
                    <td className="py-3 px-3 text-center fw-semibold text-muted">{p.stockLimit || '∞'}</td>
                    
                    {/* 🚨 CONDITION VECHU DATE KAATTUROM 🚨 */}
                    <td className="py-3 px-3">
                      <div className="d-flex flex-column gap-1" style={{ fontSize: '0.80rem' }}>
                        <span className="text-secondary">
                          <i className="bi bi-calendar-plus text-primary me-2"></i>
                          <b>Added:</b> {formatDateTime(p.createdAt)}
                        </span>
                        
                        {/* Edit aagiruntha mattum Update line theriyum */}
                        {isActuallyUpdated && (
                          <span className="text-secondary">
                            <i className="bi bi-pencil-square text-warning me-2"></i>
                            <b>Updated:</b> {formatDateTime(p.updatedAt)}
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="py-3 px-4 text-end">
                      <button className="btn btn-sm btn-outline-primary rounded-pill px-3 me-2" onClick={() => handleEdit(p)}>
                        <i className="bi bi-pencil-square"></i> Edit
                      </button>
                      <button className="btn btn-sm btn-outline-danger rounded-pill px-3" onClick={() => handleDelete(p._id)}>
                        <i className="bi bi-trash"></i>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* --- ADD / EDIT POPUP MODAL --- */}
      {showModal && (
        <div className="modal-backdrop-custom" style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.6)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1050 }}>
          <div className="bg-white rounded-4 shadow-lg p-4 p-md-5" style={{ width: '90%', maxWidth: '700px', maxHeight: '90vh', overflowY: 'auto' }}>
            
            <div className="d-flex justify-content-between align-items-center mb-4 pb-2 border-bottom">
              <h4 className="fw-bold mb-0 text-dark">
                {isEditing ? 'Edit Product Design' : 'Add New Product'}
              </h4>
              <button className="btn-close fs-5" onClick={() => setShowModal(false)}></button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label fw-bold small">Product Title</label>
                  <input type="text" className="form-control" name="title" value={formData.title} onChange={handleChange} required />
                </div>
                
                <div className="col-md-6">
                  <label className="form-label fw-bold small">Price (₹)</label>
                  <input type="number" className="form-control" name="price" value={formData.price} onChange={handleChange} required />
                </div>

                <div className="col-md-6">
                  <label className="form-label fw-bold small">Category</label>
                  <select className="form-select" name="category" value={formData.category} onChange={handleChange} required>
                    <option value="">Select Category...</option>
                    <option value="Shirt">Shirt</option>
                    <option value="Pant">Pant</option>
                    <option value="Suit">Suit</option>
                    <option value="Kurta">Kurta</option>
                  </select>
                </div>

                <div className="col-md-6">
                  <label className="form-label fw-bold small">Material (Fabric)</label>
                  <input type="text" className="form-control" name="material" value={formData.material} onChange={handleChange} placeholder="e.g. Cotton, Linen" required />
                </div>

                <div className="col-12">
                  <label className="form-label fw-bold small">Description</label>
                  <textarea className="form-control" name="description" rows="3" value={formData.description} onChange={handleChange} required></textarea>
                </div>

                <div className="col-md-6">
                  <label className="form-label fw-bold small">Product Image {isEditing && <span className="text-muted fw-normal">(Leave empty to keep current)</span>}</label>
                  <input type="file" className="form-control" accept="image/*" onChange={handleFileChange} required={!isEditing} />
                </div>

                <div className="col-md-6">
                  <label className="form-label fw-bold small">Stock Limit</label>
                  <input type="number" className="form-control" name="stockLimit" value={formData.stockLimit} onChange={handleChange} />
                </div>
              </div>

              <div className="mt-4 pt-3 border-top d-flex justify-content-end gap-2">
                <button type="button" className="btn btn-light fw-bold px-4 rounded-pill" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn text-white fw-bold px-4 rounded-pill shadow-sm" style={{ background: 'var(--purple)' }}>
                  {isEditing ? 'Update Product' : 'Save Product'}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
}

export default AdminProducts;