import React, { useEffect, useState } from 'react'
import { Modal, Form, Button, Row, Col } from 'react-bootstrap'
import instance from '../Utils/Middleware';

function EditMyprofile({user, setUserDetails}) {
  const[show, setShow] = useState(false);
  const [formData, setFormData] = useState({
    name: "", lastName: "", email: "", profilePicture: null,
    phone: "", gender: "", dob: "", address: ""
  })

  useEffect(() => {
    if (user && Object.keys(user).length > 0) {
      setFormData({
        name: user.name || "", lastName: user.lastName || "", email: user.email || "",
        profilePicture: user.profilePicture || null, phone: user.phone || "",
        gender: user.gender || "", dob: user.dob || "", address: user.address || ""
      });
    }
  }, [user])

  const handleShow = () => setShow(true);
  const handleClose = () => setShow(false);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const handleFileChange = (e) => setFormData({ ...formData, profilePicture: e.target.files[0] });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const submitData = new FormData();
    submitData.append("name", formData.name);
    submitData.append("lastName", formData.lastName);
    submitData.append("phone", formData.phone);
    submitData.append("gender", formData.gender);
    submitData.append("dob", formData.dob);
    submitData.append("address", formData.address);

    if (formData.profilePicture instanceof File) {
      submitData.append("profilePicture", formData.profilePicture);
    }

    try {
      const res = await instance.put("/user/profile", submitData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      const updatedUser = res.data.user;
      setUserDetails(updatedUser);
      handleClose();
    } catch(err) {
      console.log(err);
    }
  }
    
  return (
    <>
      <div>
        <Button variant='primary' onClick={handleShow}>Edit button</Button>

        <Modal show={show} onHide={handleClose} backdrop="static" keyboard={false}>
          <Modal.Header closeButton><Modal.Title>Edit Profile</Modal.Title></Modal.Header>
          <Form onSubmit={handleSubmit}>
            <Modal.Body>
              <Row className="g-3">
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Profile image</Form.Label>
                    <Form.Control type='file' name='profilePicture' onChange={handleFileChange} />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>First name</Form.Label>
                    <Form.Control type='text' name='name' value={formData.name} onChange={handleChange} />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Last name</Form.Label>
                    <Form.Control type='text' name='lastName' value={formData.lastName} onChange={handleChange} />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Email address</Form.Label>
                    <Form.Control type='email' name='email' value={formData.email} disabled />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Phone number</Form.Label>
                    <Form.Control type='number' name='phone' value={formData.phone} onChange={handleChange} />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Gender</Form.Label>
                    <Form.Select name='gender' value={formData.gender} onChange={handleChange}>
                      <option value="">Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="other">Other</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Date of Birth</Form.Label>
                    <Form.Control type='date' name='dob' value={formData.dob} onChange={handleChange} />
                  </Form.Group>
                </Col>
                <Col xs={12}>
                  <Form.Group>
                    <Form.Label>Address</Form.Label>
                    <Form.Control as='textarea' rows={3} name='address' value={formData.address} onChange={handleChange} />
                  </Form.Group>
                </Col>
              </Row>
            </Modal.Body>
            <Modal.Footer>
              <Button variant='secondary' onClick={handleClose}>Cancel</Button>
              <Button variant='primary' type='submit'>Save Changes</Button>
            </Modal.Footer>
          </Form>
        </Modal>
      </div>
    </>
  )
}

export default EditMyprofile