import Layout from "../Layout";
import { NavLink } from "react-router-dom";
import AuthenticationStyleWrapper from "../Sections/Authentication/Authentication.style";
import AuthFormWrapper from "../Sections/Authentication/AuthFormWrapper";
import AuthRightSection from "../Sections/Authentication/AuthRightSection";
import ScrollAnimate from "../Components/ScrollAnimate";

const ResetPasswordSuccess = () => {
  return (
    <Layout pageTitle="LearnXChain - Password Reset Success">
      <AuthenticationStyleWrapper>
        <AuthFormWrapper>
          <ScrollAnimate>
            <div className="text-center">
              <div className="success-icon mb-4">
                <i className="ti ti-check-circle" style={{ fontSize: '4rem', color: '#28a745' }}></i>
              </div>
              <h2>Success!</h2>
              <h4 className="dm-sans">Your password has been reset successfully 🔐</h4>
              <p className="text-muted mt-3">
                You can now log in with your new password.
              </p>
            </div>
          </ScrollAnimate>

          <ScrollAnimate>
            <div className="text-center mt-4">
              <NavLink to="/sign-in" className="form-primary-btn">
                Back to Login
              </NavLink>
            </div>
          </ScrollAnimate>
        </AuthFormWrapper>

        <AuthRightSection />
      </AuthenticationStyleWrapper>
    </Layout>
  );
};

export default ResetPasswordSuccess; 