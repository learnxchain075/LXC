import { NavLink, useNavigate } from "react-router-dom";
import AuthenticationStyleWrapper from "./Authentication.style";
import AuthFormWrapper from "./AuthFormWrapper";
import AuthRightSection from "./AuthRightSection";
import ScrollAnimate from "../../Components/ScrollAnimate";
import { useState } from "react";
import { forgotPassword } from "../../../services/admin/forgetpassword";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [info, setInfo] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("🔄 LXC-HOME: ForgotPassword handleSubmit called with email:", email);
    
    if (!email.trim()) {
      toast.error("Please enter your email address.");
      return;
    }
    
    setLoading(true);
    setInfo("");
    
    try {
      console.log("🔄 LXC-HOME: Calling forgotPassword API...");
      const response = await forgotPassword({ email });
      console.log("🔄 LXC-HOME: ForgotPassword API response:", response);
      toast.success("If this email exists, a reset link has been sent.");
      setInfo("Check your inbox and spam/junk folder for the reset link.");
      setEmail("");
    } catch (err: any) {
      console.error("🔄 LXC-HOME: ForgotPassword API error:", err);
      console.error("🔄 LXC-HOME: ForgotPassword API error response:", err.response);
      console.error("🔄 LXC-HOME: ForgotPassword API error data:", err.response?.data);
      
      if (err.response && err.response.data && err.response.data.error) {
        toast.error(err.response.data.error);
      } else if (err.message) {
        toast.error(err.message);
      } else {
        toast.error("Failed to send reset email. Please try again.");
      }
    } finally {
      console.log("🔄 LXC-HOME: Forgot password request completed");
      setLoading(false);
    }
  };

  return (
    <AuthenticationStyleWrapper>
      <AuthFormWrapper>
        <ToastContainer position="top-center" autoClose={3000} />
        <ScrollAnimate>
          <h2>Hi there!</h2>
          <h4 className="dm-sans">Reset link will be send to your mail 📨</h4>
        </ScrollAnimate>

        <form onSubmit={handleSubmit} aria-busy={loading}>
          <ScrollAnimate>
            <div className="form-group">
              <label>Email address</label>
              <input
                type="email"
                name="email"
                placeholder="e.g.  example@mail.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                disabled={loading}
              />
            </div>
          </ScrollAnimate>

          <ScrollAnimate>
            <button type="submit" className="form-primary-btn" disabled={loading}>
              {loading ? (
                <span style={{ display: 'inline-flex', alignItems: 'center' }}>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Sending...
                </span>
              ) : (
                "Send me reset mail"
              )}
            </button>
          </ScrollAnimate>

          {info && (
            <ScrollAnimate>
              <div className="alert alert-info mt-3" role="alert">
                {info}
              </div>
            </ScrollAnimate>
          )}

          <ScrollAnimate>
            <p className="mt-5">
              Remember your password ?&nbsp;
              <NavLink to="/sign-in">Log in now!</NavLink>
            </p>
          </ScrollAnimate>
        </form>
        <div className="text-center mt-3">
          <button
            type="button"
            className="btn btn-link"
            onClick={() => navigate("/sign-in")}
            disabled={loading}
          >
            &larr; Back to login
          </button>
        </div>
      </AuthFormWrapper>

      <AuthRightSection />
    </AuthenticationStyleWrapper>
  );
};

export default ForgotPassword;
