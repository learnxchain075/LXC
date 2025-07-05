import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import Datatable from "../../../../core/common/dataTable";
import { all_routes } from "../../../../router/all_routes";
import { getAllEmployees } from "../../../../services/admin/employeeService";
import { IEmployeeBase } from "../../../../services/types/admin/employeeService";

const GetEmployees = () => {
  const routes = all_routes;
  const [employees, setEmployees] = useState<IEmployeeBase[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEmployee, setSelectedEmployee] = useState<IEmployeeBase | null>(null);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const res = await getAllEmployees();
      const staff = res.data.staff || [];
      // Backend returns employee details with nested `user` object.
      // Flatten the data so the table can directly access name, email and phone.
      const employeesData = staff.map((emp: any) => ({
        id: emp.id,
        name: emp.user?.name,
        profilePic: emp.user?.profilePic || "",
        email: emp.user?.email,
        phone: emp.user?.phone,
        address: emp.user?.address,
        city: emp.user?.city,
        state: emp.user?.state,
        country: emp.user?.country,
        pincode: emp.user?.pincode,
        bloodType: emp.user?.bloodType,
        sex: emp.user?.sex,
        employeeType: emp.employeeType,
        company: emp.company,
      }));
      setEmployees(employeesData);
    } catch (err) {
      toast.error("Failed to load employees");
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      render: (_: any, record: IEmployeeBase) => (
        <div className="d-flex align-items-center">
          <img
            src={record.profilePic || "assets/img/profiles/avatar-01.jpg"}
            alt="img"
            className="rounded-circle me-2"
            width={32}
            height={32}
          />
          <Link to="#" onClick={() => setSelectedEmployee(record)} className="link-primary">
            {record.name}
          </Link>
        </div>
      ),
    },
    { title: "Email", dataIndex: "email" },
    { title: "Phone", dataIndex: "phone" },
    { title: "Employee Type", dataIndex: "employeeType" },
  ];

  return (
    <div className="page-wrapper">
      <ToastContainer position="top-center" autoClose={3000} />
      <div className="content">
        <div className="d-md-flex d-block align-items-center justify-content-between mb-3">
          <div className="my-auto mb-2">
            <h3 className="page-title mb-1">Employees</h3>
            <nav>
              <ol className="breadcrumb mb-0">
                <li className="breadcrumb-item">
                  <Link to={routes.superAdminDashboard}>Dashboard</Link>
                </li>
                <li className="breadcrumb-item active" aria-current="page">
                  All Employees
                </li>
              </ol>
            </nav>
          </div>
        </div>
        <div className="card">
          <div className="card-header pb-0">
            <h4 className="mb-0">Employees List</h4>
          </div>
          <div className="card-body">
            {loading ? (
              <div className="skeleton-loader" style={{ height: 300 }} />
            ) : (
              <Datatable columns={columns} dataSource={employees} Selection={false} />
            )}
          </div>
        </div>
      </div>
      {selectedEmployee && (
        <div className="modal fade show d-block" tabIndex={-1} style={{ background: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Employee Details</h5>
                <button type="button" className="btn-close" onClick={() => setSelectedEmployee(null)} />
              </div>
              <div className="modal-body">
                <div className="text-center mb-3">
                  <img
                    src={selectedEmployee.profilePic || "assets/img/profiles/avatar-01.jpg"}
                    alt="img"
                    className="rounded-circle"
                    width={80}
                    height={80}
                  />
                </div>
                <p><strong>Name:</strong> {selectedEmployee.name}</p>
                <p><strong>Email:</strong> {selectedEmployee.email}</p>
                <p><strong>Phone:</strong> {selectedEmployee.phone}</p>
                <p><strong>Address:</strong> {selectedEmployee.address}</p>
                <p><strong>Employee Type:</strong> {selectedEmployee.employeeType}</p>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-light" onClick={() => setSelectedEmployee(null)}>
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GetEmployees;
