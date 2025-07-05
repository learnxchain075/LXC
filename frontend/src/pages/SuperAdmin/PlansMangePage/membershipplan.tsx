import React, { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import TooltipOption from "../../../core/common/tooltipOption";
import { createPlan, deletePlan, getAllPlans, updatePlan } from "../../../services/superadmin/planServices";
import CustomLoader from "../../../components/Loader";

// Define the interface for plan data
interface ICreatePlans {
  id: string;
  name: string;
  price: number;
  durationDays: number;
  userLimit: number;
}

const MembershipPlan = () => {
  const [plans, setPlans] = useState<ICreatePlans[]>([]);
  const [formData, setFormData] = useState(
    { name: "", price: "", durationDays: "", userLimit: "" });
  const [selectedPlan, setSelectedPlan] = useState<ICreatePlans | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [planToDelete, setPlanToDelete] = useState<string | null>(null);

  // Fetch plans on component mount
  useEffect(() => {
    fetchPlans();
  }, []);

  // Reset form and states when modal is closed
  useEffect(() => {
    const modalElement = document.getElementById("modaldemo8");
    const handleHide = () => {
      setFormData({ name: "", price: "", durationDays: "", userLimit: "" });
      setSelectedPlan(null);
      setIsEditMode(false);
    };

    if (modalElement) {
      modalElement.addEventListener("hidden.bs.modal", handleHide);
    }

    return () => {
      if (modalElement) {
        modalElement.removeEventListener("hidden.bs.modal", handleHide);
      }
    };
  }, []);

  // Fetch plans from the API
  const fetchPlans = async () => {
    setIsLoading(true);
    try {
      const response = await getAllPlans();
      setPlans(response.data);
    } catch (error) {
      toast.error("Error fetching plans");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle form submission for creating or updating a plan
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const price = parseInt(formData.price);
      const durationDays = parseInt(formData.durationDays, 10);
      const userLimit = parseInt(formData.userLimit, 10);
      if (isNaN(price) || isNaN(durationDays) || isNaN(userLimit)) {
        throw new Error("Please enter a valid price, duration and user limit");
      }

      const planData = {
        name: formData.name,
        price,
        durationDays,
        userLimit,
      };

      if (isEditMode && selectedPlan) {
        await updatePlan(selectedPlan.id, planData);
        toast.success("Plan updated successfully");
      } else {
        await createPlan(planData);
        setFormData({ name: "", price: "", durationDays: "" });
        toast.success("Plan created successfully");
      }

      await fetchPlans();

      // // Close the modal
      // const modalElement = document.getElementById("modaldemo8");
      // if (modalElement) {
      //   const modal = (window as any).bootstrap.Modal.getInstance(modalElement);
      //   if (modal) {
      //     modal.hide();
      //   } else {
      //     console.error("Modal instance not found - check Bootstrap initialization");
      //   }
      // } else {
      //   console.error("Modal element with ID 'modal-g' not found");
      // }
    } catch (error) {
      console.error("Error saving plan:", error);
      const errorMessage = error instanceof Error ? error.message : "Failed to save plan. Please try again.";
      toast.error(errorMessage);
    }
  };

  // Set up the form for editing a plan
  const handleEdit = (plan: ICreatePlans) => {
    setIsEditMode(true);
    setSelectedPlan(plan);
    setFormData({
      name: plan.name,
      price: plan.price.toString(),
      durationDays: plan.durationDays.toString(),
      userLimit: plan.userLimit.toString(),
    });
  };

  // Handle plan deletion
  const handleDelete = async (planId: string) => {
    try {
      await deletePlan(planId);
      await fetchPlans();
      toast.success("Plan deleted successfully");
    } catch (error) {
      console.error("Error deleting plan:", error);
      toast.error("Error deleting plan");
    }
  };

  return (
    <div className="page-wrapper">
      <div className="content">
        {/* Header Section */}
        <div className="d-md-flex d-block align-items-center justify-content-between mb-3">
          <div className="my-auto mb-2">
            <h3 className="page-title mb-1">Membership Plans</h3>
          </div>
          <div className="d-flex my-xl-auto right-content align-items-center flex-wrap">
            <TooltipOption />
            <div className="mb-2">
              <button
                className="btn btn-primary d-flex align-items-center"
                data-bs-toggle="modal"
                data-bs-target="#modaldemo8"
                onClick={() => setIsEditMode(false)}
              >
                <i className="ti ti-square-rounded-plus me-2" /> Add Membership
              </button>
            </div>
          </div>
        </div>

        {/* Plans Table with Loader */}
        <div className="card">
          <div className="card-body">
            {isLoading ? (
              <CustomLoader variant="dots" color="#3067e3" size={100} />
            ) : (
              <table className="table">
                <thead>
                  <tr>
                    <th>Sr.</th>
                    <th>Name</th>
                    <th>Price</th>
                    <th>User Limit</th>
                    <th>Duration (Days)</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {plans.map((plan, index) => (
                    <tr key={plan.id}>
                      <td>{index + 1}</td>
                      <td>{plan.name}</td>
                      <td>₹{plan.price}</td>
                      <td>{plan.userLimit}</td>
                      <td>{plan.durationDays}</td>
                      <td>
                        <button
                          className="btn btn-sm btn-primary"
                          data-bs-toggle="modal"
                          data-bs-target="#modaldemo8"
                          onClick={() => handleEdit(plan)}
                        >
                          Edit
                        </button>
                        <button
                          className="btn btn-sm btn-danger ms-2"
                          onClick={() => {
                            setPlanToDelete(plan.id);
                            setShowDeleteModal(true);
                          }}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                  {plans.length === 0 && (
                    <tr>
                      <td colSpan={5} className="text-center">
                        No plans found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Modal for Adding/Editing Plans */}
        <div className="modal fade" id="modaldemo8">
          <div className="modal-dialog modal-dialog-centered modaldemo8">
            <div className="modal-content">
              <div className="modal-header">
                <h4 className="modal-title">{isEditMode ? "Edit Plan" : "Add Plan"}</h4>
                <button type="button" className="btn-close" data-bs-dismiss="modal">
                  <i className="ti ti-x" />
                </button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Plan Name</label>
                    <input
                      type="text"
                      className="form-control"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Plan Price</label>
                    <input
                      type="number"
                      className="form-control"
                      name="price"
                      value={formData.price}
                      onChange={handleChange}
                      min="0"
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">User Limit</label>
                    <input
                      type="number"
                      className="form-control"
                      name="userLimit"
                      value={formData.userLimit}
                      onChange={handleChange}
                      min="3"
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Duration (Days)</label>
                    <input
                      type="number"
                      className="form-control"
                      name="durationDays"
                      value={formData.durationDays}
                      onChange={handleChange}
                      min="1"
                      required
                    />
                  </div>
                </div>
                <div className="modal-footer flex gap-4">
                  <button type="submit" className="btn btn-primary" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                        &nbsp; Loading...
                      </>
                    ) : isEditMode ? "Update Plan" : "Add Plan"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Delete Confirmation Modal */}
        {showDeleteModal && (
          <>
            <div className="modal fade show" style={{ display: "block" }} tabIndex={-1}>
              <div className="modal-dialog">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title">Confirm Deletion</h5>
                    <button
                      type="button"
                      className="btn-close"
                      onClick={() => setShowDeleteModal(false)}
                    ></button>
                  </div>
                  <div className="modal-body">
                    <p>Are you sure you want to delete this plan?</p>
                  </div>
                  <div className="modal-footer">
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() => setShowDeleteModal(false)}
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      className="btn btn-danger"
                      onClick={() => {
                        if (planToDelete) {
                          handleDelete(planToDelete);
                        }
                        setShowDeleteModal(false);
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-backdrop fade show"></div>
          </>
        )}


        <ToastContainer />
      </div>
    </div>
  );
};

export default MembershipPlan;