import { useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

import AuthenticationStyleWrapper from "./Authentication.style";
import AuthFormWrapper from "./AuthFormWrapper";
import { NavLink } from "react-router-dom";
import ScrollAnimate from "../../Components/ScrollAnimate";
import AuthRightSection from "./AuthRightSection";

const ScheduleDemo = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    school: "",
    dateTime: "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.id]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post("https://api.learnxchain.io/api/v1/demo-booking", {
        ...formData,
      });

      toast.success("🎉 Demo scheduled successfully!");
      setFormData({ name: "", email: "", school: "", dateTime: "" });
    } catch (err) {
      const msg =
        err?.response?.data?.message || "Something went wrong. Try again.";
      toast.error(`❌ ${msg}`);
    }
  };

  return (
    <AuthenticationStyleWrapper>
      <ToastContainer position="top-center" autoClose={3000} />
      <style>{`
        .form-heading {
          font-size: 2rem;
          font-weight: 700;
          color: #2c3e50;
        }
        .form-subtitle {
          font-size: 1.1rem;
          color: #7f8c8d;
          margin-bottom: 30px;
        }
        .form-control {
          padding: 14px;
          border-radius: 10px;
          border: 1px solid #ddd;
          transition: border-color 0.3s ease;
        }
        .form-control:focus {
          border-color: #6c63ff;
          box-shadow: 0 0 0 0.2rem rgba(108, 99, 255, 0.2);
        }
        .form-label {
          font-weight: 600;
          margin-bottom: 8px;
          color: #34495e;
        }
        .form-primary-btn {
          width: 100%;
          background: linear-gradient(to right, #6c63ff, #45aaf2);
          color: white;
          padding: 14px;
          border: none;
          font-weight: 600;
          font-size: 16px;
          border-radius: 10px;
          transition: all 0.3s ease;
        }
        .form-primary-btn:hover {
          background: linear-gradient(to right, #564fdc, #3498db);
        }
        .policy-text {
          font-size: 0.85rem;
          color: #7f8c8d;
        }
        .demo-wrapper {
          background-color: #f9fafe;
          padding: 40px 30px;
          border-radius: 12px;
          box-shadow: 0 5px 30px rgba(0, 0, 0, 0.05);
        }
        @media (max-width: 768px) {
          .form-heading {
            font-size: 1.6rem;
          }
        }
      `}</style>

      <AuthFormWrapper>
        <div className="demo-wrapper">
          <ScrollAnimate delay={100}>
            <h2 className="form-heading">Book Your Free Demo</h2>
          </ScrollAnimate>

          <ScrollAnimate delay={200}>
            <p className="form-subtitle">
              See how LearnXChain transforms your school in minutes 🎯
            </p>
          </ScrollAnimate>

          <form onSubmit={handleSubmit}>
            <ScrollAnimate delay={250}>
              <div className="form-group mb-4">
                <label htmlFor="name" className="form-label">
                  Your Name
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="John Doe"
                  required
                />
              </div>
            </ScrollAnimate>

            <ScrollAnimate delay={300}>
              <div className="form-group mb-4">
                <label htmlFor="email" className="form-label">
                  Email Address
                </label>
                <input
                  type="email"
                  className="form-control"
                  id="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  required
                />
              </div>
            </ScrollAnimate>

            <ScrollAnimate delay={350}>
              <div className="form-group mb-4">
                <label htmlFor="school" className="form-label">
                  School Name
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="school"
                  value={formData.school}
                  onChange={handleChange}
                  placeholder="XYZ International School"
                  required
                />
              </div>
            </ScrollAnimate>

            <ScrollAnimate delay={400}>
              <div className="form-group mb-4">
                <label htmlFor="dateTime" className="form-label">
                  Preferred Date & Time
                </label>
                <input
                  type="datetime-local"
                  className="form-control"
                  id="dateTime"
                  value={formData.dateTime}
                  onChange={handleChange}
                  required
                />
              </div>
            </ScrollAnimate>

            <ScrollAnimate delay={450}>
              <button type="submit" className="form-primary-btn">
                Schedule My Demo
              </button>
            </ScrollAnimate>

            <ScrollAnimate delay={500}>
              <p className="mt-4 text-center policy-text">
                By scheduling, you agree to our{" "}
                <NavLink to="/terms">Terms</NavLink> &{" "}
                <NavLink to="/privacy-policy">Privacy Policy</NavLink>.
              </p>
            </ScrollAnimate>
          </form>
        </div>
      </AuthFormWrapper>

      <AuthRightSection />
    </AuthenticationStyleWrapper>
  );
};

export default ScheduleDemo;
