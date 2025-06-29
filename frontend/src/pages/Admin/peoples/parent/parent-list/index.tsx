import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Modal } from "react-bootstrap";
import ParentModal from "../parentModal";
import ImageWithBasePath from "../../../../../core/common/imageWithBasePath";
import PredefinedDateRanges from "../../../../../core/common/datePicker";
import CommonSelect from "../../../../../core/common/commonSelect";
import TooltipOption from "../../../../../core/common/tooltipOption";
import Table from "../../../../../core/common/dataTable";
import { all_routes } from "../../../../../router/all_routes";
import { allClass, names, parent as parentOptions, status } from "../../../../../core/common/selectoption/selectoption";
import { getParentsBySchool } from "../../../../../services/parents/parentsApi";
import { Parent } from "../../../../../services/types/parents/parentTypes";

const ParentList: React.FC = () => {
  const [show, setShow] = useState(false);
  const [parents, setParents] = useState<Parent[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [fetchError, setFetchError] = useState<string>("");
  const [selectedParent, setSelectedParent] = useState<Parent | null>(null);

  const dropdownMenuRef = useRef<HTMLDivElement | null>(null);
  const routes = all_routes;

  const handleClose = () => {
    setShow(false);
    setSelectedParent(null);
  };

  const handleViewParent = (parent: Parent) => {
    setSelectedParent(parent);
    setShow(true);
  };

  const schoolId = localStorage.getItem("schoolId");
  const accessToken = localStorage.getItem("accessToken");

  useEffect(() => {
    const fetchParents = async () => {
      if (!schoolId) {
        setFetchError("School id not found.");
        setLoading(false);
        return;
      }
      try {
        const response = await getParentsBySchool(schoolId);
        setParents(response.data.data || []);
      } catch (error: any) {
        console.error("Error fetching parents: ", error);
        setFetchError("Failed to fetch parents.");
      } finally {
        setLoading(false);
      }
    };
    fetchParents();
  }, [schoolId, accessToken]);

  const columns = [
    {
      title: "Parent Name",
      dataIndex: "user.name",
      render: (_: any, record: Parent) => (
        <div className="d-flex align-items-center">
          <div className="avatar avatar-sm me-2">
            <ImageWithBasePath
              src={record?.user?.profilePic || "assets/img/default-parent.jpg"}
              className="avatar-img rounded-circle"
              alt="Parent"
            />
          </div>
          <div>
            <Link 
              to="#" 
              onClick={() => handleViewParent(record)}
              className="text-primary"
            >
              {record?.user?.name || "N/A"}
            </Link>
          </div>
        </div>
      ),
    },
    {
      title: "Phone",
      dataIndex: "user.phone",
      render: (_: any, record: Parent) => record?.user?.phone || "-",
    },
    {
      title: "Email",
      dataIndex: "user.email",
      render: (_: any, record: Parent) => record?.user?.email || "-",
    },
    {
      title: "Action",
      dataIndex: "action",
      render: (_: any, record: Parent) => (
        <div className="dropdown">
          <Link to="#" className="btn btn-sm btn-light" data-bs-toggle="dropdown">
            <i className="ti ti-dots-vertical" />
          </Link>
          <ul className="dropdown-menu p-2">
            <li>
              <Link to="#" onClick={() => handleViewParent(record)} className="dropdown-item">
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
    <div className="page-wrapper">
      <div className="content">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h3 className="page-title">Parents</h3>
        </div>
        <div className="card">
          <div className="card-header">
            <h4 className="card-title">Parents List</h4>
          </div>
          <div className="card-body">
            {loading ? (
              <div className="text-center">Loading...</div>
            ) : fetchError ? (
              <div className="text-danger text-center">{fetchError}</div>
            ) : (
              <Table columns={columns} dataSource={parents} />
            )}
          </div>
        </div>
      </div>

      {/* View Parent Modal */}
      <Modal show={show} onHide={handleClose} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Parent Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedParent ? (
            <div className="parent-details">
              <div className="row">
                <div className="col-md-12 mb-4">
                  <div className="d-flex align-items-center">
                    <div className="avatar avatar-lg me-3">
                      <ImageWithBasePath
                        src={selectedParent?.user?.profilePic || "assets/img/default-parent.jpg"}
                        className="avatar-img rounded-circle"
                        alt="Parent"
                      />
                    </div>
                    <div>
                      <h4 className="mb-1">{selectedParent?.user?.name}</h4>
                      <p className="text-muted mb-0">
                        <i className="ti ti-mail me-2"></i>
                        {selectedParent?.user?.email}
                      </p>
                      <p className="text-muted mb-0">
                        <i className="ti ti-phone me-2"></i>
                        {selectedParent?.user?.phone}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="col-md-12">
                  <div className="card mb-4">
                    <div className="card-header">
                      <h5 className="card-title mb-0">Contact Information</h5>
                    </div>
                    <div className="card-body">
                      <div className="row">
                        <div className="col-md-6 mb-3">
                          <label className="form-label text-muted">Address</label>
                          <p className="mb-0">{selectedParent?.address || 'Not provided'}</p>
                        </div>
                        <div className="col-md-6 mb-3">
                          <label className="form-label text-muted">Occupation</label>
                          <p className="mb-0">{selectedParent?.occupation || 'Not provided'}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {selectedParent?.students && selectedParent.students.length > 0 && (
                    <div className="card">
                      <div className="card-header">
                        <h5 className="card-title mb-0">Children Information</h5>
                      </div>
                      <div className="card-body">
                        {selectedParent.students.map((student: any, index: number) => (
                          <div key={index} className="d-flex align-items-center mb-3">
                            <div className="avatar avatar-sm me-3">
                              <ImageWithBasePath
                                src={student?.profilePic || student?.user?.profilePic || "assets/img/default-student.jpg"}
                                className="avatar-img rounded-circle"
                                alt="Student"
                              />
                            </div>
                            <div>
                              <h6 className="mb-0">{student.user?.name || student.name}</h6>
                              <small className="text-muted">
                                Class: {typeof student.class === 'object' ? student.class?.name : student.class}
                              </small>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-4">
              <p>No parent details available</p>
            </div>
          )}
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default ParentList;
