// import React from 'react'
// import { all_routes } from '../../../../../router/all_routes'
// import { Link } from 'react-router-dom'

// import { useDispatch, useSelector } from 'react-redux'
// import { isLogout } from '../../../../../Store/authSlice'
// import useMobileDetection from '../../../../../core/common/mobileDetection'

// const StudentBreadcrumb = () => {
//   const dispatch = useDispatch();
//   const routes = all_routes;
//   const userrole=useSelector((state: any) => state.auth.userObj);
//   const ismobile=useMobileDetection();
//   return (
//     <div className="col-md-12">
//       <div className="d-md-flex d-block align-items-center justify-content-between mb-3">
//         <div className="my-auto mb-2">
//           <h3 className="page-title mb-1">
//             {userrole.role==="student" ?  "Student " :"Parent"} Dashboard
//             </h3>
//           <nav>
//             <ol className="breadcrumb mb-0">
//               <li className="breadcrumb-item">
//                 <Link to={routes.adminDashboard}>Dashboard</Link>
//               </li>
//               <li className="breadcrumb-item">
//                 <Link to={routes.studentList}>Student</Link>
//               </li>
//               <li className="breadcrumb-item active" aria-current="page">
//                 Student Details
//               </li>
//             </ol>
//           </nav>
//         </div>
//         <div className="d-flex my-xl-auto right-content align-items-center  flex-wrap">
//           {
//             userrole.role==="parent" &&(
//               <Link
//               to="#"
//               className="btn btn-light me-2 mb-2"
//               data-bs-toggle="modal"
//               data-bs-target="#login_detail"
//             >
//               <i className="ti ti-lock me-2" />
//               Login Details
//             </Link>
//             )
//           }
//         {!ismobile &&(
//   <Link
//   to={routes.login}
//      className="btn btn-primary d-flex align-items-center mb-2"
//   onClick={()=>dispatch(isLogout())}
// >
//   <i className="ti ti-lock me-2" />

//   logout
// </Link>
//         )}
        
//         </div>
//       </div>
//     </div>
//   )
// }

// export default StudentBreadcrumb




import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { all_routes } from "../../../../../router/all_routes";
import { isLogout } from "../../../../../Store/authSlice";
import { setDataTheme } from "../../../../../Store/themeSettingSlice";
import useMobileDetection from "../../../../../core/common/mobileDetection";

const StudentBreadcrumb = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const dataTheme = useSelector((state: any) => state.themeSetting.dataTheme);
  const user = useSelector((state: any) => state.auth.userObj);
  const isMobile = useMobileDetection();

  const [greeting, setGreeting] = useState("");
  const [message, setMessage] = useState("");

useEffect(() => {
  const hours = new Date().getHours();
  let greet = "";
  let msg = "";

  if (hours < 12) {
    greet = "Good Morning";
    msg = "A new day to learn, grow, and shine 🌞. You've got this!";
  } else if (hours < 17) {
    greet = "Good Afternoon";
    msg = "Keep pushing forward 💪. Every step takes you closer to your goals!";
  } else if (hours < 20) {
    greet = "Good Evening";
    msg = "Well done for making it this far today! Take a breath and keep going 🌇.";
  } else {
    greet = "Good Night";
    msg = "Be proud of your efforts today 🌙. Rest well and rise stronger tomorrow!";
  }

  setGreeting(greet);
  setMessage(msg);
}, []);

  const handleToggleClick = () => {
    dispatch(
      dataTheme === "default_data_theme"
        ? setDataTheme("dark_data_theme")
        : setDataTheme("default_data_theme")
    );
  };

  return (
    <div className="col-md-12">
      <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 mb-3">
     
        <div className="my-auto">
 
    <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-1">
      👋Welcome back, {user?.name || "Teacher"}!
    </h2>


  <p className="text-sm text-gray-600 mt-1 ml-16">
        {greeting} — {message}
  </p>
        </div>

        {/* Theme toggle and logout buttons */}
        <div className="d-flex align-items-center gap-2 flex-wrap">
          {!location.pathname.includes("layout-dark") && (
            <button
              onClick={handleToggleClick}
              className="btn btn-outline-light bg-white btn-icon"
              title="Toggle Theme"
            >
              <i
                className={
                  dataTheme === "default_data_theme"
                    ? "ti ti-moon"
                    : "ti ti-brightness-up"
                }
              />
            </button>
          )}

          {!isMobile && (
            <Link
              to={"/"}
              onClick={() => dispatch(isLogout())}
              className="btn btn-primary d-flex align-items-center"
            >
              <i className="ti ti-logout me-2" />
              Logout
            </Link>
          )}
        </div>
      </div>

    
    
    </div>
  );
};

export default StudentBreadcrumb;
