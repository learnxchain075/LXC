import React, { useEffect, useRef, useState } from "react";
import ImageWithBasePath from "../../../../../core/common/imageWithBasePath";
import PredefinedDateRanges from "../../../../../core/common/datePicker";
import { Link } from "react-router-dom";
import { all_routes } from "../../../../../router/all_routes";
import {
  names,
  parent,
} from "../../../../../core/common/selectoption/selectoption";
import CommonSelect from "../../../../../core/common/commonSelect";
import { Modal } from "react-bootstrap";
import GuardianModal from "../guardianModal";
import TooltipOption from "../../../../../core/common/tooltipOption";
import { getGuardianOfSchool } from "../../../../../services/parents/gaurdianApi";
import { GuardianDetails } from "../../../../../services/types/parents/gurdainTypes";

const GuardianGrid = () => {
  const [show, setShow] = useState(false);
  const routes = all_routes;
  const dropdownMenuRef = useRef<HTMLDivElement | null>(null);
  const [ guardianList,setGuardianList]=useState<GuardianDetails[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const handleApplyClick = () => {
    if (dropdownMenuRef.current) {
      dropdownMenuRef.current.classList.remove("show");
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await getGuardianOfSchool(localStorage.getItem("schoolId") ?? "");
        console.log("response",response);
       
       
        setGuardianList(response.data ?? []);
      } catch (err) {
        setError("Failed to fetch guardians.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);
  const handleClose = () => {
    setShow(false);
  };
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
                <Link
                  to="#"
                  className="btn btn-primary d-flex align-items-center"
                  data-bs-toggle="modal"
                  data-bs-target="#add_guardian"
                >
                  <i className="ti ti-square-rounded-plus me-2" />
                  Add Guardian
                </Link>
              </div>
            </div>
          </div>
          {/* /Page Header */}
          <div className="bg-white p-3 border rounded-1 d-flex align-items-center justify-content-between flex-wrap mb-4 pb-0">
            <h4 className="mb-3">Guardian Grid</h4>
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
                            <label className="form-label">Guardian Name</label>
                            <CommonSelect
                              className="select"
                              options={parent}
                              defaultValue={parent[0]}
                            />
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="mb-3">
                            <label className="form-label">Child</label>
                            <CommonSelect
                              className="select"
                              options={names}
                              defaultValue={names[0]}
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
                  className=" btn btn-icon btn-sm me-1 bg-light primary-hover"
                >
                  <i className="ti ti-list-tree" />
                </Link>
                <Link
                  to={routes.guardiansGrid}
                  className=" active btn btn-icon btn-sm  primary-hover"
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
          <div className="row">
            {/* Guardian Grid */}
            {/* <div className="col-xl-4 col-md-6 d-flex">
              <div className="card flex-fill">
                <div className="card-header d-flex align-items-center justify-content-between">
                  <Link
                    to="#"
                    className="link-primary"
                    onClick={() => setShow(true)}
                  >
                    G124545
                  </Link>
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
                            to="#"
                            data-bs-toggle="modal"
                            data-bs-target="#edit_guardian"
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
                <div className="card-body">
                  <div className="bg-light-300 rounded-2 p-3 mb-3">
                    <div className="d-flex align-items-center">
                      <Link
                        to="#"
                        onClick={() => setShow(true)}
                        className="avatar avatar-lg flex-shrink-0"
                      >
                        <ImageWithBasePath
                          src="assets/img/parents/parent-12.jpg"
                          className="img-fluid rounded-circle"
                          alt="img"
                        />
                      </Link>
                      <div className="ms-2">
                        <h6 className="text-dark text-truncate mb-0">
                          <Link to="#" onClick={() => setShow(true)}>Avila</Link>
                        </h6>
                        <p>Added on 01 Dec 2023</p>
                      </div>
                    </div>
                  </div>
                  <div className="d-flex align-items-center justify-content-between gx-2">
                    <div>
                      <p className="mb-0">Email</p>
                      <p className="text-dark">tom@example.com</p>
                    </div>
                    <div>
                      <p className="mb-0">Phone</p>
                      <p className="text-dark">+1 65738 58937</p>
                    </div>
                  </div>
                </div>
                <div className="card-footer d-flex align-items-center justify-content-between">
                  <div className="d-flex align-items-center">
                    <div className="d-flex align-items-center">
                      <Link
                        to={routes.studentDetail}
                        className="avatar avatar-md flex-shrink-0 p-0 me-2"
                      >
                        <ImageWithBasePath
                          src="assets/img/students/student-04.jpg"
                          alt="img"
                          className="img-fluid rounded-circle"
                        />
                      </Link>
                      <p className="text-dark">Janet</p>
                    </div>
                  </div>
                  <Link
                    to="#"
                    className="btn btn-light btn-sm"
                    onClick={() => setShow(true)}
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </div> */}

            {loading ? (
              <div className="col-12 text-center">
                <p>Loading...</p>
              </div>
            ) : error ? (
              <div className="col-12">
                <div className="alert alert-danger">{error}</div>
              </div>
            ) : guardianList.length  === 0 ? (
              <div className="col-12">
                <p>No guardians found.</p>
              </div>
            ) : (
              guardianList.map((guardian) => (
                <div className="col-xl-4 col-md-6 d-flex" key={guardian.id}>
                  <div className="card flex-fill">
                    <div className="card-header d-flex align-items-center justify-content-between">
                      <Link
                        to="#"
                        className="link-primary"
                        onClick={() => setShow(true)}
                        data-bs-toggle="modal"
                        data-bs-target="#view_guardian"
                      >
                        {guardian.id}
                      </Link>
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
                                to="#"
                                onClick={() => setShow(true)}
                                data-bs-toggle="modal"
                                data-bs-target="#edit_guardian"
                              >
                                <i className="ti ti-edit-circle me-2" />
                                Edit
                              </Link>
                            </li>
                            <li>
                              <Link
                                className="dropdown-item rounded-1"
                                to="#"
                                onClick={() => setShow(true)}
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
                    <div className="card-body">
                      <div className="bg-light-300 rounded-2 p-3 mb-3">
                        <div className="d-flex align-items-center">
                          {/* <Link
                            to="#"
                            onClick={() => setShow(true)}
                            className="avatar avatar-lg flex-shrink-0"
                            data-bs-toggle="modal"
                            data-bs-target="#view_guardian"
                          >
                            <ImageWithBasePath
                            
                              className="img-fluid rounded-circle"
                              alt="img"
                            />
                          </Link> */}
                          <div className="ms-2">
                            <h6 className="text-dark text-truncate mb-0">
                              <Link
                                to="#"
                                onClick={() => setShow(true)}
                                data-bs-toggle="modal"
                                data-bs-target="#view_guardian"
                              >
                                {guardian.gardianName}
                              </Link>
                            </h6>
                         
                          </div>
                        </div>
                      </div>
                      <div className="d-flex align-items-center justify-content-between gx-2">
                        <div>
                          <p className="mb-0">Email</p>
                          <p className="text-dark">{guardian.gardianEmail}</p>
                        </div>
                        <div>
                          <p className="mb-0">Phone</p>
                          <p className="text-dark">{guardian.gardianPhone}</p>
                        </div>
                      </div>
                    </div>
                    <div className="card-footer d-flex align-items-center justify-content-between">
                      <div className="d-flex align-items-center">
                        <div className="d-flex align-items-center">
                          {/* <Link
                            to={routes.studentDetail}
                            className="avatar avatar-md flex-shrink-0 p-0 me-2"
                          >
                            <ImageWithBasePath
                              src={guardian.childImage}
                              alt="img"
                              className="img-fluid rounded-circle"
                            />
                          </Link> */}
                          <p className="text-dark">{guardian.user.name}</p>
                        </div>
                      </div>
                      <Link
                        to="#"
                        className="btn btn-light btn-sm"
                        onClick={() => setShow(true)}
                        data-bs-toggle="modal"
                        data-bs-target="#view_guardian"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                </div>
              ))
            )}
        

            {/* /Guardian Grid */}
            {/* Guardian Grid */}
            {/* <div className="col-xl-4 col-md-6 d-flex">
              <div className="card flex-fill">
                <div className="card-header d-flex align-items-center justify-content-between">
                  <Link
                    to="#"
                    className="link-primary"
                    onClick={() => setShow(true)}
                  >
                    G124553
                  </Link>
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
                            to="#"
                            data-bs-toggle="modal"
                            data-bs-target="#edit_guardian"
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
                <div className="card-body">
                  <div className="bg-light-300 rounded-2 p-3 mb-3">
                    <div className="d-flex align-items-center">
                      <Link
                        to="#"
                        onClick={() => setShow(true)}
                        className="avatar avatar-lg flex-shrink-0"
                      >
                        <ImageWithBasePath
                          src="assets/img/parents/parent-04.jpg"
                          className="img-fluid rounded-circle"
                          alt="img"
                        />
                      </Link>
                      <div className="ms-2">
                        <h6 className="text-dark text-truncate mb-0">
                          <Link to="#" onClick={() => setShow(true)}>Claudia</Link>
                        </h6>
                        <p>Added on 27 Feb 2024</p>
                      </div>
                    </div>
                  </div>
                  <div className="d-flex align-items-center justify-content-between gx-2">
                    <div>
                      <p className="mb-0">Email</p>
                      <p className="text-dark">tom@example.com</p>
                    </div>
                    <div>
                      <p className="mb-0">Phone</p>
                      <p className="text-dark">+1 65738 58937</p>
                    </div>
                  </div>
                </div>
                <div className="card-footer d-flex align-items-center justify-content-between">
                  <div className="d-flex align-items-center">
                    <div className="d-flex align-items-center">
                      <Link
                        to={routes.studentDetail}
                        className="avatar avatar-md flex-shrink-0 p-0 me-2"
                      >
                        <ImageWithBasePath
                          src="assets/img/students/student-12.jpg"
                          alt="img"
                          className="img-fluid rounded-circle"
                        />
                      </Link>
                      <p className="text-dark">Richard</p>
                    </div>
                  </div>
                  <Link
                    to="#"
                    className="btn btn-light btn-sm"
                    onClick={() => setShow(true)}
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </div> */}
            {/* /Guardian Grid */}
            {/* Guardian Grid */}
            {/* <div className="col-xl-4 col-md-6 d-flex">
              <div className="card flex-fill">
                <div className="card-header d-flex align-items-center justify-content-between">
                  <Link
                    to="#"
                    className="link-primary"
                    onClick={() => setShow(true)}
                  >
                    G124549
                  </Link>
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
                            to="#"
                            data-bs-toggle="modal"
                            data-bs-target="#edit_guardian"
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
                <div className="card-body">
                  <div className="bg-light-300 rounded-2 p-3 mb-3">
                    <div className="d-flex align-items-center">
                      <Link
                        to="#"
                        onClick={() => setShow(true)}
                        className="avatar avatar-lg flex-shrink-0"
                      >
                        <ImageWithBasePath
                          src="assets/img/parents/parent-08.jpg"
                          className="img-fluid rounded-circle"
                          alt="img"
                        />
                      </Link>
                      <div className="ms-2">
                        <h6 className="text-dark text-truncate mb-0">
                          <Link to="#" onClick={() => setShow(true)}>Jessie</Link>
                        </h6>
                        <p>Added on 08 Jan 2024</p>
                      </div>
                    </div>
                  </div>
                  <div className="d-flex align-items-center justify-content-between gx-2">
                    <div>
                      <p className="mb-0">Email</p>
                      <p className="text-dark">tom@example.com</p>
                    </div>
                    <div>
                      <p className="mb-0">Phone</p>
                      <p className="text-dark">+1 65738 58937</p>
                    </div>
                  </div>
                </div>
                <div className="card-footer d-flex align-items-center justify-content-between">
                  <div className="d-flex align-items-center">
                    <div className="d-flex align-items-center">
                      <Link
                        to={routes.studentDetail}
                        className="avatar avatar-md flex-shrink-0 p-0 me-2"
                      >
                        <ImageWithBasePath
                          src="assets/img/students/student-03.jpg"
                          alt="img"
                          className="img-fluid rounded-circle"
                        />
                      </Link>
                      <p className="text-dark">Kathleen</p>
                    </div>
                  </div>
                  <Link
                    to="#"
                    className="btn btn-light btn-sm"
                    onClick={() => setShow(true)}
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </div> */}
            {/* /Guardian Grid */}
            {/* Guardian Grid */}
            {/* <div className="col-xl-4 col-md-6 d-flex">
              <div className="card flex-fill">
                <div className="card-header d-flex align-items-center justify-content-between">
                  <Link
                    to="#"
                    className="link-primary"
                    onClick={() => setShow(true)}
                  >
                    G124546
                  </Link>
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
                            to="#"
                            data-bs-toggle="modal"
                            data-bs-target="#edit_guardian"
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
                <div className="card-body">
                  <div className="bg-light-300 rounded-2 p-3 mb-3">
                    <div className="d-flex align-items-center">
                      <Link
                        to="#"
                        onClick={() => setShow(true)}
                        className="avatar avatar-lg flex-shrink-0"
                      >
                        <ImageWithBasePath
                          src="assets/img/parents/parent-11.jpg"
                          className="img-fluid rounded-circle"
                          alt="img"
                        />
                      </Link>
                      <div className="ms-2">
                        <h6 className="text-dark text-truncate mb-0">
                          <Link to="#" onClick={() => setShow(true)}>Edwin</Link>
                        </h6>
                        <p>Added on 10 Dec 2023</p>
                      </div>
                    </div>
                  </div>
                  <div className="d-flex align-items-center justify-content-between gx-2">
                    <div>
                      <p className="mb-0">Email</p>
                      <p className="text-dark">edw@example.com</p>
                    </div>
                    <div>
                      <p className="mb-0">Phone</p>
                      <p className="text-dark">+1 65738 58937</p>
                    </div>
                  </div>
                </div>
                <div className="card-footer d-flex align-items-center justify-content-between">
                  <div className="d-flex align-items-center">
                    <div className="d-flex align-items-center">
                      <Link
                        to={routes.studentDetail}
                        className="avatar avatar-md flex-shrink-0 p-0 me-2"
                      >
                        <ImageWithBasePath
                          src="assets/img/students/student-09.jpg"
                          alt="img"
                          className="img-fluid rounded-circle"
                        />
                      </Link>
                      <p className="text-dark">Susan</p>
                    </div>
                  </div>
                  <Link
                    to="#"
                    className="btn btn-light btn-sm"
                    onClick={() => setShow(true)}
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </div> */}
            {/* /Guardian Grid */}
            {/* Guardian Grid */}
            {/* <div className="col-xl-4 col-md-6 d-flex">
              <div className="card flex-fill">
                <div className="card-header d-flex align-items-center justify-content-between">
                  <Link
                    to="#"
                    className="link-primary"
                    onClick={() => setShow(true)}
                  >
                    G124548
                  </Link>
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
                            to="#"
                            data-bs-toggle="modal"
                            data-bs-target="#edit_guardian"
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
                <div className="card-body">
                  <div className="bg-light-300 rounded-2 p-3 mb-3">
                    <div className="d-flex align-items-center">
                      <Link
                        to="#"
                        onClick={() => setShow(true)}
                        className="avatar avatar-lg flex-shrink-0"
                      >
                        <ImageWithBasePath
                          src="assets/img/parents/parent-09.jpg"
                          className="img-fluid rounded-circle"
                          alt="img"
                        />
                      </Link>
                      <div className="ms-2">
                        <h6 className="text-dark text-truncate mb-0">
                          <Link to="#" onClick={() => setShow(true)}>Michael</Link>
                        </h6>
                        <p>Added on 22 Dec 2023</p>
                      </div>
                    </div>
                  </div>
                  <div className="d-flex align-items-center justify-content-between gx-2">
                    <div>
                      <p className="mb-0">Email</p>
                      <p className="text-dark">mic@example.com</p>
                    </div>
                    <div>
                      <p className="mb-0">Phone</p>
                      <p className="text-dark">+1 65738 58937</p>
                    </div>
                  </div>
                </div>
                <div className="card-footer d-flex align-items-center justify-content-between">
                  <div className="d-flex align-items-center">
                    <div className="d-flex align-items-center">
                      <Link
                        to={routes.studentDetail}
                        className="avatar avatar-md flex-shrink-0 p-0 me-2"
                      >
                        <ImageWithBasePath
                          src="assets/img/students/student-09.jpg"
                          alt="img"
                          className="img-fluid rounded-circle"
                        />
                      </Link>
                      <p className="text-dark">Julie</p>
                    </div>
                  </div>
                  <Link
                    to="#"
                    className="btn btn-light btn-sm"
                    onClick={() => setShow(true)}
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </div> */}
            {/* /Guardian Grid */}
            {/* Guardian Grid */}
            {/* <div className="col-xl-4 col-md-6 d-flex">
              <div className="card flex-fill">
                <div className="card-header d-flex align-items-center justify-content-between">
                  <Link
                    to="#"
                    className="link-primary"
                    onClick={() => setShow(true)}
                  >
                    G124547
                  </Link>
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
                            to="#"
                            data-bs-toggle="modal"
                            data-bs-target="#edit_guardian"
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
                <div className="card-body">
                  <div className="bg-light-300 rounded-2 p-3 mb-3">
                    <div className="d-flex align-items-center">
                      <Link
                        to="#"
                        onClick={() => setShow(true)}
                        className="avatar avatar-lg flex-shrink-0"
                      >
                        <ImageWithBasePath
                          src="assets/img/parents/parent-10.jpg"
                          className="img-fluid rounded-circle"
                          alt="img"
                        />
                      </Link>
                      <div className="ms-2">
                        <h6 className="text-dark text-truncate mb-0">
                          <Link to="#" onClick={() => setShow(true)}>Mary</Link>
                        </h6>
                        <p>Added on 15 Dec 2024</p>
                      </div>
                    </div>
                  </div>
                  <div className="d-flex align-items-center justify-content-between gx-2">
                    <div>
                      <p className="mb-0">Email</p>
                      <p className="text-dark">mar@example.com</p>
                    </div>
                    <div>
                      <p className="mb-0">Phone</p>
                      <p className="text-dark">+1 65738 58937</p>
                    </div>
                  </div>
                </div>
                <div className="card-footer d-flex align-items-center justify-content-between">
                  <div className="d-flex align-items-center">
                    <div className="d-flex align-items-center">
                      <Link
                        to={routes.studentDetail}
                        className="avatar avatar-md flex-shrink-0 p-0 me-2"
                      >
                        <ImageWithBasePath
                          src="assets/img/students/student-08.jpg"
                          alt="img"
                          className="img-fluid rounded-circle"
                        />
                      </Link>
                      <p className="text-dark">Ryan</p>
                    </div>
                  </div>
                  <Link
                    to="#"
                    className="btn btn-light btn-sm"
                    onClick={() => setShow(true)}
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </div> */}
            {/* /Guardian Grid */}
            {/* Guardian Grid */}
            {/* <div className="col-xl-4 col-md-6 d-flex">
              <div className="card flex-fill">
                <div className="card-header d-flex align-items-center justify-content-between">
                  <Link
                    to="#"
                    className="link-primary"
                    onClick={() => setShow(true)}
                  >
                    G124550
                  </Link>
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
                            to="#"
                            data-bs-toggle="modal"
                            data-bs-target="#edit_guardian"
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
                <div className="card-body">
                  <div className="bg-light-300 rounded-2 p-3 mb-3">
                    <div className="d-flex align-items-center">
                      <Link
                        to="#"
                        onClick={() => setShow(true)}
                        className="avatar avatar-lg flex-shrink-0"
                      >
                        <ImageWithBasePath
                          src="assets/img/parents/parent-07.jpg"
                          className="img-fluid rounded-circle"
                          alt="img"
                        />
                      </Link>
                      <div className="ms-2">
                        <h6 className="text-dark text-truncate mb-0">
                          <Link to="#" onClick={() => setShow(true)}>Robert</Link>
                        </h6>
                        <p>Added on 19 Jan 2024</p>
                      </div>
                    </div>
                  </div>
                  <div className="d-flex align-items-center justify-content-between gx-2">
                    <div>
                      <p className="mb-0">Email</p>
                      <p className="text-dark">rob@example.com</p>
                    </div>
                    <div>
                      <p className="mb-0">Phone</p>
                      <p className="text-dark">+1 65738 58937</p>
                    </div>
                  </div>
                </div>
                <div className="card-footer d-flex align-items-center justify-content-between">
                  <div className="d-flex align-items-center">
                    <div className="d-flex align-items-center">
                      <Link
                        to={routes.studentDetail}
                        className="avatar avatar-md flex-shrink-0 p-0 me-2"
                      >
                        <ImageWithBasePath
                          src="assets/img/students/student-06.jpg"
                          alt="img"
                          className="img-fluid rounded-circle"
                        />
                      </Link>
                      <p className="text-dark">Ralph</p>
                    </div>
                  </div>
                  <Link
                    to="#"
                    className="btn btn-light btn-sm"
                    onClick={() => setShow(true)}
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </div> */}
            {/* /Guardian Grid */}
            {/* Guardian Grid */}
            {/* <div className="col-xl-4 col-md-6 d-flex">
              <div className="card flex-fill">
                <div className="card-header d-flex align-items-center justify-content-between">
                  <Link
                    to="#"
                    className="link-primary"
                    onClick={() => setShow(true)}
                  >
                    G124552
                  </Link>
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
                            to="#"
                            data-bs-toggle="modal"
                            data-bs-target="#edit_guardian"
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
                <div className="card-body">
                  <div className="bg-light-300 rounded-2 p-3 mb-3">
                    <div className="d-flex align-items-center">
                      <Link
                        to="#"
                        onClick={() => setShow(true)}
                        className="avatar avatar-lg flex-shrink-0"
                      >
                        <ImageWithBasePath
                          src="assets/img/parents/parent-05.jpg"
                          className="img-fluid rounded-circle"
                          alt="img"
                        />
                      </Link>
                      <div className="ms-2">
                        <h6 className="text-dark text-truncate mb-0">
                          <Link to="#" onClick={() => setShow(true)}>Arthur</Link>
                        </h6>
                        <p>Added on 11 Feb 2024</p>
                      </div>
                    </div>
                  </div>
                  <div className="d-flex align-items-center justify-content-between gx-2">
                    <div>
                      <p className="mb-0">Email</p>
                      <p className="text-dark">art@example.com</p>
                    </div>
                    <div>
                      <p className="mb-0">Phone</p>
                      <p className="text-dark">+1 65738 58937</p>
                    </div>
                  </div>
                </div>
                <div className="card-footer d-flex align-items-center justify-content-between">
                  <div className="d-flex align-items-center">
                    <div className="d-flex align-items-center">
                      <Link
                        to={routes.studentDetail}
                        className="avatar avatar-md flex-shrink-0 p-0 me-2"
                      >
                        <ImageWithBasePath
                          src="assets/img/students/student-04.jpg"
                          alt="img"
                          className="img-fluid rounded-circle"
                        />
                      </Link>
                      <p className="text-dark">Gifford</p>
                    </div>
                  </div>
                  <Link
                    to="#"
                    className="btn btn-light btn-sm"
                    onClick={() => setShow(true)}
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </div> */}
            {/* /Guardian Grid */}
            {/* Guardian Grid */}
            {/* <div className="col-xl-4 col-md-6 d-flex">
              <div className="card flex-fill">
                <div className="card-header d-flex align-items-center justify-content-between">
                  <Link
                    to="#"
                    className="link-primary"
                    onClick={() => setShow(true)}
                  >
                    G124551
                  </Link>
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
                            to="#"
                            data-bs-toggle="modal"
                            data-bs-target="#edit_guardian"
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
                <div className="card-body">
                  <div className="bg-light-300 rounded-2 p-3 mb-3">
                    <div className="d-flex align-items-center">
                      <Link
                        to="#"
                        onClick={() => setShow(true)}
                        className="avatar avatar-lg flex-shrink-0"
                      >
                        <ImageWithBasePath
                          src="assets/img/parents/parent-06.jpg"
                          className="img-fluid rounded-circle"
                          alt="img"
                        />
                      </Link>
                      <div className="ms-2">
                        <h6 className="text-dark text-truncate mb-0">
                          <Link to="#" onClick={() => setShow(true)}>Colleen</Link>
                        </h6>
                        <p>Added on 24 Jan 2024</p>
                      </div>
                    </div>
                  </div>
                  <div className="d-flex align-items-center justify-content-between gx-2">
                    <div>
                      <p className="mb-0">Email</p>
                      <p className="text-dark">col@example.com</p>
                    </div>
                    <div>
                      <p className="mb-0">Phone</p>
                      <p className="text-dark">+1 65738 58937</p>
                    </div>
                  </div>
                </div>
                <div className="card-footer d-flex align-items-center justify-content-between">
                  <div className="d-flex align-items-center">
                    <div className="d-flex align-items-center">
                      <Link
                        to={routes.studentDetail}
                        className="avatar avatar-md flex-shrink-0 p-0 me-2"
                      >
                        <ImageWithBasePath
                          src="assets/img/students/student-05.jpg"
                          alt="img"
                          className="img-fluid rounded-circle"
                        />
                      </Link>
                      <p className="text-dark">Lisa</p>
                    </div>
                  </div>
                  <Link
                    to="#"
                    className="btn btn-light btn-sm"
                    onClick={() => setShow(true)}
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </div> */}
            {/* /Guardian Grid */}
            {/* Guardian Grid */}
            {/* <div className="col-xl-4 col-md-6 d-flex">
              <div className="card flex-fill">
                <div className="card-header d-flex align-items-center justify-content-between">
                  <Link
                    to="#"
                    className="link-primary"
                    onClick={() => setShow(true)}
                  >
                    G124556
                  </Link>
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
                            to="#"
                            data-bs-toggle="modal"
                            data-bs-target="#edit_guardian"
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
                <div className="card-body">
                  <div className="bg-light-300 rounded-2 p-3 mb-3">
                    <div className="d-flex align-items-center">
                      <Link
                        to="#"
                        onClick={() => setShow(true)}
                        className="avatar avatar-lg flex-shrink-0"
                      >
                        <ImageWithBasePath
                          src="assets/img/parents/parent-01.jpg"
                          className="img-fluid rounded-circle"
                          alt="img"
                        />
                      </Link>
                      <div className="ms-2">
                        <h6 className="text-dark text-truncate mb-0">
                          <Link to="#" onClick={() => setShow(true)}>Thomas</Link>
                        </h6>
                        <p>Added on 25 Mar 2024</p>
                      </div>
                    </div>
                  </div>
                  <div className="d-flex align-items-center justify-content-between gx-2">
                    <div>
                      <p className="mb-0">Email</p>
                      <p className="text-dark">tom@example.com</p>
                    </div>
                    <div>
                      <p className="mb-0">Phone</p>
                      <p className="text-dark">+1 65738 58937</p>
                    </div>
                  </div>
                </div>
                <div className="card-footer d-flex align-items-center justify-content-between">
                  <div className="d-flex align-items-center">
                    <div className="d-flex align-items-center">
                      <Link
                        to={routes.studentDetail}
                        className="avatar avatar-md flex-shrink-0 p-0 me-2"
                      >
                        <ImageWithBasePath
                          src="assets/img/students/student-01.jpg"
                          alt="img"
                          className="img-fluid rounded-circle"
                        />
                      </Link>
                      <p className="text-dark">Janet</p>
                    </div>
                  </div>
                  <Link
                    to="#"
                    className="btn btn-light btn-sm"
                    onClick={() => setShow(true)}
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </div> */}
            {/* /Guardian Grid */}
            {/* Guardian Grid */}
            {/* <div className="col-xl-4 col-md-6 d-flex">
              <div className="card flex-fill">
                <div className="card-header d-flex align-items-center justify-content-between">
                  <Link
                    to="#"
                    className="link-primary"
                    onClick={() => setShow(true)}
                  >
                    G124554
                  </Link>
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
                            to="#"
                            data-bs-toggle="modal"
                            data-bs-target="#edit_guardian"
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
                <div className="card-body">
                  <div className="bg-light-300 rounded-2 p-3 mb-3">
                    <div className="d-flex align-items-center">
                      <Link
                        to="#"
                        onClick={() => setShow(true)}
                        className="avatar avatar-lg flex-shrink-0"
                      >
                        <ImageWithBasePath
                          src="assets/img/parents/parent-03.jpg"
                          className="img-fluid rounded-circle"
                          alt="img"
                        />
                      </Link>
                      <div className="ms-2">
                        <h6 className="text-dark text-truncate mb-0">
                          <Link to="#" onClick={() => setShow(true)}>Johnson</Link>
                        </h6>
                        <p>Added on 14 Mar 2024</p>
                      </div>
                    </div>
                  </div>
                  <div className="d-flex align-items-center justify-content-between gx-2">
                    <div>
                      <p className="mb-0">Email</p>
                      <p className="text-dark">joh@example.com</p>
                    </div>
                    <div>
                      <p className="mb-0">Phone</p>
                      <p className="text-dark">+1 65738 58937</p>
                    </div>
                  </div>
                </div>
                <div className="card-footer d-flex align-items-center justify-content-between">
                  <div className="d-flex align-items-center">
                    <div className="d-flex align-items-center">
                      <Link
                        to={routes.studentDetail}
                        className="avatar avatar-md flex-shrink-0 p-0 me-2"
                      >
                        <ImageWithBasePath
                          src="assets/img/students/student-03.jpg"
                          alt="img"
                          className="img-fluid rounded-circle"
                        />
                      </Link>
                      <p className="text-dark">Kathleen</p>
                    </div>
                  </div>
                  <Link
                    to="#"
                    className="btn btn-light btn-sm"
                    onClick={() => setShow(true)}
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </div> */}
            {/* /Guardian Grid */}
            {/* Guardian Grid */}
            {/* <div className="col-xl-4 col-md-6 d-flex">
              <div className="card flex-fill">
                <div className="card-header d-flex align-items-center justify-content-between">
                  <Link
                    to="#"
                    className="link-primary"
                    onClick={() => setShow(true)}
                  >
                    G124555
                  </Link>
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
                            to="#"
                            data-bs-toggle="modal"
                            data-bs-target="#edit_guardian"
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
                <div className="card-body">
                  <div className="bg-light-300 rounded-2 p-3 mb-3">
                    <div className="d-flex align-items-center">
                      <Link
                        to="#"
                        onClick={() => setShow(true)}
                        className="avatar avatar-lg flex-shrink-0"
                      >
                        <ImageWithBasePath
                          src="assets/img/parents/parent-02.jpg"
                          className="img-fluid rounded-circle"
                          alt="img"
                        />
                      </Link>
                      <div className="ms-2">
                        <h6 className="text-dark text-truncate mb-0">
                          <Link to="#" onClick={() => setShow(true)}>Marquita</Link>
                        </h6>
                        <p>Added on 18 Mar 2024</p>
                      </div>
                    </div>
                  </div>
                  <div className="d-flex align-items-center justify-content-between gx-2">
                    <div>
                      <p className="mb-0">Email</p>
                      <p className="text-dark">mar@example.com</p>
                    </div>
                    <div>
                      <p className="mb-0">Phone</p>
                      <p className="text-dark">+1 65738 58937</p>
                    </div>
                  </div>
                </div>
                <div className="card-footer d-flex align-items-center justify-content-between">
                  <div className="d-flex align-items-center">
                    <div className="d-flex align-items-center">
                      <Link
                        to={routes.studentDetail}
                        className="avatar avatar-md flex-shrink-0 p-0 me-2"
                      >
                        <ImageWithBasePath
                          src="assets/img/students/student-02.jpg"
                          alt="img"
                          className="img-fluid rounded-circle"
                        />
                      </Link>
                      <p className="text-dark">Joann</p>
                    </div>
                  </div>
                  <Link
                    to="#"
                    className="btn btn-light btn-sm"
                    onClick={() => setShow(true)}
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </div> */}
            {/* /Guardian Grid */}
            <div className="col-md-12">
              <div className="load-more text-center">
                <Link to="#" className="btn btn-primary">
                  <i className="ti ti-loader-3" />
                  Load More
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* /Page Wrapper */}
      <GuardianModal />

      <Modal show={show} onHide={handleClose} centered size="lg">
        <div className="modal-header">
          <h4 className="modal-title">View Details</h4>
          <button
            type="button"
            className="btn-close custom-btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
            onClick={handleClose}
          >
            <i className="ti ti-x" />
          </button>
        </div>
        <div className="modal-body mb-0">
          <div className="parent-wrap">
            <div className="row align-items-center">
              <div className="col-lg-6">
                <div className="d-flex align-items-center mb-3">
                  <span className="avatar avatar-xl me-2">
                    <ImageWithBasePath
                      src="assets/img/guardians/guardian-01.jpg"
                      alt="img"
                    />
                  </span>
                  <div className="parent-name">
                    <h5 className="mb-1">William</h5>
                    <p>Added on 25 Mar 2024</p>
                  </div>
                </div>
              </div>
              <div className="col-lg-6">
                <ul className="d-flex align-items-center">
                  <li className="mb-3 me-5">
                    <p className="mb-1">Email</p>
                    <h6 className="fw-normal">wil@example.com</h6>
                  </li>
                  <li className="mb-3">
                    <p className="mb-1">Phone</p>
                    <h6 className="fw-normal">+1 82392 37359</h6>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <h5 className="mb-3">Children Details</h5>
          <div className="border rounded p-4 pb-1 mb-3">
            <div className="d-flex align-items-center justify-content-between flex-wrap pb-1 mb-3 border-bottom">
              <span className="link-primary mb-2">AD9892434</span>
              <span className="badge badge-soft-success badge-md mb-2">
                <i className="ti ti-circle-filled me-2" />
                Active
              </span>
            </div>
            <div className="d-flex align-items-center justify-content-between flex-wrap">
              <div className="d-flex align-items-center mb-3">
                <Link to={routes.studentDetail} className="avatar">
                  <ImageWithBasePath
                    src="assets/img/students/student-01.jpg"
                    className="img-fluid rounded-circle"
                    alt="img"
                  />
                </Link>
                <div className="ms-2">
                  <p className="mb-0">
                    <Link to={routes.studentDetail}>Janet</Link>
                  </p>
                  <span>III, A</span>
                </div>
              </div>
              <ul className="d-flex align-items-center flex-wrap">
                <li className="mb-3 me-4">
                  <p className="mb-1">Roll No</p>
                  <h6 className="fw-normal">35010</h6>
                </li>
                <li className="mb-3 me-4">
                  <p className="mb-1">Gender</p>
                  <h6 className="fw-normal">Female</h6>
                </li>
                <li className="mb-3">
                  <p className="mb-1">Date of Joined</p>
                  <h6 className="fw-normal">22 Mar 2018</h6>
                </li>
              </ul>
              <div className="d-flex align-items-center">
                <Link to="#" className="btn btn-light mb-3 me-3">
                  Add Fees
                </Link>
                <Link
                  to={routes.studentDetail}
                  className="btn btn-primary mb-3"
                >
                  View Details
                </Link>
              </div>
            </div>
          </div>
          <div className="border rounded p-4 pb-1 mb-3">
            <div className="d-flex align-items-center justify-content-between flex-wrap pb-1 mb-3 border-bottom">
              <span className="link-primary mb-2">AD9892433</span>
              <span className="badge badge-soft-success badge-md mb-2">
                <i className="ti ti-circle-filled me-2" />
                Active
              </span>
            </div>
            <div className="d-flex align-items-center justify-content-between flex-wrap">
              <div className="d-flex align-items-center mb-3">
                <Link to={routes.studentDetail} className="avatar">
                  <ImageWithBasePath
                    src="assets/img/students/student-02.jpg"
                    className="img-fluid rounded-circle"
                    alt="img"
                  />
                </Link>
                <div className="ms-2">
                  <p className="mb-0">
                    <Link to={routes.studentDetail}>Joann</Link>
                  </p>
                  <span>IV, B</span>
                </div>
              </div>
              <ul className="d-flex align-items-center flex-wrap">
                <li className="mb-3 me-4">
                  <p className="mb-1">Roll No</p>
                  <h6 className="fw-normal">35012</h6>
                </li>
                <li className="mb-3 me-4">
                  <p className="mb-1">Gender</p>
                  <h6 className="fw-normal">Male</h6>
                </li>
                <li className="mb-3">
                  <p className="mb-1">Date of Joined</p>
                  <h6 className="fw-normal">18 Mar 2018</h6>
                </li>
              </ul>
              <div className="d-flex align-items-center">
                <Link to="#" className="btn btn-light mb-3 me-3">
                  Add Fees
                </Link>
                <Link
                  to={routes.studentDetail}
                  className="btn btn-primary mb-3"
                >
                  View Details
                </Link>
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default GuardianGrid;
