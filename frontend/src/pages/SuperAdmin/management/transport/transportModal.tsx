import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { driverName, PickupPoint2, routesList, VehicleNumber } from "../../../../core/common/selectoption/selectoption";
import CommonSelect from "../../../../core/common/commonSelect";
import ImageWithBasePath from "../../../../core/common/imageWithBasePath";
import dayjs from "dayjs";
import { DatePicker } from "antd";
import { IBusForm } from "../../../../services/types/transport/busService";
import { createBus, getBusbyID } from "../../../../services/transport/busServices";
import { toast, ToastContainer } from "react-toastify";
import { IDriverForm } from "../../../../services/types/transport/driverService";
import { createDriver } from "../../../../services/transport/driverServices";
import { closeModal } from "../../../Common/modalclose";
import { createRoute, getRoutesBySchoolId } from "../../../../services/transport/busRouteServices";
import { IPickupPointForm } from "../../../../services/types/transport/busPickupTypes";
import { createPickupPoint, getPickupPointsBySchool } from "../../../../services/transport/busPickUpPointServices";
import { ITransportForm } from "../../../../services/types/auth";
import { ITransportForm1 } from "../../../../services/types/transport/transportService";
import { getSchoolStudents, getStudentById } from "../../../../services/admin/studentRegister";
import { assignTransport } from "../../../../services/transport/transportServices";
import { createBusStop, getBusStop, getBusStops } from "../../../../services/transport/busStopServices";
import { IBusStop } from "../../../../services/types/transport/busStopService";
interface IBusMinimal {
  id: string;
  busNumber: string;
}

const validateFormFields = (fields: { [key: string]: string }) => {
  
  for (const key in fields) {
    if (fields[key].trim() === "") {
      return `Please fill in the ${key} field.`;
    }
  }
  return null; 
};

const TransportModal = () => {
  
  const [form, setForm] = useState({ busNumber: '', capacity: '' });
  const [busList, setBusList] = useState<IBusMinimal[]>([]);
  const [routelist, setroutelist] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [pickupPoints, setPickupPoints] = useState<any[]>([]);
  const [busStopList, setbusStopList] = useState<any[]>([]);
  const [searchKeyword, setSearchKeyword] = useState('');
const [filteredStudents, setFilteredStudents] = useState<any[]>([]);
  const [formDriver, setFormDriver] = useState<IDriverForm>({
    name: '',
    schoolId: localStorage.getItem('schoolId') || '',
    license: '',
    busId: ''
  });
  const [formRoute, setFormRoute] = useState({
    name: '',
    schoolId: localStorage.getItem('schoolId') || '',
    busId: ''
  })
  const [pickupForm, setPickupForm] = useState<IPickupPointForm>({
    name: '',
    location: '',
    routeId: '',
    schoolId: localStorage.getItem('schoolId') || '',
  });
  const [busStopForm, setBusStopForm] = useState<IBusStopForm>({
    name: '',
    location: '',
    routeId: '',
    schoolId: localStorage.getItem('schoolId') || '',
  });


  const [formTransport, setFormTransport] = useState<any>({
    aasignedTransportToStudent: '',
    studentId: '',
    busId: '',
    routeId: '',
    busStopId: ''
  });
    const today = new Date()
    const year = today.getFullYear()
    const month = String(today.getMonth() + 1).padStart(2, '0') // Month is zero-based, so we add 1
    const day = String(today.getDate()).padStart(2, '0')
    const formattedDate = `${month}-${day}-${year}`
    const defaultValue = dayjs(formattedDate);
    const getModalContainer = () => {
     const modalElement = document.getElementById('modal-datepicker');
     return modalElement ? modalElement : document.body; // Fallback to document.body if modalElement is null
   };
    const getModalContainer2 = () => {
     const modalElement = document.getElementById('modal-datepicker2');
     return modalElement ? modalElement : document.body; // Fallback to document.body if modalElement is null
   };
   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const fetchBuses = async () => {
    const schoolId = localStorage.getItem('schoolId') || '';
    try {
      const res = await getBusbyID(schoolId);
      const buses = Array.isArray(res.data) ? res.data : [];
      const minimal = buses.map((bus: any) => ({
        id: bus.id,
        busNumber: bus.busNumber
      }));
      setBusList(minimal);
    } catch (err) {
      // Error fetching buses
    }
  };
  const fetchpickup = async () => {
    const schoolId = localStorage.getItem('schoolId') || '';
    try {
      const res = await getPickupPointsBySchool(schoolId);
      const buses = Array.isArray(res.data) ? res.data : [];
      setPickupPoints(buses);
    
    } catch (err) {
      // Error fetching buses
    }
  };
  const fetchRoutes = async () => {
    const schoolId = localStorage.getItem('schoolId') || '';
    try {
      const res = await getRoutesBySchoolId(schoolId);
      const routes = Array.isArray(res.data) ? res.data : [];
      setroutelist(routes);
    } catch (err) {
      // Error fetching routes
    }
  };
  const fetchStudents = async () => {
    const schoolId = localStorage.getItem('schoolId');
    if (!schoolId) return;
    try {
      const res = await getSchoolStudents(schoolId);
      setStudents(res.data);
    } catch (err) {
      // Failed to fetch students
    }
  };
  const fetchBusStop = async () => {
    const schoolId = localStorage.getItem('schoolId');
    if (!schoolId) return;
    try {
      // const res = await getBusStop(schoolId);
      const res = await getBusStops();
      setbusStopList(res.data as any);
    } catch (err) {
      // Failed to fetch students
    }
  };
  useEffect(() => {
    
    fetchStudents();
    fetchRoutes();
    fetchpickup();
    fetchBusStop();
    fetchBuses();
  }, []);
  const handleStudentSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const keyword = e.target.value.trim().toLowerCase();
    setSearchKeyword(e.target.value);
    const filtered = students.filter((s) =>
      s.rollNo?.toLowerCase().includes(keyword)
    );
  
    setFilteredStudents(filtered);
  
    if (filtered.length === 1) {
      setFormTransport({ ...formTransport, studentId: filtered[0].id });
    } else {
      setFormTransport({ ...formTransport, studentId: "" });
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload: IBusForm = {
      busNumber: form.busNumber.trim(),
      capacity: Number(form.capacity),
      schoolId: localStorage.getItem('schoolId') || '',
    };
    validateFormFields(form) && toast.error(validateFormFields(form) as string);

    try {
      const response = await createBus(payload);
      closeModal('add_vehicle');
      // console.log('Bus added:', response.data);
   
      toast.success('Bus added successfully!'); 
      setForm({ busNumber: '', capacity: '' }); 
    } catch (err) {
      // Failed to create bus
    }
  };
  const handleSubmitDriver = async (e: React.FormEvent) => {
    e.preventDefault();
    const driverFormFields = {
      name: formDriver.name,
      schoolId: formDriver.schoolId,
      license: formDriver.license,
      busId: formDriver.busId,
    };
    validateFormFields(driverFormFields) && toast.error(validateFormFields(driverFormFields) as string);
    try {
      await createDriver(formDriver);
      closeModal('add_driver');
      toast.success('driver added successfully!'); 
      
      setFormDriver({
        name: '',
        schoolId: localStorage.getItem('schoolId') || '',
        license: '',
        busId: ''
      });

    } catch (err) {
      // Error creating driver
    }
  };
  const handleSubmitRoute = async (e: React.FormEvent) => {
    e.preventDefault();
    const driverFormFields = {
      name: formRoute.name,
      schoolId: formRoute.schoolId,
      busId: formRoute.busId,
    };
  
    validateFormFields(driverFormFields) && toast.error(validateFormFields(driverFormFields) as string);
    try {
      await createRoute(formRoute);
     
      closeModal('add_routes');
      toast.success('route added successfully!'); 
      
      setFormRoute({
        name: '',
        schoolId: localStorage.getItem('schoolId') || '',
    
        busId: ''
      });

    } catch (err) {
      // Error creating route
    }
  };
  
  const handleSubmitpickup = async (e: React.FormEvent) => {
    e.preventDefault();
  
    const pickupPointFields = {
      name: pickupForm.name,
      location: pickupForm.location,
      routeId: pickupForm.routeId,
      schoolId: pickupForm.schoolId,
    };
  
    const validationError = validateFormFields(pickupPointFields);
    if (validationError) {
      toast.error(validationError);
      return;
    }
  
    try {
      await createPickupPoint(pickupForm);
      closeModal('add_pickup');
      toast.success('Pickup point added successfully!');
  
      setPickupForm({
        name: '',
        location: '',
        routeId: '',
        schoolId: localStorage.getItem('schoolId') || '',
      });
    } catch (err) {
      toast.error('Failed to add pickup point. Please try again.');
    }
  };

  const handleSubmitAssign = async (e: React.FormEvent) => {
    e.preventDefault();
  
    const assignFormFields = {
    //  studentId: formTransport.studentId,
      busId: formTransport.busId,
      routeId: formTransport.routeId,
      busStopId: formTransport.busStopId,
    //  aasignedTransportToStudent: "true"
    };
  
   
    const error = validateFormFields(assignFormFields);
    if (error) {
      toast.error(error);
      return;
    }
  
    try {
      
      await assignTransport( formTransport.studentId, assignFormFields); 
  
      toast.success("Transport assigned successfully!");
      setFormTransport({
        studentId: '',
        busId: '',
        routeId: '',
        busStopId: '',
        aasignedTransportToStudent: '',
      });
  
      closeModal("add_assign_vehicle"); 
    } catch (err) {
      // Error assigning transport
      toast.error("Failed to assign transport.");
    }
  };
  const handleSubmitBusStop = async (e: React.FormEvent) => {
    e.preventDefault();
    const busStopFields = {
      name: busStopForm.name,
      location: busStopForm.location,
      routeId: busStopForm.routeId,
      schoolId: busStopForm.schoolId,
    };
    const error = validateFormFields(busStopFields);
    if (error) {
      toast.error(error);
      return;
    }
    try {
      await createBusStop(busStopForm);
      closeModal('add_bus_stop');
      toast.success('Bus stop added successfully!');
      setBusStopForm({
        name: '',
        location: '',
        routeId: '',
        schoolId: localStorage.getItem('schoolId') || '',
      });
    } catch (err) {
      // Error creating bus stop
      toast.error('Failed to add bus stop.');
    }
  };
  
  return (
    <>
      <ToastContainer position="top-center" autoClose={3000} />
      <>
      {/* add bus stop */}
      <div className="modal fade" id="add_bus_stop">
  <div className="modal-dialog modal-dialog-centered">
    <div className="modal-content">
      <div className="modal-header">
        <h4 className="modal-title">Add Bus Stop</h4>
        <button
          type="button"
          className="btn-close custom-btn-close"
          data-bs-dismiss="modal"
          aria-label="Close"
        >
          <i className="ti ti-x" />
        </button>
      </div>
      <form onSubmit={handleSubmitBusStop}>
        <div className="modal-body">
          <div className="row">
            <div className="col-md-12">
              <div className="mb-3">
                <label className="form-label">Name</label>
                <input
                  type="text"
                  name="name"
                  className="form-control"
                  value={busStopForm.name}
                  onChange={(e) => setBusStopForm({ ...busStopForm, name: e.target.value })}
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Location</label>
                <input
                  type="text"
                  name="location"
                  className="form-control"
                  value={busStopForm.location}
                  onChange={(e) => setBusStopForm({ ...busStopForm, location: e.target.value })}
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Route</label>
                <select
                  className="form-control"
                  value={busStopForm.routeId}
                  onChange={(e) => setBusStopForm({ ...busStopForm, routeId: e.target.value })}
                >
                  <option value="">Select Route</option>
                  {routelist.map((route) => (
                    <option key={route.id} value={route.id}>
                      {route.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="modal-satus-toggle d-flex align-items-center justify-content-between">
              <div className="status-title">
                <h5>Status</h5>
                <p>Change the Status by toggle</p>
              </div>
              <div className="status-toggle modal-status">
                <input type="checkbox" id="bus_stop_status" className="check" />
                <label htmlFor="bus_stop_status" className="checktoggle"> </label>
              </div>
            </div>
          </div>
        </div>
        <div className="modal-footer">
          <Link to="#" className="btn btn-light me-2" data-bs-dismiss="modal">
            Cancel
          </Link>
          <button type="submit" className="btn btn-primary">
            Add Bus Stop
          </button>
        </div>
      </form>
    </div>
  </div>
</div>
      </>
      <>
        {/* Add Route */}
        <div className="modal fade" id="add_routes">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h4 className="modal-title">Add Route</h4>
                <button
                  type="button"
                  className="btn-close custom-btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                >
                  <i className="ti ti-x" />
                </button>
              </div>
              <form onSubmit={handleSubmitRoute}>
                <div className="modal-body">
                  <div className="row">
                    <div className="col-md-12">
                      <div className="mb-3">
                        <label className="form-label">Route Name</label>
                        <input type="text"
                         className="form-control"
                          placeholder="Enter Route Name"
                          value={formRoute.name}
                          onChange={(e) => setFormRoute({ ...formRoute, name: e.target.value })}
                          required
                          />
                      </div>
                      <div className="mb-3">
                        <label className="form-label">buses</label>
                        <select
  className="form-control"
  value={formRoute.busId}
  onChange={(e) => setFormRoute({ ...formRoute, busId: e.target.value })}
>
  <option value="">Select a bus</option>
  {busList.map((bus) => (
    <option key={bus.id} value={bus.id}>
      {bus.busNumber}
    </option>
  ))}
</select>

                      </div>
                     

                    </div>
                    <div className="modal-satus-toggle d-flex align-items-center justify-content-between">
                      <div className="status-title">
                        <h5>Status</h5>
                        <p>Change the Status by toggle </p>
                      </div>
                      <div className="status-toggle modal-status">
                        <input type="checkbox" id="user1" className="check" />
                        <label htmlFor="user1" className="checktoggle">
                          {" "}
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <Link
                    to="#"
                    className="btn btn-light me-2"
                    data-bs-dismiss="modal"
                  >
                    Cancel
                  </Link>
                  <button
                    type="submit"
                  
                    className="btn btn-primary"
                  >
                    Add Route
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
        {/* Add Route*/}
        {/* Edit Route */}
        <div className="modal fade" id="edit_routes">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h4 className="modal-title">Edit Route</h4>
                <button
                  type="button"
                  className="btn-close custom-btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                >
                  <i className="ti ti-x" />
                </button>
              </div>
              <form>
                <div className="modal-body">
                  <div className="row">
                    <div className="col-md-12">
                      <div className="mb-3">
                        <label className="form-label">Route Name</label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Enter Route Name"
                          defaultValue="Seattle"
                        />
                      </div>
                    </div>
                    <div className="modal-satus-toggle d-flex align-items-center justify-content-between">
                      <div className="status-title">
                        <h5>Status</h5>
                        <p>Change the Status by toggle </p>
                      </div>
                      <div className="status-toggle modal-status">
                        <input
                          type="checkbox"
                          id="user2"
                          className="check"
                          defaultChecked
                        />
                        <label htmlFor="user2" className="checktoggle">
                          {" "}
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <Link
                    to="#"
                    className="btn btn-light me-2"
                    data-bs-dismiss="modal"
                  >
                    Cancel
                  </Link>
                  <Link
                    to="#"
                    data-bs-dismiss="modal"
                    className="btn btn-primary"
                  >
                    Save Changes
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </div>
        {/* Edit Route */}
      </>
      <>
        {/* Add Assign New Vehicle */}
        <div className="modal fade" id="add_assign_vehicle">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h4 className="modal-title">Assign New Vehicle</h4>
                <button
                  type="button"
                  className="btn-close custom-btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                >
                  <i className="ti ti-x" />
                </button>
              </div>
              <form onSubmit={handleSubmitAssign}> 
                <div className="modal-body">
                  <div className="row">
                    <div className="col-md-12">
                    <div className="mb-3">
  <label className="form-label">Student Roll No</label>
  <input
    type="text"
    className="form-control"
    value={searchKeyword}
    onChange={handleStudentSearch}
    placeholder="Search Student Roll No"
  />
  {filteredStudents.length > 0 && (
    <ul className="dropdown-menu show position-static border">
      {filteredStudents.map((student) => (
        <li
          key={student.id}
          className="dropdown-item"
          onClick={() => {
            setFormTransport((prev) => ({
              ...prev,
              studentId: student.id,
            }));
            setSearchKeyword(student.rollNo); 
            setFilteredStudents([]); 
          }}
        >
          {student.rollNo} - {student.fatherName} 
        </li>
      ))}
    </ul>
  )}
</div>


<div className="mb-3">
  <label className="form-label">Select Route</label>
  <select
    className="form-control"
    value={formTransport.routeId}
    onChange={(e) => setFormTransport({ ...formTransport, routeId: e.target.value })}
  >
    <option value="">Select Route</option>
    {routelist.map((route) => (
      <option key={route.id} value={route.id}>
        {route.name}
      </option>
    ))}
  </select>
</div>

<div className="mb-3">
  <label className="form-label">Select Bus Stop</label>
  <select
    className="form-control"
    value={formTransport.busStopId}
    onChange={(e) => setFormTransport({ ...formTransport, busStopId: e.target.value })}
  >
    <option value="">Select Bus Stop</option>
    {busStopList.map((BusStop) => (
      <option key={BusStop.id} value={BusStop.id}>
        {BusStop.name}
      </option>
    ))}
  </select>
</div>

<div className="mb-0">
  <label className="form-label">Select Vehicle</label>
  <select
    className="form-control"
    value={formTransport.busId}
    onChange={(e) => setFormTransport({ ...formTransport, busId: e.target.value })}
  >
    <option value="">Select Vehicle</option>
    {busList.map((bus) => (
      <option key={bus.id} value={bus.id}>
        {bus.busNumber}
      </option>
    ))}
  </select>
</div>

                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <Link
                    to="#"
                    className="btn btn-light me-2"
                    data-bs-dismiss="modal"
                  >
                    Cancel
                  </Link>
                  <button
                  type="submit"
                    
                    className="btn btn-primary"
                  >
                    Assign Now
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
        {/* Add Assign New Vehicle */}
        {/* Edit Assign New Vehicle */}
        <div className="modal fade" id="edit_assign_vehicle">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h4 className="modal-title">Edit Assign Vehicle</h4>
                <button
                  type="button"
                  className="btn-close custom-btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                >
                  <i className="ti ti-x" />
                </button>
              </div>
              <form>
                <div className="modal-body">
                  <div className="row">
                    <div className="col-md-12">
                      <div className="mb-3">
                        <label className="form-label">Select Route</label>
                        <CommonSelect
                          className="select"
                          options={routesList}
                          defaultValue={routesList[0]}
                        />
                      </div>
                      <div className="mb-3">
                        <label className="form-label">
                          Select Pickup Point
                        </label>
                        <CommonSelect
                          className="select"
                          options={PickupPoint2}
                          defaultValue={PickupPoint2[0]}
                        />
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Select Vehicle</label>
                        <CommonSelect
                          className="select"
                          options={VehicleNumber}
                          defaultValue={VehicleNumber[0]}
                        />
                      </div>
                      <div className="assigned-driver">
                        <h6>Assigned Driver</h6>
                        <div className="assigned-driver-info">
                          <span className="driver-img">
                            <ImageWithBasePath
                              src="assets/img/parents/parent-01.jpg"
                              alt="Img"
                            />
                          </span>
                          <div>
                            <h5>Thomas</h5>
                            <span>+1 64044 748904</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <Link
                    to="#"
                    className="btn btn-light me-2"
                    data-bs-dismiss="modal"
                  >
                    Cancel
                  </Link>
                  <Link
                    to="#"
                    data-bs-dismiss="modal"
                    className="btn btn-primary"
                  >
                    Assign Now
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </div>
        {/* Edit Assign New Vehicle */}
      </>
      <>
        {/* Add Pickup */}
        <div className="modal fade" id="add_pickup">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h4 className="modal-title">Add Pickup Point</h4>
                <button
                  type="button"
                  className="btn-close custom-btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                >
                  <i className="ti ti-x" />
                </button>
              </div>
              <form onSubmit={handleSubmitpickup}>
                <div className="modal-body">
                  <div className="row">
                    <div className="col-md-12">
                    <div className="mb-3">
  <label className="form-label">Name</label>
  <input
    type="text"
    name="name"
    className="form-control"
    value={pickupForm.name}
    onChange={(e) =>
      setPickupForm({ ...pickupForm, name: e.target.value })
    }
  />
</div>

<div className="mb-3">
  <label className="form-label">Location</label>
  <input
    type="text"
    name="location"
    className="form-control"
    value={pickupForm.location}
    onChange={(e) =>
      setPickupForm({ ...pickupForm, location: e.target.value })
    }
  />
</div>

<div className="mb-3">
  <label className="form-label">Route</label>
  <select
    className="form-control"
    value={pickupForm.routeId}
    onChange={(e) =>
      setPickupForm({ ...pickupForm, routeId: e.target.value })
    }
  >
    <option value="">Select Route</option>
    {routelist.map((route) => (
      <option key={route.id} value={route.id}>
        {route.name}
      </option>
    ))}
  </select>
</div>

                    </div>
                    <div className="modal-satus-toggle d-flex align-items-center justify-content-between">
                      <div className="status-title">
                        <h5>Status</h5>
                        <p>Change the Status by toggle </p>
                      </div>
                      <div className="status-toggle modal-status">
                        <input type="checkbox" id="user1" className="check" />
                        <label htmlFor="user1" className="checktoggle">
                          {" "}
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <Link
                    to="#"
                    className="btn btn-light me-2"
                    data-bs-dismiss="modal"
                  >
                    Cancel
                  </Link>
                  <button
                    type="submit"
                  
                    className="btn btn-primary"
                  >
                    Add Pickup Point
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
        {/* Add Pickup */}
        {/* Edit Pickup */}
        <div className="modal fade" id="edit_pickup">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h4 className="modal-title">Edit Pickup Point</h4>
                <button
                  type="button"
                  className="btn-close custom-btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                >
                  <i className="ti ti-x" />
                </button>
              </div>
              <form>
                <div className="modal-body">
                  <div className="row">
                    <div className="col-md-12">
                      <div className="mb-3">
                        <label className="form-label">Pickup Point</label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Enter Pickup Point"
                          defaultValue="2603 Wood Duck Drive Marquette, MI"
                        />
                      </div>
                    </div>
                    <div className="modal-satus-toggle d-flex align-items-center justify-content-between">
                      <div className="status-title">
                        <h5>Status</h5>
                        <p>Change the Status by toggle </p>
                      </div>
                      <div className="status-toggle modal-status">
                        <input
                          type="checkbox"
                          id="user2"
                          className="check"
                          defaultChecked
                        />
                        <label htmlFor="user2" className="checktoggle">
                          {" "}
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <Link
                    to="#"
                    className="btn btn-light me-2"
                    data-bs-dismiss="modal"
                  >
                    Cancel
                  </Link>
                  <Link
                    to="#"
                    data-bs-dismiss="modal"
                    className="btn btn-primary"
                  >
                    Save Changes
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </div>
        {/* Edit Pickup */}
      </>
      <>
        {/* Add Driver */}
        <div className="modal fade" id="add_driver">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h4 className="modal-title">Add New Driver</h4>
                <button
                  type="button"
                  className="btn-close custom-btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                >
                  <i className="ti ti-x" />
                </button>
              </div>
              <form onSubmit={handleSubmitDriver}>
                <div className="modal-body">
                  <div className="row">
                    <div className="col-md-12">
                      <div className="mb-3">
                        <label className="form-label">Name</label>
                        <input
  type="text"
  className="form-control"
  value={formDriver.name}
  onChange={(e) => setFormDriver({ ...formDriver, name: e.target.value })}
/>

                      </div>
                      {/* <div className="mb-3">
                        <label className="form-label">Phone Number</label>
                        <input type="text" className="form-control" />
                      </div> */}
                      <div className="mb-3">
                        <label className="form-label">
                          Driving License Number
                        </label>
                        <input
  type="text"
  className="form-control"
  placeholder="Enter Driving License Number"
  value={formDriver.license}
  onChange={(e) => setFormDriver({ ...formDriver, license: e.target.value })}
/>

                      </div>
                      <div className="mb-3">
                        <label className="form-label">buses</label>
                        <select
  className="form-control"
  value={formDriver.busId}
  onChange={(e) => setFormDriver({ ...formDriver, busId: e.target.value })}
>
  <option value="">Select a bus</option>
  {busList.map((bus) => (
    <option key={bus.id} value={bus.id}>
      {bus.busNumber}
    </option>
  ))}
</select>

                      </div>
                    </div>
                    <div className="modal-satus-toggle d-flex align-items-center justify-content-between">
                      <div className="status-title">
                        <h5>Status</h5>
                        <p>Change the Status by toggle </p>
                      </div>
                      <div className="status-toggle modal-status">
                        <input type="checkbox" id="user1" className="check" />
                        <label htmlFor="user1" className="checktoggle">
                          {" "}
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <Link
                    to="#"
                    className="btn btn-light me-2"
                    data-bs-dismiss="modal"
                  >
                    Cancel
                  </Link>
                  <button
  type="submit"
  className="btn btn-primary"
  // onClick={handleSubmit}
>
  Add Driver
</button>

                </div>
              </form>
            </div>
          </div>
        </div>
        {/* Add Driver */}
        {/* Edit Driver */}
        <div className="modal fade" id="edit_driver">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h4 className="modal-title">Edit Driver</h4>
                <button
                  type="button"
                  className="btn-close custom-btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                >
                  <i className="ti ti-x" />
                </button>
              </div>
              <form>
                <div className="modal-body">
                  <div className="row">
                    <div className="col-md-12">
                      <div className="mb-3">
                        <label className="form-label">Name</label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Enter Name"
                          defaultValue="Thomas"
                        />
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Phone Number</label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Enter Phone Number"
                          defaultValue="+1 64044 74890"
                        />
                      </div>
                      <div className="mb-3">
                        <label className="form-label">
                          Driving License Number
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Enter Driving License Number"
                          defaultValue="LC7899456689"
                        />
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Address</label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Enter Address"
                          defaultValue="2233 Wood Street, Slidell, LA"
                        />
                      </div>
                    </div>
                    <div className="modal-satus-toggle d-flex align-items-center justify-content-between">
                      <div className="status-title">
                        <h5>Status</h5>
                        <p>Change the Status by toggle </p>
                      </div>
                      <div className="status-toggle modal-status">
                        <input
                          type="checkbox"
                          id="user2"
                          className="check"
                          defaultChecked
                        />
                        <label htmlFor="user2" className="checktoggle">
                          {" "}
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <Link
                    to="#"
                    className="btn btn-light me-2"
                    data-bs-dismiss="modal"
                  >
                    Cancel
                  </Link>
                  <Link
                    to="#"
                    data-bs-dismiss="modal"
                    className="btn btn-primary"
                  >
                    Save Changes
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </div>
        {/* Edit Driver */}
      </>
      <>
        {/* Add New Vehicle   😌*/}
        <div className="modal fade"  id="add_vehicle">

          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h4 className="modal-title">Add New Vehicle</h4>
                <button
                  type="button"
                  className="btn-close custom-btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                >
                  <i className="ti ti-x" />
                </button>
              </div>
              <form  onSubmit={handleSubmit}>
                <div className="modal-body" id='modal-datepicker'>
                  <div className="row">
                    <div className="col-md-12">
                      <div className="row">
                        <div className="col-md-6">
                          <div className="mb-3">
                            <label className="form-label">Vehicle No</label>
                            <input
                    name="busNumber"
                    type="text"
                    className="form-control"
                    value={form.busNumber}
                    onChange={handleChange}
                    required
                  />
                          </div>
                        </div>
                        {/* <div className="col-md-6">
                          <div className="mb-3">
                            <label className="form-label">Vehicle Model</label>
                            <input type="text" className="form-control" />
                          </div>
                        </div> */}
                        {/* <div className="col-md-6">
                          <div className="mb-3">
                            <label className="form-label">Made of Year</label>
                            <div className="date-pic">
                            <DatePicker
                                className="form-control datetimepicker"
                                format={{
                                    format: "DD-MM-YYYY",
                                    type: "mask",
                                }}
                                getPopupContainer={getModalContainer}
                                defaultValue=""
                                placeholder="16 May 2024"
                                />
                              <span className="cal-icon">
                                <i className="ti ti-calendar" />
                              </span>
                            </div>
                          </div>
                        </div> */}
                        {/* <div className="col-md-6">
                          <div className="mb-3">
                            <label className="form-label">
                              Registration No
                            </label>
                            <input type="text" className="form-control" />
                          </div>
                        </div> */}
                        {/* <div className="col-md-6">
                          <div className="mb-3">
                            <label className="form-label">Chassis No</label>
                            <input
                              type="text"
                              className="form-control"
                              placeholder="Enter Chassis No"
                            />
                          </div>
                        </div> */}
                        <div className="col-md-6">
                          <div className="mb-3">
                            <label className="form-label">Seat Capacity</label>
                            <input
                    name="capacity"
                    type="number"
                    className="form-control"
                    value={form.capacity}
                    onChange={handleChange}
                    required
                    min={1}
                  />
                          </div>
                        </div>
                      </div>
                      {/* <div className="mb-3">
                        <label className="form-label">GPS Tracking ID</label>
                        <input type="text" className="form-control" />
                      </div> */}
                      <hr />
                      {/* <div className="mb-3">
                        <h4>Driver details</h4>
                      </div> */}
                      {/* <div className="mb-3">
                        <label className="form-label">Select Driver</label>
                        <CommonSelect
                          className="select"
                          options={driverName}
                          defaultValue={undefined}
                        />
                      </div> */}
                      {/* <div className="row">
                        <div className="col-md-6">
                          <div className="mb-3">
                            <label className="form-label">Driver License</label>
                            <input type="text" className="form-control" />
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="mb-3">
                            <label className="form-label">
                              Driver Contact No
                            </label>
                            <input type="text" className="form-control" />
                          </div>
                        </div>
                      </div> */}
                    </div>
                    {/* <div className="mb-0">
                      <label className="form-label">Driver Address</label>
                      <input type="text" className="form-control" />
                    </div> */}
                  </div>
                </div>
                <div className="modal-footer">
                <Link to="#" className="btn btn-light me-2" data-bs-dismiss="modal">
                Cancel
              </Link>
              <button type="submit" className="btn btn-primary" 
              
                
              //   aria-label="Close"
              // data-bs-dismiss="modal"
              >
                Add New Vehicle
              </button>
                </div>
              </form>
            </div>
          </div>
        </div>
        {/* Add New Vehicle */}
        {/* Edit New Vehicle */}
        <div className="modal fade" id="edit_vehicle">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header align-items-center">
                <div className="d-flex align-items-center">
                  <h4 className="modal-title">Edit Vehicle</h4>
                  <span className="badge badge-soft-primary ms-2">
                    ID : BB0482
                  </span>
                </div>
                <button
                  type="button"
                  className="btn-close custom-btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                >
                  <i className="ti ti-x" />
                </button>
              </div>
              <form>
                <div className="modal-body" id='modal-datepicker2'>
                  <div className="row">
                    <div className="col-md-12">
                      <div className="row">
                        <div className="col-md-6">
                          <div className="mb-3">
                            <label className="form-label">Vehicle No</label>
                            <input
                              type="text"
                              className="form-control"
                              placeholder="Enter Vehicle No"
                              defaultValue={8930}
                            />
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="mb-3">
                            <label className="form-label">Vehicle Model</label>
                            <input
                              type="text"
                              className="form-control"
                              placeholder="Enter Vehicle Model"
                              defaultValue="Scania"
                            />
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="mb-3">
                            <label className="form-label">Made of Year</label>
                            <div className="date-pic">
                            <DatePicker
                      className="form-control datetimepicker"
                      format={{
                        format: "DD-MM-YYYY",
                        type: "mask",
                      }}
                      getPopupContainer={getModalContainer2}
                      defaultValue={defaultValue}
                      placeholder="16 May 2024"
                    />
                              <span className="cal-icon">
                                <i className="ti ti-calendar" />
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="mb-3">
                            <label className="form-label">
                              Registration No
                            </label>
                            <input
                              type="text"
                              className="form-control"
                              placeholder="Enter Registration No"
                              defaultValue="US1A3545"
                            />
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="mb-3">
                            <label className="form-label">Chassis No</label>
                            <input
                              type="text"
                              className="form-control"
                              defaultValue={32546665456}
                            />
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="mb-3">
                            <label className="form-label">Seat Capacity</label>
                            <input
                              type="text"
                              className="form-control"
                              placeholder="Enter Seat Capacity"
                            />
                          </div>
                        </div>
                      </div>
                      <div className="mb-3">
                        <label className="form-label">GPS Tracking ID</label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Enter GPS Tracking ID"
                          defaultValue="GPS7899456689"
                        />
                      </div>
                      <hr />
                      <div className="mb-3">
                        <h4>Driver details</h4>
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Select Driver</label>
                        <CommonSelect
                          className="select"
                          options={driverName}
                          defaultValue={driverName[1]}
                        />
                      </div>
                      <div className="row">
                        <div className="col-md-6">
                          <div className="mb-3">
                            <label className="form-label">Driver License</label>
                            <input
                              type="text"
                              className="form-control"
                              placeholder="Enter Driver License"
                              defaultValue="LC7899456689"
                            />
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="mb-3">
                            <label className="form-label">
                              Driver Contact No
                            </label>
                            <input
                              type="text"
                              className="form-control"
                              placeholder="Enter Driver Contact No"
                              defaultValue="+1 64044 74890"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="mb-0">
                      <label className="form-label">Driver Address</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Enter Driver Address"
                        defaultValue="2233 Wood Street, Slidell, LA"
                      />
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <Link
                    to="#"
                    className="btn btn-light me-2"
                    data-bs-dismiss="modal"
                  >
                    Cancel
                  </Link>
                  <Link
                    to="#"
                    data-bs-dismiss="modal"
                    className="btn btn-primary"
                  >
                    Save Vehicle
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </div>
        {/* Edit New Vehicle */}
        {/* Live Track */}
        <div className="modal fade" id="live_track">
          <div className="modal-dialog modal-dialog-centered  modal-xl">
            <div className="modal-content">
              <div className="modal-header align-items-center">
                <div className="d-flex align-items-center">
                  <h4 className="modal-title">Live Tracking Vehicle</h4>
                  <span className="badge badge-soft-primary ms-2">
                    GPS Tracking ID : GPS7899456689
                  </span>
                </div>
                <button
                  type="button"
                  className="btn-close custom-btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                >
                  <i className="ti ti-x" />
                </button>
              </div>
              <div className="modal-body mb-4">
                <ul className="book-taker-info live-track-info justify-content-between">
                  <li>
                    <span>Vehicle No</span>
                    <h6>8930</h6>
                  </li>
                  <li>
                    <span>Vehicle Model</span>
                    <h6>Scania</h6>
                  </li>
                  <li>
                    <span>Driver</span>
                    <h6>Thomas</h6>
                  </li>
                  <li>
                    <span>Driver Contact No</span>
                    <h6>+1 45644 54784</h6>
                  </li>
                </ul>
                <div className="live-track-map w-100">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3321.6088932774796!2d-117.8132203247921!3d33.64138153931407!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x80dcddf599c1986f%3A0x6826f6868b4f8e35!2sHillcrest%2C%20Irvine%2C%20CA%2092603%2C%20USA!5e0!3m2!1sen!2sin!4v1706772657955!5m2!1sen!2sin"
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>
              </div>
              <div className="modal-footer">
                <Link
                  to="#"
                  className="btn btn-light me-2"
                  data-bs-dismiss="modal"
                >
                  Cancel
                </Link>
                <Link
                  to="#"
                  data-bs-dismiss="modal"
                  className="btn btn-primary"
                >
                  Reset to Live Location
                </Link>
              </div>
            </div>
          </div>
        </div>
        {/* Live Track */}
      </>

      {/* Delete Modal */}
      <div className="modal fade" id="delete-modal">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <form>
              <div className="modal-body text-center">
                <span className="delete-icon">
                  <i className="ti ti-trash-x" />
                </span>
                <h4>Confirm Deletion</h4>
                <p>
                  You want to delete all the marked items, this cant be undone
                  once you delete.
                </p>
                <div className="d-flex justify-content-center">
                  <Link
                    to="#"
                    className="btn btn-light me-3"
                    data-bs-dismiss="modal"
                  >
                    Cancel
                  </Link>
                  <Link
                    to="#"
                    className="btn btn-danger"
                    data-bs-dismiss="modal"
                  >
                    Yes, Delete
                  </Link>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
      {/* /Delete Modal */}
    </>
  );
};

export default TransportModal;
