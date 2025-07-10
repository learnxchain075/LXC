import React, { useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import ImageWithBasePath from '../../../../../core/common/imageWithBasePath'
import { all_routes } from '../../../../../router/all_routes'
import StudentModals from '../studentModals'
import StudentSidebar from './studentSidebar'
import useMobileDetection from '../../../../../core/common/mobileDetection'
import { useSelector } from 'react-redux'
import { toast, ToastContainer } from 'react-toastify'
import { getStudentUserDetails, IStudentUser } from '../../../../../services/student/StudentAllApi'
import LoadingSkeleton from '../../../../../components/LoadingSkeleton'


interface Student {
  id?: string;
  name?: string;
  username?: string;
  email?: string;
  phone?: string;
  address?: {
    current?: string;
    permanent?: string;
  };
  parents?: {
    father?: {
      name?: string;
      phone?: string;
      email?: string;
      photo?: string;
    };
    mother?: {
      name?: string;
      phone?: string;
      email?: string;
      photo?: string;
    };
    guardian?: {
      name?: string;
      phone?: string;
      email?: string;
      photo?: string;
    };
  };
  documents?: {
    medicalCertificate?: string;
    transferCertificate?: string;
    birthCertificate?: string;
    previousSchoolCertificate?: string;
  };
  previousSchool?: {
    name?: string;
    address?: string;
  };
  bankDetails?: {
    bankName?: string;
    branch?: string;
    ifsc?: string;
  };
  medicalHistory?: {
    allergies?: string[];
    medications?: string;
  };
}

interface AuthState {
  user?: {
    username?: string;
    student?: Student;
    role?: string;
  };
}

interface ThemeState {
  dataTheme: 'default_data_theme' | 'dark_data_theme';
}

interface RootState {
  auth: AuthState;
  themeSetting: ThemeState;
}

interface Document {
  name: string;
  url: string;
}


const getInitials = (name?: string) => {
  if (!name) return 'NA';
  const trimmed = name.trim();
  if (trimmed.length === 0) return 'NA';
  return trimmed.substring(0, 2).toUpperCase();
};

const StudentDetails: React.FC = () => {
  const routes = all_routes;
  const isMobile = useMobileDetection();
  const dataTheme = useSelector((state: RootState) => state.themeSetting.dataTheme);
  const username = useSelector((state: any) => state.auth?.userObj?.name || 'student');
  const [studentData, setStudentData] = React.useState<IStudentUser | null>(null);
  const params = useParams<{ studentid: string }>();
  const userRole = useSelector((state: any) => state.auth?.userObj?.role || '');
  const [studentid, setStudentid] = React.useState<string>('');
  const isDark = dataTheme === 'dark_data_theme';
  const [loading, setLoading] = React.useState(true);

     useEffect(() => {
   
    if (userRole === 'student') {
      setStudentid(localStorage.getItem('userId') || '');
    //    console.log("localStorage",localStorage.getItem('studentId'));
    // console.log("objects",localStorage.getItem('userId'));
    } else {
      setStudentid(params.studentid || localStorage.getItem('studentId') || '');
      // console.log("params",params.studentid);
      // console.log("localStorage",localStorage.getItem('studentId'));

    }
    
  }, [userRole, params.studentid]);

  useEffect(() => {
    if (studentid) {
      setLoading(true);
      // console.log('Fetching student details for ID:', studentid);
      //  console.log('Fetching student details for ID:', localStorage.getItem('userId'));
      
      getStudentUserDetails(studentid)
        .then((res) => {
         // console.log('Student API response:', res.data);
          setStudentData(res.data);
          setLoading(false);
        })
        .catch((err) => {
          toast.error('Failed to fetch student details');
          setLoading(false);
        });
    }
  }, [studentid]);

  const student = studentData?.student;

  const documents: Document[] = React.useMemo(() => {
    if (!student) return [];
    const docs: Document[] = [];
    if (student.medicalCertificate) {
      docs.push({
        name: 'Medical Certificate.pdf',
        url: student.medicalCertificate,
      });
    }
    if (student.transferCertificate) {
      docs.push({
        name: 'Transfer Certificate.pdf',
        url: student.transferCertificate,
      });
    }

    return docs;
  }, [student]);


  const father = student
    ? {
        name: student.fatherName,
        phone: student.fatherPhone,
        email: student.fatheremail,
        photo: undefined, 
      }
    : undefined;
  const mother = student
    ? {
        name: student.motherName,
        phone: student.motherPhone,
        email: student.motherEmail,
        photo: undefined,
      }
    : undefined;
  const guardian = student
    ? {
        name: student.guardianName,
        phone: student.guardianPhone,
        email: student.guardianEmail,
        occupation: student.guardianOccupation,
        relation: student.guardianRelation,
        address: student.guardianAddress,
        photo: undefined, 
      }
    : undefined;


  const currentAddress = student?.currentAddress || 'Not available';
  const permanentAddress = student?.permanentAddress || 'Not available';


  const previousSchoolName = student?.schoolName || 'Not available';
  const previousSchoolAddress = student?.address || 'Not available';


  const bankName = 'Not available';
  const bankBranch = 'Not available';
  const bankIfsc = 'Not available';

 
  const allergies = student?.allergies && student.allergies !== 'NA' ? student.allergies.split(',') : [];
  const medications = student?.medicationName || 'None';

  const handleDownload = async (fileUrl: string, fileName: string) => {
    try {
      if (!fileUrl) {
        toast.error(' not available');
        return;
      }

      const link = document.createElement('a');
      link.href = fileUrl;
      link.download = `${username}_${fileName}`;
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success('Download started');
    } catch (error) {
      console.error('Download error:', error);
      toast.error('Failed to download document');
    }
  };

  const handleView = (fileUrl: string) => {
    if (!fileUrl) {
      toast.error(' not available');
      return;
    }
    window.open(fileUrl, '_blank');
  };

  return (
    <>
     <ToastContainer position="top-center" autoClose={3000} />
    
      {loading && (
        <div className="text-center py-5"><LoadingSkeleton lines={8} height={30} /></div>
      )  }
      {/* Page Wrapper */}
      {!loading && studentData && (
        <div className={isMobile ? "page-wrapper" : ""}>
          <div className="content">
            <div className="row">
              {/* Student Information */}
              {/* <StudentSidebar /> */}
              {/* /Student Information */}
              <div className="col-12 d-flex flex-column">
                <div className="row">
                  <div className="col-md-12">
                    {/* Parents Information */}
                    <div className={`card${isDark ? ' bg-dark text-light border-secondary' : ''}`}>
                      <div className={`card-header${isDark ? ' bg-dark text-light border-secondary' : ''}`}>
                        <h5 className={isDark ? 'text-light' : ''}>Parents Information</h5>
                      </div>
                      <div className="card-body">
                        {/* Father Information */}
                        {father && (
                          <div className={`border rounded p-3 pb-0 mb-3${isDark ? ' border-secondary' : ''}`}>
                            <div className="row">
                              <div className="col-sm-6 col-lg-4">
                                <div className="d-flex align-items-center mb-3">
                                  <span className="avatar avatar-lg flex-shrink-0 bg-primary text-white d-flex align-items-center justify-content-center rounded-circle" style={{width: 56, height: 56, fontSize: 22}}>
                                    {father.photo ? <img src={father.photo} className="img-fluid rounded" alt="Father" /> : getInitials(father.name)}
                                  </span>
                                  <div className="ms-2 overflow-hidden">
                                    <h6 className={`text-truncate${isDark ? ' text-light' : ''}`}>{father.name || 'Not available'}</h6>
                                    <p className="text-primary">Father</p>
                                  </div>
                                </div>
                              </div>
                              <div className="col-sm-6 col-lg-4">
                                <div className="mb-3">
                                  <p className={`fw-medium mb-1${isDark ? ' text-light' : ' text-dark'}`}>Phone</p>
                                  <p className={isDark ? 'text-secondary' : ''}>{father.phone || 'Not available'}</p>
                                </div>
                              </div>
                              <div className="col-sm-6 col-lg-4">
                                <div className="d-flex align-items-center justify-content-between">
                                  <div className="mb-3 overflow-hidden me-3">
                                    <p className={`fw-medium mb-1${isDark ? ' text-light' : ' text-dark'}`}>Email</p>
                                    <p className={`text-truncate${isDark ? ' text-secondary' : ''}`}>{father.email || 'Not available'}</p>
                                  </div>
                                  <Link
                                    to="#"
                                    data-bs-toggle="tooltip"
                                    data-bs-placement="top"
                                    aria-label="Reset Password"
                                    data-bs-original-title="Reset Password"
                                    className={`btn btn-icon btn-sm mb-3${isDark ? ' btn-outline-light' : ' btn-dark'}`}
                                  >
                                    <i className="ti ti-lock-x" />
                                  </Link>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Mother Information */}
                        {mother && (
                          <div className={`border rounded p-3 pb-0 mb-3${isDark ? ' border-secondary' : ''}`}>
                            <div className="row">
                              <div className="col-lg-4 col-sm-6">
                                <div className="d-flex align-items-center mb-3">
                                  <span className="avatar avatar-lg flex-shrink-0 bg-primary text-white d-flex align-items-center justify-content-center rounded-circle" style={{width: 56, height: 56, fontSize: 22}}>
                                    {mother.photo ? <img src={mother.photo} className="img-fluid rounded" alt="Mother" /> : getInitials(mother.name)}
                                  </span>
                                  <div className="ms-2 overflow-hidden">
                                    <h6 className={`text-truncate${isDark ? ' text-light' : ''}`}>{mother.name || 'Not available'}</h6>
                                    <p className="text-primary">Mother</p>
                                  </div>
                                </div>
                              </div>
                              <div className="col-lg-4 col-sm-6">
                                <div className="mb-3">
                                  <p className={`fw-medium mb-1${isDark ? ' text-light' : ' text-dark'}`}>Phone</p>
                                  <p className={isDark ? 'text-secondary' : ''}>{mother.phone || 'Not available'}</p>
                                </div>
                              </div>
                              <div className="col-lg-4 col-sm-6">
                                <div className="d-flex align-items-center justify-content-between">
                                  <div className="mb-3 overflow-hidden me-3">
                                    <p className={`fw-medium mb-1${isDark ? ' text-light' : ' text-dark'}`}>Email</p>
                                    <p className={`text-truncate${isDark ? ' text-secondary' : ''}`}>{mother.email || 'Not available'}</p>
                                  </div>
                                  <Link
                                    to="#"
                                    data-bs-toggle="tooltip"
                                    data-bs-placement="top"
                                    aria-label="Reset Password"
                                    data-bs-original-title="Reset Password"
                                    className={`btn btn-icon btn-sm mb-3${isDark ? ' btn-outline-light' : ' btn-dark'}`}
                                  >
                                    <i className="ti ti-lock-x" />
                                  </Link>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Guardian Information */}
                        {guardian && (
                          <div className={`border rounded p-3 pb-0${isDark ? ' border-secondary' : ''}`}>
                            <div className="row">
                              <div className="col-lg-4 col-sm-6">
                                <div className="d-flex align-items-center mb-3">
                                  <span className="avatar avatar-lg flex-shrink-0 bg-primary text-white d-flex align-items-center justify-content-center rounded-circle" style={{width: 56, height: 56, fontSize: 22}}>
                                    {guardian.photo ? <img src={guardian.photo} className="img-fluid rounded" alt="Guardian" /> : getInitials(guardian.name)}
                                  </span>
                                  <div className="ms-2 overflow-hidden">
                                    <h6 className={`text-truncate${isDark ? ' text-light' : ''}`}>{guardian.name || 'Not available'}</h6>
                                    <p className="text-primary">Guardian</p>
                                  </div>
                                </div>
                              </div>
                              <div className="col-lg-4 col-sm-6">
                                <div className="mb-3">
                                  <p className={`fw-medium mb-1${isDark ? ' text-light' : ' text-dark'}`}>Phone</p>
                                  <p className={isDark ? 'text-secondary' : ''}>{guardian.phone || 'Not available'}</p>
                                </div>
                              </div>
                              <div className="col-lg-4 col-sm-6">
                                <div className="d-flex align-items-center justify-content-between">
                                  <div className="mb-3 overflow-hidden me-3">
                                    <p className={`fw-medium mb-1${isDark ? ' text-light' : ' text-dark'}`}>Email</p>
                                    <p className={`text-truncate${isDark ? ' text-secondary' : ''}`}>{guardian.email || 'Not available'}</p>
                                  </div>
                                  <Link
                                    to="#"
                                    data-bs-toggle="tooltip"
                                    data-bs-placement="top"
                                    aria-label="Reset Password"
                                    data-bs-original-title="Reset Password"
                                    className={`btn btn-icon btn-sm mb-3${isDark ? ' btn-outline-light' : ' btn-dark'}`}
                                  >
                                    <i className="ti ti-lock-x" />
                                  </Link>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}

                        {!father && !mother && !guardian && (
                          <div className={`text-center py-4${isDark ? ' text-secondary' : ' text-muted'}`}>
                            <i className="ti ti-users fs-1 mb-3"></i>
                            <p>No parent information available.</p>
                          </div>
                        )}
                      </div>
                    </div>
                    {/* /Parents Information */}
                  </div>
                  {/* Documents */}
                  <div className="col-xxl-6 d-flex">
                    <div className={`card flex-fill${isDark ? ' bg-dark text-light border-secondary' : ''}`}>
                      <div className={`card-header${isDark ? ' bg-dark text-light border-secondary' : ''}`}>
                        <h5 className={isDark ? 'text-light' : ''}>Documents</h5>
                      </div>
                      <div className="card-body">
                        {documents.length > 0 ? (
                          documents.map((doc: Document, idx: number) => (
                            <div key={idx} className={`border rounded d-flex align-items-center justify-content-between mb-3 p-2${isDark ? ' border-secondary bg-dark' : ' bg-light-300'}`}>
                              <div className="d-flex align-items-center overflow-hidden">
                                <span className={`avatar avatar-md rounded flex-shrink-0${isDark ? ' bg-secondary text-light' : ' bg-white text-default'}`}>
                                  <i className="ti ti-pdf fs-15" />
                                </span>
                                <div className="ms-2">
                                  <p className={`text-truncate fw-medium${isDark ? ' text-light' : ' text-dark'}`}>{doc.name}</p>
                                </div>
                              </div>
                              <div className="d-flex gap-2">
                                <button 
                                  type="button" 
                                  className={`btn btn-icon btn-sm${isDark ? ' btn-outline-info' : ' btn-info'}`} 
                                  onClick={() => handleView(doc.url)}
                                  disabled={!doc.url}
                                  title="View PDF"
                                >
                                  <i className="ti ti-eye" />
                                </button>
                                <button 
                                  type="button" 
                                  className={`btn btn-icon btn-sm${isDark ? ' btn-outline-light' : ' btn-dark'}`} 
                                  onClick={() => handleDownload(doc.url, doc.name)}
                                  disabled={!doc.url}
                                  title="Download PDF"
                                >
                                  <i className="ti ti-download" />
                                </button>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className={`text-center py-4${isDark ? ' text-secondary' : ' text-muted'}`}>
                            <i className="ti ti-files fs-1 mb-3"></i>
                            <p>No documents available.</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  {/* /Documents */}
                  {/* Address */}
                  <div className="col-xxl-6 d-flex">
                    <div className={`card flex-fill${isDark ? ' bg-dark text-light border-secondary' : ''}`}>
                      <div className={`card-header${isDark ? ' bg-dark text-light border-secondary' : ''}`}>
                        <h5 className={isDark ? 'text-light' : ''}>Address</h5>
                      </div>
                      <div className="card-body">
                        <div className="d-flex align-items-center mb-3">
                          <span className={`avatar avatar-md rounded me-2 flex-shrink-0${isDark ? ' bg-secondary text-light' : ' bg-light-300 text-default'}`}>
                            <i className="ti ti-map-pin-up" />
                          </span>
                          <div>
                            <p className={`fw-medium mb-1${isDark ? ' text-light' : ' text-dark'}`}>
                              Current Address
                            </p>
                            <p className={isDark ? 'text-secondary' : ''}>{currentAddress}</p>
                          </div>
                        </div>
                        <div className="d-flex align-items-center">
                          <span className={`avatar avatar-md rounded me-2 flex-shrink-0${isDark ? ' bg-secondary text-light' : ' bg-light-300 text-default'}`}>
                            <i className="ti ti-map-pins" />
                          </span>
                          <div>
                            <p className={`fw-medium mb-1${isDark ? ' text-light' : ' text-dark'}`}>
                              Permanent Address
                            </p>
                            <p className={isDark ? 'text-secondary' : ''}>{permanentAddress}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* /Address */}
                  {/* Previous School Details */}
                  <div className="col-xxl-12">
                    <div className={`card${isDark ? ' bg-dark text-light border-secondary' : ''}`}>
                      <div className={`card-header${isDark ? ' bg-dark text-light border-secondary' : ''}`}>
                        <h5 className={isDark ? 'text-light' : ''}>Previous School Details</h5>
                      </div>
                      <div className="card-body pb-1">
                        <div className="row">
                          <div className="col-md-6">
                            <div className="mb-3">
                              <p className={`fw-medium mb-1${isDark ? ' text-light' : ' text-dark'}`}>
                                Previous School Name
                              </p>
                              <p className={isDark ? 'text-secondary' : ''}>{previousSchoolName}</p>
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="mb-3">
                              <p className={`fw-medium mb-1${isDark ? ' text-light' : ' text-dark'}`}>
                                School Address
                              </p>
                              <p className={isDark ? 'text-secondary' : ''}>{previousSchoolAddress}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* /Previous School Details */}
                  {/* Bank Details */}
                  <div className="col-xxl-6 d-flex">
                    <div className={`card flex-fill${isDark ? ' bg-dark text-light border-secondary' : ''}`}>
                      <div className={`card-header${isDark ? ' bg-dark text-light border-secondary' : ''}`}>
                        <h5 className={isDark ? 'text-light' : ''}>Bank Details</h5>
                      </div>
                      <div className="card-body pb-1">
                        <div className="row">
                          <div className="col-md-4">
                            <div className="mb-3">
                              <p className={`fw-medium mb-1${isDark ? ' text-light' : ' text-dark'}`}>Bank Name</p>
                              <p className={isDark ? 'text-secondary' : ''}>{bankName}</p>
                            </div>
                          </div>
                          <div className="col-md-4">
                            <div className="mb-3">
                              <p className={`fw-medium mb-1${isDark ? ' text-light' : ' text-dark'}`}>Branch</p>
                              <p className={isDark ? 'text-secondary' : ''}>{bankBranch}</p>
                            </div>
                          </div>
                          <div className="col-md-4">
                            <div className="mb-3">
                              <p className={`fw-medium mb-1${isDark ? ' text-light' : ' text-dark'}`}>IFSC</p>
                              <p className={isDark ? 'text-secondary' : ''}>{bankIfsc}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* /Bank Details */}
                  {/* Medical History */}
                  <div className="col-xxl-6 d-flex">
                    <div className={`card flex-fill${isDark ? ' bg-dark text-light border-secondary' : ''}`}>
                      <div className={`card-header${isDark ? ' bg-dark text-light border-secondary' : ''}`}>
                        <h5 className={isDark ? 'text-light' : ''}>Medical History</h5>
                      </div>
                      <div className="card-body pb-1">
                        <div className="row">
                          <div className="col-md-6">
                            <div className="mb-3">
                              <p className={`fw-medium mb-1${isDark ? ' text-light' : ' text-dark'}`}>
                                Known Allergies
                              </p>
                              {allergies.length > 0 ? (
                                allergies.map((allergy, index) => (
                                  <span key={index} className={`badge me-1${isDark ? ' bg-secondary text-light' : ' bg-light text-dark'}`}>
                                    {allergy}
                                  </span>
                                ))
                              ) : (
                                <span className={`badge${isDark ? ' bg-secondary text-light' : ' bg-light text-dark'}`}>None</span>
                              )}
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="mb-3">
                              <p className={`fw-medium mb-1${isDark ? ' text-light' : ' text-dark'}`}>Medications</p>
                              <p className={isDark ? 'text-secondary' : ''}>{medications}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* /Medical History */}
                  {/* Other Info */}
                  {/* <div className="col-xxl-12">
                    <div className={`card${isDark ? ' bg-dark text-light border-secondary' : ''}`}>
                      <div className={`card-header${isDark ? ' bg-dark text-light border-secondary' : ''}`}>
                        <h5 className={isDark ? 'text-light' : ''}>Other Info</h5>
                      </div>
                      <div className="card-body">
                        <p className={isDark ? 'text-secondary' : ''}>
                          Depending on the specific needs of your organization or
                          system, additional information may be collected or tracked.
                          It's important to ensure that any data collected complies
                          with privacy regulations and policies to protect students'
                          sensitive information.
                        </p>
                      </div>
                    </div>
                  </div> */}
                  {/* /Other Info */}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* /Page Wrapper */}
      <StudentModals />
    </>
  )
}

export default StudentDetails