import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import ImageWithBasePath from "../../core/common/imageWithBasePath";
import { all_routes } from "../../router/all_routes";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getstudentprofiledetails } from "../../services/student/StudentAllApi";
import { useSelector } from "react-redux";
import Cropper from 'react-easy-crop';

type PasswordField = "oldPassword" | "newPassword" | "confirmPassword" | "currentPassword";

type ProfileData = {
  id: string;
  name: string;
  email: string;
  phone: string;
  profilePic: string;
  address: string;
  city: string;
  state: string;
  country: string;
  pincode: string;
  role: string;
  student?: {
    admissionNo: string;
    rollNo: string;
    class: { name: string };
    dateOfBirth: string;
    fatherName: string;
    motherName: string;
    guardianName: string;
  };
};

class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean; error: any }> {
  state = { hasError: false, error: null };
  static getDerivedStateFromError(error: unknown) {
    return { hasError: true, error };
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="alert alert-danger m-3">
          <h5>Something went wrong.</h5>
          <p>Please try refreshing the page or contact support.</p>
        </div>
      );
    }
    return this.props.children;
  }
}

const SkeletonPlaceholder = ({ className = "", style = {} }: { className?: string; style?: React.CSSProperties }) => (
  <span className={`placeholder bg-secondary ${className}`} style={style} />
);

const Profile = () => {
  const route = all_routes;
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [passwordVisibility, setPasswordVisibility] = useState({
    oldPassword: false,
    newPassword: false,
    confirmPassword: false,
    currentPassword: false,
  });
  const role = useSelector((state: any) => state.auth.userObj?.role);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);

  useEffect(() => {
  const fetchProfile = async () => {
    try {
      setIsLoading(true);
      const userId = localStorage.getItem("userId");
      if (!userId) throw new Error("User ID not found");
      const response = await getstudentprofiledetails(userId);
        setProfileData(response.data as any);
        toast.success("Profile loaded successfully!", { autoClose: 3000 });
    } catch (error) {
      toast.error("Failed to load profile data.", { autoClose: 3000 });
      setProfileData(null);
    } finally {
      setIsLoading(false);
    }
  };
    fetchProfile();
  }, [role]);

  const handleRefresh = (e: React.MouseEvent) => {
    e.preventDefault();
    const fetchProfile = async () => {
      try {
        setIsLoading(true);
        const userId = localStorage.getItem("userId");
        if (!userId) throw new Error("User ID not found");
        const response = await getstudentprofiledetails(userId);
        setProfileData(response.data as any);
        toast.success("Profile loaded successfully!", { autoClose: 3000 });
      } catch (error) {
        toast.error("Failed to load profile data.", { autoClose: 3000 });
        setProfileData(null);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfile();
  };

  const togglePasswordVisibility = (field: PasswordField) => {
    setPasswordVisibility((prevState) => ({
      ...prevState,
      [field]: !prevState[field],
    }));
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const isValidType = file.type === 'image/jpeg' || file.type === 'image/png';
      if (!isValidType) {
        toast.error('Please upload a JPG or PNG file.', { autoClose: 3000 });
        return;
      }
      const reader = new FileReader();
      reader.onload = () => setImageSrc(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const onCropComplete = useCallback((croppedArea: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const createImage = (url: string): Promise<HTMLImageElement> =>
    new Promise((resolve, reject) => {
      const image = new Image();
      image.addEventListener('load', () => resolve(image));
      image.addEventListener('error', (error) => reject(error));
      image.src = url;
    });

  const getCroppedImg = async (imageSrc: string, pixelCrop: any): Promise<Blob> => {
    const image = await createImage(imageSrc);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Canvas context not available');
    canvas.width = pixelCrop.width;
    canvas.height = pixelCrop.height;
    ctx.drawImage(
      image,
      pixelCrop.x,
      pixelCrop.y,
      pixelCrop.width,
      pixelCrop.height,
      0,
      0,
      pixelCrop.width,
      pixelCrop.height
    );
    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        if (blob) resolve(blob);
      }, 'image/png');
    });
  };

  const handleUpload = async () => {
    if (!imageSrc || !croppedAreaPixels) {
      toast.error('Please select and crop an image first.', { autoClose: 3000 });
      return;
    }
    try {
      const croppedImage = await getCroppedImg(imageSrc, croppedAreaPixels);
      const formData = new FormData();
      formData.append('profilePic', croppedImage, 'profile-pic.png');
      const newImageUrl = URL.createObjectURL(croppedImage);
      setImageSrc(null);
      setZoom(1);
      setCrop({ x: 0, y: 0 });
      toast.success('Profile picture uploaded successfully!', { autoClose: 3000 });
      setProfileData((prev) => prev ? { ...prev, profilePic: newImageUrl } : prev);
    } catch (error) {
      toast.error('Failed to upload profile picture.', { autoClose: 3000 });
    }
  };

  const handleSavePersonalInfo = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Personal information saved!', { autoClose: 3000 });
  };

  const handleSaveAddressInfo = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Address information saved!', { autoClose: 3000 });
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Password changed successfully!', { autoClose: 3000 });
  };

  return (
    <ErrorBoundary>
      <div className="page-wrapper bg-dark-theme min-vh-100">
        <ToastContainer position="top-right" autoClose={3000} />
        <div className="content p-4">
          {isLoading ? (
            <div className="placeholder-glow">
              <SkeletonPlaceholder className="col-6 mb-4" style={{ height: "2rem" }} />
              <div className="row g-4">
                <div className="col-md-4">
                  <div className="card p-4 shadow-sm">
                    <SkeletonPlaceholder className="rounded-circle mx-auto mb-3" style={{ width: "100px", height: "100px" }} />
                    <SkeletonPlaceholder className="col-4 mx-auto mb-2" style={{ height: "1rem" }} />
                    <SkeletonPlaceholder className="col-6 mx-auto" style={{ height: "1rem" }} />
                  </div>
                </div>
                <div className="col-md-8">
                  <div className="card p-4 shadow-sm">
                    <SkeletonPlaceholder className="col-4 mb-3" style={{ height: "1.5rem" }} />
                    {[...Array(4)].map((_, idx) => (
                      <div key={idx} className="mb-3">
                        <SkeletonPlaceholder className="col-3 mb-1" style={{ height: "1rem" }} />
                        <SkeletonPlaceholder className="col-6" style={{ height: "2rem" }} />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : profileData ? (
            <>
              <div className="d-flex align-items-center justify-content-between border-bottom pb-3 mb-4">
                <div>
                  <h3 className="text-dark dark:text-white mb-1">Profile</h3>
                  <nav>
                    <ol className="breadcrumb mb-0">
                      <li className="breadcrumb-item">
                        <Link to={route.adminDashboard}>Dashboard</Link>
                      </li>
                      <li className="breadcrumb-item">Settings</li>
                      <li className="breadcrumb-item active">Profile</li>
                    </ol>
                  </nav>
                </div>
                <OverlayTrigger placement="top" overlay={<Tooltip>Refresh</Tooltip>}>
                  <Link to="#" className="btn btn-outline-light bg-white btn-icon" onClick={handleRefresh}>
                    <i className="ti ti-refresh" />
                  </Link>
                </OverlayTrigger>
              </div>
              <div className="row g-4">
                <div className="col-md-4">
                  <div className="card shadow-sm bg-white dark:bg-gray-800 p-4">
                    <div className="text-center">
                      <img
                        src={profileData.profilePic}
                        alt="Profile"
                        className="rounded-circle"
                        style={{ width: "100px", height: "100px", objectFit: "cover" }}
                      />
                      <h5 className="text-dark dark:text-white mb-2">{profileData.name}</h5>
                      <div className="mb-3">
                        <Link to="#" className="text-danger me-2" onClick={() => toast.info('Delete feature coming soon!', { autoClose: 3000 })}>
                          Delete
                        </Link>
                        <Link to="#" className="text-primary" data-bs-toggle="modal" data-bs-target="#upload_profile_pic">
                          Update
                        </Link>
                      </div>
                      <div className="profile-uploader text-center">
                        <label htmlFor="image_sign" className="btn btn-outline-primary w-100">
                          <i className="ti ti-upload me-2" />
                          Upload New Photo
                          <input
                            type="file"
                            id="image_sign"
                            accept="image/jpeg,image/png"
                            className="d-none"
                            onChange={handleFileChange}
                          />
                        </label>
                        <p className="text-secondary dark:text-gray-400 mt-2">JPG or PNG (Max 450x450 px)</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-md-8">
                  <div className="card shadow-sm bg-white dark:bg-gray-800 p-4 mb-4">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <h5 className="text-dark dark:text-white mb-0">Personal Information</h5>
                      <Link to="#" className="btn btn-primary btn-sm" data-bs-toggle="modal" data-bs-target="#edit_personal_information">
                        <i className="ti ti-edit me-2" />
                        Edit
                      </Link>
                    </div>
                    <div className="row g-3">
                      <div className="col-md-6">
                        <label className="form-label text-secondary">Name</label>
                        <p className="text-dark dark:text-white">{profileData.name || "N/A"}</p>
                      </div>
                      <div className="col-md-6">
                        <label className="form-label text-secondary">Email Address</label>
                        <p className="text-dark dark:text-white">{profileData.email || "N/A"}</p>
                      </div>
                      <div className="col-md-6">
                        <label className="form-label text-secondary">Phone Number</label>
                        <p className="text-dark dark:text-white">{profileData.phone || "N/A"}</p>
                      </div>
                      {profileData.role === "student" && (
                        <>
                      <div className="col-md-6">
                        <label className="form-label text-secondary">Admission Number</label>
                            <p className="text-dark dark:text-white">{profileData.student?.admissionNo || "N/A"}</p>
                      </div>
                      <div className="col-md-6">
                        <label className="form-label text-secondary">Class</label>
                            <p className="text-dark dark:text-white">{profileData.student?.class?.name || "N/A"}</p>
                      </div>
                        </>
                      )}
                      {profileData.role === "teacher" && (
                        <>
                      <div className="col-md-6">
                            <label className="form-label text-secondary">Department</label>
                            <p className="text-dark dark:text-white">{(profileData as any).department || "N/A"}</p>
                      </div>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="card shadow-sm bg-white dark:bg-gray-800 p-4 mb-4">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <h5 className="text-dark dark:text-white mb-0">Family Information</h5>
                      <Link to="#" className="btn btn-primary btn-sm" data-bs-toggle="modal" data-bs-target="#edit_family_information">
                        <i className="ti ti-edit me-2" />
                        Edit
                      </Link>
                    </div>
                    <div className="row g-3">
                      <div className="col-md-6">
                        <label className="form-label text-secondary">Father's Name</label>
                        <p className="text-dark dark:text-white">{profileData.student?.fatherName}</p>
                      </div>
                      <div className="col-md-6">
                        <label className="form-label text-secondary">Mother's Name</label>
                        <p className="text-dark dark:text-white">{profileData.student?.motherName}</p>
                      </div>
                      <div className="col-md-6">
                        <label className="form-label text-secondary">Guardian's Name</label>
                        <p className="text-dark dark:text-white">{profileData.student?.guardianName}</p>
                      </div>
                    </div>
                  </div>
                  <div className="card shadow-sm bg-white dark:bg-gray-800 p-4 mb-4">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <h5 className="text-dark dark:text-white mb-0">Address Information</h5>
                      <Link to="#" className="btn btn-primary btn-sm" data-bs-toggle="modal" data-bs-target="#edit_address_information">
                        <i className="ti ti-edit me-2" />
                        Edit
                      </Link>
                    </div>
                    <div className="row g-3">
                      <div className="col-md-12">
                        <label className="form-label text-secondary">Address</label>
                        <p className="text-dark dark:text-white">{profileData.address}</p>
                      </div>
                      <div className="col-md-6">
                        <label className="form-label text-secondary">City</label>
                        <p className="text-dark dark:text-white">{profileData.city}</p>
                      </div>
                      <div className="col-md-6">
                        <label className="form-label text-secondary">State</label>
                        <p className="text-dark dark:text-white">{profileData.state}</p>
                      </div>
                      <div className="col-md-6">
                        <label className="form-label text-secondary">Country</label>
                        <p className="text-dark dark:text-white">{profileData.country}</p>
                      </div>
                      <div className="col-md-6">
                        <label className="form-label text-secondary">Postal Code</label>
                        <p className="text-dark dark:text-white">{profileData.pincode}</p>
                      </div>
                    </div>
                  </div>
                  <div className="card shadow-sm bg-white dark:bg-gray-800 p-4">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <h5 className="text-dark dark:text-white mb-0">Password</h5>
                      <Link to="#" className="btn btn-primary btn-sm" data-bs-toggle="modal" data-bs-target="#change_password">
                        Change
                      </Link>
                    </div>
                    <div className="row g-3">
                      <div className="col-md-6">
                        <label className="form-label text-secondary">Current Password</label>
                        <div className="pass-group d-flex">
                          <input
                            type={passwordVisibility.currentPassword ? "text" : "password"}
                            className="pass-input form-control"
                            placeholder="********"
                            disabled
                          />
                          <span
                            className={`ti toggle-passwords ${passwordVisibility.currentPassword ? "ti-eye" : "ti-eye-off"}`}
                            onClick={() => togglePasswordVisibility("currentPassword")}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal fade" id="edit_personal_information">
                <div className="modal-dialog modal-dialog-centered">
                  <div className="modal-content">
                    <div className="modal-header">
                      <h4 className="modal-title">Edit Personal Information</h4>
                      <button type="button" className="btn-close custom-btn-close" data-bs-dismiss="modal" aria-label="Close">
                        <i className="ti ti-x" />
                      </button>
                    </div>
                    <form onSubmit={handleSavePersonalInfo}>
                      <div className="modal-body">
                        <div className="row g-3">
                          <div className="col-md-6">
                            <label className="form-label">First Name</label>
                            <input
                              type="text"
                              className="form-control"
                              defaultValue={profileData.name.split(' ')[0]}
                              required
                            />
                          </div>
                          <div className="col-md-6">
                            <label className="form-label">Last Name</label>
                            <input
                              type="text"
                              className="form-control"
                              defaultValue={profileData.name.split(' ').slice(1).join(' ')}
                              required
                            />
                          </div>
                          <div className="col-md-12">
                            <label className="form-label">Email</label>
                            <input
                              type="email"
                              className="form-control"
                              defaultValue={profileData.email}
                              required
                            />
                          </div>
                          <div className="col-md-12">
                            <label className="form-label">Phone Number</label>
                            <input
                              type="text"
                              className="form-control"
                              defaultValue={profileData.phone}
                              required
                            />
                          </div>
                          <div className="col-md-6">
                            <label className="form-label">Admission Number</label>
                            <input
                              type="text"
                              className="form-control"
                              defaultValue={profileData.student?.admissionNo}
                              readOnly
                            />
                          </div>
                          <div className="col-md-6">
                            <label className="form-label">Roll Number</label>
                            <input
                              type="text"
                              className="form-control"
                              defaultValue={profileData.student?.rollNo}
                              readOnly
                            />
                          </div>
                          <div className="col-md-6">
                            <label className="form-label">Class</label>
                            <input
                              type="text"
                              className="form-control"
                              defaultValue={profileData.student?.class.name}
                              readOnly
                            />
                          </div>
                          <div className="col-md-6">
                            <label className="form-label">Date of Birth</label>
                            <input
                              type="date"
                              className="form-control"
                              defaultValue={
                                profileData.student?.dateOfBirth && !isNaN(new Date(profileData.student.dateOfBirth).getTime())
                                  ? new Date(profileData.student.dateOfBirth).toISOString().split('T')[0]
                                  : ''
                              }
                              required
                            />
                          </div>
                        </div>
                      </div>
                      <div className="modal-footer">
                        <Link to="#" className="btn btn-light me-2" data-bs-dismiss="modal">
                          Cancel
                        </Link>
                        <button type="submit" className="btn btn-primary" data-bs-dismiss="modal">
                          Save Changes
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
              <div className="modal fade" id="edit_family_information">
                <div className="modal-dialog modal-dialog-centered">
                  <div className="modal-content">
                    <div className="modal-header">
                      <h4 className="modal-title">Edit Family Information</h4>
                      <button type="button" className="btn-close custom-btn-close" data-bs-dismiss="modal" aria-label="Close">
                        <i className="ti ti-x" />
                      </button>
                    </div>
                    <form onSubmit={handleSavePersonalInfo}>
                      <div className="modal-body">
                        <div className="row g-3">
                          <div className="col-md-12">
                            <label className="form-label">Father's Name</label>
                            <input
                              type="text"
                              className="form-control"
                              defaultValue={profileData.student?.fatherName}
                              required
                            />
                          </div>
                          <div className="col-md-12">
                            <label className="form-label">Mother's Name</label>
                            <input
                              type="text"
                              className="form-control"
                              defaultValue={profileData.student?.motherName}
                              required
                            />
                          </div>
                          <div className="col-md-12">
                            <label className="form-label">Guardian's Name</label>
                            <input
                              type="text"
                              className="form-control"
                              defaultValue={profileData.student?.guardianName}
                              required
                            />
                          </div>
                        </div>
                      </div>
                      <div className="modal-footer">
                        <Link to="#" className="btn btn-light me-2" data-bs-dismiss="modal">
                          Cancel
                        </Link>
                        <button type="submit" className="btn btn-primary" data-bs-dismiss="modal">
                          Save Changes
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
              <div className="modal fade" id="edit_address_information">
                <div className="modal-dialog modal-dialog-centered">
                  <div className="modal-content">
                    <div className="modal-header">
                      <h4 className="modal-title">Edit Address Information</h4>
                      <button type="button" className="btn-close custom-btn-close" data-bs-dismiss="modal" aria-label="Close">
                        <i className="ti ti-x" />
                      </button>
                    </div>
                    <form onSubmit={handleSaveAddressInfo}>
                      <div className="modal-body">
                        <div className="row g-3">
                          <div className="col-md-12">
                            <label className="form-label">Address</label>
                            <input
                              type="text"
                              className="form-control"
                              defaultValue={profileData.address}
                              required
                            />
                          </div>
                          <div className="col-md-6">
                            <label className="form-label">City</label>
                            <input
                              type="text"
                              className="form-control"
                              defaultValue={profileData.city}
                              required
                            />
                          </div>
                          <div className="col-md-6">
                            <label className="form-label">State</label>
                            <input
                              type="text"
                              className="form-control"
                              defaultValue={profileData.state}
                              required
                            />
                          </div>
                          <div className="col-md-6">
                            <label className="form-label">Country</label>
                            <input
                              type="text"
                              className="form-control"
                              defaultValue={profileData.country}
                              required
                            />
                          </div>
                          <div className="col-md-6">
                            <label className="form-label">Postal Code</label>
                            <input
                              type="text"
                              className="form-control"
                              defaultValue={profileData.pincode}
                              required
                            />
                          </div>
                        </div>
                      </div>
                      <div className="modal-footer">
                        <Link to="#" className="btn btn-light me-2" data-bs-dismiss="modal">
                          Cancel
                        </Link>
                        <button type="submit" className="btn btn-primary" data-bs-dismiss="modal">
                          Save Changes
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
              <div className="modal fade" id="change_password">
                <div className="modal-dialog modal-dialog-centered">
                  <div className="modal-content">
                    <div className="modal-header">
                      <h4 className="modal-title">Change Password</h4>
                      <button type="button" className="btn-close custom-btn-close" data-bs-dismiss="modal" aria-label="Close">
                        <i className="ti ti-x" />
                      </button>
                    </div>
                    <form onSubmit={handleChangePassword}>
                      <div className="modal-body">
                        <div className="row g-3">
                          <div className="col-md-12">
                            <label className="form-label">Current Password</label>
                            <div className="pass-group d-flex">
                              <input
                                type={passwordVisibility.oldPassword ? "text" : "password"}
                                className="pass-input form-control"
                                required
                              />
                              <span
                                className={`ti toggle-passwords ${passwordVisibility.oldPassword ? "ti-eye" : "ti-eye-off"}`}
                                onClick={() => togglePasswordVisibility("oldPassword")}
                              />
                            </div>
                          </div>
                          <div className="col-md-12">
                            <label className="form-label">New Password</label>
                            <div className="pass-group d-flex">
                              <input
                                type={passwordVisibility.newPassword ? "text" : "password"}
                                className="pass-input form-control"
                                required
                              />
                              <span
                                className={`ti toggle-passwords ${passwordVisibility.newPassword ? "ti-eye" : "ti-eye-off"}`}
                                onClick={() => togglePasswordVisibility("newPassword")}
                              />
                            </div>
                          </div>
                          <div className="col-md-12">
                            <label className="form-label">Confirm Password</label>
                            <div className="pass-group d-flex">
                              <input
                                type={passwordVisibility.confirmPassword ? "text" : "password"}
                                className="pass-input form-control"
                                required
                              />
                              <span
                                className={`ti toggle-passwords ${passwordVisibility.confirmPassword ? "ti-eye" : "ti-eye-off"}`}
                                onClick={() => togglePasswordVisibility("confirmPassword")}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="modal-footer">
                        <Link to="#" className="btn btn-light me-2" data-bs-dismiss="modal">
                          Cancel
                        </Link>
                        <button type="submit" className="btn btn-primary" data-bs-dismiss="modal">
                          Save Changes
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
              <div className="modal fade" id="upload_profile_pic">
                <div className="modal-dialog modal-dialog-centered">
                  <div className="modal-content">
                    <div className="modal-header">
                      <h4 className="modal-title">Upload Profile Picture</h4>
                      <button type="button" className="btn-close custom-btn-close" data-bs-dismiss="modal" aria-label="Close">
                        <i className="ti ti-x" />
                      </button>
                    </div>
                    <div className="modal-body">
                      {imageSrc ? (
                        <div>
                          <div className="position-relative" style={{ height: "300px" }}>
                            <Cropper
                              image={imageSrc}
                              crop={crop}
                              zoom={zoom}
                              aspect={1}
                              cropShape="round"
                              showGrid={false}
                              onCropChange={setCrop}
                              onZoomChange={setZoom}
                              onCropComplete={onCropComplete}
                            />
                          </div>
                          <div className="mt-3">
                            <label className="form-label">Zoom</label>
                            <input
                              type="range"
                              className="form-range"
                              min="1"
                              max="3"
                              step="0.1"
                              value={zoom}
                              onChange={(e) => setZoom(parseFloat(e.target.value))}
                            />
                          </div>
                        </div>
                      ) : (
                        <div className="text-center">
                          <label htmlFor="modal_image_sign" className="btn btn-outline-primary w-100 mb-3">
                            <i className="ti ti-upload me-2" />
                            Select File
                            <input
                              type="file"
                              id="modal_image_sign"
                              accept="image/jpeg,image/png"
                              className="d-none"
                              onChange={handleFileChange}
                            />
                          </label>
                          <p className="text-secondary dark:text-gray-400">JPG or PNG (Max 450x450 px)</p>
                        </div>
                      )}
                    </div>
                    <div className="modal-footer">
                      <Link to="#" className="btn btn-light me-2" data-bs-dismiss="modal" onClick={() => setImageSrc(null)}>
                        Cancel
                      </Link>
                      {imageSrc && (
                        <button className="btn btn-primary" data-bs-dismiss="modal" onClick={handleUpload}>
                          Upload
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="text-center text-secondary dark:text-white mt-5">
              <h5>Profile data not available for this user.</h5>
              <p>Please contact support for assistance.</p>
            </div>
          )}
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default Profile;