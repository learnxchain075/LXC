

// import React, { useState, useEffect } from 'react';
// import { useParams, Link } from 'react-router-dom';
// import { getSchoolById } from '../../../services/superadmin/schoolService';
// import UpdateFeaturePermissionsModal from '../super-admin/UpdateFeaturePermissionsModal'; //add 
// import { all_routes } from "../../../router/all_routes"; // Adjust path as needed
// const fetchSchoolDetails = async (schoolId: string) => {
//   const response = await getSchoolById(schoolId);
//   const schoolData = response.data?.school;

//   return {
//     id: schoolId || "No Data",
//     name: schoolData?.schoolName || "No Data",
//     adminName: schoolData?.user?.name || "No Data",
//     email: schoolData?.user?.email || "No Data",
//     phone: schoolData?.user?.phone || "No Data",
//     address: schoolData?.user?.address || "No Data",
//     foundedYear: schoolData?.createdAt ? new Date(schoolData.createdAt).getFullYear() : "No Data",
//     studentCount: schoolData?.studentId ? schoolData.studentId.length : "No Data",
//     teacherCount: schoolData?.teacherId ? schoolData.teacherId.length : "No Data",
//     departments: schoolData?.departments || ["No Data"],
//     recentAchievements: schoolData?.achievements || ["No Data"],
//     logoUrl: schoolData?.user?.profilePic || "/api/placeholder/200/200",
//     userId: schoolData?.userId,
//   };
// };

// const SchoolProfilePage = () => {
//   const { schoolId } = useParams<{ schoolId: string }>();
//   const [schoolDetails, setSchoolDetails] = useState<any>(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const loadSchoolDetails = async () => {
//       try {
//         const details = await fetchSchoolDetails(schoolId || '');
//         setSchoolDetails(details);
//         setLoading(false);
//       } catch (error) {
//         // console.error('Error fetching school details:', error);
//         setLoading(false);
//       }
//     };

//     loadSchoolDetails();
//   }, [schoolId]);

//   if (loading) {
//     return (
//       <div className="d-flex justify-content-center align-items-center vh-100">
//         <div className="spinner-border text-primary" role="status">
//           <span className="visually-hidden">Loading...</span>
//         </div>
//       </div>
//     );
//   }

//   if (!schoolDetails) {
//     return (
//       <div className="container my-5">
//         <div className="alert alert-danger">School not found</div>
//         <Link to="/schools" className="btn btn-secondary mt-3">
//           <i className="bi bi-arrow-left me-2"></i>Back to Schools
//         </Link>
//       </div>
//     );
//   }

//   return (
//     <>
//    <div className='page-wrapper'>

//    <div className="container-fluid bg-light min-vh-100 d-flex flex-column">
//       {/* <div className="container pt-5"> */}
//       <div className="container d-flex flex-column justify-content-center min-vh-100 pt-5">
//         {/* Page Header - Centered */}
//         {/* <div className="row justify-content-center mb-4"> */}
//         <div className="row justify-content-center mb-4 mt-4">
//           <div className="col-md-8 text-center">
//             <div className="card shadow">
//               <div className="card-body">
//                 <img
//                   src={schoolDetails.logoUrl}
//                   alt={`${schoolDetails.name} Logo`}
//                   className="rounded-circle border border-3 border-primary mb-3 mx-auto d-block"
//                   style={{ width: "120px", height: "120px", objectFit: "cover" }}
//                 />
//                 <h1 className="card-title">{schoolDetails.name}</h1>
//                 <p className="card-text text-muted">
//                   <i className="bi bi-building me-2"></i>Educational Institution
//                 </p>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* School Details - Centered */}
//         {/* <div className="row justify-content-center g-4"> */}
//         {/* Contact Information */}
//         {/* <div className="col-md-5">
//             <div className="card h-100 shadow-sm text-center"> */}
//         <div className="row justify-content-center g-4 mb-4">

//           <div className="col-md-5 d-flex">
//             <div className="card h-100 shadow-sm w-100">
//               <div className="card-header bg-primary text-white">
//                 <h5 className="card-title mb-0">Contact Information</h5>
//               </div>
//               <div className="card-body">
//                 <ul className="list-unstyled text-start">
//                   <li className="mb-2">
//                     <strong>Admin:</strong> {schoolDetails.adminName}
//                   </li>
//                   <li className="mb-2">
//                     <strong>Email:</strong>
//                     <a href={`mailto:${schoolDetails.email}`} className="text-decoration-none d-block">
//                       {schoolDetails.email}
//                     </a>
//                   </li>
//                   <li className="mb-2">
//                     <strong>Phone:</strong>
//                     <a href={`tel:${schoolDetails.phone}`} className="text-decoration-none d-block">
//                       {schoolDetails.phone}
//                     </a>
//                   </li>
//                   <li>
//                     <strong>Address:</strong> {schoolDetails.address}
//                   </li>
//                 </ul>
//               </div>
//             </div>
//           </div>

//           {/* School Statistics */}
//           <div className="col-md-5">
//             <div className="card h-100 shadow-sm text-center">
//               <div className="card-header bg-success text-white">
//                 <h5 className="card-title mb-0">School Statistics</h5>
//               </div>
//               <div className="card-body">
//                 <ul className="list-group list-group-flush text-start">
//                   <li className="list-group-item d-flex justify-content-between align-items-center">
//                     <span>Founded</span>
//                     <span className="badge bg-primary rounded-pill">{schoolDetails.foundedYear}</span>
//                   </li>
//                   <li className="list-group-item d-flex justify-content-between align-items-center">
//                     <span>Students</span>
//                     <span className="badge bg-success rounded-pill">{schoolDetails.studentCount}</span>
//                   </li>
//                   <li className="list-group-item d-flex justify-content-between align-items-center">
//                     <span>Teachers</span>
//                     <span className="badge bg-info rounded-pill">{schoolDetails.teacherCount}</span>
//                   </li>
//                 </ul>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Achievements - Centered */}
//         {/* <div className="row justify-content-center mt-4"> */}
//         <div className="row justify-content-center mt-4 mb-4">

//           <div className="col-md-10">
//             <div className="card shadow-sm text-center">
//               <div className="card-header bg-warning text-white">
//                 <h5 className="card-title mb-0">Recent Achievements</h5>
//               </div>
//               <div className="card-body">
//                 {schoolDetails.recentAchievements.length > 0 ? (
//                   <div className="row justify-content-center g-3">
//                     {schoolDetails.recentAchievements.map((achievement: string, index: number) => (
//                       <div key={index} className="col-md-8">
//                         <div className="alert alert-warning mb-0 text-start">
//                           <i className="bi bi-trophy me-2"></i>
//                           {achievement}
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 ) : (
//                   <p className="text-muted mb-0">No achievements to display</p>
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Action Buttons - Centered */}
//         {/* <div className="row justify-content-center mt-4 mb-5"> */}
//         <div className="row justify-content-center mt-4 mb-5">
//           <div className="col-md-8 text-center">
//             <Link to={all_routes.getSchools} className="btn btn-secondary me-3 mb-2 mb-md-0">
//               <i className="bi bi-arrow-left me-2"></i>Back to Schools
//             </Link>
//             <button
//               className="btn btn-info me-3 mb-2 mb-md-0"
//               data-bs-toggle="modal"
//               data-bs-target="#modal-lg"
//             >
//               <i className="bi bi-shield-lock me-2"></i>Update Permissions
//             </button>
//             <button className="btn btn-primary mb-2 mb-md-0">
//               <i className="bi bi-gear me-2"></i>Manage School
//             </button>
//           </div>
//         </div>

//         {/* Permissions Modal */}
//         <UpdateFeaturePermissionsModal userId={schoolDetails.userId} />
//       </div>
//     </div>
//    </div>

//     </>


//   );
// };

// export default SchoolProfilePage;





import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Container,
  Row,
  Col,
  Card,
  ListGroup,
  Badge,
  Alert,
  Spinner,
  Image
} from 'react-bootstrap';

import { getSchoolById } from '../../../services/superadmin/schoolService';
import UpdateFeaturePermissionsModal from '../super-admin/UpdateFeaturePermissionsModal'; //add 
import { all_routes } from "../../../router/all_routes"; // Adjust path as needed
interface SchoolDetails {
  id: string;
  name: string;
  adminName: string;
  email: string;
  phone: string;
  address: string;
  foundedYear: number | string;
  studentCount: number | string;
  teacherCount: number | string;
  departments: string[];
  recentAchievements: string[];
  logoUrl: string;
  userId: string;
}

const fetchSchoolDetails = async (schoolId: string): Promise<SchoolDetails> => {
  const response = await getSchoolById(schoolId);
  const schoolData = response.data?.school;

  return {
    id: schoolId || "No Data",
    name: schoolData?.schoolName || "No Data",
    adminName: schoolData?.user?.name || "No Data",
    email: schoolData?.user?.email || "No Data",
    phone: schoolData?.user?.phone || "No Data",
    address: schoolData?.user?.address || "No Data",
    foundedYear: schoolData?.createdAt ? new Date(schoolData.createdAt).getFullYear() : "No Data",
    studentCount: schoolData?.studentId ? schoolData.studentId.length : "No Data",
    teacherCount: schoolData?.teacherId ? schoolData.teacherId.length : "No Data",
    departments: schoolData?.departments || ["No Data"],
    recentAchievements: schoolData?.achievements || ["No Data"],
    logoUrl: schoolData?.user?.profilePic || "/api/placeholder/200/200",
    userId: schoolData?.userId,
  };
};

const SchoolProfilePage = () => {
  const { schoolId } = useParams<{ schoolId: string }>();
  const [schoolDetails, setSchoolDetails] = useState<SchoolDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const loadSchoolDetails = async () => {
      try {
        const details = await fetchSchoolDetails(schoolId || '');
        setSchoolDetails(details);
      } catch (error) {
        // Error fetching school details
      } finally {
        setLoading(false);
      }
    };

    loadSchoolDetails();
  }, [schoolId]);

  if (loading) {
    return (
      <Container className="d-flex justify-content-center align-items-center vh-100">
        <Spinner animation="border" variant="primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </Container>
    );
  }

  if (!schoolDetails) {
    return (
      <Container className="my-5">
        <Alert variant="danger">School not found</Alert>
        <Link to="/schools" className="btn btn-secondary mt-3">
          <i className="bi bi-arrow-left me-2"></i>Back to Schools
        </Link>
      </Container>
    );
  }

  return (
    <div className="page-wrapper">
      <Container fluid className="bg-light min-vh-100 d-flex flex-column pt-5">
        <Container className="d-flex flex-column justify-content-center min-vh-100">
          {/* Page Header */}
          <Row className="justify-content-center mb-4 mt-4">
            <Col md={8}>
              <Card className="shadow text-center">
                <Card.Body>
                  <Image
                    src={schoolDetails.logoUrl}
                    alt={`${schoolDetails.name} Logo`}
                    roundedCircle
                    className="border border-3 border-primary mb-3 mx-auto"
                    style={{ width: "120px", height: "120px", objectFit: "cover" }}
                  />
                  <Card.Title as="h1">{schoolDetails.name}</Card.Title>
                  <Card.Text className="text-muted">
                    <i className="bi bi-building me-2"></i>Educational Institution
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* School Details */}
          <Row className="justify-content-center g-4 mb-4">
            {/* Contact Information */}
            <Col md={5}>
              <Card className="h-100 shadow-sm">
                <Card.Header className="bg-primary text-white">
                  <Card.Title as="h5" className="mb-0">Contact Information</Card.Title>
                </Card.Header>
                <Card.Body>
                  <ListGroup variant="flush">
                    <ListGroup.Item>
                      <strong>Admin:</strong> {schoolDetails.adminName}
                    </ListGroup.Item>
                    <ListGroup.Item>
                      <strong>Email:</strong>{' '}
                      <a href={`mailto:${schoolDetails.email}`} className="text-decoration-none">
                        {schoolDetails.email}
                      </a>
                    </ListGroup.Item>
                    <ListGroup.Item>
                      <strong>Phone:</strong>{' '}
                      <a href={`tel:${schoolDetails.phone}`} className="text-decoration-none">
                        {schoolDetails.phone}
                      </a>
                    </ListGroup.Item>
                    <ListGroup.Item>
                      <strong>Address:</strong> {schoolDetails.address}
                    </ListGroup.Item>
                  </ListGroup>
                </Card.Body>
              </Card>
            </Col>

            {/* School Statistics */}
            <Col md={5}>
              <Card className="h-100 shadow-sm">
                <Card.Header className="bg-success text-white">
                  <Card.Title as="h5" className="mb-0">School Statistics</Card.Title>
                </Card.Header>
                <Card.Body>
                  <ListGroup variant="flush">
                    <ListGroup.Item className="d-flex justify-content-between align-items-center">
                      <span>Founded</span>
                      <Badge bg="primary" pill>{schoolDetails.foundedYear}</Badge>
                    </ListGroup.Item>
                    <ListGroup.Item className="d-flex justify-content-between align-items-center">
                      <span>Students</span>
                      <Badge bg="success" pill>{schoolDetails.studentCount}</Badge>
                    </ListGroup.Item>
                    <ListGroup.Item className="d-flex justify-content-between align-items-center">
                      <span>Teachers</span>
                      <Badge bg="info" pill>{schoolDetails.teacherCount}</Badge>
                    </ListGroup.Item>
                  </ListGroup>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* Achievements */}
          <Row className="justify-content-center mt-4 mb-4">
            <Col md={10}>
              <Card className="shadow-sm">
                <Card.Header className="bg-warning text-white">
                  <Card.Title as="h5" className="mb-0">Recent Achievements</Card.Title>
                </Card.Header>
                <Card.Body>
                  {schoolDetails.recentAchievements.length > 0 ? (
                    <Row className="justify-content-center g-3">
                      {schoolDetails.recentAchievements.map((achievement, index) => (
                        <Col key={index} md={8}>
                          <Alert variant="warning" className="mb-0 text-start">
                            <i className="bi bi-trophy me-2"></i>
                            {achievement}
                          </Alert>
                        </Col>
                      ))}
                    </Row>
                  ) : (
                    <p className="text-muted mb-0">No achievements to display</p>
                  )}
                </Card.Body>
              </Card>
            </Col>
          </Row>
          <div className="row justify-content-center mt-4 mb-5">
            <div className="col-md-8 text-center">
              <Link to={all_routes.getSchools} className="btn btn-secondary me-3 mb-2 mb-md-0">
                <i className="bi bi-arrow-left me-2"></i>Back to Schools
              </Link>
              <button
                className="btn btn-info me-3 mb-2 mb-md-0"
                data-bs-toggle="modal"
                data-bs-target="#modal-lg"
              >
                <i className="bi bi-shield-lock me-2"></i>Update Permissions
              </button>
              <button className="btn btn-primary mb-2 mb-md-0">
                <i className="bi bi-gear me-2"></i>Manage School
              </button>
            </div>
          </div>
        </Container>
      </Container>

      {/* Permissions Modal */}
      <UpdateFeaturePermissionsModal
        userId={schoolDetails.userId}

      />
    </div>
  );
};

export default SchoolProfilePage;