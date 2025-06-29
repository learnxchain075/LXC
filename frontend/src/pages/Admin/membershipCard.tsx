// // // import React, { useEffect, useState } from "react";
// // // import { Link } from "react-router-dom";
// // // import CommonSelect from "../../core/common/commonSelect";
// // // import { membershipplan } from "../../core/common/selectoption/selectoption";
// // // import TooltipOption from "../../core/common/tooltipOption";
// // // import { all_routes } from "../../router/all_routes";
// // // import { getAllPlans, createPlan, deletePlan, updatePlan } from "../../services/superadmin/planServices";
// // // import { useSelector } from "react-redux";
// // // import { toast } from "react-toastify";
// // // import BaseApi from "../../services/BaseApi";
// // // import { ToastContainer } from "react-toastify";

// // // // Interface for plan data
// // // export interface ICreatePlans {
// // //   id: string;
// // //   name: string;
// // //   price: number;
// // //   durationDays: number;
// // //   type: string;
// // //   description: string;
// // //   features: {
// // //     students: string | number;
// // //     classes: string | number;
// // //     subjects: string | number;
// // //     departments: string | number;
// // //     library: boolean;
// // //     transport: boolean;
// // //   };
// // //   featured?: boolean;
// // // }

// // // // Props interface for PlanCard
// // // interface PlanCardProps {
// // //   plan: ICreatePlans;
// // //   calculatePrice: (price: number) => number;
// // //   handlePayment: (plan: ICreatePlans) => void;
// // //   handleEdit: (plan: ICreatePlans) => void;
// // //   handleDelete: (id: string) => void;
// // //   role: string;
// // //   loading: boolean;
// // //   isYearly: boolean;
// // // }

// // // const Membershipplancard = () => {
// // //   const routes = all_routes;
// // //   const [membershipdata, setMembershipdata] = useState<ICreatePlans[]>([]);
// // //   const [isYearly, setIsYearly] = useState(false);
// // //   const [loading, setLoading] = useState(false);
// // //   const [editingPlan, setEditingPlan] = useState<ICreatePlans | null>(null);
// // //   const [formData, setFormData] = useState({
// // //     planName: "",
// // //     planPrice: 0,
// // //     durationDays: 30,
// // //     planType: "",
// // //     studentsLimit: false,
// // //     studentsValue: 100,
// // //     classesLimit: false,
// // //     classesValue: 10,
// // //     subjectsLimit: false,
// // //     subjectsValue: 20,
// // //     departmentsLimit: false,
// // //     departmentsValue: 5,
// // //     library: false,
// // //     transport: false,
// // //     featured: false,
// // //   });
// // //   const role = useSelector((state: any) => state.auth?.userObj?.role);

// // //   // Load Razorpay script
// // //   useEffect(() => {
// // //     const script = document.createElement("script");
// // //     script.src = "https://checkout.razorpay.com/v1/checkout.js";
// // //     script.async = true;
// // //     document.body.appendChild(script);
// // //     return () => {
// // //       document.body.removeChild(script);
// // //     };
// // //   }, []);

// // //   // Fetch all plans
// // //   const fetchPlans = async () => {
// // //     setLoading(true);
// // //     try {
// // //       const res = await getAllPlans();
// // //       console.log("Fetched plans:", res.data); // Debug data structure
// // //       setMembershipdata(res.data as any );
// // //     } catch (error: any) {
// // //       console.error("Fetch plans error:", error.response?.data || error.message);
// // //       toast.error(`Failed to load plans: ${error.message || "Unknown error"}`);
// // //     } finally {
// // //       setLoading(false);
// // //     }
// // //   };

// // //   useEffect(() => {
// // //     fetchPlans();
// // //   }, []);

// // //   // Toggle between monthly and yearly
// // //   const handleToggle = () => {
// // //     setIsYearly((prev) => !prev);
// // //   };

// // //   // Calculate price with discount for yearly
// // //   const calculatePrice = (price: number) => {
// // //     return isYearly ? Math.round(price * 12 * 0.8) : price;
// // //   };

// // //   // Handle payment
// // //   const handlePayment = async (plan: ICreatePlans) => {
// // //     console.log("plan id",plan);
// // //     try {
// // //       setLoading(true);
// // //       const response = await BaseApi.postRequest("/school/create-order", {
// // //         planId: plan.id,
// // //         amount: calculatePrice(plan.price),
// // //         schoolId: localStorage.getItem("schoolId"),
// // //         duration: isYearly ? "yearly" : "monthly",
// // //       });

// // //       if (!response.data.success) {
// // //         throw new Error("Failed to create order");
// // //       }

// // //       const options = {
// // //         key: import.meta.env.REACT_APP_RAZORPAY_KEY_ID || "rzp_test_EJh0TkmUgkZNyG",
// // //         amount: response.data.amount,
// // //         currency: response.data.currency,
// // //         name: "LearnXChain",
// // //         description: `${plan.name} Membership (${isYearly ? "Yearly" : "Monthly"})`,
// // //         order_id: response.data.orderId,
// // //         handler: async function (response: any) {
// // //           try {
// // //             const verifyRes = await BaseApi.postRequest("/school/verify-payment", {
// // //               razorpay_payment_id: response.razorpay_payment_id,
// // //               razorpay_order_id: response.razorpay_order_id,
// // //               razorpay_signature: response.razorpay_signature,
// // //               planId: plan.id,
// // //               schoolId: localStorage.getItem("schoolId") || "",
// // //             });
// // //             console.log("verify res",verifyRes.status);
// // //             if (verifyRes.status) {
// // //               toast.success("Payment successful! Your plan is now active.");
// // //             } else {
// // //               toast.error("Payment verified but subscription failed.");
// // //             }
// // //           } catch (error: any) {
// // //             toast.error("Payment verification failed");
// // //             console.error("Verification error:", error.response?.data || error.message);
// // //           }
// // //         },
// // //         prefill: {
// // //           name: localStorage.getItem("userName") || "",
// // //           email: localStorage.getItem("userEmail") || "",
// // //           contact: localStorage.getItem("userPhone") || "",
// // //         },
// // //         theme: {
// // //           color: "#0d6efd",
// // //         },
// // //       };

// // //       if (!(window as any).Razorpay) {
// // //         toast.error("Razorpay SDK not loaded. Please try again.");
// // //         return;
// // //       }

// // //       const rzp = new (window as any).Razorpay(options);
// // //       rzp.on("payment.failed", function (response: any) {
// // //         toast.error("Payment failed: " + response.error.description);
// // //         console.error("Payment failed:", response.error);
// // //       });
// // //       rzp.open();
// // //     } catch (error: any) {
// // //       toast.error("Payment initiation failed");
// // //       console.error("Payment error:", error.response?.data || error.message);
// // //     } finally {
// // //       setLoading(false);
// // //     }
// // //   };

// // //   // Handle form change
// // //   const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
// // //     const { name, value, type, checked } = e.target;
// // //     setFormData((prev) => ({
// // //       ...prev,
// // //       [name]: type === "checkbox" ? checked : value,
// // //     }));
// // //   };

// // //   // Handle form submission for add/edit
// // //   const handleSubmit = async (e: React.FormEvent, isEdit: boolean) => {
// // //     e.preventDefault();
// // //     const planData: any = {
// // //      // id: isEdit ? editingPlan!.id : Date.now().toString(),
// // //       name: formData.planName,
// // //       price: parseFloat(formData.planPrice.toString()),
// // //       durationDays: parseInt(formData.durationDays.toString()) || 30,
// // //       // type: formData.planType,
// // //       // description: "Default description", // Replace with dynamic description if needed
// // //       // features: {
// // //       //   students: formData.studentsLimit ? "unlimited" : formData.studentsValue,
// // //       //   classes: formData.classesLimit ? "unlimited" : formData.classesValue,
// // //       //   subjects: formData.subjectsLimit ? "unlimited" : formData.subjectsValue,
// // //       //   departments: formData.departmentsLimit ? "unlimited" : formData.departmentsValue,
// // //       //   library: formData.library,
// // //       //   transport: formData.transport,
// // //       // },
// // //       // featured: formData.featured,
// // //     };

// // //     try {
// // //       setLoading(true);
// // //       if (isEdit) {
// // //         await updatePlan(planData.id, planData);
// // //         toast.success("Plan updated successfully");
// // //       } else {
// // //         await createPlan(planData);
// // //         toast.success("Plan created successfully");
// // //       }
// // //       fetchPlans();
// // //       (document.getElementById("closeModal") as HTMLElement)?.click();
// // //     } catch (error: any) {
// // //       toast.error(isEdit ? "Failed to update plan" : "Failed to create plan");
// // //       console.error("Error:", error.response?.data || error.message);
// // //     } finally {
// // //       setLoading(false);
// // //     }
// // //   };

// // //   // Handle plan deletion
// // //   const handleDelete = async (id: string) => {
// // //     if (!window.confirm("Are you sure you want to delete this plan?")) return;

// // //     try {
// // //       setLoading(true);
// // //       await deletePlan(id);
// // //       toast.success("Plan deleted successfully");
// // //       fetchPlans();
// // //     } catch (error: any) {
// // //       toast.error("Failed to delete plan");
// // //       console.error("Error:", error.response?.data || error.message);
// // //     } finally {
// // //       setLoading(false);
// // //     }
// // //   };

// // //   // Set form data when editingPlan changes
// // //   useEffect(() => {
// // //     if (editingPlan) {
// // //       setFormData({
// // //         planName: editingPlan.name,
// // //         planPrice: editingPlan.price,
// // //         durationDays: editingPlan.durationDays,
// // //         planType: editingPlan.type,
// // //         studentsLimit: editingPlan.features.students === "unlimited",
// // //         studentsValue: editingPlan.features.students !== "unlimited" ? Number(editingPlan.features.students) : 100,
// // //         classesLimit: editingPlan.features.classes === "unlimited",
// // //         classesValue: editingPlan.features.classes !== "unlimited" ? Number(editingPlan.features.classes) : 10,
// // //         subjectsLimit: editingPlan.features.subjects === "unlimited",
// // //         subjectsValue: editingPlan.features.subjects !== "unlimited" ? Number(editingPlan.features.subjects) : 20,
// // //         departmentsLimit: editingPlan.features.departments === "unlimited",
// // //         departmentsValue: editingPlan.features.departments !== "unlimited" ? Number(editingPlan.features.departments) : 5,
// // //         library: editingPlan.features.library,
// // //         transport: editingPlan.features.transport,
// // //         featured: editingPlan.featured || false,
// // //       });
// // //     }
// // //   }, [editingPlan]);

// // //   return (
// // //     <div className="page-wrapper">
// // //      <ToastContainer position="top-center" autoClose={3000} />
// // //       <div className="content">
// // //         {/* Page Header */}
// // //         <div className="d-md-flex d-block align-items-center justify-content-between mb-3">
// // //           <div className="my-auto mb-2">
// // //             <h3 className="page-title mb-1">Membership Plans</h3>
// // //             <nav>
// // //               <ol className="breadcrumb mb-0">
// // //                 <li className="breadcrumb-item">
// // //                   <Link to={routes.adminDashboard}>Dashboard</Link>
// // //                 </li>
// // //                 <li className="breadcrumb-item">Membership</li>
// // //                 <li className="breadcrumb-item active" aria-current="page">
// // //                   Membership Plans
// // //                 </li>
// // //               </ol>
// // //             </nav>
// // //           </div>
// // //           {role === "superadmin" && (
// // //             <div className="d-flex my-xl-auto right-content align-items-center flex-wrap">
// // //               <TooltipOption />
// // //               <div className="mb-2">
// // //                 <button
// // //                   className="btn btn-primary d-flex align-items-center"
// // //                   data-bs-toggle="modal"
// // //                   data-bs-target="#planModal"
// // //                   onClick={() => setEditingPlan(null)}
// // //                 >
// // //                   <i className="ti ti-square-rounded-plus me-2" />
// // //                   Add Plan
// // //                 </button>
// // //               </div>
// // //             </div>
// // //           )}
// // //         </div>

// // //         {/* Toggle Switch */}
// // //         <div className="card border-0 mb-4">
// // //           <div className="card-body text-center">
// // //             <div className="d-inline-flex align-items-center">
// // //               <span className={`me-2 ${!isYearly ? "fw-bold text-primary" : ""}`}>Monthly</span>
// // //               <div className="form-check form-switch d-inline-block">
// // //                 <input
// // //                   className="form-check-input"
// // //                   type="checkbox"
// // //                   role="switch"
// // //                   aria-label="Toggle between monthly and yearly pricing"
// // //                   checked={isYearly}
// // //                   onChange={handleToggle}
// // //                 />
// // //               </div>
// // //               <span className={`ms-2 ${isYearly ? "fw-bold text-primary" : ""}`}>Yearly (20% off)</span>
// // //             </div>
// // //           </div>
// // //         </div>

// // //         {/* Plans Grid */}
// // //         {loading && !membershipdata.length ? (
// // //           <div className="text-center py-5">
// // //             <div className="spinner-border text-primary" role="status">
// // //               <span className="visually-hidden">Loading...</span>
// // //             </div>
// // //           </div>
// // //         ) : (
// // //           <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
// // //             {membershipdata.map((plan) => (
// // //               <PlanCard
// // //                 key={plan.id}
// // //                 plan={plan}
// // //                 calculatePrice={calculatePrice}
// // //                 handlePayment={handlePayment}
// // //                 handleEdit={setEditingPlan}
// // //                 handleDelete={handleDelete}
// // //                 role={role}
// // //                 loading={loading}
// // //                 isYearly={isYearly}
// // //               />
// // //             ))}
// // //           </div>
// // //         )}
// // //       </div>

// // //       {/* Plan Modal (Add/Edit) */}
// // //       <PlanModal
// // //         editingPlan={editingPlan}
// // //         formData={formData}
// // //         handleFormChange={handleFormChange}
// // //         handleSubmit={handleSubmit}
// // //         loading={loading}
// // //       />
// // //     </div>
// // //   );
// // // };

// // // // Sub-component: PlanCard (Fixed Version)
// // // const PlanCard: React.FC<PlanCardProps> = ({
// // //   plan,
// // //   calculatePrice,
// // //   handlePayment,
// // //   handleEdit,
// // //   handleDelete,
// // //   role,
// // //   loading,
// // //   isYearly,
// // // }) => {
// // //   // Safeguard: If plan is missing, show a fallback
// // //   if (!plan) {
// // //     return <div className="col">Plan data is missing.</div>;
// // //   }

// // //   // Default values to prevent undefined errors
// // //   const features = plan.features || {
// // //     students: "N/A",
// // //     classes: "N/A",
// // //     subjects: "N/A",
// // //     library: false,
// // //     transport: false,
// // //   };
// // //   const price = plan.price || 0;
// // //  // const description = plan.description || "No description available";

// // //   return (
// // //     <div className="col">
// // //       <div className={`card h-100 ${plan.featured ? "border-primary border-2" : ""}`}>
// // //         {plan.featured && (
// // //           <div className="card-header bg-primary text-white text-center">Most Popular</div>
// // //         )}
// // //         <div className="card-body d-flex flex-column">
// // //           <div className="mb-3">
// // //             <span
// // //               className={`badge ${plan.type === "Enterprise" ? "bg-info" : "bg-secondary"} mb-2`}
// // //             >
// // //               {plan.name || "Unnamed Plan"}
// // //             </span>
// // //            {/* /<h3 className="h4">{plan.type || "Unknown Type"}</h3>
// // //             <p className="text-muted">{description}</p> */}
// // //           </div>

// // //           <div className="bg-light p-3 rounded text-center mb-4">
// // //             <h2 className="mb-0">
// // //               ₹{calculatePrice(price)}
// // //               <small className="text-muted fs-6 fw-normal">{isYearly ? "/year" : "/month"}</small>
// // //             </h2>
// // //             {isYearly && (
// // //               <small className="text-success">
// // //                 Save ₹{price * 12 - calculatePrice(price)} annually
// // //               </small>
// // //             )}
// // //           </div>

// // //           <ul className="list-unstyled mb-4">
// // //             <li className="mb-2">
// // //               <i className="ti ti-check text-success me-2"></i>
// // //               {features.students === "unlimited" ? "Unlimited" : features.students} Students
// // //             </li>
// // //             <li className="mb-2">
// // //               <i className="ti ti-check text-success me-2"></i>
// // //               {features.classes === "unlimited" ? "Unlimited" : features.classes} Classes
// // //             </li>
// // //             <li className="mb-2">
// // //               <i className="ti ti-check text-success me-2"></i>
// // //               {features.subjects === "unlimited" ? "Unlimited" : features.subjects} Subjects
// // //             </li>
// // //             <li className="mb-2">
// // //               <i
// // //                 className={`ti ti-${features.library ? "check" : "x"} text-${features.library ? "success" : "danger"
// // //                   } me-2`}
// // //               ></i>
// // //               Library Access
// // //             </li>
// // //             <li className="mb-2">
// // //               <i
// // //                 className={`ti ti-${features.transport ? "check" : "x"} text-${features.transport ? "success" : "danger"
// // //                   } me-2`}
// // //               ></i>
// // //               Transport Module
// // //             </li>
// // //           </ul>

// // //           <div className="mt-auto">
// // //             <button
// // //               className="btn btn-primary w-100 mb-2"
// // //               onClick={() => handlePayment(plan)}
// // //               disabled={loading}
// // //             >
// // //               {loading ? "Processing..." : "Choose Plan"}
// // //             </button>

// // //             {role === "superadmin" && (
// // //               <div className="d-flex gap-2">
// // //                 <button
// // //                   className="btn btn-outline-secondary flex-grow-1"
// // //                   data-bs-toggle="modal"
// // //                   data-bs-target="#planModal"
// // //                   onClick={() => handleEdit(plan)}
// // //                 >
// // //                   Edit
// // //                 </button>
// // //                 <button
// // //                   className="btn btn-outline-danger flex-grow-1"
// // //                   onClick={() => handleDelete(plan.id)}
// // //                   disabled={loading}
// // //                 >
// // //                   Delete
// // //                 </button>
// // //               </div>
// // //             )}
// // //           </div>
// // //         </div>
// // //       </div>
// // //     </div>
// // //   );
// // // };

// // // // Sub-component: PlanModal
// // // const PlanModal = ({ editingPlan, formData, handleFormChange, handleSubmit, loading }: any) => (
// // //   <div className="modal fade" id="planModal">
// // //     <div className="modal-dialog modal-dialog-centered modal-lg">
// // //       <div className="modal-content">
// // //         <div className="modal-header">
// // //           <h4 className="modal-title">{editingPlan ? "Edit Plan" : "Add New Plan"}</h4>
// // //           <button
// // //             type="button"
// // //             className="btn-close"
// // //             data-bs-dismiss="modal"
// // //             aria-label="Close"
// // //             id="closeModal"
// // //           ></button>
// // //         </div>
// // //         <form onSubmit={(e) => handleSubmit(e, !!editingPlan)}>
// // //           <div className="modal-body">
// // //             <div className="row g-3">
// // //               <div className="col-md-6">
// // //                 <label className="form-label">Plan Name</label>
// // //                 <input
// // //                   type="text"
// // //                   name="planName"
// // //                   className="form-control"
// // //                   value={formData.planName}
// // //                   onChange={handleFormChange}
// // //                   required
// // //                 />
// // //               </div>
// // //               <div className="col-md-6">
// // //                 <label className="form-label">Plan Type</label>
// // //                 <CommonSelect
// // //                   name="planType"
// // //                   options={membershipplan}
// // //                   value={membershipplan.find((option) => option.value === formData.planType)}
// // //                   onChange={(option: any) =>
// // //                     handleFormChange({ target: { name: "planType", value: option.value } } as any)
// // //                   }
// // //                 />
// // //               </div>
// // //               <div className="col-md-6">
// // //                 <label className="form-label">Monthly Price (₹)</label>
// // //                 <input
// // //                   type="number"
// // //                   name="planPrice"
// // //                   className="form-control"
// // //                   min="0"
// // //                   step="0.01"
// // //                   value={formData.planPrice}
// // //                   onChange={handleFormChange}
// // //                   required
// // //                 />
// // //               </div>
// // //               <div className="col-md-6">
// // //                 <label className="form-label">Duration (Days)</label>
// // //                 <input
// // //                   type="number"
// // //                   name="durationDays"
// // //                   className="form-control"
// // //                   min="1"
// // //                   value={formData.durationDays}
// // //                   onChange={handleFormChange}
// // //                   required
// // //                 />
// // //               </div>

// // //               {/* Features Section */}
// // //               <div className="col-12 mt-4">
// // //                 <h5>Plan Features</h5>
// // //                 <hr />
// // //               </div>

// // //               {/* Students Limit */}
// // //               <div className="col-md-6">
// // //                 <div className="form-check form-switch mb-2">
// // //                   <input
// // //                     className="form-check-input"
// // //                     type="checkbox"
// // //                     name="studentsLimit"
// // //                     id="studentsLimit"
// // //                     checked={formData.studentsLimit}
// // //                     onChange={handleFormChange}
// // //                   />
// // //                   <label className="form-check-label" htmlFor="studentsLimit">
// // //                     Unlimited Students
// // //                   </label>
// // //                 </div>
// // //                 <input
// // //                   type="number"
// // //                   name="studentsValue"
// // //                   className="form-control"
// // //                   min="1"
// // //                   disabled={formData.studentsLimit}
// // //                   value={formData.studentsValue}
// // //                   onChange={handleFormChange}
// // //                 />
// // //               </div>

// // //               {/* Classes Limit */}
// // //               <div className="col-md-6">
// // //                 <div className="form-check form-switch mb-2">
// // //                   <input
// // //                     className="form-check-input"
// // //                     type="checkbox"
// // //                     name="classesLimit"
// // //                     id="classesLimit"
// // //                     checked={formData.classesLimit}
// // //                     onChange={handleFormChange}
// // //                   />
// // //                   <label className="form-check-label" htmlFor="classesLimit">
// // //                     Unlimited Classes
// // //                   </label>
// // //                 </div>
// // //                 <input
// // //                   type="number"
// // //                   name="classesValue"
// // //                   className="form-control"
// // //                   min="1"
// // //                   disabled={formData.classesLimit}
// // //                   value={formData.classesValue}
// // //                   onChange={handleFormChange}
// // //                 />
// // //               </div>

// // //               {/* Subjects Limit */}
// // //               <div className="col-md-6">
// // //                 <div className="form-check form-switch mb-2">
// // //                   <input
// // //                     className="form-check-input"
// // //                     type="checkbox"
// // //                     name="subjectsLimit"
// // //                     id="subjectsLimit"
// // //                     checked={formData.subjectsLimit}
// // //                     onChange={handleFormChange}
// // //                   />
// // //                   <label className="form-check-label" htmlFor="subjectsLimit">
// // //                     Unlimited Subjects
// // //                   </label>
// // //                 </div>
// // //                 <input
// // //                   type="number"
// // //                   name="subjectsValue"
// // //                   className="form-control"
// // //                   min="1"
// // //                   disabled={formData.subjectsLimit}
// // //                   value={formData.subjectsValue}
// // //                   onChange={handleFormChange}
// // //                 />
// // //               </div>

// // //               {/* Departments Limit */}
// // //               <div className="col-md-6">
// // //                 <div className="form-check form-switch mb-2">
// // //                   <input
// // //                     className="form-check-input"
// // //                     type="checkbox"
// // //                     name="departmentsLimit"
// // //                     id="departmentsLimit"
// // //                     checked={formData.departmentsLimit}
// // //                     onChange={handleFormChange}
// // //                   />
// // //                   <label className="form-check-label" htmlFor="departmentsLimit">
// // //                     Unlimited Departments
// // //                   </label>
// // //                 </div>
// // //                 <input
// // //                   type="number"
// // //                   name="departmentsValue"
// // //                   className="form-control"
// // //                   min="1"
// // //                   disabled={formData.departmentsLimit}
// // //                   value={formData.departmentsValue}
// // //                   onChange={handleFormChange}
// // //                 />
// // //               </div>

// // //               {/* Additional Features */}
// // //               <div className="col-12">
// // //                 <div className="form-check form-switch mb-2">
// // //                   <input
// // //                     className="form-check-input"
// // //                     type="checkbox"
// // //                     name="library"
// // //                     id="library"
// // //                     checked={formData.library}
// // //                     onChange={handleFormChange}
// // //                   />
// // //                   <label className="form-check-label" htmlFor="library">
// // //                     Library Module
// // //                   </label>
// // //                 </div>
// // //                 <div className="form-check form-switch">
// // //                   <input
// // //                     className="form-check-input"
// // //                     type="checkbox"
// // //                     name="transport"
// // //                     id="transport"
// // //                     checked={formData.transport}
// // //                     onChange={handleFormChange}
// // //                   />
// // //                   <label className="form-check-label" htmlFor="transport">
// // //                     Transport Module
// // //                   </label>
// // //                 </div>
// // //               </div>

// // //               {/* Featured Plan Option */}
// // //               {editingPlan && (
// // //                 <div className="col-12">
// // //                   <div className="form-check form-switch">
// // //                     <input
// // //                       className="form-check-input"
// // //                       type="checkbox"
// // //                       name="featured"
// // //                       id="featured"
// // //                       checked={formData.featured}
// // //                       onChange={handleFormChange}
// // //                     />
// // //                     <label className="form-check-label" htmlFor="featured">
// // //                       Mark as Featured Plan
// // //                     </label>
// // //                   </div>
// // //                 </div>
// // //               )}
// // //             </div>
// // //           </div>
// // //           <div className="modal-footer">
// // //             <button type="button" className="btn btn-light" data-bs-dismiss="modal">
// // //               Cancel
// // //             </button>
// // //             <button type="submit" className="btn btn-primary" disabled={loading}>
// // //               {loading ? (
// // //                 <>
// // //                   <span className="spinner-border spinner-border-sm me-1" role="status"></span>
// // //                   {editingPlan ? "Updating..." : "Creating..."}
// // //                 </>
// // //               ) : editingPlan ? (
// // //                 "Update Plan"
// // //               ) : (
// // //                 "Create Plan"
// // //               )}
// // //             </button>
// // //           </div>
// // //         </form>
// // //       </div>
// // //     </div>
// // //   </div>
// // // );

// // // export default Membershipplancard;


// // import React, { useEffect, useState } from "react";
// // import { Link } from "react-router-dom";
// // import CommonSelect from "../../core/common/commonSelect";
// // import { membershipplan } from "../../core/common/selectoption/selectoption";
// // import TooltipOption from "../../core/common/tooltipOption";
// // import { all_routes } from "../../router/all_routes";
// // import { getAllPlans, createPlan, deletePlan, updatePlan } from "../../services/superadmin/planServices";
// // import { useSelector } from "react-redux";
// // import { toast } from "react-toastify";
// // import BaseApi from "../../services/BaseApi";
// // import { ToastContainer } from "react-toastify";

// // // Interface for plan data
// // export interface ICreatePlans {
// //   id: string;
// //   name: string;
// //   price: number;
// //   durationDays: number;
// //   type: string;
// //   description: string;
// //   features: {
// //     students: string | number;
// //     classes: string | number;
// //     subjects: string | number;
// //     departments: string | number;
// //     library: boolean;
// //     transport: boolean;
// //   };
// //   featured?: boolean;
// // }

// // // Props interface for PlanCard
// // interface PlanCardProps {
// //   plan: ICreatePlans;
// //   calculatePrice: (price: number) => number;
// //   handlePayment: (plan: ICreatePlans) => void;
// //   handleEdit: (plan: ICreatePlans) => void;
// //   handleDelete: (id: string) => void;
// //   role: string;
// //   isYearly: boolean;
// //   isPaid: boolean;
// //   isLoading: boolean; // New prop for per-plan loading state
// // }

// // const Membershipplancard = () => {
// //   const routes = all_routes;
// //   const [membershipdata, setMembershipdata] = useState<ICreatePlans[]>([]);
// //   const [isYearly, setIsYearly] = useState(false);
// //   const [loadingPlanId, setLoadingPlanId] = useState<string | null>(null); // Track loading per plan
// //   const [editingPlan, setEditingPlan] = useState<ICreatePlans | null>(null);
// //   const [paymentStatus, setPaymentStatus] = useState<Map<string, boolean>>(new Map());
// //   const [formData, setFormData] = useState({
// //     planName: "",
// //     planPrice: 0,
// //     durationDays: 30,
// //     planType: "",
// //     studentsLimit: false,
// //     studentsValue: 100,
// //     classesLimit: false,
// //     classesValue: 10,
// //     subjectsLimit: false,
// //     subjectsValue: 20,
// //     departmentsLimit: false,
// //     departmentsValue: 5,
// //     library: false,
// //     transport: false,
// //     featured: false,
// //   });
// //   const role = useSelector((state: any) => state.auth?.userObj?.role);

// //   // Load Razorpay script
// //   useEffect(() => {
// //     const script = document.createElement("script");
// //     script.src = "https://checkout.razorpay.com/v1/checkout.js";
// //     script.async = true;
// //     document.body.appendChild(script);
// //     return () => {
// //       document.body.removeChild(script);
// //     };
// //   }, []);

// //   // Fetch all plans
// //   const fetchPlans = async () => {
// //     setLoadingPlanId("all"); // Temporary loading for all plans
// //     try {
// //       const res = await getAllPlans();
// //       console.log("Fetched plans:", res.data);
// //       setMembershipdata(res.data as any);
// //     } catch (error: any) {
// //       console.error("Fetch plans error:", error.response?.data || error.message);
// //       toast.error(`Failed to load plans: ${error.message || "Unknown error"}`);
// //     } finally {
// //       setLoadingPlanId(null);
// //     }
// //   };

// //   useEffect(() => {
// //     fetchPlans();
// //   }, []);

// //   // Toggle between monthly and yearly
// //   const handleToggle = () => {
// //     setIsYearly((prev) => !prev);
// //   };

// //   // Calculate price with discount for yearly
// //   const calculatePrice = (price: number) => {
// //     return isYearly ? Math.round(price * 12 * 0.8) : price;
// //   };

// //   // Handle payment
// //   const handlePayment = async (plan: ICreatePlans) => {
// //     console.log("plan id", plan);
// //     try {
// //       setLoadingPlanId(plan.id); // Set loading for this plan only
// //       const response = await BaseApi.postRequest("/school/create-order", {
// //         planId: plan.id,
// //         amount: calculatePrice(plan.price),
// //         schoolId: localStorage.getItem("schoolId"),
// //         duration: isYearly ? "yearly" : "monthly",
// //       });

// //       if (!response.data.success) {
// //         throw new Error("Failed to create order");
// //       }

// //       const options = {
// //         key: import.meta.env.REACT_APP_RAZORPAY_KEY_ID || "rzp_test_EJh0TkmUgkZNyG",
// //         amount: response.data.amount,
// //         currency: response.data.currency,
// //         name: "LearnXChain",
// //         description: `${plan.name} Membership (${isYearly ? "Yearly" : "Monthly"})`,
// //         order_id: response.data.orderId,
// //         handler: async function (response: any) {
// //           try {
// //             const verifyRes = await BaseApi.postRequest("/school/verify-payment", {
// //               razorpay_payment_id: response.razorpay_payment_id,
// //               razorpay_order_id: response.razorpay_order_id,
// //               razorpay_signature: response.razorpay_signature,
// //               planId: plan.id,
// //               schoolId: localStorage.getItem("schoolId") || "",
// //             });
// //             console.log("verify res", verifyRes.status);
// //             if (verifyRes.status) {
// //               toast.success("Payment successful! Your plan is now active.");
// //               setPaymentStatus((prev) => {
// //                 const newStatus = new Map(prev);
// //                 newStatus.set(plan.id, true);
// //                 return newStatus;
// //               });
// //             } else {
// //               toast.error("Payment verified but subscription failed.");
// //             }
// //           } catch (error: any) {
// //             toast.error("Payment verification failed");
// //             console.error("Verification error:", error.response?.data || error.message);
// //           }
// //         },
// //         prefill: {
// //           name: localStorage.getItem("userName") || "",
// //           email: localStorage.getItem("userEmail") || "",
// //           contact: localStorage.getItem("userPhone") || "",
// //         },
// //         theme: {
// //           color: "#0d6efd",
// //         },
// //       };

// //       if (!(window as any).Razorpay) {
// //         toast.error("Razorpay SDK not loaded. Please try again.");
// //         return;
// //       }

// //       const rzp = new (window as any).Razorpay(options);
// //       rzp.on("payment.failed", function (response: any) {
// //         toast.error("Payment failed: " + response.error.description);
// //         console.error("Payment failed:", response.error);
// //       });
// //       rzp.open();
// //     } catch (error: any) {
// //       toast.error("Payment initiation failed");
// //       console.error("Payment error:", error.response?.data || error.message);
// //     } finally {
// //       setLoadingPlanId(null);
// //     }
// //   };

// //   // Handle form change
// //   const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
// //     const { name, value, type, checked } = e.target;
// //     setFormData((prev) => ({
// //       ...prev,
// //       [name]: type === "checkbox" ? checked : value,
// //     }));
// //   };

// //   // Handle form submission for add/edit
// //   const handleSubmit = async (e: React.FormEvent, isEdit: boolean) => {
// //     e.preventDefault();
// //     const planData: any = {
// //       name: formData.planName,
// //       price: parseFloat(formData.planPrice.toString()),
// //       durationDays: parseInt(formData.durationDays.toString()) || 30,
// //     };

// //     try {
// //       setLoadingPlanId("modal"); // Loading for modal submission
// //       if (isEdit) {
// //         await updatePlan(planData.id, planData);
// //         toast.success("Plan updated successfully");
// //       } else {
// //         await createPlan(planData);
// //         toast.success("Plan created successfully");
// //       }
// //       fetchPlans();
// //       (document.getElementById("closeModal") as HTMLElement)?.click();
// //     } catch (error: any) {
// //       toast.error(isEdit ? "Failed to update plan" : "Failed to create plan");
// //       console.error("Error:", error.response?.data || error.message);
// //     } finally {
// //       setLoadingPlanId(null);
// //     }
// //   };

// //   // Handle plan deletion
// //   const handleDelete = async (id: string) => {
// //     if (!window.confirm("Are you sure you want to delete this plan?")) return;

// //     try {
// //       setLoadingPlanId(id);
// //       await deletePlan(id);
// //       toast.success("Plan deleted successfully");
// //       fetchPlans();
// //     } catch (error: any) {
// //       toast.error("Failed to delete plan");
// //       console.error("Error:", error.response?.data || error.message);
// //     } finally {
// //       setLoadingPlanId(null);
// //     }
// //   };

// //   // Set form data when editingPlan changes
// //   useEffect(() => {
// //     if (editingPlan) {
// //       setFormData({
// //         planName: editingPlan.name,
// //         planPrice: editingPlan.price,
// //         durationDays: editingPlan.durationDays,
// //         planType: editingPlan.type,
// //         studentsLimit: editingPlan.features.students === "unlimited",
// //         studentsValue: editingPlan.features.students !== "unlimited" ? Number(editingPlan.features.students) : 100,
// //         classesLimit: editingPlan.features.classes === "unlimited",
// //         classesValue: editingPlan.features.classes !== "unlimited" ? Number(editingPlan.features.classes) : 10,
// //         subjectsLimit: editingPlan.features.subjects === "unlimited",
// //         subjectsValue: editingPlan.features.subjects !== "unlimited" ? Number(editingPlan.features.subjects) : 20,
// //         departmentsLimit: editingPlan.features.departments === "unlimited",
// //         departmentsValue: editingPlan.features.departments !== "unlimited" ? Number(editingPlan.features.departments) : 5,
// //         library: editingPlan.features.library,
// //         transport: editingPlan.features.transport,
// //         featured: editingPlan.featured || false,
// //       });
// //     }
// //   }, [editingPlan]);

// //   return (
// //     <div className="page-wrapper">
// //       <ToastContainer position="top-center" autoClose={3000} />
// //       <div className="content">
// //         {/* Page Header */}
// //         <div className="d-md-flex d-block align-items-center justify-content-between mb-3">
// //           <div className="my-auto mb-2">
// //             <h3 className="page-title mb-1">Membership Plans</h3>
// //             <nav>
// //               <ol className="breadcrumb mb-0">
// //                 <li className="breadcrumb-item">
// //                   <Link to={routes.adminDashboard}>Dashboard</Link>
// //                 </li>
// //                 <li className="breadcrumb-item">Membership</li>
// //                 <li className="breadcrumb-item active" aria-current="page">
// //                   Membership Plans
// //                 </li>
// //               </ol>
// //             </nav>
// //           </div>
// //           {role === "superadmin" && (
// //             <div className="d-flex my-xl-auto right-content align-items-center flex-wrap">
// //               <TooltipOption />
// //               <div className="mb-2">
// //                 <button
// //                   className="btn btn-primary d-flex align-items-center"
// //                   data-bs-toggle="modal"
// //                   data-bs-target="#planModal"
// //                   onClick={() => setEditingPlan(null)}
// //                 >
// //                   <i className="ti ti-square-rounded-plus me-2" />
// //                   Add Plan
// //                 </button>
// //               </div>
// //             </div>
// //           )}
// //         </div>

// //         {/* Toggle Switch */}
// //         <div className="card border-0 mb-4">
// //           <div className="card-body text-center">
// //             <div className="d-inline-flex align-items-center">
// //               <span className={`me-2 ${!isYearly ? "fw-bold text-primary" : ""}`}>Monthly</span>
// //               <div className="form-check form-switch d-inline-block">
// //                 <input
// //                   className="form-check-input"
// //                   type="checkbox"
// //                   role="switch"
// //                   aria-label="Toggle between monthly and yearly pricing"
// //                   checked={isYearly}
// //                   onChange={handleToggle}
// //                 />
// //               </div>
// //               <span className={`ms-2 ${isYearly ? "fw-bold text-primary" : ""}`}>Yearly (20% off)</span>
// //             </div>
// //           </div>
// //         </div>

// //         {/* Plans Grid */}
// //         {loadingPlanId === "all" && !membershipdata.length ? (
// //           <div className="text-center py-5">
// //             <div className="spinner-border text-primary" role="status">
// //               <span className="visually-hidden">Loading...</span>
// //             </div>
// //           </div>
// //         ) : (
// //           <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
// //             {membershipdata.map((plan) => (
// //               <PlanCard
// //                 key={plan.id}
// //                 plan={plan}
// //                 calculatePrice={calculatePrice}
// //                 handlePayment={handlePayment}
// //                 handleEdit={setEditingPlan}
// //                 handleDelete={handleDelete}
// //                 role={role}
// //                 isYearly={isYearly}
// //                 isPaid={paymentStatus.get(plan.id) || false}
// //                 isLoading={loadingPlanId === plan.id} // Pass per-plan loading state
// //               />
// //             ))}
// //           </div>
// //         )}
// //       </div>

// //       {/* Plan Modal (Add/Edit) */}
// //       <PlanModal
// //         editingPlan={editingPlan}
// //         formData={formData}
// //         handleFormChange={handleFormChange}
// //         handleSubmit={handleSubmit}
// //         loading={loadingPlanId === "modal"}
// //       />
// //     </div>
// //   );
// // };

// // // Sub-component: PlanCard
// // const PlanCard: React.FC<PlanCardProps> = ({
// //   plan,
// //   calculatePrice,
// //   handlePayment,
// //   handleEdit,
// //   handleDelete,
// //   role,
// //   isYearly,
// //   isPaid,
// //   isLoading,
// // }) => {
// //   // Safeguard: If plan is missing, show a fallback
// //   if (!plan) {
// //     return <div className="col">Plan data is missing.</div>;
// //   }

// //   // Default values to prevent undefined errors
// //   const features = plan.features || {
// //     students: "N/A",
// //     classes: "N/A",
// //     subjects: "N/A",
// //     library: false,
// //     transport: false,
// //   };
// //   const price = plan.price || 0;

// //   return (
// //     <div className="col">
// //       <div className={`card h-100 ${plan.featured ? "border-primary border-2" : ""}`}>
// //         {plan.featured && (
// //           <div className="card-header bg-primary text-white text-center">Most Popular</div>
// //         )}
// //         <div className="card-body d-flex flex-column">
// //           <div className="mb-3">
// //             <span
// //               className={`badge ${plan.type === "Enterprise" ? "bg-info" : "bg-secondary"} mb-2`}
// //             >
// //               {plan.name || "Unnamed Plan"}
// //             </span>
// //           </div>

// //           <div className="bg-light p-3 rounded text-center mb-4">
// //             <h2 className="mb-0">
// //               ₹{calculatePrice(price)}
// //               <small className="text-muted fs-6 fw-normal">{isYearly ? "/year" : "/month"}</small>
// //             </h2>
// //             {isYearly && (
// //               <small className="text-success">
// //                 Save ₹{price * 12 - calculatePrice(price)} annually
// //               </small>
// //             )}
// //           </div>

// //           <ul className="list-unstyled mb-4">
// //             <li className="mb-2">
// //               <i className="ti ti-check text-success me-2"></i>
// //               {features.students === "unlimited" ? "Unlimited" : features.students} Students
// //             </li>
// //             <li className="mb-2">
// //               <i className="ti ti-check text-success me-2"></i>
// //               {features.classes === "unlimited" ? "Unlimited" : features.classes} Classes
// //             </li>
// //             <li className="mb-2">
// //               <i className="ti ti-check text-success me-2"></i>
// //               {features.subjects === "unlimited" ? "Unlimited" : features.subjects} Subjects
// //             </li>
// //             <li className="mb-2">
// //               <i
// //                 className={`ti ti-${features.library ? "check" : "x"} text-${features.library ? "success" : "danger"} me-2`}
// //               ></i>
// //               Library Access
// //             </li>
// //             <li className="mb-2">
// //               <i
// //                 className={`ti ti-${features.transport ? "check" : "x"} text-${features.transport ? "success" : "danger"} me-2`}
// //               ></i>
// //               Transport Module
// //             </li>
// //           </ul>

// //           <div className="mt-auto">
// //             {/* Conditionally render Plan Active or Upgrade Plan */}
// //             {isPaid ? (
// //               <div className="btn btn-success w-100 mb-2 disabled">Plan Active</div>
// //             ) : (
// //               <button
// //                 className="btn btn-primary w-100 mb-2"
// //                 onClick={() => handlePayment(plan)}
// //                 disabled={isLoading}
// //               >
// //                 {isLoading ? "Processing..." : "Upgrade Plan"}
// //               </button>
// //             )}

// //             {role === "superadmin" && (
// //               <div className="d-flex gap-2">
// //                 <button
// //                   className="btn btn-outline-secondary flex-grow-1"
// //                   data-bs-toggle="modal"
// //                   data-bs-target="#planModal"
// //                   onClick={() => handleEdit(plan)}
// //                 >
// //                   Edit
// //                 </button>
// //                 <button
// //                   className="btn btn-outline-danger flex-grow-1"
// //                   onClick={() => handleDelete(plan.id)}
// //                   disabled={isLoading}
// //                 >
// //                   Delete
// //                 </button>
// //               </div>
// //             )}
// //           </div>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // };

// // // Sub-component: PlanModal
// // const PlanModal = ({ editingPlan, formData, handleFormChange, handleSubmit, loading }: any) => (
// //   <div className="modal fade" id="planModal">
// //     <div className="modal-dialog modal-dialog-centered modal-lg">
// //       <div className="modal-content">
// //         <div className="modal-header">
// //           <h4 className="modal-title">{editingPlan ? "Edit Plan" : "Add New Plan"}</h4>
// //           <button
// //             type="button"
// //             className="btn-close"
// //             data-bs-dismiss="modal"
// //             aria-label="Close"
// //             id="closeModal"
// //           ></button>
// //         </div>
// //         <form onSubmit={(e) => handleSubmit(e, !!editingPlan)}>
// //           <div className="modal-body">
// //             <div className="row g-3">
// //               <div className="col-md-6">
// //                 <label className="form-label">Plan Name</label>
// //                 <input
// //                   type="text"
// //                   name="planName"
// //                   className="form-control"
// //                   value={formData.planName}
// //                   onChange={handleFormChange}
// //                   required
// //                 />
// //               </div>
// //               <div className="col-md-6">
// //                 <label className="form-label">Plan Type</label>
// //                 <CommonSelect
// //                   name="planType"
// //                   options={membershipplan}
// //                   value={membershipplan.find((option) => option.value === formData.planType)}
// //                   onChange={(option: any) =>
// //                     handleFormChange({ target: { name: "planType", value: option.value } } as any)
// //                   }
// //                 />
// //               </div>
// //               <div className="col-md-6">
// //                 <label className="form-label">Monthly Price (₹)</label>
// //                 <input
// //                   type="number"
// //                   name="planPrice"
// //                   className="form-control"
// //                   min="0"
// //                   step="0.01"
// //                   value={formData.planPrice}
// //                   onChange={handleFormChange}
// //                   required
// //                 />
// //               </div>
// //               <div className="col-md-6">
// //                 <label className="form-label">Duration (Days)</label>
// //                 <input
// //                   type="number"
// //                   name="durationDays"
// //                   className="form-control"
// //                   min="1"
// //                   value={formData.durationDays}
// //                   onChange={handleFormChange}
// //                   required
// //                 />
// //               </div>

// //               {/* Features Section */}
// //               <div className="col-12 mt-4">
// //                 <h5>Plan Features</h5>
// //                 <hr />
// //               </div>

// //               {/* Students Limit */}
// //               <div className="col-md-6">
// //                 <div className="form-check form-switch mb-2">
// //                   <input
// //                     className="form-check-input"
// //                     type="checkbox"
// //                     name="studentsLimit"
// //                     id="studentsLimit"
// //                     checked={formData.studentsLimit}
// //                     onChange={handleFormChange}
// //                   />
// //                   <label className="form-check-label" htmlFor="studentsLimit">
// //                     Unlimited Students
// //                   </label>
// //                 </div>
// //                 <input
// //                   type="number"
// //                   name="studentsValue"
// //                   className="form-control"
// //                   min="1"
// //                   disabled={formData.studentsLimit}
// //                   value={formData.studentsValue}
// //                   onChange={handleFormChange}
// //                 />
// //               </div>

// //               {/* Classes Limit */}
// //               <div className="col-md-6">
// //                 <div className="form-check form-switch mb-2">
// //                   <input
// //                     className="form-check-input"
// //                     type="checkbox"
// //                     name="classesLimit"
// //                     id="classesLimit"
// //                     checked={formData.classesLimit}
// //                     onChange={handleFormChange}
// //                   />
// //                   <label className="form-check-label" htmlFor="classesLimit">
// //                     Unlimited Classes
// //                   </label>
// //                 </div>
// //                 <input
// //                   type="number"
// //                   name="classesValue"
// //                   className="form-control"
// //                   min="1"
// //                   disabled={formData.classesLimit}
// //                   value={formData.classesValue}
// //                   onChange={handleFormChange}
// //                 />
// //               </div>

// //               {/* Subjects Limit */}
// //               <div className="col-md-6">
// //                 <div className="form-check form-switch mb-2">
// //                   <input
// //                     className="form-check-input"
// //                     type="checkbox"
// //                     name="subjectsLimit"
// //                     id="subjectsLimit"
// //                     checked={formData.subjectsLimit}
// //                     onChange={handleFormChange}
// //                   />
// //                   <label className="form-check-label" htmlFor="subjectsLimit">
// //                     Unlimited Subjects
// //                   </label>
// //                 </div>
// //                 <input
// //                   type="number"
// //                   name="subjectsValue"
// //                   className="form-control"
// //                   min="1"
// //                   disabled={formData.subjectsLimit}
// //                   value={formData.subjectsValue}
// //                   onChange={handleFormChange}
// //                 />
// //               </div>

// //               {/* Departments Limit */}
// //               <div className="col-md-6">
// //                 <div className="form-check form-switch mb-2">
// //                   <input
// //                     className="form-check-input"
// //                     type="checkbox"
// //                     name="departmentsLimit"
// //                     id="departmentsLimit"
// //                     checked={formData.departmentsLimit}
// //                     onChange={handleFormChange}
// //                   />
// //                   <label className="form-check-label" htmlFor="departmentsLimit">
// //                     Unlimited Departments
// //                   </label>
// //                 </div>
// //                 <input
// //                   type="number"
// //                   name="departmentsValue"
// //                   className="form-control"
// //                   min="1"
// //                   disabled={formData.departmentsLimit}
// //                   value={formData.departmentsValue}
// //                   onChange={handleFormChange}
// //                 />
// //               </div>

// //               {/* Additional Features */}
// //               <div className="col-12">
// //                 <div className="form-check form-switch mb-2">
// //                   <input
// //                     className="form-check-input"
// //                     type="checkbox"
// //                     name="library"
// //                     id="library"
// //                     checked={formData.library}
// //                     onChange={handleFormChange}
// //                   />
// //                   <label className="form-check-label" htmlFor="library">
// //                     Library Module
// //                   </label>
// //                 </div>
// //                 <div className="form-check form-switch">
// //                   <input
// //                     className="form-check-input"
// //                     type="checkbox"
// //                     name="transport"
// //                     id="transport"
// //                     checked={formData.transport}
// //                     onChange={handleFormChange}
// //                   />
// //                   <label className="form-check-label" htmlFor="transport">
// //                     Transport Module
// //                   </label>
// //                 </div>
// //               </div>

// //               {/* Featured Plan Option */}
// //               {editingPlan && (
// //                 <div className="col-12">
// //                   <div className="form-check form-switch">
// //                     <input
// //                       className="form-check-input"
// //                       type="checkbox"
// //                       name="featured"
// //                       id="featured"
// //                       checked={formData.featured}
// //                       onChange={handleFormChange}
// //                     />
// //                     <label className="form-check-label" htmlFor="featured">
// //                       Mark as Featured Plan
// //                     </label>
// //                   </div>
// //                 </div>
// //               )}
// //             </div>
// //           </div>
// //           <div className="modal-footer">
// //             <button type="button" className="btn btn-light" data-bs-dismiss="modal">
// //               Cancel
// //             </button>
// //             <button type="submit" className="btn btn-primary" disabled={loading}>
// //               {loading ? (
// //                 <>
// //                   <span className="spinner-border spinner-border-sm me-1" role="status"></span>
// //                   {editingPlan ? "Updating..." : "Creating..."}
// //                 </>
// //               ) : editingPlan ? (
// //                 "Update Plan"
// //               ) : (
// //                 "Create Plan"
// //               )}
// //             </button>
// //           </div>
// //         </form>
// //       </div>
// //     </div>
// //   </div>
// // );

// // export default Membershipplancard;



// import React, { useEffect, useState } from "react";
// import { Link } from "react-router-dom";
// import CommonSelect from "../../core/common/commonSelect";
// import { membershipplan } from "../../core/common/selectoption/selectoption";
// import TooltipOption from "../../core/common/tooltipOption";
// import { all_routes } from "../../router/all_routes";
// import { getAllPlans, createPlan, deletePlan, updatePlan } from "../../services/superadmin/planServices";
// import { useSelector } from "react-redux";
// import { toast } from "react-toastify";
// import BaseApi from "../../services/BaseApi";
// import { ToastContainer } from "react-toastify";
// import Modal from "react-bootstrap/Modal";
// import Button from "react-bootstrap/Button";
// import Form from "react-bootstrap/Form";

// // Interface for plan data
// export interface ICreatePlans {
//   id: string;
//   name: string;
//   price: number;
//   durationDays: number;
//   type: string;
//   description: string;
//   features: {
//     students: string | number;
//     classes: string | number;
//     subjects: string | number;
//     departments: string | number;
//     library: boolean;
//     transport: boolean;
//   };
//   featured?: boolean;
// }

// // Interface for coupon data
// interface Coupon {
//   id: number;
//   code: string;
//   discountType: "PERCENTAGE" | "FIXED";
//   discountValue: number;
//   expiryDate: string;
//   maxUsage: number;
//   usedCount: number;
// }

// // Props interface for PlanCard
// interface PlanCardProps {
//   plan: ICreatePlans;
//   calculatePrice: (price: number) => number;
//   handleUpgradePlan: (plan: ICreatePlans) => void;
//   handleEdit: (plan: ICreatePlans) => void;
//   handleDelete: (id: string) => void;
//   role: string;
//   isYearly: boolean;
//   isPaid: boolean;
//   isLoading: boolean;
// }

// // Props interface for ApplyCouponModal
// interface ApplyCouponModalProps {
//   show: boolean;
//   onHide: () => void;
//   plan: ICreatePlans;
//   originalAmount: number;
//   isYearly: boolean;
//   onApplyCoupon: (coupon: Coupon) => void;
//   onProceedWithoutCoupon: () => void;
// }

// const Membershipplancard = () => {
//   const routes = all_routes;
//   const [membershipdata, setMembershipdata] = useState<ICreatePlans[]>([]);
//   const [isYearly, setIsYearly] = useState(false);
//   const [loadingPlanId, setLoadingPlanId] = useState<string | null>(null);
//   const [editingPlan, setEditingPlan] = useState<ICreatePlans | null>(null);
//   const [paymentStatus, setPaymentStatus] = useState<Map<string, boolean>>(new Map());
//   const [showCouponModal, setShowCouponModal] = useState(false);
//   const [selectedPlan, setSelectedPlan] = useState<ICreatePlans | null>(null);
//   const [formData, setFormData] = useState({
//     planName: "",
//     planPrice: 0,
//     durationDays: 30,
//     planType: "",
//     studentsLimit: false,
//     studentsValue: 100,
//     classesLimit: false,
//     classesValue: 10,
//     subjectsLimit: false,
//     subjectsValue: 20,
//     departmentsLimit: false,
//     departmentsValue: 5,
//     library: false,
//     transport: false,
//     featured: false,
//   });
//   const role = useSelector((state: any) => state.auth?.userObj?.role);

//   // Load Razorpay script
//   useEffect(() => {
//     const script = document.createElement("script");
//     script.src = "https://checkout.razorpay.com/v1/checkout.js";
//     script.async = true;
//     document.body.appendChild(script);
//     return () => {
//       document.body.removeChild(script);
//     };
//   }, []);

//   // Fetch all plans
//   const fetchPlans = async () => {
//     setLoadingPlanId("all");
//     try {
//       const res = await getAllPlans();
//       console.log("Fetched plans:", res.data);
//       setMembershipdata(res.data as any);
//     } catch (error: any) {
//       console.error("Fetch plans error:", error.response?.data || error.message);
//       toast.error(`Failed to load plans: ${error.message || "Unknown error"}`);
//     } finally {
//       setLoadingPlanId(null);
//     }
//   };

//   useEffect(() => {
//     fetchPlans();
//   }, []);

//   // Toggle between monthly and yearly
//   const handleToggle = () => {
//     setIsYearly((prev) => !prev);
//   };

//   // Calculate price with discount for yearly
//   const calculatePrice = (price: number) => {
//     return isYearly ? Math.round(price * 12 * 0.8) : price;
//   };

//   // Handle upgrade plan (show coupon modal)
//   const handleUpgradePlan = (plan: ICreatePlans) => {
//     setSelectedPlan(plan);
//     setShowCouponModal(true);
//   };

//   // Handle payment with optional coupon
//   const handlePayment = async (plan: ICreatePlans, coupon?: Coupon) => {
//     try {
//       setLoadingPlanId(plan.id);
//       console.log("cupon", coupon);
//       let newamount=0;
//       let amount = calculatePrice(plan.price);
//       let couponId: number | undefined = coupon?.id;
// console.log("amount", amount, "couponId", couponId);
//       if (coupon) {
//         if (coupon.discountType === "PERCENTAGE") {
//           newamount = Math.round(amount * (1 - coupon.discountValue / 100));
//         } else if (coupon.discountType === "FIXED") {
//           newamount = Math.max(0, amount - coupon.discountValue);
//         }
//         console.log("applied coupon", couponId, "new amount", amount);
//       }

//       const response = await BaseApi.postRequest("/school/create-order", {
//         planId: plan.id,
//         amount:newamount,
//         schoolId: localStorage.getItem("schoolId"),
//         duration: isYearly ? "yearly" : "monthly",
//         couponId,
//       });

//       if (!response.data.success) {
//         throw new Error("Failed to create order");
//       }

//       const options = {
//         key: import.meta.env.REACT_APP_RAZORPAY_KEY_ID || "rzp_test_EJh0TkmUgkZNyG",
//         amount: response.data.amount,
//         currency: response.data.currency,
//         name: "LearnXChain",
//         description: `${plan.name} Membership (${isYearly ? "Yearly" : "Monthly"})`,
//         order_id: response.data.orderId,
//         handler: async function (response: any) {
//           try {
//             const verifyRes = await BaseApi.postRequest("/school/verify-payment", {
//               razorpay_payment_id: response.razorpay_payment_id,
//               razorpay_order_id: response.razorpay_order_id,
//               razorpay_signature: response.razorpay_signature,
//               planId: plan.id,
//               schoolId: localStorage.getItem("schoolId") || "",
//             });
//             if (verifyRes.status) {
//               toast.success("Payment successful! Your plan is now active.");
//               setPaymentStatus((prev) => {
//                 const newStatus = new Map(prev);
//                 newStatus.set(plan.id, true);
//                 return newStatus;
//               });
//             } else {
//               toast.error("Payment verified but subscription failed.");
//             }
//           } catch (error: any) {
//             toast.error("Payment verification failed");
//             console.error("Verification error:", error.response?.data || error.message);
//           }
//         },
//         prefill: {
//           name: localStorage.getItem("userName") || "",
//           email: localStorage.getItem("userEmail") || "",
//           contact: localStorage.getItem("userPhone") || "",
//         },
//         theme: {
//           color: "#0d6efd",
//         },
//       };

//       if (!(window as any).Razorpay) {
//         toast.error("Razorpay SDK not loaded. Please try again.");
//         return;
//       }

//       const rzp = new (window as any).Razorpay(options);
//       rzp.on("payment.failed", function (response: any) {
//         toast.error("Payment failed: " + response.error.description);
//         console.error("Payment failed:", response.error);
//       });
//       rzp.open();
//     } catch (error: any) {
//       toast.error("Payment initiation failed");
//       console.error("Payment error:", error.response?.data || error.message);
//     } finally {
//       setLoadingPlanId(null);
//     }
//   };

//   // Handle form change
//   const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value, type, checked } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: type === "checkbox" ? checked : value,
//     }));
//   };

//   // Handle form submission for add/edit
//   const handleSubmit = async (e: React.FormEvent, isEdit: boolean) => {
//     e.preventDefault();
//     const planData: any = {
//       name: formData.planName,
//       price: parseFloat(formData.planPrice.toString()),
//       durationDays: parseInt(formData.durationDays.toString()) || 30,
//     };

//     try {
//       setLoadingPlanId("modal");
//       if (isEdit) {
//         await updatePlan(planData.id, planData);
//         toast.success("Plan updated successfully");
//       } else {
//         await createPlan(planData);
//         toast.success("Plan created successfully");
//       }
//       fetchPlans();
//       (document.getElementById("closeModal") as HTMLElement)?.click();
//     } catch (error: any) {
//       toast.error(isEdit ? "Failed to update plan" : "Failed to create plan");
//       console.error("Error:", error.response?.data || error.message);
//     } finally {
//       setLoadingPlanId(null);
//     }
//   };

//   // Handle plan deletion
//   const handleDelete = async (id: string) => {
//     if (!window.confirm("Are you sure you want to delete this plan?")) return;

//     try {
//       setLoadingPlanId(id);
//       await deletePlan(id);
//       toast.success("Plan deleted successfully");
//       fetchPlans();
//     } catch (error: any) {
//       toast.error("Failed to delete plan");
//       console.error("Error:", error.response?.data || error.message);
//     } finally {
//       setLoadingPlanId(null);
//     }
//   };

//   // Set form data when editingPlan changes
//   useEffect(() => {
//     if (editingPlan) {
//       setFormData({
//         planName: editingPlan.name,
//         planPrice: editingPlan.price,
//         durationDays: editingPlan.durationDays,
//         planType: editingPlan.type,
//         studentsLimit: editingPlan.features.students === "unlimited",
//         studentsValue: editingPlan.features.students !== "unlimited" ? Number(editingPlan.features.students) : 100,
//         classesLimit: editingPlan.features.classes === "unlimited",
//         classesValue: editingPlan.features.classes !== "unlimited" ? Number(editingPlan.features.classes) : 10,
//         subjectsLimit: editingPlan.features.subjects === "unlimited",
//         subjectsValue: editingPlan.features.subjects !== "unlimited" ? Number(editingPlan.features.subjects) : 20,
//         departmentsLimit: editingPlan.features.departments === "unlimited",
//         departmentsValue: editingPlan.features.departments !== "unlimited" ? Number(editingPlan.features.departments) : 5,
//         library: editingPlan.features.library,
//         transport: editingPlan.features.transport,
//         featured: editingPlan.featured || false,
//       });
//     }
//   }, [editingPlan]);

//   return (
//     <div className="page-wrapper">
//       <ToastContainer position="top-center" autoClose={3000} />
//       <div className="content">
//         {/* Page Header */}
//         <div className="d-md-flex d-block align-items-center justify-content-between mb-3">
//           <div className="my-auto mb-2">
//             <h3 className="page-title mb-1">Membership Plans</h3>
//             <nav>
//               <ol className="breadcrumb mb-0">
//                 <li className="breadcrumb-item">
//                   <Link to={routes.adminDashboard}>Dashboard</Link>
//                 </li>
//                 <li className="breadcrumb-item">Membership</li>
//                 <li className="breadcrumb-item active" aria-current="page">
//                   Membership Plans
//                 </li>
//               </ol>
//             </nav>
//           </div>
//           {role === "superadmin" && (
//             <div className="d-flex my-xl-auto right-content align-items-center flex-wrap">
//               <TooltipOption />
//               <div className="mb-2">
//                 <button
//                   className="btn btn-primary d-flex align-items-center"
//                   data-bs-toggle="modal"
//                   data-bs-target="#planModal"
//                   onClick={() => setEditingPlan(null)}
//                 >
//                   <i className="ti ti-square-rounded-plus me-2" />
//                   Add Plan
//                 </button>
//               </div>
//             </div>
//           )}
//         </div>

//         {/* Toggle Switch */}
//         <div className="card border-0 mb-4">
//           <div className="card-body text-center">
//             <div className="d-inline-flex align-items-center">
//               <span className={`me-2 ${!isYearly ? "fw-bold text-primary" : ""}`}>Monthly</span>
//               <div className="form-check form-switch d-inline-block">
//                 <input
//                   className="form-check-input"
//                   type="checkbox"
//                   role="switch"
//                   aria-label="Toggle between monthly and yearly pricing"
//                   checked={isYearly}
//                   onChange={handleToggle}
//                 />
//               </div>
//               <span className={`ms-2 ${isYearly ? "fw-bold text-primary" : ""}`}>Yearly (20% off)</span>
//             </div>
//           </div>
//         </div>

//         {/* Plans Grid */}
//         {loadingPlanId === "all" && !membershipdata.length ? (
//           <div className="text-center py-5">
//             <div className="spinner-border text-primary" role="status">
//               <span className="visually-hidden">Loading...</span>
//             </div>
//           </div>
//         ) : (
//           <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
//             {membershipdata.map((plan) => (
//               <PlanCard
//                 key={plan.id}
//                 plan={plan}
//                 calculatePrice={calculatePrice}
//                 handleUpgradePlan={handleUpgradePlan}
//                 handleEdit={setEditingPlan}
//                 handleDelete={handleDelete}
//                 role={role}
//                 isYearly={isYearly}
//                 isPaid={paymentStatus.get(plan.id) || false}
//                 isLoading={loadingPlanId === plan.id}
//               />
//             ))}
//           </div>
//         )}

//         {/* Coupon Modal */}
//         {selectedPlan && (
//           <ApplyCouponModal
//             show={showCouponModal}
//             onHide={() => {
//               setShowCouponModal(false);
//               setSelectedPlan(null);
//             }}
//             plan={selectedPlan}
//             originalAmount={calculatePrice(selectedPlan.price)}
//             isYearly={false}
//             onApplyCoupon={(coupon) => handlePayment(selectedPlan, coupon)}
//             onProceedWithoutCoupon={() => handlePayment(selectedPlan)}
//           />
//         )}
//       </div>

//       {/* Plan Modal (Add/Edit) */}
//       <PlanModal
//         editingPlan={editingPlan}
//         formData={formData}
//         handleFormChange={handleFormChange}
//         handleSubmit={handleSubmit}
//         loading={loadingPlanId === "modal"}
//       />
//     </div>
//   );
// };

// // Sub-component: PlanCard
// const PlanCard: React.FC<PlanCardProps> = ({
//   plan,
//   calculatePrice,
//   handleUpgradePlan,
//   handleEdit,
//   handleDelete,
//   role,
//   isYearly,
//   isPaid,
//   isLoading,
// }) => {
//   if (!plan) {
//     return <div className="col">Plan data is missing.</div>;
//   }

//   const features = plan.features || {
//     students: "N/A",
//     classes: "N/A",
//     subjects: "N/A",
//     library: false,
//     transport: false,
//   };
//   const price = plan.price || 0;

//   return (
//     <div className="col">
//       <div className={`card h-100 ${plan.featured ? "border-primary border-2" : ""}`}>
//         {plan.featured && (
//           <div className="card-header bg-primary text-white text-center">Most Popular</div>
//         )}
//         <div className="card-body d-flex flex-column">
//           <div className="mb-3">
//             <span
//               className={`badge ${plan.type === "Enterprise" ? "bg-info" : "bg-secondary"} mb-2`}
//             >
//               {plan.name || "Unnamed Plan"}
//             </span>
//           </div>

//           <div className="bg-light p-3 rounded text-center mb-4">
//             <h2 className="mb-0">
//               ₹{calculatePrice(price)}
//               <small className="text-muted fs-6 fw-normal">{isYearly ? "/year" : "/month"}</small>
//             </h2>
//             {isYearly && (
//               <small className="text-success">
//                 Save ₹{price * 12 - calculatePrice(price)} annually
//               </small>
//             )}
//           </div>

//           <ul className="list-unstyled mb-4">
//             <li className="mb-2">
//               <i className="ti ti-check text-success me-2"></i>
//               {features.students === "unlimited" ? "Unlimited" : features.students} Students
//             </li>
//             <li className="mb-2">
//               <i className="ti ti-check text-success me-2"></i>
//               {features.classes === "unlimited" ? "Unlimited" : features.classes} Classes
//             </li>
//             <li className="mb-2">
//               <i className="ti ti-check text-success me-2"></i>
//               {features.subjects === "unlimited" ? "Unlimited" : features.subjects} Subjects
//             </li>
//             <li className="mb-2">
//               <i
//                 className={`ti ti-${features.library ? "check" : "x"} text-${features.library ? "success" : "danger"} me-2`}
//               ></i>
//               Library Access
//             </li>
//             <li className="mb-2">
//               <i
//                 className={`ti ti-${features.transport ? "check" : "x"} text-${features.transport ? "success" : "danger"} me-2`}
//               ></i>
//               Transport Module
//             </li>
//           </ul>

//           <div className="mt-auto">
//             {isPaid ? (
//               <div className="btn btn-success w-100 mb-2 disabled">Plan Active</div>
//             ) : (
//               <button
//                 className="btn btn-primary w-100 mb-2"
//                 onClick={() => handleUpgradePlan(plan)}
//                 disabled={isLoading}
//               >
//                 {isLoading ? "Processing..." : "Choose Plan"}
//               </button>
//             )}

//             {role === "superadmin" && (
//               <div className="d-flex gap-2">
//                 <button
//                   className="btn btn-outline-secondary flex-grow-1"
//                   data-bs-toggle="modal"
//                   data-bs-target="#planModal"
//                   onClick={() => handleEdit(plan)}
//                 >
//                   Edit
//                 </button>
//                 <button
//                   className="btn btn-outline-danger flex-grow-1"
//                   onClick={() => handleDelete(plan.id)}
//                   disabled={isLoading}
//                 >
//                   Delete
//                 </button>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// // Sub-component: ApplyCouponModal
// const ApplyCouponModal: React.FC<ApplyCouponModalProps> = ({
//   show,
//   onHide,
//   plan,
//   originalAmount,
//   isYearly,
//   onApplyCoupon,
//   onProceedWithoutCoupon,
// }) => {
//   const [couponCode, setCouponCode] = useState("");
//   const [coupon, setCoupon] = useState<Coupon | null>(null);
//   const [error, setError] = useState<string | null>(null);
//   const [loading, setLoading] = useState(false);

//   const handleApplyCoupon = async () => {
//     setLoading(true);
//     setError(null);
//     try {
//       const response = await BaseApi.postRequest("/superadmin/validate-coupon", { code: couponCode });
//       console.log("response", response);
//       if (response.status && response.data) {
//         setCoupon(response.data);
//       } else {
//         setError("Invalid coupon code");
//       }
//     } catch (error) {
//       setError("Failed to validate coupon");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const calculateDiscountedAmount = () => {
//     if (!coupon) return originalAmount;
//     let discount = 0;
//     if (coupon.discountType === "PERCENTAGE") {
//       discount = (coupon.discountValue / 100) * originalAmount;
//     } else if (coupon.discountType === "FIXED") {
//       discount = coupon.discountValue;
//     }
//     return Math.max(0, originalAmount - discount);
//   };

//   const discountedAmount = calculateDiscountedAmount();

//   return (
//     <Modal show={show} onHide={onHide}>
//       <Modal.Header closeButton>
//         <Modal.Title>Apply Coupon for {plan.name}</Modal.Title>
//       </Modal.Header>
//       <Modal.Body>
//         <Form.Group>
//           <Form.Label>Coupon Code</Form.Label>
//           <Form.Control
//             type="text"
//             value={couponCode}
//             onChange={(e) => setCouponCode(e.target.value)}
//           />
//         </Form.Group>
//         <Button onClick={handleApplyCoupon} disabled={loading} className="mt-2">
//           {loading ? "Applying..." : "Apply Coupon"}
//         </Button>
//         {error && <p className="text-danger mt-2">{error}</p>}
//         {coupon && (
//           <p className="mt-2">
//             Discounted Amount: ₹{discountedAmount} {isYearly ? "/year" : "/month"}
//           </p>
//         )}
//       </Modal.Body>
//       <Modal.Footer>
//         <Button variant="secondary" onClick={onHide}>
//           Cancel
//         </Button>
//         <Button
//           variant="primary"
//           onClick={() => {
//             if (coupon) {
//               onApplyCoupon(coupon);
//             } else {
//               onProceedWithoutCoupon();
//             }
//             onHide();
//           }}
//         >
//           Proceed to Payment
//         </Button>
//         <Button variant="outline-primary" onClick={() => { onProceedWithoutCoupon(); onHide(); }}>
//           Proceed Without Coupon
//         </Button>
//       </Modal.Footer>
//     </Modal>
//   );
// };

// // Sub-component: PlanModal
// const PlanModal = ({ editingPlan, formData, handleFormChange, handleSubmit, loading }: any) => (
//   <div className="modal fade" id="planModal">
//     <div className="modal-dialog modal-dialog-centered modal-lg">
//       <div className="modal-content">
//         <div className="modal-header">
//           <h4 className="modal-title">{editingPlan ? "Edit Plan" : "Add New Plan"}</h4>
//           <button
//             type="button"
//             className="btn-close"
//             data-bs-dismiss="modal"
//             aria-label="Close"
//             id="closeModal"
//           ></button>
//         </div>
//         <form onSubmit={(e) => handleSubmit(e, !!editingPlan)}>
//           <div className="modal-body">
//             <div className="row g-3">
//               <div className="col-md-6">
//                 <label className="form-label">Plan Name</label>
//                 <input
//                   type="text"
//                   name="planName"
//                   className="form-control"
//                   value={formData.planName}
//                   onChange={handleFormChange}
//                   required
//                 />
//               </div>
//               <div className="col-md-6">
//                 <label className="form-label">Plan Type</label>
//                 <CommonSelect
//                   name="planType"
//                   options={membershipplan}
//                   value={membershipplan.find((option) => option.value === formData.planType)}
//                   onChange={(option: any) =>
//                     handleFormChange({ target: { name: "planType", value: option.value } } as any)
//                   }
//                 />
//               </div>
//               <div className="col-md-6">
//                 <label className="form-label">Monthly Price (₹)</label>
//                 <input
//                   type="number"
//                   name="planPrice"
//                   className="form-control"
//                   min="0"
//                   step="0.01"
//                   value={formData.planPrice}
//                   onChange={handleFormChange}
//                   required
//                 />
//               </div>
//               <div className="col-md-6">
//                 <label className="form-label">Duration (Days)</label>
//                 <input
//                   type="number"
//                   name="durationDays"
//                   className="form-control"
//                   min="1"
//                   value={formData.durationDays}
//                   onChange={handleFormChange}
//                   required
//                 />
//               </div>

//               {/* Features Section */}
//               <div className="col-12 mt-4">
//                 <h5>Plan Features</h5>
//                 <hr />
//               </div>

//               {/* Students Limit */}
//               <div className="col-md-6">
//                 <div className="form-check form-switch mb-2">
//                   <input
//                     className="form-check-input"
//                     type="checkbox"
//                     name="studentsLimit"
//                     id="studentsLimit"
//                     checked={formData.studentsLimit}
//                     onChange={handleFormChange}
//                   />
//                   <label className="form-check-label" htmlFor="studentsLimit">
//                     Unlimited Students
//                   </label>
//                 </div>
//                 <input
//                   type="number"
//                   name="studentsValue"
//                   className="form-control"
//                   min="1"
//                   disabled={formData.studentsLimit}
//                   value={formData.studentsValue}
//                   onChange={handleFormChange}
//                 />
//               </div>

//               {/* Classes Limit */}
//               <div className="col-md-6">
//                 <div className="form-check form-switch mb-2">
//                   <input
//                     className="form-check-input"
//                     type="checkbox"
//                     name="classesLimit"
//                     id="classesLimit"
//                     checked={formData.classesLimit}
//                     onChange={handleFormChange}
//                   />
//                   <label className="form-check-label" htmlFor="classesLimit">
//                     Unlimited Classes
//                   </label>
//                 </div>
//                 <input
//                   type="number"
//                   name="classesValue"
//                   className="form-control"
//                   min="1"
//                   disabled={formData.classesLimit}
//                   value={formData.classesValue}
//                   onChange={handleFormChange}
//                 />
//               </div>

//               {/* Subjects Limit */}
//               <div className="col-md-6">
//                 <div className="form-check form-switch mb-2">
//                   <input
//                     className="form-check-input"
//                     type="checkbox"
//                     name="subjectsLimit"
//                     id="subjectsLimit"
//                     checked={formData.subjectsLimit}
//                     onChange={handleFormChange}
//                   />
//                   <label className="form-check-label" htmlFor="subjectsLimit">
//                     Unlimited Subjects
//                   </label>
//                 </div>
//                 <input
//                   type="number"
//                   name="subjectsValue"
//                   className="form-control"
//                   min="1"
//                   disabled={formData.subjectsLimit}
//                   value={formData.subjectsValue}
//                   onChange={handleFormChange}
//                 />
//               </div>

//               {/* Departments Limit */}
//               <div className="col-md-6">
//                 <div className="form-check form-switch mb-2">
//                   <input
//                     className="form-check-input"
//                     type="checkbox"
//                     name="departmentsLimit"
//                     id="departmentsLimit"
//                     checked={formData.departmentsLimit}
//                     onChange={handleFormChange}
//                   />
//                   <label className="form-check-label" htmlFor="departmentsLimit">
//                     Unlimited Departments
//                   </label>
//                 </div>
//                 <input
//                   type="number"
//                   name="departmentsValue"
//                   className="form-control"
//                   min="1"
//                   disabled={formData.departmentsLimit}
//                   value={formData.departmentsValue}
//                   onChange={handleFormChange}
//                 />
//               </div>

//               {/* Additional Features */}
//               <div className="col-12">
//                 <div className="form-check form-switch mb-2">
//                   <input
//                     className="form-check-input"
//                     type="checkbox"
//                     name="library"
//                     id="library"
//                     checked={formData.library}
//                     onChange={handleFormChange}
//                   />
//                   <label className="form-check-label" htmlFor="library">
//                     Library Module
//                   </label>
//                 </div>
//                 <div className="form-check form-switch">
//                   <input
//                     className="form-check-input"
//                     type="checkbox"
//                     name="transport"
//                     id="transport"
//                     checked={formData.transport}
//                     onChange={handleFormChange}
//                   />
//                   <label className="form-check-label" htmlFor="transport">
//                     Transport Module
//                   </label>
//                 </div>
//               </div>

//               {/* Featured Plan Option */}
//               {editingPlan && (
//                 <div className="col-12">
//                   <div className="form-check form-switch">
//                     <input
//                       className="form-check-input"
//                       type="checkbox"
//                       name="featured"
//                       id="featured"
//                       checked={formData.featured}
//                       onChange={handleFormChange}
//                     />
//                     <label className="form-check-label" htmlFor="featured">
//                       Mark as Featured Plan
//                     </label>
//                   </div>
//                 </div>
//               )}
//             </div>
//           </div>
//           <div className="modal-footer">
//             <button type="button" className="btn btn-light" data-bs-dismiss="modal">
//               Cancel
//             </button>
//             <button type="submit" className="btn btn-primary" disabled={loading}>
//               {loading ? (
//                 <>
//                   <span className="spinner-border spinner-border-sm me-1" role="status"></span>
//                   {editingPlan ? "Updating..." : "Creating..."}
//                 </>
//               ) : editingPlan ? (
//                 "Update Plan"
//               ) : (
//                 "Create Plan"
//               )}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   </div>
// );

// export default Membershipplancard;


import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import CommonSelect from "../../core/common/commonSelect";
import { membershipplan } from "../../core/common/selectoption/selectoption";
import TooltipOption from "../../core/common/tooltipOption";
import { all_routes } from "../../router/all_routes";
import { getAllPlans, createPlan, deletePlan, updatePlan } from "../../services/superadmin/planServices";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import BaseApi from "../../services/BaseApi";
import { ToastContainer } from "react-toastify";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { getActiveSubscription } from "../../services/admin/subscriptionServices";

// Interface for plan data
export interface ICreatePlans {
  id: string;
  name: string;
  price: number;
  durationDays: number;
  type: string;
  description: string;
  features: {
    students: string | number;
    classes: string | number;
    subjects: string | number;
    departments: string | number;
    library: boolean;
    transport: boolean;
  };
  featured?: boolean;
}

// Interface for coupon data
interface Coupon {
  id: number;
  code: string;
  discountType: "PERCENTAGE" | "FIXED";
  discountValue: number;
  expiryDate: string;
  maxUsage: number;
  usedCount: number;
}

// Interface for active subscription
interface ActiveSubscription {
  id: string;
  razorpayInvoiceId: string | null;
  schoolId: string;
  startDate: string;
  paymentId: string;
  receipt: string;
  orderId: string;
  status: string;
  endDate: string;
  isActive: boolean;
  userLimit: number;
  createdAt: string;
  updatedAt: string;
  couponId: string | null;
  planName: string;
  daysLeft: number;
}

// Props interface for PlanCard
interface PlanCardProps {
  plan: ICreatePlans;
  calculatePrice: (price: number) => number;
  handlePayment: (plan: ICreatePlans, coupon?: Coupon) => void;
  handleEdit: (plan: ICreatePlans) => void;
  handleDelete: (id: string) => void;
  role: string;
  isYearly: boolean;
  isPaid: boolean;
  isLoading: boolean;
  activeSubscription: ActiveSubscription | null;
  onUpgradeClick: () => void;
}

const Membershipplancard = () => {
  const routes = all_routes;
  const navigate = useNavigate();
  const [membershipdata, setMembershipdata] = useState<ICreatePlans[]>([]);
  const [isYearly, setIsYearly] = useState(false);
  const [loadingPlanId, setLoadingPlanId] = useState<string | null>(null);
  const [editingPlan, setEditingPlan] = useState<ICreatePlans | null>(null);
  const [paymentStatus, setPaymentStatus] = useState<Map<string, boolean>>(new Map());
  const [activeSubscription, setActiveSubscription] = useState<ActiveSubscription | null>(null);
  const [formData, setFormData] = useState({
    planName: "",
    planPrice: 0,
    durationDays: 30,
    planType: "",
    studentsLimit: false,
    studentsValue: 100,
    classesLimit: false,
    classesValue: 10,
    subjectsLimit: false,
    subjectsValue: 20,
    departmentsLimit: false,
    departmentsValue: 5,
    library: false,
    transport: false,
    featured: false,
  });
  const role = useSelector((state: any) => state.auth?.userObj?.role);

  // Load Razorpay script
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  // Fetch active subscription
  const fetchActiveSubscription = async () => {
    try {
      const schoolId = localStorage.getItem("schoolId");
      if (schoolId) {
        const response = await getActiveSubscription(schoolId);
        if (response.data) {
          setActiveSubscription(response.data);
        }
      }
    } catch (error) {
      console.error("Error fetching active subscription:", error);
    }
  };

  // Fetch all plans
  const fetchPlans = async () => {
    setLoadingPlanId("all");
    try {
      const res = await getAllPlans();
      console.log("Fetched plans:", res.data);
      setMembershipdata(res.data as any);
    } catch (error: any) {
      console.error("Fetch plans error:", error.response?.data || error.message);
      toast.error(`Failed to load plans: ${error.message || "Unknown error"}`);
    } finally {
      setLoadingPlanId(null);
    }
  };

  useEffect(() => {
    fetchPlans();
    fetchActiveSubscription();
  }, []);

  // Toggle between monthly and yearly
  const handleToggle = () => {
    setIsYearly((prev) => !prev);
  };

  // Calculate price with discount for yearly
  const calculatePrice = (price: number) => {
    return isYearly ? Math.round(price * 12 * 0.8) : price;
  };

  // Handle upgrade click - navigate to contact messages
  const handleUpgradeClick = () => {
    navigate(all_routes.contactMessages);
  };

  // Handle payment with optional coupon
  const handlePayment = async (plan: ICreatePlans, coupon?: Coupon) => {
    try {
      setLoadingPlanId(plan.id);
      let amount = calculatePrice(plan.price);
      let couponId: number | undefined = coupon?.id;
      let finalAmount = amount;

      if (coupon) {
        if (coupon.discountType === "PERCENTAGE") {
          finalAmount = Math.round(amount * (1 - coupon.discountValue / 100));
        } else if (coupon.discountType === "FIXED") {
          finalAmount = Math.max(0, amount - coupon.discountValue);
        }
        console.log("Applied coupon:", couponId, "Original amount:", amount, "Discounted amount:", finalAmount);
      }

      const response = await BaseApi.postRequest("/school/create-order", {
        planId: plan.id,
      //  amount:finalAmount,
        discountedPrice: finalAmount, // Send discounted amount
        schoolId: localStorage.getItem("schoolId"),
        // duration: isYearly ? "yearly" : "monthly",
        // couponId,
      });

      if (!response.data.success) {
        throw new Error("Failed to create order");
      }

      const options = {
        key: import.meta.env.REACT_APP_RAZORPAY_KEY_ID || "rzp_test_EJh0TkmUgkZNyG",
        discountedPrice: response.data.discountedPrice,
        amount: response.data.amount,
        currency: response.data.currency,
        name: "LearnXChain",
        description: `${plan.name} Membership (${isYearly ? "Yearly" : "Monthly"})`,
        order_id: response.data.orderId,
        handler: async function (response: any) {
          try {
            const verifyRes = await BaseApi.postRequest("/school/verify-payment", {
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
              planId: plan.id,
              schoolId: localStorage.getItem("schoolId") || "",
            });
            if (verifyRes.status) {
              toast.success("Payment successful! Your plan is now active.");
              setPaymentStatus((prev) => {
                const newStatus = new Map(prev);
                newStatus.set(plan.id, true);
                return newStatus;
              });
              // Refresh active subscription after successful payment
              fetchActiveSubscription();
            } else {
              toast.error("Payment verified but subscription failed.");
            }
          } catch (error: any) {
            toast.error("Payment verification failed");
            console.error("Verification error:", error.response?.data || error.message);
          }
        },
        prefill: {
          name: localStorage.getItem("userName") || "",
          email: localStorage.getItem("userEmail") || "",
          contact: localStorage.getItem("userPhone") || "",
        },
        theme: {
          color: "#0d6efd",
        },
      };

      if (!(window as any).Razorpay) {
        toast.error("Razorpay SDK not loaded. Please try again.");
        return;
      }

      const rzp = new (window as any).Razorpay(options);
      rzp.on("payment.failed", function (response: any) {
        toast.error("Payment failed: " + response.error.description);
        console.error("Payment failed:", response.error);
      });
      rzp.open();
    } catch (error: any) {
      toast.error("Payment initiation failed");
      console.error("Payment error:", error.response?.data || error.message);
    } finally {
      setLoadingPlanId(null);
    }
  };

  // Handle form change
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Handle form submission for add/edit
  const handleSubmit = async (e: React.FormEvent, isEdit: boolean) => {
    e.preventDefault();
    const planData: any = {
      name: formData.planName,
      price: parseFloat(formData.planPrice.toString()),
      durationDays: parseInt(formData.durationDays.toString()) || 30,
    };

    try {
      setLoadingPlanId("modal");
      if (isEdit) {
        await updatePlan(planData.id, planData);
        toast.success("Plan updated successfully");
      } else {
        await createPlan(planData);
        toast.success("Plan created successfully");
      }
      fetchPlans();
      (document.getElementById("closeModal") as HTMLElement)?.click();
    } catch (error: any) {
      toast.error(isEdit ? "Failed to update plan" : "Failed to create plan");
      console.error("Error:", error.response?.data || error.message);
    } finally {
      setLoadingPlanId(null);
    }
  };

  // Handle plan deletion
  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this plan?")) return;

    try {
      setLoadingPlanId(id);
      await deletePlan(id);
      toast.success("Plan deleted successfully");
      fetchPlans();
    } catch (error: any) {
      toast.error("Failed to delete plan");
      console.error("Error:", error.response?.data || error.message);
    } finally {
      setLoadingPlanId(null);
    }
  };

  // Set form data when editingPlan changes
  useEffect(() => {
    if (editingPlan) {
      setFormData({
        planName: editingPlan.name,
        planPrice: editingPlan.price,
        durationDays: editingPlan.durationDays,
        planType: editingPlan.type,
        studentsLimit: editingPlan.features.students === "unlimited",
        studentsValue: editingPlan.features.students !== "unlimited" ? Number(editingPlan.features.students) : 100,
        classesLimit: editingPlan.features.classes === "unlimited",
        classesValue: editingPlan.features.classes !== "unlimited" ? Number(editingPlan.features.classes) : 10,
        subjectsLimit: editingPlan.features.subjects === "unlimited",
        subjectsValue: editingPlan.features.subjects !== "unlimited" ? Number(editingPlan.features.subjects) : 20,
        departmentsLimit: editingPlan.features.departments === "unlimited",
        departmentsValue: editingPlan.features.departments !== "unlimited" ? Number(editingPlan.features.departments) : 5,
        library: editingPlan.features.library,
        transport: editingPlan.features.transport,
        featured: editingPlan.featured || false,
      });
    }
  }, [editingPlan]);

  return (
    <div className="page-wrapper">
      <ToastContainer position="top-center" autoClose={3000} />
      <div className="content">
        {/* Page Header */}
        <div className="d-md-flex d-block align-items-center justify-content-between mb-3">
          <div className="my-auto mb-2">
            <h3 className="page-title mb-1">Membership Plans</h3>
            <nav>
              <ol className="breadcrumb mb-0">
                <li className="breadcrumb-item">
                  <Link to={routes.adminDashboard}>Dashboard</Link>
                </li>
                <li className="breadcrumb-item">Membership</li>
                <li className="breadcrumb-item active" aria-current="page">
                  Membership Plans
                </li>
              </ol>
            </nav>
          </div>
          {role === "superadmin" && (
            <div className="d-flex my-xl-auto right-content align-items-center flex-wrap">
              <TooltipOption />
              <div className="mb-2">
                <button
                  className="btn btn-primary d-flex align-items-center"
                  data-bs-toggle="modal"
                  data-bs-target="#planModal"
                  onClick={() => setEditingPlan(null)}
                >
                  <i className="ti ti-square-rounded-plus me-2" />
                  Add Plan
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Active Subscription Status */}
        {activeSubscription && (
          <div className="card border-success mb-4">
            <div className="card-body">
              <div className="row align-items-center">
                <div className="col-md-8">
                  <h5 className="text-success mb-2">
                    <i className="ti ti-check-circle me-2"></i>
                    Active Subscription: {activeSubscription.planName}
                  </h5>
                  <p className="mb-1">
                    <strong>Status:</strong> {activeSubscription.status} | 
                    <strong> Days Left:</strong> {activeSubscription.daysLeft} days | 
                    <strong> User Limit:</strong> {activeSubscription.userLimit}
                  </p>
                  <p className="mb-0 text-muted">
                    <small>
                      Started: {new Date(activeSubscription.startDate).toLocaleDateString()} | 
                      Expires: {new Date(activeSubscription.endDate).toLocaleDateString()}
                    </small>
                  </p>
                </div>
                <div className="col-md-4 text-end">
                  <button
                    className="btn btn-outline-primary"
                    onClick={handleUpgradeClick}
                  >
                    <i className="ti ti-arrow-up me-2"></i>
                    Upgrade Plan
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Toggle Switch */}
        <div className="card border-0 mb-4">
          <div className="card-body text-center">
            <div className="d-inline-flex align-items-center">
              <span className={`me-2 ${!isYearly ? "fw-bold text-primary" : ""}`}>Monthly</span>
              <div className="form-check form-switch d-inline-block">
                <input
                  className="form-check-input"
                  type="checkbox"
                  role="switch"
                  aria-label="Toggle between monthly and yearly pricing"
                  checked={isYearly}
                  onChange={handleToggle}
                />
              </div>
              <span className={`ms-2 ${isYearly ? "fw-bold text-primary" : ""}`}>Yearly (20% off)</span>
            </div>
          </div>
        </div>

        {/* Plans Grid */}
        {loadingPlanId === "all" && !membershipdata.length ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : (
          <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
            {membershipdata.map((plan) => (
              <PlanCard
                key={plan.id}
                plan={plan}
                calculatePrice={calculatePrice}
                handlePayment={handlePayment}
                handleEdit={setEditingPlan}
                handleDelete={handleDelete}
                role={role}
                isYearly={isYearly}
                isPaid={paymentStatus.get(plan.id) || false}
                isLoading={loadingPlanId === plan.id}
                activeSubscription={activeSubscription}
                onUpgradeClick={handleUpgradeClick}
              />
            ))}
          </div>
        )}
      </div>

      {/* Plan Modal (Add/Edit) */}
      <PlanModal
        editingPlan={editingPlan}
        formData={formData}
        handleFormChange={handleFormChange}
        handleSubmit={handleSubmit}
        loading={loadingPlanId === "modal"}
      />
    </div>
  );
};

// Sub-component: PlanCard
const PlanCard: React.FC<PlanCardProps> = ({
  plan,
  calculatePrice,
  handlePayment,
  handleEdit,
  handleDelete,
  role,
  isYearly,
  isPaid,
  isLoading,
  activeSubscription,
  onUpgradeClick,
}) => {
  if (!plan) {
    return <div className="col">Plan data is missing.</div>;
  }

  const features = plan.features || {
    students: "N/A",
    classes: "N/A",
    subjects: "N/A",
    library: false,
    transport: false,
  };
  const price = plan.price || 0;
  const originalAmount = calculatePrice(price);

  const [showCouponInput, setShowCouponInput] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [coupon, setCoupon] = useState<Coupon | null>(null);
  const [couponError, setCouponError] = useState<string | null>(null);
  const [couponLoading, setCouponLoading] = useState(false);

  // Check if this plan is currently active
  const isCurrentPlan = activeSubscription && activeSubscription.planName === plan.name;

  const handleApplyCoupon = async () => {
    setCouponLoading(true);
    setCouponError(null);
    try {
      const response = await BaseApi.postRequest("/superadmin/validate-coupon", { code: couponCode });
      if (response.status && response.data) {
        setCoupon(response.data);
        toast.success("Coupon applied successfully!");
      } else {
        setCouponError("Invalid coupon code");
      }
    } catch (error: any) {
      setCouponError("Failed to validate coupon");
      console.error("Coupon validation error:", error.response?.data || error.message);
    } finally {
      setCouponLoading(false);
    }
  };

  const handleRemoveCoupon = () => {
    setCoupon(null);
    setCouponCode("");
    setCouponError(null);
    toast.info("Coupon removed");
  };

  const toggleCouponInput = () => {
    if (showCouponInput && coupon) {
      handleRemoveCoupon(); // Remove coupon when closing input
    }
    setShowCouponInput(!showCouponInput);
  };

  const calculateDiscountedAmount = () => {
    if (!coupon) return originalAmount;
    let discountedAmount = originalAmount;
    if (coupon.discountType === "PERCENTAGE") {
      discountedAmount = Math.round(originalAmount * (1 - coupon.discountValue / 100));
    } else if (coupon.discountType === "FIXED") {
      discountedAmount = Math.max(0, originalAmount - coupon.discountValue);
    }
    return discountedAmount;
  };

  const payableAmount = calculateDiscountedAmount();

  return (
    <div className="col">
      <div className={`card h-100 ${plan.featured ? "border-primary border-2" : ""} ${isCurrentPlan ? "border-success border-3 shadow-lg" : ""}`}>
        {plan.featured && (
          <div className="card-header bg-primary text-white text-center">Most Popular</div>
        )}
        {isCurrentPlan && (
          <div className="card-header bg-success text-white text-center">
            <i className="ti ti-check-circle me-2"></i>
            Current Plan
          </div>
        )}
        <div className="card-body d-flex flex-column">
          <div className="mb-3">
            <span
              className={`badge ${plan.type === "Enterprise" ? "bg-info" : "bg-secondary"} mb-2`}
            >
              {plan.name || "Unnamed Plan"}
            </span>
          </div>

          <div className="bg-light p-3 rounded text-center mb-4">
            <h2 className="mb-0">
              ₹{payableAmount}
              <small className="text-muted fs-6 fw-normal">{isYearly ? "/year" : "/month"}</small>
            </h2>
            {isYearly && (
              <small className="text-success">
                Save ₹{price * 12 - calculatePrice(price)} annually
              </small>
            )}
            {coupon && (
              <small className="text-success d-block mt-1">
                Coupon Applied: {coupon.code} ({coupon.discountType === "PERCENTAGE" ? `${coupon.discountValue}%` : `₹${coupon.discountValue}`})
              </small>
            )}
          </div>

          <ul className="list-unstyled mb-4">
            <li className="mb-2">
              <i className="ti ti-check text-success me-2"></i>
              {features.students === "unlimited" ? "Unlimited" : features.students} Students
            </li>
            <li className="mb-2">
              <i className="ti ti-check text-success me-2"></i>
              {features.classes === "unlimited" ? "Unlimited" : features.classes} Classes
            </li>
            <li className="mb-2">
              <i className="ti ti-check text-success me-2"></i>
              {features.subjects === "unlimited" ? "Unlimited" : features.subjects} Subjects
            </li>
            <li className="mb-2">
              <i
                className={`ti ti-${features.library ? "check" : "x"} text-${features.library ? "success" : "danger"} me-2`}
              ></i>
              Library Access
            </li>
            <li className="mb-2">
              <i
                className={`ti ti-${features.transport ? "check" : "x"} text-${features.transport ? "success" : "danger"} me-2`}
              ></i>
              Transport Module
            </li>
          </ul>

          <div className="mt-auto">
            {isCurrentPlan ? (
              <div className="btn btn-success w-100 mb-2 disabled">
                <i className="ti ti-check-circle me-2"></i>
                Current Plan Active
              </div>
            ) : (
              <>
                <button
                  className="btn btn-primary w-100 mb-2"
                  onClick={() => handlePayment(plan, coupon || undefined)}
                  disabled={isLoading || couponLoading}
                >
                  {isLoading || couponLoading ? "Processing..." : "Choose Plan"}
                </button>
                <div className="text-center mb-2">
                  <button
                    className="btn btn-link p-0"
                    onClick={toggleCouponInput}
                    disabled={isLoading || couponLoading}
                  >
                    {showCouponInput ? (coupon ? "Remove Coupon" : "Hide Coupon Input") : "Have a coupon?"}
                  </button>
                </div>
                {showCouponInput && (
                  <div className="mb-2">
                    <Form.Group className="d-flex align-items-center gap-2">
                      <Form.Control
                        type="text"
                        placeholder="Enter coupon code"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                        disabled={couponLoading}
                      />
                      <Button
                        variant="outline-primary"
                        onClick={handleApplyCoupon}
                        disabled={couponLoading || !couponCode}
                      >
                        {couponLoading ? "Applying..." : "Apply"}
                      </Button>
                    </Form.Group>
                    {couponError && <p className="text-danger small mt-1">{couponError}</p>}
                  </div>
                )}
              </>
            )}

            {role === "superadmin" && (
              <div className="d-flex gap-2">
                <button
                  className="btn btn-outline-secondary flex-grow-1"
                  data-bs-toggle="modal"
                  data-bs-target="#planModal"
                  onClick={() => handleEdit(plan)}
                >
                  Edit
                </button>
                <button
                  className="btn btn-outline-danger flex-grow-1"
                  onClick={() => handleDelete(plan.id)}
                  disabled={isLoading}
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Sub-component: PlanModal
const PlanModal = ({ editingPlan, formData, handleFormChange, handleSubmit, loading }: any) => (
  <div className="modal fade" id="planModal">
    <div className="modal-dialog modal-dialog-centered modal-lg">
      <div className="modal-content">
        <div className="modal-header">
          <h4 className="modal-title">{editingPlan ? "Edit Plan" : "Add New Plan"}</h4>
          <button
            type="button"
            className="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
            id="closeModal"
          ></button>
        </div>
        <form onSubmit={(e) => handleSubmit(e, !!editingPlan)}>
          <div className="modal-body">
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label">Plan Name</label>
                <input
                  type="text"
                  name="planName"
                  className="form-control"
                  value={formData.planName}
                  onChange={handleFormChange}
                  required
                />
              </div>
              <div className="col-md-6">
                <label className="form-label">Plan Type</label>
                <CommonSelect
                  options={membershipplan}
                  value={membershipplan.find((option) => option.value === formData.planType)}
                  onChange={(option: any) =>
                    handleFormChange({ target: { name: "planType", value: option.value } } as any)
                  }
                />
              </div>
              <div className="col-md-6">
                <label className="form-label">Monthly Price (₹)</label>
                <input
                  type="number"
                  name="planPrice"
                  className="form-control"
                  min="0"
                  step="0.01"
                  value={formData.planPrice}
                  onChange={handleFormChange}
                  required
                />
              </div>
              <div className="col-md-6">
                <label className="form-label">Duration (Days)</label>
                <input
                  type="number"
                  name="durationDays"
                  className="form-control"
                  min="1"
                  value={formData.durationDays}
                  onChange={handleFormChange}
                  required
                />
              </div>

              {/* Features Section */}
              <div className="col-12 mt-4">
                <h5>Plan Features</h5>
                <hr />
              </div>

              {/* Students Limit */}
              <div className="col-md-6">
                <div className="form-check form-switch mb-2">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    name="studentsLimit"
                    id="studentsLimit"
                    checked={formData.studentsLimit}
                    onChange={handleFormChange}
                  />
                  <label className="form-check-label" htmlFor="studentsLimit">
                    Unlimited Students
                  </label>
                </div>
                <input
                  type="number"
                  name="studentsValue"
                  className="form-control"
                  min="1"
                  disabled={formData.studentsLimit}
                  value={formData.studentsValue}
                  onChange={handleFormChange}
                />
              </div>

              {/* Classes Limit */}
              <div className="col-md-6">
                <div className="form-check form-switch mb-2">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    name="classesLimit"
                    id="classesLimit"
                    checked={formData.classesLimit}
                    onChange={handleFormChange}
                  />
                  <label className="form-check-label" htmlFor="classesLimit">
                    Unlimited Classes
                  </label>
                </div>
                <input
                  type="number"
                  name="classesValue"
                  className="form-control"
                  min="1"
                  disabled={formData.classesLimit}
                  value={formData.classesValue}
                  onChange={handleFormChange}
                />
              </div>

              {/* Subjects Limit */}
              <div className="col-md-6">
                <div className="form-check form-switch mb-2">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    name="subjectsLimit"
                    id="subjectsLimit"
                    checked={formData.subjectsLimit}
                    onChange={handleFormChange}
                  />
                  <label className="form-check-label" htmlFor="subjectsLimit">
                    Unlimited Subjects
                  </label>
                </div>
                <input
                  type="number"
                  name="subjectsValue"
                  className="form-control"
                  min="1"
                  disabled={formData.subjectsLimit}
                  value={formData.subjectsValue}
                  onChange={handleFormChange}
                />
              </div>

              {/* Departments Limit */}
              <div className="col-md-6">
                <div className="form-check form-switch mb-2">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    name="departmentsLimit"
                    id="departmentsLimit"
                    checked={formData.departmentsLimit}
                    onChange={handleFormChange}
                  />
                  <label className="form-check-label" htmlFor="departmentsLimit">
                    Unlimited Departments
                  </label>
                </div>
                <input
                  type="number"
                  name="departmentsValue"
                  className="form-control"
                  min="1"
                  disabled={formData.departmentsLimit}
                  value={formData.departmentsValue}
                  onChange={handleFormChange}
                />
              </div>

              {/* Additional Features */}
              <div className="col-12">
                <div className="form-check form-switch mb-2">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    name="library"
                    id="library"
                    checked={formData.library}
                    onChange={handleFormChange}
                  />
                  <label className="form-check-label" htmlFor="library">
                    Library Module
                  </label>
                </div>
                <div className="form-check form-switch">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    name="transport"
                    id="transport"
                    checked={formData.transport}
                    onChange={handleFormChange}
                  />
                  <label className="form-check-label" htmlFor="transport">
                    Transport Module
                  </label>
                </div>
              </div>

              {/* Featured Plan Option */}
              {editingPlan && (
                <div className="col-12">
                  <div className="form-check form-switch">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      name="featured"
                      id="featured"
                      checked={formData.featured}
                      onChange={handleFormChange}
                    />
                    <label className="form-check-label" htmlFor="featured">
                      Mark as Featured Plan
                    </label>
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-light" data-bs-dismiss="modal">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-1" role="status"></span>
                  {editingPlan ? "Updating..." : "Creating..."}
                </>
              ) : editingPlan ? (
                "Update Plan"
              ) : (
                "Create Plan"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
);

export default Membershipplancard;