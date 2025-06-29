import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { setDataLayout } from "../../../Store/themeSettingSlice";
import { useAppDispatch, useAppSelector } from "../../../Store/hooks";
import { all_routes } from "../../../router/all_routes";
import { getBaseUrl } from "../../../utils/general";

const SuperAdminMenuItems = () => {
  const location = useLocation();
  const dispatch = useAppDispatch();
  const isLoggedIn = useAppSelector((state) => state.auth.isLoggedIn);
  const userObj = useAppSelector((state) => state.auth.userObj);

  const [subOpen, setSubopen] = useState<any>("");
  const [subsidebar, setSubsidebar] = useState("");

  const toggleSidebar = (title: any) => {
    localStorage.setItem("menuOpened", title);
    if (title === subOpen) {
      setSubopen("");
    } else {
      setSubopen(title);
    }
  };

  const toggleSubsidebar = (subitem: any) => {
    if (subitem === subsidebar) {
      setSubsidebar("");
    } else {
      setSubsidebar(subitem);
    }
  };

  const handleLayoutChange = (layout: string) => {
    dispatch(setDataLayout(layout));
  };

  const handleClick = (label: any, themeSetting: any, layout: any) => {
    toggleSidebar(label);
    if (themeSetting) {
      handleLayoutChange(layout);
    }
  };

  const getLayoutClass = (label: any) => {
    switch (label) {
      case "Default":
        return "default_layout";
      case "Mini":
        return "mini_layout";
      case "Box":
        return "boxed_layout";
      case "Dark":
        return "dark_data_theme";
      case "RTL":
        return "rtl";
      default:
        return "";
    }
  };

  return (
    <ul>
      <li>
        <h6 className="submenu-hdr">
          <span>MAIN</span>
        </h6>
        <ul>
          <li className="submenu">
            <Link
              to={getBaseUrl(isLoggedIn, userObj!.role)}
              onClick={() =>
                handleClick("Dashboard", undefined, getLayoutClass("Dashboard"))
              }
              className={`${subOpen === "Dashboard" ? "subdrop" : ""} ${getBaseUrl(isLoggedIn, userObj!.role) === location.pathname
                ? "active"
                : ""
                }`}
            >
              <i className="ti ti-layout-dashboard"></i>
              <span>Dashboard</span>
              {/* <span className="menu-arrow" /> */}
            </Link>
          </li>

          {/* <li className="submenu">
            <Link
              to="#"
              onClick={() =>
                handleClick(
                  "Application",
                  undefined,
                  getLayoutClass("Application")
                )
              }
              className={`${subOpen === "Application" ? "subdrop" : ""}`}
            >
              <i className="ti ti-layout-list"></i>
              <span>Application</span>
              <span className="menu-arrow" />
            </Link>
            <ul
              style={{
                display: subOpen === "Application" ? "block" : "none",
              }}
            >
              <li className="">
                <Link
                  to={all_routes.chat}
                  className={`${all_routes.chat === location.pathname ? "active" : ""
                    }`}
                  onClick={() => {
                    toggleSubsidebar("Chat");
                  }}
                >
                  Chat
                </Link>
              </li>
              <li className="">
                <Link
                  to={all_routes.calendar}
                  className={`${all_routes.calendar === location.pathname ? "active" : ""
                    }`}
                  onClick={() => {
                    toggleSubsidebar("Calendar");
                  }}
                >
                  Calendar
                </Link>
              </li>
              <li className="">
                <Link
                  to={all_routes.todo}
                  className={`${all_routes.todo === location.pathname ? "active" : ""
                    }`}
                  onClick={() => {
                    toggleSubsidebar("To Do");
                  }}
                >
                  To Do
                </Link>
              </li>
              <li className="">
                <Link
                  to={all_routes.notes}
                  className={`${all_routes.notes === location.pathname ? "active" : ""
                    }`}
                  onClick={() => {
                    toggleSubsidebar("Notes");
                  }}
                >
                  Notes
                </Link>
              </li>
              <li className="">
                <Link
                  to={all_routes.fileManager}
                  className={`${all_routes.fileManager === location.pathname ? "active" : ""
                    }`}
                  onClick={() => {
                    toggleSubsidebar("File Manager");
                  }}
                >
                  File Manager
                </Link>
              </li>
            </ul>
          </li> */}
        </ul>
      </li>

      <li>
        <h6 className="submenu-hdr">
          <span>School</span>
        </h6>
        <ul>
          <li className="submenu">
            <Link
              to={all_routes.addSchools}
              onClick={() =>
                handleClick(
                  "Add School",
                  undefined,
                  getLayoutClass("Add School")
                )
              }
              className={`${subOpen === "Add School" ? "subdrop" : ""} ${all_routes.addSchools === location.pathname ? "active" : ""
                }`}
            >
              <i className="ti  ti-home"></i>
              <span>Add School</span>
            </Link>
          </li>
          <li className="submenu">
            <Link
              to={all_routes.featuresRequestList}
              onClick={() =>
                handleClick(
                  "Feature Requests List",
                  undefined,
                  getLayoutClass("Feature Requests List")
                )
              }
              className={`${subOpen === "Feature Requests List" ? "subdrop" : ""
                } ${all_routes.featuresRequestList === location.pathname
                  ? "active"
                  : ""
                }`}
            >
              <i className="ti ti-light-bulb"></i>
              <span>Feature Requests List</span>
            </Link>
          </li>

          <li className="submenu">
            <Link
              to={all_routes.schoolPlanSubscription}
              onClick={() =>
                handleClick(
                  "Grant Plan Access",
                  undefined,
                  getLayoutClass("Grant Plan Access")
                )
              }
              className={`${subOpen === "Grant Plan Access" ? "subdrop" : ""
                } ${all_routes.schoolPlanSubscription === location.pathname ? "active" : ""
                }`}
            >
              <i className="ti ti-rocket"></i>
              <span>Grant Plan Access</span>
            </Link>
          </li>

          <li className="submenu">
            <Link
              to={all_routes.getSchools}
              onClick={() =>
                handleClick(
                  "Get All Schools",
                  undefined,
                  getLayoutClass("Get All Schools")
                )
              }
              className={`${subOpen === "Get All Schools" ? "subdrop" : ""} ${all_routes.getSchools === location.pathname ? "active" : ""
                }`}
            >
              <i className="ti ti-page-break"></i>
              <span>Get All Schools</span>
            </Link>
          </li>
        </ul>
      </li>

      <li>
        <h6 className="submenu-hdr">
          <span>Manage Membership</span>
        </h6>
        <ul>
          <li className="submenu">
            <Link
              to={all_routes.membershipplan}
              onClick={() =>
                handleClick(
                  "Membership Plans",
                  undefined,
                  getLayoutClass("Membership Plans")
                )
              }
              className={`${subOpen === "Membership Plans" ? "subdrop" : ""} ${all_routes.membershipplan === location.pathname ? "active" : ""
                }`}
            >
              <i className="ti ti-user-plus"></i>
              <span>Membership Plans</span>
            </Link>
          </li>
          <li className="submenu">
            <Link
              to={all_routes.membershipTransaction}
              onClick={() =>
                handleClick(
                  "Transactions",
                  undefined,
                  getLayoutClass("Transactions")
                )
              }
              className={`${subOpen === "Transactions" ? "subdrop" : ""} ${all_routes.membershipTransaction === location.pathname
                ? "active"
                : ""
                }`}
            >
              <i className="ti ti-file-power"></i>
              <span>Transactions</span>
            </Link>
          </li>
          <li className="submenu">
            <Link
              to={all_routes.CouponManager}
              onClick={() =>
                handleClick(
                  "CouponCode",
                  undefined,
                  getLayoutClass("CouponCode")
                )
              }
              className={`${subOpen === "CouponCode" ? "subdrop" : ""} ${all_routes.CouponManager === location.pathname
                ? "active"
                : ""
                }`}
            >
              <i className="ti ti-file-coupon"></i>
              <span>Coupon Code</span>
            </Link>
          </li>
        </ul>
      </li>

      <li>
        <h6 className="submenu-hdr">
          <span>CONTENT</span>
        </h6>
        <ul>
          <li className="submenu">
            <Link
              to={all_routes.testimonials}
              onClick={() =>
                handleClick("Feedback", undefined, getLayoutClass("Feedback"))
              }
              className={`${subOpen === "Feedback" ? "subdrop" : ""} ${all_routes.testimonials === location.pathname ? "active" : ""
                }`}
            >
              <i className="ti ti-quote"></i>
              <span>Feedback</span>
            </Link>
          </li>
        </ul>

        <ul>
          <li className="submenu">
            <Link
              to={all_routes.demoRequest}
              onClick={() =>
                handleClick("Demo Request", undefined, getLayoutClass("Demo Request"))
              }
              className={`${subOpen === "Demo Request" ? "subdrop" : ""} ${all_routes.demoRequest === location.pathname ? "active" : ""
                }`}
            >
              <i className="ti ti-calendar-check"></i>
              <span>Demo Request</span>
            </Link>
          </li>
        </ul>

      </li>

      <li>
        <h6 className="submenu-hdr">
          <span>Support</span>
        </h6>
        <ul>
          <li className="submenu">
            <Link
              to={all_routes.tickets}
              onClick={() =>
                handleClick("Tickets", undefined, getLayoutClass("Tickets"))
              }
              className={`${subOpen === "Tickets" ? "subdrop" : ""} ${all_routes.tickets === location.pathname ? "active" : ""
                }`}
            >
              <i className="ti ti-ticket"></i>
              <span>Tickets</span>
            </Link>
          </li>
        </ul>

        <ul>
          <li className="submenu">
            <Link
              to={all_routes.contactMessages}
              onClick={() =>
                handleClick("contact messages", undefined, getLayoutClass("contact message"))
              }
              className={`${subOpen === "contact messages" ? "subdrop" : ""} ${all_routes.contactMessages === location.pathname ? "active" : ""
                }`}
            >
              <i className="ti ti-ticket"></i>
              <span>contact message</span>
            </Link>
          </li>
        </ul>

        <ul>
          <li className="submenu">
            <Link
              to={all_routes.logs}
              onClick={() =>
                handleClick("Logs messages", undefined, getLayoutClass("Logs "))
              }
              className={`${subOpen === "Logs messages" ? "subdrop" : ""} ${all_routes.logs === location.pathname ? "active" : ""
                }`}
            >
              <i className="ti ti-ticket"></i>
              <span>Logs messages</span>
            </Link>
          </li>
        </ul>
      </li>
    </ul>
  );
};

export default SuperAdminMenuItems;
