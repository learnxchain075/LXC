import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AxiosResponse } from 'axios';
import {
  getResourcesByStudentId,
  IAssignment,
  IHomework,
  IPyq,
  submitHomework,
  ISubmitHomeworkResponse,
  submitAssignment,
  ISubmitAssignmentResponse,
} from '../../../../../services/student/StudentAllApi';
import './AcademicResources.css';
import { useSelector } from 'react-redux';
import ReactDOM from 'react-dom';

interface UploadFile {
  uid: string;
  name: string;
  status?: string;
  originFileObj?: File;
}

type AcademicResourceCategory = 'Assignment' | 'PYQ' | 'Homework';

interface AcademicResourceItem {
  key: string;
  id: string;
  title: string;
  description: string;
  dueDate?: string;
  submissionDate?: string | null;
  attachment?: string | null;
  status?: string;
  subject?: string;
  isSubmitted?: boolean;
}

interface AcademicResourcesData {
  Assignment: { pending: AcademicResourceItem[]; submitted: AcademicResourceItem[] };
  Homework: { pending: AcademicResourceItem[]; submitted: AcademicResourceItem[] };
  PYQ: { pending: AcademicResourceItem[]; submitted: AcademicResourceItem[] };
}

// Helper functions
const formatDate = (dateString?: string | null): string => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return 'N/A';
  return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
};

const getStatusBadge = (status?: string, dueDate?: string) => {
  if (status === 'Submitted') {
    return <span className="badge bg-success">Submitted</span>;
  }
  if (dueDate && new Date(dueDate) < new Date()) {
    return <span className="badge bg-danger">Overdue</span>;
  }
  return <span className="badge bg-warning text-dark">Pending</span>;
};

class ErrorBoundary extends React.Component<{children: React.ReactNode}, {hasError: boolean, error: Error | null}> {
  constructor(props: {children: React.ReactNode}) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }
  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="alert alert-danger m-3">
          <h5>Something went wrong.</h5>
          <p>Please try refreshing the page or contact support.</p>
          <button className="btn btn-primary" onClick={() => window.location.reload()}>Refresh Page</button>
        </div>
      );
    }
    return this.props.children;
  }
}

const AcademicResources: React.FC = () => {
  const [data, setData] = useState<AcademicResourcesData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [openCategory, setOpenCategory] = useState<AcademicResourceCategory | null>(null);
  const [showUpload, setShowUpload] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [previewFile, setPreviewFile] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<AcademicResourceItem | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<AcademicResourceCategory | null>(null);
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'pending' | 'submitted'>('pending');
  const [pendingPage, setPendingPage] = useState(1);
  const [submittedPage, setSubmittedPage] = useState(1);
  const pageSize = 5;
    const dataTheme = useSelector((state: any) => state.themeSetting.dataTheme);

  // Add state for title/description modal
  const [showTitleModal, setShowTitleModal] = useState(false);
  const [modalTitle, setModalTitle] = useState<string | null>(null);
  const [modalDescription, setModalDescription] = useState<string | null>(null);


  useEffect(() => {
    const studentId = localStorage.getItem('studentId');
    if (!studentId) {
      setIsLoading(false);
      setError('Student ID not found');
      return;
    }

    const fetchResources = async () => {
      try {
        setIsLoading(true);
        setError(null);
        console.log('Fetching resources for student:', studentId);
        
        const response = await getResourcesByStudentId(studentId);
        console.log('API Response:', response.data);
        
        if (response.data.success) {
          // Process assignments
          const assignments: AcademicResourceItem[] = response.data.assignments.map((item: IAssignment) => {
            const submission = item.AssignmentSubmission?.[0];
            return {
              key: item.id,
              id: item.id,
              title: item.title,
              description: item.description,
              dueDate: item.dueDate,
              submissionDate: submission?.submittedAt || null,
              // Show student's uploaded file if submitted, else teacher's attachment
              attachment: submission?.file || item.attachment,
              status: submission ? 'Submitted' : item.status,
              subject: item.subject?.name || 'N/A',
              isSubmitted: !!submission,
            };
          });

          // Process homeworks with submission data
          const homeworks: AcademicResourceItem[] = response.data.homeworks.map((item: IHomework) => {
            const submission = item.HomeworkSubmission?.[0];
            return {
              key: item.id,
              id: item.id,
              title: item.title,
              description: item.description,
              dueDate: item.dueDate,
              submissionDate: submission?.submittedAt || null,
              // Use student's file if submitted, else teacher's attachment
              attachment: submission?.file || item.attachment,
              status: submission ? 'Submitted' : item.status,
              subject: item.subject?.name || 'N/A',
              isSubmitted: !!submission,
            };
          });

          // Process PYQs
          const pyqs: AcademicResourceItem[] = response.data.pyqs.map((item: IPyq) => ({
            key: item.id,
            id: item.id,
            title: `${item.subject} - ${item.topic}`,
            description: 'Previous Year Question',
            dueDate: undefined,
            submissionDate: null,
            attachment: item.question,
            status: undefined,
            subject: item.subject,
            isSubmitted: false,
          }));

          // Separate pending and submitted items
          const processedData: AcademicResourcesData = {
            Assignment: {
              pending: assignments.filter(item => !item.isSubmitted),
              submitted: assignments.filter(item => item.isSubmitted),
            },
            Homework: {
              pending: homeworks.filter(item => !item.isSubmitted),
              submitted: homeworks.filter(item => item.isSubmitted),
            },
            PYQ: { 
              pending: pyqs, 
              submitted: [] 
            },
          };

          setData(processedData);
        } else {
          throw new Error('Failed to fetch resources');
        }
      } catch (error: any) {
       // console.error('Error fetching resources:', error);
        const errorMessage = error.response?.data?.error || error.message || 'Failed to load academic resources';
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    fetchResources();
  }, []);

  const toggleCategory = (category: AcademicResourceCategory) => {
    const newCategory = openCategory === category ? null : category;
    setOpenCategory(newCategory);
  };

  const openUploadModal = (item: AcademicResourceItem, category: AcademicResourceCategory) => {
    setSelectedItem(item);
    setSelectedCategory(category);
    setShowUpload(true);
    setFileList([]);
  };

  const closeUploadModal = () => {
    setShowUpload(false);
    setSelectedItem(null);
    setSelectedCategory(null);
    setFileList([]);
  };

  const [previewDescription, setPreviewDescription] = useState<string | null>(null);
  const openPreviewModal = (link: string | null, description?: string | null) => {
    if (link) {
      setPreviewFile(link);
      setPreviewDescription(description || null);
      setShowPreview(true);
    }
  };
  const closePreviewModal = () => {
    setShowPreview(false);
    setPreviewFile(null);
    setPreviewDescription(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const isValidType =
        file.type === 'application/pdf' ||
        file.type === 'application/msword' ||
        file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
        file.type.startsWith('image/');
      if (!isValidType) {
        return;
      }
      const maxSize = 10 * 1024 * 1024; // 10MB
      if (file.size > maxSize) {
        return;
      }
      setFileList([{ uid: `-${Date.now()}`, name: file.name, status: 'done', originFileObj: file }]);
    }
  };

  const handleUpload = async () => {
    if (!fileList.length || !selectedItem || !selectedCategory) {
      return;
    }

    const studentId = localStorage.getItem('studentId');
    if (!studentId) {
      return;
    }

    setUploading(true);
    try {
      const file = fileList[0].originFileObj as File;
      if (!file) {
        throw new Error('No file selected for upload');
      }

      // Create FormData for file upload
      const formData = new FormData();
      formData.append('studentId', studentId);
      
      if (selectedCategory === 'Homework') {
        formData.append('homeworkId', selectedItem.id);
      } else {
        formData.append('assignmentId', selectedItem.id);
      }
      formData.append('file', file);

      console.log('Submitting form data:', {
        studentId,
        [selectedCategory === 'Homework' ? 'homeworkId' : 'assignmentId']: selectedItem.id,
        fileName: file.name,
        fileSize: file.size
      });

      let response: AxiosResponse<ISubmitHomeworkResponse | ISubmitAssignmentResponse>;
      
      if (selectedCategory === 'Homework') {
        response = await submitHomework(formData);
      } else {
        response = await submitAssignment(formData);
      }

      //console.log('Submission response:', response.data);

      if (response.status >= 200 && response.status < 300) {
        toast.success('Submission successful!', { autoClose: 3000 });
        
        // Update the data to move item from pending to submitted
        setData((prev) => {
          if (!prev) return prev;
          
          const updatedItem = { 
            ...selectedItem, 
            status: 'Submitted', 
            submissionDate: new Date().toISOString(),
            isSubmitted: true
          };
          
          const updatedPending = prev[selectedCategory].pending.filter(item => item.id !== selectedItem.id);
          const updatedSubmitted = [updatedItem, ...prev[selectedCategory].submitted];
          
          return {
            ...prev,
            [selectedCategory]: { 
              pending: updatedPending, 
              submitted: updatedSubmitted 
            },
          };
        });
        
        closeUploadModal();
      } else {
        throw new Error(response.data.message || 'Submission failed');
      }
    } catch (error: any) {
     // console.error('Upload error:', error);
      const errorMessage = error.response?.data?.error || error.response?.data?.message || error.message || 'Failed to submit. Please try again.';
      toast.error(errorMessage, { autoClose: 3000 });
    } finally {
      setUploading(false);
    }
  };

  // Pagination helper
  const paginate = (items: AcademicResourceItem[], page: number) => 
    items.slice((page - 1) * pageSize, page * pageSize);
  
  const totalPages = (items: AcademicResourceItem[]) => Math.ceil(items.length / pageSize);

  // Table renderer
  const renderTable = (items: AcademicResourceItem[]) => (
    <div className="table-responsive">
      <table className={`table table-bordered table-hover align-middle${dataTheme === 'dark_data_theme' ? ' table-dark text-light border-secondary' : ''}`}>
        <thead className={dataTheme === 'dark_data_theme' ? 'table-dark text-light border-secondary' : 'table-light'}>
          <tr>
            <th>Title</th>
            <th>Subject</th>
            {openCategory === 'PYQ' ? (
              <th>Question</th>
            ) : (
              <>
                <th>Due Date</th>
                <th>Status</th>
                <th>Submission Date</th>
                <th>Attachment</th>
                <th>Action</th>
              </>
            )}
          </tr>
        </thead>
        <tbody>
          {items.length === 0 ? (
            <tr>
              <td colSpan={openCategory === 'PYQ' ? 3 : 8} className="text-center text-muted py-4">
                No data available
              </td>
            </tr>
          ) : (
            items.map((item) => (
              <tr key={item.key}>
                <td>
                  <div
                    className="text-truncate cursor-pointer"
                    style={{ maxWidth: 200 }}
                    title={item.title}
                    onClick={() => {
                      setModalTitle(item.title);
                      setModalDescription(item.description);
                      setShowTitleModal(true);
                    }}
                  >
                    {item.title}
                  </div>
                </td>
                <td>
                  <span className="badge bg-primary">{item.subject}</span>
                </td>
                {openCategory === 'PYQ' ? (
                  <td>
                    {item.attachment ? (
                      <div className="btn-group btn-group-sm">
                        <button 
                          className={`btn btn-outline-primary${dataTheme === 'dark_data_theme' ? ' btn-outline-light text-light border-secondary' : ''}`} 
                          onClick={() => window.open(item.attachment!, '_blank')}
                        >
                          <i className={`bi bi-download me-1${dataTheme === 'dark_data_theme' ? ' text-light' : ''}`}></i>Download
                        </button>
                        <button 
                          className={`btn btn-outline-success${dataTheme === 'dark_data_theme' ? ' btn-outline-light text-light border-secondary' : ''}`} 
                          onClick={() => openPreviewModal(item.attachment!)}
                        >
                          <i className={`bi bi-eye me-1${dataTheme === 'dark_data_theme' ? ' text-light' : ''}`}></i>Preview
                        </button>
                      </div>
                    ) : (
                      <span className="text-muted">N/A</span>
                    )}
                  </td>
                ) : (
                  <>
                    <td>
                      <div className="d-flex align-items-center">
                        <i className={`bi bi-calendar3 text-muted me-2${dataTheme === 'dark_data_theme' ? ' text-light' : ''}`}></i>
                        <span className={item.dueDate && new Date(item.dueDate) < new Date() ? 'text-danger fw-medium' : ''}>
                          {formatDate(item.dueDate)}
                        </span>
                      </div>
                    </td>
                    <td>{getStatusBadge(item.status, item.dueDate)}</td>
                    <td>{formatDate(item.submissionDate)}</td>
                    <td>
                      {item.attachment ? (
                        <button
                          className={`btn btn-outline-success btn-sm${dataTheme === 'dark_data_theme' ? ' btn-outline-light text-light border-secondary' : ''}`}
                          onClick={() => openPreviewModal(item.attachment ?? null, item.description ?? null)}
                        >
                          <i className={`bi bi-eye me-1${dataTheme === 'dark_data_theme' ? ' text-light' : ''}`}></i>View
                        </button>
                      ) : (
                        <span className="text-muted">N/A</span>
                      )}
                    </td>
                    <td>
                      <button
                        className={`btn btn-sm ${item.isSubmitted ? 'btn-secondary disabled' : 'btn-primary'}${dataTheme === 'dark_data_theme' ? ' btn-outline-light text-light border-secondary' : ''}`}
                        disabled={item.isSubmitted || uploading}
                        onClick={() => openUploadModal(item, openCategory!)}
                        title={item.isSubmitted ? 'Already submitted' : 'Upload your file'}
                      >
                        <i className={`bi bi-upload me-1${dataTheme === 'dark_data_theme' ? ' text-light' : ''}`}></i>
                        {item.isSubmitted ? 'Submitted' : 'Upload'}
                      </button>
                    </td>
                  </>
                )}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );

  // Pagination component
  const renderPagination = (items: AcademicResourceItem[], currentPage: number, setPage: (page: number) => void) => {
    const total = totalPages(items);
    if (total <= 1) return null;

    return (
      <nav aria-label="Table pagination">
        <ul className="pagination justify-content-end mb-0">
          <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
            <button className="page-link" onClick={() => setPage(currentPage - 1)} disabled={currentPage === 1}>
              Previous
            </button>
          </li>
          {[...Array(total).keys()].map((i) => (
            <li key={i} className={`page-item ${currentPage === i + 1 ? 'active' : ''}`}>
              <button className="page-link" onClick={() => setPage(i + 1)}>
                {i + 1}
              </button>
            </li>
          ))}
          <li className={`page-item ${currentPage === total ? 'disabled' : ''}`}>
            <button className="page-link" onClick={() => setPage(currentPage + 1)} disabled={currentPage === total}>
              Next
            </button>
          </li>
        </ul>
      </nav>
    );
  };

  if (isLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: 400 }}>
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3 text-muted">Loading academic resources...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4">
        <div className="alert alert-danger d-flex justify-content-between align-items-start">
          <div>
            <h5 className="alert-heading">Error Loading Resources</h5>
            <p className="mb-0">{error}</p>
          </div>
          <button className="btn btn-outline-primary btn-sm" onClick={() => window.location.reload()}>
            <i className="bi bi-arrow-clockwise me-1"></i>Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className={`card shadow-lg border-0 rounded-4 m-3${dataTheme === 'dark_data_theme' ? ' bg-dark text-light border-secondary' : ''}`}>
        <ToastContainer position="top-center" autoClose={3000} theme={dataTheme === 'dark_data_theme' ? 'dark' : 'colored'} />
        
        <div className={`card-header py-4${dataTheme === 'dark_data_theme' ? ' bg-dark text-light border-secondary rounded-top-4' : ' bg-white'}`}>
          <div className="d-flex align-items-center">
            <i className={`bi bi-journal-bookmark fs-2 me-3${dataTheme === 'dark_data_theme' ? ' text-light' : ' text-primary'}`}></i>
            <h4 className="mb-0 fw-semibold">Academic Resources</h4>
          </div>
        </div>

        <div className={`card-body p-4${dataTheme === 'dark_data_theme' ? ' bg-dark text-light' : ''}`}>
          {/* Category Selection */}
          <div className="row g-3 mb-4">
            {(['Assignment', 'PYQ', 'Homework'] as AcademicResourceCategory[]).map((category) => {
              const categoryData = data?.[category];
              const totalItems = (categoryData?.pending.length || 0) + (categoryData?.submitted.length || 0);
              
              return (
                <div key={category} className="col-md-4">
                  <div
                    className={`card h-100 cursor-pointer border-2 transition-all rounded-4 shadow${dataTheme === 'dark_data_theme' ? (openCategory === category ? ' bg-primary bg-opacity-10 border-primary text-light' : ' bg-dark border-secondary text-light') : (openCategory === category ? ' border-primary bg-primary bg-opacity-10' : ' border-light')}`}
                    onClick={() => toggleCategory(category)}
                    role="button"
                    style={{ cursor: 'pointer' }}
                  >
                    <div className="card-body text-center py-4">
                      <div className={`fs-1 mb-3 ${openCategory === category ? 'text-primary' : 'text-muted'}`}>
                        {category === 'Assignment' && <i className="bi bi-file-earmark-text"></i>}
                        {category === 'Homework' && <i className="bi bi-book"></i>}
                        {category === 'PYQ' && <i className="bi bi-calendar3"></i>}
                      </div>
                      <h5 className={`fw-semibold mb-2 ${openCategory === category ? 'text-primary' : 'text-dark'}`}>
                        {category}
                      </h5>
                      <p className="text-muted mb-0">{totalItems} items</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Content Area */}
          {openCategory && data ? (
            <div className="bg-light rounded-3 p-4">
              {/* Tabs */}
              <ul className="nav nav-tabs mb-4" role="tablist">
                <li className="nav-item" role="presentation">
                  <button
                    className={`nav-link ${activeTab === 'pending' ? 'active' : ''}`}
                    onClick={() => setActiveTab('pending')}
                    type="button"
                  >
                    Pending 
                    <span className="badge bg-secondary ms-2">{data[openCategory].pending.length}</span>
                  </button>
                </li>
                <li className="nav-item" role="presentation">
                  <button
                    className={`nav-link ${activeTab === 'submitted' ? 'active' : ''}`}
                    onClick={() => setActiveTab('submitted')}
                    type="button"
                  >
                    Submitted 
                    <span className="badge bg-success ms-2">{data[openCategory].submitted.length}</span>
                  </button>
                </li>
              </ul>

              {/* Tab Content */}
              <div className="tab-content">
                <div className={`tab-pane fade ${activeTab === 'pending' ? 'show active' : ''}`}>
                  {renderTable(paginate(data[openCategory].pending, pendingPage))}
                  {renderPagination(data[openCategory].pending, pendingPage, setPendingPage)}
                </div>
                <div className={`tab-pane fade ${activeTab === 'submitted' ? 'show active' : ''}`}>
                  {renderTable(paginate(data[openCategory].submitted, submittedPage))}
                  {renderPagination(data[openCategory].submitted, submittedPage, setSubmittedPage)}
                </div>
              </div>
            </div>
          ) : (
            <div className={`text-center py-5${dataTheme === 'dark_data_theme' ? ' bg-dark text-light rounded-4 shadow' : ''}`}>
              <i className="bi bi-journal-bookmark display-1 text-muted mb-4"></i>
              <h3 className={dataTheme === 'dark_data_theme' ? 'text-light' : 'text-muted'}>Select a category to view resources</h3>
              <p className={dataTheme === 'dark_data_theme' ? 'text-light' : 'text-muted'}>Choose from Assignment, PYQ, or Homework to see available academic resources</p>
            </div>
          )}
        </div>

        {/* Upload Modal */}
        <div className={`modal fade ${showUpload ? 'show d-block' : ''}`} 
             tabIndex={-1} 
             style={{ backgroundColor: showUpload ? 'rgba(0,0,0,0.5)' : undefined }}>
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className={`modal-content rounded-4 shadow-lg${dataTheme === 'dark_data_theme' ? ' bg-dark text-light border-secondary' : ''}`}>
              <div className="modal-header">
                <h5 className="modal-title">
                  <i className="bi bi-upload text-primary me-2"></i>
                  Upload {selectedCategory} - {selectedItem?.title}
                </h5>
                <button type="button" className="btn-close" onClick={closeUploadModal}></button>
              </div>
              <div className="modal-body">
                <div className="alert alert-info">
                  <h6 className="alert-heading">Upload Guidelines:</h6>
                  <ul className="mb-0">
                    <li>Supported formats: PDF, DOC, DOCX, JPG, PNG</li>
                    <li>Maximum file size: 10MB</li>
                    <li>Make sure your file is clearly labeled</li>
                  </ul>
                </div>
                
                <div className="mb-3">
                  <label className="form-label">Select File</label>
                  <input 
                    type="file" 
                    className="form-control" 
                    onChange={handleFileChange} 
                    accept=".pdf,.doc,.docx,image/*"
                  />
                </div>
                
                {fileList.length > 0 && (
                  <div className="alert alert-success d-flex justify-content-between align-items-center">
                    <div>
                      <i className="bi bi-check-circle me-2"></i>
                      <strong>Selected file:</strong> {fileList[0].name}
                    </div>
                    <button 
                      className="btn btn-sm btn-outline-danger" 
                      onClick={() => setFileList([])}
                    >
                      <i className="bi bi-x"></i>
                    </button>
                  </div>
                )}
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={closeUploadModal}>
                  Cancel
                </button>
                <button 
                  type="button" 
                  className="btn btn-primary" 
                  onClick={handleUpload} 
                  disabled={uploading || !fileList.length}
                >
                  {uploading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                      Uploading...
                    </>
                  ) : (
                    'Submit'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Portal for Preview Modal */}
        {showPreview && ReactDOM.createPortal(
          <div
            className={`modal fade show d-block`}
            tabIndex={-1}
            style={{ backgroundColor: 'rgba(0,0,0,0.7)', zIndex: 2000, position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh' }}
            onClick={e => { if (e.target === e.currentTarget) closePreviewModal(); }}
          >
            <div className="modal-dialog modal-xl modal-dialog-centered" style={{ zIndex: 2100 }}>
              <div className={`modal-content${dataTheme === 'dark_data_theme' ? ' bg-dark text-light' : ''}`}> 
                <div className="modal-header">
                  <h5 className="modal-title">
                    <i className="bi bi-eye text-success me-2"></i>
                    File Preview
                  </h5>
                  <button type="button" className="btn-close" onClick={closePreviewModal}></button>
                </div>
                <div className="modal-body p-0" style={{ height: '70vh' }}>
                  {previewFile && previewFile.match(/\.(jpeg|jpg|png|gif|bmp|webp)$/i) ? (
                    <img src={previewFile} alt="Preview" className="w-100 h-100 object-fit-contain" style={{ maxHeight: '65vh', display: 'block', margin: '0 auto' }} />
                  ) : previewFile ? (
                    <div className="d-flex flex-column align-items-center justify-content-center h-100">
                      <a href={previewFile} target="_blank" rel="noopener noreferrer" className="btn btn-primary mb-3">Download File</a>
                    </div>
                  ) : (
                    <div className="text-center text-muted py-5">No file to preview</div>
                  )}
                  {previewDescription && (
                    <div className="p-3">
                      <h6>Description</h6>
                      <p>{previewDescription}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>,
          document.body
        )}

        {/* Portal for Title/Description Modal */}
        {showTitleModal && ReactDOM.createPortal(
          <div
            className={`modal fade show d-block`}
            tabIndex={-1}
            style={{ backgroundColor: 'rgba(0,0,0,0.7)', zIndex: 2000, position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh' }}
            onClick={e => { if (e.target === e.currentTarget) setShowTitleModal(false); }}
          >
            <div className="modal-dialog modal-md modal-dialog-centered" style={{ zIndex: 2100 }}>
              <div className={`modal-content${dataTheme === 'dark_data_theme' ? ' bg-dark text-light' : ''}`}>
                <div className="modal-header">
                  <h5 className="modal-title">{modalTitle}</h5>
                  <button type="button" className="btn-close" onClick={() => setShowTitleModal(false)}></button>
                </div>
                <div className="modal-body">
                  <h6>Description</h6>
                  <p>{modalDescription || 'No description available.'}</p>
                </div>
              </div>
            </div>
          </div>,
          document.body
        )}
      </div>
    </ErrorBoundary>
  );
};

export default AcademicResources;