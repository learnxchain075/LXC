

import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Table } from "antd";
import { useSelector } from "react-redux";
import { getClassByschoolId } from "../../services/teacher/classServices";
import { getTeacherById } from "../../services/admin/teacherRegistartion";
import PredefinedDateRanges from "../../core/common/datePicker";
import CommonSelect from "../../core/common/commonSelect";
import { all_routes } from "../../router/all_routes";
import { language } from "../../core/common/selectoption/selectoption";
import useMobileDetection from "../../core/common/mobileDetection";

const Classeshome = ({
  activeTab,
  setActiveTab,
   setSelectedClassId,
    selectedClassId
}: {
  activeTab?: any;
  setActiveTab?: (tab: any) => void;
   setSelectedClassId?: (id: string) => void;
    selectedClassId?: string;
}) => {
  const routes = all_routes;
  const [classList, setClassList] = useState([]);
  const ismobile = useMobileDetection();
  const obj = useSelector((state:any) => state.auth.userObj);
  const dropdownMenuRef = useRef<HTMLDivElement>(null);


  const fetchDataMobile = async () => {
    try {
      const response = await getTeacherById(localStorage.getItem("teacherId") ?? "");
      if (response.status === 200) {
        const teacherDetails = response.data;
     
        const sortedLessons = (teacherDetails.lessons || []).sort((a:any, b:any) =>
          a.classId.localeCompare(b.classId)
        );
        const processedLessons = sortedLessons.reduce((acc :any, lesson:any, index:any) => {
          const prevLesson = sortedLessons[index - 1];
          const isFirstInClass = !prevLesson || prevLesson.classId !== lesson.classId;
          return [...acc, { ...lesson, isFirstInClass }];
        }, []);
        setClassList(processedLessons);
      } else {
        console.error("Failed to fetch teacher details");
        setClassList([]);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setClassList([]);
    }
  };


  useEffect(() => {
    const fetchData = async () => {
      try {
        if (obj.role === "admin") {
          const response = await getClassByschoolId(localStorage.getItem("schoolId") ?? "");

          setClassList(response.data  as any|| []);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setClassList([]);
      }
    };

    fetchData();
  }, [obj.role]);

 
  useEffect(() => {
  
      fetchDataMobile();

  }, [obj.role]);

  const handleApplyClick = () => {
    if (dropdownMenuRef.current && dropdownMenuRef.current.classList) {
      dropdownMenuRef.current.classList.remove("show");
    }
  };

  const columns = [
    {
      title: "Class Name",
      dataIndex: ["class", "name"],
      render: (text:any, record:any) => {
        // console.log("record",record);
        if (!record.isFirstInClass) {
          return <span></span>; 
        }
        return obj.role === "admin" ? (
          <Link to={routes.classSubject} state={{ id: record.id }} className="link-primary">
            {text}
          </Link>
        ) : (
          ismobile ?(
            <Link to={routes.classHomeWork} 
          state={{ id: record.classId }}
         
           className="link-primary">
            {text}
          </Link>)
          :(
          <Link to={routes.classHomeWork} 
        //   state={{ id: record.classId }}
          onClick={(e) => {
            e.preventDefault();
             setActiveTab?.(routes.classHomeWork);
            setSelectedClassId?.(record.classId);
             
             
          }}
           className="link-primary">
            {text}
          </Link>)
        );
      },
      sorter: (a:any, b:any) => (a.class?.name?.length || 0) - (b.class?.name?.length || 0),
    },
    // {
    //   title: "Subject",
    //   dataIndex: "name",
    //   render: (text:any) => <span>{text}</span>,
    //   sorter: (a:any, b:any) => (a.name?.length || 0) - (b.name?.length || 0),
    // },
    // {
    //   title: "Status",
    //   dataIndex: "status",
    //   render: (text:any) => (
    //     <span
    //       className={`badge badge-soft-${text === "Active" ? "success" : "danger"} d-inline-flex align-items-center`}
    //     >
    //       <i className="ti ti-circle-filled fs-5 me-1"></i>
    //       {text}
    //     </span>
    //   ),
    //   sorter: (a:any, b:any) => (a.status?.length || 0) - (b.status?.length || 0),
    // },
    // {
    //   title: "Action",
    //   dataIndex: "action",
    //   render: () => (
    //     <div className="d-flex align-items-center">
    //       <div className="dropdown">
    //         <Link
    //           to="#"
    //           className="btn btn-white btn-icon btn-sm d-flex align-items-center justify-content-center rounded-circle p-0"
    //           data-bs-toggle="dropdown"
    //           aria-expanded="false"
    //         >
    //           <i className="ti ti-dots-vertical fs-14" />
    //         </Link>
    //         <ul className="dropdown-menu dropdown-menu-right p-3">
    //           <li>
    //             <Link
    //               className="dropdown-item rounded-1"
    //               to="#"
    //               data-bs-toggle="modal"
    //               data-bs-target="#edit_subject"
    //             >
    //               <i className="ti ti-edit-circle me-2" />
    //               Edit
    //             </Link>
    //           </li>
    //           <li>
    //             <Link
    //               className="dropdown-item rounded-1"
    //               to="#"
    //               data-bs-toggle="modal"
    //               data-bs-target="#delete-modal"
    //             >
    //               <i className="ti ti-trash-x me-2" />
    //               Delete
    //             </Link>
    //           </li>
    //         </ul>
    //       </div>
    //     </div>
    //   ),
    // },
  ];

  return (
    <div>
      <div className={ismobile ? "page-wrapper" : "pt-4"}>
        <div className="content">
          {/* <div className="d-md-flex d-block align-items-center justify-content-between mb-3">
            <div className="my-auto mb-2">
              <h3 className="page-title mb-1">Classes</h3>
              <nav>
                <ol className="breadcrumb mb-0">
                  <li className="breadcrumb-item">
                    <Link to={routes.teacherDashboard}>Dashboard</Link>
                  </li>
                  <li className="breadcrumb-item">
                    <Link to="#">Academic</Link>
                  </li>
                  <li className="breadcrumb-item active" aria-current="page">
                    Classes
                  </li>
                </ol>
              </nav>
            </div>
          </div> */}
          <div className="card">
            <div className="card-header d-flex align-items-center justify-content-between flex-wrap pb-0">
              <h4 className="mb-3">Class Details</h4>
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
                      <div className="p-3 border-bottom pb-0">
                        <div className="row">
                          <div className="col-md-12">
                            <div className="mb-3">
                              <label className="form-label">Name</label>
                              <CommonSelect
                                className="select"
                                options={language}
                                defaultValue={language[0]}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="p-3 d-flex align-items-center justify-content-end">
                        <Link to="#" className="btn btn-light me-3">
                          Reset
                        </Link>
                        <Link to="#" className="btn btn-primary" onClick={handleApplyClick}>
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
              <Table columns={columns} dataSource={classList ?? []} rowKey="id" />
            </div>
          </div>
        </div>
      </div>
      {/* Modals for Edit and Delete */}
      {/* <div className="modal fade" id="edit_subject">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h4 className="modal-title">Edit Class</h4>
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
                        defaultValue="English"
                      />
                    </div>
                    <div className="d-flex align-items-center justify-content-between">
                      <div className="status-title">
                        <h5>Status</h5>
                        <p>Change the Status by toggle</p>
                      </div>
                      <div className="form-check form-switch">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          role="switch"
                          id="switch-sm2"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <Link to="#" className="btn btn-light me-2" data-bs-dismiss="modal">
                  Cancel
                </Link>
                <Link to="#" className="btn btn-primary" data-bs-dismiss="modal">
                  Save Changes
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div> */}
      {/* <div className="modal fade" id="delete-modal">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <form>
              <div className="modal-body text-center">
                <span className="delete-icon">
                  <i className="ti ti-trash-x" />
                </span>
                <h4>Confirm Deletion</h4>
                <p>
                  You want to delete all the marked items, this can't be undone once you delete.
                </p>
                <div className="d-flex justify-content-center">
                  <Link to="#" className="btn btn-light me-3" data-bs-dismiss="modal">
                    Cancel
                  </Link>
                  <Link to="#" className="btn btn-danger" data-bs-dismiss="modal">
                    Yes, Delete
                  </Link>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div> */}
    </div>
  );
};

export default Classeshome;