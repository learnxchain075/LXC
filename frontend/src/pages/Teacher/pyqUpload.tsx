import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Table } from "antd";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { all_routes } from "../../router/all_routes";
import TooltipOption from "../../core/common/tooltipOption";
import { useAppSelector } from "../../Store/hooks";
import useMobileDetection from "../../core/common/mobileDetection";
import { createPYQ, getPYQById } from "../../services/admin/pyqQuestionApi";
import { closeModal } from "../Common/modalclose";
import { IPyqForm } from "../../services/types/admin/pyqService";

const MAX_SIZE_MB = 5;


const PyqUpload = ({ teacherdata }: { teacherdata?: any }) => {
  const routes = all_routes;
  const dropdownMenuRef = useRef<HTMLDivElement | null>(null);
  const userObj = useAppSelector((state: any) => state.auth.userObj);
  const role = userObj?.role;
  const ismobile = useMobileDetection();

  const [newContents, setNewContents] = useState<IPyqForm[]>([
    {
      question: null,
      solution: null,
      subject: "",
      topic: "",
      uploaderId: localStorage.getItem("userId") ?? "",
    },
  ]);
  const [pyqData, setPyqData] = useState<any[]>([]);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [message, setMessage] = useState<string>("");
  const [isError, setIsError] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchPyqData = async () => {
      try {
       
        const response = await getPYQById(localStorage.getItem("userId") ?? "");
        setPyqData(response.data);
        // console.log("Fetching PYQ data...");
      } catch (error: any) {
        toast.error(error.response?.data?.detail || "Failed to load PYQ data.", {
          position: "top-right",
          autoClose: 3000,
        });
      }
    };
    fetchPyqData();
  }, []);

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number,
    field: "question" | "solution"
  ) => {
    const selectedFile = e.target.files?.[0];

    if (!selectedFile) {
      setNewContents((prev) =>
        prev.map((content, i) =>
          i === index ? { ...content, [field]: null } : content
        )
      );
      return;
    }

    if (selectedFile.type !== "application/pdf") {
      toast.error("Only PDF files are allowed.", {
        position: "top-right",
        autoClose: 3000,
      });
      setNewContents((prev) =>
        prev.map((content, i) =>
          i === index ? { ...content, [field]: null } : content
        )
      );
      return;
    }

    if (selectedFile.size > MAX_SIZE_MB * 1024 * 1024) {
      toast.error(`File size should not exceed ${MAX_SIZE_MB}MB.`, {
        position: "top-right",
        autoClose: 3000,
      });
      setNewContents((prev) =>
        prev.map((content, i) =>
          i === index ? { ...content, [field]: null } : content
        )
      );
      return;
    }

    setNewContents((prev) =>
      prev.map((content, i) =>
        i === index ? { ...content, [field]: selectedFile } : content
      )
    );
    toast.success(`Ready to upload: ${selectedFile.name}`, {
      position: "top-right",
      autoClose: 3000,
    });
  };

  const handleInputChange = (
    index: number,
    field: keyof Omit<IPyqForm, "question" | "solution">,
    value: string
  ) => {
    setNewContents((prev) =>
      prev.map((content, i) =>
        i === index ? { ...content, [field]: value } : content
      )
    );
  };

  const addNewContent = (e: React.MouseEvent) => {
    e.preventDefault();
    setNewContents((prev) => [
      ...prev,
      {
        question: null,
        solution: null,
        subject: "",
        topic: "",
        uploaderId: localStorage.getItem("userId") ?? "",
      },
    ]);
  };

  const removeContent = (index: number) => {
    setNewContents((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    const validFiles = newContents.filter(
      (content) => content.question && content.subject && content.topic && content.uploaderId
    );

    if (validFiles.length === 0) {
      toast.error(
        "Please select at least one valid PDF file for question, and fill in subject and topic.",
        {
          position: "top-right",
          autoClose: 3000,
        }
      );
      return;
    }

    try {
      setLoading(true);
      for (const content of validFiles) {
        const formData = new FormData();
        if (content.question) formData.append("question", content.question);
        if (content.solution) formData.append("solution", content.solution);
        formData.append("subject", content.subject);
        formData.append("topic", content.topic);
        formData.append("uploaderId", content.uploaderId);
        const res = await createPYQ(formData as any);
        // console.log(res);
      }
      closeModal("add_pyq_upload");
      toast.success("Files uploaded successfully!", {
        position: "top-right",
        autoClose: 3000,
      });
      setNewContents([
        {
          question: null,
          solution: null,
          subject: "",
          topic: "",
          uploaderId: localStorage.getItem("userId") ?? "",
        },
      ]);
    } catch (error: any) {
      toast.error(error.response?.data?.detail || "Upload failed.", {
        position: "top-right",
        autoClose: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      // Placeholder for actual API call
      // await deletePYQ(id);
      // console.log(`Deleting PYQ with id: ${id}`);
      setPyqData((prev) => prev.filter((item) => item.id !== id));
      toast.success("PYQ deleted successfully!", {
        position: "top-right",
        autoClose: 3000,
      });
    } catch (error: any) {
      toast.error(error.response?.data?.detail || "Deletion failed.", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  const handleApplyClick = () => {
    if (dropdownMenuRef.current) {
      dropdownMenuRef.current.classList.remove("show");
    }
  };

  const pyqColumns = [
    {
      title: "Subject",
      dataIndex: "subject",
      render: (text: string, record: any) => (
        <Link to="#" className="link-primary">
          {record.subject || "N/A"}
        </Link>
      ),
      sorter: (a: any, b: any) => (a.subject || "").localeCompare(b.subject || ""),
    },
    {
      title: "File Name",
      dataIndex: "fileName",
      render: (text: string) => <span className="text-muted">{text || "N/A"}</span>,
      sorter: (a: any, b: any) => (a.fileName || "").localeCompare(b.fileName || ""),
    },
    {
      title: "File Size",
      dataIndex: "fileSize",
      sorter: (a: any, b: any) => {
        const getSizeInKB = (size: string) =>
          parseFloat(size?.replace("KB", "") || "0");
        return getSizeInKB(a.fileSize) - getSizeInKB(b.fileSize);
      },
    },
    {
      title: "Action",
      dataIndex: "action",
      render: (_: any, record: any) => (
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
                <a
                  className="dropdown-item rounded-1"
                  href={`/files/${record.fileName}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <i className="ti ti-eye me-2" />
                  View
                </a>
              </li>
              <li>
                <a
                  className="dropdown-item rounded-1"
                  href={`/download/${record.id}`}
                >
                  <i className="ti ti-download me-2" />
                  Download
                </a>
              </li>
              <li>
                <button
                  type="button"
                  className="dropdown-item rounded-1 text-danger"
                  data-bs-toggle="modal"
                  data-bs-target="#delete-modal"
                  onClick={() => setDeleteId(record.id)}
                >
                  <i className="ti ti-trash me-2" />
                  Delete
                </button>
              </li>
            </ul>
          </div>
        </div>
      ),
    },
    ...(role === "admin" || role === "teacher"
      ? [
          {
            title: "Uploaded By",
            dataIndex: "uploadedBy",
            render: (text: string) => text || "N/A",
            sorter: (a: any, b: any) =>
              (a.uploadedBy || "").localeCompare(b.uploadedBy || ""),
          },
          {
            title: "Upload Date",
            dataIndex: "uploadDate",
            render: (text: string) => text || "N/A",
            sorter: (a: any, b: any) =>
              new Date(a.uploadDate || 0).getTime() -
              new Date(b.uploadDate || 0).getTime(),
          },
        ]
      : []),
  ];

  return (
    <div>
      <ToastContainer position="top-center" autoClose={3000} />
      <div className={ismobile ? "page-wrapper" : "pt-4"}>
        <div className="content">
          {/* Page Header */}
          <div className="d-md-flex d-block align-items-center justify-content-between mb-3">
            <div className="my-auto mb-2">
              <h3 className="page-title mb-1">PYQ Upload</h3>
              <nav>
                <ol className="breadcrumb mb-0">
                  <li className="breadcrumb-item">
                    <Link to={routes.adminDashboard}>Dashboard</Link>
                  </li>
                  <li className="breadcrumb-item">
                    <Link to="#">Academic</Link>
                  </li>
                  <li className="breadcrumb-item active" aria-current="page">
                    PYQ Upload
                  </li>
                </ol>
              </nav>
            </div>
            <div className="d-flex my-xl-auto right-content align-items-center flex-wrap">
              <TooltipOption />
              {(role === "admin" || role === "teacher") && (
                <div className="mb-2">
                  <button
                    type="button"
                    className="btn btn-primary"
                    data-bs-toggle="modal"
                    data-bs-target="#add_pyq_upload"
                  >
                    <i className="ti ti-square-rounded-plus-filled me-2" />
                    Add PYQ
                  </button>
                </div>
              )}
            </div>
          </div>
          {/* /Page Header */}

          <div className="card-body p-0 py-3">
            <Table columns={pyqColumns} dataSource={pyqData} />
            {message && (
              <div
                className={`alert mt-3 ${isError ? "alert-danger" : "alert-success"}`}
              >
                {message}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add PYQ Modal */}
      <div className="modal fade" id="add_pyq_upload">
        <div className="modal-dialog modal-dialog-centered modal-xl">
          <div className="modal-content">
            <div className="modal-header">
              <h4 className="modal-title">Add PYQ</h4>
              <button
                type="button"
                className="btn-close custom-btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              >
                <i className="ti ti-x" />
              </button>
            </div>
            <form onSubmit={handleUpload}>
              <div className="modal-body">
                {newContents.map((content, index) => (
                  <div className="pyq-upload-add mb-3" key={index}>
                    <div className="d-flex align-items-center flex-wrap column-gap-3">
                      <div className="flex-fill">
                        <div className="mb-3">
                          <label className="form-label">Select Question PDF</label>
                          <input
                            type="file"
                            accept="application/pdf"
                            className="form-control"
                            onChange={(e) => handleFileChange(e, index, "question")}
                          />
                        </div>
                        <div className="mb-3">
                          <label className="form-label">Select Solution PDF (Optional)</label>
                          <input
                            type="file"
                            accept="application/pdf"
                            className="form-control"
                            onChange={(e) => handleFileChange(e, index, "solution")}
                          />
                        </div>
                        <div className="mb-3">
                          <label className="form-label">Subject</label>
                          <input
                            type="text"
                            className="form-control"
                            value={content.subject}
                            onChange={(e) =>
                              handleInputChange(index, "subject", e.target.value)
                            }
                            required
                          />
                        </div>
                        <div className="mb-3">
                          <label className="form-label">Topic</label>
                          <input
                            type="text"
                            className="form-control"
                            value={content.topic}
                            onChange={(e) =>
                              handleInputChange(index, "topic", e.target.value)
                            }
                            required
                          />
                        </div>
                      </div>
                      {newContents.length > 1 && (
                        <div className="mb-3">
                          <button
                            type="button"
                            className="btn btn-danger"
                            onClick={() => removeContent(index)}
                          >
                            <i className="ti ti-trash me-1" />
                            Remove
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                <div>
                  <button
                    type="button"
                    onClick={addNewContent}
                    className="btn btn-primary"
                  >
                    <i className="ti ti-square-rounded-plus-filled me-2" />
                    Add Another File
                  </button>
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
                  disabled={loading}
                >
                  {loading ? "Uploading..." : "Upload PYQ"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

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
                  You want to delete this PYQ file? This action cannot be undone.
                </p>
                <div className="d-flex justify-content-center">
                  <button
                    type="button"
                    className="btn btn-light me-3"
                    data-bs-dismiss="modal"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="btn btn-danger"
                    onClick={() => deleteId && handleDelete(deleteId)}
                    data-bs-dismiss="modal"
                  >
                    Yes, Delete
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PyqUpload;