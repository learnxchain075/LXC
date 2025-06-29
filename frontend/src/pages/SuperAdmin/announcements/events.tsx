import React, { useEffect, useRef, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { Modal, OverlayTrigger, Tooltip } from "react-bootstrap";
import ImageWithBasePath from "../../../core/common/imageWithBasePath";
import { Link } from "react-router-dom";
import CommonSelect from "../../../core/common/commonSelect";
import { classes, sections } from "../../../core/common/selectoption/selectoption";
import { DatePicker, TimePicker } from "antd";
import { all_routes } from "../../../router/all_routes";
import type { Dayjs } from "dayjs";
import dayjs from "dayjs";
import {
  createEvent,
  getEventsBySchoolId,
  getEventById,
  updateEvent,
  deleteEvent,
} from "../../../services/admin/eventApi";
import { IEventForm, Role, Section, Class } from "../../../services/types/admin/eventService"; 
import { toast, ToastContainer } from "react-toastify"; 
import { colors } from "react-select/dist/declarations/src/theme";
import LoadingSkeleton from "../../../components/LoadingSkeleton";
import { useAppSelector } from '../../../Store/hooks';

type EventFormState = Omit<IEventForm, 'attachment'> & { attachment: File | string | null };

const Events = () => {
  const routes = all_routes;
  const [showAddEventModal, setShowAddEventModal] = useState(false);
  const [showEventDetailsModal, setShowEventDetailsModal] = useState(false);
  const [events, setEvents] = useState<IEventForm[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<IEventForm | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const calendarRef = useRef<FullCalendar | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

 
  const userRole = useAppSelector(state => state.auth.userObj?.role);


  const canAddEvent = userRole === 'admin' || userRole === 'teacher';

  const [formData, setFormData] = useState<EventFormState>({
    id: localStorage.getItem("userId") ?? "",
    title: "",
    description: "",
    start: "",
    end: "",
    category: "",
    attachment: null,
    targetAudience: "ALL",
    schoolId: localStorage.getItem("schoolId") ?? "",
    roles: [],
    sections: [],
    Class: [],
  });


  useEffect(() => {
    fetchEvents();
  }, []);

 
const fetchEvents = async () => {
  setLoading(true);
  setError(null);
  try {
    const schoolId = localStorage.getItem("schoolId") ?? "";
    if (!schoolId) {
      setError("No school ID found in localStorage");
      toast.error("No school ID found. Please log in again.");
      setEvents([]);
      return;
    }
    const response = await getEventsBySchoolId(schoolId);
    // console.log('Fetch Events API response:', response);
    if (Array.isArray(response.data)) {
      const sortedEvents = response.data.sort((a: any, b: any) => dayjs(a.start).diff(dayjs(b.start)));
      setEvents(sortedEvents);
    } else {
      setError("Failed to fetch events");
      toast.error("Failed to fetch events");
      setEvents([]);
    }
  } catch (err: any) {
    setError(err?.message || "Failed to fetch events");
    toast.error((err?.response?.data?.message || err?.message || "Failed to fetch events") + " (see console for details)");
    setEvents([]);
  } finally {
    setLoading(false);
  }
};


const getEventColor = (category: string) => {
  // let hash = 0;
  // for (let i = 0; i < category.length; i++) {
  //   hash = category.charCodeAt(i) + ((hash << 5) - hash);
  // }
  // return `hsl(${hash % 360}, 70%, 70%)`;
  
    switch (category?.toUpperCase()) {
      case "CELEBRATION":
        return "#ffc107"; 
      case "TRAINING":
        return "#28a745"; 
      case "MEETING":
        return "#17a2b8"; 
      case "HOLIDAYS":
        return "#dc3545"; 
      case "CAMP":
        return "#fd7e14"; 
      default:
        return "#6c757d"; 
    }
  
  
};


const calendarEvents = events.map((event) => ({
  id: event.id,
  title: event.title,
  start: event.start,
  end: event.end,
  allDay: true,
  backgroundColor: getEventColor(event.category),
  textColor: "#fff",
  extendedProps: {
    description: event.description,
    category: event.category,
    targetAudience: event.targetAudience,
    roles: (event.roles || []).map((r) => r.name).join(", "),
    classes: (event.Class || []).map((c) => c.name).join(", "),
    sections: (event.sections || []).map((s) => s.name).join(", ")
  }
}));

  const handleDateClick = () => {
    if (!canAddEvent) return;
    setIsEditMode(false);
    setFormData({
      id: localStorage.getItem("userId") ?? "",
      title: "",
      description: "",
      start: "",
      end: "",
      category: "",
      attachment: null,
      targetAudience: "ALL",
      schoolId: localStorage.getItem("schoolId") ?? "",
      roles: [],
      sections: [],
      Class: [],
    });
    setShowAddEventModal(true);
  };

  const handleEventClick = async (info: any) => {
    try {
      const eventId = info.event.id;
      const response = await getEventById(eventId);
      if (response.data.success) {
        const eventData = { ...response.data.data, attachment: response.data.data.attachment ?? null };
        setSelectedEvent(eventData as IEventForm);
        setShowEventDetailsModal(true);
      } else {
        toast.error(response.data.message || "Failed to fetch event details");
      }
    } catch (error) {
      toast.error("Failed to fetch event details");
    }
  };

  const handleAddEventClose = () => {
    setShowAddEventModal(false);
    setFormData({
      id: localStorage.getItem("userId") ?? "",
      title: "",
      description: "",
      start: "",
      end: "",
      category: "",
      attachment: null,
      targetAudience: "ALL",
      schoolId: localStorage.getItem("schoolId") ?? "",
      roles: [],
      sections: [],
      Class: [],
    });
  };

  const handleEventDetailsClose = () => {
    setShowEventDetailsModal(false);
    setSelectedEvent(null);
  };

  const handleFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    if (name ==="category"){
      setFormData((prev) => ({ ...prev, [name]: value.toUpperCase() }));
    }
    else{
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
   
  };

  const handleTargetAudienceChange = (value: string) => {
    setFormData((prev) => ({ ...prev, targetAudience: value.toUpperCase() }));
  };

  const handleDateChange = (date: Dayjs | null, name: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: date ? date.toISOString() : "",
    }));
  };

  const handleTimeChange = (time: Dayjs | null, name: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: time ? time.toISOString() : "",
    }));
  };

  const handleRoleChange = (role: string, checked: boolean) => {
    setFormData((prev) => {
      const roles = checked
        ? [...prev.roles, { id: role, name: role }]
        : prev.roles.filter((r) => r.id !== role);
      return { ...prev, roles };
    });
  };

  const handleClassChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      Class: [{ id: value, name: value }],
    }));
  };

  const handleSectionChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      sections: [{ id: value, name: value }],
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setFormData((prev) => ({ ...prev, attachment: file || null }));
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.start || !formData.end || !formData.category || !(formData.attachment && formData.attachment instanceof File)) {
      toast.error("All fields and attachment are required");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const response = await createEvent({
        ...formData,
        attachment: formData.attachment,
      } as IEventForm & { attachment: File });
      // console.log('Create Event API response:', response);
      // Check for success based on actual API response
      const eventData = response.data;
      if (
        (eventData && eventData.success) ||
        (eventData && eventData.id) ||
        (Array.isArray(eventData) && eventData[0]?.id) ||
        (response.status >= 200 && response.status < 300)
      ) {
        toast.success("Event created successfully");
        fetchEvents();
        setShowAddEventModal(false);
        setFormData({
          id: localStorage.getItem("userId") ?? "",
          title: "",
          description: "",
          start: "",
          end: "",
          category: "",
          attachment: null,
          targetAudience: "ALL",
          schoolId: localStorage.getItem("schoolId") ?? "",
          roles: [],
          sections: [],
          Class: [],
        });
      } else {
        toast.error("Failed to create event");
      }
    } catch (err: any) {
      toast.error(err?.message || "Failed to create event");
    } finally {
      setLoading(false);
    }
  };

  const handleEditEvent = () => {
    if (selectedEvent) {
      setFormData({
        ...selectedEvent,
        start: dayjs(selectedEvent.start).format(),
        end: dayjs(selectedEvent.end).format(),
        attachment: selectedEvent.attachment ?? null
      });
      setIsEditMode(true);
      setShowEventDetailsModal(false);
      setShowAddEventModal(true);
    }
  };
  const handleDeleteEvent = async () => {
    if (selectedEvent) {
      try {
        const response = await deleteEvent(selectedEvent.id);
        if ((response.data as any).success) {
          toast.success("Event deleted successfully");
          fetchEvents();
          handleEventDetailsClose();
        } else {
          toast.error((response.data as any).message || "Failed to delete event");
        }
      } catch (error: any) {
        toast.error(error?.message || "Failed to delete event");
      }
    }
  };

  return (
    <div>
      {/* Page Wrapper */}
      <div className="page-wrapper">
      <ToastContainer position="top-center" autoClose={3000} />
        <div className="content">
          {/* Page Header */}
          <div className="d-md-flex d-block align-items-center justify-content-between mb-3">
            <div className="my-auto mb-2">
              <h3 className="mb-1">Events</h3>
              <nav>
                <ol className="breadcrumb mb-0">
                  <li className="breadcrumb-item">
                    <Link to={routes.adminDashboard}>Dashboard</Link>
                  </li>
                  <li className="breadcrumb-item">Announcement</li>
                  <li className="breadcrumb-item active" aria-current="page">
                    Events
                  </li>
                </ol>
              </nav>
            </div>
            <div className="d-flex my-xl-auto right-content align-items-center flex-wrap">
              <div className="pe-1 mb-2">
                <OverlayTrigger
                  placement="top"
                  overlay={<Tooltip id="tooltip-top">Refresh</Tooltip>}
                >
                  <Link
                    to="#"
                    className="btn btn-outline-light bg-white btn-icon me-1"
                    onClick={fetchEvents}
                  >
                    <i className="ti ti-refresh" />
                  </Link>
                </OverlayTrigger>
              </div>
              <div className="pe-1 mb-2">
                <OverlayTrigger
                  placement="top"
                  overlay={<Tooltip id="tooltip-top">Print</Tooltip>}
                >
                  <button
                    type="button"
                    className="btn btn-outline-light bg-white btn-icon me-1"
                  >
                    <i className="ti ti-printer" />
                  </button>
                </OverlayTrigger>
              </div>
              <div className="mb-2">
                <Link
                  to="#"
                  className="btn btn-light d-flex align-items-center"
                >
                  <i className="ti ti-calendar-up me-2" />
                  Sync with Google Calendar
                </Link>
              </div>
              {canAddEvent && (
                <div className="mb-2 ms-2">
                  <button
                    type="button"
                    className="btn btn-primary d-flex align-items-center"
                    onClick={handleDateClick}
                  >
                    <i className="ti ti-plus me-2" />
                    Add Event
                  </button>
                </div>
              )}
            </div>
          </div>
          {/* /Page Header */}
          <div className="row">
            {/* Event Calendar */}
            <div className="col-xl-8 col-xxl-9 theiaStickySidebar">
              <div className="stickybar">
                <div className="card">
                  <div className="card-body">
                    {loading ? (
                      <LoadingSkeleton />
                    ) : error ? (
                      <div className="text-danger text-center">{error}</div>
                    ) : events.length === 0 ? (
                      <div className="text-center">No events found.</div>
                    ) : (
                      <FullCalendar
                        ref={calendarRef}
                        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                        initialView="dayGridMonth"
                        events={calendarEvents}
                        eventClick={handleEventClick}
                        dateClick={handleDateClick}
                        height={650}
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>
            {/* /Event Calendar */}
            {/* Event List */}
            <div className="col-xl-4 col-xxl-3 theiaStickySidebar">
              <div className="stickybar">
                <div className="d-flex align-items-center justify-content-between">
                  <h5 className="mb-3">Events</h5>
                  <div className="dropdown mb-3">
                    <Link
                      to="#"
                      className="btn btn-outline-light dropdown-toggle"
                      data-bs-toggle="dropdown"
                    >
                      All Category
                    </Link>
                    <ul className="dropdown-menu p-3">
                      {events.map((event) => (
                        <li key={event.id}>
                          <Link
                            to="#"
                            className="dropdown-item rounded-1 d-flex align-items-center"
                          >
                            <i
                              className="ti ti-circle-filled fs-8 me-2"
                             // style={{ color: getEventColor(event.category) }}
                            />
                            {event.category}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                {events.map((event) => (
                  <div
                    key={event.id}
                    className="border-start border-info border-3 shadow-sm p-3 mb-3 bg-white"
                  >
                    <div className="d-flex align-items-center mb-3 pb-3 border-bottom">
                      <span className="avatar p-1 me-3 bg-primary-transparent flex-shrink-0">
                        <i className="ti ti-users-group text-info fs-20" />
                      </span>
                      <div className="flex-fill">
                        <h6 className="mb-1">{event.title}</h6>
                        <p className="fs-12">
                          <i className="ti ti-calendar me-1" />
                          {dayjs(event.start).format("DD MMMM YYYY")}
                        </p>
                      </div>
                    </div>
                    <div className="d-flex align-items-center justify-content-between">
                      <p className="mb-0 fs-12">
                        <i className="ti ti-clock me-1" />
                        {dayjs(event.start).format("hh:mm A")} -{" "}
                        {dayjs(event.end).format("hh:mm A")}
                      </p>
                      <div className="avatar-list-stacked avatar-group-sm">
                        <span className="avatar border-0">
                          <ImageWithBasePath
                            src="assets/img/parents/parent-01.jpg"
                            className="rounded"
                            alt="img"
                          />
                        </span>
                        <span className="avatar border-0">
                          <ImageWithBasePath
                            src="assets/img/parents/parent-07.jpg"
                            className="rounded"
                            alt="img"
                          />
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* /Page Wrapper */}
      {/* Add/Edit Event Modal */}
      <Modal show={showAddEventModal} onHide={handleAddEventClose}>
        <div className="modal-header">
          <h4 className="modal-title">{isEditMode ? "Edit Event" : "New Event"}</h4>
          <button
            type="button"
            className="btn-close custom-btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
            onClick={handleAddEventClose}
          >
            <i className="ti ti-x" />
          </button>
        </div>
        <form onSubmit={handleFormSubmit}>
          <div className="modal-body">
            <div className="row">
              <div className="col-md-12">
                <div>
                  <label className="form-label">Event For</label>
                  <div className="d-flex align-items-center flex-wrap">
                    {['ALL', 'STUDENTS', 'STAFFS'].map((audience) => (
                      <div className="form-check me-3 mb-3" key={audience}>
                        <input
                          className="form-check-input"
                          type="radio"
                          name="targetAudience"
                          id={audience.toLowerCase()}
                          checked={formData.targetAudience === audience}
                          onChange={() => handleTargetAudienceChange(audience)}
                        />
                        <label
                          className="form-check-label"
                          htmlFor={audience.toLowerCase()}
                        >
                          {audience}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
                {formData.targetAudience === "STUDENTS" && (
                  <div className="all-content" id="all-student">
                    <div className="mb-3">
                      <label className="form-label">Classes</label>
                      <CommonSelect
                        className="select"
                        options={classes}
                        defaultValue={classes.find(option => option.value === formData.Class[0]?.name) || classes[0]}
                        onChange={(value: any) => handleClassChange(value.value)}
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Sections</label>
                      <CommonSelect
                        className="select"
                        options={sections}
                        defaultValue={formData.sections[0]?.name || sections[0]}
                        onChange={(value: any) => handleSectionChange(value.value)}
                      />
                    </div>
                  </div>
                )}
                {formData.targetAudience === "STAFFS" && (
                  <div className="all-content" id="all-staffs">
                    <div className="mb-3">
                      <div className="bg-light-500 p-3 pb-2 rounded">
                        <label className="form-label">Role</label>
                        <div className="row">
                          {[
                            "Admin",
                            "Teacher",
                            "Driver",
                            "Accountant",
                            "Librarian",
                            "Receptionist",
                          ].map((role) => (
                            <div className="col-md-6" key={role}>
                              <div className="form-check form-check-sm mb-2">
                                <input
                                  className="form-check-input"
                                  type="checkbox"
                                  checked={formData.roles.some((r) => r.id === role)}
                                  onChange={(e) =>
                                    handleRoleChange(role, e.target.checked)
                                  }
                                />
                                {role}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <div className="mb-3">
                <label className="form-label">Event Title</label>
                <input
                  type="text"
                  className="form-control"
                  name="title"
                  value={formData.title}
                  onChange={handleFormChange}
                  placeholder="Enter Title"
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Event Category</label>
                <select
                  className="form-control"
                  name="category"
                  value={formData.category}
                  onChange={e => setFormData(prev => ({ ...prev, category: e.target.value }))}
                  required
                >
                  <option value="">Select Category</option>
                  <option value="CELEBRATION">Celebration</option>
                  <option value="TRAINING">Training</option>
                  <option value="MEETING">Meeting</option>
                  <option value="HOLIDAYS">Holidays</option>
                  <option value="CAMP">Camp</option>
                </select>
              </div>
              <div className="col-md-6">
                <div className="mb-3">
                  <label className="form-label">Start Date</label>
                  <div className="date-pic">
                    <DatePicker
                      className="form-control datetimepicker"
                      placeholder="Select Date"
                      value={formData.start ? dayjs(formData.start) : null}
                      onChange={(date) => handleDateChange(date, "start")}
                    />
                    <span className="cal-icon">
                      <i className="ti ti-calendar" />
                    </span>
                  </div>
                </div>
              </div>
              <div className="col-md-6">
                <div className="mb-3">
                  <label className="form-label">End Date</label>
                  <div className="date-pic">
                    <DatePicker
                      className="form-control datetimepicker"
                      placeholder="Select Date"
                      value={formData.end ? dayjs(formData.end) : null}
                      onChange={(date) => handleDateChange(date, "end")}
                    />
                    <span className="cal-icon">
                      <i className="ti ti-calendar" />
                    </span>
                  </div>
                </div>
              </div>
              <div className="col-md-6">
                <div className="mb-3">
                  <label className="form-label">Start Time</label>
                  <div className="date-pic">
                    <TimePicker
                      placeholder="Select Time"
                      className="form-control timepicker"
                      value={formData.start ? dayjs(formData.start) : null}
                      onChange={(time) => handleTimeChange(time, "start")}
                      format="hh:mm A"
                    />
                    <span className="cal-icon">
                      <i className="ti ti-clock" />
                    </span>
                  </div>
                </div>
              </div>
              <div className="col-md-6">
                <div className="mb-3">
                  <label className="form-label">End Time</label>
                  <div className="date-pic">
                    <TimePicker
                      placeholder="Select Time"
                      className="form-control timepicker"
                      value={formData.end ? dayjs(formData.end) : null}
                      onChange={(time) => handleTimeChange(time, "end")}
                      format="hh:mm A"
                    />
                    <span className="cal-icon">
                      <i className="ti ti-clock" />
                    </span>
                  </div>
                </div>
              </div>
              <div className="col-md-12">
                <div className="mb-3">
                  <div className="bg-light p-3 pb-2 rounded">
                    <div className="mb-3">
                      <label className="form-label">Attachment</label>
                      <p>Upload size of 4MB, Accepted Format PDF</p>
                    </div>
                    <div className="d-flex align-items-center flex-wrap">
                      <div className="btn btn-primary drag-upload-btn mb-2 me-2">
                        <i className="ti ti-file-upload me-1" />
                        Upload
                        <input
                          type="file"
                          className="form-control image_sign"
                          accept=".pdf"
                          onChange={handleFileChange}
                        />
                      </div>
                      {formData.attachment && (
                        <p className="mb-2">{formData.attachment instanceof File ? formData.attachment.name : ""}</p>
                      )}
                    </div>
                  </div>
                </div>
                <div className="mb-0">
                  <label className="form-label">Description</label>
                  <textarea
                    className="form-control"
                    rows={4}
                    name="description"
                    value={formData.description}
                    onChange={handleFormChange}
                    placeholder="Enter Description"
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="modal-footer">
            <Link
              to="#"
              className="btn btn-light me-2"
              onClick={handleAddEventClose}
            >
              Cancel
            </Link>
            <button type="submit" className="btn btn-primary">
              {isEditMode ? "Update Event" : "Save Event"}
            </button>
          </div>
        </form>
      </Modal>
      {/* Event Details Modal */}
      <Modal show={showEventDetailsModal} onHide={handleEventDetailsClose}>
        <div className="modal-header justify-content-between">
          <span className="d-inline-flex align-items-center">
            <i
              className="ti ti-circle-filled fs-8 me-1"
              style={{ color: getEventColor(selectedEvent?.category || "") }}
            />
            {selectedEvent?.category}
          </span>
          <div className="d-flex align-items-center">
            <Link to="#" className="me-1 fs-18" onClick={handleEditEvent}>
              <i className="ti ti-edit-circle" />
            </Link>
            <Link to="#" className="me-1 fs-18" onClick={handleDeleteEvent}>
              <i className="ti ti-trash-x" />
            </Link>
            <Link
              to="#"
              className="fs-18"
              onClick={handleEventDetailsClose}
            >
              <i className="ti ti-x" />
            </Link>
          </div>
        </div>
        <div className="modal-body pb-0">
          <div className="d-flex align-items-center mb-3">
            <span className="avatar avatar-xl bg-primary-transparent me-3 flex-shrink-0">
              <i className="ti ti-users-group fs-30" />
            </span>
            <div>
              <h3 className="mb-1">{selectedEvent?.title}</h3>
              <div className="d-flex align-items-center flex-wrap">
                <p className="me-3 mb-0">
                  <i className="ti ti-calendar me-1" />
                  {selectedEvent &&
                    dayjs(selectedEvent.start).format("DD MMMM YYYY")}
                </p>
                <p>
                  <i className="ti ti-clock me-1" />
                  {selectedEvent &&
                    `${dayjs(selectedEvent.start).format("hh:mm A")} - ${dayjs(
                      selectedEvent.end
                    ).format("hh:mm A")}`}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-light-400 p-3 rounded mb-3">
            <p>{selectedEvent?.description}</p>
          </div>
          <div className="d-flex align-items-center justify-content-between flex-wrap">
            <div className="avatar-list-stacked avatar-group-sm d-flex mb-3">
              <span className="avatar">
                <ImageWithBasePath
                  src="assets/img/teachers/teacher-01.jpg"
                  alt="img"
                />
              </span>
              <span className="avatar">
                <ImageWithBasePath
                  src="assets/img/teachers/teacher-02.jpg"
                  alt="img"
                />
              </span>
              <span className="avatar">
                <ImageWithBasePath
                  src="assets/img/teachers/teacher-03.jpg"
                  alt="img"
                />
              </span>
              <Link className="avatar bg-white text-default" to="#">
                +67
              </Link>
            </div>
            <div className="mb-3">
              <p className="mb-1">Event For</p>
              <h6>
                {selectedEvent?.targetAudience === "ALL"
                  ? "All Classes, All Sections"
                  : selectedEvent?.targetAudience === "STUDENTS"
                  ? `${selectedEvent.Class[0]?.name || "N/A"}, ${
                      selectedEvent.sections[0]?.name || "N/A"
                    }`
                  : selectedEvent?.roles.map((r) => r.name).join(", ") || "N/A"}
              </h6>
            </div>
          </div>
          {selectedEvent && (
            <div>
              <h5>{selectedEvent.title}</h5>
              <p><b>Description:</b> {selectedEvent.description}</p>
              <p><b>Category:</b> {selectedEvent.category}</p>
              <p><b>Start:</b> {selectedEvent.start ? dayjs(selectedEvent.start).format('DD MMM YYYY') : '-'}</p>
              <p><b>End:</b> {selectedEvent.end ? dayjs(selectedEvent.end).format('DD MMM YYYY') : '-'}</p>
              <p><b>Target Audience:</b> {selectedEvent.targetAudience}</p>
              <p><b>Roles:</b> {(selectedEvent.roles || []).map(r => r.name).join(', ')}</p>
              <p><b>Classes:</b> {(selectedEvent.Class || []).map(c => c.name).join(', ')}</p>
              <p><b>Sections:</b> {(selectedEvent.sections || []).map(s => s.name).join(', ')}</p>
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default Events;