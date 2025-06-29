import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { all_routes } from "../../../../../router/all_routes";
import StudentModals from "../studentModals";
import StudentSidebar from "./studentSidebar";
import StudentBreadcrumb from "./studentBreadcrumb";
import ImageWithBasePath from "../../../../../core/common/imageWithBasePath";
import useMobileDetection from "../../../../../core/common/mobileDetection";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getStudentLibraryBooks, mockLibraryData, IBookIssue } from "../../../../../services/student/StudentAllApi";

const StudentLibrary = () => {
  const routes = all_routes;
  const isMobile = useMobileDetection();
  const [libraryData, setLibraryData] = useState<{ books: any[] }>(mockLibraryData);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState('This Year');

  useEffect(() => {
    const fetchLibraryData = async () => {
      try {
        setIsLoading(true);
        const response = await getStudentLibraryBooks();
        
        if (response.data.success) {
          setLibraryData(response.data);
          toast.success('Library data loaded successfully!', { autoClose: 3000 });
        } else {
          throw new Error('Failed to load library data');
        }
      } catch (error: any) {
        console.error('Error fetching library data:', error);
        toast.warning('Using sample data due to API error', { autoClose: 3000 });
        // Keep using mock data
      } finally {
        setIsLoading(false);
      }
    };

    fetchLibraryData();
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const getDaysRemaining = (dueDate: string) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getStatusBadge = (dueDate: string) => {
    const daysRemaining = getDaysRemaining(dueDate);
    
    if (daysRemaining < 0) {
      return (
        <span className="badge bg-danger">
          <i className="bi bi-exclamation-triangle me-1"></i>
          Overdue
        </span>
      );
    } else if (daysRemaining <= 3) {
      return (
        <span className="badge bg-warning">
          <i className="bi bi-clock me-1"></i>
          Due Soon
        </span>
      );
    } else {
      return (
        <span className="badge bg-success">
          <i className="bi bi-check-circle me-1"></i>
          Active
        </span>
      );
    }
  };

  if (isLoading) {
    return (
      <div className={isMobile ? "page-wrapper" : "p-3"}>
        <ToastContainer position="top-center" autoClose={3000} theme="colored" />
        <div className="content">
          <div className="row">
            <div className="col-12">
              <div className="card">
                <div className="card-body text-center py-5">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                  <p className="mt-3 text-muted">Loading library data...</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className={isMobile ? "page-wrapper" : "p-3"}>
        <ToastContainer position="top-center" autoClose={3000} theme="colored" />
        <div className="content">
          <div className="row">
            <div className="col-12 d-flex flex-column">
              <div className="row">
                <div className="col-md-12">
                  <div className="card border-0 shadow-sm">
                    <div className="card-header bg-white border-0 d-flex align-items-center justify-content-between">
                      <h5 className="fw-bold text-dark">
                        <i className="bi bi-book me-2"></i>
                        My Library Books
                      </h5>
                      <div className="dropdown">
                        <button
                          className="btn btn-outline-primary dropdown-toggle"
                          type="button"
                          data-bs-toggle="dropdown"
                        >
                          <i className="bi bi-calendar me-2" />
                          {selectedPeriod}
                        </button>
                        <ul className="dropdown-menu p-3">
                          <li>
                            <button 
                              className="dropdown-item rounded-1"
                              onClick={() => setSelectedPeriod('This Year')}
                            >
                              This Year
                            </button>
                          </li>
                          <li>
                            <button 
                              className="dropdown-item rounded-1"
                              onClick={() => setSelectedPeriod('This Month')}
                            >
                              This Month
                            </button>
                          </li>
                          <li>
                            <button 
                              className="dropdown-item rounded-1"
                              onClick={() => setSelectedPeriod('This Week')}
                            >
                              This Week
                            </button>
                          </li>
                        </ul>
                      </div>
                    </div>
                    <div className="card-body pb-1">
                      {libraryData.books.length > 0 ? (
                      <div className="row">
                          {libraryData.books.map((book) => (
                            <div className="col-xxl-4 col-md-6 d-flex" key={book.id}>
                              <div className="card mb-3 flex-fill border-0 shadow-sm">
                            <div className="card-body pb-1">
                                  <div className="d-flex align-items-center mb-3">
                                    <span className="avatar avatar-xl mb-0 me-3">
                                <ImageWithBasePath
                                        src={book.coverImage || "assets/img/books/book-01.jpg"}
                                  className="img-fluid rounded"
                                        alt="Book Cover"
                                      />
                                    </span>
                                    <div className="flex-grow-1">
                                      <h6 className="mb-2 fw-bold text-dark">{book.title}</h6>
                                      {getStatusBadge(book.dueDate)}
                                </div>
                                  </div>
                              <div className="row">
                                <div className="col-sm-6">
                                  <div className="mb-3">
                                        <span className="fs-12 mb-1 text-muted">
                                          <i className="bi bi-calendar-plus me-1"></i>
                                          Book taken on
                                    </span>
                                        <p className="text-dark fw-medium mb-0">
                                          {formatDate(book.issueDate)}
                                        </p>
                                  </div>
                                </div>
                                <div className="col-sm-6">
                                  <div className="mb-3">
                                        <span className="fs-12 mb-1 text-muted">
                                          <i className="bi bi-calendar-x me-1"></i>
                                          Due Date
                                    </span>
                                        <p className="text-dark fw-medium mb-0">
                                          {formatDate(book.dueDate)}
                                        </p>
                          </div>
                        </div>
                                  </div>
                                  <div className="mt-3 pt-3 border-top">
                                    <div className="d-flex justify-content-between align-items-center">
                                      <span className="text-muted small">
                                        <i className="bi bi-clock me-1"></i>
                                        {getDaysRemaining(book.dueDate) > 0 
                                          ? `${getDaysRemaining(book.dueDate)} days remaining`
                                          : `${Math.abs(getDaysRemaining(book.dueDate))} days overdue`
                                        }
                                    </span>
                                      <button
                                        className="btn btn-sm btn-outline-primary"
                                        onClick={() => toast.info('Return book functionality coming soon!', { autoClose: 3000 })}
                                      >
                                        <i className="bi bi-arrow-return-left me-1"></i>
                                        Return
                                      </button>
                                </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-5">
                          <i className="bi bi-book display-4 text-muted mb-3"></i>
                          <h5>No books borrowed</h5>
                          <p className="text-muted">You haven't borrowed any books from the library yet.</p>
                          <button
                            className="btn btn-primary"
                            onClick={() => toast.info('Browse library functionality coming soon!', { autoClose: 3000 })}
                          >
                            <i className="bi bi-search me-2"></i>
                            Browse Library
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <StudentModals />
    </>
  );
};

export default StudentLibrary;
