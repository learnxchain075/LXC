import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Table from "../../../core/common/dataTable/index"; // Adjust path as needed
import CommonSelect from "../../../core/common/commonSelect"; // Adjust path as needed
import PredefinedDateRanges from "../../../core/common/datePicker"; // Adjust path as needed
import TooltipOption from "../../../core/common/tooltipOption"; // Adjust path as needed
import { all_routes } from "../../../router/all_routes"; // Adjust path as needed
import { page } from "../../../core/common/selectoption/selectoption"; // Adjust path as needed
import UpdateFeaturePermissionsModal from "./UpdateFeaturePermissionsModal";
import CustomLoader from "../../../components/Loader";
import { getAllSchools } from "../../../services/superadmin/schoolService";
import { IRegisterSchool } from "../../../services/types/auth";
import { ToastContainer, toast } from "react-toastify"; //for display the delete toast
import "react-toastify/dist/ReactToastify.css";
import { deleteSchool } from "../../../services/superadmin/schoolService";// Adjust path as needed
// Define the type for school data
type School = {
  key: string;
  schoolName: string;
  adminName: string;
  email: string;
  status: "Active" | "Inactive";
  permissions: string[];
  userId: string; // Add userId
};


const GetSchools = () => {
  const routes = all_routes;
  const navigate = useNavigate();
  const [schools, setSchools] = useState<School[]>([]);
  const [selectedSchool, setSelectedSchool] = useState<School | null>(null);
  const [modalPermissions, setModalPermissions] = useState<string[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [schoolToDelete, setSchoolToDelete] = useState<string | null>(null); //to add id of school to delete it

  // Fetch schools when the component mounts
  useEffect(() => {
    fetchSchools();
  }, []);

  // Function to fetch and transform school data
  const fetchSchools = async () => {
    setLoading(true);
    try {
      const response = await getAllSchools();
      // console.log("school all ", response.data);
      const data = response.data;
     
      if (data && typeof data === "object" && Array.isArray(data.schools)) {
        const transformedSchools = data.schools.map((school: IRegisterSchool) => ({
          key: school.id.toString(),
          schoolName: school.schoolName,
          adminName: school.user.name,
          email: school.user.email,
          userId: school.user.id, // Store userId
          status: school.user.role === "admin" ? "Active" as "Active" : "Inactive" as "Inactive",
          permissions: [],
        }));
        setSchools(transformedSchools);
      } else {
        // console.error("Expected an object with a 'schools' array but got:", data);
        setSchools([]);
      }
    } catch (error) {
      // console.error("Error fetching schools:", error);
      setSchools([]);
    } finally {
      setLoading(false);
    }
  };

  // Sync modal permissions with selected school when it changes
  useEffect(() => {
    if (selectedSchool) {
      setModalPermissions(selectedSchool.permissions);
    }
  }, [selectedSchool]);

  // Set up event listeners for the update permission modal
  useEffect(() => {
    const modal = document.getElementById("update-permission-modal");
    if (modal) {
      modal.addEventListener("show.bs.modal", (event: Event) => {
        const button = (event as any).relatedTarget;
        const schoolKey = button.getAttribute("data-school-key");
        const school = schools.find((item) => item.key === schoolKey);
        if (school) {
          setSelectedSchool(school);
        }
      });
      modal.addEventListener("hidden.bs.modal", () => {
        setSelectedSchool(null);
        setModalPermissions([]);
        setSelectedUserId("");
      });
    }
  }, [schools]);

  // Function to toggle school status
  const toggleStatus = (schoolKey: string) => {
    setSchools((prevSchools) =>
      prevSchools.map((school) =>
        school.key === schoolKey
          ? {
            ...school,
            status: school.status === "Active" ? "Inactive" : "Active",
          }
          : school
      )
    );
  };

  // Navigate to school profile page
  // const handleSchoolProfileNavigation = (schoolKey: string) => {
  //   navigate(`${routes.schoolProfilePage}/${schoolKey}`);
  //   console.log(routes.schoolProfilePage);
  // };


  const handleSchoolProfileNavigation = (schoolKey: string) => {
    const path = routes.adminDashboard.replace(":schoolId", schoolKey);
    navigate(path);
    // console.log("Navigating to:", path);
  };
  //to delete school  
  const handleDeleteSchool = async (e: React.MouseEvent) => {
    e.preventDefault();

    if (!schoolToDelete) {
      toast.error("No school selected for deletion");
      return;
    }

    try {
      setLoading(true);
      // console.log("school id ", schoolToDelete);
      const response =await deleteSchool(schoolToDelete);
      if(response.status===200){
      setSchools(prev => prev.filter(school => school.key !== schoolToDelete));

      }

      toast.success("School deleted successfully");
    } catch (error: any) {
      console.error("deletion error:"
      //    {
      //   error: error.response?.data || error.message,
      //   status: error.response?.status,
      //   config: error.config
      // }
    );

      // More specific error message
      const errorMessage = error.response?.data?.message ||
        (error.response?.status === 400
          ? "Cannot delete school - it may have associated data"
          : "Failed to delete school");

      toast.error(errorMessage);
    } finally {
      setLoading(false);
      setSchoolToDelete(null);
    }
  };

  // Define table columns
  const columns = [
    {
      title: "School Name",
      dataIndex: "schoolName",
      key: "schoolName",

      sorter: (a: School, b: School) => a.schoolName.localeCompare(b.schoolName),
      render: (_: string, record: School) => (
        // <Link to={`/school-profile-page/${record.key}`} className="text-primary">
        //   {record.schoolName}
        // </Link>
        <Link to={`/superadmin/school/${record.key}`} className="text-primary">
          {record.schoolName}
        </Link>

      ),
    },
    {
      title: "Admin Name",
      dataIndex: "adminName",
      key: "adminName",
      sorter: (a: School, b: School) => a.adminName.localeCompare(b.adminName),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      sorter: (a: School, b: School) => a.email.localeCompare(b.email),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (_: string, record: School) => (
        <div className="status-toggle modal-status">
          <input
            type="checkbox"
            id={`user-${record.key}`}
            className="check"
            checked={record.status === "Active"}
            onChange={() => toggleStatus(record.key)}
          />
          <label htmlFor={`user-${record.key}`} className="checktoggle"></label>
        </div>
      ),
    },
    {
      title: "Action",
      key: "action",
      render: (_: any, record: School) => (
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
              {/* onClick={() => setSelectedUserId(record.key)} */}
              <li>
                <Link
                  to="#"
                  className="dropdown-item rounded-1"
                  data-bs-toggle="modal"
                  data-bs-target="#modal-lg"
                  data-school-key={record.key}
                  onClick={() => setSelectedUserId(record.userId)}
                >
                  <i className="ti ti-edit-circle me-2" />
                  Update Permission
                </Link>
              </li>
              <li>
                <Link
                  to="#"
                  className="dropdown-item rounded-1"
                  data-bs-toggle="modal"
                  data-bs-target="#delete-modal"
                  onClick={(e) => {
                    e.preventDefault();
                    setSchoolToDelete(record.key);
                  }}
                >
                  <i className="ti ti-trash-x me-2" />
                  Delete
                </Link>
              </li>
              <li>
                <Link
                  to={routes.setSchoolLocation.replace(":schoolId", record.key)}
                  className="dropdown-item rounded-1"
                >
                  <i className="ti ti-world-pin me-2" />
                  Set Location
                </Link>
              </li>
            </ul>
          </div>
        </div>
      ),
    },
  ];

  return (
    <>
      {/* Page Wrapper */}
      <div className="page-wrapper">
        <ToastContainer />
        <div className="content">
          {/* Page Header */}
          <div className="d-md-flex d-block align-items-center justify-content-between mb-3">
            <div className="my-auto mb-2">
              <h3 className="page-title mb-1">Get Schools</h3>
              <nav>
                <ol className="breadcrumb mb-0">
                  <li className="breadcrumb-item">
                    <Link to={routes.adminDashboard}>Dashboard</Link>
                  </li>
                  <li className="breadcrumb-item">
                    <Link to="#">Content</Link>
                  </li>
                  <li className="breadcrumb-item active" aria-current="page">
                    All Schools
                  </li>
                </ol>
              </nav>
            </div>
            <div className="d-flex my-xl-auto right-content align-items-center flex-wrap">
              <TooltipOption />
              <div className="mb-2">
                <Link
                  to={routes.addSchools}
                  className="btn btn-primary d-flex align-items-center"
                  
                >
                  <i className="ti ti-square-rounded-plus me-2" />
                  Add School
                </Link>
              </div>
            </div>
          </div>
          {/* /Page Header */}

          {/* Schools List Card */}
          <div className="card">
            <div className="card-header d-flex align-items-center justify-content-between flex-wrap pb-0">
              <h4 className="mb-3">Schools List</h4>
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
                      <div className="p-3 border-bottom">
                        <div className="row">
                          <div className="col-md-12">
                            <div className="mb-3">
                              <label className="form-label">School Name</label>
                              <CommonSelect
                                className="select"
                                options={page}
                                defaultValue={page[0]}
                              />
                            </div>
                          </div>
                          <div className="col-md-12">
                            <div className="mb-0">
                              <label className="form-label">Admin Name</label>
                              <CommonSelect
                                className="select"
                                options={page}
                                defaultValue={page[0]}
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
              {loading ? (
                <CustomLoader variant="dots" color="#3067e3"  />
              ) : (
                <Table dataSource={schools} columns={columns} Selection={true} />
              )}
            </div>
          </div>
          {/* /Schools List Card */}
        </div>
      </div>
      {/* /Page Wrapper */}

      {/* Update Permission Modal */}
      <UpdateFeaturePermissionsModal userId={selectedUserId} />



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
                  You want to delete all the marked items? This can't be undone
                  once you delete.
                </p>
                <div className="d-flex justify-content-center">
                  <Link
                    to="#"
                    className="btn btn-light me-3"
                    data-bs-dismiss="modal"
                    onClick={(e) => {
                      e.preventDefault();
                      setSchoolToDelete(null);  //to remove the school id
                    }}
                  >
                    Cancel
                  </Link>
                  <Link
                    to="#"
                    className="btn btn-danger"
                    data-bs-dismiss="modal"
                    //to call api to delte the school
                    onClick={handleDeleteSchool} 
                    >
                    Yes, Delete
                  </Link>
                  {/* <button type="submit" className="btn btn-danger"
                    //to call api to delte the school
                    onClick={handleDeleteSchool} disabled={loading}>
                    Yes, Delete
                  </button> */}
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

export default GetSchools;