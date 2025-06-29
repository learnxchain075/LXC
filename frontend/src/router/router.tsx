import { Fragment, FC } from "react";
import { Route, Routes } from "react-router";
import { useDispatch } from "react-redux";


import { authRoutes, publicRoutes } from "./router.link";
import PrivateRouteSectionWrapper from "../wrapper/PrivateRouteSectionWrapper";
import PublicRouteWrapper from "../wrapper/PublicRouteWrapper";
// import Login from "../pages/auth/login/login";
import CommonRouteWrapper from "../wrapper/CommonRouteWrapper";
import Error404 from "../pages/Common/error/error-404";
import ProtectedRoute from "../wrapper/ProtectedRoute";

// import HomeLandingPage from "../lxc-home/Home";

import SignIn from "../lxc-home/pages/sign-in";
import SignUp from "../lxc-home/pages/schedule-demo";
import ForgotPassword from "../lxc-home/pages/forgot-password";
import ResetPassword from "../lxc-home/pages/reset-password";
import ResetPasswordSuccess from "../lxc-home/pages/reset-password-success";
import Terms from "../lxc-home/pages/terms";
import PrivacyPolicy from "../lxc-home/pages/privacy-policy";
import RefundPolicy from "../lxc-home/pages/refund-policy";
import Blog from "../lxc-home/pages/blog";
import BlogDetails from "../lxc-home/pages/blog-details";
import AboutUs from "../lxc-home/pages/about-us";
import OurServices from "../lxc-home/pages/our-services";
import ContactUs from "../lxc-home/pages/ContactUs";
import Error from "../lxc-home/pages/Error";
import HomePage from "../lxc-home/pages/Home";
import { ThemeProvider as TemplateProvider } from "styled-components";

// Styles and Theme
import TemplateStyles from "../lxc-home/assets/styles/TemplateStyles";
import GlobalStyles from "../lxc-home/assets/styles/GlobalStyles";
import "venobox/dist/venobox.min.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "../lxc-home/assets/styles/common-style.css";
import "../lxc-home/assets/styles/buttons-style.css";
import ScrollToTop from "../lxc-home/ScrollToTop";
import PublicLayout from "./publiclayoutHome";
import Login from "../pages/auth/login/login";
import Careers from "../lxc-home/pages/Careers";
import CookiesPolicy from "../lxc-home/pages/CookiesPolicy";
import OurVision from "../lxc-home/pages/OurVision";
import ScheduleDemo from "../lxc-home/pages/schedule-demo";

// const ALLRoutes: FC = () => {
//   return (
//     <Fragment>
//       <Routes>
//          <TemplateProvider theme={TemplateStyles}>
//       <GlobalStyles />

//         <ScrollToTop />
//         <Routes>
//           <Route path="/" element={<HomePage />} />
//           <Route path="/about-us" element={<AboutUs />} />
//           <Route path="/our-services" element={<OurServices />} />
//           <Route path="/sign-in" element={<SignIn />} />
//           <Route path="/sign-up" element={<SignUp />} />
//           <Route path="/forgot-password" element={<ForgotPassword />} />
//           <Route path="/terms" element={<Terms />} />
//           <Route path="/privacy-policy" element={<PrivacyPolicy />} />
//           <Route path="/blog" element={<Blog />} />
//           <Route path="/blog-details" element={<BlogDetails />} />
//           <Route path="/contact-us" element={<ContactUs />} />
//           {/* <Route path="*" element={<Error />} /> */}
//         </Routes>

//     </TemplateProvider>
//         <Route element={<CommonRouteWrapper />}>
//           <Route element={<PublicRouteWrapper />}>
//             {/* <Route path="/" element={<Login />} /> */}
//             {/* <Route path="/" element={<HomeLandingPage />} />
//              <Route path="/about-us" element={<AboutUs />} />
//           <Route path="/our-services" element={<OurServices />} />
//           <Route path="/sign-in" element={<SignIn />} />
//           <Route path="/sign-up" element={<SignUp />} />
//           <Route path="/forgot-password" element={<ForgotPassword />} />
//           <Route path="/terms" element={<Terms />} />
//           <Route path="/privacy-policy" element={<PrivacyPolicy />} />
//           <Route path="/blog" element={<Blog />} />
//           <Route path="/blog-details" element={<BlogDetails />} />
//           <Route path="/contact-us" element={<ContactUs />} />
//           <Route path="*" element={<Error />} /> */}



//             {authRoutes.map((route, idx) => (
//               <Route path={route.path} element={route.element} key={idx} />
//             ))}
//           </Route>

//           <Route element={<PrivateRouteSectionWrapper />}>
//              <Route element={<ProtectedRoute />}>

//             {publicRoutes.map((route, idx) => (
//               <Route path={route.path} element={route.element} key={idx} />
//             ))}
//              </Route>
//           </Route>
//            <Route path="*" element={<Error404 />} />
//         </Route>
//       </Routes>
//     </Fragment>
//   );
// };


const ALLRoutes: FC = () => {
  const dispatch = useDispatch();

  return (
    <Fragment>

      <Routes>
        <Route element={<CommonRouteWrapper />}>
          <Route element={<PublicRouteWrapper />}>

            <Route element={<PublicLayout />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/about-us" element={<AboutUs />} />
              <Route path="/our-services" element={<OurServices />} />
              <Route path="/sign-in" element={<SignIn />} />
              {/* <Route path="/sign-up" element={<SignUp />} /> */}
              <Route path="/cookies-policy" element={<CookiesPolicy />} />
              <Route path="/our-vision" element={<OurVision />} />
              <Route path="/careers" element={<Careers />} />
              <Route path="/schedule-demo" element={<ScheduleDemo />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/reset-password-success" element={<ResetPasswordSuccess />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="/refund-policy" element={<RefundPolicy />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/blog-details" element={<BlogDetails />} />
              <Route path="/contact-us" element={<ContactUs />} />
            </Route>
            {/* <Route path="/" element={<Login />} /> */}
            {authRoutes.map((route, idx) => (
              <Route path={route.path} element={route.element} key={idx} />
            ))}
          </Route>

          <Route element={<PrivateRouteSectionWrapper />}>
            <Route element={<ProtectedRoute />}>
              {publicRoutes.map((route, idx) => (
                <Route path={route.path} element={route.element} key={idx} />
              ))}
            </Route>
          </Route>

          <Route path="*" element={<Error404 />} />
        </Route>
      </Routes>

    </Fragment>
  );
};

export default ALLRoutes;
