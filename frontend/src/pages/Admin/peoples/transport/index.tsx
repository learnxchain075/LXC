import React, { useState, ChangeEvent, FormEvent } from "react";
import { Form, Button, Container, Row, Col, Card } from "react-bootstrap";
import { ITransportForm } from "../../../../services/types/auth";
import { registerTransport } from "../../../../services/admin/transportRegister";
import { toast, ToastContainer } from "react-toastify";


const AddTransportForm: React.FC = () => {
  const[isLoading, setIsLoading] = useState(false);
  const initialFormState: ITransportForm = {
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    country: "",
    pincode: "",
    sex: "MALE",
    bloodType: "A+",
    schoolId: localStorage.getItem("schoolId") || "",
    profilePic: {} as File,
  };
  const [formData, setFormData] = useState<ITransportForm>(initialFormState);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData((prev) => ({
        ...prev,
        profilePic: e.target.files![0],
      }));
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      const res = await registerTransport(formData);
      toast.success("Transport user registered successfully!");
      setFormData(initialFormState);
      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);
      toast.error("Something went wrong while submitting.");
    }
  };

  return (
    <div className="page-wrapper">
    <ToastContainer position="top-right" autoClose={3000} />
    <Container className="mt-4">
      <Row className="justify-content-center">
        <Col md={8}>
          <Card className="p-4 shadow">
            <Card.Title className="text-center mb-4">Register Transport User</Card.Title>
            <Form onSubmit={handleSubmit}>
              <Row>
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Name</Form.Label>
                    <Form.Control name="name" value={formData.name} onChange={handleChange} required />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Email</Form.Label>
                    <Form.Control name="email" type="email" value={formData.email} onChange={handleChange} required />
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Phone</Form.Label>
                    <Form.Control name="phone" value={formData.phone} onChange={handleChange} required />
                  </Form.Group>
                </Col>
              </Row>

              <Form.Group>
                <Form.Label>Address</Form.Label>
                <Form.Control name="address" value={formData.address} onChange={handleChange} required />
              </Form.Group>

              <Row>
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>City</Form.Label>
                    <Form.Control name="city" value={formData.city} onChange={handleChange} required />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>State</Form.Label>
                    <Form.Control name="state" value={formData.state} onChange={handleChange} required />
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Country</Form.Label>
                    <Form.Control name="country" value={formData.country} onChange={handleChange} required />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Pincode</Form.Label>
                    <Form.Control name="pincode" value={formData.pincode} onChange={handleChange} required />
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Sex</Form.Label>
                    <Form.Select name="sex" value={formData.sex} onChange={handleChange} required>
                      <option value="MALE">MALE</option>
                      <option value="FEMALE">FEMALE</option>
                      <option value="OTHERS">OTHERS</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Blood Type</Form.Label>
                    <Form.Select name="bloodType" value={formData.bloodType} onChange={handleChange} required>
                      <option value="A+">A+</option>
                      <option value="B+">B+</option>
                      <option value="O+">O+</option>
                      <option value="AB+">AB+</option>
                      <option value="A-">A-</option>
                      <option value="B-">B-</option>
                      <option value="O-">O-</option>
                      <option value="AB-">AB-</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>

              <Form.Group className="mt-3">
                <Form.Label>Profile Picture</Form.Label>
                <Form.Control type="file" accept="image/*" onChange={handleFileChange} required />
              </Form.Group>

              <Button type="submit" className="w-100 mt-4" variant="primary">
                {isLoading ? "Submitting..." : "Submit"}
              </Button>
            </Form>
          </Card>
        </Col>
      </Row>
    </Container>
    </div>
  );
};

export default AddTransportForm;

