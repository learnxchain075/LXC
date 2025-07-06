import React, { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";
import { Link } from "react-router-dom";
import CountUp from "react-countup";
import "bootstrap-daterangepicker/daterangepicker.css";
import ImageWithBasePath from "../../core/common/imageWithBasePath";
import { all_routes } from "../../router/all_routes";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import AdminDashboardModal from "../adminDashboard/adminDashboardModal";
import { useSelector } from "react-redux";
import GreetingComponent from "../../core/common/greetingComponent";
import { getSuperAdminDashboard } from "../../services/superadmin/dashboardAPI";
import { getTasks } from "../../services/projectService";


const SuperAdminDashboard = () => {
  const routes = all_routes;
  const user = useSelector((state: any) => state.auth.userObj);

  const [dashboardData, setDashboardData] = useState<any>(null);
  interface Task {
    id: string;
    title: string;
    status: string;
    priority: string;
  }
  const [tasks, setTasks] = useState<Task[]>([]);

  const fetchDashboardData = async () => {
    try {
      const response = await getSuperAdminDashboard();
      setDashboardData(response.data);
    } catch (error) {
      console.log("Error fetching dashboard data:", error);
    }
  };

  useEffect(() => {
    fetchDashboardData();
    getTasks().then((res) => setTasks(res.data || [])).catch(() => {});
  }, []);

  const totalSchools = dashboardData?.schoolStatistics?.totalSchools || 0;
  const activeSchools = dashboardData?.schoolStatistics?.activeSchools || 0;
  const inactiveSchools = totalSchools - activeSchools;

  const totalUsers = dashboardData?.userStatistics?.totalUsers || 0;
  const activeUsers = dashboardData?.userStatistics?.activeUsers || 0;
  const inactiveUsers = totalUsers - activeUsers;

  const totalRevenue = dashboardData?.financialMetrics?.totalRevenue || 0;
  const outstandingPayments = dashboardData?.financialMetrics?.outstandingPayments || 0;

  const systemHealth = dashboardData?.systemHealth || {};
  const supportAndFeedback = dashboardData?.supportAndFeedback || {};

  const totalPlans = dashboardData?.planStatistics?.totalPlans || 0;
  const activePlans = dashboardData?.planStatistics?.activePlans || 0;
  const inactivePlans = dashboardData?.planStatistics?.inactivePlans ||
    (totalPlans - activePlans);

  const totalEmployees = dashboardData?.employeeStatistics?.totalEmployees || 0;
  const activeEmployees = dashboardData?.employeeStatistics?.activeEmployees || 0;
  const inactiveEmployees = dashboardData?.employeeStatistics?.inactiveEmployees ||
    (totalEmployees - activeEmployees);

  const [totalEarningArea] = useState<any>({
    chart: {
      height: 90,
      type: "area",
      toolbar: { show: false },
      sparkline: { enabled: true },
    },
    colors: ["#3D5EE1"],
    dataLabels: { enabled: false },
    stroke: { curve: "straight" },
    series: [
      {
        name: "Earnings",
        data: dashboardData?.financialMetrics?.monthlyRevenue?.map((r: any) => r.amount) || [0, 0, 0, 0, 0, 0, 0],
      },
    ],
  });

  const [totalExpenseArea] = useState<any>({
    chart: {
      height: 90,
      type: "area",
      toolbar: { show: false },
      sparkline: { enabled: true },
    },
    colors: ["#E82646"],
    dataLabels: { enabled: false },
    stroke: { curve: "straight" },
    series: [
      {
        name: "Expense",
        data: [40, 30, 60, 55, 50, 55, 40], // Assuming static until provided
      },
    ],
  });

  return (
    <>
      <div className="page-wrapper">
        <div className="content">
          {/* Top Header Section remains unchanged */}
          {/* Alert Message */}
          <div className="alert-message">
            <div className="alert alert-success rounded-pill d-flex align-items-center justify-content-between border-success mb-4">
              <div className="d-flex align-items-center">
                <span className="me-1 avatar avatar-sm flex-shrink-0">
                  <ImageWithBasePath
                    src="assets/img/profiles/avatar-27.jpg"
                    alt="Img"
                    className="img-fluid rounded-circle"
                  />
                </span>
                <p>
                  Version 1 LXC is here{" "}
                  <strong className="mx-1">V1</strong>
                </p>
              </div>
              <button
                type="button"
                className="btn-close p-0"
                data-bs-dismiss="alert"
                aria-label="Close"
              >
                <span>
                  <i className="ti ti-x" />
                </span>
              </button>
            </div>
          </div>

          <div className="row">
            <div className="col-md-12">
              <div className="card bg-dark">
                <div className="overlay-img">
                  <ImageWithBasePath src="assets/img/bg/shape-04.png" alt="img" className="img-fluid shape-01" />
                  <ImageWithBasePath src="assets/img/bg/shape-01.png" alt="img" className="img-fluid shape-02" />
                  <ImageWithBasePath src="assets/img/bg/shape-02.png" alt="img" className="img-fluid shape-03" />
                  <ImageWithBasePath src="assets/img/bg/shape-03.png" alt="img" className="img-fluid shape-04" />
                </div>
                <GreetingComponent userName={user.name} />
              </div>
            </div>
          </div>

          <div className="row">
            {/* Total Schools */}
            <div className="col-xxl-3 col-sm-6 d-flex">
              <div className="card flex-fill animate-card border-0">
                <div className="card-body">
                  <div className="d-flex align-items-center">
                    <div className="avatar avatar-xl bg-danger-transparent me-2 p-1">
                      <ImageWithBasePath src="assets/img/icons/student.svg" alt="img" />
                    </div>
                    <div className="overflow-hidden flex-fill">
                      <div className="d-flex align-items-center justify-content-between">
                        <h2 className="counter">
                          <CountUp end={totalSchools} />
                        </h2>
                        <span className="badge bg-danger">1.2%</span>
                      </div>
                      <p>Total Schools</p>
                    </div>
                  </div>
                  <div className="d-flex align-items-center justify-content-between border-top mt-3 pt-3">
                    <p className="mb-0">
                      Active : <span className="text-dark fw-semibold">{activeSchools}</span>
                    </p>
                    <span className="text-light">|</span>
                    <p>
                      Inactive : <span className="text-dark fw-semibold">{inactiveSchools}</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Total Users */}
            <div className="col-xxl-3 col-sm-6 d-flex">
              <div className="card flex-fill animate-card border-0">
                <div className="card-body">
                  <div className="d-flex align-items-center">
                    <div className="avatar avatar-xl me-2 bg-secondary-transparent p-1">
                      <ImageWithBasePath src="assets/img/icons/teacher.svg" alt="img" />
                    </div>
                    <div className="overflow-hidden flex-fill">
                      <div className="d-flex align-items-center justify-content-between">
                        <h2 className="counter">
                          <CountUp end={totalUsers} />
                        </h2>
                        <span className="badge bg-pending">1.2%</span>
                      </div>
                      <p>Total Users</p>
                    </div>
                  </div>
                  <div className="d-flex align-items-center justify-content-between border-top mt-3 pt-3">
                    <p className="mb-0">
                      Active : <span className="text-dark fw-semibold">{activeUsers}</span>
                    </p>
                    <span className="text-light">|</span>
                    <p>
                      Inactive : <span className="text-dark fw-semibold">{inactiveUsers}</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Total Plans */}
            <div className="col-xxl-3 col-sm-6 d-flex">
              <div className="card flex-fill animate-card border-0">
                <div className="card-body">
                  <div className="d-flex align-items-center">
                    <div className="avatar avatar-xl me-2 bg-warning-transparent p-1">
                      <ImageWithBasePath src="assets/img/icons/staff.svg" alt="img" />
                    </div>
                    <div className="overflow-hidden flex-fill">
                      <div className="d-flex align-items-center justify-content-between">
                        <h2 className="counter">
                          <CountUp end={totalPlans} />
                        </h2>
                        <span className="badge bg-warning">1.2%</span>
                      </div>
                      <p>Total Plans</p>
                    </div>
                  </div>
                  <div className="d-flex align-items-center justify-content-between border-top mt-3 pt-3">
                    <p className="mb-0">
                      Active : <span className="text-dark fw-semibold">{activePlans}</span>
                    </p>
                    <span className="text-light">|</span>
                    <p>
                      Inactive : <span className="text-dark fw-semibold">{inactivePlans}</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Total Employees */}
            <div className="col-xxl-3 col-sm-6 d-flex">
              <div className="card flex-fill animate-card border-0">
                <div className="card-body">
                  <div className="d-flex align-items-center">
                    <div className="avatar avatar-xl me-2 bg-success-transparent p-1">
                      <ImageWithBasePath src="assets/img/icons/subject.svg" alt="img" />
                    </div>
                    <div className="overflow-hidden flex-fill">
                      <div className="d-flex align-items-center justify-content-between">
                        <h2 className="counter">
                          <CountUp end={totalEmployees} />
                        </h2>
                        <span className="badge bg-success">1.2%</span>
                      </div>
                      <p>Total Employees</p>
                    </div>
                  </div>
                  <div className="d-flex align-items-center justify-content-between border-top mt-3 pt-3">
                    <p className="mb-0">
                      Active : <span className="text-dark fw-semibold">{activeEmployees}</span>
                    </p>
                    <span className="text-light">|</span>
                    <p>
                      Inactive : <span className="text-dark fw-semibold">{inactiveEmployees}</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
            {/* Total Earnings */}
            <div className="col-xxl-3 col-sm-6 d-flex">
              <div className="card flex-fill animate-card border-0">
                <div className="card-body">
                  <div className="d-flex align-items-center">
                    <div className="avatar avatar-xl me-2 bg-warning-transparent p-1">
                      <ImageWithBasePath
                        src="assets/img/icons/staff.svg"
                        alt="img"
                      />
                    </div>
                    <div className="overflow-hidden flex-fill">
                      <div className="d-flex align-items-center justify-content-between">
                        <h2 className="counter">
                          <CountUp end={totalRevenue} />
                        </h2>
                        <span className="badge bg-warning">1.2%</span>
                      </div>
                      <p>Total Earnings</p>
                    </div>
                  </div>
                  <div className="d-flex align-items-center justify-content-between border-top mt-3 pt-3">
                    <p className="mb-0">Outstanding :</p>
                    <p>
                      <span className="text-dark fw-semibold">
                        ₹{outstandingPayments}
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* System Health */}
            <div className="col-xxl-3 col-sm-6 d-flex">
              <div className="card flex-fill animate-card border-0">
                <div className="card-body">
                  <div className="d-flex align-items-center">
                    <div className="avatar avatar-xl me-2 bg-success-transparent p-1">
                      <ImageWithBasePath
                        src="assets/img/icons/subject.svg"
                        alt="img"
                      />
                    </div>
                    <div className="overflow-hidden flex-fill">
                      <div className="d-flex align-items-center justify-content-between">
                        <h2 className="counter">
                          <CountUp
                            end={Number(systemHealth?.errorRate?.toFixed(2)) || 0}
                          />
                        </h2>
                        <span className="badge bg-success">%</span>
                      </div>
                      <p>Error Rate</p>
                    </div>
                  </div>
                  <div className="d-flex align-items-center justify-content-between border-top mt-3 pt-3">
                    <p className="mb-0">Avg. Response:</p>
                    <p>
                      <span className="text-dark fw-semibold">
                        {systemHealth?.avgResponseTime?.toFixed(2) || 0} ms
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
            {/* Support & Feedback */}
            <div className="col-xxl-6 col-md-12 d-flex">
              <div className="card flex-fill animate-card border-0">
                <div className="card-body">
                  <h5 className="mb-3">Support & Feedback</h5>
                  <div className="d-flex justify-content-between mb-2">
                    <p>Open Tickets:</p>
                    <span className="fw-bold text-warning">
                      {supportAndFeedback?.openTickets || 0}
                    </span>
                  </div>
                  <div className="d-flex justify-content-between mb-2">
                    <p>Avg Resolution Time:</p>
                    <span className="fw-bold text-muted">
                      {supportAndFeedback?.avgResolutionTime || 0} hrs
                    </span>
                  </div>
                  <div className="d-flex justify-content-between">
                    <p>Total Feedbacks:</p>
                    <span className="fw-bold text-info">
                      {supportAndFeedback?.totalFeedbacks || 0}
                    </span>
                  </div>
                </div>
              </div>
            </div>


          </div>



          {/* Earnings + Expenses */}
          <div className="row">
            <div className="">
              <div className="card flex-fill">
                <div className="card-body">
                  <div className="d-flex align-items-center justify-content-between">
                    <div>
                      <h6 className="mb-1">Total Earnings</h6>
                      <h2>₹{totalRevenue}</h2>
                    </div>
                    <span className="avatar avatar-lg bg-primary">
                      <i className="ti ti-user-dollar" />
                    </span>
                  </div>
                </div>
                <ReactApexChart
                  id="total-earning"
                  options={totalEarningArea}
                  series={totalEarningArea.series}
                  type="area"
                  height={90}
                />
              </div>

              <div className="card flex-fill">
                <div className="card-body">
                  <div className="d-flex align-items-center justify-content-between">
                    <div>
                      <h6 className="mb-1">Outstanding Payments</h6>
                      <h2>₹{outstandingPayments}</h2>
                    </div>
                    <span className="avatar avatar-lg bg-danger">
                      <i className="ti ti-user-dollar" />
                    </span>
                  </div>
                </div>
                <ReactApexChart
                  id="total-expenses"
                  options={totalExpenseArea}
                  series={totalExpenseArea.series}
                  type="area"
                  height={90}
                />
              </div>
            </div>
          </div>
          <div className="row mt-4">
            <div className="col-md-12">
              <div className="card">
                <div className="card-header">
                  <h5 className="card-title mb-0">Recent Tasks</h5>
                </div>
                <div className="card-body">
                  {tasks.length === 0 ? (
                    <p className="mb-0">No tasks available.</p>
                  ) : (
                    <ul className="mb-0">
                      {tasks.slice(0, 5).map((t) => (
                        <li key={t.id}>
                          {t.title} - {t.status}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <AdminDashboardModal />
    </>
  );
};

export default SuperAdminDashboard;
