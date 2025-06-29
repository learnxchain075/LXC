import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { all_routes } from "../../../../../router/all_routes";
import CommonSelect from "../../../../../core/common/commonSelect";
import {
  allClass,
  names,
  status,
} from "../../../../../core/common/selectoption/selectoption";
import TeacherModal from "../teacherModal";
import PredefinedDateRanges from "../../../../../core/common/datePicker";
import Table from "../../../../../core/common/dataTable/index";
import { TableData } from "../../../../../core/data/interface";
// import { teacherLists } from "../../../../core/data/json/teacherlist";
import ImageWithBasePath from "../../../../../core/common/imageWithBasePath";
import TooltipOption from "../../../../../core/common/tooltipOption";
import { ITeacherForm } from "../../../../../services/types/auth";
import { getAllTeacher, getTeacherById, getTeacherByschoolId } from "../../../../../services/admin/teacherRegistartion";
import AppConfig from "../../../../../config/config";
import { jwtDecode } from "jwt-decode";

const TeacherList = () => {
  const routes = all_routes;
  // const data = teacherLists;
 
  // const token = localStorage.getItem(AppConfig.LOCAL_STORAGE_ACCESS_TOKEN_KEY) ?? "";
  // const decoded: any = jwtDecode(token);
  const schoolId = localStorage.getItem("schoolId") ?? "";
  const [teacherList,setteacherList] = useState<ITeacherForm[]>([]);
  const [selectedTeacher, setSelectedTeacher] = useState<ITeacherForm | null>(null);
  const [showTeacherModal, setShowTeacherModal] = useState(false);
  useEffect(()=>{
    const fetchTeacherList = async () => {
      try {
        const  response = await  getTeacherByschoolId(localStorage.getItem("schoolId") ?? "");
        //  const response = await getAllTeacher();
        // console.log("teacher",response.data);
        setteacherList(response.data);
      } catch (error) {
        console.error("Error fetching teacher list:", error);
      }
    };

    fetchTeacherList();
  },[])
  const columns = [
    {
      title: "ID",
      dataIndex: "teacherSchoolId",
      render: (text: string) => (
       // <Link to={routes.teacherDetails} className="link-primary">
       <span
       className="link-primary"
       >

          {text}
       </span>
        
       // </Link>
      ),
      sorter: (a: TableData, b: TableData) => a.id.length - b.id.length,
    },
    {
      title: "Name",
      dataIndex: "user.name",
      render: (text: string, record: ITeacherForm) => (
        <span
          style={{ cursor: "pointer", color: "#007bff", textDecoration: "underline", display: 'flex', alignItems: 'center' }}
          onClick={() => {
            setSelectedTeacher(record);
            setShowTeacherModal(true);
          }}
        >
          <img
            src={record.user.profilePic || "assets/img/teachers/default.jpg"}
            className="rounded-circle me-2"
            alt="Profile"
            style={{ width: 32, height: 32, objectFit: 'cover' }}
          />
          {record.user.name}
        </span>
      ),
      sorter: (a: TableData, b: TableData) => a.user.name.length - b.user.name.length,
    },
    {
      title: "Class",
      dataIndex: ["lessons"],
      render: (lessons: any[]) => lessons?.[0]?.class?.name || "N/A",
      sorter: (a: TableData, b: TableData) =>
        (a.lessons?.[0]?.class?.name || "").localeCompare(b.lessons?.[0]?.class?.name || "")
    },
    {
      title: "Subject",
      dataIndex: ["lessons"],
      render: (lessons: any[]) => lessons?.[0]?.subject?.name || "N/A",
      sorter: (a: TableData, b: TableData) =>
        (a.lessons?.[0]?.subject?.name || "").localeCompare(b.lessons?.[0]?.subject?.name || "")
    },
    
    {
      title: "Email",
      dataIndex:["user","email"],
      sorter: (a: TableData, b: TableData) => a.user.email.length - b.user.email.length,
    },
    {
      title: "Phone",
      dataIndex: ["user","phone"],
      sorter: (a: TableData, b: TableData) => a.user.phone.length - b.user.phone.length,
    },
   
     {
      title: "Date Of Join",
      dataIndex: "dateofJoin",
          render: (text: string) => {
            const date = new Date(text);
            return date.toLocaleDateString("en-GB"); 
          },
          sorter: (a: TableData, b: TableData) =>
            new Date(a.dateofJoin).getTime() - new Date(b.dateofJoin).getTime(),
        },

    {
      title: "Status",
      dataIndex: "status",
      render: (text: string) => (
        <>
          {text === "Active" ? (
            <span className="badge badge-soft-success d-inline-flex align-items-center">
              <i className="ti ti-circle-filled fs-5 me-1"></i>
              {text}
            </span>
          ) : (
            <span className="badge badge-soft-danger d-inline-flex align-items-center">
              <i className="ti ti-circle-filled fs-5 me-1"></i>
              {text}
            </span>
          )}
        </>
      ),
      sorter: (a: TableData, b: TableData) => a.status.length - b.status.length,
    },

    {
      title: "Action",
      dataIndex: "action",
      render: () => (
        <>
          <div className="d-flex align-items-center">
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
                    to={routes.teacherDetails}
                  >
                    <i className="ti ti-menu me-2" />
                    View Teacher
                  </Link>
                </li>
                <li>
                  <Link
                    className="dropdown-item rounded-1"
                    to={routes.editTeacher}
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
  const dropdownMenuRef = useRef<HTMLDivElement | null>(null);

  const handleApplyClick = () => {
    if (dropdownMenuRef.current) {
      dropdownMenuRef.current.classList.remove("show");
    }
  };
  return (
    <>
      {/* Page Wrapper */}
      <div className="page-wrapper">
        <div className="content">
          {/* Page Header */}
          <div className="d-md-flex d-block align-items-center justify-content-between mb-3">
            <div className="my-auto mb-2">
              <h3 className="page-title mb-1">Teacher List</h3>
              <nav>
                <ol className="breadcrumb mb-0">
                  <li className="breadcrumb-item">
                    <Link to={routes.adminDashboard}>Dashboard</Link>
                  </li>
                  <li className="breadcrumb-item">
                    <Link to="#">Peoples</Link>
                  </li>
                  <li className="breadcrumb-item active" aria-current="page">
                    Teacher List
                  </li>
                </ol>
              </nav>
            </div>
            <div className="d-flex my-xl-auto right-content align-items-center flex-wrap">
              <TooltipOption />
              <div className="mb-2">
                <Link
                  to={routes.addTeacher}
                  className="btn btn-primary d-flex align-items-center"
                >
                  <i className="ti ti-square-rounded-plus me-2" />
                  Add Teacher
                </Link>
              </div>
            </div>
          </div>
          {/* /Page Header */}
          {/* Students List */}
          <div className="card">
            <div className="card-header d-flex align-items-center justify-content-between flex-wrap pb-0">
              <h4 className="mb-3">Teachers List</h4>
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
                    className="dropdown-menu drop-width "
                    ref={dropdownMenuRef}
                  >
                    <form>
                      <div className="d-flex align-items-center border-bottom p-3">
                        <h4>Filter</h4>
                      </div>
                      <div className="p-3 border-bottom pb-0">
                        <div className="row">
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
                          <div className="col-md-12">
                            <div className="mb-3">
                              <label className="form-label">Class</label>
                              <CommonSelect
                                className="select"
                                options={allClass}
                                defaultValue={allClass[0]}
                              />
                            </div>
                          </div>
                          <div className="col-md-12">
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
                          to="#"
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
                    to="#"
                    className="active btn btn-icon btn-sm me-1 primary-hover"
                  >
                    <i className="ti ti-list-tree" />
                  </Link>
                  <Link
                    to={routes.teacherGrid}
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

              <Table dataSource={teacherList} columns={columns} Selection={true} />
              {/* /Student List */}
            </div>
          </div>
          {/* /Students List */}
        </div>
      </div>
      {/* /Page Wrapper */}
      <TeacherModal />
      {showTeacherModal && selectedTeacher && (
        <div className="modal fade show d-block" tabIndex={-1} style={{ background: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Teacher Details</h5>
                <button type="button" className="btn-close" onClick={() => setShowTeacherModal(false)} />
              </div>
              <div className="modal-body">
                <div className="row">
                  <div className="col-md-4 text-center mb-3">
                    <img
                      src={selectedTeacher.user?.profilePic || "assets/img/teachers/default.jpg"}
                      alt="Profile"
                      className="img-fluid rounded-circle mb-2"
                      style={{ width: 120, height: 120, objectFit: 'cover' }}
                    />
                    <h5 className="mt-2">{selectedTeacher.user?.name}</h5>
                    <div className="text-muted">{selectedTeacher.user?.email}</div>
                    <div>{selectedTeacher.user?.phone}</div>
                  </div>
                  <div className="col-md-8">
                    <div className="row g-2">
                      <div className="col-6"><strong>Teacher ID:</strong> {selectedTeacher.teacherSchoolId}</div>
                      <div className="col-6"><strong>Status:</strong> {selectedTeacher.status}</div>
                      <div className="col-6"><strong>Date of Join:</strong> {selectedTeacher.dateofJoin && new Date(selectedTeacher.dateofJoin).toLocaleDateString("en-GB")}</div>
                      <div className="col-6"><strong>Class:</strong> {selectedTeacher.lessons?.[0]?.class?.name || "N/A"}</div>
                      <div className="col-6"><strong>Subject:</strong> {selectedTeacher.lessons?.[0]?.subject?.name || "N/A"}</div>
                      <div className="col-6"><strong>Gender:</strong> {selectedTeacher.user?.sex}</div>
                      <div className="col-6"><strong>Address:</strong> {selectedTeacher.user?.address}</div>
                      <div className="col-6"><strong>City:</strong> {selectedTeacher.user?.city}</div>
                      <div className="col-6"><strong>State:</strong> {selectedTeacher.user?.state}</div>
                      <div className="col-6"><strong>Country:</strong> {selectedTeacher.user?.country}</div>
                      <div className="col-6"><strong>Pincode:</strong> {selectedTeacher.user?.pincode}</div>
                      <div className="col-6"><strong>Blood Type:</strong> {selectedTeacher.user?.bloodType || '-'}</div>
                      {/* <div className="col-6"><strong>School ID:</strong> {selectedTeacher.user?.schoolId}</div> */}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default TeacherList;
