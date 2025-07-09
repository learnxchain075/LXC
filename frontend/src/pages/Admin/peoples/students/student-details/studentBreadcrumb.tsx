import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { all_routes } from "../../../../../router/all_routes";
import { isLogout } from "../../../../../Store/authSlice";
import { setDataTheme } from "../../../../../Store/themeSettingSlice";
import useMobileDetection from "../../../../../core/common/mobileDetection";

interface AuthState {
  userObj?: {
    name?: string;
    role?: string;
  };
}

interface ThemeState {
  dataTheme: 'default_data_theme' | 'dark_data_theme';
}

interface RootState {
  auth: AuthState;
  themeSetting: ThemeState;
}


const LEARNXCHAIN_LOGO = '/faviconLxc-home.png';
const FALLBACK_LOGO = '/assets/img/logo.png';


const GREETING_MESSAGES = {
  morning: { greet: "Good Morning", msg: "A new day to learn, grow, and shine 🌞. You've got this!" },
  afternoon: { greet: "Good Afternoon", msg: "Keep pushing forward 💪. Every step takes you closer to your goals!" },
  evening: { greet: "Good Evening", msg: "Well done for making it this far today! Take a breath and keep going 🌇." },
  night: { greet: "Good Night", msg: "Be proud of your efforts today 🌙. Rest well and rise stronger tomorrow!" }
};

const StudentBreadcrumb: React.FC = () => {
  const location = useLocation();
  const dispatch = useDispatch();

  const dataTheme = useSelector((state: RootState) => state.themeSetting.dataTheme);
  const user = useSelector((state: RootState) => state.auth.userObj);
  const isMobile = useMobileDetection();

  const [greeting, setGreeting] = useState("");
  const [message, setMessage] = useState("");
  const [logoError, setLogoError] = useState(false);

  useEffect(() => {
    const hours = new Date().getHours();
    let timeOfDay: keyof typeof GREETING_MESSAGES;

    if (hours < 12) {
      timeOfDay = 'morning';
    } else if (hours < 17) {
      timeOfDay = 'afternoon';
    } else if (hours < 20) {
      timeOfDay = 'evening';
    } else {
      timeOfDay = 'night';
    }

    const { greet, msg } = GREETING_MESSAGES[timeOfDay];
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

  const handleLogout = () => {
    try {
      dispatch(isLogout());
    } catch (error) {
     
    }
  };

  const handleLogoError = () => {
    setLogoError(true);
  };

  const userName = user?.name || 'Student';
  const isDark = dataTheme === 'dark_data_theme';

  return (
    <div className="col-md-12">
      <div className="d-flex align-items-center justify-content-between flex-wrap gap-3 mb-4">
       
        <div className="d-flex align-items-center gap-4 my-auto">
 
          <div className="d-flex align-items-center gap-3">
            <div
              style={{
                width: 56,
                height: 56,
                borderRadius: '50%',
                background: isDark
                  ? 'linear-gradient(135deg, #23233a 60%, #3a3a5a 100%)'
                  : 'linear-gradient(135deg, #fff 60%, #e0e7ff 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 16px rgba(60,60,120,0.10)',
                border: isDark ? '2px solid #444' : '2px solid #e0e7ff',
                transition: 'all 0.3s ease',
              }}
            >
              <img
                src={logoError ? FALLBACK_LOGO : LEARNXCHAIN_LOGO}
                alt="LearnXChain Logo"
                onError={handleLogoError}
                style={{ 
                  width: 40, 
                  height: 40, 
                  borderRadius: '50%',
                  objectFit: 'cover'
                }}
              />
            </div>
           
          </div>

        

          {/* Greeting */}
          <div>
            <h2 className={`text-2xl font-semibold mb-1${isDark ? ' text-light' : ' text-gray-800'}`}>
              👋Welcome back, {userName}!
            </h2>
            <p className={`text-sm mt-1${isDark ? ' text-secondary' : ' text-gray-600'}`}>
              {greeting} — {message}
            </p>
          </div>
        </div>

        <div className="d-flex align-items-center gap-2 flex-wrap">
          {!location.pathname.includes('layout-dark') && (
            <button
              onClick={handleToggleClick}
              className={`btn btn-outline-light btn-icon${isDark ? ' bg-dark border-secondary' : ' bg-white'}`}
              title="Toggle Theme"
              style={{ transition: 'all 0.3s ease' }}
            >
              <i
                className={
                  dataTheme === 'default_data_theme'
                    ? 'ti ti-moon'
                    : 'ti ti-brightness-up'
                }
              />
            </button>
          )}

          {!isMobile && (
            <Link
              to={"/"}
              onClick={handleLogout}
              className="btn btn-primary d-flex align-items-center"
              style={{ transition: 'all 0.3s ease' }}
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
