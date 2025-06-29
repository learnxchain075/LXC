import React, { useEffect, useRef, useState } from "react";
import { all_routes } from "../../../../router/all_routes";
import { Link } from "react-router-dom";
import PredefinedDateRanges from "../../../../core/common/datePicker";
import CommonSelect from "../../../../core/common/commonSelect";
import TooltipOption from "../../../../core/common/tooltipOption";
import { Table } from "antd";
import { toast, ToastContainer } from 'react-toastify';
import { getBuses } from "../../../../services/transport/busServices";
import { getBusStops, createBusStop } from "../../../../services/transport/busStopServices";
import { IBus } from "../../../../services/types/transport/busService";
import { IBusStop, ICreateBusStop } from "../../../../services/types/transport/busStopService";
import { getRoutesBySchoolId } from "../../../../services/transport/busRouteServices";
import { IRoute } from "../../../../services/types/transport/busRouteService";

const AddBusStop = () => {
  const routes = all_routes;
  const dropdownMenuRef = useRef<HTMLDivElement | null>(null);
  const [busList, setBusList] = useState<IBus[]>([]);
  const [busStopList, setBusStopList] = useState<IBusStop[]>([]);
  const [routeList, setRouteList] = useState<IRoute[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [form, setForm] = useState<ICreateBusStop>({ name: '', location: '', routeId: '', schoolId: localStorage.getItem('schoolId') || '' });
  const [loading, setLoading] = useState(false);

  const fetchBusesAndStops = async () => {
    setLoading(true);
    try {
      const [busesRes, stopsRes, routesRes] = await Promise.all([
        getBuses(),
        getBusStops(),
        getRoutesBySchoolId(localStorage.getItem('schoolId') || '')
      ]);
      setBusList(busesRes.data);
      setBusStopList(stopsRes.data);
      setRouteList(routesRes.data);
    } catch (error) {
      toast.error("Failed to fetch buses, stops, or routes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchBusesAndStops(); }, []);

  const handleApplyClick = () => {
    if (dropdownMenuRef.current) {
      dropdownMenuRef.current.classList.remove("show");
    }
  };

  const handleAddBusStop = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.location || !form.routeId || !form.schoolId) {
      toast.error('Please fill all fields');
      return;
    }
    try {
      await createBusStop(form as ICreateBusStop);
      toast.success('Bus stop added successfully');
      setShowAddModal(false);
      setForm({ name: '', location: '', routeId: '', schoolId: localStorage.getItem('schoolId') || '' });
      fetchBusesAndStops();
    } catch (error) {
      toast.error('Failed to add bus stop');
    }
  };

  const columns = [
    {
      title: "Bus Stop Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Location",
      dataIndex: "location",
      key: "location",
    },
    {
      title: "Route Name",
      dataIndex: "routeId",
      key: "routeId",
      render: (routeId: string) => {
        const route = routeList.find(r => r.id === routeId);
        return route ? route.name : 'N/A';
      }
    },
  
  ];

  return (
    <>
      <ToastContainer position="top-center" autoClose={3000} />
      <div className="page-wrapper">
        <div className="content">
          <div className="d-md-flex d-block align-items-center justify-content-between mb-3">
            <div className="my-auto mb-2">
              <h3 className="page-title mb-1">Add Bus Stop</h3>
              <nav>
                <ol className="breadcrumb mb-0">
                  <li className="breadcrumb-item">
                    <Link to={routes.adminDashboard}>Dashboard</Link>
                  </li>
                  <li className="breadcrumb-item">
                    <Link to="#">Management</Link>
                  </li>
                  <li className="breadcrumb-item active" aria-current="page">
                    Add Bus Stop
                  </li>
                </ol>
              </nav>
            </div>
            <div className="d-flex my-xl-auto right-content align-items-center flex-wrap">
              <TooltipOption />
              <div className="d-flex gap-2 mb-2">
                <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>
                  <i className="ti ti-square-rounded-plus me-2" />
                  Add Bus Stop
                </button>
              </div>
            </div>
          </div>
          <div className="card">
            <div className="card-header d-flex align-items-center justify-content-between flex-wrap pb-0">
              <h4 className="mb-3">Bus Stops</h4>
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
                      <div className="p-3 border-bottom">
                        <div className="row">
                          <div className="col-md-12">
                            <div className="mb-3">
                              <label className="form-label">Bus</label>
                              <CommonSelect
                                className="select"
                                options={busList.map(bus => ({ label: bus.busNumber, value: bus.id }))}
                                defaultValue={undefined}
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
                    Sort by A-Z
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
              <Table dataSource={busStopList} columns={columns} rowKey="id" loading={loading} />
            </div>
          </div>
        </div>
      </div>
      {/* Add Bus Stop Modal */}
      {showAddModal && (
        <div className="modal fade show d-block" tabIndex={-1} role="dialog" style={{ background: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h4 className="modal-title">Add Bus Stop</h4>
                <button type="button" className="btn-close custom-btn-close" onClick={() => setShowAddModal(false)} aria-label="Close">
                  <i className="ti ti-x" />
                </button>
              </div>
              <form onSubmit={handleAddBusStop}>
                <div className="modal-body">
                  <div className="row">
                    <div className="col-md-12 mb-3">
                      <label className="form-label">Bus Stop Name</label>
                      <input type="text" className="form-control" name="name" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required />
                    </div>
                    <div className="col-md-12 mb-3">
                      <label className="form-label">Location</label>
                      <input type="text" className="form-control" name="location" value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))} required />
                    </div>
                    <div className="col-md-12 mb-3">
                      <label className="form-label">Select Route</label>
                      <select className="form-select" name="routeId" value={form.routeId} onChange={e => setForm(f => ({ ...f, routeId: e.target.value }))} required>
                        <option value="">Select Route</option>
                        {routeList.map(route => (
                          <option key={route.id} value={route.id}>{route.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-light me-2" onClick={() => setShowAddModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Add Bus Stop
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AddBusStop; 