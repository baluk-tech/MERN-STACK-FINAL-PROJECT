import React, { useState, useEffect } from 'react';
import { FiPlus, FiUpload, FiEdit2, FiTrash2, FiUser } from 'react-icons/fi';
import { FaStar } from 'react-icons/fa';
import instance from '../Utils/Middleware'; // Adjust path if needed

function Measurement() {
  const [loading, setLoading] = useState(true);
  
  // Array of Profiles State
  const [profiles, setProfiles] = useState([]);
  const [activeProfileId, setActiveProfileId] = useState(null);
  const [activeTab, setActiveTab] = useState('shirt');

  // Modal & Form State
  const [showManualModal, setShowManualModal] = useState(false);
  const [showAiModal, setShowAiModal] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [modalMode, setModalMode] = useState('add');

  // 🚨 FLATTENED FORM STATE 🚨
  const defaultFormState = {
    _id: null,
    profileName: '',
    fitType: 'Regular Fit',
    
    // Shirt
    neck: '', shoulder: '', chest: '', waist: '', hip: '', sleeveLength: '', armhole: '', bicep: '', wrist: '', shirtLength: '',
    
    // Pant
    pantWaist: '', pantHip: '', thigh: '', knee: '', bottom: '', inseam: '', outseam: '', rise: '', pantLength: '', ankle: '',
    
    height: '', 
    addNotes: ''
  };
  const [manualForm, setManualForm] = useState(defaultFormState);

  // FETCH ALL PROFILES
  const fetchMyMeasurements = async () => {
    try {
      setLoading(true);
      const res = await instance.get('user/measurement/me'); 
      const data = Array.isArray(res.data) ? res.data : [];
      setProfiles(data);
      if (data.length > 0 && !activeProfileId) {
        setActiveProfileId(data[0]._id);
      }
    } catch (error) {
      console.error("Error fetching measurements", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyMeasurements();
  }, []);

  // SUBMIT FORM
  const handleManualSubmit = async (e) => {
    e.preventDefault();
    if (!manualForm.profileName.trim()) {
      return alert("Profile Name is required!");
    }

    try {
      // 🚨 MISTAKE 2 FIX: MongoDB _id null nu iruntha error adikkum. So atha thookidrom.
      const payload = { ...manualForm };
      if (modalMode === 'add') {
        delete payload._id; // Puthusa add pandrappo id thevayilla (MongoDB pathukkum)
        
        await instance.post('/user/measurement/add', payload); // '/user' added
        alert("New measurement profile created!");
      } else {
        await instance.put(`/user/measurement/update/${payload._id}`, payload); // '/user' added
        alert("Measurement updated successfully!");
      }
      setShowManualModal(false);
      fetchMyMeasurements();
    } catch (error) {
      console.error("Save Error:", error.response?.data || error.message);
      alert("Failed to save measurements. " + (error.response?.data?.message || ""));
    }
  };

// AI UPLOAD (Unpacks nested shirt & pant data into flat state)
  const handleAiUpload = async (e) => {
    e.preventDefault();
    if (!imageFile) return alert("Please select an image first!");
    
    setIsAiLoading(true);
    const formData = new FormData();
    formData.append('image', imageFile);

    try {
      const res = await instance.post('/user/ai-image-measurement', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      const aiData = res.data;
      const shirt = aiData.shirt || {};
      const pant = aiData.pant || {};

      // 🚨 FIX: Shirt matrum Pant object-a pirichu Flat State-la exact-a ukkaara vaikkurom 🚨
      setManualForm({
        ...defaultFormState,
        ...aiData, // Oruvela flat data vanthaalum eduthukkum
        ...shirt,  // Shirt fields ellam (neck, shoulder, chest...) set aagum
        ...pant,   // Pant fields ellam (thigh, knee, inseam...) set aagum
        
        // Shirt & Pant rendulayume 'waist' and 'hip' irukkurathala mix aagama thaniya pirikkirom:
        waist: shirt.waist || aiData.waist || '',
        hip: shirt.hip || aiData.hip || '',
        pantWaist: pant.waist || pant.pantWaist || aiData.pantWaist || '',
        pantHip: pant.hip || pant.pantHip || aiData.pantHip || '',
        
        height: aiData.height || '',
        addNotes: aiData.addNotes || '',
        profileName: 'AI Generated Fit',
      });
      
      setModalMode('add');
      setShowAiModal(false);
      setImageFile(null);
      setShowManualModal(true);
      alert("AI Analysis complete! Please review and save.");
    } catch (error) {
      console.error(error);
      alert("AI Generation Failed");
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleDeleteProfile = async (id) => {
    if(window.confirm("Are you sure you want to delete this profile?")) {
      try {
        await instance.delete(`/user/measurement/delete/${id}`);
        setProfiles(profiles.filter(p => p._id !== id));
        if(activeProfileId === id) setActiveProfileId(null);
      } catch (error) {
        alert("Failed to delete");
      }
    }
  };

  // UNIFIED CHANGE HANDLER (For flat object)
  const handleFlatChange = (e) => {
    setManualForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // MODAL HELPERS
  const openAddModal = () => {
    setModalMode('add');
    setManualForm(defaultFormState);
    setShowManualModal(true);
  };

  const openEditModal = (profile) => {
    setModalMode('edit');
    setManualForm({ ...defaultFormState, ...profile });
    setShowManualModal(true);
  };

  const formatLabel = (key) => key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
  
  const currentProfile = profiles.find(p => p._id === activeProfileId) || null;

  // Arrays to define which fields go in which tab
  const shirtFields = ['neck', 'shoulder', 'chest', 'waist', 'hip', 'sleeveLength', 'armhole', 'bicep', 'wrist', 'shirtLength'];
  const pantFields = ['pantWaist', 'pantHip', 'thigh', 'knee', 'bottom', 'inseam', 'outseam', 'rise', 'pantLength', 'ankle'];

  // Data to display in the table based on active tab
  const getDisplayData = () => {
      if (!currentProfile) return {};
      const data = {};
      const fields = activeTab === 'shirt' ? shirtFields : pantFields;
      fields.forEach(field => {
          if(currentProfile[field]) data[field] = currentProfile[field];
      });
      return data;
  }
  const displayData = getDisplayData();

  return (
    <div className="container-fluid measurement-container p-4 bg-white rounded shadow-sm mt-4 min-vh-100">
      
      {/* HEADER */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">
        <h4 className="mb-0 fw-bold">Measurement Profiles</h4>
        <div className="d-flex flex-wrap gap-2">
          <button onClick={openAddModal} className="btn custom-btn-primary d-flex align-items-center gap-2 px-3 text-black">
            <FiPlus /> Add Profile
          </button>
          <button onClick={() => setShowAiModal(true)} className="btn custom-btn-outline d-flex align-items-center gap-2 px-3">
            <FiUpload /> AI Measurement
          </button>
        </div>
      </div>

      <div className="row g-4">
        {/* LEFT COLUMN: Data Table */}
        <div className="col-lg-8">
          
          {/* PROFILE SELECTOR */}
          {profiles.length > 0 && (
            <div className="mb-4 d-flex gap-2 overflow-auto pb-2 custom-scrollbar">
              {profiles.map(p => (
                <button 
                  key={p._id}
                  className={`btn rounded-pill px-4 fw-medium text-nowrap ${activeProfileId === p._id ? 'btn-dark' : 'btn-outline-secondary'}`}
                  onClick={() => setActiveProfileId(p._id)}
                >
                  <FiUser className="me-2" />
                  {p.profileName}
                </button>
              ))}
            </div>
          )}

          {profiles.length === 0 && !loading ? (
            <div className="text-center py-5 border rounded-4 bg-light">
              <i className="bi bi-rulers fs-1 text-muted mb-3 d-block"></i>
              <h5>No Measurement Profiles</h5>
              <button onClick={openAddModal} className="btn custom-btn-primary text-black px-4 mt-2">Create Profile</button>
            </div>
          ) : (
            <>
              {currentProfile && (
                <div className="d-flex justify-content-between align-items-center bg-light p-3 rounded-3 mb-3 border">
                  <h6 className="mb-0 fw-bold text-dark">{currentProfile.profileName} <span className="badge bg-secondary ms-2">{currentProfile.fitType}</span></h6>
                  <div className="d-flex gap-2">
                    <button onClick={() => openEditModal(currentProfile)} className="btn btn-sm btn-outline-primary bg-white d-flex align-items-center gap-1">
                      <FiEdit2 size={14}/> Edit
                    </button>
                    <button onClick={() => handleDeleteProfile(currentProfile._id)} className="btn btn-sm btn-outline-danger bg-white d-flex align-items-center gap-1">
                      <FiTrash2 size={14}/> Delete
                    </button>
                  </div>
                </div>
              )}

              {/* TABS FOR DISPLAY */}
              <ul className="nav nav-tabs custom-tabs mb-3 border-0">
                {['shirt', 'pant'].map(tab => (
                  <li className="nav-item" key={tab}>
                    <button
                      className={`nav-link border-0 bg-transparent text-capitalize ${activeTab === tab ? 'active-tab fw-bold text-dark' : 'text-muted'}`}
                      onClick={() => setActiveTab(tab)}
                    >
                      {tab} Measurements
                    </button>
                  </li>
                ))}
              </ul>

              {/* DATA TABLE */}
              <div className="table-responsive rounded border custom-table-wrapper">
                <table className="table mb-0 text-nowrap">
                  <thead className="bg-light">
                    <tr>
                      <th className="py-3 px-4 border-bottom-0 text-muted small fw-semibold">Area</th>
                      <th className="py-3 px-4 border-bottom-0 text-muted small fw-semibold">Value (inches)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                       <tr><td colSpan="2" className="text-center py-5"><div className="spinner-border text-primary"></div></td></tr>
                    ) : Object.keys(displayData).length > 0 ? (
                      Object.entries(displayData).map(([key, value]) => (
                         <tr key={key}>
                            <td className="py-3 px-4 align-middle fw-medium text-dark border-light">{formatLabel(key.replace('pant', ''))}</td>
                            <td className="py-3 px-4 align-middle border-light fw-bold">{value || '-'}</td>
                          </tr>
                      ))
                    ) : (
                      <tr><td colSpan="2" className="text-center py-4 text-muted">No details added.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>

        {/* RIGHT COLUMN */}
        <div className="col-lg-4">
          <div className="card border-0 default-measurement-card mb-3 p-4 bg-light">
            <h6 className="fw-bold text-success mb-3">Active Profile</h6>
            <div className="d-flex align-items-center gap-2">
              <FaStar className="text-success fs-5" />
              <div>
                <p className="mb-0 fw-bold text-dark">{currentProfile ? currentProfile.profileName : 'None Selected'}</p>
                <small className="text-muted">Currently active for checkout</small>
              </div>
            </div>
            {currentProfile && currentProfile.height && (
              <div className="mt-3 pt-3 border-top">
                <small className="text-muted d-block">Height: <span className="fw-bold text-dark">{currentProfile.height} cm</span></small>
                {currentProfile.addNotes && <small className="text-muted d-block mt-1">Notes: {currentProfile.addNotes}</small>}
              </div>
            )}
          </div>

          <div className="card border-0 quick-tips-card p-4 bg-light">
            <h6 className="fw-bold mb-3">Quick Tips</h6>
            <ul className="list-unstyled mb-0 d-flex flex-column gap-2 small text-dark">
              <li className="d-flex align-items-center gap-2"><span className="dot" style={{width: '6px', height: '6px', background: 'var(--purple)', borderRadius: '50%'}}></span> Stand straight</li>
              <li className="d-flex align-items-center gap-2"><span className="dot" style={{width: '6px', height: '6px', background: 'var(--purple)', borderRadius: '50%'}}></span> Wear fitted clothes</li>
              <li className="d-flex align-items-center gap-2"><span className="dot" style={{width: '6px', height: '6px', background: 'var(--purple)', borderRadius: '50%'}}></span> Keep tape parallel</li>
              <li className="d-flex align-items-start gap-2"><span className="dot mt-1" style={{width: '6px', height: '6px', background: 'var(--purple)', borderRadius: '50%'}}></span> Don't measure over thick clothes</li>
            </ul>
          </div>
        </div>
      </div>

      {/* --- MODALS --- */}
      
      {/* 1. AI Image Upload Modal */}
      {showAiModal && (
        <div className="modal-backdrop-custom">
          <div className="modal-dialog-custom bg-white rounded shadow p-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h5 className="fw-bold mb-0">Upload Image for AI Measurement</h5>
              <button className="btn-close shadow-none" onClick={() => setShowAiModal(false)}></button>
            </div>
            <form onSubmit={handleAiUpload}>
              <div className="mb-4">
                <input type="file" className="form-control shadow-none" accept="image/*" onChange={(e) => setImageFile(e.target.files[0])} />
                <small className="text-muted mt-2 d-block">Upload a clear, full-body photo wearing fitted clothing.</small>
              </div>
              <div className="d-flex justify-content-end gap-2">
                <button type="button" className="btn btn-light px-4" onClick={() => setShowAiModal(false)}>Cancel</button>
                <button type="submit" className="btn custom-btn-primary px-4 text-black" disabled={isAiLoading}>
                  {isAiLoading ? <span className="spinner-border spinner-border-sm me-2"></span> : <FiUpload className="me-2" />}
                  {isAiLoading ? 'Analyzing...' : 'Upload & Generate'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 2. MANUAL ENTRY MODAL */}
      {showManualModal && (
        <div className="modal-backdrop-custom">
          <div className="modal-dialog-custom modal-lg bg-white rounded shadow d-flex flex-column" style={{ maxHeight: '90vh' }}>
            <div className="p-4 border-bottom d-flex justify-content-between align-items-center bg-light rounded-top">
              <h5 className="fw-bold mb-0">{modalMode === 'add' ? 'Create Profile' : 'Edit Profile'}</h5>
              <button className="btn-close shadow-none" onClick={() => setShowManualModal(false)}></button>
            </div>
            
            <div className="p-4 overflow-auto custom-scrollbar">
              <form id="manualForm" onSubmit={handleManualSubmit}>
                
                {/* Profile Name & Fit */}
                <div className="row mb-4 p-3 rounded-3 border" style={{ backgroundColor: '#f8f9fe', borderColor: '#e0e7ff'}}>
                   <div className="col-md-8">
                      <label className="form-label fw-bold mb-1" style={{color: 'var(--purple)'}}>Profile Name <span className="text-danger">*</span></label>
                      <input type="text" name="profileName" value={manualForm.profileName} onChange={handleFlatChange} className="form-control shadow-none border-0" placeholder="e.g. Festival Fit, My Regular Fit" required />
                   </div>
                   <div className="col-md-4 mt-3 mt-md-0">
                      <label className="form-label fw-bold mb-1" style={{color: 'var(--purple)'}}>Fit Type</label>
                      <select name="fitType" value={manualForm.fitType} onChange={handleFlatChange} className="form-select shadow-none border-0">
                          <option>Regular Fit</option>
                          <option>Slim Fit</option>
                          <option>Relaxed Fit</option>
                          <option>Custom</option>
                      </select>
                   </div>
                </div>

                <div className="row mb-4">
                  <div className="col-md-6">
                    <label className="form-label fw-semibold small text-muted">Height (cm)</label>
                    <input type="number" name="height" value={manualForm.height} onChange={handleFlatChange} className="form-control shadow-none" placeholder="e.g. 175" />
                  </div>
                  <div className="col-md-6 mt-3 mt-md-0">
                    <label className="form-label fw-semibold small text-muted">Additional Notes</label>
                    <input type="text" name="addNotes" value={manualForm.addNotes} onChange={handleFlatChange} className="form-control shadow-none" placeholder="e.g. Keep shoulders slightly loose" />
                  </div>
                </div>

                {/* Shirt Measurements */}
                <h6 className="fw-bold mb-3 border-bottom pb-2" style={{ color: '#2b2b2b' }}>Shirt Measurements (Inches)</h6>
                <div className="row g-3 mb-4">
                  {shirtFields.map((field) => (
                    <div className="col-6 col-md-4 col-lg-3" key={field}>
                      <label className="form-label small text-capitalize text-muted mb-1">{formatLabel(field)}</label>
                      <input type="number" step="0.1" name={field} className="form-control form-control-sm shadow-none" value={manualForm[field]} onChange={handleFlatChange} />
                    </div>
                  ))}
                </div>

                {/* Pant Measurements */}
                <h6 className="fw-bold mb-3 border-bottom pb-2" style={{ color: '#2b2b2b' }}>Pant Measurements (Inches)</h6>
                <div className="row g-3 mb-4">
                  {pantFields.map((field) => (
                    <div className="col-6 col-md-4 col-lg-3" key={field}>
                      <label className="form-label small text-capitalize text-muted mb-1">{formatLabel(field.replace('pant', ''))}</label>
                      <input type="number" step="0.1" name={field} className="form-control form-control-sm shadow-none" value={manualForm[field]} onChange={handleFlatChange} />
                    </div>
                  ))}
                </div>
              </form>
            </div>

            <div className="p-4 border-top bg-light d-flex justify-content-end gap-2 rounded-bottom">
              <button type="button" className="btn btn-light px-4" onClick={() => setShowManualModal(false)}>Cancel</button>
              <button type="submit" form="manualForm" className="btn text-white px-4 fw-bold" style={{background: 'var(--purple)'}}>
                {modalMode === 'add' ? 'Save Profile' : 'Update Profile'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Measurement;