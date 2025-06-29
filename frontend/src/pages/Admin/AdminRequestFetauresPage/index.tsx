// import { useState, useEffect } from "react";
// import { toast } from "react-toastify";

// import Table from "../../../core/common/dataTable/index"; // Adjust path as needed
// import { IFeatureObj } from "../../../services/types/features";
// import { getAllFeatures, requestFeature } from "../../../services/admin/featuresServices";
// import CustomLoader from "../../../components/Loader";

// const AdminRequestFeaturesPage = () => {
//     const [featuresList, setFeaturesList] = useState<Array<IFeatureObj>>([]);
//     const [fetchRequestLoader, setFetchRequestLoader] = useState<boolean>(true);
//     const [requestingFeatures, setRequestingFeatures] = useState<string[]>([]);

//     const requestFeatureHandler = async (moduleName: string) => {
//         // Add the moduleName to the loading state
//         setRequestingFeatures((prev) => [...prev, moduleName]);
//         try {
//             const res = await requestFeature({ moduleName });

//             if (res.data.errors) {
//                 toast.error(res.data.errors);
//                 return;
//             }

//             // Update the features list to mark the feature as pending
//             setFeaturesList((prevstate) =>
//                 prevstate.map((obj) =>
//                     obj.moduleName === moduleName ? { ...obj, status: 1 } : obj
//                 )
//             );

//             // Show success toast
//             toast.success(`Feature ${moduleName} requested successfully`);
//         } catch (err: any) {
//             toast.error(err.message);
//         } finally {
//             // Remove the moduleName from the loading state
//             setRequestingFeatures((prev) => prev.filter((name) => name !== moduleName));
//         }
//     };

//     const fetchFeaturesList = async () => {
//         try {
//             setFetchRequestLoader(true);
//             const res = await getAllFeatures();

//             if (res.data.errors) {
//                 toast.error(res.data.errors);
//                 return;
//             }

//             setFeaturesList(res.data.featuresList);
//         } catch (err: any) {
//             toast.error(err.message);
//         } finally {
//             setFetchRequestLoader(false);
//         }
//     };

//     useEffect(() => {
//         fetchFeaturesList();
//     }, []);

//     const columns = [
//         {
//             title: "Module Name",
//             dataIndex: "moduleName",
//             key: "moduleName",
//             sorter: (a: IFeatureObj, b: IFeatureObj) => a.moduleName.localeCompare(b.moduleName),
//         },
//         {
//             title: "Status",
//             dataIndex: "status",
//             key: "status",
//             render: (_: string, record: IFeatureObj) => (
//                 <div className="status-toggle modal-status">
//                     <input
//                         type="checkbox"
//                         id={`user-${record.moduleName}`}
//                         className="check"
//                         checked={record.permission === 1}
//                         disabled
//                     />
//                     <label htmlFor={`user-${record.moduleName}`} className="checktoggle"></label>
//                 </div>
//             ),
//         },
//         {
//             title: "Request",
//             dataIndex: "status",
//             key: "status",
//             render: (_: string, record: IFeatureObj) => (
//                 <div className="status-toggle modal-status">
//                     {requestingFeatures.includes(record.moduleName) ? (
//                         <div className="spinner-border spinner-border-sm" role="status">
//                             <span className="visually-hidden">Loading...</span>
//                         </div>
//                     ) : record.status === 0 ? (
//                         <button
//                             className="btn btn-primary"
//                             disabled={record.permission === 1}
//                             onClick={() => requestFeatureHandler(record.moduleName)}
//                         >
//                             Request
//                         </button>
//                     ) : record.status === 1 ? (
//                         <button className="btn btn-primary" disabled>
//                             Pending
//                         </button>
//                     ) : null}
//                 </div>
//             ),
//         },
//     ];

//     return (
//         <div className="page-wrapper">
//             <div className="content">
//                 <div className="card min-vh-100" style={{ position: "relative" }}>
//                     {fetchRequestLoader && <CustomLoader size={50} color="blue" variant="dots" />}
//                     {!fetchRequestLoader && (
//                         <>
//                             <div className="card-header d-flex align-items-center justify-content-between flex-wrap pb-0">
//                                 <h4 className="mb-3">Features List</h4>
//                             </div>
//                             <div className="card-body p-0 py-3">
//                                 <Table dataSource={featuresList} columns={columns} />
//                             </div>
//                         </>
//                     )}
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default AdminRequestFeaturesPage;


import { useState, useEffect } from "react";
import { toast } from "react-toastify";

import Table from "../../../core/common/dataTable/index";
import { IFeatureObj } from "../../../services/types/features";
import { getAllFeatures, requestFeature } from "../../../services/admin/featuresServices";
import CustomLoader from "../../../components/Loader";

const AdminRequestFeaturesPage = () => {
    const [featuresList, setFeaturesList] = useState<Array<IFeatureObj>>([]);
    const [fetchRequestLoader, setFetchRequestLoader] = useState<boolean>(true);
    const [requestingFeatures, setRequestingFeatures] = useState<string[]>([]);
    const [allFeaturesGranted, setAllFeaturesGranted] = useState<boolean>(false);

    const requestFeatureHandler = async (moduleName: string) => {
        setRequestingFeatures((prev) => [...prev, moduleName]);
        try {
            const res = await requestFeature({ moduleName });

            if (res.data.errors) {
                toast.error(res.data.errors);
                return;
            }

            setFeaturesList((prevstate) =>
                prevstate.map((obj) =>
                    obj.moduleName === moduleName ? { ...obj, status: 1 } : obj
                )
            );

            toast.success(`Feature ${moduleName} requested successfully`);
        } catch (err: any) {
            toast.error(err.message);
        } finally {
            setRequestingFeatures((prev) => prev.filter((name) => name !== moduleName));
        }
    };

    const fetchFeaturesList = async () => {
        try {
            setFetchRequestLoader(true);
            const res = await getAllFeatures();

            if (res.data.errors) {
                toast.error(res.data.errors);
                return;
            }

            // Filter out features that have permission granted (status 2)
            const filteredFeatures = res.data.featuresList.filter(
                (feature: IFeatureObj) => feature.permission !== 1
            );

            setFeaturesList(filteredFeatures);
            
            // Check if all features are granted
            setAllFeaturesGranted(
                res.data.featuresList.length > 0 && 
                res.data.featuresList.every((feature: IFeatureObj) => feature.permission === 1)
            );
        } catch (err: any) {
            toast.error(err.message);
        } finally {
            setFetchRequestLoader(false);
        }
    };

    useEffect(() => {
        fetchFeaturesList();
    }, []);

    const columns = [
        {
            title: "Module Name",
            dataIndex: "moduleName",
            key: "moduleName",
            sorter: (a: IFeatureObj, b: IFeatureObj) => a.moduleName.localeCompare(b.moduleName),
        },
        {
            title: "Status",
            dataIndex: "status",
            key: "status",
            render: (_: string, record: IFeatureObj) => {
                if (record.permission === 1) {
                    return <span className="badge bg-success">Approved</span>;
                }
                return record.status === 1 ? (
                    <span className="badge bg-warning">Pending</span>
                ) : (
                    <span className="badge bg-secondary">Not Requested</span>
                );
            },
        },
        {
            title: "Action",
            dataIndex: "status",
            key: "status",
            render: (_: string, record: IFeatureObj) => (
                <div className="d-flex align-items-center">
                    {requestingFeatures.includes(record.moduleName) ? (
                        <div className="spinner-border spinner-border-sm" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                    ) : record.status === 0 ? (
                        <button
                            className="btn btn-primary btn-sm"
                            disabled={record.permission === 1}
                            onClick={() => requestFeatureHandler(record.moduleName)}
                        >
                            Request
                        </button>
                    ) : record.status === 1 ? (
                        <button className="btn btn-warning btn-sm" disabled>
                            Pending Approval
                        </button>
                    ) : null}
                </div>
            ),
        },
    ];

    return (
        <div className="page-wrapper">
            <div className="content">
                <div className="card min-vh-100" style={{ position: "relative" }}>
                    {fetchRequestLoader && <CustomLoader size={50} color="blue" variant="dots" />}
                    {!fetchRequestLoader && (
                        <>
                            <div className="card-header d-flex align-items-center justify-content-between flex-wrap pb-0">
                                <h4 className="mb-3">Features List</h4>
                            </div>
                            <div className="card-body p-0 py-3">
                                {allFeaturesGranted ? (
                                    <div className="text-center py-5">
                                        <div className="mb-4">
                                            <i className="ti ti-confetti display-1 text-success"></i>
                                        </div>
                                        <h2 className="mb-3">Congratulations! 🎉</h2>
                                        <p className="text-muted mb-4">
                                            You have access to all available features. Enjoy using our platform to its full potential!
                                        </p>
                                        <div className="d-flex justify-content-center gap-2">
                                            <button 
                                                className="btn btn-light" 
                                                onClick={fetchFeaturesList}
                                            >
                                                <i className="ti ti-refresh me-2"></i>
                                                Refresh List
                                            </button>
                                            <button className="btn btn-primary">
                                                <i className="ti ti-layout-dashboard me-2"></i>
                                                Go to Dashboard
                                            </button>
                                        </div>
                                    </div>
                                ) : featuresList.length === 0 ? (
                                    <div className="text-center py-5">
                                        <div className="mb-4">
                                            <i className="ti ti-clipboard-check display-1 text-primary"></i>
                                        </div>
                                        <h3 className="mb-3">All Features Requested!</h3>
                                        <p className="text-muted mb-4">
                                            You have requested all available features. Please wait for admin approval.
                                        </p>
                                        <button 
                                            className="btn btn-light" 
                                            onClick={fetchFeaturesList}
                                        >
                                            <i className="ti ti-refresh me-2"></i>
                                            Check Status
                                        </button>
                                    </div>
                                ) : (
                                    <Table dataSource={featuresList} columns={columns} />
                                )}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminRequestFeaturesPage;