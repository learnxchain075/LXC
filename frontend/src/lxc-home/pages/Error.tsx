import { NavLink } from "react-router-dom";
import Layout from "../Layout";

const Error = () => {
  return (
    <Layout pageTitle="LearnXChain - Error">
      <div className="error-page">
        <div className="mb-3 text-center">
          <h4>404 - Page Not Found</h4>
        </div>

        <NavLink to="/" className="template-btn">
          Go to Homepage
        </NavLink>
      </div>
    </Layout>
  );
};

export default Error;
