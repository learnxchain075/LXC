import React, { useState, ChangeEvent, FormEvent } from "react";
import { Form, Button, Container, Row, Col, Card } from "react-bootstrap";
import { ITransportForm } from "../../../../services/types/auth";
import { registerTransport } from "../../../../services/admin/transportRegister";
import { toast, ToastContainer } from "react-toastify";
import CustomLoader from "../../../../components/Loader";
import { registerTransportSchema } from "../../../../validation/transport";


const AddTransportForm: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
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

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData((prev) => ({
        ...prev,
        profilePic: e.target.files![0],
      }));
      setErrors((prev) => ({ ...prev, profilePic: "" }));
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (isLoading) return;

    setIsLoading(true);

    const parsed = registerTransportSchema.safeParse(formData);
    if (!parsed.success) {
      const fieldErrors: Record<string, string> = {};
      for (const key in parsed.error.flatten().fieldErrors) {
        const err = parsed.error.flatten().fieldErrors[key];
        if (err && err.length) fieldErrors[key] = err[0];
      }
      setErrors(fieldErrors);
      Object.values(fieldErrors).forEach((error) => toast.error(error));
      setIsLoading(false);
      return;
    }

    if (!formData.profilePic) {
      toast.error("Profile picture is required.");
      setIsLoading(false);
      return;
    }

    try {
      await registerTransport(formData);
      toast.success("Transport user registered successfully!");
      setFormData(initialFormState);
      setErrors({});
    } catch (err: any) {
      if (err.response?.data?.errors) {
        const fieldErrors: Record<string, string> = {};
        Object.entries(err.response.data.errors).forEach(([k, v]) => {
          if (Array.isArray(v) && v.length) fieldErrors[k] = v[0] as string;
        });
        setErrors(fieldErrors);
        Object.values(fieldErrors).forEach((error) => toast.error(error));
      } else if (err.response?.data?.message) {
        toast.error(err.response.data.message);
      } else {
        toast.error("Something went wrong while submitting.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="page-wrapper position-relative">
    {isLoading && <CustomLoader variant="dots" color="#3067e3" size={80} />}
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
                    <Form.Control name="name" value={formData.name} onChange={handleChange} />
                    {errors.name && <span className="text-danger">{errors.name}</span>}
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Email</Form.Label>
                    <Form.Control name="email" type="email" value={formData.email} onChange={handleChange} />
                    {errors.email && <span className="text-danger">{errors.email}</span>}
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Phone</Form.Label>
                    <Form.Control name="phone" value={formData.phone} onChange={handleChange} />
                    {errors.phone && <span className="text-danger">{errors.phone}</span>}
                  </Form.Group>
                </Col>
              </Row>

              <Form.Group>
                <Form.Label>Address</Form.Label>
                <Form.Control name="address" value={formData.address} onChange={handleChange} />
                {errors.address && <span className="text-danger">{errors.address}</span>}
              </Form.Group>

              <Row>
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>City</Form.Label>
                    <Form.Control name="city" value={formData.city} onChange={handleChange} />
                    {errors.city && <span className="text-danger">{errors.city}</span>}
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>State</Form.Label>
                    <Form.Control name="state" value={formData.state} onChange={handleChange} />
                    {errors.state && <span className="text-danger">{errors.state}</span>}
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Country</Form.Label>
                    <Form.Control name="country" value={formData.country} onChange={handleChange} />
                    {errors.country && <span className="text-danger">{errors.country}</span>}
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Pincode</Form.Label>
                    <Form.Control name="pincode" value={formData.pincode} onChange={handleChange} />
                    {errors.pincode && <span className="text-danger">{errors.pincode}</span>}
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Sex</Form.Label>
                    <Form.Select name="sex" value={formData.sex} onChange={handleChange}>
                      <option value="MALE">MALE</option>
                      <option value="FEMALE">FEMALE</option>
                      <option value="OTHERS">OTHERS</option>
                    </Form.Select>
                    {errors.sex && <span className="text-danger">{errors.sex}</span>}
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Blood Type</Form.Label>
                    <Form.Select name="bloodType" value={formData.bloodType} onChange={handleChange}>
                      <option value="A+">A+</option>
                      <option value="B+">B+</option>
                      <option value="O+">O+</option>
                      <option value="AB+">AB+</option>
                      <option value="A-">A-</option>
                      <option value="B-">B-</option>
                      <option value="O-">O-</option>
                      <option value="AB-">AB-</option>
                    </Form.Select>
                    {errors.bloodType && <span className="text-danger">{errors.bloodType}</span>}
                  </Form.Group>
                </Col>
              </Row>

              <Form.Group className="mt-3">
                <Form.Label>Profile Picture</Form.Label>
                <Form.Control type="file" accept="image/*" onChange={handleFileChange} />
                {errors.profilePic && (
                  <span className="text-danger">{errors.profilePic}</span>
                )}
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

