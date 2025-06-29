import React, { useEffect, useRef } from "react";
// import Table from "../../core/common/dataTable/index";
import {
  count,
  language,
  typetheory,
} from "../../core/common/selectoption/selectoption";
import PredefinedDateRanges from "../../core/common/datePicker";
import CommonSelect from "../../core/common/commonSelect";
import { Link } from "react-router-dom";
import TooltipOption from "../../core/common/tooltipOption";
import { all_routes } from "../../router/all_routes";
import { getClassByschoolId } from "../../services/teacher/classServices";

import useMobileDetection from "../../core/common/mobileDetection";
import { useSelector } from "react-redux";
import { Table } from "antd";
import { getTeacherById } from "../../services/admin/teacherRegistartion";
import TeacherGrid from "../Admin/peoples/teacher/teacher-grid";

const Gettheirstudent = ({
  teacherdata,
  selectedClassId,
  setSelectedClassId,
  activeTab,
  setActiveTab,
}: {
  teacherdata?: any;
  selectedClassId?: any;
  setSelectedClassId?: (id: any) => void;
  activeTab?: any;
  setActiveTab?: (tab: any) => void;
}) => {
  const routes = all_routes;
  const [classList, setClassList] = React.useState([]);
  const ismobile = useMobileDetection();
  const obj = useSelector((state: any) => state.auth.userObj);
 const fetchDataMobile = async () => {
      try {
         const response = await getTeacherById(localStorage.getItem("teacherId") ?? "");
            if (response.status === 200) {
              const teacherDetails = response.data;
              const sortedLessons = (teacherDetails.lessons || []).sort((a, b) =>
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
            }
      } catch (error) {
        console.error("Error fetching data:", error);
        setClassList([]); 
      }
    };
  useEffect(() => {
    if (obj.role === "teacher" && teacherdata) {
      const sortedLessons = (teacherdata.lessons || []).sort((a:any, b:any) =>
        a.classId.localeCompare(b.classId)
      );
      const processedLessons = sortedLessons.reduce((acc:any, lesson:any, index:any) => {
        const prevLesson = sortedLessons[index - 1];
        const isFirstInClass = !prevLesson || prevLesson.classId !== lesson.classId;
        return [...acc, { ...lesson, isFirstInClass }];
      }, []);
      setClassList(processedLessons);
    }
    else{
      fetchDataMobile();
    }
  }, [obj.role === "teacher", teacherdata]);
  const dropdownMenuRef = useRef<HTMLDivElement>(null);
  const handleApplyClick = () => {
    if (dropdownMenuRef.current && dropdownMenuRef.current.classList) {
      dropdownMenuRef.current.classList.remove("show");
    }
  };

  const columns = [
    // {
    //   title: "Class Name",
    //   dataIndex: ["class", "name"],
    //   render: (text: any, record: any) =>
    //     // teacherdata ? (
    //     //   <a
    //     //     href="#"
    //     //     onClick={(e) => {
    //     //       e.preventDefault();
    //     //       setSelectedClassId?.(record.class?.id);
    //     //       setActiveTab?.(routes.classStudent);
    //     //     }}
    //     //     className="link-primary"
    //     //   >
    //     //     {text}
    //     //   </a>
    //     // ) : (
    //     //  <Link to={routes.classStudent} state={{ id: record.class.id }} className="link-primary">
    //     //             {text}
    //     //           </Link>
    //     // ),
        
    //     ,
    //   sorter: (a: any, b: any) => a.name.length - b.name.length,
    // },
    {
      title: "Class Name",
      dataIndex: ["class", "name"],
      render: (text:any, record:any) => {
        if (!record.isFirstInClass) {
          return <span></span>;
        }
        return teacherdata ? (
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              setSelectedClassId?.(record.class?.id);
              setActiveTab?.(routes.classStudent);
            }}
            className="link-primary"
          >
            {text}
          </a>
        ) : (
          <Link to={routes.classStudent} state={{ id: record.class?.id }} className="link-primary">
            {text}
          </Link>
        );
      },}
  ];

  return (
    <div>
      <div className={ismobile ? "page-wrapper" : "pt-1"}>
        <div className="content">
          <div className="d-md-flex d-block align-items-center justify-content-between mb-3">
            <div className="my-auto mb-2"></div>
          </div>
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
                <Table columns={columns} dataSource={classList ?? []} rowKey={"id"} />
              </div>
            </div>
          </div>
        </div>
    
      {/* Modals for Edit and Delete */}
      <div className="modal fade" id="edit_subject">
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
      </div>
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
      </div>
    </div>
  );
};

export default Gettheirstudent;
