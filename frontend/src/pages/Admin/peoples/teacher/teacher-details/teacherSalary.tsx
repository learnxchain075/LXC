
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ImageWithBasePath from "../../../../../core/common/imageWithBasePath";
import { all_routes } from "../../../../../router/all_routes";
import { TableData } from "../../../../../core/data/interface";
import TeacherSidebar from "./teacherSidebar";
import TeacherBreadcrumb from "./teacherBreadcrumb";
import TeacherModal from "../teacherModal";
import useMobileDetection from "../../../../../core/common/mobileDetection";
import { getTeacherById } from "../../../../../services/admin/teacherRegistartion";
import { useSelector, useDispatch } from "react-redux";
import { Table } from "antd";
import type { ColumnType } from "antd/es/table";
import { getPayrollsByTeacherId } from "../../../../../services/teacher/payrollService";
import { IPayroll } from "../../../../../services/types/teacher/IPayroll";
import { setDataTheme } from "../../../../../Store/themeSettingSlice";

// Error Boundary Component
class ErrorBoundary extends React.Component<React.PropsWithChildren<{}>, { hasError: boolean; error: any }> {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error: any) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="alert alert-danger m-3">
          <h5>Something went wrong.</h5>
          <p>Please try refreshing the page or contact support.</p>
        </div>
      );
    }
    return this.props.children;
  }
}

const TeacherSalary = () => {
  const routes = all_routes;
  const ismobile = useMobileDetection();
  const userobj = useSelector((state: any) => state.auth.userObj);
  const dispatch = useDispatch();
  const dataTheme = useSelector((state: any) => state.themeSetting.dataTheme);
  const isDark = dataTheme === "dark_data_theme";

  const handleToggleTheme = () => {
    dispatch(
      dataTheme === "default_data_theme"
        ? setDataTheme("dark_data_theme")
        : setDataTheme("default_data_theme")
    );
  };
  const [loading, setLoading] = useState(false);
  const [localTeacherData, setLocalTeacherData] = useState<any>(null); // Added local state
  // Change payrolls state to any[] | any for flexible type
  const [payrolls, setPayrolls] = useState<any[] | any>([]);

  // Added fetchTeacherDetails
  const fetchTeacherDetails = async () => {
    try {
      setLoading(true);
      const teacherId = localStorage.getItem("teacherId");
      
      const response = await getTeacherById(teacherId ?? "");
      
      if (response.status === 200) {
        const teacherDetails = response.data;
        setLocalTeacherData(teacherDetails);
      }
    } catch (error) {
      // Error handling
    } finally {
      setLoading(false);
    }
  };

  const fetchPayrolls = async () => {
    try {
      setLoading(true);
      const teacherId = localStorage.getItem("teacherId") || "";
      const res = await getPayrollsByTeacherId(teacherId);
      if (res.status === 200) {
        setPayrolls(res.data);
      }
    } catch (error) {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeacherDetails();
    fetchPayrolls();
   
    const teacherId = localStorage.getItem('teacherId');
    if (teacherId) {
      getPayrollsByTeacherId(teacherId).then(res => {
        ////console.log('Teacher Salary Payments:', res.data);
      }).catch(err => {
        //console.error('Error fetching teacher salary payments:', err);
      });
    }
  }, [userobj.role]);

  // Ensure payrolls is always an array
  const safePayrolls = Array.isArray(payrolls)
    ? payrolls
    : (payrolls && typeof payrolls === 'object' && Array.isArray((payrolls as any).payrolls)
        ? (payrolls as any).payrolls
        : []);

  const columns = [
    // Email column removed
    {
      title: <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}><i className="ti ti-phone me-1" />Phone</span>,
      dataIndex: "phone",
      align: 'center' as ColumnType<any>["align"],
      render: (_: string, record: any) => <span style={{ whiteSpace: 'nowrap' }}>{record.user?.phone || "-"}</span>,
      sorter: (a: any, b: any) => (a.user?.phone || '').localeCompare(b.user?.phone || ''),
    },
    {
      title: <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}><i className="ti ti-calendar me-1" />Salary For</span>,
      dataIndex: "Salary_For",
      align: 'center' as ColumnType<any>["align"],
      render: (text: string) => <span style={{ whiteSpace: 'nowrap' }}>{text}</span>,
      sorter: (a: any, b: any) => a.Salary_For.length - b.Salary_For.length,
    },
    {
      title: <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}><i className="ti ti-calendar-time me-1" />Date</span>,
      dataIndex: "date",
      align: 'center' as ColumnType<any>["align"],
      render: (text: string) => <span style={{ whiteSpace: 'nowrap' }}>{text}</span>,
      sorter: (a: any, b: any) => a.date.length - b.date.length,
    },
    {
      title: <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}><i className="ti ti-credit-card me-1" />Payment Method</span>,
      dataIndex: "Payment_Method",
      align: 'center' as ColumnType<any>["align"],
      render: (text: string) => <span style={{ whiteSpace: 'nowrap' }}>{text}</span>,
      sorter: (a: any, b: any) => a.Payment_Method.length - b.Payment_Method.length,
    },
    {
      title: <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}><i className="ti ti-currency-rupee me-1" />Gross Salary</span>,
      dataIndex: "Gross_Salary",
      align: 'center' as ColumnType<any>["align"],
      render: (_: any, record: any) => <span style={{ whiteSpace: 'nowrap' }}>{record.grossSalary || '-'}</span>,
      sorter: (a: any, b: any) => (a.grossSalary || 0) - (b.grossSalary || 0),
    },
    {
      title: <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}><i className="ti ti-minus me-1" />Deductions</span>,
      dataIndex: "Deductions",
      align: 'center' as ColumnType<any>["align"],
      render: (_: any, record: any) => <span style={{ whiteSpace: 'nowrap' }}>{record.deductions || '-'}</span>,
      sorter: (a: any, b: any) => (a.deductions || 0) - (b.deductions || 0),
    },
    {
      title: <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}><i className="ti ti-currency-rupee me-1" />Net Salary</span>,
      dataIndex: "Net_Salary",
      align: 'center' as ColumnType<any>["align"],
      render: (_: any, record: any) => <span style={{ whiteSpace: 'nowrap' }}>{record.netSalary || '-'}</span>,
      sorter: (a: any, b: any) => (a.netSalary || 0) - (b.netSalary || 0),
    },
    {
      title: <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}><i className="ti ti-badge me-1" />Status</span>,
      dataIndex: "status",
      align: 'center' as ColumnType<any>["align"],
      render: (text: string) => (
        <span className={`badge bg-${text === 'PAID' ? 'success' : text === 'PENDING' ? 'warning' : 'danger'}`} style={{ whiteSpace: 'nowrap' }}>{text}</span>
      ),
      sorter: (a: any, b: any) => (a.status || '').localeCompare(b.status || ''),
    },
    {
      title: " ",
      dataIndex: "Net_Salary",
      align: 'center' as ColumnType<any>["align"],
      render: (_: any, record: any) => (
        <Link to="#" className="btn btn-light add-fee">
          <i className="ti ti-file-invoice me-1" />View Payslip
        </Link>
      ),
    },
  ];

  const payrollData = safePayrolls.map((p: any) => ({
    id: p.id,
    email: p.user?.email || '-',
    phone: p.user?.phone || '-',
    user: p.user,
    Salary_For: `${new Date(p.periodStart).toLocaleDateString()} - ${new Date(p.periodEnd).toLocaleDateString()}`,
    date: p.paymentDate ? new Date(p.paymentDate).toLocaleDateString() : '-',
    Payment_Method: p.status,
    grossSalary: p.grossSalary,
    deductions: p.deductions,
    netSalary: p.netSalary,
    status: p.status,
  }));

  // Calculate summary
  const totalGross = payrollData.reduce((sum: number, p: any) => sum + (p.grossSalary || 0), 0);
  const totalDeductions = payrollData.reduce((sum: number, p: any) => sum + (p.deductions || 0), 0);
  const totalNet = payrollData.reduce((sum: number, p: any) => sum + (p.netSalary || 0), 0);

  // Update SkeletonPlaceholder to accept style prop
  const SkeletonPlaceholder = ({ className = "", style = {} }: { className?: string; style?: React.CSSProperties }) => (
    <span className={`placeholder bg-secondary ${className}`} style={style} />
  );

  return (
    <ErrorBoundary>
      <div className={(ismobile ? "page-wrapper" : "p-3") + (isDark ? " bg-dark text-light min-vh-100" : "") }>
        <div className={"content" + (isDark ? " bg-dark text-light" : "") }>
          <div className="row">
            {/* Page Header */}
            {/* <div className="d-flex align-items-center justify-content-between mb-3">
              <TeacherBreadcrumb />
            </div> */}
            {/* /Page Header */}
          </div>
          <div className="row">
            {/* Student Information */}
            {/* <TeacherSidebar /> */}
            {/* /Student Information */}
            <div className="col-12 d-flex flex-column">
              <div className="row">
                <div className="col-md-12">
                  {/* List */}
                  {/* <ul className="nav nav-tabs nav-tabs-bottom mb-4"> */}
                  {/* ... Navigation tabs ... */}
                  {/* </ul> */}
                  {/* /List */}
                  <div className="students-leaves-tab">
                    <div className="row">
                      {loading || !localTeacherData ? (
                      
                        Array(4)
                          .fill(0)
                          .map((_, index) => (
                            <div key={index} className="col-md-6 col-xxl-3 d-flex">
                              <div className="d-flex align-items-center justify-content-between rounded border p-3 mb-3 flex-fill bg-white placeholder-glow">
                                <div className="ms-2">
                                  <SkeletonPlaceholder
                                    className="col-6 mb-1"
                                    style={{ height: "1rem" }}
                                  />
                                  <SkeletonPlaceholder
                                    className="col-4"
                                    style={{ height: "1.5rem" }}
                                  />
                                </div>
                                <SkeletonPlaceholder
                                  className="avatar avatar-lg bg-secondary bg-opacity-10 rounded flex-shrink-0"
                                  style={{ width: "48px", height: "48px" }}
                                />
                              </div>
                            </div>
                          ))
                      ) : (
                        <>
                          <div className="col-md-6 col-xxl-3 d-flex">
                            <div className="d-flex align-items-center justify-content-between rounded border p-3 mb-3 flex-fill bg-white">
                              <div className="ms-2">
                                <p className="mb-1">Monthly Net Salary</p>
                                <h5>
                                  {localTeacherData.salary
                                    ? `$${localTeacherData.salary}`
                                    : "N/A"}
                                </h5>
                              </div>
                              <span className="avatar avatar-lg bg-secondary-transparent rounded flex-shrink-0 text-secondary">
                                <i className="ti ti-user-dollar fs-24" />
                              </span>
                            </div>
                          </div>
                          <div className="col-md-6 col-xxl-3 d-flex">
                            <div className="d-flex align-items-center justify-content-between rounded border p-3 mb-3 flex-fill bg-white">
                              <div className="ms-2">
                                <p className="mb-1">Payment Date</p>
                                <h5>
                                  {localTeacherData.dateOfPayment
                                    ? new Date(
                                        localTeacherData.dateOfPayment
                                      ).toLocaleDateString()
                                    : "N/A"}
                                </h5>
                              </div>
                              <span className="avatar avatar-lg bg-success-transparent rounded flex-shrink-0 text-success">
                                <i className="ti ti-moneybag fs-24" />
                              </span>
                            </div>
                          </div>
                          <div className="col-md-6 col-xxl-3 d-flex">
                            <div className="d-flex align-items-center justify-content-between rounded border p-3 mb-3 flex-fill bg-white">
                              <div className="ms-2">
                                <p className="mb-1">Total Amount</p>
                                <h5>{localTeacherData.totalAmount || "N/A"}</h5>
                              </div>
                              <span className="avatar avatar-lg bg-warning-transparent rounded flex-shrink-0 text-warning">
                                <i className="ti ti-building-bank fs-24" />
                              </span>
                            </div>
                          </div>
                          <div className="col-md-6 col-xxl-3 d-flex">
                            <div className="d-flex align-items-center justify-content-between rounded border p-3 mb-3 flex-fill bg-white">
                              <div className="ms-2">
                                <p className="mb-1">Account Number</p>
                                <h5>{localTeacherData.accountNumber || "N/A"}</h5>
                              </div>
                              <span className="avatar avatar-lg bg-info-transparent rounded flex-shrink-0 text-info">
                                <i className="ti ti-credit-card fs-24" />
                              </span>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                    <div className={"card" + (isDark ? " bg-dark text-light" : "") }>
                      <div className={"card-header d-flex align-items-center justify-content-between flex-wrap pb-0" + (isDark ? " bg-dark text-light" : "") }>
                        <h4 className="mb-3">Salary History</h4>
                      </div>
                      <div className={"card-body p-0 py-3" + (isDark ? " bg-dark text-light" : "") }>
                        <Table
                          dataSource={payrollData as any}
                          columns={columns}
                          loading={loading}
                          rowKey="id"
                          className={isDark ? "table-dark" : ""}
                          pagination={{ pageSize: 5 }}
                          bordered
                          summary={pageData => (
                            <Table.Summary.Row>
                              <Table.Summary.Cell index={0} colSpan={5}><b>Totals</b></Table.Summary.Cell>
                              <Table.Summary.Cell index={1}><b>{totalGross}</b></Table.Summary.Cell>
                              <Table.Summary.Cell index={2}><b>{totalDeductions}</b></Table.Summary.Cell>
                              <Table.Summary.Cell index={3}><b>{totalNet}</b></Table.Summary.Cell>
                              <Table.Summary.Cell index={4} colSpan={2}></Table.Summary.Cell>
                            </Table.Summary.Row>
                          )}
                        />
                        {loading && (
                          <div className="placeholder-glow">
                            {Array(5)
                              .fill(0)
                              .map((_, index) => (
                                <div key={index} className="p-3 border-bottom">
                                  <SkeletonPlaceholder
                                    className="col-2 mb-2"
                                    style={{ height: "1rem" }}
                                  />
                                  <SkeletonPlaceholder
                                    className="col-3 mb-2"
                                    style={{ height: "1rem" }}
                                  />
                                  <SkeletonPlaceholder
                                    className="col-2 mb-2"
                                    style={{ height: "1rem" }}
                                  />
                                  <SkeletonPlaceholder
                                    className="col-2 mb-2"
                                    style={{ height: "1rem" }}
                                  />
                                  <SkeletonPlaceholder
                                    className="col-2 mb-2"
                                    style={{ height: "1rem" }}
                                  />
                                  <SkeletonPlaceholder
                                    className="col-2 mb-2"
                                    style={{ height: "1rem" }}
                                  />
                                </div>
                              ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <TeacherModal />
      </div>
    </ErrorBoundary>
  );
};

export default TeacherSalary;