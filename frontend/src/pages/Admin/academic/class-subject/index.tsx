import React, { useEffect, useRef, useState } from "react";
// import { classSubject } from "../../../core/data/json/class-subject";
import Table from "../../../../core/common/dataTable/index";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import {
  count,
 
  language,
  typetheory,
} from "../../../../core/common/selectoption/selectoption";
import PredefinedDateRanges from "../../../../core/common/datePicker";
import CommonSelect from "../../../../core/common/commonSelect";
import { TableData } from "../../../../core/data/interface";
import { Link, useLocation } from "react-router-dom";
import TooltipOption from "../../../../core/common/tooltipOption";
import { all_routes } from "../../../../router/all_routes";
import { createSubject, getSubjectByClassId, getSubjectById } from "../../../../services/teacher/subjectServices";
import { Isubject } from "../../../../services/types/teacher/subjectService";
import { getClassByschoolId } from "../../../../services/teacher/classServices";
import { toast } from "react-toastify";


const ClassSubject = () => {
  const routes = all_routes;
  const location=useLocation();
  const classID=location.state?.id;
  console.log("class id in class subject",classID);
 const [data, setData] = useState<any[]>([]);
 const [reload, setReload] = useState(false);
  const [classList, setClassList] = useState<any[]>([]);
  // var classIdsend:string="";
const [subjectList, setSubjectList] = useState<any[]>([]);
 const [subjectdata, setSubjectData] = useState<Isubject>({
  name: "",
  code: "",
  type: "",
  classId: ""
 });
 
  useEffect(()=>{
    const fetchData = async () => {
      try{
        const response = await getClassByschoolId(localStorage.getItem("schoolId") as string);
        // console.log("claas name ",response);
        setClassList(response.data as any);
      }
      catch(error){
        console.error("Error fetching data:", error);
      }
    }
    fetchData();
   
  },[subjectdata]);
const handlechange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const { name, value } = e.target;
  setSubjectData((prev) => ({ ...prev, [name]: value })); 
}
// const handleselectChange = (name: string, value: string) => {
//   setSubjectData((prev) => ({ ...prev, [name]: value }));
// }
const handleon = (e: React.ChangeEvent<HTMLSelectElement>) => {
  setSubjectData(prev => ({ ...prev, classId: e.target.value }));
  // setClassIdSend(prev => ({ ...prev, classId: e.target.value }));
 
}
// const fetchData = async () => {
//   try {
//     console.log("classIdsend",classIdsend);
//     if(!classIdsend.classId) return; 
//     const response = await  getSubjectByschoolId(localStorage.getItem("schoolId") as string);
//    console.log("object",response);
//     setData(response.data as any);
//   } catch (error) {
//     console.error("Error fetching data:", error);
//   }
// }
useEffect(()=>{
 const fetchData = async () => {
  const res= await getSubjectByClassId(classID);
  console.log("class subject data",res.data.data);
  setSubjectList(res.data.data);
 }
  fetchData();
    },[reload])
const handlesubmit = async(e: React.MouseEvent<HTMLAnchorElement>) => {
  e.preventDefault();
  console.log("subjectdata", subjectdata);
  try {
    const response= await createSubject(subjectdata);
    // fetchData
    if(response.status===200){
      toast.success("subject created successfully")
    setSubjectData({
      name: "",
      code: "",
      type: "",
      classId: ""});
    setReload(!reload);
    ;}
    console.log("response", response);
  } catch (error) {
    console.error("Error submitting data:", error);
    
  }
 }
  // const data = classSubject;
  const dropdownMenuRef = useRef<HTMLDivElement | null>(null);
  const handleApplyClick = () => {
    if (dropdownMenuRef.current) {
      dropdownMenuRef.current.classList.remove("show");
    }
  };
  const dataWithKeys = subjectList.map((item, index) => ({
    ...item,
    key: item.id || item._id || item.code || index
  }));
  
  const columns = [
    // {
    //   title: "ID",
    //   dataIndex: "id",
    //   render: (text: string, record: any, index: number) => (
    //     <>
    //       <Link to="#" className="link-primary">
    //         {record.id}
    //       </Link>
    //     </>
    //   ),
    //   sorter: (a: TableData, b: TableData) => a.id.length - b.id.length,
    // },

    {
      title: "Name",
      dataIndex: "name",
      sorter: (a: TableData, b: TableData) => a.name.length - b.name.length,
    },
    {
      title: "Code",
      dataIndex: "code",
      sorter: (a: TableData, b: TableData) => a.code.length - b.code.length,
    },
    {
      title: "Type",
      dataIndex: "type",
      sorter: (a: TableData, b: TableData) => a.type.length - b.type.length,
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (text: string) => (
        <>
          {text === "Active" ? (
            <span className="badge badge-soft-success d-inline-flex align-items-center">
              <i className="ti ti-circle-filled fs-5 me-1"></i>
              {text}
            </span>
          ) : (
            <span className="badge badge-soft-danger d-inline-flex align-items-center">
              <i className="ti ti-circle-filled fs-5 me-1"></i>
              {text}
            </span>
          )}
        </>
      ),
      sorter: (a: TableData, b: TableData) => a.status.length - b.status.length,
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
                    data-bs-target="#edit_subject"
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
    <div>
      <>
        {/* Page Wrapper */}
        <div className="page-wrapper">
        <ToastContainer position="top-right" autoClose={3000} />
          <div className="content">
            {/* Page Header */}
            <div className="d-md-flex d-block align-items-center justify-content-between mb-3">
              <div className="my-auto mb-2">
                <h3 className="page-title mb-1">Subjects</h3>
                <nav>
                  <ol className="breadcrumb mb-0">
                    <li className="breadcrumb-item">
                      <Link to={routes.adminDashboard}>Dashboard</Link>
                    </li>
                    <li className="breadcrumb-item">
                      <Link to="#">Academic </Link>
                    </li>
                    <li className="breadcrumb-item active" aria-current="page">
                      Subjects
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
                    data-bs-target="#add_subject"
                  >
                    <i className="ti ti-square-rounded-plus-filled me-2" />
                    Add Subject
                  </Link>
                </div>
              </div>
            </div>
            {/* /Page Header */}
            {/* Guardians List */}
            <div className="card">
              <div className="card-header d-flex align-items-center justify-content-between flex-wrap pb-0">
                <h4 className="mb-3">Class Subject</h4>
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
                    <div className="dropdown-menu drop-width"  ref={dropdownMenuRef}>
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
                            <div className="col-md-12">
                              <div className="mb-3">
                                <label className="form-label">Code</label>
                                <CommonSelect
                                  className="select"
                                  options={count}
                                  defaultValue={count[0]}
                                   
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
                        <Link
                          to="#"
                          className="dropdown-item rounded-1 active"
                        >
                          Ascending
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="#"
                          className="dropdown-item rounded-1"
                        >
                          Descending
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="#"
                          className="dropdown-item rounded-1"
                        >
                          Recently Viewed
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="#"
                          className="dropdown-item rounded-1"
                        >
                          Recently Added
                        </Link>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              <div className="card-body p-0 py-3">
                {/* Guardians List */}
                <Table columns={columns} dataSource={dataWithKeys  ?? []} Selection={true} />
                
                {/* /Guardians List */}
              </div>
            </div>
            {/* /Guardians List */}
          </div>
        </div>
        {/* /Page Wrapper */}
      </>
      <div>
        {/* Add Subject */}
        <div className="modal fade" id="add_subject">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h4 className="modal-title">Add Subject</h4>
                <button
                  type="button"
                  className="btn-close custom-btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                >
                  <i className="ti ti-x" />
                </button>
              </div>
              <form >
                <div className="modal-body">
                  <div className="row">
                    <div className="col-md-12">
                      {/* <div className="mb-3">
                        <label className="form-label"> class Name</label>
                        <input type="text" className="form-control"
                          placeholder="Enter Name" name="name"
                          onChange={handlechange} //show all the class from backend using api and in drop down and when a us3er select a class then it classid is automatically store intthe class id  
                          required
                         />
                      </div> */}
                      <div className="mb-3">
  <label className="form-label">Class</label>
  <select
    className="form-control"
    name="classId"
    value={subjectdata.classId}
    onChange={(e) => handleon(e)}
    required
  >
    <option value="">Select Class</option>
    {classList.map((cls) => (
      <option key={cls.id} value={cls.id}>{cls.name}</option>
    ))}
  </select>
</div>

                      <div className="mb-3">
                        <label className="form-label">subject Name</label>
                        <input type="text" className="form-control"
                          placeholder="Enter Name" name="name"
                          value={subjectdata.name}
                          onChange={handlechange}
                          required
                         />
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Code</label>
                        {/* <CommonSelect
                          className="select"
                          options={count}
                          defaultValue={count[0]}
                           
                        /> */}
             <input type="text" name="code"  value={subjectdata.code}
              className="form-control"  onChange={handlechange}/>
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Type</label>
                        {/* <CommonSelect
                          className="select"
                          options={typetheory}
                          defaultValue={typetheory[0]}
                          onChange={(value) => handleselectChange("type",value)}
                          
                        /> */}
                         <select
    className="form-control"
    name="type"
    value={subjectdata.type}
    onChange={(e) => setSubjectData(prev => ({ ...prev, type: e.target.value }))}
    required
  >
    <option value="">Select Class</option>
    <option value="Theory">theory</option>
    <option value="practical">practical</option>
    {/* {classList.map((cls) => (
      <option key={cls.id} value={cls.id}>{cls.name}</option>
    ))} */}
  </select>
                      </div>
                      {/* <div className="d-flex align-items-center justify-content-between">
                        <div className="status-title">
                          <h5>Status</h5>
                          <p>Change the Status by toggle </p>
                        </div>
                        <div className="form-check form-switch">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            role="switch"
                            id="switch-sm"
                          />
                        </div>
                      </div> */}
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <Link
                    to="#"
                    className="btn btn-light me-2"
                    data-bs-dismiss="modal"
                    // onClick={handlecancel}
                  >
                    Cancel
                  </Link>
                  <Link to="#" data-bs-dismiss="modal"  onClick={handlesubmit}  className="btn btn-primary">
                    Add Subject
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </div>
        {/* /Add Subject */}
        {/* Edit Subject */}
        <div className="modal fade" id="edit_subject">
          <div className="modal-dialog modal-dialog-centere">
            <div className="modal-content">
              <div className="modal-header">
                <h4 className="modal-title">Edit Subject</h4>
                <button
                  type="button"
                  className="btn-close custom-btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                >
                  <i className="ti ti-x" />
                </button>
              </div>
              <form >
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
                      <div className="mb-3">
                        <label className="form-label">Code</label>
                        <CommonSelect
                          className="select"
                          options={count}
                          defaultValue={count[0]}
                          
                        />
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Type</label>
                        <CommonSelect
                          className="select"
                          options={typetheory}
                          defaultValue={typetheory[0]}
                          
                        />
                      </div>
                      <div className="d-flex align-items-center justify-content-between">
                        <div className="status-title">
                          <h5>Status</h5>
                          <p>Change the Status by toggle </p>
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
                  <Link
                    to="#"
                    className="btn btn-light me-2"
                    data-bs-dismiss="modal"
                  >
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
        {/* /Edit Subject */}
        {/* Delete Modal */}
        <div className="modal fade" id="delete-modal">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <form >
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
                    <Link to="#" className="btn btn-danger" data-bs-dismiss="modal">
                      Yes, Delete
                    </Link>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
        {/* /Delete Modal */}
      </div>
    </div>
  );
};

export default ClassSubject;
