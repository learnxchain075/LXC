import { useState, useEffect, Fragment } from "react";
import { toast } from "react-toastify";

import Table from "../../../core/common/dataTable/index";
import { IFeatureRequestObj } from "../../../services/types/features";
import {
    featureRequestApprove,
    featureRequestReject,
    getAllFeaturesRequestList,
} from "../../../services/superadmin/featuresServices";
import CustomLoader from "../../../components/Loader";

const SuperAdminFeaturesRequestListPage = () => {
    const [featuresList, setFeaturesList] = useState<Array<IFeatureRequestObj>>([]);
    const [rejectedList, setRejectedList] = useState<Array<IFeatureRequestObj>>([]);
    const [fetchRequestLoader, setFetchRequestLoader] = useState<boolean>(true);
    const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

    const columns = [
        {
            title: "School Name",
            dataIndex: "schoolName",
            key: "schoolName",
            sorter: (a: IFeatureRequestObj, b: IFeatureRequestObj) =>
                (a.schoolName || '').localeCompare(b.schoolName || ''),
            render: (schoolName: string) => schoolName || 'N/A', // Show 'N/A' if null
        },
        {
            title: "Module Name",
            dataIndex: "moduleName",
            key: "moduleName",
            sorter: (a: IFeatureRequestObj, b: IFeatureRequestObj) =>
                a.moduleName.localeCompare(b.moduleName),
        },
        {
            title: "Status",
            dataIndex: "status",
            key: "status",
            render: () => <span className="badge bg-warning">Pending</span>,
        },
        {
            title: "Action",
            key: "action",
            render: (_: any, record: IFeatureRequestObj) => (
                <div className="d-flex gap-2">
                    <button
                        className={`btn btn-success btn-sm ${actionLoadingId === record.id ? "disabled" : ""
                            }`}
                        onClick={() => featureRequestApproveHandler(record.id)}
                    >
                        {actionLoadingId === record.id ? (
                            <span className="spinner-border spinner-border-sm me-1" />
                        ) : null}
                        {actionLoadingId === record.id ? "Approving..." : "Approve"}
                    </button>
                    <button
                        className={`btn btn-danger btn-sm ${actionLoadingId === record.id ? "disabled" : ""
                            }`}
                        onClick={() => featureRequestRejectHandler(record.id)}
                    >
                        {actionLoadingId === record.id ? (
                            <span className="spinner-border spinner-border-sm me-1" />
                        ) : null}
                        {actionLoadingId === record.id ? "Rejecting..." : "Reject"}
                    </button>
                </div>
            ),
        },
    ];

    const featureRequestApproveHandler = async (id: string) => {
        try {
            setActionLoadingId(id);
            const res = await featureRequestApprove(id);

            if (res.data.errors) {
                toast.error(res.data.errors);
                return;
            }

            setFeaturesList((prev) => prev.filter((obj) => obj.id !== id));
            setRejectedList((prev) => prev.filter((obj) => obj.id !== id));
            toast.success("Feature approved successfully!");
        } catch (err: any) {
            toast.error(err.message);
        } finally {
            setActionLoadingId(null);
        }
    };

    const featureRequestRejectHandler = async (id: string) => {
        try {
            setActionLoadingId(id);
            const res = await featureRequestReject(id);

            if (res.data.errors) {
                toast.error(res.data.errors);
                return;
            }

            // Move the rejected item from featuresList to rejectedList
            const rejectedItem = featuresList.find((obj) => obj.id === id);
            if (rejectedItem) {
                setRejectedList((prev) => [...prev, { ...rejectedItem, status: 2 }]);
                setFeaturesList((prev) => prev.filter((obj) => obj.id !== id));
            }

            toast.success("Feature request rejected.");
        } catch (err: any) {
            toast.error(err.message);
        } finally {
            setActionLoadingId(null);
        }
    };

    const fetchFeaturesRequestList = async () => {
        try {
            setFetchRequestLoader(true);
            const res = await getAllFeaturesRequestList();

            if (res.data.errors) {
                toast.error(res.data.errors);
                return;
            }

            const allFeatures = res.data.featuresList;

            // Separate pending (status 0) and rejected (status 2) requests
            const pending = allFeatures.filter((item: IFeatureRequestObj) => item.status === 0);
            const rejected = allFeatures.filter((item: IFeatureRequestObj) => item.status === 2);

            setFeaturesList(pending);
            setRejectedList(rejected);
        } catch (err: any) {
            toast.error(err.message);
        } finally {
            setFetchRequestLoader(false);
        }
    };

    useEffect(() => {
        fetchFeaturesRequestList();
    }, []);

    return (
        <div className="page-wrapper">
            <div className="content">
                <div className="card min-vh-100" style={{ position: "relative" }}>
                    {fetchRequestLoader && <CustomLoader size={50} color="blue" variant="dots" />}

                    {!fetchRequestLoader && (
                        <Fragment>
                            <div className="card-header d-flex align-items-center justify-content-between flex-wrap pb-0">
                                <h4 className="mb-3">Pending Feature Requests</h4>
                            </div>
                            <div className="card-body p-0 py-3">
                                <Table dataSource={featuresList} columns={columns} />
                            </div>

                            {rejectedList.length > 0 && (
                                <div className="card mt-4">
                                    <div className="card-header">
                                        <h5 className="mb-0">Rejected Feature Requests</h5>
                                    </div>
                                    <div className="card-body p-0 py-3">
                                        <Table
                                            dataSource={rejectedList}
                                            columns={[
                                                {
                                                    title: "School Name",
                                                    dataIndex: "schoolName",
                                                    key: "schoolName",
                                                    sorter: (a: IFeatureRequestObj, b: IFeatureRequestObj) =>
                                                        (a.schoolName ?? "").localeCompare(b.schoolName ?? ""),
                                                },

                                                {
                                                    title: "Module Name",
                                                    dataIndex: "moduleName",
                                                    key: "moduleName",
                                                    sorter: (a: IFeatureRequestObj, b: IFeatureRequestObj) =>
                                                        a.moduleName.localeCompare(b.moduleName),
                                                },
                                                {
                                                    title: "Status",
                                                    dataIndex: "status",
                                                    key: "status",
                                                    render: () => (
                                                        <span className="badge bg-danger">Rejected</span>
                                                    ),
                                                },
                                                {
                                                    title: "Action",
                                                    key: "action",
                                                    render: (_: any, record: IFeatureRequestObj) => (
                                                        <button
                                                            className={`btn btn-success btn-sm ${actionLoadingId === record.id ? "disabled" : ""
                                                                }`}
                                                            onClick={() => featureRequestApproveHandler(record.id)}
                                                        >
                                                            {actionLoadingId === record.id ? (
                                                                <span className="spinner-border spinner-border-sm me-1" />
                                                            ) : null}
                                                            {actionLoadingId === record.id ? "Approving..." : "Approve"}
                                                        </button>
                                                    ),
                                                },
                                            ]}
                                        />
                                    </div>
                                </div>
                            )}
                        </Fragment>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SuperAdminFeaturesRequestListPage;