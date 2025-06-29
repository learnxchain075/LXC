 import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { all_routes } from "../../../../../router/all_routes";
// import { Studentlist } from "../../../../core/data/json/studentList";
import { TableData } from "../../../../../core/data/interface";
import StudentModals from "../studentModals";
import Table from "../../../../../core/common/dataTable/index";
import PredefinedDateRanges from "../../../../../core/common/datePicker";
import { withdrawStudent } from "../../../../../services/admin/studentPromotionApi";
import {
  allClass,
  allSection,
  gender,
  names,
  status,
} from "../../../../../core/common/selectoption/selectoption";
import CommonSelect from "../../../../../core/common/commonSelect";
import TooltipOption from "../../../../../core/common/tooltipOption";
import { IStudentForm } from "../../../../../services/types/auth";
import { getSchoolStudents, getStudentById } from "../../../../../services/admin/studentRegister";
import AppConfig from "../../../../../config/config";
import { jwtDecode } from "jwt-decode";
import useMobileDetection from "../../../../../core/common/mobileDetection";
import { useSelector } from "react-redux";
import { Modal } from "react-bootstrap";
import LoadingSkeleton from "../../../../../components/LoadingSkeleton";
import CollectFeesModal from "../../../../../components/CollectFeesModal";
import AddFeesModal from "../../../../../components/AddFeesModal";

const StudentList = ({ teacherdata }:{teacherdata?:any}) => {
  const routes = all_routes;

const userobj=useSelector((state:any)=>state.auth.userobj);
  // const data = Studentlist;
   
  // const token = localStorage.getItem(AppConfig
  //   .LOCAL_STORAGE_ACCESS_TOKEN_KEY) ?? "";
  // const decoded: any = jwtDecode(token);
  // const schoolId = decoded.schoolId;
  const [studentList, setStudentList] = useState<IStudentForm[]>([]);
  const [loading, setLoading] = useState(true);
  const dropdownMenuRef = useRef<HTMLDivElement | null>(null);
  const [selectedStudent, setSelectedStudent] = useState<IStudentForm | null>(null);
  const [showStudentModal, setShowStudentModal] = useState(false);
  const [showCollectFeesModal, setShowCollectFeesModal] = useState(false);
  const [showAddFeesModal, setShowAddFeesModal] = useState(false);
  const [showExitModal, setShowExitModal] = useState(false);

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
useEffect(()=>{
const fetchdata=async()=>{
  const res=await getStudentById(localStorage.getItem("teacherId")??"")
  // console.log("object teacher",res);

}
fetchdata();
},[])
  const handleApplyClick = () => {
    if (dropdownMenuRef.current) {
      dropdownMenuRef.current.classList.remove("show");
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

  const handleExitStudent = async () => {
    if (!selectedStudent) return;
    try {
      await withdrawStudent({ studentId: selectedStudent.id });
      setStudentList((prev) => prev.map((s) => (s.id === selectedStudent.id ? { ...s, status: 'INACTIVE' } : s)));
    } catch (err) {
      console.error('Exit error', err);
    } finally {
      setShowExitModal(false);
    }
  };

  const getStatusColor = (status: string) => {
    return status === 'ACTIVE' ? 'success' : 'danger';
  };

  const columns = [
    {
      title: "Admission No",
      dataIndex: "admissionNo",
      render: (text: string, record: IStudentForm) => (
        <span
         style={{ cursor: "pointer", color: "#007bff", textDecoration: "underline" }}
          onClick={() => {
            setSelectedStudent(record);
            setShowStudentModal(true);
          }}
        >
          {text}
        </span>
      ),
      sorter: (a: IStudentForm, b: IStudentForm) =>
        a.admissionNo.length - b.admissionNo.length,
    },
    {
      title: "Roll No",
      dataIndex: "rollNo",
      sorter: (a: IStudentForm, b: IStudentForm) => a.rollNo.length - b.rollNo.length,
    },
    {
      title: "Name",
      dataIndex: "name",
      render: (text: string, record: IStudentForm) => (
        <span
    >
          <img
            src={record.user?.profilePic || "/assets/img/students/default.jpg"}
            className="rounded-circle me-2"
            alt="Profile"
            style={{ width: 32, height: 32, objectFit: 'cover' }}
            onError={(e) => {
              e.currentTarget.src = "/assets/img/students/default.jpg";
            }}
          />
          {record.user?.name || text}
        </span>
      ),
      sorter: (a: IStudentForm, b: IStudentForm) =>
        a.user.name.localeCompare(b.user.name),
    },
    // {
    //   title: "Class",
    //   dataIndex: "class",
    //   sorter: (a: TableData, b: TableData) => a.class.length - b.class.length,
    // },
    // {
    //   title: "Section",
    //   dataIndex: "section",
    //   sorter: (a: TableData, b: TableData) =>
    //     a.section.length - b.section.length,
    // },
    {
      title: "Gender",
      dataIndex: ["user", "sex"],
      key: "sex",
      sorter: (a: IStudentForm, b: IStudentForm) =>
        a.user.sex.localeCompare(b.user.sex),
    }
    ,
    

    {
      title: "Status",
      dataIndex: "status",
      render: (text: string) => (
        <>
          <span className={`badge badge-soft-${getStatusColor(text)} d-inline-flex align-items-center`}>
            <i className="ti ti-circle-filled fs-5 me-1"></i>
            {text}
          </span>
        </>
      ),
      sorter: (a: IStudentForm, b: IStudentForm) => a.status.length - b.status.length,
    },
    {
      title: "Admission Date",
      dataIndex: "admissionDate",
      render: (text: string) => {
        const date = new Date(text);
        return date.toLocaleDateString("en-GB"); // Example: 26/04/2025
      },
      sorter: (a: IStudentForm, b: IStudentForm) =>
        new Date(a.admissionDate).getTime() - new Date(b.admissionDate).getTime(),
    },
    
    // {
    //   title: "DOB",
    //   dataIndex: "dateOfBirth",
    //   sorter: (a: TableData, b: TableData) => a.dateOfBirth.length - b.dateOfBirth.length,
    // },
    {
      title: "DOB",
      dataIndex: "dateOfBirth",
      render: (text: string) => {
        const date = new Date(text);
        return date.toLocaleDateString("en-GB"); // e.g., 26/04/2025
      },
      sorter: (a: IStudentForm, b: IStudentForm) =>
        new Date(a.dateOfBirth).getTime() - new Date(b.dateOfBirth).getTime(),
    },
    
    {
      title: "Action",
      dataIndex: "action",
      render: (text: string, record: IStudentForm) => (
        <>
          <div className="d-flex align-items-center">
            <Link
              to="#"
              className="btn btn-outline-light bg-white btn-icon d-flex align-items-center justify-content-center rounded-circle  p-0 me-2"
            >
              <i className="ti ti-brand-hipchat" />
            </Link>
            <Link
              to="#"
              className="btn btn-outline-light bg-white btn-icon d-flex align-items-center justify-content-center rounded-circle  p-0 me-2"
            >
              <i className="ti ti-phone" />
            </Link>
            <Link
              to="#"
              className="btn btn-outline-light bg-white btn-icon d-flex align-items-center justify-content-center rounded-circle p-0 me-3"
            >
              <i className="ti ti-mail" />
            </Link>
            <button
              type="button"
              className="btn btn-light fs-12 fw-semibold me-2"
              onClick={() => handleCollectFees(record)}
            >
              Collect Fees
            </button>
            <button
              type="button"
              className="btn btn-primary fs-12 fw-semibold me-3"
              onClick={() => handleAddFees(record)}
            >
              Add Fees
            </button>
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
                  <Link
                    className="dropdown-item rounded-1"
                    to="student-details"
                  >
                    <i className="ti ti-menu me-2" />
                    View Student
                  </Link>
                </li>
                <li>
                  <Link
                    className="dropdown-item rounded-1"
                    to={routes.editStudent}
                  >
                    <i className="ti ti-edit-circle me-2" />
                    Edit
                  </Link>
                </li>
                <li>
                  <Link
                    className="dropdown-item rounded-1"
                    to="#"
                    data-bs-toggle="modal"
                    data-bs-target="#login_detail"
                  >
                    <i className="ti ti-lock me-2" />
                    Login Details
                  </Link>
                </li>
                <li>
                  <Link className="dropdown-item rounded-1" to="#">
                    <i className="ti ti-toggle-right me-2" />
                    Disable
                  </Link>
                </li>
                <li>
                  <Link
                    className="dropdown-item rounded-1"
                    to="student-promotion"
                  >
                    <i className="ti ti-arrow-ramp-right-2 me-2" />
                    Promote Student
                  </Link>
                </li>
                <li>
                  <Link
                    className="dropdown-item rounded-1"
                    to="#"
                    onClick={() => {
                      setShowExitModal(true);
                      setSelectedStudent(record);
                    }}
                  >
                    <i className="ti ti-logout me-2" />
                    Exit Student
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
        </>
      ),
    },
  ];
  const ismobile=useMobileDetection();
  const userRole = userobj?.role || "teacher";
  return (
    <>
      {/* Page Wrapper */}
      <div className="page-wrapper">
      {/* if required then i will fixed it later */}
      {/* <div className={ ismobile ? "page-wrapper" : "pt-4"}> */}  
        {/* <div className="content"> */}
         <div className="content">
          {/* Page Header */}
          <div className="d-md-flex d-block align-items-center justify-content-between mb-3">
            <div className="my-auto mb-2">
              <h3 className="page-title mb-1">Students List</h3>
              <nav>
                <ol className="breadcrumb mb-0">
                  <li className="breadcrumb-item">
                    <Link to={routes.adminDashboard}>Dashboard</Link>
                  </li>
                  <li className="breadcrumb-item">Students</li>
                  <li className="breadcrumb-item active" aria-current="page">
                    All Students
                  </li>
                </ol>
              </nav>
            </div>
            <div className="d-flex my-xl-auto right-content align-items-center flex-wrap">
              <TooltipOption />
{
              <div className="mb-2">
                <Link
                  to={routes.addStudent}
                  className="btn btn-primary d-flex align-items-center"
                >
                  <i className="ti ti-square-rounded-plus me-2" />
                  Add Student
                </Link>
              </div>}
            </div>
          </div>
          {/* /Page Header */}
          {/* Students List */}
          <div className="card">
            <div className="card-header d-flex align-items-center justify-content-between flex-wrap pb-0">
              <h4 className="mb-3">Students List</h4>
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
                  <div
                    className="dropdown-menu drop-width"
                    ref={dropdownMenuRef}
                  >
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
                        <Link
                          to={routes.studentGrid}
                          className="btn btn-primary"
                          onClick={handleApplyClick}
                        >
                          Apply
                        </Link>
                      </div>
                    </form>
                  </div>
                </div>
                <div className="d-flex align-items-center bg-white border rounded-2 p-1 mb-3 me-2">
                  <Link
                    to={routes.studentList}
                    className="active btn btn-icon btn-sm me-1 primary-hover"
                  >
                    <i className="ti ti-list-tree" />
                  </Link>
                  <Link
                    to={routes.studentGrid}
                    className="btn btn-icon btn-sm bg-light primary-hover"
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
                    Sort by A-Z
                  </Link>
                  <ul className="dropdown-menu p-3">
                    <li>
                      <Link to="#" className="dropdown-item rounded-1 active">
                        Ascending
                      </Link>
                    </li>
                    <li>
                      <Link to="#" className="dropdown-item rounded-1">
                        Descending
                      </Link>
                    </li>
                    <li>
                      <Link to="#" className="dropdown-item rounded-1">
                        Recently Viewed
                      </Link>
                    </li>
                    <li>
                      <Link to="#" className="dropdown-item rounded-1">
                        Recently Added
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="card-body p-0 py-3">
              {/* Student List */}
              {loading ? (
                <div className="p-4">
                  <LoadingSkeleton lines={8} height={60} />
                </div>
              ) : (
                <Table dataSource={studentList} columns={columns} Selection={true} />
              )}
              {/* /Student List */}
            </div>
          </div>
          {/* /Students List */}
        </div>
      </div>
      {/* /Page Wrapper */}
      <StudentModals />
      {showStudentModal && selectedStudent && (
        <div className="modal fade show d-block" tabIndex={-1} style={{ background: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Student Details</h5>
                <button type="button" className="btn-close" onClick={() => setShowStudentModal(false)} />
              </div>
              <div className="modal-body">
                <div className="row">
                  <div className="col-md-4 text-center mb-3">
                    <img
                      src={selectedStudent.user?.profilePic || "/assets/img/students/default.jpg"}
                      alt="Profile"
                      className="img-fluid rounded-circle mb-2"
                      style={{ width: 120, height: 120, objectFit: 'cover' }}
                      onError={(e) => {
                        e.currentTarget.src = "/assets/img/students/default.jpg";
                      }}
                    />
                    <h5 className="mt-2">{selectedStudent.user?.name}</h5>
                    <div className="text-muted">{selectedStudent.user?.email}</div>
                    <div>{selectedStudent.user?.phone}</div>
                  </div>
                  <div className="col-md-8">
                    <div className="row g-2">
                      <div className="col-6"><strong>Admission No:</strong> {selectedStudent.admissionNo}</div>
                      <div className="col-6"><strong>Roll No:</strong> {selectedStudent.rollNo}</div>
                      <div className="col-6"><strong>Status:</strong> {selectedStudent.status}</div>
                      <div className="col-6"><strong>Gender:</strong> {selectedStudent.user?.sex}</div>
                      <div className="col-6"><strong>Admission Date:</strong> {selectedStudent.admissionDate && new Date(selectedStudent.admissionDate).toLocaleDateString("en-GB")}</div>
                      <div className="col-6"><strong>DOB:</strong> {selectedStudent.dateOfBirth && new Date(selectedStudent.dateOfBirth).toLocaleDateString("en-GB")}</div>
                      <div className="col-6"><strong>Address:</strong> {selectedStudent.user?.address}</div>
                      <div className="col-6"><strong>City:</strong> {selectedStudent.user?.city}</div>
                      <div className="col-6"><strong>State:</strong> {selectedStudent.user?.state}</div>
                      <div className="col-6"><strong>Country:</strong> {selectedStudent.user?.country}</div>
                      <div className="col-6"><strong>Pincode:</strong> {selectedStudent.user?.pincode}</div>
                      <div className="col-6"><strong>Blood Type:</strong> {selectedStudent.user?.bloodType || '-'}</div>
                      {/* <div className="col-6"><strong>School ID:</strong> {selectedStudent.user?.schoolId}</div> */}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

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
      {showExitModal && selectedStudent && (
        <div className="modal fade show d-block" tabIndex={-1} style={{ background: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-body text-center">
                <h4>Confirm Exit</h4>
                <p>Are you sure you want to withdraw {selectedStudent.user?.name}?</p>
                <div className="d-flex justify-content-center">
                  <button className="btn btn-light me-3" onClick={() => setShowExitModal(false)}>
                    Cancel
                  </button>
                  <button className="btn btn-danger" onClick={handleExitStudent}>
                    Exit
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default StudentList;
