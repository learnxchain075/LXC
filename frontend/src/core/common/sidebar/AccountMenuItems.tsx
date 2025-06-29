import { Fragment, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { setDataLayout } from "../../../Store/themeSettingSlice";
import { useAppDispatch, useAppSelector } from "../../../Store/hooks";
import { all_routes } from "../../../router/all_routes";
import { getBaseUrl } from "../../../utils/general";

const AccountMenuItems = () => {
  const location = useLocation();
  const dispatch = useAppDispatch();
  const isLoggedIn = useAppSelector((state) => state.auth.isLoggedIn);
  const userObj = useAppSelector((state) => state.auth.userObj);
  const userPermissions = useAppSelector((state) => state.auth.userPermissions);

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
              className={`${subOpen === "Dashboard" ? "subdrop" : ""} ${
                getBaseUrl(isLoggedIn, userObj!.role) === location.pathname
                  ? "active"
                  : ""
              }`}
            >
              <i className="ti ti-layout-dashboard"></i>
              <span>Dashboard</span>
            </Link>
          </li>

          <li className="submenu">
            <Link
              to={all_routes.requestFeatures}
              onClick={() =>
                handleClick(
                  "Feature Request",
                  undefined,
                  getLayoutClass("Feature Request")
                )
              }
              className={`${subOpen === "Feature Request" ? "subdrop" : ""} ${
                all_routes.requestFeatures === location.pathname ? "active" : ""
              }`}
            >
              <i className="ti ti-layout-dashboard"></i>
              <span>Feature Request</span>
            </Link>
          </li>
        </ul>
      </li>

      {userObj && userObj.role && userPermissions ? (
        <Fragment>
          {/* HRM Module */}
          {userPermissions["HRMModule"] &&
          userPermissions["HRMModule"].access ? (
            <li>
              <h6 className="submenu-hdr">
                <span>HRM</span>
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
                    className={`${subOpen === "Add School" ? "subdrop" : ""} ${
                      all_routes.addSchools === location.pathname
                        ? "active"
                        : ""
                    }`}
                  >
                    <i className="ti ti-page-break"></i>
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
                    className={`${
                      subOpen === "Feature Requests List" ? "subdrop" : ""
                    } ${
                      all_routes.featuresRequestList === location.pathname
                        ? "active"
                        : ""
                    }`}
                  >
                    <i className="ti ti-page-break"></i>
                    <span>Feature Requests List</span>
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
                    className={`${
                      subOpen === "Get All Schools" ? "subdrop" : ""
                    } ${
                      all_routes.getSchools === location.pathname
                        ? "active"
                        : ""
                    }`}
                  >
                    <i className="ti ti-page-break"></i>
                    <span>Get All Schools</span>
                  </Link>
                </li>
              </ul>
            </li>
          ) : null}
        </Fragment>
      ) : null}
    </ul>
  );
};

export default AccountMenuItems;
