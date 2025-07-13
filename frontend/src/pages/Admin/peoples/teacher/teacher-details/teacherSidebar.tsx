import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ImageWithBasePath from "../../../../../core/common/imageWithBasePath";
import { getTeacherById } from "../../../../../services/admin/teacherRegistartion";
import { useSelector } from "react-redux";

const TeacherSidebar = () => {
  const [teacherdata, setTeacherdata] = useState<any>({});
  const [loading, setLoading] = useState(true); // Loading state
  const userobj = useSelector((state: any) => state.auth.userObj);

  const fetchTeacherDetails = async () => {
    try {
      setLoading(true); // Start loading
      const teacherId = localStorage.getItem("teacherId") ?? "";
      
      const response = await getTeacherById(teacherId);
      
      if (response.status === 200) {
        const teacherDetails = response.data;
        setTeacherdata(teacherDetails);
      } else {
        console.error("Failed to fetch teacher details");
      }
    } catch (error) {
      console.error("Error fetching teacher details:", error);
    } finally {
      setLoading(false); // End loading
    }
  };

  function formatDate(isoDateString: any) {
    const date = new Date(isoDateString);
    const day = date.getDate().toString().padStart(2, "0");
    const monthNames = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];
    const month = monthNames[date.getMonth()];
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
  }

  useEffect(() => {
    fetchTeacherDetails();
  }, [userobj.role]);

  // Extract unique classes and subjects from lessons
  const getClassAndSection = () => {
    if (teacherdata.lessons && Array.isArray(teacherdata.lessons) && teacherdata.lessons.length > 0) {
      const uniqueClasses = new Set();
      
      teacherdata.lessons.forEach((lesson: any) => {
            if (lesson.class && lesson.class.name && lesson.class.section) {
          const classSection = `${lesson.class.name} ${lesson.class.section}`;
          uniqueClasses.add(classSection);
        } else if (lesson.class && lesson.class.name) {
          const className = lesson.class.name;
          uniqueClasses.add(className);
        }
      });
      
      const result = Array.from(uniqueClasses).join(", ");
      return result || "N/A";
    }
    
    // Fallback: check if teacher has direct class assignments
    if (teacherdata.classes && Array.isArray(teacherdata.classes) && teacherdata.classes.length > 0) {
      const classSections = teacherdata.classes.map((cls: any) => {
        if (cls.name && cls.section) {
          return `${cls.name} ${cls.section}`;
        } else if (cls.name) {
          return cls.name;
            }
            return null;
      }).filter(Boolean);
      
      return classSections.join(", ") || "N/A";
    }
    
    return "N/A";
  };

  const getSubjects = () => {
    if (teacherdata.lessons && Array.isArray(teacherdata.lessons) && teacherdata.lessons.length > 0) {
      const uniqueSubjects = new Set();
      
      teacherdata.lessons.forEach((lesson: any) => {
        if (lesson.subject && lesson.subject.name) {
          uniqueSubjects.add(lesson.subject.name);
        }
      });
      
      const result = Array.from(uniqueSubjects).join(", ");
      return result || "N/A";
    }
    
    // Fallback: check if teacher has direct subject assignments
    if (teacherdata.subjects && Array.isArray(teacherdata.subjects) && teacherdata.subjects.length > 0) {
      const subjects = teacherdata.subjects.map((subject: any) => subject.name).filter(Boolean);
      return subjects.join(", ") || "N/A";
    }
    
    return "N/A";
  };

  // Skeleton Placeholder Component with proper TypeScript interface
  interface SkeletonPlaceholderProps {
    className?: string;
    style?: React.CSSProperties;
  }

  const SkeletonPlaceholder: React.FC<SkeletonPlaceholderProps> = ({ className = '', style }) => (
    <span className={`placeholder bg-secondary ${className}`} style={style} />
  );

  return (
    <div className="col-xxl-3 col-xl-4 theiaStickySidebar">
      <div className="stickytopbar pb-4">
        {loading ? (
          <>
            {/* Profile Card Skeleton */}
            <div className="card border-white mb-3">
              <div className="card-header">
                <div className="d-flex align-items-center">
                  <SkeletonPlaceholder
                    className="rounded-circle me-2 flex-shrink-0"
                    style={{ width: '80px', height: '80px' }}
                  />
                  <div className="flex-grow-1">
                    <SkeletonPlaceholder className="w-50 mb-2" />
                    <SkeletonPlaceholder className="w-25 mb-2" />
                    <SkeletonPlaceholder className="w-75" />
                  </div>
                </div>
              </div>
              <div className="card-body">
                <SkeletonPlaceholder className="w-50 mb-3" />
                <dl className="row mb-0">
                  {Array.from({ length: 7 }).map((_, index) => (
                    <React.Fragment key={index}>
                      <dt className="col-6 mb-3">
                        <SkeletonPlaceholder className="w-75" />
                      </dt>
                      <dd className="col-6 mb-3">
                        <SkeletonPlaceholder className="w-50" />
                      </dd>
                    </React.Fragment>
                  ))}
                </dl>
              </div>
            </div>
            {/* Contact Info Skeleton */}
            <div className="card border-white mb-3">
              <div className="card-body">
                <SkeletonPlaceholder className="w-50 mb-3" />
                {Array.from({ length: 2 }).map((_, index) => (
                  <div className="d-flex align-items-center mb-3" key={index}>
                    <SkeletonPlaceholder
                      className="rounded me-2 flex-shrink-0"
                      style={{ width: '40px', height: '40px' }}
                    />
                    <div>
                      <SkeletonPlaceholder className="w-50 mb-1" />
                      <SkeletonPlaceholder className="w-75" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {/* PAN Number Skeleton */}
            <div className="card border-white mb-3">
              <div className="card-body">
                <SkeletonPlaceholder className="w-50 mb-3" />
                <div className="d-flex align-items-center justify-content-between mb-3">
                  <div className="d-flex align-items-center">
                    <SkeletonPlaceholder
                      className="rounded me-2 flex-shrink-0"
                      style={{ width: '40px', height: '40px' }}
                    />
                    <SkeletonPlaceholder className="w-75" />
                  </div>
                  <SkeletonPlaceholder
                    className="rounded flex-shrink-0"
                    style={{ width: '40px', height: '30px' }}
                  />
                </div>
              </div>
            </div>
            {/* Hostel/Transport Skeleton */}
            <div className="card border-white mb-0">
              <div className="card-body pb-1">
                <ul className="nav nav-tabs nav-tabs-bottom mb-3">
                  <li className="nav-item">
                    <SkeletonPlaceholder className="w-100 px-3 py-2" />
                  </li>
                  <li className="nav-item">
                    <SkeletonPlaceholder className="w-100 px-3 py-2" />
                  </li>
                </ul>
                <div className="d-flex align-items-center mb-3">
                  <SkeletonPlaceholder
                    className="rounded me-2 flex-shrink-0"
                    style={{ width: '40px', height: '40px' }}
                  />
                  <div>
                    <SkeletonPlaceholder className="w-50 mb-1" />
                    <SkeletonPlaceholder className="w-25" />
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <>
            {/* Profile Card */}
            <div className="card border-white">
              <div className="card-header">
                <div className="d-flex align-items-center flex-wrap row-gap-3">
                  <div className="d-flex align-items-center justify-content-center avatar avatar-xxl border border-dashed me-2 flex-shrink-0 text-dark frames" style={{ width: '80px', height: '80px', overflow: 'hidden' }}>
                    <img
                      src={teacherdata.user?.profilePic || "assets/img/teachers/teacher-01.jpg"}
                      className="img-fluid"
                      alt="Teacher Profile"
                      style={{ 
                        width: '100%', 
                        height: '100%', 
                        objectFit: 'cover',
                        objectPosition: 'center'
                      }}
                    />
                  </div>
                  <div>
                    <h5 className="mb-1 text-truncate">{teacherdata.user?.name || "N/A"}</h5>
                    <p className="text-primary mb-1">{teacherdata.teacherSchoolId || "N/A"}</p>
                    <p>{teacherdata.dateofJoin ? formatDate(teacherdata.dateofJoin) : "N/A"}</p>
                  </div>
                </div>
              </div>
              <div className="card-body">
                <h5 className="mb-3">Basic Information</h5>
                <dl className="row mb-0">
                  <dt className="col-6 fw-medium text-dark mb-3">Class & Section</dt>
                  <dd className="col-6 mb-3">{getClassAndSection()}</dd>
                  <dt className="col-6 fw-medium text-dark mb-3">Subject</dt>
                  <dd className="col-6 mb-3">{getSubjects()}</dd>
                  <dt className="col-6 fw-medium text-dark mb-3">Gender</dt>
                  <dd className="col-6 mb-3">{teacherdata.user?.sex || "N/A"}</dd>
                  <dt className="col-6 fw-medium text-dark mb-3">Blood Group</dt>
                  <dd className="col-6 mb-3">{teacherdata.user?.bloodType || "N/A"}</dd>
                  <dt className="col-6 fw-medium text-dark mb-3">House</dt>
                  <dd className="col-6 mb-3">{teacherdata.hostelName || "N/A"}</dd>
                  <dt className="col-6 fw-medium text-dark mb-3">Language Known</dt>
                  <dd className="col-6 mb-3">
                    {teacherdata.languagesKnown && typeof teacherdata.languagesKnown === "string" ? (
                      teacherdata.languagesKnown.split(",")[0] || "N/A"
                    ) : (
                      "N/A"
                    )}
                  </dd>
                  <dt className="col-6 fw-medium text-dark mb-0">Languages</dt>
                  <dd className="col-6 mb-0">
                    {teacherdata.languagesKnown && typeof teacherdata.languagesKnown === "string" ? (
                      teacherdata.languagesKnown.split(",").map((language: string) => (
                        <span key={language.trim()} className="badge badge-light text-dark me-2">
                          {language.trim()}
                        </span>
                      ))
                    ) : (
                      "N/A"
                    )}
                  </dd>
                </dl>
              </div>
            </div>
            {/* Contact Info */}
            <div className="card border-white">
              <div className="card-body">
                <h5 className="mb-3">Primary Contact Info</h5>
                <div className="d-flex align-items-center mb-3">
                  <span className="avatar avatar-md bg-light-300 rounded me-2 flex-shrink-0 text-default">
                    <i className="ti ti-phone" />
                  </span>
                  <div>
                    <span className="text-dark fw-medium mb-1">Phone Number</span>
                    <p>{teacherdata.user?.phone || "N/A"}</p>
                  </div>
                </div>
                <div className="d-flex align-items-center">
                  <span className="avatar avatar-md bg-light-300 rounded me-2 flex-shrink-0 text-default">
                    <i className="ti ti-mail" />
                  </span>
                  <div>
                    <span className="text-dark fw-medium mb-1">Email Address</span>
                    <p>{teacherdata.user?.email || "N/A"}</p>
                  </div>
                </div>
              </div>
            </div>
            {/* PAN Number */}
            <div className="card border-white">
              <div className="card-body pb-1">
                <h5 className="mb-3">PAN Number / ID Number</h5>
                <div className="d-flex align-items-center justify-content-between">
                  <div className="d-flex align-items-center mb-3">
                    <span className="avatar avatar-md bg-light-300 rounded me-2 flex-shrink-0 text-default">
                      <i className="ti ti-id" />
                    </span>
                    <div>
                      <p className="text-dark">{teacherdata.panNumber || "N/A"}</p>
                    </div>
                  </div>
                  <Link to="#" className="btn btn-primary btn-icon btn-sm mb-3">
                    <i className="ti ti-copy" />
                  </Link>
                </div>
              </div>
            </div>
            {/* Hostel/Transport */}
            <div className="card border-white mb-0">
              <div className="card-body pb-1">
                <ul className="nav nav-tabs nav-tabs-bottom mb-3">
                  <li className="nav-item">
                    <Link className="nav-link active" to="#hostel" data-bs-toggle="tab">
                      Hostel
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="#transport" data-bs-toggle="tab">
                      Transportation
                    </Link>
                  </li>
                </ul>
                <div className="tab-content">
                  <div className="tab-pane fade show active" id="hostel">
                    <div className="d-flex align-items-center mb-3">
                      <span className="avatar avatar-md bg-light-300 rounded me-2 flex-shrink-0 text-default">
                        <i className="ti ti-building-fortress fs-16" />
                      </span>
                      <div>
                        <h6 className="mb-1">{teacherdata.hostelName || "N/A"}</h6>
                        <p className="text-primary">Room No: {teacherdata.roomNumber || "N/A"}</p>
                      </div>
                    </div>
                  </div>
                  <div className="tab-pane fade" id="transport">
                    <div className="d-flex align-items-center mb-3">
                      <span className="avatar avatar-md bg-light-300 rounded me-2 flex-shrink-0 text-default">
                        <i className="ti ti-bus fs-16" />
                      </span>
                      <div>
                        <span className="fs-12 mb-1">Route</span>
                        <p className="text-dark">{teacherdata.route || "N/A"}</p>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-sm-6">
                        <div className="mb-3">
                          <span className="fs-12 mb-1">Bus Number</span>
                          <p className="text-dark">N/A</p>
                        </div>
                      </div>
                      <div className="col-sm-6">
                        <div className="mb-3">
                          <span className="fs-12 mb-1">Pickup Point</span>
                          <p className="text-dark">N/A</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default TeacherSidebar;