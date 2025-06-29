// import AuthenticationStyleWrapper from "./Authentication.style";
// import AuthRightSection from "./AuthRightSection";
// import AuthFormWrapper from "./AuthFormWrapper";

// // import GoogleIcon from "../../assets/images/auth-and-utility/google.svg";
// // import FacebookIcon from "../../assets/images/auth-and-utility/facebook.svg";
// import { NavLink } from "react-router-dom";
// import ScrollAnimate from "../../Components/ScrollAnimate";

// const Signin = () => {
//   return (
//     <AuthenticationStyleWrapper>
//       <AuthFormWrapper>
//         <ScrollAnimate delay={200}>
//           <h2>Hi there!</h2>
//           <h4 className="dm-sans">Welcome to LearnXChain 👋</h4>
//         </ScrollAnimate>
//         <form action="/" id="commentForm">
//           <ScrollAnimate delay={250}>
//             <div className="form-group">
//               <label>Email address</label>
//               <input
//                 type="email"
//                 name="email"
//                 placeholder="e.g.  example@mail.com"
//                 required
//               />
//             </div>
//           </ScrollAnimate>

//           <ScrollAnimate delay={300}>
//             <div className="form-group">
//               <label>Password</label>
//               <input
//                 type="password"
//                 name="password"
//                 placeholder="********"
//                 required
//               />
//             </div>
//           </ScrollAnimate>

//           <ScrollAnimate delay={350}>
//             <button type="submit" className="form-primary-btn">
//               Login
//             </button>
//           </ScrollAnimate>

//           {/* <ScrollAnimate delay={400}>
//             <div className="or-section">
//               <p className="mb-0">or</p>
//             </div>
//           </ScrollAnimate>

//           <ScrollAnimate delay={450}>
//             <button className="secondary-btn">
//               <img src={GoogleIcon} alt="icon" /> Log in with Google
//             </button>
//           </ScrollAnimate>
//           <ScrollAnimate delay={500}>
//             <button className="secondary-btn">
//               <img src={FacebookIcon} alt="icon" /> Log in with Facebook
//             </button>
//           </ScrollAnimate>
// */}
//           <ScrollAnimate delay={550}>
//             <NavLink to="/forgot-password" className="auth-link">
//               Forgot my password
//             </NavLink>
           
//             <p className="mb-0">
//               By signing in, you agree to our{" "}
//               <NavLink to="/terms">Terms</NavLink> &{" "}
//               <NavLink to="/privacy-policy">Privacy Policy.</NavLink>
//             </p>
//           </ScrollAnimate> 
//         </form>
//       </AuthFormWrapper>

//       <AuthRightSection />
//     </AuthenticationStyleWrapper>
//   );
// };

// export default Signin;
import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import ScrollAnimate from "../../Components/ScrollAnimate";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { jwtDecode } from "jwt-decode";


import AuthenticationStyleWrapper from "./Authentication.style";
import AuthRightSection from "./AuthRightSection";
import AuthFormWrapper from "./AuthFormWrapper";
import { login } from "../../../services/authService";
import AppConfig from "../../../config/config";
import { useDispatch } from "react-redux";
import { setIsLoggedIn } from "../../../Store/authSlice";

// import GoogleIcon from "../../assets/images/auth-and-utility/google.svg";
// import FacebookIcon from "../../assets/images/auth-and-utility/facebook.svg";

const Signin = () => {
const dispatch=useDispatch();

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

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
// if (res.status  >=200){
//   dispatch(setIsLoggedIn(true));
// }
     
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
            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                name="password"
                placeholder="********"
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </ScrollAnimate>

          <ScrollAnimate delay={350}>
            <button type="submit" className="form-primary-btn" disabled={isLoading}>
              {isLoading ? "Logging in..." : "Login"}
            </button>
          </ScrollAnimate>

          {/* <ScrollAnimate delay={400}>
            <div className="or-section">
              <p className="mb-0">or</p>
            </div>
          </ScrollAnimate>

          <ScrollAnimate delay={450}>
            <button className="secondary-btn">
              <img src={GoogleIcon} alt="icon" /> Log in with Google
            </button>
          </ScrollAnimate>
          <ScrollAnimate delay={500}>
            <button className="secondary-btn">
              <img src={FacebookIcon} alt="icon" /> Log in with Facebook
            </button>
          </ScrollAnimate> */}

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
