import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Form } from 'react-bootstrap';
import axios from 'axios';
import BaseApi from '../../../services/BaseApi';

const defaultCoupon = {
  code: '',
  discountType: 'PERCENTAGE', // or 'FIXED'
  discountValue: 0,
  expiryDate: '',
  maxUsage: 1,
};

type Coupon = {
  id: number;
  code: string;
  discountType: string;
  discountValue: number;
  expiryDate: string;
  maxUsage: number;
  usedCount: number;
};

const CouponManager = () => {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);
  const [form, setForm] = useState(defaultCoupon);

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    try {
      const res = await BaseApi.getRequest('/superadmin/getall-coupon');
      if (Array.isArray(res.data)) {
        setCoupons(res.data);
      } else {
        console.error('Unexpected response:', res.data);
      }
    } catch (error) {
      console.error('Error fetching coupons:', error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    // const [year, month, day] = form.expiryDate.split("-").map(Number);
    //   const expiryDateISO = new Date(Date.UTC(year, month - 1, day)).toISOString();
      
      // const submitData = {
      //   ...form,
      //   expiryDate: expiryDateISO,
      //   discountValue: parseFloat(form.discountValue.toString()),
      //   maxUsage: parseInt(form.maxUsage.toString(), 10),
      // };
    try {
      if (editingCoupon) {
        await BaseApi.putRequest(`/superadmin/update-coupon/${editingCoupon.id}`, {
          ...form,
          discountValue: parseFloat(form.discountValue.toString()),
          maxUsage: parseInt(form.maxUsage.toString(), 10),
        });
      } else {
        await BaseApi.postRequest('/superadmin/create-coupon', {
          ...form,
          discountValue: parseFloat(form.discountValue.toString()),
          maxUsage: parseInt(form.maxUsage.toString(), 10),
        });
      }
  
      fetchCoupons();
      resetForm();
    } catch (error) {
      console.error('Error saving coupon:', (error as any).response || (error as any).message);
    }
  };
  

  const resetForm = () => {
    setShowModal(false);
    setEditingCoupon(null);
    setForm(defaultCoupon);
  };

  const handleEdit = (coupon: Coupon) => {
    setEditingCoupon(coupon);
    setForm({
      ...coupon,
      expiryDate: coupon.expiryDate.split('T')[0],
    });
    setShowModal(true);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this coupon?')) return;
    try {
      await BaseApi.deleteRequest(`/superadmin/delete-coupon/${id}`);
      fetchCoupons();
    } catch (error) {
      console.error('Error deleting coupon:', error);
    }
  };

  return (
    <div className="page-wrapper">
      <div className="container mt-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h4>Coupon Management</h4>
          <Button onClick={() => setShowModal(true)}>+ Add Coupon</Button>
        </div>

        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>Code</th>
              <th>Type</th>
              <th>Value</th>
              <th>Expiry</th>
              <th>Max Usage</th>
              <th>Used</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {coupons.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center">No coupons available</td>
              </tr>
            ) : (
              coupons.map((coupon) => (
                <tr key={coupon.id}>
                  <td>{coupon.code}</td>
                  <td>{coupon.discountType}</td>
                  <td>{coupon.discountValue}</td>
                  <td>{new Date(coupon.expiryDate).toLocaleDateString()}</td>
                  <td>{coupon.maxUsage}</td>
                  <td>{coupon.usedCount}</td>
                  <td>
                    <Button variant="warning" size="sm" onClick={() => handleEdit(coupon)}>Edit</Button>{' '}
                    <Button variant="danger" size="sm" onClick={() => handleDelete(coupon.id)}>Delete</Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </Table>

        {/* Add/Edit Modal */}
        <Modal show={showModal} onHide={resetForm}>
          <Modal.Header closeButton>
            <Modal.Title>{editingCoupon ? 'Edit Coupon' : 'Add Coupon'}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Code</Form.Label>
                <Form.Control
                  type="text"
                  name="code"
                  value={form.code}
                  onChange={handleChange}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Discount Type</Form.Label>
                <Form.Select name="discountType" value={form.discountType} onChange={handleChange}>
                  <option value="PERCENTAGE">Percentage</option>
                  <option value="FLAT">Flat</option>
                </Form.Select>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Discount Value</Form.Label>
                <Form.Control
                  type="number"
                  name="discountValue"
                  value={form.discountValue}
                  onChange={handleChange}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Expiry Date</Form.Label>
                <Form.Control
                  type="date"
                  name="expiryDate"
                  value={form.expiryDate}
                  onChange={handleChange}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Max Usage</Form.Label>
                <Form.Control
                  type="number"
                  name="maxUsage"
                  value={form.maxUsage}
                  onChange={handleChange}
                />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={resetForm}>Cancel</Button>
            <Button variant="primary" onClick={handleSubmit}>
              {editingCoupon ? 'Update' : 'Create'}
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  );
};

export default CouponManager;
