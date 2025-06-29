import { Container, Row, Col, Image, Button } from "react-bootstrap";
import { motion } from "framer-motion";
import Header from "../Sections/Header/Header";
import Footer from "../Sections/Footer/FooterOne";
import "./OurVision.css";
import "./schedulebutton.css"
import { Link } from "react-router-dom";
const OurVision = () => {
    // Animation variants for Framer Motion
    const fadeInUp = {
        hidden: { opacity: 0, y: 50 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
    };

    const staggerContainer = {
        visible: {
            transition: {
                staggerChildren: 0.2,
            },
        },
    };

    return (
        <>
            <Header variant={"main-header"} />
            <motion.div
                className="our-vision-page bg-light py-5 mt-5"
                initial="hidden"
                animate="visible"
                variants={staggerContainer}
            >
                <Container>
                    {/* Hero Section */}
                    <Row className="align-items-center mb-5">
                        <Col lg={6} className="mb-4 mb-lg-0">
                            <motion.h1
                                className="display-4 fw-bold text-primary"
                                variants={fadeInUp}
                            >
                                Our Vision at LearnXChain 🚀
                            </motion.h1>
                            <motion.p className="lead text-muted" variants={fadeInUp}>
                                We're transforming Tier 2 and Tier 3 schools through next-gen
                                digital infrastructure — powered by AI, protected by blockchain,
                                and accessible offline.
                            </motion.p>
                        </Col>
                        <Col lg={6}>
                            <motion.div variants={fadeInUp}>
                                <Image
                                    src="https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=1000&q=80"
                                    fluid
                                    rounded
                                    className="shadow-lg"
                                    alt="Vision of LearnXChain"
                                />
                            </motion.div>
                        </Col>
                    </Row>

                    {/* Core Pillars with Interactive Cards */}
                    <motion.div className="text-center mb-5" variants={staggerContainer}>
                        <h2 className="fw-semibold text-dark mb-4">Our Core Pillars</h2>
                        <Row>
                            {[
                                {
                                    icon: "https://cdn-icons-png.flaticon.com/512/190/190411.png",
                                    title: "Equitable Access",
                                    description:
                                        "Bring modern education tools to the most underserved schools and communities.",
                                },
                                {
                                    icon: "https://cdn-icons-png.flaticon.com/512/3135/3135715.png",
                                    title: "AI & Blockchain First",
                                    description:
                                        "Build secure, intelligent systems that personalize learning and preserve student data integrity.",
                                },
                                {
                                    icon: "https://cdn-icons-png.flaticon.com/512/4359/4359874.png",
                                    title: "Future-Ready Schools",
                                    description:
                                        "Prepare students and schools to thrive in a globally connected, tech-driven future.",
                                },
                            ].map((pillar, index) => (
                                <Col md={4} className="mb-4" key={index}>
                                    <motion.div
                                        className="h-100 p-4 border-0 shadow-sm hover-card"
                                        whileHover={{ scale: 1.05 }}
                                        variants={fadeInUp}
                                    >
                                        <Image
                                            src={pillar.icon}
                                            height={60}
                                            className="mb-3"
                                            alt={`${pillar.title} Icon`}
                                        />
                                        <h5 className="fw-bold">{pillar.title}</h5>
                                        <p className="text-muted">{pillar.description}</p>
                                    </motion.div>
                                </Col>
                            ))}
                        </Row>
                    </motion.div>

                    {/* Vision Statement with Background */}
                    <motion.div
                        className="py-5 bg-gradient-primary text-white rounded shadow-lg"
                        variants={fadeInUp}
                    >
                        <Col md={12}>
                            <h2 className="text-center fw-bold mb-3">
                                "To decentralize, democratize, and digitize education — one
                                school at a time."
                            </h2>
                            <p className="lead text-center mx-auto" style={{ maxWidth: "850px" }}>
                                LearnXChain envisions an India where every school, regardless of
                                location or funding, can access world-class educational
                                technology. With offline support, real-time insights, and
                                complete transparency, we aim to uplift every child’s learning
                                experience.
                            </p>
                        </Col>
                    </motion.div>

                    {/* Impact Statistics */}
                    <motion.div className="text-center my-5" variants={staggerContainer}>
                        <h3 className="fw-semibold text-dark mb-4">Our Impact</h3>
                        <Row>
                            <Col md={4}>
                                <motion.div variants={fadeInUp}>
                                    <h4 className="display-4 fw-bold text-primary">100+</h4>
                                    <p className="text-muted">Schools Empowered</p>
                                </motion.div>
                            </Col>
                            <Col md={4}>
                                <motion.div variants={fadeInUp}>
                                    <h4 className="display-4 fw-bold text-primary">5,000+</h4>
                                    <p className="text-muted">Students Benefited</p>
                                </motion.div>
                            </Col>
                            <Col md={4}>
                                <motion.div variants={fadeInUp}>
                                    <h4 className="display-4 fw-bold text-primary">20%</h4>
                                    <p className="text-muted">Improvement in Test Scores</p>
                                </motion.div>
                            </Col>
                        </Row>
                    </motion.div>

                    {/* CTA Banner with Animation */}
                    <motion.div className="text-center mt-5" variants={fadeInUp}>
                        <h4 className="text-dark mb-3">Be part of the change 🌱</h4>
                        <Link
                            to="/schedule-demo"
                            className="btn btn-schedule-demo"
                            style={{
                                margin: '10px',
                                padding: '15px',
                                border: '3px solid transparent', // Added 'solid' and 'transparent' to make border valid
                                borderRadius: '14px',
                            }}
                        >
                            🚀 Schedule a Free Demo
                        </Link>


                    </motion.div>
                </Container>
            </motion.div>
            <Footer />
        </>
    );
};

export default OurVision;



// .btn {
//     margin: 0;
//     padding: 10px;
//     border: 0;
//     border-radius: 45;
// }