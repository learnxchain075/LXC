
// import React, { useState, ChangeEvent, FormEvent } from 'react';
// import { Form, Button, Container, Row, Col, Card, Navbar, FormControl, InputGroup } from 'react-bootstrap';

// interface HostelData {
//   hostelName: string;
//   hostelType: 'Boys' | 'Girls' | 'Mixed';
//   address: string;
//   capacity: number;
//   totalRooms: number;
//   roomType: 'Single' | 'Double' | 'Triple';
//   wardenName: string;
//   contactNumber: string;
//   email: string;
//   amenities: string;
//   registrationFee: number;
//   monthlyFee: number;
//   availableRooms: number;
//   photo: File | null;
// }

// const AddHostelForm: React.FC = () => {
//   const [hostelData, setHostelData] = useState<HostelData>({
//     hostelName: '',
//     hostelType: 'Boys',
//     address: '',
//     capacity: 0,
//     totalRooms: 0,
//     roomType: 'Single',
//     wardenName: '',
//     contactNumber: '',
//     email: '',
//     amenities: '',
//     registrationFee: 0,
//     monthlyFee: 0,
//     availableRooms: 0,
//     photo: null,
//   });

//   const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
//     setHostelData({ ...hostelData, [e.target.name]: e.target.value });
//   };

//   const handlePhotoChange = (e: ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files) {
//       setHostelData({ ...hostelData, photo: e.target.files[0] });
//     }
//   };

//   const handleSubmit = (e: FormEvent) => {
//     e.preventDefault();
//     console.log('Hostel Data:', hostelData);
//     // Send data to backend here.
//     setHostelData({
//       hostelName: '',
//       hostelType: 'Boys',
//       address: '',
//       capacity: 0,
//       totalRooms: 0,
//       roomType: 'Single',
//       wardenName: '',
//       contactNumber: '',
//       email: '',
//       amenities: '',
//       registrationFee: 0,
//       monthlyFee: 0,
//       availableRooms: 0,
//       photo: null,
//     });
//   };

//   return (
//     <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
//       {/* Fixed Search Bar (Bootstrap Navbar) */}
//       <Navbar bg="light" expand="lg" className="mb-2">
//         <Container fluid>
//           <Navbar.Brand>Add Hostel</Navbar.Brand>
//           <Navbar.Toggle aria-controls="navbarScroll" />
//           <Navbar.Collapse id="navbarScroll">
//             <InputGroup className="ms-auto" style={{ width: '300px' }}>
//               <FormControl
//                 placeholder="Search..."
//                 aria-label="Search"
//                 aria-describedby="basic-addon2"
//               />
//               <Button variant="outline-success">Search</Button>
//             </InputGroup>
//           </Navbar.Collapse>
//         </Container>
//       </Navbar>

//       {/* Main Content (Add Hostel Form) */}
//       <Container fluid className="bg-light py-4" style={{ flex: 1, overflowY: 'auto' }}>
//         <Row className="justify-content-center">
//           <Col xs={12} md={8} lg={6}>
//             <Card className="shadow">
//               <Card.Body>
//                 <h2 className="text-center mb-4 text-dark font-weight-bold">Add Hostel</h2>
//                 <Form onSubmit={handleSubmit}>
//                   {/* Form fields */}
//                   <Form.Group controlId="hostelName">
//                     <Form.Label>Hostel Name</Form.Label>
//                     <Form.Control type="text" name="hostelName" value={hostelData.hostelName} onChange={handleChange} required />
//                   </Form.Group>
//                   <Form.Group controlId="hostelType">
//                     <Form.Label>Hostel Type</Form.Label>
//                     <Form.Control as="select" name="hostelType" value={hostelData.hostelType} onChange={handleChange} required>
//                       <option>Boys</option>
//                       <option>Girls</option>
//                       <option>Mixed</option>
//                     </Form.Control>
//                   </Form.Group>
//                   <Form.Group controlId="address">
//                     <Form.Label>Address</Form.Label>
//                     <Form.Control type="text" name="address" value={hostelData.address} onChange={handleChange} required />
//                   </Form.Group>
//                   <Row>
//                     <Col md={6}>
//                       <Form.Group controlId="capacity">
//                         <Form.Label>Capacity</Form.Label>
//                         <Form.Control type="number" name="capacity" value={hostelData.capacity} onChange={handleChange} required />
//                       </Form.Group>
//                     </Col>
//                     <Col md={6}>
//                       <Form.Group controlId="totalRooms">
//                         <Form.Label>Total Rooms</Form.Label>
//                         <Form.Control type="number" name="totalRooms" value={hostelData.totalRooms} onChange={handleChange} required />
//                       </Form.Group>
//                     </Col>
//                   </Row>
//                   <Form.Group controlId="roomType">
//                     <Form.Label>Room Type</Form.Label>
//                     <Form.Control as="select" name="roomType" value={hostelData.roomType} onChange={handleChange} required>
//                       <option>Single</option>
//                       <option>Double</option>
//                       <option>Triple</option>
//                     </Form.Control>
//                   </Form.Group>
//                   <Form.Group controlId="wardenName">
//                     <Form.Label>Warden Name</Form.Label>
//                     <Form.Control type="text" name="wardenName" value={hostelData.wardenName} onChange={handleChange} required />
//                   </Form.Group>
//                   <Form.Group controlId="contactNumber">
//                     <Form.Label>Contact Number</Form.Label>
//                     <Form.Control type="tel" name="contactNumber" value={hostelData.contactNumber} onChange={handleChange} required />
//                   </Form.Group>
//                   <Form.Group controlId="email">
//                     <Form.Label>Email</Form.Label>
//                     <Form.Control type="email" name="email" value={hostelData.email} onChange={handleChange} required />
//                   </Form.Group>
//                   <Form.Group controlId="amenities">
//                     <Form.Label>Amenities</Form.Label>
//                     <Form.Control as="textarea" name="amenities" value={hostelData.amenities} onChange={handleChange} />
//                   </Form.Group>
//                   <Row>
//                     <Col md={6}>
//                       <Form.Group controlId="registrationFee">
//                         <Form.Label>Registration Fee</Form.Label>
//                         <Form.Control type="number" name="registrationFee" value={hostelData.registrationFee} onChange={handleChange} />
//                       </Form.Group>
//                     </Col>
//                     <Col md={6}>
//                       <Form.Group controlId="monthlyFee">
//                         <Form.Label>Monthly Fee</Form.Label>
//                         <Form.Control type="number" name="monthlyFee" value={hostelData.monthlyFee} onChange={handleChange} />
//                       </Form.Group>
//                     </Col>
//                   </Row>
//                   <Form.Group controlId="availableRooms">
//                     <Form.Label>Available Rooms</Form.Label>
//                     <Form.Control type="number" name="availableRooms" value={hostelData.availableRooms} onChange={handleChange} />
//                   </Form.Group>
//                   <Form.Group controlId="photo">
//                     <Form.Label>Hostel Photo</Form.Label>
//                     <Form.Control type="file" accept="image/*" onChange={handlePhotoChange} />
//                   </Form.Group>
//                   <Button variant="primary" type="submit" className="w-100">Submit</Button>
//                 </Form>
//               </Card.Body>
//             </Card>
//           </Col>
//         </Row>
//       </Container>
//     </div>
//   );
// };

// export default AddHostelForm;

import React, { useState, ChangeEvent, FormEvent } from 'react';
import { Form, Button, Container, Row, Col, Card, Navbar, FormControl, InputGroup } from 'react-bootstrap';

import { registerHostel } from '../../../../services/admin/hostelRegister';
import { IhostelForm } from '../../../../services/types/auth';


const AddHostelForm: React.FC = () => {
  const [hostelData, setHostelData] = useState<IhostelForm>({
    name: '',
    email: '',
    phone: '',
    // password: '',
    address: '',
    city: '',
    state: '',
    country: '',
    pincode: '',
    sex: 'Female', // Default value
    bloodType: 'AB+', // Default value
    schoolId:  localStorage.getItem('schoolId') || "",
    profilePic: null,
    hostelName:"",
    capacity:"",
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setHostelData(prev => ({ ...prev, [name]: value }));
  };

  const handlePhotoChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setHostelData(prev => ({ ...prev, profilePic: e.target.files[0] }));
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      console.log('Hostel Data:', hostelData);
     const res=await registerHostel(hostelData);
     console.log("object",res);
      setHostelData({
        name: '',
        email: '',
        phone: '',
        // password: '',
        address: '',
        city: '',
        state: '',
        country: '',
        pincode: '',
        sex: 'Female',
        bloodType: 'AB+',
        schoolId:  "",
        profilePic: null,
        hostelName:"",
    capacity:"",
      });
    } catch (error) {
      console.error('Error submitting hostel data:', error);
      // Handle error (e.g., show alert or set error state)
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      {/* Fixed Search Bar (Bootstrap Navbar) */}
      <Navbar bg="light" expand="lg" className="mb-2">
        <Container fluid>
          <Navbar.Brand>Add Hostel</Navbar.Brand>
          <Navbar.Toggle aria-controls="navbarScroll" />
          <Navbar.Collapse id="navbarScroll">
            <InputGroup className="ms-auto" style={{ width: '300px' }}>
              <FormControl
                placeholder="Search..."
                aria-label="Search"
                aria-describedby="basic-addon2"
              />
              <Button variant="outline-success">Search</Button>
            </InputGroup>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* Main Content (Add Hostel Form) */}
      <Container fluid className="bg-light py-4" style={{ flex: 1, overflowY: 'auto' }}>
        <Row className="justify-content-center">
          <Col xs={12} md={8} lg={6}>
            <Card className="shadow">
              <Card.Body>
                <h2 className="text-center mb-4 text-dark font-weight-bold">Add Hostel</h2>
                <Form onSubmit={handleSubmit}>
                  {/* Form fields */}
                  <Form.Group controlId="name">
                    <Form.Label>Name</Form.Label>
                    <Form.Control type="text" name="name" value={hostelData.name} onChange={handleChange} required />
                  </Form.Group>
                  <Form.Group controlId="hostelName">
                    <Form.Label>Hostel Name</Form.Label>
                    <Form.Control type="text" name="hostelName" value={hostelData.hostelName} onChange={handleChange} required />
                  </Form.Group>
                  <Form.Group controlId="capacity">
                    <Form.Label>capacity</Form.Label>
                    <Form.Control type="text" name="capacity" value={hostelData.capacity} onChange={handleChange} required />
                  </Form.Group>
                  <Form.Group controlId="email">
                    <Form.Label>Email</Form.Label>
                    <Form.Control type="email" name="email" value={hostelData.email} onChange={handleChange} required />
                  </Form.Group>
                  <Form.Group controlId="phone">
                    <Form.Label>Contact Number</Form.Label>
                    <Form.Control type="tel" name="phone" value={hostelData.phone} onChange={handleChange} required />
                  </Form.Group>
                  {/* <Form.Group controlId="password">
                    <Form.Label>Password</Form.Label>
                    <Form.Control type="password" name="password" value={hostelData.password} onChange={handleChange} required />
                  </Form.Group> */}
                  <Form.Group controlId="address">
                    <Form.Label>Address</Form.Label>
                    <Form.Control type="text" name="address" value={hostelData.address} onChange={handleChange} required />
                  </Form.Group>
                  <Row>
                    <Col md={6}>
                      <Form.Group controlId="city">
                        <Form.Label>City</Form.Label>
                        <Form.Control type="text" name="city" value={hostelData.city} onChange={handleChange} required />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group controlId="state">
                        <Form.Label>State</Form.Label>
                        <Form.Control type="text" name="state" value={hostelData.state} onChange={handleChange} required />
                      </Form.Group>
                    </Col>
                  </Row>
                  <Row>
                    <Col md={6}>
                      <Form.Group controlId="country">
                        <Form.Label>Country</Form.Label>
                        <Form.Control type="text" name="country" value={hostelData.country} onChange={handleChange} required />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group controlId="pincode">
                        <Form.Label>Pincode</Form.Label>
                        <Form.Control type="text" name="pincode" value={hostelData.pincode} onChange={handleChange} required />
                      </Form.Group>
                    </Col>
                  </Row>
                  <Form.Group controlId="sex">
                    <Form.Label>Sex</Form.Label>
                    <Form.Control as="select" name="sex" value={hostelData.sex} onChange={handleChange} required>
                      <option value="FEMALE">Female</option>
                      <option value="MALE">Male</option>
                      {/* <option value="Other">Other</option> */}
                    </Form.Control>
                  </Form.Group>
                  <Form.Group controlId="bloodType">
                    <Form.Label>Blood Type</Form.Label>
                    <Form.Control as="select" name="bloodType" value={hostelData.bloodType} onChange={handleChange} required>
                      <option value="A+">A+</option>
                      <option value="A-">A-</option>
                      <option value="B+">B+</option>
                      <option value="B-">B-</option>
                      <option value="O+">O+</option>
                      <option value="O-">O-</option>
                      <option value="AB+">AB+</option>
                      <option value="AB-">AB-</option>
                    </Form.Control>
                  </Form.Group>
                  {/* <Form.Group controlId="schoolId">
                    <Form.Label>School ID</Form.Label>
                    <Form.Control type="text" name="schoolId" value={hostelData.schoolId} onChange={handleChange} required />
                  </Form.Group> */}
                  <Form.Group controlId="profilePic">
                    <Form.Label>Hostel Photo</Form.Label>
                    <Form.Control type="file" accept="image/*" onChange={handlePhotoChange} />
                  </Form.Group>
                  <Button variant="primary" type="submit" className="w-100 mt-4">
                    Submit
                  </Button>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default AddHostelForm;