// import React, { useState, useEffect } from "react";
// import { Link } from "react-router-dom";

// interface GreetingComponentProps {
//   userName: string;
// }

// const GreetingComponent: React.FC<GreetingComponentProps> = ({ userName }) => {
//   const [greeting, setGreeting] = useState<string>("");
//   const [currentTime, setCurrentTime] = useState<string>("");
//   const [dayMessage, setDayMessage] = useState<string>("");

//   useEffect(() => {
//     const hours = new Date().getHours();
//     let greet = "";
//     let message = "";

//     if (hours < 12) {
//       greet = "Good Morning";
//       message = "Have a productive day!";
//     } else if (hours < 17) {
//       greet = "Good Afternoon";
//       message = "Hope you're having a good afternoon!";
//     } else if (hours < 20) {
//       greet = "Good Evening";
//       message = "Hope you had a good day!";
//     } else {
//       greet = "Good Night, Soo Ja";
//       message = "It's night, time to relax!";
//     }

//     setGreeting(greet);
//     setDayMessage(message);
//     setCurrentTime(new Date().toLocaleString());
//   }, []);

//   return (
//     <div className="card-body">
//       <div className="d-flex align-items-xl-center justify-content-xl-between flex-xl-row flex-column">
//         <div className="mb-3 mb-xl-0">
//           <div className="d-flex align-items-center flex-wrap mb-2">
//             <h1 className="text-white me-2">{greeting}, {userName}</h1>
//             <Link to="/profile" className="avatar avatar-sm img-rounded bg-gray-800 dark-hover">
//               <i className="ti ti-edit text-white" />
//             </Link>
//           </div>
//           <p className="text-white">{dayMessage}</p>
//         </div>
//         <p className="text-white custom-text-white">
//           <i className="ti ti-refresh me-1" /> Updated Recently on {currentTime}
//         </p>
//       </div>
//     </div>
//   );
// };

// export default GreetingComponent;
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

interface GreetingComponentProps {
  userName: string;
}

const GreetingComponent: React.FC<GreetingComponentProps> = ({ userName }) => {
  const [greeting, setGreeting] = useState<string>("");
  const [dayMessage, setDayMessage] = useState<string>("");
  const [currentTime, setCurrentTime] = useState<string>("");
  const role = useSelector((state: any) => state.auth.userObj.role);
  //console.log("role",role);
  useEffect(() => {
    const hours = new Date().getHours();
    let greet = "";
    let message = "";

    if (hours < 12) {
      greet = "Good Morning";
      message = "Time to rise and shine! Make today awesome!";
    } else if (hours < 17) {
      greet = "Good Afternoon";
      message = "Hope you're having a productive day!";
    } else if (hours < 20) {
      greet = "Good Evening";
      message = "Winding down, but still plenty of time to achieve!";
    } else {
      greet = "Good Night";
      message = "Rest up, you've earned it!";
    }

    setGreeting(greet);
    setDayMessage(message);


    const formattedTime = new Intl.DateTimeFormat("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
    }).format(new Date());

    setCurrentTime(formattedTime);
  }, []);
  // console.log("object",greeting, userName);
  return (
    <>
      {role !== "admin" ? (
        <div className="card-body">
          <div className="d-flex align-items-xl-center justify-content-xl-between flex-xl-row flex-column">
            <div className="mb-3 mb-xl-0">
              <div className="d-flex align-items-center flex-wrap mb-2">
                <h1 className="text-white me-2">{greeting}, {userName}</h1>
                <Link to="/pages/profile" className="avatar avatar-sm img-rounded bg-gray-800 dark-hover">
                  <i className="ti ti-edit text-white" />
                </Link>
              </div>
              <p className="text-white">{dayMessage}</p>
            </div>
            <p className="text-white custom-text-white">
              <i className="ti ti-refresh me-1" /> Updated Recently on {currentTime}
            </p>
          </div>
        </div>
      ) : (
        <h3 className="page-title mb-1">   {greeting}, {userName}</h3>

      )}
    </>
  );
};

export default GreetingComponent;
