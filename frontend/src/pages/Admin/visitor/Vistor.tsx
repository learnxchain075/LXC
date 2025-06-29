import React, { useState } from "react";
import {
    Form,
    Button,
    Container,
    Row,
    Col,
    Spinner,
    Card,
} from "react-bootstrap";
import { IVisitorForm } from "../../../services/types/admin/vistior/vistiorService";
import { createVisitor, verifyEntry, verifyExit } from "../../../services/admin/visitorApi";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import QRReader from "react-qr-reader";

const VisitorForm: React.FC = () => {
    const [formData, setFormData] = useState<IVisitorForm>({
        name: "",
        phone: "",
        email: "",
        purpose: "",
        validFrom: new Date(),
        validUntil: new Date(),
        schoolId: localStorage.getItem("schoolId") || "",
    });

    const [loading, setLoading] = useState(false);
    const [tokenInput, setTokenInput] = useState("");
    const [qrCodeData, setQrCodeData] = useState<string | null>(null); // QR code state
    const [isScanning, setIsScanning] = useState(false); // To track QR scanner status

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;

        if (name === "validFrom" || name === "validUntil") {
            setFormData({ ...formData, [name]: new Date(value) });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.schoolId) {
            toast.error("School ID not found in local storage.");
            return;
        }

        try {
            setLoading(true);
            const toastId = toast.loading("Creating visitor...");
            const response = await createVisitor(formData);

            toast.update(toastId, {
                render: "Visitor created successfully!",
                type: "success",
                isLoading: false,
                autoClose: 3000,
                closeOnClick: true,
            });

            // Set QR code data from response
            setQrCodeData(response.data.qrCodeData);

            // Clear form data
            setFormData({
                name: "",
                phone: "",
                email: "",
                purpose: "",
                validFrom: new Date(),
                validUntil: new Date(),
                schoolId: formData.schoolId,
            });
        } catch (err) {
            toast.dismiss();
            toast.error("Failed to create visitor.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleTokenChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTokenInput(e.target.value);
    };

    const handleVerifyEntry = async () => {
        if (!tokenInput) return toast.error("Please enter a token.");
        try {
            const toastId = toast.loading("Verifying entry...");
            const res = await verifyEntry(tokenInput);
            toast.update(toastId, {
                render: res.data.message || "Entry verified successfully!",
                type: "success",
                isLoading: false,
                autoClose: 3000,
            });
        } catch (error) {
            toast.error("Failed to verify entry.");
        }
    };

    const handleVerifyExit = async () => {
        if (!tokenInput) return toast.error("Please enter a token.");
        try {
            const toastId = toast.loading("Verifying exit...");
            const res = await verifyExit(tokenInput);
            toast.update(toastId, {
                render: res.data.message || "Exit verified successfully!",
                type: "success",
                isLoading: false,
                autoClose: 3000,
            });
        } catch (error) {
            toast.error("Failed to verify exit.");
        }
    };

    // QR Code Scanner logic
    const handleScan = (data: string | null) => {
        if (data) {
            setTokenInput(data);
            setIsScanning(false);
            toast.success("Token scanned successfully!");
        }
    };

    const handleError = (error: any) => {
        toast.error("Error scanning QR code!");
    };

    return (
        <div className="page-wrapper">
        <div className="d-flex justify-content-center align-items-center min-vh-100 bg-light">
            <Container>
                <Row className="justify-content-md-center">
                    <Col md={10} lg={8}>
                        <Card className="p-4 shadow-lg border-0 rounded-4 bg-white mb-4">
                            <h3 className="text-center mb-4">📝 Visitor Registration</h3>
                            <Form onSubmit={handleSubmit}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Name</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="name"
                                        placeholder="Enter visitor's name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                    />
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label>Phone</Form.Label>
                                    <Form.Control
                                        type="tel"
                                        name="phone"
                                        placeholder="Enter phone number"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        required
                                    />
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label>Email (optional)</Form.Label>
                                    <Form.Control
                                        type="email"
                                        name="email"
                                        placeholder="Enter email"
                                        value={formData.email}
                                        onChange={handleChange}
                                    />
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label>Purpose</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="purpose"
                                        placeholder="Reason for visit"
                                        value={formData.purpose}
                                        onChange={handleChange}
                                        required
                                    />
                                </Form.Group>

                                <Row>
                                    <Col>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Valid From</Form.Label>
                                            <Form.Control
                                                type="datetime-local"
                                                name="validFrom"
                                                value={new Date(formData.validFrom).toISOString().slice(0, 16)}
                                                onChange={handleChange}
                                                required
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Valid Until</Form.Label>
                                            <Form.Control
                                                type="datetime-local"
                                                name="validUntil"
                                                value={new Date(formData.validUntil).toISOString().slice(0, 16)}
                                                onChange={handleChange}
                                                required
                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>

                                <div className="d-grid mt-4">
                                    <Button variant="primary" type="submit" disabled={loading} size="lg" className="rounded-pill">
                                        {loading ? (
                                            <>
                                                <Spinner animation="border" size="sm" /> Submitting...
                                            </>
                                        ) : (
                                            "Submit Visitor"
                                        )}
                                    </Button>
                                </div>
                            </Form>
                        </Card>

                        {/* QR Code Display after successful visitor creation */}
                        {qrCodeData && (
                            <Card className="p-4 shadow-sm border-0 bg-white rounded-4 mt-4">
                                <h5 className="text-center mb-3">🔑 Visitor QR Code</h5>
                                <div className="text-center">
                                    <img src={qrCodeData} alt="Visitor QR Code" style={{ maxWidth: "100%", maxHeight: "200px" }} />
                                </div>
                            </Card>
                        )}

                        {/* Entry/Exit Verification Section */}
                        {/* <Card className="p-4 shadow-sm border-0 bg-white rounded-4 mt-4">
                            <h5 className="mb-3 text-center">🔐 Entry / Exit Verification</h5>
                            <Form.Group className="mb-3">
                                <Form.Label>Visitor Token</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Paste or scan token"
                                    value={tokenInput}
                                    onChange={handleTokenChange}
                                />
                            </Form.Group>

                            <div className="d-flex gap-3 justify-content-center">
                                <Button variant="success" onClick={handleVerifyEntry}>
                                    ✅ Verify Entry
                                </Button>
                                <Button variant="danger" onClick={handleVerifyExit}>
                                    🚪 Verify Exit
                                </Button>
                            </div>

                            QR Scanner Section
                            <div className="mt-4 text-center">
                                <Button
                                    variant="info"
                                    onClick={() => setIsScanning(!isScanning)}
                                    className="mb-3"
                                >
                                    {isScanning ? "Stop Scanning" : "Start Scanning QR Code"}
                                </Button>
                                {isScanning && (
                                    <QRReader
                                        delay={300}
                                        style={{ width: "100%" }}
                                        onError={handleError}
                                        onScan={handleScan}
                                    />
                                )}
                            </div>
                        </Card> */}
                    </Col>
                </Row>
                <ToastContainer
                    position="top-center"
                    autoClose={3000}
                    hideProgressBar={false}
                    newestOnTop={true}
                    closeOnClick
                    rtl={false}
                    pauseOnFocusLoss
                    draggable
                    pauseOnHover
                    theme="colored"
                />
            </Container>
        </div>
        </div>
    );
};

export default VisitorForm;
