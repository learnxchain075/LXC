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
            <li className="submenu">
              <Link
                to={all_routes.superAdminUsageAnalytics}
                onClick={() => handleClick("Usage Analytics", undefined, getLayoutClass("Usage Analytics"))}
                className={`${subOpen === "Usage Analytics" ? "subdrop" : ""} ${all_routes.superAdminUsageAnalytics === location.pathname ? "active" : ""}`}
              >
                <i className="ti ti-chart-bar"></i>
                <span>Usage Analytics</span>
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
              <i className="ti ti-message-plus"></i>

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
          <li className="submenu">
            <Link
              to={all_routes.addEmployee}
              onClick={() =>
                handleClick("Register Employee", undefined, getLayoutClass("Register Employee"))
              }
              className={`${subOpen === "Register Employee" ? "subdrop" : ""} ${all_routes.addEmployee === location.pathname ? "active" : ""}`}
            >
              <i className="ti ti-user-plus"></i>
              <span>Register Employee</span>
            </Link>
          </li>
          <li className="submenu">
            <Link
              to={all_routes.getEmployees}
              onClick={() =>
                handleClick("Get All Employees", undefined, getLayoutClass("Get All Employees"))
              }
              className={`${subOpen === "Get All Employees" ? "subdrop" : ""} ${all_routes.getEmployees === location.pathname ? "active" : ""}`}
            >
              <i className="ti ti-users"></i>
              <span>Get All Employees</span>
            </Link>
          </li>
          <li className="submenu">
            <Link
              to={all_routes.projectDashboard}
              onClick={() =>
                handleClick("Projects", undefined, getLayoutClass("Projects"))
              }
              className={`${subOpen === "Projects" ? "subdrop" : ""} ${all_routes.projectDashboard === location.pathname ? "active" : ""}`}
            >
              <i className="ti ti-briefcase"></i>
              <span>Project Dashboard</span>
            </Link>
          </li>
          {/* <li className="submenu">
            <Link
              to={all_routes.taskBoard}
              onClick={() =>
                handleClick("Task Board", undefined, getLayoutClass("Task Board"))
              }
              className={`${subOpen === "Task Board" ? "subdrop" : ""} ${all_routes.taskBoard === location.pathname ? "active" : ""}`}
            >
              <i className="ti ti-layout-kanban"></i>
              <span>Task Board</span>
            </Link>
          </li>
          <li className="submenu">
            <Link
              to={all_routes.backlog}
              onClick={() =>
                handleClick("Backlog", undefined, getLayoutClass("Backlog"))
              }
              className={`${subOpen === "Backlog" ? "subdrop" : ""} ${all_routes.backlog === location.pathname ? "active" : ""}`}
            >
              <i className="ti ti-list"></i>
              <span>Backlog</span>
            </Link>
          </li>
          <li className="submenu">
            <Link
              to={all_routes.sprintPlanning}
              onClick={() =>
                handleClick("Sprint Planning", undefined, getLayoutClass("Sprint Planning"))
              }
              className={`${subOpen === "Sprint Planning" ? "subdrop" : ""} ${all_routes.sprintPlanning === location.pathname ? "active" : ""}`}
            >
              <i className="ti ti-calendar-event"></i>
              <span>Sprint Planning</span>
            </Link>
          </li>
          <li className="submenu">
            <Link
              to={all_routes.sprintReport}
              onClick={() =>
                handleClick("Sprint Report", undefined, getLayoutClass("Sprint Report"))
              }
              className={`${subOpen === "Sprint Report" ? "subdrop" : ""} ${all_routes.sprintReport === location.pathname ? "active" : ""}`}
            >
              <i className="ti ti-report"></i>
              <span>Sprint Report</span>
            </Link>
          </li>
          <li className="submenu">
            <Link
              to={all_routes.tasksList}
              onClick={() =>
                handleClick("Tasks", undefined, getLayoutClass("Tasks"))
              }
              className={`${subOpen === "Tasks" ? "subdrop" : ""} ${all_routes.tasksList === location.pathname ? "active" : ""}`}
            >
              <i className="ti ti-checklist"></i>
              <span>Tasks</span>
            </Link>
          </li>
          <li className="submenu">
            <Link
              to={all_routes.taskCalendar}
              onClick={() =>
                handleClick("Task Calendar", undefined, getLayoutClass("Task Calendar"))
              }
              className={`${subOpen === "Task Calendar" ? "subdrop" : ""} ${all_routes.taskCalendar === location.pathname ? "active" : ""}`}
            >
              <i className="ti ti-calendar"></i>
              <span>Task Calendar</span>
            </Link>
          </li>
          <li className="submenu">
            <Link
              to={all_routes.projectDemo}
              onClick={() =>
                handleClick("Project Demo", undefined, getLayoutClass("Project Demo"))
              }
              className={`${subOpen === "Project Demo" ? "subdrop" : ""} ${all_routes.projectDemo === location.pathname ? "active" : ""}`}
            >
              <i className="ti ti-presentation"></i>
              <span>Project Demo</span>
            </Link>
          </li> */}
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
              <i className="ti ti-discount-2"></i>

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
              className={`${subOpen === "Feedback" ? "subdrop" : ""} ${all_routes.testimonials === location.pathname ? "active" : ""}`}
            >
              <i className="ti ti-quote"></i>
              <span>Feedback</span>
            </Link>
          </li>
          <li className="submenu">
            <Link
              to={all_routes.demoRequest}
              onClick={() =>
                handleClick("Demo Request", undefined, getLayoutClass("Demo Request"))
              }
              className={`${subOpen === "Demo Request" ? "subdrop" : ""} ${all_routes.demoRequest === location.pathname ? "active" : ""}`}
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
              className={`${subOpen === "Tickets" ? "subdrop" : ""} ${all_routes.tickets === location.pathname ? "active" : ""}`}
            >
              <i className="ti ti-ticket"></i>
              <span>Tickets</span>
            </Link>
          </li>
          <li className="submenu">
            <Link
              to={all_routes.contactMessages}
              onClick={() =>
                handleClick("Contact Messages", undefined, getLayoutClass("Contact Messages"))
              }
              className={`${subOpen === "Contact Messages" ? "subdrop" : ""} ${all_routes.contactMessages === location.pathname ? "active" : ""}`}
            >
              <i className="ti ti-ticket"></i>
              <span>Contact Messages</span>
            </Link>
          </li>
          <li className="submenu">
            <Link
              to={all_routes.logs}
              onClick={() =>
                handleClick("Logs", undefined, getLayoutClass("Logs"))
              }
              className={`${subOpen === "Logs" ? "subdrop" : ""} ${all_routes.logs === location.pathname ? "active" : ""}`}
            >
              <i className="ti ti-ticket"></i>
              <span>Logs</span>
            </Link>
          </li>
        </ul>
        </li>
      

      {/* company Accoutns  */}

      <li>
        <span className="submenu-hdr"> Accounts</span>
        <ul>
          <li className="submenu">
            <Link
              to={all_routes.companyAccounts}
              onClick={() =>
                handleClick("All Transactions", undefined, getLayoutClass("All Transactions"))
              }
              className={`${subOpen === "All Transactions" ? "subdrop" : ""} ${all_routes.companyAccounts === location.pathname ? "active" : ""
                }`}
            >
              <i className="ti ti-list-details"></i>
              <span>All Transactions</span>
            </Link>
          </li>

          <li className="submenu">
            <Link
              to={all_routes.companyAccountsAdd}
              onClick={() =>
                handleClick("Add Transaction", undefined, getLayoutClass("Add Transaction"))
              }
              className={`${subOpen === "Add Transaction" ? "subdrop" : ""} ${all_routes.companyAccountsAdd === location.pathname ? "active" : ""
                }`}
            >
              <i className="ti ti-circle-plus"></i>
              <span>Add Transaction</span>
            </Link>
          </li>

          <li className="submenu">
            <Link
              to={all_routes.companyAccountsSummary}
              onClick={() =>
                handleClick("Summary", undefined, getLayoutClass("Summary"))
              }
              className={`${subOpen === "Summary" ? "subdrop" : ""} ${all_routes.companyAccountsSummary === location.pathname ? "active" : ""
                }`}
            >
              <i className="ti ti-chart-bar"></i>
              <span>Summary</span>
            </Link>
          </li>
        </ul>
      </li>


  <li>
        <ul>
          <li className="submenu">
            <Link
              to={all_routes.profile}
              onClick={() =>
                handleClick("Profile", undefined, getLayoutClass("Profile"))
              }
              className={`${subOpen === "Profile" ? "subdrop" : ""} ${all_routes.profile === location.pathname ? "active" : ""
                }`}
            >
              <i className="ti ti-user"></i>
              <span>My Profile</span>
            </Link>
          </li>
        <li className="submenu">
          <Link to={all_routes.superNotificationTemplates} className={`${all_routes.superNotificationTemplates === location.pathname ? "active" : ""}`}>
            <i className="ti ti-bell"></i>
            <span>Notification Templates</span>
          </Link>
        </li>
        <li className="submenu">
          <Link to={all_routes.superNotificationLogs} className={`${all_routes.superNotificationLogs === location.pathname ? "active" : ""}`}>
            <i className="ti ti-list"></i>
            <span>Notification Logs</span>
          </Link>
        </li>
        </ul>
      </li>
    </ul>
  );
};

export default SuperAdminMenuItems;
