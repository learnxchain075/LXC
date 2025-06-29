import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { createclass } from '../../services/teacher/registerclass';
import { getClassByschoolId } from '../../services/teacher/classServices';

interface IClassRegisterForm {
  name: string;
  capacity: number;
  schoolId: string;
  roomNumber?: string;
}

const ClassesRegister: React.FC = () => {
  const [form, setForm] = useState<IClassRegisterForm>({
    name: '',
    capacity: 1,
    schoolId: '',
    roomNumber: '',
  });
  const [loading, setLoading] = useState(false);
  const [allClasses, setAllClasses] = useState<any[]>([]);

  useEffect(() => {
    const schoolId = localStorage.getItem('schoolId') || '';
    setForm((prev) => ({ ...prev, schoolId }));
    if (schoolId) {
      getClassByschoolId(schoolId)
        .then(res => setAllClasses(res.data))
        .catch(() => setAllClasses([]));
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === 'capacity' ? Number(value) : value,
    }));
  };

  const validate = () => {
    if (!form.name.trim()) return 'Class name is required.';
    if (!form.capacity || form.capacity < 1) return 'Capacity must be at least 1.';
    if (!form.schoolId.trim()) return 'School ID is required.';
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const error = validate();
    if (error) {
      toast.error(error);
      return;
    }
    setLoading(true);
    try {
      const res = createclass(form);
      toast.success('Class registered successfully!');
      setForm({ name: '', capacity: 1, schoolId: '', roomNumber: '' });
    } catch (err: any) {
      if (err.response && err.response.data && err.response.data.error) {
        toast.error(err.response.data.error);
      } else {
        toast.error('Failed to register class.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-wrapper">
      <div className="container mt-4">
        <ToastContainer position="top-center" autoClose={3000} />
        <div className="card">
          <div className="card-header bg-light">
            <h4>Register New Class</h4>
          </div>
          <div className="card-body">
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">Class Name*</label>
                <input
                  type="text"
                  className="form-control"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Capacity*</label>
                <input
                  type="number"
                  className="form-control"
                  name="capacity"
                  value={form.capacity}
                  onChange={handleChange}
                  min={1}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Room Number</label>
                <input
                  type="text"
                  className="form-control"
                  name="roomNumber"
                  value={form.roomNumber}
                  onChange={handleChange}
                />
              </div>
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? 'Registering...' : 'Register Class'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClassesRegister; 