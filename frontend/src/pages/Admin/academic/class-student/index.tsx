import React, { useEffect, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { Table } from "antd";
import { getAllStudentsInAclass } from "../../../../services/teacher/classServices";
import { all_routes } from "../../../../router/all_routes";
import useMobileDetection from "../../../../core/common/mobileDetection";


interface Student {
  id: string;
  user: {
    name: string;
  };
  rollNo: string;
  admissionNo: string;
  status: string;
}

interface ClassStudentProps {
  classId?: string;
  teacherdata?:any;
}

const ClassStudent: React.FC<ClassStudentProps> = ({ teacherdata,classId }) => {
  const routes = all_routes;
const ismobile=useMobileDetection();
   const location=useLocation();
  const [studentList, setStudentList] = useState<Student[]>([]);
  const [filteredStudentList, setFilteredStudentList] = useState<Student[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [loading,setloading]=useState<boolean>(false);
if(!classId){
  // setloading(true);
  classId = location.state?.id;
  // console.log("id",classId);
}
// console.log("id1",classId);
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setloading(true);
        const response = await getAllStudentsInAclass(classId ?? "");
        const students = (response.data.students as Student[]) || [];
        setStudentList(students);
        setFilteredStudentList(students);
        setloading(false);
      } catch (error) {
        console.error("Error fetching students:", error);
        setloading(false);
      }
    };
    if (classId) fetchStudents();
  }, [classId]);


  useEffect(() => {
    const filtered = studentList.filter((student) =>
      student.user.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredStudentList(filtered);
  }, [searchTerm, studentList]);

  
  const columns = [
    {
      title: "Student Name",
      dataIndex: "user",
      render: (user: Student["user"]) => user.name,
      sorter: (a: Student, b: Student) => a.user.name.localeCompare(b.user.name),
    },
    {
      title: "Roll Number",
      dataIndex: "rollNo",
      sorter: (a: Student, b: Student) => a.rollNo.localeCompare(b.rollNo),
    },
    {
      title: "Admission Number",
      dataIndex: "admissionNo",
      sorter: (a: Student, b: Student) => a.admissionNo.localeCompare(b.admissionNo),
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (text: string) => (
        <span
          className={`badge badge-soft-${
            text === "ACTIVE" ? "success" : "danger"
          } d-inline-flex align-items-center`}
        >
          <i className="ti ti-circle-filled fs-5 me-1"></i>
          {text}
        </span>
      ),
      sorter: (a: Student, b: Student) => a.status.localeCompare(b.status),
    },
  ];

  return (
    <div className={ismobile ?"page-wrapper":"pt-4"}>
      <div className="content">
        {/* Page Header */}
        <div className="d-md-flex d-block align-items-center justify-content-between mb-3">
          <div className="my-auto mb-2">
            <h3 className="page-title mb-1">Class Students</h3>
            <nav>
              <ol className="breadcrumb mb-0">
                <li className="breadcrumb-item">
                  <Link to={routes.teacherDashboard}>Dashboard</Link>
                </li>
                {/* <li className="breadcrumb-item">
                  <Link to={routes.gettheirstudent}>Classes</Link>
                </li> */}
                <li className="breadcrumb-item active" aria-current="page">
                  Students
                </li>
              </ol>
            </nav>
          </div>
        </div>

       
        <div className="card">
          <div className="card-header">
            <h4>Class Student List</h4>
          </div>
          <div className="card-body p-3">
          
            <div className="mb-3">
              <input
                type="text"
                className="form-control"
                placeholder="Search by student name"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <Table
              columns={columns}
              dataSource={filteredStudentList.map((student) => ({
                ...student,
                key: student.id,
              }))}
              pagination={{ pageSize: 10 }}
              loading={loading}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClassStudent;