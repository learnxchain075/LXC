import { useEffect, useRef, useState } from "react";
import { NavLink } from "react-router-dom";
import HeaderStyleWrapper from "./Header.style";
import Data from "../../assets/data/header/headerHomeMenu";
import MegaMenu from "./MegaMenu";

import MobileMenu from "./mobileMenu/MobileMenu";

//logo images
import LogoImg1 from "../../assets/images/logo/logo-lights.png";
import LogoImg2 from "../../assets/images/logo/logo-dark.png";




import MenuImg from "../../assets/images/icons/menu.svg";
import PropTypes from "prop-types";

interface HeaderProps {
  variant?: string;
  [key: string]: any;
}

const Header = ({ variant, ...props }: HeaderProps) => {
  // handle mobile menu
  const [isMobileMenu, setIsMobileMenu] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [isAnimating, setIsAnimating] = useState(false);

  //   const handleMobileMenu = () => {
  //   const bodySection = document.body;

  //   if (isMobileMenu) {
  //     setIsAnimating(true);
  //     bodySection.classList.remove("nav-expanded");

  //     setTimeout(() => {
  //       setIsMobileMenu(false);
  //       setIsAnimating(false);
  //     }, 400);
  //   } else {
  //     setIsMobileMenu(true);
  //     bodySection.classList.add("nav-expanded");
  //   }
  // };

  // handle sticky header
  const HeaderSectionRef = useRef(null);
  const lastScroll = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const bodySection = document.body;

      let currentScroll =
        document.documentElement.scrollTop || document.body.scrollTop;
      let diffScroll = currentScroll - lastScroll.current;

      if (diffScroll > 0 || currentScroll === 0) {
        HeaderSectionRef.current.classList.remove("sticky");
        bodySection.classList.remove("nav-expanded");
        setIsMobileMenu(false);
      } else {
        HeaderSectionRef.current.classList.add("sticky");
      }
      lastScroll.current = currentScroll;
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  //   useEffect(() => {
  //   window.addEventListener("scroll", handleScroll);

  //   return () => {
  //     window.removeEventListener("scroll", handleScroll);
  //   };
  // }, []);

  return (
    <>
      <HeaderStyleWrapper
        ref={HeaderSectionRef}
        className={`header-section ${variant} ${isMobileMenu ? "mobile-menu-opened" : ""
          }`}
        variant={variant}
        {...props}
      >
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <nav className="navbar navbar-expand-lg">
                <div className="container header-navbar-container">
                  {/* header logo area start */}
                  <NavLink className="navbar-brand header-logo" to={"/"}>
                    <div className="d-flex align-items-center gap-2">
                      <>
                        <div>
                          <img
                            src={LogoImg1}
                            alt="logo"
                            className="logo-light img-fluid"
                            style={{ height: "70px" }}
                          />
                        </div>
                        <img
                          src={LogoImg2}
                          alt="logo"
                          className="logo-dark img-fluid"
                          style={{ height: "60px" }}
                        />
                        {/* <span className="fw-bold fs-5 text-white">LearnXChain</span> */}
                      </>
                    </div>



                  </NavLink>
                  {/* header logo area end */}

                  {/* menu toggler */}
                  {/* <button className="menu-toggler" onClick={handleMobileMenu}>
                    <img
                      src={`${isMobileMenu ? MenuCloseImg : MenuImg}`}
                      alt={`${isMobileMenu ? "close" : "menu"}`}
                    />
                  </button> */}

                  {/* menu toggler */}
                  <div className="menu-toggler">
                    {/* Button to toggle the Offcanvas */}
                    <button
                      className="btn"
                      type="button"
                      data-bs-toggle="offcanvas"
                      data-bs-target="#offcanvasStaco"
                      aria-controls="offcanvasStaco"
                    >
                      <img src={MenuImg} alt="menu" />
                    </button>
                  </div>

                  <div className="collapse navbar-collapse header-navbar-content">
                    {/* main menu */}
                    <ul className="navbar-nav main-menu">
                      {Data?.map((menuItem, i) => {
                        const shouldRenderMegaMenu = menuItem?.hasMegaMenu && menuItem.title !== "Home";
                        return (
                          <li
                            key={i}
                            className={shouldRenderMegaMenu ? "nav-item home-nav" : "nav-item"}
                          >
                            {/* <NavLink
                              className={` ${shouldRenderMegaMenu ? "nav-link megaTablinks" : "nav-link"
                                } ${menuItem.subMenus?.length > 0 ? "has-submenu" : ""}`}
                              to={menuItem.title === "Home" ? "/" : menuItem.url}
                              exact={menuItem.title === "Home"}
                            >
                              {menuItem.title}
                            </NavLink> */}

                            <NavLink
  to={menuItem.title === "Home" ? "/" : menuItem.url}
  className={({ isActive }) => {
    const baseClasses = `nav-link ${shouldRenderMegaMenu ? "megaTablinks" : ""} ${menuItem.subMenus?.length ? "has-submenu" : ""}`;
    const shouldApplyActive = isActive && menuItem.title !== "Home" && menuItem.title !== "Pages";
    return shouldApplyActive ? `${baseClasses} active` : baseClasses;
  }}
>
  {menuItem.title}
</NavLink>


                            {/* megamenu */}
                            {shouldRenderMegaMenu && <MegaMenu />}

                            {menuItem.subMenus?.length > 0 && (
                              <div className="submenu-box">
                                <ul className="submenu">
                                  {menuItem.subMenus?.map((subMenuItem, i) => {
                                    let hasSubMenuChild = false;
                                    if (subMenuItem.subMenuChilds?.length > 0) {
                                      hasSubMenuChild = true;
                                    }
                                    return (
                                      <li
                                        key={i}
                                        className={hasSubMenuChild ? "submenu-has-submenu" : ""}
                                      >
                                        <NavLink
                                          className="dropdown-item"
                                          to={subMenuItem.url}
                                        >
                                          {subMenuItem.title}
                                        </NavLink>

                                        {subMenuItem.subMenuChilds?.length > 0 && (
                                          <div className="submenu-box2">
                                            <ul className="submenu submenu-submenu">
                                              {subMenuItem.subMenuChilds?.map(
                                                (subMenuChild, i) => (
                                                  <li key={i}>
                                                    <NavLink to={subMenuChild.url}>
                                                      {subMenuChild.title}
                                                    </NavLink>
                                                  </li>
                                                )
                                              )}
                                            </ul>
                                          </div>
                                        )}
                                      </li>
                                    );
                                  })}
                                </ul>
                              </div>
                            )}
                          </li>
                        );
                      })}
                    </ul>

                    {/* header extra */}
                    <ul className="header-extra">
                      {(
                        <li>
                          <NavLink to="/sign-in" className={`${variant}`}>
                            Sign in
                          </NavLink>
                        </li>
                      )}

                      {variant === "v1" && (
                        <li>
                          <NavLink to="/schedule-demo" className="bg-white-btn">
                            <span className="btn-inner">
                              <span className="btn-normal-text">Schedule Demo</span>
                              <span className="btn-hover-text">Schedule Demo</span>
                            </span>
                          </NavLink>
                        </li>
                      )}

                    </ul>
                  </div>
                </div>
              </nav>
            </div>
          </div>
        </div>
      </HeaderStyleWrapper>

      {/* mobile menu */}
      <MobileMenu />
    </>
  );
};
Header.propTypes = {
  variant: PropTypes.string,
};

export default Header;