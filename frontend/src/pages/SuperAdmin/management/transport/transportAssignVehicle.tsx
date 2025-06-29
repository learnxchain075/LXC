import React, { useEffect, useRef, useState } from "react";
import { all_routes } from "../../../../router/all_routes";
import { Link } from "react-router-dom";
import PredefinedDateRanges from "../../../../core/common/datePicker";
import CommonSelect from "../../../../core/common/commonSelect";
import {
  driverFilter3,
  driverName,
  PickupPoint2,
  routesList,
  status,
  VehicleNumber,
} from "../../../../core/common/selectoption/selectoption";
import { TableData } from "../../../../core/data/interface";

import TooltipOption from "../../../../core/common/tooltipOption";
import TransportModal from "./transportModal";
import ImageWithBasePath from "../../../../core/common/imageWithBasePath";
import { getRoutesBySchoolId } from "../../../../services/transport/busRouteServices";
import { getBusStopsBySchoolId } from "../../../../services/transport/busStopServices";
import { getPickupPointsBySchool } from "../../../../services/transport/busPickUpPointServices";
import { getBusbyID } from "../../../../services/transport/busServices";
import { assignTransport, updateTransport, removeTransport, getTransportDetails } from "../../../../services/transport/transportServices";
import { IRoute } from "../../../../services/types/transport/busRouteService";
import { IBusStop } from "../../../../services/types/transport/busStopService";
import { IBus } from "../../../../services/types/transport/busService";
import { IPickUpPoint } from "../../../../services/types/transport/busPickupTypes";
import { Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import { getSchoolStudents } from "../../../../services/admin/studentRegister";
// import { transportAssignData } from "../../../core/data/json/transport_assign";

const TransportAssignVehicle = () => {
  const routes = all_routes;
  const dropdownMenuRef = useRef<HTMLDivElement | null>(null);
  const [routeList, setRouteList] = useState<IRoute[]>([]);
  const [busStopList, setBusStopList] = useState<IBusStop[]>([]);
  const [pickupPointList, setPickupPointList] = useState<IPickUpPoint[]>([]);
  const [busList, setBusList] = useState<IBus[]>([]);
  const [tableData, setTableData] = useState<any[]>([]);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const schoolId = localStorage.getItem("schoolId") || "";
  const [loading, setLoading] = useState(false);

  const fetchAll = async () => {
    try {
      const [routesRes, busStopsRes, pickupPointsRes, busesRes] = await Promise.all([
        getRoutesBySchoolId(schoolId),
        getBusStopsBySchoolId(schoolId),
        getPickupPointsBySchool(schoolId),
        getBusbyID(schoolId),
      ]);

      const routes = routesRes.data || [];
      const busStops = busStopsRes.data || [];
      const pickupPoints = pickupPointsRes.data || [];
      const buses = (busesRes.data as IBus[]) || [];

      setRouteList(routes);
      setBusStopList(busStops);
      setPickupPointList(pickupPoints);
      setBusList(buses);

      // Dynamic Table Data Creation
      const maxLength = Math.max(routes.length, pickupPoints.length, buses.length);
      if (maxLength > 0) {
        const dynamicTable = Array.from({ length: maxLength }).map((_, index) => ({
          id: String(index + 1),
          route: routes[index % routes.length]?.name || 'N/A',
          pickupPoint: pickupPoints[index % pickupPoints.length]?.name || 'N/A',
          vehicle: buses[index % buses.length]?.busNumber || 'N/A',
          name: `Driver ${index + 1}`, // You can customize or map driver info later
          img: '',
          phone: `12345678${index}`, // Placeholder phone number
          status: 'Active',
        }));
        setTableData(dynamicTable);
      } else {
        setTableData([]);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setTableData([]);
    }
  };

  useEffect(() => {
    fetchAll();
  }, [schoolId]);

  const fetchAllAssignments = async () => {
    setLoading(true);
    try {
      // Fetch all supporting lists first
      const [studentsRes, routesRes, busStopsRes, pickupPointsRes, busesRes] = await Promise.all([
        getSchoolStudents(schoolId),
        getRoutesBySchoolId(schoolId),
        getBusStopsBySchoolId(schoolId),
        getPickupPointsBySchool(schoolId),
        getBusbyID(schoolId),
      ]);
      const students = studentsRes.data || [];
      const routeList = routesRes.data || [];
      const busStopList = busStopsRes.data || [];
      const pickupPointList = pickupPointsRes.data || [];
      const busList = (busesRes.data as IBus[]) || [];

      // Helper functions to map IDs to names
      const getRouteName = (id: string) => routeList.find((r: any) => r.id === id)?.name || 'N/A';
      const getBusStopName = (id: string) => busStopList.find((b: any) => b.id === id)?.name || 'N/A';
      const getBusNumber = (id: string) => busList.find((b: any) => b.id === id)?.busNumber || 'N/A';

      // Fetch transport assignments for each student in parallel
      const assignments = await Promise.all(
        students.map(async (student: any) => {
          try {
            const transportRes = await getTransportDetails(student.id);
            const t = transportRes.data;
            return {
              id: student.id,
              studentName: student.fatherName || student.name || 'N/A',
              route: getRouteName(t.routeId),
              pickupPoint: getBusStopName(t.busStopId),
              vehicle: getBusNumber(t.busId),
              name: 'N/A', // Map driver if available
              img: '',
              phone: student.fatherPhone || '',
              status: 'Active',
            };
          } catch {
            return {
              id: student.id,
              studentName: student.fatherName || student.name || 'N/A',
              route: 'N/A',
              pickupPoint: 'N/A',
              vehicle: 'N/A',
              name: 'N/A',
              img: '',
              phone: student.fatherPhone || '',
              status: 'Inactive',
            };
          }
        })
      );
      setTableData(assignments);
    } catch (error) {
      setTableData([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchAllAssignments();
  }, [schoolId]);

  const handleAssign = async (studentId: string, data: any) => {
    const res = await assignTransport(studentId, data);
    // console.log('Assign Transport Response:', res);
    // Refresh table data after assign
  };
  const handleUpdate = async (studentId: string, data: any) => {
    const res = await updateTransport(studentId, data);
    // console.log('Update Transport Response:', res);
    // Refresh table data after update
  };
  const handleDelete = async (studentId: string) => {
    const res = await removeTransport(studentId);
    // console.log('Remove Transport Response:', res);
    // Refresh table data after delete
  };

  const handleApplyClick = () => {
    if (dropdownMenuRef.current) {
      dropdownMenuRef.current.classList.remove("show");
    }
  };
  const columns = [
    {
      title: "Student Name",
      dataIndex: "studentName",
      key: "studentName",
    },
    {
      title: "Route",
      dataIndex: "route",
      key: "route",
    },
    {
      title: "Pickup Point",
      dataIndex: "pickupPoint",
      key: "pickupPoint",
    },
    {
      title: "Vehicle",
      dataIndex: "vehicle",
      key: "vehicle",
    },
    {
      title: "Driver",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Phone",
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
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
              <h3 className="page-title mb-1">Assign Vehicle</h3>
              <nav>
                <ol className="breadcrumb mb-0">
                  <li className="breadcrumb-item">
                    <Link to={routes.adminDashboard}>Dashboard</Link>
                  </li>
                  <li className="breadcrumb-item">
                    <Link to="#">Management</Link>
                  </li>
                  <li className="breadcrumb-item active" aria-current="page">
                    Assign Vehicle
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
                  data-bs-target="#add_assign_vehicle"
                >
                  <i className="ti ti-square-rounded-plus me-2" />
                  Assign New Vehicle
                </Link>
              </div>
            </div>
          </div>
          {/* /Page Header */}
          {/* Students List */}
          <div className="card">
            <div className="card-header d-flex align-items-center justify-content-between flex-wrap pb-0">
              <h4 className="mb-3">Assign Vehicle List</h4>
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
                              <label className="form-label">Route</label>
                              <CommonSelect
                                className="select"
                                options={routesList}
                                defaultValue={undefined}
                              />
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="mb-3">
                              <label className="form-label">
                                Pickup Points
                              </label>
                              <CommonSelect
                                className="select"
                                options={PickupPoint2}
                                defaultValue={undefined}
                              />
                            </div>
                          </div>
                          <div className="col-md-12">
                            <div className="mb-3">
                              <label className="form-label">
                                Vehicle Number
                              </label>
                              <CommonSelect
                                className="select"
                                options={VehicleNumber}
                                defaultValue={undefined}
                              />
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="mb-3">
                              <label className="form-label">Driver</label>
                              <CommonSelect
                                className="select"
                                options={driverName}
                                defaultValue={undefined}
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
                          <div className="col-md-12">
                            <div className="mb-0">
                              <label className="form-label">More Filter</label>
                              <CommonSelect
                                className="select"
                                options={driverFilter3}
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
              {/* Student List */}
              <Table
                dataSource={tableData}
                columns={columns as ColumnsType<any>}
                rowKey="id"
                loading={loading}
                locale={{ emptyText: "No data" }}
              />
              {/* /Student List */}
            </div>
          </div>
          {/* /Students List */}
        </div>
      </div>
      {/* /Page Wrapper */}
      <TransportModal />
    </>
  );
};

export default TransportAssignVehicle;
