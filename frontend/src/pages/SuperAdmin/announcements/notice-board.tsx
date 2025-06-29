import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { DatePicker } from "antd";
import moment from "moment";
import { all_routes } from "../../../router/all_routes";
import TooltipOption from "../../../core/common/tooltipOption";
import { Notice } from "../../../services/types/admin/noticeService";
import {
  createNotice,
  getAllNotices,
  updateNoticeById,
  deleteNotice,
  deleteMultipleNotices,
} from "../../../services/admin/noticeApi";
import { ToastContainer, toast, ToastPosition } from "react-toastify";

import 'react-toastify/dist/ReactToastify.css';

const NoticeBoard = () => {
  const routes = all_routes;
  const schoolId = localStorage.getItem("schoolId") ?? "";
  const createdById = localStorage.getItem("userId") ?? "";

  const [editNoticeId, setEditNoticeId] = useState<string | null>(null);
  const [viewNoticeId, setViewNoticeId] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [notices, setNotices] = useState<Notice[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [selectAll, setSelectAll] = useState(false);
  const [addForm, setAddForm] = useState<{
    title: string;
    noticeDate: string;
    publishDate: string;
    attachment: File | string | null;
    message: string;
    recipients: string[];
  }>({
    title: "",
    noticeDate: "",
    publishDate: "",
    attachment: null,
    message: "",
    recipients: [],
  });
  const [editForm, setEditForm] = useState<{
    id: string;
    title: string;
    noticeDate: string;
    publishDate: string;
    attachment: File | string | null;
    message: string;
    recipients: string[];
  }>({
    id: "",
    title: "",
    noticeDate: "",
    publishDate: "",
    attachment: null,
    message: "",
    recipients: [],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    const fetchNotices = async () => {
      const response = await getAllNotices(schoolId);
      if (response.success) {
        setNotices(response.data);
        setHasMore(response.data.length > 0);
      } else {
        setError(response.message || "Failed to fetch notices");
        toast.error(response.message || "Failed to fetch notices");
      }
      setLoading(false);
    };
    fetchNotices();
  }, [schoolId]);

  useEffect(() => {
    if (selectAll) {
      setSelectedIds(notices.map((n) => n.id));
    } else {
      setSelectedIds([]);
    }
  }, [selectAll, notices]);

  useEffect(() => {
    const allSelected = notices.length > 0 && selectedIds.length === notices.length;
    setSelectAll(allSelected);
  }, [selectedIds, notices]);

  useEffect(() => {
    if (editNoticeId) {
      const notice = notices.find((n) => n.id === editNoticeId);
      if (notice) {
        setEditForm({
          id: notice.id,
          title: notice.title,
          noticeDate: notice.noticeDate,
          publishDate: notice.publishDate,
          attachment: notice.attachment,
          message: notice.message,
          recipients: notice.recipients.map((r) => r.userType),
        });
      }
    }
  }, [editNoticeId, notices]);

  const handleAddAttachmentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setAddForm((prev) => ({ ...prev, attachment: file || null }));
  };

  const handleEditAttachmentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setEditForm((prev) => ({ ...prev, attachment: file || null }));
  };

  // Helper to close the add notice modal
  const closeAddModal = () => {
    setAddForm({ title: "", noticeDate: "", publishDate: "", attachment: null, message: "", recipients: [] });
    const modal = document.getElementById('add_message');
    if (modal) {
      (window as any).bootstrap?.Modal.getOrCreateInstance(modal)?.hide();
    }
  };

  // Helper to close the edit notice modal
  const closeEditModal = () => {
    setEditNoticeId(null);
    const modal = document.getElementById('edit_message');
    if (modal) {
      (window as any).bootstrap?.Modal.getOrCreateInstance(modal)?.hide();
    }
  };

  // Helper to close the view notice modal
  const closeViewModal = () => {
    setViewNoticeId(null);
    const modal = document.getElementById('view_details');
    if (modal) {
      (window as any).bootstrap?.Modal.getOrCreateInstance(modal)?.hide();
    }
  };

  // Helper to close the delete modal
  const closeDeleteModal = () => {
    setSelectedIds([]);
    setSelectAll(false);
    const modal = document.getElementById('delete-modal');
    if (modal) {
      (window as any).bootstrap?.Modal.getOrCreateInstance(modal)?.hide();
    }
  };

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!addForm.title || !addForm.message || !addForm.noticeDate || !addForm.publishDate || !addForm.recipients.length || !(addForm.attachment instanceof File)) {
      toast.error("All fields and attachment are required");
      return;
    }
    setLoading(true);
    setError(null);
    const noticeData = {
      title: addForm.title,
      message: addForm.message,
      noticeDate: addForm.noticeDate,
      publishDate: addForm.publishDate,
      attachment: addForm.attachment,
      recipients: addForm.recipients.map((r) => r.toUpperCase()),
      createdById,
      schoolId,
    };
    try {
      const response = await createNotice(noticeData);
      if (response.success) {
        setNotices([...notices, response.data]);
        toast.success("Successfully notice added");
        closeAddModal();
      } else {
        toast.error(response.message || "Failed to add notice");
      }
    } catch (err: any) {
      toast.error(err?.message || "Failed to add notice");
    } finally {
      setLoading(false);
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editForm.title || !editForm.message || !editForm.noticeDate || !editForm.publishDate || !editForm.recipients.length) {
      toast.error("All fields are required");
      return;
    }
    setLoading(true);
    setError(null);
    const noticeData: any = {
      title: editForm.title,
      message: editForm.message,
      noticeDate: editForm.noticeDate,
      publishDate: editForm.publishDate,
      recipients: editForm.recipients.map((r) => r.toUpperCase()),
    };
    if (editForm.attachment instanceof File) {
      noticeData.attachment = editForm.attachment;
    }
    try {
      const response = await updateNoticeById(editForm.id, noticeData);
      if (response.success) {
        setNotices(notices.map((n) => (n.id === editForm.id ? response.data : n)));
        toast.success("Notice updated successfully");
        closeEditModal();
      } else {
        toast.error(response.message || "Failed to update notice");
      }
    } catch (err: any) {
      toast.error(err?.message || "Failed to update notice");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setLoading(true);
    setError(null);
    try {
      if (selectedIds.length > 1) {
        const response = await deleteMultipleNotices(selectedIds);
        if (response.success) {
          setNotices(notices.filter((n) => !selectedIds.includes(n.id)));
          toast.success("Notices deleted successfully");
          closeDeleteModal();
        } else {
          toast.error(response.message || "Failed to delete notices");
        }
      } else if (selectedIds.length === 1) {
        const response = await deleteNotice(selectedIds[0]);
        if (response.success) {
          setNotices(notices.filter((n) => n.id !== selectedIds[0]));
          toast.success("Notice deleted successfully");
          closeDeleteModal();
        } else {
          toast.error(response.message || "Failed to delete notice");
        }
      }
    } catch (err: any) {
      toast.error(err?.message || "Failed to delete");
    } finally {
      setLoading(false);
    }
  };

  const viewNotice = notices.find((n) => n.id === viewNoticeId);

  // Helper to get attachment display name
  const getAttachmentDisplay = (attachment: File | string | null) => {
    if (!attachment) return '-';
    if (typeof attachment === 'string') return attachment;
    if ((attachment as unknown) instanceof File) return (attachment as File).name;
    return '-';
  };

  return (
    <>
      <div className="page-wrapper">
      <ToastContainer position={"top-center" as ToastPosition} autoClose={3000} />
        <div className="content content-two">
          <div className="d-md-flex d-block align-items-center justify-content-between mb-3">
            <div className="my-auto mb-2">
              <h3 className="page-title mb-1">Notice Board</h3>
              <nav>
                <ol className="breadcrumb mb-0">
                  <li className="breadcrumb-item">
                    <Link to={routes.adminDashboard}>Dashboard</Link>
                  </li>
                  <li className="breadcrumb-item">Announcement</li>
                  <li className="breadcrumb-item active" aria-current="page">
                    Notice Board
                  </li>
                </ol>
              </nav>
            </div>
            <div className="d-flex my-xl-auto right-content align-items-center flex-wrap">
              <TooltipOption />
              <div className="mb-2">
                <Link
                  to="#"
                  data-bs-toggle="modal"
                  data-bs-target="#add_message"
                  className="btn btn-primary d-flex align-items-center"
                >
                  <i className="ti ti-square-rounded-plus me-2" />
                  Add Notice
                </Link>
              </div>
            </div>
          </div>

          <div className="d-flex align-items-center justify-content-end flex-wrap mb-2">
            <div className="form-check me-2 mb-3">
              <input
                className="form-check-input"
                type="checkbox"
                checked={selectAll}
                onChange={(e) => setSelectAll(e.target.checked)}
              />
            </div>
            <button
  className="btn btn-danger"
  onClick={handleDelete}
  disabled={selectedIds.length === 0} 
>
  Delete Selected
</button>
          </div>

          {loading ? (
            <div className="text-center">
              <i className="ti ti-loader-3 me-2" />
              Loading...
            </div>
          ) : error ? (
            <div className="text-center text-danger">
              {error}
            </div>
          ) : notices.length === 0 ? (
            <div className="text-center">
              <p>No Data</p>
            </div>
          ) : (
            <>
              <table className="table table-bordered">
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Message</th>
                    <th>Notice Date</th>
                    <th>Publish Date</th>
                    <th>Recipients</th>
                    <th>Creator</th>
                    <th>Attachment</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
              {notices.map((notice) => (
                    <tr key={notice.id}>
                      <td>{notice.title}</td>
                      <td>{notice.message}</td>
                      <td>{notice.noticeDate ? moment(notice.noticeDate).format('DD MMM YYYY') : '-'}</td>
                      <td>{notice.publishDate ? moment(notice.publishDate).format('DD MMM YYYY') : '-'}</td>
                      <td>{notice.recipients.map((r) => r.userType).join(', ')}</td>
                      <td>{notice.creator?.name || '-'}</td>
                      <td>{notice.attachment ? <a href={notice.attachment} target="_blank" rel="noopener noreferrer">View</a> : '-'}</td>
                      <td>
                        <button className="btn btn-sm btn-info me-1" data-bs-toggle="modal" data-bs-target="#view_details" onClick={() => setViewNoticeId(notice.id)}>View</button>
                        <button className="btn btn-sm btn-warning me-1" data-bs-toggle="modal" data-bs-target="#edit_message" onClick={() => setEditNoticeId(notice.id)}>Edit</button>
                        <button className="btn btn-sm btn-danger" data-bs-toggle="modal" data-bs-target="#delete-modal" onClick={() => setSelectedIds([notice.id])}>Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {hasMore && (
                <div className="text-center">
                  <Link to="#" className="btn btn-primary">
                    <i className="ti ti-loader-3 me-2" />
                    Load More
                  </Link>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Add Message Modal */}
      <div className="modal fade" id="add_message">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h4 className="modal-title">New Notice</h4>
              <button
                type="button"
                className="btn-close custom-btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              >
                <i className="ti ti-x" />
              </button>
            </div>
            <div>
              <div className="modal-body">
                <div className="row">
                  <div className="col-md-12">
                    <div className="mb-3">
                      <label className="form-label">Title</label>
                      <input
                        type="text"
                        className="form-control"
                        value={addForm.title}
                        onChange={(e) => setAddForm({ ...addForm, title: e.target.value })}
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Notice Date</label>
                      <div className="date-pic">
                        <DatePicker
                          className="form-control datetimepicker"
                          placeholder="Select Date"
                          value={addForm.noticeDate ? moment(addForm.noticeDate) : null}
                          onChange={(date) =>
                            setAddForm({
                              ...addForm,
                              noticeDate: date ? date.format("YYYY-MM-DD") : "",
                            })
                          }
                        />
                        <span className="cal-icon">
                          <i className="ti ti-calendar" />
                        </span>
                      </div>
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Publish On</label>
                      <div className="date-pic">
                        <DatePicker
                          className="form-control datetimepicker"
                          placeholder="Select Date"
                          value={addForm.publishDate ? moment(addForm.publishDate) : null}
                          onChange={(date) =>
                            setAddForm({
                              ...addForm,
                              publishDate: date ? date.format("YYYY-MM-DD") : "",
                            })
                          }
                        />
                        <span className="cal-icon">
                          <i className="ti ti-calendar" />
                        </span>
                      </div>
                    </div>
                    <div className="mb-3">
                      <div className="bg-light p-3 pb-2 rounded">
                        <div className="mb-3">
                          <label className="form-label">Attachment</label>
                          <p>Upload size of 4MB, Accepted Format PDF</p>
                        </div>

                        <div className="d-flex align-items-center flex-wrap">
                          <div className="btn btn-primary drag-upload-btn mb-2 me-2 position-relative overflow-hidden">
                            <i className="ti ti-file-upload me-1" />
                            Upload
                            <input
                              type="file"
                              className="form-control image_sign position-absolute top-0 start-0 w-100 h-100 opacity-0"
                              onChange={handleAddAttachmentChange}
      />
    </div>

    {addForm.attachment && (
      <span className="ms-2 text-muted">
        {typeof addForm.attachment === 'string'
          ? addForm.attachment
          : addForm.attachment.name}
      </span>
    )}
  </div>
</div>
                    </div>

                    <div className="mb-3">
                      <label className="form-label">Message</label>
                      <textarea
                        className="form-control"
                        rows={4}
                        value={addForm.message}
                        onChange={(e) => setAddForm({ ...addForm, message: e.target.value })}
                      />
                    </div>
                    <div className="mb-0">
                      <label className="form-label">Message To</label>
                      <div className="row">
                        {["STUDENT", "PARENT", "ADMIN", "TEACHER", "ACCOUNTANT", "LIBRARIAN", "RECEPTIONIST", "SUPER_ADMIN"].map(
                          (type) => (
                            <div className="col-md-6" key={type}>
                              <label className="checkboxs mb-1">
                                <input
                                  type="checkbox"
                                  checked={addForm.recipients.includes(type)}
                                  onChange={(e) => {
                                    const checked = e.target.checked;
                                    setAddForm({
                                      ...addForm,
                                      recipients: checked
                                        ? [...addForm.recipients, type]
                                        : addForm.recipients.filter((r) => r !== type),
                                    });
                                  }}
                                />
                                <span className="checkmarks" />
                                {type}
                              </label>
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <Link to="#" className="btn btn-light me-2" data-bs-dismiss="modal">
                  Cancel
                </Link>
                <button type="button" className="btn btn-primary" data-bs-dismiss="modal" onClick={handleAddSubmit}>
                  Add New Message
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Message Modal */}
      <div className="modal fade" id="edit_message">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h4 className="modal-title">Edit Notice</h4>
              <button
                type="button"
                className="btn-close custom-btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              >
                <i className="ti ti-x" />
              </button>
            </div>
            <div>
              <div className="modal-body">
                {editNoticeId && (
                  <div className="row">
                    <div className="col-md-12">
                      <div className="mb-3">
                        <label className="form-label">Title</label>
                        <input
                          type="text"
                          className="form-control"
                          value={editForm.title}
                          onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                        />
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Notice Date</label>
                        <div className="date-pic">
                          <DatePicker
                            className="form-control datetimepicker"
                            placeholder="Select Date"
                            value={editForm.noticeDate ? moment(editForm.noticeDate) : null}
                            onChange={(date) =>
                              setEditForm({
                                ...editForm,
                                noticeDate: date ? date.format("YYYY-MM-DD") : "",
                              })
                            }
                          />
                          <span className="cal-icon">
                            <i className="ti ti-calendar" />
                          </span>
                        </div>
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Publish On</label>
                        <div className="date-pic">
                          <DatePicker
                            className="form-control datetimepicker"
                            placeholder="Select Date"
                            value={editForm.publishDate ? moment(editForm.publishDate) : null}
                            onChange={(date) =>
                              setEditForm({
                                ...editForm,
                                publishDate: date ? date.format("YYYY-MM-DD") : "",
                              })
                            }
                          />
                          <span className="cal-icon">
                            <i className="ti ti-calendar" />
                          </span>
                        </div>
                      </div>
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
                                onChange={handleEditAttachmentChange}
                              />
                            </div>
                            {getAttachmentDisplay(editForm.attachment)}
                          </div>
                        </div>
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Message</label>
                        <textarea
                          className="form-control"
                          rows={4}
                          value={editForm.message}
                          onChange={(e) => setEditForm({ ...editForm, message: e.target.value })}
                        />
                      </div>
                      <div className="mb-0">
                        <label className="form-label">Message To</label>
                        <div className="row">
                          {["STUDENT", "PARENT", "ADMIN", "TEACHER", "ACCOUNTANT", "LIBRARIAN", "RECEPTIONIST", "SUPER_ADMIN"].map(
                            (type) => (
                              <div className="col-md-6" key={type}>
                                <label className="checkboxs mb-1">
                                  <input
                                    type="checkbox"
                                    checked={editForm.recipients.includes(type)}
                                    onChange={(e) => {
                                      const checked = e.target.checked;
                                      setEditForm({
                                        ...editForm,
                                        recipients: checked
                                          ? [...editForm.recipients, type]
                                          : editForm.recipients.filter((r) => r !== type),
                                      });
                                    }}
                                  />
                                  <span className="checkmarks" />
                                  {type}
                                </label>
                              </div>
                            )
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <div className="modal-footer">
                <Link to="#" className="btn btn-light me-2" data-bs-dismiss="modal">
                  Cancel
                </Link>
                <button type="button" className="btn btn-primary" data-bs-dismiss="modal" onClick={handleEditSubmit}>
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* View Details Modal */}
      <div className="modal fade" id="view_details">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h4 className="modal-title">{viewNotice?.title}</h4>
              <button
                type="button"
                className="btn-close custom-btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              >
                <i className="ti ti-x" />
              </button>
            </div>
            <div className="modal-body pb-0">
              {viewNotice && (
                <div>
                  <h5>{viewNotice.title}</h5>
                  <p><b>Message:</b> {viewNotice.message}</p>
                  <p><b>Notice Date:</b> {viewNotice.noticeDate ? moment(viewNotice.noticeDate).format('DD MMM YYYY') : '-'}</p>
                  <p><b>Publish Date:</b> {viewNotice.publishDate ? moment(viewNotice.publishDate).format('DD MMM YYYY') : '-'}</p>
                  <p><b>Recipients:</b> {viewNotice.recipients.map((r) => r.userType).join(', ')}</p>
                  <p><b>Creator:</b> {viewNotice.creator?.name || '-'}</p>
                  <p><b>Attachment:</b> {typeof viewNotice.attachment === 'string' && viewNotice.attachment ? (
                    <a href={viewNotice.attachment} target="_blank" rel="noopener noreferrer">View</a>
                  ) : getAttachmentDisplay(viewNotice.attachment)}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Delete Modal */}
      <div className="modal fade" id="delete-modal">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div>
              <div className="modal-body text-center">
                <span className="delete-icon">
                  <i className="ti ti-trash-x" />
                </span>
                <h4>Confirm Deletion</h4>
                <p>
                  You want to delete {selectedIds.length} item(s), this can't be undone once you delete.
                </p>
                <div className="d-flex justify-content-center">
                  <Link to="#" className="btn btn-light me-3" data-bs-dismiss="modal">
                    Cancel
                  </Link>
                  <button type="button" className="btn btn-danger" data-bs-dismiss="modal" onClick={handleDelete}>
                    Yes, Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default NoticeBoard;