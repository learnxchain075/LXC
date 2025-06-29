import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { Table } from "antd";
import moment from "moment";

import { TableData } from "../../../core/data/interface";
import PredefinedDateRanges from "../../../core/common/datePicker";
import CommonSelect from "../../../core/common/commonSelect";
import {
  transactionDate,
  transactionId,
  transactionType,
} from "../../../core/common/selectoption/selectoption";
import { all_routes } from "../../../router/all_routes";
import TooltipOption from "../../../core/common/tooltipOption";
import { getAllTransactionsForSchool } from "../../../services/accounts/transcationList";

// Define new select options for fee category and payment method
const feeCategoryOptions = [
  { value: "", label: "All Categories" },
  { value: "Tuition", label: "Tuition" },
  { value: "Transport", label: "Transport" },
  { value: "Library", label: "Library" },
  { value: "Miscellaneous", label: "Miscellaneous" },
];

const paymentMethodOptions = [
  { value: "", label: "All Methods" },
  { value: "Online", label: "Online" },
  { value: "Cash", label: "Cash" },
  { value: "Bank Transfer", label: "Bank Transfer" },
  { value: "Cheque", label: "Cheque" },
];

const AccountsTransactions = () => {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [filters, setFilters] = useState<{
    transactionId: string;
    transactionType: string;
    transactionDate: string;
    feeCategory: string;
    paymentMethod: string;
  }>({
    transactionId: "",
    transactionType: "",
    transactionDate: "",
    feeCategory: "",
    paymentMethod: "",
  });
  const [sortOption, setSortOption] = useState<string>("ascending");
  const dropdownMenuRef = useRef<HTMLDivElement | null>(null);
  const routes = all_routes;

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const res = await getAllTransactionsForSchool(localStorage.getItem("schoolId") as string);
      const sorted = res.data.data.sort(
        (a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      setTransactions(sorted);
      setFilteredTransactions(sorted);
    } catch (error) {
      console.error("Failed to fetch transactions", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  // Apply filters and sorting
  useEffect(() => {
    let result = [...transactions];

    // Apply filters
    if (filters.transactionId) {
      result = result.filter((t) =>
        t.id.toLowerCase().includes(filters.transactionId.toLowerCase())
      );
    }
    if (filters.transactionType) {
      result = result.filter((t) => t.status === filters.transactionType);
    }
    if (filters.transactionDate) {
      result = result.filter((t) =>
        moment(t.paymentDate).isSame(moment(filters.transactionDate, "DD-MM-YYYY"), "day")
      );
    }
    if (filters.feeCategory) {
      result = result.filter((t) => t.fee?.category === filters.feeCategory);
    }
    if (filters.paymentMethod) {
      result = result.filter((t) => (t.method || "Online") === filters.paymentMethod);
    }

    // Apply sorting
    switch (sortOption) {
      case "ascending":
        result.sort((a, b) => a.id.localeCompare(b.id));
        break;
      case "descending":
        result.sort((a, b) => b.id.localeCompare(a.id));
        break;
      case "recently_added":
        result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case "recently_viewed":
        // Placeholder: Implement viewed tracking if needed
        result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      default:
        break;
    }

    setFilteredTransactions(result);
  }, [filters, sortOption, transactions]);

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleResetFilters = () => {
    setFilters({
      transactionId: "",
      transactionType: "",
      transactionDate: "",
      feeCategory: "",
      paymentMethod: "",
    });
    if (dropdownMenuRef.current) {
      dropdownMenuRef.current.classList.remove("show");
    }
  };

  const handleApplyFilters = (e: React.FormEvent) => {
    e.preventDefault();
    if (dropdownMenuRef.current) {
      dropdownMenuRef.current.classList.remove("show");
    }
  };

  const handleSortChange = (option: string) => {
    setSortOption(option);
  };

  // Helper to get student object robustly
  const getStudentObj = (record: any) => {
    if (Array.isArray(record.student) && record.student.length > 0) {
      return record.student[0];
    }
    if (record.student && typeof record.student === 'object' && !Array.isArray(record.student)) {
      return record.student;
    }
    if (record.fee && record.fee.student && typeof record.fee.student === 'object') {
      return record.fee.student;
    }
    return null;
  };

  const columns = [
    {
      title: "Admission No",
      key: "admissionNo",
      render: (_: any, record: any) => {
        const student = getStudentObj(record);
        return student?.admissionNo || "N/A";
      },
      sorter: (a: any, b: any) => {
        const aStudent = getStudentObj(a);
        const bStudent = getStudentObj(b);
        return (aStudent?.admissionNo || "").localeCompare(bStudent?.admissionNo || "");
      }
    },
    {
      title: "Student Name",
      key: "studentName",
      render: (_: any, record: any) => {
        const student = getStudentObj(record);
        return student?.user?.name || "N/A";
      },
      sorter: (a: any, b: any) => {
        const aStudent = getStudentObj(a);
        const bStudent = getStudentObj(b);
        return (aStudent?.user?.name || "").localeCompare(bStudent?.user?.name || "");
      }
    },
    {
      title: "Class",
      key: "class",
      render: (_: any, record: any) => {
        const student = getStudentObj(record);
        const className = student?.class?.name || "N/A";
        const section = student?.class?.section ? ` (${student.class.section})` : "";
        return className + section;
      },
      sorter: (a: any, b: any) => {
        const aStudent = getStudentObj(a);
        const bStudent = getStudentObj(b);
        return (aStudent?.class?.name || "").localeCompare(bStudent?.class?.name || "");
      }
    },
    {
      title: "Transaction Date",
      key: "paymentDate",
      render: (_: any, record: any) => {
        const date = record?.fee?.paymentDate || record?.paymentDate;
        return date ? moment(date).format("DD-MM-YYYY") : "N/A";
      },
      sorter: (a: any, b: any) =>
        new Date((a.fee?.paymentDate || a.paymentDate) || 0).getTime() - new Date((b.fee?.paymentDate || b.paymentDate) || 0).getTime(),
    },
    {
      title: "Amount Paid",
      key: "amount",
      render: (_: any, record: any) => `₹ ${record?.amount ?? 0}`,
      sorter: (a: any, b: any) => (a.amount ?? 0) - (b.amount ?? 0),
    },
    {
      title: "Fee Category",
      key: "category",
      render: (_: any, record: any) => record?.fee?.category || "N/A",
      sorter: (a: any, b: any) =>
        (a.fee?.category || "").localeCompare(b.fee?.category || ""),
    },
    {
      title: "Payment Method",
      key: "method",
      render: (_: any, record: any) => record?.method || record?.fee?.method || "Online",
      sorter: (a: any, b: any) =>
        (a.method || a.fee?.method || "Online").localeCompare(b.method || b.fee?.method || "Online"),
    },
    {
      title: "Status",
      key: "status",
      render: (_: any, record: any) => {
        const status = record?.status || "N/A";
        return (
          <span
            className={`badge d-inline-flex align-items-center ${
              status === "PAID"
                ? "badge-soft-success"
                : status === "PARTIAL"
                ? "badge-soft-warning"
                : "badge-soft-danger"
            }`}
          >
            <i className="ti ti-circle-filled fs-5 me-1" />
            {status}
          </span>
        );
      },
      sorter: (a: any, b: any) => (a.status || "").localeCompare(b.status || ""),
    },
    {
      title: "Receipt/Invoice No",
      key: "invoiceNumber",
      render: (_: any, record: any) => record?.fee?.invoiceNumber || "N/A",
    },
    {
      title: "Description",
      key: "description",
      render: (_: any, record: any) => record?.fee?.description || "-",
    },
  ];

  return (
    <div className="page-wrapper">
      <div className="content">
        <div className="d-md-flex d-block align-items-center justify-content-between mb-3">
          <div className="my-auto mb-2">
            <h3 className="page-title mb-1">Transactions</h3>
            <nav>
              <ol className="breadcrumb mb-0">
                <li className="breadcrumb-item">
                  <Link to={routes.adminDashboard}>Dashboard</Link>
                </li>
                <li className="breadcrumb-item">Finance & Accounts</li>
                <li className="breadcrumb-item active">Transactions</li>
              </ol>
            </nav>
          </div>
          <div className="d-flex my-xl-auto right-content align-items-center flex-wrap">
            <TooltipOption />
          </div>
        </div>

        <div className="card">
          <div className="card-header d-flex align-items-center justify-content-between flex-wrap pb-0">
            <h4 className="mb-3">Transactions List</h4>
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
                  <form onSubmit={handleApplyFilters}>
                    <div className="d-flex align-items-center border-bottom p-3">
                      <h4>Filter</h4>
                    </div>
                    <div className="p-3 pb-0 border-bottom">
                      <div className="row">
                        <div className="col-md-6">
                          <div className="mb-3">
                            <label className="form-label">Transaction ID</label>
                            <CommonSelect
                              className="select"
                              options={transactionId}
                              value={filters.transactionId}
                              onChange={(value: string) => handleFilterChange("transactionId", value)}
                              placeholder="Select Transaction ID"
                            />
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="mb-3">
                            <label className="form-label">Transaction Type</label>
                            <CommonSelect
                              className="select"
                              options={transactionType}
                              value={filters.transactionType}
                              onChange={(value: string) => handleFilterChange("transactionType", value)}
                              placeholder="Select Transaction Type"
                            />
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="mb-3">
                            <label className="form-label">Fee Category</label>
                            <CommonSelect
                              className="select"
                              options={feeCategoryOptions}
                              value={filters.feeCategory}
                              onChange={(value: string) => handleFilterChange("feeCategory", value)}
                              placeholder="Select Fee Category"
                            />
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="mb-3">
                            <label className="form-label">Payment Method</label>
                            <CommonSelect
                              className="select"
                              options={paymentMethodOptions}
                              value={filters.paymentMethod}
                              onChange={(value: string) => handleFilterChange("paymentMethod", value)}
                              placeholder="Select Payment Method"
                            />
                          </div>
                        </div>
                        <div className="col-md-12">
                          <div className="mb-3">
                            <label className="form-label">Transaction Date</label>
                            <CommonSelect
                              className="select"
                              options={transactionDate}
                              value={filters.transactionDate}
                              onChange={(value: string) => handleFilterChange("transactionDate", value)}
                              placeholder="Select Transaction Date"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="p-3 d-flex align-items-center justify-content-end">
                      <Link to="#" className="btn btn-light me-3" onClick={handleResetFilters}>
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
                  Sort by {sortOption.replace("_", " ")}
                </Link>
                <ul className="dropdown-menu p-3">
                  <li>
                    <Link
                      to="#"
                      className={`dropdown-item rounded-1 ${sortOption === "ascending" ? "active" : ""}`}
                      onClick={() => handleSortChange("ascending")}
                    >
                      Ascending
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="#"
                      className={`dropdown-item rounded-1 ${sortOption === "descending" ? "active" : ""}`}
                      onClick={() => handleSortChange("descending")}
                    >
                      Descending
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="#"
                      className={`dropdown-item rounded-1 ${sortOption === "recently_viewed" ? "active" : ""}`}
                      onClick={() => handleSortChange("recently_viewed")}
                    >
                      Recently Viewed
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="#"
                      className={`dropdown-item rounded-1 ${sortOption === "recently_added" ? "active" : ""}`}
                      onClick={() => handleSortChange("recently_added")}
                    >
                      Recently Added
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="card-body p-0 py-3">
            <Table
              dataSource={filteredTransactions}
              columns={columns}
              rowKey="id"
              loading={loading}
              pagination={{ pageSize: 10 }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountsTransactions;