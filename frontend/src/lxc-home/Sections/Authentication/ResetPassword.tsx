import { NavLink, useNavigate, useSearchParams } from "react-router-dom";
import AuthenticationStyleWrapper from "./Authentication.style";
import AuthFormWrapper from "./AuthFormWrapper";
import AuthRightSection from "./AuthRightSection";
import ScrollAnimate from "../../Components/ScrollAnimate";
import { useState, useEffect } from "react";
import { resetPassword } from "../../../services/admin/forgetpassword";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ResetPassword = () => {
  console.log("🔄 LXC-HOME: ResetPassword component rendered");
  console.log("🔄 LXC-HOME: ResetPassword component - window.location:", window.location.href);
  console.log("🔄 LXC-HOME: ResetPassword component - search params:", window.location.search);
  console.log("object ResetPassword");
  const [searchParams] = useSearchParams();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState("");
  const [tokenValid, setTokenValid] = useState(true);
  const [checkingToken, setCheckingToken] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const tokenFromUrl = searchParams.get("token");
    console.log("🔄 LXC-HOME: ResetPassword useEffect - searchParams:", searchParams.toString());
    console.log("🔄 LXC-HOME: ResetPassword useEffect - tokenFromUrl:", tokenFromUrl);
    console.log("🔄 LXC-HOME: ResetPassword useEffect - current URL:", window.location.href);
    
    if (!tokenFromUrl) {
      console.log("🔄 LXC-HOME: ResetPassword - No token found in URL");
      setTokenValid(false);
      toast.error("Invalid reset link. Please request a new password reset.");
    } else {
      console.log("🔄 LXC-HOME: ResetPassword - Token found, setting token state");
      setToken(tokenFromUrl);
    }
    setCheckingToken(false);
  }, [searchParams]);

  const validatePassword = (password: string) => {
    const minLength = password.length >= 8;
    const hasLowercase = /[a-z]/.test(password);
    const hasUppercase = /[A-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecialChar = /[^a-zA-Z0-9]/.test(password);

    if (!minLength) return "Password must be at least 8 characters long";
    if (!hasLowercase) return "Password must contain at least one lowercase letter";
    if (!hasUppercase) return "Password must contain at least one uppercase letter";
    if (!hasNumber) return "Password must contain at least one number";
    if (!hasSpecialChar) return "Password must contain at least one special character";
    
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("handleSubmit called with token:", token);
    if (!tokenValid) {
      toast.error("Invalid reset link. Please request a new password reset.");
      return;
    }

    if (!newPassword.trim() || !confirmPassword.trim()) {
      toast.error("Please fill in all fields.");
      return;
    }

    const passwordError = validatePassword(newPassword);
    if (passwordError) {
      toast.error(passwordError);
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    setLoading(true);
    console.log("🔄 LXC-HOME: Submitting reset password request with token:", token, " and newPassword:", newPassword);
    try {
      console.log("🔄 LXC-HOME: Calling resetPassword API...");
      const res = await resetPassword({ token, newPassword });
      console.log("🔄 LXC-HOME: ResetPassword API response:", res);
      toast.success("Password reset successfully!");
      setTimeout(() => {
        console.log("🔄 LXC-HOME: Navigating to reset-password-success page");
        navigate("/reset-password-success");
      }, 2000);
    } catch (err: any) {
      console.error("🔄 LXC-HOME: ResetPassword API error:", err);
      console.error("🔄 LXC-HOME: ResetPassword API error response:", err.response);
      console.error("🔄 LXC-HOME: ResetPassword API error data:", err.response?.data);
      
      if (err.response && err.response.data && err.response.data.error) {
        toast.error(err.response.data.error);
      } else if (err.message) {
        toast.error(err.message);
      } else {
        toast.error("Failed to reset password. Please try again.");
      }
    } finally {
      console.log("🔄 LXC-HOME: Reset password request completed");
      setLoading(false);
    }
  };

  if (checkingToken) {
    return (
      <AuthenticationStyleWrapper>
        <AuthFormWrapper>
          <ScrollAnimate>
            <div className="text-center">
              <div className="spinner-border text-primary mb-3" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <h4>Verifying reset link...</h4>
            </div>
          </ScrollAnimate>
        </AuthFormWrapper>
        <AuthRightSection />
      </AuthenticationStyleWrapper>
    );
  }

  if (!tokenValid) {
    return (
      <AuthenticationStyleWrapper>
        <AuthFormWrapper>
          <ToastContainer position="top-center" autoClose={3000} />
          <ScrollAnimate>
            <h2>Invalid Reset Link</h2>
            <h4 className="dm-sans">The password reset link is invalid or has expired.</h4>
          </ScrollAnimate>
          
          <ScrollAnimate>
            <div className="text-center mt-4">
              <NavLink to="/forgot-password" className="btn btn-primary">
                Request New Reset Link
              </NavLink>
            </div>
          </ScrollAnimate>
        </AuthFormWrapper>
        <AuthRightSection />
      </AuthenticationStyleWrapper>
    );
  }

  return (
    <AuthenticationStyleWrapper>
      <AuthFormWrapper>
        <ToastContainer position="top-center" autoClose={3000} />
        <ScrollAnimate>
          <h2>Reset Your Password</h2>
          <h4 className="dm-sans">Enter your new password below 🔐</h4>
        </ScrollAnimate>

        <form onSubmit={handleSubmit} aria-busy={loading}>
          <ScrollAnimate>
            <div className="form-group">
              <label>New Password</label>
              <input
                type="password"
                name="newPassword"
                placeholder="Enter your new password"
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                required
                disabled={loading}
                autoComplete="new-password"
              />
              <small className="text-muted">
                Password must be at least 8 characters with uppercase, lowercase, number, and special character.
              </small>
            </div>
          </ScrollAnimate>

          <ScrollAnimate>
            <div className="form-group">
              <label>Confirm New Password</label>
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm your new password"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                required
                disabled={loading}
                autoComplete="new-password"
              />
            </div>
          </ScrollAnimate>

          <ScrollAnimate>
            <button type="submit" className="form-primary-btn" disabled={loading}>
              {loading ? (
                <span style={{ display: 'inline-flex', alignItems: 'center' }}>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Resetting...
                </span>
              ) : (
                "Reset Password"
              )}
            </button>
          </ScrollAnimate>

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

export default ResetPassword; 