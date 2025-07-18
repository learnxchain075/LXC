import React, { useRef, useState, useEffect } from "react";
import { all_routes } from "../../../../router/all_routes";
import { Link } from "react-router-dom";
import PredefinedDateRanges from "../../../../core/common/datePicker";
import CommonSelect from "../../../../core/common/commonSelect";
import {
  hostelName,
  hostelType,
  moreFilterHostel,
} from "../../../../core/common/selectoption/selectoption";
import { TableData } from "../../../../core/data/interface";

import TooltipOption from "../../../../core/common/tooltipOption";
// import { hostelListData } from "../../../core/data/json/hostelListData";
import HostelModal from "./hostelModal";
import { getAllHostels } from '../../../../services/admin/hostelRegister';
import { toast } from 'react-toastify';

const HostelList = () => {
  const routes = all_routes;
  const dropdownMenuRef = useRef<HTMLDivElement | null>(null);
  // const data = hostelListData;
  const [hostels, setHostels] = useState<any[]>([]);

  useEffect(() => {
    const fetchHostels = async () => {
      try {
        const response = await getAllHostels();
        setHostels(response.data || []);
      } catch (error) {
        toast.error('Failed to fetch hostels');
      }
    };
    fetchHostels();
  }, []);

  const handleApplyClick = () => {
    if (dropdownMenuRef.current) {
      dropdownMenuRef.current.classList.remove("show");
    }
  };
  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      render: (text: string) => (
        <Link to="#" className="link-primary">
          {text}
        </Link>
      ),
      sorter: (a: TableData, b: TableData) => a.id.length - b.id.length,
    },
    {
      title: "Hostel Name",
      dataIndex: "hostelName",
      
      sorter: (a: TableData, b: TableData) =>
        a.hostelName.length - b.hostelName.length,
    },
    {
      title: "Hostel Type",
      dataIndex: "hostelType",
      
      sorter: (a: TableData, b: TableData) =>
        a.hostelType.length - b.hostelType.length,
    },
    {
      title: "Address",
      dataIndex: "address",
      sorter: (a: TableData, b: TableData) =>
        a.address.length - b.address.length,
    },
    {
      title: "Intake",
      dataIndex: "inTake",
      sorter: (a: TableData, b: TableData) =>
        a.inTake.length - b.inTake.length,
    },
    {
      title: "Description",
      dataIndex: "description",
      
      sorter: (a: TableData, b: TableData) => a.description.length - b.description.length,
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
                    to="#"
                    data-bs-toggle="modal"
                    data-bs-target="#edit_hostel"
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
        </>
      ),
    },
  ];
  return (
    <>
      {/* Page Wrapper */}
      <div className="page-wrapper">
        <div className="content">
          {/* Page Header */}
          <div className="d-md-flex d-block align-items-center justify-content-between mb-3">
            <div className="my-auto mb-2">
              <h3 className="page-title mb-1">Hostel</h3>
              <nav>
                <ol className="breadcrumb mb-0">
                  <li className="breadcrumb-item">
                    <Link to={routes.adminDashboard}>Dashboard</Link>
                  </li>
                  <li className="breadcrumb-item">
                    <Link to="#">Management</Link>
                  </li>
                  <li className="breadcrumb-item active" aria-current="page">
                  Hostel
                  </li>
                </ol>
              </nav>
            </div>
            <div className="d-flex my-xl-auto right-content align-items-center flex-wrap">
              <TooltipOption />
              <div className="mb-2">
                <Link
                  to="#"
                  className="btn btn-primary"
                  data-bs-toggle="modal"
                  data-bs-target="#add_hostel"
                >
                  <i className="ti ti-square-rounded-plus me-2" />
                  Add Hostel
                </Link>
              </div>
            </div>
          </div>
          {/* /Page Header */}
          {/* Students List */}
          <div className="card">
            <div className="card-header d-flex align-items-center justify-content-between flex-wrap pb-0">
              <h4 className="mb-3">Hostel</h4>
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
                      <div className="p-3 border-bottom">
                        <div className="row">
                          <div className="col-md-6">
                            <div className="mb-3">
                              <label className="form-label">Name</label>
                              <CommonSelect
                                className="select"
                                options={hostelName}
                                defaultValue={undefined}
                              />
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="mb-3">
                              <label className="form-label">Type</label>
                              <CommonSelect
                                className="select"
                                options={hostelType}
                                defaultValue={hostelType[0]}
                              />
                            </div>
                          </div>
                          <div className="col-md-12">
                            <div className="mb-0">
                              <label className="form-label">More Filter</label>
                              <CommonSelect
                                className="select"
                                options={moreFilterHostel}
                                defaultValue={moreFilterHostel[0]}
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
                      <Link to="#" className="dropdown-item rounded-1">
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
              {hostels.length === 0 ? (
                <div className="text-center">No hostels found.</div>
              ) : (
                <table className="table table-bordered">
                  <thead>
                    <tr>
                      <th>Hostel Name</th>
                      <th>Hostel Type</th>
                      <th>Address</th>
                      <th>Intake</th>
                      <th>Description</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {hostels.map((hostel) => (
                      <tr key={hostel.id}>
                        <td>{hostel.hostelName}</td>
                        <td>{hostel.hostelType}</td>
                        <td>{hostel.address}</td>
                        <td>{hostel.inTake}</td>
                        <td>{hostel.description}</td>
                        <td>
                          <button className="btn btn-sm btn-warning me-1" data-bs-toggle="modal" data-bs-target="#edit_hostel">Edit</button>
                          <button className="btn btn-sm btn-danger" data-bs-toggle="modal" data-bs-target="#delete-modal">Delete</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
          {/* /Students List */}
        </div>
      </div>
      {/* /Page Wrapper */}
      <HostelModal />
    </>
  );
};

export default HostelList;
