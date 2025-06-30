import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { DatePicker } from "antd";
import dayjs from "dayjs";
import { all_routes } from "../../../../../router/all_routes";
import { registerTeacher } from "../../../../../services/admin/teacherRegistartion";
import { ActiveStatus, ITeacherForm, MaritalStatus, UserSex } from "../../../../../services/types/auth";
import { jwtDecode } from "jwt-decode";

import { ToastContainer, toast } from 'react-toastify';
import AppConfig from "../../../../../config/config";
import { ValidationRules } from "../../../../Common/validation";



const TeacherForm = () => {
  const routes = all_routes;
 
  const [loading, setLoading] = useState<boolean>(false);
 
  const schoolID=localStorage.getItem("schoolId") || "" ;
  // console.log("schlid",token);
  // console.log("schlid",schoolID);
  
  const [formData, setFormData] = useState<ITeacherForm>({
    name: "",
    sex: UserSex.MALE,
    email: "",
    phone: "",
    bloodType: "",
    dateofJoin: "",
    fatherName: "",
    motherName: "",
    dateOfBirth: "",
    maritalStatus: MaritalStatus.MARRIED,
    languagesKnown: "",
    qualification: "",
    workExperience: "",
    previousSchool: "",
    previousSchoolAddress: "",
    previousSchoolPhone: "",
    address: "",
    panNumber: "",
    status: "Active" as ActiveStatus,
    salary: 0,
    contractType: "",
    dateOfPayment: "",
    medicalLeave: "",
    casualLeave: "",
    maternityLeave: "",
    sickLeave: "",
    bankName: "",
    accountNumber: "",
    ifscCode: "",
    branchName: "",
    route: "",
    vehicleNumber: "",
    pickUpPoint: "",
    hostelName: "",
    roomNumber: "",
    facebook: "",
    twitter: "",
    linkedin: "",
    instagram: "",
    youtube: "",
    schoolId: schoolID,
    city: "",
    state: "",
    country: "",
    pincode: "",
    teacherSchoolId: "",
    Resume: undefined,
    joiningLetter: undefined,
    profilePic: undefined,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (field: keyof ITeacherForm, date: dayjs.Dayjs | null) => {
    if (date) {
      setFormData((prev) => ({ ...prev, [field]: date.toDate() }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, field: keyof ITeacherForm) => {
    if (e.target.files && e.target.files[0]) {
      setFormData((prev) => ({ ...prev, [field]: e.target.files![0] }));
    }
  };

  const validationRules: ValidationRules = {
    email: {
      required: true,
      pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      type: "string",
    },
    phone: {
      required: true,
      pattern: /^[0-9]{10}$/,
      type: "string",
    },
    academicYear: {
      required: true,
      type: "string",
    },
    admissionNo: {
      required: true,
      type: "string",
    },
    admissionDate: {
      required: true,
      type: "date",
    },
    rollNo: {
      required: true,
      type: "string",
    },
    status: {
      required: true,
      validValues: ["ACTIVE", "INACTIVE"],
    },
    name: {
      required: true,
      minLength: 3,
      type: "string",
    },
    sex: {
      required: true,
      validValues: ["MALE", "FEMALE", "OTHERS"],
    },
    dateOfBirth: {
      required: true,
      type: "date",
    },
    bloodType: {
      required: true,
      type: "string",
      validValues: ["A+", "B+", "O+", "AB+", "A-", "B-", "O-", "AB-"],
    },
    house: {
      type: "string",
    },
    Religion: {
      type: "string",
    },
    category: {
      type: "string",
    },
    primaryContact: {
      required: true,
      pattern: /^[0-9]{10}$/,
      type: "string",
    },
    caste: {
      type: "string",
    },
    motherTongue: {
      type: "string",
    },
    languagesKnown: {
      type: "string",
    },
    fatherName: {
      required: true,
      type: "string",
    },
    fatheremail: {
      required: true,
      pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      type: "string",
    },
    fatherPhone: {
      required: true,
      pattern: /^[0-9]{10}$/,
      type: "string",
    },
    fatherOccupation: {
      required: true,
      type: "string",
    },
    motherName: {
      required: true,
      type: "string",
    },
    motherEmail: {
      required: true,
      pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      type: "string",
    },
    motherPhone: {
      required: true,
      pattern: /^[0-9]{10}$/,
      type: "string",
    },
    motherOccupation: {
      required: true,
      type: "string",
    },
    gardianName: {
      required: true,
      type: "string",
    },
    gardianRealtion: {
      required: true,
      type: "string",
    },
    gardianEmail: {
      required: true,
      pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      type: "string",
    },
    gardianPhone: {
      required: true,
      pattern: /^[0-9]{10}$/,
      type: "string",
    },
    gardianOccupation: {
      required: true,
      type: "string",
    },
    gardianAddress: {
      required: true,
      type: "string",
    },
    areSiblingStudying: {
      required: true,
      validValues: ["yes", "no"],
    },
    siblingName: {
      type: "string",
      custom: (value, data) => data.areSiblingStudying === "yes" && !value ? "Sibling Name is required" : null,
    },
    siblingClass: {
      type: "string",
      custom: (value, data) => data.areSiblingStudying === "yes" && !value ? "Sibling Class is required" : null,
    },
    siblingRollNo: {
      type: "string",
      custom: (value, data) => data.areSiblingStudying === "yes" && !value ? "Sibling Roll No is required" : null,
    },
    sibllingAdmissionNo: {
      type: "string",
      custom: (value, data) => data.areSiblingStudying === "yes" && !value ? "Sibling Admission No is required" : null,
    },
    currentAddress: {
      required: true,
      type: "string",
    },
    permanentAddress: {
      required: true,
      type: "string",
    },
    city: {
      required: true,
      type: "string",
    },
    state: {
      required: true,
      type: "string",
    },
    country: {
      required: true,
      type: "string",
    },
    pincode: {
      required: true,
      pattern: /^[0-9]{6}$/,
      type: "string",
    },
    vehicleNumber: {
      required: true,
      type: "string",
    },
    pickUpPoint: {
      required: true,
      type: "string",
    },
    hostelName: {
      required: true,
      type: "string",
    },
    roomNumber: {
      required: true,
      type: "string",
    },
    medicaConditon: {
      required: true,
      validValues: ["good", "bad", "others"],
    },
    allergies: {
      type: "string",
    },
    medicationName: {
      type: "string",
    },
    schoolName: {
      required: true,
      type: "string",
    },
    classId: {
      required: true,
      type: "string",
    },
    section: {
      required: true,
      type: "string",
    },
  };

  const validateForm = () => {
    // Required fields as per backend schema
    const requiredFields = [
      'name', 'sex', 'email', 'phone', 'bloodType', 'teacherSchoolId', 'dateofJoin',
      'fatherName', 'motherName', 'dateOfBirth', 'maritalStatus', 'languagesKnown',
      'qualification', 'workExperience', 'previousSchool', 'previousSchoolAddress',
      'previousSchoolPhone', 'address', 'salary', 'accountNumber', 'bankName',
      'ifscCode', 'branchName', 'schoolId', 'city', 'state', 'country', 'pincode'
    ];
    for (const field of requiredFields) {
      // @ts-expect-error: dynamic key access for validation
      const value = formData[field];
      if (!value || (typeof value === 'string' && value.trim() === '')) {
        return `Field '${field}' is required.`;
      }
    }
    // Required files
    if (!formData.profilePic) return 'Profile picture is required.';
    if (!formData.Resume) return 'Resume is required.';
    if (!formData.joiningLetter) return 'Joining letter is required.';
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const validationError = validateForm();
    if (validationError) {
      toast.error(validationError);
      setLoading(false);
      return;
    }
    if (!formData.profilePic || !formData.Resume || !formData.joiningLetter) {
      toast.error("All required documents (Profile Pic, Resume, Joining Letter) must be uploaded.");
      setLoading(false);
      return;
    }
    try {
    
      const cleanedFormData = Object.entries(formData).reduce((acc: any, [key, value]) => {
     
        if (value === "" || value === undefined || value === null) {
          return acc;
        }

        // Handle specific field types
        if (key === "salary") {
          const numValue = Number(value);
          if (!isNaN(numValue)) {
            acc[key] = numValue; // Only set if it's a valid number
          }
        } else if (value instanceof Date) {
          acc[key] = value.toISOString(); // Convert dates to ISO string
        } else if (value instanceof File) {
          acc[key] = value; // Keep files as is
        } else {
          acc[key] = value; // Keep other values as is
        }
        
        return acc;
      }, {});

      const response = await registerTeacher(cleanedFormData);
      if (response.status === 200) {
        toast.success('Teacher added successfully');
        // Reset form with proper initial values
        const initialFormState: ITeacherForm = {
          name: "",
          sex: UserSex.MALE,
          email: "",
          phone: "",
          bloodType: "",
          dateofJoin: "",
          fatherName: "",
          motherName: "",
          dateOfBirth: "",
          maritalStatus: MaritalStatus.MARRIED,
          languagesKnown: "",
          qualification: "",
          workExperience: "",
          previousSchool: "",
          previousSchoolAddress: "",
          previousSchoolPhone: "",
          address: "",
          panNumber: "",
          status: "Active" as ActiveStatus,
          salary: 0,
          contractType: "",
          dateOfPayment: "",
          medicalLeave: "",
          casualLeave: "",
          maternityLeave: "",
          sickLeave: "",
          bankName: "",
          accountNumber: "",
          ifscCode: "",
          branchName: "",
          route: "",
          hostelName: "",
          roomNumber: "",
          facebook: "",
          twitter: "",
          linkedin: "",
          instagram: "",
          youtube: "",
          schoolId: schoolID,
          city: "",
          state: "",
          country: "",
          pincode: "",
          teacherSchoolId: "",
          Resume: undefined,
          joiningLetter: undefined,
          profilePic: undefined,
        };
        setFormData(initialFormState);
      } else {
        toast.error('Failed to add teacher');
      }
    } catch (error: any) {
      if (error.response && error.response.data && error.response.data.error) {
        toast.error(error.response.data.error);
      } else {
        toast.error('Failed to add teacher');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-wrapper">
     <ToastContainer position="top-center" autoClose={3000} /> 
      <div className="content content-two">
        <div className="d-md-flex d-block align-items-center justify-content-between mb-3">
          <div className="my-auto mb-2">
            <h3 className="mb-1">Add Teacher</h3>
            <nav>
              <ol className="breadcrumb mb-0">
                <li className="breadcrumb-item">
                  <Link to={routes.adminDashboard}>Dashboard</Link>
                </li>
                <li className="breadcrumb-item">
                  <Link to={routes.teacherList}>Teacher</Link>
                </li>
                <li className="breadcrumb-item active">Add Teacher</li>
              </ol>
            </nav>
          </div>
        </div>

        <div className="row">
          <div className="col-md-12">
            <form onSubmit={handleSubmit}>
              {/* Personal Information */}
              <div className="card">
                <div className="card-header bg-light">
                  <div className="d-flex align-items-center">
                    <span className="bg-white avatar avatar-sm me-2 text-gray-7 flex-shrink-0">
                      <i className="ti ti-info-square-rounded fs-16" />
                    </span>
                    <h4 className="text-dark">Personal Information</h4>
                  </div>
                </div>
                <div className="card-body pb-1">
                  {/* <div className="row">
                    <div className="col-md-12">
                      <div className="d-flex align-items-center flex-wrap row-gap-3 mb-3">
                        <div className="d-flex align-items-center justify-content-center avatar avatar-xxl border border-dashed me-2 flex-shrink-0 text-dark frames">
                          <i className="ti ti-photo-plus fs-16" />
                        </div>
                        <div className="profile-upload">
                          <div className="profile-uploader d-flex align-items-center">
                            <div className="drag-upload-btn mb-3">
                              Upload
                              <input
                                type="file"
                                className="form-control image-sign"
                                // accept="image/*"
                                multiple
                                onChange={(e) => handleFileChange(e, "profilePic")}
                              />
                            </div>
                            <button 
                              type="button" 
                              className="btn btn-primary mb-3"
                              onClick={() => setFormData({...formData, profilePic: null})}
                            >
                              Remove
                            </button>
                          </div>
                          <p className="fs-12">
                            Upload image size 4MB, Format JPG, PNG, SVG
                          </p>
                        </div>
                      </div>
                    </div>
                  </div> */}
                    {/* teacher image upload */}
                    <div className="row">
                    <div className="col-md-12">
                      <div className="d-flex align-items-center flex-wrap row-gap-3 mb-3">
                        <div className="d-flex align-items-center justify-content-center avatar avatar-xxl border border-dashed me-2 flex-shrink-0 text-dark frames">
                          {formData.profilePic ? (
                            <img
                              src={URL.createObjectURL(formData.profilePic)}
                              alt="Profile Preview"
                              style={{ width: "100%", height: "100%", objectFit: "cover" }}
                            />
                          ) : (
                            <i className="ti ti-photo-plus fs-16" />
                          )}
                        </div>
                        <div className="profile-upload">
                          <div className="profile-uploader d-flex align-items-center">
                            <div className="drag-upload-btn mb-3">
                              Upload profile 
                              <input
                                type="file"
                                name="profilePic"  //added
                                className="form-control image-sign"
                                accept=".jpg,.png,.svg"
                                onChange={(e)=>handleFileChange(e,"profilePic")}
                              />
                            </div>
                            <Link
                              to="#"
                              className="btn btn-primary mb-3"
                              onClick={() => setFormData((prev) => ({ ...prev, profilePic: undefined }))}
                            >
                              Remove
                            </Link>
                          </div>
                          <p className="fs-12">Upload image size 4MB, Format JPG, PNG, SVG</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="row row-cols-xxl-5 row-cols-md-6">
                  <div className="col-xxl col-xl-3 col-md-6">
                      <div className="mb-3">
                        <label className="form-label">teacher Id</label>
                        <input
                          type="text"
                          className="form-control"
                          name="teacherSchoolId"
                          value={formData.teacherSchoolId}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                    </div>
                    <div className="col-xxl col-xl-3 col-md-6">
                      <div className="mb-3">
                        <label className="form-label">Name*</label>
                        <input
                          type="text"
                          className="form-control"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                    </div>

                    <div className="col-xxl col-xl-3 col-md-6">
                      <div className="mb-3">
                        <label className="form-label">Gender*</label>
                        <select
                          className="form-select"
                          name="sex"
                          value={formData.sex}
                          onChange={handleInputChange}
                          required
                        >
                          <option value="">Select Gender</option>
                          <option value="MALE">Male</option>
                          <option value="FEMALE">Female</option>
                          <option value="OTHERS">Others</option>
                        </select>
                      </div>
                    </div>

                    <div className="col-xxl col-xl-3 col-md-6">
                      <div className="mb-3">
                        <label className="form-label">Email*</label>
                        <input
                          type="email"
                          className="form-control"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                    </div>

                    <div className="col-xxl col-xl-3 col-md-6">
                      <div className="mb-3">
                        <label className="form-label">Phone*</label>
                        <input
                          type="tel"
                          className="form-control"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                    </div>

                    <div className="col-xxl col-xl-3 col-md-6">
                      <div className="mb-3">
                        <label className="form-label">Blood Group</label>
                        <select
                          className="form-select"
                          name="bloodType"
                          value={formData.bloodType}
                          onChange={handleInputChange}
                          required
                        >

                          <option value="">Select Blood Group</option>
                          <option value="A+">A+</option>
                          <option value="B+">B+</option>
                          <option value="O+">O+</option>
                          <option value="AB+">AB+</option>
                          <option value="A-">A-</option>
                          <option value="B-">B-</option>
                          <option value="O-">O-</option>
                          <option value="AB-">AB-</option>
                        </select>

                      </div>
                    </div>

                    <div className="col-xxl col-xl-3 col-md-6">
                      <div className="mb-3">
                        <label className="form-label">Date of Joining*</label>
                        <div className="input-icon position-relative">
                          <span className="input-icon-addon">
                            <i className="ti ti-calendar" />
                          </span>
                          <DatePicker
                            className="form-control datetimepicker"
                            format="YYYY-MM-DD"
                            value={formData.dateofJoin ? dayjs(formData.dateofJoin) : null}
                            onChange={(date) => handleDateChange("dateofJoin", date)}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="col-xxl col-xl-3 col-md-6">
                      <div className="mb-3">
                        <label className="form-label">Father's Name</label>
                        <input
                          type="text"
                          className="form-control"
                          name="fatherName"
                          value={formData.fatherName}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>

                    <div className="col-xxl col-xl-3 col-md-6">
                      <div className="mb-3">
                        <label className="form-label">Mother's Name</label>
                        <input
                          type="text"
                          className="form-control"
                          name="motherName"
                          value={formData.motherName}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>

                    <div className="col-xxl col-xl-3 col-md-6">
                      <div className="mb-3">
                        <label className="form-label">Date of Birth</label>
                        <div className="input-icon position-relative">
                          <DatePicker
                            className="form-control datetimepicker"
                            format="YYYY-MM-DD"
                            value={formData.dateOfBirth ? dayjs(formData.dateOfBirth) : null}
                            onChange={(date) => handleDateChange("dateOfBirth", date)}
                          />
                          <span className="input-icon-addon">
                            <i className="ti ti-calendar" />
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="col-xxl col-xl-3 col-md-6">
                      <div className="mb-3">
                        <label className="form-label">Marital Status</label>
                        <select
                          className="form-select"
                          name="maritalStatus"
                          value={formData.maritalStatus}
                          onChange={handleInputChange}
                        >
                          <option value="">Select Status</option>
                          <option value="MARRIED">Married</option>
                          <option value="UNMARRIED">Unmarried</option>
                          <option value="DIVORCED">Divorced</option>
                        </select>
                      </div>
                    </div>

                    <div className="col-xxl col-xl-3 col-md-6">
                      <div className="mb-3">
                        <label className="form-label">Languages Known</label>
                        <input
                          type="text"
                          className="form-control"
                          name="languagesKnown"
                          value={formData.languagesKnown}
                          onChange={handleInputChange}
                          placeholder="English, Hindi, etc."
                        />
                      </div>
                    </div>

                    <div className="col-xxl col-xl-3 col-md-6">
                      <div className="mb-3">
                        <label className="form-label">Qualification</label>
                        <input
                          type="text"
                          className="form-control"
                          name="qualification"
                          value={formData.qualification}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>

                    <div className="col-xxl col-xl-3 col-md-6">
                      <div className="mb-3">
                        <label className="form-label">Work Experience</label>
                        <input
                          type="text"
                          className="form-control"
                          name="workExperience"
                          value={formData.workExperience}
                          onChange={handleInputChange}
                          placeholder="3 years"
                        />
                      </div>
                    </div>

                    <div className="col-xxl col-xl-3 col-md-6">
                      <div className="mb-3">
                        <label className="form-label">Previous School</label>
                        <input
                          type="text"
                          className="form-control"
                          name="previousSchool"
                          value={formData.previousSchool}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>

                  
                    <div className="col-xxl col-xl-3 col-md-6">
                      <div className="mb-3">
                        <label className="form-label">School Address</label>
                        <input
                          type="text"
                          className="form-control"
                          name="previousSchoolAddress"
                          value={formData.previousSchoolAddress}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>

                    <div className="col-xxl col-xl-3 col-md-6">
                      <div className="mb-3">
                        <label className="form-label">School Phone</label>
                        <input
                          type="tel"
                          className="form-control"
                          name="previousSchoolPhone"
                          value={formData.previousSchoolPhone}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>

                    <div className="col-xxl col-xl-3 col-md-6">
                      <div className="mb-3">
                        <label className="form-label">Address*</label>
                        <input
                          type="text"
                          className="form-control"
                          name="address"
                          value={formData.address}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                    </div>

                    <div className="col-xxl col-xl-3 col-md-6">
                      <div className="mb-3">
                        <label className="form-label">City*</label>
                        <input
                          type="text"
                          className="form-control"
                          name="city"
                          value={formData.city}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                    </div>

                    <div className="col-xxl col-xl-3 col-md-6">
                      <div className="mb-3">
                        <label className="form-label">State*</label>
                        <input
                          type="text"
                          className="form-control"
                          name="state"
                          value={formData.state}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                    </div>

                    <div className="col-xxl col-xl-3 col-md-6">
                      <div className="mb-3">
                        <label className="form-label">Country*</label>
                        <input
                          type="text"
                          className="form-control"
                          name="country"
                          value={formData.country}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                    </div>

                    <div className="col-xxl col-xl-3 col-md-6">
                      <div className="mb-3">
                        <label className="form-label">Pincode*</label>
                        <input
                          type="text"
                          className="form-control"
                          name="pincode"
                          value={formData.pincode}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                    </div>

                    <div className="col-xxl col-xl-3 col-md-6">
                      <div className="mb-3">
                        <label className="form-label">Status</label>
                        <select
                          className="form-select"
                          name="status"
                          value={formData.status}
                          onChange={handleInputChange}
                        >
                          <option value={ActiveStatus.ACTIVE}>Active</option>
                          <option value={ActiveStatus.INACTIVE}>Inactive</option>
                          <option value={ActiveStatus.SUSPENDED}>Suspended</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Employment Details */}
              <div className="card">
                <div className="card-header bg-light">
                  <div className="d-flex align-items-center">
                    <span className="bg-white avatar avatar-sm me-2 text-gray-7 flex-shrink-0">
                      <i className="ti ti-user-shield fs-16" />
                    </span>
                    <h4 className="text-dark">Employment Details</h4>
                  </div>
                </div>
                <div className="card-body pb-1">
                  <div className="row">
                    <div className="col-lg-4 col-md-6">
                      <div className="mb-3">
                        <label className="form-label">Salary*</label>
                        <input
                          type="number"
                          className="form-control"
                          name="salary"
                          value={formData.salary}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                    </div>

                    <div className="col-lg-4 col-md-6">
                      <div className="mb-3">
                        <label className="form-label">Contract Type*</label>
                        <select
                          className="form-select"
                          name="contractType"
                          value={formData.contractType}
                          onChange={handleInputChange}
                          required
                        >
                          <option value="">Select Type</option>
                          <option value="Permanent">Permanent</option>
                          <option value="Contract">Contract</option>
                          <option value="Temporary">Temporary</option>
                        </select>
                      </div>
                    </div>
                    <div className="col-xxl col-xl-3 col-md-6">
                      <div className="mb-3">
                        <label className="form-label">Payment date</label>
                        <div className="input-icon position-relative">
                          <DatePicker
                            className="form-control datetimepicker"
                            format="YYYY-MM-DD"
                            value={formData.dateOfPayment ? dayjs(formData.dateOfPayment) : null}
                            onChange={(date) => handleDateChange("dateOfPayment", date)}
                          />
                          <span className="input-icon-addon">
                            <i className="ti ti-calendar" />
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Leave Information */}
              {/* <div className="card">
                <div className="card-header bg-light">
                  <div className="d-flex align-items-center">
                    <span className="bg-white avatar avatar-sm me-2 text-gray-7 flex-shrink-0">
                      <i className="ti ti-users fs-16" />
                    </span>
                    <h4 className="text-dark">Leave Information</h4>
                  </div>
                </div>
                <div className="card-body pb-1">
                  <div className="row">
                    <div className="col-lg-3 col-md-6">
                      <div className="mb-3">
                        <label className="form-label">Medical Leave</label>
                        <input
                          type="number"
                          className="form-control"
                          name="medicalLeave"
                          value={formData.medicalLeave}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>

                    <div className="col-lg-3 col-md-6">
                      <div className="mb-3">
                        <label className="form-label">Casual Leave</label>
                        <input
                          type="number"
                          className="form-control"
                          name="casualLeave"
                          value={formData.casualLeave}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>

                    <div className="col-lg-3 col-md-6">
                      <div className="mb-3">
                        <label className="form-label">Maternity Leave</label>
                        <input
                          type="number"
                          className="form-control"
                          name="maternityLeave"
                          value={formData.maternityLeave}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>

                    <div className="col-lg-3 col-md-6">
                      <div className="mb-3">
                        <label className="form-label">Sick Leave</label>
                        <input
                          type="number"
                          className="form-control"
                          name="sickLeave"
                          value={formData.sickLeave}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div> */}

              {/* Bank Details */}
              <div className="card">
                <div className="card-header bg-light">
                  <div className="d-flex align-items-center">
                    <span className="bg-white avatar avatar-sm me-2 text-gray-7 flex-shrink-0">
                      <i className="ti ti-map fs-16" />
                    </span>
                    <h4 className="text-dark">Bank Account Details</h4>
                  </div>
                </div>
                <div className="card-body pb-1">
                  <div className="row">
                    <div className="col-lg-4 col-md-6">
                      <div className="mb-3">
                        <label className="form-label">Bank Name</label>
                        <input
                          type="text"
                          className="form-control"
                          name="bankName"
                          value={formData.bankName}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>

                    <div className="col-lg-4 col-md-6">
                      <div className="mb-3">
                        <label className="form-label">Account Number</label>
                        <input
                          type="text"
                          className="form-control"
                          name="accountNumber"
                          value={formData.accountNumber}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>

                    <div className="col-lg-4 col-md-6">
                      <div className="mb-3">
                        <label className="form-label">IFSC Code</label>
                        <input
                          type="text"
                          className="form-control"
                          name="ifscCode"
                          value={formData.ifscCode}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>

                    <div className="col-lg-4 col-md-6">
                      <div className="mb-3">
                        <label className="form-label">Branch Name</label>
                        <input
                          type="text"
                          className="form-control"
                          name="branchName"
                          value={formData.branchName}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Transport Information */}
              {/* <div className="card">
                <div className="card-header bg-light">
                  <div className="d-flex align-items-center">
                    <span className="bg-white avatar avatar-sm me-2 text-gray-7 flex-shrink-0">
                      <i className="ti ti-bus-stop fs-16" />
                    </span>
                    <h4 className="text-dark">Transport Information</h4>
                  </div>
                </div>
                <div className="card-body pb-1">
                  <div className="row">
                    <div className="col-lg-4 col-md-6">
                      <div className="mb-3">
                        <label className="form-label">Route</label>
                        <input
                          type="text"
                          className="form-control"
                          name="route"
                          value={formData.route}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>

                    <div className="col-lg-4 col-md-6">
                      <div className="mb-3">
                        <label className="form-label">Vehicle Number</label>
                        <input
                          type="text"
                          className="form-control"
                          name="vehicleNumber"
                          value={formData.vehicleNumber}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>

                    <div className="col-lg-4 col-md-6">
                      <div className="mb-3">
                        <label className="form-label">Pickup Point</label>
                        <input
                          type="text"
                          className="form-control"
                          name="pickUpPoint"
                          value={formData.pickUpPoint}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div> */}

              {/* Hostel Information */}
              {/* <div className="card">
                <div className="card-header bg-light">
                  <div className="d-flex align-items-center">
                    <span className="bg-white avatar avatar-sm me-2 text-gray-7 flex-shrink-0">
                      <i className="ti ti-building-fortress fs-16" />
                    </span>
                    <h4 className="text-dark">Hostel Information</h4>
                  </div>
                </div>
                <div className="card-body pb-1">
                  <div className="row">
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="form-label">Hostel Name</label>
                        <input
                          type="text"
                          className="form-control"
                          name="hostelName"
                          value={formData.hostelName}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>

                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="form-label">Room Number</label>
                        <input
                          type="text"
                          className="form-control"
                          name="roomNumber"
                          value={formData.roomNumber}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div> */}

              {/* Social Media Links */}
              {/* <div className="card">
                <div className="card-header bg-light">
                  <div className="d-flex align-items-center">
                    <span className="bg-white avatar avatar-sm me-2 text-gray-7 flex-shrink-0">
                      <i className="ti ti-building fs-16" />
                    </span>
                    <h4 className="text-dark">Social Media Links</h4>
                  </div>
                </div>
                <div className="card-body pb-1">
                  <div className="row">
                    <div className="col-lg-4 col-md-6">
                      <div className="mb-3">
                        <label className="form-label">Facebook</label>
                        <input
                          type="text"
                          className="form-control"
                          name="facebook"
                          value={formData.facebook}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>

                    <div className="col-lg-4 col-md-6">
                      <div className="mb-3">
                        <label className="form-label">Twitter</label>
                        <input
                          type="text"
                          className="form-control"
                          name="twitter"
                          value={formData.twitter}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>

                    <div className="col-lg-4 col-md-6">
                      <div className="mb-3">
                        <label className="form-label">LinkedIn</label>
                        <input
                          type="text"
                          className="form-control"
                          name="linkedin"
                          value={formData.linkedin}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>

                    <div className="col-lg-4 col-md-6">
                      <div className="mb-3">
                        <label className="form-label">Instagram</label>
                        <input
                          type="text"
                          className="form-control"
                          name="instagram"
                          value={formData.instagram}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>

                    <div className="col-lg-4 col-md-6">
                      <div className="mb-3">
                        <label className="form-label">YouTube</label>
                        <input
                          type="text"
                          className="form-control"
                          name="youtube"
                          value={formData.youtube}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div> */}

              {/* Documents */}
              <div className="card">
                <div className="card-header bg-light">
                  <div className="d-flex align-items-center">
                    <span className="bg-white avatar avatar-sm me-2 text-gray-7 flex-shrink-0">
                      <i className="ti ti-file fs-16" />
                    </span>
                    <h4 className="text-dark">Documents</h4>
                  </div>
                </div>
                <div className="card-body pb-1">
                  <div className="row">
                    <div className="col-lg-6">
                      <div className="mb-3">
                        <label className="form-label">Resume (PDF)</label>
                        <div className="d-flex align-items-center">
                          <div className="btn btn-primary drag-upload-btn me-2">
                            <i className="ti ti-file-upload me-1" />
                            Upload
                            <input
                              type="file"
                              className="form-control image_sign"
                              onChange={(e) => handleFileChange(e, "Resume")}
                              // accept=".pdf"
                              multiple
                            />
                          </div>
                          {formData.Resume && (
                            <span className="text-truncate" style={{maxWidth: '200px'}}>
                              {formData.Resume.name}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="col-lg-6">
                      <div className="mb-3">
                        <label className="form-label">Joining Letter (PDF)</label>
                        <div className="d-flex align-items-center">
                          <div className="btn btn-primary drag-upload-btn me-2">
                            <i className="ti ti-file-upload me-1" />
                            Upload
                            <input
                              type="file"
                              className="form-control image_sign"
                              onChange={(e) => handleFileChange(e, "joiningLetter")}
                              // accept=".pdf"
                              multiple
                            />
                          </div>
                          {formData.joiningLetter && (
                            <span className="text-truncate" style={{maxWidth: '200px'}}>
                              {formData.joiningLetter.name}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="card-footer d-flex justify-content-end">
                <button
                  type="submit"
                  className="btn btn-primary me-2"
                  disabled={loading}
                >
                  {loading ? "Adding..." : "Add Teacher"}
                </button>
                <Link to="#">
                  <button type="button" className="btn btn-light">
                    Cancel
                  </button>
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherForm;