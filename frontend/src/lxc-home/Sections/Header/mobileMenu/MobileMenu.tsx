import { useState } from "react";
import Data from "../../../assets/data/header/mobileMenu";
import MobileMenuStyleWrapper from "./Menu.style";

//logo images
import LogoImg2 from "../../../assets/images/logo/logo-dark.png";
import { Link } from "react-router-dom";

const MobileMenu = () => {
  const [openSubMenuIndex, setOpenSubMenuIndex] = useState(null);
  const [openChildSubMenuIndex, setOpenChildSubMenuIndex] = useState(null);

  const handleSubmenuOpen = (index) => {
    setOpenSubMenuIndex(openSubMenuIndex === index ? null : index);
    setOpenChildSubMenuIndex(null);
  };

  const handleSubmenuChildOpen = (index) => {
    setOpenChildSubMenuIndex(openChildSubMenuIndex === index ? null : index);
  };

  return (
    <MobileMenuStyleWrapper
      className="offcanvas offcanvas-start"
      tabIndex="-1"
      id="offcanvasStaco"
      aria-labelledby="offcanvasStacoLabel"
    >
      <div className="offcanvas-header">
        <Link className="navbar-brand header-logo" to="/">
          <img src={LogoImg2} alt="logo"  style={{ height: "60px" }}/>
        </Link>
        <button
          type="button"
          className="btn-close"
          data-bs-dismiss="offcanvas"
          aria-label="Close"
        ></button>
      </div>

      <div className="offcanvas-body offcanvasStaco-body">
        <ul className="nav-menu ">
          {Data?.map((menuItem, mid) => {
            let hasSubMenu = false;
            if (menuItem.subMenus?.length > 0) {
              hasSubMenu = true;
            }

            return (
              <li key={mid} className={hasSubMenu ? "has-submenu" : ""}>
                {hasSubMenu ? (
                  <button
                    className={`${hasSubMenu ? "dropdown-item" : ""} ${openSubMenuIndex === mid ? "submenu-opened" : ""
                      }`}
                    onClick={() => handleSubmenuOpen(mid)}
                  >
                    {menuItem.title}
                  </button>
                ) : (
                  <a href={menuItem.url}>{menuItem.title}</a>
                )}

                {menuItem.subMenus?.length > 0 && (
                  <ul
                    className={`sub-menu ${openSubMenuIndex === mid ? "open" : ""
                      }`}
                  >
                    {menuItem.subMenus?.map((subMenuItem, sid) => {
                      let hasSubMenuChild = false;
                      if (subMenuItem.subMenuChilds?.length > 0) {
                        hasSubMenuChild = true;
                      }

                      return (
                        <li
                          key={sid}
                          className={
                            hasSubMenuChild ? "submenu-has-submenu" : ""
                          }
                        >
                          {hasSubMenuChild ? (
                            <button
                              className={`${hasSubMenuChild ? "dropdown-item" : ""
                                } ${openChildSubMenuIndex === sid
                                  ? "submenu-opened"
                                  : ""
                                }`}
                              onClick={() => handleSubmenuChildOpen(sid)}
                            >
                              {subMenuItem.title}
                            </button>
                          ) : (
                            <a href={subMenuItem.url}>{subMenuItem.title}</a>
                          )}

                          {subMenuItem.subMenuChilds?.length > 0 && (
                            <ul
                              className={`sub-menu ${openChildSubMenuIndex === sid ? "open" : ""
                                }`}
                            >
                              {subMenuItem.subMenuChilds?.map(
                                (subMenuChild, smcid) => (
                                  <li key={smcid}>
                                    <a href={subMenuChild.url}>
                                      {subMenuChild.title}
                                    </a>
                                  </li>
                                )
                              )}
                            </ul>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </MobileMenuStyleWrapper>
  );
};

export default MobileMenu;
