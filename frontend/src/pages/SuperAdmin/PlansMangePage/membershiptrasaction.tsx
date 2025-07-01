import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Table } from "antd";
import dayjs from "dayjs"; // <-- Date formatting

import PredefinedDateRanges from "../../../core/common/datePicker";
import CommonSelect from "../../../core/common/commonSelect";
import { membershipplan, school } from "../../../core/common/selectoption/selectoption";
import { all_routes } from "../../../router/all_routes";
import TooltipOption from "../../../core/common/tooltipOption";
import PlanTransactionService from "../../../services/paymentHandler/planTransaction";

interface PlanTransaction {
  subscriptionId: string;
  providerName: string;
  planType: string;
  transactionDate: string;
  amount: number;
  paymentMethod: string;
  startDate: string | null;
  endDate: string | null;
  status: string;
}

const MembershipTransaction = () => {
  const routes = all_routes;
  const dropdownMenuRef = useRef<HTMLDivElement | null>(null);
  const [transactions, setTransactions] = useState<PlanTransaction[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedProvider, setSelectedProvider] = useState<string>("");
  const [selectedPlan, setSelectedPlan] = useState<string>("");

  const handleApplyClick = async () => {
    if (dropdownMenuRef.current) {
      dropdownMenuRef.current.classList.remove("show");
    }
    setLoading(true);
    try {
      const filters = {
        providerName: selectedProvider || undefined,
        planType: selectedPlan || undefined,
      };
      const response = await PlanTransactionService.getAllTransactions(filters);
      setTransactions(response);
    } catch (error) {
      console.error("Error applying filters", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const response = await PlanTransactionService.getAllTransactions();
      setTransactions(response);
    } catch (error) {
      console.error("Error fetching transactions", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadInvoice = async (subscriptionId: string) => {
    try {
      const res = await PlanTransactionService.downloadInvoice(subscriptionId);
      const url = window.URL.createObjectURL(new Blob([res.data], { type: 'application/pdf' }));
      const link = document.createElement('a');
      link.href = url;
      link.download = `invoice_${subscriptionId}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Failed to download invoice', err);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const formatDate = (dateString: string) => {
    return dayjs(dateString).format("DD MMM YYYY, hh:mm A");
  };

  const columns = [
    {
      title: "School Name",
      dataIndex: "providerName",
      sorter: (a: PlanTransaction, b: PlanTransaction) =>
        a.providerName.localeCompare(b.providerName),
    },
    {
      title: "Plan Type",
      dataIndex: "planType",
      sorter: (a: PlanTransaction, b: PlanTransaction) =>
        a.planType.localeCompare(b.planType),
    },
    {
      title: "Transaction Date",
      dataIndex: "transactionDate",
      render: (text: string) => formatDate(text),
      sorter: (a: PlanTransaction, b: PlanTransaction) =>
        new Date(a.transactionDate).getTime() - new Date(b.transactionDate).getTime(),
    },
    {
      title: "Amount",
      dataIndex: "amount",
      sorter: (a: PlanTransaction, b: PlanTransaction) => a.amount - b.amount,
      render: (amount: number) => `₹ ${amount}`,
    },
    {
      title: "Payment Method",
      dataIndex: "paymentMethod",
    },
    {
      title: "Start Date",
      dataIndex: "startDate",
      render: (text: string | null) => (text ? formatDate(text) : "N/A"),
    },
    {
      title: "End Date",
      dataIndex: "endDate",
      render: (text: string | null) => (text ? formatDate(text) : "N/A"),
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (status: string) => {
        let badgeClass = "badge-soft-warning";
        if (status === "Completed") badgeClass = "badge-soft-success";
        else if (status === "Failed") badgeClass = "badge-soft-danger";

        return (
          <span className={`badge ${badgeClass} d-inline-flex align-items-center`}>
            <i className="ti ti-circle-filled fs-5 me-1"></i> {status}
          </span>
        );
      },
    },
    {
      title: "Invoice",
      dataIndex: "subscriptionId",
      render: (_: any, record: PlanTransaction) => (
        <button
          type="button"
          className="btn btn-sm btn-outline-primary"
          onClick={() => handleDownloadInvoice(record.subscriptionId)}
        >
          <i className="ti ti-download me-1" />Download
        </button>
      ),
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
                <li className="breadcrumb-item">
                  <Link to="#">Membership</Link>
                </li>
                <li className="breadcrumb-item active" aria-current="page">
                  Transactions
                </li>
              </ol>
            </nav>
          </div>
          <div className="d-flex my-xl-auto right-content align-items-center flex-wrap">
            <TooltipOption />
          </div>
        </div>

        {/* Filter Section */}
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
                  <form>
                    <div className="d-flex align-items-center border-bottom p-3">
                      <h4>Filter</h4>
                    </div>
                    <div className="p-3 border-bottom">
                      <div className="row">
                        <div className="col-md-12">
                          <div className="mb-3">
                            <label className="form-label">Provider Name</label>
                            <CommonSelect
                              className="select"
                              options={school}
                              onChange={(value: any) => setSelectedProvider(value?.value)}
                            />
                          </div>
                        </div>
                        <div className="col-md-12">
                          <div className="mb-0">
                            <label className="form-label">Plan Type</label>
                            <CommonSelect
                              className="select"
                              options={membershipplan}
                              onChange={(value: any) => setSelectedPlan(value?.value)}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="p-3 d-flex align-items-center justify-content-end">
                      <Link
                        to="#"
                        className="btn btn-light me-3"
                        onClick={() => {
                          setSelectedProvider("");
                          setSelectedPlan("");
                          fetchTransactions();
                        }}
                      >
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

          {/* Table */}
          <div className="card-body p-0 py-3">
            <Table
              columns={columns}
              dataSource={transactions}
              loading={loading}
              pagination={{ pageSize: 10 }}
              rowKey={(record, index) => `${index}-${record.providerName}`}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MembershipTransaction;
