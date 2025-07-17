import React, { useEffect, useState, useMemo, useCallback } from "react";
import { Link } from "react-router-dom";
import { Table, Tabs } from "antd";
import { useSelector } from "react-redux";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { all_routes } from "../../router/all_routes";
import useMobileDetection from "../../core/common/mobileDetection";
import { getClassesByTeacherId, getAllStudentsInAclass } from "../../services/teacher/classServices";
import LoadingSkeleton from "../../components/LoadingSkeleton";


interface Class {
  id: string;
  name: string;
  capacity: number;
  roomNumber: string | null;
  schoolId: string;
  section: string;
  Section: { id: string; name: string; classId: string }[];
  Subject: { id: string; name: string; code: string; type: string; classId: string; status?: string }[];
  students?: {
    id: string;
    key: string;
    admissionNo: string;
    rollNo: string;
    name: string;
    classId: string;
    sectionId: string;
    attendance: string;
    present: boolean;
    absent: boolean;
    notes: string;
    img: string;
  }[];
}

const MyClassesWithStudents = () => {
  const routes = all_routes;
  const isMobile = useMobileDetection();
  const dataTheme = useSelector((state: any) => state.themeSetting.dataTheme);
  const user = useSelector((state: any) => state.auth.userObj);
  const isDark = dataTheme === "dark_data_theme";
  const [classList, setClassList] = useState<Class[]>([]);
  const [selectedClass, setSelectedClass] = useState<Class | null>(null);
  const [activeTab, setActiveTab] = useState<"subjects" | "students" | "sections">("subjects");
  const [isLoadingClasses, setIsLoadingClasses] = useState(true);
  const [isLoadingStudents, setIsLoadingStudents] = useState(false);



  const getClassNameById = useCallback(
    (classId: string) => {
      const className = classList.find((cls) => cls.id === classId)?.name || classId;
      return className;
    },
    [classList]
  );

  const getSectionNameById = useCallback(
    (classId: string, sectionId: string) => {
      const classData = classList.find((cls) => cls.id === classId);
      const sectionName = classData?.Section.find((sec) => sec.id === sectionId)?.name || sectionId;
      return sectionName;
    },
    [classList]
  );

  const fetchClasses = useCallback(async () => {
    try {
      setIsLoadingClasses(true);
      
      // Get teacher ID from multiple sources
      const teacherId = user?.teacherId || localStorage.getItem("teacherId") || user?.id || "";
      
      if (!teacherId) {
        // toast.error("Teacher ID not found. Please login again.", { autoClose: 3000 });
        setClassList([]);
        return;
      }

      const response = await getClassesByTeacherId(teacherId);
      
      // Handle different possible response structures
      let classesData: any[] = [];
      const responseData = (response as any)?.data;
      
      if (responseData?.data && Array.isArray(responseData.data)) {
        classesData = responseData.data;
      } else if (responseData?.classes && Array.isArray(responseData.classes)) {
        classesData = responseData.classes;
      } else if (Array.isArray(responseData)) {
        classesData = responseData;
      } else if (Array.isArray(response)) {
        classesData = response;
      } else {
        classesData = [];
      }
      
      if (!Array.isArray(classesData)) {
        // toast.error("Invalid classes data format received", { autoClose: 3000 });
        setClassList([]);
        return;
      }
      
      const processedClasses = classesData.map((cls: any, index: number) => {
        const processedClass = {
          ...cls,
          Subject: Array.isArray(cls.Subject) ? cls.Subject.map((sub: any) => ({
            ...sub,
            status: sub.status || "Active",
          })) : [],
          Section: Array.isArray(cls.Section) ? cls.Section : [],
          section: cls.section || "",
        };
        return processedClass;
      });
      
      setClassList(processedClasses);
      
      if (processedClasses.length === 0) {
        // toast.info("No classes assigned to you yet.", { autoClose: 3000 });
      } else {
        // toast.success(`Loaded ${processedClasses.length} classes successfully`, { autoClose: 2000 });
      }
      
    } catch (error: any) {
      // toast.error("Failed to load classes. Please try again.", { autoClose: 3000 });
      setClassList([]);
    } finally {
      setIsLoadingClasses(false);
    }
  }, [user]);

  const fetchStudents = useCallback(
    async (classId: string) => {
      try {
        setIsLoadingStudents(true);
        
        const response = await getAllStudentsInAclass(classId);
        
        // Handle different possible response structures
        let studentsData: any[] = [];
        const responseData = (response as any)?.data;
        
        if (responseData?.data && Array.isArray(responseData.data)) {
          studentsData = responseData.data;
        } else if (responseData?.students && Array.isArray(responseData.students)) {
          studentsData = responseData.students;
        } else if (Array.isArray(responseData)) {
          studentsData = responseData;
        } else if (Array.isArray(response)) {
          studentsData = response;
        } else {
          studentsData = [];
        }
        
        if (!Array.isArray(studentsData)) {
          // toast.error("Invalid students data format received", { autoClose: 3000 });
          return [];
        }
        
        const students = studentsData
          .filter((student: any) => {
            const matchesClass = student.classId === classId;
            return matchesClass;
          })
          .map((student: any, index: number) => {
            const processedStudent = {
              id: student.id,
              key: student.id,
              admissionNo: student.admissionNo || `A${student.id}`,
              rollNo: student.rollNo || `R${student.id}`,
              name: student?.user?.name || student.name || "Unknown Student",
              classId: getClassNameById(classId) || "",
              sectionId: getSectionNameById(classId, student.sectionId) || "",
              attendance: student.attendance || "Present",
              present: student.attendance === "Present",
              absent: student.attendance === "Absent",
              notes: student.notes || "",
              img: student?.user?.profilePic || student.profilePic || "",
            };
            return processedStudent;
          });
        
        if (students.length === 0) {
          // toast.info("No students found for this class", { autoClose: 3000 });
        } else {
          // toast.success(`Loaded ${students.length} students successfully`, { autoClose: 2000 });
        }
        
        return students;
      } catch (error: any) {
        // toast.error("Failed to load students. Please try again.", { autoClose: 3000 });
        return [];
      } finally {
        setIsLoadingStudents(false);
      }
    },
    [getClassNameById, getSectionNameById]
  );

  useEffect(() => {
    fetchClasses();
  }, [fetchClasses]);

  const handleClassSelect = useCallback(
    async (classId: string) => {
      const selected = classList.find((cls) => cls.id === classId);
      if (selected) {
        if (!selected.students) {
          fetchStudents(classId).then(students => {
            setClassList((prev) =>
              prev.map((cls) =>
                cls.id === classId ? { ...cls, students } : cls
              )
            );
            setSelectedClass({ ...selected, students });
          });
        } else {
          setSelectedClass(selected);
        }
      }
    },
    [classList, fetchStudents]
  );

  const classColumns = useMemo(
    () => [
      {
        title: "Class Name",
        dataIndex: "name",
        render: (text: string, record: Class) => (
          <Link
            to="#"
            onClick={(e) => {
              e.preventDefault();
              handleClassSelect(record.id);
            }}
            className={isDark ? "text-blue-500 hover:underline" : "text-blue-600 hover:underline"}
          >
            {text}
          </Link>
        ),
        sorter: (a: Class, b: Class) => a.name.localeCompare(b.name),
      },
      {
        title: "Sections",
        dataIndex: "Section",
        render: (sections: any[]) => {
          if (!sections || sections.length === 0) {
            return "N/A";
          }
          const sectionNames = sections.map(sec => sec.name).join(", ");
          return sectionNames;
        },
        sorter: (a: Class, b: Class) => {
          const aSections = a.Section?.map(sec => sec.name).join(", ") || "";
          const bSections = b.Section?.map(sec => sec.name).join(", ") || "";
          return aSections.localeCompare(bSections);
        },
      },
      {
        title: "Capacity",
        dataIndex: "capacity",
        sorter: (a: Class, b: Class) => a.capacity - b.capacity,
      },
      {
        title: "Room Number",
        dataIndex: "roomNumber",
        render: (text: string | null) => text || "-",
        sorter: (a: Class, b: Class) =>
          (a.roomNumber || "").localeCompare(b.roomNumber || ""),
      },
    ],
    [handleClassSelect, isDark]
  );

  const subjectColumns = useMemo(
    () => [
      {
        title: "Subject",
        dataIndex: "name",
        sorter: (a: any, b: any) => a.name.localeCompare(b.name),
      },
      {
        title: "Code",
        dataIndex: "code",
        sorter: (a: any, b: any) => a.code.localeCompare(b.code),
      },
      {
        title: "Type",
        dataIndex: "type",
        sorter: (a: any, b: any) => a.type.localeCompare(b.type),
      },
      {
        title: "Status",
        dataIndex: "status",
        render: (text: string) => (
          <span className="d-inline-flex align-items-center">
            <i
              className="ti ti-circle-filled me-2"
              style={{
                color: text.toLowerCase() === "active" ? "green" : "red",
                fontSize: "0.6rem",
              }}
            ></i>
            {text}
          </span>
        ),
        sorter: (a: any, b: any) => a.status.localeCompare(b.status),
      },
      ...(user?.role === "admin"
        ? [
            {
              title: "Action",
              render: () => (
                <div className="dropdown">
                  <Link
                    to="#"
                    className={`inline-flex items-center justify-center w-8 h-8 rounded-full ${
                      isDark
                        ? "bg-gray-700 text-gray-300"
                        : "bg-white text-gray-600"
                    }`}
                    data-bs-toggle="dropdown"
                  >
                    <i className="ti ti-dots-vertical text-base" />
                  </Link>
                  <ul
                    className={`dropdown-menu dropdown-menu-right p-2 rounded-md shadow-md ${
                      isDark ? "bg-gray-800 text-gray-300" : "bg-white text-gray-600"
                    }`}
                  >
                    <li>
                      <Link
                        className={`dropdown-item flex items-center px-2 py-1 rounded ${
                          isDark ? "hover:bg-gray-700" : "hover:bg-gray-100"
                        }`}
                        to="#"
                        data-bs-toggle="modal"
                        data-bs-target="#edit_subject"
                      >
                        <i className="ti ti-edit-circle mr-2" />
                        Edit
                      </Link>
                    </li>
                    <li>
                      <Link
                        className={`dropdown-item flex items-center px-2 py-1 rounded ${
                          isDark ? "hover:bg-gray-700" : "hover:bg-gray-100"
                        }`}
                        to="#"
                        data-bs-toggle="modal"
                        data-bs-target="#delete-modal"
                      >
                        <i className="ti ti-trash-x mr-2" />
                        Delete
                      </Link>
                    </li>
                  </ul>
                </div>
              ),
            },
          ]
        : []),
    ],
    [isDark, user?.role]
  );

  const studentColumns = useMemo(
    () => [
      {
        title: "Student Name",
        dataIndex: "name",
        render: (text: string, record: any) => (
          <div className="d-flex align-items-center">
            <Link to="#" className="avatar avatar-md">
              <img src={record.img} className="img-fluid rounded-circle" alt="img" />
            </Link>
            <div className="ms-2">
              <p className="text-dark mb-0"><Link to="#">{text}</Link></p>
            </div>
          </div>
        ),
        sorter: (a: any, b: any) => a.name.localeCompare(b.name),
      },
      {
        title: "Admission No",
        dataIndex: "admissionNo",
        sorter: (a: any, b: any) => a.admissionNo.localeCompare(b.admissionNo),
      },
      {
        title: "Roll No",
        dataIndex: "rollNo",
        sorter: (a: any, b: any) => a.rollNo.localeCompare(b.rollNo),
      },
      {
        title: "Class",
        dataIndex: "classId",
        sorter: (a: any, b: any) => a.classId.localeCompare(b.classId),
      },
      {
        title: "Attendance",
        dataIndex: "attendance",
        render: (text: string) => (
          <span className="d-inline-flex align-items-center">
            <i
              className="ti ti-circle-filled me-2"
              style={{ color: text === "Present" ? "green" : "red", fontSize: "0.6rem" }}
            ></i>
            {text}
          </span>
        ),
        sorter: (a: any, b: any) => a.attendance.localeCompare(b.attendance),
      },
    ],
    [isDark, getSectionNameById]
  );

  const sectionColumns = useMemo(
    () => [
      {
        title: "Section Name",
        dataIndex: "name",
        sorter: (a: any, b: any) => a.name.localeCompare(b.name),
      },
    ],
    []
  );

  return (
    <div className={isMobile ? "page-wrapper" : "pt-4"}>
      <div className="content">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
        </div>
        
        {isLoadingClasses ? (
          <LoadingSkeleton type="card" />
        ) : (
          <>
            <div
              className={`rounded-lg shadow ${
                isDark ? "bg-gray-800" : "bg-white"
              }`}
            >
              <div
                className={`p-4 border-b ${
                  isDark ? "border-gray-700" : "border-gray-200"
                }`}
              >
                <h4
                  className={`text-lg font-medium ${
                    isDark ? "text-gray-100" : "text-gray-800"
                  }`}
                >
                  Class List
                </h4>
              </div>
              <div className="p-0">
                <Table
                  className={isDark ? "table table-dark" : "table table-light"}
                  columns={classColumns}
                  dataSource={classList}
                  rowKey="id"
                  pagination={false}
                  locale={{
                    emptyText: (
                      <div className="text-center py-8">
                        <i className="ti ti-inbox text-4xl text-gray-400 mb-3"></i>
                        <p className={`${isDark ? "text-gray-400" : "text-gray-600"}`}>No classes found</p>
                      </div>
                    )
                  }}
                />
              </div>
            </div>
            {selectedClass && (
              <div
                className={`rounded-lg shadow mt-4 ${
                  isDark ? "bg-gray-800" : "bg-white"
                }`}
              >
                <div
                  className={`p-4 border-b ${
                    isDark ? "border-gray-700" : "border-gray-200"
                  }`}
                >
                  <h4
                    className={`text-lg font-medium ${
                      isDark ? "text-gray-100" : "text-gray-800"
                    }`}
                  >
                    {selectedClass.name} Details
                  </h4>
                </div>
                <div className="p-4">
                  <Tabs
                    activeKey={activeTab}
                    onChange={(key) => {
                      setActiveTab(key as "subjects" | "students" | "sections");
                    }}
                    items={[
                      {
                        key: "subjects",
                        label: (
                          <span className={isDark ? "text-gray-300" : "text-gray-600"}>
                            Subjects
                          </span>
                        ),
                        children: (
                          <Table
                            className={isDark ? "table table-dark" : "table table-light"}
                            columns={subjectColumns}
                            dataSource={selectedClass.Subject}
                            rowKey="id"
                            pagination={false}
                            locale={{
                              emptyText: (
                                <div className="text-center py-8">
                                  <i className="ti ti-book text-4xl text-gray-400 mb-3"></i>
                                  <p className={`${isDark ? "text-gray-400" : "text-gray-600"}`}>No subjects found</p>
                                </div>
                              )
                            }}
                          />
                        ),
                      },
                      {
                        key: "students",
                        label: (
                          <span className={isDark ? "text-gray-300" : "text-gray-600"}>
                            Students
                          </span>
                        ),
                        children: isLoadingStudents ? (
                          <LoadingSkeleton type="card" />
                        ) : (
                          <Table
                            className={isDark ? "table table-dark" : "table table-light"}
                            columns={studentColumns}
                            dataSource={selectedClass.students || []}
                            rowKey="id"
                            pagination={false}
                            locale={{
                              emptyText: (
                                <div className="text-center py-8">
                                  <i className="ti ti-users text-4xl text-gray-400 mb-3"></i>
                                  <p className={`${isDark ? "text-gray-400" : "text-gray-600"}`}>No students found</p>
                                </div>
                              )
                            }}
                          />
                        ),
                      },
                      {
                        key: "sections",
                        label: (
                          <span className={isDark ? "text-gray-300" : "text-gray-600"}>
                            Sections
                          </span>
                        ),
                        children: (
                          <Table
                            className={isDark ? "table table-dark" : "table table-light"}
                            columns={sectionColumns}
                            dataSource={selectedClass.Section}
                            rowKey="id"
                            pagination={false}
                            locale={{
                              emptyText: (
                                <div className="text-center py-8">
                                  <i className="ti ti-layout-grid text-4xl text-gray-400 mb-3"></i>
                                  <p className={`${isDark ? "text-gray-400" : "text-gray-600"}`}>No sections found</p>
                                </div>
                              )
                            }}
                          />
                        ),
                      },
                    ]}
                    className="ant-tabs-custom"
                  />
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Edit Subject Modal */}
      <div className="modal fade" id="edit_subject">
        <div className="modal-dialog modal-dialog-centered">
          <div
            className={`modal-content ${isDark ? "bg-gray-800" : "bg-white"}`}
          >
            <div
              className={`modal-header border-b ${
                isDark ? "border-gray-700" : "border-gray-200"
              }`}
            >
              <h4
                className={`modal-title text-lg font-medium ${
                  isDark ? "text-gray-100" : "text-gray-800"
                }`}
              >
                Edit Subject
              </h4>
              <button
                type="button"
                className={`btn-close ${isDark ? "text-gray-300" : "text-gray-600"}`}
                data-bs-dismiss="modal"
              >
                <i className="ti ti-x" />
              </button>
            </div>
            <form>
              <div className="modal-body p-4">
                <div className="mb-4">
                  <label
                    className={`block text-sm font-medium mb-1 ${
                      isDark ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Name
                  </label>
                  <input
                    type="text"
                    className={`w-full p-2 border rounded-md focus:outline-none focus:ring-2 ${
                      isDark
                        ? "border-gray-600 bg-gray-700 text-gray-100 focus:ring-blue-300"
                        : "border-gray-300 bg-white text-gray-800 focus:ring-blue-500"
                    }`}
                    placeholder="Enter Name"
                    defaultValue="English"
                  />
                </div>
                <div className="mb-4">
                  <label
                    className={`block text-sm font-medium mb-1 ${
                      isDark ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Code
                  </label>
                  <input
                    type="text"
                    className={`w-full p-2 border rounded-md focus:outline-none focus:ring-2 ${
                      isDark
                        ? "border-gray-600 bg-gray-700 text-gray-100 focus:ring-blue-300"
                        : "border-gray-300 bg-white text-gray-800 focus:ring-blue-500"
                    }`}
                    placeholder="Enter Code"
                    defaultValue="ENG111"
                  />
                </div>
                <div className="mb-4">
                  <label
                    className={`block text-sm font-medium mb-1 ${
                      isDark ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Type
                  </label>
                  <input
                    type="text"
                    className={`w-full p-2 border rounded-md focus:outline-none focus:ring-2 ${
                      isDark
                        ? "border-gray-600 bg-gray-700 text-gray-100 focus:ring-blue-300"
                        : "border-gray-300 bg-white text-gray-800 focus:ring-blue-500"
                    }`}
                    placeholder="Enter Type"
                    defaultValue="Theory"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h5
                      className={`text-sm font-medium ${
                        isDark ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      Status
                    </h5>
                    <p
                      className={`text-xs ${
                        isDark ? "text-gray-400" : "text-gray-500"
                      }`}
                    >
                      Change the Status by toggle
                    </p>
                  </div>
                  <div className="form-check form-switch">
                    <input
                      className={`form-check-input w-10 h-5 ${
                        isDark
                          ? "bg-gray-600 checked:bg-blue-300"
                          : "bg-gray-300 checked:bg-blue-500"
                      }`}
                      type="checkbox"
                      role="switch"
                      defaultChecked
                    />
                  </div>
                </div>
              </div>
              <div
                className={`modal-footer border-t p-4 ${
                  isDark ? "border-gray-700" : "border-gray-200"
                }`}
              >
                <Link
                  to="#"
                  className={`px-4 py-2 rounded-md mr-2 ${
                    isDark
                      ? "bg-gray-600 text-gray-300"
                      : "bg-gray-200 text-gray-700"
                  }`}
                  data-bs-dismiss="modal"
                >
                  Cancel
                </Link>
                <Link
                  to="#"
                  className={`px-4 py-2 rounded-md ${
                    isDark ? "bg-blue-600 text-white" : "bg-blue-500 text-white"
                  }`}
                  data-bs-dismiss="modal"
                >
                  Save Changes
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Delete Modal */}
      <div className="modal fade" id="delete-modal">
        <div className="modal-dialog modal-dialog-centered">
          <div
            className={`modal-content ${isDark ? "bg-gray-800" : "bg-white"}`}
          >
            <form>
              <div className="modal-body text-center p-6">
                <span
                  className={`inline-block mb-4 ${
                    isDark ? "text-red-400" : "text-red-500"
                  }`}
                >
                  <i className="ti ti-trash-x text-2xl" />
                </span>
                <h4
                  className={`text-lg font-medium mb-2 ${
                    isDark ? "text-gray-100" : "text-gray-800"
                  }`}
                >
                  Confirm Deletion
                </h4>
                <p
                  className={`text-sm mb-4 ${
                    isDark ? "text-gray-300" : "text-gray-600"
                  }`}
                >
                  You want to delete all the marked items, this can't be undone
                  once you delete.
                </p>
                <div className="flex justify-center space-x-2">
                  <Link
                    to="#"
                    className={`px-4 py-2 rounded-md ${
                      isDark
                        ? "bg-gray-600 text-gray-300"
                        : "bg-gray-200 text-gray-700"
                    }`}
                    data-bs-dismiss="modal"
                  >
                    Cancel
                  </Link>
                  <Link
                    to="#"
                    className={`px-4 py-2 rounded-md ${
                      isDark ? "bg-red-600 text-white" : "bg-red-500 text-white"
                    }`}
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
    </div>
  );
};

export default MyClassesWithStudents;
