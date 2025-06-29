
// import React, { useEffect, useState } from "react";
// import { Link} from "react-router-dom";

// import ImageWithBasePath from "../imageWithBasePath";
// import "../../../style/icon/tabler-icons/webfont/tabler-icons.css";

// import {  useSelector } from "react-redux";
// import { jwtDecode } from "jwt-decode";
// import AppConfig from "../../../config/config";
// import BaseApi from "../../../services/BaseApi";


// const SchoolInfo: React.FC = () => {

//   const userObj = useSelector((state: any) => state.auth.userObj);
//   // const token = localStorage.getItem(AppConfig.LOCAL_STORAGE_ACCESS_TOKEN_KEY);
  
//   // const decoded= jwtDecode(token);

//   // const schoolID=decoded.userId;
//   const userRole = userObj?.role; //added to get the role


// const [schoolname,setschoolname]=useState<string>("loding school........");
// const [schoolImage,setSchoolImage]=useState<string>("img.jpg")


// //use this when the data admin or school dashboard is working
// useEffect(()=>{
//   const fetchschoolId=async()=>{
//     const response=await BaseApi.getRequest(`/user/get/${localStorage.getItem("userId")}`);
//     console.log("response",response.data.data.school.schoolName);
//     setschoolname(response.data.data.school.schoolName);
//     setSchoolImage(response.data.data.school.schoolLogo);
    
//   }
//   fetchschoolId();
// },[userRole])

//   if (userRole === "superadmin" ) return null;

//   return (
//     <ul>
//       <li>
//         <Link
//           to="#"
//           className="d-flex align-items-center border bg-white rounded p-2 mb-4"
//         >
//           <ImageWithBasePath
//             src={schoolImage  } 
//             className="avatar avatar-md img-fluid rounded"
//             alt={ "School"}
//           />
//           <span className="text-dark ms-2 fw-normal">
//             {schoolname }
//           </span>
//         </Link>
//       </li>
//     </ul>
//   );
// };

// export default SchoolInfo;

import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import "../../../style/icon/tabler-icons/webfont/tabler-icons.css";

import { useSelector } from "react-redux";
import { jwtDecode } from "jwt-decode";
import AppConfig from "../../../config/config";
import BaseApi from "../../../services/BaseApi";

const SchoolInfo: React.FC = () => {
  const userObj = useSelector((state: any) => state.auth.userObj);
  const userRole = userObj?.role;

  const [schoolName, setSchoolName] = useState<string>("Loading School...");
  const [schoolImage, setSchoolImage] = useState<string>("img.jpg");

  useEffect(() => {
    const fetchSchoolInfo = async () => {


      try {
        // const decoded: any = jwtDecode(token);
        // const userID = decoded?.userId;
        const response = await BaseApi.getRequest(
          `/user/get/${localStorage.getItem("userId")}`);
console.log("in header",response);
        const school = response.data?.data?.school;
        if (school) {
          setSchoolName(school.schoolName?.trim());
          setSchoolImage(school.schoolLogo);
        }
      } catch (error) {
        console.error("Error fetching school info:", error);
      }
    };

    if (userRole !== "superadmin") {
      fetchSchoolInfo();
    }
  }, [userRole]);

  if (userRole === "superadmin") return null;

  return (
    <>
    <ul >
      <li>
        <Link
          to="#"
          className="d-flex align-items-center border bg-white rounded p-2 mb-4"

        >
          <img
            src={schoolImage}
            className="avatar avatar-md img-fluid rounded"
            alt={"School"}
          />
          <span className="text-dark ms-2 fw-normal"  >{schoolName}</span>
        </Link>
      </li>
    </ul>
    </>
  );
};

export default SchoolInfo;

