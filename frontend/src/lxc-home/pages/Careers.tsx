import { Container, Row, Col, Card, Button, Image } from "react-bootstrap";
import "./careers.css"
import Header from "../Sections/Header/Header";
import Footer from "../Sections/Footer/FooterOne";
import { Link } from "react-router-dom";
const Careers = () => {
    const jobs = [
        {
            title: "Frontend Developer (React)",
            location: "Remote / Bengaluru",
            type: "Full-Time",
            description:
                "Build sleek user experiences for Tier 2/3 schools using modern UI frameworks. Experience with React, Tailwind, and Web APIs preferred.",
            icon: "https://cdn-icons-png.flaticon.com/512/1183/1183672.png",
        },
        {
            title: "Flutter Developer",
            location: "Remote / Pune",
            type: "Full-Time",
            description:
                "Help us develop offline-first mobile apps for Android/iOS. Experience in Dart, Flutter, and clean architecture is essential.",
            icon: "https://cdn-icons-png.flaticon.com/512/1183/1183672.png",
        },
        {
            title: "Sales Executive – EdTech",
            location: "Delhi NCR / Tier 2 cities",
            type: "Full-Time",
            description:
                "Drive our growth in schools by building relationships and providing demos. Prior experience in edtech sales is a bonus.",
            icon: "https://cdn-icons-png.flaticon.com/512/2920/2920349.png",
        },
    ];

    const perks = [
        {
            title: "Remote Flexibility",
            description: "Work from anywhere, build for everyone.",
            icon: "https://cdn-icons-png.flaticon.com/512/4205/4205306.png",
        },
        {
            title: "Real-World Impact",
            description: "Change lives in Tier 2/3 schools with every feature you build.",
            icon: "https://cdn-icons-png.flaticon.com/512/3135/3135773.png",
        },
        {
            title: "Continuous Learning",
            description: "Attend masterclasses, AI sessions & mentorship workshops.",
            icon: "https://cdn-icons-png.flaticon.com/512/190/190411.png",
        },
        {
            title: "Flexible Hours",
            description: "Balance your work and personal life with flexible schedules.",
            icon: "https://cdn-icons-png.flaticon.com/512/2920/2920349.png",
        },
        {
            title: "Health Benefits",
            description: "Comprehensive health insurance for you and your family.",
            icon: "https://cdn-icons-png.flaticon.com/512/2920/2920349.png",
        },
    ];

    return (

        <>
            <Header variant={"main-header"} />
            <div className="careers-page bg-light py-5 mt-5">
                <Container>
                    {/* Hero Section */}
                    <div
                        className="hero-section position-relative mb-5 rounded-3 shadow-lg "
                        style={{
                            backgroundImage: 'url(https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1920&q=80)',
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            height: '400px',
                        }}
                    >
                        <div
                            className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
                            style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
                        >
                            <div className="text-white text-center px-3">
                                <h1 className="display-4 fw-bold text-white">Shape the Future of Education with Us</h1>
                                <p className="lead">Join our mission to revolutionize education for underserved schools.</p>
                            </div>
                        </div>
                    </div>

                    {/* Job Openings */}
                    <Row className="mb-5">
                        <h2 className="mb-4 text-center text-dark fw-semibold">Open Positions 💼</h2>
                        {jobs.map((job, index) => (
                            <Col md={4} className="mb-4" key={index}>
                                <Card className="job-card h-100 p-3 border-0 shadow-sm rounded-3">
                                    <Card.Body className="text-center">
                                        <Image src={job.icon} height={60} className="mb-3" alt={job.title} />
                                        <Card.Title className="fw-bold text-dark">{job.title}</Card.Title>
                                        <Card.Subtitle className="mb-2 text-muted">
                                            {job.location} • {job.type}
                                        </Card.Subtitle>
                                        <Card.Text className="text-secondary">{job.description}</Card.Text>
                                        <Link
                                            variant="primary"
                                            to="/contact-us"
                                            className="mt-2"
                                            style={{
                                                backgroundColor: '#007bff',
                                                color: '#fff',
                                                padding: '12px 24px',
                                                fontSize: '16px',
                                                fontWeight: '600',
                                                border: 'none',
                                                borderRadius: '8px',
                                                boxShadow: '0 4px 12px rgba(0, 123, 255, 0.4)',
                                                transition: 'all 0.3s ease',
                                                cursor: 'pointer',
                                                textDecoration: 'none',
                                                display: 'inline-block',
                                            }}
                                            onMouseOver={(e) => {
                                                e.currentTarget.style.backgroundColor = '#0056b3';
                                                e.currentTarget.style.boxShadow = '0 6px 18px rgba(0, 86, 179, 0.5)';
                                            }}
                                            onMouseOut={(e) => {
                                                e.currentTarget.style.backgroundColor = '#007bff';
                                                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 123, 255, 0.4)';
                                            }}
                                        >
                                            Apply Now
                                        </Link>

                                    </Card.Body>
                                </Card>
                            </Col>
                        ))}
                    </Row>

                    {/* Perks */}
                    <Row className="bg-white py-5 px-3 rounded-3 shadow-sm mb-5">
                        <h3 className="text-center text-primary fw-bold mb-4">Why Work With Us? 💡</h3>
                        {perks.map((perk, index) => (
                            <Col md={4} className="mb-4" key={index}>
                                <Card className="h-100 p-3 border-0 shadow-sm rounded-3">
                                    <Card.Body className="text-center">
                                        <Image src={perk.icon} height={60} className="mb-3" alt={perk.title} />
                                        <Card.Title className="fw-bold text-dark">{perk.title}</Card.Title>
                                        <Card.Text className="text-secondary">{perk.description}</Card.Text>
                                    </Card.Body>
                                </Card>
                            </Col>
                        ))}
                    </Row>

                    {/* Call to Action */}
                    <Row className="text-center mt-5">
                        <h4 className="mb-3 text-dark fw-semibold">Don’t see your role? We still want to hear from you!</h4>
                        <Link
                            variant="outline-primary"
                            size="lg"
                            to="/contact-us"
                            className="px-5 py-2"
                            style={{
                                borderRadius: '12px',
                                boxShadow: '0 4px 12px rgba(0, 123, 255, 0.3)',
                                fontWeight: '600',
                                transition: 'all 0.3s ease',
                                color: '#007bff',
                                backgroundColor: 'transparent',
                                border: '1px solid #007bff',
                            }}
                            onMouseOver={(e) => {
                                e.currentTarget.style.backgroundColor = '#007bff';
                                e.currentTarget.style.color = '#fff';
                                e.currentTarget.style.boxShadow = '0 6px 18px rgba(0, 123, 255, 0.45)';
                            }}
                            onMouseOut={(e) => {
                                e.currentTarget.style.backgroundColor = 'transparent';
                                e.currentTarget.style.color = '#007bff';
                                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 123, 255, 0.3)';
                            }}
                        >
                            Submit Your Resume
                        </Link>

                    </Row>
                </Container>
            </div>
            <Footer />
        </>

    );
};

export default Careers;