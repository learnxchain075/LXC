import { useState, FormEvent } from "react";
import { Link } from "react-router-dom";
// import { toast } from "react-toastify";

import CommonSelect from "../../../core/common/commonSelect";
import { bloodGroup, sex } from "../../../core/common/selectoption/selectoption";
import { registerSchool } from "../../../services/superadmin/schoolService";
//added
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
interface SelectOption {
  value: string;
  label: string;
}

interface FormData {
  schoolName: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  country: string;
  pincode: string;
  bloodType: string;
  sex: string;
  profilePic: File | null; // Changed from string to File | null
  schoolLogo: File | null;
}

const RegisterSchool = () => {
  const [formData, setFormData] = useState<FormData>({
    schoolName: "",
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    country: "",
    pincode: "",
    bloodType: "O-VE",
    sex: "MALE",
    profilePic: null,
    schoolLogo: null,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    // console.log(`Input changed - ${name}: ${value}`);
    setFormData((prev) => ({ ...prev, [name]: value }));
  };


  const handleSelectChange = (name: keyof typeof formData, value: string) => {
    setFormData((prev) => {
      const updatedFormData = { ...prev, [name]: value };
      return updatedFormData;
    });
  };


  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
    const file = e.target.files ? e.target.files[0] : null;
    // console.log("File selected:", file ? file.name : "None");
    setFormData((prev) => ({ ...prev, [field]: file }));
  };



  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    if (!formData.profilePic) {
      toast.error("Please upload a profile picture");
      setIsSubmitting(false);
      return;
    }


    try {
      // console.log("Submitting form data:", formData);

      await registerSchool(    //added header:multipart/formdata in registerschool route in baseapi
        formData.schoolName,
        formData.name,
        formData.email,
        formData.phone,
        formData.address,
        formData.city,
        formData.state,
        formData.country,
        formData.pincode,
        formData.profilePic,

        formData.bloodType,
        formData.sex,
        formData.schoolLogo || new File([], ""),
        //added
      );


      toast.success("School registered successfully");
      // Reset form fields after successful registration
      setFormData({
        schoolName: "",
        name: "",
        email: "",
        phone: "",
        address: "",
        city: "",
        state: "",
        country: "",
        pincode: "",
        bloodType: "",
        sex: "",
        profilePic: null,
        schoolLogo: null,
      });

    } catch (error: any) {
      // console.error("Error during form submission:", error.response?.data || error.message);
      toast.error(error.message || "Failed to register school");
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <div className="page-wrapper">
      {/* //added */}
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />

      <div className="content content-two">
        <div className="d-md-flex d-block align-items-center justify-content-between mb-3">
          <div className="my-auto mb-2">
            <h3 className="mb-1">Add Schools</h3>
            <nav>
              <ol className="breadcrumb mb-0">
                <li className="breadcrumb-item">
                  <Link to="#">Dashboard</Link>
                </li>
                <li className="breadcrumb-item">
                  <Link to="#">Schools</Link>
                </li>
                <li className="breadcrumb-item active" aria-current="page">
                  Add Schools
                </li>
              </ol>
            </nav>
          </div>
        </div>

        <div className="row">
          <div className="col-md-12">
            <form onSubmit={handleSubmit}>
              <div className="card">
                <div className="card-header bg-light">
                  <div className="d-flex align-items-center">
                    <span className="bg-white avatar avatar-sm me-2 text-gray-7 flex-shrink-0">
                      <i className="ti ti-info-square-rounded fs-16" />
                    </span>
                    <h4 className="text-dark">School & Admin Information</h4>
                  </div>
                </div>
                <div className="card-body pb-1">

                  <div className="row mb-4">
                    {/* Profile Picture */}
                    <div className="col-md-6 mb-3">
                      <label className="form-label fw-semibold">Profile Picture</label>
                      <div className="d-flex align-items-center gap-3 flex-wrap">
                        <div className="border rounded overflow-hidden" style={{ width: 100, height: 100 }}>
                          {formData.profilePic ? (
                            <img
                              src={URL.createObjectURL(formData.profilePic)}
                              alt="Preview"
                              className="img-fluid h-100 w-100 object-fit-cover"
                            />
                          ) : (
                            <div className="d-flex justify-content-center align-items-center bg-light h-100">
                              <i className="ti ti-user fs-1 text-muted" />
                            </div>
                          )}
                        </div>
                        <div className="flex-grow-1">
                          <input
                            type="file"
                            accept=".jpg,.png,.svg"
                            className="form-control"
                            onChange={(e) => handleFileChange(e, "profilePic")}
                          />
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-danger mt-2"
                            onClick={() => setFormData((prev) => ({ ...prev, profilePic: null }))}
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* School Logo */}
                    <div className="col-md-6 mb-3">
                      <label className="form-label fw-semibold">School Logo</label>
                      <div className="d-flex align-items-center gap-3 flex-wrap">
                        <div className="border rounded overflow-hidden" style={{ width: 100, height: 100 }}>
                          {formData.schoolLogo ? (
                            <img
                              src={URL.createObjectURL(formData.schoolLogo)}
                              alt="Logo Preview"
                              className="img-fluid h-100 w-100 object-fit-cover"
                            />
                          ) : (
                            <div className="d-flex justify-content-center align-items-center bg-light h-100">
                              <i className="ti ti-building fs-1 text-muted" />
                            </div>
                          )}
                        </div>
                        <div className="flex-grow-1">
                          <input
                            type="file"
                            accept=".jpg,.png,.svg"
                            className="form-control"
                            onChange={(e) => handleFileChange(e, "schoolLogo")}
                          />
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-danger mt-2"
                            onClick={() => setFormData((prev) => ({ ...prev, schoolLogo: null }))}
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>


                  {/* Form Fields */}
                  <div className="row row-cols-xxl-5 row-cols-md-6">
                    <div className="col-xxl col-xl-3 col-md-6">
                      <div className="mb-3">
                        <label className="form-label">School Name</label>
                        <input
                          type="text"
                          className="form-control"
                          name="schoolName"
                          value={formData.schoolName}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>
                    <div className="col-xxl col-xl-3 col-md-6">
                      <div className="mb-3">
                        <label className="form-label">Admin Name</label>
                        <input
                          type="text"
                          className="form-control"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>
                    <div className="col-xxl col-xl-3 col-md-6">
                      <div className="mb-3">
                        <label className="form-label">Admin Email</label>
                        <input
                          type="email"
                          className="form-control"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>
                    <div className="col-xxl col-xl-3 col-md-6">
                      <div className="mb-3">
                        <label className="form-label">Phone</label>
                        <input
                          type="text"
                          className="form-control"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>
                    <div className="col-xxl col-xl-3 col-md-6">
                      <div className="mb-3">
                        <label className="form-label">Address</label>
                        <input
                          type="text"
                          className="form-control"
                          name="address"
                          value={formData.address}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>
                    <div className="col-xxl col-xl-3 col-md-6">
                      <div className="mb-3">
                        <label className="form-label">City</label>
                        <input
                          type="text"
                          className="form-control"
                          name="city"
                          value={formData.city}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>
                    <div className="col-xxl col-xl-3 col-md-6">
                      <div className="mb-3">
                        <label className="form-label">State</label>
                        <input
                          type="text"
                          className="form-control"
                          name="state"
                          value={formData.state}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>
                    <div className="col-xxl col-xl-3 col-md-6">
                      <div className="mb-3">
                        <label className="form-label">Country</label>
                        <input
                          type="text"
                          className="form-control"
                          name="country"
                          value={formData.country}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>
                    <div className="col-xxl col-xl-3 col-md-6">
                      <div className="mb-3">
                        <label className="form-label">Pincode</label>
                        <input
                          type="text"
                          className="form-control"
                          name="pincode"
                          value={formData.pincode}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>
                    <div className="col-xxl col-xl-3 col-md-6">
                      <div className="mb-3">
                        <label className="form-label">Blood Group</label>
                        <CommonSelect
                          className="select"
                          options={bloodGroup}
                          // defaultValue={formData.bloodType}
                          // onChange={(selected) => handleSelectChange("bloodType", selected?.value ||"")}
                          onChange={(selected) => {
                            // console.log("Selected bloodType:", selected?.value);
                            handleSelectChange("bloodType", selected?.value || "");
                          }}

                        />
                      </div>
                    </div>
                    <div className="col-xxl col-xl-3 col-md-6">
                      <div className="mb-3">
                        <label className="form-label">Gender</label>
                        <CommonSelect
                          className="select"
                          options={sex}
                          // defaultValue={formData.sex}

                          onChange={(selected: SelectOption | null) =>
                            handleSelectChange("sex", selected?.value || "")
                          }
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Form Actions */}
              <div className="text-end">
                <button type="button" className="btn btn-light me-3">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <span
                        className="spinner-border spinner-border-sm me-2"
                        role="status"
                        aria-hidden="true"
                      ></span>
                      Registering...
                    </>
                  ) : (
                    "Register School"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterSchool;