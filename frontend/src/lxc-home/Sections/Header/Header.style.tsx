import styled, { css, DefaultTheme } from "styled-components";
// import dropdownIcon from "../../assets/images/icons/dropdown.svg";

// Extend DefaultTheme to include 'colors' and other theme properties
declare module "styled-components" {
  export interface DefaultTheme {
    colors: {
      whiteColor: string;
      blackColor: string;
      textColor: string;
      title: string;
      primary: string;
      iconColor?: string;
    };
    fonts?: {
      dmSans?: string;
    };
  }
}

const v2Styles = css`
  .logo-light {
    display: none;
  }

  .logo-dark {
    display: block;
  }

  .main-menu {
    .submenu {
      li a {
        color: ${({ theme }) => theme.colors.textColor};
        &:hover {
          color: ${({ theme }) => theme.colors.title};
        }
      }
    }
  }
  &.sticky {
    background-color: ${({ theme }) => theme.colors.whiteColor}99;
    box-shadow: 0px 10px 15px ${({ theme }) => theme.colors.blackColor}0d;
    backdrop-filter: blur(10px);
  }
  .main-menu {
    li a {
      color: ${({ theme }) => theme.colors.title};

      &:hover {
        color: ${({ theme }) => theme.colors.textColor};
      }

      &.active {
        color: ${({ theme }) => theme.colors.title};
      }
    }
  }
  .header-extra {
    li a {
      color: ${({ theme }) => theme.colors.title};
      &:hover {
        color: ${({ theme }) => theme.colors.textColor};
      }
    }
  }

  .dropdown-toggle {
    &::after {
      filter: none;
    }
  }

  .submenu {
    background-color: ${({ theme }) => theme.colors.whiteColor};
    box-shadow: 0px 10px 15px ${({ theme }) => theme.colors.blackColor}14;
  }
`;

const HeaderStyleWrapper = styled.header`
  position: absolute;
  z-index: 9999;
  top: 0;
  left: 0;
  width: 100%;
  padding: 15px 0;

  .logo-dark {
    display: none;
  }

  .menu-toggler {
    display: none;
  }

  &.sticky {
    position: fixed;
    background-color: ${({ theme }) => theme.colors.whiteColor}99;
    box-shadow: 0px 10px 15px ${({ theme }) => theme.colors.blackColor}0d;
    backdrop-filter: blur(10px);
    padding: 10px 0px !important;
    top: 0px;
    animation: headerAnimetion 0.3s linear;
    -webkit-animation: headerAnimetion 0.3s linear;

    .logo-light {
      display: none;
    }

    .logo-dark {
      display: block;
    }

    .menu-toggler {
      svg {
        color: ${({ theme }) => theme.colors.blackColor};
      }
    }

    .main-menu {
      li a {
        color: ${({ theme }) => theme.colors.title};
        &:hover {
          color: ${({ theme }) => theme.colors.textColor};
        }
        &.active {
          color: ${({ theme }) => theme.colors.title};
        }
      }
    }

    .header-extra {
      margin: 0;
      padding: 0;
      list-style: none;
      li a {
        color: ${({ theme }) => theme.colors.title};

        &:hover {
          color: ${({ theme }) => theme.colors.textColor};
        }
      }
    }

    .bg-skyblue-btn {
      background: ${({ theme }) => theme.colors.primary};
      color: ${({ theme }) => theme.colors.whiteColor} !important;
      position: relative;
      z-index: 0;
      span {
        color: ${({ theme }) => theme.colors.whiteColor};
      }

      &:hover {
        background: ${({ theme }) => theme.colors.primary};
        span {
          color: ${({ theme }) => theme.colors.whiteColor};
        }

        &::before {
          transform: translateX(0%);
        }
      }

      &::before {
        position: absolute;
        z-index: -1;
        content: "";
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        border-radius: 50px;
        background: ${({ theme }) => theme.colors.blackColor}1a;
        transform: translateX(-100%);
        transition: 0.3s;
      }
    }

    &.sass {
      .bg-white-btn {
        background: #0555ff !important;
        span {
          color: ${({ theme }) => theme.colors.whiteColor};
        }
      }
    }
  }

  &.finance {
    .logo-dark {
      display: none;
    }

    &:not(.sticky) {
      nav {
        background: ${({ theme }) => theme.colors.whiteColor}1a;
        backdrop-filter: blur(2.5px);
        border-radius: 40px;
        height: 80px;
        padding: 10px 15px 15px;
      }
    }

    .main-menu {
      .submenu {
        li a {
          color: ${({ theme }) => theme.colors.textColor};
          &:hover {
            color: ${({ theme }) => theme.colors.title};
          }
        }
      }
    }

    &.sticky {
      background: ${({ theme }) => theme.colors.whiteColor}99;
      box-shadow: 0px 10px 15px ${({ theme }) => theme.colors.blackColor}0d;
      backdrop-filter: blur(10px);

      .logo-light {
        display: none;
      }
      .logo-dark {
        display: block;
      }
      .main-menu {
        li a {
          color: ${({ theme }) => theme.colors.title};
          &:hover {
            color: ${({ theme }) => theme.colors.textColor};
          }
          &.active {
            color: ${({ theme }) => theme.colors.title};
          }
        }
      }
      .header-extra {
        li {
          a {
            color: ${({ theme }) => theme.colors.title};
            &:hover {
              color: ${({ theme }) => theme.colors.textColor};
            }
          }
          .language-dropdown {
            button {
              border: 1px solid ${({ theme }) => theme.colors.blackColor}19;
              color: ${({ theme }) => theme.colors.title};

              &::after {
                opacity: 1;
                filter: brightness(0);
              }

              img {
                filter: brightness(0);
              }
            }
          }
        }
      }
    }
  }

  &.sass {
    .main-menu {
      .submenu {
        li a {
          color: ${({ theme }) => theme.colors.textColor};
          &:hover {
            color: ${({ theme }) => theme.colors.title};
          }
        }
      }
    }
  }

  &.portfolio {
    .logo-light {
      display: none;
    }

    .logo-dark {
      display: block;
    }

    &.sticky {
      background-color: ${({ theme }) => theme.colors.whiteColor};
      box-shadow: 0px 10px 15px ${({ theme }) => theme.colors.blackColor}14;
    }

    .header-navbar-container {
      gap: 0px;
    }

    .main-menu {
      margin: auto;
      li a {
        color: ${({ theme }) => theme.colors.title};
        &:hover,
        &:focus {
          color: ${({ theme }) => theme.colors.textColor};
        }
        &.active {
          color: ${({ theme }) => theme.colors.title};
        }
      }
    }
    .header-extra {
      li a {
        color: ${({ theme }) => theme.colors.title};
        &:hover {
          color: ${({ theme }) => theme.colors.textColor};
        }
      }
    }

    .dropdown-toggle {
      &::after {
        filter: none;
      }
    }

    .submenu {
      background-color: ${({ theme }) => theme.colors.whiteColor};
      box-shadow: 0px 10px 15px ${({ theme }) => theme.colors.blackColor}14;
    }
  }

  &.defi {
    &:not(.sticky) {
      nav {
        background: rgba(46, 46, 53, 0.7);
        backdrop-filter: blur(10px);
        border-radius: 40px;
        height: 80px;
        padding: 10px 15px 15px;
      }
    }

    .main-menu {
      max-width: 450px;
      margin: auto;
      li a {
        color: ${({ theme }) => theme.colors.whiteColor};
        &:hover,
        &:focus {
          color: ${({ theme }) => theme.colors.iconColor};
        }
        &.active {
          color: ${({ theme }) => theme.colors.title};
        }
      }
    }

    .header-extra {
      li a {
        color: ${({ theme }) => theme.colors.whiteColor};
        &:hover {
          color: ${({ theme }) => theme.colors.iconColor};
        }
      }
    }
    &.sticky {
      background: transparent;
      box-shadow: none;
      backdrop-filter: none;
      .defi-header-content {
        background: rgba(46, 46, 53, 0.7);
        -webkit-backdrop-filter: blur(10px);
        backdrop-filter: blur(10px);
        border-radius: 40px;
        height: 80px;
        padding: 10px 15px 15px;
      }
      .main-menu {
        li {
          a {
            color: ${({ theme }) => theme.colors.whiteColor};
          }
        }
        .submenu {
          li {
            a {
              color: ${({ theme }) => theme.colors.title};
            }
          }
        }
      }
    }
  }

  &.crypto,
  &.crypto-token,
  &.defi {
    .logo-light {
      display: block;
    }

    .logo-dark {
      display: none;
    }

    &.sticky {
      background-color: ${({ theme }) => theme.colors.whiteColor}10;
      box-shadow: none;
      border-bottom: 1px solid ${({ theme }) => theme.colors.whiteColor}05;
      backdrop-filter: blur(10px);
    }

    .main-menu {
      gap: 40px;
      margin: 0 auto;
      li {
        a {
          color: ${({ theme }) => theme.colors.whiteColor};
          padding: 15px 0px;
          &::after {
            right: -20px;
          }
          &:hover,
          &:focus {
            color: ${({ theme }) => theme.colors.whiteColor};
            opacity: 0.8;
          }
          &.active {
            color: ${({ theme }) => theme.colors.whiteColor};
          }
        }
        ul {
          li {
            a {
              color: ${({ theme }) => theme.colors.title};
            }
            &:hover {
              a {
                color: ${({ theme }) => theme.colors.title};
              }
            }
          }
        }
      }
    }

    .main-menu .submenu {
      background: #20252b !important;
      li {
        a {
          color: ${({ theme }) => theme.colors.whiteColor} !important;
          &:hover {
            color: ${({ theme }) => theme.colors.whiteColor}90 !important;
          }
        }
      }
    }

    .mega-menu-card {
      background: #20252b;
      .mega-menu-column {
        border-color: ${({ theme }) => theme.colors.whiteColor}1a;
        background: #20252b;
        &:nth-last-child(1) {
          border: none;
          background: #2b3036;
          &::after {
            background: linear-gradient(
              180deg,
              rgba(255, 255, 255, 0) 0%,
              rgba(255, 255, 255, 0.15) 100%
            );
          }
          &::before {
            background: linear-gradient(
              180deg,
              rgba(255, 255, 255, 0.15) 0%,
              rgba(255, 255, 255, 0) 100%
            );
          }
        }
        h5 {
          color: ${({ theme }) => theme.colors.whiteColor};
        }
      }

      .more-demo-card {
        background: #2b3036;
        p {
          color: ${({ theme }) => theme.colors.whiteColor};
        }
        &::after {
          background: linear-gradient(
            180deg,
            rgba(255, 183, 202, 0.2) 0%,
            rgba(255, 255, 255, 0) 100%
          );
        }

        img {
          position: absolute;
          top: 21px;
          right: 20px;
          filter: brightness(0.35);
        }
      }

      &:hover {
        .mega-menu-list {
          li {
            a {
              opacity: 80%;
            }
          }
        }
      }

      .mega-menu-list {
        li {
          padding-right: 0px !important;
          a {
            color: ${({ theme }) => theme.colors.whiteColor} !important;
            &.disable {
              opacity: 100%;
            }
          }
          &.menuTabActive {
            a {
              &:hover {
                color: ${({ theme }) => theme.colors.whiteColor} !important;
              }
            }
          }
        }
      }
    }
  }

  &.header-white {
    background: ${({ theme }) => theme.colors.whiteColor};
  }

  .header-navbar-container {
    padding-left: 0;
    padding-right: 0;
    display: flex;
    align-items: center;
    gap: 60px;
  }

  .header-logo {
    padding: 0 !important;
    margin-right: 0;
    & .dark-logo {
      display: none;
    }
    & .white-logo {
      display: block;
    }
  }

  .header-navbar-content {
    display: flex;
    align-items: center;
    gap: 8px;
    justify-content: space-between;
  }

  &.header-white {
    .main-menu {
      & li a {
        color: ${({ theme }) => theme.colors.title};
      }
    }
    .header-extra {
      & li a {
        color: ${({ theme }) => theme.colors.title};
      }
    }
    .header-logo {
      & .white-logo {
        display: none;
      }
      & .dark-logo {
        display: block;
      }
    }
  }

  .navbar {
    padding: 0px;
  }

  &.corporate-header {
    position: relative;
    &.sticky {
      position: fixed;
    }
  }
  &.corporate {
    .main-menu {
      li {
        a {
          font-size: 15px;
        }
      }
    }
    .header-extra {
      gap: 20px;
      a {
        span {
          font-size: 15px;
          margin-left: 4px;
          min-width: max-content;
        }
      }
    }
  }

  .menu-toggler {
    border: 0;
    svg {
      font-size: 30px;
      color: ${({ theme }) => theme.colors.blackColor};
    }
    &:focus {
      box-shadow: none;
    }
  }

  /*-- main-menu style --*/
  .main-menu {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 20px;
    .megaTablinks,
    .has-submenu {
      padding-right: 15px;
      position: relative;
      &::after {
        content: ">";
        position: absolute;
        top: 16px;
        right: -5px;
        transform: rotate(90deg);
      }
    }
    ul {
      list-style: none;
    }

    li {
      position: relative;
      &:hover {
        .dropdown-toggle {
          &::after {
            transform: rotate(180deg);
          }
        }
        .submenu-box {
          animation: menuAnimetion 0.7s;
          display: block;
          transform: none;
          opacity: 1;
        }
        .submenu {
          width: 250px;
          li {
            a {
              line-height: 333%;
            }
          }
        }
      }
    }

    li a {
      color: ${({ theme }) => theme.colors.whiteColor};
      transition: 0.3s;
      padding: 15px 0px;
      font-weight: 500;
      &:hover,
      &:focus {
        color: ${({ theme }) => theme.colors.whiteColor}b2;
      }

      &.active {
        color: ${({ theme }) => theme.colors.whiteColor};
      }
    }

    .dropdown-toggle {
      &::after {
        vertical-align: 0;
        border: 0;
        content: url("../images/icons/dropdown-toggle.svg");
        transition: 0.3s;
        filter: brightness(0) invert(1);
        display: none;
      }
    }
    .submenu-box {
      position: absolute;
      transform-origin: 50% -30px;
      z-index: 100;
      opacity: 0;
      display: none;
      transform: rotateX(-15deg) translateZ(0px);
      top: 35px;
      left: -40px;
      transition: 0.5s;
      padding: 40px;
    }
    .submenu {
      top: 120%;
      left: 0;
      width: 180px;
      background: ${({ theme }) => theme.colors.whiteColor};
      border: 1px solid ${({ theme }) => theme.colors.blackColor}14;
      box-shadow: 0px 10px 15px ${({ theme }) => theme.colors.blackColor}0d;
      border-radius: 10px;
      padding: 13px 24px;
      li a {
        line-height: 36px;
        padding: 0px !important;
        &:hover {
          color: ${({ theme }) => theme.colors.primary};
        }
      }
    }
  }

  .main-menu .nft-submenu.dark {
    background: #20252b !important;
  }

  /*-- header-extra style --*/
  .header-extra {
    display: flex;
    align-items: center;
    gap: 30px;
    margin: 0;
    padding: 0;
    list-style: none;
    li a {
      color: ${({ theme }) => theme.colors.whiteColor};
      transition: 0.3s;
      &:hover {
        color: ${({ theme }) => theme.colors.whiteColor}b2;
      }
    }
  }
  /*-- header-section end --*/

  /*-- qr code btn start --*/
  .qr-code-btn {
    position: absolute;
    right: 40px;
    &.relative {
      position: inherit;
    }
    .qr-code-btn-inner {
      position: relative;
    }
    .view-qr {
      background: #9fe870;
      border-radius: 50px;
      height: 50px;
      width: 50px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .qr-code-box {
      position: absolute;
      right: 0px;
      transform: translateY(15px);
      width: 330px;
      height: 170px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0px -7.5px;
      background: #101722;
      border-radius: 20px;
      -webkit-transform: translateY(10px);
      transform: translateY(10px);
      -webkit-transition: 0.3s;
      transition: 0.3s;
      opacity: 0;
      visibility: hidden;

      .scan-qr {
        padding: 0px 7.5px;
        width: 50%;
      }
    }

    &:hover {
      .qr-code-box {
        //            display: flex;
        -webkit-transform: translateY(15px);
        transform: translateY(15px);
        opacity: 1;
        visibility: visible;
      }
    }
  }
  /*-- qr code btn end --*/

  @-webkit-keyframes headerAnimetion {
    from {
      top: -100px;
    }
    to {
      top: 0px;
    }
  }

  @keyframes headerAnimetion {
    from {
      top: -100px;
    }
    to {
      top: 0px;
    }
  }

  .nav-item {
    &.home-nav {
      position: inherit !important;
      &:hover {
        .mega-menu {
          animation: menuAnimetion 0.7s;
          display: block;
          transform: none;
          opacity: 1;
        }
      }
      a {
        &.megaTablinks {
          color: auto !important;
        }
      }
    }
  }

  .mega-menu {
    padding-top: 30px;
    background: transparent;
    top: 45px;
    left: 0px;
    width: 100%;
    transition: 0.5s;

    position: absolute;
    transform-origin: 50% -30px;
    z-index: 100;
    opacity: 0;
    display: none;
    transform: rotateX(-15deg) translateZ(0px);
  }

  .mega-menu-card {
    background: ${({ theme }) => theme.colors.whiteColor};
    border: 1px solid ${({ theme }) => theme.colors.blackColor}0d;
    box-shadow: 0px 5px 20px ${({ theme }) => theme.colors.blackColor}11;
    border-radius: 15px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    overflow: hidden;
    width: 100%;
    .mega-menu-column {
      width: 25%;
      border-right: 1px solid ${({ theme }) => theme.colors.blackColor}26;
      padding: 21px 35px 40px 35px;
      min-height: 450px;
      background: ${({ theme }) => theme.colors.whiteColor};
      position: relative;
      &:nth-last-child(2) {
        border: none;
      }
      &:nth-last-child(1) {
        border: none;
        background: #e3e9f7;
        &::after {
          content: "";
          height: 77px;
          width: 77px;
          background: linear-gradient(
            180deg,
            rgba(5, 85, 255, 0) 0%,
            rgba(5, 85, 255, 0.15) 100%
          );
          right: 20px;
          bottom: 70px;
          position: absolute;
          border-radius: 50%;
          z-index: 0;
        }
        &::before {
          content: "";
          height: 137px;
          width: 137px;
          background: linear-gradient(
            180deg,
            rgba(5, 85, 255, 0.15) 0%,
            rgba(5, 85, 255, 0) 100%
          );
          top: 30px;
          left: 20px;
          position: absolute;
          border-radius: 50%;
          z-index: 0;
        }
      }
    }
  }

  .mega-menu-list {
    padding: 0px;
    margin: 0px;
    list-style: none;

    li {
      display: flex;
      align-items: center;
      justify-content: flex-start;
      max-height: 56px;
      padding-right: 0px !important;
      &::after {
        display: none;
      }
      .tag {
        font-weight: 700;
        font-size: 12px;
        line-height: 20px;
        text-transform: uppercase;
        padding: 0px 8px;
        margin-left: 12px;
        border-radius: 10px;

        &.hot {
          background: #fd246a;
          color: ${({ theme }) => theme.colors.whiteColor};
        }

        &.new {
          background: ${({ theme }) => theme.colors.primary};
          color: ${({ theme }) => theme.colors.whiteColor};
        }

        &.trendy {
          background: #9fe870;
          color: ${({ theme }) => theme.colors.title};
        }
      }
      a {
        font-family: ${({ theme }) => theme.fonts.dmSans};
        font-weight: 500;
        font-size: 15px;
        line-height: 50px;
        color: ${({ theme }) => theme.colors.textColor};
        transition: 0.3s;
        &.disable {
          opacity: 70%;
        }

        &.active {
          color: ${({ theme }) => theme.colors.textColor};
        }
      }
      &.menuTabActive {
        a {
          &:hover {
            opacity: 100% !important;
            color: ${({ theme }) => theme.colors.title} !important;
          }
        }
      }
    }
  }

  .mega-menu-img {
    background: #405364;
    overflow: hidden;
    border-radius: 10px;
    position: relative;
    z-index: 1;
    img {
      height: 100%;
      width: 100%;
    }
  }

  .mega-menu-tabcontent {
    position: absolute;
    top: 0px;
    left: 0px;
    height: 100%;
    width: 100%;
    padding: 50px 40px;
  }

  .megaMenutabcontent {
    display: none;
    animation: fadeEffect 0.4s;
  }

  .more-demo-card {
    background: #faeef1;
    border-radius: 10px;
    padding: 17px 20px;
    position: relative;
    margin-top: 25px;
    p {
      color: ${({ theme }) => theme.colors.title};
      position: relative;
      z-index: 1;
      margin-bottom: 0px;
    }
    &::after {
      content: "";
      position: absolute;
      top: 12px;
      left: 8px;
      height: 33px;
      width: 33px;
      border-radius: 50%;
      background: linear-gradient(
        180deg,
        rgba(255, 183, 202, 0.5) 0%,
        rgba(250, 238, 241, 0.5) 100%
      );
      z-index: 0;
    }
    img {
      position: absolute;
      top: 21px;
      right: 20px;
    }
  }

  @keyframes fadeEffect {
    from {
      opacity: 0;
    }

    to {
      opacity: 1;
    }
  }

  @keyframes menuAnimetion {
    from {
      transform-origin: 50% -30px;
      opacity: 0;
      display: none;
      transform: rotateX(-15deg) translateZ(0px);
    }

    to {
      display: block;
      transform: none;
      opacity: 1;
    }
  }

  .submenu-has-submenu {
    position: relative;
    &::after {
      content: ">";
      font-size: 22px;
      position: absolute;
      right: 0px;
      top: 11px;
      transition: 0.3s;
      transform: rotate(0deg);
      color: ${({ theme }) => theme.colors.iconColor};
    }
    .submenu-box2 {
      position: absolute;
      transform-origin: 50% -30px;
      z-index: 100;
      opacity: 0;
      display: none;
      transform: rotateX(-15deg) translateZ(0px);
      top: -20px;
      left: 180px;
      transition: 0.5s;
      padding: 40px;
    }
    .submenu-submenu {
      list-style: none;
      margin: 0px;
      width: 250px;
      background: ${({ theme }) => theme.colors.whiteColor};
      border: 1px solid ${({ theme }) => theme.colors.blackColor}0d;
      box-shadow: 0px 5px 20px ${({ theme }) => theme.colors.blackColor}11;
      border-radius: 15px;
      padding: 13px 24px;
      li {
        line-height: 35px;
      }
    }
    &:hover {
      .submenu-box2 {
        animation: menuAnimetion 0.7s;
        display: block;
        transform: none;
        opacity: 1;
      }
      &::after {
        transform: rotate(90deg);
      }
    }
  }

  .v6-header-content {
    backdrop-filter: none !important;
    .mobile-menu {
      .navbar-toggler {
        img {
          filter: brightness(100);
        }
      }
    }
  }

  .sticky {
    .v6-header-content {
      .mobile-menu {
        .navbar-toggler {
          img {
            filter: brightness(0);
          }
        }
      }
    }
    &.defi {
      .v6-header-content {
        .mobile-menu {
          .navbar-toggler {
            img {
              filter: brightness(100) !important;
            }
          }
        }
      }
    }
  }

  .mobile-menu {
    display: none;
    .navbar-toggler {
      &:focus {
        border: none;
        outline: none;
        box-shadow: none !important;
      }
      svg {
        font-size: 26px;
      }
    }
    .btn-close {
      background-image: none;
      opacity: 1;
    }
    .offcanvas {
      transition: transform 0.6s ease-in-out;
    }

    .js-go-light {
      display: none;
      filter: brightness(0.7);
    }
    .connect-btn {
      margin-left: 20px;
      margin-right: 20px;
      img {
        filter: brightness(0.7);
        margin-right: 8px;
      }
    }
    .light-logo {
      display: none;
    }
    .dark-logo {
      display: block;
    }
  }

  .mobile-menu-body {
    background: ${({ theme }) => theme.colors.whiteColor};
    height: 100vh;
    width: 400px !important;
    padding: 10px 30px;
    .offcanvas-header {
      .btn-close {
        background: none;
        margin-right: 10px;
        margin-bottom: 10px;
        opacity: 1;
        svg {
          color: ${({ theme }) => theme.colors.blackColor};
          font-size: 32px;
        }
      }
    }
    .navbar-nav {
      text-align: center;
      padding-right: 0px !important;
    }
    .mobile-menu-logo {
      min-width: 150px;
    }
    .offcanvas-body {
      overflow-x: hidden;
      padding-top: 20px;
    }
    .mobile-navbar-menu {
      .nav-menu {
        width: 100% !important;
        li {
          .hash-has-sub {
            span {
              top: -10px !important;
            }
            a {
              border: none !important;
            }
          }
        }
      }
    }
  }

  body.dark-scheme,
  html.dark-scheme body,
  .dark {
    .navbar-toggler {
      img {
        filter: brightness(100);
      }
    }
    .mobile-menu-body {
      background: #181d22;
    }
    .light-logo {
      display: block;
    }
    .dark-logo {
      display: none;
    }
    .mobile-navbar-menu {
      .nav-menu li {
        a {
          color: ${({ theme }) => theme.colors.whiteColor};
          border-bottom: 1px solid ${({ theme }) => theme.colors.whiteColor}1a;
        }
        .hash-has-sub {
          a {
            border: none !important;
          }
        }
      }
      a {
        color: ${({ theme }) => theme.colors.whiteColor};
      }
      .connect-btn {
        color: ${({ theme }) => theme.colors.whiteColor};
        img {
          filter: brightness(100);
        }
      }
      .js-go-light {
        filter: brightness(100);
      }
      .sign-in-btn {
        span {
          color: ${({ theme }) => theme.colors.whiteColor};
        }
      }
    }
  }

  @media only screen and (max-width: 991px) {
    .mobile-menu {
      display: block;
    }

    .menu-toggler {
      display: block;
    }
  }

  @media only screen and (max-width: 480px) {
    .mobile-menu-body {
      padding: 10px 15px;
      width: 100% !important;
    }
    .mobile-navbar-menu .nav-buttons {
      padding-right: 0px !important;
      padding-left: 0px !important;
    }
  }

  .header-top {
    background: url(../images/bg/top-header-bg.png);
    background-position: center center;
    background-repeat: no-repeat;
    background-size: cover;
    position: relative;
    top: 0px;
    left: 0px;
    width: 100%;
    z-index: 111;
    .header-top-content {
      display: flex;
      align-items: center;
      justify-content: space-between;
      min-height: 35px;
      .header-top-timer {
        ul {
          margin: 0;
          padding: 0;
          list-style: none;
          display: flex;
          align-items: center;
          justify-content: space-between;
          max-width: 228px;
          width: 100%;
          gap: 30px;
          li {
            color: ${({ theme }) => theme.colors.whiteColor};
            span {
              margin-left: 4px;
            }
          }
        }
      }
      .header-top-right {
        display: flex;
        align-items: center;
        justify-content: flex-end;
        gap: 15px;
      }
      p {
        margin-bottom: 0;
        color: ${({ theme }) => theme.colors.whiteColor};
      }
    }
  }

  .nav-expanded .LearnXChain-home3-canva {
    margin-top: 90px;
  }

  /* responsive style start  */

  @media screen and (max-width: 1850px) {
  }
  @media screen and (max-width: 1699px) {
  }
  @media screen and (max-width: 1600px) {
  }
  @media screen and (max-width: 1499px) {
  }
  @media screen and (max-width: 1399px) {
    .header-extra {
      gap: 20px;
    }
  }
  @media screen and (max-width: 1280px) {
  }

  @media screen and (max-width: 1199px) {
    .hero-section-3-header {
      .shape-img {
        &.img-1 {
          left: 0;
        }

        &.img-2 {
          right: 0;
        }
      }
    }
    &.finance {
      .header-navbar-container {
        gap: 30px;
        .main-menu {
          gap: 15px;
        }
      }
      .header-extra {
        gap: 14px;
      }
    }
    .header-extra {
      li {
        &.header-phn-number {
          display: none;
        }
        a {
          &.bg-olive-btn {
            width: 115px;
          }
        }
      }
    }
  }

  @media screen and (min-width: 991px) and (max-width: 1200px) {
    .header-extra {
      gap: 25px;
      .btn-light-green {
        width: 130px;
      }
    }
    .header-section {
      .main-menu {
        li {
          a {
            font-size: 13px;
          }
        }
      }
      .header-extra {
        li {
          a {
            font-size: 13px;

            img {
              max-width: 18px;
            }
          }
        }
      }
    }
    .main-menu {
      gap: 25px;
    }

    .mega-menu-card {
      .mega-menu-column {
        padding: 20px;
      }
    }
    .mega-menu-list {
      li {
        a {
          font-size: 14px;
        }
        .tag {
          font-size: 11px;
          margin-left: 7px;
        }
      }
    }
    .corporate-header {
      .main-menu {
        gap: 10px;
      }
      .header-extra {
        gap: 18px;
      }
      &.header-section {
        .header-navbar-container {
          gap: 30px;
          padding: 0px 10px !important;
        }
        .header-navbar-content {
          gap: 20px;
        }
      }
    }
    .language-dropdown {
      button {
        font-size: 13px;
        width: 90px;
        height: 44px;
      }
    }
  }

  @media screen and (max-width: 991px) {
    .header-navbar-content {
      position: fixed;
      top: 0;
      left: 0;
      width: 320px;
      height: 100%;
      background-color: black;
      padding: 30px;
      flex-direction: column;
      align-items: flex-start !important;
      justify-content: flex-start !important;
      transition: 0.3s;
      transform: translateX(-155%);
      height: 100vh;

      &.show {
        transform: translateX(0%);
      }
    }

    .main-menu {
      flex-direction: column;
      align-items: flex-start;

      li {
        position: relative;
        a {
          padding: 0px;
        }
        &:hover {
          .dropdown-toggle {
            &::after {
              transform: rotate(0deg);
            }
          }

          .submenu {
            transform: translateY(10px);
          }
        }
      }

      .submenu {
        display: none;
        position: unset;
        top: 100%;
        left: 0;
        width: 100%;
        background-color: transparent;
        border: none;
        box-shadow: none;
        border-top: 0;
        padding: 5px 0;
        transform: translateY(10px);
        transition: 0.3s;
        opacity: 1;
        visibility: visible;

        li a {
          padding: 10px 15px;
        }

        &.show {
          display: block;
        }
      }
    }

    .header-extra {
      margin-top: 30px;
      // flex-direction: column;
      // align-items: flex-start;
    }

    &:not(.v6) {
      background: ${({ theme }) => theme.colors.whiteColor};
      padding: 15px 0px;
    }

    .logo-light {
      display: none;
    }

    .logo-dark {
      display: block !important;
    }

    &.crypto,
    &.crypto-token,
    &.defi {
      background: transparent;

      .logo-light {
        display: none;
      }

      .menu-toggler {
        img {
          filter: brightness(100);
        }
      }
    }

    &.finance {
      padding: 0;
    }

    &.mobile-menu-opened {
      &.crypto,
      &.crypto-token,
      &.defi {
        .menu-toggler {
          img {
            filter: brightness(0);
          }
        }
      }
    }

    &.v2 {
      .header-navbar-content {
        background-color: white;
        box-shadow: 0px 10px 15px ${({ theme }) => theme.colors.blackColor}14;
      }

      .dropdown-toggle {
        &::after {
          filter: none;
        }
      }

      .submenu {
        background-color: transparent;
        box-shadow: none;
      }
    }

    .qr-code-btn {
      .view-qr {
        height: 40px;
        width: 40px;
        padding: 11px;
      }
    }
    .nav-expanded .header-3-canva {
      margin-top: 85px;
    }
    .nav-expanded .header-section.v6 {
      padding: 0;
    }
    .header-section.v6.sticky .v6-header-content {
      box-shadow: none;
    }
    .nav-expanded .header-section.v6 .v6-header-content,
    .header-section.v6.sticky .v6-header-content {
      border-radius: 0;
    }
    .header-section.v6.sticky .col-md-12,
    .nav-expanded .header-section.v6 .col-md-12 {
      padding: 0 !important;
    }
    .nav-expanded {
      .header-section.defi .defi-header-content {
        background: transparent;
      }
    }

    .mobile-navbar-menu span.submenu-button::before {
      right: 26px;
    }
    .mobile-navbar-menu span.submenu-button::after {
      right: 21px;
    }

    .mobile-navbar-menu .sub-menu li {
      &:last-child {
        a {
          padding-bottom: 18px;
        }
      }
    }
    body:not(.nav-expanded) .header-section.v6:not(.sticky) {
      .logo-light {
        display: block;
      }
      .logo-dark {
        display: none !important;
      }
      .nav-expander {
        img {
          filter: brightness(0) invert(1);
        }
      }
    }

    .header-section.v6.sticky {
      box-shadow: 0px 10px 15px ${({ theme }) => theme.colors.blackColor}0d;
    }
    body:not(.nav-expanded) .header-section.v6:not(.sticky) {
      .logo-light {
        display: block;
      }
      .logo-dark {
        display: none !important;
      }
      .nav-expander {
        img {
          filter: brightness(0) invert(1);
        }
      }
    }
    .header-section.v6 {
      .v6-header-content {
        height: auto;
      }
      &.sticky {
        background: ${({ theme }) => theme.colors.whiteColor};
        padding: 0;
        .header-section.v6.v6-header-content {
          box-shadow: none;
        }
      }
    }

    .nav-expanded .header-3-canva {
      margin-top: 85px;
    }
    .nav-expanded .header-section.v6 {
      padding: 0;
    }
    .header-section.v6.sticky .v6-header-content {
      box-shadow: none;
    }
    .nav-expanded .header-section.v6 .v6-header-content,
    .header-section.v6.sticky .v6-header-content {
      border-radius: 0;
    }
    .compare-plans-table-section .compare-plans-table .table-body {
      overflow-y: auto;
    }
    .breadcrumb-sec .breadcrumb-title {
      font-size: 40px;
    }
    .header-section.v6.sticky .col-md-12,
    .nav-expanded .header-section.v6 .col-md-12 {
      padding: 0 !important;
    }
    .nav-expanded {
      .header-section.defi .defi-header-content {
        background: transparent;
      }
    }

    .header-section.v1 {
      .main-menu {
        .submenu {
          li {
            a {
              color: ${({ theme }) => theme.colors.whiteColor}b2;
            }
          }
        }
      }
      &.sticky {
        .main-menu {
          li {
            a {
              color: ${({ theme }) => theme.colors.whiteColor}b2;
            }
          }
        }
        .header-extra {
          li {
            a {
              color: ${({ theme }) => theme.colors.whiteColor};
            }
          }
        }
      }
    }

    .header-section {
      &.crypto-header {
        background: transparent;
      }
    }
    .download-wallet-btns {
      a {
        padding: 7px 12px;
        max-width: 170px;
      }
    }

    .header-section {
      &.v6.defi {
        &.sticky {
          background: ${({ theme }) => theme.colors.whiteColor}1a;
          backdrop-filter: blur(2.5px);
          & .v6-header-content {
            background: transparent;
            padding: 18px 15px 15px;
            backdrop-filter: none;
          }
        }
        .nav-expander img:nth-child(1) {
          filter: brightness(100);
        }
      }
    }
  }

  @media screen and (max-width: 767px) {
    .mobile-navbar-menu .nav-menu,
    .mobile-navbar-menu .nav-buttons {
      width: 540px;
    }
    .header-top .header-top-content .header-top-timer,
    .header-top .header-top-content .header-top-left {
      display: none;
    }
    .header-top .header-top-content .header-top-right {
      padding-top: 5px;
    }
    .header-top {
      .header-top-content {
        flex-direction: column;
      }
    }
  }
  @media screen and (max-width: 575px) {
  }
  @media screen and (max-width: 480px) {
  }
  @media screen and (max-width: 425px) {
  }
  @media screen and (max-width: 374px) {
  }
  @media screen and (min-width: 768px) {
  }

  /* variant style start */
  ${({ variant }) =>
    variant === "v1" &&
    css`
      .logo-dark {
        display: none;
      }
      .main-menu {
        .submenu {
          li a {
            color: ${({ theme }) => theme.colors.textColor};
            &:hover {
              color: ${({ theme }) => theme.colors.title};
            }
          }
        }
      }
      &.sticky {
        background-color: ${({ theme }) => theme.colors.whiteColor}99;
        box-shadow: 0px 10px 15px ${({ theme }) => theme.colors.blackColor}0d;
        backdrop-filter: blur(10px);

        .menu-toggler {
          svg {
            color: ${({ theme }) => theme.colors.blackColor};
          }
        }

        .header-extra {
          margin: 0;
          padding: 0;
          list-style: none;
          li a {
            color: ${({ theme }) => theme.colors.title};

            &:hover {
              color: ${({ theme }) => theme.colors.textColor};
            }
          }
        }
        .main-menu {
          li a {
            color: ${({ theme }) => theme.colors.title};
            &:hover {
              color: ${({ theme }) => theme.colors.textColor};
            }
          }
        }

        .dropdown-toggle {
          &::after {
            filter: none;
          }
        }
        .bg-white-btn {
          background: ${({ theme }) => theme.colors.primary};
          color: ${({ theme }) => theme.colors.whiteColor} !important;
          position: relative;
          z-index: 0;
          span {
            color: ${({ theme }) => theme.colors.whiteColor};
          }
        }
        .logo-light {
          display: none;
        }
        .logo-dark {
          display: block;
        }
      }
    `}

  ${({ variant }) =>
    variant === "v2" &&
    css`
      ${v2Styles}
    `} 

    ${({ variant }) =>
    variant === "app" &&
    css`
      ${v2Styles}
    `} 

  ${({ variant }) =>
    variant === "v3" &&
    css`
      padding-top: 20px;

      ${v2Styles}
    `} 
    
  ${({ variant }) =>
    variant === "v4" &&
    css`
      ${v2Styles}

      .header-extra {
        li a {
          color: ${({ theme }) => theme.colors.whiteColor};
          &:hover {
            color: ${({ theme }) => theme.colors.whiteColor};
          }
        }
      }
      &.sticky {
        .header-extra {
          li a {
            color: ${({ theme }) => theme.colors.title};
            &:hover {
              color: ${({ theme }) => theme.colors.textColor};
            }
          }
        }
        .talk-btn {
          background-color: ${({ theme }) => theme.colors.primary};
          &:hover,
          &:focus {
            color: ${({ theme }) => theme.colors.whiteColor} !important;
            span {
              color: ${({ theme }) => theme.colors.whiteColor};
            }
          }
        }
      }
    `} 

  ${({ variant }) =>
    variant === "v5" &&
    css`
      top: 35px;
      padding: 15px 0px;

      ${v2Styles}

      .main-menu {
        margin: 0 auto;
      }
    `} 
  
  ${({ variant }) =>
    variant === "main-header" &&
    css`
      ${v2Styles}

      position: absolute;
      background: ${({ theme }) => theme.colors.whiteColor};
      border: 1px solid ${({ theme }) => theme.colors.blackColor}26;
    `} 

    ${({ variant }) =>
    variant === "chatbot" &&
    css`
      ${v2Styles}

      background: ${({ theme }) => theme.colors.whiteColor};
    `}
    

    ${({ variant }) =>
    variant === "corporate" &&
    css`
      ${v2Styles}

      background: ${({ theme }) => theme.colors.whiteColor};
    `}
    
    ${({ variant }) =>
    variant === "account" &&
    css`
      ${v2Styles}

      background: ${({ theme }) => theme.colors.whiteColor};
    `}
    
    ${({ variant }) =>
    variant === "newsletter" &&
    css`
      ${v2Styles}

      background: ${({ theme }) => theme.colors.whiteColor};
    `}

    ${({ variant }) =>
    variant === "crypto2" &&
    css`
      ${v2Styles}
    `} /* variant style end */
`;

export default HeaderStyleWrapper;
