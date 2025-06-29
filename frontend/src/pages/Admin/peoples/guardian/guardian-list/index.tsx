import React, { useEffect, useRef, useState } from "react";
import ImageWithBasePath from "../../../../../core/common/imageWithBasePath";
import PredefinedDateRanges from "../../../../../core/common/datePicker";
import { Link } from "react-router-dom";
import { all_routes } from "../../../../../router/all_routes";
import {
  allClass,
  names,
  parent,
  status,
} from "../../../../../core/common/selectoption/selectoption";
import CommonSelect from "../../../../../core/common/commonSelect";
import { Modal } from "react-bootstrap";
import GuardianModal from "../guardianModal";
import { TableData } from "../../../../../core/data/interface";
import Table from "../../../../../core/common/dataTable/index";
// import { guardianListData } from "../../../../core/data/json/guardianList";
import TooltipOption from "../../../../../core/common/tooltipOption";
import { getGuardianOfSchool } from "../../../../../services/parents/gaurdianApi";

const GuardianList = () => {
  const [show, setShow] = useState(false);
  const routes = all_routes;
  const dropdownMenuRef = useRef<HTMLDivElement | null>(null);
  const [guardianList, setGuardianList] = useState([]);
  const [selectedGuardian, setSelectedGuardian] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const handleApplyClick = () => {
    if (dropdownMenuRef.current) {
      dropdownMenuRef.current.classList.remove("show");
    }
  };

  const handleClose = () => {
    setShow(false);
    setSelectedGuardian(null);
  };

  const handleViewGuardian = (guardian: any) => {
    setSelectedGuardian(guardian);
    setShow(true);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const fetchdata = await getGuardianOfSchool(localStorage.getItem("schoolId") ?? "");
        setGuardianList(fetchdata.data ?? []);
      } catch (error) {
        console.error("Error fetching guardians:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // const data = guardianListData;
  const columns = [
    {
      title: "Guardian Name",
      dataIndex: "guardianName",
      render: (_: string, record: any) => (
        <div className="d-flex align-items-center">
          <div className="avatar avatar-sm me-2">
            <ImageWithBasePath
              src={record.guardianImage || "assets/img/default-guardian.jpg"}
              className="avatar-img rounded-circle"
              alt="Guardian"
            />
          </div>
          <div>
            <Link 
              to="#" 
              onClick={() => handleViewGuardian(record)}
              className="text-primary"
            >
              {record.guardianName}
            </Link>
          </div>
        </div>
      ),
      sorter: (a: any, b: any) => a.guardianName.localeCompare(b.guardianName),
    },
    {
      title: "Child",
      dataIndex: "user",
      render: (user: any) => user?.name || "-",
      sorter: (a: any, b: any) => (a.user?.name || "").localeCompare(b.user?.name || ""),
    },
    {
      title: "Phone",
      dataIndex: "guardianPhone",
      render: (text: string) => text || "-",
      sorter: (a: any, b: any) => (a.guardianPhone || "").localeCompare(b.guardianPhone || ""),
    },
    {
      title: "Email",
      dataIndex: "guardianEmail",
      render: (text: string) => text || "-",
      sorter: (a: any, b: any) => (a.guardianEmail || "").localeCompare(b.guardianEmail || ""),
    },
    {
      title: "Guardian Relation",
      dataIndex: "guardianRelation",
      render: (text: string) => text || "-",
      sorter: (a: any, b: any) => (a.guardianRelation || "").localeCompare(b.guardianRelation || ""),
    },
    {
      title: "Action",
      dataIndex: "action",
      render: (_: any, record: any) => (
        <div className="dropdown">
          <Link to="#" className="btn btn-sm btn-light" data-bs-toggle="dropdown">
            <i className="ti ti-dots-vertical" />
          </Link>
          <ul className="dropdown-menu p-2">
            <li>
              <Link to="#" onClick={() => handleViewGuardian(record)} className="dropdown-item">
                <i className="ti ti-eye me-2"></i>View
              </Link>
            </li>
            <li>
              <Link to="#" className="dropdown-item">
                <i className="ti ti-edit me-2"></i>Edit
              </Link>
            </li>
            <li>
              <Link to="#" className="dropdown-item text-danger">
                <i className="ti ti-trash me-2"></i>Delete
              </Link>
            </li>
          </ul>
        </div>
      ),
    },
  ];

  return (
    <>
      {/* Page Wrapper */}
      <div className="page-wrapper">
        <div className="content content-two">
          {/* Page Header */}
          <div className="d-md-flex d-block align-items-center justify-content-between mb-3">
            <div className="my-auto mb-2">
              <h3 className="page-title mb-1">Guardian</h3>
              <nav>
                <ol className="breadcrumb mb-0">
                  <li className="breadcrumb-item">
                    <Link to={routes.adminDashboard}>Dashboard</Link>
                  </li>
                  <li className="breadcrumb-item">Peoples</li>
                  <li className="breadcrumb-item active" aria-current="page">
                    Guardian
                  </li>
                </ol>
              </nav>
            </div>
            <div className="d-flex my-xl-auto right-content align-items-center flex-wrap">
              <TooltipOption />

              <div className="mb-2">
                {/* <Link
                  to="#"
                  className="btn btn-primary d-flex align-items-center"
                  data-bs-toggle="modal"
                  data-bs-target="#add_guardian"
                >
                  <i className="ti ti-square-rounded-plus me-2" />
                  Add Guardian
                </Link> */}
              </div>
            </div>
          </div>
          {/* /Page Header */}
          <div className="card">
            <div className="card-header d-flex align-items-center justify-content-between flex-wrap pb-0">
              <h4 className="mb-3">Guardian List</h4>
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
                          <div className="col-md-12">
                            <div className="mb-3">
                              <label className="form-label">Guardian</label>
                              <CommonSelect
                                className="select"
                                options={parent}
                                defaultValue={parent[0]}
                              />
                            </div>
                          </div>
                          <div className="col-md-12">
                            <div className="mb-3">
                              <label className="form-label">Child</label>
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
                    to={routes.guardiansList}
                    className="active btn btn-icon btn-sm me-1 primary-hover"
                  >
                    <i className="ti ti-list-tree" />
                  </Link>
                  <Link
                    to={routes.guardiansGrid}
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
                    Sort by A-Z{" "}
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
                <div className="text-center">Loading...</div>
              ) : (
                <Table columns={columns} dataSource={guardianList} />
              )}

              {/* /Student List */}
            </div>
          </div>

        </div>
      </div>
      {/* /Page Wrapper */}
      <GuardianModal />

      <Modal show={show} onHide={handleClose} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Guardian Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedGuardian ? (
            <div className="guardian-details">
              <div className="row">
                <div className="col-md-12 mb-4">
                  <div className="d-flex align-items-center">
                    <div className="avatar avatar-lg me-3">
                      <ImageWithBasePath
                        src={selectedGuardian.guardianImage || "assets/img/default-guardian.jpg"}
                        className="avatar-img rounded-circle"
                        alt="Guardian"
                      />
                    </div>
                    <div>
                      <h4 className="mb-1">{selectedGuardian.guardianName}</h4>
                      <p className="text-muted mb-0">
                        <i className="ti ti-mail me-2"></i>
                        {selectedGuardian.guardianEmail}
                      </p>
                      <p className="text-muted mb-0">
                        <i className="ti ti-phone me-2"></i>
                        {selectedGuardian.guardianPhone}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="col-md-12">
                  <div className="card mb-4">
                    <div className="card-header">
                      <h5 className="card-title mb-0">Guardian Information</h5>
                    </div>
                    <div className="card-body">
                      <div className="row">
                        <div className="col-md-6 mb-3">
                          <label className="form-label text-muted">Relation</label>
                          <p className="mb-0">{selectedGuardian.guardianRelation || 'Not provided'}</p>
                        </div>
                        <div className="col-md-6 mb-3">
                          <label className="form-label text-muted">Occupation</label>
                          <p className="mb-0">{selectedGuardian.guardianOccupation || 'Not provided'}</p>
                        </div>
                        <div className="col-md-12 mb-3">
                          <label className="form-label text-muted">Address</label>
                          <p className="mb-0">{selectedGuardian.guardianAddress || 'Not provided'}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {selectedGuardian.user && (
                    <div className="card">
                      <div className="card-header">
                        <h5 className="card-title mb-0">Child Information</h5>
                      </div>
                      <div className="card-body">
                        <div className="d-flex align-items-center">
                          <div className="avatar avatar-sm me-3">
                            <ImageWithBasePath
                              src={selectedGuardian.user.profilePic || "assets/img/default-student.jpg"}
                              className="avatar-img rounded-circle"
                              alt="Student"
                            />
                          </div>
                          <div>
                            <h6 className="mb-0">{selectedGuardian.user.name}</h6>
                            <small className="text-muted">
                              {selectedGuardian.user.class && `Class: ${selectedGuardian.user.class}`}
                              {selectedGuardian.user.rollNumber && `, Roll No: ${selectedGuardian.user.rollNumber}`}
                            </small>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-4">
              <p>No guardian details available</p>
            </div>
          )}
        </Modal.Body>
      </Modal>
    </>
  );
};

export default GuardianList;
