

// import React, { useState, ChangeEvent, FormEvent } from 'react';
// import { Form, Button, Container, Row, Col, Card } from 'react-bootstrap';


// const AddLibraryForm: React.FC = () => {
//   const [libraryData, setLibraryData] = useState<LibraryData>({
//     libraryName: '',
//     address: '',
//     contactNumber: '',
//     email: '',
//     totalBooks: 0,
//     availableBooks: 0,
//     librarianName: '',
//     openingHours: '',
//     closingHours: '',
//     photo: null,
//   });

//   const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
//     setLibraryData({ ...libraryData, [e.target.name]: e.target.value });
//   };

//   const handlePhotoChange = (e: ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files) {
//       setLibraryData({ ...libraryData, photo: e.target.files[0] });
//     }
//   };

//   const handleSubmit = (e: FormEvent) => {
//     e.preventDefault();
//     console.log('Library Data:', libraryData);
//     // Send data to backend here.
//     setLibraryData({
//       libraryName: '',
//       address: '',
//       contactNumber: '',
//       email: '',
//       totalBooks: 0,
//       availableBooks: 0,
//       librarianName: '',
//       openingHours: '',
//       closingHours: '',
//       photo: null,
//     });
//   };

//   return (
//     <Container fluid className="mt-0 bg-light py-4 vh-100">
//       <Row className="justify-content-center h-100 align-items-center">
//         <Col xs={12} md={8} lg={6}>
//           <Card className="shadow">
//             <Card.Body>
//               <h2 className="text-center mb-4 text-dark font-weight-bold">Add Library</h2>
//               <Form onSubmit={handleSubmit}>
//                 <Form.Group controlId="libraryName">
//                   <Form.Label>Library Name</Form.Label>
//                   <Form.Control type="text" name="libraryName" value={libraryData.libraryName} onChange={handleChange} required />
//                 </Form.Group>
//                 <Form.Group controlId="address">
//                   <Form.Label>Address</Form.Label>
//                   <Form.Control type="text" name="address" value={libraryData.address} onChange={handleChange} required />
//                 </Form.Group>
//                 <Form.Group controlId="contactNumber">
//                   <Form.Label>Contact Number</Form.Label>
//                   <Form.Control type="tel" name="contactNumber" value={libraryData.contactNumber} onChange={handleChange} required />
//                 </Form.Group>
//                 <Form.Group controlId="email">
//                   <Form.Label>Email</Form.Label>
//                   <Form.Control type="email" name="email" value={libraryData.email} onChange={handleChange} required />
//                 </Form.Group>
//                 <Row>
//                   <Col md={6}>
//                     <Form.Group controlId="totalBooks">
//                       <Form.Label>Total Books</Form.Label>
//                       <Form.Control type="number" name="totalBooks" value={libraryData.totalBooks} onChange={handleChange} />
//                     </Form.Group>
//                   </Col>
//                   <Col md={6}>
//                     <Form.Group controlId="availableBooks">
//                       <Form.Label>Available Books</Form.Label>
//                       <Form.Control type="number" name="availableBooks" value={libraryData.availableBooks} onChange={handleChange} />
//                     </Form.Group>
//                   </Col>
//                 </Row>
//                 <Form.Group controlId="librarianName">
//                   <Form.Label>Librarian Name</Form.Label>
//                   <Form.Control type="text" name="librarianName" value={libraryData.librarianName} onChange={handleChange} required />
//                 </Form.Group>
//                 <Row>
//                   <Col md={6}>
//                     <Form.Group controlId="openingHours">
//                       <Form.Label>Opening Hours</Form.Label>
//                       <Form.Control type="time" name="openingHours" value={libraryData.openingHours} onChange={handleChange} />
//                     </Form.Group>
//                   </Col>
//                   <Col md={6}>
//                     <Form.Group controlId="closingHours">
//                       <Form.Label>Closing Hours</Form.Label>
//                       <Form.Control type="time" name="closingHours" value={libraryData.closingHours} onChange={handleChange} />
//                     </Form.Group>
//                   </Col>
//                 </Row>
//                 <Form.Group controlId="photo">
//                   <Form.Label>Library Photo</Form.Label>
//                   <Form.Control type="file" accept="image/*" onChange={handlePhotoChange} />
//                 </Form.Group>
//                 <Button variant="primary" type="submit" className="w-100">Submit</Button>
//               </Form>
//             </Card.Body>
//           </Card>
//         </Col>
//       </Row>
//     </Container>
//   );
// };

// export default AddLibraryForm;

import React, { useState, ChangeEvent, FormEvent } from 'react';
import { Form, Button, Container, Row, Col, Card } from 'react-bootstrap';
import { IlibraryForm } from '../../../../services/types/auth';
import { registerLibrary } from '../../../../services/admin/libraryRegister';


const AddLibraryForm: React.FC = () => {
  const [libraryData, setLibraryData] = useState<IlibraryForm>({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    country: '',
    pincode: '',
    profilePic: undefined as unknown as File,
    schoolId: localStorage.getItem('schoolId') || '',
    sex: '',
    bloodType: '',
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setLibraryData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setLibraryData((prev) => ({ ...prev, profilePic: e.target.files![0] }));
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    
    try {
      console.log("object",libraryData);
     const res= await registerLibrary(libraryData);
      console.log(res.data);
      alert('Library Registered!');
    } catch (error) {
      console.error(error);
      alert('Error registering library.');
    }
  };

  return (
    <Container fluid className="mt-1 bg-light py-4 vh-100">
        <Row className="justify-content-center h-100 align-items-center">
          <Col xs={12} md={8} lg={6}>
            <Card className="shadow">
              <Card.Body>
              <h3 className="text-center">Register Library</h3>
              <Form onSubmit={handleSubmit}>
                <Form.Group>
                  <Form.Label>Name</Form.Label>
                  <Form.Control name="name" value={libraryData.name} onChange={handleChange} required />
                </Form.Group>
                <Form.Group>
                  <Form.Label>Email</Form.Label>
                  <Form.Control type="email" name="email" value={libraryData.email} onChange={handleChange} required />
                </Form.Group>
                <Form.Group>
                  <Form.Label>Phone</Form.Label>
                  <Form.Control name="phone" value={libraryData.phone} onChange={handleChange} required />
                </Form.Group>
                <Form.Group>
                  <Form.Label>Address</Form.Label>
                  <Form.Control name="address" value={libraryData.address} onChange={handleChange} required />
                </Form.Group>
                <Row>
                  <Col>
                    <Form.Group>
                      <Form.Label>City</Form.Label>
                      <Form.Control name="city" value={libraryData.city} onChange={handleChange} required />
                    </Form.Group>
                  </Col>
                  <Col>
                    <Form.Group>
                      <Form.Label>State</Form.Label>
                      <Form.Control name="state" value={libraryData.state} onChange={handleChange} required />
                    </Form.Group>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <Form.Group>
                      <Form.Label>Country</Form.Label>
                      <Form.Control name="country" value={libraryData.country} onChange={handleChange} required />
                    </Form.Group>
                  </Col>
                  <Col>
                    <Form.Group>
                      <Form.Label>Pincode</Form.Label>
                      <Form.Control name="pincode" value={libraryData.pincode} onChange={handleChange} required />
                    </Form.Group>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <Form.Group>
                      <Form.Label>Sex</Form.Label>
                      <Form.Control name="sex" value={libraryData.sex} onChange={handleChange} required />
                    </Form.Group>
                  </Col>
                  <Col>
                    <Form.Group>
                      <Form.Label>Blood Type</Form.Label>
                      <Form.Control name="bloodType" value={libraryData.bloodType} onChange={handleChange} required />
                    </Form.Group>
                  </Col>
                </Row>
                {/* <Form.Group>
                  <Form.Label>School ID</Form.Label>
                  <Form.Control name="schoolId" value={libraryData.schoolId} onChange={handleChange} required />
                </Form.Group> */}
                <Form.Group>
                  <Form.Label>Profile Picture</Form.Label>
                  <Form.Control type="file" accept="image/*" onChange={handleFileChange} />
                </Form.Group>
                <Button className="mt-3 w-100" type="submit">Submit</Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default AddLibraryForm;
