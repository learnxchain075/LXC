import { useEffect, useState } from "react";
import { Link } from "react-router-dom";


import ImageWithBasePath from "../../../core/common/imageWithBasePath";
import { login } from "../../../services/authService";

import { all_routes } from "../../../router/all_routes";
import AppConfig from "../../../config/config";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { jwtDecode } from "jwt-decode";

const Login = () => {


  const [isPasswordVisible, setPasswordVisible] = useState<boolean>(false);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    localStorage.setItem("menuOpened", "Dashboard");
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    // Basic form validation
    if (!email.trim() || !password.trim()) {
      toast.error("Please fill in all fields", { position: "top-right" });
      return;
    }

    try {
      const res = await login(email, password);

      // update local storage
      localStorage.setItem(AppConfig.LOCAL_STORAGE_ACCESS_TOKEN_KEY, res.data.accessToken);
      localStorage.setItem(AppConfig.LOCAL_STORAGE_REFRESH_TOKEN_KEY, res.data.refreshToken);
      const token = localStorage.getItem(AppConfig.LOCAL_STORAGE_ACCESS_TOKEN_KEY) ?? "";
      const decoded: any = jwtDecode(token);
      
      localStorage.setItem("schoolId", decoded.schoolId);
      localStorage.setItem("userId", decoded.userId);
      // console.log("object",localStorage.getItem("schoolId"),localStorage.getItem("userId"));
      toast.success("Login Successful!", { position: "top-right" });
      window.location.reload()

    } catch (err: any) {
      toast.error(err.message || "Invalid credentials", { position: "top-right" });

    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible((prevState) => !prevState);
  };

  const date = () => new Date().getFullYear();

  return (
    <div className="container-fuild">
      <ToastContainer />
      <div className="w-100 overflow-hidden position-relative flex-wrap d-block vh-100">
        <div className="row">
          <div className="col-lg-6">
            <div className="login-background d-lg-flex align-items-center justify-content-center d-lg-block d-none flex-wrap vh-100 overflowy-auto">
              <div>
                <ImageWithBasePath
                  src="assets/img/authentication/authentication-02.jpg"
                  alt=""
                />
              </div>
              <div className="authen-overlay-item  w-100 p-4">
                <h4 className="text-white mb-3">What's New on LearnXChain !!!</h4>
                <div className="d-flex align-items-center flex-row mb-3 justify-content-between p-3 br-5 gap-3 card">
                  <div>
                    <h6>Summer Vacation Holiday Homework</h6>
                    <p className="mb-0 text-truncate">
                      The school will remain closed from April 20th to June...
                    </p>
                  </div>
                  <Link to="#">
                    <i className="ti ti-chevrons-right" />
                  </Link>
                </div>
                <div className="d-flex align-items-center flex-row mb-3 justify-content-between p-3 br-5 gap-3 card">
                  <div>
                    <h6>Summer Vacation Holiday Homework</h6>
                    <p className="mb-0 text-truncate">
                      The school will remain closed from April 20th to June...
                    </p>
                  </div>
                  <Link to="#">
                    <i className="ti ti-chevrons-right" />
                  </Link>
                </div>
                <div className="d-flex align-items-center flex-row mb-3 justify-content-between p-3 br-5 gap-3 card">
                  <div>
                    <h6>Summer Vacation Holiday Homework</h6>
                    <p className="mb-0 text-truncate">
                      The school will remain closed from April 20th to June...
                    </p>
                  </div>
                  <Link to="#">
                    <i className="ti ti-chevrons-right" />
                  </Link>
                </div>
                <div className="d-flex align-items-center flex-row mb-3 justify-content-between p-3 br-5 gap-3 card">
                  <div>
                    <h6>Summer Vacation Holiday Homework</h6>
                    <p className="mb-0 text-truncate">
                      The school will remain closed from April 20th to June...
                    </p>
                  </div>
                  <Link to="#">
                    <i className="ti ti-chevrons-right" />
                  </Link>
                </div>
                <div className="d-flex align-items-center flex-row mb-3 justify-content-between p-3 br-5 gap-3 card">
                  <div>
                    <h6>Summer Vacation Holiday Homework</h6>
                    <p className="mb-0 text-truncate">
                      The school will remain closed from April 20th to June...
                    </p>
                  </div>
                  <Link to="#">
                    <i className="ti ti-chevrons-right" />
                  </Link>
                </div>
              </div>
            </div>
          </div>

          <div className="col-lg-6 col-md-12 col-sm-12">
            <div className="row justify-content-center align-items-center vh-100 overflow-auto flex-wrap ">
              <div className="col-md-8 mx-auto p-4">
                <form onSubmit={handleSubmit}>
                  <div>
                    <div className="mx-auto mb-2 text-center">
                      <ImageWithBasePath
                        src="assets/img/authentication/logoauth.svg"
                        className="img-fluid"
                        alt="Logo"
                      />
                    </div>
                    <div className="card">
                      <div className="card-body pb-3">
                        <div className="mb-4">
                          <h2 className="mb-2">Welcome</h2>
                          <p className="mb-0">
                            Please enter your details to sign in
                          </p>
                        </div>

                        {error && (
                          <div className="alert alert-danger">{error}</div>
                        )}

                        <div className="mb-3">
                          <label className="form-label">Email Address</label>
                          <div className="input-icon mb-3 position-relative">
                            <span className="input-icon-addon">
                              <i className="ti ti-mail" />
                            </span>
                            <input
                              type="email"
                              className="form-control"
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              required
                            />
                          </div>
                          <label className="form-label">Password</label>
                          <div className="pass-group">
                            <input
                              type={isPasswordVisible ? "text" : "password"}
                              className="pass-input form-control"
                              value={password}
                              onChange={(e) => setPassword(e.target.value)}
                              required
                            />
                            <span
                              className={`ti toggle-password ${isPasswordVisible ? "ti-eye" : "ti-eye-off"
                                }`}
                              onClick={togglePasswordVisibility}
                            />
                          </div>
                        </div>

                        <div className="form-wrap form-wrap-checkbox">
                          <div className="d-flex align-items-center">
                            <div className="form-check form-check-md mb-0">
                              <input
                                className="form-check-input mt-0"
                                type="checkbox"
                              />
                            </div>
                            <p className="ms-1 mb-0">Remember Me</p>
                          </div>
                          <div className="text-end">
                            <Link
                              to={all_routes.forgotPassword}
                              className="link-danger"
                            >
                              Forgot Password?
                            </Link>
                          </div>
                        </div>
                      </div>

                      <div className="p-4 pt-0">
                        <div className="mb-3">
                          <button
                            type="submit"
                            className="btn btn-primary w-100"
                            disabled={isLoading}
                          >
                            {isLoading ? (
                              <>
                                <span className="spinner-border spinner-border-sm me-2"></span>
                                Signing In...
                              </>
                            ) : (
                              "Sign In"
                            )}
                          </button>
                        </div>

                      </div>
                    </div>

                    <div className="mt-5 text-center">
                      <p className="mb-0">Copyright © {date()} - LearnXChain</p>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
