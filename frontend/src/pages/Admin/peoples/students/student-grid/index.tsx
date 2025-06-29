import React, { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { all_routes } from '../../../../../router/all_routes'
import PredefinedDateRanges from '../../../../../core/common/datePicker'
import { allClass, allSection, gender, names, status } from '../../../../../core/common/selectoption/selectoption'
import StudentModals from '../studentModals'
import CommonSelect from '../../../../../core/common/commonSelect'
import TooltipOption from '../../../../../core/common/tooltipOption'
import { IStudentForm } from '../../../../../services/types/auth'
import { getSchoolStudents } from '../../../../../services/admin/studentRegister'
import LoadingSkeleton from '../../../../../components/LoadingSkeleton'
import CollectFeesModal from '../../../../../components/CollectFeesModal'
import AddFeesModal from '../../../../../components/AddFeesModal'

const StudentGrid = () => {
  const routes = all_routes
  const dropdownMenuRef = useRef<HTMLDivElement | null>(null);
  const [studentList, setStudentList] = useState<IStudentForm[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCollectFeesModal, setShowCollectFeesModal] = useState(false);
  const [showAddFeesModal, setShowAddFeesModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<IStudentForm | null>(null);
  
  useEffect(()=>{
    const fetchStudentList = async () => {
      setLoading(true);
      try {
      
        const response = await getSchoolStudents(localStorage.getItem("schoolId") ?? ""); ; 
        // console.log("object",response.data);
        setStudentList(response.data);
      } catch (error) {
        console.error("Error fetching student list:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStudentList();
},[])
  const handleApplyClick = () => {
    if (dropdownMenuRef.current) {
      dropdownMenuRef.current.classList.remove('show');
    }
  };

  const handleCollectFees = (student: IStudentForm) => {
    setSelectedStudent(student);
    setShowCollectFeesModal(true);
  };

  const handleAddFees = (student: IStudentForm) => {
    setSelectedStudent(student);
    setShowAddFeesModal(true);
  };

  const getStatusColor = (status: string) => {
    return status === 'ACTIVE' ? 'success' : 'danger';
  };

  return (
    <>
      {/* Page Wrapper */}
      <div className="page-wrapper">
        <div className="content content-two">
          {/* Page Header */}
          <div className="d-md-flex d-block align-items-center justify-content-between mb-3">
            <div className="my-auto mb-2">
              <h3 className="page-title mb-1">Students</h3>
              <nav>
                <ol className="breadcrumb mb-0">
                  <li className="breadcrumb-item">
                    <Link to={routes.adminDashboard}>Dashboard</Link>
                  </li>
                  <li className="breadcrumb-item">Peoples</li>
                  <li className="breadcrumb-item active" aria-current="page">
                    Students Grid
                  </li>
                </ol>
              </nav>
            </div>
            <div className="d-flex my-xl-auto right-content align-items-center flex-wrap">
              <TooltipOption />

              <div className="mb-2">
                <Link
                  to={routes.addStudent}
                  className="btn btn-primary d-flex align-items-center"
                >
                  <i className="ti ti-square-rounded-plus me-2" />
                  Add Student
                </Link>
              </div>
            </div>
          </div>
          {/* /Page Header */}
          {/* Filter */}
          <div className="bg-white p-3 border rounded-1 d-flex align-items-center justify-content-between flex-wrap mb-4 pb-0">
            <h4 className="mb-3">Students Grid</h4>
            <div className="d-flex align-items-center flex-wrap">
              <div className="input-icon-start mb-3 me-2 position-relative">
                <PredefinedDateRanges />
              </div>
              <div className="dropdown mb-3 me-2">
                <Link
                  to="#"
                  className="btn btn-outline-light bg-white dropdown-toggle"
                  data-bs-toggle="dropdown"
                  data-bs-auto-close="outside"
                >
                  <i className="ti ti-filter me-2" />
                  Filter
                </Link>
                <div className="dropdown-menu drop-width" ref={dropdownMenuRef}>
                  <form>
                    <div className="d-flex align-items-center border-bottom p-3">
                      <h4>Filter</h4>
                    </div>
                    <div className="p-3 pb-0 border-bottom">
                      <div className="row">
                        <div className="col-md-6">
                          <div className="mb-3">
                            <label className="form-label">Class</label>
                            <CommonSelect
                              className="select"
                              options={allClass}
                              defaultValue={allClass[0]}
                            />
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="mb-3">
                            <label className="form-label">Section</label>
                            <CommonSelect
                              className="select"
                              options={allSection}
                              defaultValue={allSection[0]}
                            />
                          </div>
                        </div>
                        <div className="col-md-12">
                          <div className="mb-3">
                            <label className="form-label">Name</label>
                            <CommonSelect
                              className="select"
                              options={names}
                              defaultValue={names[0]}
                            />
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="mb-3">
                            <label className="form-label">Gender</label>
                            <CommonSelect
                              className="select"
                              options={gender}
                              defaultValue={gender[0]}
                            />
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="mb-3">
                            <label className="form-label">Status</label>
                            <CommonSelect
                              className="select"
                              options={status}
                              defaultValue={status[0]}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="p-3 d-flex align-items-center justify-content-end">
                      <Link to="#" className="btn btn-light me-3">
                        Reset
                      </Link>
                      <Link to={routes.studentGrid} className="btn btn-primary" onClick={handleApplyClick}>
                        Apply
                      </Link>
                    </div>
                  </form>
                </div>
              </div>
              <div className="d-flex align-items-center bg-white border rounded-2 p-1 mb-3 me-2">
                <Link
                  to={routes.studentList}
                  className="btn btn-icon btn-sm me-1 bg-light primary-hover"
                >
                  <i className="ti ti-list-tree" />
                </Link>
                <Link
                  to={routes.studentGrid}
                  className="active btn btn-icon btn-sm primary-hover"
                >
                  <i className="ti ti-grid-dots" />
                </Link>
              </div>
              <div className="dropdown mb-3">
                <Link
                  to="#"
                  className="btn btn-outline-light bg-white dropdown-toggle"
                  data-bs-toggle="dropdown"
                >
                  <i className="ti ti-sort-ascending-2 me-2" />
                  Sort by A-Z{" "}
                </Link>
                <ul className="dropdown-menu p-3">
                  <li>
                    <Link
                      to="#"
                      className="dropdown-item rounded-1 active"
                    >
                      Ascending
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="#"
                      className="dropdown-item rounded-1"
                    >
                      Descending
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="#"
                      className="dropdown-item rounded-1"
                    >
                      Recently Viewed
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="#"
                      className="dropdown-item rounded-1"
                    >
                      Recently Added
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          {/* /Filter */}
          <div className="row">
            {/* Student Grid */}
            {loading ? (
              // Loading skeleton for grid view
              Array.from({ length: 8 }).map((_, index) => (
                <div className="col-xxl-3 col-xl-4 col-md-6 d-flex" key={index}>
                  <div className="card flex-fill">
                    <div className="card-header">
                      <div className="placeholder-glow">
                        <span className="placeholder col-6"></span>
                      </div>
                    </div>
                    <div className="card-body">
                      <div className="bg-light-300 rounded-2 p-3 mb-3">
                        <div className="d-flex align-items-center">
                          <div className="placeholder-glow">
                            <span className="placeholder rounded-circle" style={{ width: 60, height: 60 }}></span>
                          </div>
                          <div className="ms-2 flex-grow-1">
                            <div className="placeholder-glow">
                              <span className="placeholder col-8 mb-1"></span>
                              <span className="placeholder col-6"></span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="d-flex align-items-center justify-content-between gx-2">
                        <div>
                          <div className="placeholder-glow">
                            <span className="placeholder col-4 mb-1"></span>
                            <span className="placeholder col-6"></span>
                          </div>
                        </div>
                        <div>
                          <div className="placeholder-glow">
                            <span className="placeholder col-4 mb-1"></span>
                            <span className="placeholder col-6"></span>
                          </div>
                        </div>
                        <div>
                          <div className="placeholder-glow">
                            <span className="placeholder col-4 mb-1"></span>
                            <span className="placeholder col-6"></span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="card-footer">
                      <div className="placeholder-glow">
                        <span className="placeholder col-8"></span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              studentList.map((student, index) => (
                <div className="col-xxl-3 col-xl-4 col-md-6 d-flex" key={index}>
                  <div className="card flex-fill">
                    {/* Card Header */}
                    <div className="card-header d-flex align-items-center justify-content-between">
                      <Link to={routes.studentDetail} className="link-primary">
                        {student.admissionNo}
                      </Link>
                      <div className="d-flex align-items-center">
                        <span className={`badge badge-soft-${getStatusColor(student.status)} d-inline-flex align-items-center me-1`}>
                          <i className="ti ti-circle-filled fs-5 me-1" />
                          {student.status}
                        </span>
                        <div className="dropdown">
                          <Link
                            to="#"
                            className="btn btn-white btn-icon btn-sm d-flex align-items-center justify-content-center rounded-circle p-0"
                            data-bs-toggle="dropdown"
                            aria-expanded="false"
                          >
                            <i className="ti ti-dots-vertical fs-14" />
                          </Link>
                          <ul className="dropdown-menu dropdown-menu-right p-3">
                            <li>
                              <Link className="dropdown-item rounded-1" to={routes.studentDetail}>
                                <i className="ti ti-menu me-2" />
                                View Student
                              </Link>
                            </li>
                            <li>
                              <Link className="dropdown-item rounded-1" to={routes.editStudent}>
                                <i className="ti ti-edit-circle me-2" />
                                Edit
                              </Link>
                            </li>
                            <li>
                              <Link className="dropdown-item rounded-1" to={routes.studentPromotion}>
                                <i className="ti ti-arrow-ramp-right-2 me-2" />
                                Promote Student
                              </Link>
                            </li>
                            <li>
                              <Link
                                className="dropdown-item rounded-1"
                                to="#"
                                data-bs-toggle="modal"
                                data-bs-target="#delete-modal"
                              >
                                <i className="ti ti-trash-x me-2" />
                                Delete
                              </Link>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    {/* Card Body */}
                    <div className="card-body">
                      <div className="bg-light-300 rounded-2 p-3 mb-3">
                        <div className="d-flex align-items-center">
                          <Link to={routes.studentDetail} className="avatar avatar-lg flex-shrink-0">
                            <img
                              src={student.user?.profilePic || "/assets/img/students/default.jpg"}
                              className="img-fluid rounded-circle"
                              alt="Student Profile"
                              style={{ width: 60, height: 60, objectFit: 'cover' }}
                              onError={(e) => {
                                e.currentTarget.src = "/assets/img/students/default.jpg";
                              }}
                            />
                          </Link>
                          <div className="ms-2">
                            <h5 className="mb-0">
                              <Link to={routes.studentDetail}>{student.user?.name || student.name}</Link>
                            </h5>
                            <p>
                              Class: {student.class || 'N/A'}, Section: {student.section || 'N/A'}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Extra Info */}
                      <div className="d-flex align-items-center justify-content-between gx-2">
                        <div>
                          <p className="mb-0">Roll No</p>
                          <p className="text-dark">{student.rollNo}</p>
                        </div>
                        <div>
                          <p className="mb-0">Gender</p>
                          <p className="text-dark">{student.user?.sex || student.sex}</p>
                        </div>
                        <div>
                          <p className="mb-0">Joined On</p>
                          <p className="text-dark">
                            {student.admissionDate ? new Date(student.admissionDate).toLocaleDateString() : 'N/A'}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="card-footer d-flex align-items-center justify-content-between">
                      <div className="d-flex align-items-center">
                        <Link to="#" className="btn btn-outline-light bg-white btn-icon d-flex align-items-center justify-content-center rounded-circle  p-0 me-2">
                          <i className="ti ti-brand-hipchat" />
                        </Link>
                        <Link to="#" className="btn btn-outline-light bg-white btn-icon d-flex align-items-center justify-content-center rounded-circle  p-0 me-2">
                          <i className="ti ti-phone" />
                        </Link>
                        <Link to="#" className="btn btn-outline-light bg-white btn-icon d-flex align-items-center justify-content-center rounded-circle p-0 me-3">
                          <i className="ti ti-mail" />
                        </Link>
                      </div>
                      <div className="d-flex gap-2">
                        <button
                          type="button"
                          className="btn btn-light btn-sm fw-semibold"
                          onClick={() => handleCollectFees(student)}
                        >
                          Collect Fees
                        </button>
                        <button
                          type="button"
                          className="btn btn-primary btn-sm fw-semibold"
                          onClick={() => handleAddFees(student)}
                        >
                          Add Fees
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}

            {/* /Student Grid */}
            <div className="col-md-12 text-center">
              <Link to="#" className="btn btn-primary">
                <i className="ti ti-loader-3 me-2" />
                Load More
              </Link>
            </div>
          </div>
        </div>
      </div>
      {/* /Page Wrapper */}
      <StudentModals />
      
      {/* Collect Fees Modal */}
      <CollectFeesModal
        isOpen={showCollectFeesModal}
        onClose={() => setShowCollectFeesModal(false)}
        selectedStudent={selectedStudent}
      />
      
      {/* Add Fees Modal */}
      <AddFeesModal
        isOpen={showAddFeesModal}
        onClose={() => setShowAddFeesModal(false)}
        selectedStudent={selectedStudent}
      />
    </>

  )
}

export default StudentGrid