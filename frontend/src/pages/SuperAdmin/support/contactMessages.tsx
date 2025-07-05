import { Link } from "react-router-dom";
import ImageWithBasePath from "../../../core/common/imageWithBasePath";
import { TableData } from "../../../core/data/interface";
import PredefinedDateRanges from '../../../core/common/datePicker';
import CommonSelect from '../../../core/common/commonSelect';
import { contactMess, contactMessOne } from '../../../core/common/selectoption/selectoption';
import { DatePicker, Table } from 'antd';
import TooltipOption from "../../../core/common/tooltipOption";
import { useEffect, useState } from "react";
import { IContactMessage } from "../../../services/types/common/contactMessage";
import { toast, ToastContainer } from "react-toastify";
import dayjs from "dayjs";
import { getAllmessage, getmessageById, registerMessage } from "../../../services/contactserviceMessgae";
import { useSelector } from "react-redux";

const ContactMessages = () => {
  const [data, setData] = useState<IContactMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<IContactMessage | null>(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [contactMessagesData, setContactMessagesData] = useState<IContactMessage>({
    userId: localStorage.getItem("userId") || "",
    name: "",
    email: "",
    message: "",
    phone: "",
    date: new Date()
  });

  // Get user role from localStorage
  const userRole = useSelector((state: any) => state.auth.userObj);
  // console.log("usetrrole",userRole);
  const isSuperAdmin = userRole.role === "superadmin";

  // Fetch contact messages on component mount (only for superadmin)
  useEffect(() => {
    if (isSuperAdmin) {
      const fetchContactMessages = async () => {
        try {
          setIsLoading(true);
          const response = await getAllmessage();
          setData(response.data);
        } catch (error) {
          toast.error("Failed to load contact messages");
        } finally {
          setIsLoading(false);
        }
      };
      fetchContactMessages();
    }
  }, [isSuperAdmin]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setContactMessagesData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleDateChange = (date: dayjs.Dayjs | null) => {
    if (date) {
      setContactMessagesData(prev => ({
        ...prev,
        date: date.toDate()
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setIsLoading(true);

      // Basic validation
      if (!contactMessagesData.name || !contactMessagesData.email ||
        !contactMessagesData.message || !contactMessagesData.phone) {
        toast.warning("Please fill all required fields");
        return;
      }

      const response = await registerMessage(contactMessagesData);
      toast.success("Message submitted successfully!");

      // If superadmin, refresh the messages list
      if (isSuperAdmin) {
        const messagesResponse = await getAllmessage();
        setData(messagesResponse.data);
      }

      // Reset form
      setContactMessagesData({
        userId: localStorage.getItem("userId") || "",
        name: "",
        email: "",
        message: "",
        phone: "",
        date: new Date()
      });

      // Close modal if superadmin
      if (isSuperAdmin) {
        const closeButton = document.querySelector('[data-bs-dismiss="modal"]') as HTMLElement;
        if (closeButton) {
          closeButton.click();
        }
      }
          } catch (error) {
        toast.error("Failed to submit message");
      } finally {
      setIsLoading(false);
    }
  };

  const columns = [

    {
      title: "Name",
      dataIndex: "name",
      render: (text: string, record: any) => {
        const imageUrl =
          record.user?.profilePic || "assets/img/default-user.png";

        return (
          <div className="d-flex align-items-center">
            <img
              src={imageUrl}
              alt={record.name}
              className="img-fluid rounded-circle"
              style={{ width: 40, height: 40, objectFit: "cover" }}
              onError={(e) => {
                e.currentTarget.src = "assets/img/default-user.png";
              }}
            />
            <div className="ms-2">
              <p className="text-dark mb-0">
                <Link to="#">{record.name}</Link>
              </p>
            </div>
          </div>
        );
      },
      sorter: (a: any, b: any) => a.name.localeCompare(b.name),
    }
    ,


    {
      title: "Phone",
      dataIndex: "phone",
      sorter: (a: TableData, b: TableData) => a.phone.length - b.phone.length,
    },
    {
      title: "Email",
      dataIndex: "email",
      sorter: (a: TableData, b: TableData) => a.email.length - b.email.length,
    },
    {
      title: "Message",
      dataIndex: "message",
      render: (_: any, record: IContactMessage) => {
        const preview = record.message.length > 30 ? `${record.message.slice(0, 30)}...` : record.message;
        return (
          <Link
            to="#"
            onClick={(e) => {
              e.preventDefault();
              setSelectedMessage(record);
              setViewModalOpen(true);
            }}
          >
            {preview}
          </Link>
        );
      },
      sorter: (a: TableData, b: TableData) => a.message.length - b.message.length,
    },
    {
      title: "Date",
      dataIndex: "date",
      render: (date: Date) => dayjs(date).format("DD MMM YYYY"),
      sorter: (a: TableData, b: TableData) =>
        new Date(a.date).getTime() - new Date(b.date).getTime(),
    },
  ];

  if (!isSuperAdmin) {
    // For non-superadmin users, show only the message form
    return (
      <div className="page-wrapper">
          <ToastContainer position="top-center" autoClose={3000} />
        <div className="content">
          <div className="card">
            <div className="card-header">
              <h4 className="mb-3">Contact Us</h4>
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div className="row">
                  <div className="col-md-12">
                    <div className="mb-3">
                      <label className="form-label">Name</label>
                      <input
                        type="text"
                        className="form-control"
                        name="name"
                        value={contactMessagesData.name}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Email</label>
                      <input
                        type="email"
                        className="form-control"
                        name="email"
                        value={contactMessagesData.email}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Phone</label>
                      <input
                        type="tel"
                        className="form-control"
                        name="phone"
                        value={contactMessagesData.phone}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Message</label>
                      <textarea
                        className="form-control"
                        name="message"
                        value={contactMessagesData.message}
                        onChange={handleInputChange}
                        rows={3}
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Date</label>
                      <div className="input-icon position-relative">
                        <span className="input-icon-addon">
                          <i className="ti ti-calendar" />
                        </span>
                        <DatePicker
                          className="form-control datetimepicker w-100"
                          placeholder="Select Date"
                          value={dayjs(contactMessagesData.date)}
                          onChange={handleDateChange}
                        />
                      </div>
                    </div>
                    <div className="mb-3">
                      <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-1" role="status"></span>
                            Submitting...
                          </>
                        ) : (
                          "Submit Message"
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // For superadmin, show the full interface
  return (
    <div>
      <ToastContainer position="top-center" autoClose={3000} />
      <div className="page-wrapper">
        <div className="content">
          {/* Page Header */}
          <div className="d-md-flex d-block align-items-center justify-content-between mb-3">
            <div className="my-auto mb-2">
              <h3 className="page-title mb-1">Contact Messages</h3>
              <nav>
                <ol className="breadcrumb mb-0">
                  <li className="breadcrumb-item">
                    <Link to="index">Dashboard</Link>
                  </li>
                  <li className="breadcrumb-item">
                    <Link to="#">Support</Link>
                  </li>
                  <li className="breadcrumb-item active" aria-current="page">
                    Contact Messages
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
                  data-bs-target="#add_messages"
                >
                  <i className="ti ti-square-rounded-plus me-2" />
                  Add Message
                </Link>
              </div>
            </div>
          </div>

          {/* Filter Section */}
          <div className="card">
            <div className="card-header d-flex align-items-center justify-content-between flex-wrap pb-0">
              <h4 className="mb-3">Contact Messages List</h4>
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
                  <div className="dropdown-menu drop-width">
                    <form>
                      <div className="d-flex align-items-center border-bottom p-3">
                        <h4>Filter</h4>
                      </div>
                      <div className="p-3 pb-0 border-bottom">
                        <div className="row">
                          <div className="col-md-12">
                            <div className="mb-3">
                              <label className="form-label">Questions</label>
                              <CommonSelect
                                className="select"
                                options={contactMess}
                                defaultValue={undefined}
                              />
                            </div>
                          </div>
                          <div className="col-md-12">
                            <div className="mb-3">
                              <label className="form-label">Category</label>
                              <CommonSelect
                                className="select"
                                options={contactMessOne}
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
                        <button type="submit" className="btn btn-primary">
                          Apply
                        </button>
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
              <Table
                columns={columns}
                dataSource={data}
                loading={isLoading}
                rowKey="id"
                pagination={{ pageSize: 10 }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Add Contact Message Modal (only for superadmin) */}
      <div className="modal fade" id="add_messages">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h4 className="modal-title">Add Contact Message</h4>
              <button
                type="button"
                className="btn-close custom-btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              >
                <i className="ti ti-x" />
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="row">
                  <div className="col-md-12">
                    <div className="mb-3">
                      <label className="form-label">Name</label>
                      <input
                        type="text"
                        className="form-control"
                        name="name"
                        value={contactMessagesData.name}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Email</label>
                      <input
                        type="email"
                        className="form-control"
                        name="email"
                        value={contactMessagesData.email}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Phone</label>
                      <input
                        type="tel"
                        className="form-control"
                        name="phone"
                        value={contactMessagesData.phone}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Message</label>
                      <textarea
                        className="form-control"
                        name="message"
                        value={contactMessagesData.message}
                        onChange={handleInputChange}
                        rows={3}
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Date</label>
                      <div className="input-icon position-relative">
                        <span className="input-icon-addon">
                          <i className="ti ti-calendar" />
                        </span>
                        <DatePicker
                          className="form-control datetimepicker w-100"
                          placeholder="Select Date"
                          value={dayjs(contactMessagesData.date)}
                          onChange={handleDateChange}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-light me-2"
                  data-bs-dismiss="modal"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-1" role="status"></span>
                      Submitting...
                    </>
                  ) : (
                    "Submit Message"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      {/* View Message Modal */}
      <div className={`modal fade ${viewModalOpen ? "show d-block" : ""}`} id="view_message" tabIndex={-1} aria-hidden={!viewModalOpen}>
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h4 className="modal-title">Message Details</h4>
              <button type="button" className="btn-close custom-btn-close" onClick={() => setViewModalOpen(false)} aria-label="Close">
                <i className="ti ti-x" />
              </button>
            </div>
            <div className="modal-body">
              {selectedMessage && (
                <div>
                  <p><strong>Name:</strong> {selectedMessage.name}</p>
                  <p><strong>Email:</strong> {selectedMessage.email}</p>
                  <p><strong>Phone:</strong> {selectedMessage.phone}</p>
                  <p><strong>Message:</strong> {selectedMessage.message}</p>
                  <p><strong>Date:</strong> {dayjs(selectedMessage.date).format('DD MMM YYYY')}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactMessages;