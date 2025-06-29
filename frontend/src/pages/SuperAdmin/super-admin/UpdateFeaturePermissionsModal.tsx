// import { useState, useEffect } from "react";
// import { IPermissionsObj } from "../../../services/types/features";
// import { featurePermissionToggle, getAllFeaturePermissionsList } from "../../../services/superadmin/featuresServices";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

// interface Props {
//     userId: string | null;
// }

// const UpdateFeaturePermissionsModal = ({ userId }: Props) => {
//     console.log("userid", userId);
//     const [featurePermissionsList, setFeaturePermissionsList] = useState<Array<IPermissionsObj>>([]);

//     const toggleFeaturePermission = async (id: string) => {
//         try {
//             await featurePermissionToggle(id);

//             const updatedFeaturePermissionsList = featurePermissionsList.map((permission) => {
//                 if (permission.id === id) {
//                     return {
//                         ...permission,
//                         status: permission.status === 1 ? 0 : 1,
//                     };
//                 }

//                 return permission;
//             });

//             setFeaturePermissionsList(updatedFeaturePermissionsList);
//         } catch (error) {
//             toast.error("Failed to toggle feature permission");
//         }
//     }

//     const fetchFeaturePermissionsList = async () => {
//         // Only fetch if userId is not null
//         if (userId) {
//             try {
//                 const response = await getAllFeaturePermissionsList(userId);
//                 setFeaturePermissionsList(response.data.permissionsList);

//             } catch (error) {
//                 toast.error("Failed to fetch feature permissions list");
//             }
//         }
//     }


//     useEffect(() => {
//         // Reset list if userId changes or becomes null
//         if (!userId) {
//             setFeaturePermissionsList([]);
//             return;
//         }

//         fetchFeaturePermissionsList();

//         // eslint-disable-next-line react-hooks/exhaustive-deps
//     }, [userId]);

//     return (
//         <div className="modal fade" id="modal-lg">
//             <ToastContainer />
//             <div className="modal-dialog modal-dialog-centered">
//                 <div className="modal-content">
//                     <div className="modal-header">
//                         <h5 className="modal-title">School Permissions</h5>
//                         <button
//                             type="button"
//                             className="btn-close"
//                             data-bs-dismiss="modal"
//                             aria-label="Close"
//                         ></button>
//                     </div>

//                     <div className="modal-body text-left">
//                         <div className="table-responsive">
//                             <table className="table table-bordered">
//                                 <thead>
//                                     <tr>
//                                         <th>Module Name</th>
//                                         <th>Status</th>
//                                         <th>Action</th>
//                                     </tr>
//                                 </thead>
//                                 <tbody>
//                                     {featurePermissionsList.map((permission) => (
//                                         <tr key={permission.id}>
//                                             <td>{permission.moduleName}</td>
//                                             <td>
//                                                 {permission.status === 1 ? (
//                                                     <span className="badge bg-warning">Granted</span>
//                                                 ) : (
//                                                     <span className="badge bg-danger">Revoked</span>
//                                                 )}
//                                             </td>
//                                             <td> {permission.status === 1 ? (
//                                                 <button
//                                                     type="button"
//                                                     className="btn btn-danger btn-sm"
//                                                     onClick={() => toggleFeaturePermission(permission.id)}
//                                                 >
//                                                     Revoke
//                                                 </button>
//                                             ) : (
//                                                 <button
//                                                     type="button"
//                                                     className="btn btn-success btn-sm"
//                                                     onClick={() => toggleFeaturePermission(permission.id)}
//                                                 >
//                                                     Grant
//                                                 </button>
//                                             )}
//                                             </td>
//                                         </tr>
//                                     ))}
//                                 </tbody>
//                             </table>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default UpdateFeaturePermissionsModal;


import { useState, useEffect, useCallback } from "react";
import { IPermissionsObj } from "../../../services/types/features";
import { featurePermissionToggle, getAllFeaturePermissionsList } from "../../../services/superadmin/featuresServices";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface Props {
    userId: string | null;
}

const UpdateFeaturePermissionsModal = ({ userId }: Props) => {
    // console.log("object",userId);
    const [featurePermissionsList, setFeaturePermissionsList] = useState<Array<IPermissionsObj>>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);

    // Memoize the fetch function to prevent unnecessary rerender
    const fetchFeaturePermissionsList = useCallback(async () => {
        if (!userId) {
            setFeaturePermissionsList([]);
            return;
        }

        setIsLoading(true);
        try {
            const response = await getAllFeaturePermissionsList(userId);
            setFeaturePermissionsList(response.data.permissionsList);
        } catch (error) {
            toast.error("Failed to fetch feature permissions list");
            setFeaturePermissionsList([]);
        } finally {
            setIsLoading(false);
        }
    }, [userId]);

    const toggleFeaturePermission = async (id: string) => {
        setIsUpdating(true);
        try {
            await featurePermissionToggle(id);

            setFeaturePermissionsList(prevList => 
                prevList.map((permission) => ({
                    ...permission,
                    status: permission.id === id 
                        ? permission.status === 1 ? 0 : 1 
                        : permission.status
                }))
            );
        } catch (error) {
            toast.error("Failed to toggle feature permission");
        } finally {
            setIsUpdating(false);
        }
    }

    useEffect(() => {
        fetchFeaturePermissionsList();
    }, [fetchFeaturePermissionsList]);

    return (
        <div className="modal fade" id="modal-lg">
            <ToastContainer />
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">School Permissions</h5>
                        <button
                            type="button"
                            className="btn-close"
                            data-bs-dismiss="modal"
                            aria-label="Close"
                        ></button>
                    </div>

                    <div className="modal-body text-left">
                        {isLoading ? (
                            <div className="text-center py-4">
                                <div className="spinner-border text-primary" role="status">
                                    <span className="visually-hidden">Loading...</span>
                                </div>
                                <p>Loading permissions...</p>
                            </div>
                        ) : (
                            <div className="table-responsive">
                                <table className="table table-bordered">
                                    <thead>
                                        <tr>
                                            <th>Module Name</th>
                                            <th>Status</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {featurePermissionsList.map((permission) => (
                                            <tr key={permission.id}>
                                                <td>{permission.moduleName}</td>
                                                <td>
                                                    {permission.status === 1 ? (
                                                        <span className="badge bg-warning">Granted</span>
                                                    ) : (
                                                        <span className="badge bg-danger">Revoked</span>
                                                    )}
                                                </td>
                                                <td>
                                                    <button
                                                        type="button"
                                                        className={`btn btn-sm ${permission.status === 1 ? 'btn-danger' : 'btn-success'}`}
                                                        onClick={() => toggleFeaturePermission(permission.id)}
                                                        disabled={isUpdating}
                                                    >
                                                        {isUpdating ? (
                                                            <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                                        ) : permission.status === 1 ? (
                                                            "Revoke"
                                                        ) : (
                                                            "Grant"
                                                        )}
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UpdateFeaturePermissionsModal;