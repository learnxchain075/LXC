import { GoArrowLeft } from "react-icons/go";
import LogoDark from "../../assets/images/logo/logo-dark.png";
import { NavLink } from "react-router-dom";
import ScrollAnimate from "../../Components/ScrollAnimate";
import PropTypes from "prop-types";

const AuthFormWrapper = ({ children }) => {
  return (
    <section className="auth-form-section">
      <div className="auth-page-header">
        <NavLink to="/" className="logo">
          <ScrollAnimate delay={200}>
            <div className="d-flex align-items-center gap-2">
              <>
                <img
                  src={LogoDark}
                  alt="logo"
                  className="logo-light img-fluid"
                  style={{ height: "48px" }}
                />

              </>
             
            </div>
          </ScrollAnimate>
        </NavLink>
        <NavLink to="/" className="back-link">
          <ScrollAnimate>
            <GoArrowLeft />
            Go Back
          </ScrollAnimate>
        </NavLink>
      </div>
      <div className="auth-content">{children}</div>
    </section>
  );
};
AuthFormWrapper.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AuthFormWrapper;

