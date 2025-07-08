

// export default Signin;
import { useState } from "react";
import { NavLink } from "react-router-dom";
import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import ScrollAnimate from "../../Components/ScrollAnimate";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { jwtDecode } from "jwt-decode";
import { Eye, EyeOff } from "react-feather";

import AuthenticationStyleWrapper from "./Authentication.style";
import AuthRightSection from "./AuthRightSection";
import AuthFormWrapper from "./AuthFormWrapper";
import { login, googleLogin } from "../../../services/authService";
import AppConfig from "../../../config/config";


const Signin = () => {

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (!email.trim() || !password.trim()) {
      toast.error("Please fill in all fields", { position: "top-right" });
      setIsLoading(false);
      return;
    }

    try {
      const res = await login(email, password);
      localStorage.setItem(AppConfig.LOCAL_STORAGE_ACCESS_TOKEN_KEY, res.data.accessToken);
      localStorage.setItem(AppConfig.LOCAL_STORAGE_REFRESH_TOKEN_KEY, res.data.refreshToken);

      const token = res.data.accessToken;
      const decoded: any = jwtDecode(token);
      localStorage.setItem("schoolId", decoded.schoolId);
      localStorage.setItem("userId", decoded.userId);

      window.location.reload()
      toast.success("Login Successful!", {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        style: {
          position: 'fixed',
          zIndex: 9999
        }
      });

    } catch (err: any) {
      toast.error(err.message || "Invalid credentials", { position: "top-right" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthenticationStyleWrapper>
      <ToastContainer position="top-center" autoClose={3000} />
      <AuthFormWrapper>
        <ScrollAnimate delay={200}>
          <h2>Hi there!</h2>
          <h4 className="dm-sans">Welcome to LearnXChain 👋</h4>
        </ScrollAnimate>

        <form onSubmit={handleSubmit} id="commentForm">
          <ScrollAnimate delay={250}>
            <div className="form-group">
              <label>Email address</label>
              <input
                type="email"
                name="email"
                placeholder="e.g.  example@mail.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </ScrollAnimate>

          <ScrollAnimate delay={300}>
            <div className="form-group" style={{ position: "relative" }}>
              <label>Password</label>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="********"
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ paddingRight: "40px" }}
              />
              <span
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: "absolute",
                  right: "10px",
                  top: "50px",
                  cursor: "pointer",
                  userSelect: "none",
                }}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </span>
            </div>
          </ScrollAnimate>

          <ScrollAnimate delay={350}>
            <button type="submit" className="form-primary-btn" disabled={isLoading}>
              {isLoading ? "Logging in..." : "Login"}
            </button>
          </ScrollAnimate>

          <ScrollAnimate delay={400}>
            <div className="or-section">
              <p className="mb-0">or</p>
            </div>
          </ScrollAnimate>

          <ScrollAnimate delay={450}>
            <GoogleOAuthProvider clientId={AppConfig.GOOGLE_CLIENT_ID}>
              <GoogleLogin
                onSuccess={async (cred) => {
                  try {
                    if (!cred.credential) return;
                    const res = await googleLogin(cred.credential);
                    localStorage.setItem(
                      AppConfig.LOCAL_STORAGE_ACCESS_TOKEN_KEY,
                      res.data.accessToken
                    );
                    localStorage.setItem(
                      AppConfig.LOCAL_STORAGE_REFRESH_TOKEN_KEY,
                      res.data.refreshToken
                    );
                    const decoded: any = jwtDecode(res.data.accessToken);
                    localStorage.setItem('schoolId', decoded.schoolId);
                    localStorage.setItem('userId', decoded.userId);
                    window.location.reload();
                  } catch (err: any) {
                    toast.error(err.message || 'Google login failed');
                  }
                }}
                onError={() => toast.error('Google Login Failed')}
              />
            </GoogleOAuthProvider>
          </ScrollAnimate>

          <ScrollAnimate delay={500}>
            <NavLink to="/otp-login" className="auth-link">
              Login with OTP
            </NavLink>
          </ScrollAnimate>

          <ScrollAnimate delay={550}>
            <NavLink to="/forgot-password" className="auth-link">
              Forgot my password
            </NavLink>
            <p className="mb-0">
              By signing in, you agree to our{" "}
              <NavLink to="/terms">Terms</NavLink> &{" "}
              <NavLink to="/privacy-policy">Privacy Policy.</NavLink>
            </p>
          </ScrollAnimate>
        </form>
      </AuthFormWrapper>

      <AuthRightSection />
    </AuthenticationStyleWrapper>
  );
};

export default Signin;
