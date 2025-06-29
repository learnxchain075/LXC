import React, { useState, useEffect } from 'react';
import { createSection } from '../../services/teacher/sectionServices';
import { getClassByschoolId } from '../../services/teacher/classServices';
import { ToastContainer, toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import 'react-toastify/dist/ReactToastify.css';

interface Class {
  id: string;
  name: string;
  capacity: number;
  schoolId: string;
  section: string;
}

interface AddSectionFormData {
  name: string;
  classId: string;
  description?: string;
  capacity?: number;
}

const AddSection: React.FC = () => {
  const [formData, setFormData] = useState<AddSectionFormData>({
    name: '',
    classId: '',
    description: '',
    capacity: 1
  });
  const [classes, setClasses] = useState<Class[]>([]);
  const [sectionsByClass, setSectionsByClass] = useState<Record<string, any[]>>({});
  const [loading, setLoading] = useState(false);
  const [classesLoading, setClassesLoading] = useState(false);
  const [sectionsLoading, setSectionsLoading] = useState(false);
  const user = useSelector((state: any) => state.auth.userObj);
  const schoolId = localStorage.getItem('schoolId') || "";

  useEffect(() => {
    fetchClasses();
  }, []);

  useEffect(() => {
    if (classes.length > 0) {
      fetchAllSections(classes);
    }
   
  }, [classes]);

  const fetchClasses = async () => {
    if (!schoolId) {
      toast.error('School ID not found');
      return;
    }
    setClassesLoading(true);
    try {
      const response = await getClassByschoolId(schoolId);
      setClasses(response.data.data || response.data || []);
    } catch (error: any) {
      toast.error('Failed to fetch classes: ' + (error?.response?.data?.message || error.message));
    } finally {
      setClassesLoading(false);
    }
  };

  const fetchAllSections = async (classList: Class[]) => {
    setSectionsLoading(true);
    const sectionsMap: Record<string, any[]> = {};
    try {
      await Promise.all(
        classList.map(async (cls) => {
          try {
            const res = await import('../../services/teacher/sectionServices');
            const { getSections } = res;
            const secRes = await getSections(cls.id);
            sectionsMap[cls.id] = secRes.data.sections || secRes.data || [];
          } catch {
            sectionsMap[cls.id] = [];
          }
        })
      );
      setSectionsByClass(sectionsMap);
    } catch {
      setSectionsByClass({});
    } finally {
      setSectionsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'capacity' ? parseInt(value) || 0 : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast.error('Section name is required');
      return;
    }
    
    if (!formData.classId) {
      toast.error('Please select a class');
      return;
    }

    setLoading(true);
    try {
      const sectionData = {
        name: formData.name.trim(),
        classId: formData.classId,
        ...(formData.description && { description: formData.description }),
        ...(formData.capacity && { capacity: formData.capacity })
      };

      await createSection(sectionData);
      toast.success('Section created successfully!');
      
      // Reset form
      setFormData({
        name: '',
        classId: '',
        description: '',
        capacity: 1
      });
    } catch (error: any) {
      toast.error('Failed to create section: ' + (error?.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-wrapper">
      <div className="content">
        {/* Page Header */}
        <div className="page-header">
          <div className="row align-items-center">
            <div className="col">
              <h3 className="page-title">Add Section</h3>
              <ul className="breadcrumb">
                <li className="breadcrumb-item">
                  <a href="/admin-dashboard">Dashboard</a>
                </li>
                <li className="breadcrumb-item active">Add Section</li>
              </ul>
            </div>
          </div>
        </div>
        {/* /Page Header */}

        <div className="row">
          <div className="col-md-12">
            <div className="card">
              <div className="card-header">
                <h4 className="card-title">Create New Section</h4>
              </div>
              <div className="card-body">
                <form onSubmit={handleSubmit}>
                  <div className="row">
                    <div className="col-md-6">
                      <div className="form-group">
                        <label htmlFor="name" className="form-label">
                          Section Name <span className="text-danger">*</span>
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          placeholder="Enter section name"
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="col-md-6">
                      <div className="form-group">
                        <label htmlFor="classId" className="form-label">
                          Select Class <span className="text-danger">*</span>
                        </label>
                        <select
                          className="form-select"
                          id="classId"
                          name="classId"
                          value={formData.classId}
                          onChange={handleInputChange}
                          required
                          disabled={classesLoading}
                        >
                          <option value="">Select a class</option>
                          {classes.map(cls => (
                            <option key={cls.id} value={cls.id}>
                              {cls.name}
                            </option>
                          ))}
                        </select>
                        {classesLoading && <small className="text-muted">Loading classes...</small>}
                      </div>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-md-6">
                      <div className="form-group">
                        <label htmlFor="capacity" className="form-label">
                          Capacity
                        </label>
                        <input
                          type="number"
                          className="form-control"
                          id="capacity"
                          name="capacity"
                          value={formData.capacity}
                          onChange={handleInputChange}
                          placeholder="Enter section capacity"
                          min="1"
                          max="100"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-md-12">
                      <div className="form-group">
                        <label htmlFor="description" className="form-label">
                          Description
                        </label>
                        <textarea
                          className="form-control"
                          id="description"
                          name="description"
                          value={formData.description}
                          onChange={handleInputChange}
                          placeholder="Enter section description (optional)"
                          rows={3}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-md-12">
                      <div className="form-group">
                        <button
                          type="submit"
                          className="btn btn-primary"
                          disabled={loading || classesLoading}
                        >
                          {loading ? 'Creating...' : 'Create Section'}
                        </button>
                        <button
                          type="button"
                          className="btn btn-secondary ms-2"
                          onClick={() => {
                            setFormData({
                              name: '',
                              classId: '',
                              description: '',
                              capacity: 30
                            });
                          }}
                        >
                          Reset
                        </button>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>

        {/* After the form, show all classes and their sections */}
        <div className="row mt-5">
          <div className="col-md-12">
            <h4 className="mb-3">All Classes & Sections</h4>
            {classesLoading || sectionsLoading ? (
              <div>Loading classes and sections...</div>
            ) : classes.length === 0 ? (
              <div className="alert alert-warning">No classes found.</div>
            ) : (
              <div className="accordion" id="classSectionAccordion">
                {classes.map((cls, idx) => (
                  <div className="card mb-2" key={cls.id}>
                    <div className="card-header d-flex justify-content-between align-items-center" id={`heading${cls.id}`} style={{background: '#f8f9fa'}}>
                      <h5 className="mb-0">
                        <button className="btn btn-link fw-bold" type="button" data-bs-toggle="collapse" data-bs-target={`#collapse${cls.id}`} aria-expanded={idx === 0 ? 'true' : 'false'} aria-controls={`collapse${cls.id}`}>
                          {cls.name} <span className="badge bg-primary ms-2">Capacity: {cls.capacity}</span>
                        </button>
                      </h5>
                      <span className="badge bg-info">{(sectionsByClass[cls.id] || []).length} Section(s)</span>
                    </div>
                    <div id={`collapse${cls.id}`} className={`collapse${idx === 0 ? ' show' : ''}`} aria-labelledby={`heading${cls.id}`} data-bs-parent="#classSectionAccordion">
                      <div className="card-body">
                        {(sectionsByClass[cls.id] && sectionsByClass[cls.id].length > 0) ? (
                          <ul className="list-group">
                            {sectionsByClass[cls.id].map((section, sidx) => (
                              <li className="list-group-item d-flex justify-content-between align-items-center" key={section.id || sidx}>
                                <span className="fw-semibold">{section.name}</span>
                                {section.description && <span className="text-muted ms-2">{section.description}</span>}
                                {section.capacity && <span className="badge bg-secondary ms-2">Capacity: {section.capacity}</span>}
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <div className="text-muted">No sections found for this class.</div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      <ToastContainer position="top-center" autoClose={3000} />
    </div>
  );
};

export default AddSection; 