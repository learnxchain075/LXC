import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { DatePicker } from "antd";
import dayjs from "dayjs";
import { all_routes } from "../../../../../router/all_routes";
import {
  AdmissionNo,
  Hostel,
  PickupPoint,
  VehicleNumber,
  academicYear,
  allClass,
  allSection,
  bloodGroup,
  cast,
  gender,
  house,
  mothertongue,
  names,
  religion,
  rollno,
  roomNO,
  route,
  status,
} from "../../../../../core/common/selectoption/selectoption";
import { TagsInput } from "react-tag-input-component";
import CommonSelect from "../../../../../core/common/commonSelect";
import { useLocation } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import AppConfig from "../../../../../config/config";
import { registerStudent } from "../../../../../services/admin/studentRegister";
import { ActiveStatusstudent, IStudentForm, UserSex } from "../../../../../services/types/auth";
import { getClassByschoolId } from "../../../../../services/teacher/classServices";
import { getPickupPointsBySchool } from "../../../../../services/transport/busPickUpPointServices";
import { getBusbyID } from "../../../../../services/transport/busServices";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { validateForm, ValidationRules } from "../../../../Common/validation";
import ErrorBoundary from "../../../../../components/ErrorBoundary";
import CustomLoader from "../../../../../components/Loader";

function validateRequiredFields(data: any) {
  const requiredFields = [
    "email",
    "phone",
    "academicYear",
    "admissionNo",
    "admissionDate",
    "rollNo",
    "name",
    "section",
    "sex",
    "dateOfBirth",
    "bloodType",
    "Religion",
    "category",
    "primaryContact",
    "caste",
    "motherTongue",
    "languagesKnown",
    "fatherName",
    "fatherPhone",
    "fatherOccupation",
    "motherName",
    "motherOccupation",
    "motherPhone",
    "guardianName",
    "guardianRelation",
    "guardianEmail",
    "guardianPhone",
    "guardianOccupation",
    "guardianAddress",
    "areSiblingStudying",
    "siblingName",
    "siblingClass",
    "siblingRollNo",
    "siblingAdmissionNo",
    "currentAddress",
    "permanentAddress",
    "city",
    "state",
    "country",
    "pincode",
    "vehicleNumber",
    "pickUpPoint",
    "hostelName",
    "roomNumber",
    "medicalCondition",
    "allergies",
    "medicationName",
    "schoolName",
    "schoolId",
    "classId",
    "address",
  ];
  const errors: Record<string, string> = {};
  requiredFields.forEach((field) => {
    if (!data[field] || (typeof data[field] === "string" && data[field].trim() === "")) {
      errors[field] = `${field} is required`;
    }
  });
  return errors;
}
enum ActiveStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  SUSPENDED = "SUSPENDED"
}
const AddStudent = () => {
  const routes = all_routes;
  const location = useLocation();
  const navigate = useNavigate();
  const schoolID: string = localStorage.getItem("schoolId") ?? "";
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [languages, setLanguages] = useState<string[]>([]);
  const [medications, setMedications] = useState<string[]>([]);
  const [allergies, setAllergies] = useState<string[]>([]);
  const [pickupPoints, setPickupPoints] = useState<any[]>([]);
  const [busList, setBusList] = useState<any[]>([]);
  const [defaultDate, setDefaultDate] = useState<dayjs.Dayjs | null>(null);
  const [newContents, setNewContents] = useState<number[]>([0]);
  const [classList, setClassList] = useState<any[]>([]);
  const [showClassList, setShowClassList] = useState(false);
  const [isLoadingClasses, setIsLoadingClasses] = useState(false);
  const [classError, setClassError] = useState<string>("");
  const [formDataClass, setFormDataClass] = useState({
    classId: "",
    className: "",
    section: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [availableSections, setAvailableSections] = useState<string[]>([]);
  const [transportEnabled, setTransportEnabled] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState<IStudentForm>({
    email: "",
    phone: "",
    name: "",
    sex: UserSex.MALE,
    bloodType: "",
    primaryContact: "",
    academicYear: "",
    admissionNo: "",
    admissionDate: new Date(),
    rollNo: "",
    status: ActiveStatusstudent.ACTIVE,
    dateOfBirth: new Date(),
    Religion: "",
    category: "",
    caste: "",
    motherTongue: "",
    languagesKnown: "",
    fatherName: "",
    fatheremail: "",
    fatherPhone: "",
    fatherOccupation: "",
    motherName: "",
    motherOccupation: "",
    motherEmail: "",
    motherPhone: "",
    guardianName: "",
    guardianRelation: "",
    guardianEmail: "",
    guardianPhone: "",
    guardianOccupation: "",
    guardianAddress: "",
    areSiblingStudying: "no",
    siblingName: "",
    siblingClass: "",
    siblingRollNo: "",
    siblingAdmissionNo: "",
    currentAddress: "",
    permanentAddress: "",
    vehicleNumber: "",
    pickUpPoint: "",
    hostelName: "",
    roomNumber: "",
    medicalCondition: "",
    allergies: "",
    medicationName: "",
    schoolName: "",
    schoolId: schoolID,
    classId: "",
    section: "",
    address: "",
    city: "",
    state: "",
    country: "",
    pincode: "",
    house: "",
    profilePic: undefined,
    medicalCertificate: undefined,
    transferCertificate: undefined
  });

  const fetchBuses = async () => {
    const schoolId = localStorage.getItem("schoolId") || "";
    try {
      const res = await getBusbyID(schoolId);
      const buses = Array.isArray(res.data) ? res.data : [];
      if (buses.length === 0) {
        setBusList([]);
      } else {
        const minimal = buses.map((bus: any) => ({
          id: bus.id,
          busNumber: bus.busNumber,
        }));
        setBusList(minimal);
      }
    } catch (err) {
      console.error("Error fetching buses", err);
      setBusList([]);
    }
  };

  const fetchpickup = async () => {
    const schoolId = localStorage.getItem("schoolId") || "";
    try {
      const res = await getPickupPointsBySchool(schoolId);
      const buses = Array.isArray(res.data) ? res.data : [];
      setPickupPoints(buses);
    } catch (err) {
      console.error("Error fetching buses", err);
      setPickupPoints([]);
    }
  };

  useEffect(() => {
    fetchBuses();
    fetchpickup();
  }, []);

  useEffect(() => {
    const fetchClasses = async () => {
      if (!schoolID) {
        console.log("No schoolID available");
        setClassError("School ID not found");
        return;
      }
      setIsLoadingClasses(true);
      setClassError("");
      try {
        const response = await getClassByschoolId(schoolID);
        let classes: any[] = [];
        if (Array.isArray(response.data)) {
          classes = response.data;
        } else if (response.data && Array.isArray(response.data.data)) {
          classes = response.data.data;
        }
        setClassList(classes);
      } catch (error) {
        console.error("Error fetching classes:", error);
        setClassError("Failed to load classes");
        setClassList([]);
      } finally {
        setIsLoadingClasses(false);
      }
    };
    fetchClasses();
  }, [schoolID]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const generateAcademicYears = () => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let i = 0; i < 4; i++) {
      const startYear = currentYear + i;
      const endYear = startYear + 1;
      years.push(`${startYear}-${endYear}`);
    }
    return years;
  };

  const academicYears = generateAcademicYears();

  const handleSelectChange = (name: keyof IStudentForm, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleDateChange = (name: keyof IStudentForm, date: dayjs.Dayjs | null) => {
    if (date) {
      setFormData((prev) => ({ ...prev, [name]: date.toDate() }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, field: keyof IStudentForm) => {
    if (e.target.files && e.target.files[0]) {
      setFormData((prev) => ({ ...prev, [field]: e.target.files![0] }));
    }
  };

  const handleClassClick = (cls: any) => {
    let sections: string[] = [];
    if (Array.isArray(cls.Section) && cls.Section.length > 0) {
      sections = cls.Section.map((s: any) => s.name);
    } else if (cls.section) {
      sections = cls.section.split(",").map((s: string) => s.trim());
    }
    setAvailableSections(sections);
    setFormDataClass({
      classId: cls.id,
      className: cls.name,
      section: "",
    });
    setFormData((prev) => ({
      ...prev,
      classId: cls.id,
      section: "",
    }));
    setShowClassList(false);
  };

  const handleSectionClick = (sec: string) => {
    setFormDataClass((prev) => ({
      ...prev,
      section: sec,
    }));
    setFormData((prev) => ({
      ...prev,
      section: sec,
    }));
  };

  const validationRules: ValidationRules = {
    email: {
      pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      type: "string",
    },
    phone: {
      pattern: /^[0-9]{10}$/,
      type: "string",
    },
    academicYear: {
      type: "string",
    },
    admissionNo: {
      type: "string",
    },
    rollNo: {
      type: "string",
    },
    // status: {
    //   validValues: ["ACTIVE", "INACTIVE"],
    // },
    name: {
      type: "string",
    },
    section: {
      type: "string",
    },
    sex: {
      validValues: ["MALE", "FEMALE", "OTHERS"],
    },
    bloodType: {
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
      type: "string",
    },
    fatheremail: {
      pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      type: "string",
    },
    fatherPhone: {
      pattern: /^[0-9]{10}$/,
      type: "string",
    },
    fatherOccupation: {
      type: "string",
    },
    motherName: {
      type: "string",
    },
    motherEmail: {
      pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      type: "string",
    },
    motherPhone: {
      pattern: /^[0-9]{10}$/,
      type: "string",
    },
    motherOccupation: {
      type: "string",
    },
    guardianName: {
      type: "string",
    },
    guardianRelation: {
      type: "string",
    },
    guardianEmail: {
      type: "string",
    },
    guardianPhone: {
      type: "string",
    },
    guardianOccupation: {
      type: "string",
    },
    guardianAddress: {
      type: "string",
    },
    areSiblingStudying: {
      validValues: ["yes", "no"],
    },
    siblingName: {
      type: "string",
    },
    siblingClass: {
      type: "string",
    },
    siblingRollNo: {
      type: "string",
    },
    siblingAdmissionNo: {
      type: "string",
    },
    currentAddress: {
      type: "string",
    },
    permanentAddress: {
      type: "string",
    },
    vehicleNumber: {
      type: "string",
    },
    pickUpPoint: {
      type: "string",
    },
    hostelName: {
      type: "string",
    },
    roomNumber: {
      type: "string",
    },
    medicalCondition: {
      validValues: ["good", "bad", "others"],
    },
    allergies: {
      type: "string",
    },
    medicationName: {
      type: "string",
    },
    schoolName: {
      type: "string",
    },
    address: {
      type: "string",
    },
    classId: {
      type: "string",
    },
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Prevent multiple submissions
    if (isSubmitting) {
      return;
    }

    try {
      setIsSubmitting(true);

      // Validate form data
      const requiredErrors = validateRequiredFields(formData);
      const ruleErrors = validateForm(formData, validationRules);
      const errors = { ...requiredErrors, ...ruleErrors };
      if (Object.keys(errors).length > 0) {
        setErrors(errors);
        Object.values(errors).forEach((error) => {
          toast.error(error);
        });
        return;
      }

      // Validate file uploads
      if (!formData.profilePic || !formData.medicalCertificate || !formData.transferCertificate) {
        toast.error("All required documents (Profile Pic, Medical Certificate, Transfer Certificate) must be uploaded");
        return;
      }

      // Create FormData object
      const apiFormData = new FormData();

      // Basic Information
      apiFormData.append('email', formData.email.trim());
      apiFormData.append('phone', formData.phone.trim());
      apiFormData.append('name', formData.name.trim());
      apiFormData.append('sex', formData.sex);
      apiFormData.append('bloodType', formData.bloodType);
      apiFormData.append('primaryContact', formData.primaryContact.trim());
      apiFormData.append('academicYear', formData.academicYear);
      apiFormData.append('admissionNo', formData.admissionNo.trim());
      apiFormData.append('admissionDate', dayjs(formData.admissionDate).toISOString());
      apiFormData.append('rollNo', formData.rollNo.trim());
      apiFormData.append('dateOfBirth', dayjs(formData.dateOfBirth).toISOString());
      apiFormData.append('Religion', formData.Religion.trim());
      apiFormData.append('category', formData.category.trim());
      apiFormData.append('caste', formData.caste.trim());
      apiFormData.append('motherTongue', formData.motherTongue.trim());
      apiFormData.append('languagesKnown', languages.length > 0 ? languages.join(',') : formData.languagesKnown || 'NA');

      // Father's Information
      apiFormData.append('fatherName', formData.fatherName.trim());
      apiFormData.append('fatherPhone', formData.fatherPhone.trim());
      apiFormData.append('fatherOccupation', formData.fatherOccupation.trim());
      apiFormData.append('fatheremail', formData.fatheremail?.trim() || 'NA');

      // Mother's Information
      apiFormData.append('motherName', formData.motherName.trim());
      apiFormData.append('motherOccupation', formData.motherOccupation.trim());
      apiFormData.append('motherPhone', formData.motherPhone.trim());
      apiFormData.append('motherEmail', formData.motherEmail?.trim() || 'NA');

      // Guardian Information
      apiFormData.append('guardianName', formData.guardianName.trim());
      apiFormData.append('guardianRelation', formData.guardianRelation.trim());
      apiFormData.append('guardianEmail', formData.guardianEmail.trim());
      apiFormData.append('guardianPhone', formData.guardianPhone.trim());
      apiFormData.append('guardianOccupation', formData.guardianOccupation.trim());
      apiFormData.append('guardianAddress', formData.guardianAddress.trim());

      // Sibling Information
      apiFormData.append('areSiblingStudying', formData.areSiblingStudying);
      if (formData.areSiblingStudying === 'yes') {
        apiFormData.append('siblingName', formData.siblingName.trim());
        apiFormData.append('siblingClass', formData.siblingClass.trim());
        apiFormData.append('siblingRollNo', formData.siblingRollNo.trim());
        apiFormData.append('siblingAdmissionNo', formData.siblingAdmissionNo.trim());
      } else {
        apiFormData.append('siblingName', 'NA');
        apiFormData.append('siblingClass', 'NA');
        apiFormData.append('siblingRollNo', 'NA');
        apiFormData.append('siblingAdmissionNo', 'NA');
      }

      // Address Information
      apiFormData.append('currentAddress', formData.currentAddress.trim());
      apiFormData.append('permanentAddress', formData.permanentAddress.trim());
      apiFormData.append('address', formData.address.trim());
      apiFormData.append('city', formData.city.trim());
      apiFormData.append('state', formData.state.trim());
      apiFormData.append('country', formData.country.trim());
      apiFormData.append('pincode', formData.pincode.trim());

      // Medical Information
      apiFormData.append('medicalCondition', formData.medicalCondition.trim());
      apiFormData.append('allergies', allergies.length > 0 ? allergies.join(',') : formData.allergies || 'NA');
      apiFormData.append('medicationName', medications.length > 0 ? medications.join(',') : formData.medicationName || 'NA');

      // School Information
      apiFormData.append('schoolId', formData.schoolId.trim());
      apiFormData.append('classId', formData.classId.trim());
      apiFormData.append('schoolName', formData.schoolName?.trim() || 'NA');
      apiFormData.append('section', formData.section.trim());

      // Optional Information
      apiFormData.append('hostelName', formData.hostelName?.trim() || 'NA');
      apiFormData.append('roomNumber', formData.roomNumber?.trim() || 'NA');
      apiFormData.append('vehicleNumber', formData.vehicleNumber?.trim() || 'NA');
      apiFormData.append('pickUpPoint', formData.pickUpPoint?.trim() || 'NA');
      apiFormData.append('status', formData.status || ActiveStatus.ACTIVE);
      apiFormData.append('house', formData.house?.trim() || 'NA');

      // File Uploads
      if (formData.profilePic instanceof File) {
        apiFormData.append('profilePic', formData.profilePic);
      }
      if (formData.medicalCertificate instanceof File) {
        apiFormData.append('medicalCertificate', formData.medicalCertificate);
      }
      if (formData.transferCertificate instanceof File) {
        apiFormData.append('transferCertificate', formData.transferCertificate);
      }

      // Log FormData for debugging
      console.log('Form Data Contents:');
      for (const pair of apiFormData.entries()) {
        console.log(pair[0], pair[1]);
      }

      const response = await registerStudent(apiFormData);
      
      if (response.status === 200 || response.status === 201) {
        toast.success("Student registered successfully");
        navigate(routes.studentList);
      } else {
        toast.error("Failed to register student");
      }
    } catch (error: any) {
      console.error('Error submitting form:', error);
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else if (error.message) {
        toast.error(error.message);
      } else {
        toast.error("An unexpected error occurred");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const addNewContent = () => {
    setNewContents([...newContents, newContents.length]);
  };

  const removeContent = (index: number) => {
    setNewContents(newContents.filter((_, i) => i !== index));
  };

  useEffect(() => {
    if (location.pathname === routes.editStudent) {
      const today = new Date();
      const defaultValue = dayjs(today);
      setIsEdit(true);
      setLanguages(["English"]);
      setMedications(["Medicine Name"]);
      setAllergies(["Allergy", "Skin Allergy"]);
      setDefaultDate(defaultValue);
    } else {
      setIsEdit(false);
      setDefaultDate(null);
      setLanguages([]);
      setMedications([]);
      setAllergies([]);
    }
  }, [location.pathname]);

  return (
    <div className="page-wrapper position-relative">
      {isSubmitting && (
        <CustomLoader variant="dots" color="#3067e3" size={80} />
      )}
      <ToastContainer position="top-center" autoClose={3000} />
      <div className="content content-two">
        <div className="d-md-flex d-block align-items-center justify-content-between mb-3">
          <div className="my-auto mb-2">
            <h3 className="mb-1">{isEdit ? "Edit" : "Add"} Student</h3>
            <nav>
              <ol className="breadcrumb mb-0">
                <li className="breadcrumb-item">
                  <Link to={routes.adminDashboard}>Dashboard</Link>
                </li>
                <li className="breadcrumb-item">
                  <Link to={routes.studentList}>Students</Link>
                </li>
                <li className="breadcrumb-item active" aria-current="page">
                  {isEdit ? "Edit" : "Add"} Student
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
                    <h4 className="text-dark">Personal Information</h4>
                  </div>
                </div>
                <div className="card-body pb-1">
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
                              Upload
                              <input
                                type="file"
                                name="profilePic"
                                className="form-control image-sign"
                                accept=".jpg,.png,.svg"
                                onChange={(e) => handleFileChange(e, "profilePic")}
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
                        {formData.profilePic && typeof formData.profilePic !== "string" && (
                          <div className="mb-2 text-success">Selected: {formData.profilePic.name}</div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="row row-cols-xxl-5 row-cols-md-6">
                    <div className="col-xxl col-xl-3 col-md-6">
                      <div className="mb-3">
                        <label className="form-label">Academic Year</label>
                        <select
                          className="form-control"
                          name="academicYear"
                          value={formData.academicYear}
                          onChange={handleInputChange}
                        >
                          <option value="">Select Academic Year</option>
                          {academicYears.map((year) => (
                            <option key={year} value={year}>{year}</option>
                          ))}
                        </select>
                        {errors.academicYear && <span className="text-danger">{errors.academicYear}</span>}
                      </div>
                    </div>
                    <div className="col-xxl col-xl-3 col-md-6">
                      <div className="mb-3">
                        <label className="form-label">Admission Number</label>
                        <input
                          type="text"
                          className="form-control"
                          name="admissionNo"
                          value={formData.admissionNo}
                          onChange={handleInputChange}
                        />
                        {errors.admissionNo && <span className="text-danger">{errors.admissionNo}</span>}
                      </div>
                    </div>
                    <div className="col-xxl col-xl-3 col-md-6">
                      <div className="mb-3">
                        <label className="form-label">Admission Date</label>
                        <div className="input-icon position-relative">
                          <ErrorBoundary>
                            <DatePicker
                              className="form-control datetimepicker"
                              format="DD-MM-YYYY"
                              value={formData.admissionDate ? dayjs(formData.admissionDate) : null}
                              onChange={(date) => handleDateChange("admissionDate", date)}
                              placeholder="Select Date"
                            />
                          </ErrorBoundary>
                          <span className="input-icon-addon">
                            <i className="ti ti-calendar" />
                          </span>
                        </div>
                        {errors.admissionDate && <span className="text-danger">{errors.admissionDate}</span>}
                      </div>
                    </div>
                    <div className="col-xxl col-xl-3 col-md-6">
                      <div className="mb-3">
                        <label className="form-label">Roll Number</label>
                        <input
                          type="text"
                          className="form-control"
                          name="rollNo"
                          value={formData.rollNo}
                          onChange={handleInputChange}
                        />
                        {errors.rollNo && <span className="text-danger">{errors.rollNo}</span>}
                      </div>
                    </div>
                    <div className="col-xxl col-xl-3 col-md-6">
                      <div className="mb-3">
                        <label className="form-label">Name</label>
                        <input
                          type="text"
                          className="form-control"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                        />
                        {errors.name && <span className="text-danger">{errors.name}</span>}
                      </div>
                    </div>
                    <div className="col-xxl col-xl-3 col-md-6">
                      <div className="mb-2">
                        <label className="form-label">Class</label>
                        {isLoadingClasses ? (
                          <div className="placeholder-glow">
                            <span className="placeholder col-12" style={{ height: 38, display: "block" }}></span>
                          </div>
                        ) : classError ? (
                          <div className="text-danger small">{classError}</div>
                        ) : (
                          <select
                            className="form-control"
                            value={formData.classId || ""}
                            onChange={(e) => {
                              const selectedClass = classList.find((cls: any) => cls.id.toString() === e.target.value);
                              if (selectedClass) handleClassClick(selectedClass);
                            }}
                          >
                            <option value="" disabled>Select Class</option>
                            {classList.map((cls: any) => (
                              <option key={cls.id} value={cls.id}>{cls.name}</option>
                            ))}
                          </select>
                        )}
                        {formData.classId && availableSections.length === 0 && (
                          <div className="text-warning mt-2">No section is there</div>
                        )}
                        {formData.classId && availableSections.length > 0 && (
                          <div className="mb-2">
                            <label className="form-label">Section (optional)</label>
                            <select
                              className="form-control"
                              value={formData.section || ""}
                              onChange={(e) => handleSectionClick(e.target.value)}
                            >
                              <option value="" disabled>Select Section</option>
                              {availableSections.map((sec) => (
                                <option key={sec} value={sec}>{sec}</option>
                              ))}
                            </select>
                            {formData.section && <div className="text-success">Selected section: {formData.section}</div>}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="col-xxl col-xl-3 col-md-6">
                      <div className="mb-3">
                        <label className="form-label">Gender*</label>
                        <select
                          className="form-select"
                          name="sex"
                          value={formData.sex}
                          onChange={handleChange}
                          required
                        >
                          <option value="">Select Gender</option>
                          <option value="MALE">Male</option>
                          <option value="FEMALE">Female</option>
                          <option value="OTHERS">Other</option>
                        </select>
                        {errors.sex && <span className="text-danger">{errors.sex}</span>}
                      </div>
                    </div>
                    <div className="col-xxl col-xl-3 col-md-6">
                      <div className="mb-3">
                        <label className="form-label">Date of Birth</label>
                        <div className="input-icon position-relative">
                          <ErrorBoundary>
                            <DatePicker
                              className="form-control datetimepicker"
                              format="DD-MM-YYYY"
                              value={formData.dateOfBirth ? dayjs(formData.dateOfBirth) : null}
                              onChange={(date) => handleDateChange("dateOfBirth", date)}
                              placeholder="Select Date"
                            />
                          </ErrorBoundary>
                          <span className="input-icon-addon">
                            <i className="ti ti-calendar" />
                          </span>
                        </div>
                        {errors.dateOfBirth && <span className="text-danger">{errors.dateOfBirth}</span>}
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
                        {errors.bloodType && <span className="text-danger">{errors.bloodType}</span>}
                      </div>
                    </div>
                    <div className="col-xxl col-xl-3 col-md-6">
                      <div className="mb-3">
                        <label className="form-label">House</label>
                        <input
                          type="text"
                          className="form-control"
                          name="house"
                          value={formData.house || ""}
                          onChange={handleInputChange}
                        />
                        {errors.house && <span className="text-danger">{errors.house}</span>}
                      </div>
                    </div>
                    <div className="col-xxl col-xl-3 col-md-6">
                      <div className="mb-3">
                        <label className="form-label">Religion</label>
                        <input
                          type="text"
                          className="form-control"
                          name="Religion"
                          value={formData.Religion}
                          onChange={handleInputChange}
                        />
                        {errors.Religion && <span className="text-danger">{errors.Religion}</span>}
                      </div>
                    </div>
                    <div className="col-xxl col-xl-3 col-md-6">
                      <div className="mb-3">
                        <label className="form-label">Category</label>
                        <input
                          type="text"
                          className="form-control"
                          name="category"
                          value={formData.category}
                          onChange={handleInputChange}
                        />
                        {errors.category && <span className="text-danger">{errors.category}</span>}
                      </div>
                    </div>
                    <div className="col-xxl col-xl-3 col-md-6">
                      <div className="mb-3">
                        <label className="form-label">Primary Contact Number</label>
                        <input
                          type="text"
                          className="form-control"
                          name="primaryContact"
                          value={formData.primaryContact}
                          onChange={handleInputChange}
                        />
                        {errors.primaryContact && <span className="text-danger">{errors.primaryContact}</span>}
                      </div>
                    </div>
                    <div className="col-xxl col-xl-3 col-md-6">
                      <div className="mb-3">
                        <label className="form-label">Email Address</label>
                        <input
                          type="email"
                          className="form-control"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                        />
                        {errors.email && <span className="text-danger">{errors.email}</span>}
                      </div>
                    </div>
                    <div className="col-xxl col-xl-3 col-md-6">
                      <div className="mb-3">
                        <label className="form-label">Phone</label>
                        <input
                          type="tel"
                          className="form-control"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                        />
                        {errors.phone && <span className="text-danger">{errors.phone}</span>}
                      </div>
                    </div>
                    <div className="col-xxl col-xl-3 col-md-6">
                      <div className="mb-3">
                        <label className="form-label">Caste</label>
                        <input
                          type="text"
                          className="form-control"
                          name="caste"
                          value={formData.caste}
                          onChange={handleInputChange}
                        />
                        {errors.caste && <span className="text-danger">{errors.caste}</span>}
                      </div>
                    </div>
                    <div className="col-xxl col-xl-3 col-md-6">
                      <div className="mb-3">
                        <label className="form-label">Mother Tongue</label>
                        <input
                          type="text"
                          className="form-control"
                          name="motherTongue"
                          value={formData.motherTongue}
                          onChange={handleInputChange}
                        />
                        {errors.motherTongue && <span className="text-danger">{errors.motherTongue}</span>}
                      </div>
                    </div>
                    <div className="col-xxl col-xl-3 col-md-6">
                      <div className="mb-3">
                        <label className="form-label">Languages Known</label>
                        <TagsInput
                          value={languages}
                          onChange={setLanguages}
                          placeHolder="Type and press Enter or comma"
                          separators={["Enter", ","]}
                        />
                        {errors.languagesKnown && <span className="text-danger">{errors.languagesKnown}</span>}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="card">
                <div className="card-header bg-light">
                  <div className="d-flex align-items-center">
                    <span className="bg-white avatar avatar-sm me-2 text-gray-7 flex-shrink-0">
                      <i className="ti ti-user-shield fs-16" />
                    </span>
                    <h4 className="text-dark">Parents & Guardian Information</h4>
                  </div>
                </div>
                <div className="card-body pb-0">
                  <div className="border-bottom mb-3">
                    <h5 className="mb-3">Father's Info</h5>
                    <div className="row">
                      <div className="col-lg-3 col-md-6">
                        <div className="mb-3">
                          <label className="form-label">Father Name</label>
                          <input
                            type="text"
                            className="form-control"
                            name="fatherName"
                            value={formData.fatherName}
                            onChange={handleInputChange}
                          />
                          {errors.fatherName && <span className="text-danger">{errors.fatherName}</span>}
                        </div>
                      </div>
                      <div className="col-lg-3 col-md-6">
                        <div className="mb-3">
                          <label className="form-label">Email</label>
                          <input
                            type="email"
                            className="form-control"
                            name="fatheremail"
                            value={formData.fatheremail}
                            onChange={handleInputChange}
                          />
                          {errors.fatheremail && <span className="text-danger">{errors.fatheremail}</span>}
                        </div>
                      </div>
                      <div className="col-lg-3 col-md-6">
                        <div className="mb-3">
                          <label className="form-label">Phone Number</label>
                          <input
                            type="tel"
                            className="form-control"
                            name="fatherPhone"
                            value={formData.fatherPhone}
                            onChange={handleInputChange}
                          />
                          {errors.fatherPhone && <span className="text-danger">{errors.fatherPhone}</span>}
                        </div>
                      </div>
                      <div className="col-lg-3 col-md-6">
                        <div className="mb-3">
                          <label className="form-label">Father Occupation</label>
                          <input
                            type="text"
                            className="form-control"
                            name="fatherOccupation"
                            value={formData.fatherOccupation}
                            onChange={handleInputChange}
                          />
                          {errors.fatherOccupation && <span className="text-danger">{errors.fatherOccupation}</span>}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="border-bottom mb-3">
                    <h5 className="mb-3">Mother's Info</h5>
                    <div className="row">
                      <div className="col-lg-3 col-md-6">
                        <div className="mb-3">
                          <label className="form-label">Mother Name</label>
                          <input
                            type="text"
                            className="form-control"
                            name="motherName"
                            value={formData.motherName}
                            onChange={handleInputChange}
                          />
                          {errors.motherName && <span className="text-danger">{errors.motherName}</span>}
                        </div>
                      </div>
                      <div className="col-lg-3 col-md-6">
                        <div className="mb-3">
                          <label className="form-label">Email</label>
                          <input
                            type="email"
                            className="form-control"
                            name="motherEmail"
                            value={formData.motherEmail}
                            onChange={handleInputChange}
                          />
                          {errors.motherEmail && <span className="text-danger">{errors.motherEmail}</span>}
                        </div>
                      </div>
                      <div className="col-lg-3 col-md-6">
                        <div className="mb-3">
                          <label className="form-label">Phone Number</label>
                          <input
                            type="tel"
                            className="form-control"
                            name="motherPhone"
                            value={formData.motherPhone}
                            onChange={handleInputChange}
                          />
                          {errors.motherPhone && <span className="text-danger">{errors.motherPhone}</span>}
                        </div>
                      </div>
                      <div className="col-lg-3 col-md-6">
                        <div className="mb-3">
                          <label className="form-label">Mother Occupation</label>
                          <input
                            type="text"
                            className="form-control"
                            name="motherOccupation"
                            value={formData.motherOccupation}
                            onChange={handleInputChange}
                          />
                          {errors.motherOccupation && <span className="text-danger">{errors.motherOccupation}</span>}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h5 className="mb-3">Guardian Details</h5>
                    <p className="mb-3 text-muted">Register parents with these details</p>
                    <div className="row">
                      <div className="col-md-12">
                        <div className="mb-2">
                          <div className="d-flex align-items-center flex-wrap">
                            <label className="form-label text-dark fw-normal me-2">If Guardian Is</label>
                            <div className="form-check me-3 mb-2">
                              <input
                                className="form-check-input"
                                type="radio"
                                name="guardian"
                                id="parents"
                                checked={formData.guardianRelation === "Parents"}
                                onChange={() => handleSelectChange("guardianRelation", "Parents")}
                              />
                              <label className="form-check-label" htmlFor="parents">Parents</label>
                            </div>
                            <div className="form-check me-3 mb-2">
                              <input
                                className="form-check-input"
                                type="radio"
                                name="guardian"
                                id="guardian"
                                checked={formData.guardianRelation === "Guardian"}
                                onChange={() => handleSelectChange("guardianRelation", "Guardian")}
                              />
                              <label className="form-check-label" htmlFor="guardian">Guardian</label>
                            </div>
                            <div className="form-check mb-2">
                              <input
                                className="form-check-input"
                                type="radio"
                                name="guardian"
                                id="other"
                                checked={formData.guardianRelation === "Others"}
                                onChange={() => handleSelectChange("guardianRelation", "Others")}
                              />
                              <label className="form-check-label" htmlFor="other">Others</label>
                            </div>
                          </div>
                          {errors.guardianRelation && <span className="text-danger">{errors.guardianRelation}</span>}
                        </div>
                      </div>
                      <div className="col-lg-3 col-md-6">
                        <div className="mb-3">
                          <label className="form-label">Guardian Name</label>
                          <input
                            type="text"
                            className="form-control"
                            name="guardianName"
                            value={formData.guardianName}
                            onChange={handleInputChange}
                          />
                          {errors.guardianName && <span className="text-danger">{errors.guardianName}</span>}
                        </div>
                      </div>
                      <div className="col-lg-3 col-md-6">
                        <div className="mb-3">
                          <label className="form-label">Guardian Relation</label>
                          <input
                            type="text"
                            className="form-control"
                            name="guardianRelation"
                            value={formData.guardianRelation}
                            onChange={handleInputChange}
                          />
                          {errors.guardianRelation && <span className="text-danger">{errors.guardianRelation}</span>}
                        </div>
                      </div>
                      <div className="col-lg-3 col-md-6">
                        <div className="mb-3">
                          <label className="form-label">Phone Number</label>
                          <input
                            type="tel"
                            className="form-control"
                            name="guardianPhone"
                            value={formData.guardianPhone}
                            onChange={handleInputChange}
                          />
                          {errors.guardianPhone && <span className="text-danger">{errors.guardianPhone}</span>}
                        </div>
                      </div>
                      <div className="col-lg-3 col-md-6">
                        <div className="mb-3">
                          <label className="form-label">Email</label>
                          <input
                            type="email"
                            className="form-control"
                            name="guardianEmail"
                            value={formData.guardianEmail}
                            onChange={handleInputChange}
                          />
                          {errors.guardianEmail && <span className="text-danger">{errors.guardianEmail}</span>}
                        </div>
                      </div>
                      <div className="col-lg-3 col-md-6">
                        <div className="mb-3">
                          <label className="form-label">Occupation</label>
                          <input
                            type="text"
                            className="form-control"
                            name="guardianOccupation"
                            value={formData.guardianOccupation}
                            onChange={handleInputChange}
                          />
                          {errors.guardianOccupation && <span className="text-danger">{errors.guardianOccupation}</span>}
                        </div>
                      </div>
                      <div className="col-lg-3 col-md-6">
                        <div className="mb-3">
                          <label className="form-label">Address</label>
                          <input
                            type="text"
                            className="form-control"
                            name="guardianAddress"
                            value={formData.guardianAddress}
                            onChange={handleInputChange}
                          />
                          {errors.guardianAddress && <span className="text-danger">{errors.guardianAddress}</span>}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="card">
                <div className="card-header bg-light">
                  <div className="d-flex align-items-center">
                    <span className="bg-white avatar avatar-sm me-2 text-gray-7 flex-shrink-0">
                      <i className="ti ti-users fs-16" />
                    </span>
                    <h4 className="text-dark">Siblings</h4>
                  </div>
                </div>
                <div className="card-body">
                  <div className="addsibling-info">
                    <div className="row">
                      <div className="col-md-12">
                        <div className="mb-2">
                          <label className="form-label">Sibling Info</label>
                          <div className="d-flex align-items-center flex-wrap">
                            <label className="form-label text-dark fw-normal me-2">
                              Is Sibling studying in the same school
                            </label>
                            <div className="form-check me-3 mb-2">
                              <input
                                className="form-check-input"
                                type="radio"
                                name="areSiblingStudying"
                                id="yes"
                                checked={formData.areSiblingStudying === "yes"}
                                onChange={() => handleSelectChange("areSiblingStudying", "yes")}
                              />
                              <label className="form-check-label" htmlFor="yes">Yes</label>
                            </div>
                            <div className="form-check mb-2">
                              <input
                                className="form-check-input"
                                type="radio"
                                name="areSiblingStudying"
                                id="no"
                                checked={formData.areSiblingStudying === "no"}
                                onChange={() => handleSelectChange("areSiblingStudying", "no")}
                              />
                              <label className="form-check-label" htmlFor="no">No</label>
                            </div>
                          </div>
                          {errors.areSiblingStudying && <span className="text-danger">{errors.areSiblingStudying}</span>}
                        </div>
                      </div>
                      {formData.areSiblingStudying === "yes" &&
                        newContents.map((_, index) => (
                          <div key={index} className="col-lg-12">
                            <div className="row">
                              <div className="col-lg-3 col-md-6">
                                <div className="mb-3">
                                  <label className="form-label">Name</label>
                                  <input
                                    type="text"
                                    className="form-control"
                                    name="siblingName"
                                    value={formData.siblingName}
                                    onChange={handleInputChange}
                                  />
                                  {errors.siblingName && <span className="text-danger">{errors.siblingName}</span>}
                                </div>
                              </div>
                              <div className="col-lg-3 col-md-6">
                                <div className="mb-3">
                                  <label className="form-label">Roll No</label>
                                  <input
                                    type="text"
                                    className="form-control"
                                    name="siblingRollNo"
                                    value={formData.siblingRollNo}
                                    onChange={handleInputChange}
                                  />
                                  {errors.siblingRollNo && <span className="text-danger">{errors.siblingRollNo}</span>}
                                </div>
                              </div>
                              <div className="col-lg-3 col-md-6">
                                <div className="mb-3">
                                  <label className="form-label">Admission No</label>
                                  <input
                                    type="text"
                                    className="form-control"
                                    name="siblingAdmissionNo"
                                    value={formData.siblingAdmissionNo}
                                    onChange={handleInputChange}
                                  />
                                  {errors.siblingAdmissionNo && <span className="text-danger">{errors.siblingAdmissionNo}</span>}
                                </div>
                              </div>
                              <div className="col-lg-3 col-md-6">
                                <div className="mb-3">
                                  <div className="d-flex align-items-center">
                                    <div className="w-100">
                                      <label className="form-label">Class</label>
                                      <input
                                        type="text"
                                        className="form-control"
                                        name="siblingClass"
                                        value={formData.siblingClass}
                                        onChange={handleInputChange}
                                      />
                                      {errors.siblingClass && <span className="text-danger">{errors.siblingClass}</span>}
                                    </div>
                                    {newContents.length > 1 && (
                                      <div>
                                        <label className="form-label"> </label>
                                        <Link
                                          to="#"
                                          className="trash-icon ms-3"
                                          onClick={() => removeContent(index)}
                                        >
                                          <i className="ti ti-trash-x" />
                                        </Link>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                  {formData.areSiblingStudying === "yes" && (
                    <div className="border-top pt-3">
                      <Link
                        to="#"
                        onClick={addNewContent}
                        className="add-sibling btn btn-primary d-inline-flex align-items-center"
                      >
                        <i className="ti ti-circle-plus me-2" />
                        Add New
                      </Link>
                    </div>
                  )}
                </div>
              </div>
              <div className="card">
                <div className="card-header bg-light">
                  <div className="d-flex align-items-center">
                    <span className="bg-white avatar avatar-sm me-2 text-gray-7 flex-shrink-0">
                      <i className="ti ti-map fs-16" />
                    </span>
                    <h4 className="text-dark">Address</h4>
                  </div>
                </div>
                <div className="card-body pb-1">
                  <div className="row">
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="form-label">Current Address</label>
                        <input
                          type="text"
                          className="form-control"
                          name="currentAddress"
                          value={formData.currentAddress}
                          onChange={handleInputChange}
                        />
                        {errors.currentAddress && <span className="text-danger">{errors.currentAddress}</span>}
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="form-label">Permanent Address</label>
                        <input
                          type="text"
                          className="form-control"
                          name="permanentAddress"
                          value={formData.permanentAddress}
                          onChange={handleInputChange}
                        />
                        {errors.permanentAddress && <span className="text-danger">{errors.permanentAddress}</span>}
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="form-label">City</label>
                        <input
                          type="text"
                          className="form-control"
                          name="city"
                          value={formData.city}
                          onChange={handleInputChange}
                        />
                        {errors.city && <span className="text-danger">{errors.city}</span>}
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="form-label">Country</label>
                        <input
                          type="text"
                          className="form-control"
                          name="country"
                          value={formData.country}
                          onChange={handleInputChange}
                        />
                        {errors.country && <span className="text-danger">{errors.country}</span>}
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="form-label">Pincode</label>
                        <input
                          type="text"
                          className="form-control"
                          name="pincode"
                          value={formData.pincode}
                          onChange={handleInputChange}
                        />
                        {errors.pincode && <span className="text-danger">{errors.pincode}</span>}
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="form-label">State</label>
                        <input
                          type="text"
                          className="form-control"
                          name="state"
                          value={formData.state}
                          onChange={handleInputChange}
                        />
                        {errors.state && <span className="text-danger">{errors.state}</span>}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="card">
                <div className="card-header bg-light d-flex align-items-center justify-content-between">
                  <div className="d-flex align-items-center">
                    <span className="bg-white avatar avatar-sm me-2 text-gray-7 flex-shrink-0">
                      <i className="ti ti-bus-stop fs-16" />
                    </span>
                    <h4 className="text-dark">Transport Information</h4>
                  </div>
                  <div className="form-check form-switch">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      role="switch"
                      checked={transportEnabled}
                      onChange={() => setTransportEnabled((prev) => !prev)}
                    />
                  </div>
                </div>
                {transportEnabled && (
                  <div className="card-body pb-1">
                    <div className="row">
                      <div className="col-lg-4 col-md-6">
                        <div className="mb-3">
                          <label className="form-label">Vehicle Number</label>
                          <select
                            className="form-control"
                            value={formData.vehicleNumber}
                            onChange={(e) => setFormData({ ...formData, vehicleNumber: e.target.value })}
                          >
                            <option value="">Select a Vehicle Number</option>
                            {busList.length === 0 ? (
                              <option value="" disabled>No data found</option>
                            ) : (
                              busList.map((bus) => (
                                <option key={bus.id} value={bus.id}>{bus.busNumber}</option>
                              ))
                            )}
                          </select>
                          {errors.vehicleNumber && <span className="text-danger">{errors.vehicleNumber}</span>}
                        </div>
                      </div>
                      <div className="col-lg-4 col-md-6">
                        <div className="mb-3">
                          <label className="form-label">PickUp Point</label>
                          <select
                            className="form-control"
                            value={formData.pickUpPoint}
                            onChange={(e) => setFormData({ ...formData, pickUpPoint: e.target.value })}
                          >
                            <option value="">Select a PickUp Point</option>
                            {pickupPoints.length === 0 ? (
                              <option value="" disabled>No data found</option>
                            ) : (
                              pickupPoints.map((bus) => (
                                <option key={bus.id} value={bus.id}>
                                  {bus.name}-{bus.location}
                                </option>
                              ))
                            )}
                          </select>
                          {errors.pickUpPoint && <span className="text-danger">{errors.pickUpPoint}</span>}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
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
                      <div className="mb-2">
                        <div className="mb-3">
                          <label className="form-label mb-1">Medical Condition</label>
                          <p>Upload image size of 4MB, Accepted Format PDF</p>
                        </div>
                        <div className="d-flex align-items-center flex-wrap">
                          <div className="btn btn-primary drag-upload-btn mb-2 me-2">
                            <i className="ti ti-file-upload me-1" />
                            Change
                            <input
                              type="file"
                              className="form-control image_sign"
                              onChange={(e) => handleFileChange(e, "medicalCertificate")}
                              multiple
                            />
                          </div>
                          {isEdit && <p className="mb-2">BirthCertificate.pdf</p>}
                        </div>
                        {formData.medicalCertificate && typeof formData.medicalCertificate !== "string" && (
                          <div className="mb-2 text-success">Selected: {formData.medicalCertificate.name}</div>
                        )}
                      </div>
                    </div>
                    <div className="col-lg-6">
                      <div className="mb-2">
                        <div className="mb-3">
                          <label className="form-label mb-1">Upload Transfer Certificate</label>
                          <p>Upload image size of 4MB, Accepted Format PDF</p>
                        </div>
                        <div className="d-flex align-items-center flex-wrap">
                          <div className="btn btn-primary drag-upload-btn mb-2">
                            <i className="ti ti-file-upload me-1" />
                            Upload Document
                            <input
                              type="file"
                              className="form-control image_sign"
                              onChange={(e) => handleFileChange(e, "transferCertificate")}
                              multiple
                            />
                          </div>
                        </div>
                        {formData.transferCertificate && typeof formData.transferCertificate !== "string" && (
                          <div className="mb-2 text-success">Selected: {formData.transferCertificate.name}</div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="card">
                <div className="card-header bg-light">
                  <div className="d-flex align-items-center">
                    <span className="bg-white avatar avatar-sm me-2 text-gray-7 flex-shrink-0">
                      <i className="ti ti-medical-cross fs-16" />
                    </span>
                    <h4 className="text-dark">Medical History</h4>
                  </div>
                </div>
                <div className="card-body pb-1">
                  <div className="row">
                    <div className="col-md-12">
                      <div className="mb-2">
                        <label className="form-label">Medical Condition</label>
                        <div className="d-flex align-items-center flex-wrap">
                          <label className="form-label text-dark fw-normal me-2">
                            Medical Condition of a Student
                          </label>
                          <div className="form-check me-3 mb-2">
                            <input
                              className="form-check-input"
                              type="radio"
                              name="medicalCondition"
                              id="good"
                              checked={formData.medicalCondition === "good"}
                              onChange={() => handleSelectChange("medicalCondition", "good")}
                            />
                            <label className="form-check-label" htmlFor="good">Good</label>
                          </div>
                          <div className="form-check me-3 mb-2">
                            <input
                              className="form-check-input"
                              type="radio"
                              name="medicalCondition"
                              id="bad"
                              checked={formData.medicalCondition === "bad"}
                              onChange={() => handleSelectChange("medicalCondition", "bad")}
                            />
                            <label className="form-check-label" htmlFor="bad">Bad</label>
                          </div>
                          <div className="form-check mb-2">
                            <input
                              className="form-check-input"
                              type="radio"
                              name="medicalCondition"
                              id="others"
                              checked={formData.medicalCondition === "others"}
                              onChange={() => handleSelectChange("medicalCondition", "others")}
                            />
                            <label className="form-check-label" htmlFor="others">Others</label>
                          </div>
                        </div>
                        {errors.medicalCondition && <span className="text-danger">{errors.medicalCondition}</span>}
                      </div>
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Allergies</label>
                      <TagsInput value={allergies} onChange={setAllergies} placeHolder="Enter allergies" />
                      {errors.allergies && <span className="text-danger">{errors.allergies}</span>}
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Medications</label>
                      <TagsInput value={medications} onChange={setMedications} placeHolder="Enter medications" />
                      {errors.medicationName && <span className="text-danger">{errors.medicationName}</span>}
                    </div>
                  </div>
                </div>
              </div>
              <div className="card">
                <div className="card-header bg-light">
                  <div className="d-flex align-items-center">
                    <span className="bg-white avatar avatar-sm me-2 text-gray-7 flex-shrink-0">
                      <i className="ti ti-building fs-16" />
                    </span>
                    <h4 className="text-dark">Previous School Details</h4>
                  </div>
                </div>
                <div className="card-body pb-1">
                  <div className="row">
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="form-label">School Name</label>
                        <input
                          type="text"
                          className="form-control"
                          name="schoolName"
                          value={formData.schoolName}
                          onChange={handleInputChange}
                        />
                        {errors.schoolName && <span className="text-danger">{errors.schoolName}</span>}
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="form-label">Address</label>
                        <input
                          type="text"
                          className="form-control"
                          name="address"
                          value={formData.address}
                          onChange={handleInputChange}
                        />
                        {errors.address && <span className="text-danger">{errors.address}</span>}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {Object.keys(errors).length > 0 && (
                <div className="alert alert-danger">
                  {Object.entries(errors).map(([field, msg]) => (
                    <div key={field}>{msg.replace(/_/g, " ").replace(/([a-z])([A-Z])/g, "$1 $2")}</div>
                  ))}
                </div>
              )}
              <div className="text-end">
                <button type="button" className="btn btn-light me-3" onClick={() => navigate(routes.studentList)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                      {isEdit ? "Updating" : "Adding"}...
                    </>
                  ) : (
                    <>{isEdit ? "Update" : "Add"} Student</>
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

export default AddStudent;