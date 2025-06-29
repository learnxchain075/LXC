import { useState, FormEvent } from "react";
import { Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import CommonSelect from "../../../core/common/commonSelect";
import { bloodGroup, sex } from "../../../core/common/selectoption/selectoption";
import { registerSchool } from "../../../services/superadmin/schoolService";

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
  profilePic: File | null;
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
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, field: keyof FormData) => {
    const file = e.target.files?.[0] || null;
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
      await registerSchool(
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
        formData.schoolLogo || new File([], "")
      );

      toast.success("School registered successfully");
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
        bloodType: "O-VE",
        sex: "MALE",
        profilePic: null,
        schoolLogo: null,
      });
    } catch (error: any) {
      toast.error(error.message || "Failed to register school");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container-fluid py-4 px-3 px-md-5">
      <ToastContainer />
      <h2 className="mb-3">Register School</h2>

      <form onSubmit={handleSubmit}>
        {/* Uploads */}
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
        <div className="row g-3">
          {[
            ["schoolName", "School Name"],
            ["name", "Admin Name"],
            ["email", "Admin Email", "email"],
            ["phone", "Phone"],
            ["address", "Address"],
            ["city", "City"],
            ["state", "State"],
            ["country", "Country"],
            ["pincode", "Pincode"],
          ].map(([field, label, type = "text"]) => (
            <div key={field} className="col-md-6 col-lg-4">
              <label className="form-label">{label}</label>
              <input
                type={type}
                name={field}
                className="form-control"
                value={(formData as any)[field]}
                onChange={handleInputChange}
              />
            </div>
          ))}

          {/* Blood Group */}
          <div className="col-md-6 col-lg-4">
            <label className="form-label">Blood Group</label>
            <CommonSelect
              options={bloodGroup}
              onChange={(selected: SelectOption | null) =>
                handleSelectChange("bloodType", selected?.value || "")
              }
            />
          </div>

          {/* Gender */}
          <div className="col-md-6 col-lg-4">
            <label className="form-label">Gender</label>
            <CommonSelect
              options={sex}
              onChange={(selected: SelectOption | null) =>
                handleSelectChange("sex", selected?.value || "")
              }
            />
          </div>
        </div>

        {/* Actions */}
        <div className="mt-4 text-end">
          <button type="button" className="btn btn-secondary me-2">
            Cancel
          </button>
          <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                Registering...
              </>
            ) : (
              "Register School"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default RegisterSchool;
