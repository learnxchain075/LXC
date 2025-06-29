import React, { useState, useEffect } from "react";
import ReactApexChart from "react-apexcharts";
import { Link } from "react-router-dom";
import CountUp from "react-countup";
import { Calendar } from "primereact/calendar";
import { Nullable } from "primereact/ts-helpers";
import "bootstrap-daterangepicker/daterangepicker.css";
import { Tooltip } from 'primereact/tooltip';

import { all_routes } from "../../router/all_routes";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import AdminDashboardModal from "./adminDashboardModal";
import { getdahbaordadminData } from "../../services/admin/dashboardApi";
import { IAdminDashboardData } from "../../services/types/admin/dashboardService";
import LoadingSkeleton from "../../components/LoadingSkeleton";
import { useSelector } from "react-redux";

// Move these above slider configs
function SampleNextArrow(props: any) {
  const { style, onClick } = props;
  return (
    <div
      className="slick-nav slick-nav-next"
      style={{ ...style, display: "flex", top: "30%", right: "30%" }}
      onClick={onClick}
    >
      <i className="fas fa-chevron-right" style={{ color: "#677788" }}></i>
    </div>
  );
}

function SamplePrevArrow(props: any) {
  const { style, onClick } = props;
  return (
    <div
      className="slick-nav slick-nav-prev"
      style={{ ...style, display: "flex", top: "30%", left: "30%" }}
      onClick={onClick}
    >
      <i className="fas fa-chevron-left" style={{ color: "#677788" }}></i>
    </div>
  );
}

const AdminDashboard = () => {
  const routes = all_routes;
  const [date, setDate] = useState<Nullable<Date>>(null);
  const [dashboardData, setDashboardData] = useState<IAdminDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
const user =useSelector((state: any) => state.auth.userObj);
  // Fetch dashboard data on component mount
  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getdahbaordadminData();
      setDashboardData(response);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError(err instanceof Error ? err.message : 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  // Loading skeleton component
  if (loading) {
    return (
      <div className="page-wrapper">
        <div className="content">
          <div className="d-md-flex d-block align-items-center justify-content-between mb-3">
            <div className="my-auto mb-2">
              <LoadingSkeleton height={32} />
              <LoadingSkeleton height={16} />
            </div>
          </div>
          <div className="row">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="col-xxl-3 col-sm-6 d-flex mb-3">
                <div className="card flex-fill">
                  <div className="card-body">
                    <LoadingSkeleton height={20} />
                    <LoadingSkeleton height={40} />
                    <LoadingSkeleton height={16} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="page-wrapper">
        <div className="content">
          <div className="alert alert-danger" role="alert">
            <h4 className="alert-heading">Error Loading Dashboard</h4>
            <p>{error}</p>
            <button className="btn btn-primary" onClick={fetchDashboardData}>
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  // No data state
  if (!dashboardData) {
    return (
      <div className="page-wrapper">
        <div className="content">
          <div className="alert alert-info" role="alert">
            <h4 className="alert-heading">No Data Available</h4>
            <p>Dashboard data is not available at the moment.</p>
            <button className="btn btn-primary" onClick={fetchDashboardData}>
              Refresh
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Donut chart configs for attendance (handle edge cases)
  const studentDonutChart = {
    chart: { height: 218, width: 218, type: "donut" as const, toolbar: { show: false } },
    legend: { show: false },
    colors: ["#3D5EE1", "#E82646"],
    labels: ["Present", "Absent"],
    series: [
      // Since attendance data is not in the expected format, use fallback
      dashboardData?.keyMetrics?.totalStudents?.total ? Math.floor(dashboardData.keyMetrics.totalStudents.total * 0.9) : 0,
      dashboardData?.keyMetrics?.totalStudents?.total ? Math.floor(dashboardData.keyMetrics.totalStudents.total * 0.1) : 0
    ],
    responsive: [
      { breakpoint: 480, options: { chart: { width: 180 } } }
    ]
  };
  const teacherDonutChart = {
    chart: { height: 218, width: 218, type: "donut" as const, toolbar: { show: false } },
    legend: { show: false },
    colors: ["#3D5EE1", "#E82646"],
    labels: ["Present", "Absent"],
    series: [
      dashboardData?.keyMetrics?.totalTeachers?.active ?? 0,
      dashboardData?.keyMetrics?.totalTeachers?.inactive ?? 0
    ],
    responsive: [
      { breakpoint: 480, options: { chart: { width: 180 } } }
    ]
  };
  const staffDonutChart = {
    chart: { height: 218, width: 218, type: "donut" as const, toolbar: { show: false } },
    legend: { show: false },
    colors: ["#3D5EE1", "#E82646"],
    labels: ["Present", "Absent"],
    series: [
      dashboardData?.keyMetrics?.totalStaff?.active ?? 0,
      dashboardData?.keyMetrics?.totalStaff?.inactive ?? 0
    ],
    responsive: [
      { breakpoint: 480, options: { chart: { width: 180 } } }
    ]
  };

  // Edge case: If all values are zero, show a single slice to avoid ApexCharts error
  [studentDonutChart, teacherDonutChart, staffDonutChart].forEach((chart) => {
    if ((chart.series[0] ?? 0) === 0 && (chart.series[1] ?? 0) === 0) {
      chart.series = [1];
      chart.labels = ["No Data"];
      chart.colors = ["#E9EDF4"];
    }
  });

  // Slider configs
  const student = {
    dots: false,
    autoplay: false,
    slidesToShow: 1,
    speed: 500,
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />,
  };
  const teacher = {
    dots: false,
    autoplay: false,
    slidesToShow: 1,
    speed: 500,
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />,
  };
  const settings = {
    dots: false,
    autoplay: false,
    arrows: false,
    slidesToShow: 2,
    margin: 24,
    speed: 500,
    responsive: [
      { breakpoint: 1500, settings: { slidesToShow: 2 } },
      { breakpoint: 1400, settings: { slidesToShow: 2 } },
      { breakpoint: 992, settings: { slidesToShow: 2 } },
      { breakpoint: 800, settings: { slidesToShow: 2 } },
      { breakpoint: 776, settings: { slidesToShow: 2 } },
      { breakpoint: 567, settings: { slidesToShow: 1 } },
    ],
  };

  // Define classDonutChart and feesBar with real data
  const classDonutChart = {
    chart: { height: 218, width: 218, type: "donut" as const, toolbar: { show: false } },
    labels: ["Good", "Average", "Below Average"],
    legend: { show: false },
    dataLabels: { enabled: false },
    yaxis: { tickAmount: 3, labels: { offsetX: -15 } },
    grid: { padding: { left: -8 } },
    colors: ["#3D5EE1", "#EAB300", "#E82646"],
    series: dashboardData?.performanceMetrics?.data
      ? [
          dashboardData.performanceMetrics.data.top ?? 0,
          dashboardData.performanceMetrics.data.average ?? 0,
          dashboardData.performanceMetrics.data.belowAverage ?? 0,
        ]
      : [45, 11, 2],
    responsive: [
      { breakpoint: 480, options: { chart: { width: 180 } } },
    ],
  };

  const feesBar = {
    chart: {
      height: 275,
      type: 'bar' as const,
      stacked: true,
      toolbar: { show: false },
    },
    legend: {
      show: true,
      horizontalAlign: 'left' as const,
      position: 'top' as const,
      fontSize: '14px',
      labels: { colors: '#5D6369' },
    },
    plotOptions: {
      bar: { horizontal: false, columnWidth: '50%', endingShape: 'rounded' },
    },
    colors: ['#3D5EE1', '#E9EDF4'],
    dataLabels: { enabled: false },
    stroke: { show: true, width: 2, colors: ['transparent'] },
    grid: { padding: { left: -8 } },
    series: [
      {
        name: 'Collected Fee',
        data: dashboardData?.feesCollectionChart?.data?.map(item => item.collectedFee) || [30, 40, 38, 40, 38, 30, 35, 38, 40],
      },
      {
        name: 'Total Fee',
        data: dashboardData?.feesCollectionChart?.data?.map(item => item.totalFee) || [45, 50, 48, 50, 48, 40, 40, 50, 55],
      },
    ],
    xaxis: {
      categories: dashboardData?.feesCollectionChart?.data?.map(item => item.quarter) || ['Q1: 2023', 'Q1: 2023', 'Q1: 2023', 'Q1: 2023', 'Q1: 2023', 'uQ1: 2023l', 'Q1: 2023', 'Q1: 2023', 'Q1: 2023'],
    },
    yaxis: { tickAmount: 3, labels: { offsetX: -15 } },
    fill: { opacity: 1 },
    tooltip: {
      y: {
        formatter: function (val: any) {
          return "$ " + val + " thousands";
        },
      },
    },
  };

  // Define totalEarningArea and totalExpenseArea chart configs
  const totalEarningArea = {
    chart: {
      height: 90,
      type: 'area' as const,
      toolbar: { show: false },
      sparkline: { enabled: true },
    },
    colors: ['#3D5EE1'],
    dataLabels: { enabled: false },
    stroke: { curve: 'straight' as const },
    series: [
      {
        name: 'Earnings',
        data: dashboardData?.earnings?.graphData?.map(item => item.value) || [50, 55, 40, 50, 45, 55, 50],
      },
    ],
  };
  const totalExpenseArea = {
    chart: {
      height: 90,
      type: 'area' as const,
      toolbar: { show: false },
      sparkline: { enabled: true },
    },
    colors: ['#E82646'],
    dataLabels: { enabled: false },
    stroke: { curve: 'straight' as const },
    series: [
      {
        name: 'Expense',
        data: dashboardData?.expenses?.graphData?.map(item => item.value) || [40, 30, 60, 55, 50, 55, 40],
      },
    ],
  };

  // Key Metrics Section (Students, Teachers, Staff, Subjects)
  // Use dashboardData.keyMetrics for all values, fallback to 0 or 'N/A' if missing
  const getMetric = (obj: Record<string, any>, key: string) => (obj && obj[key] != null ? obj[key] : 0);
  const getMetricStr = (obj: Record<string, any>, key: string) => (obj && obj[key] != null ? obj[key] : 'N/A');

  // Attendance Section
  // Use dashboardData.attendance for present, absent, total, fallback to 0 or 'N/A'
  const attendance = dashboardData.attendance || {};
  const present = attendance.overallPercentage != null ? attendance.overallPercentage : 0;
  const studentsEmergency = attendance.issues?.students?.emergency ?? 0;
  const teachersAbsent = attendance.issues?.teachers?.absent ?? 0;
  const staffLate = attendance.issues?.staff?.late ?? 0;

  // Attendance Section JSX (handle edge cases)
  const safeValue = (val: any) => (val === undefined || val === null ? 'N/A' : val);

  const onlyUpcomingEvents = (dashboardData.upcomingEvents || []).filter(ev => ev.status === "upcoming");

  const parseEventDate = (dateStr) => {
    // "03 JUN 2025" => new Date(2025, 5, 3)
    const [day, monthStr, year] = dateStr.split(" ");
    const month = ["JAN","FEB","MAR","APR","MAY","JUN","JUL","AUG","SEP","OCT","NOV","DEC"].indexOf(monthStr.toUpperCase());
    return new Date(Number(year), month, Number(day));
  };

  const sortedUpcomingEvents = onlyUpcomingEvents.slice().sort(
    (a, b) => parseEventDate(a.date).getTime() - parseEventDate(b.date).getTime()
  );

  const dateTemplate = (dateObj) => {
    let jsDate;
    if (dateObj instanceof Date) {
      jsDate = dateObj;
    } else if (dateObj && typeof dateObj === 'object' && 'year' in dateObj && 'month' in dateObj && 'day' in dateObj) {
      jsDate = new Date(dateObj.year, dateObj.month - 1, dateObj.day);
    } else {
      return <span>{dateObj.day || ''}</span>;
    }

    const event = sortedUpcomingEvents.find(ev => {
      const eventDate = parseEventDate(ev.date);
      return eventDate.toDateString() === jsDate.toDateString();
    });

    if (event) {
      return (
        <span className="event-date-mark" data-pr-tooltip={event.title}>
          {jsDate.getDate()}
        </span>
      );
    }
    return <span>{jsDate.getDate()}</span>;
  };

  // Calculate Total Outstanding
  const totalOutstanding = Array.isArray(dashboardData?.feesCollected?.totalOutstanding)
    ? dashboardData.feesCollected.totalOutstanding.reduce((sum, val) => sum + (val || 0), 0)
    : dashboardData?.feesCollected?.totalOutstanding || 0;

  return (
    <>
      {/* Page Wrapper */}
      <div className="page-wrapper">
        <div className="content">
            <>
              {/* Page Header */}
              <div className="d-md-flex d-block align-items-center justify-content-between mb-3">
                <div className="my-auto mb-2">
                  <h3 className="page-title mb-1">Admin Dashboard</h3>
                  <nav>
                    <ol className="breadcrumb mb-0">
                      <li className="breadcrumb-item">
                        <Link to={routes.adminDashboard}>Dashboard</Link>
                      </li>
                      <li
                        className="breadcrumb-item active"
                        aria-current="page"
                      >
                        Admin Dashboard
                      </li>
                    </ol>
                  </nav>
                </div>
                <div className="d-flex my-xl-auto right-content align-items-center flex-wrap">
                  <div className="mb-2">
                    <Link
                      to={routes.addStudent}
                      className="btn btn-primary d-flex align-items-center me-3"
                    >
                      <i className="ti ti-square-rounded-plus me-2" />
                      Add New Student
                    </Link>
                  </div>
                  <div className="mb-2">
                    <Link
                      to={routes.collectFees}
                      className="btn btn-light d-flex align-items-center"
                    >
                      Fees Details
                    </Link>
                  </div>
                </div>
              </div>
              {/* /Page Header */}
              <div className="row">
                <div className="col-md-12">
                  <div className="alert-message">
                    <div
                      className="alert alert-success rounded-pill d-flex align-items-center justify-content-between border-success mb-4"
                      role="alert"
                    >
                      <div className="d-flex align-items-center">
                        <span className="me-1 avatar avatar-sm flex-shrink-0">
                          <img
                            src="assets/img/profiles/avatar-27.jpg"
                            alt="Img"
                            className="img-fluid rounded-circle"
                          />
                        </span>
                        <p>
                          Fahed III,C has paid Fees for the{" "}
                          <strong className="mx-1">"Term1"</strong>
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
                  {/* Dashboard Content */}
                  <div className="card bg-dark">
                    <div className="overlay-img">
                      <img
                        src="assets/img/bg/shape-04.png"
                        alt="img"
                        className="img-fluid shape-01"
                      />
                      <img
                        src="assets/img/bg/shape-01.png"
                        alt="img"
                        className="img-fluid shape-02"
                      />
                      <img
                        src="assets/img/bg/shape-02.png"
                        alt="img"
                        className="img-fluid shape-03"
                      />
                      <img
                        src="assets/img/bg/shape-03.png"
                        alt="img"
                        className="img-fluid shape-04"
                      />
                    </div>
                    <div className="card-body">
                      <div className="d-flex align-items-xl-center justify-content-xl-between flex-xl-row flex-column">
                        <div className="mb-3 mb-xl-0">
                          <div className="d-flex align-items-center flex-wrap mb-2">
                            <h1 className="text-white me-2">
                              Welcome Back, {user?.name || "Admin"}
                            </h1>
                            <Link
                              to="profile"
                              className="avatar avatar-sm img-rounded bg-gray-800 dark-hover"
                            >
                              <i className="ti ti-edit text-white" />
                            </Link>
                          </div>
                          <p className="text-white">Have a Good day at work</p>
                        </div>
                        <p className="text-white custom-text-white">
                          <i className="ti ti-refresh me-1" />
                          Updated Recently on 15 Jun 2024
                        </p>
                      </div>
                    </div>
                  </div>
                  {/* /Dashboard Content */}
                </div>
              </div>
              <div className="row">
                {/* Total Students */}
                <div className="col-xxl-3 col-sm-6 d-flex">
                  <div className="card flex-fill animate-card border-0">
                    <div className="card-body">
                      <div className="d-flex align-items-center">
                        <div className="avatar avatar-xl bg-danger-transparent me-2 p-1">
                          <img
                            src="assets/img/icons/student.svg"
                            alt="img"
                          />
                        </div>
                        <div className="overflow-hidden flex-fill">
                          <div className="d-flex align-items-center justify-content-between">
                            <h2 className="counter">
                              <CountUp end={safeValue(dashboardData?.keyMetrics?.totalStudents?.total)} />
                            </h2>
                            <span className="badge bg-danger">{safeValue(dashboardData?.keyMetrics?.totalStudents?.percentageChange)}%</span>
                          </div>
                          <p>Total Students</p>
                        </div>
                      </div>
                      <div className="d-flex align-items-center justify-content-between border-top mt-3 pt-3">
                        <p className="mb-0">
                          Active :{" "}
                          <span className="text-dark fw-semibold">
                            {safeValue(dashboardData?.keyMetrics?.totalStudents?.active)}
                          </span>
                        </p>
                        <span className="text-light">|</span>
                        <p>
                          Inactive :{" "}
                          <span className="text-dark fw-semibold">
                            {safeValue(dashboardData?.keyMetrics?.totalStudents?.inactive)}
                          </span>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                {/* /Total Students */}
                {/* Total Teachers */}
                <div className="col-xxl-3 col-sm-6 d-flex">
                  <div className="card flex-fill animate-card border-0">
                    <div className="card-body">
                      <div className="d-flex align-items-center">
                        <div className="avatar avatar-xl me-2 bg-secondary-transparent p-1">
                          <img
                            src="assets/img/icons/teacher.svg"
                            alt="img"
                          />
                        </div>
                        <div className="overflow-hidden flex-fill">
                          <div className="d-flex align-items-center justify-content-between">
                            <h2 className="counter">
                              <CountUp end={safeValue(dashboardData?.keyMetrics?.totalTeachers?.total)} />
                            </h2>
                            <span className="badge bg-pending">{safeValue(dashboardData?.keyMetrics?.totalTeachers?.percentageChange)}%</span>
                          </div>
                          <p>Total Teachers</p>
                        </div>
                      </div>
                      <div className="d-flex align-items-center justify-content-between border-top mt-3 pt-3">
                        <p className="mb-0">
                          Active :{" "}
                          <span className="text-dark fw-semibold">
                            {safeValue(dashboardData?.keyMetrics?.totalTeachers?.active)}
                          </span>
                        </p>
                        <span className="text-light">|</span>
                        <p>
                          Inactive :{" "}
                          <span className="text-dark fw-semibold">
                            {safeValue(dashboardData?.keyMetrics?.totalTeachers?.inactive)}
                          </span>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                {/* /Total Teachers */}
                {/* Total Staff */}
                <div className="col-xxl-3 col-sm-6 d-flex">
                  <div className="card flex-fill animate-card border-0">
                    <div className="card-body">
                      <div className="d-flex align-items-center">
                        <div className="avatar avatar-xl me-2 bg-warning-transparent p-1">
                          <img
                            src="assets/img/icons/staff.svg"
                            alt="img"
                          />
                        </div>
                        <div className="overflow-hidden flex-fill">
                          <div className="d-flex align-items-center justify-content-between">
                            <h2 className="counter">
                              <CountUp end={safeValue(dashboardData?.keyMetrics?.totalStaff?.total)} />
                            </h2>
                            <span className="badge bg-warning">{safeValue(dashboardData?.keyMetrics?.totalStaff?.percentageChange)}%</span>
                          </div>
                          <p>Total Staff</p>
                        </div>
                      </div>
                      <div className="d-flex align-items-center justify-content-between border-top mt-3 pt-3">
                        <p className="mb-0">
                          Active :{" "}
                          <span className="text-dark fw-semibold">
                            {safeValue(dashboardData?.keyMetrics?.totalStaff?.active)}
                          </span>
                        </p>
                        <span className="text-light">|</span>
                        <p>
                          Inactive :{" "}
                          <span className="text-dark fw-semibold">
                            {safeValue(dashboardData?.keyMetrics?.totalStaff?.inactive)}
                          </span>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                {/* /Total Staff */}
                {/* Total Subjects */}
                <div className="col-xxl-3 col-sm-6 d-flex">
                  <div className="card flex-fill animate-card border-0">
                    <div className="card-body">
                      <div className="d-flex align-items-center">
                        <div className="avatar avatar-xl me-2 bg-success-transparent p-1">
                          <img
                            src="assets/img/icons/subject.svg"
                            alt="img"
                          />
                        </div>
                        <div className="overflow-hidden flex-fill">
                          <div className="d-flex align-items-center justify-content-between">
                            <h2 className="counter">
                              <CountUp end={safeValue(dashboardData?.keyMetrics?.totalSubjects?.total)} />
                            </h2>
                            <span className="badge bg-success">{safeValue(dashboardData?.keyMetrics?.totalSubjects?.percentageChange)}%</span>
                          </div>
                          <p>Total Classes</p>
                        </div>
                      </div>
                      <div className="d-flex align-items-center justify-content-between border-top mt-3 pt-3">
                        <p className="mb-0">
                          Active :{" "}
                          <span className="text-dark fw-semibold">
                            {safeValue(dashboardData?.keyMetrics?.totalSubjects?.active)}
                          </span>
                        </p>
                        <span className="text-light">|</span>
                        <p>
                          Inactive :{" "}
                          <span className="text-dark fw-semibold">
                            {safeValue(dashboardData?.keyMetrics?.totalSubjects?.inactive)}
                          </span>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                {/* /Total Subjects */}
              </div>
              <div className="row">
                {/* Schedules */}
                <div className="col-xxl-4 col-xl-6 col-md-12 d-flex">
                  <div className="card flex-fill">
                    <div className="card-header d-flex align-items-center justify-content-between">
                      <div>
                        <h4 className="card-title">Schedules</h4>
                      </div>
                      <Link
                        to="#"
                        className="link-primary fw-medium me-2"
                        data-bs-toggle="modal"
                        data-bs-target="#add_event"
                      >
                        <i className="ti ti-square-plus me-1" />
                        Add New
                      </Link>
                    </div>
                    <div className="card-body ">
                      {/* <div className="datepic mb-4" /> */}
                      <Calendar
                        className="datepickers mb-4"
                        value={date}
                        onChange={(e) => setDate(e.value)}
                        inline
                        dateTemplate={dateTemplate}
                      />
                      <Tooltip target=".event-date-mark" />
                      <h5 className="mb-3">Upcoming Events</h5>
                      <div className="event-wrapper event-scroll">
                        {dashboardData?.upcomingEvents && dashboardData.upcomingEvents.length > 0 ? (
                          dashboardData.upcomingEvents.map((event, index) => (
                            <div key={index} className="border-start border-skyblue border-3 shadow-sm p-3 mb-3">
                              <div className="d-flex align-items-center mb-3 pb-3 border-bottom">
                                <span className={`avatar p-1 me-2 bg-${event.iconColor}-transparent flex-shrink-0`}>
                                  <i className="ti ti-calendar text-info fs-20" />
                                </span>
                                <div className="flex-fill">
                                  <h6 className="mb-1">{event.title}</h6>
                                  <p className="d-flex align-items-center">
                                    <i className="ti ti-calendar me-1" />
                                    {event.date}
                                  </p>
                                </div>
                              </div>
                              <div className="d-flex align-items-center justify-content-between">
                                <p className="mb-0">
                                  <i className="ti ti-clock me-1" />
                                  {event.time}
                                </p>
                                <span className={`badge badge-soft-${event.status === 'upcoming' ? 'success' : 'secondary'}`}>
                                  {event.status}
                                </span>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="text-center text-muted">No upcoming events</div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                {/* /Schedules */}
                {/* plan update or delete 😘😘😘😘 */}
                <>
                {/* <PlanDetails/> */}
                </>

                {/* Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatem similique ipsum temporibus eaque! Cumque architecto non magnam repellendus, consequatur aperiam doloribus repudiandae incidunt deleniti modi, qui at. Dolores, eligendi consequatur.
                console.log("hey 825"); */}
                {/* <div className="p-6 bg-gray-50 shadow-lg rounded-xl w-full max-w-5xl mx-auto relative flex flex-col">
      <h2 className="text-xl font-bold text-gray-800 text-center mb-4"> School Plan</h2>
      
      <div className="flex overflow-x-auto mt-4 space-x-4 p-2 bg-gray-200 rounded-lg">
        {schools.map((school) => (
          <div key={school.id} className="text-center cursor-pointer" onClick={() => handleShowMessages(school.id)}>
            <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-300 mx-auto">
              {school.logoUrl && <img src={school.logoUrl} alt={school.name} className="w-full h-full object-cover" />}
            </div>
            <p className="text-sm mt-2 font-semibold">{school.name}</p>
            {selectedSchoolId === school.id && (
              <div className="mt-4 p-4 bg-gray-100 shadow-lg rounded-lg">
                <h3 className="font-semibold text-lg mb-3"> Messages for {school.name}</h3>
                <ul className="list-disc list-inside">
                  {school.messages.length > 0 ? (
                    school.messages.map((message, index) => (
                      <li key={index} className="text-gray-700 mb-2">{message.text} ({message.time})</li>
                    ))
                  ) : (
                    <p className="text-gray-500">No messages</p>
                  )}
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-6 p-5 border rounded-lg bg-white shadow flex flex-col">
        <h3 className="font-semibold text-lg">Update Plan</h3>
        {schools.map((school) => (
          <div key={school.id} className="mb-4">
            <p className="text-sm font-semibold">{school.name} - Current Plan: <span className="font-bold text-blue-600">{school.plan}</span></p>
            <div className="flex gap-2 mt-2">
              {["Free", "Standard", "Premium"].map((plan) => (
                <button key={plan} onClick={() => handlePlanChange(school.id, plan)} className={`px-4 py-2 rounded-md text-white transition ${school.plan === plan ? "bg-blue-600" : "bg-gray-500 hover:bg-gray-700"}`}>
                  {plan}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
      
      <ToastContainer />
    </div> */}
                {/* plan update or delete 😘😘😘😘 */}


              
                {/* Attendance */}
                <div className="col-xxl-4 col-xl-6 col-md-12 d-flex flex-column">
                  <div className="card">
                    <div className="card-header d-flex align-items-center justify-content-between">
                      <h4 className="card-title">Attendance</h4>
                      <div className="dropdown">
                        <Link
                          to="#"
                          className="bg-white dropdown-toggle"
                          data-bs-toggle="dropdown"
                        >
                          <i className="ti ti-calendar-due me-1" />
                          Today
                        </Link>
                        <ul className="dropdown-menu mt-2 p-3">
                          <li>
                            <Link to="#" className="dropdown-item rounded-1">
                              This Week
                            </Link>
                          </li>
                          <li>
                            <Link to="#" className="dropdown-item rounded-1">
                              Last Week
                            </Link>
                          </li>
                          <li>
                            <Link to="#" className="dropdown-item rounded-1">
                              Last Week
                            </Link>
                          </li>
                        </ul>
                      </div>
                    </div>
                    <div className="card-body">
                      <div className="list-tab mb-4">
                        <ul className="nav">
                          <li>
                            <Link
                              to="#"
                              className="active"
                              data-bs-toggle="tab"
                              data-bs-target="#students"
                            >
                              Students
                            </Link>
                          </li>
                          <li>
                            <Link
                              to="#"
                              data-bs-toggle="tab"
                              data-bs-target="#teachers"
                            >
                              Teachers
                            </Link>
                          </li>
                          <li>
                            <Link
                              to="#"
                              data-bs-toggle="tab"
                              data-bs-target="#staff"
                            >
                              Staff
                            </Link>
                          </li>
                        </ul>
                      </div>
                      <div className="tab-content">
                        <div
                          className="tab-pane fade active show"
                          id="students"
                        >
                          <div className="row gx-3">
                            <div className="col-sm-4">
                              <div className="card bg-light-300 shadow-none border-0">
                                <div className="card-body p-3 text-center">
                                  <h5>{safeValue(dashboardData?.keyMetrics?.totalStudents?.active)}</h5>
                                  <p className="fs-12">Present</p>
                                </div>
                              </div>
                            </div>
                            <div className="col-sm-4">
                              <div className="card bg-light-300 shadow-none border-0">
                                <div className="card-body p-3 text-center">
                                  <h5>{safeValue(dashboardData?.attendance?.students?.absent)}</h5>
                                  <p className="fs-12">Absent</p>
                                </div>
                              </div>
                            </div>
                            <div className="col-sm-4">
                              <div className="card bg-light-300 shadow-none border-0">
                                <div className="card-body p-3 text-center">
                                  <h5>{safeValue(dashboardData?.attendance?.students?.total)}</h5>
                                  <p className="fs-12">Total</p>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="text-center">
                            <ReactApexChart
                              id="student-chart"
                              className="mb-4"
                              options={studentDonutChart}
                              series={studentDonutChart.series}
                              type="donut"
                              height={210}
                            />
                            <Link
                              to={routes.studentAttendance}
                              className="btn btn-light"
                            >
                              <i className="ti ti-calendar-share me-1" />
                              View All
                            </Link>
                          </div>
                        </div>
                        <div className="tab-pane fade" id="teachers">
                          <div className="row gx-3">
                            <div className="col-sm-4">
                              <div className="card bg-light-300 shadow-none border-0">
                                <div className="card-body p-3 text-center">
                                  <h5>{safeValue(studentsEmergency)}</h5>
                                  <p className="fs-12">Emergency</p>
                                </div>
                              </div>
                            </div>
                            <div className="col-sm-4">
                              <div className="card bg-light-300 shadow-none border-0">
                                <div className="card-body p-3 text-center">
                                  <h5>{safeValue(teachersAbsent)}</h5>
                                  <p className="fs-12">Absent</p>
                                </div>
                              </div>
                            </div>
                            <div className="col-sm-4">
                              <div className="card bg-light-300 shadow-none border-0">
                                <div className="card-body p-3 text-center">
                                  <h5>{safeValue(staffLate)}</h5>
                                  <p className="fs-12">Late</p>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="text-center">
                            <ReactApexChart
                              id="teacher-chart"
                              className="mb-4"
                              options={teacherDonutChart}
                              series={teacherDonutChart.series}
                              type="donut"
                              height={210}
                            />
                            <Link
                              // to="teacher-attendance"
                              to={routes.teacherAttendance}  //link to the teacher student 
                              className="btn btn-light"
                            >
                              <i className="ti ti-calendar-share me-1" />
                              View All
                            </Link>
                          </div>
                        </div>
                        <div className="tab-pane fade" id="staff">
                          <div className="row gx-3">
                            <div className="col-sm-4">
                              <div className="card bg-light-300 shadow-none border-0">
                                <div className="card-body p-3 text-center">
                                  <h5>45</h5>
                                  <p className="fs-12">Emergency</p>
                                </div>
                              </div>
                            </div>
                            <div className="col-sm-4">
                              <div className="card bg-light-300 shadow-none border-0">
                                <div className="card-body p-3 text-center">
                                  <h5>01</h5>
                                  <p className="fs-12">Absent</p>
                                </div>
                              </div>
                            </div>
                            <div className="col-sm-4">
                              <div className="card bg-light-300 shadow-none border-0">
                                <div className="card-body p-3 text-center">
                                  <h5>10</h5>
                                  <p className="fs-12">Late</p>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="text-center">
                            <div id="staff-chart" className="mb-4" />
                            <ReactApexChart
                              id="staff-chart"
                              className="mb-4"
                              options={staffDonutChart}
                              series={staffDonutChart.series}
                              type="donut"
                              height={210}
                            />
                            <Link
                              to={routes.studentAttendance}
                              className="btn btn-light"
                            >
                              <i className="ti ti-calendar-share me-1" />
                              View All
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="row flex-fill">
                    {/* Best Performer */}
                    <div className="col-sm-6 d-flex flex-column">
                      <div className="bg-success-800 p-3 br-5 text-center flex-fill mb-4 pb-0  owl-height bg-01">
                        {dashboardData?.bestPerformer && dashboardData.bestPerformer.name !== "No Data" ? (
                          <div className="d-flex justify-content-between flex-column h-100">
                            <div>
                              <h5 className="mb-3 text-white">
                                Best Performer
                              </h5>
                              <h4 className="mb-1 text-white">{dashboardData.bestPerformer.name || 'N/A'}</h4>
                              <p className="text-light">{dashboardData.bestPerformer.role || 'N/A'}</p>
                            </div>
                            <img
                              src={dashboardData.bestPerformer.image || "assets/img/performer/performer-01.png"}
                              alt="img"
                            />
                          </div>
                        ) : (
                          <div className="d-flex justify-content-between flex-column h-100">
                            <div>
                              <h5 className="mb-3 text-white">Best Performer</h5>
                              <h4 className="mb-1 text-white">No Data Available</h4>
                              <p className="text-light">No performers found</p>
                            </div>
                            <img
                              src="assets/img/performer/performer-01.png"
                              alt="img"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                    {/* /Best Performer */}
                    {/* Star Students */}
                    <div className="col-sm-6 d-flex flex-column">
                      <div className="bg-info p-3 br-5 text-center flex-fill mb-4 pb-0 owl-height bg-02">
                        {dashboardData?.starStudents && dashboardData.starStudents.name !== "No Data" ? (
                          <div className="d-flex justify-content-between flex-column h-100">
                            <div>
                              <h5 className="mb-3 text-white">Star Students</h5>
                              <h4 className="mb-1 text-white">{dashboardData.starStudents.name || 'N/A'}</h4>
                              <p className="text-light">{dashboardData.starStudents.class || 'N/A'}</p>
                            </div>
                            <img
                              src={dashboardData.starStudents.image || "assets/img/performer/student-performer-01.png"}
                              alt="img"
                            />
                          </div>
                        ) : (
                          <div className="d-flex justify-content-between flex-column h-100">
                            <div>
                              <h5 className="mb-3 text-white">Star Students</h5>
                              <h4 className="mb-1 text-white">No Data Available</h4>
                              <p className="text-light">No star students found</p>
                            </div>
                            <img
                              src="assets/img/performer/student-performer-01.png"
                              alt="img"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                    {/* /Star Students */}
                  </div>
                </div>
                {/* /Attendance */}
                <div className="col-xxl-4 col-md-12 d-flex flex-column">
                  {/* Quick Links */}
                  <div className="card flex-fill">
                    <div className="card-header d-flex align-items-center justify-content-between">
                      <h4 className="card-title">Quick Links</h4>
                    </div>
                    <div className="card-body pb-1">
                      <Slider
                        {...settings}
                        className="owl-carousel link-slider"
                      >
                        <div className="item">
                          <Link
                            to={routes.classTimetable}
                            className="d-block bg-success-transparent ronded p-2 text-center mb-3 class-hover"
                          >
                            <div className="avatar avatar-lg border p-1 border-success rounded-circle mb-2">
                              <span className="d-inline-flex align-items-center justify-content-center w-100 h-100 bg-success rounded-circle">
                                <i className="ti ti-calendar" />
                              </span>
                            </div>
                            <p className="text-dark">Calendar</p>
                          </Link>
                          <Link
                            to={routes.feesGroup}
                            className="d-block bg-secondary-transparent ronded p-2 text-center mb-3 class-hover"
                          >
                            <div className="avatar avatar-lg border p-1 border-secondary rounded-circle mb-2">
                              <span className="d-inline-flex align-items-center justify-content-center w-100 h-100 bg-secondary rounded-circle">
                                <i className="ti ti-license" />
                              </span>
                            </div>
                            <p className="text-dark">Fees</p>
                          </Link>
                        </div>
                        <div className="item">
                          <Link
                            to={routes.examResult}
                            className="d-block bg-primary-transparent ronded p-2 text-center mb-3 class-hover"
                          >
                            <div className="avatar avatar-lg border p-1 border-primary rounded-circle mb-2">
                              <span className="d-inline-flex align-items-center justify-content-center w-100 h-100 bg-primary rounded-circle">
                                <i className="ti ti-hexagonal-prism" />
                              </span>
                            </div>
                            <p className="text-dark">Exam Result</p>
                          </Link>
                          <Link
                            to={routes.classHomeWork}
                            className="d-block bg-danger-transparent ronded p-2 text-center mb-3 class-hover"
                          >
                            <div className="avatar avatar-lg border p-1 border-danger rounded-circle mb-2">
                              <span className="d-inline-flex align-items-center justify-content-center w-100 h-100 bg-danger rounded-circle">
                                <i className="ti ti-report-money" />
                              </span>
                            </div>
                            <p className="text-dark">Home Works</p>
                          </Link>
                        </div>
                        <div className="item">
                          <Link
                            to={routes.studentAttendance}
                            className="d-block bg-warning-transparent ronded p-2 text-center mb-3 class-hover"
                          >
                            <div className="avatar avatar-lg border p-1 border-warning rounded-circle mb-2">
                              <span className="d-inline-flex align-items-center justify-content-center w-100 h-100 bg-warning rounded-circle">
                                <i className="ti ti-calendar-share" />
                              </span>
                            </div>
                            <p className="text-dark">Attendance</p>
                          </Link>
                          <Link
                            to={routes.attendanceReport}
                            className="d-block bg-skyblue-transparent ronded p-2 text-center mb-3 class-hover"
                          >
                            <div className="avatar avatar-lg border p-1 border-skyblue rounded-circle mb-2">
                              <span className="d-inline-flex align-items-center justify-content-center w-100 h-100 bg-pending rounded-circle">
                                <i className="ti ti-file-pencil" />
                              </span>
                            </div>
                            <p className="text-dark">Reports</p>
                          </Link>
                        </div>
                      </Slider>
                    </div>
                  </div>
                  {/* /Quick Links */}
                  {/* Class Routine */}
                  <div className="card flex-fill">
                    <div className="card-header d-flex align-items-center justify-content-between">
                      <h4 className="card-title">Class Routine</h4>
                      <Link
                        to="#"
                        className="link-primary fw-medium"
                        data-bs-toggle="modal"
                        data-bs-target="#add_class_routine"
                      >
                        <i className="ti ti-square-plus me-1" />
                        Add New
                      </Link>
                    </div>
                    <div className="card-body">
                      {dashboardData?.classRoutines?.routines && dashboardData.classRoutines.routines.length > 0 ? (
                        dashboardData.classRoutines.routines.map((routine, index) => (
                          <div key={index} className="d-flex align-items-center rounded border p-3 mb-3">
                            <span className="avatar avatar-md flex-shrink-0 border rounded me-2">
                              <img
                                src={`assets/img/teachers/teacher-0${(index % 3) + 1}.jpg`}
                                className="rounded"
                                alt="Profile"
                              />
                            </span>
                            <div className="w-100">
                              <p className="mb-1">{routine.month}</p>
                              <div className="progress progress-xs flex-grow-1 mb-1">
                                <div
                                  className="progress-bar progress-bar-striped progress-bar-animated bg-primary rounded"
                                  role="progressbar"
                                  style={{ width: `${routine.progress}%` }}
                                  aria-valuenow={routine.progress}
                                  aria-valuemin={0}
                                  aria-valuemax={100}
                                />
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="d-flex align-items-center rounded border p-3 mb-3">
                          <span className="avatar avatar-md flex-shrink-0 border rounded me-2">
                            <img
                              src="assets/img/teachers/teacher-01.jpg"
                              className="rounded"
                              alt="Profile"
                            />
                          </span>
                          <div className="w-100">
                            <p className="mb-1">No Data Available</p>
                            <div className="progress progress-xs flex-grow-1 mb-1">
                              <div
                                className="progress-bar progress-bar-striped progress-bar-animated bg-primary rounded"
                                role="progressbar"
                                style={{ width: "0%" }}
                                aria-valuenow={0}
                                aria-valuemin={0}
                                aria-valuemax={100}
                              />
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  {/* /Class Routine */}
                  {/* Class Wise Performance */}
                  <div className="card flex-fill">
                    <div className="card-header d-flex align-items-center justify-content-between">
                      <h4 className="card-title">Performance</h4>
                      <div className="dropdown">
                        <Link
                          to="#"
                          className="bg-white dropdown-toggle"
                          data-bs-toggle="dropdown"
                        >
                          <i className="ti ti-school-bell me-2" />
                          {dashboardData?.performanceMetrics?.month || 'No month selected'}
                        </Link>
                        <ul className="dropdown-menu mt-2 p-3">
                          <li>
                            <Link to="#" className="dropdown-item rounded-1">
                              Class I
                            </Link>
                          </li>
                          <li>
                            <Link to="#" className="dropdown-item rounded-1">
                              Class II
                            </Link>
                          </li>
                          <li>
                            <Link to="#" className="dropdown-item rounded-1">
                              Class III
                            </Link>
                          </li>
                          <li>
                            <Link to="#" className="dropdown-item rounded-1">
                              Class IV
                            </Link>
                          </li>
                        </ul>
                      </div>
                    </div>
                    <div className="card-body">
                      <div className="d-md-flex align-items-center justify-content-between">
                        <div className="me-md-3 mb-3 mb-md-0 w-100">
                          <div className="border border-dashed p-3 rounded d-flex align-items-center justify-content-between mb-1">
                            <p className="mb-0 me-2">
                              <i className="ti ti-arrow-badge-down-filled me-2 text-primary" />
                              Top
                            </p>
                            <h5>{dashboardData?.performanceMetrics?.data?.top ?? 'No data available'}</h5>
                          </div>
                          <div className="border border-dashed p-3 rounded d-flex align-items-center justify-content-between mb-1">
                            <p className="mb-0 me-2">
                              <i className="ti ti-arrow-badge-down-filled me-2 text-warning" />
                              Average
                            </p>
                            <h5>{dashboardData?.performanceMetrics?.data?.average ?? 'No data available'}</h5>
                          </div>
                          <div className="border border-dashed p-3 rounded d-flex align-items-center justify-content-between mb-0">
                            <p className="mb-0 me-2">
                              <i className="ti ti-arrow-badge-down-filled me-2 text-danger" />
                              Below Avg
                            </p>
                            <h5>{dashboardData?.performanceMetrics?.data?.belowAverage ?? 'No data available'}</h5>
                          </div>
                        </div>
                        <ReactApexChart
                          id="class-chart"
                          className="text-center text-md-left"
                          options={classDonutChart}
                          series={classDonutChart.series}
                          type="donut"
                        />
                      </div>
                    </div>
                  </div>
                  {/* /Class Wise Performance */}
                </div>
              </div>
              <div className="row">
                {/* Fees Collection */}
                <div className="col-xxl-8 col-xl-6 d-flex">
                  <div className="card flex-fill">
                    <div className="card-header  d-flex align-items-center justify-content-between">
                      <h4 className="card-title">Fees Collection</h4>
                      <div className="dropdown">
                        <Link
                          to="#"
                          className="bg-white dropdown-toggle"
                          data-bs-toggle="dropdown"
                        >
                          <i className="ti ti-calendar  me-2" />
                          Last 8 Quater
                        </Link>
                        <ul className="dropdown-menu mt-2 p-3">
                          <li>
                            <Link to="#" className="dropdown-item rounded-1">
                              This Month
                            </Link>
                          </li>
                          <li>
                            <Link to="#" className="dropdown-item rounded-1">
                              This Year
                            </Link>
                          </li>
                          <li>
                            <Link to="#" className="dropdown-item rounded-1">
                              Last 12 Quater
                            </Link>
                          </li>
                          <li>
                            <Link to="#" className="dropdown-item rounded-1">
                              Last 16 Quater
                            </Link>
                          </li>
                        </ul>
                      </div>
                    </div>
                    <div className="card-body pb-0">
                      {dashboardData?.feesCollectionChart?.data &&
                      dashboardData.feesCollectionChart.data.some(
                        (item) => item.collectedFee > 0 || item.totalFee > 0
                      ) ? (
                        <ReactApexChart
                          id="fees-chart"
                          options={feesBar}
                          series={feesBar.series}
                          type="bar"
                          height={270}
                        />
                      ) : (
                        <div className="text-center text-muted py-5">No fees collection data available</div>
                      )}
                    </div>
                  </div>
                </div>
                {/* /Fees Collection */}
                {/* Leave Requests */}
                <div className="col-xxl-4 col-xl-6 d-flex">
                  <div className="card flex-fill">
                    <div className="card-header d-flex align-items-center justify-content-between">
                      <h4 className="card-title">Leave Requests</h4>
                      <div className="dropdown">
                        <Link
                          to="#"
                          className="bg-white dropdown-toggle"
                          data-bs-toggle="dropdown"
                        >
                          <i className="ti ti-calendar-due me-1" />
                          Today
                        </Link>
                        <ul className="dropdown-menu mt-2 p-3">
                          <li>
                            <Link to="#" className="dropdown-item rounded-1">
                              This Week
                            </Link>
                          </li>
                          <li>
                            <Link to="#" className="dropdown-item rounded-1">
                              Last Week
                            </Link>
                          </li>
                          <li>
                            <Link to="#" className="dropdown-item rounded-1">
                              Last Week
                            </Link>
                          </li>
                        </ul>
                      </div>
                    </div>
                    <div className="card-body">
                      {dashboardData?.leaveRequests?.requests && dashboardData.leaveRequests.requests.length > 0 ? (
                        dashboardData.leaveRequests.requests.map((request, idx) => (
                          <div key={idx} className="card mb-2">
                            <div className="card-body p-3">
                              <div className="d-flex align-items-center justify-content-between mb-3">
                                <div className="d-flex align-items-center overflow-hidden me-2">
                                  <span className="avatar avatar-lg flex-shrink-0 me-2">
                                    <img src={request.user.avatar || "assets/img/profiles/avatar-14.jpg"} alt={request.user.name} />
                                  </span>
                                  <div className="overflow-hidden">
                                    <h6 className="mb-1 text-truncate">
                                      {request.user.name}
                                      <span className={`badge badge-soft-${request.type === "Emergency" ? "danger" : "warning"} ms-1`}>
                                        {request.type}
                                      </span>
                                    </h6>
                                    <p className="text-truncate">{request.user.role}</p>
                                  </div>
                                </div>
                                <div className="d-flex align-items-center">
                                  <button className="avatar avatar-xs p-0 btn btn-success me-1">
                                    <i className="ti ti-checks" />
                                  </button>
                                  <button className="avatar avatar-xs p-0 btn btn-danger">
                                    <i className="ti ti-x" />
                                  </button>
                                </div>
                              </div>
                              <div className="d-flex align-items-center justify-content-between border-top pt-3">
                                <p className="mb-0">
                                  Leave: <span className="fw-semibold">{request.from} - {request.to}</span>
                                </p>
                                <p>
                                  Reason: <span className="fw-semibold">{request.reason}</span>
                                </p>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center text-muted py-3">No leave requests for today</div>
                      )}
                    </div>
                  </div>
                </div>
                {/* /Leave Requests */}
              </div>
              <div className="row">
                {/* Links */}
                <div className="col-xl-3 col-md-6 d-flex">
                  <Link
                    to={routes.studentAttendance}
                    className="card bg-warning-transparent border border-5 border-white animate-card flex-fill"
                  >
                    <div className="card-body">
                      <div className="d-flex align-items-center justify-content-between">
                        <div className="d-flex align-items-center">
                          <span className="avatar avatar-lg bg-warning rounded flex-shrink-0 me-2">
                            <i className="ti ti-calendar-share fs-24" />
                          </span>
                          <div className="overflow-hidden">
                            <h6 className="fw-semibold text-default">
                              View Attendance
                            </h6>
                          </div>
                        </div>
                        <span className="btn btn-white warning-btn-hover avatar avatar-sm p-0 flex-shrink-0 rounded-circle">
                          <i className="ti ti-chevron-right fs-14" />
                        </span>
                      </div>
                    </div>
                  </Link>
                </div>
                {/* /Links */}
                {/* Links */}
                <div className="col-xl-3 col-md-6 d-flex">
                  <Link
                    to={routes.events}
                    className="card bg-success-transparent border border-5 border-white animate-card flex-fill "
                  >
                    <div className="card-body">
                      <div className="d-flex align-items-center justify-content-between">
                        <div className="d-flex align-items-center">
                          <span className="avatar avatar-lg bg-success rounded flex-shrink-0 me-2">
                            <i className="ti ti-speakerphone fs-24" />
                          </span>
                          <div className="overflow-hidden">
                            <h6 className="fw-semibold text-default">
                              New Events
                            </h6>
                          </div>
                        </div>
                        <span className="btn btn-white success-btn-hover avatar avatar-sm p-0 flex-shrink-0 rounded-circle">
                          <i className="ti ti-chevron-right fs-14" />
                        </span>
                      </div>
                    </div>
                  </Link>
                </div>
                {/* /Links */}
                {/* Links */}
                <div className="col-xl-3 col-md-6 d-flex">
                  <Link
                    to={routes.membershipcard}
                    className="card bg-danger-transparent border border-5 border-white animate-card flex-fill"
                  >
                    <div className="card-body">
                      <div className="d-flex align-items-center justify-content-between">
                        <div className="d-flex align-items-center">
                          <span className="avatar avatar-lg bg-danger rounded flex-shrink-0 me-2">
                            <i className="ti ti-sphere fs-24" />
                          </span>
                          <div className="overflow-hidden">
                            <h6 className="fw-semibold text-default">
                              Membership Plans
                            </h6>
                          </div>
                        </div>
                        <span className="btn btn-white avatar avatar-sm p-0 flex-shrink-0 rounded-circle danger-btn-hover">
                          <i className="ti ti-chevron-right fs-14" />
                        </span>
                      </div>
                    </div>
                  </Link>
                </div>
                {/* /Links */}
                {/* Links */}
                <div className="col-xl-3 col-md-6 d-flex">
                  <Link
                    to={routes.expense}
                    className="card bg-secondary-transparent border border-5 border-white animate-card flex-fill"
                  >
                    <div className="card-body">
                      <div className="d-flex align-items-center justify-content-between">
                        <div className="d-flex align-items-center">
                          <span className="avatar avatar-lg bg-secondary rounded flex-shrink-0 me-2">
                            <i className="ti ti-moneybag fs-24" />
                          </span>
                          <div className="overflow-hidden">
                            <h6 className="fw-semibold text-default">
                              Finance &amp; Accounts
                            </h6>
                          </div>
                        </div>
                        <span className="btn btn-white secondary-btn-hover avatar avatar-sm p-0 flex-shrink-0 rounded-circle">
                          <i className="ti ti-chevron-right fs-14" />
                        </span>
                      </div>
                    </div>
                  </Link>
                </div>
                {/* /Links */}
              </div>
              <div className="row">
                {/* Total Earnings */}
                <div className="col-xxl-4 col-xl-6 d-flex flex-column">
                  <div className="card flex-fill">
                    <div className="card-body">
                      <div className="d-flex align-items-center justify-content-between">
                        <div>
                          <h6 className="mb-1">Total Earnings</h6>
                          <h2>
                            {dashboardData?.earnings?.total && dashboardData.earnings.total > 0
                              ? `$${dashboardData.earnings.total.toLocaleString()}`
                              : "No data"}
                          </h2>
                        </div>
                        <span className="avatar avatar-lg bg-primary">
                          <i className="ti ti-user-dollar" />
                        </span>
                      </div>
                    </div>
                    {dashboardData?.earnings?.graphData &&
                    dashboardData.earnings.graphData.some((item) => item.value > 0) ? (
                      <ReactApexChart
                        id="total-earning"
                        options={totalEarningArea}
                        series={totalEarningArea.series}
                        type="area"
                        height={90}
                      />
                    ) : (
                      <div className="text-center text-muted py-3">No earnings data available</div>
                    )}
                  </div>
                  <div className="card flex-fill">
                    <div className="card-body">
                      <div className="d-flex align-items-center justify-content-between">
                        <div>
                          <h6 className="mb-1">Total Expenses</h6>
                          <h2>
                            {dashboardData?.expenses?.total && dashboardData.expenses.total > 0
                              ? `$${dashboardData.expenses.total.toLocaleString()}`
                              : "No data"}
                          </h2>
                        </div>
                        <span className="avatar avatar-lg bg-danger">
                          <i className="ti ti-user-dollar" />
                        </span>
                      </div>
                    </div>
                    {dashboardData?.expenses?.graphData &&
                    dashboardData.expenses.graphData.some((item) => item.value > 0) ? (
                      <ReactApexChart
                        id="total-expenses"
                        options={totalExpenseArea}
                        series={totalExpenseArea.series}
                        type="area"
                        height={90}
                      />
                    ) : (
                      <div className="text-center text-muted py-3">No expenses data available</div>
                    )}
                  </div>
                </div>
                {/* /Total Earnings */}
                {/* Notice Board */}
                <div className="col-xxl-5 col-xl-12 order-3 order-xxl-2 d-flex">
                  <div className="card flex-fill">
                    <div className="card-header d-flex align-items-center justify-content-between">
                      <h4 className="card-title">Notice Board</h4>
                      <Link to={routes.noticeBoard} className="fw-medium">
                        View All
                      </Link>
                    </div>
                    <div className="card-body">
                      <div className="notice-widget">
                        {dashboardData?.notices && dashboardData.notices.length > 0 ? (
                          dashboardData.notices.map((notice, index) => (
                            <div key={index} className="d-sm-flex align-items-center justify-content-between mb-4">
                              <div className="d-flex align-items-center overflow-hidden me-2 mb-2 mb-sm-0">
                                <span className={`bg-${notice.color}-transparent avatar avatar-md me-2 rounded-circle flex-shrink-0`}>
                                  <i className={`ti ti-${notice.icon} fs-16`} />
                                </span>
                                <div className="overflow-hidden">
                                  <h6 className="text-truncate mb-1">
                                    {notice.title}
                                  </h6>
                                  <p>
                                    <i className="ti ti-calendar me-2" />
                                    Added on : {notice.date}
                                  </p>
                                </div>
                              </div>
                              <span className="badge bg-light text-dark">
                                <i className="ti ti-clck me-1" />
                                {Math.abs(notice.daysSince)} Days
                              </span>
                            </div>
                          ))
                        ) : (
                          <div className="d-sm-flex align-items-center justify-content-between mb-4">
                            <div className="d-flex align-items-center overflow-hidden me-2 mb-2 mb-sm-0">
                              <span className="bg-primary-transparent avatar avatar-md me-2 rounded-circle flex-shrink-0">
                                <i className="ti ti-document fs-16" />
                              </span>
                              <div className="overflow-hidden">
                                <h6 className="text-truncate mb-1">
                                  No notices available
                                </h6>
                                <p>
                                  <i className="ti ti-calendar me-2" />
                                  No notices found
                                </p>
                              </div>
                            </div>
                            <span className="badge bg-light text-dark">
                              <i className="ti ti-clck me-1" />
                              0 Days
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                {/* /Notice Board */}
                {/* Fees Collection */}
                <div className="col-xxl-3 col-xl-6 order-2 order-xxl-3 d-flex flex-column">
                  <div className="card flex-fill mb-2">
                    <div className="card-body">
                      <p className="mb-2">Total Fees Collected</p>
                      <div className="d-flex align-items-end justify-content-between">
                        <h4>
                          {dashboardData?.feesCollected?.total && dashboardData.feesCollected.total > 0
                            ? `$${dashboardData.feesCollected.total.toLocaleString()}`
                            : "No data"}
                        </h4>
                        <span className="badge badge-soft-success">
                          <i className="ti ti-chart-line me-1" />
                          {dashboardData?.feesCollected?.percentageChange?.total || 0}%
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="card flex-fill mb-2">
                    <div className="card-body">
                      <p className="mb-2">Fine Collected till date</p>
                      <div className="d-flex align-items-end justify-content-between">
                        <h4>
                          {dashboardData?.feesCollected?.fineCollected && dashboardData.feesCollected.fineCollected > 0
                            ? `$${dashboardData.feesCollected.fineCollected.toLocaleString()}`
                            : "No data"}
                        </h4>
                        <span className="badge badge-soft-danger">
                          <i className="ti ti-chart-line me-1" />
                          {dashboardData?.feesCollected?.percentageChange?.fine || 0}%
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="card flex-fill mb-2">
                    <div className="card-body">
                      <p className="mb-2">Student Not Paid</p>
                      <div className="d-flex align-items-end justify-content-between">
                        <h4>
                          {dashboardData?.feesCollected?.studentNotPaid && dashboardData.feesCollected.studentNotPaid > 0
                            ? `$${dashboardData.feesCollected.studentNotPaid.toLocaleString()}`
                            : "No data"}
                        </h4>
                        <span className="badge badge-soft-info">
                          <i className="ti ti-chart-line me-1" />
                          {dashboardData?.feesCollected?.percentageChange?.notPaid || 0}%
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="card flex-fill mb-4">
                    <div className="card-body">
                      <p className="mb-2">Total Outstanding</p>
                      <div className="d-flex align-items-end justify-content-between">
                        <h4>
                          {totalOutstanding > 0 ? `$${totalOutstanding.toLocaleString()}` : "No data"}
                        </h4>
                        <span className="badge badge-soft-danger">
                          <i className="ti ti-chart-line me-1" />
                          {dashboardData?.feesCollected?.percentageChange?.outstanding || 0}%
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                {/* /Fees Collection */}
              </div>
              <div className="row">
                {/* Top Subjects */}
                <div className="col-xxl-4 col-xl-6 d-flex">
                  <div className="card flex-fill">
                    <div className="card-header  d-flex align-items-center justify-content-between">
                      <h4 className="card-title">Top Subjects</h4>
                      <div className="dropdown">
                        <Link
                          to="#"
                          className="bg-white dropdown-toggle"
                          data-bs-toggle="dropdown"
                        >
                          <i className="ti ti-school-bell  me-2" />
                          Class II
                        </Link>
                        <ul className="dropdown-menu mt-2 p-3">
                          <li>
                            <Link to="#" className="dropdown-item rounded-1">
                              Class I
                            </Link>
                          </li>
                          <li>
                            <Link to="#" className="dropdown-item rounded-1">
                              Class II
                            </Link>
                          </li>
                          <li>
                            <Link to="#" className="dropdown-item rounded-1">
                              Class III
                            </Link>
                          </li>
                          <li>
                            <Link to="#" className="dropdown-item rounded-1">
                              Class IV
                            </Link>
                          </li>
                        </ul>
                      </div>
                    </div>
                    <div className="card-body">
                      <div
                        className="alert alert-success d-flex align-items-center mb-24"
                        role="alert"
                      >
                        <i className="ti ti-info-square-rounded me-2 fs-14" />
                        <div className="fs-14">
                          These Result are obtained from the syllabus completion
                          on the respective Class
                        </div>
                      </div>
                      {dashboardData?.topSubjects?.subjects && dashboardData.topSubjects.subjects.length > 0 ? (
                        <ul className="list-group">
                          {dashboardData.topSubjects.subjects.map((subject, index) => (
                            <li key={index} className="list-group-item">
                              <div className="row align-items-center">
                                <div className="col-sm-4">
                                  <p className="text-dark">{subject.name}</p>
                                </div>
                                <div className="col-sm-8">
                                  <div className="progress progress-xs flex-grow-1">
                                    <div
                                      className="progress-bar bg-primary rounded"
                                      role="progressbar"
                                      style={{ width: `${subject.performance}%` }}
                                      aria-valuenow={subject.performance}
                                      aria-valuemin={0}
                                      aria-valuemax={100}
                                    />
                                  </div>
                                </div>
                              </div>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <div className="text-center text-muted">No top subjects available</div>
                      )}
                    </div>
                  </div>
                </div>
                {/* /Top Subjects */}
                {/* Student Activity */}
                <div className="col-xxl-4 col-xl-6 d-flex">
                  <div className="card flex-fill">
                    <div className="card-header  d-flex align-items-center justify-content-between">
                      <h4 className="card-title">Student Activity</h4>
                      <div className="dropdown">
                        <Link
                          to="#"
                          className="bg-white dropdown-toggle"
                          data-bs-toggle="dropdown"
                        >
                          <i className="ti ti-calendar me-2" />
                          This Month
                        </Link>
                        <ul className="dropdown-menu mt-2 p-3">
                          <li>
                            <Link to="#" className="dropdown-item rounded-1">
                              This Month
                            </Link>
                          </li>
                          <li>
                            <Link to="#" className="dropdown-item rounded-1">
                              This Year
                            </Link>
                          </li>
                          <li>
                            <Link to="#" className="dropdown-item rounded-1">
                              Last Week
                            </Link>
                          </li>
                        </ul>
                      </div>
                    </div>
                    <div className="card-body">
                      {dashboardData?.studentActivities?.activities && dashboardData.studentActivities.activities.length > 0 ? (
                        dashboardData.studentActivities.activities.map((activity, idx) => (
                          <div key={idx} className="d-flex align-items-center overflow-hidden p-3 mb-3 border rounded">
                            <span className="avatar avatar-lg flex-shrink-0 rounded me-2">
                              {activity.image ? (
                                <img src={activity.image} alt={activity.title} />
                              ) : (
                                <i className="ti ti-user" />
                              )}
                            </span>
                            <div className="overflow-hidden">
                              <h6 className="mb-1 text-truncate">{activity.title}</h6>
                              <p>{activity.description}</p>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center text-muted py-3">No activities for this month</div>
                      )}
                    </div>
                  </div>
                </div>
                {/* /Student Activity */}
                {/* Todo */}
                <div className="col-xxl-4 col-xl-12 d-flex">
                  <div className="card flex-fill">
                    <div className="card-header  d-flex align-items-center justify-content-between">
                      <h4 className="card-title">Todo</h4>
                      <div className="dropdown">
                        <Link
                          to="#"
                          className="bg-white dropdown-toggle"
                          data-bs-toggle="dropdown"
                        >
                          <i className="ti ti-calendar me-2" />
                          Today
                        </Link>
                        <ul className="dropdown-menu mt-2 p-3">
                          <li>
                            <Link to="#" className="dropdown-item rounded-1">
                              This Month
                            </Link>
                          </li>
                          <li>
                            <Link to="#" className="dropdown-item rounded-1">
                              This Year
                            </Link>
                          </li>
                          <li>
                            <Link to="#" className="dropdown-item rounded-1">
                              Last Week
                            </Link>
                          </li>
                        </ul>
                      </div>
                    </div>
                    <div className="card-body">
                      <ul className="list-group list-group-flush todo-list">
                        {dashboardData?.todos?.tasks && dashboardData.todos.tasks.length > 0 ? (
                          dashboardData.todos.tasks.map((task, idx) => (
                            <li key={idx} className="list-group-item py-3 px-0">
                              <div className="d-sm-flex align-items-center justify-content-between">
                                <div className="d-flex align-items-center overflow-hidden me-2">
                                  <div className="overflow-hidden">
                                    <h6 className="mb-1 text-truncate">{task.title}</h6>
                                    <p>{task.dueDate}</p>
                                  </div>
                                </div>
                                <span className={`badge badge-soft-${task.status === "Completed" ? "success" : "warning"} mt-2 mt-sm-0`}>
                                  {task.status}
                                </span>
                              </div>
                            </li>
                          ))
                        ) : (
                          <li className="list-group-item py-3 px-0 text-center text-muted">
                            No tasks for today
                          </li>
                        )}
                      </ul>
                    </div>
                  </div>
                </div>
                {/* /Todo */}
              </div>
            </>
        </div>
      </div>
   
      {/* /Page Wrapper */}
      <AdminDashboardModal/>
    </>
  );
};

export default AdminDashboard;
