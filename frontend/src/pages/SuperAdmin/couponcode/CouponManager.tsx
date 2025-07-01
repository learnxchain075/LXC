import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Form } from 'react-bootstrap';
import BaseApi from '../../../services/BaseApi';

const defaultCoupon = {
  code: '',
  discountType: 'PERCENTAGE',
  discountValue: 0,
  expiryDate: '',
  maxUsage: 1,
  planId: '',
};

type Coupon = {
  id: number;
  code: string;
  discountType: string;
  discountValue: number;
  expiryDate: string;
  maxUsage: number;
  usedCount: number;
  planName?: string;
  planId?: string;
};

const CouponManager = () => {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);
  const [form, setForm] = useState(defaultCoupon);
  const [plans, setPlans] = useState<{ id: string; name: string }[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    fetchCoupons();
    fetchPlans();
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

  const fetchPlans = async () => {
    try {
      const res = await BaseApi.getRequest('/super/plans');
      if (Array.isArray(res.data)) {
        setPlans(res.data);
      }
    } catch (error) {
      console.error('Error fetching plans:', error);
    }
  };

const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
  const { name, value } = e.target;
  setForm((prev) => ({ ...prev, [name]: value }));
  setErrors((prev) => ({ ...prev, [name]: '' }));
};

const handleSubmit = async () => {
    const validationErrors: Record<string, string> = {};
    if (!form.code.trim()) validationErrors.code = 'Required';
    if (!form.planId) validationErrors.planId = 'Required';
    if (!form.discountValue || Number(form.discountValue) <= 0) validationErrors.discountValue = 'Invalid value';
    if (!form.expiryDate) validationErrors.expiryDate = 'Required';
    if (!form.maxUsage || Number(form.maxUsage) <= 0) validationErrors.maxUsage = 'Invalid value';

    if (Object.keys(validationErrors).length) {
      setErrors(validationErrors);
      return;
    }

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
  setErrors({});
};

const handleEdit = (coupon: Coupon) => {
  setEditingCoupon(coupon);
  setForm({
    ...coupon,
    expiryDate: coupon.expiryDate.split('T')[0],
    planId: coupon.planId || '',
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
              <th>Plan</th>
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
                  <td>{coupon.planName || '-'}</td>
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
                  isInvalid={!!errors.code}
                />
                {errors.code && (
                  <Form.Control.Feedback type="invalid">
                    {errors.code}
                  </Form.Control.Feedback>
                )}
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Plan</Form.Label>
                <Form.Select name="planId" value={form.planId} onChange={handleChange} isInvalid={!!errors.planId}>
                  <option value="">Select Plan</option>
                  {plans.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </Form.Select>
                {errors.planId && (
                  <Form.Control.Feedback type="invalid">
                    {errors.planId}
                  </Form.Control.Feedback>
                )}
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
                  isInvalid={!!errors.discountValue}
                />
                {errors.discountValue && (
                  <Form.Control.Feedback type="invalid">
                    {errors.discountValue}
                  </Form.Control.Feedback>
                )}
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Expiry Date</Form.Label>
                <Form.Control
                  type="date"
                  name="expiryDate"
                  value={form.expiryDate}
                  onChange={handleChange}
                  isInvalid={!!errors.expiryDate}
                />
                {errors.expiryDate && (
                  <Form.Control.Feedback type="invalid">
                    {errors.expiryDate}
                  </Form.Control.Feedback>
                )}
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Max Usage</Form.Label>
                <Form.Control
                  type="number"
                  name="maxUsage"
                  value={form.maxUsage}
                  onChange={handleChange}
                  isInvalid={!!errors.maxUsage}
                />
                {errors.maxUsage && (
                  <Form.Control.Feedback type="invalid">
                    {errors.maxUsage}
                  </Form.Control.Feedback>
                )}
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
